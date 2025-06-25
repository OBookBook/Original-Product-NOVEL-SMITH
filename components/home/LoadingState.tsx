interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "本を読み込み中...",
}: LoadingStateProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
