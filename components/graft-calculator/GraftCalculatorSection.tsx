'use client';



import { useConfigurator } from '@/components/consultation-form/configurator-shared';
import { SectionGradientHeading } from '@/components/ui/section-gradient-heading';
import GraftSummary from '@/components/graft-calculator/GraftSummary';

import ScalpMap, {

  SCALP_FOCAL_DESKTOP,

  SCALP_FOCAL_MOBILE,

  SCALP_FOCAL_TABLET,

} from '@/components/graft-calculator/ScalpMap';

import ZoneList from '@/components/graft-calculator/ZoneList';

import { useGraftCalculator } from '@/components/graft-calculator/useGraftCalculator';



export default function GraftCalculatorSection() {

  const { open: openConsultation } = useConfigurator();

  const { zones, isSelected, toggle, totals } = useGraftCalculator();



  const consultationCta = (

    <button

      type="button"

      onClick={openConsultation}

      className="btn-prive w-full px-6 py-3 text-center text-sm"

    >

      Umów darmową konsultację

    </button>

  );



  return (

    <section

      id="kalkulator-graftow"

      className="scroll-mt-24 bg-prive-surface py-10 md:py-16 lg:py-20"

    >

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-4">

        <SectionGradientHeading
          id="kalkulator-graftow-heading"
          title="Kalkulator graftów"
          subtitle="Wybierz obszary do przeszczepu włosów — kliknij na model lub zaznacz strefy na liście."
          className="mx-auto max-w-3xl"
        />



        {/* Desktop (xl+) — overlap na ramionach */}

        <div className="relative mx-auto mt-10 hidden min-h-[520px] max-w-6xl xl:mt-12 xl:block">

          <ScalpMap

            zones={zones}

            isSelected={isSelected}

            onToggle={toggle}

            crop="focal"

            focal={SCALP_FOCAL_DESKTOP}

            className="relative z-0 mx-auto w-full max-w-[min(94vw,920px)]"

          />



          <ZoneList

            zones={zones}

            isSelected={isSelected}

            onToggle={toggle}

            variant="card"

            className="absolute left-2 top-1/2 z-20 w-[min(100%,252px)] -translate-y-1/2"

          />



          <aside className="absolute right-2 top-1/2 z-20 flex w-[min(100%,248px)] -translate-y-1/2 flex-col gap-4">

            <GraftSummary grafts={totals.grafts} hairs={totals.hairs} layout="panel" />



            <p className="text-xs leading-relaxed text-prive-text-muted">

              Wynik ma charakter orientacyjny. Dokładną liczbę graftów ustala lekarz podczas konsultacji.

            </p>



            {consultationCta}

          </aside>

        </div>



        {/* Tablet (lg–xl) — stos pod mapą */}

        <div className="mx-auto mt-8 hidden max-w-4xl lg:mt-10 lg:block xl:hidden">

          <ScalpMap

            zones={zones}

            isSelected={isSelected}

            onToggle={toggle}

            crop="focal"

            focal={SCALP_FOCAL_TABLET}

            className="w-full"

          />



          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_minmax(200px,260px)] sm:items-start">

            <ZoneList zones={zones} isSelected={isSelected} onToggle={toggle} variant="card" />



            <aside className="flex flex-col gap-3">

              <GraftSummary grafts={totals.grafts} hairs={totals.hairs} layout="compact" />



              <p className="text-[11px] leading-relaxed text-prive-text-muted">

                Wynik orientacyjny — dokładną liczbę ustala lekarz.

              </p>



              {consultationCta}

            </aside>

          </div>

        </div>



        {/* Mobile (<lg) */}

        <div className="mt-4 lg:hidden">

          <GraftSummary

            grafts={totals.grafts}

            hairs={totals.hairs}

            layout="overlay"

            className="mb-2"

          />



          <ScalpMap

            zones={zones}

            isSelected={isSelected}

            onToggle={toggle}

            crop="focal"

            focal={SCALP_FOCAL_MOBILE}

            className="w-full"

          />



          <ZoneList

            zones={zones}

            isSelected={isSelected}

            onToggle={toggle}

            variant="sheet"

            className="relative z-30 mt-1"

            footer={

              <div className="space-y-2">

                {consultationCta}

                <p className="text-center text-[10px] leading-snug text-prive-text-muted">

                  Wynik orientacyjny — dokładną liczbę ustala lekarz.

                </p>

              </div>

            }

          />

        </div>

      </div>

    </section>

  );

}


