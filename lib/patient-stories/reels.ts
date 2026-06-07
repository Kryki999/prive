import type { PatientStoryReel } from '@/components/patient-stories/types';

/** Przykładowe MP4 na demo — podmień na pliki z public/patient-stories/ lub Mux. */
const DEMO_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
] as const;

/**
 * Demo: `videoUrl` (lokalny plik lub URL).
 * Produkcja: usuń videoUrl, ustaw `videoPlaybackId` + @mux/mux-player-react.
 */
/** Pionowe miniatury 9:16 — zweryfikowane URLe (demo). */
const DEMO_POSTERS = {
  hair: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=1067&fit=crop&q=80',
  portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=1067&fit=crop&q=80',
  professional: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=1067&fit=crop&q=80',
  beard: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=1067&fit=crop&q=80',
} as const;

export const PATIENT_STORY_REELS: PatientStoryReel[] = [
  {
    id: 'marcin-dhi',
    title: 'Marcin — przeszczep DHI, strefa czołowa',
    posterUrl: DEMO_POSTERS.hair,
    videoUrl: DEMO_VIDEOS[0],
    tags: ['DHI', 'Strefa czołowa'],
  },
  {
    id: 'tomek-fue',
    title: 'Tomek — FUE, wygładzenie linii włosów',
    posterUrl: DEMO_POSTERS.portrait,
    videoUrl: DEMO_VIDEOS[1],
    tags: ['FUE', 'Linie włosów'],
  },
  {
    id: 'piotr-6m',
    title: 'Piotr — efekt 6 miesięcy po zabiegu',
    posterUrl: DEMO_POSTERS.professional,
    videoUrl: DEMO_VIDEOS[2],
    tags: ['6 mies. po', 'Kontrola'],
  },
  {
    id: 'adam-broda',
    title: 'Adam — przeszczep brody i wąsów',
    posterUrl: DEMO_POSTERS.beard,
    videoUrl: DEMO_VIDEOS[3],
    tags: ['Broda', 'DHI'],
  },
];
