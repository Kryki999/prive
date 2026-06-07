export type AwardCategory = 'wyróżnienie' | 'media' | 'członkostwo';

export type AwardItem = {
  id: string;
  title: string;
  category: AwardCategory;
  image: string;
};

export const AWARD_CATEGORY_LABELS: Record<AwardCategory, string> = {
  wyróżnienie: 'Wyróżnienie',
  media: 'Napisali o nas',
  członkostwo: 'Członkostwo',
};
