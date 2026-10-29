// Who owns each photo (Veronica's image ownership map, sokefi_image_ownership_map.md, and the
// October image notes). scripts/build-images.mjs writes "© Sokéfi" copyright details into the
// web copies of the photos listed under MINE, and only those: never stock (Unsplash) or
// licensed photos, and never the originals. A photo in neither list is left unstamped and
// the build names it, so every new photo gets a decision.
//
// Paths are relative to the project folder, as in src/data/image-manifest.json.

const A = 'src/content/articles/';

/** Veronica's own photos: web copies get "© Sokéfi". */
export const MINE = [
  // Blues Highway: all
  `${A}2026-09-01-blues-highway-highway-61/blue front cafe .jpg`,
  `${A}2026-09-01-blues-highway-highway-61/crossroads.jpg`,
  `${A}2026-09-01-blues-highway-highway-61/dockery farms .jpg`,
  `${A}2026-09-01-blues-highway-highway-61/dockery services station - coca cola.jpg`,
  `${A}2026-09-01-blues-highway-highway-61/muddy waters.jpg`,
  `${A}2026-09-01-blues-highway-highway-61/parchment .jpg`,
  `${A}2026-09-01-blues-highway-highway-61/Po monkey.jpg`,
  // Cairo: the Saqqara hieroglyphics only
  `${A}2026-09-01-cairo-long-weekend/heiroglyphics.jpg`,
  // Confessions: the open-road hero
  `${A}2026-09-01-confessions-of-a-modern-nomad/open road.jpg`,
  // Darwin: Tanners, the footbridge, the boathouse (not the statue)
  `${A}2026-09-01-darwin-trail-shrewsbury/tanners .jpg`,
  `${A}2026-09-01-darwin-trail-shrewsbury/footbridge .jpg`,
  `${A}2026-09-01-darwin-trail-shrewsbury/boat house .jpg`,
  // Q&A: the plane-window hero
  `${A}2026-09-01-modern-nomads-answers-solo-travel-questions/plane - hero.jpg`,
  // Surfer: the gallery (not the hero)
  `${A}2026-09-01-tasty-waves-cool-buzz-socal-surfer/surfing .jpg`,
  `${A}2026-09-01-tasty-waves-cool-buzz-socal-surfer/fish tacos.jpg`,
  `${A}2026-09-01-tasty-waves-cool-buzz-socal-surfer/cars n coffee.jpg`,
  `${A}2026-09-01-tasty-waves-cool-buzz-socal-surfer/coast.jpg`,
  // Tresco: all
  `${A}2026-09-01-tresco-isles-of-scilly/island.jpg`,
  `${A}2026-09-01-tresco-isles-of-scilly/cromwell with boats .jpg`,
  `${A}2026-09-01-tresco-isles-of-scilly/gig race.jpg`,
  `${A}2026-09-01-tresco-isles-of-scilly/path.jpg`,
  `${A}2026-09-01-tresco-isles-of-scilly/boat schedule.jpg`,
  // "60": Mick Jagger only
  `${A}2026-09-01-what-does-it-mean-to-be-60/IMG20240721223424 - mick .jpg`,
  // Iceland: Skógafoss hero, the Seljalandsfoss walk-behind, Kerið crater
  `${A}2026-09-01-winter-weekend-in-iceland/broad shot of waterfall .jpg`,
  `${A}2026-09-01-winter-weekend-in-iceland/waterfall - drop back shot - people in front .jpg`,
  `${A}2026-09-01-winter-weekend-in-iceland/full crater.jpg`,
  // Oxford: all three (the courthouse hero confirmed hers by Veronica, 2026-10-28, which
  // overrides the ownership map's "not mine")
  `${A}2026-10-01-college-towns-oxford-mississippi/courthouse - hero .jpg`,
  `${A}2026-10-01-college-towns-oxford-mississippi/faulkner sign .jpg`,
  `${A}2026-10-01-college-towns-oxford-mississippi/department store.jpg`,
  // The Sokéfi Edit, Edition 1: beach at dusk
  'src/content/editions/edition-1/beach.jpg',
  // Site photos: the About page plane
  'src/assets/images/about-brand-plane.webp',
];

