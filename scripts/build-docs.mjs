/**
 * build-docs.mjs
 *
 * Generates a fully self-contained docs/index.html by:
 *   1. Reading scripts/docs-template.html
 *   2. Inlining the SVG sprite (replaces <!-- @@SPRITE@@ -->)
 *   3. Inlining the icon manifest (replaces /* @@ICONS_DATA@@ *\/)
 *   4. Writing docs/index.html — no external assets needed
 *
 * Run after `npm run build`:
 *   npm run build && npm run build:docs
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const iconsDir = join(root, 'src', 'icons');
const distDir = join(root, 'dist');
const docsDir = join(root, 'docs');

// ── Helpers ────────────────────────────────────────────────────────────────

function toKebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// ── Ensure docs/ exists ────────────────────────────────────────────────────

mkdirSync(docsDir, { recursive: true });

// ── Icon manifest ──────────────────────────────────────────────────────────

const { readdirSync } = await import('node:fs');

const icons = readdirSync(iconsDir)
  .filter(f => f.endsWith('.svg'))
  .sort()
  .map(f => {
    const pascal = basename(f, '.svg');
    const kebab = toKebabCase(pascal);
    return { pascal, kebab };
  });

const iconsDataJs = `const ICONS = ${JSON.stringify(icons)};`;

console.log(`  ✓ icon manifest   (${icons.length} icons)`);

// ── Sprite ─────────────────────────────────────────────────────────────────

const spriteContent = readFileSync(join(distDir, 'sprite.svg'), 'utf8');
// Wrap in a hidden container for inline use
const inlineSprite = `<div aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none">\n${spriteContent}\n</div>`;

console.log(`  ✓ sprite inlined  (${Math.round(spriteContent.length / 1024)}KB)`);

// ── Generate HTML ──────────────────────────────────────────────────────────

let html = readFileSync(join(__dirname, 'docs-template.html'), 'utf8');

html = html.replace('/* @@ICONS_DATA@@ */', iconsDataJs);
html = html.replace('<!-- @@SPRITE@@ -->', inlineSprite);

writeFileSync(join(docsDir, 'index.html'), html);

console.log(`  ✓ docs/index.html (self-contained)\n\nDocs ready → docs/index.html`);
