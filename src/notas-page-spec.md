# Spec — Ruta `/notas` (c12z.io)

> Construir la página índice de **notas** como una **línea de tiempo vertical** (timeline), inspirada estructuralmente en la maquetación de `https://clawd.rip/`, pero **temada con el sistema de diseño de c12z** (tokens, fuentes y paletas ya existentes). No copiar los colores crema de clawd.rip: solo su *estructura* y su *ritmo editorial*.

---

## 0. Antes de escribir código

Inspecciona el repo y **reutiliza las convenciones que ya existen**. No inventes patrones nuevos si ya hay uno:

- **Layout / Header / Footer**: usa el mismo componente de layout base que usan las demás rutas (p. ej. `essay`, `library`, `project`, `behavior`). Mismo `<head>`, mismo header, mismo footer, mismo control de tema (dark/light) y mismas view-transitions.
- **Content collection**: mira `src/content/config.ts` (o `src/content.config.ts`). Si ya existe una colección para notas, úsala. Si no, créala siguiendo el mismo estilo de schema (Zod) que las otras colecciones.
- **Ruteo**: replica la estructura de las otras secciones índice. Si `/essay` (o equivalente) es `src/pages/essay/index.astro` + `[slug].astro`, `/notas` debe ser `src/pages/notas/index.astro` + `src/pages/notas/[slug].astro` con la misma nomenclatura.
- **OG images**: engancha con `og-images-spec.md` ya existente. Cada nota debe generar su OG en build usando `@vercel/og`/Satori con las plantillas A/B/C ya definidas. La categoría de notas usa el color `--c-note`.

> Regla general: **coherencia > originalidad**. Esta ruta debe sentirse hermana de las que ya hay.

---

## 1. Objetivo

Página `/notas`: índice cronológico de notas cortas, presentado como **timeline vertical**. Cada nota es un nodo de la línea temporal con fecha, categoría, título, extracto y enlace a la nota completa.

- Ordenación por defecto: **más reciente primero**. Incluir toggle "Más antiguas primero" (equivalente al *Oldest first* de la referencia). Ver §7.
- Debe funcionar en **ambos temas** (`burntpaper` dark por defecto y `recycledpaper` light) usando solo variables CSS.

---

## 2. Fuente de datos

Content collection de Astro (`notas`). Schema sugerido (ajústalo al estilo de los schemas que ya haya en el repo):

```ts
// src/content/config.ts
const notas = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),          // resumen 1–3 frases para la tarjeta
    tags: z.array(z.string()).default([]),
    sources: z.array(z.object({    // opcional: badges de fuente (como en clawd)
      label: z.string(),
      url: z.string().url(),
    })).default([]),
    illustration: z.string().optional(), // ruta/nombre de asset opcional
    draft: z.boolean().default(false),
  }),
});
```

- Filtrar `draft: true` en producción (respeta cómo se hace ya en las otras secciones).
- La categoría de esta sección es fija: **note** → color `var(--c-note)`.

> **Confirmar (Chema):** ¿las notas van a llevar ilustración por entrada como en clawd, o el timeline va sin imagen? El spec deja la ilustración como **opcional** (ver §6.4). Si no hay ilustración, la entrada ocupa el ancho y se ve limpia igual.

---

## 3. Anatomía de la ruta

```
src/
├─ pages/
│  └─ notas/
│     ├─ index.astro        # timeline (esta spec)
│     └─ [slug].astro       # nota individual (reusar layout de contenido existente)
├─ components/
│  └─ notas/
│     ├─ Timeline.astro     # contenedor + spine
│     ├─ TimelineItem.astro # una entrada
│     ├─ SortToggle.astro   # orden asc/desc
│     └─ SourceBadges.astro # fila de badges de fuente (si aplica)
└─ content/
   └─ notas/*.md(x)
```

---

## 4. Estructura visual (referencia clawd.rip)

De arriba a abajo:

1. **Intro / cabecera de sección** — reutiliza el patrón de intro de las otras secciones índice (título de sección + descripción breve). No hace falta el mascot pixel de clawd; usa lo que ya tengan las demás rutas para no romper coherencia.
2. **Barra de control** — enlace/toggle de orden ("Más recientes" ⇄ "Más antiguas"), alineado igual que el "Oldest first" de la referencia.
3. **Timeline** — línea vertical de puntos con nodos marcados con "×", y entradas colgando de ella.

