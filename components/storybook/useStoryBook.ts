import { useEffect, useState } from "react";
import { trpc } from "@/trpc/react";

interface UseStoryBookProps {
  bookId?: string;
}

export function useStoryBook({ bookId }: UseStoryBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNavButtons, setShowNavButtons] = useState(false);

  const {
    data: bookData,
    error,
    isLoading,
  } = trpc.story.getBookById.useQuery({
    bookId: bookId!,
  });

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const pages = bookData?.pages.map((page) => ({
    illustration: page.imageUrl ? `🖼️` : "📖",
    pageNumber: page.pageNumber,
    text: page.content,
    title: page.title,
  }));

  const getCurrentPage = (index: number) => {
    if (index >= 0 && index < (pages?.length ?? 0)) {
      return pages?.at(index);
    }
    return;
  };

  const currentPageData = getCurrentPage(currentPage);
  const currentBookPage = bookData?.pages.at(currentPage);
  const progress = ((currentPage + 1) / (pages?.length ?? 0)) * 100;

  const nextPage = () => {
    if (currentPage < (pages?.length ?? 0) - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(pageIndex);
    }
  };

  const resetStory = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentPage(0);
    }
  };

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < (pages?.length ?? 0) - 1;

  return {
    bookData,
    canGoNext,
    canGoPrev,
    currentBookPage,
    currentPage,
    currentPageData,
    error,
    goToPage,
    isAnimating,
    isLoading,
    nextPage,
    pages,
    prevPage,
    progress,
    resetStory,
    setShowNavButtons,
    showNavButtons,
  };
}
