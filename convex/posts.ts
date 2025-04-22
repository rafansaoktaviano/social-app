import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";
import { getUserPushToken } from "./notifications";
import { api } from "./_generated/api";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) throw new Error("Unauthorized");

  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const imageUrl = await ctx.storage.getUrl(args.storageId);

    if (!imageUrl) throw new Error("image not found");

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getPosts = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUser = await getAuthenticatedUser(ctx);

    if (!identity) throw new Error("Unauthorized");

    const getPosts = await ctx.db.query("posts").collect();
    const getUsers = await ctx.db.query("users").collect();
    const getLikes = await ctx.db.query("likes").collect();
    const getBookmarks = await ctx.db.query("bookmarks").collect();

    const postsWithUsers = getPosts.map((post) => ({
      ...post,
      user: getUsers.find((user) => user._id === post.userId) || null,
    }));

    const postsWithLikes = postsWithUsers.map((post) => ({
      ...post,
      isLike: getLikes.some(
        (like) => like.userId === currentUser._id && like.postId === post._id
      ),
    }));
    const postsWithBookmark = await Promise.all(
      postsWithLikes.map(async (post) => {
        const commentCount = (
          await ctx.db
            .query("comments")
            .withIndex("by_post", (q) => q.eq("postId", post?._id))
            .collect()
        ).length;

        return {
          ...post,
          isBookmark: getBookmarks.some(
            (bookmark) =>
              bookmark.userId === currentUser._id &&
              bookmark.postId === post._id
          ),
          commentCount,
        };
      })
    );

    return postsWithBookmark.reverse();
  },
});

export const likePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const findIsLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db
      .query("posts")
      .withIndex("by_id", (q) => q.eq("_id", args.postId))
      .first();

    let updatedLikes = post?.likes || 0;

    if (findIsLike) {
      await ctx.db.delete(findIsLike._id);
      updatedLikes = Math.max(0, updatedLikes - 1);

      const notifications = await ctx.db
        .query("notifications")
        .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
        .first();

      if (notifications) {
        await ctx.db.delete(notifications._id);
      }
    } else {
      const like = await ctx.db.insert("likes", {
        postId: args.postId,
        userId: currentUser._id,
      });

      updatedLikes += 1;

      if (post && post.userId !== currentUser._id) {
        await ctx.db.insert("notifications", {
          postId: args.postId,
          type: "like",
          receiverId: post?.userId,
          senderId: currentUser._id,
        });

        const notificationMessage = {
          to: await getUserPushToken(ctx, post.userId),
          sound: "default",
          title: currentUser.username || "Notifications",
          body: `${currentUser.username || "Someone"} liked your post`,
          data: {
            id: post._id,
            type: "like",
          },
        };

        console.log("push notification start!");

        await ctx.scheduler.runAfter(
          0,
          api.notifications.sendPushNotifications,
          {
            userId: post.userId,
            username: currentUser.username,
            notificationMessage: notificationMessage,
          }
        );

        console.log("push notification success!");
      }
    }
    await ctx.db.patch(args.postId, { likes: updatedLikes });

    return findIsLike;
  },
});

export const toggleBookmarkPost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const findIsBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    if (findIsBookmark) {
      await ctx.db.delete(findIsBookmark._id);
    } else {
      await ctx.db.insert("bookmarks", {
        postId: args.postId,
        userId: currentUser._id,
      });
    }

    return findIsBookmark;
  },
});

export const getCommentsByPost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser) {
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .order("desc")
        .collect();

      const commentWithUser = await Promise.all(
        comments.map(async (comment) => ({
          ...comment,
          user: await ctx.db
            .query("users")
            .withIndex("by_id", (q) => q.eq("_id", comment.userId))
            .first(),
        }))
      );

      return commentWithUser;
    }
  },
});

export const addCommentOnPost = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser) {
      const commentId = await ctx.db.insert("comments", {
        content: args.content,
        userId: currentUser._id,
        postId: args.postId,
      });

      const post = await ctx.db
        .query("posts")
        .withIndex("by_id", (q) => q.eq("_id", args.postId))
        .first();

      if (post && post.userId != currentUser._id) {
        await ctx.db.insert("notifications", {
          postId: args.postId,
          type: "comment",
          receiverId: post?.userId,
          senderId: currentUser._id,
          commentId: commentId,
        });

        const notificationMessage = {
          to: await getUserPushToken(ctx, post.userId),
          sound: "default",
          title:
            `${currentUser.username} commented on your post` || "Notifications",
          body: `${args.content}`,
          data: {
            id: post._id,
            type: "comment",
          },
        };

        console.log("push notification start!");

        await ctx.scheduler.runAfter(
          0,
          api.notifications.sendPushNotifications,
          {
            userId: post.userId,
            username: currentUser.username,
            notificationMessage: notificationMessage,
          }
        );

        console.log("push notification success!");
      }

      return {
        message: "Added comment",
        status: 200,
      };
    }
  },
});

export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const commentsData = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    if (currentUser) {
      const post = await ctx.db
        .query("posts")
        .withIndex("by_id", (q) => q.eq("_id", args.postId))
        .first();
      if (post) {
        const postData = {
          ...post,
          user: await ctx.db
            .query("users")
            .withIndex("by_id", (q) => q.eq("_id", post?.userId))
            .first(),
          comments: commentsData,
          commentsCount: commentsData.length,
          isLike: !!(await ctx.db
            .query("likes")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", currentUser._id).eq("postId", post._id)
            )
            .first()),
          isBookmark: !!(await ctx.db
            .query("bookmarks")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", currentUser._id).eq("postId", post._id)
            )
            .first()),
        };
        return postData;
      }

      return post;
    }
  },
});
