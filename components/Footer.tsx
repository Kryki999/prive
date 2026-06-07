'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, MapPin } from 'lucide-react';

import PriveLogo from '@/components/brand/PriveLogo';
import {
  CLINIC_ADDRESS_CITY,
  CLINIC_ADDRESS_STREET,
  CLINIC_MAP_DIRECTIONS_URL,
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
    icon: Facebook,
  },
  {
    href: 'https://www.instagram.com/hairclinicprive/',
    label: 'Instagram',
    icon: Instagram,
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
    <footer className="w-full border-t border-prive-border bg-prive-white px-4 pb-8 pt-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-prive-border pb-12 md:flex-row md:items-center">
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

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-prive-border text-prive-text-muted transition-colors hover:border-prive hover:bg-prive hover:text-white"
              >
                <Icon size={18} aria-hidden />
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
