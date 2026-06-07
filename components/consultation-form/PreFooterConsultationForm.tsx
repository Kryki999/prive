'use client';

import { SECTION_GRADIENT_HEADING_CLASS } from '@/components/ui/section-gradient-heading';
import { cn } from '@/lib/utils';

import ConsultationFormBody from './ConsultationFormBody';
import { CONSULTATION_FORM_IMAGE } from './form-data';

export default function PreFooterConsultationForm() {
  return (
    <section
      id="kontakt"
      aria-labelledby="prefooter-consultation-heading"
      className="section-deferred--tall relative w-screen max-w-none scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] border-t border-prive-border bg-prive-white pb-8 pt-20 text-prive-text md:pb-10 md:pt-24 lg:pb-12 lg:pt-28"
      style={{ marginInline: 'calc(50% - 50vw)' }}
    >
      <div className="relative mx-auto w-full max-w-[1800px] px-0 md:px-10 lg:px-14 xl:px-16">
        <header className="mb-12 max-w-4xl px-6 md:mb-14 md:px-0">
          <h2
            id="prefooter-consultation-heading"
            className={cn(SECTION_GRADIENT_HEADING_CLASS, 'w-fit text-balance')}
          >
            Umów darmową konsultację
          </h2>
          <p className="mt-4 max-w-[66ch] text-pretty text-sm leading-relaxed text-prive-text-muted md:mt-5 md:text-base">
            Wybierz zabieg, dołącz zdjęcia i zostaw numer — nasz zespół skontaktuje się z Tobą
            tak szybko, jak to możliwe.
          </p>
        </header>

        <div className="overflow-hidden rounded-none border-y border-white/10 bg-[var(--prive-modal-surface)] shadow-[-12px_0_56px_rgba(0,0,0,0.25)] md:rounded-2xl md:border">
          <div className="flex min-h-0 flex-col md:min-h-[76vh] md:flex-row lg:min-h-[80vh]">
            <div className="relative hidden min-h-0 w-full flex-none md:flex md:w-1/2 md:flex-col">
              <div className="relative min-h-[42vh] flex-1 bg-prive-plum md:min-h-0">
                <img
                  src={CONSULTATION_FORM_IMAGE}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  aria-hidden
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--prive-modal-surface)]/25 via-transparent to-[var(--prive-modal-surface)]/65 md:bg-gradient-to-t md:from-[var(--prive-modal-surface)]/75 md:via-transparent md:to-transparent"
                />
                <div className="pointer-events-none absolute bottom-8 left-8 right-8 z-[1]">
                  <p className="max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
                    Precyzyjna wycena zaczyna się od Twoich zdjęć.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full bg-[var(--prive-modal-surface)] p-5 sm:p-6 md:w-1/2 md:p-10 lg:p-12">
              <div className="mx-auto max-w-2xl">
                <ConsultationFormBody
                  mode="drawer"
                  titleId="prefooter-consultation-form-title"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
