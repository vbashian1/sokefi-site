import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Article folders are named e.g. `2026-08-31-blues-highway/` for chronological browsing,
// but URLs stay slug-only (/articles/blues-highway) — this strips the date prefix when
// deriving the entry id, instead of Astro's default folder-name-as-id behavior.
const DATE_FOLDER_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

const stripDatePrefixFromId = (entryPath: string) => {
  const withoutExt = entryPath.replace(/\.(md|mdx)$/, '');
  const withoutIndex = withoutExt.replace(/\/index$/, '');
  const segments = withoutIndex.split('/');
  segments[segments.length - 1] = segments[segments.length - 1].replace(DATE_FOLDER_PREFIX, '');
  return segments.join('/');
};

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      slug: z.string(),
      email: z.string().email().optional(),
      pillars: z.array(
        z.enum([
          'Beyond the Guidebook',
          'The Uncommon Traveller',
          'Reservation for One',
          'Awenvida',
        ]),
      ),
      homePillar: z
        .enum([
          'awenvida',
          'beyond-the-guidebook',
          'the-uncommon-traveller',
          'reservation-for-one',
          'Awenvida',
          'Beyond the Guidebook',
          'The Uncommon Traveller',
          'Reservation for One',
        ])
        .optional(),
      column: z
        .enum(['Musings from the Corner Office', 'Health/Vitality', "Jake's Take"])
        .optional(),
      shortBio: z.string(),
      longBio: z.string().optional(),
      firstPersonBio: z.string().optional(),
      voiceNotes: z.string().optional(),
      recurringDevice: z.string().optional(),
      photo: z.string().optional(),
      monogram: z.string().optional(),
      hasOwnPage: z.boolean().default(true),
      bioReviewStatus: z.enum(['draft', 'review', 'published']).default('draft'),
    }),
});

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/articles',
    generateId: ({ entry }) => stripDatePrefixFromId(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      metaDescription: z.string(),
      author: reference('authors'),
      pillar: z.enum([
        'awenvida',
        'beyond-the-guidebook',
        'the-uncommon-traveller',
        'reservation-for-one',
        'Awenvida',
        'Beyond the Guidebook',
        'The Uncommon Traveller',
        'Reservation for One',
      ]),
      eyebrow: z.string().optional(),
      byline: z.string().default(''),
      authorSlug: reference('authors').optional(),
      dek: z.string().default(''),
      // GEO summary shown above the narrative, separated from it by a rule.
      // Blank lines split it into paragraphs; omit the field for no summary and no rule.
      summary: z.string().optional(),
      updatedDate: z.coerce.date().optional(),
      thumbnail: image().optional(),
      heroImage: image().optional(),
      gallery: z.array(image()).optional(),
      column: z
        .enum(['Musings from the Corner Office', 'Health/Vitality', "Jake's Take"])
        .optional(),
      secondaryPillar: z
        .enum([
          'awenvida',
          'beyond-the-guidebook',
          'the-uncommon-traveller',
          'reservation-for-one',
          'Awenvida',
          'Beyond the Guidebook',
          'The Uncommon Traveller',
          'Reservation for One',
        ])
        .optional(),
      series: z.string().optional(),
      featured: z.boolean().default(false),
      firsthand: z.boolean().default(false),
      featuredPriority: z.number().int().positive().optional(),
      featuredDate: z.coerce.date().optional(),
      crossPostToSubstack: z.boolean().default(false),
      cover: z.string().optional(),
      tags: z.array(z.string()).default([]),
      region: z
        .array(
          z.enum([
            'Europe',
            'North America',
            'Central & South America',
            'Caribbean',
            'Africa',
            'Middle East',
            'Asia',
            'Oceania',
            'Polar',
          ]),
        )
        .optional(),
      interest: z
        .array(
          z.enum([
            'Solo travel',
            'Multigenerational travel',
            'Long weekend',
            'Road trip',
            'Slow travel',
          ]),
        )
        .optional(),
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .optional(),
      affiliateDisclosure: z.boolean().default(false),
    }),
});

export const collections = {
  authors,
  articles,
};
