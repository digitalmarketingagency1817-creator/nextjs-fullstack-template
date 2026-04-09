import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "../init";

// Showcases: protectedProcedure with query + mutation, zod validation, Prisma update

export const userRouter = createTRPCRouter({
  // Fetch current user's profile — used with prefetch + HydrateClient in settings page
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUniqueOrThrow({
      where: { id: ctx.userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    });
  }),

  // Update display name — showcases protectedProcedure mutation with validation
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters").max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.userId },
        data: { name: input.name },
        select: { id: true, name: true, email: true, image: true },
      });
    }),
});
