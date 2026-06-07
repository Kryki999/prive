'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Eye,
  MessageCircle,
  CircleCheck,
  CalendarDays,
  Clock,
  Plane,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import usePrefetchImagesWhenVisible from '@/hooks/usePrefetchImagesWhenVisible';
import { AKTUALNOSCI_ITEMS } from '@/lib/aktualnosci/data';
import { cn } from '@/lib/utils';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  icon: LucideIcon;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'pierwszy-kontakt',
    icon: MessageCircle,
    question: 'Jak wygląda pierwszy kontakt z kliniką?',
    answer:
      'Wypełniasz krótki formularz lub dzwonisz do nas — odpowiadamy tak szybko, jak to możliwe. Na podstawie opisu problemu i zdjęć lekarz wstępnie ocenia sytuację i proponuje dalsze kroki: konsultację stacjonarną lub online.',
  },
  {
    id: 'konsultacja',
    icon: CircleCheck,
    question: 'Czy konsultacja jest bezpłatna?',
    answer:
      'Tak — pierwsza konsultacja w Hair Clinic PRIVÉ jest darmowa. Podczas spotkania omawiamy oczekiwania, plan zabiegu, liczbę graftów i koszty, abyś mógł podjąć świadomą decyzję bez presji.',
  },
  {
    id: 'dzien-zabiegu',
    icon: CalendarDays,
    question: 'Jak przebiega dzień zabiegu?',
    answer:
      'Po przyjęciu do kliniki lekarz ponownie ocenia plan, a zespół przygotowuje strefę dawczą i odbiorczą. Zabieg trwa zwykle od kilku do wielu godzin — w zależności od liczby graftów. Po zakończeniu otrzymujesz szczegółowe zalecenia pooperacyjne.',
  },
  {
    id: 'rekonwalescencja',
    icon: Clock,
    question: 'Jak długo trwa rekonwalescencja?',
    answer:
      'Pierwsze dni to odpoczynek i delikatna pielęgnacja skóry głowy. Większość pacjentów wraca do pracy po ok. 3–5 dniach. Pełny efekt widoczny jest stopniowo — pierwsze efekty po kilku miesiącach, ostateczny rezultat po ok. 12–18 miesiącach.',
  },
  {
    id: 'pacjenci-spoza-miasta',
    icon: Plane,
    question: 'Czy pomagacie pacjentom spoza Gdańska?',
    answer:
      'Oczywiście — wielu naszych pacjentów przyjeżdża z innych miast i krajów. Organizujemy odbiór z lotniska lub dworca, rekomendujemy noclegi w centrum i koordynujemy harmonogram pobytu tak, aby zabieg i kontrola były wygodne logistycznie.',
  },
  {
    id: 'opieka-po-zabiegu',
    icon: ShieldCheck,
    question: 'Jak wygląda opieka po zabiegu?',
    answer:
      'Po zabiegu pozostajesz w kontakcie z zespołem kliniki. Umawiamy kontrolę, odpowiadamy na pytania i monitorujemy gojenie. W razie potrzeby możesz skonsultować się z lekarzem także zdalnie — nie zostawiamy pacjenta samego po procedurze.',
  },
];

const CLINIC_IMAGE = '/priveklinika.png';

function FaqAccordion({
  items,
  openId,
  onToggle,
}: {
  items: FaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const Icon = item.icon;

        return (
          <div key={item.id} className="border-b border-prive-border/90">
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-3.5 py-3.5 text-left transition-colors hover:text-prive-plum md:gap-4 md:py-4"
            >
              <Icon
                className="h-6 w-6 shrink-0 text-prive-rose transition-colors group-hover:text-prive-plum md:h-7 md:w-7"
                strokeWidth={1.6}
                aria-hidden
              />

              <span className="min-w-0 flex-1 text-pretty text-[1.02rem] font-bold leading-[1.3] text-prive-text md:text-[1.125rem]">
                {item.question}
              </span>

              <ChevronDown
                className={cn(
                  'h-[18px] w-[18px] shrink-0 text-prive-text-muted/80 transition-transform duration-200',
                  isOpen && 'rotate-180 text-prive-rose',
                )}
                strokeWidth={2}
                aria-hidden
              />
            </button>

            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-3.5 pl-9 pr-1 text-pretty text-sm leading-relaxed text-prive-text-muted md:pb-4 md:pl-11 md:text-[0.92rem]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CooperationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const aktualnosciPrefetchUrls = useMemo(
    () => AKTUALNOSCI_ITEMS.slice(0, 3).map((item) => item.image),
    [],
  );
  usePrefetchImagesWhenVisible(sectionRef, aktualnosciPrefetchUrls);

  const handleFaqToggle = (id: string) => {
    setOpenFaqId((current) => (current === id ? null : id));
  };

  return (
      <section
        ref={sectionRef}
        id="wspolpraca"
        aria-labelledby="cooperation-heading"
        className="section-deferred scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] border-t border-prive-border bg-prive-white py-12 md:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 id="cooperation-heading" className="section-title mb-6 md:mb-8">
            Jak wygląda współpraca
          </h2>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0">
              <FaqAccordion items={FAQ_ITEMS} openId={openFaqId} onToggle={handleFaqToggle} />

              <p className="mt-5 text-pretty text-sm leading-6 text-prive-text-muted md:mt-6 md:text-[0.92rem] md:leading-[1.65]">
                <span className="font-bold text-prive-text">
                  Hair Clinic PRIVÉ to miejsce, gdzie profesjonalna opieka medyczna spotyka się z
                  komfortem i dyskrecją.
                </span>{' '}
                Zapewniamy pełne wsparcie — od pierwszej konsultacji po kontrolę po zabiegu — także
                dla pacjentów przyjeżdżających z innych miast.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[420px] lg:max-w-none">
              <div className="relative overflow-hidden rounded-[1.35rem] shadow-prive-card">
                <div className="relative aspect-[5/4] w-full">
                  <Image
                    src={CLINIC_IMAGE}
                    alt="Hair Clinic PRIVÉ — klinika w centrum Gdańska"
                    fill
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-bold text-prive-plum shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose"
                  >
                    <Eye className="h-[18px] w-[18px] text-prive-rose" strokeWidth={2.2} aria-hidden />
                    Zobacz jak wygląda nasza klinika
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
