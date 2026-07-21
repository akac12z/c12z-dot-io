# Feature `sources` — el cajón de fuentes

> Cómo funciona la sección **/behavior/fuentes**: de dónde salen los
> datos, qué hace cada archivo, por qué el CSS está escrito así y qué
> tocar para cambiar cada cosa sin romper el resto.
>
> Contexto general del repo: [`start-here.md`](../start-here.md).
>
> Los archivos de la feature llevan su propia cabecera explicando **qué
> es y por qué existe** cada uno. Este documento cuenta lo que no cabe en
> un archivo: cómo encajan entre ellos y qué decisiones hay detrás.

---

## 1. Qué es y qué NO es

El cajón muestra **las fuentes que consultas para escribir cada sesgo y
cada modelo mental**: libros, vídeos, artículos, citas...

La decisión de diseño más importante, y la que explica todo lo demás:

> **`sources` no tiene contenido propio.** No hay collection
> `sources`, ni carpeta `src/content/sources/`. Las fuentes viven en
> el **frontmatter del propio post** (el sesgo o el modelo mental), en un
> array `sources`. La feature solo las **lee y las pinta**.

Por qué: si las fuentes vivieran en su propia collection tendrías dos
sitios que mantener sincronizados (el post y sus fuentes) y contenido
duplicado. Así, escribir una fuente es añadir 4 líneas al `.mdx` que ya
estás escribiendo.

Consecuencia práctica: **para añadir una fuente no se toca nada de esta
feature**, solo el `.mdx` del sesgo/modelo (§3).

---

## 2. Las tres vistas

| Ruta                             | Qué muestra                                                                                                 | Componente raíz     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------- |
| `/behavior/fuentes`              | **Una carpeta por tema** (un sesgo o un modelo). Rejilla densa + panel de filtros. Pensada para ~140 temas. | `SourcesPage.astro` |
| `/behavior/fuentes/<slug>`       | Las fuentes **de un tema**, cada una un **folio** con la esquina doblada, apenas solapados.                  | `TopicPage.astro`   |
| `/behavior/modelos-mentales/<id>` | Bloque **"Detrás de este post"** al final del post, con sus fuentes amontonadas como carpetas.              | `PostSources.astro` |

Las tres comparten el mismo **visor** (`SourceSheets.astro`: la carpeta o
el folio ampliado, con slider).

Grano de cada vista — importante no confundirlo:

- En el **cajón**, 1 carpeta = **1 tema** (con N fuentes dentro).
- En la **página de tema** y en **"Detrás de este post"**, 1 pieza = **1 fuente**.

⚠️ **Estado real de "Detrás de este post"**: está activo en
`src/pages/behavior/modelos-mentales/[...id].astro` y **comentado** en
`src/pages/behavior/sesgos/[...id].astro` (líneas 20 y 79). Si lo quieres
también en los sesgos, basta con descomentar las dos: el componente ya
devuelve `null` cuando el post no tiene fuentes.

### Carpeta vs. folio

La misma pieza (`.folder`) tiene dos siluetas, y la elección es
semántica, no decorativa:

- **Carpeta** (pestaña arriba a la izquierda) → cuando la pieza
  **contiene** cosas: un tema en el cajón, o el montón de fuentes de un
  post.
- **Folio** (esquina superior derecha doblada, con renglones) → cuando ya
  estás **dentro** de una carpeta: la página de un tema. Dentro de una
  carpeta hay ficheros, no más carpetas.

Se activa con la prop `file` de `SourceStack` / `SourceSheets`, que añade
las clases `.file` / `.sheetFile`. Son **modificadores**: solo pisan la
silueta (`--folder-clip`) y recolocan el rótulo del tipo; caja, montón,
hover y visor son los mismos.

---

## 3. De dónde salen los datos

### 3.1 El schema (`src/content.config.ts`)

Hay un `sourceSchema` compartido, y se añade como campo `sources` a las
collections `bias` y `mentalModels`:

