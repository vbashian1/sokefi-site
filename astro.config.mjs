import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://sokefi.com',
  base: '/',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap(), mdx()],
});
