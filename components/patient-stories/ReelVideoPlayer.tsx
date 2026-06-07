'use client';

import { cn } from '@/lib/utils';

type ReelVideoPlayerProps = {
  videoUrl?: string;
  videoPlaybackId?: string;
  posterUrl?: string;
  autoPlay?: boolean;
  className?: string;
};

/**
 * Demo: odtwarza pliki przez `videoUrl`.
 * Produkcja: podłącz @mux/mux-player-react gdy `videoPlaybackId` jest ustawione.
 */
export default function ReelVideoPlayer({
  videoUrl,
  videoPlaybackId,
  posterUrl,
  autoPlay = false,
  className,
}: ReelVideoPlayerProps) {
  if (videoPlaybackId) {
    // TODO(produkcja): zamień na <MuxPlayer playbackId={videoPlaybackId} />
    return (
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-prive-plum/90 p-4 text-center text-sm text-white/80',
          className,
        )}
      >
        Wideo Mux — dodaj @mux/mux-player-react i ustaw videoPlaybackId
      </div>
    );
  }

  if (videoUrl) {
    return (
      <video
        key={videoUrl}
        src={videoUrl}
        poster={posterUrl}
        controls
        autoPlay={autoPlay}
        playsInline
        className={cn('absolute inset-0 h-full w-full object-contain', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-prive-plum/80 text-prive-text-muted',
        className,
      )}
    >
      Brak wideo
    </div>
  );
}
