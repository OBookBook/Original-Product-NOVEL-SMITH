"use client";

import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerationProgressView from "./GenerationProgressView";
import AlertMessage from "./AlertMessage";
import PromptInputForm from "./PromptInputForm";
import { useAIBookGenerator } from "./useAIBookGenerator";

export default function AIBookGenerator() {
  const {
    alertState,
    currentStep,
    form,
    handleExampleSelect,
    isExampleDialogOpen,
    isGenerating,
    isValid,
    onSubmit,
    setIsExampleDialogOpen,
  } = useAIBookGenerator();

  if (isGenerating) return <GenerationProgressView currentStep={currentStep} />;

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
              <AlertMessage alertState={alertState} />
              {/* Input Form */}
              <PromptInputForm
                form={form}
                isExampleDialogOpen={isExampleDialogOpen}
                isGenerating={isGenerating}
                isValid={isValid}
                onExampleDialogOpenChange={setIsExampleDialogOpen}
                onExampleSelect={handleExampleSelect}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
