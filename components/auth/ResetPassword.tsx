"use client";

import { useRouter } from "next/navigation";
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
import { trpc } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z
  .object({
    password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
    repeatedPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "新しいパスワードと確認用パスワードが一致しません",
    path: ["repeatedPassword"], // エラーメッセージが適用されるフィールド
  });

type InputType = z.infer<typeof schema>;

interface ResetPasswordProps {
  token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const router = useRouter();
  const form = useForm<InputType>({
    defaultValues: {
      password: "",
      repeatedPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const { isPending, mutate: resetPassword } =
    trpc.auth.resetPassword.useMutation({
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : "エラーが発生しました";
        toast.error(message);
        console.log(error);
      },
      onSuccess: () => {
        toast.success("パスワードを再設定しました");
        router.refresh();
        router.push("/login");
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    resetPassword({
      password: data.password,
      token,
    });
  };

  return (
    <div className="max-w-[400px] m-auto">
      <div className="text-2xl font-bold text-center mb-10">
        パスワード再設定
      </div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新しいパスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeatedPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新しいパスワード(確認用)</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
            送信
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
