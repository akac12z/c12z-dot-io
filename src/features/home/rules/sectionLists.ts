import type { Section } from "./sectionLists.interface";

export const SECTION_LISTS: Section[] = [
  {
    href: "/proyectos",
    style: "proyectos",
    label: "proyectos",
    description: "Cosas que voy creando y compartiendo",
    items: [
      {
        text: "#LaVidaModerna es...",
        href: "/proyectos/la-vida-moderna-es",
      },
    ],
  },
  {
    href: "/biblioteca",
    style: "biblioteca",
    label: "biblioteca",
    description: "Notas de los libros que voy leyendo",
    items: [],
  },
  {
    href: "/ensayos",
    style: "ensayos",
    label: "ensayos",
    description: "Insights, frameworks y pensamientos sobre Growth y Producto",
    items: [],
  },
  {
    href: "/behavior",
    style: "behavior",
    label: "behavior",
    description:
      "Cómo y por qué hacemos lo que hacemos y cómo aplicarlo a Producto",
    items: [],
  },
];
