'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Doctor } from '@/components/doctors/types';

type DoctorCardProps = {
  doctor: Doctor;
  className?: string;
};

export default function DoctorCard({ doctor, className }: DoctorCardProps) {
  const tags = doctor.tags.slice(0, 3);

  return (
    <Link
      href={`/lekarze/${doctor.slug}`}
      className={cn(
        'group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl text-left',
        'border border-prive-border bg-prive-plum',
        'shadow-prive-card transition-all duration-500',
        'hover:border-prive-rose/40 hover:shadow-prive-card-hover',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose focus-visible:ring-offset-2 focus-visible:ring-offset-prive-white',
        className,
      )}
    >
      <div className="relative aspect-[5/6] w-full shrink-0 overflow-hidden bg-prive-plum">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-prive-plum/80 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col p-3">
        <h3 className="text-sm font-semibold leading-tight text-white">{doctor.name}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="shrink-0 truncate rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-white/75 transition-colors group-hover:border-white/25"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-2 line-clamp-1 text-[11px] leading-snug text-white/70">{doctor.shortBio}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-prive-rose transition-colors group-hover:text-white">
          <span>Dowiedz się więcej</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
