/**
 * Generate barrel index files (dist/index.mjs + dist/index.d.ts)
 *
 * Re-exports every icon (system + flags + any future category) alongside
 * the IconProps / FlagIconProps types. Names are globally unique thanks to
 * the category prefix (`Flag` on flag components).
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCategoryManifest, CATEGORY_LIST } from './utils/naming.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PKG_ROOT, 'dist');

const allEntries = CATEGORY_LIST.flatMap(cat =>
  getCategoryManifest(PKG_ROOT, cat).map(entry => ({ ...entry, _cat: cat }))
);

// --- index.mjs ---
const mjsLines = [
  `export { createIcon } from './createIcon.mjs';`,
  `export { createFlagIcon } from './createFlagIcon.mjs';`,
  '',
  ...allEntries.map(({ pascal, _cat }) =>
    `export { ${pascal} } from './${_cat.distDir}/${pascal}.mjs';`
  ),
  '',
];
writeFileSync(path.join(DIST_DIR, 'index.mjs'), mjsLines.join('\n'));

// --- index.d.ts ---
const dtsLines = [
  `export type { IconProps, IconComponent } from './createIcon.mjs';`,
  `export type { FlagIconProps, FlagIconComponent } from './createFlagIcon.mjs';`,
  `export { createIcon } from './createIcon.mjs';`,
  `export { createFlagIcon } from './createFlagIcon.mjs';`,
  '',
  ...allEntries.map(({ pascal, _cat }) =>
    `export { ${pascal} } from './${_cat.distDir}/${pascal}.mjs';`
  ),
  '',
];
writeFileSync(path.join(DIST_DIR, 'index.d.ts'), dtsLines.join('\n'));

// --- Per-category barrels (dist/flags/index.mjs etc.) ---
// Lets consumers import from '@ds-mo/icons/flags' for just the flag set.
for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  if (!manifest.length) continue;

  const catMjs = manifest
    .map(({ pascal }) => `export { ${pascal} } from './${pascal}.mjs';`)
    .join('\n') + '\n';
  const catDts = manifest
    .map(({ pascal }) => `export { ${pascal} } from './${pascal}.mjs';`)
    .join('\n') + '\n';

  writeFileSync(path.join(DIST_DIR, category.distDir, 'index.mjs'), catMjs);
  writeFileSync(path.join(DIST_DIR, category.distDir, 'index.d.ts'), catDts);
}

console.log(`    Generated barrel index with ${allEntries.length} exports`);
