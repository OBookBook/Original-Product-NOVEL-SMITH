import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";

interface ActionButtonsProps {
  isAnimating: boolean;
  onReset: () => void;
}

export function ActionButtons({ isAnimating, onReset }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4 pt-6 border-t border-neutral-200">
      <Button
        className="h-12 px-8 text-neutral-600 border-neutral-300 hover:bg-neutral-50 font-medium cursor-pointer"
        disabled={isAnimating}
        onClick={onReset}
        size="lg"
        variant="outline"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        <span className="text-base">最初から読む</span>
      </Button>

      <Button
        className="h-12 px-8 bg-neutral-800 hover:bg-neutral-900 text-white font-medium cursor-pointer"
        onClick={() => (globalThis.location.href = "/")}
        size="lg"
      >
        <Home className="mr-2 h-4 w-4" />
        <span className="text-base">ホーム</span>
      </Button>
    </div>
  );
}
