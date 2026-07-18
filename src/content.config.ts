import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import { isValidDateFormat } from "@/utils/validating-date.ts";

const essayCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/essay",
	}),
	schema: z.object({
		title: z.string().max(60),
		description: z.string().min(110).max(160),
		// essayImage: z.object({
		//   src: z.union([z.string(), z.string()]),
		//   alt: z.string(),
		// }),
		// keywords: z.array(z.string()),
		// publishDate: z.string().refine(isValidDateFormat, {
		//   message: "The date must be in the format: YYYY-MM-DD. Make sure you have written it in the correct format.",
		// }),
		// lastTimeEdited: z.string().refine(
		//   (val) => (val ? isValidDateFormat(val) : true), {
		//   message: "The date must be in the format: YYYY-MM-DD. Make sure you have written it in the correct format.",
		//   }).transform((val, ctx) => {
		//     const publishDate = ctx;
		//     return val ?? publishDate;
		//   }).optional(),
		// tags: z.array(z.string()),
		// language: z.enum(["es"]),
		// author: z.string().default("c12z"),
		// authorLink: z.string(),
		// readingTime: z.string(),
		// categories: z.array(z.string()),
		// status: z.boolean().default(true),
		// canonicalURL: z.string()
		// isDraft: z.boolean().default(true).optional(),
		// isIndexed: z.boolean().default(false),
	}),
});

const libraryCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/library",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(60),
			cover: z.object({
				src: image(),
				alt: z.string(),
			}),
			titleTag: z.string().max(60),
			description: z.string().min(110).max(160),
			abstract: z.string().min(250).max(410),
			backlog: z.enum(["wip", "upload"]),
			quote: z.string().max(150),
			category: z.enum([
				"health",
				"product",
				"culture",
				"psychology",
				"economics",
				"creativity",
				"philosophy",
				"other",
			]),
			score: z
				.number()
				.min(1, {
					message: "The minimum score value is 1",
				})
				.max(5, {
					message: "The maximum score value is 5",
				})
				.int("The numbers must be integer"),
			publishDate: z.string().refine(isValidDateFormat),
			lastTimeEdited: z
				.string()
				.refine(isValidDateFormat)
				.refine((val) => (val ? isValidDateFormat(val) : true))
				.transform((val, ctx) => {
					const publishDate = ctx;
					return val ?? publishDate;
				})
				.optional(),
			authors: z.union([
				z.object({
					name: z.string(),
					link: z
						.string()
						.refine(
							(link) =>
								link.startsWith("https://www.") || link.startsWith("https://"),
							{
								message:
									"The author's URL must start with 'https://www.' or 'https://'",
							},
						),
				}),
				z.array(
					z.object({
						name: z.string(),
						link: z
							.string()
							.refine(
								(link) =>
									link.startsWith("https://www.") ||
									link.startsWith("https://"),
								{
									message:
										"The author's URL must start with 'https://www.' or 'https://'",
								},
							),
					}),
				),
			]),
			readingTime: z.number().optional(),
			keywords: z.array(z.string()),
		}),
});

const projectCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/project",
	}),
	schema: ({ image }) =>
		z.object({
			projectTitle: z.string().max(80),
			projectDescription: z.string().min(110).max(160),
			projectUrl: z.string().startsWith("https://"),
			cover: z.object({
				src: image(),
				alt: z.string(),
			}),
			why: z.string().max(20),
			backlog: z.enum(["wip", "upload"]),
			publishDate: z.string().refine(isValidDateFormat),
			lastTimeEdited: z
				.string()
				.refine(isValidDateFormat)
				.refine((val) => (val ? isValidDateFormat(val) : true))
				.transform((val, ctx) => {
					const publishDate = ctx;
					return val ?? publishDate;
				})
				.optional(),
			keywords: z.array(z.string()),
			styleClass: z.string().optional(),
		}),
});

/**
 * Sources cited in a post (bias or mental model). They are located in the
 * frontmatter of the post itself—no duplicate content—and are
 * displayed as what they are (book, video, quote...) in /behavior/sources
 * and in the "Behind This Post" block on the post detail page.
 */
