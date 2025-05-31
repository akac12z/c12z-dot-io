import { defineCollection, z } from "astro:content";
import { isValidDateFormat } from "@utils/validatingDate";
import { glob } from "astro/loaders";
// import { SITE_DEFAULT_CONFIG } from "@/global/siteInfo";

/**
 * ? Los slug: z.string(), en las colecciones dan error porque ya los está creando astro por defecto. Por ende, al desestructurarlo te dará error si los tienes.
 * Las comento para que no me den errores
 */

const essayCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/essay",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // essayImage: z.object({
    //   src: z.union([z.string().url(), z.string()]),
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
    // author: z.string().default("mrjark"),
    // authorLink: z.string(),
    // readingTime: z.string(),
    // categories: z.array(z.string()),
    // status: z.boolean().default(true),
    // canonicalURL: z.string().url(),
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
      titleTag: z.string().max(85),
      description: z.string().min(60).max(140),
      backlog: z.enum(["reading", "upload", "uploading"]),
      quote: z.string().max(150),
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
      tags: z.array(z.string()).optional(),
      language: z.enum(["es", "en"]),
      authors: z.union([
        z.object({
          name: z.string(),
          link: z
            .string()
            .url()
            .refine(
              (link) =>
                link.startsWith("https://www.") || link.startsWith("https://"),
              {
                message:
                  "The author's URL must start with 'https://www.' or 'https://'",
              }
            ),
        }),
        z.array(
          z.object({
            name: z.string(),
            link: z
              .string()
              .url()
              .refine(
                (link) =>
                  link.startsWith("https://www.") ||
                  link.startsWith("https://"),
                {
                  message:
                    "The author's URL must start with 'https://www.' or 'https://'",
                }
              ),
          })
        ),
      ]),
      readingTime: z.number().optional(),
      keywords: z.array(z.string()),
      authorLink: z.string().optional(),
      isDraft: z.boolean().default(true).optional(),
      buyItOnAmazon: z
        .object({
          spain: z
            .string()
            .url()
            .refine(
              (url) =>
                url.startsWith("https://www.amazon.es") ||
                url.startsWith("https://amazon.es"),
              {
                message:
                  "The URL must start with 'https://www.amazon.es' or 'https://amazon.es'.",
              }
            ),
          usa: z
            .string()
            .url()
            .refine(
              (url) =>
                url.startsWith("https://www.amazon.com") ||
                url.startsWith("https://amazon.com"),
              {
                message:
                  "The URL must start with 'https://www.amazon.com  or 'https://amazon.com'.",
              }
            )
            .optional(),
        })
        .optional(),
    }),
});

const biasCollection = defineCollection({
  // type: "content",
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/bias",
  }),
  schema: ({ image }) =>
    z
      .object({
        biasName: z.string().max(80),
        biasID: z.string(),
        cover: z.object({
          src: image(),
          alt: z.string(),
        }),
        titleTag: z.string().max(85),
        description: z.string().min(60).max(140),
        biasQuestion: z.string().max(120),
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
        tags: z.array(z.string()),
        language: z.enum(["es"]),
        keywords: z.array(z.string()),
        relatedLinks: z
          .array(
            z.object({
              label: z.string(),
              url: z.string().url(),
            })
          )
          .optional(),
        readingTime: z.number().optional(),
        category: z.array(
          z.enum(["velocidad", "memoria", "percepción", "contexto", "juicio"])
        ),
      })
      .refine(
        (data) => {
          if (data.lastTimeEdited && data.publishDate) {
            const publishDateObj = new Date(data.publishDate);
            const lastTimeEditedObj = new Date(data.lastTimeEdited);
            return lastTimeEditedObj >= publishDateObj;
          }
          return true; // Si no hay lastTimeEdited, no aplica la validación en el frontmatter pero cuando se crea el componente, se le añade en el componente del {blog/bias/essay}SEO.astro para los metatags
        },
        {
          message:
            "The field { lastTimeEdited } cannot be earlier than { publishDate }.",
          path: ["lastTimeEdited"], // Indica el campo donde se muestra el error
        }
      ),
});

export const collections = {
  bias: biasCollection,
  essay: essayCollection,
  library: libraryCollection,
};
