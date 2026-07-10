import { defineCollection, reference, z } from 'astro:content';

const authors = defineCollection({
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    email: z.string().email().optional(),
    pillars: z.array(
      z.enum(['Beyond the Guidebook', 'The Uncommon Traveller', 'Reservation for One', 'Awenvida']),
    ),
    column: z.enum(['Musings from the Corner Office', 'Health/Vitality', "Jake's Take"]).optional(),
    shortBio: z.string(),
    longBio: z.string().optional(),
    firstPersonBio: z.string().optional(),
    voiceNotes: z.string().optional(),
    recurringDevice: z.string().optional(),
    photo: z.string().optional(),
    bioReviewStatus: z.enum(['draft', 'review', 'published']).default('draft'),
  }),
});

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    metaDescription: z.string(),
    author: reference('authors'),
    pillar: z.enum([
      'Beyond the Guidebook',
      'The Uncommon Traveller',
      'Reservation for One',
      'Awenvida',
    ]),
    column: z.enum(['Musings from the Corner Office', 'Health/Vitality', "Jake's Take"]).optional(),
    secondaryPillar: z
      .enum(['Beyond the Guidebook', 'The Uncommon Traveller', 'Reservation for One', 'Awenvida'])
      .optional(),
    series: z.string().optional(),
    featured: z.boolean().default(false),
    featuredPriority: z.number().int().positive().optional(),
    featuredDate: z.coerce.date().optional(),
    crossPostToSubstack: z.boolean().default(false),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  authors,
  articles,
};
