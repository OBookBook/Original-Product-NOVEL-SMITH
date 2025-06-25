"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LoadingView } from "./LoadingView";
import { ErrorView } from "./ErrorView";
import { BookHeader } from "./BookHeader";
import { PageHeader } from "./PageHeader";
import { PageImage } from "./PageImage";
import { PageText } from "./PageText";
import { PageDots } from "./PageDots";
import { ActionButtons } from "./ActionButtons";
import { useStoryBook } from "./useStoryBook";

interface StoryBookProps {
  bookId?: string;
}

export default function StoryBook({ bookId }: StoryBookProps = {}) {
  const {
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
  } = useStoryBook({ bookId });

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView />;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <div className="mx-auto max-w-4xl px-6">
        <BookHeader
          currentPage={currentPage}
          progress={progress}
          subtitle={bookData?.subtitle ?? undefined}
          title={bookData?.title}
          totalPages={pages?.length ?? 0}
        />

        {/* Book Page */}
        <Card className="mb-8 border border-neutral-200 shadow-lg bg-white">
          <CardContent className="p-0">
            <div
              className={`transition-all duration-400 ease-out ${
                isAnimating ? "opacity-40 scale-98" : "opacity-100 scale-100"
              }`}
            >
              <div className="flex flex-col min-h-[650px]">
                <PageHeader
                  currentPage={currentPage}
                  title={currentPageData?.title}
                />

                <PageImage
                  canGoNext={canGoNext}
                  canGoPrev={canGoPrev}
                  currentPage={currentPage}
                  illustration={currentPageData?.illustration}
                  imageUrl={currentBookPage?.imageUrl ?? undefined}
                  isAnimating={isAnimating}
                  onNextPage={nextPage}
                  onPrevPage={prevPage}
                  setShowNavButtons={setShowNavButtons}
                  showNavButtons={showNavButtons}
                  title={currentPageData?.title}
                />

                <PageText text={currentPageData?.text} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="space-y-6">
          <PageDots
            currentPage={currentPage}
            isAnimating={isAnimating}
            onGoToPage={goToPage}
            totalPages={pages?.length ?? 0}
          />

          <ActionButtons isAnimating={isAnimating} onReset={resetStory} />
        </div>
      </div>
    </div>
  );
}
