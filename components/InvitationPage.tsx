'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { trackClick } from '@/lib/api';
import type { Wedding, WeddingEvent } from '@/lib/api';
import { HeroSection } from '@/components/sections/HeroSection';
import { CountdownSection } from '@/components/sections/CountdownSection';
import { EventTimeline } from '@/components/sections/EventTimeline';
import { RsvpSection } from '@/components/sections/RsvpSection';
import { VenueSection } from '@/components/sections/VenueSection';
import { FooterSection } from '@/components/sections/FooterSection';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LinkType = 'UNIVERSAL_LINK' | 'CATEGORY_LINK' | 'PERSONAL_LINK';

export interface InvitationPageProps {
  wedding: Wedding;
  events: WeddingEvent[];
  linkType: LinkType;
  categoryId?: string;
  guestId?: string;
  guestName?: string;
  customGreeting?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Section background colours — used to build gradient dividers
const BG_CREAM    = '#FAF6F0';
const BG_WHITE    = '#FFFFFF';
const BG_CHARCOAL = '#1C1C1C';
const BG_HERO     = '#141210'; // hero dark background

// ---------------------------------------------------------------------------
// MiniOrnament — 40px version of the shared flourish
// ---------------------------------------------------------------------------

function MiniOrnament() {
  return (
    <svg
      viewBox="0 0 60 18"
      width="40"
      height="12"
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
// SectionDivider
// Gradient strip bridging two section backgrounds; ornament fades in on scroll.
// ---------------------------------------------------------------------------

function SectionDivider({ from, to }: { from: string; to: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  // Choose ornament colour that reads against the midpoint background.
  // If either side is charcoal, use a brighter gold; otherwise a soft gold.
  const isDark = from === BG_CHARCOAL || to === BG_CHARCOAL || from === BG_HERO || to === BG_HERO;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className="flex items-center justify-center"
      style={{
        height: '40px',
        background: `linear-gradient(to bottom, ${from}, ${to})`,
      }}
    >
      <span className={isDark ? 'text-gold-500' : 'text-gold-300'}>
        <MiniOrnament />
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// InvitationPage
// ---------------------------------------------------------------------------

export function InvitationPage({
  wedding,
  events,
  linkType,
  categoryId,
  guestId,
  guestName,
  customGreeting,
}: InvitationPageProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // ── Curtain opening ────────────────────────────────────────────────────
  // Page starts at 70% opacity, fades to full after 300 ms.
  // Hero section's own entrance animations begin at ~500 ms naturally
  // because HeroSection uses animate (not initial) delays of 0.3–0.9 s.
  const [curtainUp, setCurtainUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCurtainUp(true), 300);
    return () => clearTimeout(t);
  }, []);

  // ── Track click on mount (fire-and-forget) ─────────────────────────────
  useEffect(() => {
    trackClick({
      wedding_id: wedding.id,
      category_id: categoryId,
      guest_id: guestId,
      link_type: linkType,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — run once on mount

  // ── Smooth scroll to EventTimeline ────────────────────────────────────
  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Derive Hero props ──────────────────────────────────────────────────
  const primaryVenueName = events[0]?.venue_name ?? '';
  const tagline =
    customGreeting ??
    wedding.greeting_default ??
    'Together with their families';

  // ── Derive Footer props ────────────────────────────────────────────────
  const configJson = wedding.config_json ?? {};
  const hashtag =
    (configJson.hashtag as string | undefined) ??
    `#${wedding.bride_name.replace(/\s+/g, '')}Weds${wedding.groom_name.replace(/\s+/g, '')}`;
  const countdownTo = configJson.countdown_to as string | undefined;
  // Name of the first event (the ceremony) for the countdown label
  const ceremonyName = events[0]?.name;

  // shareUrl resolved client-side; safe to read inside the component body
  // because this is a 'use client' component — no SSR mismatch risk.
  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : '';
  const shareMessage = `Join us for the wedding of ${wedding.bride_name} & ${wedding.groom_name}!`;

  // ── Mapped events for RsvpSection (subset of fields it needs) ─────────
  const rsvpEvents = events.map((e) => ({
    id: e.id,
    name: e.name,
    date: e.date,
    start_time: e.start_time,
  }));

  return (
    <motion.main
      initial={{ opacity: 0.7 }}
      animate={{ opacity: curtainUp ? 1 : 0.7 }}
      transition={{ duration: 0.4, ease: EASE }}
    >

      {/* 1 ── Hero ───────────────────────────────────────────────────────── */}
      <HeroSection
        brideName={wedding.bride_name}
        groomName={wedding.groom_name}
        date={wedding.wedding_date}
        venue={primaryVenueName}
        guestName={guestName}
        tagline={tagline}
        onScrollDown={scrollToTimeline}
      />

      {/* Divider: hero dark → cream */}
      <SectionDivider from={BG_HERO} to={BG_CREAM} />

      {/* Countdown timer — only rendered while the ceremony is in the future */}
      {countdownTo && (
        <CountdownSection countdownTo={countdownTo} eventName={ceremonyName} />
      )}

      {/* Divider: cream → white */}
      <SectionDivider from={BG_CREAM} to={BG_WHITE} />

      {/* 2 ── Event Timeline ─────────────────────────────────────────────── */}
      <div ref={timelineRef}>
        <EventTimeline events={events} />
      </div>

      {/* Divider: white → charcoal */}
      <SectionDivider from={BG_WHITE} to={BG_CHARCOAL} />

      {/* 3 ── RSVP ───────────────────────────────────────────────────────── */}
      <RsvpSection
        events={rsvpEvents}
        linkType={linkType}
        categoryId={categoryId}
        guestId={guestId}
        guestName={guestName}
        weddingSlug={wedding.slug}
      />

      {/* Divider: charcoal → cream */}
      <SectionDivider from={BG_CHARCOAL} to={BG_CREAM} />

      {/* 4 ── Venue ──────────────────────────────────────────────────────── */}
      <VenueSection events={events} />

      {/* Divider: cream → charcoal */}
      <SectionDivider from={BG_CREAM} to={BG_CHARCOAL} />

      {/* 5 ── Footer ─────────────────────────────────────────────────────── */}
      <FooterSection
        hashtag={hashtag}
        shareMessage={shareMessage}
        shareUrl={shareUrl}
      />

    </motion.main>
  );
}
