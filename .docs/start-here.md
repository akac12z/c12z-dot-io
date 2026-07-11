# c12z.io — arquitectura y mapa del proyecto

> Punto de entrada a la documentación. Describe cómo está organizado el
> repo y qué hace cada pieza, para que un dev o una IA puedan orientarse
> sin tener que leer todo el código primero. Para el sistema de imágenes
> OG dinámicas, ver [`og-images.md`](./og-images.md) (documentación
> específica, más detallada).

## 1. Qué es

Blog/portfolio personal de Chema Ferrandez. **Astro 7** + **React 19**
(solo para islas interactivas) + **TailwindCSS v4** + **MDX**, `output:
"static"`, desplegado en **Vercel**.

```bash
pnpm dev      # servidor de desarrollo
pnpm build    # astro check (type-check) + astro build
pnpm preview  # sirve el build de producción en local
```

No hay lint ni tests configurados. `pnpm build` es el único gate de
calidad (falla si hay errores de tipos o de los schemas Zod de las
collections).

**Antes de arrancar `pnpm dev` por primera vez**: copiar `.env.template`
a `.env` y rellenar las 4 vars (`GA4_MEASUREMENT_ID`, `GTM_MEASUREMENT_ID`,
`AHRFS_MEASUREMENT_ID`, `OVERTRACKING_MEASUREMENT_ID`). Están declaradas
como `optional: false` en el `env.schema` de `astro.config.mjs` — sin
ellas el servidor ni siquiera arranca. Valores dummy sirven en local.

## 2. Principio de organización: feature-based

Cada dominio de contenido vive en `src/features/<name>/`, con esta forma
interna (no todas las features tienen las 4 carpetas):

```
features/<name>/
├── components/   componentes Astro/React de esa feature
├── seo/          keywords + componente de SEO específico del contenido
├── data/ | rules/  lógica de negocio, datos estáticos, interfaces
└── styles/         CSS Modules si hace falta estilo propio
```

Todo lo que es **transversal** (no pertenece a un solo dominio) vive
fuera de `features/`: layouts, componentes comunes de UI/SEO/analytics,
config global del sitio, utils, interfaces compartidas.

## 3. Árbol de `src/`

```
src/
├── assets/            fuentes (Tamago, Cascadia, Rubik), imágenes (404, OpenGraph, mii)
├── components/common/ ver §6
├── content/            entradas de contenido (md/mdx), una carpeta por collection
├── content.config.ts   schemas Zod de las collections — ver §5
├── features/            ver §9 (estado de cada feature)
├── global/               config del sitio — ver §7
├── interfaces/            tipos TS compartidos entre features
├── layouts/                MainLayout.astro, Layout404Error.astro
├── lib/og/                  motor de generación de imágenes OG — ver og-images.md
├── pages/                    rutas — ver §8
├── styles/                    global.css (design tokens), typo.css, lettering.css
└── utils/                      formatter, process-keywords, validating-date
```

## 4. Path aliases (`tsconfig.json`)

```
@/*           → src/*
@/features/*  → src/features/*
@/lib/*       → src/lib/*
@/global/*    → src/global/*
@/common/*    → src/components/common/*
@/icons/*     → src/components/common/ui/icons/*
@/seo/*       → src/components/common/seo/*
@/analytics/* → src/components/common/analytics/*
@layouts/*    → src/layouts/*
@utils/*      → src/utils/*
@interfaces/* → src/interfaces/*
@/assets/*    → src/assets/*
```

`@/ui/*` está declarado pero apunta a `components/ui`, que no existe —
no usarlo.

## 5. Content collections (`content.config.ts`)

Loader `glob` sobre `**/*.{md,mdx}`. Se exportan **3** collections:
`library`, `projects`, `bias`. `essay` está **definida pero comentada**
(no exportada) — ver estado en §9.

| Collection | Carpeta física | Campos clave | Entradas reales hoy |
|---|---|---|---|
| `library` | `content/library/{slug}/` | `title`, `cover`, `abstract`, `backlog: "wip"\|"upload"`, `category` (health/product/culture/psychology/economics/creativity/philosophy/other), `score` (1-5), `authors`, `publishDate`/`lastTimeEdited` (`DD/MM/YYYY`), `keywords` | 4 (show-your-work, steal-like-an-artist, the-cold-start-problem, the-mom-test) |
| `projects` | `content/project/{slug}/` (⚠️ singular en disco, plural el nombre de la collection) | `projectTitle`, `projectDescription`, `projectUrl`, `cover`, `why` (≤20 chars, usado como meta en Home), `styleClass?` | 1 (la-vida-moderna-es) |
| `bias` | `content/bias/{slug}/` | `biasName`, `biasQuestion`, `category[]` (velocidad/memoria/percepción/contexto/juicio), `relatedLinks?` | **0** — feature completa, sin contenido todavía |

`backlog: "wip"` vs `"upload"` controla en todas las cards si la entrada
es clicable o se muestra como "todavía no disponible" — es el
mecanismo general de "publicar en borrador" del sitio.

Todas las collections con `publishDate`/`lastTimeEdited` validan el
formato `DD/MM/YYYY` con `isValidDateFormat` (`src/utils/validating-date.ts`).

