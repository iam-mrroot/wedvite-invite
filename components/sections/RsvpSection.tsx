'use client';

import { useState, useRef } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { submitRsvp } from '@/lib/api';

interface EventItem {
  id: string;
  name: string;
  date: string;
  start_time: string;
}

export interface RsvpSectionProps {
  events: EventItem[];
  linkType: 'CATEGORY_LINK' | 'PERSONAL_LINK' | 'UNIVERSAL_LINK';
  categoryId?: string;
  guestId?: string;
  guestName?: string;
  weddingSlug: string;
}

const DIETARY_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Jain', 'No Onion/Garlic', 'Other'] as const;
type DietaryOption = (typeof DIETARY_OPTIONS)[number];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// OrnamentSVG — shared decorative motif, sized for the dark section
// ---------------------------------------------------------------------------
function OrnamentSVG() {
  return (
    <svg
      viewBox="0 0 120 36"
      width="80"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M60 10 L67 18 L60 26 L53 18 Z" fill="currentColor" />
      <path d="M53 18 C42 18 32 11 20 15 C12 18 6 22 4 18" stroke="currentColor" strokeWidth="0.75" />
      <path d="M67 18 C78 18 88 11 100 15 C108 18 114 22 116 18" stroke="currentColor" strokeWidth="0.75" />
      <path d="M28 14 L31 18 L28 22 L25 18 Z" fill="currentColor" opacity={0.6} />
      <path d="M92 14 L95 18 L92 22 L89 18 Z" fill="currentColor" opacity={0.6} />
      <circle cx="4" cy="18" r="2" fill="currentColor" />
      <circle cx="116" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AnimatedCheckmark — SVG stroke draw on mount
// ---------------------------------------------------------------------------
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-400"
    >
      <svg
        viewBox="0 0 40 40"
        width="36"
        height="36"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <motion.path
          d="M8 20 L17 29 L32 12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
        />
      </svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// WhatsApp icon
// ---------------------------------------------------------------------------
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.005 2.232A9.769 9.769 0 0 0 2.23 12a9.8 9.8 0 0 0 1.512 5.26L2 22.002l4.89-1.726A9.77 9.77 0 0 0 12.005 22 9.769 9.769 0 0 0 21.78 12a9.769 9.769 0 0 0-9.775-9.768zm0 17.87a8.12 8.12 0 0 1-4.14-1.134l-.297-.177-3.073.803.818-2.985-.194-.306A8.086 8.086 0 0 1 3.884 12c0-4.48 3.641-8.12 8.12-8.12 4.481 0 8.121 3.64 8.121 8.12 0 4.481-3.64 8.121-8.12 8.121z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// GoldCheckbox — custom styled checkbox
// ---------------------------------------------------------------------------
function GoldCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="flex min-h-[44px] items-center gap-2.5 py-2 text-left"
    >
      <motion.div
        animate={checked ? { scale: [1, 1.18, 0.92, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-200 ${
          checked ? 'border-gold-400 bg-gold-500/20' : 'border-gold-700'
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              viewBox="0 0 10 10"
              width="9"
              height="9"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <path d="M1.5 5 L4 7.5 L8.5 2" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="font-sans text-[13px] leading-snug text-cream/75">{label}</span>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Field stagger variants
// ---------------------------------------------------------------------------
const fieldVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

// ---------------------------------------------------------------------------
// Shared bottom-border input class builder
// ---------------------------------------------------------------------------
function inputClass(focused: boolean) {
  return `w-full rounded-md border bg-transparent px-4 py-3 min-h-[48px] font-sans text-[15px] text-cream outline-none transition-all duration-300 placeholder:text-warmgray/40 ${
    focused ? 'border-gold-400 bg-gold-400/10 shadow-[0_0_20px_rgba(201,168,76,0.2)]' : 'border-gold-800 hover:border-gold-600'
  }`;
}

function scrollToInput(el: HTMLElement) {
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---------------------------------------------------------------------------
// RsvpSection
// ---------------------------------------------------------------------------
export function RsvpSection({
  events,
  linkType,
  categoryId,
  guestId,
  guestName,
  weddingSlug,
}: RsvpSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const shakeControls = useAnimation();

  const isPersonalLink = linkType === 'PERSONAL_LINK';

  // Form values
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Record<string, boolean>>({});
  const [guestCounts, setGuestCounts] = useState<Record<string, number>>({});
  const [dietary, setDietary] = useState<DietaryOption | ''>('');
  const [dietaryNote, setDietaryNote] = useState('');
  const [needsTransport, setNeedsTransport] = useState(false);
  const [needsAccommodation, setNeedsAccommodation] = useState(false);
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validation & submission state
  const [nameError, setNameError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const displayName = isPersonalLink ? (guestName ?? '') : name;

  const toggleEvent = (id: string) => {
    setSelectedEvents((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) setGuestCounts((gc) => ({ ...gc, [id]: gc[id] ?? 1 }));
      return next;
    });
    if (eventsError) setEventsError(null);
  };

  const adjustGuests = (eventId: string, delta: number) => {
    setGuestCounts((prev) => ({
      ...prev,
      [eventId]: Math.max(1, Math.min(20, (prev[eventId] ?? 1) + delta)),
    }));
  };

  const validate = () => {
    let valid = true;
    if (!isPersonalLink && !name.trim()) {
      setNameError('Please enter your name');
      valid = false;
    }
    if (!Object.values(selectedEvents).some(Boolean)) {
      setEventsError('Please select at least one event');
      valid = false;
    }
    return valid;
  };

  const triggerShake = () => {
    shakeControls.start({
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.5 },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      triggerShake();
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const res = await submitRsvp(weddingSlug, {
      name: displayName.trim(),
      phone: phone.trim() || undefined,
      events: Object.entries(selectedEvents)
        .filter(([, v]) => v)
        .map(([id]) => ({ event_id: id, guest_count: guestCounts[id] ?? 1 })),
      dietary_preference: dietary || undefined,
      dietary_note: dietary === 'Other' ? dietaryNote : undefined,
      needs_transport: needsTransport,
      needs_accommodation: needsAccommodation,
      message: message.trim() || undefined,
      link_type: linkType,
      category_id: categoryId,
      guest_id: guestId,
    });

    setIsSubmitting(false);
    if (res?.ok) {
      setIsSubmitted(true);
    } else {
      setSubmitError('Something went wrong. Please try again.');
      triggerShake();
    }
  };

  const selectedEventNames = events
    .filter((e) => selectedEvents[e.id])
    .map((e) => e.name)
    .join(', ');

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${weddingSlug}`
      : `/${weddingSlug}`;
  const shareText = `You're invited to celebrate with us! View the invitation: ${shareUrl}`;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-[80px] md:py-[120px]"
      style={{ background: '#1C1C1C' }}
    >
      {/* Top gold gradient border */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto max-w-[560px] px-6"
      >
        {/* ── Section header ───────────────────────────────────────────────── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2
            className="font-serif font-light text-cream"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)' }}
          >
            RSVP
          </h2>
          <p
            className="mt-2 font-sans text-[14px] text-gold-300"
            style={{ letterSpacing: '2px' }}
          >
            We&apos;d be honored by your presence
          </p>
          <div className="mt-5 text-gold-400">
            <OrnamentSVG />
          </div>
        </div>

        {/* ── Form / Success ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            /* ── Success state ─────────────────────────────────────────────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex flex-col items-center gap-5 py-8 text-center"
            >
              <AnimatedCheckmark />

              <h3
                className="font-serif font-light text-cream"
                style={{ fontSize: '2rem' }}
              >
                Thank You, {displayName || 'Dear Guest'}!
              </h3>
              <p className="font-sans text-[14px] text-gold-300">
                We can&apos;t wait to celebrate with you
              </p>
              {selectedEventNames && (
                <p className="font-sans text-[13px] text-warmgray">
                  You&apos;re joining us for: {selectedEventNames}
                </p>
              )}

              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2.5 rounded-full px-6 py-3 font-sans text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: '#25D366', letterSpacing: '0.5px' }}
              >
                <WhatsAppIcon />
                Share this invitation
              </a>
            </motion.div>
          ) : (
            /* ── Form ──────────────────────────────────────────────────────── */
            <motion.form
              key="form"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              noValidate
            >
              <motion.div animate={shakeControls} className="flex flex-col gap-8">

                {/* 1 ── Name ─────────────────────────────────────────────── */}
                <motion.div
                  custom={0}
                  variants={fieldVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  {isPersonalLink ? (
                    <p className="font-sans text-[16px] italic text-gold-300">
                      Dear {guestName}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="rsvp-name"
                        className="font-sans text-[12px] uppercase text-gold-300/70"
                        style={{ letterSpacing: '2px' }}
                      >
                        Your Name
                      </label>
                        <input
                          id="rsvp-name"
                          type="text"
                          value={name}
                          autoComplete="name"
                          onChange={(e) => {
                            setName(e.target.value);
                            if (nameError) setNameError(null);
                          }}
                          onFocus={(e) => {
                            setFocusedField('name');
                            scrollToInput(e.currentTarget);
                          }}
                          onBlur={() => {
                            setFocusedField(null);
                            if (!name.trim()) setNameError('Please enter your name');
                          }}
                          className={inputClass(focusedField === 'name')}
                        />
                      {nameError && (
                        <p className="font-sans text-[12px]" style={{ color: '#C0392B' }}>
                          {nameError}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* 2 ── Phone ────────────────────────────────────────────── */}
                <motion.div
                  custom={1}
                  variants={fieldVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="flex flex-col gap-1.5"
                >
                  <label
                    htmlFor="rsvp-phone"
                    className="font-sans text-[12px] uppercase text-gold-300/70"
                    style={{ letterSpacing: '2px' }}
                  >
                    Phone Number
                  </label>
                  <input
                    id="rsvp-phone"
                    type="tel"
                    value={phone}
                    autoComplete="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={(e) => {
                      setFocusedField('phone');
                      scrollToInput(e.currentTarget);
                    }}
                    onBlur={() => setFocusedField(null)}
                    className={inputClass(focusedField === 'phone')}
                  />
                </motion.div>

                {/* 3 ── Event selection ───────────────────────────────────── */}
                <motion.div
                  custom={2}
                  variants={fieldVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="flex flex-col gap-3"
                >
                  <label
                    className="font-sans text-[12px] uppercase text-gold-300/70"
                    style={{ letterSpacing: '2px' }}
                  >
                    Which celebrations will you join?
                  </label>

                  <div className="flex flex-col gap-2">
                    {events.map((event) => {
                      const sel = !!selectedEvents[event.id];
                      return (
                        <div key={event.id}>
                          <motion.button
                            type="button"
                            onClick={() => toggleEvent(event.id)}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            className={`flex min-h-[52px] w-full items-center justify-between rounded-[3px] border px-4 py-3 text-left transition-all duration-300 ${
                              sel
                                ? 'border-gold-400 bg-gold-500/20'
                                : 'border-gold-700 hover:border-gold-500'
                            }`}
                          >
                            <div>
                              <p className="font-sans text-[14px] text-cream">{event.name}</p>
                              <p className="font-sans text-[11px] text-gold-300/50">
                                {event.date}
                                {event.start_time ? ` · ${event.start_time}` : ''}
                              </p>
                            </div>
                            <motion.div
                              animate={sel ? { scale: [1, 1.2, 0.9, 1] } : { scale: 1 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                sel ? 'border-gold-400 bg-gold-400' : 'border-gold-700'
                              }`}
                            >
                              <AnimatePresence>
                                {sel && (
                                  <motion.svg
                                    key="check"
                                    viewBox="0 0 10 10"
                                    width="8"
                                    height="8"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                  >
                                    <path d="M1.5 5 L4 7.5 L8.5 2" />
                                  </motion.svg>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </motion.button>

                          {/* Guest count stepper */}
                          <AnimatePresence>
                            {sel && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="overflow-hidden"
                              >
                                <div className="flex items-center gap-3 px-4 pb-2 pt-3">
                                  <span className="font-sans text-[12px] text-gold-300/60">
                                    Number of guests:
                                  </span>
                                  <div className="flex items-center gap-2.5">
                                    <motion.button
                                      type="button"
                                      onClick={() => adjustGuests(event.id, -1)}
                                      aria-label="Decrease guest count"
                                      whileTap={{ scale: 0.9 }}
                                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-700 text-gold-400 transition-colors hover:border-gold-400"
                                    >
                                      <span className="text-[16px] leading-none">−</span>
                                    </motion.button>
                                    <span className="w-5 text-center font-sans text-[14px] text-cream">
                                      {guestCounts[event.id] ?? 1}
                                    </span>
                                    <motion.button
                                      type="button"
                                      onClick={() => adjustGuests(event.id, 1)}
                                      aria-label="Increase guest count"
                                      whileTap={{ scale: 0.9 }}
                                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-700 text-gold-400 transition-colors hover:border-gold-400"
                                    >
                                      <span className="text-[16px] leading-none">+</span>
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {eventsError && (
                    <p className="font-sans text-[12px]" style={{ color: '#C0392B' }}>
                      {eventsError}
                    </p>
                  )}
                </motion.div>

                {/* 4 ── Dietary preference ────────────────────────────────── */}
                <motion.div
                  custom={3}
                  variants={fieldVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="flex flex-col gap-3"
                >
                  <label
                    className="font-sans text-[12px] uppercase text-gold-300/70"
                    style={{ letterSpacing: '2px' }}
                  >
                    Dietary Preference
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt}
                        type="button"
                        onClick={() => setDietary((p) => (p === opt ? '' : opt))}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        className={`min-h-[44px] rounded-[3px] border px-3 py-2 font-sans text-[13px] transition-all duration-300 ${
                          dietary === opt
                            ? 'border-gold-400 bg-gold-500/20 text-cream'
                            : 'border-gold-700 text-cream/65 hover:border-gold-500 hover:text-cream/85'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {dietary === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          value={dietaryNote}
                          onChange={(e) => setDietaryNote(e.target.value)}
                          placeholder="Please specify..."
                          onFocus={(e) => {
                            setFocusedField('dietaryNote');
                            scrollToInput(e.currentTarget);
                          }}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputClass(focusedField === 'dietaryNote')} text-[14px] pt-1`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* 5 ── Transport & Accommodation ─────────────────────────── */}
                <motion.div
                  custom={4}
                  variants={fieldVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="flex flex-col gap-3 sm:flex-row sm:gap-10"
                >
                  <GoldCheckbox
                    checked={needsTransport}
                    onChange={setNeedsTransport}
                    label="I need transport assistance"
                  />
                  <GoldCheckbox
                    checked={needsAccommodation}
                    onChange={setNeedsAccommodation}
                    label="I need accommodation"
                  />
                </motion.div>

                {/* 6 ── Personal message ──────────────────────────────────── */}
                <motion.div
                  custom={5}
                  variants={fieldVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="flex flex-col gap-1.5"
                >
                  <label
                    htmlFor="rsvp-message"
                    className="font-sans text-[12px] uppercase text-gold-300/70"
                    style={{ letterSpacing: '2px' }}
                  >
                    A message for the couple (optional)
                  </label>
                  <div className="relative">
                    <textarea
                      id="rsvp-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                      onFocus={(e) => {
                        setFocusedField('message');
                        scrollToInput(e.currentTarget);
                      }}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClass(focusedField === 'message')} resize-none text-[14px]`}
                    />
                    <span className="absolute bottom-3 right-0 font-sans text-[11px] text-warmgray/40">
                      {message.length}/500
                    </span>
                  </div>
                </motion.div>

                {/* Submit button ─────────────────────────────────────────── */}
                <motion.div
                  custom={6}
                  variants={fieldVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="flex flex-col gap-3"
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 0 35px rgba(201,168,76,0.4)', backgroundColor: '#D4B86A' } : {}}
                    whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className={`relative w-full overflow-hidden rounded-full py-4 font-sans text-[13px] uppercase text-charcoal disabled:cursor-not-allowed ${
                      isSubmitting ? 'animate-pulse' : ''
                    }`}
                    style={{ backgroundColor: '#C9A84C', letterSpacing: '3.5px' }}
                  >
                    {/* Subtle shimmer on idle */}
                    {!isSubmitting && (
                      <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
                          backgroundSize: '200% 100%',
                        }}
                        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                      />
                    )}
                    <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Confirm'}</span>
                  </motion.button>

                  {submitError && (
                    <p
                      className="text-center font-sans text-[12px]"
                      style={{ color: '#C0392B' }}
                    >
                      {submitError}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
