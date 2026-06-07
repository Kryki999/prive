'use client';

import InfiniteMarquee from '@/components/InfiniteMarquee';
import { BOTTOM_ROW_AWARDS, TOP_ROW_AWARDS } from '@/lib/awards/items';

export default function CertificatesSection() {
  return (
    <section
      id="wyróznienia"
      className="relative left-1/2 min-h-[440px] w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] overflow-hidden bg-prive-plum md:min-h-[500px]"
      aria-labelledby="certificates-heading"
    >
      <div className="relative z-0 flex w-full flex-col gap-3 py-10 md:gap-4 md:py-12">
        <InfiniteMarquee items={TOP_ROW_AWARDS} speed="fast" variant="award" />
        <InfiniteMarquee
          items={BOTTOM_ROW_AWARDS}
          speed="slow"
          variant="award"
          trackOffsetClassName="-ml-16 md:-ml-24 lg:-ml-32"
        />
      </div>

      <div className="certificates-scrim-top" aria-hidden />
      <div className="certificates-scrim" aria-hidden />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-8 pt-24 md:px-10 md:pb-10 md:pt-32 lg:pt-36">
        <h2
          id="certificates-heading"
          className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          Certyfikaty i wyróżnienia
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
          Nagrody branżowe, wzmianki w mediach i członkostwa w organizacjach medycznych — potwierdzenie
          jakości Hair Clinic PRIVÉ.
        </p>
      </div>
    </section>
  );
}
