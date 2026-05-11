import { SECTION_LISTS } from "./sectionLists";
import { getCollection } from "astro:content";
import type { SectionItem } from "./sectionLists.interface";

const parseDate = (d: string) =>
	new Date(d.split("/").reverse().join("-")).getTime();
const byNewest = (
	a: { data: { publishDate: string } },
	b: { data: { publishDate: string } },
) => parseDate(b.data.publishDate) - parseDate(a.data.publishDate);

const [libraryEntries, biasEntries] = await Promise.all([
	getCollection("library"),
	getCollection("bias"),
]);

const uploadedLibrary = libraryEntries.filter((e) => e.data.backlog === "upload");
const uploadedBias = biasEntries.filter((e) => e.data.backlog === "upload");

const recentLibrary: SectionItem[] = uploadedLibrary
	.sort(byNewest)
	.slice(0, 4)
	.map((entry) => {
		const authors = Array.isArray(entry.data.authors)
			? entry.data.authors
			: [entry.data.authors];
		return {
			text: entry.data.title,
			href: `/biblioteca/${entry.id}`,
			meta: `${authors[0]?.name ?? ""} · ${entry.data.publishDate.split("/")[2]}`,
		};
	});

const recentBias: SectionItem[] = uploadedBias
	.sort(byNewest)
	.slice(0, 4)
	.map((entry) => ({
		text: entry.data.biasName,
		href: `/behavior/sesgos/${entry.id}`,
		meta: `/${entry.collection}`,
	}));

const sectionUpdates: Record<string, { items: SectionItem[]; totalCount: number }> = {
	biblioteca: { items: recentLibrary, totalCount: uploadedLibrary.length },
	behavior: { items: recentBias, totalCount: uploadedBias.length },
};

export const updatedSectionLists = SECTION_LISTS.map((section) =>
	section.label in sectionUpdates
		? { ...section, ...sectionUpdates[section.label] }
		: section,
);
