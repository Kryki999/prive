import type { AwardItem } from '@/components/certificates/types';

const AWARD_IMAGES = {
  wyróżnienie: '/awards/certificate-award.jpg',
  wyróżnienieAlt: '/awards/certificate-medal.jpg',
  media: '/awards/certificate-press.jpg',
  członkostwo: '/awards/certificate-membership.jpg',
} as const;

export const TOP_ROW_AWARDS: AwardItem[] = [
  {
    id: 'zlota-korona',
    title: 'Złota korona portalu Polska kosmetologia i kosmetyka',
    category: 'wyróżnienie',
    image: AWARD_IMAGES.wyróżnienie,
  },
  {
    id: 'orly-medycyny',
    title: 'Orły medycyny — laureat konkursu 2025',
    category: 'wyróżnienie',
    image: AWARD_IMAGES.wyróżnienieAlt,
  },
  {
    id: 'radio-gdansk',
    title: 'Radio Gdańsk',
    category: 'media',
    image: AWARD_IMAGES.media,
  },
  {
    id: 'dziennik-baltycki',
    title: 'Dziennik Bałtycki',
    category: 'media',
    image: AWARD_IMAGES.media,
  },
];

export const BOTTOM_ROW_AWARDS: AwardItem[] = [
  {
    id: 'trojmiasto',
    title: 'trójmiasto.pl',
    category: 'media',
    image: AWARD_IMAGES.media,
  },
  {
    id: 'pt-derm',
    title: 'Członek pt-derm.com.pl',
    category: 'członkostwo',
    image: AWARD_IMAGES.członkostwo,
  },
  {
    id: 'ehrs',
    title: 'European Hair Research Society',
    category: 'członkostwo',
    image: AWARD_IMAGES.członkostwo,
  },
  {
    id: 'padv',
    title: 'Polska Akademia Dermatologii i Wenerologii',
    category: 'członkostwo',
    image: AWARD_IMAGES.członkostwo,
  },
];
