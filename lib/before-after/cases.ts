import type { BeforeAfterCase } from '@/components/before-after/types';

/**
 * Pary przed/po muszą mieć ten sam kadr i proporcje — inaczej suwak wygląda źle.
 * Podmień URLe na rzeczywiste zdjęcia pacjentów (np. public/before-after/).
 */
const DEMO_BEFORE = {
  hairline: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&h=600&fit=crop&q=80',
  crown: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop&q=80',
  temple: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop&q=80',
  beard: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop&q=80',
  density: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  frontal: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop&q=80',
} as const;

const DEMO_AFTER = {
  hairline: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop&q=80',
  crown: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  temple: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop&q=80',
  beard: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&h=600&fit=crop&q=80',
  density: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop&q=80',
  frontal: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop&q=80',
} as const;

export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'case-hairline-dhi',
    title: 'Strefa czołowa — przeszczep DHI',
    beforeUrl: DEMO_BEFORE.hairline,
    afterUrl: DEMO_AFTER.hairline,
    tags: ['DHI', 'Strefa czołowa'],
  },
  {
    id: 'case-crown-fue',
    title: 'Korona — metoda FUE',
    beforeUrl: DEMO_BEFORE.crown,
    afterUrl: DEMO_AFTER.crown,
    tags: ['FUE', 'Korona'],
  },
  {
    id: 'case-temple',
    title: 'Skronie — odbudowa linii włosów',
    beforeUrl: DEMO_BEFORE.temple,
    afterUrl: DEMO_AFTER.temple,
    tags: ['DHI', 'Skronie'],
  },
  {
    id: 'case-beard',
    title: 'Broda i wąsy — przeszczep',
    beforeUrl: DEMO_BEFORE.beard,
    afterUrl: DEMO_AFTER.beard,
    tags: ['Broda', 'DHI'],
  },
  {
    id: 'case-density',
    title: 'Zagęszczenie — efekt 8 miesięcy',
    beforeUrl: DEMO_BEFORE.density,
    afterUrl: DEMO_AFTER.density,
    tags: ['8 mies. po', 'Zagęszczenie'],
  },
  {
    id: 'case-frontal',
    title: 'Strefa przednia — pełna odbudowa',
    beforeUrl: DEMO_BEFORE.frontal,
    afterUrl: DEMO_AFTER.frontal,
    tags: ['FUE', 'Strefa przednia'],
  },
];
