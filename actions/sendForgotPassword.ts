import { sendEmail } from "@/actions/sendEmail";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import { env } from "@/env";

interface SendForgotPasswordOptions {
  userId: string;
}

export const sendForgotPassword = async ({
  userId,
}: SendForgotPasswordOptions): Promise<void> => {
  const user = await prisma.user.findUnique({
    include: {
      passwordResetToken: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    where: {
      id: userId,
    },
  });

  if (!user || !user.email) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "ユーザーが見つかりません",
    });
  }

  const token = user.passwordResetToken[0]?.token;

  if (!token) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "トークンが見つかりません",
    });
  }

  const resetPasswordLink = `${env.NEXTAUTH_URL}/reset-password/${token}`;

  const subject = "パスワード再設定のご案内";
  const body = `
  <div>
    <p>
        ご利用ありがとうございます。<br/>
        あなたのアカウントでパスワード再設定のリクエストがありました。
    </p>

    </p>

    <p><a href="${resetPasswordLink}">パスワードの再設定を行う</a></p>

    <p>このリンクの有効期限は24時間です。</p>
    <p>このメールに覚えのない場合は、このメールを無視するか削除して頂きますようお願いします。</p>
  </div>
  `;

  await sendEmail(subject, body, user.email);
};
