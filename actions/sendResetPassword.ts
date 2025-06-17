import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "./sendEmail";

interface sendResetPasswordProps {
  userId: string;
}

export const sendResetPassword = async ({
  userId,
}: sendResetPasswordProps): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user?.email) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "ユーザーが存在しません",
    });
  }

  const subject = "パスワード再設定完了のご案内";

  const body = `
    <div>
        <p>
            ご利用ありがとうございます。<br/>
            あなたのアカウントでパスワード再設定が完了しました。
        </p>
    </div>
  `;

  await sendEmail(subject, body, user.email);
};
