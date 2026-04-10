# @icomo/icons

380 SVG icons as tree-shakeable React components, TypeScript definitions, and SVG sprite.

Figma-first: icons are exported from Figma and built into React components via generator scripts. Drop in new SVGs, run the build, everything updates.

## Install

```bash
npm install @icomo/icons
# or
pnpm add @icomo/icons

# Local development (no npm publish needed):
pnpm add file:../path/to/icomo
```

React is a peer dependency — make sure it's installed in your project.

## Usage

### React components

```tsx
import { ArrowRight, CheckCircle, Gear } from '@icomo/icons';

// Default: 16px, currentColor
<ArrowRight />

// Custom size and color
<ArrowRight size={24} color="red" />

// With TokoMo tokens
import { dimensionSize400, colorIconPrimary } from '@tokomo/tokens/ts';
<ArrowRight size={dimensionSize400} color={colorIconPrimary} />

// With CSS variables
<ArrowRight size="var(--dimension-size-400)" color="var(--color-icon-primary)" />

// With a ref
import { useRef } from 'react';
const ref = useRef<SVGSVGElement>(null);
<ArrowRight ref={ref} />
```

All standard SVG attributes are forwarded, plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `16` | Width and height |
| `color` | `string` | `'currentColor'` | Fill color |
| `className` | `string` | — | CSS class |

### Direct imports

For guaranteed tree-shaking in environments where barrel imports aren't optimised:

```tsx
import { ArrowRight } from '@icomo/icons/icons/ArrowRight';
```

### SVG sprite (non-React)

Include the sprite in your HTML, then reference icons by kebab-case name:

```html
<svg width="16" height="16"><use href="/sprite.svg#arrow-right"/></svg>
<svg width="16" height="16"><use href="/sprite.svg#check-circle"/></svg>
<svg width="16" height="16"><use href="/sprite.svg#gear"/></svg>
```

## Icon names

All icons are PascalCase in React, kebab-case in the sprite:

| React | Sprite |
|---|---|
| `ArrowRight` | `arrow-right` |
| `CheckCircle` | `check-circle` |
| `EntityVehicleFilled` | `entity-vehicle-filled` |

## Adding or updating icons

1. Export SVGs from Figma as 16×16, fill-based, with `fill="black"`
2. Drop into `src/icons/` — filenames must be PascalCase (e.g. `MyNewIcon.svg`)
3. Run the build:

```bash
node scripts/build.mjs
```

## Dev

```bash
node scripts/build.mjs          # full build
node scripts/build.mjs --watch  # watch mode (rebuilds on SVG changes)
```

## License

MIT
