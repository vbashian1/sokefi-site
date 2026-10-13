/**
 * Inline style that frames a photo in a cropping placement: --focus (the focal point,
 * "across% down%") and --zoom (1 = none). The placement's CSS applies them as
 * object-position and a scale around that same point. Returns undefined when the article
 * sets neither, so the placement's default applies.
 */
export const framingStyle = (focus?: string, zoom?: number): string | undefined =>
  focus || zoom ? `--focus: ${focus ?? '50% 50%'}; --zoom: ${zoom ?? 1}` : undefined;
