/**
 * Parametric graft zone map — shared ellipse arcs, symmetric handles.
 */
import {
  ellipsePathFromParams,
  ellipseTopArcPath,
  ellipseBottomArcPath,
  sharedEllipseCurves,
  symmetricQuadraticArc,
} from './path-smooth.js';

function round(n) {
  return Math.round(n);
}

function pt(p) {
  return [round(p.x), round(p.y)];
}

/** Default layout calibrated to man.webp (2656×1600). */
export const DEFAULT_ZONE_PARAMS = {
  version: 9,
  centerX: 1334,
  /** Korona — owal (elipsa) */
  z6: { cy: 193, rx: 195, ry: 85 },
  /** Pasmo wokół korony — rogi + osobne sterowanie górnego łuku i dołu */
  z5: {
    topL: { x: 919, y: 102 },
    topBendL: { x: 1000, y: 78 },
    peakY: 96,
    bottomL: { x: 919, y: 318 },
    bottomPeakY: 326,
  },
  z3: { cy: 516, rx: 318, ry: 89 },
  z4: {
    flankL: { x: 876, y: 492 },
    outerL: { x: 938, y: 318 },
    backL: { x: 956, y: 278 },
  },
  z2: {
    flankL: { x: 868, y: 532 },
    hairlineL: { x: 863, y: 601 },
    peakY: 774,
    sideBendL: { x: 883, y: 528 },
  },
  z1: {
    bulgeL: { x: 976, y: 720 },
    tipL: { x: 889, y: 774 },
  },
};

/** Przesuwa etykietę od zewnętrznej krawędzi w stronę środka (t=1 → środek). */
function inwardLabelX(cx, edgeX, t = 0.58) {
  return round(edgeX + (cx - edgeX) * t);
}

function mirrorX(cx, x) {
  return round(2 * cx - x);
}

function ellFrom(cx, { cy, rx, ry }) {
  return { cx: round(cx), cy: round(cy), rx: round(rx), ry: round(ry) };
}

/** Strefa 6 — czworokąt z zaokrąglonym szczytem, rogi w uchwytach */
export function crownQuadPath(cx, { topL, bottomL, peakY }) {
  const tL = pt(topL);
  const tR = [mirrorX(cx, tL[0]), tL[1]];
  const bL = pt(bottomL);
  const bR = [mirrorX(cx, bL[0]), bL[1]];
  const peak = [cx, round(peakY)];

  return (
    `M ${bL[0]} ${bL[1]}` +
    ` L ${tL[0]} ${tL[1]}` +
    ` Q ${tL[0]} ${peak[1]} ${peak[0]} ${peak[1]}` +
    ` Q ${tR[0]} ${peak[1]} ${tR[0]} ${tR[1]}` +
    ` L ${bR[0]} ${bR[1]}` +
    ` L ${bL[0]} ${bL[1]} Z`
  );
}

/** Strefa 5 — zewnętrzna obwódka pasma z osobnym sterowaniem górnego łuku (4→6) i dołu */
export function bandOuterPath(cx, { topL, topBendL, peakY, bottomL, bottomPeakY }) {
  const tL = pt(topL);
  const tR = [mirrorX(cx, tL[0]), tL[1]];
  const bL = pt(bottomL);
  const bR = [mirrorX(cx, bL[0]), bL[1]];
  const peak = [cx, round(peakY)];
  const tbL = pt(topBendL);
  const tbR = [mirrorX(cx, tbL[0]), tbL[1]];
  const bPeak = round(bottomPeakY);

  return (
    `M ${bL[0]} ${bL[1]}` +
    ` L ${tL[0]} ${tL[1]}` +
    ` Q ${tbL[0]} ${tbL[1]} ${peak[0]} ${peak[1]}` +
    ` Q ${tbR[0]} ${tbR[1]} ${tR[0]} ${tR[1]}` +
    ` L ${bR[0]} ${bR[1]}` +
    ` Q ${cx} ${bPeak} ${bL[0]} ${bL[1]} Z`
  );
}

