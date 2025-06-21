"use server";

import OpenAI from "openai";

/**
 * ストーリーデータの型定義
 * @interface StoryData
 * @description 絵本全体の構造を表現するオブジェクト
 */
export interface StoryData {
  /** ストーリーのページ配列 */
  pages: StoryPage[];
  /** 本のサブタイトル（オプション） */
  subtitle?: string;
  /** 本のタイトル */
  title: string;
}

/**
 * ストーリーページの型定義
 * @interface StoryPage
 * @description 絵本の1ページ分のデータを表現するオブジェクト
 */
export interface StoryPage {
  /** ページの文章内容（100-150文字程度が推奨） */
  content: string;
  /** 画像生成用のプロンプト（英語での詳細記述が推奨） */
  imagePrompt: string;
  /** ページのタイトル */
  title: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI GPT-4を使用してストーリー構造を生成する
 * @param {string} prompt - ユーザーが入力したストーリーのテーマ・プロンプト
 * @returns {Promise<StoryData>} 生成されたストーリーデータ
 * @throws {Error} ストーリー生成に失敗した場合
 * @example
 * ```typescript
 * const story = await generateStoryStructure("冒険する猫の物語");
 * console.log(story.title); // 生成されたタイトル
 * ```
 */
export async function generateStoryStructure(
  prompt: string,
): Promise<StoryData> {
  const storyStructurePrompt = createStoryPrompt(prompt);
  const structureCompletion =
    await callOpenAIForStoryGeneration(storyStructurePrompt);

  return processOpenAIResponse(structureCompletion);
}

/**
 * OpenAI APIを呼び出してストーリーを生成する
 * @param {string} storyStructurePrompt - ストーリー生成用のプロンプト
 * @returns {Promise<OpenAI.Chat.Completions.ChatCompletion>} OpenAI APIのレスポンス
 * @throws {Error} API呼び出しに失敗した場合
 * @private
 */
async function callOpenAIForStoryGeneration(
  storyStructurePrompt: string,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  return await openai.chat.completions.create({
    max_tokens: 2000,
    messages: [
      {
        content:
          "あなたは、プロヂュースする本を次々大ヒットさせてきた超一流の作家です。 タイトルを見ただけで手に取りたくなるような、魅力的で教育的な物語を作成してください。",
        role: "system",
      },
      { content: storyStructurePrompt, role: "user" },
    ],
    model: "gpt-4",
    temperature: 0.8,
  });
}

/**
 * ストーリー生成用のプロンプトを作成する
 * @param {string} prompt - ユーザー入力のテーマ
 * @returns {string} 構造化されたプロンプト文字列
 * @private
 * @example
 * ```typescript
 * const prompt = createStoryPrompt("冒険する猫");
 * // -> "絵本「冒険する猫」を作ってください\n\n以下のJSON形式で..."
 * ```
 */
function createStoryPrompt(prompt: string): string {
  return `
絵本「${prompt}」を作ってください

以下のJSON形式で返してください：
{
  "title": "本のタイトル",
  "subtitle": "本のサブタイトル",
  "pages": [
    {
      "title": "ページ1のタイトル",
      "content": "ページ1の文章内容（100-150文字程度）",
      "imagePrompt": "そのページの内容に合った画像生成用のプロンプト（英語で詳細に記述）"
    },
    {
      "title": "ページ2のタイトル",
      "content": "ページ2の文章内容（100-150文字程度）",
      "imagePrompt": "そのページの内容に合った画像生成用のプロンプト（英語で詳細に記述）"
    }
    // ... 2ページ程度
  ]
}
`;
}

/**
 * レスポンス文字列からStoryDataをパースする
 * @param {string} storyContent - OpenAI APIからの生レスポンス文字列
 * @returns {StoryData} パース済みのストーリーデータ
 * @throws {TypeError} 文字列型でない場合
 * @throws {SyntaxError} JSON解析に失敗した場合
 * @private
 * @example
 * ```typescript
 * const content = '```json\n{"title": "タイトル", "pages": []}\n```';
 * const story = parseStoryData(content);
 * ```
 */
function parseStoryData(storyContent: string): StoryData {
  const jsonMatch = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/.exec(storyContent);
  const jsonString = jsonMatch ? jsonMatch[1] : storyContent;
  if (typeof jsonString !== "string")
    throw new TypeError("ストーリーデータが無効です");
  const storyData = JSON.parse(jsonString) as StoryData;

  return storyData;
}

/**
 * OpenAI APIのレスポンスを処理してStoryDataを返す
 * @param {OpenAI.Chat.Completions.ChatCompletion} completion - OpenAI APIのレスポンス
 * @returns {StoryData} パース済みのストーリーデータ
 * @throws {Error} レスポンス処理に失敗した場合
 * @private
 */
function processOpenAIResponse(
  completion: OpenAI.Chat.Completions.ChatCompletion,
): StoryData {
  const storyContent = completion.choices[0]?.message?.content;
  if (!storyContent) throw new Error("ストーリー生成に失敗しました");

  try {
    return parseStoryData(storyContent);
  } catch (parseError) {
    console.error("JSONパースエラー:", parseError);
    console.error("生のレスポンス:", storyContent);
    throw new Error("ストーリーデータの解析に失敗しました");
  }
}
