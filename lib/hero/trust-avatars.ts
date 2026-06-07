import type { AvatarCircleItem } from '@/components/ui/avatar-circles';
import { PATIENT_STORY_REELS } from '@/lib/patient-stories/reels';

const STORIES_HREF = '#historie-podopiecznych';

function reelAlt(title: string): string {
  const name = title.split('—')[0]?.trim() ?? title;
  return `${name} — pacjent Hair Clinic PRIVÉ`;
}

/** Miniatury social proof w hero — podmień na zdjęcia z public/ po zgodach pacjentów. */
export const HERO_TRUST_AVATARS: AvatarCircleItem[] = PATIENT_STORY_REELS.slice(0, 4).map(
  (reel) => ({
    imageUrl: reel.posterUrl,
    alt: reelAlt(reel.title),
    href: STORIES_HREF,
  }),
);
