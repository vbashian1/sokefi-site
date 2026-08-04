export const AFFILIATES = {
  'example-partner': {
    destination: 'https://example.com',
    partner: 'Example Partner',
    category: 'accommodation',
  },
} as const;

export type AffiliateSlug = keyof typeof AFFILIATES;
