'use client';

import { Plane } from 'lucide-react';

import { useConfigurator } from '@/components/consultation-form/configurator-shared';
import { Globe } from '@/components/ui/globe';
import { cn } from '@/lib/utils';

const ctaPillSizeClass =
  'shrink-0 whitespace-nowrap text-xs px-6 py-3 tracking-wide gap-2 sm:text-sm sm:px-8 sm:py-3.5';

const ctaPrivePillClass = cn('btn-prive btn-prive--pill', ctaPillSizeClass);

export default function AirportTransferSection() {
  const { open: openConsultation } = useConfigurator();

  return (
    <section
      id="transfer"
      aria-labelledby="airport-transfer-heading"
      className="relative w-screen max-w-none scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] border-t border-prive-border bg-prive-white py-16 text-prive-text md:py-24"
      style={{ marginInline: 'calc(50% - 50vw)' }}
    >
      <div className="relative mx-auto w-full max-w-[1800px] px-4 md:px-10 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-16">
          <div className="flex flex-col gap-4">
            <Plane
              className="size-10 shrink-0 text-prive-rose md:size-12"
              strokeWidth={1.4}
              aria-hidden
            />
            <h2
              id="airport-transfer-heading"
              className="text-balance text-4xl font-extrabold uppercase leading-[1.05] tracking-[0.04em] text-prive-plum sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.02]"
            >
              Szybki transfer{' '}
              <span className="text-prive-rose">z lotniska</span>
            </h2>
          </div>

          <div className="flex flex-col gap-5 lg:pt-2">
            <h3 className="text-xl font-bold tracking-tight text-prive-plum md:text-2xl">
              Przyjedź bez stresu
            </h3>
            <p className="max-w-[52ch] text-pretty text-sm leading-relaxed text-prive-text-muted md:text-base">
              Organizacja transportu w obcym mieście bywa wymagająca — dlatego odbierzemy Cię z
              lotniska lub dworca i doprowadzimy prosto do kliniki. Hair Clinic PRIVÉ leży w samym
              centrum Gdańska, więc jesteśmy blisko niezależnie od tego, skąd przyjeżdżasz.
              Bezpłatny transfer i centralna lokalizacja sprawiają, że to idealne miejsce także
              dla pacjentów z zagranicy.
            </p>
            <button type="button" onClick={openConsultation} className={ctaPrivePillClass}>
              Umów konsultację
            </button>
          </div>
        </div>

        <div
          className="relative mt-12 min-h-[220px] overflow-hidden rounded-2xl bg-prive-plum sm:min-h-[280px] md:mt-16 md:min-h-[320px]"
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,0,126,0.22)_0%,transparent_68%)]" />
          <div className="relative flex min-h-[inherit] items-center justify-center">
            <Globe />
          </div>
        </div>
      </div>
    </section>
  );
}
