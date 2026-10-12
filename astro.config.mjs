import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { satteri } from '@astrojs/markdown-satteri';
import { detailsBoxes } from './src/plugins/details-boxes.mjs';

export default defineConfig({
  site: 'https://sokefi.com',
  base: '/',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap(), mdx()],
  // Details boxes written to the Details Box Standard become <Details> components.
  markdown: {
    processor: satteri({ mdastPlugins: [detailsBoxes] }),
  },
});
