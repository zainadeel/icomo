/**
 * Generate raw SVG string exports for framework-agnostic consumption.
 *
 * Reads src/icons/*.svg and produces:
 *   dist/svg/<Pascal>.mjs   — `export const <Pascal> = '<svg ...>...</svg>';`
 *   dist/svg/<Pascal>.d.ts  — `export const <Pascal>: string;`
 *   dist/svg/index.mjs      — barrel re-export of all icons
 *   dist/svg/index.d.ts     — barrel types
 *
 * Purpose: lets non-React consumers (Angular directives, Vue components,
 * vanilla JS, web components, Liquid templates, etc.) inject SVG markup
 * directly without pulling React as a peer dep.
 *
 * Usage:
 *   import { ArrowRight, Trash } from '@ds-mo/icons/svg';
 *   // ArrowRight === '<svg width="16" ...>...</svg>'
 *
 * Tree-shakeable per-icon import also supported:
 *   import { ArrowRight } from '@ds-mo/icons/svg/ArrowRight';
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getIconManifest } from './utils/naming.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const SRC_ICONS = path.join(PKG_ROOT, 'src', 'icons');
const DIST_SVG = path.join(PKG_ROOT, 'dist', 'svg');

mkdirSync(DIST_SVG, { recursive: true });

const manifest = getIconManifest(SRC_ICONS);

const barrelMjs = [];
const barrelDts = [];

for (const { filename, pascal } of manifest) {
  // Read raw SVG and normalise for clean, CSS-color-friendly output:
  //   1. Collapse whitespace between tags (cosmetic, compact string)
  //   2. Strip Figma's inline `style="fill:...;"` artifacts
  //   3. Replace hardcoded `fill="black"` with `currentColor` so the icon
  //      inherits from CSS `color` in consuming frameworks
  //   Same transforms the sprite pipeline applies — keep them in sync.
  const raw = readFileSync(path.join(SRC_ICONS, filename), 'utf8')
    .replace(/>\s+</g, '><')
    .replace(/\s*style="[^"]*"/g, '')
    .replace(/fill="black"/g, 'fill="currentColor"')
    .trim();

  // JSON.stringify handles all JS string escaping (quotes, backslashes, unicode).
  const escaped = JSON.stringify(raw);

  writeFileSync(
    path.join(DIST_SVG, `${pascal}.mjs`),
    `export const ${pascal} = ${escaped};\n`
  );
  writeFileSync(
    path.join(DIST_SVG, `${pascal}.d.ts`),
    `export declare const ${pascal}: string;\n`
  );

  barrelMjs.push(`export { ${pascal} } from './${pascal}.mjs';`);
  barrelDts.push(`export { ${pascal} } from './${pascal}.mjs';`);
}

writeFileSync(path.join(DIST_SVG, 'index.mjs'), barrelMjs.join('\n') + '\n');
writeFileSync(path.join(DIST_SVG, 'index.d.ts'), barrelDts.join('\n') + '\n');

console.log(`    Generated ${manifest.length} SVG string exports`);
