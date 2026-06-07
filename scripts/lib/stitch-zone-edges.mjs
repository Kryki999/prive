/**
 * Align zone-2 / zone-4 shared edges to zone-3 ellipse boundary.
 */
import {
  simplifyPoints,
  smoothPathFromPoints,
  isOutsideEllipse,
  sharedEllipseCurves,
  quadraticPoint,
} from './path-smooth.mjs';

function round(n) {
  return Math.round(n);
}

/** Side wing connectors between zone 2 ↔ zone 4 (not part of zone-3 ellipse) */
function isFlankWingExcluded([x, y], ell, seam) {
  const nx = (x - ell.cx) / ell.rx;
  const ny = (y - ell.cy) / ell.ry;
  if (seam === 'bottom') {
    return Math.abs(nx) > 0.82 && ny > 0.18 && ny < 0.5;
  }
  return Math.abs(nx) > 1.0 && ny > -0.15 && ny < 0.05;
}

function isEllipseCoreSeam([x, y], ell, seam) {
  const nx = (x - ell.cx) / ell.rx;
  const ny = (y - ell.cy) / ell.ry;
  if (nx * nx + ny * ny > 1.25) return false;
  if (isFlankWingExcluded([x, y], ell, seam)) return false;
  if (seam === 'top') return ny <= 0.12;
  return ny >= -0.12;
}

/** Wing connectors outside ellipse at the ends of the shared arc */
function isSeamExtensionPoint([x, y], ell, seam, side) {
  const nx = (x - ell.cx) / ell.rx;
  if (seam === 'top') {
    if (y > ell.cy + 25) return false;
    if (side === 'before') {
      return nx < -1 && y >= ell.cy - ell.ry - 5;
    }
    if (side === 'after') {
      return nx > 1 && y >= ell.cy - 35;
    }
    return false;
  }
  if (y > ell.cy + ell.ry + 25 || y < ell.cy - 45) return false;
  if (side === 'before') {
    return nx > 1;
  }
  if (side === 'after') {
    return nx < -0.85;
  }
  return false;
}

function findSeamRangeCore(points, ell, seam) {
  const n = points.length;
  const core = points.map((p) => isEllipseCoreSeam(p, ell, seam));

  let bestStart = -1;
  let bestLen = 0;
  for (let start = 0; start < n; start++) {
    if (!core[start]) continue;
    let len = 0;
    for (let i = 0; i < n; i++) {
      if (core[(start + i) % n]) len++;
      else break;
    }
    if (len > bestLen) {
      bestLen = len;
      bestStart = start;
    }
  }

  if (bestLen < 2) return null;
  return { start: bestStart, end: (bestStart + bestLen - 1) % n };
}

/** Core ellipse run + wing extensions at both ends (for zone-4 / simple zone-2 stitch) */
function findSeamRange(points, ell, seam) {
  const core = findSeamRangeCore(points, ell, seam);
  if (!core) return null;

  const n = points.length;
  let { start, end } = core;

  for (let i = 0; i < 6; i++) {
    const prev = (start - 1 + n) % n;
    if (isSeamExtensionPoint(points[prev], ell, seam, 'before')) start = prev;
    else break;
  }
  for (let i = 0; i < 6; i++) {
    const next = (end + 1) % n;
    if (isSeamExtensionPoint(points[next], ell, seam, 'after')) end = next;
    else break;
  }

  return { start, end };
}

/** Front hairline on zone-2 (below zone-3, toward forehead) */
function isHairlineCore([x, y], ell) {
  if (isEllipseCoreSeam([x, y], ell, 'bottom')) return false;
  const nx = (x - ell.cx) / ell.rx;
  const ny = (y - ell.cy) / ell.ry;
  if (nx * nx + ny * ny <= 1.05) return false;
  if (y < ell.cy + ell.ry - 12 || y < 595) return false;
  if (Math.abs(nx) <= 1.55) return true;
  return y >= 598 && Math.abs(nx) <= 1.7;
}

