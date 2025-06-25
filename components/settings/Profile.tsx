"use client";

import { useState } from "react";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@prisma/client";
import { trpc } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import ImageUploading from "react-images-uploading";
import Image from "next/image";
import toast from "react-hot-toast";

type ImageListType = ImageType[];

interface ImageType {
  dataURL?: string;
  file?: File;
}

interface ImageUploadingRenderProps {
  imageList: ImageType[];
  onImageUpdate: (index: number) => void;
}

const schema = z.object({
  introduction: z.string().optional(),
  name: z.string().min(3, { message: "名前は3文字以上で入力してください" }),
});

type InputType = z.infer<typeof schema>;

interface ProfileProps {
  user: User;
}

const Profile = ({ user }: ProfileProps) => {
  const [imageUpload, setImageUpload] = useState<ImageListType>([
    {
      dataURL: user.image ?? "",
    },
  ]);

  const form = useForm<InputType>({
    defaultValues: {
      introduction: user.introduction ?? "",
      name: user.name ?? "",
    },
    resolver: zodResolver(schema),
  });

  const { isPending, mutate: updateUser } = trpc.user.updateUser.useMutation({
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
    onSuccess: () => {
      toast.success("プロフィールを更新しました");
      globalThis.location.reload();
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    let base64Image: string | undefined;

    const firstImage = imageUpload[0];
    if (firstImage?.dataURL?.startsWith("data:image")) {
      base64Image = firstImage.dataURL;
    }

    updateUser({
      base64Image,
      introduction: data.introduction,
      name: data.name,
    });
  };

  const onChangeImage = (imageList: ImageListType) => {
    const firstImage = imageList[0];
    const file = firstImage?.file;
    const maxFileSize = 5 * 1024 * 1024;

    if (file && file.size > maxFileSize) {
      toast.error("ファイルサイズは5MBを超える事はできません");
      return;
    }

    setImageUpload(imageList);
  };

  return (
    <div>
      <div className="text-xl font-bold text-center mb-5">プロフィール</div>
      <Form {...form}>
        <div className="mb-5">
          <ImageUploading
            acceptType={["jpg", "png", "jpeg"]}
            maxNumber={1}
            onChange={onChangeImage}
            value={imageUpload}
          >
            {({ imageList, onImageUpdate }: ImageUploadingRenderProps) => (
              <div className="w-full flex flex-col items-center justify-center">
                {imageList.map((image, index) => (
                  <div key={index}>
                    {image.dataURL && (
                      <div className="w-24 h-24 relative">
                        <Image
                          alt={user.name ?? "avatar"}
                          className="rounded-full object-cover"
                          fill
                          src={image.dataURL}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {imageList.length > 0 && (
                  <div className="text-center mt-3">
                    <Button
                      className="cursor-pointer"
                      onClick={() => onImageUpdate(0)}
                      variant="outline"
                    >
                      アバターを変更
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ImageUploading>
        </div>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder="名前" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>メールアドレス</FormLabel>
            <Input disabled value={user.email} />
          </FormItem>

          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自己紹介</FormLabel>
                <FormControl>
                  <Textarea placeholder="自己紹介" rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full cursor-pointer"
            disabled={isPending}
            type="submit"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            変更
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
