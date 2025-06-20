import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";

interface Book {
  coverImage: string;
  createdAt: string;
  genre: string;
  id: string;
  isAIGenerated: boolean;
  likes: number;
  pageCount: number;
  rating: number;
  readTime: string;
  spineColor: string;
  subtitle: string;
  targetAge: string;
  title: string;
  views: number;
}

// モックデータ
const mockBooks: Book[] = [
  {
    coverImage: "https://picsum.photos/400/500?random=1",
    createdAt: "2024-01-15",
    genre: "Adventure",
    id: "1",
    isAIGenerated: true,
    likes: 18,
    pageCount: 12,
    rating: 4.8,
    readTime: "約15分",
    spineColor: "from-pink-400 to-purple-500",
    subtitle: "A story of friendship and cooperation",
    targetAge: "5-8歳",
    title: "小さな少年とAIロボットの冒険",
    views: 234,
  },
  {
    coverImage: "https://picsum.photos/400/500?random=2",
    createdAt: "2024-01-12",
    genre: "Fantasy",
    id: "2",
    isAIGenerated: true,
    likes: 25,
    pageCount: 10,
    rating: 4.9,
    readTime: "約12分",
    spineColor: "from-blue-400 to-indigo-500",
    subtitle: "A tale about the power of imagination",
    targetAge: "6-10歳",
    title: "魔法の本屋と迷子の女の子",
    views: 189,
  },
  {
    coverImage: "https://picsum.photos/400/500?random=3",
    createdAt: "2024-01-10",
    genre: "Sci-Fi",
    id: "3",
    isAIGenerated: true,
    likes: 12,
    pageCount: 14,
    rating: 4.6,
    readTime: "約18分",
    spineColor: "from-green-400 to-teal-500",
    subtitle: "Family bonds and dreams of space",
    targetAge: "7-12歳",
    title: "宇宙船で旅する兄弟",
    views: 156,
  },
  {
    coverImage: "https://picsum.photos/400/500?random=4",
    createdAt: "2024-01-08",
    genre: "Fantasy",
    id: "4",
    isAIGenerated: true,
    likes: 31,
    pageCount: 11,
    rating: 4.7,
    readTime: "約14分",
    spineColor: "from-yellow-400 to-orange-500",
    subtitle: "Learning the value of time",
    targetAge: "5-9歳",
    title: "時間を操る不思議な時計",
    views: 267,
  },
  {
    coverImage: "https://picsum.photos/400/500?random=5",
    createdAt: "2024-01-06",
    genre: "Nature",
    id: "5",
    isAIGenerated: true,
    likes: 22,
    pageCount: 13,
    rating: 4.5,
    readTime: "約16分",
    spineColor: "from-emerald-400 to-green-500",
    subtitle: "Living in harmony with nature",
    targetAge: "4-8歳",
    title: "動物と話せる男の子",
    views: 198,
  },
  {
    coverImage: "https://picsum.photos/400/500?random=6",
    createdAt: "2024-01-04",
    genre: "Adventure",
    id: "6",
    isAIGenerated: true,
    likes: 16,
    pageCount: 10,
    rating: 4.4,
    readTime: "約13分",
    spineColor: "from-cyan-400 to-blue-500",
    subtitle: "A story of dreams and courage",
    targetAge: "6-11歳",
    title: "空を飛ぶ少女の冒険",
    views: 145,
  },
];

