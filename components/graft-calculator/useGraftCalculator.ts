'use client';

import { useCallback, useMemo, useState } from 'react';
import { calculateTotals } from '@/lib/graft-calculator/calculate';
import { GRAFT_ZONES, type ZoneId } from '@/lib/graft-calculator/zones';

export function useGraftCalculator() {
  const [selected, setSelected] = useState<Set<ZoneId>>(new Set());

  const toggle = useCallback((id: ZoneId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isSelected = useCallback((id: ZoneId) => selected.has(id), [selected]);

  const totals = useMemo(() => calculateTotals(selected, GRAFT_ZONES), [selected]);

  return {
    zones: GRAFT_ZONES,
    selected,
    toggle,
    isSelected,
    totals,
  };
}
