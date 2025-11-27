# cc-wf-studio-connectors

OAuth authentication server for [cc-wf-studio](https://github.com/breaking-brake/cc-wf-studio) (Slack/Discord integration).

## Overview

This Cloudflare Worker handles OAuth callbacks from Slack (and Discord in the future), storing authorization codes in KV for the VSCode extension to poll and retrieve.

## Architecture

```
VSCode Extension
  → session_id生成、ブラウザでSlack認証開始
  → redirect_uri: https://oauth.your-domain.com/slack/callback

Slack OAuth (Browser)
  → 認証後、authorization codeをredirect_uriに送信

Cloudflare Worker (/slack/callback)
  → code と state を受け取り
  → state=session_id で KV Storage に保存 (TTL: 5分)
  → 確認画面 HTML を返す

VSCode Extension
  → /slack/poll?session=xxx で code を取得
  → code 取得後、oauth.v2.access 呼び出し（VSCode側で実行）
```

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/slack/callback` | GET | Slack OAuth callback |
| `/slack/poll` | GET | Poll for authorization code |
| `/discord/callback` | GET | Discord OAuth callback (future) |
| `/discord/poll` | GET | Discord poll (future) |

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+
- Cloudflare account

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm turbo build

# Run locally
pnpm dev
```

### Create KV Namespaces

Before deploying, create the required KV namespaces:

```bash
# Create namespaces
wrangler kv:namespace create "OAUTH_SESSIONS"
wrangler kv:namespace create "RATE_LIMIT"
```

Update `wrangler.toml` with the namespace IDs returned by the commands above.

### Deploy

```bash
pnpm deploy
```

## Configuration

### GitHub Secrets

For automated deployments, configure the following secrets in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `CF_API_TOKEN` | Cloudflare API token with Workers edit permission |
| `CF_ACCOUNT_ID` | Cloudflare account ID |

### Custom Domain

To use a custom domain, uncomment and configure the `routes` section in `wrangler.toml`:

```toml
routes = [
  { pattern = "oauth.your-domain.com/*", zone_name = "your-domain.com" }
]
```

## License

MIT
