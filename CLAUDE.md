# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Astro dev server
pnpm build        # Type-check (astro check) then build
pnpm preview      # Preview production build locally
```

No test or lint commands are configured.

## Architecture

Personal blog/portfolio site built with **Astro 6** + **React 19** + **TailwindCSS v4** + **MDX**, deployed to Vercel (static output).

### Key structural patterns

**Feature-based organization** — `src/features/<name>/` encapsulates all domain logic:

- `components/` — Astro/React components specific to that feature
- `seo/` — keywords and metadata for that feature
- `data/` or `rules/` — business logic or static data
- `styles/` — CSS Modules scoped to the feature

**Content Collections** — `src/content/` holds markdown/MDX files validated by Zod schemas in `content.config.ts`. Collections: `essay`, `library` (book reviews), `bias` (cognitive biases), `projects`.

**Shared globals** — `src/global/` holds site-wide config: `siteInfo.ts`, `headerLinks.ts`, `pagesInfo.ts`, `socialMediaLinks.ts`.

**Common UI** — `src/components/common/` has layout, navigation, SEO, analytics, and reusable UI components (buttons, icons, toc).

### Path aliases (tsconfig.json)

```
@/*          → src/*
@/features/* → src/features/*
@/global/*   → src/global/*
@/ui/*       → src/components/ui/*
@/common/*   → src/components/common/*
@/icons/*    → src/components/common/ui/icons/*
@/seo/*      → src/components/common/seo/*
@layouts/*   → src/layouts/*
@utils/*     → src/utils/*
@interfaces/* → src/interfaces/*
@/assets/*   → src/assets/*
```

### Content collection schemas

- **library** — book reviews; fields: cover images, scores, authors, Amazon links, language
- **bias** — cognitive biases; categories: `velocidad`, `memoria`, `percepción`, `contexto`, `juicio`
- **essay** — minimal schema (title, description)
- **projects** — schema currently commented out, raw MDX

### Environment variables

See `.env.template`:

- `GA4_MEASUREMENT_ID`
- `GTM_MEASUREMENT_ID`
- `AHRFS_MEASUREMENT_ID`
- `OVERTRACKING_MEASUREMENT_ID`

### Deployment

- Vercel adapter (`@astrojs/vercel`), static output mode
- `vercel.json` disables trailing slashes
- TailwindCSS v4 is wired via the **Vite plugin** (not the Astro integration)

## Design System

All design tokens live in `src/styles/global.css` as CSS variables under `@theme`. No `tailwind.config.js` — Tailwind reads from those CSS variables directly.

### Aesthetic direction

Dark-first, retro-digital, content-focused personal site. Hot pink accent on dark backgrounds is the signature. Generous spacing, minimal chrome, no decorative fluff.

### Typography

| Role | Font | Notes |
|------|------|-------|
| Display / headers | **Tamago** (pixel art) | `font-pixel`, `tracking-widest` |
| Body | **Rubik** | weights 300–700 + italic |
| Code | **Cascadia** | monospace |

### Color palette

**Dark mode (default):**
- Background `#111`, Surface `#1a1a1a`, Surface-alt `#2e2e2e`
- Text: headers `#fcf8f1`, body `#dfdbd5`, muted `#9d9b98`
- Accent pink `#ff2f92`, accent purple `#904fe7`

**Light mode:**
- Background `#f5f2ee` (beige), Surface `#eae6e1`
- Text: headers `#0c0c0b`, body `#1f1e1d`, muted `#595856`

**Content-type accent colors (dark / light):**
- Behavior: `#e22ef6` / `#80008e`
- Essays: `#33ffe8` / `#016c60`
- Library: `#ffa424` / `#a15e00`
- Projects: `#ff3838` / `#2e5100`

**Bias category colors:** Speed `#e03d3d`, Memory `#af76ff`, Judgment `#4c9dff`, Context `#9ed841`, Perception `#f2ce57`

### UI conventions when building new components

- Use existing CSS variables — never hardcode colors
- New feature-scoped styles go in `src/features/<name>/styles/*.module.css`
- Tailwind utilities for layout/spacing; CSS Modules for component-specific styles
- React components (`.tsx`) only when interactivity is needed; prefer `.astro` otherwise
- Motion library (`motion/react`) is available for animations in React components
- Left/bottom borders (`rounded-bl`) as a recurring visual motif for list items
- WIP sections get a red-border box with a 🚧 badge (`border-error`)
