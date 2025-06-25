import { Progress } from "@/components/ui/progress";

interface BookHeaderProps {
  currentPage: number;
  progress: number;
  subtitle?: string;
  title?: string;
  totalPages: number;
}

export function BookHeader({
  currentPage,
  progress,
  subtitle,
  title,
  totalPages,
}: BookHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-4 text-3xl md:text-4xl font-medium text-neutral-800 tracking-wide leading-tight">
        {title}
      </h1>
      <p className="text-lg text-neutral-600 font-normal leading-relaxed">
        {subtitle}
      </p>

      {/* Progress */}
      <div className="mt-5 mx-auto max-w-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-neutral-600">
            {currentPage + 1} / {totalPages}
          </span>
          <span className="text-sm font-medium text-neutral-600">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress className="h-2 bg-neutral-200" value={progress} />
      </div>
    </div>
  );
}
