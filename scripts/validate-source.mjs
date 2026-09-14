#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORY_LIST, getCategoryManifest } from './utils/naming.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const colorModels = new Set(['monochrome', 'multicolor']);
const motions = new Set(['static']);
const exportNames = new Set();
const kebabNames = new Set();
let count = 0;

for (const category of CATEGORY_LIST) {
  if (!colorModels.has(category.colorModel)) throw new Error(`${category.id}: unsupported colorModel ${category.colorModel}`);
  if (!motions.has(category.motion)) throw new Error(`${category.id}: unsupported motion ${category.motion}`);
  const sourceDir = path.join(root, 'src', category.dir);
  if (!existsSync(sourceDir)) throw new Error(`${category.id}: missing source directory ${category.dir}`);

  const manifest = getCategoryManifest(root, category);
  for (const { filename, sourcePascal, pascal, kebab } of manifest) {
    if (exportNames.has(pascal)) throw new Error(`Duplicate icon export: ${pascal}`);
    if (kebabNames.has(kebab)) throw new Error(`Duplicate icon kebab name: ${kebab}`);
    exportNames.add(pascal);
    kebabNames.add(kebab);
    count += 1;

    const svg = readFileSync(path.join(sourceDir, filename), 'utf8');
    if (!/^\s*<svg\b/i.test(svg)) throw new Error(`${sourcePascal}: source must start with <svg>`);
    const viewBox = svg.match(/\bviewBox=["']([^"']+)["']/i)?.[1]?.trim().split(/[ ,]+/).map(Number);
    if (!viewBox || viewBox.length !== 4 || viewBox.some(value => !Number.isFinite(value)) || viewBox[2] <= 0 || viewBox[3] <= 0) {
      throw new Error(`${sourcePascal}: invalid or missing viewBox`);
    }
    if (/<(?:script|foreignObject)\b|\son[a-z]+\s*=|javascript:/i.test(svg)) {
      throw new Error(`${sourcePascal}: executable or foreign SVG content is not allowed`);
    }
    // The React/sprite parser flattens the SVG body into a list of elements, so
    // grouping and id-referencing markup does not survive: a <g> loses its
    // children's nesting and a <defs><clipPath><rect/> emits a stray filled
    // rect over the icon. Figma adds a no-op full-bleed clip group on some
    // exports — flatten it (keep the drawing elements, drop the wrapper).
    const grouping = svg.match(/<(g|defs|clipPath|mask|use|symbol)\b/i)?.[1];
    if (grouping) {
      throw new Error(
        `${sourcePascal}: <${grouping}> is not supported — the build flattens SVG bodies. ` +
        `Remove the wrapper (a full-bleed Figma clip group is a no-op and can be deleted).`
      );
    }
    if (category.motion === 'static' && /<(?:animate|animateTransform|set)\b/i.test(svg)) {
      throw new Error(`${sourcePascal}: animation markup requires an animated category contract`);
    }
    const ids = [...svg.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
    if (new Set(ids).size !== ids.length) throw new Error(`${sourcePascal}: duplicate SVG ids`);
  }

  for (const file of readdirSync(sourceDir)) {
    if (!file.endsWith('.json')) continue;
    const svg = path.join(sourceDir, `${path.basename(file, '.json')}.svg`);
    if (!existsSync(svg)) throw new Error(`${category.dir}/${file}: sidecar has no matching SVG`);
  }
}

console.log(`    Validated ${count} icons across ${CATEGORY_LIST.length} categories`);
