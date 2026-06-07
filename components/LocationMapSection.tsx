import { MapPin, Phone } from 'lucide-react';

import {
  CLINIC_ADDRESS_CITY,
  CLINIC_ADDRESS_STREET,
  CLINIC_MAP_DIRECTIONS_URL,
  CLINIC_MAP_EMBED_URL,
  CLINIC_PHONE,
  CLINIC_PHONE_HREF,
} from '@/lib/clinic';

export default function LocationMapSection() {
  return (
    <section
      aria-labelledby="location-map-heading"
      className="section-deferred--tall w-screen max-w-none bg-prive-white"
      style={{ marginInline: 'calc(50% - 50vw)' }}
    >
      <header className="border-t border-prive-border px-4 pb-6 pt-6 text-center sm:pb-8 sm:pt-8 md:pb-10 md:pt-10">
        <h2
          id="location-map-heading"
          className="text-prive-gradient text-2xl font-extrabold uppercase tracking-[0.14em] sm:text-3xl md:text-4xl"
        >
          Mapa dojazdu
        </h2>
      </header>

      <div className="relative h-[22rem] overflow-hidden sm:h-[25rem] md:h-[28rem] lg:h-[31.25rem]">
        <div className="absolute inset-0 z-[1]">
          <iframe
            src={CLINIC_MAP_EMBED_URL}
            title="Lokalizacja Hair Clinic PRIVÉ na mapie"
            className="size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[7.5rem] bg-gradient-to-b from-prive-plum via-prive-plum/55 to-transparent sm:h-[9.375rem] md:h-[12.5rem]"
        />

        <div className="absolute inset-x-0 bottom-0 z-[3] flex flex-col items-start justify-between gap-3 bg-prive-plum px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-4 md:px-10 lg:px-14">
          <a
            href={CLINIC_MAP_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-prive-rose/50"
          >
            <MapPin
              className="size-6 shrink-0 text-prive-rose sm:size-7"
              aria-hidden
            />
            <span className="flex flex-col gap-0.5 text-left">
              <span className="text-sm font-semibold text-white sm:text-base">
                {CLINIC_ADDRESS_STREET}
              </span>
              <span className="text-xs text-white/85 sm:text-sm">{CLINIC_ADDRESS_CITY}</span>
            </span>
          </a>

          <a
            href={CLINIC_PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-md text-xs font-bold uppercase tracking-widest text-white/90 outline-none transition-colors hover:text-prive-rose focus-visible:ring-2 focus-visible:ring-prive-rose/50 sm:text-sm"
          >
            <Phone className="size-4 shrink-0 text-prive-rose" aria-hidden />
            {CLINIC_PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}
