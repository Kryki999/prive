import type { PatientStoryReel } from '@/components/patient-stories/types';

/** Rolki wideo z public/reels1–4.mp4 */
export const PATIENT_STORY_REELS: PatientStoryReel[] = [
  {
    id: 'michal',
    title: 'Michał — historia pacjenta',
    videoUrl: '/reels1.mp4',
    tags: ['Hair Clinic PRIVÉ'],
  },
  {
    id: 'marcin',
    title: 'Marcin — historia pacjenta',
    videoUrl: '/reels2.mp4',
    tags: ['Hair Clinic PRIVÉ'],
  },
  {
    id: 'kamil',
    title: 'Kamil — historia pacjenta',
    videoUrl: '/reels3.mp4',
    tags: ['Hair Clinic PRIVÉ'],
  },
  {
    id: 'bartosz',
    title: 'Bartosz — historia pacjenta',
    videoUrl: '/reels4.mp4',
    tags: ['Hair Clinic PRIVÉ'],
  },
];
