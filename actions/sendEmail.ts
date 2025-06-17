import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import { env } from "@/env";

const transporter = nodemailer.createTransport({
  auth: {
    pass: env.EMAIL_PASSWORD,
    user: env.EMAIL,
  },
  maxConnections: 1,
  pool: true,
  port: 465,
  secure: true,
  service: "gmail",
});

export const sendEmail = async (
  subject: string,
  body: string,
  sendTo: string,
): Promise<void> => {
  const mailOptions = {
    from: `Novel Smith <${env.EMAIL}>`,
    html: body,
    subject: subject,
    to: sendTo,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "メールの送信に失敗しました",
    });
  }
};
