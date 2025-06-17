import { privateProcedure, router } from "@/trpc/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { extractPublicId } from "cloudinary-build-url";
import prisma from "@/lib/prisma";
import { createCloudImage, deleteCloudImage } from "@/actions/cloudImage";

export const userRouter = router({
  updateUser: privateProcedure
    .input(
      z.object({
        base64Image: z.string().optional(),
        introduction: z.string().optional(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { base64Image, introduction, name } = input;
        const userId = ctx.user.id;
        let image_url;

        if (base64Image) {
          const user = await prisma.user.findUnique({
            where: {
              id: userId,
            },
          });

          if (!user) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "ユーザーが見つかりませんでした",
            });
          }

          if (user.image) {
            const publicId = extractPublicId(user.image);
            await deleteCloudImage(publicId);
          }

          const image = await createCloudImage(base64Image);
          image_url = image.url;
        }

        await prisma.user.update({
          data: {
            introduction,
            name,
            ...(image_url && { image: image_url }),
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
                message: "プロフィール編集に失敗しました",
              });
        throw error_;
      }
    }),
});
