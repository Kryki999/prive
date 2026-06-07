const CMD = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

export function transformPath(d, cal, scaleX, srcCx = 156) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const out = [];
  let i = 0;
  let cmd = '';
  const tx = (x) => Math.round(cal.translateX + cal.targetCenterX + (x - srcCx) * scaleX);
  const ty = (y) => Math.round(cal.translateY + y * cal.scaleY);

  while (i < tokens.length) {
    const t = tokens[i];
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      out.push(cmd);
      i++;
      if (cmd === 'Z' || cmd === 'z') continue;
    }
    const u = cmd.toUpperCase();
    const cnt = CMD[u] ?? 2;
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

export function transformPoint(p, cal, scaleX, srcCx = 156) {
  return {
    x: Math.round(cal.translateX + cal.targetCenterX + (p.x - srcCx) * scaleX),
    y: Math.round(cal.translateY + p.y * cal.scaleY),
  };
}

function collectEndpoints(d) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const points = [];
  let i = 0;
  let cmd = '';
  let lastX = 0;
  let lastY = 0;

  while (i < tokens.length) {
    const t = tokens[i];
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      i++;
      if (cmd === 'Z' || cmd === 'z') continue;
    }
    const u = cmd.toUpperCase();
    const cnt = CMD[u] ?? 2;
    if (u === 'H') {
      lastX = +tokens[i];
      points.push({ x: lastX, y: lastY });
      i++;
      continue;
    }
    if (u === 'V') {
      lastY = +tokens[i];
      points.push({ x: lastX, y: lastY });
      i++;
      continue;
    }
    if (u === 'C') {
      const x = +tokens[i + 4];
      const y = +tokens[i + 5];
      lastX = x;
      lastY = y;
      points.push({ x, y });
      i += 6;
      continue;
    }
    for (let j = 0; j < cnt && i < tokens.length; j++) {
      const v = +tokens[i];
      if (j % 2 === 0) lastX = v;
      else {
        lastY = v;
        points.push({ x: lastX, y: lastY });
      }
      i++;
    }
  }
  return points;
}

function scalpAtLocal(profile, y) {
  let best = profile[0];
  let bestD = Infinity;
  for (const p of profile) {
    const d = Math.abs(p.y - y);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

/**
 * Snap zone outer-edge endpoints to scalp profile lx/rx.
 * Side-aware: left horns snap left only, right horns snap right only, full-width zones snap both.
 */
export function snapPathToProfile(d, profile, config, scalpCenterX, yRange = {}) {
  const endpoints = collectEndpoints(d);
  const xs = endpoints.map((p) => p.x);
  const ys = endpoints.map((p) => p.y);
  const pathMinX = Math.min(...xs);
  const pathMaxX = Math.max(...xs);
  const pathMinY = yRange.minY ?? Math.min(...ys);
  const pathMaxY = yRange.maxY ?? Math.max(...ys);
  const pathWidth = Math.max(pathMaxX - pathMinX, 1);
  const topCutoff = pathMinY + (pathMaxY - pathMinY) * config.TOP_EDGE_FRACTION;
  const edgeThreshold = pathWidth * config.ZONE_EDGE_THRESHOLD;

  const isLeftOnly = pathMaxX < scalpCenterX;
  const isRightOnly = pathMinX > scalpCenterX;
  const snapLeft = isLeftOnly || (!isLeftOnly && !isRightOnly);
  const snapRight = isRightOnly || (!isLeftOnly && !isRightOnly);

  let maxResidualError = 0;
  let snappedCount = 0;

  const snapX = (x, y, allowSnap) => {
    if (!allowSnap) return Math.round(x);

    const s = scalpAtLocal(profile, y);
    const inset = config.PROFILE_INSET;
    const zoneLeftDist = x - pathMinX;
    const zoneRightDist = pathMaxX - x;
    const inTopBand = y <= topCutoff;
    const limit = edgeThreshold * (inTopBand ? 2 : 1) * 1.5;

    if (snapLeft && zoneLeftDist <= limit) {
      snappedCount++;
      return Math.round(s.lx + inset);
    }
    if (snapRight && zoneRightDist <= limit) {
      snappedCount++;
      return Math.round(s.rx - inset);
    }

    return Math.round(x);
  };

  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const out = [];
  let i = 0;
  let cmd = '';
  let lastY = 0;

  while (i < tokens.length) {
    const t = tokens[i];
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      out.push(cmd);
      i++;
      if (cmd === 'Z' || cmd === 'z') continue;
    }
    const u = cmd.toUpperCase();
    const cnt = CMD[u] ?? 2;

    if (u === 'H') {
      const x = snapX(+tokens[i], lastY, true);
      out.push(String(x));
      i++;
      continue;
    }
    if (u === 'V') {
      lastY = +tokens[i];
      out.push(String(lastY));
      i++;
      continue;
    }
    if (u === 'C') {
      let x1 = +tokens[i];
      const y1 = +tokens[i + 1];
      let x2 = +tokens[i + 2];
      const y2 = +tokens[i + 3];
      let x = +tokens[i + 4];
      const y = +tokens[i + 5];
      x1 = snapX(x1, y1, true);
      x2 = snapX(x2, y2, true);
      x = snapX(x, y, true);
      lastY = y;
      out.push(String(x1), String(y1), String(x2), String(y2), String(x), String(y));
      i += 6;
      continue;
    }
    for (let j = 0; j < cnt && i < tokens.length; j++) {
      const v = +tokens[i];
      if (j % 2 === 0) {
        out.push(String(snapX(v, lastY, true)));
      } else {
        lastY = v;
        out.push(String(v));
      }
      i++;
    }
  }

  return { path: out.join(' '), maxEdgeError: maxResidualError, snappedCount };
}

export function pathBounds(d) {
  const n = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  const xs = [];
  const ys = [];
  for (let i = 0; i < n.length; i += 2) {
    xs.push(n[i]);
    ys.push(n[i + 1]);
  }
  if (!xs.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}
