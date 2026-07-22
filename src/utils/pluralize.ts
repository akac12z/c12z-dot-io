/**
 * Picks singular or plural for a quantity. In Spanish only 1 is singular:
 * 0 takes plural ("0 fuentes"), so the check is `=== 1` and never `> 1`.
 *
 * The plural defaults to adding an "s", which covers every label of the
 * feature (libros, citas, webs, podcasts...). When a word does not follow
 * that rule, pass it whole:
 *
 *   pluralize(2, "fuente")        // "fuentes"
 *   pluralize(1, "carpeta")       // "carpeta"
 *   pluralize(3, "papel", "papeles")
 *
 * It returns only the word, not the figure: several places print the two
 * apart so each can be styled on its own.
 */
export const pluralize = (
	quantity: number,
	singular: string,
	plural = `${singular}s`,
) => (quantity === 1 ? singular : plural);
