# CLAUDE.md

Project guidance for Claude Code (and any other coding agent) working on IcoMo.

**The canonical onboarding doc is [`AGENTS.md`](./AGENTS.md)** — read it first. It covers architecture, commands, the build pipeline, categories, alias conventions, commit/PR rules, and the release flow.

This file exists so Claude Code auto-loads project context, but it intentionally stays thin — everything below either summarizes `AGENTS.md` or adds a Claude-specific note. If these two files ever conflict, `AGENTS.md` wins; update it and leave this file as a pointer.

---

## TL;DR for a new session

- Package: `@ds-mo/icons` — 422 SVG icons (390 system + 32 country flags) as React components, SVG strings, sprite, and typed meta manifest. Figma-first pipeline.
- Canonical rules: **[`AGENTS.md`](./AGENTS.md)**.
- Commit style: Conventional Commits, lowercase subject. PR titles are linted.
- Releases: automated via `release-please` on `main`; auto-publishes to npm via OIDC.
- Never edit `dist/` or `docs/index.html` — regenerate. Never push directly to `main` — branch + PR.

## Working with the user here

- Prefer a short plan + fast execution over long analysis. The user iterates quickly and often drops Figma re-exports for batch processing.
- When the user says "do the needful" with a folder of SVGs, follow the Figma re-export recipe in `AGENTS.md` (diff → copy new/modified → update aliases + counts + CHANGELOG → build → verify browser).
- When the user asks to "bump" or "ship" a version, use the release-please flow (see `AGENTS.md` → Release flow). Push a `Release-As:` empty commit only when CI-only commits have accumulated with no `feat:` / `fix:` to bump from.
- Ask before deleting icons. A missing file in a Figma export is not an implicit delete signal.

## Context this agent should load

Key files worth reading at session start if you're about to do non-trivial work:
- `AGENTS.md` — conventions
- `scripts/utils/categories.mjs` — category config
- `ICON_ALIASES_REVIEW.md` — alias conventions + current list
- `release-please-config.json` — what counts as a releasable change
