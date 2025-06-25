import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/react";
import { type AlertState, type StoryPromptForm } from "./types";

const storyPromptSchema = z.object({
  prompt: z.string().min(1, "プロンプトを入力してください").trim(),
});

export function useAIBookGenerator() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isExampleDialogOpen, setIsExampleDialogOpen] =
    useState<boolean>(false);
  const [alertState, setAlertState] = useState<AlertState>({
    message: "",
    show: false,
    title: "",
    type: "success",
  });

  const router = useRouter();
  const form = useForm<StoryPromptForm>({
    defaultValues: {
      prompt: "",
    },
    mode: "onChange",
    resolver: zodResolver(storyPromptSchema),
  });
  const {
    formState: { isValid },
    setValue,
  } = form;

  const generateBookMutation = trpc.story.generateBook.useMutation({
    onError: (error) => {
      console.error("Generation error:", error);
      setAlertState({
        message:
          error.message ??
          "生成中に問題が発生しました。しばらく待ってから再度お試しください。",
        show: true,
        title: "エラーが発生しました",
        type: "error",
      });
      setIsGenerating(false);
      setCurrentStep(1);
    },
    onSuccess: (data) => {
      setCurrentStep(4);
      toast.success(
        `AI絵本「${data.book?.title ?? "無題の絵本"}」の生成が正常に完了しました！`,
      );
      setIsGenerating(false);

      setTimeout(() => {
        router.push(`/storybook/${data.bookId}`);
      }, 2000);
    },
  });

  const onSubmit = async (data: StoryPromptForm) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setCurrentStep(1);
    setAlertState({ message: "", show: false, title: "", type: "success" });

    try {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 3) return 3;
          return prev + 1;
        });
      }, 2000);

      await generateBookMutation.mutateAsync({
        prompt: data.prompt,
      });

      clearInterval(stepInterval);
    } catch (error) {
      console.error("Generation error:", error);
    }
  };

  const handleExampleSelect = (selectedPrompt: string) => {
    setValue("prompt", selectedPrompt, { shouldValidate: true });
  };

  return {
    alertState,
    currentStep,
    form,
    handleExampleSelect,
    isExampleDialogOpen,
    isGenerating,
    isValid,
    onSubmit,
    setIsExampleDialogOpen,
  };
}
