import { CONSULTATION_FORM_IMAGE, TREATMENT_IMAGES } from '@/lib/site-images';

export const TREATMENT_OPTIONS = [
  {
    id: 'hair-transplant',
    label: 'Przeszczep Włosów DHI/FUE',
    image: TREATMENT_IMAGES['hair-transplant'],
  },
  {
    id: 'beard-transplant',
    label: 'Przeszczep Brody',
    image: TREATMENT_IMAGES['beard-transplant'],
  },
  {
    id: 'eyebrow-transplant',
    label: 'Przeszczep Brwi',
    image: TREATMENT_IMAGES['eyebrow-transplant'],
  },
  {
    id: 'trichopigmentation',
    label: 'Trychopigmentacja',
    image: TREATMENT_IMAGES.trichopigmentation,
  },
  {
    id: 'prp-therapy',
    label: 'PRP / Leczenie wypadania',
    image: TREATMENT_IMAGES['prp-therapy'],
  },
  {
    id: 'other',
    label: 'Inne / Konsultacja ogólna',
    image: TREATMENT_IMAGES.other,
  },
] as const;

export type TreatmentId = (typeof TREATMENT_OPTIONS)[number]['id'];

export const TREATMENT_LABELS: Record<TreatmentId, string> = Object.fromEntries(
  TREATMENT_OPTIONS.map((option) => [option.id, option.label]),
) as Record<TreatmentId, string>;

export const HAIR_TRANSPLANT_ID: TreatmentId = 'hair-transplant';

export const TEXTAREA_TREATMENTS: TreatmentId[] = [
  'beard-transplant',
  'eyebrow-transplant',
  'trichopigmentation',
  'prp-therapy',
  'other',
];

/** Ilustracje sytuacji wypadania włosów (wzorzec Cosmedica, polskie nazwy). */
export const HAIR_LOSS_SITUATIONS = [
  {
    id: 1,
    label: 'Brak wypadania włosów',
    imageUrl: '/hair-loss/situation-1.svg',
  },
  {
    id: 2,
    label: 'Lekko cofnięta linia włosów',
    imageUrl: '/hair-loss/situation-2.svg',
  },
  {
    id: 3,
    label: 'Lekko cofnięta linia włosów + łysiejąca tonsura',
    imageUrl: '/hair-loss/situation-3.svg',
  },
  {
    id: 4,
    label: 'Mocno zarysowane zakoła + łysiejąca tonsura',
    imageUrl: '/hair-loss/situation-4.svg',
  },
  {
    id: 5,
    label: 'Półłysy',
    imageUrl: '/hair-loss/situation-5.svg',
  },
  {
    id: 6,
    label: 'Łysy',
    imageUrl: '/hair-loss/situation-6.svg',
  },
] as const;

export function getHairLossSituationLabel(id: number): string | undefined {
  return HAIR_LOSS_SITUATIONS.find((situation) => situation.id === id)?.label;
}

export { CONSULTATION_FORM_IMAGE };

export const QUICK_CONTACT_EMAIL = 'kontakt@hairclinicprive.pl';
