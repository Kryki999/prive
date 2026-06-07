'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import ConsultationPhoneInput from './ConsultationPhoneInput';
import NorwoodScalePicker from './NorwoodScalePicker';
import PhotoUpload from './PhotoUpload';
import {
  HAIR_TRANSPLANT_ID,
  QUICK_CONTACT_EMAIL,
  TEXTAREA_TREATMENTS,
  TREATMENT_OPTIONS,
  type TreatmentId,
} from './form-data';
import { CLINIC_PHONE, CLINIC_PHONE_HREF, CLINIC_WHATSAPP_HREF } from '@/lib/clinic';
import { PRIVE_EASE } from '@/lib/nav/motion';

export type ConsultationStep = 1 | 2 | 3 | 'success';

type ConsultationFormBodyProps = {
  onStepChange?: (step: ConsultationStep) => void;
  keyboardBottomInset?: number;
  mode?: 'drawer' | 'embedded';
  titleId?: string;
  onSuccessClose?: () => void;
  quickContactEmail?: string;
  /** Auto-focus pola przy zmianie kroku (tylko panel boczny). */
  autoFocusSteps?: boolean;
  /** Przewijanie do formularza przy zmianie kroku (tylko panel boczny). */
  scrollToStepOnChange?: boolean;
};

function formIdPrefix(titleId: string | undefined, mode: 'drawer' | 'embedded') {
  if (titleId?.endsWith('-title')) {
    return titleId.slice(0, -'-title'.length);
  }
  if (titleId) return titleId;
  return mode === 'drawer' ? 'consultation-drawer' : 'prefooter-consultation-form';
}

const stepVariants = {
  initial: (d: number) => ({ x: 44 * d, opacity: 0 }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.44, ease: PRIVE_EASE },
  },
  exit: (d: number) => ({
    x: -44 * d,
    opacity: 0,
    transition: { duration: 0.4, ease: PRIVE_EASE },
  }),
};

