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
import { MINE, NOT_MINE } from '../src/data/photo-ownership.mjs';

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
const SHARE_WIDTH = 1280;

// "© Sokéfi" goes into the web copies of Veronica's own photos (src/data/photo-ownership.mjs),
// never stock or licensed ones and never the originals. Copies carry no other metadata (no
// camera details or GPS location from the original).
const OWNER = 'Sokéfi';
const COPYRIGHT = `© ${OWNER}`;
const STAMP_EXIF = { IFD0: { Copyright: COPYRIGHT, Artist: OWNER } };
const STAMP_XMP = `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
<dc:creator><rdf:Seq><rdf:li>${OWNER}</rdf:li></rdf:Seq></dc:creator>
<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${COPYRIGHT}</rdf:li></rdf:Alt></dc:rights>
<xmpRights:Marked>True</xmpRights:Marked>
</rdf:Description></rdf:RDF></x:xmpmeta>
<?xpacket end="w"?>`;
const mine = new Set(MINE);
const notMine = new Set(NOT_MINE);
const unmarked = [];

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
  const key = path.relative(ROOT, file).split(path.sep).join('/');
  const stamp = mine.has(key);
  if (!stamp && !notMine.has(key)) unmarked.push(key);
  // The stamp is part of the hash, so a photo's copies get a new address when it changes.
  const hash = crypto
    .createHash('sha1')
    .update(data)
    .update(stamp ? COPYRIGHT : '')
    .digest('hex')
    .slice(0, 12);
  const meta = await sharp(data).metadata();
  // EXIF orientation 5–8 swaps width and height; the site uses the photo as stored.
  const swap = (meta.orientation ?? 1) >= 5;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  const widths = WIDTHS.filter((w) => w < width);
  if (width <= WIDTHS.at(-1)) widths.push(width);
  else if (!widths.includes(WIDTHS.at(-1))) widths.push(WIDTHS.at(-1));

  // The WebP copies for the page, plus share.jpg: the link-preview image (og:image and the
  // structured data) at 1280px wide, as JPEG because some apps don't show WebP previews.
  const outputs = [
    ...widths.map((w) => ({ name: `${w}.webp`, width: w, format: 'webp' })),
    { name: 'share.jpg', width: Math.min(width, SHARE_WIDTH), format: 'jpeg' },
  ];
  const cached = path.join(CACHE, hash);
  const missing = outputs.filter((o) => !fs.existsSync(path.join(cached, o.name)));
  if (missing.length) {
    fs.mkdirSync(cached, { recursive: true });
    const base = sharp(data, { limitInputPixels: false }).rotate();
    for (const o of missing) {
      let copy = base.clone().resize({ width: o.width });
      if (stamp) {
        // From bare pixels, so nothing of the original's metadata (its preview thumbnail,
        // camera details) comes along with the stamp.
        const { data: pixels, info } = await copy.raw().toBuffer({ resolveWithObject: true });
        copy = sharp(pixels, { raw: info }).withExif(STAMP_EXIF).withXmp(STAMP_XMP);
      }
      await copy[o.format]({ quality: QUALITY }).toFile(path.join(cached, o.name));
      made++;
    }
  }
  const dir = path.join(OUT, hash);
  fs.mkdirSync(dir, { recursive: true });
  for (const o of outputs) {
    const target = path.join(dir, o.name);
    if (!fs.existsSync(target)) fs.copyFileSync(path.join(cached, o.name), target);
  }
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
  `build-images: ${files.length} photos (${files.filter((f) => mine.has(path.relative(ROOT, f).split(path.sep).join('/'))).length} stamped ${COPYRIGHT}), ${made} new copies, ${((Date.now() - started) / 1000).toFixed(1)}s`,
);
const missingListed = [...mine, ...notMine].filter((key) => !manifest[key]);
if (missingListed.length) {
  console.log(
    `build-images: listed in src/data/photo-ownership.mjs but not found (renamed or removed?):\n  ${missingListed.join('\n  ')}`,
  );
}
if (unmarked.length) {
  console.log(
    `build-images: not stamped, as they aren't in src/data/photo-ownership.mjs yet (add each to MINE or NOT_MINE):\n  ${unmarked.join('\n  ')}`,
  );
}
