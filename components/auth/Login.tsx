"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

const schema = z.object({
  email: z
    .string()
    .email({ message: "メールアドレスの形式が正しくありません" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" }),
});

type InputTypes = z.infer<typeof schema>;

const handleGoogleLogin = async () => {
  try {
    const result = await signIn("google", {
      callbackUrl: "/",
    });

    if (result?.error) toast.error("ログインに失敗しました");
  } catch (error) {
    console.log(error);
    toast.error("ログインに失敗しました");
  }
};

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InputTypes>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<InputTypes> = async (data) => {
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("ログインに失敗しました");
        return;
      }

      toast.success("ログインしました!");
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] m-auto">
      <div className="text-2xl font-bold text-center mb-10">ログイン</div>

      <Button
        className="w-full cursor-pointer"
        onClick={handleGoogleLogin}
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

          <Button
            className="w-full cursor-pointer"
            disabled={isLoading}
            type="submit"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ログイン
          </Button>
        </form>

        <div className="text-center mt-5">
          <Link className="text-sm text-blue-500" href="/reset-password">
            パスワードを忘れた方はこちら
          </Link>
        </div>

        <div className="text-center mt-2">
          <Link className="text-sm text-blue-500" href="/signup">
            アカウントを作成する
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
