import type { CollectionEntry } from 'astro:content';

type Article = CollectionEntry<'articles'>;

const time = (article: Article) => {
  const raw = article.data.updatedDate ?? article.data.date;
  return raw ? new Date(raw).getTime() : 0;
};

/**
 * The order articles are listed in everywhere (pillar pages, author pages, editions): newest
 * first; articles with the same date by `launchOrder` (the launch articles, which share one
 * placeholder date — Veronica, 2026-10-27), then by title. A newer article always comes first.
 */
export const compareArticles = (a: Article, b: Article): number =>
  time(b) - time(a) ||
  (a.data.launchOrder ?? Number.MAX_SAFE_INTEGER) -
    (b.data.launchOrder ?? Number.MAX_SAFE_INTEGER) ||
  a.data.title.localeCompare(b.data.title);
