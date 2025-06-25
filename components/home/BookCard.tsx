import Link from "next/link";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import { type BookWithPages } from "./types";

interface BookCardProps {
  book: BookWithPages;
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  return (
    <Link href={`/storybook/${book.id}`}>
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
          {book.pages[0]?.imageUrl ? (
            <Image
              alt={book.title}
              className="object-cover rounded-lg"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={book.pages[0].imageUrl}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 lg:h-16 lg:w-16 text-white opacity-60" />
            </div>
          )}

          {/* モダンなオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />

          {/* AI バッジ */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <div className="bg-black/80 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
              AI
            </div>
          </div>

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
  );
}
