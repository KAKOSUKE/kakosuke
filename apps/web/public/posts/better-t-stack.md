## 多機能なT3 Stack環境を構築する `Better-T Stack`

### 概要

`create-t3-app`は、T3 Stack（Next.js, TypeScript, tRPC, Prisma, NextAuth.js, Tailwind CSS）の環境を迅速に構築するための標準的なCLIツールです。しかし、開発プロジェクトの要件によっては、より多くの技術選択肢や、モバイル・デスクトップ対応、モノレポ構成など、より高度な設定が初期段階で求められる場合があります。

本稿では、標準のT3 Stackを拡張し、より柔軟で多機能なプロジェクトの雛形を生成するCLIツール `Better-T Stack`について解説します。

### `Better-T Stack`とは

`Better-T Stack`は、TypeScriptによるエンドツーエンドの型安全性を確保したプロジェクトの雛形を生成するためのCLIツールです。対話形式のウィザードを通じて、開発者はプロジェクトの要件に合わせて使用する技術を細かく選択できます。

`create-t3-app`が提供するT3 Stackをベースとしながらも、バックエンドフレームワークの選択、マルチプラットフォーム対応、ORMの選択肢追加など、多くの点で機能が拡張されています。

### `Better-T Stack`の主な機能

このツールが提供する主な機能は以下の通りです。

#### 1\. 対話形式による柔軟なセットアップ

CLIを実行すると対話形式のウィザードが起動し、プロジェクト名、使用するフレームワーク、データベース、認証方法などを順に選択していくだけで、必要な設定が施されたプロジェクトが生成されます。

#### 2\. 広範な技術選択肢

標準のT3 Stackで固定されている部分について、複数の選択肢を提供します。

以下は代表的な選択肢です（2025年7月現在）：

| カテゴリ | 選択肢と説明 |
| :--- | :--- |
| **Web Frontend** | **TanStack Router**: Modern type-safe router for React <br>**React Router**: Declarative routing for React <br>**TanStack Start (vite)**: Full-stack React and Solid framework powered by TanStack Router <br>**Next.js**: React framework with hybrid rendering <br>**Nuxt**: Vue full-stack framework (SSR, SSG, hybrid) <br>**Svelte**: Cybernetically enhanced web apps <br>**Solid**: Simple and performant reactivity for building UIs <br>**No Web Frontend**: No web-based frontend |
| **Native Frontend** | **React Native + NativeWind**: Expo with NativeWind (Tailwind) <br>**React Native + Unistyles**: Expo with Unistyles <br>**No Native Frontend**: No native mobile frontend |
| **Backend** | **Hono**: Ultrafast web framework <br>**Next.js**: App Router and API Routes <br>**Elysia**: TypeScript web framework <br>**Express**: Popular Node.js framework <br>**Fastify**: Fast, low-overhead web framework for Node.js <br>**Convex**: Reactive backend-as-a-service <br>**No Backend**: Skip backend integration (frontend only) |
| **Runtime** | **Bun**: Fast JavaScript runtime & toolkit <br>**Node.js**: JavaScript runtime environment <br>**Cloudflare Workers**: Serverless runtime for the edge <br>**No Runtime**: No specific runtime |
| **Api** | **tRPC**: End-to-end typesafe APIs <br>**oRPC**: Typesafe APIs Made Simple <br>**No API**: No API layer (API routes disabled) |
| **Database** | **SQLite**: File-based SQL database <br>**PostgreSQL**: Advanced SQL database <br>**MySQL**: Popular relational database <br>**MongoDB**: NoSQL document database <br>**No Database**: Skip database integration |
| **Orm** | **Drizzle**: TypeScript ORM <br>**Prisma**: Next-gen ORM <br>**Mongoose**: Elegant object modeling tool <br>**No ORM**: Skip ORM integration |
| **Db Setup** | **Turso**: SQLite cloud database powered by libSQL <br>**Cloudflare D1**: Serverless SQLite database on Cloudflare Workers <br>**Neon Postgres**: Serverless PostgreSQL with Neon <br>**Prisma PostgreSQL**: Set up PostgreSQL with Prisma <br>**MongoDB Atlas**: Cloud MongoDB setup with Atlas <br>**Supabase**: Local Supabase stack (requires Docker) <br>**Docker**: Local database with Docker Compose <br>**Basic Setup**: No cloud DB integration |
| **Web Deploy** | **Cloudflare Workers**: Deploy to Cloudflare Workers <br>**No Deployment**: Skip deployment configuration |
| **Auth** | **Better Auth**: Simple authentication <br>**No Auth**: Skip authentication |
| **Package Manager** | **npm**: Default package manager <br>**pnpm**: Fast, disk space efficient <br>**bun**: All-in-one toolkit |
| **Addons** | **PWA**: Progressive Web App <br>**Tauri**: Desktop app support <br>**Starlight**: Documentation site with Astro <br>**Biome**: Linting & formatting <br>**Husky**: Git hooks & lint-staged <br>**Turborepo**: Monorepo build system |
| **Examples** | **Todo Example**: Simple todo application <br>**AI Example**: AI integration example using AI SDK |
| **Git** | **Git**: Initialize Git repository <br>**No Git**: Skip Git initialization |
| **Install** | **Install Dependencies**: Install packages automatically <br>**Skip Install**: Skip dependency installation |

これにより、プロジェクトの特性に合わせた最適な技術スタックを初期段階で採用できます。

#### 3\. マルチプラットフォーム対応

Webアプリケーションに加え、モバイルおよびデスクトップアプリケーションの雛形も同時に生成する能力を持ちます。

  * **モバイル:** Expo
  * **デスクトップ:** Tauri

これにより、単一のコードベースから複数のプラットフォームへの展開を視野に入れた開発をスムーズに開始できます。

#### 4\. モノレポ構成

生成されるプロジェクトは、Turborepoを利用したモノレポ（Monorepo）構成を標準で採用しています。これにより、Web、モバイル、共有パッケージなどの管理を一元化し、開発効率とコードの再利用性を高めます。

#### 5\. 認証機能の組み込み

`Better-Auth`という認証機能が組み込まれており、初期設定の段階で認証システムを導入できます。

### `Better-T Stack`の使用方法

`Better-T Stack`は`npx`を介して直接実行できます。

```bash
npx create-better-t-stack@latest
```

コマンド実行後、ウィザードの指示に従ってプロジェクトの設定を選択していくと、雛形の生成が完了します。

### まとめ

`Better-T Stack`は、標準の`create-t3-app`を拡張し、より多くの技術選択肢とマルチプラットフォーム対応、モノレポ構成などを提供する高機能なプロジェクトスカフォールディングツールです。

特定のORMやデータベースを使用したい場合や、初期段階からWeb以外のプラットフォームへの展開を計画している場合に、有力な選択肢となります。プロジェクトの要件に応じて、標準ツールとの使い分けを検討すると良いでしょう。

### 関連リンク

  * **GitHub Repository:** [https://github.com/AmanVarshney01/create-better-t-stack](https://github.com/AmanVarshney01/create-better-t-stack)