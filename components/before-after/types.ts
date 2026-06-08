/** Atrybut na elementach interaktywnych — Embla pomija drag, gdy gest startuje wewnątrz nich. */
export const BEFORE_AFTER_INTERACTIVE_SELECTOR = '[data-before-after-interactive]';

export type ComparisonViewMode = 'slider' | 'sideBySide';

export type BeforeAfterCase = {
  id: string;
  title: string;
  beforeUrl: string;
  afterUrl: string;
  tags?: string[];
};

/**
 * Mniejszy canvas (object-cover) + scale do pełnej ramki = prawdziwe oddalenie bez marginesów.
 * Większy canvas / ujemny inset robi odwrotnie i przybliża.
 */
export const COMPARISON_IMAGE_ZOOM_CLASS =
  'absolute left-1/2 top-0 h-[88%] w-[88%] origin-top -translate-x-1/2 scale-[1.14]';

/** Widok obok siebie — węższe kolumny, mocniejsze oddalenie. */
export const COMPARISON_SIDE_BY_SIDE_ZOOM_CLASS =
  'absolute left-1/2 top-0 h-[62%] w-[62%] origin-top -translate-x-1/2 scale-[1.61]';

export const COMPARISON_IMAGE_CLASS = 'object-cover object-top';
