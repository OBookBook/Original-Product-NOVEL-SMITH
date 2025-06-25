import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface PageImageProps {
  canGoNext: boolean;
  canGoPrev: boolean;
  currentPage: number;
  illustration?: string;
  imageUrl?: string;
  isAnimating: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  setShowNavButtons: (show: boolean) => void;
  showNavButtons: boolean;
  title?: string;
}

export function PageImage({
  canGoNext,
  canGoPrev,
  currentPage,
  illustration,
  imageUrl,
  isAnimating,
  onNextPage,
  onPrevPage,
  setShowNavButtons,
  showNavButtons,
  title,
}: PageImageProps) {
  return (
    <div
      className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center"
      onMouseEnter={() => setShowNavButtons(true)}
      onMouseLeave={() => setShowNavButtons(false)}
    >
      {/* Left Navigation Button */}
      <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-neutral-300
            hover:bg-white hover:scale-125 hover:shadow-xl hover:border-neutral-400
            active:scale-110 active:shadow-lg
            transition-all duration-300 ease-out
            group
            opacity-100 translate-x-0
            md:opacity-0 md:-translate-x-4
            ${showNavButtons ? "md:opacity-100 md:translate-x-0" : ""}
            ${canGoPrev ? "cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
          disabled={!canGoPrev || isAnimating}
          onClick={onPrevPage}
          size="lg"
          variant="ghost"
        >
          <ChevronLeft
            className="h-5 w-5 md:h-6 md:w-6 text-neutral-700
            group-hover:text-neutral-800 group-hover:scale-110
            transition-all duration-300 ease-out"
          />
        </Button>
      </div>

      {/* Image */}
      <div className="w-full h-80 md:h-96 lg:h-[700px] relative">
        {imageUrl ? (
          <Image
            alt={title ?? ""}
            className="object-cover"
            fill
            priority={currentPage === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            src={imageUrl}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
            <div className="text-6xl md:text-7xl lg:text-8xl opacity-80">
              {illustration ?? ""}
            </div>
          </div>
        )}
      </div>

      {/* Right Navigation Button */}
      <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-neutral-300
            hover:bg-white hover:scale-125 hover:shadow-xl hover:border-neutral-400
            active:scale-110 active:shadow-lg
            transition-all duration-300 ease-out
            group
            opacity-100 translate-x-0
            md:opacity-0 md:translate-x-4
            ${showNavButtons ? "md:opacity-100 md:translate-x-0" : ""}
            ${canGoNext ? "cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
          disabled={!canGoNext || isAnimating}
          onClick={onNextPage}
          size="lg"
          variant="ghost"
        >
          <ChevronRight
            className="h-5 w-5 md:h-6 md:w-6 text-neutral-700
            group-hover:text-neutral-800 group-hover:scale-110
            transition-all duration-300 ease-out"
          />
        </Button>
      </div>

      {/* Touch Areas for Mobile */}
      <div className="absolute inset-0 md:flex hidden">
        <button
          aria-label="前のページ"
          className="flex-1 opacity-0 cursor-pointer"
          disabled={!canGoPrev || isAnimating}
          onClick={onPrevPage}
        />
        <button
          aria-label="次のページ"
          className="flex-1 opacity-0 cursor-pointer"
          disabled={!canGoNext || isAnimating}
          onClick={onNextPage}
        />
      </div>
    </div>
  );
}