function findHairlineRange(points, ell) {
  const n = points.length;
  const flags = points.map((p) => isHairlineCore(p, ell));

  let bestStart = -1;
  let bestLen = 0;
  for (let start = 0; start < n; start++) {
    if (!flags[start]) continue;
    let len = 0;
    for (let i = 0; i < n; i++) {
      if (flags[(start + i) % n]) len++;
      else break;
    }
    if (len > bestLen) {
      bestLen = len;
      bestStart = start;
    }
  }

  if (bestLen < 3) return null;
  return { start: bestStart, end: (bestStart + bestLen - 1) % n };
}

function collectChain(points, from, to) {
  const n = points.length;
  const out = [];
  for (let i = from; i !== to; i = (i + 1) % n) out.push(points[i]);
  return out;
}

function collectInclusive(points, start, end) {
  const n = points.length;
  const out = [];
  let i = start;
  while (true) {
    out.push(points[i]);
    if (i === end) break;
    i = (i + 1) % n;
  }
  return out;
}

function smoothOpenChain(points, simplify, tension) {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;
  let pts = points.map((p) => [p[0], p[1]]);
  if (simplify > 0) pts = simplifyPoints(pts, simplify, false);
  return smoothPathFromPoints(pts, false, tension);
}

/** Wing connectors stay outside ellipse and on the correct half (top = zone-4, bottom = zone-2). */
function filterWingForSeam(points, ell, seam, margin = 1.0) {
  return points.filter((p) => {
    if (!isOutsideEllipse(p, ell, margin)) return false;
    const ny = (p[1] - ell.cy) / ell.ry;
    if (seam === 'top') return ny <= 0.1;
    return ny >= -0.1;
  });
}

/** Quadratic from last wing point into ellipse junction (zone-4 upper flank). */
function flankApproachJunction(lastPt, junction, side = 'left') {
  const midX =
    side === 'left'
      ? Math.round((lastPt[0] + junction[0]) / 2 - 18)
      : Math.round((lastPt[0] + junction[0]) / 2 + 18);
  const midY = Math.round((lastPt[1] + junction[1]) / 2 - 10);
  return ` Q ${midX} ${midY} ${junction[0]} ${junction[1]}`;
}

/** Smooth close from ellipse junction back to wing start — stays in zone-2 lower flank (no overlap with zone-4). */
function wingCloseFromJunction(junction, wingStart, side = 'left') {
  const midX =
    side === 'left'
      ? Math.round((junction[0] + wingStart[0]) / 2 - 22)
      : Math.round((junction[0] + wingStart[0]) / 2 + 22);
  const midY = Math.round((junction[1] + wingStart[1]) / 2 + 10);
  return ` Q ${midX} ${midY} ${wingStart[0]} ${wingStart[1]} Z`;
}

function wingToJunctionD(wingPoints, ell, seam, simplify, tension, side = 'left') {
  const { left: junctionLeft, right: junctionRight } = sharedEllipseCurves(ell).junctions;
  const junction = side === 'left' ? junctionLeft : junctionRight;
  const filtered = filterWingForSeam(wingPoints, ell, seam);
  if (!filtered.length) return `M ${junction[0]} ${junction[1]}`;
  const d = smoothOpenChain(filtered, simplify, tension);
  const last = filtered[filtered.length - 1];
  return `${d}${flankApproachJunction(last, junction, side)}`;
}

function collectOuterPoints(points, seamStart, seamEnd) {
  const n = points.length;
  const outer = [];
  for (let i = (seamEnd + 1) % n; i !== seamStart; i = (i + 1) % n) {
    outer.push(points[i]);
  }
  return outer;
}

/**
 * Replace seam vertices with exact ellipse arc from zone-3.
 * @param {number[][]} tracedPoints
 * @param {{ cx, cy, rx, ry }} ell
 * @param {'top'|'bottom'} seam — top = zone-4 bottom, bottom = zone-2 inner top
 */
