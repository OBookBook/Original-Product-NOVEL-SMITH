import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BookListHeaderProps {
  bookCount: number;
}

export default function BookListHeader({ bookCount }: BookListHeaderProps) {
  return (
    <div className="mb-12">
      {/* ページタイトルと本作成ボタン */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            生成した本 一覧
          </h3>
          <p className="text-gray-600">
            {bookCount > 0
              ? `${bookCount}冊のAI生成ストーリー`
              : "まだ本がありません"}
          </p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <Link href="/ai-create">
            <Button className="bg-gray-900 hover:bg-black text-white font-medium gap-2 shadow-lg px-6 py-3 cursor-pointer">
              <Plus className="h-5 w-5" />
              新しい本を作成
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
