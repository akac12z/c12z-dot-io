// los títuos deben tener entre 50-60 caracteres y las descripciones entre 110-160 caracteres

import type { PagesInfo } from "@interfaces/pagesInfo.interface";
import { SITE_DEFAULT_CONFIG } from "./siteInfo";

export const CONTEXT_PAGE_INFO: PagesInfo = {
  title: `Mi contexto - ${SITE_DEFAULT_CONFIG.title} ✌🏽`,
  description: SITE_DEFAULT_CONFIG.description,
};

export const LIBRARY_PAGE_INFO: PagesInfo = {
  title: "Biblioteca y Notas de Libros que voy leyendo - c12z",
  description:
    "Notas y reflexiones de los libros que voy leyendo sobre growth, startups, psicología del comportamiento y crecimiento personal.",
};

export const BEHAVIOR_PAGE_INFO: PagesInfo = {
  title: `Behavioral economics aplicado a Growth y Producto - c12z`,
  description:
    "Entiende mejor a tus usuarios y crea mejores productos (y más sticky) sabiendo cómo funciona la mente humana a través de behavioral economics.",
};

export const BIAS_PAGE_INFO: PagesInfo = {
  title: `Sesgos y heurísticas: por qué hacemos lo que hacemos? - c12z`,
  description:
    "Sesgos cognitivos y heurísticas explicados con ejemplos y aplicados al mundo de producto y growth para aumentar adquisición y retención de usuarios en startups.",
};

export const ESSAY_PAGE_INFO: PagesInfo = {
  title: `Guias sobre Growth, Behavioral Economics y Producto - c12z`,
  description:
    "Ensayos y reflexiones sobre growth, behavioral economics y desarrollo. Ideas propias y recopiladas de mis pares del mundo startup y producto.",
};

export const PROJECTS_PAGE: PagesInfo = {
  title: "Proyectos y cosas que voy haciendo - c12z",
  description:
    "Proyectos personales de Chema (yo 🙃) explicados paso a paso: cómo los he construido, qué herramientas he usado y el porqué detrás de cada decisión.",
};
