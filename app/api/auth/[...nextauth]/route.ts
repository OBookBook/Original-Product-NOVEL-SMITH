import NextAuth from "next-auth";
import { authOptions } from "@/lib/nextauth";

const handler = NextAuth(authOptions) as {
  GET: (request: Request) => Promise<Response>;
  POST: (request: Request) => Promise<Response>;
};

export { handler as GET, handler as POST };
