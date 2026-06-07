'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import GoogleGIcon from '@/components/brand/GoogleGIcon';
import { BorderBeam } from '@/components/ui/border-beam';
import { cn } from '@/lib/utils';

type HeroGoogleReviewBadgeProps = {
  rating: number;
  reviewCountLabel: string;
  href?: string;
};

function BadgeContent({
  rating,
  reviewCountLabel,
}: Omit<HeroGoogleReviewBadgeProps, 'href'>) {
  const prefersReducedMotion = useReducedMotion();

  const ratingLabel = rating.toLocaleString('pl-PL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-2 overflow-hidden rounded-full',
        'border border-white/10 bg-black/40 px-3 py-1.5 pr-8 backdrop-blur-md',
        'md:gap-2.5 md:px-4 md:py-2 md:pr-9',
        prefersReducedMotion && 'border-white/20',
      )}
    >
      {!prefersReducedMotion ? (
        <BorderBeam
          size={32}
          duration={8}
          colorFrom="#E5007E"
          colorTo="#ffffff"
          borderWidth={1}
        />
      ) : null}

      <GoogleGIcon className="absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-white/60 md:right-3 md:size-3.5" />

      <span className="shrink-0 text-base font-bold tabular-nums tracking-tight text-white drop-shadow md:text-lg">
        {ratingLabel}
      </span>

      <div className="flex shrink-0 items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className="size-2.5 fill-white/90 text-white/90 md:size-3"
            strokeWidth={1.5}
          />
        ))}
      </div>

      <span className="shrink-0 text-[0.65rem] text-white/70 md:text-xs">
        ({reviewCountLabel} opinii)
      </span>
    </div>
  );
}

export default function HeroGoogleReviewBadge({
  rating,
  reviewCountLabel,
  href,
}: HeroGoogleReviewBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const ariaLabel = `Ocena ${rating.toLocaleString('pl-PL')} na Google, ${reviewCountLabel} opinii`;

  const inner = <BadgeContent rating={rating} reviewCountLabel={reviewCountLabel} />;

  const wrapped = href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex transition-opacity hover:opacity-95"
      aria-label={ariaLabel}
    >
      {inner}
    </Link>
  ) : (
    <div className="inline-flex" role="group" aria-label={ariaLabel}>
      {inner}
    </div>
  );

  if (prefersReducedMotion) {
    return wrapped;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex"
    >
      {wrapped}
    </motion.div>
  );
}
