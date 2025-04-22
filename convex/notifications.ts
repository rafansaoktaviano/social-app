import { v } from "convex/values";
import {
  mutation,
  query,
  MutationCtx,
  QueryCtx,
  action,
} from "./_generated/server";
import { getAuthenticatedUser } from "./users";
import { Id } from "./_generated/dataModel";

export const getUserPushToken = async (
  ctx: MutationCtx | QueryCtx,
  id: Id<"users">
) => {
  const pushToken = await ctx.db
    .query("push_tokens")
    .withIndex("by_user_id", (q) => q.eq("userId", id))
    .first();

  return pushToken?.token || null;
};

export const sendPushNotifications = action(async (ctx, args) => {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args.notificationMessage),
  });
  const responseData = await response.json();
  console.log("Response Data: ", responseData);
});

export const getNotifications = query({
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser) {
      const getNotifications = await ctx.db
        .query("notifications")
        .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
        .collect();
      console.log(getNotifications);

      const getDataNotifications = await Promise.all(
        getNotifications.map(async (value) => {
          const postId = value?.postId;
          const commentId = value?.commentId;

          const post =
            postId &&
            (await ctx.db
              .query("posts")
              .withIndex("by_id", (q) => q.eq("_id", postId))
              .first());

          const comment =
            commentId &&
            (await ctx.db
              .query("comments")
              .withIndex("by_id", (q) => q.eq("_id", commentId))
              .first());

          const sender = await ctx.db
            .query("users")
            .withIndex("by_id", (q) => q.eq("_id", value.senderId))
            .first();

          const receiver = await ctx.db
            .query("users")
            .withIndex("by_id", (q) => q.eq("_id", value.receiverId))
            .first();

          return {
            ...value,
            post: post || null,
            comment: comment || null,
            sender: sender || null,
            receiver: receiver || null,
          };
        })
      );
      console.log(getDataNotifications);

      return getDataNotifications.reverse();
    }
  },
});
