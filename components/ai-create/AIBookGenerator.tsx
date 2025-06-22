"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Bot,
  CheckCircle,
  FileText,
  HelpCircle,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trpc } from "@/trpc/react";
import { useRouter } from "next/navigation";

const storyPromptSchema = z.object({
  prompt: z.string().min(1, "プロンプトを入力してください").trim(),
});

type StoryPromptForm = z.infer<typeof storyPromptSchema>;

export default function AIBookGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isExampleDialogOpen, setIsExampleDialogOpen] = useState(false);
  const [alertState, setAlertState] = useState<{
    message: string;
    show: boolean;
    title: string;
    type: "error" | "success";
  }>({
    message: "",
    show: false,
    title: "",
    type: "success",
  });

  const router = useRouter();

  const {
    formState: { isValid },
    handleSubmit,
    register,
    setValue,
  } = useForm<StoryPromptForm>({
    defaultValues: {
      prompt: "",
    },
    mode: "onChange",
    resolver: zodResolver(storyPromptSchema),
  });

  const examplePrompts = [
    {
      description: "乗り物と動物が好きな子供たちのための楽しい冒険物語",
      prompt:
        "森に住む可愛いうさぎの家族が、手作りの小さな車に乗って動物の友達を迎えに行く楽しい冒険の物語",
      title: "うさぎの車の冒険",
    },
    {
      description: "大人気キャラクターが登場する、やさしさを学ぶ物語",
      prompt:
        "アンパンマンが困っている動物たちに美味しいパンを配って回り、「ありがとう」の気持ちを伝え合う心温まる物語",
      title: "アンパンマンの配達",
    },
    {
      description: "「ガタンゴトン」の音が楽しい電車の冒険物語",
      prompt:
        "色とりどりの電車が「ガタンゴトン」「シュッシュッ」の音を響かせながら、お客さんの動物たちを運ぶ楽しい一日の物語",
      title: "電車でゴーゴー",
    },
    {
      description: "働く車と勇気をテーマにした緊急出動の物語",
      prompt:
        "赤い消防車が「ウーウー」「カンカン」のサイレンを鳴らしながら、困っている動物たちを助けに行く勇敢な物語",
      title: "消防車の大活躍",
    },
    {
      description: "お買い物と数を覚える楽しい日常物語",
      prompt:
        "小さなくまの親子が「いち、に、さん」と数を数えながら、お店で美味しいりんごとバナナを買い物する温かい物語",
      title: "くまのお買い物",
    },
    {
      description: "動物の鳴き声と色を学ぶカラフルな物語",
      prompt:
        "「わんわん」の白い犬、「にゃんにゃん」の黒い猫、「ぶーぶー」のピンクの豚さんが、七色の虹を見つけて一緒に遊ぶ楽しい物語",
      title: "動物たちの虹さがし",
    },
    {
      description: "食べ物と「いただきます」を学ぶ食育物語",
      prompt:
        "小さなペンギンの家族が、新鮮なお魚を「いただきます」と言って美味しく食べて、「ごちそうさま」の感謝を伝える食事の物語",
      title: "ペンギンの食事時間",
    },
    {
      description: "お風呂と生活習慣を楽しく学ぶ物語",
      prompt:
        "象の赤ちゃんが「ぷくぷく」泡だらけのお風呂で遊んだ後、お母さんと一緒に「おやすみなさい」をする生活リズムの物語",
      title: "象さんのお風呂タイム",
    },
  ];

  const steps = [
    { icon: FileText, id: 1, name: "ストーリー構造の設計" },
    { icon: Sparkles, id: 2, name: "物語の執筆" },
    { icon: Bot, id: 3, name: "アートワークの生成" },
    { icon: CheckCircle, id: 4, name: "完了" },
  ];

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
    setIsExampleDialogOpen(false);
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-10 text-center space-y-8">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-amber-900" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  AI絵本生成中
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  高品質な物語とアートワークを作成しています
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div
                      className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-gray-100 text-gray-900 border-l-4 border-gray-900"
                          : isCompleted
                            ? "text-green-600 bg-green-50"
                            : "text-gray-400"
                      }`}
                      key={step.id}
                    >
                      <Icon
                        className={`h-5 w-5 ${isActive ? "text-gray-900" : ""}`}
                      />
                      <span className="font-medium text-left flex-1">
                        {step.name}
                      </span>
                      {isActive && (
                        <Loader2 className="h-4 w-4 animate-spin ml-auto text-gray-900" />
                      )}
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            {/* ページタイトルと戻るボタン */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  新しい本を作成
                </h3>
                <p className="text-gray-600">
                  AIを使って素敵な絵本を生成しましょう
                </p>
              </div>
              <div className="flex justify-center sm:justify-end">
                <Button className="bg-gray-900 hover:bg-black text-white font-medium gap-2 shadow-lg px-6 py-3">
                  <Bot className="h-5 w-5" />
                  AI絵本ジェネレーター
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl space-y-6">
              {/* Alert */}
              {alertState.show && (
                <Alert
                  className={
                    alertState.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : ""
                  }
                  variant={
                    alertState.type === "error" ? "destructive" : "default"
                  }
                >
                  {alertState.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{alertState.title}</AlertTitle>
                  <AlertDescription>{alertState.message}</AlertDescription>
                </Alert>
              )}

              {/* Input Form */}
              <Card className="border-gray-200 shadow-lg">
                <CardContent className="space-y-8">
                  <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Label
                          className="text-gray-700 font-medium"
                          htmlFor="prompt"
                        >
                          物語のプロンプト
                        </Label>
                        <Dialog
                          onOpenChange={setIsExampleDialogOpen}
                          open={isExampleDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="flex items-center gap-1 text-xs sm:text-sm shrink-0"
                              size="sm"
                              type="button"
                              variant="outline"
                            >
                              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">
                                プロンプト例を見る
                              </span>
                              <span className="sm:hidden">例を見る</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                                プロンプト例集
                              </DialogTitle>
                              <p className="text-gray-600">
                                クリックして選択できます。参考にして独自のアイデアを作ってみてください。
                              </p>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              {examplePrompts.map((example, index) => (
                                <Card
                                  className="cursor-pointer border-2 border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                                  key={index}
                                  onClick={() =>
                                    handleExampleSelect(example.prompt)
                                  }
                                >
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                      {example.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <p className="text-gray-700 font-medium leading-relaxed">
                                      &ldquo;{example.prompt}&rdquo;
                                    </p>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                      {example.description}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Textarea
                        {...register("prompt")}
                        className="resize-none border-gray-300 focus:border-gray-500 rounded-lg p-4 min-h-[120px]"
                        id="prompt"
                        placeholder="例: 小さな少年とAIロボットが森の中を冒険する物語"
                        rows={5}
                      />
                    </div>
                    <Button
                      className="w-full h-14 text-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-200"
                      disabled={!isValid || isGenerating}
                      type="submit"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-5 w-5" />
                          AI絵本を生成する
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
