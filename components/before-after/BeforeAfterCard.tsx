'use client';

import { useState } from 'react';

import ComparisonViewToggle from '@/components/before-after/ComparisonViewToggle';
import ImageComparisonSlider from '@/components/before-after/ImageComparisonSlider';
import SideBySideComparison from '@/components/before-after/SideBySideComparison';
import type { BeforeAfterCase, ComparisonViewMode } from '@/components/before-after/types';
import { cn } from '@/lib/utils';

type BeforeAfterCardProps = {
  caseItem: BeforeAfterCase;
  className?: string;
};

const COMPARISON_ASPECT = 'aspect-square w-full';

export default function BeforeAfterCard({ caseItem, className }: BeforeAfterCardProps) {
  const [viewMode, setViewMode] = useState<ComparisonViewMode>('slider');

  return (
    <article
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-2xl',
        'border border-prive-border bg-prive-plum',
        'shadow-prive-card transition-all duration-500',
        'hover:border-prive-rose/40 hover:shadow-prive-card-hover',
        className,
      )}
    >
      <div className="relative w-full shrink-0">
        {viewMode === 'slider' ? (
          <ImageComparisonSlider
            beforeImage={caseItem.beforeUrl}
            afterImage={caseItem.afterUrl}
            title={caseItem.title}
            className={COMPARISON_ASPECT}
          />
        ) : (
          <SideBySideComparison
            beforeImage={caseItem.beforeUrl}
            afterImage={caseItem.afterUrl}
            title={caseItem.title}
            className={COMPARISON_ASPECT}
          />
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2 px-3 py-2.5">
        <h3 className="line-clamp-1 text-xs font-semibold leading-snug text-white sm:text-sm">
          {caseItem.title}
        </h3>

        <ComparisonViewToggle value={viewMode} onChange={setViewMode} />
      </div>
    </article>
  );
}
