import { Marked } from 'marked';
import { markedSmartypants } from 'marked-smartypants';
import { fixTypography } from '../plugins/typography.mjs';

// A dedicated instance rather than the shared singleton, so page code can never be
// affected by options set elsewhere. GFM matches the flavour used for body copy;
// `breaks` stays off so a soft-wrapped YAML summary is still one paragraph.
//
// Smartypants matches the typographic replacement Astro applies to body copy, so a
// summary and the narrative directly beneath it don't show different punctuation
// styles on the same page. marked dropped this in v5, hence the extension.
const markdown = new Marked({ gfm: true, breaks: false }).use(markedSmartypants());

/**
 * Renders a GEO summary written in basic markdown (bullets, bold, links) to HTML.
 * Returns '' for an absent or blank field, which is what suppresses the block and
 * its dividing rule on the article page.
 */
export const renderSummaryHtml = async (source?: string): Promise<string> => {
  const trimmed = (source ?? '').trim();
  if (!trimmed) return '';

  return (await markdown.parse(fixTypography(trimmed))).trim();
};

/**
 * Renders one line of basic markdown (links, bold, italics) to inline HTML, with the same
 * typographic quotes and dashes as body copy. Used for FAQ questions and answers, which can
 * carry links (e.g. Blues Highway's festival links) and would otherwise show raw markdown.
 */
export const renderInlineHtml = async (source?: string): Promise<string> =>
  (await markdown.parseInline(fixTypography((source ?? '').trim()))).trim();

const NAMED_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&amp;': '&',
};

const BLOCK_END = /<\/(p|li|h[1-6]|blockquote|figcaption|td|th)>/gi;

// Sentinel marking a block boundary. Built from a char code rather than written
// as a literal so it can't be mistaken for — or collapsed into — ordinary
// whitespace in the copy, which would punctuate every word instead of every block.
const BOUNDARY = String.fromCharCode(0);

/**
 * Flattens summary HTML to a single plain-text string for structured data.
 *
 * Block elements become sentence breaks and unpunctuated fragments gain a full
 * stop, so a bulleted summary reads as prose to a crawler rather than as words
 * run together. Markup, list markers, and link URLs are all dropped.
 */
export const summaryToPlainText = (html: string): string =>
  html
    .replace(BLOCK_END, BOUNDARY)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&[a-z]+;/gi, (entity) => NAMED_ENTITIES[entity.toLowerCase()] ?? entity)
    .split(BOUNDARY)
    .map((chunk) => chunk.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((chunk) => (/[.!?…:;,]$/.test(chunk) ? chunk : `${chunk}.`))
    .join(' ')
    .trim();
