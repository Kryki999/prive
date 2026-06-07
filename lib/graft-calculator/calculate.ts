import type { GraftZone, ZoneId } from './types';

const HAIRS_PER_GRAFT = 2.2;

export function parseGraftValue(value: string): number {
  const raw = value.trim();
  if (!raw) return 0;

  if (raw.includes('-')) {
    const parts = raw.replace(/\s+/g, '').split('-');
    const min = parseInt(parts[0], 10);
    const max = parseInt(parts[1], 10);
    return Number.isFinite(min) && Number.isFinite(max) ? Math.round((min + max) / 2) : 0;
  }

  return parseInt(raw, 10) || 0;
}

export function formatGraftRange(range: string): string {
  return range.includes('-') ? range.replace(/\s*-\s*/g, ' - ') : range;
}

export interface GraftTotals {
  grafts: number;
  hairs: number;
  selectedCount: number;
}

export function calculateTotals(
  selected: ReadonlySet<ZoneId>,
  zones: readonly GraftZone[],
): GraftTotals {
  let grafts = 0;
  let hairs = 0;

  for (const zone of zones) {
    if (!selected.has(zone.id)) continue;
    const zoneGrafts = parseGraftValue(zone.graftRange);
    grafts += zoneGrafts;
    hairs += zone.hairs ?? Math.round(zoneGrafts * HAIRS_PER_GRAFT);
  }

  return { grafts, hairs, selectedCount: selected.size };
}
