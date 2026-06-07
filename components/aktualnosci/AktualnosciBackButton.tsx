'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { AktualnoscOrigin } from '@/lib/aktualnosci/data';

type AktualnosciBackButtonProps = {
  origin: AktualnoscOrigin;
  label?: string;
  className?: string;
};

function getBackTarget(origin: AktualnoscOrigin) {
  if (origin === 'home') {
    return {
      href: '/#aktualnosci',
      label: 'Wróć na stronę główną',
    };
  }

  return {
    href: '/aktualnosci',
    label: 'Wróć do aktualności',
  };
}

export default function AktualnosciBackButton({
  origin,
  label,
  className,
}: AktualnosciBackButtonProps) {
  const target = getBackTarget(origin);

  return (
    <Link
      href={target.href}
      className={cn(
        'group inline-flex items-center gap-2 rounded-md text-sm font-medium text-prive-text-muted transition-colors hover:text-prive-plum',
        'outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/45 focus-visible:ring-offset-2',
        className,
      )}
    >
      <ArrowLeft
        className="size-4 transition-transform group-hover:-translate-x-1"
        strokeWidth={1.5}
        aria-hidden
      />
      {label ?? target.label}
    </Link>
  );
}
