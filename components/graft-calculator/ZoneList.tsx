'use client';

import { useMemo, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type { GraftZone, ZoneId } from '@/lib/graft-calculator/zones';

interface ZoneListProps {
  zones: readonly GraftZone[];
  isSelected: (id: ZoneId) => boolean;
  onToggle: (id: ZoneId) => void;
  className?: string;
  variant?: 'card' | 'sheet';
  footer?: ReactNode;
}

function zoneNumber(id: ZoneId) {
  return parseInt(id.replace(/\D/g, ''), 10);
}

export default function ZoneList({
  zones,
  isSelected,
  onToggle,
  className,
  variant = 'card',
  footer,
}: ZoneListProps) {
  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => zoneNumber(a.id) - zoneNumber(b.id)),
    [zones],
  );

  return (
    <div
      className={cn(
        'bg-white',
        variant === 'card' && 'rounded-2xl border border-prive-border p-4 shadow-prive-card md:p-5',
        variant === 'sheet' &&
          'rounded-t-3xl rounded-b-2xl border border-t-0 border-prive-border p-3 shadow-lg',
        className,
      )}
    >
      <h3
        className={cn(
          'font-bold uppercase tracking-[0.1em] text-prive-plum',
          variant === 'sheet' ? 'mb-2 text-xs' : 'mb-3 text-sm',
        )}
      >
        Wybrane strefy
      </h3>

      <ul className="grid grid-cols-2 gap-1.5">
        {sortedZones.map((zone) => {
          const checked = isSelected(zone.id);

          return (
            <li key={zone.id}>
              <button
                type="button"
                onClick={() => onToggle(zone.id)}
                aria-pressed={checked}
                className={cn(
                  'flex h-full w-full cursor-pointer flex-col gap-0.5 rounded-xl border p-2 text-left transition-colors',
                  variant === 'sheet' && 'p-1.5',
                  checked
                    ? 'border-prive-rose/40 bg-prive-gradient-soft'
                    : 'border-transparent bg-prive-surface/80 hover:border-prive-border hover:bg-white',
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      checked ? 'border-prive-rose bg-prive-rose' : 'border-prive-border bg-white',
                    )}
                    aria-hidden="true"
                  >
                    {checked ? (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-white" aria-hidden="true">
                        <path d="M4.5 9L1.5 6l1-1 2 2 4-4 1 1z" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="text-xs font-semibold text-prive-text sm:text-sm">{zone.label}</span>
                </span>
                <span className="pl-5 text-[0.65rem] leading-snug text-prive-text-muted sm:text-xs">
                  {zone.graftLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {footer ? <div className="mt-3 border-t border-prive-border/60 pt-3">{footer}</div> : null}
    </div>
  );
}
