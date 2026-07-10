# Sokéfi — Site Structure & Editorial Architecture

**Compiled:** July 2026, from brand/editorial reference files + planning conversation
**Platform:** Astro + TypeScript (confirmed — see "Platform Decision" below)

---

## Platform Decision (confirmed)

Built on **Astro + TypeScript**, not WordPress. Rationale:

- Astro has a genuine SEO/GEO (AI-answer-engine) performance edge over a typical WordPress+plugin stack
- Affiliate marketing requires no special infrastructure — plain links work identically on any platform
- The multi-author/editorial gap is solved by adding **Decap CMS** on top of Astro (next milestone, before heavy content production — see Open Items)
- The one genuine WordPress advantage — WooCommerce for direct product sales — only matters if/when "Sokéfi sales" becomes a real, near-term plan. Addressable later via Shopify Buy Button / Snipcart without a platform rebuild.

---

## The Four Pillars

| Pillar                 | Tagline                              | Editorial Device                                | Voice                                                                                  |
| ---------------------- | ------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| Beyond the Guidebook   | THE WORLD, SEEN DIFFERENTLY          | "The trip inside the trip."                     | Sokéfi Editorial Team (no named voice)                                                 |
| The Uncommon Traveller | WANDER INTELLIGENTLY, LIVE CURIOUSLY | "Come home with stories, not just photographs." | Sokéfi Editorial Team (no named voice); loosely paired with Awenvida in tone/placement |
| Reservation for One    | BECAUSE THE WORLD WON'T SEE ITSELF   | "The world is waiting."                         | Sophie Westbrooke                                                                      |
| Awenvida               | THE INSPIRED LIFE                    | Intentionally exceptional                       | Multi-voice pillar (see below)                                                         |

**Practical Travel does not exist as a standalone pillar.** Practical content is absorbed into whichever of the four pillars fits topically.

**Umbrella tagline (brand-level):** EXPERIENCE IT — used on homepage, About page, brand-level communications.

---

## Awenvida — Multi-Column Structure

Awenvida is explicitly designed to hold **range**, not one voice. Three recurring columns coexist under "the inspired life":

| Column                         | Author                   | Register                                                                                   | Recurring Device                           |
| ------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Musings from the Corner Office | Charlotte Mowbray-Greene | Composed, wry, authoritative; opens with a moment, argues, ends with energy not resolution | Closes on a question that invites response |
| Health/Vitality strand         | Alice Wellesley          | Warm, curious, personal; the "Ina Garten register"                                         | "Doing it now so I can do it later"        |
| Jake's Take                    | Jake Martin              | Self-deprecating, affectionately sarcastic, comedy-first                                   | "And that's my take on \_\_\_."            |

Author bios/voice notes are detailed below. New columns can slot into this same pattern later without restructuring.

---

## Author System

### Charlotte Mowbray-Greene

- **Role:** Editor of Sokéfi (brand-level) + columnist, Musings from the Corner Office. Her first-person bio functions as the founder voice — not heavily foregrounded, but confirmed as accurate.
- **Slug:** `charlotte-mowbray-greene` · **Email:** charlotte@sokefi.com (to set up)
- **Also:** writes series-introducing pieces at the brand level (see "Featured/Homepage Mechanism" below) and occasional standalone pieces; dual-tags across Corner Office, Awenvida, and The Uncommon Traveller.
- Voice: composed, wry, authoritative — earned not assumed. Wise but not preachy; personal but not confessional.

### Sophie Westbrooke

- **Role:** Sole voice of Reservation for One.
- **Slug:** `sophie-westbrooke` · **Email:** sophie@sokefi.com (to set up)
- **Brand scope note:** R4O is gender-neutral by design (solo travel growth ~88% men / 91% women) and **not strictly age-gated** like the rest of Sokéfi — defining trait is travelling alone, not birth year. 50–70 is home base, not a boundary.
- Bio currently a first pass — flagged for further review.

### Alice Wellesley

- **Role:** Health/vitality strand within Awenvida.
- **Slug:** `alice-wellesley` · **Email:** alice@sokefi.com (to set up)
- **Angle:** Not strictly "sandwich generation" — her perspective comes from having navigated multiple, overlapping life-stage family situations (could be sandwich generation, boomerang children, empty nest with or without aging parents, or combinations that shift over time). The through-line is lived experience of life-stage collision, not one fixed family structure. Informs everything without being the point of any single piece.
- Sample article inventory: 8,500 Steps · Cycling and Brain Health · Bone Strength and Longevity · The Protein Question · Sleep — The Non-Negotiable · Alcohol — The Honest Conversation · Managing Jet Lag · Hiking Cotopaxi at 62 · Eating Well When You Travel · food-travel strand (not recipes — the story behind a dish and what she did with it at home)

### Jake Martin

- **Role:** Jake's Take home base is Awenvida (counterpoint to Charlotte, not a sub-category of her column) — but not strictly confined there; can appear elsewhere as fits.
- **Slug:** `jake-martin` · **Email:** jake@sokefi.com (to set up) · **Substack:** jakestake.substack.com (to set up)
- **Open question:** whether the Substack is Jake's own independent brand or "Jake's Take for Sokéfi" under the Sokéfi umbrella — not yet decided.
- Format is variable: snark pieces short (300–400 words), relationship/health/practical pieces longer.
- Bio marked "working version, refine before publishing" — as are all four author bios.

