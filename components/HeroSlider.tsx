'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
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
  slideProgress: number;
  isPlaying: boolean;
  prefersReducedMotion: boolean;
  onTogglePlay: () => void;
  onGoToSlide: (index: number) => void;
}

function HeroControls({
  variant,
  currentSlide,
  slideProgress,
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

  const progressScale = prefersReducedMotion ? 1 : slideProgress;
  const progressFillClass = cn(
    'absolute inset-0 origin-left rounded-full bg-white',
    !isPlaying && !prefersReducedMotion ? 'hero-progress-fill--paused' : '',
  );
  const progressStyle = { transform: `scaleX(${progressScale})` };

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
                <div className={progressFillClass} style={progressStyle} />
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
              <div className={progressFillClass} style={progressStyle} />
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [slideProgress, setSlideProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  const isInViewportRef = useRef(isInViewport);
  const progressDeadlineRef = useRef<number | null>(null);
  const isInteractionPausedRef = useRef(false);
  const isManualTimingRef = useRef(false);
  const savedRemainingMsRef = useRef<number | null>(null);
  const slideAtPointerDownRef = useRef(0);
  const pointerDownAtRef = useRef(0);
  const manualAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const readRemainingMs = useCallback((api: NonNullable<typeof emblaApi>) => {
    if (progressDeadlineRef.current != null) {
      return Math.max(0, progressDeadlineRef.current - Date.now());
    }
    const autoplay = api.plugins().autoplay;
    if (autoplay?.isPlaying()) {
      const remaining = autoplay.timeUntilNext();
      if (remaining != null) return Math.max(0, remaining);
    }
    return SLIDE_DURATION_MS;
  }, []);

  const autoplayPlugin = useRef(
    Autoplay({
      delay: SLIDE_DURATION_MS,
      stopOnInteraction: true,
      playOnInit: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      duration: EMBLA_SCROLL_DURATION,
      watchDrag: true,
    },
    [autoplayPlugin.current],
  );

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  useEffect(() => {
    isInViewportRef.current = isInViewport;
  }, [isInViewport]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const clearManualAdvance = useCallback(() => {
    if (manualAdvanceTimeoutRef.current) {
      clearTimeout(manualAdvanceTimeoutRef.current);
      manualAdvanceTimeoutRef.current = null;
    }
  }, []);

  const advanceSlide = useCallback(() => {
    if (!emblaApi) return;
    clearManualAdvance();
    isManualTimingRef.current = false;
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollTo(0);
    }
    if (isPlayingRef.current && !prefersReducedMotionRef.current) {
      emblaApi.plugins().autoplay?.reset();
    }
  }, [emblaApi, clearManualAdvance]);

  const scheduleResume = useCallback(
    (remainingMs: number) => {
      clearManualAdvance();
      const continueWith = Math.max(0, remainingMs);
      if (continueWith <= 0) {
        advanceSlide();
        return;
      }
      isManualTimingRef.current = true;
      progressDeadlineRef.current = Date.now() + continueWith;
      manualAdvanceTimeoutRef.current = setTimeout(advanceSlide, continueWith);
    },
    [advanceSlide, clearManualAdvance],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    if (prefersReducedMotion || !isInViewport) {
      autoplay.stop();
      clearManualAdvance();
    } else if (
      isPlaying &&
      !autoplay.isPlaying() &&
      !isInteractionPausedRef.current &&
      !isManualTimingRef.current
    ) {
      autoplay.play();
    }
  }, [emblaApi, prefersReducedMotion, isPlaying, isInViewport, clearManualAdvance]);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      if (prefersReducedMotion) setSlideProgress(1);
      return;
    }

    let frame = 0;
    const tick = () => {
      if (!isInteractionPausedRef.current && progressDeadlineRef.current != null) {
        const remaining = progressDeadlineRef.current - Date.now();
        const progress = Math.min(1, Math.max(0, 1 - remaining / SLIDE_DURATION_MS));
        setSlideProgress(progress);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, prefersReducedMotion, currentSlide]);

  useEffect(() => {
    if (!emblaApi) return;

    const syncSlide = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };

    const onAutoplayTimerSet = () => {
      if (!isPlayingRef.current || prefersReducedMotionRef.current) return;
      if (isInteractionPausedRef.current || isManualTimingRef.current) return;
      clearManualAdvance();
      progressDeadlineRef.current = Date.now() + SLIDE_DURATION_MS;
      setSlideProgress(0);
    };

    const onPointerDownCapture = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('[data-hero-content]')) return;

      clearManualAdvance();
      isManualTimingRef.current = false;
      savedRemainingMsRef.current = readRemainingMs(emblaApi);
      progressDeadlineRef.current = null;
      slideAtPointerDownRef.current = emblaApi.selectedScrollSnap();
      pointerDownAtRef.current = Date.now();
      isInteractionPausedRef.current = true;
      emblaApi.plugins().autoplay?.stop();
    };

    const finishInteraction = () => {
      if (!isInteractionPausedRef.current) return;
      isInteractionPausedRef.current = false;

      const savedRemaining = savedRemainingMsRef.current;
      savedRemainingMsRef.current = null;
      if (!isPlayingRef.current || prefersReducedMotionRef.current) return;

      const slideChanged = emblaApi.selectedScrollSnap() !== slideAtPointerDownRef.current;
      if (slideChanged) {
        isManualTimingRef.current = false;
        if (isInViewportRef.current) {
          emblaApi.plugins().autoplay?.reset();
        }
        return;
      }

      const heldMs = Date.now() - pointerDownAtRef.current;
      scheduleResume((savedRemaining ?? SLIDE_DURATION_MS) - heldMs);
    };

    const root = emblaApi.rootNode();
    root.addEventListener('pointerdown', onPointerDownCapture, true);
    emblaApi.on('select', syncSlide);
    emblaApi.on('reInit', syncSlide);
    emblaApi.on('pointerUp', finishInteraction);
    emblaApi.on('autoplay:timerset', onAutoplayTimerSet);
    syncSlide();

    return () => {
      root.removeEventListener('pointerdown', onPointerDownCapture, true);
      emblaApi.off('select', syncSlide);
      emblaApi.off('reInit', syncSlide);
      emblaApi.off('pointerUp', finishInteraction);
      emblaApi.off('autoplay:timerset', onAutoplayTimerSet);
      clearManualAdvance();
    };
  }, [emblaApi, clearManualAdvance, scheduleResume, readRemainingMs]);

  const goToSlide = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      if (isPlayingRef.current && !prefersReducedMotionRef.current && isInViewportRef.current) {
        emblaApi.plugins().autoplay?.reset();
      }
    },
    [emblaApi],
  );

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      const autoplay = emblaApi?.plugins().autoplay;
      if (prefersReducedMotionRef.current) return next;
      if (next) {
        clearManualAdvance();
        isManualTimingRef.current = false;
        isInteractionPausedRef.current = false;
        progressDeadlineRef.current = Date.now() + SLIDE_DURATION_MS;
        setSlideProgress(0);
        autoplay?.play();
      } else {
        clearManualAdvance();
        isManualTimingRef.current = false;
        isInteractionPausedRef.current = false;
        progressDeadlineRef.current = null;
        autoplay?.stop();
      }
      return next;
    });
  }, [emblaApi, clearManualAdvance]);

  const controlsProps = {
    currentSlide,
    slideProgress,
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
      style={{ '--hero-slide-duration': `${SLIDE_DURATION_MS}ms` } as React.CSSProperties}
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
