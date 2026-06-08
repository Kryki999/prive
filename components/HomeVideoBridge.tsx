'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import TrailerModal from '@/components/TrailerModal';

const GameDetails = dynamic(() => import('@/components/GameDetails'), { ssr: true });

export default function HomeVideoBridge() {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    <>
      <GameDetails onPlayVideo={setActiveVideoUrl} />
      <TrailerModal videoUrl={activeVideoUrl} onClose={() => setActiveVideoUrl(null)} />
    </>
  );
}
