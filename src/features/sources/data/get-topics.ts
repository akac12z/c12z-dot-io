import { getCollection } from "astro:content";

import { parseSourceDate } from "./parse-source-date.ts";
import type { Source } from "./source-types.ts";

/**
 * A topic = a bias or a mental model that HAS sources. It is the unit the
 * whole feature works with: the drawer paints one folder per topic and the
 * dynamic route builds one page per topic.
 */
export interface Topic {
	/** "sesgo-anclaje" — the id of the <dialog> in the HTML; prefixed by
	 *  kind so a bias and a model can never collide in the same page */
	id: string;
	/** "anclaje" — the URL segment, /behavior/fuentes/<slug> */
	slug: string;
	kind: "sesgo" | "modelo" | "diseño";
	/** biasName, modelName, or designs */
	name: string;
	/** link to the post, only if it is published (backlog: "upload") */
	href?: string;
	/** derived from `backlog`: wip → estudiando, upload → publicado.
	 *  There is no separate `status` field in the frontmatter. */
	state: "estudiando" | "publicado";
	/** publishDate of the post, DD/MM/YYYY */
	date: string;
	sources: Source[];
}

/**
 * The single source of truth of the feature: builds every topic by reading
 * the `sources` array in the frontmatter of each bias and each mental
 * model. There is no `sources` collection — sources live in the post that
 * cites them, so writing one means editing that post's .mdx and nothing
 * else.
 *
 * Used by BOTH the drawer grid and `getStaticPaths` of
 * /behavior/fuentes/[...id], which is what keeps slug and order in sync
 * between the two.
 *
 * It does three things worth knowing:
 *   1. drops topics with no sources, so the drawer never fills with empty
 *      folders (that is also how you hide a post from the drawer: remove
 *      its `sources`);
 *   2. sorts what is being studied first (the drawer is the workbench) and
 *      then by descending date — change the order HERE, not in the component;
 *   3. disambiguates colliding slugs (see below).
 */
export const getTopics = async (): Promise<Topic[]> => {
	const [biases, models] = await Promise.all([
		getCollection("bias"),
		getCollection("mentalModels"),
	]);

	const toState = (backlog: "wip" | "upload") =>
		backlog === "wip" ? ("estudiando" as const) : ("publicado" as const);

	const topics: Topic[] = [
		...biases.map((entry) => ({
			id: `sesgo-${entry.id}`,
			slug: entry.id,
			kind: "sesgo" as const,
			name: entry.data.biasName,
			href:
				entry.data.backlog === "upload"
					? `/behavior/sesgos/${entry.id}`
					: undefined,
			state: toState(entry.data.backlog),
			date: entry.data.publishDate,
			sources: entry.data.sources,
		})),
		...models.map((entry) => ({
			id: `modelo-${entry.id}`,
			slug: entry.id,
			kind: "modelo" as const,
			name: entry.data.modelName,
			href:
				entry.data.backlog === "upload"
					? `/behavior/modelos-mentales/${entry.id}`
					: undefined,
			state: toState(entry.data.backlog),
			date: entry.data.publishDate,
			sources: entry.data.sources,
		})),
	].filter((topic) => topic.sources.length > 0);

	// A bias, design and a model could have the same ID: if the slug conflicts, it is
	// disambiguated based on the type ("modelo-anclaje") so as not to break
	// `getStaticPaths` — two identical routes would fail the build.
	const times = new Map<string, number>();
	for (const topic of topics) {
		times.set(topic.slug, (times.get(topic.slug) ?? 0) + 1);
	}
	for (const topic of topics) {
		if ((times.get(topic.slug) ?? 0) > 1) {
			topic.slug = `${topic.kind}-${topic.slug}`;
		}
	}

	return topics.sort((a, b) => {
		if (a.state !== b.state) return a.state === "estudiando" ? -1 : 1;
		return (
			parseSourceDate(b.date).getTime() - parseSourceDate(a.date).getTime()
		);
	});
};
