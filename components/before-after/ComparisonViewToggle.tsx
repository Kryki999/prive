'use client';

import { Columns2, SlidersHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ComparisonViewMode } from '@/components/before-after/types';

type ComparisonViewToggleProps = {
  value: ComparisonViewMode;
  onChange: (mode: ComparisonViewMode) => void;
  className?: string;
};

export default function ComparisonViewToggle({
  value,
  onChange,
  className,
}: ComparisonViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Tryb podglądu efektu"
      className={cn('flex gap-0.5 rounded-md bg-white/5 p-0.5', className)}
    >
      <button
        type="button"
        aria-pressed={value === 'slider'}
        onClick={() => onChange('slider')}
        className={cn(
          'flex min-h-9 flex-1 items-center justify-center gap-1 rounded px-1.5 py-1.5 text-[11px] font-medium transition-colors sm:min-h-10 sm:text-xs',
          value === 'slider'
            ? 'bg-prive-rose text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white',
        )}
      >
        <SlidersHorizontal className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
        <span>Suwak</span>
      </button>
      <button
        type="button"
        aria-pressed={value === 'sideBySide'}
        onClick={() => onChange('sideBySide')}
        className={cn(
          'flex min-h-9 flex-1 items-center justify-center gap-1 rounded px-1.5 py-1.5 text-[11px] font-medium transition-colors sm:min-h-10 sm:text-xs',
          value === 'sideBySide'
            ? 'bg-prive-rose text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white',
        )}
      >
        <Columns2 className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
        <span>Obok siebie</span>
      </button>
    </div>
  );
}
