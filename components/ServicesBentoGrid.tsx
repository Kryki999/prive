'use client';

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SectionGradientHeading } from '@/components/ui/section-gradient-heading';
import { SERVICE_TILE_PHOTO, serviceCardImage } from '@/lib/site-images';
import { cn } from '@/lib/utils';

/* eslint-disable @next/next/no-img-element */

function CinematicHeader({
  title,
  tags,
  imageSrc,
  videoSrc,
  layoutTitleId,
  layoutTagsId,
  compact,
}: {
  title: string;
  tags: string;
  imageSrc: string;
  videoSrc?: string;
  layoutTitleId?: string;
  layoutTagsId?: string;
  compact?: boolean;
}) {
  const useVideo = Boolean(videoSrc);

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden',
        compact ? 'h-full min-h-[180px]' : 'min-h-[220px] md:min-h-0 md:h-full',
      )}
    >
      <div className="absolute inset-0 overflow-hidden bg-prive-plum">
        {useVideo ? (
          <video
            className="absolute inset-0 z-[1] h-full w-full object-cover contrast-[1.02] transition-[transform] duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:scale-[1.065]"
            src={videoSrc}
            poster={imageSrc}
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 z-[1] h-full w-full object-cover contrast-[1.02] transition-[transform] duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:scale-[1.065]"
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-prive-plum/40 to-transparent pb-4 pl-4 pr-4 pt-16 md:pb-4 md:pl-4 md:pr-4 md:pt-14">
        <div>
          <motion.h3
            layoutId={layoutTitleId}
            className="text-balance text-base font-bold tracking-tight text-white md:text-lg"
          >
            {title}
          </motion.h3>
          <motion.p
            layoutId={layoutTagsId}
            className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-prive-rose/90 md:mt-2 md:text-[11px]"
          >
            {tags}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

type TileConfig = {
  id: string;
  title: string;
  tags: string;
  article: string;
  imageSrc: string;
  videoSrc?: string;
};

const DESKTOP_BENTO = {
  left: ['przeszczep-brody', 'brwi'],
  center: 'przeszczep-wlosow',
  right: ['trychopigmentacja', 'klinika-estetyczna'],
} as const;

const TILES: TileConfig[] = [
  {
    id: 'przeszczep-wlosow',
    title: 'Przeszczep włosów',
    tags: 'Zabieg · FUE/DHI',
    article:
      'Przeszczep włosów w Hair Clinic PRIVÉ łączy precyzyjne techniki FUE i DHI z indywidualnym planem gęstości i linii frontu. Zabieg przeprowadzany jest w komfortowych warunkach klinicznych z pełną opieką zespołu na każdym etapie — od konsultacji po kontrolę pooperacyjną.',
    imageSrc: serviceCardImage(SERVICE_TILE_PHOTO['przeszczep-wlosow']),
  },
  {
    id: 'brwi',
    title: 'Brwi',
    tags: 'Regeneracja · Brwi',
    article:
      'Odbudowa i wzmocnienie brwi z wykorzystaniem nowoczesnych metod regeneracyjnych. Zabieg dopasowujemy do kształtu twarzy i oczekiwań estetycznych, aby uzyskać naturalny, harmonijny efekt.',
    imageSrc: serviceCardImage(SERVICE_TILE_PHOTO.brwi),
  },
  {
    id: 'klinika-estetyczna',
    title: 'Klinika estetyczna',
    tags: 'Medycyna · Estetyka',
    article:
      'Kompleksowa oferta medycyny estetycznej w premiumowej oprawie PRIVÉ. Od konsultacji po zabiegi wspierające młody wygląd skóry i twarzy — zawsze z naciskiem na bezpieczeństwo i naturalny rezultat.',
    imageSrc: serviceCardImage(SERVICE_TILE_PHOTO['klinika-estetyczna']),
  },
  {
    id: 'przeszczep-brody',
    title: 'Przeszczep brody',
    tags: 'Zabieg · Broda',
    article:
      'Przeszczep brody pozwala uzyskać gęstą, naturalną linię zarostu dopasowaną do rysów twarzy. Planujemy kształt, gęstość i kierunek włosów tak, by efekt był spójny i trwały.',
    imageSrc: serviceCardImage(SERVICE_TILE_PHOTO['przeszczep-brody']),
  },
  {
    id: 'trychopigmentacja',
    title: 'Trychopigmentacja',
    tags: 'Zabieg · SMP',
    article:
      'Trychopigmentacja (SMP) to nieinwazyjna metoda opticznego zagęszczenia owłosienia lub wygładzenia blizn skóry głowy. Pigment aplikowany jest punktowo, imitując naturalne cebelki włosów.',
    imageSrc: serviceCardImage(SERVICE_TILE_PHOTO.trychopigmentacja),
  },
];

function tileById(id: string): TileConfig {
  const tile = TILES.find((entry) => entry.id === id);
  if (!tile) throw new Error(`Unknown service tile: ${id}`);
  return tile;
}

const SERVICES_HISTORY_MARKER = 'prive-service-modal-open';

function useIsDesktop() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia('(min-width: 768px)');
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(min-width: 768px)').matches,
    () => false,
  );
}

