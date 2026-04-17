/**
 * Naming utilities for IcoMo icon build
 *
 * Source filenames are already PascalCase (e.g., ArrowRight.svg, France.svg).
 * This module provides name conversions and category-aware manifest generation.
 */
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { CATEGORY_LIST, CATEGORIES } from './categories.mjs';

/**
 * Convert PascalCase to kebab-case for sprite IDs and data attributes
 * e.g., "ArrowRight" → "arrow-right", "AIChip" → "ai-chip", "FlagEU" → "flag-eu"
 */
export function toKebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Read all SVG files from a directory and return a flat manifest.
 * Used by category-unaware callers (kept for backward-compat / simple cases).
 *
 * @param {string} iconsDir - absolute path to a source directory
 * @returns {Array<{ filename: string, pascal: string, kebab: string }>}
 */
export function getIconManifest(iconsDir) {
  const files = readdirSync(iconsDir)
    .filter(f => f.endsWith('.svg'))
    .sort();

  return files.map(filename => {
    const pascal = path.basename(filename, '.svg');
    const kebab = toKebabCase(pascal);
    return { filename, pascal, kebab };
  });
}

/**
 * Read a source directory for a given category and return a category-aware manifest.
 *
 * Pascal name has the category prefix applied: France.svg in flags/ → FlagFrance.
 * Kebab is derived from the prefixed name for uniqueness across categories.
 *
 * @param {string} pkgRoot
 * @param {{ id: string, dir: string, prefix: string }} category
 * @returns {Array<{ filename: string, sourcePascal: string, pascal: string, kebab: string, category: string }>}
 */
export function getCategoryManifest(pkgRoot, category) {
  const srcDir = path.join(pkgRoot, 'src', category.dir);
  if (!existsSync(srcDir)) return [];

  const files = readdirSync(srcDir)
    .filter(f => f.endsWith('.svg'))
    .sort();

  return files.map(filename => {
    const sourcePascal = path.basename(filename, '.svg');
    const pascal = category.prefix
      ? `${category.prefix}${sourcePascal}`
      : sourcePascal;
    const kebab = toKebabCase(pascal);
    return { filename, sourcePascal, pascal, kebab, category: category.id };
  });
}

/**
 * Full manifest across every configured category. Deterministic ordering:
 * categories in CATEGORY_LIST order, then alphabetical within each.
 *
 * @param {string} pkgRoot
 * @returns {Array<{ filename, sourcePascal, pascal, kebab, category }>}
 */
export function getAllIcons(pkgRoot) {
  return CATEGORY_LIST.flatMap(cat => getCategoryManifest(pkgRoot, cat));
}

export { CATEGORIES, CATEGORY_LIST };
