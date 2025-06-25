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

const schema = z.object({
  email: z.string().email({
    message: "メールアドレスの形式が正しくありません",
  }),
});

type InputType = z.infer<typeof schema>;

const ForgotPassword = () => {
  const router = useRouter();

  const form = useForm<InputType>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const { isPending, mutate: forgotPassword } =
    trpc.auth.forgotPassword.useMutation({
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : "エラーが発生しました";
        toast.error(message);
        console.error(error);
      },
      onSuccess: () => {
        toast.success("パスワード再設定メールを送信しました");
        form.reset();
        router.refresh();
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    forgotPassword(data);
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="メールアドレス" {...field} />
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

export default ForgotPassword;
