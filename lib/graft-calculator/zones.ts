import { CALIBRATION } from './calibration';
import {
  SNAPPED_LABEL_POSITIONS,
  SNAPPED_ZONE_PATHS,
  ZONE_STROKE_OVERLAYS,
} from './snapped-paths.generated';
import type { GraftZone, ZoneId } from './types';

export type { GraftZone, ZoneId } from './types';

export const SCALP_IMAGE = {
  src: '/man.webp',
  width: 2656,
  height: 1600,
  aspectRatio: '2656/1600' as const,
};

export const SCALP_CENTER_X = CALIBRATION.targetCenterX;

/** Back-to-front paint order — smaller zones on top for accurate clicks */
export const ZONE_RENDER_ORDER: ZoneId[] = [
  'zone-2',
  'zone-4',
  'zone-3',
  'zone-5',
  'zone-1',
  'zone-6',
];

const GRAFT_METADATA: Record<
  ZoneId,
  { label: string; graftRange: string; graftLabel: string; hairs: number }
> = {
  'zone-1': {
    label: 'Strefa 1',
    graftRange: '600 - 800',
    graftLabel: '600 - 800 Grafty',
    hairs: 1560,
  },
  'zone-2': {
    label: 'Strefa 2',
    graftRange: '1900 - 2100',
    graftLabel: '1900 - 2100 Grafty',
    hairs: 4750,
  },
  'zone-3': {
    label: 'Strefa 3',
    graftRange: '900 - 1100',
    graftLabel: '900 - 1100 Grafty',
    hairs: 2200,
  },
  'zone-4': {
    label: 'Strefa 4',
    graftRange: '700 - 900',
    graftLabel: '700 - 900 Grafty',
    hairs: 1750,
  },
  'zone-5': {
    label: 'Strefa 5',
    graftRange: '1400 - 1600',
    graftLabel: '1400 - 1600 Grafty',
    hairs: 3500,
  },
  'zone-6': {
    label: 'Strefa 6',
    graftRange: '800',
    graftLabel: '800 Grafty',
    hairs: 1760,
  },
};

const ZONE_IDS_ORDER: ZoneId[] = ['zone-6', 'zone-5', 'zone-4', 'zone-3', 'zone-2', 'zone-1'];

function buildZones(): GraftZone[] {
  return ZONE_IDS_ORDER.map((id) => {
    const meta = GRAFT_METADATA[id];
    const source = SNAPPED_ZONE_PATHS[id];
    return {
      id,
      ...meta,
      paths: source.paths,
      fillRule: source.fillRule,
      strokePaths: ZONE_STROKE_OVERLAYS[id],
      labelPositions: SNAPPED_LABEL_POSITIONS[id],
    };
  });
}

export const GRAFT_ZONES: GraftZone[] = buildZones();

export const ZONE_IDS = GRAFT_ZONES.map((zone) => zone.id);
