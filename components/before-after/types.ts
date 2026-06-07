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
