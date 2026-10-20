import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { satteri } from '@astrojs/markdown-satteri';
import { detailsBoxes } from './src/plugins/details-boxes.mjs';
import { labelParagraphs } from './src/plugins/label-paragraphs.mjs';
import { layoutRules } from './src/plugins/layout-rules.mjs';

export default defineConfig({
  site: 'https://sokefi.com',
  base: '/',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap(), mdx()],
  // No developer toolbar on local previews: it sat over the article text and read as part
  // of the page. (It never appears on the live site.)
  devToolbar: { enabled: false },
  // Details boxes written to the Details Box Standard become <Details> components, bold
  // labels on their own line sit above their text, and article layouts are checked against
  // the layout rules (src/plugins/layout-rules.mjs).
  markdown: {
    processor: satteri({ mdastPlugins: [detailsBoxes, labelParagraphs, layoutRules] }),
  },
});
