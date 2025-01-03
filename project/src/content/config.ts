import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    image: z.string().optional(),
    source: z.string(),
    sourceUrl: z.string().url(),
  }),
});

export const collections = { news };