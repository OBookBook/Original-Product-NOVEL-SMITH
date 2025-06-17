import { router } from "./trpc";
import { authRouter } from "@/trpc/server/routers/auth";
import { userRouter } from "@/trpc/server/routers/user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
