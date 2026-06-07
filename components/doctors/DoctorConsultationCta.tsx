'use client';

import { useConfigurator } from '@/components/consultation-form/configurator-shared';

export default function DoctorConsultationCta() {
  const { open: openConsultation } = useConfigurator();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" onClick={openConsultation} className="btn-prive px-8 py-3 text-sm">
        Umów konsultację
      </button>
      <a href="/#kontakt" className="btn-prive-outline px-8 py-3 text-center text-sm">
        Skontaktuj się
      </a>
    </div>
  );
}
