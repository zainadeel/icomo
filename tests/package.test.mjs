import assert from 'node:assert/strict';
import test from 'node:test';
import meta from '../dist/meta.mjs';
import * as systemSvg from '../dist/svg/index.mjs';
import * as flagSvg from '../dist/svg/flags/index.mjs';

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
