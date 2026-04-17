/**
 * Generate SVG sprite sheet (dist/sprite.svg)
 *
 * One <symbol> per icon across every category. Flags keep their own fills
 * (no `currentColor`) — the symbol's default `fill` is "none" and children
 * carry explicit colors. System icons use `currentColor` as before.
 *
 * Usage: <svg width="16" height="16"><use href="/sprite.svg#arrow-right"/></svg>
 *        <svg width="16" height="16"><use href="/sprite.svg#flag-france"/></svg>
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCategoryManifest, CATEGORY_LIST } from './utils/naming.mjs';
import { parseSvgFile } from './utils/svg-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PKG_ROOT, 'dist');

const symbols = [];
let count = 0;

for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  const defaultFill = category.themeable ? 'currentColor' : 'none';

  for (const { filename, kebab } of manifest) {
    const svgPath = path.join(PKG_ROOT, 'src', category.dir, filename);
    const { innerSvg } = parseSvgFile(svgPath, category.normalize);

    symbols.push(`  <symbol id="${kebab}" viewBox="0 0 16 16" fill="${defaultFill}">
${innerSvg.split('\n').map(line => `    ${line}`).join('\n')}
  </symbol>`);
    count++;
  }
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols.join('\n')}
</svg>
`;

writeFileSync(path.join(DIST_DIR, 'sprite.svg'), sprite);
console.log(`    Generated sprite with ${count} symbols`);
