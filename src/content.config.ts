import { z, defineCollection } from 'astro:content';

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    // Accept strings in frontmatter and coerce to Date
    date: z.coerce.date(),
    description: z.string().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  articles,
};
