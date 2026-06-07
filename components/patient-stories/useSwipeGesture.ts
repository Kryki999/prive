'use client';

import { useEffect } from 'react';

export function useSwipeGesture(
  el: HTMLElement | null,
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!el || !enabled) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > 50 && absDeltaX > absDeltaY * 1.5) {
        if (deltaX < 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [el, onSwipeLeft, onSwipeRight, enabled]);
}
