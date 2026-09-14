# @ds-mo/icons

[![npm version](https://img.shields.io/npm/v/@ds-mo/icons.svg)](https://www.npmjs.com/package/@ds-mo/icons)

IcoMo — **448 SVG icons** (400 system icons + 32 country flags + 16 map icons) as tree-shakeable React components, framework-agnostic SVG strings, TypeScript definitions, and an SVG sprite.

Part of the **ds-mo design system trilogy**: [@ds-mo/tokens](https://www.npmjs.com/package/@ds-mo/tokens) → **@ds-mo/icons** → [@ds-mo/ui](https://www.npmjs.com/package/@ds-mo/ui) (CompoMo).

Figma-first: icons are exported from Figma and built into React components via generator scripts. Drop in new SVGs, run the build, everything updates.

## Install

```bash
npm install @ds-mo/icons
# or
pnpm add @ds-mo/icons
```

React is a peer dependency for the React entry points — vanilla SVG / sprite consumers don't need it.

## For shadcn/ui projects

Use IcoMo exactly as you would the icon components in shadcn examples: install the package, import the icons you use, and place them directly in JSX. Every system icon forwards standard SVG props, including Tailwind `className`, `aria-*`, and `data-*` attributes.

```tsx
import { ArrowRight, CheckCircle } from '@ds-mo/icons';
import { Button } from '@/components/ui/button';

export function SaveButton() {
  return (
    <Button>
      <CheckCircle data-icon="inline-start" className="size-4" aria-hidden />
      Save changes
    </Button>
  );
}

export function ContinueButton() {
  return (
    <Button size="icon" aria-label="Continue">
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  );
}
```

`data-icon="inline-start"` uses shadcn's automatic Button icon spacing. IcoMo system icons are tree-shakeable, so importing `ArrowRight` does not bundle the rest of the library. Use the package when you want versioned icon updates; use the [icon browser](https://zainadeel.github.io/icomo/) to find names and copy imports.

## Icon browser

Browse and search all icons at the [GitHub Pages icon browser](https://zainadeel.github.io/icomo/). Live search (includes aliases), size toggle, light/dark theme, category tabs, click-to-copy imports.

## Categories

Icons are grouped into **categories** so the pipeline can treat them differently:

| Category | Count | Themeable | Description |
|---|---|---|---|
| `system` | 400 | ✅ `currentColor` | Monochrome UI icons — respond to CSS `color` and the `color` prop |
| `flag` | 32 | ❌ preserved | Multi-color country flags — hex + P3 wide-gamut colors kept verbatim |
| `map` | 16 | ✅ `currentColor` | Monochrome glyphs drawn for use inside a map marker shape |

Flag and map component names are prefixed with `Flag` / `Map` (e.g. `FlagFrance`, `MapEntityVehicle`) so every export is globally unique.

### Map icons

Map icons are themeable exactly like system icons — same `size` / `color` props — but they're drawn to sit inside a marker shape (pin, circle, cluster bubble). The shape is the consumer's (or CompoMo's); IcoMo ships only the glyph.

They're also fine to render standalone, e.g. in a map legend. What sets them apart is a type-level brand, so a marker component can require one:

```tsx
import type { MapIconComponent } from '@ds-mo/icons';

type MarkerProps = { icon: MapIconComponent };

<MapMarker icon={MapEntityVehicle} />   // ok
<MapMarker icon={ArrowRight} />         // type error — not a map icon
```

The brand is additive: a `MapIconComponent` still satisfies every generic icon slot, so nothing is restricted. Each map component also renders `data-category="map"` for styling and tooling.

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

| Prop | System | Flag | Map | Default | Description |
|---|---|---|---|---|---|
| `size` | ✅ | ✅ | ✅ | `20` | Width and height |
| `color` | ✅ | — | ✅ | `'currentColor'` | Fill color (monochrome categories only) |
| `className` | ✅ | ✅ | ✅ | — | CSS class |

### Direct / subpath imports

For guaranteed tree-shaking or category-only bundles:

```tsx
// Single system icon
import { ArrowRight } from '@ds-mo/icons/icons/ArrowRight';

// Single flag
import { FlagFrance } from '@ds-mo/icons/flags/FlagFrance';

// Flag-only barrel
import { FlagFrance, FlagGermany } from '@ds-mo/icons/flags';

// Single map icon, or the map-only barrel
import { MapEntityVehicle } from '@ds-mo/icons/map/MapEntityVehicle';
import { MapGeofence, MapLockClosed } from '@ds-mo/icons/map';
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

### iOS / Xcode asset catalog

Xcode 12+ supports SVG directly in asset catalogs, so iOS consumes the same vectors as every other platform — no separate export format.

The build emits a flat folder of standalone `.svg` files — one per icon, ready to drag into Xcode:

```bash
npm run build        # generates dist/svg-files/<Name>.svg (448 files)
```

These ship with the package, so an iOS project can pull them straight out of `node_modules/@ds-mo/icons/dist/svg-files/` (or the `./svg-files/*` subpath export) without cloning this repo. Flags are prefixed (`FlagFrance.svg`) so the folder stays collision-free and flat.

Unlike the bundler-facing strings in `dist/svg/`, these keep a concrete `fill="black"` rather than `currentColor` — asset catalogs have no CSS cascade, and template rendering tints from the alpha channel regardless.

**Adding to Xcode:**

1. Drag `dist/svg-files/` into your `.xcassets` asset catalog in Xcode.
2. For each icon, set **Scales → Single Scale** in the Attributes inspector — iOS scales the vector at runtime.
3. For **system icons** (monochrome, e.g. `ArrowRight.svg`): set **Render As → Template Image** so the icon responds to tint color.
4. For **flag icons** (e.g. `FlagFrance.svg`): set **Render As → Original Image** to preserve their colors.

Then use in SwiftUI or UIKit:

```swift
// SwiftUI
Image("ArrowRight")
    .renderingMode(.template)
    .foregroundColor(.accentColor)

Image("FlagFrance")
    .renderingMode(.original)

// UIKit
UIImage(named: "ArrowRight")?.withRenderingMode(.alwaysTemplate)
```

### Metadata manifest

Machine-readable icon list (for docs, agents, search indexes):

```ts
import meta from '@ds-mo/icons/meta';

meta.version      // matches package version (e.g. "6.0.1")
meta.count        // 448
meta.categories   // { system: {count:400,themeable:true}, flag: {count:32,themeable:false}, map: {count:16,themeable:true} }
meta.icons        // [{ name, category, kebab, aliases }, ...]
```

## CompoMo integration

IcoMo icons work with [CompoMo (@ds-mo/ui)](https://www.npmjs.com/package/@ds-mo/ui) components via the `icon` prop pattern:

```ts
icon?: React.ComponentType<{ size?: number | string }>
```

System, flag, and map components all satisfy this interface:

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

### Map icons

1. Export SVG from Figma as 16×16 with `fill="black"` (same contract as a system icon)
2. Drop into `src/map/` **without** the `Map` prefix (e.g. `Geofence.svg` → exports as `MapGeofence`)
3. Run the build

### Adding a new category

Add a config entry to `scripts/utils/categories.mjs` with its own `dir`, `prefix`, `factory`, and `normalize` rules. Drop SVGs into `src/<dir>/`.

## Dev

```bash
npm run build         # full build (React + sprite + SVG strings + meta + svg files)
npm run build:docs    # regenerate docs/index.html
npm run build:svg     # regenerate dist/svg-files/ only (also part of build)
npm run dev           # watch mode
```

## License

MIT