/** Zone-4: wing connectors + ellipse top + outer band (no diagonal chords) */
export function stitchZone4Boundaries(tracedPoints, ell, smoothOpts = {}) {
  const core = findSeamRangeCore(tracedPoints, ell, 'top');
  if (!core) return stitchZoneToEllipse(tracedPoints, ell, 'top', smoothOpts);

  const { simplify = 8, tension = 0.35 } = smoothOpts;
  const n = tracedPoints.length;
  const { start, end } = core;

  const leftWing = collectChain(tracedPoints, 0, start);
  const outerStart = findOuterStartIndex(tracedPoints, end);
  const rightWing = collectChain(tracedPoints, (end + 1) % n, outerStart);
  const outer = collectChain(tracedPoints, outerStart, 0);

  if (!leftWing.length || !outer.length) {
    return stitchZoneToEllipse(tracedPoints, ell, 'top', smoothOpts);
  }

  const { topCurve, junctions } = sharedEllipseCurves(ell);
  const { left: junctionLeft, right: junctionRight } = junctions;

  const leftWingD = wingToJunctionD(leftWing, ell, 'top', simplify, tension, 'left');
  const rightWingD =
    rightWing.length > 0
      ? wingToJunctionD(rightWing, ell, 'top', simplify, tension, 'right')
      : `M ${junctionRight[0]} ${junctionRight[1]}`;
  const outerD = smoothOpenChain(outer, simplify, tension);

  return (
    `${leftWingD} ${topCurve}` +
    (rightWingD ? rightWingD.replace(/^M (\d+) (\d+)/, ' L $1 $2') : '') +
    outerD.replace(/^M (\d+) (\d+)/, ' L $1 $2') +
    ` Z`
  );
}

/** Zone-4 outer border only (wings + band) — ellipse arc drawn once via zone-3 overlay. */
export function stitchZone4BorderStroke(tracedPoints, ell, smoothOpts = {}) {
  const core = findSeamRangeCore(tracedPoints, ell, 'top');
  if (!core) return null;

  const { simplify = 8, tension = 0.35 } = smoothOpts;
  const n = tracedPoints.length;
  const { start, end } = core;
  const leftWing = collectChain(tracedPoints, 0, start);
  const outerStart = findOuterStartIndex(tracedPoints, end);
  const rightWing = collectChain(tracedPoints, (end + 1) % n, outerStart);
  const outer = collectChain(tracedPoints, outerStart, 0);
  if (!leftWing.length || !outer.length) return null;

  const { junctions } = sharedEllipseCurves(ell);
  const { left: junctionLeft, right: junctionRight } = junctions;
  const leftWingD = wingToJunctionD(leftWing, ell, 'top', simplify, tension, 'left');
  const rightWingD =
    rightWing.length > 0
      ? wingToJunctionD(rightWing, ell, 'top', simplify, tension, 'right')
      : `M ${junctionRight[0]} ${junctionRight[1]}`;
  const outerD = smoothOpenChain(outer, simplify, tension);

  return (
    `${leftWingD}` +
    ` M ${junctionRight[0]} ${junctionRight[1]}` +
    (rightWingD ? rightWingD.replace(/^M (\d+) (\d+)/, ' L $1 $2') : '') +
    outerD.replace(/^M (\d+) (\d+)/, ' L $1 $2') +
    ` Z`
  );
}

function findOuterStartIndex(points, coreEnd) {
  const n = points.length;
  for (let i = (coreEnd + 1) % n; i !== coreEnd; i = (i + 1) % n) {
    const [x, y] = points[i];
    if (y < 380) return i;
  }
  return (coreEnd + 4) % n;
}

