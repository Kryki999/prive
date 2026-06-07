/**
 * Pixel-based auto-calibration: scans man.webp alpha, optimizes transform params.
 * Run: node scripts/fit-zones-to-scalp.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SRC_CX = 156;
const INSET = 0.05;
const CMD = { M: 2, L: 2, H: 1, V: 1, C: 6, Z: 0 };

async function scanScalpProfile(imagePath) {
  const { data, info } = await sharp(imagePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const { width, height } = info;
  const profile = [];
  for (let y = 0; y < height; y++) {
    let lx = width,
      rx = -1;
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 20) {
        if (x < lx) lx = x;
        if (x > rx) rx = x;
      }
    }
    if (rx > lx) profile.push({ y, lx, rx, cx: (lx + rx) / 2, w: rx - lx });
  }
  const bounds = {
    minY: profile[0].y,
    maxY: profile.at(-1).y,
    minX: Math.min(...profile.map((p) => p.lx)),
    maxX: Math.max(...profile.map((p) => p.rx)),
    centerX: profile.reduce((s, p) => s + p.cx, 0) / profile.length,
  };
  return { profile, bounds, width, height };
}

function scalpAt(profile, y) {
  let best = profile[0],
    bestD = Infinity;
  for (const p of profile) {
    const d = Math.abs(p.y - y);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  const inset = Math.round(best.w * INSET);
  return { lx: best.lx + inset, rx: best.rx - inset, cx: best.cx, w: best.w - 2 * inset };
}

function transformPath(d, cal, scaleX) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const out = [];
  let i = 0,
    cmd = '';
  const tx = (x) =>
    Math.round(cal.translateX + cal.targetCenterX + (x - SRC_CX) * scaleX);
  const ty = (y) => Math.round(cal.translateY + y * cal.scaleY);
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      out.push(cmd);
      i++;
      if (cmd === 'Z' || cmd === 'z') continue;
    }
    const u = cmd.toUpperCase(),
      cnt = CMD[u] ?? 2;
    if (u === 'H') {
      out.push(String(tx(+tokens[i])));
      i++;
      continue;
    }
    if (u === 'V') {
      out.push(String(ty(+tokens[i])));
      i++;
      continue;
    }
    for (let j = 0; j < cnt && i < tokens.length; j++) {
      const v = +tokens[i];
      out.push(String(j % 2 === 0 ? tx(v) : ty(v)));
      i++;
    }
  }
  return out.join(' ');
}

function pathBoundsSource(d) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  let i = 0,
    cmd = '',
    lastX = 0,
    lastY = 0;
  const xs = [],
    ys = [];
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      i++;
      if (cmd === 'Z' || cmd === 'z') continue;
    }
    const u = cmd.toUpperCase(),
      cnt = CMD[u] ?? 2;
    if (u === 'H') {
      lastX = +tokens[i];
      xs.push(lastX);
      ys.push(lastY);
      i++;
      continue;
    }
    if (u === 'V') {
      lastY = +tokens[i];
      xs.push(lastX);
      ys.push(lastY);
      i++;
      continue;
    }
    for (let j = 0; j < cnt && i < tokens.length; j += 2) {
      lastX = +tokens[i];
      lastY = +tokens[i + 1];
      xs.push(lastX);
      ys.push(lastY);
      i += 2;
    }
  }
  return {
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    midY: (Math.min(...ys) + Math.max(...ys)) / 2,
    maxHalf: Math.max(...xs.map((x) => Math.abs(x - SRC_CX))),
  };
}

function pathBoundsTarget(d) {
  const n = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  const xs = [],
    ys = [];
  for (let i = 0; i < n.length; i += 2) {
    xs.push(n[i]);
    ys.push(n[i + 1]);
  }
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    midY: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
}

/** Per-zone scaleX multiplier clamped around 1.0 */
const ZONE_ORDER = ['zone-6', 'zone-5', 'zone-4', 'zone-3', 'zone-2', 'zone-1'];
const ZONE_MULT_RANGE = {
  'zone-6': [1.05, 1.2],
  'zone-5': [0.95, 1.1],
  'zone-4': [0.95, 1.08],
  'zone-3': [0.92, 1.05],
  'zone-2': [0.9, 1.02],
  'zone-1': [0.88, 1.0],
};

function computeError(profile, cal, baseScaleX, mults, clinicana) {
  let err = 0;
  for (const { zone, paths } of clinicana) {
    const sx = baseScaleX * mults[zone];
    for (const p of paths) {
      const td = transformPath(p, cal, sx);
      const b = pathBoundsTarget(td);
      const s = scalpAt(profile.profile, b.midY);
      const leftGap = b.minX - s.lx;
      const rightGap = s.rx - b.maxX;
      err += (leftGap - rightGap) ** 2;
      err += Math.max(0, s.lx - b.minX) ** 2 * 4;
      err += Math.max(0, b.maxX - s.rx) ** 2 * 4;
      err += Math.abs(b.midY - (cal.translateY + pathBoundsSource(p).midY * cal.scaleY)) * 0.01;
    }
  }
  return err;
}

