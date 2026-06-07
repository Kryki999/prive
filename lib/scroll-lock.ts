type StyleSnapshot = {
  scrollY: number;
  body: {
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
    overflow: string;
    overflowX: string;
    paddingRight: string;
  };
  html: {
    overflow: string;
    overflowX: string;
  };
};

let lockCount = 0;
let snapshot: StyleSnapshot | null = null;
let listenersAttached = false;

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
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

function captureSnapshot(scrollY: number): StyleSnapshot {
  return {
    scrollY,
    body: {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      overflowX: document.body.style.overflowX,
      paddingRight: document.body.style.paddingRight,
    },
    html: {
      overflow: document.documentElement.style.overflow,
      overflowX: document.documentElement.style.overflowX,
    },
  };
}

function applyLockStyles(scrollY: number, scrollbarWidth: number) {
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.overflowX = 'hidden';

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  document.body.style.overflowX = 'hidden';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function restoreLockStyles() {
  if (!snapshot) {
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
    return;
  }

  const saved = snapshot;
  snapshot = null;

  document.documentElement.style.overflow = saved.html.overflow;
  document.documentElement.style.overflowX = saved.html.overflowX;

  document.body.style.position = saved.body.position;
  document.body.style.top = saved.body.top;
  document.body.style.left = saved.body.left;
  document.body.style.right = saved.body.right;
  document.body.style.width = saved.body.width;
  document.body.style.overflow = saved.body.overflow;
  document.body.style.overflowX = saved.body.overflowX;
  document.body.style.paddingRight = saved.body.paddingRight;

  window.scrollTo(0, saved.scrollY);
}

function releaseLock() {
  detachListeners();
  restoreLockStyles();
}

/** Blokuje scroll strony (mobile + desktop). Ref-count — bezpieczne przy wielu overlayach. */
export function lockPageScroll(): () => void {
  lockCount += 1;
  if (lockCount === 1) {
    const scrollY = window.scrollY;
    snapshot = captureSnapshot(scrollY);
    applyLockStyles(scrollY, getScrollbarWidth());
    attachListeners();
  }

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
