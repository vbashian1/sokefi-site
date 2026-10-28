/**
 * Not-yet-published articles (`draft: true`, Veronica 2026-10-28). On the live site a draft
 * doesn't exist: its page is "not found" and it's left out of every listing, edition and the
 * sitemap. Local previews (astro dev) show drafts, so they can be checked before publishing.
 */
import type { CollectionEntry } from 'astro:content';

export const isLive = (article: CollectionEntry<'articles'>) =>
  import.meta.env.DEV || !article.data.draft;
