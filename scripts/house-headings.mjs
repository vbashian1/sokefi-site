// House style for section headings and bold labels, taken from Cairo (Veronica,
// 2026-10-15: recurring headings must match Cairo exactly; 2026-10-20: headings in title
// case; bold labels in sentence case, no full stop, on their own line above their text —
// the site shows them as small subheadings, src/plugins/label-paragraphs.mjs). The import script reports —
// it never changes — anything that differs, so each article's mismatches can be approved
// in one go. When Veronica approves a new recurring heading or label, add it here.

/** Recurring section headings (##), spelled exactly as on Cairo. */
export const RECURRING_HEADINGS = ['The Inside Track', 'The Essentials', 'If You Have Time'];

/** Recurring bold labels, spelled exactly as approved (sentence case). */
export const ESSENTIALS_LABELS = [
  'Getting around',
  'Getting there',
  'Food',
  'Where to stay',
  'Where to base yourself',
  'Tipping and cash',
  'Local laws',
];

// Words left lower case inside a title-case heading.
const SMALL_WORDS = new Set(
  'a an and as at but by for from in into nor of on or the to with vs'.split(' '),
);

/** True when every word is capitalised except the small words (first word always counts). */
const isTitleCase = (heading) =>
  heading
    .split(/\s+/)
    .filter((word) => /\p{L}/u.test(word))
    .every((word, i) => {
      const letters = word.replace(/^[^\p{L}]+/u, '');
      return /^\p{Lu}/u.test(letters) || (i > 0 && SMALL_WORDS.has(letters.toLowerCase()));
    });

/**
 * Checks an article body against the house style. Returns a list of mismatches, each with
 * the line number and a suggested correction, for the import report.
 */
export function checkHouseHeadings(body) {
  const mismatches = [];
  const lines = body.split('\n');
  const canonical = (list, text) => list.find((c) => c.toLowerCase() === text.toLowerCase());

  lines.forEach((line, i) => {
    const at = `body line ${i + 1}`;

    const heading = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (heading) {
      const [, level, text] = heading;
      const recurring = canonical(RECURRING_HEADINGS, text);
      if (recurring && recurring !== text) {
        mismatches.push(
          `${at}: "${level} ${text}" should be "${level} ${recurring}" (as on Cairo)`,
        );
      } else if (!recurring && !isTitleCase(text)) {
        mismatches.push(`${at}: "${level} ${text}" is not in title case, as Cairo's headings are`);
      }
      return;
    }

    const label = line.match(/^\*\*([^*[][^*]*?)\*\*(.*)$/);
    if (label) {
      const [, text, after] = label;
      // A label followed by a space and its sentence on the same line must move to its own
      // line. (A bold place name followed by a colon, "**Cleveland**: our base…", is not a label.)
      if (/^\s+\S/.test(after)) {
        mismatches.push(
          `${at}: label "**${text}**" runs into its text; put the label on its own line, with the text on the next line`,
        );
      }
      const bare = text.replace(/[.:]$/, '');
      const known = canonical(ESSENTIALS_LABELS, bare);
      if (known && known !== bare) {
        mismatches.push(`${at}: label "**${text}**" should be "**${known}**" (as on Cairo)`);
      }
      if (/[.:]$/.test(text)) {
        mismatches.push(
          `${at}: label "**${text}**" ends with "${text.at(-1)}"; Cairo's labels have no full stop and sit on their own line`,
        );
      }
    }
  });
  return mismatches;
}
