import { createTRPCRouter, protectedProcedure } from "../init";

export const statsRouter = createTRPCRouter({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const [totalPosts, recentPosts, totalUsers] = await Promise.all([
      // Total posts by this user
      ctx.db.post.count({ where: { authorId: userId } }),

      // Posts in the last 7 days
      ctx.db.post.count({
        where: {
          authorId: userId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),

      // Total registered users (community stat)
      ctx.db.user.count(),
    ]);

    // Calculate a simple activity streak (days with at least one post in last 7 days)
    const dailyActivity = await ctx.db.post.groupBy({
      by: ["createdAt"],
      where: {
        authorId: userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      _count: true,
    });

    const activeDays = new Set(dailyActivity.map((d) => d.createdAt.toISOString().slice(0, 10)))
      .size;

    return {
      totalPosts,
      recentPosts,
      totalUsers,
      activeDaysThisWeek: activeDays,
    };
  }),
});
