'use client';

import { useConfigurator } from '@/components/consultation-form/configurator-shared';

export default function DoctorConsultationCta() {
  const { open: openConsultation } = useConfigurator();

  return (
    <div className="flex justify-start lg:justify-end">
      <button type="button" onClick={openConsultation} className="btn-prive px-8 py-3 text-sm">
        Umów konsultację
      </button>
    </div>
  );
}
