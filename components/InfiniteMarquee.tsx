'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { AwardItem } from '@/components/certificates/types';

export interface MarqueeItem {
  title: string;
  image?: string;
  href?: string;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[] | AwardItem[];
  speed?: 'fast' | 'slow';
  className?: string;
  trackOffsetClassName?: string;
  variant?: 'cover' | 'award';
  cardWidthClass?: string;
  aspectClass?: string;
  /** Pause CSS animation when section is off-screen. */
  paused?: boolean;
}

const DEFAULT_COVER_WIDTH = 'w-[130px] shrink-0 sm:w-[150px] md:w-[180px] lg:w-[210px]';
const DEFAULT_AWARD_WIDTH = 'w-[260px] shrink-0 sm:w-[300px] md:w-[360px] lg:w-[420px]';

function MarqueeCard({
  item,
  decorative = false,
  variant = 'cover',
  cardWidthClass,
  aspectClass,
}: {
  item: MarqueeItem | AwardItem;
  decorative?: boolean;
  variant?: 'cover' | 'award';
  cardWidthClass?: string;
  aspectClass?: string;
}) {
  const isAward = variant === 'award';
  const widthClass = cardWidthClass ?? (isAward ? DEFAULT_AWARD_WIDTH : DEFAULT_COVER_WIDTH);
  const aspect = aspectClass ?? (isAward ? 'aspect-[4/3]' : 'aspect-[3/4]');
  const href = !isAward && 'href' in item ? item.href : undefined;

  const inner = (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-xl border border-white/10',
        aspect,
        widthClass,
        isAward && 'bg-prive-plum/40',
      )}
      aria-hidden={decorative || undefined}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={decorative ? '' : item.title}
          fill
          className="object-cover"
          sizes={isAward ? '(max-width: 768px) 260px, 420px' : '(max-width: 768px) 130px, 210px'}
          draggable={false}
        />
      ) : null}
    </div>
  );

  if (href && !decorative) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 transition-transform duration-300 hover:scale-[1.02]"
        aria-label={item.title}
      >
        {inner}
      </a>
    );
  }

  return inner;
}

export default function InfiniteMarquee({
  items,
  speed = 'slow',
  className,
  trackOffsetClassName,
  variant = 'cover',
  cardWidthClass,
  aspectClass,
  paused = false,
}: InfiniteMarqueeProps) {
  const isAward = variant === 'award';

  return (
    <div
      className={cn(
        'game-library-marquee w-full overflow-hidden',
        speed === 'fast' ? 'game-library-marquee--fast' : 'game-library-marquee--slow',
        paused && 'game-library-marquee--paused',
        isAward && 'pointer-events-none',
        className,
      )}
      aria-hidden={isAward ? undefined : true}
      aria-label={isAward ? 'Certyfikaty i wyróżnienia — karuzela dekoracyjna' : undefined}
    >
      <div
        className={cn(
          'game-library-marquee__track flex w-max items-stretch gap-3 md:gap-4',
          trackOffsetClassName,
        )}
      >
        {items.map((item, index) => (
          <MarqueeCard
            key={`set-a-${item.title}-${index}`}
            item={item}
            variant={variant}
            cardWidthClass={cardWidthClass}
            aspectClass={aspectClass}
          />
        ))}
        {items.map((item, index) => (
          <MarqueeCard
            key={`set-b-${item.title}-${index}`}
            item={item}
            decorative
            variant={variant}
            cardWidthClass={cardWidthClass}
            aspectClass={aspectClass}
          />
        ))}
      </div>
    </div>
  );
}
