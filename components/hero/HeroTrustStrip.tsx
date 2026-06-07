'use client';

import { motion, useReducedMotion } from 'motion/react';

import { AvatarCircles, type AvatarCircleItem } from '@/components/ui/avatar-circles';

type HeroTrustStripProps = {
  label: string;
  avatars: AvatarCircleItem[];
  overflowCount: number;
  overflowHref: string;
};

export default function HeroTrustStrip({
  label,
  avatars,
  overflowCount,
  overflowHref,
}: HeroTrustStripProps) {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <div className="flex items-center gap-2.5 md:gap-3">
      <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-widest text-white/75 drop-shadow md:text-xs">
        {label}
      </span>
      <AvatarCircles
        avatarUrls={avatars}
        overflowCount={overflowCount}
        overflowHref={overflowHref}
      />
    </div>
  );

  if (prefersReducedMotion) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}
