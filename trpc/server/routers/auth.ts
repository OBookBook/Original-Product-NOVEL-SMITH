import { publicProcedure, router } from "@/trpc/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { email, name, password } = input;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "既に登録されているメールアドレスです。",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.create({
          data: {
            email,
            hashedPassword,
            name,
          },
        });
      } catch (error) {
        console.log(error);

        const error_ =
          error instanceof TRPCError && error.code === "BAD_REQUEST"
            ? new TRPCError({
                code: "BAD_REQUEST",
                message: error.message,
              })
            : new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "エラーが発生しました",
              });

        throw error_;
      }
    }),
});
