'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import type { RefObject } from 'react';

import {
  AKTUALNOSCI_ITEMS,
  formatAktualnoscDate,
  getAktualnoscHref,
} from '@/lib/aktualnosci/data';
import { drawerSlideTransition } from '@/lib/nav/motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: drawerSlideTransition.duration,
      staggerChildren: 0.068,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.34,
      ease: drawerSlideTransition.ease,
    },
  },
};

type NewsfeedDrawerProps = {
  open: boolean;
  onClose: () => void;
  drawerId: string;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
};

export default function NewsfeedDrawer({
  open,
  onClose,
  drawerId,
  closeButtonRef,
}: NewsfeedDrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="newsfeed-backdrop"
            role="presentation"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: drawerSlideTransition.ease }}
            className="fixed inset-0 z-[105] bg-prive-plum/45 backdrop-blur-sm md:backdrop-blur-md"
            onClick={onClose}
          />
          <motion.aside
            key="newsfeed-panel"
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Najnowsze wpisy Hair Clinic PRIVÉ"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={drawerSlideTransition}
            className="fixed left-0 top-0 z-[110] flex h-[100dvh] w-full flex-row bg-prive-white shadow-[12px_0_56px_rgba(117,31,94,0.25)] md:w-[min(40vw,520px)]"
          >
            <div className="relative z-[2] flex w-14 shrink-0 flex-col items-center border-r border-prive-border bg-prive-surface py-4 md:w-16">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Zamknij aktualności"
                className="rounded-md p-2 text-prive-text-muted transition-colors hover:text-prive-plum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/45"
                onClick={onClose}
              >
                <X className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            <div
              data-scroll-lock-scrollable
              className="newsfeed-scrollbar relative z-[1] flex min-w-0 flex-1 overflow-y-auto overscroll-contain bg-prive-white"
            >
              <motion.div
                className="flex w-full flex-col gap-10 px-5 py-7 pb-14 md:gap-11 md:px-7 md:py-8 md:pb-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-extrabold tracking-tight text-prive-plum md:text-2xl">
                    Najnowsze wpisy
                  </h2>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-prive-text-muted">
                    Aktualności z Hair Clinic PRIVÉ — metody zabiegów, porady i historie pacjentów.
                  </p>
                </motion.div>

                <div className="flex flex-col gap-9 md:gap-10">
                  {AKTUALNOSCI_ITEMS.map((item) => (
                    <motion.article
                      key={item.slug}
                      variants={itemVariants}
                      className="overflow-hidden rounded-xl border border-prive-border bg-prive-surface shadow-prive-card"
                    >
                      <Link
                        href={getAktualnoscHref(item.slug, 'home')}
                        onClick={onClose}
                        className="group block outline-none focus-visible:ring-2 focus-visible:ring-prive-rose/50 focus-visible:ring-offset-2"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-prive-surface">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, min(40vw, 520px)"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                          />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-prive-plum/80 via-transparent to-transparent opacity-90"
                          />
                          <time
                            dateTime={item.date}
                            className="absolute left-4 top-4 rounded bg-prive-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-prive-plum backdrop-blur-[2px]"
                          >
                            {formatAktualnoscDate(item.date)}
                          </time>
                        </div>

                        <div className="space-y-3 px-5 pb-6 pt-5 md:px-6 md:pb-7 md:pt-6">
                          <h3 className="text-[1.2rem] font-bold leading-[1.15] tracking-tight text-prive-text transition-colors group-hover:text-prive-rose md:text-xl">
                            {item.title}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-prive-rose transition-colors group-hover:text-prive-plum">
                            Więcej
                            <span
                              aria-hidden
                              className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                <motion.div variants={itemVariants}>
                  <Link
                    href="/aktualnosci"
                    onClick={onClose}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-dashed border-prive-border bg-prive-surface px-5 py-5 outline-none transition-[border-color,background-color] hover:border-prive-rose/45 hover:bg-prive-white focus-visible:ring-2 focus-visible:ring-prive-rose/50 md:px-6 md:py-6"
                  >
                    <div>
                      <p className="text-lg font-bold tracking-tight text-prive-plum transition-colors group-hover:text-prive-rose md:text-xl">
                        Wszystkie wpisy
                      </p>
                      <p className="mt-1 text-sm text-prive-text-muted">
                        Pełna lista aktualności kliniki
                      </p>
                    </div>
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-prive-border transition-colors group-hover:border-prive-rose/45">
                      <ArrowRight
                        className="size-4 text-prive-plum transition-transform duration-300 group-hover:translate-x-0.5"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