/** Obrys strefy 5 — boki i góra; dół (granica 4/5) w overlay strefy 4, owal 6 w overlay strefy 6 */
export function bandOuterStrokePath(cx, { topL, topBendL, peakY, bottomL }) {
  const tL = pt(topL);
  const tR = [mirrorX(cx, tL[0]), tL[1]];
  const bL = pt(bottomL);
  const bR = [mirrorX(cx, bL[0]), bL[1]];
  const peak = [cx, round(peakY)];
  const tbL = pt(topBendL);
  const tbR = [mirrorX(cx, tbL[0]), tbL[1]];

  return (
    `M ${bL[0]} ${bL[1]}` +
    ` L ${tL[0]} ${tL[1]}` +
    ` Q ${tbL[0]} ${tbL[1]} ${peak[0]} ${peak[1]}` +
    ` Q ${tbR[0]} ${tbR[1]} ${tR[0]} ${tR[1]}` +
    ` L ${bR[0]} ${bR[1]}`
  );
}

function flankToJunction(from, junction, side = 'left') {
  const midX =
    side === 'left'
      ? round((from[0] + junction[0]) / 2 - 18)
      : round((from[0] + junction[0]) / 2 + 18);
  const midY = round((from[1] + junction[1]) / 2 - 10);
  return ` Q ${midX} ${midY} ${junction[0]} ${junction[1]}`;
}

function junctionToFlank(junction, flank, side = 'right') {
  const midX =
    side === 'right'
      ? round((junction[0] + flank[0]) / 2 + 18)
      : round((junction[0] + flank[0]) / 2 - 18);
  const midY = round((junction[1] + flank[1]) / 2 - 10);
  return ` Q ${midX} ${midY} ${flank[0]} ${flank[1]}`;
}

function wingClose(junction, wingStart, side = 'left') {
  const midX =
    side === 'left'
      ? round((junction[0] + wingStart[0]) / 2 - 22)
      : round((junction[0] + wingStart[0]) / 2 + 22);
  const midY = round((junction[1] + wingStart[1]) / 2 + 10);
  return ` Q ${midX} ${midY} ${wingStart[0]} ${wingStart[1]}`;
}

function smoothChain(points) {
  if (points.length < 2) return '';
  let d = '';
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    d += ` Q ${round((a[0] + b[0]) / 2)} ${round((a[1] + b[1]) / 2)} ${b[0]} ${b[1]}`;
  }
  return d;
}

export function normalizeParams(raw) {
  const p = { ...DEFAULT_ZONE_PARAMS, ...raw };
  const cx = p.centerX;

  if (p.z6?.topL && p.z6?.cy == null) {
    const topY = p.z6.topL.y;
    const bottomY = p.z6.bottomL.y;
    const rx = round((cx - p.z6.topL.x + cx - p.z6.bottomL.x) / 2);
    p.z6 = {
      cy: round((topY + bottomY) / 2),
      rx,
      ry: Math.max(20, round((bottomY - topY) / 2)),
    };
  }

  if (raw.version < 3) {
    if (raw.z5?.cy != null) {
      const topY = raw.z5.cy - raw.z5.ry;
      const bottomY = Math.min(raw.z5.cy + raw.z5.ry, 360);
      const rx = raw.z5.rx;
      p.z5 = {
        topL: { x: cx - rx, y: topY },
        bottomL: { x: cx - rx, y: bottomY },
        peakY: topY - 6,
      };
    }
    if (raw.z4?.outerSideL) {
      p.z4 = {
        flankL: raw.z4.flankL,
        outerL: raw.z4.outerSideL,
        backR: raw.z4.outerBackR ?? raw.z4.backR,
      };
    }
    if (raw.z2?.sideR) {
      p.z2 = {
        flankL: raw.z2.flankL,
        hairlineL: raw.z2.hairlineL,
        peakY: raw.z2.peakY,
        sideBendL: {
          x: mirrorX(cx, raw.z2.sideR.x),
          y: raw.z2.sideR.y,
        },
      };
    }
  }

  if (p.z2?.sideBendR && !p.z2?.sideBendL) {
    p.z2.sideBendL = {
      x: mirrorX(cx, p.z2.sideBendR.x),
      y: p.z2.sideBendR.y,
    };
    delete p.z2.sideBendR;
  }

  if (p.z5?.topY != null && !p.z5?.topL) {
    const topY = p.z5.topY;
    const bottomY = p.z5.bottomY;
    const rx = p.z5.rx ?? 415;
    p.z5 = {
      topL: { x: cx - rx, y: topY },
      topBendL: { x: cx - rx * 0.75, y: topY - 6 },
      peakY: topY - 6,
      bottomL: { x: cx - rx, y: bottomY },
    };
  }

  if (p.z5?.topL && !p.z5?.topBendL) {
    p.z5.topBendL = { x: round(cx - (cx - p.z5.topL.x) * 0.75), y: (p.z5.peakY ?? 96) - 18 };
  }

  if (p.z4?.backR && !p.z4?.backL) {
    p.z4.backL = { x: mirrorX(cx, p.z4.backR.x), y: p.z4.backR.y };
  }
  delete p.z4?.backR;

  if (p.z5?.bottomL && p.z4?.outerL) {
    p.z5.bottomL = { ...p.z5.bottomL, y: p.z4.outerL.y };
  }
  if (p.z5?.bottomL && p.z5.bottomPeakY == null) {
    p.z5.bottomPeakY = p.z5.bottomL.y + 8;
  }

  p.version = 9;
  return p;
}

