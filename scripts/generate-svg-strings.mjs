/**
 * Generate raw SVG string exports for framework-agnostic consumption.
 *
 * Emits:
 *   dist/svg/<Pascal>.mjs            — system icons (currentColor-themed)
 *   dist/svg/flags/<FlagPascal>.mjs  — flags (colors preserved, P3-aware)
 *   dist/svg/index.mjs               — barrel re-exporting everything
 *   dist/svg/flags/index.mjs         — flag-only barrel
 *
 * Purpose: lets non-React consumers (Angular directives, Vue components,
 * vanilla JS, web components, Liquid templates) inject SVG markup directly
 * without pulling React as a peer dep.
 *
 * Category normalization rules are applied from scripts/utils/categories.mjs:
 * flags keep all fills and `style="fill:color(display-p3 ...)"` so wide-gamut
 * displays render the authored color. System icons still use `currentColor`
 * so `color: red` in the consumer's CSS drives the icon.
 *
 * Usage:
 *   import { ArrowRight } from '@ds-mo/icons/svg';          // system
 *   import { FlagFrance } from '@ds-mo/icons/svg';          // flag (prefixed)
 *   import { FlagFrance } from '@ds-mo/icons/svg/flags';    // flag-only barrel
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCategoryManifest, CATEGORY_LIST } from './utils/naming.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const DIST_SVG = path.join(PKG_ROOT, 'dist', 'svg');

mkdirSync(DIST_SVG, { recursive: true });

/**
 * Apply category-aware normalization to the entire SVG source string
 * (root <svg> tag included — we want the root too for string consumers).
 */
function normalizeSvg(raw, normalize) {
  let out = raw;
  if (normalize.collapseWhitespace) out = out.replace(/>\s+</g, '><');
  if (normalize.stripStyle) out = out.replace(/\s*style="[^"]*"/g, '');
  if (normalize.blackToCurrentColor) out = out.replace(/fill="black"/g, 'fill="currentColor"');
  return out.trim();
}

const topBarrelMjs = [];
const topBarrelDts = [];
let total = 0;

for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  if (!manifest.length) continue;

  // System icons live flat in dist/svg/, flags (and future categories) nest.
  const isDefault = category.id === 'system';
  const outDir = isDefault ? DIST_SVG : path.join(DIST_SVG, category.distDir);
  mkdirSync(outDir, { recursive: true });

  const catBarrelMjs = [];
  const catBarrelDts = [];

  for (const { filename, pascal } of manifest) {
    const raw = readFileSync(path.join(PKG_ROOT, 'src', category.dir, filename), 'utf8');
    const normalized = normalizeSvg(raw, category.normalize);
    const escaped = JSON.stringify(normalized);

    writeFileSync(
      path.join(outDir, `${pascal}.mjs`),
      `export const ${pascal} = ${escaped};\n`
    );
    writeFileSync(
      path.join(outDir, `${pascal}.d.ts`),
      `export declare const ${pascal}: string;\n`
    );

    const subpath = isDefault ? `./${pascal}.mjs` : `./${category.distDir}/${pascal}.mjs`;
    topBarrelMjs.push(`export { ${pascal} } from '${subpath}';`);
    topBarrelDts.push(`export { ${pascal} } from '${subpath}';`);

    catBarrelMjs.push(`export { ${pascal} } from './${pascal}.mjs';`);
    catBarrelDts.push(`export { ${pascal} } from './${pascal}.mjs';`);
    total++;
  }

  // Per-category barrel (dist/svg/flags/index.mjs)
  if (!isDefault) {
    writeFileSync(path.join(outDir, 'index.mjs'), catBarrelMjs.join('\n') + '\n');
    writeFileSync(path.join(outDir, 'index.d.ts'), catBarrelDts.join('\n') + '\n');
  }
}

// Top-level barrel (dist/svg/index.mjs) — includes flags with Flag* prefix
writeFileSync(path.join(DIST_SVG, 'index.mjs'), topBarrelMjs.join('\n') + '\n');
writeFileSync(path.join(DIST_SVG, 'index.d.ts'), topBarrelDts.join('\n') + '\n');

console.log(`    Generated ${total} SVG string exports`);
