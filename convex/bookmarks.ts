import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getBookmarks = query({
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (!currentUser) throw new Error("Unauthorized");

    const getBookmarksData = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .collect();

    const getData = Promise.all(
      getBookmarksData.map(async (value) => {
        const postData = await ctx.db.get(value.postId);
        const userData = await ctx.db.get(value.userId);

        return {
          ...value,
          post: postData,
          user: userData,
        };
      })
    );

    return getData;
  },
});
