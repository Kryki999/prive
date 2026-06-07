'use client';



import GameShowcaseSection from '@/components/GameShowcaseSection';

import { BEFORE_AFTER_CASES } from '@/lib/before-after/cases';
import {
  BEFORE_AFTER_SHOWCASE_IMAGE,
  BEFORE_AFTER_SHOWCASE_IMAGE_MOBILE,
  PATIENT_STORIES_SHOWCASE_IMAGE,
  PATIENT_STORIES_SHOWCASE_IMAGE_MOBILE,
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
        bgImageMobile={PATIENT_STORIES_SHOWCASE_IMAGE_MOBILE}
        bgAlt="Hair Clinic PRIVÉ — historie pacjentów"

        description="Przejdź przez metamorfozę z zespołem, dla którego najwyższe europejskie standardy to codzienność. Ponad 95% przyjętych włosów i pełna opieka lekarzy na każdym etapie."

        learnMoreUrl="#kontakt"

        platforms={[
          'Najwyższa skuteczność w polsce',
          'Prawdziwe historie',
          '100% lekarze chirurdzy',
        ]}

        reels={PATIENT_STORY_REELS}

        onPlayVideo={onPlayVideo}

      />



      <GameShowcaseSection

        id="efekty-naszej-pracy"

        jumpTitle="Efekty naszej pracy"

        bgImage={BEFORE_AFTER_SHOWCASE_IMAGE}
        bgImageMobile={BEFORE_AFTER_SHOWCASE_IMAGE_MOBILE}
        bgAlt="Hair Clinic PRIVÉ — efekty zabiegów przeszczepu włosów"

        description="Żadnych filtrów i ulepszaczy. Zobacz rzeczywiste efekty zabiegów prowadzonych przez polską elitę chirurgii. Stawiamy na indywidualne projektowanie naturalnej linii włosów. Autentyczne metamorfozy, które mówią same za siebie."

        learnMoreUrl="#kontakt"

        platforms={[
          'Technologia FUE non-waste',
          'Polska elita medyczna',
          'Naturalna linia włosów',
          'Pełne wsparcie',
        ]}

        beforeAfterCases={BEFORE_AFTER_CASES}

        onPlayVideo={onPlayVideo}

      />

    </div>

  );

}

