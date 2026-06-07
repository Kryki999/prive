/** Płynne przewinięcie do kotwicy na stronie (uwzględnia scroll-mt sekcji). */
export function scrollToSection(
  href: string,
  behavior: ScrollBehavior = 'smooth',
): void {
  const id = href.replace(/^#/, '').trim();

  if (!id || id === 'start') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior, block: 'start' });
}

/** Aktualizuje hash w URL bez wymuszania skoku przeglądarki. */
export function syncLocationHash(href: string): void {
  const next = href.startsWith('#') ? href : `#${href}`;
  const path = window.location.pathname + window.location.search;

  if (next === '#start' || next === '#') {
    window.history.replaceState(null, '', path);
    return;
  }

  window.history.replaceState(null, '', `${path}${next}`);
}
