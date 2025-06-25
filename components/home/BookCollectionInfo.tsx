interface BookCollectionInfoProps {
  bookCount: number;
}

export default function BookCollectionInfo({
  bookCount,
}: BookCollectionInfoProps) {
  if (bookCount === 0) return;

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="text-sm text-gray-600">
        コレクション {bookCount}冊を表示中
      </div>
    </div>
  );
}
