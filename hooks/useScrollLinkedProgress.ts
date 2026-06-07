import { useEffect, type RefObject } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface ScrollLinkedProgressOptions {
  completeAt?: number;
  cssVar?: string;
}

export default function useScrollLinkedProgress(
  ref: RefObject<HTMLElement | null>,
  options: ScrollLinkedProgressOptions = {}
) {
  const { completeAt = 0.5, cssVar = '--newswire-bg-progress' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    const update = () => {
      if (prefersReducedMotion) {
        el.style.setProperty(cssVar, '1');
        return;
      }

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrolledInto = viewportHeight - rect.top;
      const threshold = Math.max(rect.height * completeAt, 1);
      const progress = clamp(scrolledInto / threshold, 0, 1);

      el.style.setProperty(cssVar, String(progress));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, completeAt, cssVar]);
}
