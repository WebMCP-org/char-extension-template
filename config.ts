import type { ExtensionConfig, OidcConfig } from '@char-ai/extension-core';

const DEFAULT_API_BASE = 'http://localhost:3000';

export function getExtensionApiBase(): string {
  const configured = import.meta.env.WXT_API_BASE;
  const value = typeof configured === 'string' && configured.trim().length > 0
    ? configured.trim()
    : DEFAULT_API_BASE;

  return value.replace(/\/+$/, '');
}

function envString(key: string, fallback = ''): string {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function isWorkOSUserManagementUrl(value: string): boolean {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.hostname === 'api.workos.com' && url.pathname.startsWith('/user_management/');
  } catch {
    return false;
  }
}

export function getOidcConfig(): OidcConfig {
  const authorizationEndpoint = envString('WXT_OIDC_AUTHORIZATION_ENDPOINT');
  const tokenEndpoint = envString('WXT_OIDC_TOKEN_ENDPOINT');
  const issuer = envString('WXT_OIDC_ISSUER');
  const configuredProvider = envString('WXT_OIDC_PROVIDER');

  const provider =
    configuredProvider ||
    (isWorkOSUserManagementUrl(authorizationEndpoint) ||
    isWorkOSUserManagementUrl(tokenEndpoint) ||
    isWorkOSUserManagementUrl(issuer)
      ? 'authkit'
      : '');

  return {
    publishableKey: envString('WXT_CHAR_PUBLISHABLE_KEY'),
    clientId: envString('WXT_OIDC_CLIENT_ID'),
    authorizationEndpoint,
    tokenEndpoint,
    issuer,
    scopes: envString('WXT_OIDC_SCOPES', 'openid email profile'),
    provider,
    redirectProxy: envString('WXT_OIDC_REDIRECT_PROXY'),
  };
}

export function getConfig(): ExtensionConfig {
  return {
    apiBase: getExtensionApiBase(),
    oidc: getOidcConfig(),
  };
}
