'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';

import PriveLogo from '@/components/brand/PriveLogo';
import {
  CLINIC_ADDRESS_CITY,
  CLINIC_ADDRESS_STREET,
  CLINIC_BOOK_EMAIL,
  CLINIC_BOOK_EMAIL_HREF,
  CLINIC_MAP_DIRECTIONS_URL,
  CLINIC_PHONE,
  CLINIC_PHONE_HREF,
  CLINIC_PHONE_LABEL,
  CLINIC_RECEPTION_PHONE,
  CLINIC_RECEPTION_PHONE_HREF,
  CLINIC_RECEPTION_PHONE_LABEL,
  CLINIC_RPM,
} from '@/lib/clinic';
import { NAV_LINKS } from '@/lib/nav/nav-links';

const FOOTER_LINKS = [
  { href: '/aktualnosci', label: 'Aktualności' },
  {
    href: 'https://hairclinicprive.pl/faq-2/',
    label: 'FAQ',
    external: true,
  },
  {
    href: 'https://hairclinicprive.pl/cennik/',
    label: 'Cennik',
    external: true,
  },
] as const;

const LEGAL_LINKS = [
  { href: '/#kontakt', label: 'Kontakt' },
  { href: '/polityka-prywatnosci', label: 'Polityka prywatności' },
  {
    href: 'https://hairclinicprive.pl/regulamin-i-polityka-przetwarzania-danych-osobowych/',
    label: 'Regulamin',
    external: true,
  },
  {
    href: 'https://rpwdl.ezdrowie.gov.pl/RPM/DetailsConfirm?Id=271979',
    label: 'Rejestr podmiotów medycznych',
    external: true,
  },
] as const;

const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/hair.clinic.prive.polska/',
    label: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/hairclinicprive/',
    label: 'Instagram',
  },
] as const;

function sectionHref(pathname: string, href: string) {
  if (href.startsWith('http') || href.startsWith('/aktualnosci') || href.startsWith('/polityka')) {
    return href;
  }

  if (href.startsWith('/#')) {
    return pathname === '/' ? href.replace(/^\//, '') : href;
  }

  return pathname === '/' ? href : `/${href}`;
}

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="w-full border-t border-prive-border bg-prive-white px-4 pb-8 pt-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 border-b border-prive-border pb-16 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-prive text-white">
                <Mail size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider text-prive-text">
                Newsletter
              </h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-prive-text-muted">
              Zapisz się i otrzymuj porady dotyczące pielęgnacji włosów, aktualności z kliniki oraz
              informacje o darmowych konsultacjach w Hair Clinic PRIVÉ.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-2 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Twój adres e-mail"
                required
                className="flex-1 rounded border border-prive-border bg-prive-white px-4 py-3 text-sm text-prive-text focus:border-prive focus:outline-none"
              />
              <button
                type="submit"
                className="btn-prive rounded px-6 py-3 text-xs font-black transition-all"
              >
                Zapisz się
              </button>
            </form>
          </div>

          <div
            id="support"
            className="flex flex-col justify-between gap-4 rounded-xl border border-prive-border bg-prive-white p-6 shadow-prive-card sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-prive-surface text-prive">
                <Phone size={28} />
              </div>
              <div>
                <h4 className="mb-1 text-lg font-black uppercase tracking-wider text-prive-text">
                  Potrzebujesz konsultacji?
                </h4>
                <p className="text-xs leading-relaxed text-prive-text-muted">
                  Zadzwoń lub napisz — odpowiadamy na pytania o przeszczep włosów, dobór metody FUE
                  lub DHI oraz umawianie wizyt w Gdańsku.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t border-prive-border pt-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-prive-text-muted">
                  {CLINIC_PHONE_LABEL}
                </p>
                <a
                  href={CLINIC_PHONE_HREF}
                  className="font-bold text-prive-text transition-colors hover:text-prive"
                >
                  {CLINIC_PHONE}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-prive-text-muted">
                  {CLINIC_RECEPTION_PHONE_LABEL}
                </p>
                <a
                  href={CLINIC_RECEPTION_PHONE_HREF}
                  className="font-bold text-prive-text transition-colors hover:text-prive"
                >
                  {CLINIC_RECEPTION_PHONE}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-prive-text-muted">
                  E-mail
                </p>
                <a
                  href={CLINIC_BOOK_EMAIL_HREF}
                  className="font-bold text-prive-text transition-colors hover:text-prive"
                >
                  {CLINIC_BOOK_EMAIL}
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-prive-border pt-4 sm:flex-row">
              <span className="text-xs font-bold text-prive-text-muted">
                Pierwsza konsultacja jest bezpłatna.
              </span>
              <Link
                href={sectionHref(pathname, '/#kontakt')}
                className="w-full rounded border border-prive-border bg-transparent px-6 py-3 text-center text-xs font-bold uppercase text-prive transition-all hover:border-prive hover:bg-prive hover:text-white sm:w-auto"
              >
                Umów wizytę
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-widest text-prive-text-muted">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={sectionHref(pathname, href)}
                className="transition-colors hover:text-prive"
              >
                {label}
              </Link>
            ))}
            {FOOTER_LINKS.map(({ href, label, ...rest }) =>
              'external' in rest && rest.external ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-prive"
                >
                  {label}
                </a>
              ) : (
                <Link key={label} href={href} className="transition-colors hover:text-prive">
                  {label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest text-prive-text-muted transition-colors hover:text-prive"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-prive-border pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <PriveLogo variant="scrolled" className="items-start" />

            <a
              href={CLINIC_MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 text-sm text-prive-text-muted transition-colors hover:text-prive"
            >
              <MapPin size={16} className="mt-0.5 shrink-0 text-prive" aria-hidden />
              <span>
                {CLINIC_ADDRESS_STREET}
                <br />
                {CLINIC_ADDRESS_CITY}, Polska
              </span>
            </a>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-prive-text-muted">
              {LEGAL_LINKS.map(({ href, label, ...rest }) =>
                'external' in rest && rest.external ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-prive"
                  >
                    {label}
                  </a>
                ) : (
                  <Link key={label} href={href} className="transition-colors hover:text-prive">
                    {label}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-prive-text-muted">
            <p>Hair Clinic PRIVÉ © {new Date().getFullYear()}. Wszelkie prawa zastrzeżone.</p>
            <p className="mt-1 normal-case tracking-normal">
              Rejestr Podmiotów Medycznych: {CLINIC_RPM}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
