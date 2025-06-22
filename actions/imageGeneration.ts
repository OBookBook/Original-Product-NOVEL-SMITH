"use server";

import OpenAI from "openai";
import { createCloudImage } from "./cloudImage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI DALL-E 3を使用して画像を生成し、Cloudinaryにアップロードする
 * @param {string} imagePrompt - 画像生成用のプロンプト（英語推奨）
 * @returns {Promise<string | undefined>} 成功時はCloudinaryの画像URL、失敗時はundefined
 * @throws {Error} API呼び出しまたはアップロードに失敗した場合（内部でキャッチされる）
 * @example
 * ```typescript
 * const imageUrl = await generateAndUploadImage("A cute cat sitting on a rainbow");
 * if (imageUrl) {
 *   console.log("Generated image URL:", imageUrl);
 * }
 * ```
 * @description
 * この関数は以下の処理を順番に実行します：
 * 1. OpenAI DALL-E 3 APIで画像を生成
 * 2. 生成された画像をダウンロード
 * 3. Base64形式に変換
 * 4. Cloudinaryにアップロード
 * 5. CloudinaryのURLを返却
 */
export async function generateAndUploadImage(
  imagePrompt: string,
): Promise<string | undefined> {
  try {
    const imageResult = await generateImageWithDallE(imagePrompt);
    if (!imageResult.data?.[0]?.url) return undefined;

    return await downloadAndUploadImage(imageResult.data[0].url);
  } catch (error) {
    console.error("画像生成エラー:", error);
    return undefined;
  }
}

/**
 * ArrayBufferをBase64形式の画像データに変換する
 * @param {ArrayBuffer} imageBuffer - 変換するArrayBuffer
 * @returns {string} Base64形式の画像データ（data:image/png;base64,プレフィックス付き）
 * @private
 */
function convertArrayBufferToBase64(imageBuffer: ArrayBuffer): string {
  return `data:image/png;base64,${Buffer.from(imageBuffer).toString("base64")}`;
}

/**
 * 画像URLから画像をダウンロードしてCloudinaryにアップロードする
 * @param {string} imageUrl - ダウンロードする画像のURL
 * @returns {Promise<string | undefined>} 成功時はCloudinaryのURL、失敗時はundefined
 * @private
 */
async function downloadAndUploadImage(
  imageUrl: string,
): Promise<string | undefined> {
  try {
    const imageBuffer = await downloadImageAsArrayBuffer(imageUrl);
    if (!imageBuffer) return undefined;
    const base64Image = convertArrayBufferToBase64(imageBuffer);

    return await uploadToCloudinary(base64Image);
  } catch (error) {
    console.error("画像処理エラー:", error);
    return undefined;
  }
}

/**
 * 画像URLから画像をダウンロードしてArrayBufferとして取得する
 * @param {string} imageUrl - ダウンロードする画像のURL
 * @returns {Promise<ArrayBuffer | undefined>} 成功時はArrayBuffer、失敗時はundefined
 * @private
 */
async function downloadImageAsArrayBuffer(
  imageUrl: string,
): Promise<ArrayBuffer | undefined> {
  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error("画像ダウンロードに失敗:", imageResponse.statusText);
      return undefined;
    }

    return await imageResponse.arrayBuffer();
  } catch (error) {
    console.error("画像ダウンロードエラー:", error);
    return undefined;
  }
}

/**
 * OpenAI DALL-E 3 APIを使用して画像を生成する
 * @param {string} imagePrompt - 画像生成用のプロンプト
 * @returns {Promise<OpenAI.Images.ImagesResponse>} DALL-E APIのレスポンス
 * @private
 */
async function generateImageWithDallE(
  imagePrompt: string,
): Promise<OpenAI.Images.ImagesResponse> {
  // 日本の絵本スタイルを強化するプロンプトを作成
  const enhancedPrompt = `${imagePrompt}, Japanese children's picture book illustration, cute simple characters, soft watercolor painting style, warm gentle colors, hand-drawn artistic style, innocent and heartwarming, traditional Japanese storybook art, simple line art, friendly expressions, pastoral scenery, wholesome family-friendly`;

  return await openai.images.generate({
    model: "dall-e-3",
    n: 1,
    prompt: enhancedPrompt,
    quality: "standard",
    size: "1024x1024",
    style: "natural",
  });
}

/**
 * Base64画像データをCloudinaryにアップロードする
 * @param {string} base64Image - Base64形式の画像データ
 * @returns {Promise<string>} Cloudinaryにアップロードされた画像のURL
 * @throws {Error} アップロードに失敗した場合
 * @private
 */
async function uploadToCloudinary(base64Image: string): Promise<string> {
  const cloudinaryResult = await createCloudImage(base64Image);
  return cloudinaryResult.url;
}
