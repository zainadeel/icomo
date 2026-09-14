import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import meta from '../dist/meta.mjs';
// dist/svg/index.mjs is the top-level barrel — every category, prefixed.
import * as allSvg from '../dist/svg/index.mjs';
import * as flagSvg from '../dist/svg/flags/index.mjs';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SVG_FILES_DIR = path.join(PKG_ROOT, 'dist', 'svg-files');

test('metadata counts and category contracts match generated SVG exports', () => {
  assert.equal(meta.categories.system.colorModel, 'monochrome');
  assert.equal(meta.categories.flag.colorModel, 'multicolor');
  assert.equal(meta.categories.map.colorModel, 'monochrome');
  assert.equal(meta.categories.system.motion, 'static');
  assert.equal(meta.categories.flag.count, Object.keys(flagSvg).length);

  // Category counts must add up to the total, and the top-level SVG barrel
  // must expose exactly one export per icon across every category.
  const summed = Object.values(meta.categories).reduce((total, c) => total + c.count, 0);
  assert.equal(meta.count, summed);
  assert.equal(Object.keys(allSvg).length, meta.count);
});

// React is an optional peer dep and isn't installed here, so the generated
// components are checked as source rather than imported and rendered.
test('map icons are branded so marker components can require them', () => {
  const factory = readFileSync(path.join(PKG_ROOT, 'dist', 'createMapIcon.mjs'), 'utf8');
  assert.match(factory, /Icon\.iconCategory = 'map'/, 'map factory lost its runtime brand');
  assert.match(factory, /'data-category': 'map'/, 'map factory lost its data-category');

  const factoryTypes = readFileSync(path.join(PKG_ROOT, 'dist', 'createMapIcon.d.ts'), 'utf8');
  assert.match(factoryTypes, /readonly iconCategory: 'map'/, 'MapIconComponent lost its type brand');

  for (const { name } of meta.icons.filter(i => i.category === 'map')) {
    const component = readFileSync(path.join(PKG_ROOT, 'dist', 'map', `${name}.mjs`), 'utf8');
    assert.match(component, /createMapIcon\(/, `${name} was not built from the map factory`);
  }
});

test('every framework-neutral export is an SVG string', () => {
  for (const [name, svg] of Object.entries(allSvg)) {
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

    if (meta.categories[category].colorModel === 'monochrome') {
      assert.match(svg, /fill="black"/, `${name} lost its concrete fill`);
    }
  }
});
