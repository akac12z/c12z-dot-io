/**
 * Turns the DD/MM/YYYY dates of the frontmatter into a Date, so they can be
 * sorted. `new Date("02/06/2026")` would read that as month/day (US order),
 * hence the manual split.
 *
 * The format itself is enforced at build time by `isValidDateFormat` in the
 * Zod schemas, so no defensive parsing is needed here.
 */
export const parseSourceDate = (dateString: string): Date => {
	const [day, month, year] = dateString.split("/").map(Number);
	return new Date(year, month - 1, day);
};
