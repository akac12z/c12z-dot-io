/**
 * Global per-page SEO/OG metadata for c12z.io.
 *
 * - `PAGE_INFO_SCHEMA` — Zod schema enforcing title (50-60 chars) and
 *   description (110-160 chars) length, plus optional OG image fields.
 * - `PagesInfo` — TypeScript type inferred from the schema.
 * - `PAGES` — per-section metadata keyed by page slug, validated at build time.
 *
 * Always import from here instead of hardcoding page titles/descriptions elsewhere.
 */

import { z } from "astro/zod";

import { SITE_DEFAULT_CONFIG } from "./siteInfo";

import ogImageDefault from "@/assets/images/OpenGraph/pages/og-image.webp";
import ogImageLibrary from "@/assets/images/OpenGraph/pages/og-image-library.webp";
import ogImageBehavior from "@/assets/images/OpenGraph/pages/og-image-behavior.webp";
import ogImageBias from "@/assets/images/OpenGraph/pages/og-image-bias.webp";
import ogImageEssay from "@/assets/images/OpenGraph/pages/og-image-essay.webp";
import ogImageProjects from "@/assets/images/OpenGraph/pages/og-image-projects.webp";

const PAGE_INFO_SCHEMA = z.object({
  title: z.string().min(50).max(60),
  description: z.string().min(110).max(160),
  ogImage: z.string().optional(),
  ogImageAlt: z.string().optional(),
});

export type PagesInfo = z.infer<typeof PAGE_INFO_SCHEMA>;

/**
 * context: página "mi contexto" (about)
 * library: biblioteca y notas de libros
 * behavior: behavioral economics aplicado a growth
 * bias: sesgos y heurísticas
 * essay: ensayos y guías
 * projects: proyectos personales
 */
export const PAGES = z.record(z.string(), PAGE_INFO_SCHEMA).parse({
  context: {
    title: "Mi contexto: quién soy, qué hago y por qué - c12z ✌🏽",
    description: SITE_DEFAULT_CONFIG.description,
    ogImage: ogImageDefault.src,
    ogImageAlt: "Chema Ferrandez - c12z",
  },
  library: {
    title: "Biblioteca y Notas de Libros que voy leyendo - c12z",
    description:
      "Notas y reflexiones de los libros que voy leyendo sobre growth, startups, psicología del comportamiento y crecimiento personal.",
    ogImage: ogImageLibrary.src,
    ogImageAlt: "Biblioteca y notas de libros - c12z",
  },
  behavior: {
    title: "Behavioral economics aplicado a Growth y Producto - c12z",
    description:
      "Entiende mejor a tus usuarios y crea mejores productos (y más sticky) sabiendo cómo funciona la mente humana a través de behavioral economics.",
    ogImage: ogImageBehavior.src,
    ogImageAlt: "Behavioral economics aplicado a growth y producto - c12z",
  },
  bias: {
    title: "Sesgos y heurísticas: por qué hacemos lo que hacemos? - c12z",
    description:
      "Sesgos cognitivos y heurísticas explicados con ejemplos y aplicados al mundo de producto y growth para aumentar adquisición y retención de usuarios en startups.",
    ogImage: ogImageBias.src,
    ogImageAlt: "Sesgos y heurísticas cognitivas - c12z",
  },
  essay: {
    title: "Guias sobre Growth, Behavioral Economics y Producto - c12z",
    description:
      "Ensayos y reflexiones sobre growth, behavioral economics y desarrollo. Ideas propias y recopiladas de mis pares del mundo startup y producto.",
    ogImage: ogImageEssay.src,
    ogImageAlt: "Ensayos sobre growth, behavioral economics y producto - c12z",
  },
  projects: {
    title: "Proyectos y cosas que voy construyendo poco a poco - c12z",
    description:
      "Proyectos personales de Chema (yo 🙃) explicados paso a paso: cómo los he construido, qué herramientas he usado y el porqué detrás de cada decisión.",
    ogImage: ogImageProjects.src,
    ogImageAlt: "Proyectos personales de Chema - c12z",
  },
});
