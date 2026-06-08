'use client';

import usePauseAnimationsOnScroll from '@/hooks/usePauseAnimationsOnScroll';

export default function ScrollPerfProvider({ children }: { children: React.ReactNode }) {
  usePauseAnimationsOnScroll();
  return children;
}
