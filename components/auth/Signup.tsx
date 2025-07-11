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
import { FcGoogle } from "react-icons/fc";
import { trpc } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

const schema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  name: z.string().min(2, { message: "名前は2文字以上で入力してください" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" }),
});

type InputType = z.infer<typeof schema>;

const handleGoogleSignup = async () => {
  try {
    const result = await signIn("google", { callbackUrl: "/" });
    if (result?.error) toast.error("アカウント作成に失敗しました");
  } catch {
    toast.error("アカウント作成に失敗しました");
  }
};

const Signup = () => {
  const router = useRouter();

  const form = useForm<InputType>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const { isPending, mutate: signUp } = trpc.auth.signUp.useMutation({
    onError: (error) => {
      toast.error(`アカウント作成に失敗しました: ${error.message}`);
      console.error(error);
    },
    onSuccess: () => {
      toast.success("アカウントを作成しました!");

      void signIn("credentials", {
        callbackUrl: "/",
        email: form.getValues("email"),
        password: form.getValues("password"),
      });

      router.refresh();
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    signUp(data);
  };

  return (
    <div className="max-w-[400px] m-auto">
      <div className="text-2xl font-bold text-center mb-10">新規登録</div>
      <Button
        className="w-full cursor-pointer"
        onClick={handleGoogleSignup}
        variant="outline"
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        Googleアカウント
      </Button>
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>
      <Form {...form}>
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="xxxx@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-sm text-gray-500">
            サインアップすることで、利用規約、プライバシーポリシーに同意したことになります。
          </div>
          <Button
            className="w-full cursor-pointer"
            disabled={isPending}
            type="submit"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            アカウント作成
          </Button>
        </form>
        <div className="text-center mt-5">
          <Link className="text-sm text-blue-500" href="/login">
            すでにアカウントをお持ちの方
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
