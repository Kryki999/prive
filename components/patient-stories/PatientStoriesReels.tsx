'use client';

import { useState, useCallback } from 'react';

import ReelCard from '@/components/patient-stories/ReelCard';
import ReelModal from '@/components/patient-stories/ReelModal';
import type { PatientStoryReel } from '@/components/patient-stories/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

type PatientStoriesReelsProps = {
  reels: PatientStoryReel[];
  /** Gdy true — bez własnego nagłówka sekcji (np. w GameShowcaseSection) */
  embedded?: boolean;
  heading?: string;
  subtitle?: string;
  phoneNumber?: string;
  className?: string;
};

export default function PatientStoriesReels({
  reels,
  embedded = false,
  heading = 'Historie naszych podopiecznych',
  subtitle = 'Zobacz efekty zabiegów i historie pacjentów w formie krótkich filmów',
  phoneNumber,
  className,
}: PatientStoriesReelsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReelClick = useCallback((index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  }, []);

  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      setCurrentIndex((prev) => {
        if (direction === 'prev') return Math.max(0, prev - 1);
        return Math.min(reels.length - 1, prev + 1);
      });
    },
    [reels.length],
  );

  if (!reels.length) return null;

  const grid = (
    <div className="hidden gap-6 lg:grid lg:grid-cols-4 lg:items-stretch">
      {reels.map((reel, index) => (
        <ReelCard
          key={reel.id}
          reel={reel}
          className="h-full"
          onClick={() => handleReelClick(index)}
        />
      ))}
    </div>
  );

  const carousel = (
    <div className="relative lg:hidden">
      <Carousel
        opts={{
          align: 'start',
          loop: reels.length > 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {reels.map((reel, index) => (
            <CarouselItem key={reel.id} className="basis-[85%] pl-4 sm:basis-1/2 md:basis-1/3">
              <ReelCard reel={reel} onClick={() => handleReelClick(index)} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className={cn(
            'absolute -left-2 top-[35%] h-10 w-10 sm:-left-4 sm:top-[38%]',
            'border-prive-border bg-prive-white/90 hover:bg-prive-white',
          )}
        />
        <CarouselNext
          className={cn(
            'absolute -right-2 top-[35%] h-10 w-10 sm:-right-4 sm:top-[38%]',
            'border-prive-border bg-prive-white/90 hover:bg-prive-white',
          )}
        />
      </Carousel>
    </div>
  );

  const content = (
    <>
      {grid}
      {carousel}
      <ReelModal
        reels={reels}
        currentIndex={currentIndex}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onNavigate={handleNavigate}
        phoneNumber={phoneNumber}
      />
    </>
  );

  if (embedded) {
    return <div className={className}>{content}</div>;
  }

  return (
    <section id="historie-podopiecznych" className={cn('overflow-hidden bg-prive-white py-16 md:py-24', className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-prive-rose">Historie</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-prive-plum sm:text-4xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-prive-text-muted">{subtitle}</p>
        </div>
        {content}
      </div>
    </section>
  );
}
