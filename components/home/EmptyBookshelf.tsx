import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface EmptyBookshelfProps {
  buttonHref?: string;
  buttonText?: string;
  description?: string;
  title?: string;
}

export default function EmptyBookshelf({
  buttonHref = "/ai-create",
  buttonText = "最初の本を作成",
  description = "AIを使って、あなただけの素敵な物語を作成してみませんか？",
  title = "まだ本がありません",
}: EmptyBookshelfProps) {
  return (
    <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 mx-2">
      <div className="max-w-md mx-auto px-4">
        <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">{description}</p>
        <Link href={buttonHref}>
          <Button className="bg-gray-900 hover:bg-black text-white font-medium gap-2 shadow-lg px-6 sm:px-8 py-3">
            <Plus className="h-5 w-5" />
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
