import dynamic from 'next/dynamic';

import HomeVideoBridge from '@/components/HomeVideoBridge';
import SiteHeader from '@/components/SiteHeader';
import HeroSlider from '@/components/HeroSlider';
import GraftCalculatorSection from '@/components/graft-calculator/GraftCalculatorSection';
import Newswire from '@/components/Newswire';
import Footer from '@/components/Footer';
import { DOCTORS } from '@/lib/doctors/doctors';

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
  return (
    <div className="relative min-h-screen overflow-x-clip bg-prive-white text-prive-text selection:bg-prive-rose selection:text-white">
      <SiteHeader />
      <HeroSlider />
      <Newswire />
      <GraftCalculatorSection />
      <HomeVideoBridge />
      <CertificatesSection />
      <DoctorsSection doctors={DOCTORS} />
      <CooperationSection />
      <AktualnosciSection />
      <AirportTransferSection />
      <PreFooterConsultationForm />
      <LocationMapSection />
      <Footer />
    </div>
  );
}
