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
子供向け絵本「${prompt}」を作成してください。

【絵本作成の指針】
- 対象年齢：3歳
- 教育的価値がある内容
- 温かみのある親しみやすい文体
- 1ページのみの短い構成（開発中のため）
- シンプルで完結した内容
- 色鮮やかで魅力的な挿絵を想像できる内容

以下のJSON形式で返してください（必ず1ページのみ作成）：
{
  "title": "魅力的で覚えやすい本のタイトル",
  "subtitle": "本のサブタイトル（任意）",
  "pages": [
    {
      "title": "ページのタイトル",
      "content": "読み聞かせに適した完結した短い文章（60-100文字程度、ひらがな・カタカナ中心）",
      "imagePrompt": "Children's picture book illustration, [specific scene description], cute and simple character design, soft watercolor style, warm pastel colors, hand-drawn look, storybook art, whimsical and charming atmosphere, child-friendly"
    }
  ]
}

【1ページストーリー構成の例】
- 主人公の紹介と簡潔な出来事
- 優しいメッセージや教訓を含む
- 完結した内容で読み手が満足できる構成
- 視覚的に魅力的な1つの場面を描写

画像プロンプトには以下の絵本スタイル要素を必ず含めてください：
- children's picture book illustration (必須)
- cute and simple character design (シンプルで可愛らしいキャラクター)
- soft watercolor style または hand-drawn look (水彩画風または手描き風)
- warm pastel colors (温かいパステルカラー)
- whimsical and charming atmosphere (幻想的で魅力的な雰囲気)
- child-friendly (子供向け)
- storybook art (絵本アート)
- 具体的な場面描写
- キャラクターの表情や動作
- 背景の詳細

※リアルすぎる表現は避け、絵本らしい優しく温かみのあるイラストスタイルを重視してください
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
