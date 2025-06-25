import { privateProcedure, router } from "@/trpc/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import {
  generateStoryStructure,
  type StoryData,
} from "@/actions/storyGeneration";
import { generateAndUploadImage } from "@/actions/imageGeneration";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

/**
 * Book作成の戻り値の型定義
 */
interface BookCreationResult {
  book: BookWithPages | null;
  bookId: string;
  message: string;
  success: boolean;
}

// Prismaの型を使用してBookの型を定義
type BookWithPages = Prisma.BookGetPayload<{
  include: {
    pages: true;
  };
}>;

/**
 * ページ作成結果の型定義
 */
interface PageCreationResult {
  pageId: string;
  success: boolean;
}

export const storyRouter = router({
  generateBook: privateProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "プロンプトを入力してください"),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<BookCreationResult> => {
      const { prompt } = input;
      const userId = getValidatedUserId(ctx);

      try {
        const book = await createInitialBook(userId, prompt);
        const storyData = await generateStoryStructure(prompt);
        const createdPagesCount = await generateStoryPages(book.id, storyData);
        await updateBookWithResults(book.id, storyData, createdPagesCount);
        const completedBook = await getCompletedBook(book.id);
        revalidateCaches();

        return {
          book: completedBook,
          bookId: book.id,
          message: "絵本が正常に生成されました",
          success: true,
        };
      } catch (error) {
        console.error("Story generation failed:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ストーリー生成に失敗しました",
        });
      }
    }),

  getBook: privateProcedure
    .input(
      z.object({
        bookId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = getValidatedUserId(ctx);
      if (input.bookId) return await getBookById(input.bookId, userId);

      return await getLatestBook(userId);
    }),

  getBookById: privateProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = getValidatedUserId(ctx);
      return await getBookById(input.bookId, userId);
    }),

  getLatestBook: privateProcedure.query(async ({ ctx }) => {
    const userId = getValidatedUserId(ctx);
    return await getLatestBook(userId);
  }),

  getUserBooks: privateProcedure.query(async ({ ctx }) => {
    return await getUserBooksList(getValidatedUserId(ctx));
  }),
});

/**
 * 初期Bookレコードを作成する
 * @private
 * @param userId - ユーザーID
 * @param prompt - プロンプト
 * @returns 作成されたBookレコード
 */
async function createInitialBook(userId: string, prompt: string) {
  return await prisma.book.create({
    data: {
      prompt: prompt.trim(),
      subtitle: undefined,
      title: "生成中...",
      totalPages: 0,
      userId: userId,
    },
  });
}

/**
 * Pageレコードを作成する
 * @private
 * @param bookId - BookのID
 * @param pageData - ページデータ
 * @param pageNumber - ページ番号
 * @returns 作成されたPageレコード
 */
async function createPageRecord(
  bookId: string,
  pageData: { content?: string; imagePrompt?: string; title?: string },
  pageNumber: number,
) {
  return await prisma.page.create({
    data: {
      bookId: bookId,
      content: pageData.content ?? "内容を生成中...",
      imageUrl: undefined,
      pageNumber: pageNumber,
      title: pageData.title ?? `ページ ${pageNumber}`,
    },
  });
}

/**
 * 単一ページを作成し、画像を生成する
 * @param bookId - BookのID
 * @param pageData - ページデータ
 * @param pageNumber - ページ番号
 * @returns ページ作成結果
 */
async function createPageWithImage(
  bookId: string,
  pageData: { content?: string; imagePrompt?: string; title?: string },
  pageNumber: number,
): Promise<PageCreationResult | undefined> {
  if (!pageData) return undefined;
  try {
    const page = await createPageRecord(bookId, pageData, pageNumber);
    if (pageData.imagePrompt)
      await generateAndAttachImage(page.id, pageData.imagePrompt, pageNumber);

    return { pageId: page.id, success: true };
  } catch (error) {
    console.error(`Page creation failed for page ${pageNumber}:`, error);
    return undefined;
  }
}

