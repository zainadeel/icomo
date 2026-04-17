/**
 * Generate React components from SVG icon sources.
 *
 * Emits:
 *   dist/createIcon.mjs + .d.ts        — shared factory for themeable icons
 *   dist/createFlagIcon.mjs + .d.ts    — factory for multi-color icons (no color prop)
 *   dist/icons/{Pascal}.{mjs,d.ts}     — one file per system icon
 *   dist/flags/{FlagPascal}.{mjs,d.ts} — one file per flag icon
 *
 * Flag icons are multi-color and must preserve every source fill, so they:
 *   - don't accept a `color` prop
 *   - don't inject `fill={color}` on the root <svg>
 *   - keep inline `style="fill:...;fill:color(display-p3 ...)"` attrs intact
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCategoryManifest, CATEGORY_LIST } from './utils/naming.mjs';
import { parseSvgFile } from './utils/svg-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PKG_ROOT, 'dist');

// --- Shared factories ----------------------------------------------------

const createIconMjs = `import { forwardRef, createElement } from 'react';

const createIcon = (name, children) =>
  forwardRef(({ size = 20, color = 'currentColor', className, ...rest }, ref) =>
    createElement('svg', {
      ref,
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      fill: color,
      className,
      'data-icon': name,
      ...rest,
    }, ...children)
  );

export { createIcon };
`;

const createIconDts = `import { ForwardRefExoticComponent, RefAttributes, SVGAttributes } from 'react';

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** Icon size in pixels. Defaults to 20. */
  size?: number | string;
  /** Icon color. Defaults to 'currentColor'. */
  color?: string;
  /** Additional CSS class name. */
  className?: string;
}

export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export declare function createIcon(name: string, children: React.ReactNode[]): IconComponent;
`;

// Flag factory: no color prop, no root fill override.
// The inner <rect>/<path> carry their own fills (hex + P3 style).
const createFlagIconMjs = `import { forwardRef, createElement } from 'react';

const createFlagIcon = (name, children) =>
  forwardRef(({ size = 20, className, ...rest }, ref) =>
    createElement('svg', {
      ref,
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      fill: 'none',
      className,
      'data-icon': name,
      'data-category': 'flag',
      ...rest,
    }, ...children)
  );

export { createFlagIcon };
`;

const createFlagIconDts = `import { ForwardRefExoticComponent, RefAttributes, SVGAttributes } from 'react';

export interface FlagIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'color'> {
  /** Icon size in pixels. Defaults to 20. */
  size?: number | string;
  /** Additional CSS class name. */
  className?: string;
}

export type FlagIconComponent = ForwardRefExoticComponent<FlagIconProps & RefAttributes<SVGSVGElement>>;

export declare function createFlagIcon(name: string, children: React.ReactNode[]): FlagIconComponent;
`;

mkdirSync(DIST_DIR, { recursive: true });
writeFileSync(path.join(DIST_DIR, 'createIcon.mjs'), createIconMjs);
writeFileSync(path.join(DIST_DIR, 'createIcon.d.ts'), createIconDts);
writeFileSync(path.join(DIST_DIR, 'createFlagIcon.mjs'), createFlagIconMjs);
writeFileSync(path.join(DIST_DIR, 'createFlagIcon.d.ts'), createFlagIconDts);

// --- Per-icon components -------------------------------------------------

let totalGenerated = 0;
const warnings = [];

for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  if (!manifest.length) continue;

  const outDir = path.join(DIST_DIR, category.distDir);
  mkdirSync(outDir, { recursive: true });

  const factoryName = category.themeable ? 'createIcon' : 'createFlagIcon';
  const factoryType = category.themeable ? 'IconComponent' : 'FlagIconComponent';
  const factoryRelPath = category.themeable ? '../createIcon.mjs' : '../createFlagIcon.mjs';

  for (const { filename, pascal, kebab } of manifest) {
    const svgPath = path.join(PKG_ROOT, 'src', category.dir, filename);
    const { elements } = parseSvgFile(svgPath, category.normalize);

    if (elements.length === 0) {
      warnings.push(`  ⚠ No elements found in ${category.dir}/${filename}`);
      continue;
    }

    const componentMjs = `import { createElement } from 'react';
import { ${factoryName} } from '${factoryRelPath}';

const ${pascal} = ${factoryName}('${kebab}', [
  ${elements.join(',\n  ')},
]);

${pascal}.displayName = '${pascal}';
export { ${pascal} };
`;

    const componentDts = `import { ${factoryType} } from '${factoryRelPath}';
export declare const ${pascal}: ${factoryType};
`;

    writeFileSync(path.join(outDir, `${pascal}.mjs`), componentMjs);
    writeFileSync(path.join(outDir, `${pascal}.d.ts`), componentDts);
    totalGenerated++;
  }
}

if (warnings.length > 0) console.warn(warnings.join('\n'));
console.log(`    Generated ${totalGenerated} React icon components`);
