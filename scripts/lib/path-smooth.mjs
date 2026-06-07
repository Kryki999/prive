/**
 * Smooth hand-traced zones: Catmull-Rom Bézier (clean arcs, no Fourier ripples).
 * zone-6 → fitted ellipse (perfect oval on crown).
 */

const KAPPA = 0.5522847498;

function round(n) {
  return Math.round(n);
}

function perpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd[0] - lineStart[0];
  const dy = lineEnd[1] - lineStart[1];
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(point[0] - lineStart[0], point[1] - lineStart[1]);
  const t = ((point[0] - lineStart[0]) * dx + (point[1] - lineStart[1]) * dy) / lenSq;
  const px = lineStart[0] + t * dx;
  const py = lineStart[1] + t * dy;
  return Math.hypot(point[0] - px, point[1] - py);
}

function rdpOpen(points, epsilon) {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let maxIdx = 0;
  const start = points[0];
  const end = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }
  if (maxDist > epsilon) {
    const left = rdpOpen(points.slice(0, maxIdx + 1), epsilon);
    const right = rdpOpen(points.slice(maxIdx), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [start, end];
}

/** Mirror a closed path across vertical axis (for zone-1 horns) */
export function mirrorHorizontally(points, cx) {
  return [...points].reverse().map(([x, y]) => [round(2 * cx - x), y]);
}

/** Mirror open point chain without reversing order */
export function mirrorOpenChain(points, cx) {
  return points.map(([x, y]) => [round(2 * cx - x), y]);
}

/** Symmetric front hairline arc (quadratic Bézier) */
export function symmetricQuadraticArc(left, peak, right) {
  return `M ${round(left[0])} ${round(left[1])} Q ${round(peak[0])} ${round(peak[1])} ${round(right[0])} ${round(right[1])}`;
}

export function quadraticPoint(p0, pc, p1, t) {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * pc[0] + t * t * p1[0],
    u * u * p0[1] + 2 * u * t * pc[1] + t * t * p1[1],
  ];
}

/** Find t on quadratic arc where x ≈ targetX */
export function solveQuadraticTForX(p0, pc, p1, targetX, side = 'left') {
  let lo = side === 'left' ? 0 : 0.5;
  let hi = side === 'left' ? 0.5 : 1;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    if (quadraticPoint(p0, pc, p1, mid)[0] < targetX) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Hairline shared by zone-2 front + zone-1 temple junction */
export function hairlineFromZone1Horns(leftRaw, ell, tracedHairlineMaxY = 0) {
  const tipY = Math.max(...leftRaw.map((p) => p[1]));
  const peakY = Math.max(tipY, tracedHairlineMaxY);
  const cornerY = leftRaw[0][1];
  const left = [leftRaw[0][0], cornerY];
  const right = [round(2 * ell.cx - left[0]), cornerY];
  const peak = [ell.cx, round(peakY)];

  let splitIdx = 0;
  for (let i = 1; i < leftRaw.length - 1; i++) {
    if (leftRaw[i][0] > leftRaw[splitIdx][0]) splitIdx = i;
  }
  const tSplit = solveQuadraticTForX(left, peak, right, leftRaw[splitIdx][0], 'left');

  return { left, peak, right, peakY, splitIdx, tSplit };
}

/** Mirror left/right so bowl-shaped zones (e.g. zone-3) get even arcs */
export function symmetrizePoints(points, centerX = null) {
  const cx =
    centerX ?? Math.round(points.reduce((s, p) => s + p[0], 0) / Math.max(points.length, 1));
  const out = points.map((p) => [p[0], p[1]]);
  const used = new Set();

  for (let i = 0; i < out.length; i++) {
    if (used.has(i)) continue;
    const [x, y] = out[i];
    const dx = x - cx;
    if (Math.abs(dx) < 4) {
      out[i][0] = cx;
      continue;
    }

    let bestJ = -1;
    let best = Infinity;
    for (let j = 0; j < out.length; j++) {
      if (j === i || used.has(j)) continue;
      const dx2 = out[j][0] - cx;
      if (dx * dx2 >= 0) continue;
      const score = Math.abs(Math.abs(dx) - Math.abs(dx2)) + Math.abs(y - out[j][1]) * 0.25;
      if (score < best) {
        best = score;
        bestJ = j;
      }
    }
    if (bestJ < 0 || best > 50) continue;

    const yAvg = Math.round((y + out[bestJ][1]) / 2);
    const absDx = Math.round((Math.abs(dx) + Math.abs(out[bestJ][0] - cx)) / 2);
    if (dx < 0) {
      out[i] = [cx - absDx, yAvg];
      out[bestJ] = [cx + absDx, yAvg];
    } else {
      out[i] = [cx + absDx, yAvg];
      out[bestJ] = [cx - absDx, yAvg];
    }
    used.add(i);
    used.add(bestJ);
  }
  return out;
}

/** Drop jitter clicks — keeps shape corners, removes hand wobble */
export function simplifyPoints(points, epsilon, closed = true) {
  if (!epsilon || points.length <= 4) return points.map((p) => [p[0], p[1]]);
  if (closed) {
    const ring = [...points.map((p) => [p[0], p[1]]), [points[0][0], points[0][1]]];
    const out = rdpOpen(ring, epsilon);
    return out.slice(0, -1);
  }
  return rdpOpen(points.map((p) => [p[0], p[1]]), epsilon);
}

export function chaikinSmooth(points, iterations = 1, closed = true) {
  let pts = points.map((p) => [p[0], p[1]]);
  for (let iter = 0; iter < iterations; iter++) {
    const next = [];
    const len = pts.length;
    const last = closed ? len : len - 1;
    for (let i = 0; i < last; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % len];
      next.push([0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]]);
      next.push([0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]]);
    }
    if (!closed) {
      next.unshift([pts[0][0], pts[0][1]]);
      next.push([pts[pts.length - 1][0], pts[pts.length - 1][1]]);
    }
    pts = next;
  }
  return pts;
}

