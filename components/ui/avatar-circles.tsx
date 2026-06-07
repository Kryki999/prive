'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export type AvatarCircleItem = {
  imageUrl: string;
  alt: string;
  href?: string;
};

type AvatarCirclesProps = {
  className?: string;
  avatarUrls: AvatarCircleItem[];
  overflowCount?: number;
  overflowHref?: string;
  imageClassName?: string;
  overflowClassName?: string;
};

function AvatarWrapper({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
}

export function AvatarCircles({
  className,
  avatarUrls,
  overflowCount,
  overflowHref,
  imageClassName,
  overflowClassName,
}: AvatarCirclesProps) {
  const defaultImageClass =
    'h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-white/90 object-cover shadow-[0_2px_8px_rgba(0,0,0,0.35)]';

  return (
    <div className={cn('z-10 flex -space-x-3 md:-space-x-4 rtl:space-x-reverse', className)}>
      {avatarUrls.map((avatar, index) => (
        <AvatarWrapper
          key={`${avatar.imageUrl}-${index}`}
          href={avatar.href}
          className="relative inline-block transition-transform hover:z-20 hover:scale-105"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cn(defaultImageClass, imageClassName)}
            src={avatar.imageUrl}
            width={40}
            height={40}
            alt={avatar.alt}
          />
        </AvatarWrapper>
      ))}
      {(overflowCount ?? 0) > 0 ? (
        <AvatarWrapper
          href={overflowHref}
          className={cn(
            'relative inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 border-white/90 text-center text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform hover:z-20 hover:scale-105 md:text-xs',
            'bg-[linear-gradient(135deg,var(--prive-rose)_0%,var(--prive-plum)_100%)]',
            overflowClassName,
          )}
        >
          +{overflowCount}
        </AvatarWrapper>
      ) : null}
    </div>
  );
}
