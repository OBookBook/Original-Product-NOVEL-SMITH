"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AIBookGenerator() {
  const [prompt, setPrompt] = useState("");
  const [customizations, setCustomizations] = useState({
    pageCount: "8-12ページ",
    style: "冒険・友情",
    targetAge: "5-8歳",
    tone: "心温まる",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
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

  const examplePrompts = [
    {
      description: "友情と協力をテーマにしたテクノロジーと自然の融合",
      prompt: "小さな少年とAIロボットが森の中を冒険する物語",
      title: "AI友情冒険",
    },
    {
      description: "読書の楽しさと想像力の力を描いた幻想的な物語",
      prompt: "魔法の本屋で働く猫と、本の世界に迷い込んだ女の子の冒険",
      title: "魔法図書館",
    },
    {
      description: "家族の絆と宇宙への憧れを描いたSF冒険",
      prompt: "宇宙船に乗って星々を旅する兄弟の物語",
      title: "宇宙兄弟",
    },
    {
      description: "時間の大切さと成長をテーマにした魔法的物語",
      prompt: "時間を操る不思議な時計を見つけた少女の冒険",
      title: "時間の魔法",
    },
    {
      description: "自然との共生と思いやりを学ぶ心温まる物語",
      prompt: "動物たちと話せるようになった男の子の日常",
      title: "動物との対話",
    },
    {
      description: "自由と冒険心、そして夢を追いかける勇気の物語",
      prompt: "空を飛べるようになった少女が雲の上の世界を探検する物語",
      title: "空飛ぶ少女",
    },
    {
      description: "優しさと創造性、そして人を喜ばせる喜びの物語",
      prompt: "魔法の料理で人々を幸せにする小さなコックの物語",
      title: "料理の魔法",
    },
    {
      description: "環境保護と異文化理解をテーマにした海洋冒険",
      prompt: "人魚の友達と一緒に海底王国を救う少年の冒険",
      title: "海底王国",
    },
  ];

  const generateStory = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setAlertState({ message: "", show: false, title: "", type: "success" });

    try {
      // ストーリー構造生成のシミュレーション
      setGenerationProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 物語執筆のシミュレーション
      setGenerationProgress(60);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // イラスト生成のシミュレーション
      setGenerationProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: 実際のOpenAI API呼び出しをここに実装
      setAlertState({
        message:
          "AI絵本の生成が正常に完了しました。素晴らしい物語とイラストが完成しました！",
        show: true,
        title: "生成完了！",
        type: "success",
      });
    } catch (error) {
      console.error("Generation error:", error);
      setAlertState({
        message:
          "生成中に問題が発生しました。しばらく待ってから再度お試しください。",
        show: true,
        title: "エラーが発生しました",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleExampleSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setIsExampleDialogOpen(false);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
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
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gray-900 h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {generationProgress}% 完了
                </p>
              </div>

              <div className="space-y-3 text-gray-600">
                {generationProgress < 20 && (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-5 w-5" />
                    <span>ストーリー構造を設計中</span>
                  </div>
                )}
                {generationProgress >= 20 && generationProgress < 60 && (
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    <span>物語を執筆中</span>
                  </div>
                )}
                {generationProgress >= 60 && (
                  <div className="flex items-center justify-center gap-3">
                    <Bot className="h-5 w-5" />
                    <span>アートワークを生成中</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header - page.tsxと同じスタイル */}
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
                {/* <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                    <Wand2 className="h-6 w-6 text-gray-600" />
                    絵本のアイデアを入力
                  </CardTitle>
                </CardHeader> */}
                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <Label
                      className="text-gray-700 font-medium"
                      htmlFor="prompt"
                    >
                      物語のプロンプト
                    </Label>
                    <Textarea
                      className="resize-none border-gray-300 focus:border-gray-500 rounded-lg p-4 min-h-[120px]"
                      id="prompt"
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="例：小さな少年とAIロボットが森の中を冒険する物語"
                      rows={5}
                      value={prompt}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        どんな物語を作りたいか、自由に描写してください
                      </p>
                      <Dialog
                        onOpenChange={setIsExampleDialogOpen}
                        open={isExampleDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="flex items-center gap-2"
                            size="sm"
                            variant="outline"
                          >
                            <HelpCircle className="h-4 w-4" />
                            プロンプト例を見る
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
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium" htmlFor="target-age">
                        対象年齢
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-gray-500 rounded-lg"
                        id="target-age"
                        onChange={(e) => setCustomizations(prev => ({...prev, targetAge: e.target.value}))}
                        value={customizations.targetAge}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium" htmlFor="page-count">
                        ページ数
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-gray-500 rounded-lg"
                        id="page-count"
                        onChange={(e) => setCustomizations(prev => ({...prev, pageCount: e.target.value}))}
                        value={customizations.pageCount}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium" htmlFor="style">
                        ジャンル
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-gray-500 rounded-lg"
                        id="style"
                        onChange={(e) => setCustomizations(prev => ({...prev, style: e.target.value}))}
                        value={customizations.style}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium" htmlFor="tone">
                        トーン
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-gray-500 rounded-lg"
                        id="tone"
                        onChange={(e) => setCustomizations(prev => ({...prev, tone: e.target.value}))}
                        value={customizations.tone}
                      />
                    </div>
                  </div> */}

                  <Button
                    className="w-full h-14 text-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-200"
                    disabled={!prompt.trim() || isGenerating}
                    onClick={generateStory}
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
