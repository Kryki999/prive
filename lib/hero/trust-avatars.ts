import type { AvatarCircleItem } from '@/components/ui/avatar-circles';
import { PATIENT_STORY_REELS } from '@/lib/patient-stories/reels';

const STORIES_HREF = '#historie-podopiecznych';

function reelAlt(title: string): string {
  const name = title.split('—')[0]?.trim() ?? title;
  return `${name} — pacjent Hair Clinic PRIVÉ`;
}

const REEL_AVATAR_FALLBACKS = ['/hair.jpg', '/beard.jpg', '/eyebraw.jpg', '/hair.jpg'] as const;

/** Miniatury social proof w hero — poster z rolki lub zdjęcie usługi jako fallback. */
export const HERO_TRUST_AVATARS: AvatarCircleItem[] = PATIENT_STORY_REELS.slice(0, 4).map(
  (reel, index) => ({
    imageUrl: reel.posterUrl ?? REEL_AVATAR_FALLBACKS[index],
    alt: reelAlt(reel.title),
    href: STORIES_HREF,
  }),
);
