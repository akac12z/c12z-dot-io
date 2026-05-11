import type { Section } from "./sectionLists.interface";

export const SECTION_LISTS: Section[] = [
	{
		href: "/proyectos",
		style: "project",
		label: "proyectos",
		description: "Cosas que voy creando y compartiendo",
		items: [
			{
				text: "#LaVidaModerna es...",
				href: "/proyectos/la-vida-moderna-es",
				meta: "2025",
			},
		],
	},
	{
		href: "/biblioteca",
		style: "library",
		label: "biblioteca",
		description: "Notas de los libros que voy leyendo",
		items: [],
	},
	{
		href: "/behavior",
		style: "behavior",
		label: "behavior",
		description: "Cómo y por qué hacemos lo que hacemos",
		items: [],
	},
	{
		href: "/ensayos",
		style: "essay",
		label: "ensayos",
		description: "Frameworks y pensamientos sobre Growth y Producto",
		items: [],
	},
];
