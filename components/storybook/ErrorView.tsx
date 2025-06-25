import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = "絵本の読み込みに失敗しました。",
  onRetry = () => globalThis.location.reload(),
}: ErrorViewProps) {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans flex items-center justify-center">
      <div className="text-center">
        <p className="text-neutral-600 mb-4">{message}</p>
        <Button onClick={onRetry}>
          <RotateCcw className="h-4 w-4 mr-2" />
          再読み込み
        </Button>
      </div>
    </div>
  );
}
