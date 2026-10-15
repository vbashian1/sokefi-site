// Turns "Details" boxes written to the Sokéfi Details Box Standard
// (website_handoff_batch1/sokefi_details_box_standard.md) into <Details> components,
// so articles can be stored exactly as written. A box is one paragraph:
//
//   **[THE DETAILS]**
//   *Label: The tour*
//   *Headline: Saqqara and Giza Pyramids*
//   *Provider: GetYourGuide*
//   *Price: From $103 per person*
//   *Includes: …*
//   *Tip: …*
//   *Button: Book now*
//   *Link: /go/gyg-cairo-pyramids*
//
// Headline, Provider, Price, Includes and Tip may instead be given per region as
// "Headline (US): …" and "Headline (UK): …" ("(UK/EU)" is accepted as the older name for
// "(UK)"). The component shows US readers the (US) variant, UK readers the (UK) variant,
// and hides a region-split box from everyone else (e.g. the insurance box).
// `_…_` italics (what Prettier writes) are accepted as well as `*…*`.
//
// Anything that breaks the standard stops the build with a message naming the file,
// so a bad box is caught at import rather than on the live page.

const MARKER = '[THE DETAILS]';
const OLD_FORMAT = /^\[THE DETAILS\s*[—–-]/i;

/** Standard field name → component prop name. */
const FIELDS = {
  label: 'label',
  headline: 'title',
  provider: 'provider',
  price: 'price',
  includes: 'includes',
  tip: 'tip',
  button: 'button',
  link: 'link',
};
const REGIONAL = new Set(['headline', 'provider', 'price', 'includes', 'tip']);
const REGION_SUFFIX = { US: 'Us', UK: 'Uk' };
const BUTTONS = new Set(['Book now', 'Buy now', 'Get a quote']);
const LINE = /^([A-Za-z]+)\s*(?:\((US|UK(?:\/EU)?)\))?\s*:\s*(.+)$/;

const textOf = (node) =>
  node.type === 'text' || node.type === 'inlineCode'
    ? node.value
    : (node.children ?? []).map(textOf).join('');

/**
 * Parses the field lines of one box into component props.
 * Throws an Error describing the first problem found.
 */
export function parseDetailsBox(fieldLines) {
  const props = {};
  const seen = new Set();

  for (const raw of fieldLines) {
    const line = raw.trim();
    if (!line) continue;
    const match = line.match(LINE);
    if (!match) throw new Error(`can't read the line "${line}" (expected "Field: value")`);

    const [, rawKey, rawRegion, rawValue] = match;
    const region = rawRegion === 'UK/EU' ? 'UK' : rawRegion;
    const key = rawKey.toLowerCase();
    const value = rawValue.trim();
    if (!(key in FIELDS)) {
      throw new Error(
        `unknown field "${rawKey}" (allowed: Label, Headline, Provider, Price, Includes, Tip, Button, Link)`,
      );
    }
    if (region && !REGIONAL.has(key)) {
      throw new Error(`"${rawKey}" can't have a regional variant`);
    }
    const id = region ? `${key} (${region})` : key;
    if (seen.has(id)) throw new Error(`"${id}" appears twice`);
    seen.add(id);
    if (value.includes('&')) {
      throw new Error(`"${id}" contains "&" — the standard says to write "and"`);
    }
    props[FIELDS[key] + (region ? REGION_SUFFIX[region] : '')] = value;
  }

  for (const key of REGIONAL) {
    const prop = FIELDS[key];
    const us = `${prop}Us` in props;
    const uk = `${prop}Uk` in props;
    if (us !== uk) throw new Error(`"${key}" needs both a (US) and a (UK) line`);
    if (us && prop in props) throw new Error(`"${key}" is given both plainly and per region`);
  }
  const has = (prop) => prop in props || `${prop}Us` in props;
  for (const [key, prop] of [
    ['Label', 'label'],
    ['Headline', 'title'],
    ['Includes', 'includes'],
    ['Button', 'button'],
    ['Link', 'link'],
  ]) {
    if (!has(prop)) throw new Error(`missing required field "${key}"`);
  }
  if (props.label.toLowerCase() === 'the details') {
    throw new Error('Label must say what the reader gets, not "The Details"');
  }
  if (!BUTTONS.has(props.button)) {
    throw new Error(`Button "${props.button}" must be one of: ${[...BUTTONS].join(', ')}`);
  }
  if (!props.link.startsWith('/go/')) {
    throw new Error(`Link "${props.link}" must be a /go/ link`);
  }
  return props;
}

/**
 * If `paragraph` is a Details box, returns its field lines; otherwise null.
 * `text` returns a node's plain text (the processor's own helper when available).
 */
export function detailsBoxLines(paragraph, text = textOf) {
  const [first, ...rest] = paragraph.children ?? [];
  if (!first || first.type !== 'strong') return null;
  const heading = text(first).trim();
  if (OLD_FORMAT.test(heading)) {
    throw new Error(
      `old one-line box heading "**${heading}**" — rewrite it in the Details Box Standard format`,
    );
  }
  if (heading.toUpperCase() !== MARKER) return null;
  return rest
    .map((node) => (node.type === 'text' ? node.value : text(node)))
    .join('')
    .split('\n')
    .filter((line) => line.trim());
}

/** The MDX element that replaces a box: <Details label="…" title="…" … />. */
export const detailsElement = (props) => ({
  type: 'mdxJsxFlowElement',
  name: 'Details',
  attributes: Object.entries(props).map(([name, value]) => ({
    type: 'mdxJsxAttribute',
    name,
    value,
  })),
  children: [],
});

/**
 * Plugin for Astro's default Markdown processor (Sätteri), registered in astro.config.mjs
 * via markdown.processor: satteri({ mdastPlugins: [detailsBoxes] }). MDX inherits it.
 */
export const detailsBoxes = {
  name: 'sokefi-details-boxes',
  paragraph(node, ctx) {
    const file = ctx.fileURL ? decodeURIComponent(ctx.fileURL.pathname) : 'article';
    let props;
    try {
      const fieldLines = detailsBoxLines(node, (n) => ctx.textContent(n));
      if (!fieldLines) return;
      if (file.endsWith('.md')) {
        throw new Error('boxes only work in .mdx articles — rename this file to .mdx');
      }
      props = parseDetailsBox(fieldLines);
    } catch (error) {
      const where = node.position ? ` (line ${node.position.start.line})` : '';
      throw new Error(`Details box in ${file}${where}: ${error.message}`);
    }
    ctx.replaceNode(node, detailsElement(props));
  },
};
