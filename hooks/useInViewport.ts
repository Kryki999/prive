import { useEffect, useState, type RefObject } from 'react';

export interface UseInViewportOptions {
  rootMargin?: string;
  threshold?: number | number[];
  /** When false, observer disconnects after first intersection (one-shot). */
  continuous?: boolean;
}

/**
 * Tracks whether `ref` intersects the viewport via IntersectionObserver.
 * Defaults: rootMargin 100px, threshold 0, continuous updates.
 */
export default function useInViewport(
  ref: RefObject<Element | null>,
  options: UseInViewportOptions = {},
): boolean {
  const { rootMargin = '100px', threshold = 0, continuous = true } = options;
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.some((entry) => entry.isIntersecting);
        setIsInViewport(intersecting);
        if (!continuous && intersecting) {
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, continuous]);

  return isInViewport;
}
