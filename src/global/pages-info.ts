/**
 * Global per-page SEO/OG metadata for c12z.io.
 *
 * - `PAGE_INFO_SCHEMA` — Zod schema enforcing title (50-60 chars) and
 *   description (110-160 chars) length, plus optional OG image and
 *   keywords (7-8 items, short-tail + long-tail) fields.
 * - `PagesInfo` — TypeScript type inferred from the schema.
 * - `PAGES` — per-section metadata keyed by page slug, validated at build time.
 *
 * Always import from here instead of hardcoding page titles/descriptions elsewhere.
 */

import { z } from "astro/zod";

import { SITE_DEFAULT_CONFIG } from "./site-info";

// Servidas tal cual desde public/ (sin pasar por astro:assets): ya vienen
// pre-renderizadas a 1200x630, no necesitan optimización/resize.
const OG_IMAGE_DEFAULT = "/og/og-image.avif";
const OG_IMAGE_LIBRARY = "/og/pages/og-image-library.avif";
const OG_IMAGE_BEHAVIOR = "/og/pages/og-image-behavior.avif";
const OG_IMAGE_BIAS = "/og/pages/og-image-bias.avif";
const OG_IMAGE_MENTAL_MODEL = "/og/pages/og-image-mental-models.avif";
const OG_IMAGE_ESSAY = "/og/pages/og-image-essay.avif";
const OG_IMAGE_PROJECTS = "/og/pages/og-image-projects.avif";
const OG_IMAGE_NOTES = "/og/pages/og-image-notes.avif";

const PAGE_INFO_SCHEMA = z.object({
	title: z.string().min(50).max(60),
	description: z.string().min(110).max(160),
	ogImage: z.string().optional(),
	ogImageAlt: z.string().optional(),
	keywords: z.array(z.string()).min(7).max(8).optional(),
});

export type PagesInfo = z.infer<typeof PAGE_INFO_SCHEMA>;

