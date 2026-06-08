'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Play, Pause, Info, Mail } from 'lucide-react';
import PriveLogo from '@/components/brand/PriveLogo';
import { useConfigurator } from '@/components/consultation-form/configurator-shared';
import HeroCredentialsMarquee from '@/components/hero/HeroCredentialsMarquee';
import HeroGoogleReviewBadge from '@/components/hero/HeroGoogleReviewBadge';
import HeroTrustStrip from '@/components/hero/HeroTrustStrip';
import { HERO_CREDENTIALS_ITEMS } from '@/lib/hero/credentials-marquee';
import { HERO_GOOGLE_REVIEW } from '@/lib/hero/google-review';
import { HERO_TRUST_AVATARS } from '@/lib/hero/trust-avatars';
import { HERO_SLIDE_CONFIG, resolveHeroSlideImages } from '@/lib/site-images';
import useHeroSlideAutoplay from '@/hooks/useHeroSlideAutoplay';
import useInViewport from '@/hooks/useInViewport';
import { cn } from '@/lib/utils';

interface SlideTrustStrip {
  label: string;
  overflowCount: number;
  overflowHref: string;
}

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  bgImageDesktop: string;
  bgImageMobile: string;
  secondaryBtnText: string;
  secondaryHref: string;
  trustStrip?: SlideTrustStrip;
  googleReviewBadge?: boolean;
  credentialsMarquee?: boolean;
}

const SLIDE_DURATION_MS = 6000;
const EMBLA_SCROLL_DURATION = 19;

const ctaPillSizeClass =
  'shrink-0 whitespace-nowrap text-xs px-5 py-3 tracking-wider gap-2 md:text-sm md:px-6 md:py-3.5';

const ctaOutlineClass = cn(
  'btn-pill-outline btn-pill-outline--light',
  ctaPillSizeClass,
);

const ctaPrivePillClass = cn('btn-prive btn-prive--pill', ctaPillSizeClass);

const slides: Slide[] = HERO_SLIDE_CONFIG.map((config) => {
  const { desktop, mobile } = resolveHeroSlideImages(config.photo);
  return {
    id: config.id,
    title: config.title,
    subtitle: config.subtitle,
    bgImageDesktop: desktop,
    bgImageMobile: mobile,
    secondaryBtnText: config.secondaryBtnText,
    secondaryHref: config.secondaryHref,
    trustStrip: config.trustStrip,
    googleReviewBadge: config.googleReviewBadge,
    credentialsMarquee: config.credentialsMarquee,
  };
});

function SlideContent({ slide }: { slide: Slide }) {
  const { open: openConsultation } = useConfigurator();

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-4 md:gap-5',
        (slide.trustStrip || slide.googleReviewBadge || slide.credentialsMarquee) &&
          'gap-3 sm:gap-4',
      )}
    >
      {slide.credentialsMarquee ? (
        <HeroCredentialsMarquee items={HERO_CREDENTIALS_ITEMS} />
      ) : null}
      {slide.googleReviewBadge ? (
        <HeroGoogleReviewBadge
          rating={HERO_GOOGLE_REVIEW.rating}
          reviewCountLabel={HERO_GOOGLE_REVIEW.reviewCountLabel}
          href={HERO_GOOGLE_REVIEW.href}
        />
      ) : null}
      {slide.trustStrip ? (
        <HeroTrustStrip
          label={slide.trustStrip.label}
          avatars={HERO_TRUST_AVATARS}
          overflowCount={slide.trustStrip.overflowCount}
          overflowHref={slide.trustStrip.overflowHref}
        />
      ) : null}
      <div className="flex w-full min-w-0 max-w-full flex-row items-center gap-3 md:gap-7 lg:gap-8">
        <div className="shrink-0 origin-left scale-[0.95] sm:scale-100 md:scale-110 lg:scale-[1.25] md:mr-3 lg:mr-4">
          <PriveLogo variant="hero" hairRose className="items-start" />
        </div>
        <hgroup className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1">
          <h2 className="text-lg sm:text-xl md:text-4xl font-bold leading-tight tracking-wide text-white drop-shadow line-clamp-3 sm:line-clamp-none">
            {slide.subtitle}
          </h2>
          {slide.title ? (
            <p className="text-lg sm:text-xl md:text-4xl font-bold leading-tight tracking-wide text-white drop-shadow line-clamp-3 sm:line-clamp-none">
              {slide.title}
            </p>
          ) : null}
        </hgroup>
      </div>

      <div className="flex w-full min-w-0 flex-col items-start gap-2.5 md:flex-row md:flex-nowrap md:items-center md:gap-4">
        <button type="button" onClick={openConsultation} className={ctaPrivePillClass}>
          <Mail className="size-4 shrink-0" aria-hidden />
          Umów Konsultacje
        </button>
        <a href={slide.secondaryHref} className={ctaOutlineClass}>
          <Info className="size-4 shrink-0" aria-hidden />
          {slide.secondaryBtnText}
        </a>
      </div>
    </div>
  );
}

interface HeroControlsProps {
  variant: 'desktop' | 'mobile';
  currentSlide: number;
  registerProgressFill: (el: HTMLDivElement | null) => void;
  isPlaying: boolean;
  prefersReducedMotion: boolean;
  onTogglePlay: () => void;
  onGoToSlide: (index: number) => void;
}

