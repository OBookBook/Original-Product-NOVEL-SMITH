import { privateProcedure, publicProcedure, router } from "@/trpc/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { sendForgotPassword } from "@/actions/sendForgotPassword";
import { sendResetPassword } from "@/actions/sendResetPassword";

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export const authRouter = router({
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { email } = input;
        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: email,
              mode: "insensitive",
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが存在しません",
          });
        }

        const existingToken = await prisma.passwordResetToken.findFirst({
          where: {
            createdAt: {
              gt: new Date(Date.now() - ONE_HOUR),
            },
            expiry: {
              gt: new Date(),
            },
            userId: user.id,
          },
        });

        if (existingToken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "既にパスワード再設定用のメールを送りました。1時間後に再度お試しください。",
          });
        }

        const token = crypto.randomBytes(18).toString("hex");
        await prisma.passwordResetToken.create({
          data: {
            expiry: new Date(Date.now() + ONE_DAY),
            token,
            userId: user.id,
          },
        });

        await sendForgotPassword({
          userId: user.id,
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
  getResetTokenValidity: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { token } = input;
        const foundToken = await prisma.passwordResetToken.findFirst({
          select: {
            expiry: true,
            id: true,
          },
          where: {
            token,
          },
        });

        return !!foundToken && foundToken.expiry > new Date();
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "エラーが発生しました",
        });
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string(),
        token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { password, token } = input;
        const foundToken = await prisma.passwordResetToken.findFirst({
          include: {
            user: true,
          },
          where: {
            token,
          },
        });

        if (!foundToken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "無効なトークンです。再度パスワード再設定を行ってください。",
          });
        }

        const now = new Date();
        if (now > foundToken.expiry) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "トークンの期限が切れています。再度パスワード再設定を行ってください",
          });
        }

        const isSamePassword = await bcrypt.compare(
          password,
          foundToken.user.hashedPassword ?? "",
        );

        if (isSamePassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "現在のパスワードと同じパスワードは使用できません",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.$transaction([
          prisma.user.update({
            data: {
              hashedPassword,
            },
            where: {
              id: foundToken.userId,
            },
          }),
          prisma.passwordResetToken.deleteMany({
            where: {
              id: foundToken.userId,
            },
          }),
        ]);

        await sendResetPassword({ userId: foundToken.userId });
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

  updatePassword: privateProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { currentPassword, password } = input;
        const userId = ctx.user.id;

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが存在しません",
          });
        }

        if (!user.hashedPassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "パスワードが設定されていません",
          });
        }

        const isCurrentPasswordValid = await bcrypt.compare(
          currentPassword,
          user.hashedPassword,
        );

        if (!isCurrentPasswordValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "現在のパスワードが間違っています",
          });
        }

        const isSamePassrowd = await bcrypt.compare(
          password,
          user.hashedPassword,
        );

        if (isSamePassrowd) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "新しいパスワードと現在のパスワードが同じです。別のパスワードを設定してください",
          });
        }

        const hashedNewPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
          data: {
            hashedPassword: hashedNewPassword,
          },
          where: {
            id: userId,
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
