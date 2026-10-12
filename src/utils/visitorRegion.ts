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

/**
 * Which regional variant a reader sees. UK/EU readers get 'uk-eu'; everyone else —
 * including unknown locations and local development — gets 'us'.
 */
export const getVisitorRegion = (request: Request): VisitorRegion =>
  EU_AND_UK_COUNTRY_CODES.has(getCountryCode(request)) ? 'uk-eu' : 'us';
