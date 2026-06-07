import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock } from 'lucide-react';

import AktualnosciBackButton from '@/components/aktualnosci/AktualnosciBackButton';
import Footer from '@/components/Footer';
import SiteHeader from '@/components/SiteHeader';
import {
  AKTUALNOSCI_ITEMS,
  estimateReadTime,
  formatAktualnoscDate,
  getAktualnoscBySlug,
  type AktualnoscOrigin,
} from '@/lib/aktualnosci/data';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateStaticParams() {
  return AKTUALNOSCI_ITEMS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAktualnoscBySlug(slug);

  if (!post) {
    return { title: 'Wpis nie znaleziony — Hair Clinic PRIVÉ' };
  }

  return {
    title: `${post.title} — Hair Clinic PRIVÉ`,
    description: post.excerpt,
  };
}

function resolveOrigin(from: string | undefined): AktualnoscOrigin {
  return from === 'home' ? 'home' : 'blog';
}

export default async function AktualnoscArticlePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { from } = await searchParams;
  const post = getAktualnoscBySlug(slug);

  if (!post) {
    notFound();
  }

  const origin = resolveOrigin(from);
  const readTime = estimateReadTime(post.body);

  return (
    <>
      <main className="relative min-h-screen bg-prive-white text-prive-text">
        <SiteHeader />

        <article className="px-4 pb-20 pt-[calc(var(--site-header-h,5.5rem)+1.25rem)] md:px-8 md:pb-28 md:pt-[calc(var(--site-header-h,5rem)+1.75rem)]">
          <div className="mx-auto max-w-4xl">
            <AktualnosciBackButton origin={origin} className="mb-8 md:mb-10" />

            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl border border-prive-border shadow-prive-card md:mb-10">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-prive-plum/35 via-transparent to-transparent"
              />
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-prive-text-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" strokeWidth={1.5} aria-hidden />
                  <time dateTime={post.date}>{formatAktualnoscDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" strokeWidth={1.5} aria-hidden />
                  {readTime} min czytania
                </div>
              </div>

              <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-prive-plum md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mt-6 border-l-4 border-prive-rose pl-4 text-lg leading-relaxed text-prive-text-muted md:text-xl">
                {post.excerpt}
              </p>

              <div className="mt-10 max-w-none">
                {post.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mb-5 text-base leading-relaxed text-prive-text md:text-[1.05rem] md:leading-[1.75]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-14 border-t border-prive-border pt-8">
                <AktualnosciBackButton
                  origin={origin}
                  label={
                    origin === 'home'
                      ? 'Wróć do sekcji aktualności'
                      : 'Wróć do wszystkich wpisów'
                  }
                />
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