function optimize(profile, clinicana) {
  const crownY = profile.bounds.minY + 10;
  const hairlineY = 928;

  let best = { err: Infinity };

  for (let scaleY = 3.55; scaleY <= 3.95; scaleY += 0.02) {
    const translateY = Math.round(crownY - 1.5 * scaleY);
    const targetCenterX = Math.round(profile.bounds.centerX);

    for (let baseSx = 2.6; baseSx <= 3.4; baseSx += 0.04) {
      for (let translateX = -40; translateX <= 20; translateX += 2) {
        const cal = {
          sourceCenterX: SRC_CX,
          targetCenterX,
          scaleY: +scaleY.toFixed(3),
          translateY,
          translateX,
        };

        const mults = {};
        for (const zone of ZONE_ORDER) {
          const [lo, hi] = ZONE_MULT_RANGE[zone];
          let bestM = 1,
            bestE = Infinity;
          for (let m = lo; m <= hi; m += 0.02) {
            mults[zone] = m;
            const e = computeError(profile, cal, baseSx, mults, clinicana);
            if (e < bestE) {
              bestE = e;
              bestM = m;
            }
          }
          mults[zone] = +bestM.toFixed(2);
        }

        const err = computeError(profile, cal, baseSx, mults, clinicana);
        const z2 = clinicana.find((z) => z.zone === 'zone-2');
        const z2b = pathBoundsTarget(
          transformPath(z2.paths[0], cal, baseSx * mults['zone-2']),
        );

        if (err < best.err && z2b.maxY >= hairlineY - 30 && z2b.maxY <= hairlineY + 25) {
          const zoneScaleX = Object.fromEntries(
            ZONE_ORDER.map((z) => [z, +(baseSx * mults[z]).toFixed(3)]),
          );
          best = { err, cal, zoneScaleX, z2bottom: z2b.maxY };
        }
      }
    }
  }
  return best;
}

async function writeDebug(profile, cal, zoneScaleX, clinicana) {
  const scalpEdge = profile.profile
    .filter((_, i) => i % 6 === 0)
    .flatMap((p) => [
      `<circle cx="${p.lx}" cy="${p.y}" r="2" fill="#00ff88"/>`,
      `<circle cx="${p.rx}" cy="${p.y}" r="2" fill="#00ff88"/>`,
    ])
    .join('');
  const COLORS = {
    'zone-1': 'rgba(229,0,126,0.4)',
    'zone-2': 'rgba(117,31,94,0.35)',
    'zone-3': 'rgba(0,120,255,0.3)',
    'zone-4': 'rgba(0,180,120,0.3)',
    'zone-5': 'rgba(255,140,0,0.35)',
    'zone-6': 'rgba(255,220,0,0.4)',
  };
  const paths = clinicana
    .flatMap(({ zone, paths, fillRule }) =>
      paths.map((d) => {
        const td = transformPath(d, cal, zoneScaleX[zone]);
        const rule = fillRule ? ` fill-rule="${fillRule}"` : '';
        return `<path d="${td}" fill="${COLORS[zone]}" stroke="#751F5E" stroke-width="3" stroke-dasharray="10 8"${rule}/>`;
      }),
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${profile.width}" height="${profile.height}" viewBox="0 0 ${profile.width} ${profile.height}">${scalpEdge}${paths}</svg>`;
  const base = await sharp(join(root, 'public', 'man.webp')).ensureAlpha().png().toBuffer();
  const overlay = await sharp(Buffer.from(svg)).png().toBuffer();
  const out = await sharp(base).composite([{ input: overlay, blend: 'over' }]).png().toBuffer();
  await sharp(out).toFile(join(root, 'public', 'debug-scalp-profile.png'));
  await sharp(out).toFile(join(root, 'public', 'debug-zones.png'));
}

const profile = await scanScalpProfile(join(root, 'public', 'man.webp'));
const clinicana = JSON.parse(readFileSync(join(__dirname, 'clinicana-paths.snapshot.json'), 'utf8'));

console.log('Scalp bounds (pixels):', profile.bounds);

const best = optimize(profile, clinicana);
if (!best.cal) {
  console.error('Optimization failed');
  process.exit(1);
}

console.log('\n=== Optimized calibration ===');
console.log('CALIBRATION:', JSON.stringify(best.cal, null, 2));
console.log('ZONE_SCALE_X:', JSON.stringify(best.zoneScaleX, null, 2));
console.log('Error score:', Math.round(best.err));
console.log('Zone-2 bottom Y:', best.z2bottom);

await writeDebug(profile, best.cal, best.zoneScaleX, clinicana);
writeFileSync(
  join(__dirname, 'fit-result.json'),
  JSON.stringify(
    { calibration: best.cal, zoneScaleX: best.zoneScaleX, score: best.err, bounds: profile.bounds },
    null,
    2,
  ),
);
console.log('\nGreen dots = scalp edge from pixel scan');
console.log('Wrote public/debug-scalp-profile.png, scripts/fit-result.json');
