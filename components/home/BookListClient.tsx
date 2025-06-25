"use client";

import { trpc } from "@/trpc/react";
import React from "react";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import BookListHeader from "./BookListHeader";
import BookshelfContainer from "./BookshelfContainer";
import BookShelf from "./BookShelf";
import BookCollectionInfo from "./BookCollectionInfo";
import FloatingActionButton from "./FloatingActionButton";
import { useBookShelves } from "./useBookShelves";

export default function BookListClient() {
  const {
    data: booksData,
    error,
    isLoading,
    refetch,
  } = trpc.story.getUserBooks.useQuery();
  const { desktopShelves, mobileShelves } = useBookShelves(booksData);
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={() => void refetch()} />;
  const bookCount = booksData?.length ?? 0;

  return (
    <main className="bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Main Library Section */}
      <section className="py-8 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <BookListHeader bookCount={bookCount} />
          {/* Modern Bookshelf */}
          <BookshelfContainer>
            <BookShelf
              desktopShelves={desktopShelves}
              hasBooks={bookCount > 0}
              mobileShelves={mobileShelves}
            />
          </BookshelfContainer>
          {/* ページネーション情報 */}
          <BookCollectionInfo bookCount={bookCount} />
        </div>
      </section>
      {/* フローティングアクションボタン (モバイル向け) */}
      <FloatingActionButton />
    </main>
  );
}
