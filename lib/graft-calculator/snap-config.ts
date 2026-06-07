import type { ZoneId } from './types';

/** Fraction of zone width — point must be this close to zone edge to snap to scalp */
export const ZONE_EDGE_THRESHOLD = 0.2;

/** @deprecated alias kept for script parser compatibility */
export const EDGE_THRESHOLD = ZONE_EDGE_THRESHOLD;

/** Pixels inset inside the green-dot boundary so strokes stay on skin */
export const PROFILE_INSET = 3;

/** Zones whose outer edges snap to the scalp profile */
export const SNAP_ZONES: readonly ZoneId[] = ['zone-1', 'zone-2', 'zone-4', 'zone-5'];

/** zone-5 evenodd: only snap the outer ring (paths[0]); inner hole stays calibrated */
export const ZONE5_SNAP_PATH_INDEX = 0;

/** Top 15% of zone Y-range — extra side-edge snap for crown zones */
export const TOP_EDGE_FRACTION = 0.15;

/** Smooth traced paths on import (Catmull-Rom splines; zone-6 = perfect ellipse) */
export const SMOOTH_TRACED_PATHS = true;

/** Default spline tension (0.5 = smooth arcs through your points) */
export const SMOOTH_TENSION = 0.5;

export const SNAP_CONFIG = {
  ZONE_EDGE_THRESHOLD,
  PROFILE_INSET,
  SNAP_ZONES,
  ZONE5_SNAP_PATH_INDEX,
  TOP_EDGE_FRACTION,
  SMOOTH_TRACED_PATHS,
  SMOOTH_TENSION,
} as const;
