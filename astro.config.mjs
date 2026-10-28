import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { satteri } from '@astrojs/markdown-satteri';
import { detailsBoxes } from './src/plugins/details-boxes.mjs';
import { labelParagraphs } from './src/plugins/label-paragraphs.mjs';
import { layoutRules } from './src/plugins/layout-rules.mjs';
import { typography } from './src/plugins/typography.mjs';
import { publishedArticlePaths } from './src/utils/sitemapArticles.mjs';

const SITE = 'https://sokefi.com';

export default defineConfig({
  site: SITE,
  base: '/',
  output: 'server',
  adapter: vercel(),
  // The sitemap lists the fixed pages by itself; article pages are made on request, so the
  // published ones are added here (drafts left out).
  integrations: [
    sitemap({ customPages: publishedArticlePaths().map((p) => new URL(p, SITE).toString()) }),
    mdx(),
  ],
  // No developer toolbar on local previews: it sat over the article text and read as part
  // of the page. (It never appears on the live site.)
  devToolbar: { enabled: false },
  // Old addresses that moved (Veronica, 2026-10-27): the pillar page now uses the British
  // spelling. A permanent (301) redirect keeps old links and bookmarks working.
  redirects: {
    '/the-uncommon-traveler': { status: 301, destination: '/the-uncommon-traveller' },
  },
  // Details boxes written to the Details Box Standard become <Details> components, bold
  // labels on their own line sit above their text, and article layouts are checked against
  // the layout rules (src/plugins/layout-rules.mjs).
  markdown: {
    processor: satteri({ mdastPlugins: [typography, detailsBoxes, labelParagraphs, layoutRules] }),
  },
});
