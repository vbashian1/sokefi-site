// The published articles' addresses for the sitemap (Veronica, 2026-10-28). Article pages
// are made on request, so the sitemap tool can't find them by itself; this lists them from
// the article folders, leaving out drafts (`draft: true`, not yet published). Used by
// astro.config.mjs. An article's address is its folder name without the date prefix, the
// same rule as src/content.config.ts.
import fs from 'node:fs';
import path from 'node:path';

const ARTICLES = path.join(process.cwd(), 'src', 'content', 'articles');
const DATE_FOLDER_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

export const publishedArticlePaths = () =>
  fs
    .readdirSync(ARTICLES, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const file = ['index.mdx', 'index.md']
        .map((name) => path.join(ARTICLES, entry.name, name))
        .find((candidate) => fs.existsSync(candidate));
      if (!file) return [];
      const frontmatter = fs.readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '';
      if (/^draft:\s*true\b/m.test(frontmatter)) return [];
      return [`/articles/${entry.name.replace(DATE_FOLDER_PREFIX, '')}/`];
    });
