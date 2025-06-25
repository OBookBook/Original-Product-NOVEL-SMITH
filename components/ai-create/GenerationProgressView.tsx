import { Bot, CheckCircle, FileText, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GenerationProgressViewProps {
  currentStep: number;
}

interface Step {
  icon: typeof FileText;
  id: number;
  name: string;
}

export default function GenerationProgressView({
  currentStep,
}: GenerationProgressViewProps) {
  const steps: Step[] = [
    { icon: FileText, id: 1, name: "ストーリー構造の設計" },
    { icon: Sparkles, id: 2, name: "物語の執筆" },
    { icon: Bot, id: 3, name: "アートワークの生成" },
    { icon: CheckCircle, id: 4, name: "完了" },
  ];

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
