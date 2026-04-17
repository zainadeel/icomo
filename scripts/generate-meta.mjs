/**
 * Generate dist/meta.json + dist/meta.d.ts
 *
 * Reads per-icon sidecar JSONs (src/<dir>/<SourcePascal>.json) and merges
 * them with category metadata into a single machine-readable manifest.
 *
 * Sidecar shape: { "aliases": string[] }
 *
 * Output shape (meta.json):
 * {
 *   "version": "0.5.0",
 *   "count": 409,
 *   "categories": {
 *     "system": { "count": 377, "themeable": true },
 *     "flag":   { "count": 32,  "themeable": false }
 *   },
 *   "icons": [
 *     { "name": "ArrowRight", "category": "system", "kebab": "arrow-right", "aliases": [...] },
 *     { "name": "FlagFrance", "category": "flag",   "kebab": "flag-france", "aliases": ["fr","france"] }
 *   ]
 * }
 *
 * Consumers (agents, docs, tooling) can:
 *   import meta from '@ds-mo/icons/meta'
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCategoryManifest, CATEGORY_LIST } from './utils/naming.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PKG_ROOT, 'dist');

const pkg = JSON.parse(readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));

const icons = [];
const categories = {};
const withoutAliases = [];

for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  categories[category.id] = { count: manifest.length, themeable: category.themeable };

  for (const { sourcePascal, pascal, kebab } of manifest) {
    // Sidecars live next to source SVGs, keyed on the *source* name
    // (France.json in src/flags/, not FlagFrance.json).
    const sidecarPath = path.join(PKG_ROOT, 'src', category.dir, `${sourcePascal}.json`);
    let aliases = [];
    if (existsSync(sidecarPath)) {
      try {
        const parsed = JSON.parse(readFileSync(sidecarPath, 'utf8'));
        if (Array.isArray(parsed.aliases)) aliases = parsed.aliases;
      } catch (err) {
        console.warn(`    ! malformed sidecar ${category.dir}/${sourcePascal}.json — skipping aliases`);
      }
    }
    if (!aliases.length) withoutAliases.push(pascal);
    icons.push({ name: pascal, category: category.id, kebab, aliases });
  }
}

const meta = {
  version: pkg.version,
  count: icons.length,
  categories,
  icons,
};

writeFileSync(path.join(DIST_DIR, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

const dts = `export interface IconMetaEntry {
  name: string;
  category: string;
  kebab: string;
  aliases: string[];
}

export interface IconCategorySummary {
  count: number;
  themeable: boolean;
}

export interface IconMeta {
  version: string;
  count: number;
  categories: Record<string, IconCategorySummary>;
  icons: IconMetaEntry[];
}

declare const meta: IconMeta;
export default meta;
`;
writeFileSync(path.join(DIST_DIR, 'meta.d.ts'), dts);

writeFileSync(
  path.join(DIST_DIR, 'meta.mjs'),
  `import meta from './meta.json' with { type: 'json' };\nexport default meta;\n`
);

const catSummary = Object.entries(categories)
  .map(([id, c]) => `${id}=${c.count}`).join(', ');
console.log(`    Generated meta.json (${icons.length} icons: ${catSummary}; ${icons.length - withoutAliases.length} with aliases)`);
