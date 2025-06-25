import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  currentPage: number;
  title?: string;
}

export function PageHeader({ currentPage, title }: PageHeaderProps) {
  return (
    <div className="flex-1 p-4 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center bg-white">
      <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 lg:space-y-8 text-center">
        <div>
          <span className="text-sm font-semibold text-neutral-500 tracking-[0.2em] uppercase">
            Chapter {currentPage + 1}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 leading-tight tracking-wide">
          {title ?? ""}
        </h2>
        <Separator className="mx-auto w-16 bg-neutral-300" />
      </div>
    </div>
  );
}
