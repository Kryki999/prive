import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import DoctorConsultationCta from '@/components/doctors/DoctorConsultationCta';
import Footer from '@/components/Footer';
import SiteHeader from '@/components/SiteHeader';
import { getAllDoctorSlugs, getDoctorBySlug } from '@/lib/doctors/doctors';

type DoctorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllDoctorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    return { title: 'Lekarz nie znaleziony — Hair Clinic PRIVÉ' };
  }

  return {
    title: `${doctor.name} — Hair Clinic PRIVÉ`,
    description: doctor.shortBio,
  };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-prive-white text-prive-text selection:bg-prive-rose selection:text-white">
      <SiteHeader />

      <main className="pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Link
            href="/#lekarze"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-prive-text-muted transition-colors hover:text-prive-rose"
          >
            <ArrowLeft size={16} />
            Wróć do zespołu
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-prive-border bg-prive-plum shadow-prive-card lg:mx-0 lg:max-w-none">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                priority
                sizes="(max-width: 1024px) 384px, 380px"
                className="object-cover object-top"
              />
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-prive-rose">Zespół</span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-prive-plum sm:text-4xl">
                {doctor.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {doctor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-prive-border bg-prive-surface px-3 py-1 text-xs font-medium text-prive-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-4 text-base leading-relaxed text-prive-text-muted">
                {doctor.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 border-t border-prive-border pt-8">
                <DoctorConsultationCta />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
