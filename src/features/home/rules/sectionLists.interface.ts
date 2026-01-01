export interface SectionItem {
  text: string;
  href: string;
}

export interface Section {
  href: string;
  style: string;
  label: string;
  description: string;
  items: SectionItem[];
}
