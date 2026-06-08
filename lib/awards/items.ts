import type { AwardItem } from '@/components/certificates/types';

/** Logo certyfikatów i wyróżnień w public/awards/ (logo1–logo6). */
const AWARD_IMAGES = {
  logo1: '/awards/logo1.jpg',
  logo2: '/awards/logo2.png',
  logo3: '/awards/logo3.png',
  logo4: '/awards/logo4.jpg',
  logo5: '/awards/logo5.jpg',
  logo6: '/awards/logo6.png',
} as const;

export const TOP_ROW_AWARDS: AwardItem[] = [
  {
    id: 'zlota-korona',
    title: 'Złota korona portalu Polska kosmetologia i kosmetyka — Innowacja roku 2025',
    category: 'wyróżnienie',
    image: AWARD_IMAGES.logo3,
  },
  {
    id: 'orly-medycyny',
    title: 'Orły medycyny — laureat konkursu 2025',
    category: 'wyróżnienie',
    image: AWARD_IMAGES.logo4,
  },
  {
    id: 'radio-gdansk',
    title: 'Radio Gdańsk',
    category: 'media',
    image: AWARD_IMAGES.logo6,
  },
];

export const BOTTOM_ROW_AWARDS: AwardItem[] = [
  {
    id: 'dziennik-baltycki',
    title: 'Dziennik Bałtycki',
    category: 'media',
    image: AWARD_IMAGES.logo5,
  },
  {
    id: 'trojmiasto',
    title: 'trójmiasto.pl',
    category: 'media',
    image: AWARD_IMAGES.logo1,
  },
  {
    id: 'ptd',
    title: 'Polskie Towarzystwo Dermatologiczne',
    category: 'członkostwo',
    image: AWARD_IMAGES.logo2,
  },
];