⚠️ En `library`, el `.transform` opcional de `lastTimeEdited` recibe `ctx`
como si fuera el valor de `publishDate` — huele a bug de copy-paste del
`.refine` de `bias` (que sí usa `ctx` correctamente). No toca nada hoy
porque el campo es opcional y las 4 entradas actuales no fuerzan ese
camino, pero revisar antes de depender de ese transform.

**Pipeline de markdown/MDX** (`astro.config.mjs`): `remark-math` +
`rehype-katex` — se puede escribir LaTeX en cualquier `.mdx` y renderiza
como fórmula (CSS de KaTeX cargado por CDN en `BaseHead`). Todos los
links externos del contenido se reescriben automáticamente a
`target="_blank" rel="noopener noreferrer"` vía `rehype-external-links`
— el componente `ui/content/Link.astro` es solo para el estilo visual,
no hace falta para el comportamiento de seguridad.

## 6. `src/components/common/` (transversal, no ligado a una feature)

```
common/
├── analytics/   Google (GA4, GTM head/body), Ahrefs, Overtracking
│                → todos cargan is:inline vía Partytown, no bloquean el hilo principal
├── layout/      Header (solo Logo + ToggleTheme), Footer
│                headerMenus/ (NavbarDesktopMenu, NavbarMobileMenu, NavLinks)
│                ⚠️ headerMenus/* es código muerto: Header.astro no las importa
├── navigation/  BottomBar.tsx (React, client:only) — scroll-to-top + "subir un nivel"
├── seo/         BaseHead (head compartido, theme script, favicons, analytics),
│                PagesSEO (listados), ContentSEO (contenido individual),
│                Favicons, 404/Error404SEO
└── ui/
    ├── buttons/   GoBackInTop, SummarizeLLMs (abre ChatGPT/Claude/Grok/Perplexity
    │              con un prompt prellenado para resumir la página)
    ├── content/   ImgAndCap, Link (externo), OwnThoughts (callout para MDX),
    │              QuoteCard, SummarizeSection (agrupa 4 SummarizeLLMs)
    ├── darkmode/  ToggleTheme (alterna data-theme + localStorage + startViewTransition)
    ├── icons/     Logo, iconos de contenido (Bulb, UnclearThought),
    │              ai/ (logos de los LLMs), social/ (SocialBlock, SocialLink)
    │              ⚠️ Moon/Sun/YingYang/GoOut.astro: sin uso, código muerto
    └── toc/       toc.tsx (React, tabla de contenidos flotante con motion/react
                   + IntersectionObserver), progressCircle.tsx (círculo de progreso)
                   ⚠️ old.TableOfContent.tsx: versión legacy sin uso, las 3 páginas
                   dinámicas ya usan toc.tsx
```

**Regla implícita**: si un componente necesita interactividad en cliente
(scroll, estado, animación), es `.tsx` React con `client:only="react"` o
similar; todo lo demás es `.astro`.

## 7. `src/global/` — configuración del sitio

- **`site-info.ts`** — `SITE_VERSION`, `SITE_DEFAULT_CONFIG` (title,
  description, url, author, lang `es-ES`), `SITE_404_CONFIG`.
- **`header-links.ts`** — `HEADER_LINKS[]` (ensayos/biblioteca/behavior).
  ⚠️ usa clases Tailwind (`cz-neon-*`) que no coinciden con las CSS vars
  de contenido (`--c-essay`, `--c-library`, `--c-behavior`) de
  `global.css` — revisar si se retoma la navegación de header.
- **`pages-info.ts`** — `PAGE_INFO_SCHEMA` (Zod, valida title 50-60
  chars y description 110-160 en build time) + `PAGES`, metadata SEO por
  sección con sus OG images fijas.
- **`socialmedia-links.ts`** — `SOCIAL_LINKS` (github, x, linkedin,
  substack, goodreads).

## 8. Rutas (`src/pages/`)

| Ruta | Qué es |
|---|---|
| `/` | Home — hero + `ShowSortContent` (últimos 4 items de cada collection publicada) |
| `/biblioteca`, `/biblioteca/[...id]` | listado y ficha de libro |
| `/proyectos`, `/proyectos/[...id]` | listado y ficha de proyecto |
| `/behavior`, `/behavior/sesgos`, `/behavior/sesgos/[...id]` | listado y ficha de sesgo cognitivo |
| `/contexto` | "sobre mí", renderiza `features/context/context.mdx` directamente |
| `/ensayos` | placeholder estático — feature `essay` inactiva (§9) |
| `/404` | usa `Layout404Error` (sin Header/Footer/BottomBar) |
| `/llms.txt` | endpoint de texto plano — describe el sitio para LLMs/crawlers de IA |
| `/robots.txt` | genera `Sitemap:` apuntando a `sitemap-index.xml` |
| `/og/{biblioteca,proyectos,behavior/sesgos}/[...id].png` | imágenes OG generadas en build time — ver `og-images.md` |
| `/_og-playground` | herramienta de dev para ajustar el layout de las OG images; el prefijo `_` la excluye del build de producción |

