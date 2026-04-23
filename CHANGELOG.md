# Changelog

All notable changes to `@ds-mo/icons` are documented here.

---

## [0.7.4](https://github.com/zainadeel/icomo/compare/v0.7.3...v0.7.4) (2026-04-23)


### Documentation

* refresh readme meta example and package homepage ([#28](https://github.com/zainadeel/icomo/issues/28)) ([144d81b](https://github.com/zainadeel/icomo/commit/144d81b06a094dd20d79d44f3e0fa456c16cf88d))

## [0.7.3](https://github.com/zainadeel/icomo/compare/v0.7.2...v0.7.3) (2026-04-22)


### Fixed

* raise sub-toolbar height to 48px to match header ([7ee4712](https://github.com/zainadeel/icomo/commit/7ee47127d0e506d82e4e3ed4eb9accd89f53dadd))
* raise sub-toolbar height to 48px to match header ([9636b5e](https://github.com/zainadeel/icomo/commit/9636b5e52c6836404b0623288c573ff2331f8c4f))

## [0.7.2](https://github.com/zainadeel/icomo/compare/v0.7.1...v0.7.2) (2026-04-17)


### Fixed

* upgrade npm in publish workflow to support OIDC trusted publishing ([ca1a16f](https://github.com/zainadeel/icomo/commit/ca1a16faf3be86cd9a24c18b45a14bedd4ae5a04))
* upgrade npm in publish workflow to support OIDC trusted publishing ([173415e](https://github.com/zainadeel/icomo/commit/173415e706d3274632a3dc9a71118863d221131c))

## [0.7.1](https://github.com/zainadeel/icomo/compare/v0.7.0...v0.7.1) (2026-04-17)


### Fixed

* use JSON.stringify for code-gen string escaping in svg-parser ([4f19585](https://github.com/zainadeel/icomo/commit/4f19585efccb7def3244ae77f7d04ec072e838a2))
* use JSON.stringify for code-gen string escaping in svg-parser ([c150a52](https://github.com/zainadeel/icomo/commit/c150a5282b614f182ce38d4388e522f5ebe81168))

## [0.7.0](https://github.com/zainadeel/icomo/compare/v0.6.0...v0.7.0) (2026-04-17)


### Fixed

* keep release-please tags as v0.7.0 not icons-v0.7.0 ([364b56f](https://github.com/zainadeel/icomo/commit/364b56facf399d7edfce7f876e61e583dee08463))
* keep release-please tags as v0.7.0 not icons-v0.7.0 ([115ba66](https://github.com/zainadeel/icomo/commit/115ba66ff7854aab79a5e896bce7956f86940e69))


### Documentation

* add AGENTS.md and CLAUDE.md for agent onboarding ([#16](https://github.com/zainadeel/icomo/issues/16)) ([05d1178](https://github.com/zainadeel/icomo/commit/05d1178ff865bb2dce2e8e42b31d33617ea0cc7d))


### Miscellaneous

* release 0.7.0 ([9968b8f](https://github.com/zainadeel/icomo/commit/9968b8f6bd1bbb479319b716ab8211c522103847))

## [0.6.0] — 2026-04-17

### Breaking changes

**6 icons renamed** — update any existing imports:

| Old name | New name |
|---|---|
| `MenuExpand` | `LeftExpand` |
| `MenuExpandB` | `LeftExpandB` |
| `MenuCollapse` | `LeftCollapse` |
| `MenuCollapseB` | `LeftCollapseB` |
| `Circle` | `Dot` |
| `CircleFilled` | `DotFilled` |

**`Circle` and `CircleFilled` names reclaimed for a new visual.** The old small ring/disc icons now live as `Dot` / `DotFilled`; the reclaimed `Circle` / `CircleFilled` are a different (larger, general-purpose) shape. Consumers importing `{ Circle }` or `{ CircleFilled }` by name will render a different icon at 0.6.0 than at 0.5.0.

### Added

**13 new icons:**

- `Circle`, `CircleFilled` — new general-purpose circle shape (distinct from the old small ring, which is now `Dot` / `DotFilled`)
- `RightExpand`, `RightExpandB`, `RightCollapse`, `RightCollapseB` — right-side mirrors of the `Left*` sidebar toggles
- `Pin`, `ParagraphCheck`
- `SquareCheckFilled`, `SquareDollar`, `SquareFilled`, `SquareSubtractFilled`, `SubtractCircleFilled` — filled variants

Alias doc convention for direction-paired icons documented in `ICON_ALIASES_REVIEW.md` (e.g. `LeftExpand` has `expand-left`, `RightExpand` has `expand-right`). `Dot` ↔ `Circle` cross-aliases added so search matches both terms.

### Updated

SVG paths updated for 6 icons (visual refresh from Figma):

- `LeftExpand` (arrow shifted; existing imports continue to work)
- `Logout`
- `Volume`, `VolumeFilled`, `VolumeMute`, `VolumeMuteFilled`

### Summary

**422** icons total (390 system + 32 flag) — previously 409.

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
