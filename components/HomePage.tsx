'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import SiteHeader from '@/components/SiteHeader';
import HeroSlider from '@/components/HeroSlider';
import GraftCalculatorSection from '@/components/graft-calculator/GraftCalculatorSection';
import Newswire from '@/components/Newswire';
import Footer from '@/components/Footer';
import TrailerModal from '@/components/TrailerModal';
import { DOCTORS } from '@/lib/doctors/doctors';

const GameDetails = dynamic(() => import('@/components/GameDetails'), { ssr: true });
const CertificatesSection = dynamic(
  () => import('@/components/certificates/CertificatesSection'),
  { ssr: true },
);
const DoctorsSection = dynamic(
  () => import('@/components/doctors').then((mod) => mod.DoctorsSection),
  { ssr: true },
);
const CooperationSection = dynamic(() => import('@/components/CooperationSection'), { ssr: true });
const AktualnosciSection = dynamic(
  () => import('@/components/aktualnosci/AktualnosciSection'),
  { ssr: true },
);
const AirportTransferSection = dynamic(
  () => import('@/components/airport-transfer/AirportTransferSection'),
  { ssr: true },
);
const PreFooterConsultationForm = dynamic(
  () => import('@/components/consultation-form/PreFooterConsultationForm'),
  { ssr: true },
);
const LocationMapSection = dynamic(() => import('@/components/LocationMapSection'), {
  ssr: true,
});

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
