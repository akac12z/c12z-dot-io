import type { Section } from "@interfaces/sectionLists.interface";

export const SECTION_LISTS: Section[] = [
  {
    href: "/ensayos",
    style: "ensayos",
    label: "ensayos",
    description: "Insights, frameworks y pensamientos sobre Growth y producto",
    items: [
      {
        text: "Acquisition Playbook.",
        href: "#",
      },
      {
        text: "Best retention metrics for B2B ealy stage starups.",
        href: "#",
      },
    ],
  },
  {
    href: "/behavior",
    style: "behavior",
    label: "behavior",
    description: "Cómo y por qué hacemos lo que hacemos y cómo aplicarlo",
    items: [
      {
        text: "Sesgo de Escasez.",
        href: "#",
      },
      {
        text: "¿Qué son los modelos mentales?",
        href: "#",
      },
    ],
  },
  {
    href: "/biblioteca",
    style: "biblioteca",
    label: "biblioteca",
    description: "Notas de los libros que voy leyendo",
    items: [
      {
        text: "The Mom Test.",
        href: "#",
      },
      {
        text: "Show your Work",
        href: "#",
      },
    ],
  },
  {
    href: "/proyectos",
    style: "proyectos",
    label: "proyectos",
    description: "Cosas que voy creando que me parecen interesantes",
    items: [
      {
        text: "La Vida Moderna Quotes",
        href: "#",
      },
      {
        text: "Mom's Meals",
        href: "#",
      },
    ],
  },
  {
    href: "/notas",
    style: "otros",
    label: "notas",
    description: "pensamientos que me parecen interesante guardar",
    items: [],
  },
];
