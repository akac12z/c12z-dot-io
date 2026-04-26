export interface SectionItem {
	text: string;
	href: string;
	meta?: string;
	tag?: string;
}

export interface Section {
	href: string;
	style: string;
	label: string;
	description: string;
	items: SectionItem[];
}