/** Perfect ellipse from traced points (zone-6 crown) */
export function ellipseParamsFromPoints(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const rx = (Math.max(...xs) - Math.min(...xs)) / 2;
  const ry = (Math.max(...ys) - Math.min(...ys)) / 2;
  if (rx < 2 || ry < 2) return null;
  return { cx: round(cx), cy: round(cy), rx: round(rx), ry: round(ry) };
}

export function ellipsePathFromParams({ cx, cy, rx, ry }) {
  const kx = round(rx * KAPPA);
  const ky = round(ry * KAPPA);
  return (
    `M ${cx} ${cy - ry}` +
    ` C ${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy}` +
    ` C ${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry}` +
    ` C ${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy}` +
    ` C ${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z`
  );
}

/** Upper half — shared with zone-4 bottom (left → right) */
export function ellipseTopArcPath({ cx, cy, rx, ry }) {
  const kx = round(rx * KAPPA);
  const ky = round(ry * KAPPA);
  return (
    `M ${cx - rx} ${cy}` +
    ` C ${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry}` +
    ` C ${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy}`
  );
}

/** True when point lies on or outside the ellipse (margin > 1 = small buffer). */
export function isOutsideEllipse([x, y], { cx, cy, rx, ry }, margin = 1.0) {
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  return nx * nx + ny * ny >= margin;
}

/** Equator junctions where zone-2 / zone-4 wings meet zone-3 ellipse. */
export function ellipseJunctions(ell) {
  return {
    left: [ell.cx - ell.rx, ell.cy],
    right: [ell.cx + ell.rx, ell.cy],
  };
}

/** Canonical ellipse segments — single source for zones 2, 3, 4. */
export function sharedEllipseCurves(ell) {
  const full = ellipsePathFromParams(ell);
  const topArc = ellipseTopArcPath(ell);
  const bottomArc = ellipseBottomArcPath(ell);
  return {
    full,
    topCurve: topArc.slice(topArc.indexOf('C')),
    bottomCurve: bottomArc.slice(bottomArc.indexOf('C')),
    junctions: ellipseJunctions(ell),
  };
}

