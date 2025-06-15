import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type NextAuthOptions,
  type Session,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./prisma";

async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user?.hashedPassword) throw new Error("ユーザーが存在しません");

  return user;
}

function validateCredentials(credentials: Record<string, unknown> | undefined) {
  if (!credentials?.email || !credentials?.password)
    throw new Error("メールアドレスとパスワードが存在しません");

  return {
    email: credentials.email as string,
    password: credentials.password as string,
  };
}

async function validateSessionAndUser(session: Session | undefined) {
  if (!session?.user?.email) return;

  await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email,
    },
  });

  return session;
}

async function verifyPassword(password: string, hashedPassword: string) {
  const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
  if (!isCorrectPassword) throw new Error("パスワードが一致しません");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = validateCredentials(credentials);
        const user = await findUserByEmail(email);
        await verifyPassword(password, user.hashedPassword!);

        return user;
      },
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      name: "credentials",
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);

  return await validateSessionAndUser(session ?? undefined);
};
