/**
 * The folder viewer: opens a folder's native <dialog> and navigates through
 * its sources using a slider
 *
 * Every slide is already in the HTML printed by SourceSheets. this only
 * flips which one is `hidden` and rewrites the counter, the tab and the
 * date from the active slide's `data-*`.
 */

/**
 * An excerpt longer than the sheet is read by scrolling inside it. This only
 * writes what CSS cannot know: on which side there is more text (`data-fade`)
 * and whether it is worth reaching with the keyboard (`tabindex`).
 */
const syncExcerpt = (excerpt: HTMLElement) => {
	// 1px of slack: with fractional heights the end of the scroll never lands
	// on an exact number
	const above = excerpt.scrollTop > 1;
	const below =
		excerpt.scrollTop + excerpt.clientHeight < excerpt.scrollHeight - 1;

	if (above && below) excerpt.dataset.fade = "both";
	else if (below) excerpt.dataset.fade = "bottom";
	else if (above) excerpt.dataset.fade = "top";
	else delete excerpt.dataset.fade;

	// only a scrollable region is focusable: otherwise it would be one more
	// stop in the tab order with nothing to do there
	if (above || below) excerpt.tabIndex = 0;
	else excerpt.removeAttribute("tabindex");
};

/** the excerpt of the slide being shown, already laid out */
const syncActiveExcerpt = (dialog: HTMLDialogElement) => {
	const excerpt = dialog.querySelector<HTMLElement>(
		"[data-slide]:not([hidden]) [data-excerpt]",
	);
	if (excerpt) syncExcerpt(excerpt);
};

/** navigable slides: those that the type filter has not excluded */
const openSlides = (dialog: HTMLDialogElement) => [
	...dialog.querySelectorAll<HTMLElement>("[data-slide]:not([data-off])"),
];

const show = (dialog: HTMLDialogElement, index: number) => {
	const order = openSlides(dialog).map((s) => Number(s.dataset.slide));
	if (order.length === 0) return;

	// if the requested slide is filtered out, start with the first one
	const active = order.includes(index) ? index : order[0];

	let activeSlide: HTMLElement | null = null;
	for (const slide of dialog.querySelectorAll<HTMLElement>("[data-slide]")) {
		slide.hidden = Number(slide.dataset.slide) !== active;
		if (!slide.hidden) activeSlide = slide;
	}
	dialog.dataset.active = String(active);

	const counter = dialog.querySelector<HTMLElement>("[data-counter]");
	if (counter) {
		counter.textContent = `${order.indexOf(active) + 1} / ${order.length}`;
	}

	// the tab (type) and the date in the header are from the active sheet
	const tab = dialog.querySelector<HTMLSpanElement>("[data-sheet-type]");
	if (tab && activeSlide) {
		tab.textContent = activeSlide.dataset.typeLabel ?? "";
	}

	const date = dialog.querySelector<HTMLTimeElement>("[data-sheet-date]");
	if (date && activeSlide) {
		date.textContent = activeSlide.dataset.date ?? "";
		date.hidden = !activeSlide.dataset.date;
	}

	// every source is read from the top of its excerpt, not from where it was
	// left the last time it was seen
	const excerpt = activeSlide?.querySelector<HTMLElement>("[data-excerpt]");
	if (excerpt) {
		excerpt.scrollTop = 0;
		syncExcerpt(excerpt);
	}

	// with only one visible source, there's nothing to go through
	const nav =
		dialog.querySelector<HTMLButtonElement>(
			"[data-folder-prev]",
		)?.parentElement;
	if (nav) nav.hidden = order.length < 2;
};

const step = (dialog: HTMLDialogElement, delta: number) => {
	const order = openSlides(dialog).map((s) => Number(s.dataset.slide));
	if (order.length === 0) return;

	const current = Number(dialog.dataset.active ?? order[0]);
	const pos = order.indexOf(current);
	// cyclical: from the last one back to the first
	show(dialog, order[(pos + delta + order.length) % order.length]);
};

/**
 * Delegated to `document`, which survives view transitions: it only needs to
 * be registered once, hence the `foldersInit` flag. Re-registering it on
 * `astro:page-load` would fire every handler twice per click.
 */
export const initFolderDialog = () => {
	if (document.documentElement.dataset.foldersInit === "true") return;
	document.documentElement.dataset.foldersInit = "true";

	document.addEventListener("click", (event) => {
		const target = event.target as HTMLElement;

		const opener = target.closest<HTMLButtonElement>("[data-folder-open]");
		if (opener) {
			const dialog = document.getElementById(
				opener.dataset.folderOpen as string,
			) as HTMLDialogElement | null;
			if (!dialog) return;
			show(dialog, Number(opener.dataset.index ?? 0));
			dialog.showModal();
			// only now does the sheet have a size: with the dialog closed
			// everything measures 0 and no excerpt looks scrollable
			syncActiveExcerpt(dialog);
			return;
		}

		const dialog = target.closest<HTMLDialogElement>("[data-folder-dialog]");
		if (!dialog) return;

		if (target.closest("[data-folder-close]")) dialog.close();
		else if (target.closest("[data-folder-next]")) step(dialog, 1);
		else if (target.closest("[data-folder-prev]")) step(dialog, -1);
		// Clicking on the backdrop (the dialog box itself) closes it
		else if (target === dialog) dialog.close();
	});

	document.addEventListener("keydown", (event) => {
		const dialog = document.querySelector<HTMLDialogElement>(
			"[data-folder-dialog][open]",
		);
		if (!dialog) return;

		if (event.key === "ArrowRight") step(dialog, 1);
		else if (event.key === "ArrowLeft") step(dialog, -1);
	});

	// `scroll` does not bubble: it is caught on the way down (capture)
	document.addEventListener(
		"scroll",
		(event) => {
			const excerpt = event.target as HTMLElement;
			if (excerpt?.dataset?.excerpt !== undefined) syncExcerpt(excerpt);
		},
		true,
	);

	// resizing the window changes how much text fits: what was cut may no
	// longer be, and the other way round
	window.addEventListener("resize", () => {
		const dialog = document.querySelector<HTMLDialogElement>(
			"[data-folder-dialog][open]",
		);
		if (dialog) syncActiveExcerpt(dialog);
	});
};
