# Changelog

All notable changes to `@ds-mo/icons` are documented here.

---

## [0.5.0] — 2026-04-16

### Added

- **Icon categories** — pipeline now supports multiple icon families with per-category normalization rules. Config lives in `scripts/utils/categories.mjs`.
- **Flag category** — 32 country flag icons (Austria, Belgium, Bulgaria, Canada, Croatia, Cyprus, Czech Republic, Denmark, Estonia, EU, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Mexico, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, United Kingdom, United States).
- Flags exported as `FlagFrance`, `FlagUnitedStates`, etc. — prefixed for global uniqueness.
- Flag icons preserve every hex fill **and** wide-gamut `color(display-p3 ...)` values from source — no `currentColor` rewriting, no inline-style stripping.
- `createFlagIcon` factory — flag components omit the `color` prop (meaningless for multi-color icons) and tag the root `<svg>` with `data-category="flag"`.
- New subpath exports: `./flags`, `./flags/*`, `./svg/flags`, `./svg/flags/*`, `./createFlagIcon`.
- `meta.json` schema extended with a `categories` field: `{ system: {count, themeable}, flag: {count, themeable} }`. Each icon entry now includes `category`.
- Doc-site sub-toolbar with `All / System / Flags` tabs (TokoMo pattern).

### Changed

- `meta.json` icon entries gained a `category` field. Existing `name`, `kebab`, `aliases` fields unchanged.
- Total icon count: **409** (377 system + 32 flag).

### Non-breaking

All existing imports (`import { ArrowRight } from '@ds-mo/icons'`, `/icons/*`, `/svg`, `/svg/*`, `/sprite`, `/meta`) continue to work unchanged.

---

## [0.4.0] — 2026-04-15

### Added

- `./svg` and `./svg/*` subpath exports emitting raw SVG strings for framework-agnostic consumers (Angular, Vue, Svelte, web components, vanilla JS).

---

## [0.3.0] — 2026-04-15

### Added

- Per-icon sidecar JSONs (`src/icons/<IconName>.json`) with search aliases (Lucide-style).
- `./meta` subpath export — machine-readable manifest (`{version, count, icons: [{name, kebab, aliases}]}`).
- Doc-site search matches on aliases.
- `marker` alias added to 12 `Entity*` icons.

### Fixed

- `GuageTemperature` → `GaugeTemperature` typo.

---

## [0.2.0] — 2026-04-14

### Breaking changes

**13 icons renamed** — the `UI` suffix has been dropped to align with the updated Figma source. Update any existing imports accordingly.

| Old name | New name |
|---|---|
| `ArrowDownUI` | `ArrowDown` |
| `ArrowUpUI` | `ArrowUp` |
| `CheckDoubleUI` | `CheckDouble` |
| `CheckUI` | `Check` |
| `ChevronUpDownUI` | `ChevronUpDown` |
| `CrossUI` | `Cross` |
| `MinimizeUI` | `Minimize` |
| `PauseUI` | `Pause` |
| `PauseUIFilled` | `PauseFilled` |
| `VolumeMuteUI` | `VolumeMute` |
| `VolumeMuteUIFilled` | `VolumeMuteFilled` |
| `VolumeUI` | `Volume` |
| `VolumeUIFilled` | `VolumeFilled` |

### Updated

SVG paths updated for 9 icons (visual refresh from Figma):

- `AI`
- `ArrowDown` _(visual replaced by the former `ArrowDownUI` design — existing imports continue to work)_
- `ArrowUp` _(visual replaced by the former `ArrowUpUI` design — existing imports continue to work)_
- `Bell`
- `BellCircle`
- `BellExclamation`
- `BellRinging`
- `BellWifi`
- `Check` _(visual replaced by the former `CheckUI` design — existing imports continue to work)_

### Summary

377 icons total (previously 380).

---

## [0.1.0] — Initial release

- 380 SVG icons as tree-shakeable React components
- TypeScript definitions
- SVG sprite sheet
- GitHub Pages icon browser
