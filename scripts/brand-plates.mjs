// Prepares the fleet photos: blurs anything that places the car in another
// country, covers every number plate with a "PERFICIENT" plate, then crops.
//
//   npm run brand-plates
//
// Reads the untouched photos in assets-src/fleet/ and writes the finished
// copies to src/assets/img/fleet/. All positions are pixels in the original
// photo (x/y = top-left corner, w/h = width/height).
//
// PLATES: skewY (degrees) tilts the plate's top and bottom edges to follow the
// car's angle, and rotate (degrees) turns it around its centre.
// BLUR: foreign signs, flags, stickers and lettering to soften.
// CROP: the part of the photo to keep. The fleet cards show photos at 4:3, so
// keep crops wide enough for the whole car to stay in frame.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets-src/fleet');
const OUT = path.join(root, 'src/assets/img/fleet');

const PLATES = {
  avalon: [
    { x: 972, y: 298, w: 74, h: 78, skewY: -6 },
    { x: 0, y: 216, w: 40, h: 26 }, // parked car behind
  ],
  camry: [{ x: 878, y: 547, w: 66, h: 52, skewY: -5 }],
  coaster: [{ x: 794, y: 540, w: 78, h: 56 }],
  corolla: [{ x: 694, y: 649, w: 98, h: 56, rotate: -7 }],
  gl550: [{ x: 926, y: 398, w: 86, h: 50, skewY: -15 }],
  gwagon: [{ x: 190, y: 465, w: 114, h: 50, skewY: 9 }],
  gx460: [{ x: 939, y: 342, w: 78, h: 52, skewY: -3 }],
  hiace: [{ x: 693, y: 462, w: 92, h: 40 }],
  hilux: [{ x: 182, y: 513, w: 78, h: 92, skewY: 9 }],
  'landcruiser-lux': [{ x: 890, y: 410, w: 66, h: 54, skewY: -5 }],
  landcruiser: [{ x: 845, y: 355, w: 104, h: 54, skewY: -8 }],
  'lx570-lux': [{ x: 106, y: 381, w: 120, h: 50, skewY: 3 }],
  'lx570-suv': [{ x: 146, y: 375, w: 74, h: 46, skewY: 4 }],
  prado: [{ x: 734, y: 390, w: 146, h: 60 }],
  'range-rover': [{ x: 179, y: 494, w: 110, h: 40, skewY: 2 }],
  rolls: [{ x: 194, y: 524, w: 206, h: 70, skewY: 3 }],
  s550: [
    { x: 903, y: 560, w: 132, h: 50, skewY: -10 },
    { x: 700, y: 145, w: 38, h: 16 }, // parked car behind
  ],
  sprinter: [], // Perficient's own photo: no plate showing
};

const BLUR = {
  avalon: [
    { x: 375, y: 25, w: 175, h: 45 }, // US dealer sticker on the windscreen
    { x: 785, y: 55, w: 120, h: 50 }, // dealer sticker, car behind
    { x: 1025, y: 80, w: 75, h: 30 }, // dealer sticker, car behind
  ],
  camry: [{ x: 55, y: 85, w: 55, h: 105 }], // US parking sign
  gwagon: [{ x: 990, y: 175, w: 110, h: 160 }], // Romanian shop posters
  hiace: [
    { x: 0, y: 0, w: 180, h: 215 }, // Chinese bank sign
    { x: 795, y: 55, w: 70, h: 115 }, // Chinese road signs
  ],
  'lx570-lux': [{ x: 120, y: 20, w: 90, h: 65 }], // German street sign
  prado: [{ x: 0, y: 0, w: 62, h: 148 }], // Chinese signs
  rolls: [
    { x: 200, y: 0, w: 270, h: 112 }, // "Parken verboten" sign
    { x: 470, y: 0, w: 490, h: 64 }, // German notices above the roof
    { x: 476, y: 100, w: 72, h: 100 }, // dealer paper on the windscreen
  ],
  s550: [
    { x: 40, y: 55, w: 360, h: 125 }, // resort lettering on the minivan behind
    { x: 690, y: 85, w: 120, h: 40 }, // car behind
  ],
};

const CROP = {
  sprinter: { x: 0, y: 105, w: 447, h: 335 }, // square photo to 4:3, keeping the whole van
};

const INK = '#0a0f16';
const IVORY = '#f5f1ea';

function plateSvg(plates, width, height) {
  const shapes = plates
    .map(({ x, y, w, h, skewY = 0, rotate = 0 }) => {
      const r = Math.max(2, Math.round(h * 0.1));
      const border = Math.max(1.5, h * 0.06);
      // librsvg ignores textLength, so size the type to fit: bold "PERFICIENT"
      // runs about 6 em wide in Helvetica/Arial.
      const fontSize = Math.min(h * 0.55, (w * 0.84) / 6);
      return `
  <g transform="translate(${x} ${y}) rotate(${rotate} ${w / 2} ${h / 2}) skewY(${skewY})">
    <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${IVORY}" stroke="${INK}" stroke-width="${border}"/>
    <text x="${w / 2}" y="${h / 2}" dominant-baseline="central" text-anchor="middle"
      font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${fontSize}"
      fill="${INK}">PERFICIENT</text>
  </g>`;
    })
    .join('');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${shapes}</svg>`);
}

// Blur the given regions, feathering the edges so they blend in.
async function blurRegions(input, regions, width, height) {
  const feather = 10;
  const rects = regions.map(({ x, y, w, h }) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>`).join('');
  const mask = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#000"/>${rects}</svg>`))
    .blur(feather)
    .extractChannel(0)
    .raw()
    .toBuffer();
  // Two steps: sharp doesn't apply blur and joinChannel in a single pipeline in order.
  const soft = await sharp(input).removeAlpha().blur(22).raw().toBuffer({ resolveWithObject: true });
  const blurred = await sharp(soft.data, { raw: soft.info })
    .joinChannel(mask, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();
  return sharp(input).composite([{ input: blurred }]).toBuffer();
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.jpg'));
const missing = files.filter((f) => !PLATES[path.basename(f, '.jpg')]);
if (missing.length) throw new Error(`No plate position set for: ${missing.join(', ')}`);

for (const file of files) {
  const name = path.basename(file, '.jpg');
  let buf = fs.readFileSync(path.join(SRC, file));
  const { width, height } = await sharp(buf).metadata();
  if (BLUR[name]) buf = await blurRegions(buf, BLUR[name], width, height);
  buf = await sharp(buf).composite([{ input: plateSvg(PLATES[name], width, height) }]).toBuffer();
  const crop = CROP[name];
  let out = sharp(buf);
  if (crop) out = out.extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h });
  await out.jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, file));
  console.log(`branded ${file}`);
}
