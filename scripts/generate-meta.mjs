/**
 * Generate dist/meta.json + dist/meta.d.ts
 *
 * Reads per-icon sidecar JSONs (src/<dir>/<SourcePascal>.json) and merges
 * them with category metadata into a single machine-readable manifest.
 *
 * Sidecars contain aliases plus optional intent, relationship, and lifecycle fields.
 *
 * Output shape (meta.json):
 * {
 *   "version": "0.6.0",
 *   "count": 422,
 *   "categories": {
 *     "system": { "count": 390, "themeable": true },
 *     "flag":   { "count": 32,  "themeable": false }
 *   },
 *   "icons": [
 *     { "name": "ArrowRight", "category": "system", "kebab": "arrow-right", "aliases": [...] },
 *     { "name": "FlagFrance", "category": "flag",   "kebab": "flag-france", "aliases": ["fr","france"] }
 *   ]
 * }
 *
 * Also emits dist/agent.{json,mjs,d.ts} for intent-enriched icon entries.
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
const SIDECAR_FIELDS = new Set([
  'aliases', 'concepts', 'roles', 'useWhen', 'avoidWhen', 'related',
  'variantOf', 'status', 'replacedBy',
]);
const ARRAY_FIELDS = ['aliases', 'concepts', 'roles', 'useWhen', 'avoidWhen', 'related'];
const STRING_FIELDS = ['variantOf', 'replacedBy'];
const STATUSES = new Set(['experimental', 'stable', 'deprecated', 'removed']);

for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  categories[category.id] = {
    count: manifest.length,
    colorModel: category.colorModel,
    motion: category.motion,
    themeable: category.colorModel === 'monochrome',
  };

  for (const { sourcePascal, pascal, kebab } of manifest) {
    // Sidecars live next to source SVGs, keyed on the *source* name
    // (France.json in src/flags/, not FlagFrance.json).
    const sidecarPath = path.join(PKG_ROOT, 'src', category.dir, `${sourcePascal}.json`);
    let sidecar = { aliases: [] };
    if (existsSync(sidecarPath)) {
      try {
        sidecar = JSON.parse(readFileSync(sidecarPath, 'utf8'));
      } catch (err) {
        throw new Error(`Malformed sidecar ${category.dir}/${sourcePascal}.json: ${err.message}`);
      }
    }
    for (const key of Object.keys(sidecar)) {
      if (!SIDECAR_FIELDS.has(key)) throw new Error(`Unknown sidecar field ${sourcePascal}.${key}`);
    }
    for (const field of ARRAY_FIELDS) {
      if (sidecar[field] !== undefined && (
        !Array.isArray(sidecar[field]) || sidecar[field].some(value => typeof value !== 'string' || !value)
      )) {
        throw new Error(`${sourcePascal}.${field} must be an array of non-empty strings`);
      }
      if (sidecar[field] && new Set(sidecar[field]).size !== sidecar[field].length) {
        throw new Error(`${sourcePascal}.${field} contains duplicate values`);
      }
    }
    for (const field of STRING_FIELDS) {
      if (sidecar[field] !== undefined && (typeof sidecar[field] !== 'string' || !sidecar[field])) {
        throw new Error(`${sourcePascal}.${field} must be a non-empty string`);
      }
    }
    if (sidecar.status !== undefined && !STATUSES.has(sidecar.status)) {
      throw new Error(`${sourcePascal}.status is invalid: ${sidecar.status}`);
    }
    const hasIntent = ['concepts', 'roles', 'useWhen', 'avoidWhen'].some(field => sidecar[field] !== undefined);
    if (hasIntent) {
      for (const field of ['concepts', 'roles', 'useWhen', 'avoidWhen']) {
        if (!sidecar[field]?.length) throw new Error(`${sourcePascal} intent requires non-empty ${field}`);
      }
      if (!sidecar.status) throw new Error(`${sourcePascal} intent requires lifecycle status`);
    }
    const aliases = sidecar.aliases ?? [];
    if (!aliases.length) withoutAliases.push(pascal);
    icons.push({
      name: pascal,
      category: category.id,
      kebab,
      aliases,
      ...Object.fromEntries(
        Object.entries(sidecar).filter(([key]) => key !== 'aliases')
      ),
    });
  }
}

const iconNames = new Set(icons.map(icon => icon.name));
for (const icon of icons) {
  for (const reference of [...(icon.related ?? []), icon.variantOf, icon.replacedBy].filter(Boolean)) {
    if (!iconNames.has(reference)) throw new Error(`${icon.name} references unknown icon ${reference}`);
  }
}

const meta = {
  version: pkg.version,
  count: icons.length,
  categories,
  icons,
};

writeFileSync(path.join(DIST_DIR, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

const agentEntries = icons.filter(icon => icon.concepts || icon.roles || icon.useWhen || icon.avoidWhen);
const agentManifest = {
  schemaVersion: '1.0.0',
  package: pkg.name,
  packageVersion: pkg.version,
  kind: 'icons',
  entries: agentEntries,
};
writeFileSync(path.join(DIST_DIR, 'agent.json'), JSON.stringify(agentManifest, null, 2) + '\n');
writeFileSync(
  path.join(DIST_DIR, 'agent.mjs'),
  `const manifest = ${JSON.stringify(agentManifest, null, 2)};\nexport default manifest;\n`,
);
writeFileSync(path.join(DIST_DIR, 'agent.d.ts'), `export interface IconAgentEntry {
  name: string;
  category: string;
  kebab: string;
  aliases: string[];
  concepts: string[];
  roles: string[];
  useWhen: string[];
  avoidWhen: string[];
  related?: string[];
  variantOf?: string;
  status: 'experimental' | 'stable' | 'deprecated' | 'removed';
  replacedBy?: string;
}

export interface IconAgentManifest {
  schemaVersion: '1.0.0';
  package: '@ds-mo/icons';
  packageVersion: string;
  kind: 'icons';
  entries: IconAgentEntry[];
}

declare const manifest: IconAgentManifest;
export default manifest;
`);

const dts = `export interface IconMetaEntry {
  name: string;
  category: string;
  kebab: string;
  aliases: string[];
  concepts?: string[];
  roles?: string[];
  useWhen?: string[];
  avoidWhen?: string[];
  related?: string[];
  variantOf?: string;
  status?: 'experimental' | 'stable' | 'deprecated' | 'removed';
  replacedBy?: string;
}

export interface IconCategorySummary {
  count: number;
  colorModel: 'monochrome' | 'multicolor' | 'layered';
  motion: 'static' | 'animated';
  /** @deprecated Use colorModel. */
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
console.log(`    Generated agent.json (${agentEntries.length} icons with intent guidance)`);
