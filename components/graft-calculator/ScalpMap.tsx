'use client';



import { useCallback, useEffect, useRef, useState } from 'react';



import { cn } from '@/lib/utils';



import ZonePath from '@/components/graft-calculator/ZonePath';



import type { ZoneVisualState } from '@/components/graft-calculator/zone-styles';



import {

  SCALP_IMAGE,

  ZONE_RENDER_ORDER,

  type GraftZone,

  type ZoneId,

} from '@/lib/graft-calculator/zones';



export type FocalCropConfig = {

  scale: number;

  originX: string;

  originY: string;

  maxHeight?: string;

  minHeight?: string;

};



/** Kadrowanie pod czubek — desktop (ramiona pod kartami). */

export const SCALP_FOCAL_DESKTOP: FocalCropConfig = {

  scale: 1.22,

  originX: '50%',

  originY: '14%',

};



/** Tablet / mały laptop — pełna głowa bez overlap kart; między mobile a desktop. */

export const SCALP_FOCAL_TABLET: FocalCropConfig = {

  scale: 1.48,

  originX: '50%',

  originY: '8%',

  maxHeight: '58dvh',

  minHeight: '280px',

};



/** Mobile — zoom od góry pliku: korona zostaje, dół i boki mogą wyjść poza kadr. */

export const SCALP_FOCAL_MOBILE: FocalCropConfig = {

  scale: 1.78,

  originX: '50%',

  originY: '0%',

  maxHeight: '54dvh',

  minHeight: '260px',

};



interface ScalpMapProps {

  zones: readonly GraftZone[];

  isSelected: (id: ZoneId) => boolean;

  onToggle: (id: ZoneId) => void;

  className?: string;

  crop?: 'none' | 'focal';

  focal?: FocalCropConfig;

}



function resolveState(active: boolean, hinting: boolean, hovered: boolean): ZoneVisualState {

  if (active) return 'active';

  if (hinting) return 'hint';

  if (hovered) return 'hover';

  return 'idle';

}



