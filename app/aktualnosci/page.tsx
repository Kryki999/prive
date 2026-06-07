import type { Metadata } from 'next';

import AktualnosciBlogList from '@/components/aktualnosci/AktualnosciBlogList';
import Footer from '@/components/Footer';
import SiteHeader from '@/components/SiteHeader';
import { AKTUALNOSCI_ITEMS } from '@/lib/aktualnosci/data';

export const metadata: Metadata = {
  title: 'Aktualności — Hair Clinic PRIVÉ',
  description:
    'Najnowsze wpisy z Hair Clinic PRIVÉ — metody przeszczepu włosów, porady i aktualności kliniki w Gdańsku.',
};

export default function AktualnosciPage() {
  return (
    <>
      <main className="relative min-h-screen bg-prive-white text-prive-text">
        <SiteHeader />

        <div className="px-4 pb-20 pt-[calc(var(--site-header-h,5.5rem)+2rem)] md:px-8 md:pb-28 md:pt-[calc(var(--site-header-h,5rem)+3rem)]">
          <div className="mx-auto max-w-7xl">
            <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-prive-rose">
                Aktualności
              </span>
              <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.02] tracking-tight text-prive-plum md:text-5xl">
                Wszystkie <span className="text-prive-rose">wpisy</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-prive-text-muted md:text-base">
                To samo, co w szufladzie powiadomień, tylko w pełnej formie — porady, metody zabiegów
                i wiadomości z Hair Clinic PRIVÉ.
              </p>
            </header>

            {AKTUALNOSCI_ITEMS.length > 0 ? (
              <AktualnosciBlogList posts={AKTUALNOSCI_ITEMS} />
            ) : (
              <p className="text-center text-prive-text-muted">Brak wpisów. Wróć wkrótce!</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
