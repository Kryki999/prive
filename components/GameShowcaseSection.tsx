'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Info, Mail } from 'lucide-react';

import BeforeAfterCarousel from '@/components/before-after/BeforeAfterCarousel';
import PriveLogo from '@/components/brand/PriveLogo';
import { useConfigurator } from '@/components/consultation-form/configurator-shared';
import type { BeforeAfterCase } from '@/components/before-after/types';
import PatientStoriesReels from '@/components/patient-stories/PatientStoriesReels';
import type { PatientStoryReel } from '@/components/patient-stories/types';
import type { CarouselApi } from '@/components/ui/carousel';
import { SECTION_GRADIENT_HEADING_CLASS } from '@/components/ui/section-gradient-heading';
import { cn } from '@/lib/utils';

const ctaPillSizeClass =
  'shrink-0 whitespace-nowrap text-[0.65rem] px-3.5 py-2.5 tracking-wide gap-1.5 sm:text-xs sm:px-5 sm:py-3 sm:tracking-wider sm:gap-2 md:text-sm md:px-6 md:py-3.5';

const ctaOutlineClass = cn('btn-pill-outline btn-pill-outline--light', ctaPillSizeClass);
const ctaPrivePillClass = cn('btn-prive btn-prive--pill', ctaPillSizeClass);

export interface FeatureItem {
  title: string;
  desc: string;
  image: string;
  link?: string;
  logo?: string;
  isVideo?: boolean;
  videoUrl?: string;
  btnText: string;
}

export interface GameShowcaseSectionProps {
  id?: string;
  jumpTitle: string;
  bgImage: string;
  bgImageMobile?: string;
  bgAlt: string;
  description: string;
  learnMoreUrl: string;
  platforms: string[];
  features?: FeatureItem[];
  reels?: PatientStoryReel[];
  beforeAfterCases?: BeforeAfterCase[];
  onPlayVideo: (url: string) => void;
}

function FeatureCard({
  item,
  onPlayVideo,
}: {
  item: FeatureItem;
  onPlayVideo: (url: string) => void;
}) {
  return (
    <div className="bg-prive-white border border-prive-border rounded-xl overflow-hidden flex flex-col justify-between shadow-prive-card hover:border-prive transition-all duration-300">
      <div>
        <div className="relative h-48 overflow-hidden group">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {item.logo && (
            <div className="absolute inset-0 bg-prive-dark/30 flex items-center justify-center p-4">
              <img src={item.logo} alt="" className="max-h-12 object-contain" />
            </div>
          )}
        </div>
        <div className="p-5">
          <h4 className="text-lg font-bold mb-2 tracking-wide text-prive-text">{item.title}</h4>
          <p className="text-prive-text-muted text-xs leading-relaxed">{item.desc}</p>
        </div>
      </div>
      <div className="p-5 pt-0">
        {item.isVideo && item.videoUrl ? (
          <button
            onClick={() => onPlayVideo(item.videoUrl!)}
            className="w-full btn-prive font-bold text-xs py-2.5 text-center block"
          >
            {item.btnText}
          </button>
        ) : (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-prive-outline font-bold text-xs py-2.5 text-center block"
          >
            {item.btnText}
          </a>
        )}
      </div>
    </div>
  );
}

