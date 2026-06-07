'use client';

import DoctorCard from '@/components/doctors/DoctorCard';
import type { Doctor } from '@/components/doctors/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

type DoctorsSectionProps = {
  doctors: Doctor[];
  className?: string;
};

export default function DoctorsSection({ doctors, className }: DoctorsSectionProps) {
  if (!doctors.length) return null;

  const grid = (
    <div className="hidden gap-6 lg:grid lg:grid-cols-3 lg:items-stretch">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} className="h-full" />
      ))}
    </div>
  );

  const carousel = (
    <div className="relative lg:hidden">
      <Carousel
        opts={{
          align: 'start',
          loop: doctors.length > 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {doctors.map((doctor) => (
            <CarouselItem key={doctor.id} className="basis-[85%] pl-4 sm:basis-1/2 md:basis-1/3">
              <DoctorCard doctor={doctor} />
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

  return (
    <section
      id="lekarze"
      className={cn(
        'section-deferred scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] overflow-hidden border-t border-prive-border bg-prive-white pb-14 pt-8 md:pb-20 md:pt-10',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6">
          <h2 className="text-prive-gradient w-fit text-xl font-black uppercase tracking-wider md:text-2xl">
            Poznaj naszych Lekarzy
          </h2>
        </div>

        {grid}
        {carousel}
      </div>
    </section>
  );
}