```ts
const sourceSchema = z.object({
  title:   z.string().max(300),   // en una `cita`, el título ES el fragmento citado
  type:    z.enum(["libro","articulo","paper","video","podcast","charla","web","cita"]),
  author:  z.string().optional(),
  url:     z.string().optional(),
  date:    z.string().refine(isValidDateFormat).optional(),  // DD/MM/YYYY
  excerpt: z.string().max(300).optional(),
});

// dentro de biasCollection y de mentalModelsCollection:
sources: z.array(sourceSchema).default([]),
```

`default([])` significa que un post **sin** `sources` es válido: no
aparece en el cajón y no le sale el bloque "Detrás de este post".

⚠️ `url` es `z.string()`, **no** `z.string().url()`: no se valida que sea
una URL bien formada. Un `url: "foo"` pasa el build y genera un enlace
roto. Si algún día molesta, ese es el sitio donde apretar.

### 3.2 Añadir una fuente = editar el `.mdx` del post

```yaml
# src/content/bias/anclaje.mdx
---
biasName: "Sesgo de anclaje"
backlog: "wip" # ← wip = "estudiando" en el cajón; upload = "publicado"
# ...resto del frontmatter del sesgo...
sources:
  - title: "Thinking, Fast and Slow"
    type: "libro"
    author: "Daniel Kahneman"
    url: "https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow"
    date: "02/06/2026"
    excerpt: "Capítulo 11 (Anchors): el experimento de la ruleta trucada."
  - title: "Any number that you are asked to consider… will induce an anchoring effect."
    type: "cita" # ← en una cita, el `title` es el fragmento citado
    author: "Daniel Kahneman"
---
```

⚠️ **`backlog` es el que manda el estado.** `wip` → el tema sale como
`estudiando` (punto de acento "●"); `upload` → `publicado` y aparece el
enlace al post. No hay un campo `status` aparte.

### 3.3 Añadir un tipo de fuente nuevo (p. ej. `newsletter`)

Hay que tocar **dos** sitios, en este orden:

1. `src/content.config.ts` → añadirlo al `z.enum` de `sourceSchema`.
2. `src/features/sources/data/source-types.ts` → añadir su etiqueta a
   `TYPE_LABELS` (lo que se lee en la pestaña de la carpeta).

Si se olvida el paso 2, TypeScript falla en `pnpm build` (el `Record` deja
de ser exhaustivo) — es una red de seguridad intencionada, no un bug.

Los botones de filtro **no** hay que tocarlos: `TopicPage` calcula los
tipos que existen de verdad en ese tema y solo pinta esos.

---

## 4. Árbol de la feature

```
src/features/sources/
├── components/
│   ├── SourcesPage.astro        /behavior/fuentes — cabecera + panel + rejilla de temas
│   ├── TerminalSearch.astro       el panel de filtros con pinta de terminal (<details>)
│   ├── TopicFolder.astro          1 carpeta = 1 TEMA (la del cajón)
│   ├── TopicPage.astro            /behavior/fuentes/<slug> — cabecera + toggles + montón
│   ├── SourceStack.astro          el MONTÓN: 1 pieza = 1 FUENTE (solape adaptativo)
│   ├── PostSources.astro          bloque "Detrás de este post" (envuelve a SourceStack)
│   ├── SourceSheets.astro         EL VISOR: <dialog> con una hoja por fuente
│   ├── FolderDialogScript.astro   carga el script del visor (1 vez por página)
│   └── sources.module.css       TODO el estilo de la feature
├── scripts/                     el único JS de la feature (~200 líneas en total)
│   ├── folder-dialog.ts           abrir/cerrar/navegar el visor
│   ├── sources-filters.ts         buscador + toggles de tipo de tema (cajón)
│   └── topic-filters.ts           toggles de tipo de fuente (página de tema)
├── data/
│   ├── get-topics.ts            construye los "temas" leyendo bias + mentalModels
│   ├── source-types.ts          tipo `Source` + `TYPE_LABELS`
│   └── parse-source-date.ts     "DD/MM/YYYY" → Date (para ordenar)
└── seo/
    ├── SourcesSEO.content.astro OG estática compartida por todas las vistas
    └── sources.keywords.ts
```

