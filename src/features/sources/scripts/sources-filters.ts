/**
 * Filters the folders in the drawer (/behavior/fuentes) by name and by kind
 * of topic (bias or mental model). The kinds are toggles: you can turn both
 * on, or leave both off = everything goes through. The source type (book,
 * quote...) is filtered within each topic, not here.
 *
 * It works only with `data-*` and `hidden`, never with classes: CSS Module
 * class names are hashed at build time (`_folder_1h04g_344`), so
 * `classList.add("folder")` from here would do nothing.
 *
 * Guarded by `data-init` on the root because it is re-run on
 * `astro:page-load`; unlike the dialog script, the listeners live on
 * elements that the view transition replaces, so they must be re-attached
 * — but only once per rendered root.
 */
export const initSourcesFilters = () => {
	const root = document.querySelector<HTMLElement>("[data-sources-root]");
	if (!root || root.dataset.init === "true") return;
	root.dataset.init = "true";

	const cells = [...root.querySelectorAll<HTMLElement>("[data-topic]")];
	const noResults = root.querySelector<HTMLElement>("[data-no-results]");
	const search = root.querySelector<HTMLInputElement>("[data-search]");

	let query = "";
	const kinds = new Set<string>();

	const apply = () => {
		let visible = 0;

		for (const cell of cells) {
			const okName = (cell.dataset.name ?? "").includes(query);
			const okKind = kinds.size === 0 || kinds.has(cell.dataset.kind ?? "");

			cell.hidden = !(okName && okKind);
			if (!cell.hidden) visible++;
		}

		if (noResults) noResults.hidden = visible > 0;
	};

	search?.addEventListener("input", () => {
		query = search.value.trim().toLowerCase();
		apply();
	});

	for (const btn of root.querySelectorAll<HTMLButtonElement>(
		"[data-filter-kind]",
	)) {
		btn.addEventListener("click", () => {
			const kind = btn.dataset.filterKind;
			if (!kind) return;

			const on = !kinds.has(kind);
			if (on) kinds.add(kind);
			else kinds.delete(kind);

			btn.setAttribute("aria-pressed", String(on));
			apply();
		});
	}
};
