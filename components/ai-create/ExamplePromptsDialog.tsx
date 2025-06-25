import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { examplePrompts } from "./data/examplePrompts";

interface ExamplePromptsDialogProps {
  isOpen: boolean;
  onExampleSelect: (prompt: string) => void;
  onOpenChange: (open: boolean) => void;
}

export default function ExamplePromptsDialog({
  isOpen,
  onExampleSelect,
  onOpenChange,
}: ExamplePromptsDialogProps) {
  const handleExampleSelect = (selectedPrompt: string) => {
    onExampleSelect(selectedPrompt);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-1 text-xs sm:text-sm shrink-0"
          size="sm"
          type="button"
          variant="outline"
        >
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline cursor-pointer">
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
              onClick={() => handleExampleSelect(example.prompt)}
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
  );
}