export default function ConsultationFormBody({
  onStepChange,
  keyboardBottomInset = 0,
  mode = 'drawer',
  titleId,
  onSuccessClose,
  quickContactEmail = QUICK_CONTACT_EMAIL,
  autoFocusSteps = false,
  scrollToStepOnChange = false,
}: ConsultationFormBodyProps) {
  const idPrefix = formIdPrefix(titleId, mode);
  const resolvedTitleId = titleId ?? `${idPrefix}-title`;
  const [step, setStep] = useState<ConsultationStep>(1);
  const [direction, setDirection] = useState(1);
  const [treatment, setTreatment] = useState<TreatmentId | ''>('');
  const [norwoodLevel, setNorwoodLevel] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('48');
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [fax, setFax] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const formContainerRef = useRef<HTMLDivElement>(null);
  const firstTileRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const closeSuccessRef = useRef<HTMLButtonElement>(null);
  const isInitialMount = useRef(true);

  const isDrawer = mode === 'drawer';
  const ghostField = isDrawer
    ? 'w-full border-0 border-b border-white/[0.12] bg-transparent px-0 py-3.5 text-[0.9375rem] text-prive-white outline-none transition-[box-shadow,border-color] duration-300 placeholder:text-white/40 focus:border-prive-rose focus:shadow-[inset_0_-1px_0_0_rgba(229,0,126,0.85)]'
    : 'w-full rounded-xl border border-prive-border bg-prive-white px-4 py-3.5 text-sm text-prive-text outline-none transition-colors placeholder:text-prive-text-muted focus:border-prive-rose focus:ring-2 focus:ring-prive-rose/20';

  const labelClass = isDrawer
    ? 'text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/55'
    : 'text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-prive-text-muted';

  const primaryBtnClass = isDrawer
    ? 'min-h-12 flex-[1.35] rounded-full border border-prive-rose/35 bg-prive-gradient px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-prive-btn transition duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-prive-btn-hover disabled:opacity-55'
    : 'min-h-12 flex-[1.35] rounded-xl btn-prive px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] disabled:opacity-55';

  const secondaryBtnClass = isDrawer
    ? 'min-h-12 flex-1 rounded-full border border-white/15 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/55 transition hover:border-white/25 hover:text-white'
    : 'min-h-12 flex-1 rounded-xl border border-prive-border bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-prive-text-muted transition hover:border-prive-rose/35 hover:text-prive-plum';

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (!scrollToStepOnChange) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const scrollable = formContainerRef.current?.closest('[data-scroll-lock-scrollable]');
    if (scrollable instanceof HTMLElement) {
      scrollable.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, scrollToStepOnChange]);

  useEffect(() => {
    if (!autoFocusSteps) return;
    if (step === 1) firstTileRef.current?.focus();
    if (step === 2 && treatment !== HAIR_TRANSPLANT_ID) descriptionRef.current?.focus();
    if (step === 3) nameRef.current?.focus();
    if (step === 'success') closeSuccessRef.current?.focus();
  }, [step, autoFocusSteps, treatment]);

  const scrollFieldIntoView = (el: HTMLElement) => {
    const scrollable = el.closest('[data-scroll-lock-scrollable]');
    if (scrollable instanceof HTMLElement) {
      const scrollableRect = scrollable.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset =
        elRect.top - scrollableRect.top - scrollableRect.height / 2 + elRect.height / 2;
      scrollable.scrollBy({ top: offset, behavior: 'smooth' });
      return;
    }
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const resetWizard = useCallback(() => {
    setStep(1);
    setDirection(1);
    setTreatment('');
    setNorwoodLevel(null);
    setDescription('');
    setPhotos([]);
    setName('');
    setPhone('48');
    setEmail('');
    setPrivacyAccepted(false);
    setFax('');
    setSubmitError(null);
    setFieldErrors({});
  }, []);

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (treatment === HAIR_TRANSPLANT_ID) {
      if (!norwoodLevel) {
        errors.norwood = 'Wybierz stopień, który najbardziej przypomina Twój stan.';
      }
    } else if (description.trim().length < 8) {
      errors.description = 'Opisz krótko efekt, jaki chcesz osiągnąć.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (name.trim().length < 2) errors.name = 'Imię jest wymagane.';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) {
      errors.phone = 'Podaj poprawny numer telefonu.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Niepoprawny e-mail.';
    }
    if (!privacyAccepted) {
      errors.privacy = 'Zaakceptuj politykę prywatności, aby wysłać zgłoszenie.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.set('treatment', treatment);
      if (treatment === HAIR_TRANSPLANT_ID && norwoodLevel) {
        fd.set('norwoodLevel', String(norwoodLevel));
      } else {
        fd.set('description', description.trim());
      }
      fd.set('name', name.trim());
      fd.set('phone', phone.trim());
      if (email.trim()) fd.set('email', email.trim());
      if (fax) fd.set('fax', fax);
      photos.forEach((photo) => fd.append('photos', photo));

      const res = await fetch('/api/send-consultation-request', {
        method: 'POST',
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Błąd wysyłki');

      setDirection(1);
      setStep('success');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Spróbuj ponownie za chwilę.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showTextarea = treatment !== '' && TEXTAREA_TREATMENTS.includes(treatment as TreatmentId);

  const selectTreatmentAndAdvance = (optionId: TreatmentId) => {
    setTreatment(optionId);
    setDirection(1);
    setStep(2);
  };

  const contactLinkClass = isDrawer
    ? 'text-prive-rose underline-offset-2 transition hover:text-white hover:underline'
    : 'text-prive-rose underline-offset-2 transition hover:text-prive-plum hover:underline';

  return (
    <div
      ref={formContainerRef}
      className="scroll-mt-4"
      style={{ paddingBottom: keyboardBottomInset }}
    >
      <p className="sr-only" aria-live="polite">
        {step === 'success' ? 'Wysłano. Dziękujemy.' : `Krok ${step} z 3.`}
      </p>

      {step !== 'success' ? (
        <div className="mb-8 flex items-center justify-center gap-2" aria-hidden>
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                dot <= (step as number) ? 'w-10 bg-prive-rose' : 'w-4 bg-prive-border/40',
                isDrawer && dot <= (step as number) && 'bg-prive-rose shadow-[0_0_12px_rgba(229,0,126,0.45)]',
              )}
            />
          ))}
        </div>
      ) : null}

      <AnimatePresence custom={direction} mode="wait" initial={false}>
        {step === 'success' ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: PRIVE_EASE }}
            className="flex min-h-[40vh] flex-col items-center justify-center gap-6 py-6 text-center"
          >
            <div
              id={resolvedTitleId}
              className={cn(
                'max-w-sm text-balance text-2xl font-semibold leading-tight md:text-3xl',
                isDrawer ? 'text-white' : 'text-prive-plum',
              )}
            >
              Dziękujemy — Twoja konsultacja jest w drodze.
            </div>
            <p
              className={cn(
                'max-w-md text-pretty text-sm leading-relaxed md:text-[0.9375rem]',
                isDrawer ? 'text-white/65' : 'text-prive-text-muted',
              )}
            >
              Wrócimy z pierwszym kontaktem na podany numer.
              {onSuccessClose
                ? ' Jeśli chcesz, możesz już zamknąć ten panel.'
                : ' Jeśli chcesz, możesz od razu wysłać kolejne zgłoszenie.'}
            </p>
            {onSuccessClose ? (
              <button
                ref={closeSuccessRef}
                type="button"
                className={primaryBtnClass}
                onClick={onSuccessClose}
              >
                Zamknij
              </button>
            ) : (
              <button
                ref={closeSuccessRef}
                type="button"
                className={secondaryBtnClass}
                onClick={resetWizard}
              >
                Wyślij kolejne zgłoszenie
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <header className="space-y-2">
              {step === 1 ? (
                <div
                  className={cn(
                    'mb-4 space-y-2 text-pretty text-[0.95rem] leading-relaxed md:text-base',
                    isDrawer ? 'text-white/80' : 'text-prive-text-muted',
                  )}
                >
                  <p>Skontaktuj się z nami od razu:</p>
                  <ul className="flex flex-wrap gap-x-1 gap-y-1 text-sm md:text-[0.9375rem]">
                    <li>
                      <a href={`mailto:${quickContactEmail}`} className={contactLinkClass}>
                        {quickContactEmail}
                      </a>
                    </li>
                    <li
                      aria-hidden
                      className={isDrawer ? 'text-white/35' : 'text-prive-text-muted/50'}
                    >
                      ·
                    </li>
                    <li>
                      <a href={CLINIC_PHONE_HREF} className={contactLinkClass}>
                        {CLINIC_PHONE}
                      </a>
                    </li>
                    <li
                      aria-hidden
                      className={isDrawer ? 'text-white/35' : 'text-prive-text-muted/50'}
                    >
                      ·
                    </li>
                    <li>
                      <a
                        href={CLINIC_WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={contactLinkClass}
                      >
                        WhatsApp
                      </a>
                    </li>
                  </ul>
                  <p>Lub wypełnij krótki formularz poniżej.</p>
                </div>
              ) : null}
              <h3
                id={resolvedTitleId}
                className={cn(
                  'text-balance text-xl font-semibold leading-snug tracking-tight md:text-2xl',
                  isDrawer ? 'text-white' : 'text-prive-plum',
                )}
              >
                {step === 1 && 'W czym możemy Ci pomóc? Wybierz obszar.'}
                {step === 2 && 'Opowiedz nam o swoim problemie.'}
                {step === 3 && 'Gdzie mamy wysłać Twoją darmową konsultację?'}
              </h3>
            </header>

            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {TREATMENT_OPTIONS.map((option, index) => {
                    const selected = treatment === option.id;
                    return (
                      <button
                        key={option.id}
                        ref={index === 0 ? firstTileRef : undefined}
                        type="button"
                        onClick={() => selectTreatmentAndAdvance(option.id)}
                        className={cn(
                          'group flex min-h-[5.5rem] items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300',
                          isDrawer
                            ? 'border-white/[0.08] bg-white/[0.03] hover:border-prive-rose/45'
                            : 'border-prive-border bg-prive-white hover:border-prive-rose/45 hover:shadow-prive-card',
                          selected &&
                            'border-prive-rose bg-prive-rose/10 shadow-[0_0_0_1px_rgba(229,0,126,0.35),0_8px_24px_rgba(229,0,126,0.12)]',
                        )}
                        aria-pressed={selected}
                      >
                        <img
                          src={option.image}
                          alt=""
                          className="size-14 shrink-0 rounded-xl object-cover"
                        />
                        <span
                          className={cn(
                            'text-[0.92rem] font-semibold leading-snug',
                            isDrawer ? 'text-white' : 'text-prive-text',
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-7">
                {treatment === HAIR_TRANSPLANT_ID ? (
                  <div className="space-y-3">
                    <p className={labelClass}>Wybierz stopień łysienia (Skala Norwooda)</p>
                    <NorwoodScalePicker
                      value={norwoodLevel}
                      onChange={setNorwoodLevel}
                      variant={mode}
                    />
                    {fieldErrors.norwood ? (
                      <p className="text-xs text-red-400">{fieldErrors.norwood}</p>
                    ) : null}
                  </div>
                ) : showTextarea ? (
                  <div className="space-y-2">
                    <label htmlFor={`${idPrefix}-description`} className={labelClass}>
                      Opis oczekiwanego efektu
                    </label>
                    <textarea
                      ref={descriptionRef}
                      id={`${idPrefix}-description`}
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
                      placeholder="Opisz krótko efekt, jaki chcesz osiągnąć (np. zagęszczenie ubytków, pełna broda)."
                      className={cn(
                        ghostField,
                        'min-h-[120px] resize-y',
                        !isDrawer && 'rounded-xl border px-4 py-3',
                        fieldErrors.description && 'border-red-400',
                      )}
                    />
                    {fieldErrors.description ? (
                      <p className="text-xs text-red-400">{fieldErrors.description}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="space-y-3">
                  <p className={labelClass}>
                    Dołącz zdjęcia (opcjonalne, ale zalecane dla dokładniejszej wyceny)
                  </p>
                  <PhotoUpload files={photos} onChange={setPhotos} variant={mode} />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
                  <button
                    type="button"
                    className={secondaryBtnClass}
                    onClick={() => {
                      setDirection(-1);
                      setStep(1);
                    }}
                  >
                    Wstecz
                  </button>
                  <button
                    type="button"
                    className={primaryBtnClass}
                    onClick={() => {
                      if (!validateStep2()) return;
                      setDirection(1);
                      setStep(3);
                    }}
                  >
                    Dalej
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form className="space-y-7" onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  name="fax"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                  className="pointer-events-none absolute left-0 top-0 -z-10 h-px w-px opacity-0"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />

                <div className="space-y-2">
                  <label htmlFor={`${idPrefix}-name`} className={labelClass}>
                    Imię
                  </label>
                  <input
                    ref={nameRef}
                    id={`${idPrefix}-name`}
                    type="text"
                    autoComplete="given-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
                    className={cn(ghostField, fieldErrors.name && 'border-red-400')}
                  />
                  {fieldErrors.name ? (
                    <p className="text-xs text-red-400">{fieldErrors.name}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor={`${idPrefix}-phone`} className={labelClass}>
                    Numer telefonu
                  </label>
                  <ConsultationPhoneInput
                    id={`${idPrefix}-phone`}
                    value={phone}
                    onChange={setPhone}
                    onFocus={() => nameRef.current && scrollFieldIntoView(nameRef.current)}
                    hasError={!!fieldErrors.phone}
                    variant={mode}
                  />
                  {fieldErrors.phone ? (
                    <p className="text-xs text-red-400">{fieldErrors.phone}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor={`${idPrefix}-email`} className={labelClass}>
                    E-mail (opcjonalnie)
                  </label>
                  <input
                    id={`${idPrefix}-email`}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
                    className={cn(ghostField, fieldErrors.email && 'border-red-400')}
                  />
                  {fieldErrors.email ? (
                    <p className="text-xs text-red-400">{fieldErrors.email}</p>
                  ) : null}
                </div>

                <label className="flex items-start gap-3 text-left">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 size-4 shrink-0 accent-prive-rose"
                  />
                  <span
                    className={cn(
                      'text-xs leading-relaxed',
                      isDrawer ? 'text-white/65' : 'text-prive-text-muted',
                    )}
                  >
                    Akceptuję{' '}
                    <Link href="/polityka-prywatnosci" className="text-prive-rose underline-offset-2 hover:underline">
                      politykę prywatności
                    </Link>{' '}
                    i wyrażam zgodę na kontakt w sprawie konsultacji (RODO).
                  </span>
                </label>
                {fieldErrors.privacy ? (
                  <p className="text-xs text-red-400">{fieldErrors.privacy}</p>
                ) : null}

                {submitError ? (
                  <p className="text-sm text-red-400" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
                  <button
                    type="button"
                    className={secondaryBtnClass}
                    onClick={() => {
                      setDirection(-1);
                      setStep(2);
                    }}
                  >
                    Wstecz
                  </button>
                  <button type="submit" disabled={isSubmitting} className={primaryBtnClass}>
                    {isSubmitting ? 'Wysyłanie…' : 'Wyślij zgłoszenie'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
