'use client';

import { X } from 'lucide-react';

interface TrailerModalProps {
  videoUrl: string | null;
  onClose: () => void;
}

export default function TrailerModal({ videoUrl, onClose }: TrailerModalProps) {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-prive-dark/95 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-5xl aspect-video bg-prive-text rounded-xl overflow-hidden border border-prive-border shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-prive-dark/60 hover:bg-prive hover:text-white text-white p-2.5 rounded-full transition-all focus:outline-none"
          aria-label="Close Trailer"
        >
          <X size={20} />
        </button>

        <iframe
          src={`${videoUrl}?autoplay=1&mute=0`}
          title="Rockstar Games Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
