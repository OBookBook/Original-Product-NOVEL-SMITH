import { type BookWithPages } from "./types";
import BookCard from "./BookCard";
import EmptyBookshelf from "./EmptyBookshelf";

interface BookShelfProps {
  desktopShelves: BookWithPages[][];
  hasBooks: boolean;
  mobileShelves: BookWithPages[][];
}

export default function BookShelf({
  desktopShelves,
  hasBooks,
  mobileShelves,
}: BookShelfProps) {
  if (!hasBooks) return <EmptyBookshelf />;

  return (
    <>
      {/* モバイル表示 (SP: 2冊/棚) */}
      <div className="md:hidden space-y-6">
        {mobileShelves.map((shelfBooks, shelfIndex) => (
          <div className="relative" key={`mobile-${shelfIndex}`}>
            <div className="grid grid-cols-2 gap-3 px-3 py-4">
              {shelfBooks.map((book, index) => (
                <BookCard book={book} index={index} key={book.id} />
              ))}
            </div>
            {/* 棚板 */}
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <div className="absolute -bottom-2 left-3 right-3 h-1 bg-gray-200 rounded-full shadow-sm" />
          </div>
        ))}
      </div>

      {/* デスクトップ表示 (PC・タブレット: 3冊/棚) */}
      <div className="hidden md:block space-y-6 sm:space-y-8">
        {desktopShelves.map((shelfBooks, shelfIndex) => (
          <div className="relative" key={`desktop-${shelfIndex}`}>
            <div className="grid grid-cols-3 gap-4 lg:gap-6 px-4 lg:px-6 py-4 sm:py-6">
              {shelfBooks.map((book, index) => (
                <BookCard book={book} index={index} key={book.id} />
              ))}
            </div>
            {/* 棚板 */}
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <div className="absolute -bottom-2 left-4 right-4 h-1.5 bg-gray-200 rounded-full shadow-sm" />
          </div>
        ))}
      </div>
    </>
  );
}
