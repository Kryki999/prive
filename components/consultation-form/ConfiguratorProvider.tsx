'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import SlideInConsultationForm from './SlideInConsultationForm';
import {
  ConfiguratorContext,
  type ConfiguratorContextValue,
} from './configurator-shared';

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setOpen(false);
  }, []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo<ConfiguratorContextValue>(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
      <SlideInConsultationForm />
    </ConfiguratorContext.Provider>
  );
}
