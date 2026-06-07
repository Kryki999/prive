import { cn } from '@/lib/utils';
import { bebasNeue, montserrat } from '@/lib/fonts';

export type PriveLogoVariant = 'hero' | 'scrolled';

type PriveLogoProps = {
  variant?: PriveLogoVariant;
  /** W wariancie hero — „Hair” w kolorze prive-rose zamiast białego */
  hairRose?: boolean;
  className?: string;
};

export default function PriveLogo({
  variant = 'scrolled',
  hairRose = false,
  className,
}: PriveLogoProps) {
  const isHero = variant === 'hero';

  return (
    <span
      className={cn(
        'flex flex-col items-center leading-none select-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          montserrat.className,
          'font-semibold tracking-[0.02em]',
          isHero
            ? 'text-[clamp(0.85rem,3vw,1.15rem)]'
            : 'text-[clamp(0.72rem,2.4vw,0.95rem)]',
        )}
      >
        <span className={isHero && !hairRose ? 'text-white' : 'text-prive-rose'}>Hair</span>
        <span className={isHero ? 'text-white' : 'text-prive-text'}>Clinic</span>
      </span>
      <span
        className={cn(
          bebasNeue.className,
          'tracking-[0.04em]',
          isHero
            ? 'mt-1 text-[clamp(2rem,8vw,3.25rem)]'
            : 'mt-0.5 text-[clamp(1.5rem,5.5vw,2.25rem)]',
          isHero ? 'text-white' : 'text-prive-text',
        )}
        style={
          isHero
            ? {
                WebkitTextStroke: '1.5px rgba(255,255,255,0.92)',
                paintOrder: 'stroke fill',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))',
              }
            : {
                WebkitTextStroke: '1.25px var(--prive-plum)',
                paintOrder: 'stroke fill',
              }
        }
      >
        PRIVÉ
      </span>
    </span>
  );
}
