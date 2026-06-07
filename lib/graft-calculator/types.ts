export type ZoneId =
  | 'zone-1'
  | 'zone-2'
  | 'zone-3'
  | 'zone-4'
  | 'zone-5'
  | 'zone-6';

export interface GraftZone {
  id: ZoneId;
  label: string;
  graftRange: string;
  graftLabel: string;
  hairs: number;
  paths: string[];
  /** evenodd required for ring-shaped zone 5 (hole for zone 6) */
  fillRule?: 'evenodd' | 'nonzero';
  /** Stroke-only overlays (zones 2–4 share one ellipse seam, no double dashes) */
  strokePaths?: string[];
  labelPositions: { x: number; y: number }[];
}