function HeroControls({
  variant,
  currentSlide,
  registerProgressFill,
  isPlaying,
  prefersReducedMotion,
  onTogglePlay,
  onGoToSlide,
}: HeroControlsProps) {
  const playPauseButton = (
    <button
      type="button"
      onClick={onTogglePlay}
      className="shrink-0 text-white/90 hover:text-white transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
      aria-label={
        isPlaying ? 'Wstrzymaj automatyczne przewijanie' : 'Wznów automatyczne przewijanie'
      }
    >
      {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
    </button>
  );

  const progressFillClass = 'absolute inset-0 origin-left rounded-full bg-white';
  const progressStyle = prefersReducedMotion ? { transform: 'scaleX(1)' } : undefined;

  if (variant === 'desktop') {
    return (
      <div className="hidden md:flex items-center gap-3 shrink-0">
        {playPauseButton}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) =>
            idx === currentSlide ? (
              <div
                key={idx}
                className="relative h-1.5 w-10 rounded-full bg-white/30 overflow-hidden"
                aria-hidden
              >
                <div
                  ref={prefersReducedMotion ? undefined : registerProgressFill}
                  className={progressFillClass}
                  style={progressStyle}
                />
              </div>
            ) : (
              <button
                key={idx}
                type="button"
                onClick={() => onGoToSlide(idx)}
                className="h-2 w-2 rounded-full bg-white/40 hover:bg-white transition-colors"
                aria-label={`Przejdź do slajdu ${idx + 1}`}
              />
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:hidden items-center gap-3 w-full">
      <div className="flex flex-1 items-center gap-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onGoToSlide(idx)}
            className="relative flex-1 h-1 rounded-full bg-white/25 overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
            aria-label={`Przejdź do slajdu ${idx + 1}`}
            aria-current={idx === currentSlide ? 'true' : undefined}
          >
            {idx === currentSlide ? (
              <div
                ref={prefersReducedMotion ? undefined : registerProgressFill}
                className={progressFillClass}
                style={progressStyle}
              />
            ) : null}
          </button>
        ))}
      </div>
      {playPauseButton}
    </div>
  );
}

export default function HeroSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInViewport = useInViewport(sectionRef);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userWantsPlay, setUserWantsPlay] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    duration: EMBLA_SCROLL_DURATION,
    watchDrag: true,
  });

  const autoplayEnabled = isInViewport && !prefersReducedMotion;

  const {
    registerProgressFill,
    isPlaying,
    onSlideAreaPointerDown,
    onSlideAreaPointerUp,
    notifySlideSelected,
    onUserPlay,
    onUserPause,
  } = useHeroSlideAutoplay({
    emblaApi,
    durationMs: SLIDE_DURATION_MS,
    enabled: autoplayEnabled,
    userWantsPlay,
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const syncSlide = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
      notifySlideSelected();
    };

    const onPointerDownCapture = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('[data-hero-content]')) return;
      onSlideAreaPointerDown();
    };

    const root = emblaApi.rootNode();
    root.addEventListener('pointerdown', onPointerDownCapture, true);
    emblaApi.on('select', syncSlide);
    emblaApi.on('reInit', syncSlide);
    emblaApi.on('pointerUp', onSlideAreaPointerUp);
    syncSlide();

    return () => {
      root.removeEventListener('pointerdown', onPointerDownCapture, true);
      emblaApi.off('select', syncSlide);
      emblaApi.off('reInit', syncSlide);
      emblaApi.off('pointerUp', onSlideAreaPointerUp);
    };
  }, [emblaApi, notifySlideSelected, onSlideAreaPointerDown, onSlideAreaPointerUp]);

  const goToSlide = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const handleTogglePlay = useCallback(() => {
    setUserWantsPlay((prev) => {
      const next = !prev;
      if (prefersReducedMotion) return next;
      if (next) {
        onUserPlay();
      } else {
        onUserPause();
      }
      return next;
    });
  }, [onUserPlay, onUserPause, prefersReducedMotion]);

  const controlsProps = {
    currentSlide,
    registerProgressFill,
    isPlaying,
    prefersReducedMotion,
    onTogglePlay: handleTogglePlay,
    onGoToSlide: goToSlide,
  };

  return (
    <section
      ref={sectionRef}
      id="start"
      className="relative w-full max-w-[100vw] h-[85vh] md:h-[88vh] bg-prive-dark overflow-hidden"
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative min-w-0 flex-[0_0_100%] h-full"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-prive-dark/25 via-transparent to-transparent z-10 pointer-events-none" />
                <picture>
                  <source media="(min-width: 768px)" srcSet={slide.bgImageDesktop} />
                  <img
                    src={slide.bgImageMobile}
                    alt={slide.title || slide.subtitle}
                    loading={index <= 1 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover object-center"
                  />
                </picture>
              </div>

              <div
                data-hero-content
                className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-12 md:px-20 pb-24 md:pb-20"
                onPointerDownCapture={(event) => event.stopPropagation()}
              >
                <div className="w-full min-w-0 max-w-4xl">
                  <SlideContent slide={slide} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-12 md:px-20 pb-12 md:pb-20 pointer-events-none">
        <div className="flex items-end justify-end w-full max-w-full">
          <div className="w-full max-w-4xl min-w-0 pointer-events-auto md:hidden">
            <HeroControls variant="mobile" {...controlsProps} />
          </div>
          <div className="pointer-events-auto">
            <HeroControls variant="desktop" {...controlsProps} />
          </div>
        </div>
      </div>

      <div className="hero-glow-top" aria-hidden="true" />
      <div className="hero-glow-bottom" aria-hidden="true" />
    </section>
  );
}