export function buildZoneMap(inputParams = DEFAULT_ZONE_PARAMS) {
  const params = normalizeParams(inputParams);
  const cx = round(params.centerX);
  const e3 = ellFrom(cx, params.z3);
  const { topCurve, bottomCurve, junctions } = sharedEllipseCurves(e3);
  const ellipse3Top = ellipseTopArcPath(e3);
  const ellipse3Bottom = ellipseBottomArcPath(e3);
  const jL = junctions.left;
  const jR = junctions.right;

  const e6 = ellFrom(cx, params.z6);
  const zone6Path = ellipsePathFromParams(e6);
  const zone5Path = `${bandOuterPath(cx, params.z5)} ${zone6Path}`;
  const zone5Stroke = bandOuterStrokePath(cx, params.z5);
  const zone6Stroke = zone6Path;
  const zone3Path = ellipsePathFromParams(e3);

  const f4L = pt(params.z4.flankL);
  const f4R = [mirrorX(cx, f4L[0]), f4L[1]];
  const oL = pt(params.z4.outerL);
  const oR = [mirrorX(cx, oL[0]), oL[1]];
  const backL = pt(params.z4.backL);
  const backR = [mirrorX(cx, backL[0]), backL[1]];

  const zone4OuterTop = smoothChain([f4R, backR, oR, oL, backL, f4L]);

  const zone4Path =
    `M ${f4L[0]} ${f4L[1]}` +
    flankToJunction(f4L, jL, 'left') +
    ` ${topCurve}` +
    junctionToFlank(jR, f4R, 'right') +
    zone4OuterTop +
    ' Z';

  // Górny łuk elipsy 3 rysowany tu (granica 3/4) — nie duplikować w zone-3 overlay
  const zone4Stroke = [
    `M ${f4L[0]} ${f4L[1]}${flankToJunction(f4L, jL, 'left')}`,
    `${ellipse3Top}${junctionToFlank(jR, f4R, 'right')}${zone4OuterTop}`,
  ];

  const f2L = pt(params.z2.flankL);
  const hairL = pt(params.z2.hairlineL);
  const hairR = [mirrorX(cx, hairL[0]), hairL[1]];
  const peak = [cx, round(params.z2.peakY)];
  const hairlineD = symmetricQuadraticArc(hairL, peak, hairR);

  // Wspólna granica 2/4 — ten sam łuk co strefa 4 (lewa i prawa)
  const wingFromJL = junctionToFlank(jL, f4L, 'left');
  const wingToJR = flankToJunction(f4R, jR, 'right');

  const zone2Path =
    `M ${f2L[0]} ${f2L[1]}` +
    ` L ${hairL[0]} ${hairL[1]}` +
    ` Q ${peak[0]} ${peak[1]} ${hairR[0]} ${hairR[1]}` +
    ` L ${f4R[0]} ${f4R[1]}` +
    wingToJR +
    ` ${bottomCurve}` +
    wingFromJL +
    ` L ${f2L[0]} ${f2L[1]} Z`;

  // Dolny łuk elipsy 3 + front; łuki skroń–węzeł tylko w obrysie strefy 4
  const zone2Stroke =
    `M ${f2L[0]} ${f2L[1]} L ${hairL[0]} ${hairL[1]} ${hairlineD.slice(hairlineD.indexOf('Q'))}` +
    ` L ${f4R[0]} ${f4R[1]}` +
    `${ellipse3Bottom} M ${f4L[0]} ${f4L[1]} L ${f2L[0]} ${f2L[1]}`;

  const bulgeL = pt(params.z1.bulgeL);
  const bulgeR = [mirrorX(cx, bulgeL[0]), bulgeL[1]];
  const tipL = pt(params.z1.tipL);
  const tipR = [mirrorX(cx, tipL[0]), tipL[1]];

  const zone1Left =
    `M ${hairL[0]} ${hairL[1]}` + smoothChain([hairL, bulgeL, tipL]) + ` L ${hairL[0]} ${hairL[1]} Z`;
  const zone1Right =
    `M ${hairR[0]} ${hairR[1]}` + smoothChain([hairR, bulgeR, tipR]) + ` L ${hairR[0]} ${hairR[1]} Z`;

  const z6Bottom = e6.cy + e6.ry;
  const z5Bottom = pt(params.z5.bottomL)[1];
  const z3Top = e3.cy - e3.ry;
  const z3Bottom = e3.cy + e3.ry;
  const z2PeakY = params.z2.peakY;

  const z5Y = round(z6Bottom + (z5Bottom - z6Bottom) * 0.52);
  const z5EdgeX = round((pt(params.z5.topL)[0] + pt(params.z5.bottomL)[0]) / 2);
  const z5LeftX = inwardLabelX(cx, z5EdgeX, 0.48);
  const z4Y = round(z5Bottom + (z3Top - z5Bottom) * 0.5);
  const z4EdgeX = round((f4L[0] + oL[0]) / 2);
  const z4LeftX = inwardLabelX(cx, z4EdgeX, 0.48);
  const z2Y = round(z3Bottom + (z2PeakY - z3Bottom) * 0.22);
  const z2EdgeX = round((f2L[0] + hairL[0]) / 2);
  const z2LeftX = inwardLabelX(cx, z2EdgeX, 0.56);

  const labels = {
    'zone-6': [{ x: cx, y: e6.cy }],
    'zone-5': [
      { x: z5LeftX, y: z5Y },
      { x: mirrorX(cx, z5LeftX), y: z5Y },
    ],
    'zone-4': [
      { x: z4LeftX, y: z4Y },
      { x: mirrorX(cx, z4LeftX), y: z4Y },
    ],
    'zone-3': [{ x: cx, y: e3.cy }],
    'zone-2': [
      { x: z2LeftX, y: z2Y },
      { x: mirrorX(cx, z2LeftX), y: z2Y },
    ],
    'zone-1': [
      {
        x: round((hairL[0] + bulgeL[0] + tipL[0]) / 3),
        y: round((hairL[1] + bulgeL[1] + tipL[1]) / 3),
      },
      {
        x: round((hairR[0] + bulgeR[0] + tipR[0]) / 3),
        y: round((hairR[1] + bulgeR[1] + tipR[1]) / 3),
      },
    ],
  };

  return {
    zones: {
      'zone-6': { paths: [zone6Path] },
      'zone-5': { paths: [zone5Path], fillRule: 'evenodd' },
      'zone-4': { paths: [zone4Path] },
      'zone-3': { paths: [zone3Path] },
      'zone-2': { paths: [zone2Path] },
      'zone-1': { paths: [zone1Left, zone1Right] },
    },
    strokeOverlays: {
      'zone-6': [zone6Stroke],
      'zone-5': [zone5Stroke],
      'zone-4': zone4Stroke,
      'zone-2': [zone2Stroke],
    },
    labels,
    params,
  };
}