**Beyond the Guidebook and The Uncommon Traveller have no dedicated pen name** — bylined as Sokéfi Editorial Team.

---

## Content Schema (for Claude Code implementation)

### Authors collection

- Display name, slug, email
- Pillar(s)/column association
- Short bio, long bio, first-person bio (three tiers, matching existing file structure)
- Voice notes (internal reference)
- Recurring device/closer line
- Photo (monogram placeholder → illustrated avatar later)
- Bio review status flag

### SEO/GEO — structural requirement, not just guidance

Every article template enforces: meta description field, proper heading hierarchy, schema.org Article + Author structured data auto-generated from the author/pillar fields below, clean semantic URLs (Astro default). This is baked into the schema so it can't be skipped per-article, not left to editorial memory.

### Articles collection

- **Author** (references Authors collection; independent of pillar — an author can write for a pillar that isn't "theirs")
- **Pillar** (primary placement)
- **Column** (Awenvida articles only — Corner Office / Vitality / Jake's Take)
- **Secondary pillar tag** (optional — supports Charlotte's dual-tagging pattern)
- **Series** (optional — for brand-introduced series like "Following the Music")
- **Featured flag** (`featured: true/false`) — controls homepage surfacing, independent of pillar
- **Featured priority/date** — since featured status is meant to rotate, not be permanent
- **crossPostToSubstack flag** (`true/false`) — feeds the dedicated Substack-eligible RSS feed

---

## Featured / Homepage Mechanism

**Problem this solves:** avoid a homepage that's just four menu links — keep the site feeling like a living publication readers land on and explore, not a static directory.

**Section name:** "The Sokéfi Edit" — same name as the planned newsletter, deliberately. This isn't a naming coincidence; the homepage section and the newsletter are one consistent editorial product surfaced in two places, not two different things that happen to share a name.

**Mechanism:** The homepage section functions as a **preview/teaser of the newsletter itself** — showing highlights from the latest edition, with a "read the full Edit" link out to Substack and a subscribe prompt alongside it. Underneath, it still pulls from the same `featured` flag mechanism (any article can be flagged, regardless of author or pillar), so the newsletter and the homepage section are built from the same editorial picks rather than maintained as two separate lists.

**Why this works:** it turns homepage real estate into active newsletter growth (website readers get pulled toward subscribing) while keeping one coherent brand touchpoint instead of two competing ones. The article never leaves its actual pillar home — featuring is additive visibility, not a move or duplicate.

**Rotation:** featured status is time-bound/priority-ordered, not permanent — a health piece might feature this month and quietly return to living under Awenvida once something newer takes its place. Editorial judgment decides what's featured, not an automated rule.

**Primary use case:** Charlotte introducing new brand-level series or speaking about Sokéfi as a whole — but the mechanism itself is author-agnostic; any piece deemed important enough can be featured.

---

## Monetization

- **Affiliate marketing** — fully supported now, no missing infrastructure. Plain links with tracking codes work identically regardless of platform. Link cloaking and disclosure banners are simple, one-time Astro components, not ongoing plugin dependencies.
- **Direct "Sokéfi sales"** (future, uncertain) — would need e-commerce (Shopify Buy Button / Snipcart) added when/if it becomes concrete. Not built now; not blocked by current architecture either.
- **SEO/GEO** — Astro's static-first rendering is a genuine structural advantage here, not just a claim.

---

## Social Media Integration (planned, not yet built)

> ⚠️ **Action item — do this once real content starts being uploaded**, not before. (Also saved as a standing reminder.)

- Generate an **RSS feed** from the Astro site (foundational — everything below depends on this)
- **Instagram / Facebook / Pinterest:** semi-automated via Buffer or Zapier/Make, watching the RSS feed and drafting excerpt+link+image posts for one-click approval — not fully hands-off publishing, at least initially
- **Pinterest pin design** stays manual (per the existing Canva-based brand spec) — only the _posting_ of a finished pin is automatable
- **Substack:** primarily Jake's Take, occasionally other authors, all still under the Sokéfi brand. Substack supports native RSS import — plan is a **dedicated filtered feed** (using the `crossPostToSubstack` flag) rather than the full site feed, so only intended pieces cross-post
- Add the RSS feed + `crossPostToSubstack` schema flag now (cheap, foundational); hold off on the actual Buffer/Zapier/Substack wiring until there's real content to test against

---

## Open Items

1. **Decap CMS** — needs to be added before heavy content production begins, so Charlotte/Sophie/Alice/Jake and editorial staff can publish without using Git directly
2. Sophie Westbrooke's bio — flagged as a first pass, needs further review
3. All four author bios marked "working version, refine before publishing"
4. Comments system — not yet decided (candidates: Giscus, Disqus, or similar)
5. Questionnaire/interactive embeds — planned via third-party tools (Typeform/Tally), not custom-built
6. Social media automation — see Action Item above
7. Beyond the Guidebook / Uncommon Traveller — confirmed no dedicated voice; revisit only if that changes
8. **The Sokéfi Edit newsletter platform** — not yet pinned down (earlier strategy doc suggested MailerLite/ConvertKit; separately, Jake has his own Substack at jakestake.substack.com). Worth clarifying whether The Sokéfi Edit lives on Substack, a dedicated email platform, or both — and how it relates to Jake's individual Substack, since they're distinct but may cross-post.