export default function ScalpMap({

  zones,

  isSelected,

  onToggle,

  className,

  crop = 'none',

  focal,

}: ScalpMapProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  const [hintZoneId, setHintZoneId] = useState<ZoneId | null>(null);

  const [hoveredZoneId, setHoveredZoneId] = useState<ZoneId | null>(null);

  const hintPlayedRef = useRef(false);



  const clearHint = useCallback(() => setHintZoneId(null), []);



  const handleZoneKeyDown = useCallback(

    (event: React.KeyboardEvent, id: ZoneId) => {

      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();

      clearHint();

      onToggle(id);

    },

    [clearHint, onToggle],

  );



  useEffect(() => {

    const container = containerRef.current;

    if (!container || hintPlayedRef.current) return;



    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (!isMobile || prefersReducedMotion) return;



    const sortedZones = [...zones].sort(

      (a, b) => parseInt(a.id.replace(/\D/g, ''), 10) - parseInt(b.id.replace(/\D/g, ''), 10),

    );



    let index = 0;

    let intervalId: ReturnType<typeof setInterval> | null = null;



    const playHint = () => {

      if (hintPlayedRef.current) return;

      hintPlayedRef.current = true;



      const showNext = () => {

        if (index >= sortedZones.length) {

          setHintZoneId(null);

          if (intervalId) clearInterval(intervalId);

          return;

        }

        setHintZoneId(sortedZones[index].id);

        index += 1;

      };



      showNext();

      intervalId = setInterval(showNext, 500);

    };



    const observer = new IntersectionObserver(

      (entries) => {

        if (entries.some((entry) => entry.isIntersecting)) {

          observer.disconnect();

          playHint();

        }

      },

      { threshold: 0.35 },

    );



    observer.observe(container);

    return () => {

      observer.disconnect();

      if (intervalId) clearInterval(intervalId);

    };

  }, [zones]);



  const sortedZones = [...zones].sort(

    (a, b) => ZONE_RENDER_ORDER.indexOf(a.id) - ZONE_RENDER_ORDER.indexOf(b.id),

  );



  const mapInner = (

    <div className="relative w-full" style={{ aspectRatio: SCALP_IMAGE.aspectRatio }}>

      {/* eslint-disable-next-line @next/next/no-img-element */}

      <img

        src={SCALP_IMAGE.src}

        alt="Mapa stref przeszczepu włosów"

        width={SCALP_IMAGE.width}

        height={SCALP_IMAGE.height}

        draggable={false}

        loading="eager"

        fetchPriority="high"

        decoding="async"

        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"

      />



      <svg

        viewBox={`0 0 ${SCALP_IMAGE.width} ${SCALP_IMAGE.height}`}

        preserveAspectRatio="xMidYMid meet"

        className="absolute inset-0 h-full w-full"

        aria-hidden={false}

        role="group"

        aria-label="Interaktywna mapa stref skalpu"

      >

        {sortedZones.map((zone) => {

          const active = isSelected(zone.id);

          const hinting = hintZoneId === zone.id;

          const hovered = hoveredZoneId === zone.id;

          const state = resolveState(active, hinting, hovered);



          return (

            <g

              key={zone.id}

              role="button"

              tabIndex={0}

              aria-pressed={active}

              aria-label={`${zone.label} ${zone.graftLabel}`}

              className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prive-rose"

              onMouseEnter={() => setHoveredZoneId(zone.id)}

              onMouseLeave={() => setHoveredZoneId((prev) => (prev === zone.id ? null : prev))}

              onClick={() => {

                clearHint();

                onToggle(zone.id);

              }}

              onKeyDown={(event) => handleZoneKeyDown(event, zone.id)}

            >

              <ZonePath zone={zone} state={state} />



              {zone.paths.map((path, pathIndex) => (

                <path

                  key={`hit-${zone.id}-${pathIndex}`}

                  d={path}

                  fill="#ffffff"

                  fillOpacity={0.001}

                  fillRule={zone.fillRule ?? 'nonzero'}

                  stroke="none"

                  pointerEvents="all"

                />

              ))}

            </g>

          );

        })}



        <g className="pointer-events-none" aria-hidden>

          {sortedZones.flatMap((zone) => {

            const active = isSelected(zone.id);

            const zoneNumber = zone.id.replace('zone-', '');



            return zone.labelPositions.map((label, labelIndex) => (

              <text

                key={`${zone.id}-label-${labelIndex}`}

                x={label.x}

                y={label.y}

                textAnchor="middle"

                dominantBaseline="middle"

                fill={active ? '#FFFFFF' : 'rgba(255,255,255,0.95)'}

                opacity={active ? 1 : 0.92}

                className="select-none text-[46px] font-bold md:text-[54px]"

                style={{

                  fontFamily: 'inherit',

                  paintOrder: 'stroke fill',

                  stroke: active ? '#751F5E' : 'rgba(26, 26, 26, 0.88)',

                  strokeWidth: 12,

                  strokeLinejoin: 'round',

                }}

              >

                {zoneNumber}

              </text>

            ));

          })}

        </g>

      </svg>

    </div>

  );



  if (crop === 'focal' && focal) {

    return (

      <div

        ref={containerRef}

        className={cn('relative w-full overflow-hidden aspect-[2656/1600]', className)}

        style={{

          maxHeight: focal.maxHeight,

          minHeight: focal.minHeight,

        }}

      >

        <div

          className="absolute left-0 right-0 top-0 w-full"

          style={{

            transform: `scale(${focal.scale})`,

            transformOrigin: `${focal.originX} ${focal.originY}`,

          }}

        >

          {mapInner}

        </div>

      </div>

    );

  }



  return (

    <div ref={containerRef} className={cn('relative w-full', className)}>

      {mapInner}

    </div>

  );

}


