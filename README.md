# Char Extension Template

White-label Chrome extension template powered by [`@char-ai/extension-core`](https://www.npmjs.com/package/@char-ai/extension-core).

## Quick Start

```bash
# 1. Clone this template
gh repo create my-extension --template WebMCP-org/char-extension-template --clone

# 2. Configure environment
cp .env.example .env
# Edit .env with your API base URL, publishable key, and OIDC settings

# 3. Install and run
pnpm install
pnpm dev
```

Load the extension in Chrome: `chrome://extensions` → Enable Developer Mode → Load Unpacked → select `.output/chrome-mv3`.

## Configuration

All runtime configuration is done via environment variables in `.env`:

| Variable | Required | Description |
|---|---|---|
| `WXT_API_BASE` | Yes | Char API base URL |
| `WXT_CHAR_PUBLISHABLE_KEY` | Yes | Publishable key (`pk_live_...`) |
| `WXT_EXTENSION_NAME` | Yes | Extension display name |
| `WXT_OIDC_CLIENT_ID` | Yes | OAuth client ID |
| `WXT_OIDC_AUTHORIZATION_ENDPOINT` | Yes | IdP authorization URL |
| `WXT_OIDC_TOKEN_ENDPOINT` | Yes | IdP token URL |
| `WXT_OIDC_PROVIDER` | No | Provider name (auto-detected for WorkOS) |
| `WXT_OIDC_SCOPES` | No | OAuth scopes (default: `openid email profile`) |
| `WXT_OIDC_ISSUER` | No | JWT issuer |
| `WXT_OIDC_REDIRECT_PROXY` | No | Redirect proxy URL |

## Customization

| What | Where | How |
|---|---|---|
| Extension name | `.env` | `WXT_EXTENSION_NAME` |
| Manifest description | `wxt.config.ts` | Edit string on line 53 |
| Action button tooltip | `wxt.config.ts` | Edit string on line 83 |
| Colors, fonts, radii | `entrypoints/sidebar/index.html` | CSS custom property fallbacks |
| Auth overlay copy | `entrypoints/sidebar/index.html` | Edit HTML text |
| Auth overlay icon | `entrypoints/sidebar/index.html` | Replace inline SVG |
| Extension icons | `public/icon-*.png` | Replace files |

## OIDC Redirect URI

Each Chrome extension gets a unique ID. The redirect URI for `chrome.identity.launchWebAuthFlow` is:

```
https://<extension-id>.chromiumapp.org/
```

Register this URI with your identity provider (e.g., WorkOS). You can find your extension ID on `chrome://extensions` after loading the unpacked extension.

## License

MIT
