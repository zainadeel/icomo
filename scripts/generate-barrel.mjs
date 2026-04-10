/**
 * Generate barrel index files (dist/index.mjs + dist/index.d.ts)
 *
 * Re-exports all icons + the IconProps/IconComponent types from createIcon.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getIconManifest } from './utils/naming.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const SRC_ICONS = path.join(PKG_ROOT, 'src', 'icons');
const DIST_DIR = path.join(PKG_ROOT, 'dist');

const manifest = getIconManifest(SRC_ICONS);

// --- index.mjs ---
const mjsLines = [
  `export { createIcon } from './createIcon.mjs';`,
  '',
  ...manifest.map(({ pascal }) =>
    `export { ${pascal} } from './icons/${pascal}.mjs';`
  ),
  '',
];

writeFileSync(path.join(DIST_DIR, 'index.mjs'), mjsLines.join('\n'));

// --- index.d.ts ---
const dtsLines = [
  `export type { IconProps, IconComponent } from './createIcon.mjs';`,
  `export { createIcon } from './createIcon.mjs';`,
  '',
  ...manifest.map(({ pascal }) =>
    `export { ${pascal} } from './icons/${pascal}.mjs';`
  ),
  '',
];

writeFileSync(path.join(DIST_DIR, 'index.d.ts'), dtsLines.join('\n'));

console.log(`    Generated barrel index with ${manifest.length} exports`);
