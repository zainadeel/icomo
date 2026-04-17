/**
 * build-docs.mjs
 *
 * Generates a fully self-contained docs/index.html by:
 *   1. Reading scripts/docs-template.html
 *   2. Inlining the SVG sprite (replaces <!-- @@SPRITE@@ -->)
 *   3. Inlining the icon manifest (replaces /* @@ICONS_DATA@@ *\/)
 *   4. Writing docs/index.html — no external assets needed
 *
 * Icon metadata comes from dist/meta.json so categories (system/flag) and
 * aliases stay in a single source of truth with the published package.
 *
 * Run after `npm run build`:
 *   npm run build && npm run build:docs
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const docsDir = join(root, 'docs');

mkdirSync(docsDir, { recursive: true });

// ── Icon manifest (from dist/meta.json) ─────────────────────────────────────

const meta = JSON.parse(readFileSync(join(distDir, 'meta.json'), 'utf8'));

// Docs shape: { pascal, kebab, aliases, category }
const icons = meta.icons.map(i => ({
  pascal: i.name,
  kebab: i.kebab,
  aliases: i.aliases,
  category: i.category,
}));

const categories = meta.categories;

const iconsDataJs = `const ICONS = ${JSON.stringify(icons)};
const CATEGORIES = ${JSON.stringify(categories)};`;

console.log(`  ✓ icon manifest   (${icons.length} icons across ${Object.keys(categories).length} categories)`);

// ── Sprite ─────────────────────────────────────────────────────────────────

const spriteContent = readFileSync(join(distDir, 'sprite.svg'), 'utf8');
const inlineSprite = `<div aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none">\n${spriteContent}\n</div>`;

console.log(`  ✓ sprite inlined  (${Math.round(spriteContent.length / 1024)}KB)`);

// ── Generate HTML ──────────────────────────────────────────────────────────

let html = readFileSync(join(__dirname, 'docs-template.html'), 'utf8');
html = html.replace('/* @@ICONS_DATA@@ */', iconsDataJs);
html = html.replace('<!-- @@SPRITE@@ -->', inlineSprite);

writeFileSync(join(docsDir, 'index.html'), html);

console.log(`  ✓ docs/index.html (self-contained)\n\nDocs ready → docs/index.html`);
