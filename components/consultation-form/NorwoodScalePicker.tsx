'use client';

import { cn } from '@/lib/utils';

import { NORWOOD_LEVELS } from './form-data';

type NorwoodScalePickerProps = {
  value: number | null;
  onChange: (level: number) => void;
  className?: string;
  variant?: 'drawer' | 'embedded';
};

function NorwoodSilhouette({ level }: { level: number }) {
  const hairOpacity = Math.max(0.15, 1 - (level - 1) * 0.12);
  const recession = (level - 1) * 4;

  return (
    <svg viewBox="0 0 80 96" className="mx-auto h-16 w-14" aria-hidden>
      <ellipse cx="40" cy="52" rx="24" ry="28" fill="currentColor" className="text-prive-text/20" />
      <path
        d={`M16 ${34 + recession} Q40 ${8 + recession * 0.6} 64 ${34 + recession} Q58 ${18 + recession * 0.4} 40 ${14 + recession * 0.35} Q22 ${18 + recession * 0.4} 16 ${34 + recession}`}
        fill="currentColor"
        className="text-prive-plum"
        style={{ opacity: hairOpacity }}
      />
      <ellipse cx="40" cy="46" rx="18" ry="20" fill="var(--prive-surface)" />
    </svg>
  );
}

export default function NorwoodScalePicker({
  value,
  onChange,
  className,
  variant = 'drawer',
}: NorwoodScalePickerProps) {
  const isDrawer = variant === 'drawer';

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {NORWOOD_LEVELS.map(({ level, label }) => {
        const selected = value === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={cn(
              'flex min-h-[7.5rem] flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center transition-all duration-300',
              isDrawer
                ? 'border-white/10 bg-white/[0.03] hover:border-prive-rose/45'
                : 'border-prive-border bg-prive-white hover:border-prive-rose/45',
              selected &&
                'border-prive-rose bg-prive-rose/10 shadow-[0_0_0_1px_rgba(229,0,126,0.35),0_8px_24px_rgba(229,0,126,0.12)]',
            )}
            aria-pressed={selected}
          >
            <NorwoodSilhouette level={level} />
            <span
              className={cn(
                'text-[0.7rem] font-semibold uppercase tracking-[0.12em]',
                isDrawer ? 'text-white/90' : 'text-prive-text/90',
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
