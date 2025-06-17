import { TRPCError } from "@trpc/server";
import cloudinary from "cloudinary";
import { env } from "@/env";

cloudinary.v2.config({
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
});

export const createCloudImage = async (base64Image: string) => {
  try {
    const imageResponse = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "NovelSmith",
      resource_type: "image",
    });

    return {
      public_id: imageResponse.public_id,
      url: imageResponse.url,
    };
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "画像のアップロードに失敗しました",
    });
  }
};

export const deleteCloudImage = async (publicId: string) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "画像の削除に失敗しました",
    });
  }
};