Ojo: **no hay carpeta `styles/`** — el CSS Module vive junto a los
componentes (`components/sources.module.css`), a diferencia de lo que
sugiere la convención general de `start-here.md`.

Rutas que la consumen:

```
src/pages/behavior/fuentes/
├── index.astro      → SourcesPage
└── [...id].astro    → TopicPage (getStaticPaths sobre getTopics())
```

Y, fuera de la feature, `parse-source-date.ts` lo reutiliza
`features/mental-models/components/MentalModelsPage.astro` para ordenar
sus cards: **no es código exclusivo de sources**, cuidado al tocarlo.

---

## 5. `get-topics.ts` — la única fuente de verdad

Un **Topic** es "un sesgo o un modelo mental que tiene fuentes". La
función `getTopics()` los construye y la usan **tanto la rejilla como
`getStaticPaths`** — por eso el slug y el orden siempre coinciden.

```ts
interface Topic {
	id: string; // "sesgo-anclaje" — id del <dialog> en el HTML
	slug: string; // "anclaje" — la URL /behavior/fuentes/anclaje
	kind: "sesgo" | "modelo";
	name: string; // biasName o modelName
	href?: string; // al post, solo si está publicado
	state: "estudiando" | "publicado"; // derivado de backlog (wip/upload)
	date: string;
	sources: Source[];
}
```

Tres cosas que hace y conviene conocer:

1. **Filtra** los que no tienen fuentes (`sources.length > 0`), para que
   el cajón no se llene de carpetas vacías.
2. **Ordena**: primero lo que está `estudiando` (el cajón es la mesa de
   trabajo), luego por fecha descendente.
3. **Desempata slugs**: si algún día un sesgo y un modelo tuvieran el
   mismo id, el slug se prefija con el tipo (`modelo-anclaje`). Sin esto
   `getStaticPaths` reventaría el build con dos rutas iguales.

**Si quieres cambiar el orden del cajón, se cambia aquí** (el `.sort()`
final), no en el componente.

---

## 6. Cómo funciona el visor (la carpeta ampliada)

Es un **`<dialog>` nativo**, sin React ni estado de cliente.

- `SourceSheets.astro` pinta **un `<dialog>` por carpeta** con **todas**
  sus fuentes dentro: una `<div data-slide="i">` por fuente, todas
  `hidden` menos la primera.
- `scripts/folder-dialog.ts` es el script del visor (~100 líneas).
  Escucha clicks en `document` (delegación) y:
  - `[data-folder-open="<id>"]` → `dialog.showModal()` + muestra la hoja
    `data-index` (la carpeta que pulsaste).
  - `[data-folder-next]` / `[data-folder-prev]` / flechas ← → → cambia de hoja.
  - Click en el backdrop o `Esc` → cierra (el `Esc` es gratis, lo da
    `<dialog>`).

Detalles que parecen magia y no lo son:

- **El contador `2 / 8`**, el **tipo de la pestaña** y la **fecha de la
  cabecera** se recalculan en la función `show()` leyendo los `data-*` de
  la hoja activa (`data-type-label`, `data-date`). No están fijos en el HTML.
- **La navegación desaparece** cuando solo queda una hoja visible.
- **El slider respeta el filtro de tipo**: al filtrar, `topic-filters.ts`
  marca las hojas descartadas con `data-off`, y el script solo navega por
  `[data-slide]:not([data-off])`. Por eso el contador pasa a `1 / 2` en
  vez de `1 / 8`.
- El script se registra **una sola vez** (bandera
  `document.documentElement.dataset.foldersInit`) porque el listener está
  en `document`, que sobrevive a las view transitions del router de Astro.
  Si lo re-registráramos en `astro:page-load` se ejecutaría dos veces por
  click. Los scripts de filtros sí se re-registran en cada
  `astro:page-load`, porque sus listeners cuelgan de elementos que la
  transición reemplaza — de ahí la bandera `data-init` en su raíz.

