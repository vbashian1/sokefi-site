// Makes the web-sized copies of every photo the site shows (Veronica, 2026-10-27), before
// `astro build` and `astro dev` (npm prebuild / predev). The originals are only read, never
// changed: each photo in src/content and src/assets/images is resized to a set of widths
// and saved as WebP in public/img/<hash>/<width>.webp, so the live site serves ordinary
// static files (no resizing while a reader waits, and no limit on the original's size).
// src/data/image-manifest.json lists each photo's widths; src/utils/responsiveImage.ts
// turns that into srcset/sizes on the page. Copies already made are kept (by content hash),
// so only new or changed photos are processed.
//
//   node scripts/build-images.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCES = ['src/content', 'src/assets/images'];
const OUT = path.join(ROOT, 'public', 'img');
// Copies are kept here between builds (Vercel restores node_modules/.cache), so only new or
// changed photos are resized; public/img is refreshed from it each time.
const CACHE = path.join(ROOT, 'node_modules', '.cache', 'sokefi-img');
const MANIFEST = path.join(ROOT, 'src', 'data', 'image-manifest.json');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
// Widths a browser can choose from; the photo's own width caps the list (never upscaled).
const WIDTHS = [320, 480, 640, 800, 1000, 1280, 1600, 2000, 2560];
const QUALITY = 80;

// Folders that aren't part of the site (old trial copies, superseded files).
const SKIP_DIR = (name) => name.startsWith('Images - ') || name.startsWith('_');

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return SKIP_DIR(entry.name) ? [] : walk(full);
        return EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
      })
    : [];

const files = SOURCES.flatMap((dir) => walk(path.join(ROOT, dir)))
  // Signatures and other small graphics are served as they are.
  .filter((file) => !/signature/i.test(path.basename(file)));

const manifest = {};
let made = 0;
const started = Date.now();
for (const file of files) {
  const data = fs.readFileSync(file);
  const hash = crypto.createHash('sha1').update(data).digest('hex').slice(0, 12);
  const meta = await sharp(data).metadata();
  // EXIF orientation 5–8 swaps width and height; the site uses the photo as stored.
  const swap = (meta.orientation ?? 1) >= 5;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  const widths = WIDTHS.filter((w) => w < width);
  if (width <= WIDTHS.at(-1)) widths.push(width);
  else if (!widths.includes(WIDTHS.at(-1))) widths.push(WIDTHS.at(-1));

  const cached = path.join(CACHE, hash);
  const missing = widths.filter((w) => !fs.existsSync(path.join(cached, `${w}.webp`)));
  if (missing.length) {
    fs.mkdirSync(cached, { recursive: true });
    const base = sharp(data, { limitInputPixels: false }).rotate();
    for (const w of missing) {
      await base
        .clone()
        .resize({ width: w })
        .webp({ quality: QUALITY })
        .toFile(path.join(cached, `${w}.webp`));
      made++;
    }
  }
  const dir = path.join(OUT, hash);
  fs.mkdirSync(dir, { recursive: true });
  for (const w of widths) {
    const target = path.join(dir, `${w}.webp`);
    if (!fs.existsSync(target)) fs.copyFileSync(path.join(cached, `${w}.webp`), target);
  }
  const key = path.relative(ROOT, file).split(path.sep).join('/');
  manifest[key] = { hash, width, height, widths };
}

// Remove copies of photos that are no longer on the site.
const keep = new Set(Object.values(manifest).map((m) => m.hash));
if (fs.existsSync(OUT)) {
  for (const dir of fs.readdirSync(OUT)) {
    if (!keep.has(dir)) fs.rmSync(path.join(OUT, dir), { recursive: true, force: true });
  }
}

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `build-images: ${files.length} photos, ${made} new copies, ${((Date.now() - started) / 1000).toFixed(1)}s`,
);