export function stitchZoneToEllipse(tracedPoints, ell, seam, smoothOpts = {}) {
  const range = findSeamRange(tracedPoints, ell, seam);
  if (!range || !tracedPoints.length) return null;

  const { start, end } = range;
  const seamStartPt = tracedPoints[start];
  const seamEndPt = tracedPoints[end];
  const outer = collectOuterPoints(tracedPoints, start, end);
  if (outer.length < 2) return null;

  const { simplify = 8, tension = 0.35 } = smoothOpts;
  let outerPts = outer.map((p) => [p[0], p[1]]);
  if (simplify > 0) outerPts = simplifyPoints(outerPts, simplify, false);
  const outerD = smoothPathFromPoints(outerPts, false, tension);

  const curves = sharedEllipseCurves(ell);
  const arcCurve = seam === 'top' ? curves.topCurve : curves.bottomCurve;
  const { left: arcLeft, right: arcRight } = curves.junctions;

  if (seam === 'top') {
    return (
      `${outerD}` +
      ` L ${seamStartPt[0]} ${seamStartPt[1]}` +
      ` L ${arcLeft[0]} ${arcLeft[1]} ${arcCurve}` +
      ` L ${seamEndPt[0]} ${seamEndPt[1]} Z`
    );
  }

  return (
    `${outerD}` +
    ` L ${seamStartPt[0]} ${seamStartPt[1]}` +
    ` L ${arcRight[0]} ${arcRight[1]} ${arcCurve}` +
    ` L ${seamEndPt[0]} ${seamEndPt[1]} Z`
  );
}

/**
 * Zone-2: ellipse seam (zone-3) + symmetric front hairline arc.
 */
export function stitchZone1Horn(hairline, outerPts, side, smoothOpts = {}) {
  const { left, peak, right, tSplit } = hairline;
  const { simplify = 4, tension = 0.45 } = smoothOpts;
  const steps = 5;
  const arcPts = [];

  if (side === 'left') {
    for (let i = 0; i <= steps; i++) {
      const t = (tSplit * i) / steps;
      arcPts.push(quadraticPoint(left, peak, right, t).map(round));
    }
  } else {
    for (let i = 0; i <= steps; i++) {
      const t = 1 - (tSplit * i) / steps;
      arcPts.push(quadraticPoint(left, peak, right, t).map(round));
    }
  }

  let outer = outerPts.map((p) => [p[0], p[1]]);
  const arcEnd = arcPts[arcPts.length - 1];
  if (outer.length && Math.hypot(outer[0][0] - arcEnd[0], outer[0][1] - arcEnd[1]) < 24) {
    outer = outer.slice(1);
  }
  if (simplify > 0 && outer.length > 2) outer = simplifyPoints(outer, simplify, false);

  let d = `M ${arcPts[0][0]} ${arcPts[0][1]}`;
  for (let i = 1; i < arcPts.length; i++) d += ` L ${arcPts[i][0]} ${arcPts[i][1]}`;

  if (outer.length > 1) {
    const outerD = smoothPathFromPoints(outer, false, tension);
    d += outerD.replace(/^M (\d+) (\d+)/, ' L $1 $2');
  }
  return `${d} Z`;
}

export function stitchZone2Boundaries(tracedPoints, ell, smoothOpts = {}, hairline = null) {
  const ellipseRange = findSeamRangeCore(tracedPoints, ell, 'bottom');
  const hairlineRange = findHairlineRange(tracedPoints, ell);
  if (!ellipseRange) return null;

  const { simplify = 8, tension = 0.35 } = smoothOpts;
  const n = tracedPoints.length;
  const { start: eStart, end: eEnd } = ellipseRange;

  if (!hairlineRange) {
    return stitchZoneToEllipse(tracedPoints, ell, 'bottom', smoothOpts);
  }

  const { start: hStart, end: hEnd } = hairlineRange;
  const wingSeg = collectChain(tracedPoints, (eEnd + 1) % n, hStart);
  const sideSeg = collectChain(tracedPoints, (hEnd + 1) % n, eStart);
  const hairlineSeg = collectInclusive(tracedPoints, hStart, hEnd);

  if (wingSeg.length < 1 || sideSeg.length < 1 || hairlineSeg.length < 2) {
    return stitchZoneToEllipse(tracedPoints, ell, 'bottom', smoothOpts);
  }

  const wingFiltered = filterWingForSeam(wingSeg, ell, 'bottom');
  if (wingFiltered.length < 1) return stitchZoneToEllipse(tracedPoints, ell, 'bottom', smoothOpts);

  const wingD = smoothOpenChain(wingFiltered, simplify, tension);
  let sideD = smoothOpenChain(sideSeg, simplify, tension);
  if (sideD && sideSeg.length > 1) {
    const [, ...sideTail] = sideSeg;
    sideD = smoothOpenChain(sideTail, simplify, tension).replace(/^M/, 'L');
  }

  const tracedPeakY = Math.max(...hairlineSeg.map((p) => p[1]));
  const leftPt = hairline?.left ?? [hairlineSeg[0][0], hairlineSeg[0][1]];
  const rightPt = hairline?.right ?? [hairlineSeg[hairlineSeg.length - 1][0], hairlineSeg[hairlineSeg.length - 1][1]];
  const peakY = hairline?.peakY ?? tracedPeakY;
  const peakX = hairline?.peak?.[0] ?? ell.cx;

  const { bottomCurve, junctions } = sharedEllipseCurves(ell);
  const { left: junctionLeft, right: junctionRight } = junctions;
  const wingStart = wingFiltered[0];
  const closeD = wingCloseFromJunction(junctionLeft, wingStart, 'left');

  // Polygon order: wing → hairline → sides → ellipse seam → curved close along lower flank
  return (
    `${wingD}` +
    ` L ${leftPt[0]} ${leftPt[1]}` +
    ` Q ${peakX} ${peakY} ${rightPt[0]} ${rightPt[1]} ` +
    sideD.replace(/^M (\d+) (\d+)/, 'L $1 $2') +
    ` L ${junctionRight[0]} ${junctionRight[1]} ${bottomCurve}${closeD}`
  );
}

