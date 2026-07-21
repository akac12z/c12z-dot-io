/**
 * Source-type toggles inside a topic page (/behavior/fuentes/<topic>):
 * several at once, none = all.
 *
 * It does two things at the same time so that the pile and the viewer never
 * disagree: it hides the files whose type is not selected, and it marks
 * their slides with `data-off` so the viewer's slider skips them too (the
 * counter then reads "1 / 2" instead of "1 / 8").
 *
 * Same rules as the drawer filter: only `data-*` and `hidden` (CSS Module
 * classes are hashed), and guarded by `data-init` because it re-runs on
 * `astro:page-load`.
 */
export const initTopicFilters = () => {
	const root = document.querySelector<HTMLElement>("[data-topic-root]");
	if (!root || root.dataset.init === "true") return;
	root.dataset.init = "true";

	const items = [...root.querySelectorAll<HTMLLIElement>("[data-source-item]")];
	const slides = [...root.querySelectorAll<HTMLDivElement>("[data-slide]")];
	const types = new Set<string>();

	const apply = () => {
		for (const item of items) {
			const on = types.size === 0 || types.has(item.dataset.type ?? "");
			item.hidden = !on;
		}

		for (const slide of slides) {
			const on = types.size === 0 || types.has(slide.dataset.type ?? "");
			slide.toggleAttribute("data-off", !on);
		}
	};

	for (const btn of root.querySelectorAll<HTMLButtonElement>(
		"[data-filter-type]",
	)) {
		btn.addEventListener("click", () => {
			const type = btn.dataset.filterType;
			if (!type) return;

			const on = !types.has(type);
			if (on) types.add(type);
			else types.delete(type);

			btn.setAttribute("aria-pressed", String(on));
			apply();
		});
	}
};
