interface PageTextProps {
  text?: string;
}

export function PageText({ text }: PageTextProps) {
  return (
    <div className="flex-1 p-4 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="prose prose-neutral max-w-none">
          <p
            className="text-base md:text-lg leading-relaxed text-neutral-700 font-normal max-w-2xl mx-auto"
            style={{ letterSpacing: "0.02em", lineHeight: "1.8" }}
          >
            {text ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}
