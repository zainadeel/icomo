/**
 * Naming utilities for IcoMo icon build
 *
 * Icon filenames are already PascalCase (e.g., ArrowRight.svg).
 * This module provides helpers for name conversions and manifest generation.
 */
import { readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Convert PascalCase to kebab-case for sprite IDs and data attributes
 * e.g., "ArrowRight" → "arrow-right", "AIChip" → "ai-chip"
 */
export function toKebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Read all SVG files from a directory and return a manifest
 * @param {string} iconsDir - path to src/icons/
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
