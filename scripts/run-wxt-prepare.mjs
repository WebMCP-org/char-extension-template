#!/usr/bin/env node

import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

async function main() {
  process.env.CI ??= '1';

  const extensionDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

  const { prepare } = await import(
    pathToFileURL(resolve(extensionDir, 'node_modules/wxt/dist/core/prepare.mjs'))
  );

  await prepare({ root: extensionDir });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
