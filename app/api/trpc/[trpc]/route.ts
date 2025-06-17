import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/server";

const handler = (req: Request) =>
  fetchRequestHandler({
    createContext: () => ({}),
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  });

export { handler as GET, handler as POST };
