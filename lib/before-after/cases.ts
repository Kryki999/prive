import type { BeforeAfterCase } from '@/components/before-after/types';

/**
 * Pary przed/po z hairclinicprive.pl (sekcja EFEKTY).
 * Kolejność zgodna z oryginalną stroną kliniki.
 */
export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'case-hairline-plan',
    title: 'Linia włosów — projekt przed zabiegiem',
    beforeUrl: '/before-after/case-2-before.jpeg',
    afterUrl: '/before-after/case-2-after.jpeg',
    tags: ['DHI', 'Linia czołowa'],
  },
  {
    id: 'case-crown-thinning',
    title: 'Korona — efekt przeszczepu',
    beforeUrl: '/before-after/case-1-before.jpeg',
    afterUrl: '/before-after/case-1-after.jpeg',
    tags: ['FUE', 'Korona'],
  },
  {
    id: 'case-temple-recession',
    title: 'Skronie i czoło — naturalna linia włosów',
    beforeUrl: '/before-after/case-3-before.jpeg',
    afterUrl: '/before-after/case-3-after.jpeg',
    tags: ['DHI', 'Skronie'],
  },
  {
    id: 'case-frontal-rebuild',
    title: 'Strefa czołowa — pełna odbudowa',
    beforeUrl: '/before-after/case-4-before.jpeg',
    afterUrl: '/before-after/case-4-after.jpeg',
    tags: ['FUE', 'Strefa czołowa'],
  },
];
