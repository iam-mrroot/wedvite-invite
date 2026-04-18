'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VenueEvent {
  venue_name: string;
  venue_address: string;
  venue_lat: number;
  venue_lng: number;
  maps_url?: string;
}

export interface VenueSectionProps {
  events: VenueEvent[];
}

interface Venue {
  name: string;
  address: string;
  lat: number;
  lng: number;
  maps_url?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deduplicateVenues(events: VenueEvent[]): Venue[] {
  return Array.from(
    new Map(
      events
        .filter((e) => e.venue_name)
        .map((e) => [
          e.venue_name,
          {
            name: e.venue_name,
            address: e.venue_address,
            lat: e.venue_lat,
            lng: e.venue_lng,
            maps_url: e.maps_url,
          },
        ]),
    ).values(),
  );
}

function mapsUrl(venue: Venue) {
  return venue.maps_url ?? `https://maps.google.com/?q=${encodeURIComponent(venue.name)}&ll=${venue.lat},${venue.lng}`;
}

// ---------------------------------------------------------------------------
// SmallOrnament — matches EventTimeline's 60px version
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
// MapPin — location marker icon
// ---------------------------------------------------------------------------

function MapPin() {
  return (
    <svg
      viewBox="0 0 24 32"
      width="32"
      height="42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Drop shadow blob */}
      <ellipse cx="12" cy="30" rx="5" ry="2" fill="#C9A84C" opacity="0.18" />
      {/* Pin body */}
      <path
        d="M12 1C7.029 1 3 5.029 3 10c0 6.627 9 21 9 21S21 16.627 21 10c0-4.971-4.029-9-9-9z"
        fill="#C9A84C"
        fillOpacity="0.15"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner circle */}
      <circle cx="12" cy="10" r="3.5" fill="#C9A84C" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ExternalArrow
// ---------------------------------------------------------------------------

function ExternalArrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 10 L10 2" />
      <path d="M4.5 2 L10 2 L10 7.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MapPlaceholder — decorative area standing in for the map embed
// ---------------------------------------------------------------------------

function MapPlaceholder({ venue }: { venue: Venue }) {
  const url = mapsUrl(venue);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${venue.name} in Google Maps`}
      className="group relative flex aspect-[16/7] w-full items-center justify-center overflow-hidden transition-opacity hover:opacity-90"
      style={{ background: 'linear-gradient(135deg, #FBF7EF 0%, #F5EBDA 100%)' }}
    >
      {/* Subtle concentric-ring topographic pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 18%, rgba(201,168,76,0.07) 18%, rgba(201,168,76,0.07) 36%,
              transparent 36%, transparent 54%, rgba(201,168,76,0.07) 54%, rgba(201,168,76,0.07) 72%, transparent 72%)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Pin + label */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        >
          <MapPin />
        </motion.div>
        <span
          className="flex items-center gap-1.5 rounded-full border border-gold-300 bg-white/80 px-3 py-1 font-sans text-[12px] text-gold-600 backdrop-blur-sm transition-colors group-hover:border-gold-400 group-hover:bg-white"
          style={{ letterSpacing: '0.5px' }}
        >
          Open in Google Maps
          <ExternalArrow />
        </span>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// VenueCard
// ---------------------------------------------------------------------------

function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const url = mapsUrl(venue);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: EASE }}
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(201,168,76,0.12), 0 5px 15px rgba(0,0,0,0.06)' }}
      className="overflow-hidden rounded-[10px] border border-white/60 bg-white/40 backdrop-blur-md"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.4)', willChange: 'transform' }}
    >
      <MapPlaceholder venue={venue} />

      {/* Gold gradient accent at top */}
      <div
        className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.65) 40%, rgba(201,168,76,0.65) 60%, transparent)' }}
      />

      {/* Card body */}
      <div className="px-6 py-5">
        <h3
          className="mb-1 font-serif font-light text-charcoal"
          style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)' }}
        >
          {venue.name}
        </h3>

        <p className="mb-5 font-sans text-[12px] leading-relaxed text-warmgray/70">
          {venue.address}
        </p>

        {/* Thin gradient divider */}
        <div
          className="mb-5 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.25), transparent)' }}
        />

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-gold-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[1.5px] text-gold-500 transition-all duration-200 hover:border-gold-400 hover:bg-gold-50 active:scale-[0.97]"
        >
          Get Directions
          <span className="transition-transform duration-150 group-hover:translate-x-0.5 text-[13px]">→</span>
        </a>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// VenueSection (main export)
// ---------------------------------------------------------------------------

export function VenueSection({ events }: VenueSectionProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });

  const venues = deduplicateVenues(events);

  if (venues.length === 0) return null;

  const isSingle = venues.length === 1;

  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-[120px]">
      
      {/* ── Ambient Background Orbs for Glassmorphism ── */}
      <div 
        className="pointer-events-none absolute left-[-10%] top-[10%] h-[40vh] w-[40vh] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }}
      />
      <div 
        className="pointer-events-none absolute right-[-5%] bottom-[10%] h-[50vh] w-[50vh] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)' }}
      />

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        className="mb-12 flex flex-col items-center gap-4 px-6 text-center sm:mb-16"
      >
        <motion.h2
          className="font-serif font-light text-charcoal"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Find Your Way
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
          {isSingle ? 'We look forward to welcoming you here' : 'All the places we\'ll be celebrating'}
        </motion.p>
      </div>

      {/* ── Venue cards ──────────────────────────────────────────────────── */}
      <div className="mx-auto px-6" style={{ maxWidth: isSingle ? '620px' : '1100px' }}>
        <div
          className={
            isSingle
              ? ''
              : 'grid grid-cols-1 gap-6 sm:grid-cols-2'
          }
        >
          {venues.map((venue, i) => (
            <VenueCard key={venue.name} venue={venue} index={i} />
          ))}
        </div>
      </div>

    </section>
  );
}
