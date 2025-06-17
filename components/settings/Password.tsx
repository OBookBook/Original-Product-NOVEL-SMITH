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
    currentPassword: z
      .string()
      .min(3, { message: "３文字以上入力する必要があります" }),
    password: z
      .string()
      .min(3, { message: "３文字以上入力する必要があります" }),
    repeatedPassword: z
      .string()
      .min(3, { message: "３文字以上入力する必要があります" }),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "新しいパスワードと確認用パスワードが一致しません",
    path: ["repeatedPassword"],
  });

type InputType = z.infer<typeof schema>;

const Password = () => {
  const router = useRouter();

  const form = useForm<InputType>({
    defaultValues: {
      currentPassword: "",
      password: "",
      repeatedPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const { isPending, mutate: updatePassword } =
    trpc.auth.updatePassword.useMutation({
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
      onSuccess: () => {
        form.reset();
        toast.success("パスワードを変更しました");
        router.refresh();
      },
    });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    updatePassword({
      currentPassword: data.currentPassword,
      password: data.password,
    });
  };

  return (
    <div>
      <div className="text-xl font-bold text-center mb-5">パスワード変更</div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>現在のパスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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

          <Button className="w-full" disabled={isPending} type="submit">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            変更
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Password;
