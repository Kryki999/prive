'use client';



import GameShowcaseSection from '@/components/GameShowcaseSection';

import { BEFORE_AFTER_CASES } from '@/lib/before-after/cases';
import {
  BEFORE_AFTER_SHOWCASE_IMAGE,
  PATIENT_STORIES_SHOWCASE_IMAGE,
} from '@/lib/site-images';
import { PATIENT_STORY_REELS } from '@/lib/patient-stories/reels';



interface GameDetailsProps {

  onPlayVideo: (url: string) => void;

}



export default function GameDetails({ onPlayVideo }: GameDetailsProps) {

  return (

    <div className="w-full bg-prive-white">

      <GameShowcaseSection

        id="historie-podopiecznych"

        jumpTitle="Historie naszych podopiecznych"

        bgImage={PATIENT_STORIES_SHOWCASE_IMAGE}

        bgAlt="Hair Clinic PRIVÉ — historie pacjentów"

        description="Poznaj historie naszych podopiecznych — od pierwszej konsultacji po efekty miesięcy po zabiegu. Krótkie filmy pokazują realne rezultaty przeszczepów włosów i brody."

        learnMoreUrl="#kontakt"

        platforms={['DHI', 'FUE', 'Broda', 'Konsultacja']}

        reels={PATIENT_STORY_REELS}

        onPlayVideo={onPlayVideo}

      />



      <GameShowcaseSection

        id="efekty-naszej-pracy"

        jumpTitle="Efekty naszej pracy"

        bgImage={BEFORE_AFTER_SHOWCASE_IMAGE}

        bgAlt="Hair Clinic PRIVÉ — efekty zabiegów przeszczepu włosów"

        description="Zobacz realne efekty naszych zabiegów — porównaj zdjęcia przed i po przeszczepie włosów lub brody. Przesuń suwak lub przełącz widok obok siebie, aby dokładnie ocenić rezultat."

        learnMoreUrl="#kontakt"

        platforms={['DHI', 'FUE', 'Broda', 'Zagęszczenie']}

        beforeAfterCases={BEFORE_AFTER_CASES}

        onPlayVideo={onPlayVideo}

      />

    </div>

  );

}

