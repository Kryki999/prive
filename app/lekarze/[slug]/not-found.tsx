import Link from 'next/link';

import Footer from '@/components/Footer';
import SiteHeader from '@/components/SiteHeader';

export default function DoctorNotFound() {
  return (
    <div className="relative min-h-screen bg-prive-white text-prive-text">
      <SiteHeader />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="text-3xl font-extrabold text-prive-plum">Lekarz nie znaleziony</h1>
        <p className="mt-4 max-w-md text-prive-text-muted">
          Nie znaleźliśmy profilu tego lekarza. Wróć do strony głównej i poznaj nasz zespół.
        </p>
        <Link href="/#lekarze" className="btn-prive mt-8 px-8 py-3 text-sm">
          Zobacz naszych lekarzy
        </Link>
      </main>
      <Footer />
    </div>
  );
}
