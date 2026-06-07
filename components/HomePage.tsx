'use client';

import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import AktualnosciSection from '@/components/aktualnosci/AktualnosciSection';
import HeroSlider from '@/components/HeroSlider';
import GraftCalculatorSection from '@/components/graft-calculator/GraftCalculatorSection';
import Newswire from '@/components/Newswire';
import GameDetails from '@/components/GameDetails';
import CertificatesSection from '@/components/certificates/CertificatesSection';
import { DoctorsSection } from '@/components/doctors';
import { DOCTORS } from '@/lib/doctors/doctors';
import CooperationSection from '@/components/CooperationSection';
import AirportTransferSection from '@/components/airport-transfer/AirportTransferSection';
import PreFooterConsultationForm from '@/components/consultation-form/PreFooterConsultationForm';
import LocationMapSection from '@/components/LocationMapSection';
import Footer from '@/components/Footer';
import TrailerModal from '@/components/TrailerModal';

export default function HomePage() {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-prive-white text-prive-text selection:bg-prive-rose selection:text-white">
      <SiteHeader />
      <HeroSlider />
      <Newswire />
      <GraftCalculatorSection />
      <GameDetails onPlayVideo={setActiveVideoUrl} />
      <CertificatesSection />
      <DoctorsSection doctors={DOCTORS} />
      <CooperationSection />
      <AktualnosciSection />
      <AirportTransferSection />
      <PreFooterConsultationForm />
      <LocationMapSection />
      <Footer />
      <TrailerModal videoUrl={activeVideoUrl} onClose={() => setActiveVideoUrl(null)} />
    </div>
  );
}
