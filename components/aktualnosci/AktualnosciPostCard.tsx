import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

import {
  formatAktualnoscDate,
  getAktualnoscHref,
  type AktualnoscItem,
  type AktualnoscOrigin,
} from '@/lib/aktualnosci/data';
import { cn } from '@/lib/utils';

type AktualnosciPostCardProps = {
  post: AktualnoscItem;
  from?: AktualnoscOrigin;
  featured?: boolean;
  className?: string;
};

export default function AktualnosciPostCard({
  post,
  from = 'blog',
  featured = false,
  className,
}: AktualnosciPostCardProps) {
  return (
    <Link
      href={getAktualnoscHref(post.slug, from)}
      className={cn(
        'group relative block h-full min-h-[280px] overflow-hidden rounded-2xl border border-prive-border/80 outline-none',
        'transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 hover:border-prive-rose/35 hover:shadow-prive-card-hover',
        'focus-visible:ring-2 focus-visible:ring-prive-rose/45 focus-visible:ring-offset-2',
        featured && 'min-h-[520px] lg:min-h-0',
        className,
      )}
    >
      <Image
        src={post.image}
        alt={post.imageAlt}
        fill
        sizes={
          featured
            ? '(max-width: 1024px) 100vw, 55vw'
            : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        }
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-prive-plum via-prive-plum/55 to-prive-plum/10"
      />
      <div className="absolute inset-x-0 bottom-0 z-[1] space-y-3 p-5 md:p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/75">
          <Calendar className="size-3.5" strokeWidth={1.5} aria-hidden />
          <time dateTime={post.date}>{formatAktualnoscDate(post.date)}</time>
        </div>
        <h3
          className={cn(
            'text-pretty font-bold leading-[1.12] tracking-tight text-white transition-colors group-hover:text-prive-rose',
            featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg md:text-xl',
          )}
        >
          {post.title}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-prive-rose transition-colors group-hover:text-white">
          Czytaj więcej
          <ArrowRight
            className="size-3.5 translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
