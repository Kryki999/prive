'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Menu, Phone, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

import NewsfeedDrawer from '@/components/aktualnosci/NewsfeedDrawer';
import PriveLogo from '@/components/brand/PriveLogo';
import { useConfigurator } from '@/components/consultation-form/configurator-shared';
import { NAV_LINKS } from '@/lib/nav/nav-links';
import { PRIVE_EASE, menuCurtainTransition } from '@/lib/nav/motion';
import { scrollToSection, syncLocationHash } from '@/lib/nav/nav-scroll';
import { cn } from '@/lib/utils';

const MENU_PANEL_ID = 'site-primary-menu';
const NEWSFEED_PANEL_ID = 'site-newsfeed-drawer';
const CONSULTATION_PANEL_ID = 'site-slide-in-consultation';

const menuContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: menuCurtainTransition.duration * 0.62,
      staggerChildren: 0.06,
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: PRIVE_EASE,
    },
  },
};

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === '/';

  const [menuOpen, setMenuOpen] = useState(false);
  const [newsfeedOpen, setNewsfeedOpen] = useState(false);
  const [isAtHero, setIsAtHero] = useState(onHome);

  const {
    isOpen: consultationOpen,
    open: openConsultation,
    close: closeConsultation,
  } = useConfigurator();

  const headerRef = useRef<HTMLElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const newsfeedCloseRef = useRef<HTMLButtonElement>(null);

  const openMenu = useCallback(() => {
    closeConsultation();
    setNewsfeedOpen(false);
    setMenuOpen(true);
  }, [closeConsultation]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openNewsfeed = useCallback(() => {
    closeConsultation();
    setMenuOpen(false);
    setNewsfeedOpen(true);
  }, [closeConsultation]);

  const closeNewsfeed = useCallback(() => setNewsfeedOpen(false), []);

  const handleBrandClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      closeConsultation();
      closeMenu();
      closeNewsfeed();
      if (onHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '/');
      } else {
        window.location.href = '/';
      }
    },
    [closeConsultation, closeMenu, closeNewsfeed, onHome],
  );

  const [hidden, setHidden] = useState(false);
  const isAtHeroRef = useRef(onHome);
  const hiddenRef = useRef(false);
  const lastScrollRef = useRef(0);
  const overlayOpen = menuOpen || newsfeedOpen || consultationOpen;
  const scrollLockOpen = menuOpen || newsfeedOpen;

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let ticking = false;
    let rafId = 0;

    const update = () => {
      ticking = false;
      const current = window.scrollY;
      const atHero = onHome && current < 90 && !menuOpen && !overlayOpen;
      const scrolled = current >= 90;

      header.dataset.scrolled = scrolled ? 'true' : 'false';
      header.dataset.atHero = atHero ? 'true' : 'false';
      header.dataset.menuOpen = menuOpen ? 'true' : 'false';

      if (atHero !== isAtHeroRef.current) {
        isAtHeroRef.current = atHero;
        setIsAtHero(atHero);
      }

      if (overlayOpen) {
        if (hiddenRef.current) {
          hiddenRef.current = false;
          setHidden(false);
        }
        lastScrollRef.current = current;
        return;
      }

      let nextHidden = hiddenRef.current;
      if (current < 90) {
        nextHidden = false;
      } else {
        const delta = current - lastScrollRef.current;
        if (delta > 6) nextHidden = true;
        else if (delta < -4) nextHidden = false;
      }

      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden;
        setHidden(nextHidden);
      }
      lastScrollRef.current = current;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [onHome, menuOpen, overlayOpen]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty(
        '--site-header-h',
        `${Math.ceil(el.getBoundingClientRect().height)}px`,
      );
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--site-header-h');
    };
  }, []);

  useEffect(() => {
    if (!scrollLockOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [scrollLockOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (consultationOpen) closeConsultation();
      else if (menuOpen) closeMenu();
      else if (newsfeedOpen) closeNewsfeed();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, newsfeedOpen, consultationOpen, closeMenu, closeNewsfeed, closeConsultation]);

  useEffect(() => {
    if (!menuOpen) return;
    const t = window.requestAnimationFrame(() => {
      firstMenuLinkRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(t);
  }, [menuOpen]);

  useEffect(() => {
    if (!newsfeedOpen) return;
    const t = window.requestAnimationFrame(() => {
      newsfeedCloseRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(t);
  }, [newsfeedOpen]);

  const bellUnreachableUnderDrawer = newsfeedOpen || consultationOpen;

  const openConsultationFromHeader = useCallback(() => {
    closeMenu();
    closeNewsfeed();
    openConsultation();
  }, [closeMenu, closeNewsfeed, openConsultation]);

  const handleConsultationClick = useCallback(() => {
    if (consultationOpen) closeConsultation();
    else openConsultationFromHeader();
  }, [consultationOpen, closeConsultation, openConsultationFromHeader]);

  const handleNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      closeMenu();

      if (onHome) {
        window.requestAnimationFrame(() => {
          scrollToSection(href);
          syncLocationHash(href);
        });
        return;
      }

      const hash = href.startsWith('#') ? href : `#${href}`;
      window.location.href = `/${hash}`;
    },
    [closeMenu, onHome],
  );

  const useHeroStyle = onHome && isAtHero && !menuOpen && !overlayOpen;
  const logoVariant = useHeroStyle ? 'hero' : 'scrolled';

  const iconBtnCls = useHeroStyle
    ? 'text-white/85 hover:text-white'
    : 'text-prive-text-muted hover:text-prive-plum';

  return (
    <>
      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              key="menu-backdrop"
              role="presentation"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: menuCurtainTransition.ease }}
              className="fixed inset-0 z-[85] hidden bg-prive-plum/35 backdrop-blur-md md:block"
              onClick={closeMenu}
            />
            <motion.div
              key="menu-curtain"
              id={MENU_PANEL_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Menu główne"
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={menuCurtainTransition}
              className="fixed left-0 right-0 top-0 z-[90] flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-prive-white md:h-[min(640px,68vh)] md:rounded-b-[1.25rem] md:border-b md:border-prive-border md:shadow-prive-card-hover"
            >
              <div className="flex h-full flex-col px-4 pb-16 pt-[calc(var(--site-header-h,7rem)+1.25rem)] md:px-[6vw] md:pb-14 md:pt-[calc(var(--site-header-h,5rem)+2rem)]">
                <nav
                  aria-label="Nawigacja"
                  className="flex flex-1 flex-col items-center justify-center"
                >
                  <motion.ul
                    className="flex flex-col items-center gap-7 md:flex-row md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-7"
                    variants={menuContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {NAV_LINKS.map(({ href, label }, i) => (
                      <motion.li key={label} variants={menuItemVariants}>
                        <Link
                          href={onHome ? href : `/${href}`}
                          ref={i === 0 ? firstMenuLinkRef : undefined}
                          className="block rounded-md text-center text-[2rem] font-bold tracking-tight text-prive-plum outline-none transition-colors hover:text-prive-rose focus-visible:ring-2 focus-visible:ring-prive-rose/45 md:text-[clamp(1.5rem,2.4vw,2.05rem)]"
                          onClick={(e) => handleNavClick(e, href)}
                        >
                          {label}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </nav>

                <div className="mt-auto flex justify-center pb-4 md:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      openConsultationFromHeader();
                    }}
                    className="btn-prive btn-prive--pill text-sm px-8 py-3"
                  >
                    Umów darmową konsultację
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <motion.header
        ref={headerRef}
        className="site-header fixed left-0 top-0 z-[100] w-full px-4 md:px-[6vw]"
        initial={{ y: 0 }}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{
          duration: hidden ? 0.42 : 0.55,
          ease: PRIVE_EASE,
        }}
      >
        <div className="site-header__bg" aria-hidden />
        <div
          className={cn(
            'relative z-10 mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 md:gap-3',
            useHeroStyle && 'min-h-11 md:min-h-12',
          )}
        >
          <button
            type="button"
            aria-label="Otwórz aktualności"
            aria-expanded={newsfeedOpen}
            aria-controls={NEWSFEED_PANEL_ID}
            disabled={bellUnreachableUnderDrawer}
            tabIndex={bellUnreachableUnderDrawer ? -1 : 0}
            className={`flex size-10 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/45 disabled:pointer-events-none disabled:opacity-40 md:size-12 ${iconBtnCls}`}
            onClick={() => (newsfeedOpen ? closeNewsfeed() : openNewsfeed())}
          >
            <Bell className="size-5 md:size-6" strokeWidth={1.35} aria-hidden />
          </button>

          <Link
            href="/"
            aria-label="HairClinic PRIVÉ — strona główna"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/45 focus-visible:ring-offset-2"
            onClick={handleBrandClick}
          >
            <PriveLogo variant={logoVariant} />
          </Link>

          <div className="flex shrink-0 items-center gap-1 md:gap-2">
            <button
              type="button"
              aria-label="Umów konsultację"
              aria-expanded={consultationOpen}
              aria-controls={CONSULTATION_PANEL_ID}
              onClick={handleConsultationClick}
              className="btn-prive btn-prive--pill shrink-0 p-2.5 sm:px-5 sm:py-2.5 sm:text-xs"
            >
              <Phone size={18} className="sm:hidden" aria-hidden />
              <span className="hidden sm:inline">Umów konsultację</span>
            </button>
            <button
              type="button"
              aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={menuOpen}
              aria-controls={MENU_PANEL_ID}
              className={`flex size-10 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/45 md:size-12 ${iconBtnCls}`}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
            >
              {menuOpen ? (
                <X className="size-5 md:size-6" strokeWidth={1.35} aria-hidden />
              ) : (
                <Menu className="size-5 md:size-6" strokeWidth={1.35} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <NewsfeedDrawer
        open={newsfeedOpen}
        onClose={closeNewsfeed}
        drawerId={NEWSFEED_PANEL_ID}
        closeButtonRef={newsfeedCloseRef}
      />
    </>
  );
}