⚠️ **Cabo suelto conocido**: el script maneja `[data-folder-close]`, pero
**ningún componente pinta ese botón** (y la clase `.sheetClose` del CSS
está sin usar). Hoy el visor se cierra con `Esc` o con el backdrop. Si
quieres un botón de cerrar visible, el JS y el CSS ya están, solo falta el
markup en `SourceSheets.astro`.

---

## 7. El CSS: los cuatro trucos que hay que entender

Todo está en `sources.module.css`. Si entiendes estos cuatro, puedes tocar
el resto sin miedo.

### 7.0 Aviso previo: aquí `1rem = 14px`

`global.css` fija `html { font-size: var(--t-body) }` = **0.875rem →
1rem = 14px**, no 16px. Así que `--folder-w: 10.5rem` son **147px** y
`--min-step: 5rem` son **70px**. Si calculas a ojo con 16px te saldrán mal
las cuentas.

### 7.1 La silueta de carpeta = `clip-path` (definida una sola vez)

La pestaña recortada arriba a la izquierda no es una imagen ni un
pseudo-elemento: es un polígono que recorta el botón. Y está declarada
**una vez** para las tres siluetas (`.topicFolder`, `.folder`,
`.sheetInner`), que solo gradúan las variables:

```css
.topicFolder,
.folder,
.sheetInner {
	--folder-clip: polygon(
		0 0,
		var(--tab-w) 0,
		calc(var(--tab-w) + var(--tab-slope)) var(--tab-h),
		100% var(--tab-h),
		100% 100%,
		0 100%
	);

	border-radius: var(--folder-r);
	clip-path: var(--folder-clip);

	/* mejora progresiva: donde shape() existe, la esquina superior derecha
	   se redondea con un arco en vez de quedar en pico */
	@supports (clip-path: shape(...)) {
		--folder-clip: shape(...);
	}
}
```

Para cambiar la forma de la pestaña se tocan `--tab-h` (alto), `--tab-w`
(ancho) y `--tab-slope` (la diagonal) **en la clase que quieras**: por eso
la carpeta grande del visor (`--tab-h: 4rem`) puede tener una pestaña
mucho más generosa que las pequeñas (`1.125rem`).

Y por eso `.file` / `.sheetFile` solo tienen que **pisar `--folder-clip`**
para convertir la carpeta en folio: heredan todo lo demás.

⚠️ **Consecuencia crítica de `clip-path`: recorta TODO lo que quede fuera
del polígono, incluidas las sombras.** De ahí dos cosas:

- el filo que separa una carpeta de la de debajo es un `border-left` (va
  _dentro_ de la caja) y no una sombra;
- la sombra de hover (`--folder-shadow`, un `drop-shadow`) se aplica en el
  **`<li>` contenedor** (`.topicCell` / `.stackItem`), nunca en el botón:
  ahí se la comería el recorte. `drop-shadow` y no `box-shadow` porque
  sigue la silueta recortada en vez de la caja rectangular.

### 7.2 El amontonamiento = columnas más estrechas que la carpeta

El montón (`.stack`) es un **grid** cuyas columnas miden el **paso**
(`--step`), y las carpetas son **más anchas que su columna**: cada una
invade la siguiente, y ahí nace el solape.

```css
.stack {
	--folder-w: 10.5rem; /* ancho de la carpeta */
	--min-step: 5rem; /* solape MÁXIMO = franja visible mínima de cada carpeta */
	--step: clamp(
		var(--min-step),
		calc((100% - var(--folder-w)) / (var(--n) - 1)),
		/* ← lo que cabe */ calc(var(--folder-w) + var(--gap)) /* ← sin solape */
	);
	grid-template-columns: repeat(auto-fill, var(--step));
}
```

`--n` (cuántas fuentes hay) lo inyecta `SourceStack.astro` con un
`style="--n: 8"`, **con un mínimo de 2** porque la fórmula divide entre
`--n - 1`. El `clamp` produce los tres comportamientos que ves:

| Situación                              | `--step` resultante         | Se ve así                                                                |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| Pocas fuentes / pantalla ancha         | tope alto: `folder-w + gap` | enteras y separadas, **sin solape**                                      |
| No caben enteras                       | el valor de en medio        | se solapan **lo justo** para caber en la fila                            |
| No caben ni solapadas (móvil + muchas) | tope bajo: `min-step`       | solape máximo (siempre asoma la pestaña) y **saltan a la fila de abajo** |

**Para hacer las piezas más grandes/pequeñas → `--folder-w`. Para que se
amontonen más → bajar `--min-step`.**

> ¿Por qué grid y no márgenes negativos? Porque con `margin-left` negativo
> la primera carpeta **de cada fila** arrastraba el solape y se salía por
> la izquierda del contenedor. Con columnas, cada fila empieza limpia.

Hay **tres calibrados** del mismo montón:

| Clase         | Dónde                         | `--folder-w` / `--min-step` | Efecto                                              |
| ------------- | ----------------------------- | --------------------------- | --------------------------------------------------- |
| `.stack`      | "Detrás de este post"         | 10.5rem / 5rem              | carpetas apaisadas muy amontonadas                  |
| `.stackLoose` | página de tema (prop `loose`)  | — / 8.5rem                  | apenas se pisan; con ratón, la apuntada se adelanta |
| `.stackFiles` | página de tema (prop `file`)   | 8.5rem / 7rem               | folios A4 verticales (`aspect-ratio: 210/297`)      |

⚠️ La página de tema usa **las dos** (`loose` **y** `file`), y ambas
declaran `--min-step`. Gana `.stackFiles` por estar **después** en el
archivo (misma especificidad), así que el valor real allí es **7rem sobre
un folio de 8.5rem**: solape de 1.5rem. Si reordenas esas dos reglas,
cambias el solape de la página de tema sin tocar ningún número.

En móvil (`< 40rem`) las dos **quitan el solape del todo**
(`--min-step = --folder-w + --gap`) y pasan a 2 columnas que llenan la
pantalla, igual que la rejilla del cajón (en tablet, `.stackFiles` pasa a
3 columnas: con el A4 vertical, 2 salían enormes).

### 7.2 bis — Por qué el hover NO sube el z-index (salvo en `.stackLoose`)

`--step` no es solo estética: **es la franja descubierta de cada carpeta, o
sea su zona de hover y de click**. De ahí una regla que parece
contraintuitiva:

```css
.stackItem:has(.folder:hover) {
	transform: translateY(-0.5rem); /* se levanta… */
	/* …pero NO lleva z-index: la carpeta apuntada no se adelanta */
}
```

Si la carpeta apuntada saltase al frente (`z-index: 20`), pasaría a cubrir
con su **ancho completo** (147px) a las 2-3 siguientes (70px cada una).
Resultado: al mover el ratón hacia la derecha, saltas de la carpeta 1 a la
4 y **hay carpetas a las que no puedes llegar**.

Dos excepciones, y en ambas el razonamiento se sostiene:

- **`.stackLoose`** (página de tema) **sí** sube el z-index, pero solo
  bajo `@media (hover: hover)`: con un solape de 1.5rem, la pieza apuntada
  tapa muy poco de la siguiente y se sigue llegando a todas.
- **El teclado** (`:focus-visible`) sí lleva `z-index: 20` siempre: no hay
  cursor que pueda "saltarse" nada, y así se ven enteros tanto el foco
  como la pieza enfocada.

### 7.3 El ancho explícito de la página (el bug raro del `<main>`)

```css
.topicPage {
	width: min(var(--screen-md), calc(100vw - 2 * var(--sp-3)));
}
```

Esto **no es decorativo, es funcional**, y es la trampa más difícil de ver
de toda la feature. El `<main>` global (`src/styles/global.css`) lleva
`margin-inline: auto`, y eso hace que se dimensione **por su contenido**
(`fit-content`) en vez de estirarse al ancho de la pantalla. Sin un ancho
fijo en la página que contiene un montón:

- el montón (que es ancho por naturaleza) estiraba el `<main>` y **la
  página entera se salía de la pantalla en móvil**;
- y el `100%` del cálculo de `--step` (§7.2) no tenía contra qué
  resolverse → el solape adaptativo no funcionaba (todo salía solapado
  aunque sobrara sitio).

Por lo mismo hay `min-width: 0` en la cadena de contenedores flex: un item
flex usa `min-width: auto` por defecto y se niega a encogerse por debajo de
su contenido.

⚠️ **Hoy solo `.topicPage` lleva ese `width`**; la clase `.sourcesPage`
se aplica en el HTML pero **no tiene ninguna regla CSS**, así que el cajón
se ciñe sin más al ancho del `<main>`. Eso funciona porque su rejilla
(`.topicGrid`, `auto-fill` + `minmax(…, 1fr)`) sí sabe encogerse. **Si
algún día metes un montón (`SourceStack`) en el cajón, tendrás que darle un
`width` explícito** o volverá a romperse el responsive. Lo mismo aplica a
`PostSources`: hoy funciona porque el contenedor del post ya tiene un ancho
propio.

---

## 8. Filtros y buscador

Son **dos scripts distintos**, uno por vista. Los dos trabajan solo con
`data-*` y `hidden`, **nunca añadiendo clases**: las clases de un CSS
Module van hasheadas en build (`_folder_1h04g_344`), así que desde el JS no
puedes escribir `classList.add("folder")` y esperar que funcione.

### 8.1 El cajón — `scripts/sources-filters.ts`

Los controles los pinta `TerminalSearch.astro`, un `<details>` con pinta de
ventana de terminal (barra de título con semáforo, `[+]`/`[-]`, prompt `›`,
checkboxes `[ ]` / `[x]`). Plegarlo es HTML puro, sin JS.

Estado de 2 campos (`{ query, kinds }`), aplicado sobre cada `[data-topic]`:

- **buscador** → compara con `data-name` (el nombre en minúsculas, ya
  precalculado en el HTML por `TopicFolder`).
- **toggles de tipo de TEMA** → compara con `data-kind` (`sesgo` /
  `modelo`).

Los toggles son independientes y **ninguno encendido = todo pasa**; por eso
no hay botón "todos". Si no queda nada visible, sale el mensaje
`[data-no-results]`.

⚠️ En el cajón **no se filtra por tipo de fuente** (libro, cita...): a ese
nivel una carpeta es un tema entero y guarda fuentes de varios tipos. Ese
filtro vive dentro del tema.

### 8.2 La página de tema — `scripts/topic-filters.ts`

Toggles de **tipo de fuente**, y solo de los tipos que ese tema guarda de
verdad (`TopicPage` los calcula; con un solo tipo ni siquiera pinta la
barra). Hace dos cosas a la vez para que el montón y el visor no se
contradigan:

1. oculta los `[data-source-item]` que no son de ese tipo;
2. marca con `data-off` las hojas del visor que no son de ese tipo, para
   que el slider las salte (§6).

---

## 9. Recetas: qué tocar para…