export default function GameShowcaseSection({
  id,
  jumpTitle,
  bgImage,
  bgImageMobile,
  bgAlt,
  description,
  learnMoreUrl,
  platforms,
  features = [],
  reels,
  beforeAfterCases,
  onPlayVideo,
}: GameShowcaseSectionProps) {
  const { open: openConsultation } = useConfigurator();
  const [slideIndex, setSlideIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const useReels = reels && reels.length > 0;
  const useBeforeAfter = Boolean(beforeAfterCases && beforeAfterCases.length > 0);

  const handleNext = () => setSlideIndex((prev) => (prev + 1) % features.length);
  const handlePrev = () =>
    setSlideIndex((prev) => (prev - 1 + features.length) % features.length);

  const handleCarouselPrev = useCallback(() => {
    carouselApi?.scrollPrev();
  }, [carouselApi]);

  const handleCarouselNext = useCallback(() => {
    carouselApi?.scrollNext();
  }, [carouselApi]);

  const showHeaderArrows =
    useBeforeAfter || (!useReels && !useBeforeAfter && features.length > 0);

  return (
    <section className="game-showcase section-deferred--tall w-full border-t border-prive/20">
      <div className="game-showcase__sticky-media relative z-0 h-[85svh] md:h-[85svh] md:max-h-[760px] w-full overflow-hidden">
        <Image
          src={bgImageMobile ?? bgImage}
          alt={bgAlt}
          fill
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src={bgImage}
          alt={bgAlt}
          fill
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-prive-dark/80 via-prive/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      <div className="game-showcase__foreground relative z-10 -mt-[32svh] md:-mt-[42svh]">
        <div className="game-showcase__content-runway flex min-h-[32svh] flex-col justify-end md:min-h-[42svh]">
          <div className="game-showcase__content-panel bg-gradient-to-t from-black/95 via-black/65 to-transparent px-6 pb-10 pt-10 sm:px-12 md:px-20 md:pb-14 md:pt-14">
            <div className="flex max-w-5xl flex-col items-start gap-4 md:gap-5">
              <div className="flex w-full min-w-0 flex-row items-center gap-3 md:gap-7 lg:gap-8">
                <div className="shrink-0 origin-left scale-[0.95] sm:scale-100 md:scale-110 lg:scale-[1.25] md:mr-3 lg:mr-4">
                  <PriveLogo variant="hero" hairRose className="items-start" />
                </div>
                <p className="min-w-0 flex-1 text-sm font-bold leading-relaxed text-white drop-shadow-md sm:text-base md:text-lg">
                  {description}
                </p>
              </div>

              <div className="flex w-full min-w-0 flex-nowrap items-center gap-2 sm:gap-3 md:gap-4">
                <button type="button" onClick={openConsultation} className={ctaPrivePillClass}>
                  <Mail className="size-3.5 shrink-0 sm:size-4" aria-hidden />
                  Umów Konsultacje
                </button>
                <a href={learnMoreUrl} className={ctaOutlineClass}>
                  <Info className="size-3.5 shrink-0 sm:size-4" aria-hidden />
                  Dowiedz się więcej
                </a>
              </div>

              {platforms.length > 0 ? (
                <div className="grid w-full grid-cols-2 gap-1.5 opacity-75 sm:flex sm:w-auto sm:flex-wrap sm:gap-2 md:gap-3">
                  {platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded bg-white/10 px-1.5 py-0.5 text-center text-[0.625rem] font-black uppercase leading-tight text-white sm:px-2 sm:py-1 sm:text-xs sm:text-left"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          id={id}
          className="scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] bg-prive-white py-16"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h3 className={SECTION_GRADIENT_HEADING_CLASS}>{jumpTitle}</h3>
              {showHeaderArrows && (
                <div
                  className={cn(
                    'flex flex-shrink-0 gap-2',
                    useBeforeAfter && 'lg:hidden',
                  )}
                >
                  <button
                    onClick={useBeforeAfter ? handleCarouselPrev : handlePrev}
                    className="rounded-lg border border-prive-border bg-prive-surface p-2 text-prive-text transition-all hover:bg-prive-gradient hover:text-white"
                    aria-label={`Poprzedni: ${jumpTitle}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={useBeforeAfter ? handleCarouselNext : handleNext}
                    className="rounded-lg border border-prive-border bg-prive-surface p-2 text-prive-text transition-all hover:bg-prive-gradient hover:text-white"
                    aria-label={`Następny: ${jumpTitle}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {useReels ? (
              <PatientStoriesReels reels={reels} embedded />
            ) : useBeforeAfter ? (
              <BeforeAfterCarousel
                cases={beforeAfterCases!}
                embedded
                onApiReady={setCarouselApi}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {features.map((_, index) => {
                  const displayIndex = (index + slideIndex) % features.length;
                  const item = features[displayIndex];
                  return <FeatureCard key={index} item={item} onPlayVideo={onPlayVideo} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
