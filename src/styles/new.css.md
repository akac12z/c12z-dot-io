# Colores — new.css

---

## Modos

Por defecto el fondo es oscuro (**Ink**). Para el modo claro añadir `data-theme="light"` al `<html>`.

```html
<html data-theme="light"></html>
```

Todos los tokens cambian solos; no hay que tocar nada más.

---

## Tokens de fondo y superficie

Úsalos para capas, no para texto.

| Variable      | Ink       | Recycled Paper | Cuándo                       |
| ------------- | --------- | -------------- | ---------------------------- |
| `--bg`        | `#0b0b0c` | `#f6f4ee`      | Fondo de página              |
| `--surface-1` | `#121215` | `#ffffff`      | Tarjetas, nav, modales       |
| `--surface-2` | `#1b1b20` | `#eeebe2`      | Hover states, capas internas |
| `--surface-3` | `#232328` | `#e6e2d8`      | Inputs, fondos muy anidados  |

---

## Tokens de borde

| Variable     | Ink       | Recycled Paper |
| ------------ | --------- | -------------- | ----------------------------- |
| `--border`   | `#26262c` | `#e6e2d8`      | Borde estándar                |
| `--border-2` | `#34343b` | `#d4cec0`      | Borde reforzado / separadores |

Hay dos shortcuts disponibles:

```css
border: var(--hairline); /* 1px solid --border */
border: var(--hairline-2); /* 1px solid --border-2 */
```

---

## Tokens de texto

| Variable       | Ink       | Recycled Paper | Cuándo                        |
| -------------- | --------- | -------------- | ----------------------------- |
| `--fg`         | `#f5f4f0` | `#17161a`      | Títulos, texto prominente     |
| `--fg-2`       | `#cac9c5` | `#55544f`      | Párrafos, texto body          |
| `--fg-3`       | `#6e6d68` | `#86847d`      | Labels, metadata, texto muted |
| `--fg-inverse` | `#17161a` | `#f5f4f0`      | Texto sobre fondos de acento  |

---

## Acento editorial (rosa / raspberry)

El acento principal del sitio. Usar para elementos interactivos, highlights y decoración clave.

| Variable        | Valor                  | Cuándo                                        |
| --------------- | ---------------------- | --------------------------------------------- |
| `--accent`      | `#d6336c`              | Bordes de acento, outlines de foco            |
| `--accent-ink`  | `#e5668f`              | Texto de acento sobre fondo oscuro            |
| `--accent-soft` | `rgba(214,51,108,.12)` | Fondo de badges, hover suave                  |
| `--accent-2`    | `#904fe7`              | Segundo acento (púrpura), usar con moderación |

```css
/* Ejemplo: botón de acento */
accent-btn {
	border: 1px solid var(--accent);
	color: var(--accent-ink);
	background: var(--accent-soft);
}
```

---

## Colores por sección de contenido

Cada sección del sitio tiene su color propio. Usarlos para destacar elementos contextuales (badges, borders laterales, iconos de sección). El color principal siempre será el mismo pero dentro de las secciones cambiarán algunos colores para tener un contexto visual de donde estás.

| Variable       | Color (Ink) | Color (Recycled Paper) | Sección                      |
| -------------- | ----------- | ---------------------- | ---------------------------- |
| `--c-behavior` | `#e22ef6`   | `#80008e`              | Behavior / Sesgos cognitivos |
| `--c-essay`    | `#33ffe8`   | `#016c60`              | Ensayos                      |
| `--c-library`  | `#ffa424`   | `#a15e00`              | Biblioteca                   |
| `--c-project`  | `#ff3838`   | `#ac0a0a`              | Proyectos                    |
| `--c-note`     | `#a3f03a`   | `#3d6200`              | Notas                        |

```css
/* Ejemplo: badge de sección */
color: var(--c-library);
border: 1px solid var(--c-library);
background: color-mix(in srgb, var(--c-library) 12%, transparent);
```

---

## Colores de categorías de sesgos

Solo para la sección Behavior. Cada categoría cognitiva tiene su color fijo (no cambian con el tema).

| Variable              | Color     | Categoría  |
| --------------------- | --------- | ---------- |
| `--c-bias-speed`      | `#e03d3d` | Velocidad  |
| `--c-bias-memory`     | `#af76ff` | Memoria    |
| `--c-bias-judgment`   | `#4c9dff` | Juicio     |
| `--c-bias-context`    | `#9ed841` | Contexto   |
| `--c-bias-perception` | `#f2ce57` | Percepción |

---

## Colores de estado UI

| Variable     | Color     | Uso                       |
| ------------ | --------- | ------------------------- |
| `--ok`       | `#6a9e6a` | Éxito, confirmaciones     |
| `--warn`     | `#c8a24a` | Advertencias              |
| `--err`      | `#c86a5c` | Errores                   |
| `--c-wip`    | `#ff4d4d` | Secciones en construcción |
| `--c-goback` | `#f16f0e` | Botón de navegación atrás |

---

## Jerarquía visual resumida

```
Texto principal    →  --fg
Texto secundario   →  --fg-2
Texto desactivado  →  --fg-3
Acento interactivo →  --accent-ink  (texto) / --accent (borde) / --accent-soft (fondo)
Sección específica →  --c-essay / --c-library / --c-behavior / --c-project
```
