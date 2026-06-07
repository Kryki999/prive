'use client';

import { createContext, useContext } from 'react';

export type ConfiguratorContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function useConfigurator(): ConfiguratorContextValue {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) {
    throw new Error('useConfigurator must be used within ConfiguratorProvider');
  }
  return ctx;
}