Las páginas dinámicas (`[...id].astro`) siguen todas el mismo patrón:
`getStaticPaths()` sobre la collection → layout + TOC (`toc.tsx`) +
componente `*SEO.content.astro` de la feature.

## 9. Estado real de cada feature (importante antes de tocar código)

| Feature | Estado |
|---|---|
| `home` | completa y activa |
| `books` (biblioteca) | completa y activa, 4 entradas |
| `projects` | completa y activa, 1 entrada |
| `bias` (behavior/sesgos) | **código completo, sin contenido**. Si vas a añadir un sesgo, la feature ya soporta todo (card, SEO, OG dinámico); solo falta crear el `.mdx` en `content/bias/` |
| `essay` | **fantasma**: schema comentada en `content.config.ts`, sin carpeta de contenido, sus 3 componentes (`EssayPage/Card/Header.astro`) están vacíos, `/ensayos` es un placeholder estático. Antes de "arreglar un bug" en essay, confirmar si el plan es implementarla desde cero |
| `context` | activa, pero vía MDX directo (`context.mdx`), no vía content collection — `Context.astro` está vacío y sin uso |
| `404` | activa |

Archivos vacíos/sin consumidores detectados (no asumir que hacen algo
si aparecen en un `grep`): `PsychologyHeader.astro`, `BiasTLDR.astro`,
`BookAuthor.astro`, `Context.astro`, los 3 de `essay/`, y
`features/projects/data/projectsData.ts` (reemplazado por la content
collection `projects`, con typo `PROJETCS_DATA` si alguna vez se vuelve
a tocar).

## 10. Design system

Tokens en `src/styles/global.css` bajo `@theme` (Tailwind v4 los lee
directo de ahí — **no hay `tailwind.config.js`**). Tema oscuro por
defecto, alternado con `[data-theme="light"]` vía atributo en `<html>` +
`localStorage`, con `document.startViewTransition` tanto para el toggle
como para la navegación entre páginas.

- **Tipografía**: Tamago (pixel, `font-pixel`, headers) / Rubik (cuerpo)
  / Cascadia (mono, código).
- **Acento de marca**: rosa `#ff2f92` (dark) sobre fondos oscuros.
- **Color por tipo de contenido**: cada collection tiene su propio par
  dark/light (`--c-behavior`, `--c-essay`, `--c-library`, `--c-project`).
- **Color por categoría**: sesgos cognitivos y libros tienen su propia
  escala de color por categoría (ver CLAUDE.md para los valores hex).
- Motivo visual recurrente: borde izquierdo/inferior (`rounded-bl`) en
  items de lista. Secciones WIP: caja con borde rojo + badge 🚧
  (`border-error`).

No hardcodear colores nuevos — siempre usar las CSS vars existentes.

## 11. `src/utils/` e `src/interfaces/`

- `formatter.ts` — `Formatter.formatDate()` / `.formatDateToISO()` (Intl `es-ES`).
- `process-keywords.ts` — normaliza y deduplica keywords para SEO.
- `validating-date.ts` — valida/convierte fechas `DD/MM/YYYY` usadas en el frontmatter.
- `interfaces/` — tipos compartidos entre features (`PageKeywords`,
  `SocialLinksInterface`, `SiteDefaultConfigInterface`, etc.); si un tipo
  se usa desde 2+ features, va aquí en vez de duplicarse.

## 12. Librerías clave a reutilizar (antes de añadir una nueva)

- **`motion`** (Framer Motion v12) — animaciones en componentes React
  (`toc.tsx`, `progressCircle.tsx`).
- **`es-toolkit`** — utilidades tipo lodash (throttle en `toc.tsx`).
- **`@vercel/og` + `sharp`** — todo el pipeline de imágenes OG (§`og-images.md`).
- **`@lucide/astro`** — set de iconos (además de los SVG a medida en `ui/icons/`).
- **`@astrojs/partytown`** — todo analytics carga con `type="text/partytown"`,
  cualquier script de tracking nuevo debería seguir el mismo patrón.

No hay librería de fetching/estado (no hay React Query, Zustand, etc.) —
el sitio es 100% estático, no hace falta.

## 13. Dónde mirar según la tarea

- **Añadir contenido** (libro/proyecto/sesgo) → crear `.mdx` en la
  carpeta de la collection correspondiente bajo `src/content/`; el resto
  (card, SEO, OG image) ya funciona solo si el schema Zod se cumple.
- **Tocar SEO/meta tags** → `components/common/seo/` (compartido) o
  `features/<name>/seo/` (específico de esa feature).
- **Tocar imágenes OG** → `src/lib/og/` + `src/pages/og/` — ver
  `og-images.md` antes de cambiar nada, tiene el porqué de cada decisión.
- **Tocar navegación de header** → el código existe
  (`headerMenus/`) pero está desconectado; confirmar con el usuario si
  el objetivo es reactivarlo o si `Header.astro` (solo Logo+Toggle) es
  intencional antes de asumir que es un bug.
- **Tocar theming/colores** → `src/styles/global.css`, sección `@theme` y
  `[data-theme="light"]`.
