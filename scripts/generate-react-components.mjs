/**
 * Generate React components from SVG icon sources
 *
 * Reads src/icons/*.svg and produces:
 * - dist/createIcon.mjs + dist/createIcon.d.ts (shared factory)
 * - dist/icons/{PascalName}.mjs + .d.ts (one per icon)
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getIconManifest } from './utils/naming.mjs';
import { parseSvgFile } from './utils/svg-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const SRC_ICONS = path.join(PKG_ROOT, 'src', 'icons');
const DIST_DIR = path.join(PKG_ROOT, 'dist');
const DIST_ICONS = path.join(DIST_DIR, 'icons');

// Ensure output dirs exist
mkdirSync(DIST_ICONS, { recursive: true });

// --- Write shared createIcon factory ---

const createIconMjs = `import { forwardRef, createElement } from 'react';

const createIcon = (name, children) =>
  forwardRef(({ size = 16, color = 'currentColor', className, ...rest }, ref) =>
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
  /** Icon size in pixels. Defaults to 16. */
  size?: number | string;
  /** Icon color. Defaults to 'currentColor'. */
  color?: string;
  /** Additional CSS class name. */
  className?: string;
}

export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export declare function createIcon(name: string, children: React.ReactNode[]): IconComponent;
`;

writeFileSync(path.join(DIST_DIR, 'createIcon.mjs'), createIconMjs);
writeFileSync(path.join(DIST_DIR, 'createIcon.d.ts'), createIconDts);

// --- Generate per-icon components ---

const manifest = getIconManifest(SRC_ICONS);
let generated = 0;
let warnings = [];

for (const { filename, pascal, kebab } of manifest) {
  const svgPath = path.join(SRC_ICONS, filename);
  const { elements } = parseSvgFile(svgPath);

  if (elements.length === 0) {
    warnings.push(`  ⚠ No elements found in ${filename}`);
    continue;
  }

  // .mjs file
  const componentMjs = `import { createElement } from 'react';
import { createIcon } from '../createIcon.mjs';

const ${pascal} = createIcon('${kebab}', [
  ${elements.join(',\n  ')},
]);

${pascal}.displayName = '${pascal}';
export { ${pascal} };
`;

  // .d.ts file
  const componentDts = `import { IconComponent } from '../createIcon.mjs';
export declare const ${pascal}: IconComponent;
`;

  writeFileSync(path.join(DIST_ICONS, `${pascal}.mjs`), componentMjs);
  writeFileSync(path.join(DIST_ICONS, `${pascal}.d.ts`), componentDts);
  generated++;
}

if (warnings.length > 0) {
  console.warn(warnings.join('\n'));
}

console.log(`    Generated ${generated} React icon components`);
