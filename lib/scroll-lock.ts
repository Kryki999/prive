let lockCount = 0;
let savedScrollY = 0;
let useFixedBody = false;
let listenersAttached = false;

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

/** Phones/tablets — position:fixed on body breaks touch scroll restore on iOS Safari. */
function shouldUseFixedBodyLock(): boolean {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(pointer: coarse)').matches;
}

function readScrollY(): number {
  if (document.body.style.position === 'fixed') {
    const top = parseInt(document.body.style.top, 10);
    return Number.isFinite(top) ? Math.abs(top) : window.scrollY;
  }
  return window.scrollY;
}

function isInsideScrollableLockTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('[data-scroll-lock-scrollable]'));
}

function onTouchMove(e: TouchEvent) {
  if (isInsideScrollableLockTarget(e.target)) return;
  e.preventDefault();
}

function onWheel(e: WheelEvent) {
  if (isInsideScrollableLockTarget(e.target)) return;
  e.preventDefault();
}

function attachListeners() {
  if (listenersAttached) return;
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('wheel', onWheel, { passive: false });
  listenersAttached = true;
}

function detachListeners() {
  if (!listenersAttached) return;
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('wheel', onWheel);
  listenersAttached = false;
}

function applyLockStyles(scrollY: number, scrollbarWidth: number, fixedBody: boolean) {
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.overflowX = 'hidden';

  if (!fixedBody) return;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function clearLockStyles() {
  document.documentElement.style.overflow = '';
  document.documentElement.style.overflowX = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  document.body.style.overflowX = '';
  document.body.style.paddingRight = '';
}

function restoreScrollPosition(scrollY: number) {
  const apply = () => {
    window.scrollTo(0, scrollY);
    document.documentElement.scrollTop = scrollY;
    document.body.scrollTop = scrollY;
  };
  apply();
  requestAnimationFrame(() => {
    requestAnimationFrame(apply);
  });
}

function releaseLock() {
  const scrollY = savedScrollY;
  const hadFixedBody = useFixedBody;

  detachListeners();
  clearLockStyles();
  savedScrollY = 0;
  useFixedBody = false;

  if (hadFixedBody) {
    restoreScrollPosition(scrollY);
  }
}

/** Blokuje scroll strony (mobile + desktop). Ref-count — bezpieczne przy wielu overlayach. */
export function lockPageScroll(): () => void {
  lockCount += 1;
  if (lockCount > 1) {
    return () => {
      lockCount = Math.max(0, lockCount - 1);
    };
  }

  savedScrollY = readScrollY();
  useFixedBody = shouldUseFixedBodyLock();
  applyLockStyles(savedScrollY, getScrollbarWidth(), useFixedBody);
  attachListeners();

  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      releaseLock();
    }
  };
}

/** Twardy reset — gdy ref-count się rozjedzie (np. po animacji modala). */
export function forceUnlockPageScroll(): void {
  lockCount = 0;
  releaseLock();
}

/** Lock zwolniony logicznie, ale DOM nadal zablokowany. */
export function isPageScrollLockStuck(): boolean {
  return (
    listenersAttached ||
    document.body.style.position === 'fixed' ||
    document.documentElement.style.overflow === 'hidden'
  );
}
