// Pages the sitemap tool can't find by itself, because they're made on request (Veronica,
// 2026-10-28): the published articles (drafts, `draft: true`, left out), the author pages
// and the edition pages. Used by astro.config.mjs. Addresses follow the site's own rules:
// an article is its folder name without the date prefix (as in src/content.config.ts), an
// author page is /authors/<file name> unless the author has `hasOwnPage: false`, and an
// edition is /the-sokefi-edit/<folder name>.
import fs from 'node:fs';
import path from 'node:path';

const CONTENT = path.join(process.cwd(), 'src', 'content');
const DATE_FOLDER_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

const frontmatter = (file) => fs.readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '';

/** Folders under src/content/<collection> with an index.md(x), as [name, file]. */
const entryFolders = (collection) =>
  fs
    .readdirSync(path.join(CONTENT, collection), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const file = ['index.mdx', 'index.md']
        .map((name) => path.join(CONTENT, collection, entry.name, name))
        .find((candidate) => fs.existsSync(candidate));
      return file ? [[entry.name, file]] : [];
    });

export const publishedArticlePaths = () =>
  entryFolders('articles')
    .filter(([, file]) => !/^draft:\s*true\b/m.test(frontmatter(file)))
    .map(([name]) => `/articles/${name.replace(DATE_FOLDER_PREFIX, '')}/`);

export const authorPaths = () =>
  fs
    .readdirSync(path.join(CONTENT, 'authors'))
    .filter((name) => name.endsWith('.md'))
    .filter(
      (name) => !/^hasOwnPage:\s*false\b/m.test(frontmatter(path.join(CONTENT, 'authors', name))),
    )
    .map((name) => `/authors/${name.replace(/\.md$/, '')}`);

export const editionPaths = () =>
  entryFolders('editions').map(([name]) => `/the-sokefi-edit/${name}`);

export const sitemapPagePaths = () => [
  ...publishedArticlePaths(),
  ...authorPaths(),
  ...editionPaths(),
];
