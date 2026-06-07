'use client';

import { motion, useReducedMotion } from 'motion/react';

import { BorderBeam } from '@/components/ui/border-beam';
import { cn } from '@/lib/utils';

type HeroCredentialsMarqueeProps = {
  items: readonly string[];
};

function MarqueeSeparator() {
  return (
    <span className="shrink-0 text-[0.5rem] text-prive-rose drop-shadow-[0_0_6px_rgba(229,0,126,0.55)] md:text-[0.55rem]">
      ◆
    </span>
  );
}

function MarqueeSegment({ items, id }: { items: readonly string[]; id: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 md:gap-4">
      {items.map((item, index) => (
        <span key={`${id}-${item}-${index}`} className="flex shrink-0 items-center gap-3 md:gap-4">
          {index > 0 ? <MarqueeSeparator /> : null}
          <span className="whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/80 md:text-xs">
            {item}
          </span>
        </span>
      ))}
      <MarqueeSeparator />
    </div>
  );
}

function MarqueeTrack({ items, animate }: { items: readonly string[]; animate: boolean }) {
  if (!animate) {
    return (
      <div className="flex items-center overflow-x-auto px-3 md:px-4">
        <MarqueeSegment items={items} id="static" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'hero-credentials-marquee overflow-hidden px-1',
        '[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]',
      )}
      aria-hidden
    >
      <div className="hero-credentials-marquee__track flex w-max items-center">
        <MarqueeSegment items={items} id="a" />
        <MarqueeSegment items={items} id="b" />
      </div>
    </div>
  );
}

export default function HeroCredentialsMarquee({ items }: HeroCredentialsMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const label = items.join(', ');

  const content = (
    <div
      className={cn(
        'relative w-full max-w-xl overflow-hidden rounded-full',
        'border border-white/10 bg-black/40 py-1.5 backdrop-blur-md md:max-w-2xl md:py-2',
        prefersReducedMotion && 'border-white/20',
      )}
      role="group"
      aria-label={`Atuty kliniki: ${label}`}
    >
      {!prefersReducedMotion ? (
        <BorderBeam
          size={32}
          duration={10}
          colorFrom="#E5007E"
          colorTo="#ffffff"
          borderWidth={1}
        />
      ) : null}
      <MarqueeTrack items={items} animate={!prefersReducedMotion} />
    </div>
  );

  if (prefersReducedMotion) {
    return content;
  }

  return (
    <motion.div
      className="w-full max-w-xl md:max-w-2xl"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}