export const PAGES = z.record(z.string(), PAGE_INFO_SCHEMA).parse({
	context: {
		title: "Mi contexto: quién soy, qué hago y por qué - c12z ✌🏽",
		description: SITE_DEFAULT_CONFIG.description,
		ogImage: OG_IMAGE_DEFAULT,
		ogImageAlt: "Chema Ferrandez - c12z",
		keywords: [
			"chema ferrandez",
			"quién es cz",
			"quién es chema ferrandez",
			"chema ferrandez growth y producto",
			"sobre mí growth y producto",
			"mi contexto profesional en growth",
			"chema ferrandez behavioral economics",
			"trayectoria profesional en growth y producto",
		],
	},
	library: {
		title: "Biblioteca y Notas de Libros que voy leyendo - c12z",
		description:
			"Notas y reflexiones de los libros que voy leyendo sobre growth, startups, psicología del comportamiento y crecimiento personal.",
		ogImage: OG_IMAGE_LIBRARY,
		ogImageAlt: "Biblioteca y notas de libros - c12z",
		keywords: [
			"resúmenes de libros",
			"notas de libros",
			"resúmenes de libros de growth",
			"resúmenes de libros de startups",
			"resúmenes de libros de psicología del comportamiento",
			"notas y reflexiones de libros de negocio",
			"biblioteca de libros de producto y growth",
			"libros recomendados sobre crecimiento personal",
		],
	},
	behavior: {
		title: "Behavioral economics aplicado a Growth y Producto - c12z",
		description:
			"Entiende mejor a tus usuarios y crea mejores productos (y más sticky) sabiendo cómo funciona la mente humana a través de behavioral economics.",
		ogImage: OG_IMAGE_BEHAVIOR,
		ogImageAlt: "Behavioral economics aplicado a growth y producto - c12z",
		keywords: [
			"behavioral economics",
			"economía conductual",
			"psicología del comportamiento",
			"economía conductual aplicada a growth",
			"behavioral economics para producto",
			"cómo funciona la mente humana en producto",
			"sesgos cognitivos en growth y producto",
			"behavioral design aplicado a startups",
		],
	},
	bias: {
		title: "Sesgos y heurísticas: por qué hacemos lo que hacemos? - c12z",
		description:
			"Sesgos cognitivos y heurísticas explicados con ejemplos y aplicados al mundo de producto y growth para aumentar adquisición y retención de usuarios en startups.",
		ogImage: OG_IMAGE_BIAS,
		ogImageAlt: "Sesgos y heurísticas cognitivas - c12z",
		keywords: [
			"sesgos cognitivos",
			"heurísticas",
			"sesgos y heurísticas explicados",
			"sesgos cognitivos aplicados a growth",
			"sesgos cognitivos aplicados a producto",
			"por qué tomamos decisiones irracionales",
			"lista de sesgos cognitivos con ejemplos",
			"heurísticas de decisión en marketing y producto",
		],
	},
	mentalModel: {
		title: "Modelos mentales aplicados a growth y producto - c12z",
		description:
			"Modelos mentales explicados con ejemplos para pensar con más claridad, tomar mejores decisiones y aplicarlos al mundo de growth y producto.",
		ogImage: OG_IMAGE_MENTAL_MODEL,
		ogImageAlt: "Modelos mentales aplicados a growth y producto - c12z",
		keywords: [
			"modelos mentales",
			"mental models",
			"modelos mentales explicados con ejemplos",
			"modelos mentales aplicados a growth",
			"modelos mentales aplicados a producto",
			"lista de modelos mentales",
			"modelos mentales para tomar decisiones",
			"cómo pensar mejor con modelos mentales",
		],
	},
	essay: {
		title: "Guias sobre Growth, Behavioral Economics y Producto - c12z",
		description:
			"Ensayos y reflexiones sobre growth, behavioral economics y desarrollo. Ideas propias y recopiladas de mis pares del mundo startup y producto.",
		ogImage: OG_IMAGE_ESSAY,
		ogImageAlt: "Ensayos sobre growth, behavioral economics y producto - c12z",
		keywords: [
			"ensayos sobre growth",
			"guías de producto",
			"ensayos sobre behavioral economics",
			"reflexiones sobre growth y producto",
			"guías sobre crecimiento de startups",
			"ensayos sobre desarrollo y producto",
			"ideas sobre growth behavioral economics y desarrollo",
			"blog de growth y economía conductual",
		],
	},
	notes: {
		title: "Notas: apuntes cortos de growth, producto y diseño - c12z",
		description:
			"Notas cortas y apuntes rápidos sobre growth, producto y behavioral economics. Ideas sueltas que voy capturando antes de que se conviertan en ensayos.",
		ogImage: OG_IMAGE_NOTES,
		ogImageAlt: "Notas y apuntes cortos - c12z",
		keywords: [
			"notas cortas",
			"apuntes de growth",
			"notas sobre producto",
			"apuntes de behavioral economics",
			"notas rápidas de growth y producto",
			"ideas sueltas sobre startups",
			"apuntes cortos de diseño de producto",
			"notas de chema ferrandez",
		],
	},
	projects: {
		title: "Proyectos y cosas que voy construyendo poco a poco - c12z",
		description:
			"Proyectos personales de Chema (yo 🙃) explicados paso a paso: cómo los he construido, qué herramientas he usado y el porqué detrás de cada decisión.",
		ogImage: OG_IMAGE_PROJECTS,
		ogImageAlt: "Proyectos personales de Chema - c12z",
		keywords: [
			"proyectos personales",
			"proyectos de chema ferrandez",
			"proyectos de c12z",
			"cómo construyo mis proyectos paso a paso",
			"proyectos personales de growth y producto",
			"herramientas que uso para construir proyectos",
			"proyectos indie hacker de chema ferrandez",
			"building in public proyectos personales",
		],
	},
});
