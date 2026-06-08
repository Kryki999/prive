import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

type AutoplayPhase = 'idle' | 'running' | 'pausedTouch' | 'suspended';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export interface UseHeroSlideAutoplayOptions {
  emblaApi: EmblaCarouselType | undefined;
  durationMs: number;
  /** `isInViewport && !prefersReducedMotion` */
  enabled: boolean;
  userWantsPlay: boolean;
}

export interface UseHeroSlideAutoplayResult {
  registerProgressFill: (el: HTMLDivElement | null) => void;
  isPlaying: boolean;
  onSlideAreaPointerDown: () => void;
  onSlideAreaPointerUp: () => void;
  notifySlideSelected: () => void;
  onUserPlay: () => void;
  onUserPause: () => void;
}

export default function useHeroSlideAutoplay({
  emblaApi,
  durationMs,
  enabled,
  userWantsPlay,
}: UseHeroSlideAutoplayOptions): UseHeroSlideAutoplayResult {
  const phaseRef = useRef<AutoplayPhase>('idle');
  const slideStartedAtRef = useRef(0);
  const slideEndsAtRef = useRef(0);
  const savedRemainingMsRef = useRef<number | null>(null);
  const slideAtPointerDownRef = useRef(0);
  const touchPauseStartedAtRef = useRef(0);
  const isAdvancingRef = useRef(false);
  const rafRef = useRef(0);
  const progressFillsRef = useRef<Set<HTMLDivElement>>(new Set());

  const userWantsPlayRef = useRef(userWantsPlay);
  const enabledRef = useRef(enabled);
  const emblaApiRef = useRef(emblaApi);

  useEffect(() => {
    userWantsPlayRef.current = userWantsPlay;
  }, [userWantsPlay]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    emblaApiRef.current = emblaApi;
  }, [emblaApi]);

  const applyProgress = useCallback((value: number) => {
    const scale = clamp(value, 0, 1);
    progressFillsRef.current.forEach((el) => {
      el.style.transform = `scaleX(${scale})`;
    });
  }, []);

  const registerProgressFill = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    progressFillsRef.current.add(el);
    return () => {
      progressFillsRef.current.delete(el);
    };
  }, []);

  const shouldAutoplay = useCallback(() => {
    return userWantsPlayRef.current && enabledRef.current;
  }, []);

  const computeProgress = useCallback(
    (now: number) => {
      const elapsed = now - slideStartedAtRef.current;
      return clamp(elapsed / durationMs, 0, 1);
    },
    [durationMs],
  );

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const restartTimer = useCallback(() => {
    const now = performance.now();
    slideStartedAtRef.current = now;
    slideEndsAtRef.current = now + durationMs;
    savedRemainingMsRef.current = null;
    isAdvancingRef.current = false;
    phaseRef.current = 'running';
    applyProgress(0);
  }, [applyProgress, durationMs]);

  const enterIdle = useCallback(() => {
    phaseRef.current = 'idle';
    stopLoop();
  }, [stopLoop]);

  const advanceSlide = useCallback(() => {
    const api = emblaApiRef.current;
    if (!api || isAdvancingRef.current) return;

    isAdvancingRef.current = true;
    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      api.scrollTo(0);
    }
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();

    const tick = (now: number) => {
      const phase = phaseRef.current;

      if (phase === 'running' && shouldAutoplay()) {
        applyProgress(computeProgress(now));

        if (now >= slideEndsAtRef.current && !isAdvancingRef.current) {
          advanceSlide();
        }
      }

      if (phase === 'running' || phase === 'pausedTouch') {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [advanceSlide, applyProgress, computeProgress, shouldAutoplay, stopLoop]);

  const suspendTimer = useCallback(() => {
    if (phaseRef.current === 'running' || phaseRef.current === 'pausedTouch') {
      savedRemainingMsRef.current = Math.max(0, slideEndsAtRef.current - performance.now());
      applyProgress(computeProgress(performance.now()));
    }
    phaseRef.current = 'suspended';
    stopLoop();
  }, [applyProgress, computeProgress, stopLoop]);

  const resumeFromSuspend = useCallback(() => {
    if (!shouldAutoplay()) {
      enterIdle();
      return;
    }

    const now = performance.now();
    const remaining = savedRemainingMsRef.current ?? durationMs;
    const clampedRemaining = Math.max(0, remaining);

    slideEndsAtRef.current = now + clampedRemaining;
    slideStartedAtRef.current = now - (durationMs - clampedRemaining);
    savedRemainingMsRef.current = null;
    phaseRef.current = 'running';
    applyProgress(computeProgress(now));
    startLoop();
  }, [applyProgress, computeProgress, durationMs, enterIdle, shouldAutoplay, startLoop]);

  const notifySlideSelected = useCallback(() => {
    isAdvancingRef.current = false;

    if (!shouldAutoplay()) {
      enterIdle();
      return;
    }

    restartTimer();
    startLoop();
  }, [enterIdle, restartTimer, shouldAutoplay, startLoop]);

  const onSlideAreaPointerDown = useCallback(() => {
    const api = emblaApiRef.current;
    if (!api || !shouldAutoplay()) return;

    slideAtPointerDownRef.current = api.selectedScrollSnap();
    touchPauseStartedAtRef.current = performance.now();
    if (phaseRef.current === 'running') {
      applyProgress(computeProgress(touchPauseStartedAtRef.current));
    }
    phaseRef.current = 'pausedTouch';
  }, [applyProgress, computeProgress, shouldAutoplay]);

  const onSlideAreaPointerUp = useCallback(() => {
    const api = emblaApiRef.current;
    if (!api || phaseRef.current !== 'pausedTouch') return;

    if (!shouldAutoplay()) {
      phaseRef.current = 'idle';
      stopLoop();
      return;
    }

    const holdMs = performance.now() - touchPauseStartedAtRef.current;
    slideStartedAtRef.current += holdMs;
    slideEndsAtRef.current += holdMs;

    phaseRef.current = 'running';
    startLoop();
  }, [shouldAutoplay, startLoop, stopLoop]);

  const onUserPlay = useCallback(() => {
    if (!enabledRef.current) return;
    restartTimer();
    startLoop();
  }, [restartTimer, startLoop]);

  const onUserPause = useCallback(() => {
    enterIdle();
  }, [enterIdle]);

  useEffect(() => {
    if (!enabled) {
      if (phaseRef.current === 'running' || phaseRef.current === 'pausedTouch') {
        suspendTimer();
      }
      return;
    }

    if (!userWantsPlay) {
      enterIdle();
      return;
    }

    if (phaseRef.current === 'suspended') {
      resumeFromSuspend();
      return;
    }

    if (phaseRef.current === 'idle') {
      restartTimer();
      startLoop();
    }
  }, [enabled, userWantsPlay, enterIdle, restartTimer, resumeFromSuspend, startLoop, suspendTimer]);

  useEffect(() => {
    return () => stopLoop();
  }, [stopLoop]);

  const isPlaying = userWantsPlay && enabled;

  return {
    registerProgressFill,
    isPlaying,
    onSlideAreaPointerDown,
    onSlideAreaPointerUp,
    notifySlideSelected,
    onUserPlay,
    onUserPause,
  };
}
