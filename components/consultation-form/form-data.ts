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

export const NORWOOD_LEVELS = [
  { level: 1, label: 'Norwood I' },
  { level: 2, label: 'Norwood II' },
  { level: 3, label: 'Norwood III' },
  { level: 4, label: 'Norwood IV' },
  { level: 5, label: 'Norwood V' },
  { level: 6, label: 'Norwood VI' },
  { level: 7, label: 'Norwood VII' },
] as const;

export { CONSULTATION_FORM_IMAGE };

export const QUICK_CONTACT_EMAIL = 'kontakt@hairclinicprive.pl';
