'use client';

import { cn } from '@/lib/utils';

interface GraftSummaryProps {
  grafts: number;
  hairs: number;
  className?: string;
  layout?: 'compact' | 'panel' | 'overlay';
  /** @deprecated use layout="compact" */
  compact?: boolean;
}

export default function GraftSummary({
  grafts,
  hairs,
  className,
  layout,
  compact,
}: GraftSummaryProps) {
  const resolvedLayout = layout ?? (compact ? 'compact' : 'panel');

  if (resolvedLayout === 'overlay') {
    return (
      <div
        className={cn(
          'rounded-xl border border-prive-border/80 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm',
          className,
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-prive-text-muted">
          Przybliżona liczba graftów
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-sm">
          <p className="font-bold text-prive-plum">
            <span className="tabular-nums">{grafts.toLocaleString('pl-PL')}</span>{' '}
            <span className="font-semibold text-prive-text">Grafty</span>
          </p>
          <p className="font-bold text-prive-plum">
            <span className="tabular-nums">{hairs.toLocaleString('pl-PL')}</span>{' '}
            <span className="font-semibold text-prive-text">Włosy</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-prive-border bg-white shadow-prive-card',
        resolvedLayout === 'compact' && 'px-5 py-4',
        resolvedLayout === 'panel' && 'px-6 py-8 md:px-8',
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        className={cn(
          'font-semibold uppercase tracking-[0.12em] text-prive-text-muted',
          resolvedLayout === 'compact' ? 'text-[0.65rem]' : 'text-xs',
        )}
      >
        Przybliżona liczba graftów
      </p>

      {resolvedLayout === 'panel' ? (
        <div className="mt-6 space-y-5">
          <p className="font-bold text-prive-plum">
            <span className="text-3xl tabular-nums md:text-4xl">{grafts.toLocaleString('pl-PL')}</span>{' '}
            <span className="text-lg font-semibold text-prive-text md:text-xl">Grafty</span>
          </p>
          <p className="font-bold text-prive-plum">
            <span className="text-3xl tabular-nums md:text-4xl">{hairs.toLocaleString('pl-PL')}</span>{' '}
            <span className="text-lg font-semibold text-prive-text md:text-xl">Włosy</span>
          </p>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-lg">
          <p className="font-bold text-prive-plum">
            <span className="tabular-nums">{grafts.toLocaleString('pl-PL')}</span>{' '}
            <span className="text-base font-semibold text-prive-text">Grafty</span>
          </p>
          <p className="font-bold text-prive-plum">
            <span className="tabular-nums">{hairs.toLocaleString('pl-PL')}</span>{' '}
            <span className="text-base font-semibold text-prive-text">Włosy</span>
          </p>
        </div>
      )}
    </div>
  );
}
