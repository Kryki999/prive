'use client';

import { useRef } from 'react';

import ScalpMap, {
  type FocalCropConfig,
} from '@/components/graft-calculator/ScalpMap';
import useInViewport from '@/hooks/useInViewport';
import type { GraftZone, ZoneId } from '@/lib/graft-calculator/zones';
import { cn } from '@/lib/utils';

type LazyScalpMapProps = {
  zones: GraftZone[];
  isSelected: (id: ZoneId) => boolean;
  onToggle: (id: ZoneId) => void;
  crop?: 'none' | 'focal';
  focal?: FocalCropConfig;
  className?: string;
};

export default function LazyScalpMap({
  zones,
  isSelected,
  onToggle,
  crop,
  focal,
  className,
}: LazyScalpMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInViewport = useInViewport(containerRef, { rootMargin: '120px' });

  return (
    <div ref={containerRef} className={cn('min-h-[260px]', className)}>
      {isInViewport ? (
        <ScalpMap
          zones={zones}
          isSelected={isSelected}
          onToggle={onToggle}
          crop={crop}
          focal={focal}
        />
      ) : null}
    </div>
  );
}
