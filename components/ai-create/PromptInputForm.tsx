import { type UseFormReturn } from "react-hook-form";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ExamplePromptsDialog from "./ExamplePromptsDialog";
import { type StoryPromptForm } from "./types";

interface PromptInputFormProps {
  form: UseFormReturn<StoryPromptForm>;
  isExampleDialogOpen: boolean;
  isGenerating: boolean;
  isValid: boolean;
  onExampleDialogOpenChange: (open: boolean) => void;
  onExampleSelect: (prompt: string) => void;
  onSubmit: (data: StoryPromptForm) => void;
}

export default function PromptInputForm({
  form,
  isExampleDialogOpen,
  isGenerating,
  isValid,
  onExampleDialogOpenChange,
  onExampleSelect,
  onSubmit,
}: PromptInputFormProps) {
  const { handleSubmit, register } = form;

  return (
    <Card className="border-gray-200 shadow-lg">
      <CardContent className="space-y-8">
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-gray-700 font-medium" htmlFor="prompt">
                物語のプロンプト
              </Label>
              <ExamplePromptsDialog
                isOpen={isExampleDialogOpen}
                onExampleSelect={onExampleSelect}
                onOpenChange={onExampleDialogOpenChange}
              />
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
            className="w-full h-14 text-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-200 cursor-pointer"
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
                <Sparkles className="mr-3 h-5 w-5 " />
                AI絵本を生成する
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
