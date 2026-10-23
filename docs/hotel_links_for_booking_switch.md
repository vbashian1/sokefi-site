# Hotel links — for the Booking.com switch

_Running list of every hotel / accommodation link on the site (Veronica, 2026-10-23). Once the Booking.com affiliate account is set up (after launch), all hotel links switch to Booking.com. Updated with each article import. A copy is kept in `website_handoff_batch1/hotel_links_for_booking_switch.md`._

**How to read it**

- **Link** — `/go/<key>` links are redirects set in `src/data/affiliates.ts` (generated from `sokefi_go_links_launch15.md`); switching one to Booking.com is a one-line change there. "Direct" links go straight to the site written in the article and would need the article edited.
- **Earns** — _Affiliate_: the programme pays commission (tracking is added in Phase B; until then the link is a plain URL). _Referral_: earns nothing (the hotel's own site, or a direct link).

Last updated: 2026-10-23 (Cairo, "60", Blues Highway, Iceland, Tresco, Darwin).

| Article       | Hotel                                                                   | Link                                    | Current destination                                    | Earns                                               |
| ------------- | ----------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| Cairo         | The Nile Ritz-Carlton, Cairo                                            | `/go/marriott-nile-ritz-carlton`        | ritzcarlton.com — The Nile Ritz-Carlton, Cairo         | Affiliate (Marriott)                                |
| Cairo         | Marriott Mena House                                                     | `/go/marriott-mena-house`               | marriott.com — Marriott Mena House, Cairo              | Affiliate (Marriott)                                |
| Blues Highway | The Cotton House (Cleveland)                                            | `/go/marriott-cotton-house-cleveland`   | marriott.com — Cotton House, a Tribute Portfolio Hotel | Affiliate (Marriott)                                |
| Blues Highway | The Westin Jackson                                                      | `/go/marriott-westin-jackson`           | marriott.com — The Westin Jackson                      | Affiliate (Marriott)                                |
| Blues Highway | Ritz-Carlton New Orleans                                                | `/go/marriott-ritz-carlton-new-orleans` | ritzcarlton.com — The Ritz-Carlton, New Orleans        | Affiliate (Marriott)                                |
| Blues Highway | The Memphian                                                            | `/go/marriott-the-memphian`             | marriott.com — The Memphian, a Tribute Portfolio Hotel | Affiliate (Marriott)                                |
| Iceland       | Courtyard by Marriott Reykjavík Keflavík Airport                        | `/go/marriott-courtyard-keflavik`       | marriott.com — Courtyard Reykjavik Keflavik Airport    | Affiliate (Marriott)                                |
| Iceland       | The Reykjavík EDITION                                                   | `/go/marriott-reykjavik-edition`        | marriott.com — The Reykjavik EDITION                   | Affiliate (Marriott)                                |
| Tresco        | Karma St Martin's (box and text link)                                   | `/go/booking-karma-st-martins`          | karmagroup.com — Karma St. Martin's (hotel's own site) | Referral                                            |
| Tresco        | The New Inn                                                             | Direct                                  | tresco.co.uk/staying/the-new-inn                       | Referral                                            |
| Tresco        | The Island Office (self-catering bookings)                              | Direct                                  | theislandoffice.co.uk                                  | Referral                                            |
| Tresco        | Tregarthen's Hotel (St Mary's — mentioned as a coffee stop, not a stay) | Direct                                  | tregarthens-hotel.co.uk                                | Referral                                            |
| Tresco        | Star Castle Hotel (St Mary's — mentioned as a coffee stop, not a stay)  | Direct                                  | star-castle.co.uk                                      | Referral                                            |
| Darwin        | Lion + Pheasant                                                         | `/go/booking-lion-pheasant`             | booking.com — Lion + Pheasant listing                  | Affiliate (Booking.com, once the account is set up) |
| Darwin        | Darwin's Townhouse                                                      | `/go/booking-darwins-townhouse`         | darwinstownhouse.com (hotel's own site)                | Referral                                            |

"What Does It Mean to Be 60?" has no hotel links.

**Notes for the switch**

- The Marriott links already earn through the Marriott programme; switching them to Booking.com is a choice to make per hotel, not a requirement.
- The five Tresco direct links are plain links in the article text; to route them through Booking.com they'd first need `/go/` keys.
- Lion + Pheasant is already a Booking.com listing — it only needs the tracked link once the account exists.
