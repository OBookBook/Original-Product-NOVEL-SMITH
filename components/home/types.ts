import { type AppRouter } from "@/trpc/server";
import { type inferRouterOutputs } from "@trpc/server";

export type BookWithPages =
  inferRouterOutputs<AppRouter>["story"]["getUserBooks"][number];
