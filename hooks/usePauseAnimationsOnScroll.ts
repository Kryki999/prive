import { useEffect } from 'react';

const SCROLL_CLASS = 'is-scrolling';
const SETTLE_MS = 150;

/** Pauzuje CSS marquee podczas scrolla — mniej konkurencji o compositor. */
export default function usePauseAnimationsOnScroll() {
  useEffect(() => {
    let settleTimer = 0;

    const onScroll = () => {
      document.documentElement.classList.add(SCROLL_CLASS);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        document.documentElement.classList.remove(SCROLL_CLASS);
      }, SETTLE_MS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(settleTimer);
      document.documentElement.classList.remove(SCROLL_CLASS);
    };
  }, []);
}
