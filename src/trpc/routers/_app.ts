import { createTRPCRouter } from "../init";
import { postRouter } from "./post";
import { aiRouter } from "./ai";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  post: postRouter,
  ai: aiRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
