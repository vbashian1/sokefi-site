// Imports one handoff article into src/content/articles/<date>-<slug>/index.mdx.
//
//   node scripts/import-article.mjs <handoff file> [--date YYYY-MM-DD]
//
// Does the mechanical steps only:
//   - strips <!-- … --> editorial comments (not content; MDX can't parse them)
//   - maps the handoff fields onto the repo schema: authorSlug → author,
//     publishDate → date (the handoff placeholder 2026-00-00 needs --date), FAQ q/a →
//     question/answer
//   - writes .mdx (a READY_*.md file becomes .mdx so its <Gallery>/boxes work)
//   - removes the retired Essentials lead-ins ("**Staying connected.** …" / "**Insurance.** …")
//     directly above a Details box, per the Details Box Standard
//   - checks every Details box against the Details Box Standard (same rules as the site
//     build, src/plugins/details-boxes.mjs) and stops on any old-format box
//   - reports frontmatter fields the schema doesn't read
// Images, interest tags and box wording are decisions for Veronica and are not touched.
import fs from 'node:fs';
import path from 'node:path';
import { parseDetailsBox } from '../src/plugins/details-boxes.mjs';
import { removeEssentialsLeadIns } from './essentials-lead-ins.mjs';

const [source, ...args] = process.argv.slice(2);
if (!source) {
  console.error('Usage: node scripts/import-article.mjs <handoff file> [--date YYYY-MM-DD]');
  process.exit(1);
}
const dateArg = args[args.indexOf('--date') + 1];
const problems = [];

let text = fs.readFileSync(source, 'utf8').replace(/\r\n/g, '\n');
text = text.replace(/<!--[\s\S]*?-->\n?/g, '').trimStart();

const end = text.indexOf('\n---\n', 4);
if (!text.startsWith('---\n') || end < 0) throw new Error('No frontmatter block found');
let frontmatter = text.slice(0, end + 5);
let body = text.slice(end + 5);

// --- frontmatter field mapping ---
frontmatter = frontmatter.replace(/^authorSlug:/m, 'author:');
const date = dateArg ?? frontmatter.match(/^publishDate:\s*(\d{4}-\d{2}-\d{2})/m)?.[1];
if (!date || !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
  problems.push('publishDate is not a real date (handoff placeholder?) — pass --date YYYY-MM-DD');
}
frontmatter = frontmatter.replace(/^publishDate:.*$/m, `date: ${date ?? 'YYYY-MM-DD'}`);
frontmatter = frontmatter
  .replace(/^ {2}- q: /gm, '  - question: ')
  .replace(/^ {4}a: /gm, '    answer: ');

const SCHEMA_FIELDS = new Set(
  'title date description metaDescription author pillar eyebrow byline dek summary updatedDate thumbnail heroImage gallery column secondaryPillar series featured firsthand featuredPriority featuredDate crossPostToSubstack cover tags region interest faq affiliateDisclosure'.split(
    ' ',
  ),
);
const unread = [...frontmatter.matchAll(/^([A-Za-z]+):/gm)]
  .map((m) => m[1])
  .filter((key) => !SCHEMA_FIELDS.has(key));

// --- Essentials lead-ins (retired by the Details Box Standard) ---
const leadIns = removeEssentialsLeadIns(body);
body = leadIns.body;

// --- Details boxes ---
const lines = body.split('\n');
let boxes = 0;
lines.forEach((line, i) => {
  const heading = line.trim().replace(/^\*\*|\*\*$/g, '');
  if (/^\[THE DETAILS\s*[—–-]/i.test(heading)) {
    problems.push(
      `body line ${i + 1}: old-format box "${line.trim()}" — rewrite it in the Details Box Standard`,
    );
  } else if (heading.toUpperCase() === '[THE DETAILS]') {
    const fieldLines = [];
    for (let j = i + 1; j < lines.length && lines[j].trim(); j++) {
      fieldLines.push(lines[j].trim().replace(/^[*_]|[*_]$/g, ''));
    }
    try {
      parseDetailsBox(fieldLines);
      boxes++;
    } catch (error) {
      problems.push(`body line ${i + 1}: Details box — ${error.message}`);
    }
  }
});

// --- write ---
const slug = (
  frontmatter.match(/^slug:\s*"?\/?articles\/([^/"]+)/m)?.[1] ??
  path
    .basename(source)
    .replace(/^READY_/, '')
    .replace(/\.mdx?$/, '')
).trim();
const folder = path.join('src/content/articles', `${date ?? 'YYYY-MM-DD'}-${slug}`);

if (problems.length) {
  console.error(`Not imported — fix these first (${source}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
fs.mkdirSync(folder, { recursive: true });
fs.writeFileSync(path.join(folder, 'index.mdx'), frontmatter + body);
console.log(`Imported → ${folder}/index.mdx`);
console.log(`  Details boxes: ${boxes} (all match the standard)`);
for (const removed of leadIns.removed) console.log(`  Removed Essentials lead-in: ${removed}`);
if (unread.length)
  console.log(`  Frontmatter fields the schema doesn't read: ${unread.join(', ')}`);
console.log('  Still to do by hand: images (placement map), interest tags, wording review.');
