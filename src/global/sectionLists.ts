import type { Section } from "@interfaces/sectionLists.interface";

export const SECTION_LISTS: Section[] = [
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
        text: "#LaVidaModerna es...",
        href: "/proyectos/la-vida-moderna-es",
      },
      {
        text: "Mom's Meals",
        href: "#",
      },
    ],
  },
  {
    href: "/ensayos",
    style: "ensayos",
    label: "ensayos",
    description: "Insights, frameworks y pensamientos sobre Growth y producto",
    items: [],
  },
  {
    href: "/behavior",
    style: "behavior",
    label: "behavior",
    description: "Cómo y por qué hacemos lo que hacemos y cómo aplicarlo",
    items: [],
  },
  {
    href: "/notas",
    style: "otros",
    label: "notas",
    description: "pensamientos que me parecen interesante guardar",
    items: [],
  },
];
