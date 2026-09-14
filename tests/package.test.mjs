import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import meta from '../dist/meta.mjs';
import * as systemSvg from '../dist/svg/index.mjs';
import * as flagSvg from '../dist/svg/flags/index.mjs';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SVG_FILES_DIR = path.join(PKG_ROOT, 'dist', 'svg-files');

test('metadata counts and category contracts match generated SVG exports', () => {
  assert.equal(meta.categories.system.colorModel, 'monochrome');
  assert.equal(meta.categories.flag.colorModel, 'multicolor');
  assert.equal(meta.categories.system.motion, 'static');
  assert.equal(meta.categories.system.count, Object.keys(systemSvg).length - Object.keys(flagSvg).length);
  assert.equal(meta.categories.flag.count, Object.keys(flagSvg).length);
  assert.equal(meta.count, meta.categories.system.count + meta.categories.flag.count);
});

test('every framework-neutral export is an SVG string', () => {
  for (const [name, svg] of Object.entries({ ...systemSvg, ...flagSvg })) {
    assert.match(svg, /^<svg\b/, name);
    assert.doesNotMatch(svg, /<(?:script|foreignObject)\b|\son[a-z]+\s*=|javascript:/i, name);
  }
});

test('standalone SVG files cover every icon exactly once', () => {
  const files = readdirSync(SVG_FILES_DIR).filter(f => f.endsWith('.svg'));

  // One flat file per icon — a collision would silently shrink this count.
  assert.equal(files.length, meta.count);

  const present = new Set(files.map(f => path.basename(f, '.svg')));
  for (const { name } of meta.icons) {
    assert.ok(present.has(name), `missing dist/svg-files/${name}.svg`);
  }
});

test('standalone SVG files carry native-safe fills', () => {
  for (const { name, category } of meta.icons) {
    const svg = readFileSync(path.join(SVG_FILES_DIR, `${name}.svg`), 'utf8');

    assert.match(svg, /^<svg\b/, name);
    assert.doesNotMatch(svg, /<(?:script|foreignObject)\b|\son[a-z]+\s*=|javascript:/i, name);

    // Asset catalogs have no CSS cascade — currentColor would never resolve.
    assert.doesNotMatch(svg, /currentColor/, name);

    if (category === 'system') {
      assert.match(svg, /fill="black"/, `${name} lost its concrete fill`);
    }
  }
});
