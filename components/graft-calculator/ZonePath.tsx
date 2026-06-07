'use client';

import type { GraftZone } from '@/lib/graft-calculator/types';
import type { ZoneVisualState } from '@/components/graft-calculator/zone-styles';
import { ZONE_STROKE, ZONE_VISUAL } from '@/components/graft-calculator/zone-styles';

interface ZonePathProps {
  zone: GraftZone;
  state: ZoneVisualState;
}

const FILL_ONLY_ZONES = new Set(['zone-2', 'zone-3', 'zone-4', 'zone-5', 'zone-6']);

export default function ZonePath({ zone, state }: ZonePathProps) {
  const visual = ZONE_VISUAL[state];
  const fillOnly = FILL_ONLY_ZONES.has(zone.id);

  return (
    <>
      {zone.paths.map((path, pathIndex) => (
        <path
          key={`${zone.id}-fill-${pathIndex}`}
          d={path}
          fill={visual.fill}
          stroke={fillOnly ? 'none' : ZONE_STROKE.stroke}
          fillRule={zone.fillRule ?? 'nonzero'}
          strokeWidth={fillOnly ? undefined : ZONE_STROKE.strokeWidth}
          strokeDasharray={fillOnly ? undefined : ZONE_STROKE.dash}
          strokeLinejoin="round"
          pointerEvents="none"
          className="transition-[fill] duration-200"
        />
      ))}
      {zone.strokePaths?.map((path, pathIndex) => (
        <path
          key={`${zone.id}-stroke-${pathIndex}`}
          d={path}
          fill="none"
          stroke={ZONE_STROKE.stroke}
          strokeWidth={ZONE_STROKE.strokeWidth}
          strokeDasharray={ZONE_STROKE.dash}
          strokeLinejoin="round"
          pointerEvents="none"
        />
      ))}
    </>
  );
}
