export const ROUTES = {
  home: '/',
  about: '/about',
  authors: '/authors',
  authorProfilePattern: '/authors/[slug]',
  awenvida: '/awenvida',
  beyondTheGuidebook: '/beyond-the-guidebook',
  theUncommonTraveller: '/the-uncommon-traveler',
  reservationForOne: '/reservation-for-one',
  privacyPolicy: '/privacy-policy',
  termsOfUse: '/terms-of-use',
  theSokefiEdit: '/the-sokefi-edit',
  subscribe: '/subscribe',
} as const;

export const getAuthorRoute = (slug: string) => `${ROUTES.authors}/${slug}`;
