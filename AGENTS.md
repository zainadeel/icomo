# AGENTS.md

Guide for AI agents (and humans) working on **IcoMo** (`@ds-mo/icons`). Follows the [agents.md](https://agents.md) convention — tool-agnostic. `CLAUDE.md` points here.

Keep this file as the single source of truth for project conventions. Update it when you add pipelines, categories, or change the release flow.

---

## What this project is

IcoMo is an npm package (`@ds-mo/icons`) that ships **422 SVG icons** (390 system + 32 country flags) as:

- Tree-shakeable React components
- Framework-agnostic SVG strings (for Angular/Vue/Svelte/vanilla/etc.)
- An SVG sprite
- TypeScript definitions
- A machine-readable meta manifest (aliases, kebab names, categories)

It's part of the **ds-mo** design-system trilogy: `@ds-mo/tokens` → `@ds-mo/icons` → `@ds-mo/ui` (CompoMo). IcoMo is Figma-first — source SVGs are exported from Figma, dropped into `src/`, and generator scripts produce the dist artifacts.

---

## Directory map

```
src/
  icons/          # System icons — PascalCase.svg + optional PascalCase.json sidecar
  flags/          # Country flags — PascalCase.svg (build prefixes component name with `Flag`)
scripts/
  build.mjs                     # Orchestrates the whole build
  generate-react-components.mjs # SVGs → React .mjs + .d.ts per icon
  generate-barrel.mjs           # Barrel index (re-exports everything)
  generate-sprite.mjs           # Single sprite.svg with <symbol> per icon
  generate-svg-strings.mjs      # Raw '<svg>...</svg>' string exports
  generate-meta.mjs             # dist/meta.json — aliases, kebab, category
  seed-aliases.mjs              # One-shot: ICON_ALIASES_REVIEW.md → src/icons/*.json
  build-docs.mjs                # Regenerates docs/index.html (GH Pages browser)
  docs-template.html            # Template for the icon browser
  utils/
    categories.mjs  # Category config (system, flag) — add entry + drop SVGs to add a category
    naming.mjs      # PascalCase / kebab-case / manifest helpers
    svg-parser.mjs  # SVG normalization rules
docs/
  index.html        # Built GitHub Pages browser (do NOT edit by hand — regenerate)
.github/
  workflows/
    build.yml          # PR: npm ci, build, build:docs, verify artifacts + src unchanged
    codeql.yml         # JS/TS security scan — PR + push + weekly Sunday cron
    pr-title.yml       # Lints PR titles as conventional commits
    release-please.yml # Opens release PRs on feat/fix; auto-publishes to npm on merge (OIDC)
    deploy.yml         # Builds + deploys the GH Pages icon browser
  dependabot.yml       # Monthly bumps for github-actions + npm
release-please-config.json      # Release Please config (node, changelog sections)
.release-please-manifest.json   # Pinned current version
ICON_ALIASES_REVIEW.md          # Editable source for initial alias seeding + convention notes
```

---

## Commands

```bash
npm run build        # Full build — React + sprite + SVG strings + meta
npm run build:docs   # Rebuild docs/index.html (GH Pages browser)
npm run dev          # Watch mode — rebuilds on src changes
npm run clean        # Remove dist/
```

No separate test/lint commands — validation is done by the Build workflow on every PR (it re-runs the build and asserts `src/` was not mutated).

---

## Build pipeline (what `npm run build` does)

1. **Clean** — nuke `dist/`, recreate `dist/icons/` and `dist/flags/`
2. **Generate React components** (`generate-react-components.mjs`) — for each SVG in `src/<category-dir>/`, emit `dist/<distDir>/<Name>.mjs` + `.d.ts`
3. **Generate barrel** (`generate-barrel.mjs`) — re-export every icon from `dist/index.mjs`
4. **Generate sprite** (`generate-sprite.mjs`) — consolidate into `dist/sprite.svg`
5. **Generate SVG strings** (`generate-svg-strings.mjs`) — framework-agnostic raw-string exports under `dist/svg/`
6. **Generate meta** (`generate-meta.mjs`) — `dist/meta.json` + typed `meta.mjs` with `{version, count, categories, icons: [{name, category, kebab, aliases}]}`

The pipeline is **category-aware** — category config lives in `scripts/utils/categories.mjs`.

---

## Categories

Two categories today; adding a new one is an explicit, well-defined operation.

| Category | Dir | Prefix | Themeable | Normalization |
|---|---|---|---|---|
| `system` | `src/icons/` | _(none)_ | ✅ `currentColor` | Strip style, `fill="black"` → `currentColor`, skip black/none fills |
| `flag` | `src/flags/` | `Flag` | ❌ preserved | Keep every `fill` and inline `style` (hex + P3 wide-gamut) |

**To add a category:** add an entry to `scripts/utils/categories.mjs` with its own `dir`, `prefix`, `distDir`, `themeable`, and `normalize` rules. Drop SVGs into `src/<dir>/`. No pipeline code changes needed.

---

## Adding or updating icons

### System icons

1. Export from Figma at **16×16**, fill-based, with `fill="black"` (or no fill).
2. Save as `src/icons/PascalCase.svg` (e.g. `ArrowRight.svg`). Filename **is** the component name — `import { ArrowRight } from '@ds-mo/icons'`.
3. Optional: add `src/icons/PascalCase.json` with `{ "aliases": ["alt-name", "synonym"] }` for search.
4. Run `npm run build`.

### Flag icons

1. Export from Figma at **16×16** with all fill colors baked in (hex + P3 `style`).
2. Save as `src/flags/PascalCase.svg` using the country's PascalCase name — `NewZealand.svg` → exports as `FlagNewZealand`.
3. Run `npm run build`.

### Processing a Figma re-export (batch drop)

When the user dumps an updated full export (e.g. `~/Downloads/icons`):

1. Diff against `src/icons/`:
   - **New** files → copy in + add alias sidecar if applicable.
   - **Modified** files (different SHA) → copy in; note as "refreshed" in CHANGELOG.
   - **Missing** files in export → do **not** delete from `src/` without explicit user confirmation.
2. Update `ICON_ALIASES_REVIEW.md` (count in the "Full list" header + new entries in alphabetical position).
3. Update `README.md` / `package.json` description counts.
4. Add a CHANGELOG entry listing Added / Updated / (rare) Breaking.
5. Run `npm run build` and verify the icon browser renders the new ones: `npm run build:docs`.

---

## Aliases convention

Aliases are semantic synonyms — lucide-style, lowercase, hyphenated. Stored in per-icon `src/icons/<Name>.json` sidecars: `{ "aliases": ["alt1", "alt2"] }`. They're merged into `dist/meta.json` so the icon browser and consumers can search by intent.

**Direction-paired icons** (Left/Right, Up/Down, Top/Bottom): include the direction word so search can disambiguate. E.g. `LeftExpand` → `"expand-left"`, `RightExpand` → `"expand-right"`.

**Renamed icons:** seed the old name as an alias on the new icon (e.g. `Dot` gets `"circle"` as an alias after renaming from `Circle`). This keeps search-by-old-name working.

`ICON_ALIASES_REVIEW.md` is the human-readable master list. It's editable by hand; `seed-aliases.mjs` regenerates sidecars from it. **After initial seeding, sidecars are the source of truth** — edit them directly for new icons. Keep `ICON_ALIASES_REVIEW.md` in sync so future agents have a readable map.

---

## Commit & PR conventions

**Conventional Commits**, enforced by `.github/workflows/pr-title.yml`:

```
<type>(<optional-scope>): <lowercase subject>

types: feat | fix | perf | revert | docs | style | refactor | test | build | ci | chore
```

Subject must **start with a lowercase letter** (workflow enforced). Scope is optional — common ones here: `icons`, `docs`, `build`.

**Version-bumping types** (trigger a release PR via release-please):
- `feat:` → minor bump
- `fix:` / `perf:` → patch bump
- `feat!:` or `BREAKING CHANGE:` footer → major bump (but pre-1.0 we bump minor for breaking — see Versioning below)
- `ci:` / `chore:` / `build:` / `test:` / `style:` / `docs:` / `refactor:` → **do not trigger a release** (most are hidden in the changelog; `docs` is visible)

See `release-please-config.json` for the type → changelog section mapping.

**Branch naming:** `type/short-kebab-description` (e.g. `feat/add-pin-icon`, `ci/add-release-workflow`, `docs/agent-onboarding`).

**PR flow:** always via feature branch + PR to `main`. Direct pushes to `main` are blocked.

---

## Versioning

Pre-1.0: breaking renames ship as **minor** bumps (e.g. `0.5.0` → `0.6.0` carried a `MenuExpand` → `LeftExpand` rename). Once we hit `1.0.0`, renames go behind majors.

Current version lives in three places — keep them in sync for releases not driven by release-please:
- `package.json` `"version"`
- `.release-please-manifest.json` `"."`
- `README.md` / `package.json` `"description"` counts (icon totals) when icon count changes

Release-please handles all three automatically when it opens a release PR.

---

## Release flow

**Automated path (normal case):**

1. Land a `feat:` or `fix:` commit on `main` via PR.
2. `release-please.yml` fires → opens (or updates) a release PR that bumps `package.json`, updates `CHANGELOG.md`, and updates the manifest.
3. Review and merge the release PR.
4. Release Please tags `vX.Y.Z`, creates the GitHub Release, and the `publish` job in the same workflow publishes to npm with `--provenance` via **OIDC Trusted Publisher** (no long-lived `NPM_TOKEN` — configured in npm under Package Settings → Trusted Publishers).

**Forcing a specific version:** push an empty commit with a `Release-As: X.Y.Z` trailer to `main`. Release-please will open a release PR at that exact version. Useful when CI-only commits have accumulated and you want to cut a release anyway.

**Never** run `npm publish` manually for a normal release — it bypasses provenance and skips the tag/release/changelog dance. Manual publish is only for one-off recovery.

---

## CI workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `build.yml` | PR to main, manual | `npm ci` + build + build:docs + verify dist exists + verify `src/` not mutated by build |
| `pr-title.yml` | PR opened/edited | Enforce conventional-commit PR titles |
| `codeql.yml` | Push/PR to main, weekly Sunday | GitHub CodeQL JS/TS security scan |
| `release-please.yml` | Push to main | Open release PR on feat/fix; publish to npm via OIDC when release PR merges |
| `deploy.yml` | Push to main (docs/), manual | Build + deploy icon browser to GitHub Pages |
| `dependabot.yml` | Monthly | Bump github-actions + npm devDependencies |

---

## Things not to do

- **Do not edit `dist/`** — it's generated. Edit `src/` or scripts, then run `npm run build`.
- **Do not edit `docs/index.html`** — regenerate with `npm run build:docs`.
- **Do not hand-bump `package.json` version** during normal work — let release-please do it.
- **Do not `git push` to `main`** — always branch + PR.
- **Do not delete an icon from `src/` without explicit user confirmation** — even if a Figma re-export omits it. It might be intentional or it might be a Figma filter accident.
- **Do not rename SVG files outside `git mv`** — we want history preserved.
- **Do not add a new category by editing `generate-*.mjs`** — add a config entry in `scripts/utils/categories.mjs`; the pipeline is already category-aware.
- **Do not commit `NPM_TOKEN` or any npm auth** — publishing uses OIDC, no secrets required.

---

## Quick reference: where things live

| Need to change... | Edit this |
|---|---|
| An icon's SVG | `src/icons/<Name>.svg` or `src/flags/<Name>.svg` |
| An icon's aliases | `src/icons/<Name>.json` (and mirror in `ICON_ALIASES_REVIEW.md`) |
| React component output format | `scripts/generate-react-components.mjs` |
| Sprite format | `scripts/generate-sprite.mjs` |
| Meta manifest shape | `scripts/generate-meta.mjs` |
| Category rules | `scripts/utils/categories.mjs` |
| PascalCase ↔ kebab-case logic | `scripts/utils/naming.mjs` |
| SVG normalization | `scripts/utils/svg-parser.mjs` |
| Icon browser styling / layout | `scripts/docs-template.html` + `scripts/build-docs.mjs` |
| Release changelog sections | `release-please-config.json` |
| PR title rules | `.github/workflows/pr-title.yml` |
