// Bold labels (Veronica, 2026-10-20): a bold label written on its own line at the start of
// a paragraph — "**Getting there**" then the text on the next line — shows on its own line
// above its text, like a small subheading, on every article. A paragraph that is only a
// bold label ("**Where to stay**" above a list) is treated the same way.
//
//   **Getting around**
//   As a rule, we like to self-drive …
//
// becomes <div class="article-labelled"><p class="…">Getting around</p><p>As a rule…</p></div>.
// Only top-level paragraphs count: bold words mid-sentence, bold text in lists, and
// Details boxes are left alone. Label style: src/styles/article-body.css.
// Registered in astro.config.mjs (markdown.processor), before the layout rules.

const isLabel = (node) =>
  node?.type === 'strong' &&
  node.children?.length > 0 &&
  node.children.every((c) => c.type === 'text') &&
  !/^\s*\[THE DETAILS/i.test(node.children.map((c) => c.value).join(''));

const element = (name, className, children) => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes: [{ type: 'mdxJsxAttribute', name: 'class', value: className }],
  children,
});

export const labelParagraphs = {
  name: 'sokefi-label-paragraphs',
  paragraph(node, ctx) {
    const parent = ctx.parent(node);
    if (!parent || parent.type !== 'root') return;
    const [first, second, ...rest] = node.children ?? [];
    if (!isLabel(first)) return;

    const labelOnly = !second;
    const labelOnOwnLine = second?.type === 'text' && /^[ \t]*\n/.test(second.value);
    if (!labelOnly && !labelOnOwnLine) return;

    const label = element('p', 'article-label', [first]);
    const children = [label];
    if (labelOnOwnLine) {
      const text = { ...second, value: second.value.replace(/^[ \t]*\n/, '') };
      const body = [text, ...rest].filter((c) => !(c.type === 'text' && c.value === ''));
      if (body.length) children.push({ type: 'paragraph', children: body });
    }
    // "**Sources**" above the citations list is styled as a quiet footnote (Veronica,
    // 2026-10-23): article-sources on the label, and the list right after it, in article-body.css.
    const isSources =
      labelOnly &&
      first.children
        .map((c) => c.value)
        .join('')
        .trim() === 'Sources';
    ctx.replaceNode(
      node,
      element('div', isSources ? 'article-labelled article-sources' : 'article-labelled', children),
    );
  },
};