/** Zone-2 outer border only — hairline + sides + wings; ellipse drawn once via zone-3 overlay. */
export function stitchZone2BorderStroke(tracedPoints, ell, smoothOpts = {}, hairline = null) {
  const ellipseRange = findSeamRangeCore(tracedPoints, ell, 'bottom');
  const hairlineRange = findHairlineRange(tracedPoints, ell);
  if (!ellipseRange || !hairlineRange) return null;

  const { simplify = 8, tension = 0.35 } = smoothOpts;
  const n = tracedPoints.length;
  const { start: eStart, end: eEnd } = ellipseRange;
  const { start: hStart, end: hEnd } = hairlineRange;
  const wingSeg = collectChain(tracedPoints, (eEnd + 1) % n, hStart);
  const sideSeg = collectChain(tracedPoints, (hEnd + 1) % n, eStart);
  const hairlineSeg = collectInclusive(tracedPoints, hStart, hEnd);
  if (wingSeg.length < 1 || sideSeg.length < 1 || hairlineSeg.length < 2) return null;

  const wingFiltered = filterWingForSeam(wingSeg, ell, 'bottom');
  if (!wingFiltered.length) return null;

  const wingD = smoothOpenChain(wingFiltered, simplify, tension);
  let sideD = smoothOpenChain(sideSeg, simplify, tension);
  if (sideD && sideSeg.length > 1) {
    const [, ...sideTail] = sideSeg;
    sideD = smoothOpenChain(sideTail, simplify, tension).replace(/^M/, 'L');
  }

  const tracedPeakY = Math.max(...hairlineSeg.map((p) => p[1]));
  const leftPt = hairline?.left ?? [hairlineSeg[0][0], hairlineSeg[0][1]];
  const rightPt = hairline?.right ?? [hairlineSeg[hairlineSeg.length - 1][0], hairlineSeg[hairlineSeg.length - 1][1]];
  const peakY = hairline?.peakY ?? tracedPeakY;
  const peakX = hairline?.peak?.[0] ?? ell.cx;
  const { junctions } = sharedEllipseCurves(ell);
  const wingStart = wingFiltered[0];
  const leftFlank = wingCloseFromJunction(junctions.left, wingStart, 'left').replace(' Z', '');

  return (
    `${wingD}` +
    ` L ${leftPt[0]} ${leftPt[1]}` +
    ` Q ${peakX} ${peakY} ${rightPt[0]} ${rightPt[1]} ` +
    sideD.replace(/^M (\d+) (\d+)/, 'L $1 $2') +
    ` L ${junctions.right[0]} ${junctions.right[1]}` +
    ` M ${junctions.left[0]} ${junctions.left[1]}${leftFlank}`
  );
}
