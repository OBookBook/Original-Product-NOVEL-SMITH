interface LoadingViewProps {
  message?: string;
}

export function LoadingView({
  message = "絵本を読み込み中...",
}: LoadingViewProps) {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">{message}</p>
      </div>
    </div>
  );
}
