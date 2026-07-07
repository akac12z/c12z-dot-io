import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

import { loadCover } from "@/features/og/loadCover";
import { coverOgTemplate } from "@/features/og/ogTemplates";
import { renderOgImage } from "@/features/og/renderOgImage";

export const prerender = true;

interface Props {
	entry: CollectionEntry<"library">;
}

export async function getStaticPaths() {
	const library = await getCollection("library");

	return library.map((entry) => ({
		params: { id: entry.id },
		props: { entry },
	}));
}

// Template C: carátula del libro + título + autor
export const GET: APIRoute<Props> = async ({ props }) => {
	const { entry } = props;
	const { title, authors } = entry.data;

	const authorsInArray = Array.isArray(authors) ? authors : [authors];
	const cover = await loadCover(entry);

	return renderOgImage(
		coverOgTemplate({
			title,
			subtitle: authorsInArray[0].name,
			cover,
			footerUrl: `c12z.io/biblioteca/${entry.id}`,
		}),
	);
};
