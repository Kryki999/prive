import { useEffect, type RefObject } from 'react';

/**
 * Preloads image URLs when `ref` enters the viewport (one-shot).
 * Spreads decode work before the user reaches downstream sections.
 */
export default function usePrefetchImagesWhenVisible(
  ref: RefObject<Element | null>,
  imageUrls: string[],
  rootMargin = '200px',
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || imageUrls.length === 0) return;

    let prefetched = false;
    const links: HTMLLinkElement[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (prefetched || !entries.some((entry) => entry.isIntersecting)) return;
        prefetched = true;
        observer.disconnect();

        for (const href of imageUrls) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = href;
          document.head.appendChild(link);
          links.push(link);
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      for (const link of links) {
        link.remove();
      }
    };
  }, [ref, imageUrls, rootMargin]);
}
