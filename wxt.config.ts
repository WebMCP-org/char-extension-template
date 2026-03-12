import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'wxt';

const appDir = fileURLToPath(new URL('.', import.meta.url));
const defaultChromiumProfile = resolve(appDir, '.chrome-dev-profile');
const chromiumProfilePath = process.env.WXT_CHROMIUM_PROFILE || defaultChromiumProfile;

mkdirSync(chromiumProfilePath, { recursive: true });

function toOrigin(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getOidcOrigins(): string[] {
  const values = [
    process.env.WXT_OIDC_AUTHORIZATION_ENDPOINT,
    process.env.WXT_OIDC_TOKEN_ENDPOINT,
    process.env.WXT_OIDC_ISSUER,
  ];

  const origins = new Set<string>();
  for (const value of values) {
    const origin = toOrigin(value);
    if (origin) {
      origins.add(origin);
    }
  }

  return Array.from(origins);
}

export default defineConfig({
  manifestVersion: 3,
  manifest: ({ mode }) => {
    const backendUrl = process.env.WXT_API_BASE || 'http://localhost:3000';
    const backendOrigin = toOrigin(backendUrl) ?? backendUrl;
    const oidcOrigins = getOidcOrigins();
    const extensionName = process.env.WXT_EXTENSION_NAME || 'Demo Extension';
    const isDevelopment = mode === 'development';

    return {
      name: extensionName,
      description: 'White-label AI browser agent powered by Char',
      minimum_chrome_version: '120',
      host_permissions: ['<all_urls>'],
      permissions: [
        'alarms',
        'identity',
        'storage',
        'tabs',
        'sidePanel',
        'scripting',
        'offscreen',
        'userScripts',
      ],
      content_security_policy: {
        extension_pages: [
          "script-src 'self';",
          "object-src 'self';",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
          "font-src 'self' data: https://fonts.gstatic.com;",
          "connect-src 'self' data:",
          ...(isDevelopment ? ['ws://localhost:*', 'http://localhost:*'] : []),
          ...(isDevelopment ? ['wss:', 'ws:'] : ['wss:']),
          backendOrigin,
          ...oidcOrigins,
          ';',
          "img-src 'self' data: blob: https:;",
          `frame-src 'self' ${backendOrigin};`,
        ].join(' '),
      },
      action: {
        default_title: 'Open Side Panel',
      },
      side_panel: {
        default_path: 'sidepanel.html',
      },
    };
  },
  webExt: {
    openConsole: true,
    chromiumArgs: ['--remote-debugging-port=9222'],
    chromiumProfile: chromiumProfilePath,
    keepProfileChanges: true,
  },
});
