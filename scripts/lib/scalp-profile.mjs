/**
 * Scalp edge profile from image alpha channel.
 * For each row Y: lx (left edge) and rx (right edge) in pixels.
 */
import sharp from 'sharp';

const ALPHA_THRESHOLD = 20;

/**
 * @param {string} imagePath
 * @returns {Promise<{ profile: { y: number; lx: number; rx: number; cx: number; w: number }[]; bounds: object; width: number; height: number }>}
 */
export async function scanScalpProfile(imagePath) {
  const { data, info } = await sharp(imagePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const { width, height } = info;
  const profile = [];
  for (let y = 0; y < height; y++) {
    let lx = width;
    let rx = -1;
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > ALPHA_THRESHOLD) {
        if (x < lx) lx = x;
        if (x > rx) rx = x;
      }
    }
    if (rx > lx) {
      profile.push({ y, lx, rx, cx: (lx + rx) / 2, w: rx - lx });
    }
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

/**
 * @param {{ y: number; lx: number; rx: number; cx: number; w: number }[]} profile
 * @param {number} y
 */
export function scalpAt(profile, y) {
  let best = profile[0];
  let bestD = Infinity;
  for (const p of profile) {
    const d = Math.abs(p.y - y);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return { lx: best.lx, rx: best.rx, cx: best.cx, w: best.w, y: best.y };
}

/**
 * @param {{ profile: object[]; bounds: object; width: number; height: number }} data
 */
export function serializeProfile(data) {
  return {
    width: data.width,
    height: data.height,
    bounds: data.bounds,
    profile: data.profile.map(({ y, lx, rx }) => ({ y, lx, rx })),
  };
}
