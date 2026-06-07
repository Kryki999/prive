'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

type ImageComparisonSliderProps = {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  className?: string;
};

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Przed',
  afterLabel = 'Po',
  title,
  className,
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.stopPropagation();
      isDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      e.stopPropagation();
      e.preventDefault();
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  }, []);

  const roundedPosition = Math.round(sliderPosition);

  return (
    <div
      ref={containerRef}
      data-before-after-interactive
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={roundedPosition}
      aria-label={title ? `Porównanie przed i po: ${title}` : 'Porównanie przed i po zabiegu'}
      className={cn(
        'relative w-full select-none overflow-hidden rounded-t-2xl touch-none cursor-ew-resize',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose focus-visible:ring-inset',
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={title ? `Po zabiegu — ${title}` : afterLabel}
          fill
          sizes="(max-width: 1024px) 90vw, 25vw"
          className="object-cover object-top"
          draggable={false}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={title ? `Przed zabiegiem — ${title}` : beforeLabel}
          fill
          sizes="(max-width: 1024px) 90vw, 25vw"
          className="object-cover object-top"
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white/90"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-prive-rose shadow-lg">
          <ChevronLeft className="h-3.5 w-3.5 text-white" aria-hidden />
          <ChevronRight className="h-3.5 w-3.5 text-white" aria-hidden />
        </div>
      </div>

      <div className="absolute top-3 left-3 z-10 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 z-10 rounded-full bg-prive-rose/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {afterLabel}
      </div>
    </div>
  );
}
