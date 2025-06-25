import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = "本の読み込みに失敗しました。",
  onRetry,
}: ErrorStateProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">{message}</p>
            <Button onClick={onRetry}>
              <RotateCcw className="h-4 w-4 mr-2" />
              再読み込み
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
