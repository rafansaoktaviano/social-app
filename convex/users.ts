import { api } from "./_generated/api";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserPushToken } from "./notifications";

// Create a new task with the given text
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) throw new Error("User not found");

  return currentUser;
};

export const getUserData = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser) {
      const getData = await (async () => {
        return {
          ...currentUser,
          posts: await ctx.db
            .query("posts")
            .withIndex("by_user", (q) => q.eq("userId", currentUser._id)).order("desc")
            .collect(),
          followingCount: await ctx.db
            .query("follows")
            .withIndex("by_follower", (q) =>
              q.eq("followerId", currentUser._id)
            )
            .collect(),
          followerCount: await ctx.db
            .query("follows")
            .withIndex("by_following", (q) =>
              q.eq("followingId", currentUser._id)
            )
            .collect(),
        };
      })();

      return getData;
    }
  },
});

export const updateUsernameAndBio = mutation({
  args: {
    username: v.string(),
    bio: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser) {
      await ctx.db.patch(currentUser._id, {
        username: args.username,
        bio: args.bio,
      });

      return "success!";
    }
  },
});

export const getUserDataById = query({
  args: {
    _id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // if (currentUser) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", args._id))
      .first();

    const getData = await (async () => {
      const isFollowYou = await ctx.db
        .query("follows")
        .withIndex("by_both", (q) =>
          q.eq("followerId", args._id).eq("followingId", currentUser._id)
        )
        .first();

      const isFollow = await ctx.db
        .query("follows")
        .withIndex("by_both", (q) =>
          q.eq("followerId", currentUser._id).eq("followingId", args._id)
        )
        .first();

      return {
        ...user,
        posts: await ctx.db
          .query("posts")
          .withIndex("by_user", (q) => q.eq("userId", args._id))
          .collect(),
        status: {
          isFollowByYou: !!isFollow,
          isFollowYou: !!isFollowYou,
        },
        isYou: currentUser._id === args._id,
        followingCount: await ctx.db
          .query("follows")
          .withIndex("by_follower", (q) => q.eq("followerId", args._id))
          .collect(),
        followerCount: await ctx.db
          .query("follows")
          .withIndex("by_following", (q) => q.eq("followingId", args._id))
          .collect(),
      };
    })();

    return getData;
    // }
  },
});

export const saveToken = mutation({
  args: {
    token: v.string(),
    deviceName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    console.log("save token!");

    if (currentUser) {
      const isExist = await ctx.db
        .query("push_tokens")
        .withIndex("by_token", (q) => q.eq("token", args.token))
        .first();

      if (isExist) {
        await ctx.db.delete(isExist._id);
      }

      await ctx.db.insert("push_tokens", {
        deviceName: args.deviceName,
        token: args.token,
        userId: currentUser._id,
      });

      console.log("token saved!");

      return "Saved token success!";
    }
  },
});

export const handleFollow = mutation({
  args: { following: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser) {
      const follow = await ctx.db
        .query("follows")
        .withIndex("by_both", (q) =>
          q.eq("followerId", currentUser._id).eq("followingId", args.following)
        )
        .first();

      if (follow) {
        await ctx.db.delete(follow._id);
      } else {
        const response = await ctx.db.insert("follows", {
          followerId: currentUser._id,
          followingId: args.following,
        });

        await ctx.db.insert("notifications", {
          type: "follow",
          receiverId: args.following,
          senderId: currentUser._id,
        });

        const notificationMessage = {
          to: await getUserPushToken(ctx, args.following),
          sound: "default",
          title: currentUser.username || "Notifications",
          body: `${currentUser.username || "Someone"} followed you`,
          data: {
            id: currentUser._id,
            type: "follow",
          },
        };

        console.log("push notification start!");

        await ctx.scheduler.runAfter(
          0,
          api.notifications.sendPushNotifications,
          {
            userId: args.following,
            username: currentUser.username,
            notificationMessage: notificationMessage,
          }
        );

        console.log("push notification success!");
      }
    }

    return "success!";
  },
});
