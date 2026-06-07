/**

 * Generates public/debug-zones.png — man.webp + colored zone overlays for visual QA.

 * Run: node scripts/calibrate-zones.mjs

 */

import sharp from 'sharp';

import { readFileSync } from 'fs';

import { fileURLToPath } from 'url';

import { dirname, join } from 'path';



const __dirname = dirname(fileURLToPath(import.meta.url));

const root = join(__dirname, '..');



const CALIBRATION = {

  sourceCenterX: 156,

  targetCenterX: 1347,

  scaleY: 3.8,

  translateY: 88,

  translateX: -28,

};



const ZONE_SCALE_X = {

  'zone-1': 3,

  'zone-2': 2.78,

  'zone-3': 2.78,

  'zone-4': 3.05,

  'zone-5': 3.18,

  'zone-6': 3.1,

};



const CMD_ARG_COUNT = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };



function transformPath(d, cal, scaleX) {

  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];

  const out = [];

  let i = 0;

  let cmd = '';

  const tx = (x) =>

    Math.round(cal.translateX + cal.targetCenterX + (x - cal.sourceCenterX) * scaleX);

  const ty = (y) => Math.round(cal.translateY + y * cal.scaleY);



  while (i < tokens.length) {

    const token = tokens[i];

    if (/[a-zA-Z]/.test(token)) {

      cmd = token;

      out.push(cmd);

      i += 1;

      if (cmd === 'Z' || cmd === 'z') continue;

    }

    const upper = cmd.toUpperCase();

    const count = CMD_ARG_COUNT[upper] ?? 2;

    if (upper === 'Z') continue;

    if (upper === 'H') {

      out.push(String(tx(parseFloat(tokens[i]))));

      i += 1;

      continue;

    }

    if (upper === 'V') {

      out.push(String(ty(parseFloat(tokens[i]))));

      i += 1;

      continue;

    }

    for (let j = 0; j < count && i < tokens.length; j += 1) {

      const value = parseFloat(tokens[i]);

      if (j % 2 === 0) out.push(String(tx(value)));

      else out.push(String(ty(value)));

      i += 1;

    }

  }

  return out.join(' ');

}



const clinicana = JSON.parse(

  readFileSync(join(__dirname, 'clinicana-paths.snapshot.json'), 'utf8'),

);



const COLORS = {

  'zone-1': 'rgba(229,0,126,0.45)',

  'zone-2': 'rgba(117,31,94,0.4)',

  'zone-3': 'rgba(0,120,255,0.35)',

  'zone-4': 'rgba(0,180,120,0.35)',

  'zone-5': 'rgba(255,140,0,0.4)',

  'zone-6': 'rgba(255,220,0,0.45)',

};



const WIDTH = 2656;

const HEIGHT = 1600;



const pathsSvg = clinicana

  .map(({ zone, paths, fillRule }) => {

    const fill = COLORS[zone];

    const sx = ZONE_SCALE_X[zone];

    return paths

      .map((d) => {

        const td = transformPath(d, CALIBRATION, sx);

        const rule = fillRule ? ` fill-rule="${fillRule}"` : '';

        return `<path d="${td}" fill="${fill}" stroke="#751F5E" stroke-width="4" stroke-dasharray="12 8"${rule}/>`;

      })

      .join('\n');

  })

  .join('\n');



const svg = `<?xml version="1.0" encoding="UTF-8"?>

<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">

${pathsSvg}

</svg>`;



const base = await sharp(join(root, 'public', 'man.webp')).ensureAlpha().png().toBuffer();

const overlay = await sharp(Buffer.from(svg)).png().toBuffer();



const composite = await sharp(base)

  .composite([{ input: overlay, blend: 'over' }])

  .png()

  .toBuffer();



await sharp(composite).toFile(join(root, 'public', 'debug-zones.png'));

console.log('Wrote public/debug-zones.png');



function pathMaxY(d) {

  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];

  const ys = [];

  for (let i = 1; i < nums.length; i += 2) ys.push(nums[i]);

  return Math.max(...ys);

}



const z2 = clinicana.find((z) => z.zone === 'zone-2');

const z2max = pathMaxY(transformPath(z2.paths[0], CALIBRATION, ZONE_SCALE_X['zone-2']));

const z6cy = CALIBRATION.translateY + 34 * CALIBRATION.scaleY;

console.log('zone-2 bottom Y:', z2max);

console.log('zone-6 center Y:', Math.round(z6cy));

