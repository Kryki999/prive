export type PatientStoryReel = {
  id: string;
  title: string;
  posterUrl?: string;
  /** Demo: lokalny plik lub URL. Produkcja: opcjonalnie zamiast videoPlaybackId. */
  videoUrl?: string;
  /** Produkcja (Mux): playback ID — wymaga @mux/mux-player-react */
  videoPlaybackId?: string;
  tags?: string[];
};
