import type { CalibrationParams } from './transform';

import type { ZoneId } from './types';



/**

 * man.webp opaque scalp: minX=282 maxX=2412 minY=106 maxY=1598 centerX≈1347

 *

 * scaleY compressed so the map fits higher on the head (more forehead, crown at top).

 */

export const SCALP_BOUNDS = {

  minX: 282,

  maxX: 2412,

  minY: 106,

  maxY: 1598,

  centerX: 1347,

  centerY: 852,

} as const;



export const CALIBRATION: CalibrationParams = {

  sourceCenterX: 156,

  targetCenterX: SCALP_BOUNDS.centerX,

  scaleY: 3.8,

  translateX: -28,

  translateY: 88,

};



export const ZONE_SCALE_X: Record<ZoneId, number> = {

  'zone-1': 3,

  'zone-2': 2.78,

  'zone-3': 2.78,

  'zone-4': 3.05,

  'zone-5': 3.18,

  'zone-6': 3.1,

};