---

## 5. El spine (línea temporal)

- Línea vertical **discontinua (dashed)**, color `var(--border-2)`.
- Cada entrada tiene un **nodo "×"** sobre la línea:
  - glifo `×` en `var(--ff-mono)` (Cascadia), color `var(--fg-3)`.
  - al hacer hover/entrar en viewport, el nodo puede tintarse a `var(--c-note)` (sutil, opcional).
- Implementación: pseudo-elemento con `border-left: 0.0625rem dashed var(--border-2)` sobre un contenedor posicionado, o un gradiente `repeating-linear-gradient` si prefieres control fino del guion. Nodos posicionados absolutos a la altura de cada item.

### Posición del spine
- **Desktop (≥ `--screen-md`):** spine **centrado**. Las entradas alternan lado (izq/der) — ver §6.1.
- **Mobile (< `--screen-md`):** spine **a la izquierda**. Todas las entradas en **columna única** a la derecha del spine — ver §6.2.

---

## 6. Anatomía de una entrada (`TimelineItem`)

Contenido de cada item, en este orden semántico:

1. **Meta**: fecha + pill de categoría.
   - Fecha: `var(--ff-mono)`, `var(--t-mili)`, `var(--fg-3)`. Formato tipo `7 jul 2026` o rango `1–7 jul 2026` (localiza a `es`).
   - Pill categoría "Nota": texto `var(--t-micro)` uppercase, `tracking: var(--tracking-eyebrow)`, borde `var(--hairline)`, color de texto `var(--c-note)`, radio `var(--r-pill)`, padding `var(--sp-1) var(--sp-2)`.
2. **Título**: `var(--ff-pixel)` (Tamago), `var(--t-h1)` / `--lh-h1`, color `var(--fg)`. Es un enlace a la nota (`/notas/[slug]`).
3. **Extracto**: `var(--ff-rubik)`, `var(--t-body)` / `--lh-body`, color `var(--fg-2)`.
4. **Enlace "Leer nota"**: equivalente al *Full story*. `var(--ff-rubik)`, `var(--t-mili)`, color `var(--c-note)`, subrayado en hover. Debe apuntar al `[slug]`.
5. **Badges de fuente** (opcional, si la nota tiene `sources`): fila de chips con favicon + label. Chip: `var(--surface-2)`, borde `var(--hairline)`, radio `var(--r-sm)`, texto `var(--t-micro)` `var(--fg-2)`. (Componente `SourceBadges`.)

### 6.1 Layout desktop (≥ `--screen-md`)
- Grid de 2 columnas con el spine en medio: `grid-template-columns: 1fr [spine] 1fr`.
- Entradas **alternan**: item impar → texto a la izquierda (alineado a la derecha, pegado al spine); item par → texto a la derecha.
- Si usas ilustración (§6.4), va en la columna **opuesta** al texto, como en clawd.
- Ancho máximo del bloque de timeline: respeta el contenedor `main` existente (`--screen-md`). No lo hagas más ancho que el resto del sitio.

### 6.2 Layout mobile (< `--screen-md`)
- **Columna única.** Spine pegado a la izquierda; todas las entradas alineadas a la izquierda a su derecha (padding-left para dejar sitio al spine + nodo).
- Orden vertical dentro del item: (ilustración si existe) → meta → título → extracto → enlace → badges. Igual que la captura mobile de la referencia.

### 6.3 Espaciado entre entradas
- Separación vertical entre items: `var(--sp-10)` (64px) en desktop, `var(--sp-8)` (48px) en mobile. Ajusta si visualmente pide más aire.

### 6.4 Ilustración (opcional)
- Si `illustration` está presente: imagen/asset alineado según §6.1 (desktop) o encima del texto (mobile).
- Convención de assets: **igual que las demás rutas / que `og-images-spec.md`** (misma carpeta, mismo naming). No inventar carpeta nueva.
- Si no hay ilustración, el item se renderiza sin hueco reservado (no dejar un gap vacío).

---

## 7. Toggle de orden

