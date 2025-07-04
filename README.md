# Novel Smith - AI絵本生成アプリケーション MVP開発

![Novel Smith トップ画像](<Document/Novel Smith Top_v1.0.0.png>)

## 概要

- ユーザーが簡単なプロンプトを入力することで、AIが自動的に子供向け絵本を生成するWebアプリケーションです
- 親子の読み聞かせ時間を豊かにするデジタル絵本プラットフォームを提供します

## 対象ユーザー

- 主要ターゲット: 幼児の子供を持つ親
- 副次ターゲット: 教育関係者、絵本愛好家

## 機能一覧

### MVP機能概要

Novel Smithは、AIを活用した子供向け絵本生成アプリケーションです。ユーザーが簡単なプロンプトを入力するだけで、3歳児向けの教育的な絵本を自動生成します。

### 主要機能

| 機能カテゴリ | 機能名                 | 説明                                                             |
| ------------ | ---------------------- | ---------------------------------------------------------------- |
| 認証機能     | ユーザー登録・ログイン | メールアドレスとパスワードによる認証、Google OAuth対応           |
|              | パスワードリセット     | メール送信によるパスワードリセット（24時間有効期限付きトークン） |
| 絵本生成     | AIストーリー生成       | GPT-4による3歳児向け物語生成（60-100文字）                       |
|              | AIイラスト生成         | DALL-E 3による子供向け絵本イラスト生成                           |
|              | プロンプト例機能       | 8種類の事前定義されたプロンプト例提供                            |
|              | 生成進捗表示           | リアルタイムでの生成状況確認                                     |
| 絵本閲覧     | 絵本一覧               | 作成した絵本の一覧表示・管理                                     |
|              | 絵本ビューアー         | ページめくり機能付きの絵本閲覧                                   |
| ユーザー管理 | プロフィール管理       | ユーザー情報の表示・編集                                         |
|              | 設定管理               | パスワード変更、アカウント設定                                   |

## システム概要

### アーキテクチャ

![インフラ構成図](<Document/Infrastructure Diagram_v1.0.0.png>)

- Language: TypeScript
- Frontend: Next.js(App Router), TailwindCSS(shadcn/ui), React Hook Form, tRPC Client, Zod
- Backend: Next.js API Routes, tRPC Server, bcrypt, Zod
- DB: PostgreSQL(Supabase)
- ORM: Prisma ORM
- Authentication: Auth.js, OAuth(Google), JWT
- Mail: Nodemailer
- Storage: Cloudinary
- OpenAI: GPT-4, DALL-E 3
- Testing: Vitest, Playwright(E2E)
- CI/CD: GitHub Actions
- Deployment: Vercel
- Other: Cursor, npm, Git, GitHub, ESLint, Prettier, Husky/lint-staged, T3 ENV

### データベース設計

### ER 図

![ER図](<Document/ER Diagram_v1.0.0.png>)

### テーブル定義

#### Account Table

認証プロバイダーアカウント情報を管理するテーブル

| カラム名          | データ型 | 制約                 | 説明                         |
| ----------------- | -------- | -------------------- | ---------------------------- |
| id                | String   | @id @default(cuid()) | プライマリキー               |
| userId            | String   | -                    | ユーザーID（外部キー）       |
| type              | String   | -                    | アカウントタイプ             |
| provider          | String   | -                    | 認証プロバイダー名           |
| providerAccountId | String   | -                    | プロバイダー側のアカウントID |
| refresh_token     | String?  | @db.Text             | リフレッシュトークン         |
| access_token      | String?  | @db.Text             | アクセストークン             |
| expires_at        | Int?     | -                    | トークン有効期限             |
| token_type        | String?  | -                    | トークンタイプ               |
| scope             | String?  | -                    | スコープ                     |
| id_token          | String?  | @db.Text             | IDトークン                   |
| session_state     | String?  | -                    | セッション状態               |

制約: `@@unique([provider, providerAccountId])`

#### User Table

ユーザー基本情報を管理するテーブル

| カラム名       | データ型  | 制約                 | 説明                   |
| -------------- | --------- | -------------------- | ---------------------- |
| id             | String    | @id @default(cuid()) | プライマリキー         |
| name           | String?   | -                    | ユーザー名             |
| email          | String    | @unique              | メールアドレス（一意） |
| emailVerified  | DateTime? | -                    | メール認証日時         |
| image          | String?   | -                    | プロフィール画像URL    |
| introduction   | String?   | -                    | 自己紹介               |
| isAdmin        | Boolean   | @default(false)      | 管理者フラグ           |
| hashedPassword | String?   | -                    | ハッシュ化パスワード   |
| createdAt      | DateTime  | @default(now())      | 作成日時               |
| updatedAt      | DateTime  | @updatedAt           | 更新日時               |

#### PasswordResetToken Table

パスワードリセットトークンを管理するテーブル

| カラム名  | データ型 | 制約                 | 説明                     |
| --------- | -------- | -------------------- | ------------------------ |
| id        | String   | @id @default(cuid()) | プライマリキー           |
| token     | String   | @unique              | リセットトークン（一意） |
| expiry    | DateTime | -                    | 有効期限                 |
| userId    | String   | -                    | ユーザーID（外部キー）   |
| createdAt | DateTime | @default(now())      | 作成日時                 |

#### Book Table

絵本の基本情報を管理するテーブル

| カラム名   | データ型 | 制約                 | 説明                 |
| ---------- | -------- | -------------------- | -------------------- |
| id         | String   | @id @default(cuid()) | プライマリキー       |
| title      | String   | -                    | 絵本タイトル         |
| subtitle   | String?  | -                    | サブタイトル         |
| prompt     | String   | @db.Text             | 生成プロンプト       |
| userId     | String   | -                    | 作成者ID（外部キー） |
| totalPages | Int      | @default(0)          | 総ページ数           |
| createdAt  | DateTime | @default(now())      | 作成日時             |
| updatedAt  | DateTime | @updatedAt           | 更新日時             |

インデックス: `@@index([userId])`

#### Page Table

絵本の各ページ情報を管理するテーブル

| カラム名   | データ型 | 制約                 | 説明               |
| ---------- | -------- | -------------------- | ------------------ |
| id         | String   | @id @default(cuid()) | プライマリキー     |
| bookId     | String   | -                    | 絵本ID（外部キー） |
| pageNumber | Int      | -                    | ページ番号         |
| title      | String   | -                    | ページタイトル     |
| imageUrl   | String?  | -                    | ページ画像URL      |
| content    | String   | @db.Text             | ページ内容         |
| createdAt  | DateTime | @default(now())      | 作成日時           |

制約: `@@unique([bookId, pageNumber])`
インデックス: `@@index([bookId])`

#### リレーション

- User → Account (1対多): ユーザーは複数の認証アカウントを持つ
- User → PasswordResetToken (1対多): ユーザーは複数のリセットトークンを持つ
- User → Book (1対多): ユーザーは複数の絵本を作成
- Book → Page (1対多): 絵本は複数のページを持つ

### 画面遷移図

![画面遷移図](<Document/Screen Transition Diagram_v1.0.0.png>)
