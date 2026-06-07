/**
 * Centralne źródło zdjęć stockowych (Unsplash) dla hero, kart usług i formularza.
 * Desktop hero: szeroki kadr 16:9 · Mobile hero: pionowy kadr pod 85vh.
 */

type UnsplashCrop = 'faces' | 'entropy' | 'edges';

function unsplash(
  photo: string,
  { w, h, crop = 'entropy' }: { w: number; h: number; crop?: UnsplashCrop },
): string {
  const params = new URLSearchParams({
    w: String(w),
    h: String(h),
    fit: 'crop',
    crop,
    q: '82',
    auto: 'format',
  });
  return `https://images.unsplash.com/photo-${photo}?${params}`;
}

/** Identyfikatory zdjęć Unsplash (timestamp-hash). */
const PHOTOS = {
  /** Przystojny mężczyzna – pewność siebie, gęste włosy */
  handsomeMan: '1506794778202-cad84cf45f1d',
  /** Fryzjer z brzytwą – precyzja zabiegu */
  barberRazor: '1553981474-3df84eab7103',
  /** Profesjonalny barber shop – specjaliści */
  barberShop: '1622286342621-4bd786c2447c',
  /** Mężczyzna podczas strzyżenia – przeszczep włosów */
  hairTransplant: '1666622834007-ce09600ee75a',
  /** Bliski kadr twarzy mężczyzny – brwi */
  manFace: '1511920771146-1a7271092231',
  /** Mężczyzna dotykający włosów – gęstość / SMP */
  hairDensity: '1512663150964-d8f43c899f76',
  /** Sprzęt medyczny – PRP / leczenie */
  medical: '1576091160399-112ba8d25d1d',
  /** Nowoczesne wnętrze kliniki – estetyka / konsultacja ogólna */
  clinic: '1519494026892-80bbd2d6fd0d',
  /** Bliski kadr strzyżenia — tło sekcji historii podopiecznych (unikalne na stronie) */
  patientStories: '1643837833100-8b2ebd7127bc',
} as const;

export function treatmentThumb(photo: keyof typeof PHOTOS): string {
  return unsplash(PHOTOS[photo], { w: 600, h: 600, crop: 'faces' });
}

export function serviceCardImage(photo: keyof typeof PHOTOS): string {
  return unsplash(PHOTOS[photo], { w: 1200, h: 900, crop: 'entropy' });
}

export function heroDesktop(photo: keyof typeof PHOTOS): string {
  return unsplash(PHOTOS[photo], { w: 2560, h: 1440, crop: 'faces' });
}

export function heroMobile(photo: keyof typeof PHOTOS): string {
  return unsplash(PHOTOS[photo], { w: 1080, h: 1620, crop: 'faces' });
}

/** Obrazy kafelków formularza (krok 1) – używane też na kartach usług. */
export const TREATMENT_IMAGES = {
  'hair-transplant': treatmentThumb('hairTransplant'),
  'beard-transplant': treatmentThumb('barberRazor'),
  'eyebrow-transplant': treatmentThumb('manFace'),
  trichopigmentation: treatmentThumb('hairDensity'),
  'prp-therapy': treatmentThumb('medical'),
  other: treatmentThumb('clinic'),
} as const;

export type TreatmentImageId = keyof typeof TREATMENT_IMAGES;

/** Mapowanie kafelków usług → zdjęcie z formularza. */
export const SERVICE_TILE_PHOTO: Record<string, keyof typeof PHOTOS> = {
  'przeszczep-wlosow': 'hairTransplant',
  'przeszczep-brody': 'barberRazor',
  brwi: 'manFace',
  trychopigmentacja: 'hairDensity',
  'klinika-estetyczna': 'clinic',
};

export type HeroSlideConfig = {
  id: string;
  title: string;
  subtitle: string;
  photo: keyof typeof PHOTOS;
  secondaryBtnText: string;
  secondaryHref: string;
  trustStrip?: {
    label: string;
    overflowCount: number;
    overflowHref: string;
  };
};

export const HERO_SLIDE_CONFIG: HeroSlideConfig[] = [
  {
    id: 'pewnosc',
    title: 'Odzyskaj gęste włosy i pewność siebie.',
    subtitle: 'Zmień zasady gry.',
    photo: 'handsomeMan',
    secondaryBtnText: 'Historie pacjentów',
    secondaryHref: '#historie-podopiecznych',
    trustStrip: {
      label: 'Zaufali nam:',
      overflowCount: 500,
      overflowHref: '#historie-podopiecznych',
    },
  },
  {
    id: 'precyzja',
    title: 'Czyste fakty i bezkompromisowe rezultaty.',
    subtitle: 'Precyzja, która cofa czas.',
    photo: 'barberRazor',
    secondaryBtnText: 'Efekty naszej pracy',
    secondaryHref: '#efekty-naszej-pracy',
  },
  {
    id: 'specjalisci',
    title: '',
    subtitle: 'Twój wizerunek w rękach specjalistów z najwyższymi standardami.',
    photo: 'barberShop',
    secondaryBtnText: 'Poznaj naszych lekarzy',
    secondaryHref: '#lekarze',
  },
];

export function resolveHeroSlideImages(photo: keyof typeof PHOTOS) {
  return {
    desktop: heroDesktop(photo),
    mobile: heroMobile(photo),
  };
}

export const CONSULTATION_FORM_IMAGE = unsplash(PHOTOS.clinic, {
  w: 1400,
  h: 1000,
  crop: 'entropy',
});

/** Szeroki kadr sekcji showcase (historie pacjentów, efekty przed/po). */
export function showcaseWide(photo: keyof typeof PHOTOS): string {
  return unsplash(PHOTOS[photo], { w: 1920, h: 1080, crop: 'faces' });
}

/** Okładka wpisu na blogu / w aktualnościach. */
export function articleCover(photo: keyof typeof PHOTOS): string {
  return unsplash(PHOTOS[photo], { w: 1200, h: 900, crop: 'entropy' });
}

/** Pełnoekranowe tło — entropy zamiast faces, żeby kadr nie ucinał twarzy. */
export const PATIENT_STORIES_SHOWCASE_IMAGE = unsplash(PHOTOS.patientStories, {
  w: 2400,
  h: 1350,
  crop: 'entropy',
});

/** Lżejsze tło sticky showcase na mobile (85svh). */
export function showcaseStickyMobile(photo: keyof typeof PHOTOS): string {
  return unsplash(PHOTOS[photo], { w: 1080, h: 1620, crop: 'entropy' });
}

export const PATIENT_STORIES_SHOWCASE_IMAGE_MOBILE = showcaseStickyMobile('patientStories');
export const BEFORE_AFTER_SHOWCASE_IMAGE = showcaseWide('hairTransplant');
export const BEFORE_AFTER_SHOWCASE_IMAGE_MOBILE = showcaseStickyMobile('hairTransplant');
