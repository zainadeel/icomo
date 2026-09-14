/**
 * Generate a flat folder of standalone .svg files for native consumers.
 *
 * Emits:
 *   dist/svg-files/<Pascal>.svg       — system icons (ArrowRight.svg)
 *   dist/svg-files/<FlagPascal>.svg   — flags, prefixed (FlagFrance.svg)
 *
 * Purpose: Xcode asset catalogs (and other native/design tools) need literal
 * files on disk — they cannot import the JS string modules in dist/svg/ the
 * way a web bundler can. This is the iOS delivery path that the old
 * generate-pdfs.mjs used to serve; Xcode 12+ reads SVG natively, so the
 * source vectors ship as-is instead of being re-encoded as PDF.
 *
 * Flat and prefixed on purpose: one drag into .xcassets, no name collisions.
 *
 * Normalization differs from generate-svg-strings.mjs in one respect:
 * system icons keep their concrete `fill="black"` rather than being rewritten
 * to `currentColor`. `currentColor` is a CSS cascade concept with no meaning
 * in an asset catalog — Xcode's "Render As → Template Image" derives the
 * shape from the alpha channel and applies the tint, so a concrete fill is
 * both correct and reliably parsed. Flags keep every fill (hex + P3) exactly
 * as authored, matching the web output.
 *
 * Usage:
 *   npm run build       # runs as part of the full build (ships to npm)
 *   npm run build:svg   # standalone regeneration
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCategoryManifest, CATEGORY_LIST } from './utils/naming.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const DIST_SVG_FILES = path.join(PKG_ROOT, 'dist', 'svg-files');

mkdirSync(DIST_SVG_FILES, { recursive: true });

/**
 * Apply category normalization, minus the currentColor rewrite — see the
 * header note on why native asset catalogs want a concrete fill.
 */
function normalizeSvg(raw, normalize) {
  let out = raw;
  if (normalize.collapseWhitespace) out = out.replace(/>\s+</g, '><');
  if (normalize.stripStyle) out = out.replace(/\s*style="[^"]*"/g, '');
  return out.trim();
}

let total = 0;

for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  if (!manifest.length) continue;

  for (const { filename, pascal } of manifest) {
    const raw = readFileSync(path.join(PKG_ROOT, 'src', category.dir, filename), 'utf8');
    const normalized = normalizeSvg(raw, category.normalize);

    // Flat output — `pascal` already carries the category prefix (FlagFrance).
    writeFileSync(path.join(DIST_SVG_FILES, `${pascal}.svg`), normalized + '\n');
    total++;
  }
}

console.log(`    Generated ${total} standalone SVG files`);