export function getEditorHandles(params = DEFAULT_ZONE_PARAMS) {
  const p = normalizeParams(params);
  const cx = p.centerX;
  const z5tL = p.z5.topL;
  const z5tbL = p.z5.topBendL;
  const z5bL = p.z5.bottomL;

  return [
    { num: 1, id: 'z6.top', label: '6 góra owalu', x: cx, y: p.z6.cy - p.z6.ry, group: 'z6', onPath: true },
    { num: 2, id: 'z6.bottom', label: '6 dół owalu', x: cx, y: p.z6.cy + p.z6.ry, group: 'z6', onPath: true },
    { num: 3, id: 'z6.rx', label: '6 szerokość', x: cx + p.z6.rx, y: p.z6.cy, group: 'z6', onPath: true },
    { num: 4, id: 'z5.topL', label: '5 róg góra L', x: z5tL.x, y: z5tL.y, group: 'z5', mirror: true, onPath: true },
    { num: 5, id: 'z5.topBendL', label: '5 łuk góra L', x: z5tbL.x, y: z5tbL.y, group: 'z5', mirror: true, onPath: false },
    { num: 6, id: 'z5.peak', label: '5 szczyt', x: cx, y: p.z5.peakY, group: 'z5', onPath: true },
    { num: 7, id: 'z5.bottomL', label: '5 róg dół L (na linii strefy 4)', x: z5bL.x, y: z5bL.y, group: 'z5', mirror: true, onPath: true },
    { num: 8, id: 'z5.bottomPeak', label: '5 wybrzuszenie dołu', x: cx, y: p.z5.bottomPeakY, group: 'z5', onPath: false },
    { num: 9, id: 'z3.top', label: '3 góra elipsy', x: cx, y: p.z3.cy - p.z3.ry, group: 'z3', onPath: true },
    { num: 10, id: 'z3.bottom', label: '3 dół elipsy', x: cx, y: p.z3.cy + p.z3.ry, group: 'z3', onPath: true },
    { num: 11, id: 'z3.rx', label: '3 szerokość', x: cx + p.z3.rx, y: p.z3.cy, group: 'z3', onPath: true },
    { num: 12, id: 'z4.flankL', label: '4 skroń', x: p.z4.flankL.x, y: p.z4.flankL.y, group: 'z4', mirror: true, onPath: true },
    { num: 13, id: 'z4.outerL', label: '4 bok zewn.', x: p.z4.outerL.x, y: p.z4.outerL.y, group: 'z4', mirror: true, onPath: true },
    { num: 14, id: 'z4.backL', label: '4 tył głowy', x: p.z4.backL.x, y: p.z4.backL.y, group: 'z4', mirror: true, onPath: true },
    { num: 15, id: 'z2.flankL', label: '2 skroń', x: p.z2.flankL.x, y: p.z2.flankL.y, group: 'z2', mirror: true, onPath: true },
    { num: 16, id: 'z2.hairlineL', label: '2 róg hairline L', x: p.z2.hairlineL.x, y: p.z2.hairlineL.y, group: 'z2', mirror: true, onPath: true },
    { num: 17, id: 'z2.peak', label: '2 szczyt łuku', x: cx, y: p.z2.peakY, group: 'z2', onPath: true },
    { num: 18, id: 'z1.bulgeL', label: '1 łuk skroni', x: p.z1.bulgeL.x, y: p.z1.bulgeL.y, group: 'z1', mirror: true, onPath: true },
    { num: 19, id: 'z1.tipL', label: '1 czubek rogu', x: p.z1.tipL.x, y: p.z1.tipL.y, group: 'z1', mirror: true, onPath: true },
  ].map((h) => ({ ...h, x: round(h.x), y: round(h.y) }));
}

