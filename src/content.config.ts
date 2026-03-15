import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const contentSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  author: z.string().optional(),
  tag: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: contentSchema,
});

const intro = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/intro" }),
  schema: contentSchema,
});

export const collections = { blog, intro };