const sourceSchema = z.object({
	// in a `quote` the title is the fragment itself
	title: z.string().max(300),
	type: z.enum([
		"libro",
		"articulo",
		"paper",
		"video",
		"podcast",
		"charla",
		"web",
		"cita",
	]),
	author: z.string().optional(),
	url: z.string().optional(),
	date: z.string().refine(isValidDateFormat).optional(),
	excerpt: z.string().max(300).optional(),
});

const biasCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/bias",
	}),
	schema: ({ image }) =>
		z
			.object({
				biasName: z.string().max(80),
				cover: z.object({
					src: image().optional(),
					alt: z.string(),
				}),
				titleTag: z.string().max(60),
				description: z.string().min(110).max(160),
				biasQuestion: z.string().min(50).max(120),
				backlog: z.enum(["wip", "upload"]),
				publishDate: z.string().refine(isValidDateFormat),
				lastTimeEdited: z
					.string()
					.refine(isValidDateFormat)
					.refine((val) => (val ? isValidDateFormat(val) : true))
					.transform((val, ctx) => {
						const publishDate = ctx;
						return val ?? publishDate;
					})
					.optional(),
				keywords: z.array(z.string()),
				readingTime: z.number().optional(),
				category: z.array(
					z.enum(["velocidad", "memoria", "percepción", "contexto", "juicio"]),
				),
				sources: z.array(sourceSchema).default([]),
			})
			.refine(
				(data) => {
					if (data.lastTimeEdited && data.publishDate) {
						const publishDateObj = new Date(data.publishDate);
						const lastTimeEditedObj = new Date(data.lastTimeEdited);
						return lastTimeEditedObj >= publishDateObj;
					}
					return true; // If `lastTimeEdited` is missing, the validation isn't applied in the frontmatter, but when the component is created, it's added to the `{book/bias/essay}SEO.astro` component for the meta tags.
				},
				{
					message:
						"The field { lastTimeEdited } cannot be earlier than { publishDate }.",
					path: ["lastTimeEdited"], // Indicates the field where the error is displayed
				},
			),
});

const mentalModelsCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/mental-models",
	}),
	schema: ({ image }) =>
		z
			.object({
				modelName: z.string().max(80),
				cover: z.object({
					src: image().optional(),
					alt: z.string(),
				}),
				titleTag: z.string().max(60),
				description: z.string().min(110).max(160),
				modelQuestion: z.string().min(50).max(120),
				backlog: z.enum(["wip", "upload"]),
				publishDate: z.string().refine(isValidDateFormat),
				lastTimeEdited: z
					.string()
					.refine(isValidDateFormat)
					.refine((val) => (val ? isValidDateFormat(val) : true))
					.transform((val, ctx) => {
						const publishDate = ctx;
						return val ?? publishDate;
					})
					.optional(),
				keywords: z.array(z.string()),
				readingTime: z.number().optional(),
				sources: z.array(sourceSchema).default([]),
			})
			.refine(
				(data) => {
					if (data.lastTimeEdited && data.publishDate) {
						const publishDateObj = new Date(data.publishDate);
						const lastTimeEditedObj = new Date(data.lastTimeEdited);
						return lastTimeEditedObj >= publishDateObj;
					}
					return true;
				},
				{
					message:
						"The field { lastTimeEdited } cannot be earlier than { publishDate }.",
					path: ["lastTimeEdited"],
				},
			),
});

const notesCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/notes",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			excerpt: z.string().min(50).max(300),
			keywords: z.array(z.string()),
			publishDate: z.string().refine(isValidDateFormat),
			lastTimeEdited: z
				.string()
				.refine(isValidDateFormat)
				.refine((val) => (val ? isValidDateFormat(val) : true))
				.transform((val, ctx) => {
					const publishDate = ctx;
					return val ?? publishDate;
				})
				.optional(),
			sources: z
				.array(
					z.object({
						label: z.string(),
						url: z.string(),
					}),
				)
				.default([]),
			illustration: z
				.array(
					z.object({
						src: image(),
						alt: z.string(),
					}),
				)
				.default([]),
		}),
});

export const collections = {
	bias: biasCollection,
	library: libraryCollection,
	projects: projectCollection,
	notes: notesCollection,
	mentalModels: mentalModelsCollection,
};
// essay: essayCollection,
