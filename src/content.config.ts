import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Article folders are named e.g. `2026-08-31-blues-highway/` for chronological browsing,
// but URLs stay slug-only (/articles/blues-highway) — this strips the date prefix when
// deriving the entry id, instead of Astro's default folder-name-as-id behavior.
const DATE_FOLDER_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/** A focal point "across% down%", each 0–100%, e.g. "50% 20%". Used as CSS object-position. */
const focusPoint = z
  .string()
  .regex(
    /^(100|[1-9]?\d)% (100|[1-9]?\d)%$/,
    'Focus must be "across% down%", each 0–100%, e.g. "50% 20%"',
  );

/** Zoom around the focal point: 1 = the photo as cropped to fit, up to 4. */
const zoomLevel = z.number().min(1).max(4);

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
      dek: z.string().default(''),
      // GEO summary — metadata only, never rendered on the page. It feeds the
      // article's structured data (description/abstract).
      summary: z.string().optional(),
      updatedDate: z.coerce.date().optional(),
      thumbnail: image().optional(),
      heroImage: image().optional(),
      // Framing: the point of the photo to keep in view when a placement crops it, as
      // "across% down%" (e.g. "50% 20%"). Hero (article banner) and thumbnail (article
      // cards) are framed independently; without a value the browser centre-crops.
      // Zoom enlarges the photo around the focal point (1 = none), still from the original.
      heroFocus: focusPoint.optional(),
      heroZoom: zoomLevel.optional(),
      thumbnailFocus: focusPoint.optional(),
      thumbnailZoom: zoomLevel.optional(),
      // Layout: a drop cap on the first paragraph of the piece (off unless set).
      dropCap: z.boolean().default(false),
      // Pull-quote lines from the article file; each also appears in the body text.
      callouts: z.array(z.string()).optional(),
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
            'Long-haul long weekend',
            'Road trip',
            'Slow travel',
            'Historical sites',
            'Museums',
            'Bucket list',
            'Natural wonders',
            'Beaches',
            'Coastal',
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
