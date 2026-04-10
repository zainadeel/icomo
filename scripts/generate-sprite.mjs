/**
 * Generate SVG sprite sheet (dist/sprite.svg)
 *
 * Each icon becomes a <symbol> with its kebab-case name as the id.
 * Usage: <svg width="16" height="16"><use href="/sprite.svg#arrow-right"/></svg>
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getIconManifest } from './utils/naming.mjs';
import { parseSvgFile } from './utils/svg-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const SRC_ICONS = path.join(PKG_ROOT, 'src', 'icons');
const DIST_DIR = path.join(PKG_ROOT, 'dist');

const manifest = getIconManifest(SRC_ICONS);

const symbols = manifest.map(({ filename, kebab }) => {
  const svgPath = path.join(SRC_ICONS, filename);
  const { innerSvg } = parseSvgFile(svgPath);

  return `  <symbol id="${kebab}" viewBox="0 0 16 16" fill="currentColor">
${innerSvg.split('\n').map(line => `    ${line}`).join('\n')}
  </symbol>`;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols.join('\n')}
</svg>
`;

writeFileSync(path.join(DIST_DIR, 'sprite.svg'), sprite);

console.log(`    Generated sprite with ${manifest.length} symbols`);
