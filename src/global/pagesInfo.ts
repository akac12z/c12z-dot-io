import type { PagesInfo } from "@interfaces/pagesInfo.interface";
import { SITE_DEFAULT_CONFIG } from "./siteInfo";

export const CONTEXT_PAGE_INFO: PagesInfo = {
  title: `Mi contexto - ${SITE_DEFAULT_CONFIG.title} ✌🏽`,
  description: SITE_DEFAULT_CONFIG.description,
};

export const LIBRARY_PAGE_INFO: PagesInfo = {
  title: `Notas de libros: growth, psicología, crecimiento personal y startups - ${SITE_DEFAULT_CONFIG.title}`,
  description:
    "Explora las ideas y conceptos más importantes de libros sobre growth, startups, psicología del comportamiento y crecimiento personal. Accede a contenido esencial en un solo lugar.",
};

export const BEHAVIOR_PAGE_INFO: PagesInfo = {
  title: `Psicología del comportamiento y heurísticas aplicadas a Growth y Startups - ${SITE_DEFAULT_CONFIG.title}`,
  description:
    "Descubre cómo aplicar la psicología del comportamiento y la economía conductual para entender mejor a los usuarios y potenciar estrategias de growth en startups.",
};

export const BIAS_PAGE_INFO: PagesInfo = {
  title: `Sesgos cognitivos y heurísticas: Casos de estudio, ejemplos y aplicaciones a Startups - ${SITE_DEFAULT_CONFIG.title}`,
  description:
    "Explora una recopilación de sesgos cognitivos y heurísticas humanas con ejemplos prácticos y aplicaciones para entender y mejorar la toma de decisiones y cómo poder aplicarlos en tus productos.",
};

export const ESSAY_PAGE_INFO: PagesInfo = {
  title: `Ensayos sobre Growth, Psicología del Comportamiento y Startups. - ${SITE_DEFAULT_CONFIG.title}`,
  description:
    "Colección de ensayos sobre Growth en startups y psicología del comportamiento. Reflexiones y aprendizajes recopilados de la experiencia mía, de mis pares y de lo que voy leyendo.",
};