const BookshelfShelf = ({
  books,
  shelfNumber,
}: {
  books: Book[];
  shelfNumber: number;
}) => (
  <div className="relative mb-16">
    {/* モダンな棚板 */}
    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    <div className="absolute -bottom-6 left-4 right-4 h-2 bg-gray-200 rounded-full shadow-sm" />

    {/* 本の表紙表示 */}
    <div className="flex items-end justify-start gap-6 px-8 py-6 min-h-[320px]">
      {books.map((book, index) => (
        <div
          className="group cursor-pointer relative"
          key={book.id}
          style={{
            transform: `rotate(${(Math.random() - 0.5) * 2}deg)`,
            zIndex: index,
          }}
        >
          {/* 本の表紙 */}
          <div className="relative w-44 h-60 bg-white rounded border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 hover:rotate-0">
            {/* 表紙画像 */}
            <img
              alt={book.title}
              className="w-full h-full object-cover rounded"
              src={book.coverImage}
            />

            {/* モダンなオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded" />

            {/* AI バッジ */}
            {book.isAIGenerated && (
              <div className="absolute top-3 right-3">
                <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                  AI
                </div>
              </div>
            )}

            {/* 評価バッジ */}
            <div className="absolute top-3 left-3">
              <div className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {book.rating}
              </div>
            </div>

            {/* タイトルオーバーレイ */}
            <div className="absolute bottom-0 left-0 right-0 p-4 rounded-b">
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">
                {book.title}
              </h3>
              <p className="text-white/80 text-xs">{book.targetAge}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function Page() {
  const booksPerShelf = 3;
  const shelves = [];

  for (let i = 0; i < mockBooks.length; i += booksPerShelf) {
    shelves.push(mockBooks.slice(i, i + booksPerShelf));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Main Library Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-12">
            {/* ページタイトルと本作成ボタン */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  生成した本 一覧
                </h3>
                <p className="text-gray-600">厳選されたAI生成ストーリー</p>
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

            {/* Search Bar */}
            {/* <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-12 pr-4 py-3 border-gray-200 bg-white focus:ring-2 focus:ring-gray-900 text-base"
                    placeholder="タイトル、ジャンル、説明で本を検索..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button className="gap-2 border-gray-200 hover:bg-gray-50 text-gray-700" size="sm" variant="outline">
                    <Filter className="h-4 w-4" />
                    フィルター
                  </Button>
                  <div className="flex gap-2">
                    <Badge className="cursor-pointer hover:bg-gray-200 bg-gray-900 text-white" variant="secondary">
                      すべて
                    </Badge>
                    <Badge className="cursor-pointer hover:bg-gray-100 border-gray-300 text-gray-700" variant="outline">
                      冒険
                    </Badge>
                    <Badge className="cursor-pointer hover:bg-gray-100 border-gray-300 text-gray-700" variant="outline">
                      ファンタジー
                    </Badge>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Modern Bookshelf */}
          <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {/* モダンな背景パターン */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="absolute inset-0 opacity-30">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 60 60"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      height="60"
                      id="grid"
                      patternUnits="userSpaceOnUse"
                      width="60"
                    >
                      <path
                        d="m 60,0 0,60 -60,0 0,-60 60,0 z"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect fill="url(#grid)" height="100%" width="100%" />
                </svg>
              </div>
            </div>

            {/* 本棚の棚 */}
            <div className="relative p-8 pt-12">
              {shelves.map((shelfBooks, index) => (
                <BookshelfShelf
                  books={shelfBooks}
                  key={index}
                  shelfNumber={index + 1}
                />
              ))}

              {/* 空の状態用CTAエリア（本が少ない場合） */}
              {mockBooks.length < 3 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 mt-8">
                  <div className="max-w-md mx-auto">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      まだ本がありません
                    </h4>
                    <p className="text-gray-600 mb-6">
                      AIを使って、あなただけの素敵な物語を作成してみませんか？
                    </p>
                    <Link href="/ai-create">
                      <Button className="bg-gray-900 hover:bg-black text-white font-medium gap-2 shadow-lg px-8 py-3">
                        <Plus className="h-5 w-5" />
                        最初の本を作成
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ページネーション */}
          <div className="mt-16 flex flex-col items-center gap-6">
            {/* ページング情報 */}
            <div className="text-sm text-gray-600">
              コレクション {mockBooks.length}/24 冊を表示中
            </div>

            {/* ページネーションコントロール */}
            <div className="flex items-center gap-2">
              {/* 前へボタン */}
              <Button
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
                disabled
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
                前へ
              </Button>

              {/* ページ番号 */}
              <div className="flex items-center gap-1">
                <Button
                  className="bg-gray-900 hover:bg-black text-white min-w-[40px]"
                  size="sm"
                  variant="default"
                >
                  1
                </Button>
                <Button
                  className="border-gray-200 hover:bg-gray-50 text-gray-700 min-w-[40px]"
                  size="sm"
                  variant="outline"
                >
                  2
                </Button>
                <Button
                  className="border-gray-200 hover:bg-gray-50 text-gray-700 min-w-[40px]"
                  size="sm"
                  variant="outline"
                >
                  3
                </Button>
                <span className="px-2 text-gray-500">...</span>
                <Button
                  className="border-gray-200 hover:bg-gray-50 text-gray-700 min-w-[40px]"
                  size="sm"
                  variant="outline"
                >
                  8
                </Button>
              </div>

              {/* 次へボタン */}
              <Button
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
                size="sm"
                variant="outline"
              >
                次へ
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* フローティングアクションボタン (モバイル向け) */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <Link href="/ai-create">
          <Button className="bg-gray-900 hover:bg-black text-white shadow-2xl rounded-full w-14 h-14 p-0">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default Page;