const panelTransition = {
  type: 'spring',
  stiffness: 240,
  damping: 34,
  mass: 0.9,
} as const;

const tileButtonClass =
  'group/tile relative z-10 block h-full w-full overflow-hidden rounded-2xl text-left ring-1 ring-black/10 shadow-prive-card transition-shadow duration-500 hover:shadow-prive-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prive/60';

function layoutCardId(scope: string, id: string) {
  return `${scope}-card-${id}`;
}

function layoutImageId(scope: string, id: string) {
  return `${scope}-image-${id}`;
}

function layoutTitleId(scope: string, id: string) {
  return `${scope}-title-${id}`;
}

function layoutTagsId(scope: string, id: string) {
  return `${scope}-tags-${id}`;
}

function ServiceTileCard({
  tile,
  layoutScope,
  onSelect,
  className,
  compact,
}: {
  tile: TileConfig;
  layoutScope: string;
  onSelect: () => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(tileButtonClass, className)}
    >
      <motion.div layoutId={layoutCardId(layoutScope, tile.id)} className="h-full w-full">
        <motion.div layoutId={layoutImageId(layoutScope, tile.id)} className="h-full w-full">
          <CinematicHeader
            title={tile.title}
            tags={tile.tags}
            imageSrc={tile.imageSrc}
            videoSrc={tile.videoSrc}
            layoutTitleId={layoutTitleId(layoutScope, tile.id)}
            layoutTagsId={layoutTagsId(layoutScope, tile.id)}
            compact={compact}
          />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

export default function ServicesBentoGrid({ className }: { className?: string }) {
  const [activeTile, setActiveTile] = useState<TileConfig | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const layoutScope = useId();
  const isDesktop = useIsDesktop();
  const isOpen = activeTile !== null;
  const shouldGoBackOnCloseRef = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollServicesPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollServicesNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const selectTile = (tile: TileConfig) => setActiveTile(tile);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!emblaApi || isDesktop) return;

    const updateScrollButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateScrollButtons();
    emblaApi.on('select', updateScrollButtons);
    emblaApi.on('reInit', updateScrollButtons);

    return () => {
      emblaApi.off('select', updateScrollButtons);
      emblaApi.off('reInit', updateScrollButtons);
    };
  }, [emblaApi, isDesktop]);

  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveTile(null);
      }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const state = window.history.state ?? {};
    if (!state || state[SERVICES_HISTORY_MARKER] !== true) {
      shouldGoBackOnCloseRef.current = true;
      window.history.pushState(
        { ...state, [SERVICES_HISTORY_MARKER]: true },
        '',
        window.location.href,
      );
    }

    const onPopState = () => {
      shouldGoBackOnCloseRef.current = false;
      setActiveTile(null);
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
      if (shouldGoBackOnCloseRef.current) {
        shouldGoBackOnCloseRef.current = false;
        window.history.back();
      }
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={cn('w-full max-w-6xl mx-auto', className)}
        role="region"
        aria-labelledby="uslugi-heading"
      >
        <div className="mb-8 flex items-center justify-between gap-4 md:justify-center">
          <SectionGradientHeading id="uslugi-heading" title="Usługi" className="mb-0 min-w-0" />
          <div className="flex shrink-0 gap-2 md:hidden">
            <button
              type="button"
              onClick={scrollServicesPrev}
              disabled={!canScrollPrev}
              className="rounded-lg border border-prive-border bg-prive-surface p-2 text-prive-text transition-all hover:bg-prive-gradient hover:text-white disabled:pointer-events-none disabled:opacity-40"
              aria-label="Poprzednia usługa"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={scrollServicesNext}
              disabled={!canScrollNext}
              className="rounded-lg border border-prive-border bg-prive-surface p-2 text-prive-text transition-all hover:bg-prive-gradient hover:text-white disabled:pointer-events-none disabled:opacity-40"
              aria-label="Następna usługa"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
        </div>
        {!isDesktop ? (
          <div
            className="-mx-4 px-4"
            role="region"
            aria-label="Usługi — przewiń w poziomie"
          >
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex touch-pan-y gap-3">
                {TILES.map((tile) => (
                  <div
                    key={tile.id}
                    className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_72%]"
                  >
                    <ServiceTileCard
                      tile={tile}
                      layoutScope={layoutScope}
                      onSelect={() => selectTile(tile)}
                      compact
                      className="h-[min(72vw,320px)]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-[min(88vmin,680px)] grid-cols-3 gap-3.5">
            <div className="grid min-h-0 grid-rows-[2fr_1fr] gap-3.5">
              {DESKTOP_BENTO.left.map((id) => (
                <ServiceTileCard
                  key={id}
                  tile={tileById(id)}
                  layoutScope={layoutScope}
                  onSelect={() => selectTile(tileById(id))}
                  className="min-h-0"
                />
              ))}
            </div>
            <ServiceTileCard
              tile={tileById(DESKTOP_BENTO.center)}
              layoutScope={layoutScope}
              onSelect={() => selectTile(tileById(DESKTOP_BENTO.center))}
              className="h-full min-h-0"
            />
            <div className="grid min-h-0 grid-rows-[1fr_2fr] gap-3.5">
              {DESKTOP_BENTO.right.map((id) => (
                <ServiceTileCard
                  key={id}
                  tile={tileById(id)}
                  layoutScope={layoutScope}
                  onSelect={() => selectTile(tileById(id))}
                  className="min-h-0"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isMounted &&
        createPortal(
          <AnimatePresence>
            {activeTile ? (
              <>
                <motion.div
                  key="services-backdrop"
                  className="fixed inset-0 z-[220] hidden bg-black/65 backdrop-blur-sm md:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveTile(null)}
                />

                <div className="fixed inset-0 z-[221] flex items-center justify-center pointer-events-none md:p-6">
                  <motion.article
                    key={`service-modal-${activeTile.id}`}
                    layoutId={layoutCardId(layoutScope, activeTile.id)}
                    transition={panelTransition}
                    className={cn(
                      'pointer-events-auto overflow-hidden bg-[var(--prive-modal-surface)] text-white',
                      'h-[100dvh] w-screen max-h-[100dvh] rounded-none',
                      'md:h-[min(92vh,980px)] md:w-[min(94vw,1160px)] md:max-h-[min(92vh,980px)] md:rounded-3xl md:ring-1 md:ring-white/12',
                    )}
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeTile.title}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setActiveTile(null)}
                      aria-label="Zamknij"
                      initial={{ opacity: 0, scale: 0.78 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.78 }}
                      transition={{ delay: 0.16, duration: 0.24, ease: 'easeOut' }}
                      className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[4] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md transition hover:bg-prive/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose"
                    >
                      <X className="h-5 w-5" strokeWidth={2.3} />
                    </motion.button>

                    <div className="no-scrollbar h-full overflow-x-hidden overflow-y-auto overscroll-contain">
                      <div className="relative">
                        <motion.div
                          layoutId={layoutImageId(layoutScope, activeTile.id)}
                          className="relative h-[38dvh] min-h-[260px] w-full overflow-hidden md:h-[48vh] md:min-h-[420px]"
                        >
                          {activeTile.videoSrc ? (
                            <video
                              className="absolute inset-0 h-full w-full object-cover"
                              src={activeTile.videoSrc}
                              poster={activeTile.imageSrc}
                              muted
                              autoPlay
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={activeTile.imageSrc}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          )}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-prive-plum/40 to-black/20" />

                          <div className="absolute bottom-0 left-0 right-0 z-[2] px-5 pb-6 pt-12 text-white md:px-10 md:pb-9 md:pt-16">
                            <motion.h3
                              layoutId={layoutTitleId(layoutScope, activeTile.id)}
                              className="text-balance text-2xl font-bold leading-[1.02] tracking-tight md:text-[2.7rem]"
                            >
                              {activeTile.title}
                            </motion.h3>
                            <motion.p
                              layoutId={layoutTagsId(layoutScope, activeTile.id)}
                              className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-prive-rose/90 md:text-[0.8rem]"
                            >
                              {activeTile.tags}
                            </motion.p>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 14 }}
                        transition={{ delay: 0.24, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        className="mx-auto w-full max-w-3xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 md:px-10 md:pb-14 md:pt-10"
                      >
                        <p className="text-pretty text-sm leading-7 text-white/82 md:text-[1.03rem] md:leading-8">
                          {activeTile.article}
                        </p>
                        <button
                          type="button"
                          className="btn-prive mt-8 w-full sm:w-auto px-8 py-3.5 text-sm"
                          onClick={() => {
                            setActiveTile(null);
                            window.setTimeout(() => {
                              document
                                .getElementById('kalkulator-graftow')
                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 280);
                          }}
                        >
                          Konfigurator
                        </button>
                      </motion.div>
                    </div>
                  </motion.article>
                </div>
              </>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
