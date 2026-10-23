// Typography fixes that automatic curly quotes get wrong (Veronica, 2026-10-21).
// "rock 'n' roll": the 'n' is two apostrophes (’n’), but quote curling reads the first one as
// an opening quote and gives ‘n’. Writing the right characters before the curling runs fixes
// it everywhere: body text, callouts, FAQ and summaries.

/** Replaces a standalone 'n' (between spaces) with ’n’. */
export const fixTypography = (text) => text.replace(/(^|\s)['‘’]n['‘’](?=\s|$)/g, '$1’n’');

/**
 * Curly quotes for plain text that never goes through the markdown processor: titles, deks
 * and eyebrows written in frontmatter ("It’s Simple. It’s Scilly."). Same result as body
 * copy: apostrophes and closing quotes ’ ”, opening quotes ‘ “.
 */
export const smartQuotes = (text) =>
  fixTypography(
    (text ?? '')
      .replace(/(^|[\s([{—–-])"/g, '$1“')
      .replace(/"/g, '”')
      .replace(/(^|[\s([{—–-])'/g, '$1‘')
      .replace(/'/g, '’'),
  );

/** Plugin for Astro's Markdown processor (Sätteri): applies the fixes to every text node. */
export const typography = {
  name: 'sokefi-typography',
  // Nodes are read-only here: a change has to go through ctx.replaceNode.
  text(node, ctx) {
    const fixed = fixTypography(node.value);
    if (fixed !== node.value) ctx.replaceNode(node, { type: 'text', value: fixed });
  },
};
