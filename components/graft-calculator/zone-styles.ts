export type ZoneVisualState = 'idle' | 'hover' | 'active' | 'hint';

/** Fill reaguje na hover / zaznaczenie; obrys stref — stały (patrz ZONE_STROKE). */
export const ZONE_VISUAL: Record<ZoneVisualState, { fill: string }> = {
  idle: {
    fill: 'rgba(229, 0, 126, 0.08)',
  },
  hover: {
    fill: 'rgba(229, 0, 126, 0.18)',
  },
  active: {
    fill: 'rgba(229, 0, 126, 0.32)',
  },
  hint: {
    fill: 'rgba(229, 0, 126, 0.22)',
  },
};

/** Jednolity cienki przerywany obrys — bez zmian przy interakcji. */
export const ZONE_STROKE = {
  stroke: 'rgba(117, 31, 94, 0.68)',
  strokeWidth: 5,
  dash: '9 7',
} as const;