- Dos estados: `desc` (más recientes primero, **default**) y `asc` (más antiguas primero).
- Preferible resolverlo **sin JS** si encaja con el patrón del sitio (p. ej. dos vistas / `?order=asc`) o con un pequeño toggle progresivo. Sigue el enfoque que ya use el sitio para interacciones similares; si no hay ninguno, un toggle mínimo en island de Astro/React es aceptable.
- El label activo se marca con `var(--fg)`; el inactivo con `var(--fg-3)`.

---

## 8. Tokens a usar (no hardcodear hex)

| Elemento | Token |
|---|---|
| Fondo página | `var(--bg)` |
| Texto títulos | `var(--fg)` + `var(--ff-pixel)` |
| Texto cuerpo/extracto | `var(--fg-2)` + `var(--ff-rubik)` |
| Meta / fecha / labels | `var(--fg-3)` + `var(--ff-mono)` |
| Acento de sección (pill, enlace, nodo) | `var(--c-note)` |
| Línea del spine | `var(--border-2)` (dashed) |
| Bordes de pills/chips | `var(--hairline)` |
| Superficie de chips | `var(--surface-2)` |
| Radios | `--r-sm`, `--r-pill` |
| Espaciado | escala `--sp-*` |
| Breakpoint desktop/mobile | `--screen-md` (768px) |

> **Prohibido** meter colores literales. Todo por variable, para que dark (`burntpaper`) y light (`recycledpaper`) funcionen solos.

---

## 9. Movimiento y accesibilidad

- Entrada de items: reutiliza la animación `.au` / `@keyframes fadeUp` ya existente (fade + translateY). Aplica un pequeño stagger por item si es sencillo.
- Respeta `prefers-reduced-motion`: sin animaciones de entrada ni transiciones agresivas (el sitio ya gestiona esto; no lo rompas).
- Semántica: la timeline como `<ol>`; cada entrada como `<li>`. Título como enlace real (`<a href="/notas/[slug]">`). Fechas en `<time datetime="...">`.
- Contraste: verificar pill `--c-note` sobre `--bg` en ambos temas (en light, `--c-note` es `#4649e0`; en dark `#7f80e1`).
- Foco visible en enlaces y toggle.

---

## 10. SEO / OG

- `<title>` y `<meta description>` de la sección, siguiendo el patrón de las otras rutas índice.
- Cada `[slug]` genera su **OG image en build** con `@vercel/og` según `og-images-spec.md`, categoría **note** (`--c-note`), plantillas A/B/C ya definidas.
- Canonical y demás metas: heredados del layout base.

---

## 11. Criterios de aceptación

- [ ] `/notas` renderiza todas las notas no-draft desde la content collection, ordenadas desc por defecto.
- [ ] Timeline vertical con spine dashed y nodos "×"; centrado con entradas alternadas en desktop, columna única con spine a la izquierda en mobile.
- [ ] Cada entrada muestra: fecha, pill de categoría, título (Tamago, enlazado), extracto (Rubik), enlace "Leer nota" y badges de fuente si existen.
- [ ] Toggle de orden asc/desc funcional.
- [ ] Todo con tokens CSS: se ve correcto en `burntpaper` (dark) y `recycledpaper` (light) sin ajustes manuales.
- [ ] Ilustración opcional: presente se coloca según layout; ausente no deja hueco.
- [ ] Header, footer, layout, view-transitions y control de tema idénticos al resto del sitio.
- [ ] OG image por nota generada en build (plantilla + color de categoría note).
- [ ] Responsive fluido en el breakpoint `--screen-md`; sin overflow horizontal en mobile.
- [ ] Semántica `<ol>/<li>/<time>`, foco visible, `prefers-reduced-motion` respetado.

---

## 12. A confirmar con Chema

1. ¿Las notas llevan **ilustración por entrada** (como clawd) o timeline sin imágenes? (Spec asume opcional.)
2. ¿Los **badges de fuente** aplican a notas, o eso era solo de la referencia? (Spec los deja opcionales vía `sources`.)
3. Nombre exacto de la **content collection** y ruta si ya existe una para notas.
4. ¿El toggle de orden lo quieres **sin JS** (dos vistas / query param) o island interactivo?
