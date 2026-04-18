'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;         // ISO: "2026-12-15"
  start_time: string;   // "HH:MM"
  end_time: string;     // "HH:MM"
  venue_name: string;
  venue_address: string;
  venue_lat: number;
  venue_lng: number;
  maps_url?: string;
}

export interface EventTimelineProps {
  events: WeddingEvent[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EASE = [0.22, 1, 0.36, 1] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  // Split manually to avoid timezone shifting
  const [y, mo, d] = iso.split('T')[0].split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  const mins = m === 0 ? '' : `:${String(m).padStart(2, '0')}`;
  return `${hour}${mins} ${ampm}`;
}

// ---------------------------------------------------------------------------
// SmallOrnament — 60px version of the hero flourish
// ---------------------------------------------------------------------------

function SmallOrnament() {
  return (
    <svg
      viewBox="0 0 60 18"
      width="60"
      height="18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M30 5 L33.5 9 L30 13 L26.5 9 Z" fill="currentColor" />
      <path
        d="M26.5 9 C21 9 15.5 5.5 10 7.5 C6 9 3 11 2 9"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <path
        d="M33.5 9 C39 9 44.5 5.5 50 7.5 C54 9 57 11 58 9"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <circle cx="2" cy="9" r="1.5" fill="currentColor" />
      <circle cx="58" cy="9" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TimelineDot — 8px solid center + 16px pulsing ring
// ---------------------------------------------------------------------------

function TimelineDot({ pulsing }: { pulsing: boolean }) {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center">
      {/* Ripple ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 18, height: 18, background: 'rgba(201,168,76,0.12)' }}
        animate={pulsing ? { scale: [1, 2.6], opacity: [0.8, 0] } : {}}
        transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.2 }}
      />
      {/* Outer ring */}
      <div
        className="relative z-10 flex h-[14px] w-[14px] items-center justify-center rounded-full border border-gold-300/60"
        style={{ background: '#FAF7F2' }}
      >
        {/* Inner filled dot */}
        <div className="h-[5px] w-[5px] rounded-full bg-gold-400" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EventRow — one event with dot + animated card
// ---------------------------------------------------------------------------

function EventRow({
  event,
  index: _index,
  isLeft,
  isMobile,
}: {
  event: WeddingEvent;
  index: number;
  isLeft: boolean;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  const cardInView = useInView(cardRef, { once: true, margin: '-100px' });
  const dotInView  = useInView(dotRef,  { once: true, margin: '-80px' });

  // Slide from the correct side; fall back to gentle left slide on mobile
  const xFrom = isMobile ? -24 : isLeft ? -48 : 48;

  const mapsUrl = event.maps_url ?? `https://maps.google.com/?q=${event.venue_lat},${event.venue_lng}`;

  return (
    <div className="relative pb-12 last:pb-0 sm:pb-16">
      {/* ── Dot ─────────────────────────────────────────────────────────── */}
      <div
        ref={dotRef}
        className="absolute left-5 top-8 z-10 -translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2"
      >
        <TimelineDot pulsing={dotInView} />
      </div>

      {/*
        ── Card positioning shell ──────────────────────────────────────────
        Mobile  : pl-14 pushes the card right of the 24px line
        Desktop : pr or pl of calc(50%+32px) confines card to its half,
                  leaving a 32px gap to the centre line
      */}
      <div
        className={
          'pl-11 sm:pl-0 ' +
          (isLeft ? 'sm:pr-[calc(50%+32px)]' : 'sm:pl-[calc(50%+32px)]')
        }
      >
        <div className={'max-w-[420px] ' + (isLeft ? 'sm:ml-auto' : '')} style={{ perspective: '1200px' }}>
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: xFrom, rotateY: isMobile ? 0 : isLeft ? 15 : -15, scale: 0.95 }}
            animate={cardInView ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            whileHover={{ y: -6, boxShadow: '0 15px 35px rgba(201,168,76,0.1), 0 5px 15px rgba(0,0,0,0.04)' }}
            className="overflow-hidden rounded-[8px] border border-gold-100/70 bg-white"
            style={{
              boxShadow: '0 4px 24px rgba(0,0,0,0.055), 0 1px 4px rgba(0,0,0,0.04)',
              willChange: 'transform',
            }}
          >
            {/* Gold gradient top accent */}
            <div
              className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.7) 40%, rgba(201,168,76,0.7) 60%, transparent)' }}
            />

            <div className="p-5 sm:p-7">
              {/* Date badge */}
              <p
                className="mb-3 inline-block font-sans text-gold-500"
                style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}
              >
                {formatDate(event.date)}
              </p>

              {/* Event name */}
              <h3
                className="mb-1 font-serif font-light text-charcoal"
                style={{ fontSize: 'clamp(1.35rem, 4vw, 1.65rem)', lineHeight: 1.2 }}
              >
                {event.name}
              </h3>

              {/* Time range */}
              <p className="mb-5 font-sans text-[13px] text-warmgray/70">
                {formatTime(event.start_time)}&thinsp;&mdash;&thinsp;{formatTime(event.end_time)}
              </p>

              {/* Thin divider */}
              <div
                className="mb-5 h-px"
                style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.25), transparent)' }}
              />

              {/* Venue name */}
              <p className="mb-1 font-sans text-[13px] font-medium text-charcoal">
                {event.venue_name}
              </p>

              {/* Venue address */}
              <p className="mb-5 line-clamp-2 font-sans text-[12px] leading-relaxed text-warmgray/60">
                {event.venue_address}
              </p>

              {/* Get Directions — pill button */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-gold-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[1.5px] text-gold-500 transition-all duration-200 hover:border-gold-400 hover:bg-gold-50 active:scale-[0.97]"
              >
                Get Directions
                <span className="transition-transform duration-150 group-hover:translate-x-0.5 text-[13px]">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EventTimeline (main export)
// ---------------------------------------------------------------------------

export function EventTimeline({ events }: EventTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });

  // Detect mobile to drive animation direction (client-only, safe post-hydration)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const sync = () => setIsMobile(window.innerWidth < 640);
    sync();
    window.addEventListener('resize', sync, { passive: true });
    return () => window.removeEventListener('resize', sync);
  }, []);

  // Timeline line draws progressively as the section scrolls into view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="relative bg-white py-20 sm:py-[120px]">

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        className="mb-16 flex flex-col items-center gap-4 px-6 text-center sm:mb-24"
      >
        <motion.h2
          className="font-serif font-light text-charcoal"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Celebration Timeline
        </motion.h2>

        <motion.div
          className="text-gold-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={headerInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          <SmallOrnament />
        </motion.div>

        <motion.p
          className="font-sans text-[14px] text-warmgray"
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          Join us across these joyous occasions
        </motion.p>
      </div>

      {/* ── Timeline body ────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">

        {/*
          Vertical line
          Mobile  : anchored at left-5 (20px) — inside the 16px section padding
          Desktop : anchored at left-1/2 (centre)
          originY: 0 → scaleY draws downward from the top
        */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 top-0 left-5 w-px bg-gold-200 sm:left-1/2"
          style={{ scaleY: lineScaleY, originY: 0, willChange: 'transform' }}
        />

        {events.map((event, i) => (
          <EventRow
            key={event.id}
            event={event}
            index={i}
            isLeft={i % 2 === 0}
            isMobile={isMobile}
          />
        ))}
      </div>

    </section>
  );
}
