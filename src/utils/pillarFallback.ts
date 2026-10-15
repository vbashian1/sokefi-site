import type { ImageMetadata } from 'astro';

import awenvida from '../assets/images/fallback-awenvida.webp';
import beyondTheGuidebook from '../assets/images/fallback-beyond-the-guidebook.webp';
import reservationForOne from '../assets/images/fallback-reservation-for-one.webp';
import theUncommonTraveller from '../assets/images/fallback-the-uncommon-traveller.webp';

/**
 * Fallback thumbnail per pillar, used when an article sets no `thumbnail`.
 *
 * Keys are normalised (lowercased, spaces to hyphens) because the schema accepts
 * each pillar in two shapes — slug (`beyond-the-guidebook`) and display
 * (`Beyond the Guidebook`). See src/content.config.ts.
 */
const PILLAR_FALLBACKS: Record<string, ImageMetadata> = {
  awenvida,
  'beyond-the-guidebook': beyondTheGuidebook,
  'reservation-for-one': reservationForOne,
  'the-uncommon-traveller': theUncommonTraveller,
};

const toKey = (pillar?: string): string => (pillar ?? '').trim().toLowerCase().replace(/\s+/g, '-');

export const getPillarFallback = (pillar?: string): ImageMetadata | null =>
  PILLAR_FALLBACKS[toKey(pillar)] ?? null;

/**
 * Resolves the thumbnail for an article card: the article's own thumbnail when it
 * has one, otherwise the fallback for its pillar. Returns null when neither exists,
 * so callers can skip the <img> rather than render a broken one.
 */
export const getThumbnailSrc = (article: {
  data: { thumbnail?: ImageMetadata | string; pillar?: string };
}): string | null => {
  const thumbnail = article.data.thumbnail;
  if (typeof thumbnail === 'string') return thumbnail;
  if (thumbnail?.src) return thumbnail.src;
  return getPillarFallback(article.data.pillar)?.src ?? null;
};
