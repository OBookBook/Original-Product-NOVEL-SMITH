import { useMemo } from "react";
import { type BookWithPages } from "./types";

interface UseBookShelvesReturn {
  desktopShelves: BookWithPages[][];
  mobileShelves: BookWithPages[][];
}

/**
 * 本をレスポンシブな棚に分けるカスタムフック
 * @param books - 本のデータ配列
 * @returns モバイル用（2冊/棚）とデスクトップ用（3冊/棚）の棚データ
 */
export function useBookShelves(
  books: BookWithPages[] | undefined,
): UseBookShelvesReturn {
  return useMemo(() => {
    if (!books || books.length === 0)
      return { desktopShelves: [], mobileShelves: [] };

    const mobileShelves: BookWithPages[][] = [];
    const desktopShelves: BookWithPages[][] = [];
    for (let i = 0; i < books.length; i += 2)
      mobileShelves.push(books.slice(i, i + 2)); // モバイル用: 2冊ごとに棚を作成
    for (let i = 0; i < books.length; i += 3)
      desktopShelves.push(books.slice(i, i + 3)); // デスクトップ用: 3冊ごとに棚を作成

    return { desktopShelves, mobileShelves };
  }, [books]);
}