/** Stock (Unsplash) and licensed photos: never stamped. */
export const NOT_MINE = [
  `${A}2026-09-01-at-home-colon-cancer-screening/bike .jpg`, // Unsplash, Carl Tronders
  `${A}2026-09-01-cairo-long-weekend/hero- .jpg`, // Unsplash (Sphinx)
  `${A}2026-09-01-cairo-long-weekend/market.webp`, // Unsplash (Khan el-Khalili)
  `${A}2026-09-01-cairo-long-weekend/painted figure.webp`, // Unsplash
  `${A}2026-09-01-cairo-long-weekend/shopfront.jpg`, // Unsplash (koshk)
  `${A}2026-09-01-darwin-trail-shrewsbury/Charles_Darwin_Statue,_.jpg`, // CC BY-SA 2.0, Brian Deegan
  `${A}2026-09-01-modern-nomads-answers-solo-travel-questions/jimmy-woo-aEO0KSuBF6o-unsplash.jpg`, // Unsplash
  `${A}2026-09-01-modern-nomads-answers-solo-travel-questions/passport .jpg`, // sourced
  `${A}2026-09-01-optimising-cognitive-abilities/hero .jpg`, // Unsplash
  `${A}2026-09-01-optimising-cognitive-abilities/salad.jpg`, // Unsplash
  `${A}2026-09-01-optimising-cognitive-abilities/sunset .jpg`, // Unsplash
  `${A}2026-09-01-solo-cruising-midlife/antarctica .jpg`, // sourced
  `${A}2026-09-01-solo-cruising-midlife/expedition .jpg`, // sourced
  `${A}2026-09-01-solo-cruising-midlife/scarlet .jpg`, // sourced
  `${A}2026-09-01-tasty-waves-cool-buzz-socal-surfer/amanda-vick-ZPpVObKlmgk-unsplash.jpg`, // hero, Unsplash
  `${A}2026-09-01-the-tourist-dad-uniform/hero .jpg`, // stock
  `${A}2026-09-01-the-tourist-dad-uniform/sneakers .jpg`, // Unsplash
  `${A}2026-09-01-what-does-it-mean-to-be-60/titus-blair-qZ1NeXY4tKA-unsplash - hero 60 sign .jpg`, // Unsplash
  `${A}2026-09-01-whats-new-wearable-devices-biomarker-tracking/hero .jpg`, // Unsplash
  `${A}2026-09-01-why-my-daughters-are-great-plumbers/hero .jpg`, // Unsplash
  `${A}2026-09-01-why-my-daughters-are-great-plumbers/taps.jpg`, // Unsplash
  `${A}2026-09-01-winter-weekend-in-iceland/sydney-russakov-XU_MYbgspMI-unsplash.jpg`, // Unsplash
  `${A}2026-09-01-winter-weekend-in-iceland/sunrise road.jpg`, // Unsplash, Rory Hennessey
  `${A}2026-10-01-the-joy-of-saying-yes/van .jpg`, // Unsplash, Franco De Bartolo
  `${A}2026-10-01-why-an-imperfect-cabin-is-perfect/cabin .jpg`, // Unsplash
  // Site photos (Veronica, 2026-10-28): the pillar headers, Positano and the pillar
  // fallbacks are Unsplash (none of the fallbacks is the About plane)
  'src/assets/images/awenvida-breakfast-balcony.avif',
  'src/assets/images/beyond-camels-stable.webp',
  'src/assets/images/uncommon-lanterns.webp',
  'src/assets/images/reservation-selfie-hat.webp',
  'src/assets/images/positano-new.avif',
  'src/assets/images/positano-new.webp',
  'src/assets/images/fallback-awenvida.webp',
  'src/assets/images/fallback-beyond-the-guidebook.webp',
  'src/assets/images/fallback-the-uncommon-traveller.webp',
  'src/assets/images/fallback-reservation-for-one.webp',
];
