'use client';

import Image from 'next/image';

import { HAIR_LOSS_SITUATIONS } from '@/components/consultation-form/form-data';
import { cn } from '@/lib/utils';

type HairLossSituationPickerProps = {
  value: number | null;
  onChange: (situationId: number) => void;
  className?: string;
  variant?: 'drawer' | 'embedded';
};

export default function HairLossSituationPicker({
  value,
  onChange,
  className,
  variant = 'drawer',
}: HairLossSituationPickerProps) {
  const isDrawer = variant === 'drawer';

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
      {HAIR_LOSS_SITUATIONS.map(({ id, label, imageUrl }) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex min-h-[8.5rem] flex-col items-center justify-center gap-2.5 rounded-2xl border px-2 py-3 text-center transition-all duration-300',
              isDrawer
                ? 'border-white/10 bg-white/[0.03] hover:border-prive-rose/45'
                : 'border-prive-border bg-prive-white hover:border-prive-rose/45',
              selected &&
                'border-prive-rose bg-prive-rose/10 shadow-[0_0_0_1px_rgba(229,0,126,0.35),0_8px_24px_rgba(229,0,126,0.12)]',
            )}
            aria-pressed={selected}
          >
            <div className="relative h-16 w-full max-w-[7.5rem]">
              <Image
                src={imageUrl}
                alt={label}
                fill
                sizes="120px"
                className="object-contain object-bottom"
              />
            </div>
            <span
              className={cn(
                'px-1 text-[0.68rem] font-semibold leading-snug tracking-wide',
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
