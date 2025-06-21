import { router } from "./trpc";
import { authRouter } from "@/trpc/server/routers/auth";
import { userRouter } from "@/trpc/server/routers/user";
import { storyRouter } from "@/trpc/server/routers/story";

export const appRouter = router({
  auth: authRouter,
  story: storyRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
