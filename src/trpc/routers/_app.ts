import { createTRPCRouter } from "../init";
import { postRouter } from "./post";
import { aiRouter } from "./ai";
import { statsRouter } from "./stats";

export const appRouter = createTRPCRouter({
  post: postRouter,
  ai: aiRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
