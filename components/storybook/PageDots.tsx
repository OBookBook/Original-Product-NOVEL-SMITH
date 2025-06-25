interface PageDotsProps {
  currentPage: number;
  isAnimating: boolean;
  onGoToPage: (pageIndex: number) => void;
  totalPages: number;
}

export function PageDots({
  currentPage,
  isAnimating,
  onGoToPage,
  totalPages,
}: PageDotsProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentPage
                ? "bg-neutral-800 w-6"
                : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            disabled={isAnimating}
            key={index}
            onClick={() => onGoToPage(index)}
          />
        ))}
      </div>
    </div>
  );
}
