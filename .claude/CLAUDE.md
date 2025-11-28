# CLAUDE.md

cc-wf-studio-connectors の開発ガイド。

## プロジェクト概要

cc-wf-studio（VSCode拡張）の Slack 連携用 OAuth 認証サーバー。Cloudflare Workers で稼働。

## 技術スタック

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Package Manager**: pnpm (workspace)
- **Build**: Turborepo
- **Linter/Formatter**: Biome
- **Storage**: Cloudflare KV

## ディレクトリ構成

```
src/                    # Worker エントリーポイント
  index.ts              # メインエントリー
  router.ts             # ルーティング
  env.d.ts              # 環境変数型定義
packages/
  shared/               # 共通ユーティリティ
    src/
      kv/               # KV 操作
      utils/            # レスポンス、レート制限など
      templates/        # 法的ページテンプレート
  slack/                # Slack 連携
    src/
      init.ts           # セッション事前登録
      callback.ts       # OAuth コールバック
      poll.ts           # セッションポーリング
      exchange.ts       # トークン交換
      templates.ts      # HTML テンプレート
```

## コマンド

```bash
# 依存関係インストール
pnpm install

# ビルド
pnpm build

# ローカル開発
pnpm dev

# デプロイ
npx wrangler deploy

# Lint & Format
pnpm check
pnpm format
```

## Worker Secrets

デプロイ前に設定が必要：

```bash
npx wrangler secret put SLACK_CLIENT_ID
npx wrangler secret put SLACK_CLIENT_SECRET
```

## エンドポイント

| Path | Method | 説明 |
|------|--------|------|
| `/health` | GET | ヘルスチェック |
| `/slack/init` | POST | セッション事前登録 |
| `/slack/callback` | GET | OAuth コールバック |
| `/slack/poll` | GET | コードポーリング |
| `/slack/exchange` | POST | トークン交換 |
| `/privacy` | GET | プライバシーポリシー |
| `/terms` | GET | 利用規約 |

## OAuth フロー

```mermaid
sequenceDiagram
    participant VSCode
    participant Browser
    participant Worker as Cloudflare Worker
    participant KV as Cloudflare KV
    participant Slack

    VSCode->>VSCode: session_id 生成
    VSCode->>Worker: POST /slack/init (session_id)
    Worker->>KV: セッション保存 (status: pending)
    Worker-->>VSCode: 200 OK

    VSCode->>Browser: Slack OAuth URL を開く
    Browser->>Slack: 認証画面表示
    Slack->>Browser: ユーザー認可
    Browser->>Worker: GET /slack/callback (code, state)
    Worker->>KV: セッション検証 & コード保存
    Worker-->>Browser: 成功画面表示

    loop ポーリング
        VSCode->>Worker: GET /slack/poll (session_id)
        Worker->>KV: セッション取得
        Worker-->>VSCode: code または pending
    end

    VSCode->>Worker: POST /slack/exchange (code)
    Worker->>Slack: oauth.v2.access
    Slack-->>Worker: access_token
    Worker-->>VSCode: access_token
```

## 関連リポジトリ

- [cc-wf-studio](https://github.com/breaking-brake/cc-wf-studio) - VSCode 拡張機能
