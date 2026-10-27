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
      // The search-engine and browser-tab title, when it should differ from the page title
      // (e.g. "Tresco, Isles of Scilly — A Bygone-Era Escape | Sokéfi"). Shown with curly quotes.
      titleTag: z.string().optional(),
      // A line shown below the title (e.g. "Escape to Tresco"), above the dek.
      subtitle: z.string().optional(),
      // Words in the page title that must stay on one line at every width (e.g.
      // ["Tourist Dad"]). Only the article page's title; the text itself is unchanged.
      titleKeepTogether: z.array(z.string()).optional(),
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
      // Phones normally show the whole hero photo (no zoom); true keeps the zoomed crop there
      // too, for a photo whose edges shouldn't show (Tresco's plane-window aerial).
      heroZoomOnPhones: z.boolean().default(false),
      thumbnailFocus: focusPoint.optional(),
      thumbnailZoom: zoomLevel.optional(),
      // Layout: a drop cap on the first paragraph of the piece (off unless set).
      // true: drop cap on the first paragraph. 'first-section': on the first paragraph after
      // the first heading, for a piece that opens with a one-line lead-in (Blues Highway).
      // 'second-paragraph': on the second paragraph, when the first is better left plain.
      dropCap: z
        .union([z.boolean(), z.literal('first-section'), z.literal('second-paragraph')])
        .default(false),
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
      // false: left out of every article listing (author pages, pillar feeds, home page,
      // featured). The article's own page still exists.
      listed: z.boolean().default(true),
      featured: z.boolean().default(false),
      // Fixed order among articles with the same date (the 15 launch articles share one
      // placeholder date). Lists sort newest first, then by this number (src/utils/articleOrder.ts).
      launchOrder: z.number().int().positive().optional(),
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

// The Sokéfi Edit (Veronica, 2026-10-27): one folder per edition, src/content/editions/<id>/
// index.md, where <id> is the address (/the-sokefi-edit/<id>). The body is the editor's
// letter, word for word. Adding an edition means adding one folder; articles don't change.
const editions = defineCollection({
  loader: glob({ pattern: '*/index.{md,mdx}', base: './src/content/editions' }),
  schema: ({ image }) =>
    z.object({
      /** e.g. "Edition 1 (Launch)" or "The October Edit". */
      title: z.string(),
      number: z.number().int().positive(),
      date: z.coerce.date(),
      /** The edition's "where are we" banner photo. */
      headerImage: image(),
      headerAlt: z.string(),
      headerFocus: focusPoint.optional(),
      headerZoom: zoomLevel.optional(),
      /** Optional small caption under the banner, e.g. "Laguna Beach  © Sokéfi" (per edition). */
      caption: z.string().optional(),
      standfirst: z.string(),
      valediction: z.string(),
      signature: image(),
      signatureAlt: z.string(),
      signedBy: z.string(),
      /** Every article in the edition; shown under "In this edition", grouped by pillar. */
      articles: z.array(reference('articles')).min(1),
      /** The two articles the homepage's Edit strip shows while this is the latest edition,
          chosen by hand (no rotation). `title` replaces the card title when a shorter one is
          wanted; the dek, photo and crop come from the article. */
      homepagePicks: z
        .array(z.object({ article: reference('articles'), title: z.string().optional() }))
        .max(2)
        .default([]),
    }),
});

export const collections = {
  authors,
  articles,
  editions,
};
