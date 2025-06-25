# Novel Smith - AI絵本生成アプリケーション MVP開発

![Novel Smith トップ画像](<Document/Novel Smith Top_v1.0.0.png>)

## 概要

- ユーザーが簡単なプロンプトを入力することで、AIが自動的に子供向け絵本を生成するWebアプリケーションです
- 親子の読み聞かせ時間を豊かにするデジタル絵本プラットフォームの提供する

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

### ER 図

![ER図](<Document/ER Diagram_v1.0.0.png>)

### 画面遷移図

![画面遷移図](<Document/Screen Transition Diagram_v1.0.0.png>)

## ライセンス

### プロプライエタリライセンス

Copyright (c) 2025 Novel Smith. All rights reserved.
本ソフトウェアおよび関連文書ファイル（以下「ソフトウェア」）は、著作権法および国際条約により保護されています。

### 利用制限

- **複製・改変の禁止**: 本プロジェクトのソースコード、デザイン、コンテンツの無断複製・改変を許可しません
- **商用利用の制限**: 本プロジェクトを商用目的で利用することを許可しません
- **リバースエンジニアリングの禁止**: 本ソフトウェアの逆コンパイル、逆アセンブル、リバースエンジニアリングを許可しません
- **著作権侵害の禁止**: 本プロジェクトの著作権、商標権、その他の知的財産権を侵害する行為を許可しません
- **第三者への提供禁止**: 本プロジェクトのソースコードを第三者に提供・共有することを許可しません