/**
 * BookとそのPagesを取得する
 * @private
 * @param bookId - BookのID
 * @param userId - ユーザーID
 * @returns BookとPages（存在しない場合はnull）
 */
async function findBookWithPages(bookId: string, userId: string) {
  return await prisma.book.findUnique({
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
      },
    },
    where: { id: bookId, userId: userId },
  });
}

/**
 * 画像を生成してページに添付する
 * @param pageId - ページID
 * @param imagePrompt - 画像生成プロンプト
 * @param pageNumber - ページ番号（ログ用）
 */
async function generateAndAttachImage(
  pageId: string,
  imagePrompt: string,
  pageNumber: number,
): Promise<void> {
  try {
    const imageUrl = await generateAndUploadImage(imagePrompt);
    if (!imageUrl)
      return console.warn(`Image generation failed for page ${pageNumber}`);
    await prisma.page.update({
      data: { imageUrl },
      where: { id: pageId },
    });
  } catch (imageError) {
    console.error(
      `Image generation failed for page ${pageNumber}:`,
      imageError,
    );
  }
}

/**
 * ストーリーのページを作成し、画像を生成する（逐次処理）
 * @param bookId - BookのID
 * @param storyData - AIで生成されたストーリーデータ
 * @returns 作成されたページ数
 */
async function generateStoryPages(
  bookId: string,
  storyData: StoryData,
): Promise<number> {
  if (!storyData.pages?.length) return 0;
  let successCount = 0;
  for (const [index, pageData] of storyData.pages.entries()) {
    if (!pageData) continue;
    try {
      const result = await createPageWithImage(bookId, pageData, index + 1);
      if (result) successCount++;
    } catch (error) {
      console.error(`Page ${index + 1} creation failed:`, error);
    }
    if (index < storyData.pages.length - 1)
      await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return successCount;
}

/**
 * 特定のBookを取得する
 * @param bookId - BookのID
 * @param userId - ユーザーID
 * @returns Bookデータ
 */
async function getBookById(bookId: string, userId: string) {
  const book = await findBookWithPages(bookId, userId);
  if (!book)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "指定された本が見つかりません",
    });

  return book;
}

/**
 * 完成したBookのデータを取得する
 * @param bookId - BookのID
 * @returns 完成したBookデータ
 */
async function getCompletedBook(bookId: string) {
  return await prisma.book.findUnique({
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
      },
    },
    where: { id: bookId },
  });
}

/**
 * 最新のBookを取得する
 * @param userId - ユーザーID
 * @returns 最新のBookデータ
 */
async function getLatestBook(userId: string) {
  return await prisma.book.findFirst({
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
    where: {
      userId: userId,
    },
  });
}

/**
 * ユーザーのBook一覧を取得する
 * @param userId - ユーザーID
 * @returns Book一覧
 */
async function getUserBooksList(userId: string) {
  return await prisma.book.findMany({
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
    where: {
      userId: userId,
    },
  });
}

/**
 * ユーザーIDをバリデーションして取得する
 * @param ctx - tRPCコンテキスト
 * @returns バリデーション済みのユーザーID
 * @throws {TRPCError} 認証エラー
 */
function getValidatedUserId(ctx: { user: { id?: string } }): string {
  const userId = ctx.user.id;
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "ユーザー認証が必要です",
    });
  }

  return userId;
}

/**
 * 関連するキャッシュを更新する
 */
function revalidateCaches(): void {
  revalidatePath("/ai-create");
  revalidatePath("/storybook");
}

/**
 * Bookの詳細情報を更新する
 * @param bookId - BookのID
 * @param storyData - ストーリーデータ
 * @param totalPages - 作成されたページ数
 */
async function updateBookWithResults(
  bookId: string,
  storyData: StoryData,
  totalPages: number,
): Promise<void> {
  await prisma.book.update({
    data: {
      subtitle: storyData.subtitle ?? undefined,
      title: storyData.title ?? "無題の絵本",
      totalPages: totalPages,
    },
    where: { id: bookId },
  });
}
