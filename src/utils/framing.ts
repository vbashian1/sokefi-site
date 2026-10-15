/**
 * Inline style that frames a photo in a cropping placement: --focus (the focal point,
 * "across% down%") and --zoom (1 = none). The placement's CSS applies them as
 * object-position and a scale around that same point. Returns undefined when the article
 * sets neither, so the placement's default applies.
 */
export const framingStyle = (focus?: string, zoom?: number): string | undefined =>
  focus || zoom ? `--focus: ${focus ?? '50% 50%'}; --zoom: ${zoom ?? 1}` : undefined;

/**
 * Frame shapes for in-article photos: the photo's own shape, or a crop to a set ratio.
 * 16:9 and 2:1 are the wide shapes, and the only ones wide and full-width blocks accept.
 */
export const SHAPES = {
  original: null,
  '3:2': 3 / 2,
  '4:3': 4 / 3,
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
  '2:1': 2,
} as const;
export type Shape = keyof typeof SHAPES;

/** Shapes allowed for <WideImage> and <FullBleed>. */
export const WIDE_SHAPES = ['16:9', '2:1'] as const;

export const isShape = (value: unknown): value is Shape =>
  typeof value === 'string' && value in SHAPES;

/** Width ÷ height of the frame for a photo of the given size in the given shape. */
export const frameRatio = (shape: Shape | undefined, width: number, height: number): number =>
  SHAPES[shape ?? 'original'] ?? width / height;

export type FrameKind = 'landscape' | 'square' | 'portrait';

export const frameKind = (ratio: number): FrameKind =>
  ratio > 1.01 ? 'landscape' : ratio < 0.99 ? 'portrait' : 'square';

/** The framing saved on one photo placement (a <Gallery pick={[n]} … /> marker). */
export interface SavedFraming {
  pick: number;
  shape?: Shape;
  focus?: string;
  zoom?: number;
}

/** Reads the framing saved on each <Gallery> marker in an article body, in reading order. */
export const parseGalleryMarkers = (body: string): SavedFraming[] =>
  [...body.matchAll(/<Gallery\b([^>]*?)\/>/g)].flatMap(([, attrs]) => {
    const pick = attrs.match(/pick=\{\[\s*(\d+)\s*\]\}/)?.[1];
    if (pick === undefined) return [];
    const shape = attrs.match(/shape="([^"]+)"/)?.[1];
    const zoom = attrs.match(/zoom=\{([\d.]+)\}/)?.[1];
    return [
      {
        pick: Number(pick),
        shape: isShape(shape) ? shape : undefined,
        focus: attrs.match(/focus="([^"]+)"/)?.[1],
        zoom: zoom ? Number(zoom) : undefined,
      },
    ];
  });
