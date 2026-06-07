'use client';

import { Camera, X } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const MAX_PHOTOS = 4;

type PhotoUploadProps = {
  files: File[];
  onChange: (files: File[]) => void;
  className?: string;
  variant?: 'drawer' | 'embedded';
};

export default function PhotoUpload({
  files,
  onChange,
  className,
  variant = 'drawer',
}: PhotoUploadProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const next = [...files];
      for (const file of Array.from(incoming)) {
        if (!file.type.startsWith('image/')) continue;
        if (next.length >= MAX_PHOTOS) break;
        next.push(file);
      }
      onChange(next);
    },
    [files, onChange],
  );

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const slots = Array.from({ length: MAX_PHOTOS }, (_, index) => files[index] ?? null);

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-6 text-center transition-colors',
          variant === 'drawer'
            ? 'border-white/15 bg-white/[0.03] hover:border-prive-rose/45'
            : 'border-prive-border bg-prive-surface hover:border-prive-rose/45',
          dragActive && 'border-prive-rose bg-prive-rose/5',
        )}
      >
        <Camera className="size-6 text-prive-rose" aria-hidden />
        <p className="text-sm font-medium text-prive-text/90">
          Kliknij lub przeciągnij zdjęcie
        </p>
        <p className="text-xs text-prive-text-muted">
          Przód, tył, boki głowy/twarzy — maks. {MAX_PHOTOS} pliki
        </p>
      </div>

      <input
        ref={inputRef}
        id={`${uid}-photos`}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {slots.map((file, index) => (
          <div
            key={index}
            className={cn(
              'relative aspect-square overflow-hidden rounded-xl border',
              variant === 'drawer' ? 'border-white/10 bg-white/[0.03]' : 'border-prive-border bg-prive-surface',
            )}
          >
            {file ? (
              <>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Zdjęcie ${index + 1}`}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Usuń zdjęcie ${index + 1}`}
                  onClick={() => removeFile(index)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/65 p-1 text-white transition hover:bg-black"
                >
                  <X className="size-3.5" />
                </button>
              </>
            ) : (
              <div className="flex size-full items-center justify-center text-prive-text-muted/50">
                <Camera className="size-5" aria-hidden />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