| Quiero…                                    | Fichero                                                      | Qué                                                                              |
| ------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Añadir una fuente a un post                | `src/content/{bias,mental-models}/<x>.mdx`                   | añadir un item a `sources:`                                                      |
| Un tipo de fuente nuevo                    | `content.config.ts` + `data/source-types.ts`                 | el `z.enum` y `TYPE_LABELS` (los dos, §3.3)                                      |
| Ver "Detrás de este post" en los sesgos    | `src/pages/behavior/sesgos/[...id].astro`                    | descomentar el import y el `<PostSources />`                                     |
| Cambiar el tamaño de las piezas            | `sources.module.css`                                         | `--folder-w` en `.stack`/`.stackFiles` (montón) / `minmax()` en `.topicGrid`     |
| Que se amontonen más o menos               | `sources.module.css`                                         | `--min-step` en `.stack` / `.stackLoose` / `.stackFiles`                         |
| Cambiar la forma de la pestaña             | `sources.module.css`                                         | `--tab-h`, `--tab-w`, `--tab-slope` de la clase que sea                          |
| Convertir carpetas en folios (o al revés)  | quien use `SourceStack`                                      | la prop `file` (y `loose` para el solape suelto)                                 |
| Cambiar el orden del cajón                 | `data/get-topics.ts`                                         | el `.sort()` final                                                               |
| Que un post NO salga en el cajón           | su `.mdx`                                                    | quitarle el array `sources`                                                      |
| Cambiar qué muestra la pieza cerrada       | `TopicFolder.astro` (cajón) / `SourceStack.astro` (fuentes)  | el markup del `<button>`                                                         |
| Cambiar qué muestra la pieza abierta       | `SourceSheets.astro`                                         | el markup del `<div data-slide>`                                                 |
| Añadir un botón de cerrar al visor         | `SourceSheets.astro`                                         | un `<button data-folder-close class={styles.sheetClose}>` (JS y CSS ya existen)  |
| Añadir un filtro nuevo al cajón            | `TerminalSearch.astro` + `scripts/sources-filters.ts`        | un control + un `data-*` en `TopicFolder` + una rama en el `apply()`             |
| Cambiar colores                            | `src/styles/global.css`                                      | los tokens (`--surface-*`, `--c-behavior`); **nunca hardcodear un hex aquí**     |

---

## 10. Invariantes (romper esto rompe la feature)

1. **El `id` del `<dialog>` y el `data-folder-open` del botón deben
   coincidir.** Es el único vínculo entre la pieza y su visor.
2. **Los `id` deben ser únicos en la página.** Por eso el cajón usa
   `sesgo-<id>` / `modelo-<id>` y no el id pelado.
3. **No añadir un tipo al enum sin añadirlo a `TYPE_LABELS`** (§3.3).
4. **No sustituir por una `box-shadow` el `border-left` de la pieza ni el
   `drop-shadow` del `<li>`**: el `clip-path` se las come (§7.1).
5. **No poner `z-index` en el `:hover` de `.stackItem`** (el montón
   cerrado): tapa a las siguientes y las vuelve inalcanzables con el
   ratón. En `.stackLoose` sí, pero solo bajo `@media (hover: hover)` (§7.2 bis).
6. **No quitar el `width` explícito de `.topicPage`** ni los
   `min-width: 0`: se rompe el responsive y el solape adaptativo (§7.3).
   Toda página que contenga un `SourceStack` necesita un ancho propio.
7. **No manipular clases desde JS** (van hasheadas): usar `data-*` y
   `hidden` (§8).
8. **`folder-dialog.ts` se registra una vez y punto** (bandera
   `foldersInit`); los de filtros, una vez por `astro:page-load` (bandera
   `data-init`). Cambiar ese reparto duplica listeners (§6).

---

## 11. Cómo comprobar que no lo has roto

```bash
pnpm build   # falla si el frontmatter no cumple el schema o si TS no cuadra
pnpm dev     # y mirar a ojo:
```

Checklist rápido en el navegador:

- **Cajón**: plegar y desplegar la terminal; buscar por nombre; encender
  "sesgos" (deben desaparecer los modelos) y apagarlo (debe volver todo).
- **Abrir una carpeta**: el contador debe decir `1 / N`; con las flechas
  ← → debe pasar de hoja y volver a la primera al llegar al final; la
  pestaña y la fecha deben cambiar con cada hoja; `Esc` y click fuera
  deben cerrar.
- **Página de tema**: filtrar por "cita" → deben quedar solo los folios de
  cita **y** el contador del visor debe pasar a `1 / <nº de citas>`.
- **Responsive**: a 320px y 390px **no debe haber scroll horizontal**
  (es el fallo clásico aquí, §7.3).
- **Página de tema con pocas fuentes** (p. ej. `pensamiento-inverso`, 3):
  en desktop deben verse **enteros y apenas solapados**; en móvil, 2
  columnas sin solape.
