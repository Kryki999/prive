'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

type SideBySideComparisonProps = {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  className?: string;
};

export default function SideBySideComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Przed',
  afterLabel = 'Po',
  title,
  className,
}: SideBySideComparisonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-0.5 overflow-hidden rounded-t-2xl',
        className,
      )}
      role="img"
      aria-label={title ? `Porównanie przed i po: ${title}` : 'Porównanie przed i po zabiegu'}
    >
      <div className="relative h-full min-h-0 overflow-hidden">
        <Image
          src={beforeImage}
          alt={title ? `Przed zabiegiem — ${title}` : beforeLabel}
          fill
          sizes="(max-width: 1024px) 45vw, 12vw"
          className="object-cover object-top"
          draggable={false}
        />
        <div className="absolute top-3 left-2 z-10 rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm sm:left-3 sm:px-2.5 sm:py-1 sm:text-xs">
          {beforeLabel}
        </div>
      </div>

      <div className="relative h-full min-h-0 overflow-hidden border-l border-white/10">
        <Image
          src={afterImage}
          alt={title ? `Po zabiegu — ${title}` : afterLabel}
          fill
          sizes="(max-width: 1024px) 45vw, 12vw"
          className="object-cover object-top"
          draggable={false}
        />
        <div className="absolute top-3 right-2 z-10 rounded-full bg-prive-rose/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm sm:right-3 sm:px-2.5 sm:py-1 sm:text-xs">
          {afterLabel}
        </div>
      </div>
    </div>
  );
}
