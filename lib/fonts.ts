import { Bebas_Neue, Montserrat } from 'next/font/google';

export const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const bebasNeue = Bebas_Neue({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
});
