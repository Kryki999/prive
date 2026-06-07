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

const activeLocks = new Set<symbol>();
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

function attachScrollBlockListeners() {
  if (listenersAttached) return;
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('wheel', onWheel, { passive: false });
  listenersAttached = true;
}

function detachScrollBlockListeners() {
  if (!listenersAttached) return;
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('wheel', onWheel);
  listenersAttached = false;
}

function applyPageScrollLock() {
  const scrollY = window.scrollY;
  const scrollbarWidth = getScrollbarWidth();

  snapshot = {
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

  attachScrollBlockListeners();
}

function restoreStyleProperty(el: HTMLElement, prop: string, value: string) {
  if (value) {
    el.style.setProperty(prop, value);
  } else {
    el.style.removeProperty(prop);
  }
}

function releasePageScrollLock() {
  detachScrollBlockListeners();

  const saved = snapshot;
  snapshot = null;

  if (!saved) {
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow-x');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('left');
    document.body.style.removeProperty('right');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow-x');
    document.body.style.removeProperty('padding-right');
    return;
  }

  restoreStyleProperty(document.documentElement, 'overflow', saved.html.overflow);
  restoreStyleProperty(document.documentElement, 'overflow-x', saved.html.overflowX);

  restoreStyleProperty(document.body, 'position', saved.body.position);
  restoreStyleProperty(document.body, 'top', saved.body.top);
  restoreStyleProperty(document.body, 'left', saved.body.left);
  restoreStyleProperty(document.body, 'right', saved.body.right);
  restoreStyleProperty(document.body, 'width', saved.body.width);
  restoreStyleProperty(document.body, 'overflow', saved.body.overflow);
  restoreStyleProperty(document.body, 'overflow-x', saved.body.overflowX);
  restoreStyleProperty(document.body, 'padding-right', saved.body.paddingRight);

  window.scrollTo(0, saved.scrollY);
}

export function lockPageScroll(): () => void {
  const token = Symbol('scroll-lock');
  activeLocks.add(token);

  if (activeLocks.size === 1) {
    applyPageScrollLock();
  }

  return () => {
    if (!activeLocks.delete(token)) return;
    if (activeLocks.size === 0) {
      releasePageScrollLock();
    }
  };
}

export function blurActiveElement() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
}
