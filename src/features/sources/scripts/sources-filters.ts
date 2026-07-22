import { bindToggles, claimRoot, passes } from "./filter-toggles.ts";

/**
 * Filters the folders in the drawer (/behavior/fuentes) by name and by kind
 * of topic (bias or mental model). The kinds are toggles: you can turn both
 * on, or leave both off = everything goes through. The source type (book,
 * quote...) is filtered within each topic, not here.
 *
 * The toggle machinery and the `data-*` rules live in ./filter-toggles.ts;
 * what is only the drawer's is the search field and the empty-state message.
 */
export const initSourcesFilters = () => {
	const root = claimRoot("[data-sources-root]");
	if (!root) return;

	const cells = [...root.querySelectorAll<HTMLElement>("[data-topic]")];
	const noResults = root.querySelector<HTMLElement>("[data-no-results]");
	const search = root.querySelector<HTMLInputElement>("[data-search]");

	let query = "";
	const kinds = new Set<string>();

	// both conditions at once: a cell survives if its name matches what is
	// typed AND its kind is among the ones selected
	const apply = () => {
		let visible = 0;

		for (const cell of cells) {
			const okName = (cell.dataset.name ?? "").includes(query);
			cell.hidden = !(okName && passes(kinds, cell.dataset.kind));
			if (!cell.hidden) visible++;
		}

		if (noResults) noResults.hidden = visible > 0;
	};

	search?.addEventListener("input", () => {
		query = search.value.trim().toLowerCase();
		apply();
	});

	bindToggles(root, "data-filter-kind", kinds, apply);
};