/** Lower half — shared with zone-2 top inner edge (right → left) */
export function ellipseBottomArcPath({ cx, cy, rx, ry }) {
  const kx = round(rx * KAPPA);
  const ky = round(ry * KAPPA);
  return (
    `M ${cx + rx} ${cy}` +
    ` C ${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry}` +
    ` C ${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy}`
  );
}

export function ellipsePathFromPoints(points) {
  const params = ellipseParamsFromPoints(points);
  if (!params) return null;
  return ellipsePathFromParams(params);
}

export function smoothPathFromPoints(points, closed = true, tension = 0.5) {
  if (!points?.length) return '';
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;
  if (points.length === 2) {
    const d = `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;
    return closed ? `${d} Z` : d;
  }

  if (closed) {
    const n = points.length;
    let d = `M ${round(points[0][0])} ${round(points[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = points[(i - 1 + n) % n];
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      const p3 = points[(i + 2) % n];
      const cp1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
      const cp1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
      const cp2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
      const cp2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
      d += ` C ${round(cp1x)} ${round(cp1y)} ${round(cp2x)} ${round(cp2y)} ${round(p2[0])} ${round(p2[1])}`;
    }
    return `${d} Z`;
  }

  const ext = [points[0], ...points, points[points.length - 1]];
  let d = `M ${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 1; i < ext.length - 2; i++) {
    const p0 = ext[i - 1];
    const p1 = ext[i];
    const p2 = ext[i + 1];
    const p3 = ext[i + 2];
    const cp1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const cp1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const cp2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const cp2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C ${round(cp1x)} ${round(cp1y)} ${round(cp2x)} ${round(cp2y)} ${round(p2[0])} ${round(p2[1])}`;
  }
  return d;
}

export const DEFAULT_ZONE_SMOOTH = {
  'zone-6': { mode: 'ellipse', chaikin: 0, tension: 0.5, simplify: 0 },
  'zone-5': { mode: 'spline', chaikin: 0, tension: 0.35, simplify: 10 },
  'zone-4': { mode: 'spline', chaikin: 0, tension: 0.35, simplify: 8 },
  'zone-3': { mode: 'ellipse', chaikin: 0, tension: 0.5, simplify: 0, symmetrize: true },
  'zone-2': { mode: 'spline', chaikin: 0, tension: 0.4, simplify: 8 },
  'zone-1': { mode: 'spline', chaikin: 0, tension: 0.45, simplify: 2 },
};

/** @deprecated — kept for parser compat */
export const DEFAULT_ZONE_HARMONICS = {
  'zone-6': 5,
  'zone-5': 7,
  'zone-4': 9,
  'zone-3': 11,
  'zone-2': 13,
  'zone-1': 6,
};

export function smoothTracedPath(path, opts = {}) {
  const zoneId = opts.zoneId ?? 'zone-2';
  const preset = DEFAULT_ZONE_SMOOTH[zoneId] ?? { mode: 'spline', chaikin: 0, tension: 0.5, simplify: 6 };
  const {
    mode = preset.mode,
    chaikinIterations = preset.chaikin,
    tension = opts.tension ?? preset.tension,
    simplifyEpsilon = preset.simplify,
    symmetrize = preset.symmetrize,
    previewClosed = false,
  } = opts;

  const closed = path.closed !== false || previewClosed;
  let pts = (path.points ?? []).map((p) => [p[0], p[1]]);
  if (pts.length < 3) return pointsToLinePath(pts, path.closed !== false);

  if (symmetrize && closed) {
    pts = symmetrizePoints(pts);
  }

  if (mode === 'ellipse' && closed && pts.length >= 3) {
    const el = ellipsePathFromPoints(pts);
    if (el) return el;
  }

  if (simplifyEpsilon > 0) {
    pts = simplifyPoints(pts, simplifyEpsilon, closed);
  }

  if (chaikinIterations > 0 && closed) {
    pts = chaikinSmooth(pts, chaikinIterations, true);
  }

  return smoothPathFromPoints(pts, closed, tension);
}

function pointsToLinePath(points, closed) {
  if (!points.length) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) d += ` L ${points[i][0]} ${points[i][1]}`;
  if (closed && points.length > 2) d += ' Z';
  return d;
}
