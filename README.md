# @ds-mo/icons

[![npm version](https://img.shields.io/npm/v/@ds-mo/icons.svg)](https://www.npmjs.com/package/@ds-mo/icons)

IcoMo — **423 SVG icons** (391 system icons + 32 country flags) as tree-shakeable React components, framework-agnostic SVG strings, TypeScript definitions, and an SVG sprite.

Part of the **ds-mo design system trilogy**: [@ds-mo/tokens](https://www.npmjs.com/package/@ds-mo/tokens) → **@ds-mo/icons** → [@ds-mo/ui](https://www.npmjs.com/package/@ds-mo/ui) (CompoMo).

Figma-first: icons are exported from Figma and built into React components via generator scripts. Drop in new SVGs, run the build, everything updates.

## Install

```bash
npm install @ds-mo/icons
# or
pnpm add @ds-mo/icons
```

React is a peer dependency for the React entry points — vanilla SVG / sprite consumers don't need it.

## Icon browser

Browse and search all icons at the [GitHub Pages icon browser](https://zainadeel.github.io/icomo/). Live search (includes aliases), size toggle, light/dark theme, category tabs, click-to-copy imports.

## Categories

Icons are grouped into **categories** so the pipeline can treat them differently:

| Category | Count | Themeable | Description |
|---|---|---|---|
| `system` | 391 | ✅ `currentColor` | Monochrome UI icons — respond to CSS `color` and the `color` prop |
| `flag` | 32 | ❌ preserved | Multi-color country flags — hex + P3 wide-gamut colors kept verbatim |

Flag component names are prefixed with `Flag` (e.g. `FlagFrance`, `FlagUnitedStates`) so every export is globally unique.

## Usage

### React components

```tsx
import { ArrowRight, CheckCircle, FlagFrance, FlagUnitedStates } from '@ds-mo/icons';

// System icon — themeable
<ArrowRight />                                    // 20px, currentColor
<ArrowRight size={24} />
<ArrowRight size={24} color="red" />
<ArrowRight size="var(--dimension-size-400)" color="var(--color-icon-primary)" />

// Flag icon — colors preserved, no `color` prop
<FlagFrance />
<FlagUnitedStates size={32} />
```

All standard SVG attributes are forwarded. Category-specific props:

| Prop | System | Flag | Default | Description |
|---|---|---|---|---|
| `size` | ✅ | ✅ | `20` | Width and height |
| `color` | ✅ | — | `'currentColor'` | Fill color (system only) |
| `className` | ✅ | ✅ | — | CSS class |

### Direct / subpath imports

For guaranteed tree-shaking or category-only bundles:

```tsx
// Single system icon
import { ArrowRight } from '@ds-mo/icons/icons/ArrowRight';

// Single flag
import { FlagFrance } from '@ds-mo/icons/flags/FlagFrance';

// Flag-only barrel
import { FlagFrance, FlagGermany } from '@ds-mo/icons/flags';
```

### Framework-agnostic SVG strings

For Angular, Vue, Svelte, web components, Liquid, vanilla JS — any consumer that wants raw SVG markup without React:

```ts
import { ArrowRight } from '@ds-mo/icons/svg';            // system
import { FlagFrance } from '@ds-mo/icons/svg';            // flag (prefixed)
import { FlagFrance } from '@ds-mo/icons/svg/flags';      // flag-only

// ArrowRight === '<svg ...>...</svg>' with fill="currentColor"
// FlagFrance === '<svg ...>...</svg>' with hex fills + P3 color(display-p3 ...)
element.innerHTML = ArrowRight;
```

### SVG sprite

Drop the sprite into your HTML and reference by kebab-case name:

```html
<svg width="20" height="20"><use href="/sprite.svg#arrow-right"/></svg>
<svg width="20" height="20"><use href="/sprite.svg#flag-france"/></svg>
<svg width="20" height="20"><use href="/sprite.svg#flag-united-states"/></svg>
```

Sprite path: `node_modules/@ds-mo/icons/dist/sprite.svg` (or via the `./sprite` subpath export).

### Metadata manifest

Machine-readable icon list (for docs, agents, search indexes):

```ts
import meta from '@ds-mo/icons/meta';

meta.version      // e.g. "0.7.3" — matches package version
meta.count        // 423
meta.categories   // { system: {count:391,themeable:true}, flag: {count:32,themeable:false} }
meta.icons        // [{ name, category, kebab, aliases }, ...]
```

## CompoMo integration

IcoMo icons work with [CompoMo (@ds-mo/ui)](https://www.npmjs.com/package/@ds-mo/ui) components via the `icon` prop pattern:

```ts
icon?: React.ComponentType<{ size?: number | string }>
```

Both system and flag components satisfy this interface:

```tsx
import { Button } from '@ds-mo/ui';
import { ArrowRight, CheckCircle, FlagFrance } from '@ds-mo/icons';

<Button icon={ArrowRight}>Continue</Button>
<Button icon={CheckCircle} variant="success">Done</Button>
<Button icon={FlagFrance}>Français</Button>
```

## Why flags keep their own colors

Flag SVGs ship with two color sources per element:

- `fill="#BE2A2C"` — standard hex, rendered on every browser
- `style="fill:color(display-p3 0.7451 0.1647 0.1725)"` — wide-gamut P3 for modern displays

The build preserves **both**: modern browsers use the P3 style; older browsers fall back to the hex attribute via SVG's native attribute-vs-style cascade. No pipeline transform touches `fill="black"` or strips `style=` for the flag category.

## Naming

| React | Sprite |
|---|---|
| `ArrowRight` | `arrow-right` |
| `CheckCircle` | `check-circle` |
| `EntityVehicleFilled` | `entity-vehicle-filled` |
| `FlagFrance` | `flag-france` |
| `FlagUnitedStates` | `flag-united-states` |

## Adding or updating icons

### System icons

1. Export SVG from Figma as 16×16, fill-based, with `fill="black"` (or no fill)
2. Drop into `src/icons/` — filename must be PascalCase (e.g. `MyNewIcon.svg`)
3. Optional: add `src/icons/MyNewIcon.json` with `{ "aliases": ["alt-name"] }`
4. Run the build

### Flag icons

1. Export SVG from Figma as 16×16 with all fill colors baked in
2. Drop into `src/flags/` — filename is the country name in PascalCase (e.g. `NewZealand.svg` → exports as `FlagNewZealand`)
3. Run the build

### Adding a new category

Add a config entry to `scripts/utils/categories.mjs` with its own `dir`, `prefix`, and `normalize` rules. Drop SVGs into `src/<dir>/`.

## Dev

```bash
npm run build         # full build (React + sprite + SVG strings + meta)
npm run build:docs    # regenerate docs/index.html
npm run dev           # watch mode
```

## License

MIT
