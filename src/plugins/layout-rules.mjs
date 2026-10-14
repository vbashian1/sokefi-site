// Layout rules for article bodies, checked when the site is built (Veronica, 2026-10-14).
// Breaking one stops the build with a message naming the file and line, so a layout
// problem is caught before it reaches the page:
//
//   1. Insets sit within a run of text: an <Inset> comes straight after a paragraph (never
//      at the start of a section), and two insets have at least 3 paragraphs between them.
//   2. An <ImagePair> holds two photos of the same shape (never a portrait with a landscape).
//   3. <WideImage> and <FullBleed> use a wide shape (16:9 or 2:1), and an article has at
//      most one wide-or-full-width block. (Their height is capped at the banner's in CSS.)
//   4. Each photo appears once: no gallery photo is placed twice in the same article.
//
// Registered with the Details-box plugin in astro.config.mjs (markdown.processor).

const PHOTO_BLOCKS = new Set(['Gallery', 'Inset', 'WideImage', 'FullBleed', 'ImagePair']);
const BIG_BLOCKS = new Set(['WideImage', 'FullBleed']);
const WIDE_SHAPES = new Set(['16:9', '2:1']);
const MIN_PARAGRAPHS_BETWEEN_INSETS = 3;

/** An attribute's raw value: a string, or the source of an {expression}. */
const attr = (node, name) => {
  const a = (node.attributes ?? []).find((x) => x.name === name);
  if (!a) return undefined;
  return typeof a.value === 'string' ? a.value : (a.value?.value ?? '');
};

const picksOf = (node) => {
  if (node.name === 'ImagePair') {
    return ['first', 'second'].flatMap((side) =>
      [...(attr(node, side) ?? '').matchAll(/pick\s*:\s*(\d+)/g)].map((m) => Number(m[1])),
    );
  }
  return [...(attr(node, 'pick') ?? '').matchAll(/\d+/g)].map((m) => Number(m[0]));
};

const pairShape = (node, side) =>
  (attr(node, side) ?? '').match(/shape\s*:\s*['"]([^'"]+)['"]/)?.[1];

/** A prose paragraph (not a Details box written as a paragraph). */
const isProse = (node, ctx) =>
  node.type === 'paragraph' && !/^\s*\[THE DETAILS/i.test(ctx.textContent(node));

/** Checks one body (the list of top-level nodes). Returns a list of problems. */
export function checkLayout(children, ctx) {
  const problems = [];
  const where = (node) => (node.position ? ` (line ${node.position.start.line})` : '');
  const seen = new Map();
  let bigBlocks = 0;
  let lastInset = -1;

  children.forEach((node, i) => {
    if (node.type !== 'mdxJsxFlowElement' || !PHOTO_BLOCKS.has(node.name)) return;

    for (const pick of picksOf(node)) {
      if (seen.has(pick)) {
        problems.push(
          `photo ${pick} is placed twice${where(seen.get(pick))} and${where(node)} — each photo appears once`,
        );
      } else seen.set(pick, node);
    }

    if (node.name === 'Inset') {
      if (!children[i - 1] || !isProse(children[i - 1], ctx)) {
        problems.push(
          `<Inset>${where(node)} must sit within a run of text: put it after a paragraph, not at the start of a section`,
        );
      }
      if (lastInset >= 0) {
        const between = children.slice(lastInset + 1, i).filter((n) => isProse(n, ctx)).length;
        if (between < MIN_PARAGRAPHS_BETWEEN_INSETS) {
          problems.push(
            `<Inset>${where(node)} is only ${between} paragraph(s) after the previous inset — keep at least ${MIN_PARAGRAPHS_BETWEEN_INSETS} between them`,
          );
        }
      }
      lastInset = i;
    }

    if (node.name === 'ImagePair') {
      const a = pairShape(node, 'first');
      const b = pairShape(node, 'second');
      if (!a || !b || a !== b) {
        problems.push(
          `<ImagePair>${where(node)} needs two photos of the same shape (got ${a ?? 'none'} and ${b ?? 'none'}) — never a portrait with a landscape`,
        );
      }
    }

    if (BIG_BLOCKS.has(node.name)) {
      bigBlocks++;
      const shape = attr(node, 'shape');
      if (!WIDE_SHAPES.has(shape)) {
        problems.push(
          `<${node.name}>${where(node)} must use a wide shape, shape="16:9" or shape="2:1" (got ${shape ?? 'none'})`,
        );
      }
      if (bigBlocks === 2) {
        problems.push(
          `<${node.name}>${where(node)} is a second wide/full-width block — use at most one per article`,
        );
      }
    }
  });
  return problems;
}

const checked = new WeakSet();

/** Plugin for Astro's Markdown processor (Sätteri): checks each article body once. */
export const layoutRules = {
  name: 'sokefi-layout-rules',
  mdxJsxFlowElement(node, ctx) {
    if (!PHOTO_BLOCKS.has(node.name)) return;
    const parent = ctx.parent(node);
    if (!parent || checked.has(parent)) return;
    checked.add(parent);
    const problems = checkLayout(parent.children ?? [], ctx);
    if (problems.length) {
      const file = ctx.fileURL ? decodeURIComponent(ctx.fileURL.pathname) : 'article';
      throw new Error(`Layout rules in ${file}:\n  - ${problems.join('\n  - ')}`);
    }
  },
};
