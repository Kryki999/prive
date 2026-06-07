'use client';

import { useMemo } from 'react';

import BeforeAfterCard from '@/components/before-after/BeforeAfterCard';
import {
  BEFORE_AFTER_INTERACTIVE_SELECTOR,
  type BeforeAfterCase,
} from '@/components/before-after/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

type BeforeAfterCarouselProps = {
  cases: BeforeAfterCase[];
  embedded?: boolean;
  heading?: string;
  subtitle?: string;
  className?: string;
  onApiReady?: (api: CarouselApi) => void;
};

export default function BeforeAfterCarousel({
  cases,
  embedded = false,
  heading = 'Efekty naszej pracy',
  subtitle = 'Przesuń suwak lub przełącz na widok obok siebie, aby zobaczyć efekty zabiegów',
  className,
  onApiReady,
}: BeforeAfterCarouselProps) {
  const carouselOpts = useMemo(
    () => ({
      align: 'start' as const,
      loop: cases.length > 1,
      watchDrag: (_emblaApi: unknown, event: MouseEvent | TouchEvent) => {
        const target = event.target;
        if (target instanceof Element && target.closest(BEFORE_AFTER_INTERACTIVE_SELECTOR)) {
          return false;
        }
        return true;
      },
    }),
    [cases.length],
  );

  if (!cases.length) return null;

  const grid = (
    <div className="hidden gap-5 lg:grid lg:grid-cols-4 lg:items-start">
      {cases.slice(0, 4).map((caseItem) => (
        <BeforeAfterCard key={caseItem.id} caseItem={caseItem} className="h-full" />
      ))}
    </div>
  );

  const carousel = (
    <div className="relative lg:hidden">
      <Carousel
        opts={carouselOpts}
        setApi={onApiReady}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {cases.map((caseItem) => (
            <CarouselItem key={caseItem.id} className="basis-full pl-4">
              <BeforeAfterCard caseItem={caseItem} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );

  const content = (
    <>
      {grid}
      {carousel}
    </>
  );

  if (embedded) {
    return <div className={className}>{content}</div>;
  }

  return (
    <section
      id="efekty-naszej-pracy"
      className={cn('overflow-hidden bg-prive-white py-16 md:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-prive-rose">
            Efekty
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-prive-plum sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-prive-text-muted">{subtitle}</p>
        </div>
        {content}
      </div>
    </section>
  );
}
