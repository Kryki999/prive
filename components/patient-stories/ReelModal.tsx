'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Phone, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { useConfigurator } from '@/components/consultation-form/configurator-shared';
import ReelVideoPlayer from '@/components/patient-stories/ReelVideoPlayer';
import { useSwipeGesture } from '@/components/patient-stories/useSwipeGesture';
import type { PatientStoryReel } from '@/components/patient-stories/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CLINIC_PHONE, CLINIC_PHONE_HREF } from '@/lib/clinic';
import { cn } from '@/lib/utils';

type ReelModalProps = {
  reels: PatientStoryReel[];
  currentIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  phoneNumber?: string;
};

export default function ReelModal({
  reels,
  currentIndex,
  open,
  onOpenChange,
  onNavigate,
  phoneNumber = CLINIC_PHONE,
}: ReelModalProps) {
  const { open: openConsultation } = useConfigurator();
  const [swipeEl, setSwipeEl] = useState<HTMLDivElement | null>(null);
  const swipeRef = useCallback((node: HTMLDivElement | null) => {
    setSwipeEl(node);
  }, []);

  const directionRef = useRef<'next' | 'prev'>('next');
  const reel = reels[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < reels.length - 1;

  const handleSwipeLeft = useCallback(() => {
    if (hasNext) {
      directionRef.current = 'next';
      onNavigate('next');
    }
  }, [hasNext, onNavigate]);

  const handleSwipeRight = useCallback(() => {
    if (hasPrev) {
      directionRef.current = 'prev';
      onNavigate('prev');
    }
  }, [hasPrev, onNavigate]);

  useSwipeGesture(swipeEl, handleSwipeLeft, handleSwipeRight, open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, hasPrev, hasNext, onNavigate]);

  if (!reel) return null;

  const phoneHref = phoneNumber === CLINIC_PHONE ? CLINIC_PHONE_HREF : `tel:${phoneNumber.replace(/\s/g, '')}`;

  const handleConsultation = () => {
    onOpenChange(false);
    requestAnimationFrame(() => openConsultation());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'gap-0 overflow-hidden !p-0',
          'max-h-[90vh] w-[calc(100vw-2rem)] border-white/10 bg-[var(--prive-modal-surface)]/95 backdrop-blur-xl',
          'md:max-h-[85vh] md:max-w-[900px]',
        )}
      >
        <div
          ref={swipeRef}
          className={cn(
            'relative h-full w-full touch-pan-y',
            'max-h-[90vh] overflow-y-auto reel-content-scrollbar',
            'md:max-h-[85vh] md:overflow-hidden',
          )}
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(
              'absolute right-3 top-3 z-[60]',
              'flex h-11 w-11 items-center justify-center rounded-full',
              'border border-white/20 bg-black/50 backdrop-blur-sm',
              'transition-colors hover:bg-black/70',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose',
            )}
            aria-label="Zamknij"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {hasPrev && (
            <button
              type="button"
              onClick={() => {
                directionRef.current = 'prev';
                onNavigate('prev');
              }}
              className={cn(
                'absolute left-3 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full md:flex',
                'border border-white/20 bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose',
              )}
              aria-label="Poprzednia historia"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={() => {
                directionRef.current = 'next';
                onNavigate('next');
              }}
              className={cn(
                'absolute right-3 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full md:flex',
                'border border-white/20 bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose',
              )}
              aria-label="Następna historia"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          )}

          <AnimatePresence mode="wait" custom={directionRef.current} initial={false}>
            <motion.div
              key={reel.id}
              custom={directionRef.current}
              variants={{
                enter: (dir: string) => ({ opacity: 0, x: dir === 'next' ? 80 : -80 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: string) => ({ opacity: 0, x: dir === 'next' ? -80 : 80 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="flex flex-col md:h-[85vh] md:flex-row"
            >
              <div
                className={cn(
                  'relative aspect-[9/16] bg-black',
                  'md:aspect-auto md:h-full md:w-[320px] md:min-w-[320px] md:flex-shrink-0',
                )}
              >
                <ReelVideoPlayer
                  videoUrl={reel.videoUrl}
                  videoPlaybackId={reel.videoPlaybackId}
                  posterUrl={reel.posterUrl}
                  autoPlay
                  className="absolute inset-0 h-full w-full"
                />
              </div>

              <div className="flex flex-col p-6 md:h-full md:flex-1 md:overflow-hidden md:p-0">
                <div
                  className={cn(
                    'flex flex-1 flex-col',
                    'md:justify-center md:overflow-y-auto md:p-8 reel-content-scrollbar',
                  )}
                >
                  <div className="md:py-8">
                    <DialogHeader className="mb-5">
                      <DialogTitle className="pr-10 text-2xl md:text-3xl">{reel.title}</DialogTitle>
                      <DialogDescription className="sr-only">
                        Historia podopiecznego: {reel.title}
                      </DialogDescription>
                    </DialogHeader>

                    {reel.tags && reel.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {reel.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-2 md:hidden">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        directionRef.current = 'prev';
                        onNavigate('prev');
                      }}
                      disabled={!hasPrev}
                      className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Poprzednia
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        directionRef.current = 'next';
                        onNavigate('next');
                      }}
                      disabled={!hasNext}
                      className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      Następna
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 text-center text-sm text-white/60 md:hidden">
                    {currentIndex + 1} / {reels.length}
                  </div>
                </div>

                <div
                  className={cn(
                    'mt-4 flex flex-col gap-3',
                    'md:mt-0 md:flex-shrink-0 md:border-t md:border-white/10 md:bg-black/30 md:p-6 md:pt-4 md:backdrop-blur-sm',
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleConsultation}
                      className="btn-prive flex-1 px-6 py-3 text-center text-sm"
                    >
                      Umów konsultację
                    </button>
                    <a
                      href={phoneHref}
                      className="btn-prive-outline flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm"
                    >
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      Zadzwoń
                    </a>
                  </div>
                  <div className="hidden text-center text-sm text-white/60 md:block">
                    {currentIndex + 1} / {reels.length}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
