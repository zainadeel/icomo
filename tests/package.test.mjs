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
const expectedExportNames = [...meta.icons.map(i => i.name), 'AUX1'].sort();

test('metadata counts and category contracts match generated SVG exports', () => {
  assert.equal(meta.categories.system.colorModel, 'monochrome');
  assert.equal(meta.categories.flag.colorModel, 'multicolor');
  assert.equal(meta.categories.map.colorModel, 'monochrome');
  assert.equal(meta.categories.system.motion, 'static');
  assert.equal(meta.categories.flag.count, Object.keys(flagSvg).length);

  // Canonical icon counts exclude compatibility names, but every export
  // must still be accounted for so collisions and unexpected extras fail.
  const summed = Object.values(meta.categories).reduce((total, c) => total + c.count, 0);
  assert.equal(meta.count, summed);
  assert.deepEqual(Object.keys(allSvg).sort(), expectedExportNames);
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

test('standalone SVG files cover canonical icons and compatibility names', () => {
  const files = readdirSync(SVG_FILES_DIR).filter(f => f.endsWith('.svg'));

  assert.deepEqual(files.map(f => path.basename(f, '.svg')).sort(), expectedExportNames);

  const present = new Set(files.map(f => path.basename(f, '.svg')));
  for (const { name } of meta.icons) {
    assert.ok(present.has(name), `missing dist/svg-files/${name}.svg`);
  }
});

test('AUX is the canonical auxiliary icon and AUX1 resolves as a search alias', () => {
  const aux = meta.icons.find(i => i.name === 'AUX');
  assert.ok(aux, 'AUX must match the Figma component name');
  assert.equal(aux.kebab, 'aux');
  assert.ok(aux.aliases.includes('aux1'));
  assert.equal(meta.icons.some(i => i.name === 'AUX1'), false,
    'the compatibility name must not appear as an additional icon');
});

test('AUX1 imports and SVG assets remain compatible with canonical AUX', async () => {
  assert.equal(typeof allSvg.AUX, 'string');
  assert.equal(allSvg.AUX1, allSvg.AUX);
  const canonical = await import('../dist/svg/AUX.mjs');
  const compatibility = await import('../dist/svg/AUX1.mjs');
  assert.equal(canonical.AUX, allSvg.AUX);
  assert.equal(compatibility.AUX1, allSvg.AUX);

  assert.equal(
    readFileSync(path.join(SVG_FILES_DIR, 'AUX1.svg'), 'utf8'),
    readFileSync(path.join(SVG_FILES_DIR, 'AUX.svg'), 'utf8')
  );
  const sprite = readFileSync(path.join(PKG_ROOT, 'dist', 'sprite.svg'), 'utf8');
  const aux = sprite.match(/<symbol id="aux"[^>]*>([\s\S]*?)<\/symbol>/);
  const aux1 = sprite.match(/<symbol id="aux1"[^>]*>([\s\S]*?)<\/symbol>/);
  assert.ok(aux, 'canonical aux sprite ID is missing');
  assert.ok(aux1, 'legacy aux1 sprite ID is missing');
  assert.equal(aux1[1], aux[1]);
});

test('React AUX exports and declarations retain the AUX1 compatibility import', () => {
  const component = readFileSync(path.join(PKG_ROOT, 'dist', 'icons', 'AUX.mjs'), 'utf8');
  assert.match(component, /createIcon\('aux',/);
  assert.match(component, /AUX\.displayName = 'AUX'/);
  const legacyComponent = readFileSync(path.join(PKG_ROOT, 'dist', 'icons', 'AUX1.mjs'), 'utf8');
  assert.match(legacyComponent, /createIcon\('aux1',/,
    'legacy consumers must keep their existing data-icon attribute');
  assert.match(legacyComponent, /AUX1\.displayName = 'AUX1'/);
  const legacyTypes = readFileSync(path.join(PKG_ROOT, 'dist', 'icons', 'AUX1.d.ts'), 'utf8');
  assert.match(legacyTypes, /@deprecated Use AUX/);
  assert.match(legacyTypes, /export declare const AUX1: IconComponent/);
  for (const extension of ['mjs', 'd.ts']) {
    for (const barrel of ['index', 'icons/index']) {
      const source = readFileSync(path.join(PKG_ROOT, 'dist', `${barrel}.${extension}`), 'utf8');
      assert.match(source, /export \{ AUX \} from '[^']*\/AUX\.mjs'/);
      assert.match(source, /export \{ AUX1 \} from '[^']*\/AUX1\.mjs'/);
    }
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