export function applyHandleDrag(params, handleId, x, y) {
  const p = normalizeParams(JSON.parse(JSON.stringify(params)));
  const cx = p.centerX;
  const rx = (v) => Math.max(20, Math.abs(v - cx));

  switch (handleId) {
    case 'z6.top':
      p.z6.ry = Math.max(20, p.z6.cy - y);
      break;
    case 'z6.bottom':
      p.z6.ry = Math.max(20, y - p.z6.cy);
      break;
    case 'z6.rx':
      p.z6.rx = rx(x);
      break;
    case 'z5.topL':
      p.z5.topL = { x: Math.min(cx - 60, x), y };
      break;
    case 'z5.topBendL':
      p.z5.topBendL = { x: Math.min(cx - 40, x), y };
      break;
    case 'z5.peak':
      p.z5.peakY = y;
      break;
    case 'z5.bottomL':
      p.z5.bottomL = { x: Math.min(cx - 60, x), y: p.z4.outerL.y };
      break;
    case 'z5.bottomPeak':
      p.z5.bottomPeakY = y;
      break;
    case 'z3.top':
      p.z3.ry = Math.max(20, p.z3.cy - y);
      break;
    case 'z3.bottom':
      p.z3.ry = Math.max(20, y - p.z3.cy);
      break;
    case 'z3.rx':
      p.z3.rx = rx(x);
      break;
    case 'z4.flankL':
      p.z4.flankL = { x: Math.min(cx - 40, x), y };
      break;
    case 'z4.outerL':
      p.z4.outerL = { x: Math.min(cx - 60, x), y };
      break;
    case 'z4.backL':
      p.z4.backL = { x: Math.min(cx - 80, x), y };
      break;
    case 'z2.flankL':
      p.z2.flankL = { x: Math.min(cx - 40, x), y };
      break;
    case 'z2.hairlineL':
      p.z2.hairlineL = { x: Math.min(cx - 40, x), y };
      break;
    case 'z2.peak':
      p.z2.peakY = y;
      break;
    case 'z1.bulgeL':
      p.z1.bulgeL = { x: Math.min(cx - 20, x), y };
      break;
    case 'z1.tipL':
      p.z1.tipL = { x: Math.min(cx - 20, x), y };
      break;
    default:
      break;
  }
  return p;
}
