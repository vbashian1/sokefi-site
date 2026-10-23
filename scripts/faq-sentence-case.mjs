// FAQ questions are written in sentence case, keeping proper nouns (Veronica, 2026-10-14):
// "IS CAIRO SAFE TO VISIT RIGHT NOW?" → "Is Cairo safe to visit right now?"
//
// Handoff questions arrive in capitals, so the proper nouns are worked out from the article:
//   - its tags that contain a capital (multi-word names such as "Grand Egyptian Museum")
//   - words the article always capitalises mid-sentence and never writes in lower case
//     (Cairo, Saqqara, el-Khalili, GEM…)
// Questions that already contain lower case are left alone. The import prints every
// before/after pair, since a word the article never uses can't be recognised — that list is
// part of each article's review.

const WORD = /[\p{L}][\p{L}'’-]*/gu;

/** Lower-case form → the article's capitalised spelling, for words never written in lower case. */
function properWordsFrom(source) {
  // Only running prose counts: headings, bold lead-ins ("**Where to Stay**"), Details-box
  // lines and layout-block lines are in title case.
  const text = source
    .split('\n')
    .filter((line) => !/^\s*(#|\*[^*]|<|\{)/.test(line))
    .join('\n')
    .replace(/\*\*[^*\n]+\*\*/g, '');
  const capitalised = new Map();
  const lowercase = new Set();
  for (const match of text.matchAll(WORD)) {
    const word = match[0];
    const key = word.toLowerCase();
    if (word === key) {
      lowercase.add(key);
      continue;
    }
    // Skip words at the start of a sentence, line or heading: capitalised for position only.
    const before = text
      .slice(Math.max(0, match.index - 6), match.index)
      .replace(/[\s*_#>"'“‘(—–-]+$/u, '');
    if (before === '' || /[.!?:\n]$/.test(before)) continue;
    if (!capitalised.has(key)) capitalised.set(key, word);
  }
  for (const key of lowercase) capitalised.delete(key);
  return capitalised;
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function sentenceCaseQuestion(question, { phrases = [], words = new Map() } = {}) {
  let s = question.toLowerCase();
  s = s.replace(WORD, (word) => words.get(word) ?? word);
  s = s.replace(/(^|[^\p{L}])i(?=[^\p{L}'’]|$)/gu, '$1I');
  for (const phrase of phrases) {
    s = s.replace(new RegExp(`(?<![\\p{L}])${escape(phrase)}(?![\\p{L}])`, 'giu'), phrase);
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Rewrites the `question:` lines of a frontmatter block. Returns the new frontmatter and
 * the [before, after] pairs for the review.
 */
export function sentenceCaseFaq(frontmatter, body) {
  const tagBlock = frontmatter.match(/^tags:\s*([\s\S]*?)(?=^\w+:)/m)?.[1] ?? '';
  const phrases = tagBlock
    .replace(/[[\]\n]/g, ',')
    .split(',')
    .map((t) =>
      t
        .trim()
        .replace(/^['"-]\s*|['"]$/g, '')
        .trim(),
    )
    .filter((t) => /\p{Lu}/u.test(t))
    .sort((a, b) => b.length - a.length);
  const answers = [...frontmatter.matchAll(/^ {4}answer:\s*(.*)$/gm)].map((m) => m[1]).join('\n');
  const words = properWordsFrom(`${body}\n${answers}`);

  const changes = [];
  const updated = frontmatter.replace(
    /^( {2}- question:\s*)(['"]?)(.*?)\2(\s*(?:#.*)?)$/gm,
    (line, lead, quote, question, tail) => {
      // Already mixed case, ignoring decades written "70s" inside an all-caps question.
      if (/\p{Ll}/u.test(question.replace(/\d+s\b/g, ''))) return line;
      const after = sentenceCaseQuestion(question, { phrases, words });
      changes.push([question, after]);
      return `${lead}${quote}${after}${quote}${tail}`;
    },
  );
  return { frontmatter: updated, changes };
}
