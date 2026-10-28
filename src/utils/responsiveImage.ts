/**
 * Web-sized photos (Veronica, 2026-10-27). scripts/build-images.mjs makes WebP copies of
 * every photo at several widths (public/img/<hash>/<width>.webp) and lists them in
 * src/data/image-manifest.json. `responsiveImage` gives an <img> the srcset and sizes for
 * one placement, so each screen downloads the smallest copy that stays sharp. The <img>
 * keeps its classes, width/height and framing style, so crops and zooms look exactly as
 * before (they're set by CSS on the image box, not by the file).
 *
 * A placement is described by its slots: how wide the image box is on each screen
 * (`width`, any CSS length; `maxPx` its widest), and whether the photo is cropped to fill
 * the box (`cover`). A cropped photo can need more pixels than the box is wide (a landscape
 * photo in a tall frame, or a zoom), so the size the browser is told is scaled up to match.
 * Photos not in the manifest (remote images, small graphics) are served as they are.
 */
import type { ImageMetadata } from 'astro';

type Entry = { hash: string; width: number; height: number; widths: number[] };
type Source = ImageMetadata | { src: string; width: number; height: number };

const manifests = import.meta.glob<Record<string, Entry>>('../data/image-manifest.json', {
  eager: true,
  import: 'default',
});
const manifest: Record<string, Entry> = Object.values(manifests)[0] ?? {};
const keys = Object.keys(manifest);

export interface Slot {
  /** Media condition, e.g. "(max-width: 640px)"; the last slot has none (all other screens). */
  media?: string;
  /** The image box's width on those screens, e.g. "100vw", "min(100vw, 1152px)", "286px". */
  width: string;
  /** The box's widest width in CSS pixels on those screens. */
  maxPx: number;
  /** True when the photo is cropped to fill the box (object-fit: cover). */
  cover?: boolean;
  /** Box width ÷ height when cropped (e.g. 2.4 for the banner, 4/3 for a card). */
  frameRatio?: number;
  /** Zoom on top of the crop (heroZoom, thumbnailZoom, a placement's zoom). */
  zoom?: number;
}

export interface Responsive {
  src: string;
  srcset?: string;
  sizes?: string;
}

/** The manifest entry for a photo, found by its file path (Astro's private fsPath). */
const entryFor = (image: Source): Entry | undefined => {
  const fsPath = (image as { fsPath?: string }).fsPath;
  if (!fsPath) return undefined;
  const normalised = fsPath.replace(/\\/g, '/');
  const key = keys.find((k) => normalised.endsWith(`/${k}`));
  return key ? manifest[key] : undefined;
};

export const responsiveImage = (image: Source, slots: Slot[]): Responsive => {
  const entry = entryFor(image);
  if (!entry) return { src: image.src };

  const photoRatio = entry.width / entry.height;
  const scale = (slot: Slot) => {
    const crop = slot.cover && slot.frameRatio ? Math.max(1, photoRatio / slot.frameRatio) : 1;
    return Math.round(crop * (slot.zoom ?? 1) * 100) / 100;
  };
  const sizes = slots
    .map((slot) => {
      const factor = scale(slot);
      const size = factor === 1 ? slot.width : `calc(${slot.width} * ${factor})`;
      return slot.media ? `${slot.media} ${size}` : size;
    })
    .join(', ');
  const url = (w: number) => `/img/${entry.hash}/${w}.webp`;
  const srcset = entry.widths.map((w) => `${url(w)} ${w}w`).join(', ');
  // For browsers that ignore srcset: a mid-size copy.
  const fallback = entry.widths.filter((w) => w <= 1280).at(-1) ?? entry.widths[0];
  return { src: url(fallback), srcset, sizes };
};

/**
 * Pins an image to its original's exact proportions. Where the box's height follows the
 * photo (the banner on phones shows the whole photo), a web-sized copy's rounded height
 * would otherwise shift the page by a fraction of a pixel. Ignored where the box has a set
 * width and height.
 */
export const aspectStyle = (image: { width: number; height: number }, style?: string) =>
  [style, `aspect-ratio: ${image.width} / ${image.height}`].filter(Boolean).join('; ');

/** Box widths used by more than one placement. */
export const SLOTS = {
  /** The article / edition / homepage banner: whole photo on phones, cropped above 640px. */
  banner: (zoom?: number, zoomOnPhones = false): Slot[] => [
    {
      media: '(max-width: 640px)',
      width: '100vw',
      maxPx: 640,
      zoom: zoomOnPhones ? zoom : 1,
    },
    { width: 'min(100vw, 1152px)', maxPx: 1152, cover: true, frameRatio: 2.38, zoom },
  ],
  /** A pillar page's header photo (cropped at every width). */
  pillarHeader: (): Slot[] => [
    { media: '(max-width: 640px)', width: '100vw', maxPx: 640, cover: true, frameRatio: 1.4 },
    { width: 'min(100vw, 1152px)', maxPx: 1152, cover: true, frameRatio: 2.7 },
  ],
};

/**
 * The link-preview image for a photo (og:image and the structured data): its 1280px JPEG
 * web copy, stamped "© Sokéfi" where the photo is Veronica's, never the original file (whose
 * metadata can include GPS location). A photo not in the manifest is used as it is.
 */
export const shareImage = (image: Source): string => {
  const entry = entryFor(image);
  return entry ? `/img/${entry.hash}/share.jpg` : image.src;
};
