'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { PatientStoryReel } from '@/components/patient-stories/types';

type ReelCardProps = {
  reel: PatientStoryReel;
  onClick: () => void;
  className?: string;
};

export default function ReelCard({ reel, onClick, className }: ReelCardProps) {
  const posterSrc =
    reel.posterUrl ||
    (reel.videoPlaybackId
      ? `https://image.mux.com/${reel.videoPlaybackId}/thumbnail.webp?time=0`
      : undefined);

  const tags = reel.tags?.slice(0, 2) ?? [];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl text-left',
        'border border-prive-border bg-prive-plum',
        'shadow-prive-card transition-all duration-500',
        'hover:border-prive-rose/40 hover:shadow-prive-card-hover',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose focus-visible:ring-offset-2 focus-visible:ring-offset-prive-white',
        className,
      )}
    >
      <div className="relative aspect-[9/16] w-full shrink-0 cursor-pointer overflow-hidden bg-prive-plum">
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt={reel.title}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-prive-plum/80" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-prive-plum/70 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full',
              'border border-white/30 bg-white/20 backdrop-blur-sm',
              'transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30',
            )}
          >
            <Play className="ml-1 h-6 w-6 fill-white text-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight text-white">
          {reel.title}
        </h3>
        <div className="mt-2.5 flex min-h-[1.75rem] flex-nowrap gap-1.5 overflow-hidden">
          {tags.map((tag) => (
            <span
              key={tag}
              className="shrink-0 truncate rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white/75 transition-colors group-hover:border-white/25"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
