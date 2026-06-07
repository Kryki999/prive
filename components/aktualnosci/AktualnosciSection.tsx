'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  AKTUALNOSCI_ITEMS,
  formatAktualnoscDate,
  getAktualnoscHref,
  type AktualnoscItem,
} from '@/lib/aktualnosci/data';
import { cn } from '@/lib/utils';

const MOBILE_CARD_WIDTH_CLS = 'w-[78vw] max-w-[300px] sm:w-[72vw] sm:max-w-[330px]';
const CARD_ASPECT = 'aspect-[3/4]';

function ArticleCard({ item }: { item: AktualnoscItem }) {
  return (
    <Link
      href={getAktualnoscHref(item.slug, 'home')}
      className={cn(
        'group relative block w-full overflow-hidden rounded-2xl border border-prive-border/80',
        CARD_ASPECT,
        'outline-none transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 hover:border-prive-rose/35 hover:shadow-prive-card-hover',
        'focus-visible:ring-2 focus-visible:ring-prive-rose/45 focus-visible:ring-offset-2',
      )}
    >
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 768px) 78vw, 26vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-prive-plum via-prive-plum/55 to-transparent"
      />
      <time
        dateTime={item.date}
        className="absolute left-3.5 top-3.5 z-[1] rounded bg-prive-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-prive-plum backdrop-blur-[6px] md:left-4 md:top-4"
      >
        {formatAktualnoscDate(item.date)}
      </time>
      <div className="absolute inset-x-0 bottom-0 z-[1] p-4 pb-5 md:p-5 md:pb-6">
        <h3 className="text-pretty text-[1.05rem] font-bold leading-[1.18] tracking-tight text-white transition-colors group-hover:text-prive-rose md:text-[1.15rem]">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

function PortalCard() {
  return (
    <Link
      href="/aktualnosci"
      className={cn(
        'group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-prive-border bg-prive-surface text-center',
        CARD_ASPECT,
        'px-5 py-8 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 hover:border-prive-rose/45 hover:bg-prive-white',
        'outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/45 focus-visible:ring-offset-2',
      )}
    >
      <span className="mb-5 inline-flex items-center justify-center rounded-full border border-prive-border p-3.5 transition-colors group-hover:border-prive-rose/45">
        <ArrowRight
          className="size-5 text-prive-plum transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          strokeWidth={1.4}
          aria-hidden
        />
      </span>
      <h3 className="max-w-[12ch] text-balance text-[1.35rem] font-bold leading-[1.08] tracking-tight text-prive-plum md:text-[1.5rem]">
        Odkryj wszystkie historie
      </h3>
    </Link>
  );
}

export default function AktualnosciSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [mobileProgress, setMobileProgress] = useState(0);
  const featuredItems = AKTUALNOSCI_ITEMS.slice(0, 3);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const updateProgress = () => {
      if (window.innerWidth >= 768) {
        setMobileProgress(0);
        return;
      }

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        setMobileProgress(0);
        return;
      }

      setMobileProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
    };

    updateProgress();
    el.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      el.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <section
      id="aktualnosci"
      aria-labelledby="aktualnosci-heading"
      className="scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] border-t border-prive-border bg-prive-white py-16 text-prive-text md:py-24"
    >
      <header className="mx-auto mb-12 flex w-full max-w-7xl items-center gap-4 px-4 md:mb-16 md:gap-6 md:px-8">
        <Bell
          className="size-10 shrink-0 text-prive-rose md:size-12"
          strokeWidth={1.4}
          aria-hidden
        />
        <h2 id="aktualnosci-heading" className="section-title mb-0 border-0 p-0 normal-case">
          <span className="text-prive-plum">Najnowsze</span>{' '}
          <span className="text-prive-rose">wpisy</span>
        </h2>
      </header>

      <div className="mx-auto hidden max-w-7xl px-4 md:block md:px-8">
        <ul className="grid grid-cols-4 gap-6 lg:gap-7">
          {featuredItems.map((item) => (
            <li key={item.slug} className="w-full">
              <ArticleCard item={item} />
            </li>
          ))}
          <li className="w-full">
            <PortalCard />
          </li>
        </ul>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar relative w-full overflow-x-auto overflow-y-clip overscroll-x-contain md:hidden [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_proximity]"
      >
        <ul className="flex items-center gap-4 px-4 py-2 pr-[22vw]">
          {featuredItems.map((item) => (
            <li
              key={item.slug}
              className={cn(
                'shrink-0 [scroll-snap-align:start] [scroll-snap-stop:always]',
                MOBILE_CARD_WIDTH_CLS,
              )}
            >
              <ArticleCard item={item} />
            </li>
          ))}
          <li
            className={cn(
              'shrink-0 [scroll-snap-align:start] [scroll-snap-stop:always]',
              MOBILE_CARD_WIDTH_CLS,
            )}
          >
            <PortalCard />
          </li>
        </ul>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 md:hidden">
        <div className="h-1.5 w-full rounded-full bg-prive-border">
          <div
            className="h-full rounded-full bg-prive-rose transition-[width] duration-150"
            style={{ width: `${Math.max(8, mobileProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
