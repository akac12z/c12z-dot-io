import { getCollection, type CollectionEntry } from "astro:content";

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

/** the two collections that carry `sources` in their frontmatter */
type SourcedEntry = CollectionEntry<"bias"> | CollectionEntry<"mentalModels">;

/**
 * There is no `status` field in the frontmatter: the state of a topic is
 * read from `backlog`, which is what the author already fills in.
 */
const toState = (backlog: "wip" | "upload"): Topic["state"] =>
	backlog === "wip" ? "estudiando" : "publicado";

/**
 * The shape of a topic, in one place. Both collections share `id`,
 * `backlog`, `publishDate` and `sources`; only the name field and the
 * route change, so those two arrive already resolved.
 */
const buildTopic = (
	entry: SourcedEntry,
	kind: Topic["kind"],
	name: string,
	basePath: string,
): Topic => ({
	id: `${kind}-${entry.id}`,
	slug: entry.id,
	kind,
	name,
	href:
		entry.data.backlog === "upload" ? `${basePath}/${entry.id}` : undefined,
	state: toState(entry.data.backlog),
	date: entry.data.publishDate,
	sources: entry.data.sources,
});

const biasToTopic = (entry: CollectionEntry<"bias">) =>
	buildTopic(entry, "sesgo", entry.data.biasName, "/behavior/sesgos");

const modelToTopic = (entry: CollectionEntry<"mentalModels">) =>
	buildTopic(
		entry,
		"modelo",
		entry.data.modelName,
		"/behavior/modelos-mentales",
	);

/**
 * A topic with no sources never reaches the drawer, so it never shows an
 * empty folder. That is also how you hide a post from the drawer: remove
 * its `sources`.
 */
const hasSources = (topic: Topic) => topic.sources.length > 0;

/**
 * A bias, a design and a model could have the same id: if the slug
 * conflicts, it is prefixed with its kind ("modelo-anclaje") so as not to
 * break `getStaticPaths` — two identical routes would fail the build.
 *
 * Returns new topics instead of rewriting `slug` in place: the input list
 * stays as it was built.
 */
const disambiguateSlugs = (topics: Topic[]): Topic[] => {
	const times = new Map<string, number>();
	for (const topic of topics) {
		times.set(topic.slug, (times.get(topic.slug) ?? 0) + 1);
	}

	return topics.map((topic) =>
		(times.get(topic.slug) ?? 0) > 1
			? { ...topic, slug: `${topic.kind}-${topic.slug}` }
			: topic,
	);
};

/**
 * What is being studied goes first (the drawer is a workbench, not an
 * archive) and, within each group, the newest first. Change the order
 * HERE, not in the component.
 */
const byStudyingThenNewest = (a: Topic, b: Topic) => {
	if (a.state !== b.state) return a.state === "estudiando" ? -1 : 1;
	return parseSourceDate(b.date).getTime() - parseSourceDate(a.date).getTime();
};

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
 */
export const getTopics = async (): Promise<Topic[]> => {
	const [biases, models] = await Promise.all([
		getCollection("bias"),
		getCollection("mentalModels"),
	]);

	const topics = [
		...biases.map(biasToTopic),
		...models.map(modelToTopic),
	].filter(hasSources);

	return disambiguateSlugs(topics).sort(byStudyingThenNewest);
};

/**
 * Every source of every topic, for the drawer tally ("N carpetas · M
 * fuentes"). It lives here and not in the component because it counts what
 * `getTopics` builds.
 */
export const countSources = (topics: Topic[]) =>
	topics.reduce((total, topic) => total + topic.sources.length, 0);
