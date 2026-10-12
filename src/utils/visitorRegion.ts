import { geolocation } from '@vercel/functions';

/** EU member states plus the UK — the readers who see the UK/EU variants and the cookie banner. */
export const EU_AND_UK_COUNTRY_CODES = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB',
  'UK',
]);

/** The visitor's two-letter country code from Vercel's geolocation, or '' when unknown. */
export const getCountryCode = (request: Request): string =>
  (geolocation(request).country ?? request.headers.get('x-vercel-ip-country') ?? '').toUpperCase();

export type VisitorRegion = 'us' | 'uk-eu';

/** 'uk-eu' for UK and EU readers (who see the cookie banner), 'us' for everyone else. */
export const getVisitorRegion = (request: Request): VisitorRegion =>
  EU_AND_UK_COUNTRY_CODES.has(getCountryCode(request)) ? 'uk-eu' : 'us';

export type ReaderMarket = 'us' | 'uk' | 'other';

/**
 * Which regional offer a reader can buy. Allianz only sells to US residents and Staysure
 * only to UK residents, so the region-split Details boxes (the insurance box) and
 * /go/ links show 'us' and 'uk' readers their variant, and nothing to 'other' readers.
 *
 * With no country at all — which only happens in local development, never on Vercel —
 * readers count as 'us' so the box can still be previewed.
 */
export const getReaderMarket = (request: Request): ReaderMarket => {
  const country = getCountryCode(request);
  if (country === 'US') return 'us';
  if (country === 'GB' || country === 'UK') return 'uk';
  if (!country && import.meta.env.DEV) return 'us';
  return 'other';
};
