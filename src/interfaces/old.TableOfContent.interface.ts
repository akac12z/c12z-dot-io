interface Heading {
  slug: string;
  text: string;
  level?: number;
}

export interface TableOfContentsProps {
  headings: Heading[];
}
