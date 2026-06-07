'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import ConsultationFormBody, { type ConsultationStep } from './ConsultationFormBody';
import { CONSULTATION_FORM_IMAGE } from './form-data';
import { useConfigurator } from './configurator-shared';
import { drawerSlideTransition } from '@/lib/nav/motion';
import {
  forceUnlockPageScroll,
  isPageScrollLockStuck,
  lockPageScroll,
} from '@/lib/scroll-lock';

const PANEL_ID = 'site-slide-in-consultation';

export default function SlideInConsultationForm() {
  const { isOpen, close } = useConfigurator();
  const panelRef = useRef<HTMLElement>(null);
  const [wizardStep, setWizardStep] = useState<ConsultationStep | null>(null);
  const [keyboardBottomInset, setKeyboardBottomInset] = useState(0);
  const panEligible = useRef(false);

  useEffect(() => {
    if (!isOpen) setWizardStep(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    return lockPageScroll();
  }, [isOpen]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardBottomInset(overlap > 64 ? Math.min(overlap, 220) + 8 : 0);
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const root = panelRef.current;
    if (!root) return;

    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const nodes = [...root.querySelectorAll<HTMLElement>(selector)].filter(
        (el) => !el.hasAttribute('disabled'),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !root.contains(active)) return;
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, wizardStep]);

  const onPanStart = useCallback(
    (_event: PointerEvent, info: { point: { x: number; y: number } }) => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        panEligible.current = false;
        return;
      }
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) {
        panEligible.current = false;
        return;
      }
      panEligible.current = info.point.x - rect.left < 72;
    },
    [],
  );

  const onPanEnd = useCallback(
    (
      _event: PointerEvent,
      info: {
        offset: { x: number; y: number };
        velocity: { x: number; y: number };
      },
    ) => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
      if (!panEligible.current) return;
      const { offset, velocity } = info;
      if (offset.x < 40) return;
      if (Math.abs(velocity.y) > Math.abs(velocity.x) + 120) return;
      if (offset.x > 64 || velocity.x > 200) close();
    },
    [close],
  );

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (!isOpen && isPageScrollLockStuck()) {
          forceUnlockPageScroll();
        }
      }}
    >
      {isOpen ? (
        <>
          <motion.div
            key="consultation-backdrop"
            role="presentation"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: drawerSlideTransition.ease }}
            className="fixed inset-0 z-[115] bg-prive-plum/45 backdrop-blur-sm md:backdrop-blur-md"
            onClick={close}
          />
          <motion.aside
            ref={panelRef}
            key="consultation-panel"
            id={PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-dialog-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={drawerSlideTransition}
            onPanStart={onPanStart}
            onPanEnd={onPanEnd}
            className="fixed inset-0 z-[120] flex h-[100dvh] min-h-0 touch-pan-y flex-col bg-[var(--prive-modal-surface)] shadow-[-12px_0_56px_rgba(0,0,0,0.45)] md:touch-auto md:flex-row"
          >
            <div className="relative hidden min-h-0 w-full flex-none md:flex md:w-1/2 md:flex-col">
              <div className="relative min-h-[38vh] flex-1 bg-prive-plum md:min-h-0">
                <img
                  src={CONSULTATION_FORM_IMAGE}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  aria-hidden
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--prive-modal-surface)]/25 via-transparent to-[var(--prive-modal-surface)]/65 md:bg-gradient-to-t md:from-[var(--prive-modal-surface)]/75 md:via-transparent md:to-transparent"
                />
                <div className="pointer-events-none absolute bottom-8 left-8 right-8 z-[1] hidden md:block">
                  <p className="max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
                    Darmowa konsultacja w Hair Clinic PRIVÉ.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-0 w-full flex-1 flex-col bg-[var(--prive-modal-surface)] md:w-1/2">
              <div
                data-scroll-lock-scrollable
                className="consultation-drawer-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-12 pt-14 md:px-9 md:pb-14 md:pt-16"
              >
                <ConsultationFormBody
                  onStepChange={setWizardStep}
                  keyboardBottomInset={keyboardBottomInset}
                  mode="drawer"
                  titleId="consultation-dialog-title"
                  onSuccessClose={close}
                  autoFocusSteps
                  scrollToStepOnChange
                />
              </div>
              <button
                type="button"
                aria-label="Zamknij formularz konsultacji"
                className="absolute right-5 top-5 z-[2] rounded-md p-2 text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/45 md:right-9 md:top-8"
                onClick={close}
              >
                <X className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
