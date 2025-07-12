# kakosuke

このプロジェクトは、React、TanStack Router、Hono、tRPC などを組み合わせたモダンな TypeScript スタックである [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) を使用して作成されました。

## 特徴

-   **TypeScript** - 型安全性による開発体験の向上
-   **TanStack Router** - 完全な型安全性を備えたファイルベースルーティング
-   **TailwindCSS** - UI 開発を迅速に行うためのユーティリティファーストな CSS フレームワーク
-   **shadcn/ui** - 再利用可能な UI コンポーネント
-   **Hono** - 軽量で高性能なサーバーフレームワーク
-   **tRPC** - エンドツーエンドの型安全な API
-   **Cloudflare Workers** - サーバーレス実行環境
-   **Drizzle** - TypeScript ファーストな ORM
-   **SQLite/Turso** - データベースエンジン
-   **Turborepo** - 最適化されたモノレポビルドシステム
-   **Biome** - Linting とフォーマット
-   **Husky** - コード品質を保証するための Git フック

## はじめに

まず、依存関係をインストールします。

```bash
bun install
```

## データベースのセットアップ

このプロジェクトでは、Drizzle ORM と SQLite を使用しています。

1.  ローカルの SQLite データベースを起動します。
    Cloudflare D1 データベースのローカル開発は、`wrangler dev` コマンドの一部として既に実行されます。

2.  必要に応じて、`apps/server` ディレクトリ内の `.env` ファイルを適切な接続情報で更新します。

3.  スキーマをデータベースに適用します。

```bash
bun db:push
```

次に、開発サーバーを起動します。

```bash
bun dev
```

ブラウザで [http://localhost:3001](http://localhost:3001) を開くと、ウェブアプリケーションが表示されます。
API は [http://localhost:3000](http://localhost:3000) で実行されています。

## プロジェクト構造

```
kakosuke/
├── apps/
│   ├── web/         # フロントエンドアプリケーション (React + TanStack Router)
│   └── server/      # バックエンド API (Hono, tRPC)
```

## 利用可能なスクリプト

-   `bun dev`: すべてのアプリケーションを開発モードで起動します
-   `bun build`: すべてのアプリケーションをビルドします
-   `bun dev:web`: ウェブアプリケーションのみを起動します
-   `bun dev:server`: サーバーのみを起動します
-   `bun check-types`: すべてのアプリで TypeScript の型チェックを実行します
-   `bun db:push`: スキーマの変更をデータベースにプッシュします
-   `bun db:studio`: データベーススタジオ UI を開きます
-   `cd apps/server && bun db:local`: ローカルの SQLite データベースを起動します
-   `bun check`: Biome によるフォーマットと Lint を実行します