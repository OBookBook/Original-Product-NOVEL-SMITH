"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, RotateCcw, Star } from "lucide-react";
import { trpc } from "@/trpc/react";
import Image from "next/image";
import React from "react";

interface Book {
  coverImage?: string;
  createdAt: string;
  genre?: string;
  id: string;
  isAIGenerated: boolean;
  likes?: number;
  pageCount: number;
  rating?: number;
  readTime?: string;
  spineColor: string;
  subtitle: string;
  targetAge?: string;
  title: string;
  views?: number;
}

const BookshelfShelf = ({
  _shelfNumber,
  books,
}: {
  _shelfNumber: number;
  books: Book[];
}) => (
  <div className="relative mb-6 sm:mb-8">
    {/* 本の表紙表示 - レスポンシブレイアウト */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      {books.map((book, index) => (
        <Link href={`/storybook/${book.id}`} key={book.id}>
          <div
            className="group cursor-pointer relative mx-auto"
            style={{
              transform: `rotate(${(Math.random() - 0.5) * 2}deg)`,
              zIndex: index,
            }}
          >
            {/* 本の表紙 */}
            <div className="relative w-full max-w-32 sm:max-w-40 md:max-w-44 lg:max-w-48 aspect-[3/4] bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 sm:hover:-translate-y-4 hover:scale-105 hover:rotate-0">
              {/* 表紙画像 */}
              {book.coverImage ? (
                <Image
                  alt={book.title}
                  className="object-cover rounded-lg"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  src={book.coverImage}
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${book.spineColor} rounded-lg flex items-center justify-center`}
                >
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 lg:h-16 lg:w-16 text-white opacity-60" />
                </div>
              )}

              {/* モダンなオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />

              {/* AI バッジ */}
              {book.isAIGenerated && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <div className="bg-black/80 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                    AI
                  </div>
                </div>
              )}

              {/* 評価バッジ */}
              {book.rating && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <div className="bg-white/90 text-gray-900 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                    {book.rating}
                  </div>
                </div>
              )}

              {/* タイトルオーバーレイ */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4 rounded-b-lg">
                <h3 className="text-white font-bold text-xs sm:text-sm lg:text-base line-clamp-2 mb-0.5 sm:mb-1">
                  {book.title}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm line-clamp-1">
                  {book.subtitle}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>

    {/* 棚板 */}
    <div className="absolute -bottom-1 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    <div className="absolute -bottom-2 sm:-bottom-3 left-3 sm:left-4 right-3 sm:right-4 h-1 sm:h-1.5 bg-gray-200 rounded-full shadow-sm" />
  </div>
);

export default function BookListClient() {
  const [windowWidth, setWindowWidth] = React.useState(0);
  const {
    data: booksData,
    error,
    isLoading,
    refetch,
  } = trpc.story.getUserBooks.useQuery();

  // ウィンドウサイズ変更の監視
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // 初期値設定
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // データの変換
  const books: Book[] = React.useMemo(() => {
    return (booksData ?? []).map((book) => ({
      coverImage: book.pages[0]?.imageUrl ?? undefined,
      createdAt:
        typeof book.createdAt === "string"
          ? book.createdAt
          : new Date(book.createdAt).toISOString(),
      id: book.id,
      isAIGenerated: true,
      pageCount: book.totalPages,
      spineColor: "from-blue-400 to-purple-500",
      subtitle: book.subtitle ?? "",
      title: book.title,
    }));
  }, [booksData]);

  // レスポンシブ棚分け
  const shelves = React.useMemo(() => {
    const booksPerShelf = windowWidth >= 768 ? 3 : 2;
    const result = [];
    for (let i = 0; i < books.length; i += booksPerShelf) {
      result.push(books.slice(i, i + booksPerShelf));
    }
    return result;
  }, [books, windowWidth]);

  // ローディング中の表示
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <p className="text-gray-600">本を読み込み中...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-600 mb-4">本の読み込みに失敗しました。</p>
              <Button onClick={() => void refetch()}>
                <RotateCcw className="h-4 w-4 mr-2" />
                再読み込み
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Main Library Section */}
      <section className="py-8 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-12">
            {/* ページタイトルと本作成ボタン */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  生成した本 一覧
                </h3>
                <p className="text-gray-600">
                  {books.length > 0
                    ? `${books.length}冊のAI生成ストーリー`
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
            <div className="relative p-4 pt-6">
              {books.length > 0 ? (
                shelves.map((shelfBooks, index) => (
                  <BookshelfShelf
                    _shelfNumber={index + 1}
                    books={shelfBooks}
                    key={index}
                  />
                ))
              ) : (
                /* 空の状態用CTAエリア */
                <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 mx-2">
                  <div className="max-w-md mx-auto px-4">
                    <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      まだ本がありません
                    </h4>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                      AIを使って、あなただけの素敵な物語を作成してみませんか？
                    </p>
                    <Link href="/ai-create">
                      <Button className="bg-gray-900 hover:bg-black text-white font-medium gap-2 shadow-lg px-6 sm:px-8 py-3">
                        <Plus className="h-5 w-5" />
                        最初の本を作成
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ページネーション情報 */}
          {books.length > 0 && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="text-sm text-gray-600">
                コレクション {books.length}冊を表示中
              </div>
            </div>
          )}
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
