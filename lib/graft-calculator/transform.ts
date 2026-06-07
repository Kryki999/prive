export interface CalibrationParams {

  sourceCenterX: number;

  targetCenterX: number;

  scaleY: number;

  translateX: number;

  translateY: number;

}



const CMD_ARG_COUNT: Record<string, number> = {

  M: 2,

  L: 2,

  H: 1,

  V: 1,

  C: 6,

  S: 4,

  Q: 4,

  T: 2,

  A: 7,

  Z: 0,

};



function argCount(cmd: string): number {

  const upper = cmd.toUpperCase();

  return CMD_ARG_COUNT[upper] ?? 2;

}



function transformX(x: number, scaleX: number, cal: CalibrationParams): number {

  return Math.round(

    cal.translateX + cal.targetCenterX + (x - cal.sourceCenterX) * scaleX,

  );

}



function transformY(y: number, cal: CalibrationParams): number {

  return Math.round(cal.translateY + y * cal.scaleY);

}



/**

 * Uniform scaleX per path — preserves Bézier curve shape (Clinicana-style).

 * Use per-zone scaleX overrides instead of per-point interpolation.

 */

export function transformPath(d: string, cal: CalibrationParams, scaleX: number): string {

  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];

  const out: string[] = [];

  let i = 0;

  let cmd = '';



  while (i < tokens.length) {

    const token = tokens[i];

    if (/[a-zA-Z]/.test(token)) {

      cmd = token;

      out.push(cmd);

      i += 1;

      if (cmd === 'Z' || cmd === 'z') continue;

    }



    const upper = cmd.toUpperCase();

    const count = argCount(cmd);



    if (upper === 'Z') continue;



    if (upper === 'H') {

      out.push(String(transformX(parseFloat(tokens[i]), scaleX, cal)));

      i += 1;

      continue;

    }



    if (upper === 'V') {

      out.push(String(transformY(parseFloat(tokens[i]), cal)));

      i += 1;

      continue;

    }



    for (let j = 0; j < count && i < tokens.length; j += 1) {

      const value = parseFloat(tokens[i]);

      if (j % 2 === 0) {

        out.push(String(transformX(value, scaleX, cal)));

      } else {

        out.push(String(transformY(value, cal)));

      }

      i += 1;

    }

  }



  return out.join(' ');

}



export function transformPaths(

  paths: string[],

  cal: CalibrationParams,

  scaleX: number,

): string[] {

  return paths.map((path) => transformPath(path, cal, scaleX));

}



export function transformPoint(

  p: { x: number; y: number },

  cal: CalibrationParams,

  scaleX: number,

): { x: number; y: number } {

  return {

    x: transformX(p.x, scaleX, cal),

    y: transformY(p.y, cal),

  };

}



/** Approximate centroid from all coordinate pairs in a path */

export function pathCentroid(d: string): { x: number; y: number } {

  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];

  const points: { x: number; y: number }[] = [];

  let i = 0;

  let cmd = '';



  while (i < tokens.length) {

    const token = tokens[i];

    if (/[a-zA-Z]/.test(token)) {

      cmd = token;

      i += 1;

      if (cmd === 'Z' || cmd === 'z') continue;

    }



    const upper = cmd.toUpperCase();

    const count = argCount(cmd);

    if (upper === 'Z') continue;



    if (upper === 'H') {

      points.push({ x: parseFloat(tokens[i]), y: points.at(-1)?.y ?? 0 });

      i += 1;

      continue;

    }



    if (upper === 'V') {

      points.push({ x: points.at(-1)?.x ?? 0, y: parseFloat(tokens[i]) });

      i += 1;

      continue;

    }



    for (let j = 0; j < count && i < tokens.length; j += 2) {

      const x = parseFloat(tokens[i]);

      const y = parseFloat(tokens[i + 1]);

      if (Number.isFinite(x) && Number.isFinite(y)) {

        points.push({ x, y });

      }

      i += 2;

    }

  }



  if (points.length === 0) return { x: 0, y: 0 };



  const sum = points.reduce(

    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),

    { x: 0, y: 0 },

  );



  return {

    x: Math.round(sum.x / points.length),

    y: Math.round(sum.y / points.length),

  };

}



/** Min/max Y from path coordinates */

export function pathBoundsY(d: string): { minY: number; maxY: number } {

  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];

  let minY = Infinity;

  let maxY = -Infinity;

  let i = 0;

  let cmd = '';



  while (i < tokens.length) {

    const token = tokens[i];

    if (/[a-zA-Z]/.test(token)) {

      cmd = token;

      i += 1;

      continue;

    }



    const upper = cmd.toUpperCase();

    const count = argCount(cmd);

    if (upper === 'Z') continue;



    if (upper === 'V') {

      const y = parseFloat(tokens[i]);

      minY = Math.min(minY, y);

      maxY = Math.max(maxY, y);

      i += 1;

      continue;

    }



    if (upper === 'H') {

      i += 1;

      continue;

    }



    for (let j = 0; j < count && i < tokens.length; j += 2) {

      const y = parseFloat(tokens[i + 1]);

      if (Number.isFinite(y)) {

        minY = Math.min(minY, y);

        maxY = Math.max(maxY, y);

      }

      i += 2;

    }

  }



  return { minY, maxY };

}

