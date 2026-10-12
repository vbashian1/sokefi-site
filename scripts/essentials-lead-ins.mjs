// The Details Box Standard (website_handoff_batch1/sokefi_details_box_standard.md) retires
// the short Essentials lead-ins above the two standard boxes — the box labels
// ("Staying connected", "Travel insurance") now do that job. Approved by Veronica.
//
// Removes a paragraph only when it starts with **Staying connected.** or **Insurance.**
// and the very next paragraph is a Details box (new or old format). Anything else is
// left alone.

const LEAD_IN = /^\*\*(Staying connected|Insurance)\.\*\*/;
const BOX_HEADING = /^\*\*\[THE DETAILS/;

/** Returns { body, removed } where `removed` lists the paragraphs taken out. */
export function removeEssentialsLeadIns(body) {
  const paragraphs = body.split(/\n{2,}/);
  const removed = [];
  const kept = paragraphs.filter((paragraph, i) => {
    const next = paragraphs[i + 1] ?? '';
    if (LEAD_IN.test(paragraph.trim()) && BOX_HEADING.test(next.trim())) {
      removed.push(paragraph.trim());
      return false;
    }
    return true;
  });
  return { body: kept.join('\n\n'), removed };
}
