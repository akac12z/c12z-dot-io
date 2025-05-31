import type { PageKeywords } from "@interfaces/keywords.interface";

export default function processKeywords(
  pageKeywords: PageKeywords
): PageKeywords {
  const uniqueKeywords = Array.from(
    new Set(
      pageKeywords.keywords.map((kw) =>
        kw.toLowerCase().trim().replace(/\s+/g, "-")
      )
    )
  );
  return { keywords: uniqueKeywords };
}
