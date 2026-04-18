'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export interface HeroSectionProps {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  guestName?: string;
  tagline?: string;
  onScrollDown?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// ---------------------------------------------------------------------------
// Corner bracket — luxury stationery-style frame element
// ---------------------------------------------------------------------------
function CornerBracket() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
      <path d="M38 1 L1 1 L1 38" stroke="currentColor" strokeWidth="0.65" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// OrnamentSVG — symmetric scroll/diamond motif
// ---------------------------------------------------------------------------
function OrnamentSVG() {
  return (
    <svg viewBox="0 0 120 36" width="100" height="30" fill="none" aria-hidden="true">
      <path d="M60 10 L67 18 L60 26 L53 18 Z" fill="currentColor" />
      <path d="M53 18 C42 18 32 11 20 15 C12 18 6 22 4 18" stroke="currentColor" strokeWidth="0.65" />
      <path d="M67 18 C78 18 88 11 100 15 C108 18 114 22 116 18" stroke="currentColor" strokeWidth="0.65" />
      <path d="M28 14 L31 18 L28 22 L25 18 Z" fill="currentColor" opacity={0.5} />
      <path d="M92 14 L95 18 L92 22 L89 18 Z" fill="currentColor" opacity={0.5} />
      <circle cx="4" cy="18" r="1.75" fill="currentColor" />
      <circle cx="116" cy="18" r="1.75" fill="currentColor" />
      <circle cx="14" cy="17" r="0.9" fill="currentColor" opacity={0.4} />
      <circle cx="106" cy="17" r="0.9" fill="currentColor" opacity={0.4} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Noise texture
// ---------------------------------------------------------------------------
const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
export function HeroSection({
  brideName,
  groomName,
  date,
  venue,
  guestName,
  tagline,
  onScrollDown,
}: HeroSectionProps) {
  const { scrollY } = useScroll();
  const ornamentTopY    = useTransform(scrollY, [0, 500], [0, -28]);
  const ornamentBottomY = useTransform(scrollY, [0, 500], [0,  28]);
  const scrollHintOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  const baseDelay = guestName ? 0.9 : 0.3;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FAF7F2 0%, #F4EDE1 100%)' }}
    >
      {/* Grain texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.032]"
        style={{ backgroundImage: NOISE_BG, backgroundSize: '200px 200px' }}
      />

      {/* Edge vignette — draws eye to center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 45%, rgba(0,0,0,0.035) 100%)',
        }}
      />

      {/* Thin inner border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-gold-300/20 sm:inset-6"
      />

      {/* Corner brackets — the premium frame detail */}
      {[
        'absolute top-3 left-3 sm:top-6 sm:left-6',
        'absolute top-3 right-3 rotate-90 sm:top-6 sm:right-6',
        'absolute bottom-3 right-3 rotate-180 sm:bottom-6 sm:right-6',
        'absolute bottom-3 left-3 -rotate-90 sm:bottom-6 sm:left-6',
      ].map((cls, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className={`pointer-events-none text-gold-400/40 ${cls}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.1 + i * 0.08, ease: EASE }}
        >
          <CornerBracket />
        </motion.div>
      ))}

      {/* Top ornament (parallax) */}
      <div className="absolute top-10 left-1/2" style={{ transform: 'translateX(-50%)' }}>
        <motion.div
          className="text-gold-300/70"
          style={{ y: ornamentTopY, willChange: 'transform' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <OrnamentSVG />
        </motion.div>
      </div>

      {/* Bottom ornament (parallax, rotated) */}
      <div className="absolute bottom-10 left-1/2" style={{ transform: 'translateX(-50%)' }}>
        <motion.div
          className="rotate-180 text-gold-300/70"
          style={{ y: ornamentBottomY, willChange: 'transform' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <OrnamentSVG />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center sm:px-10">

        {/* Personal greeting */}
        {guestName && (
          <motion.p
            className="font-sans text-[11px] uppercase tracking-[5px] text-gold-500"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Dear {guestName}
          </motion.p>
        )}

        {/* Tagline */}
        <motion.p
          className="font-sans text-[10px] uppercase tracking-[7px] text-warmgray/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: guestName ? 0.3 : 0, ease: EASE }}
        >
          {tagline ?? 'Together with their families'}
        </motion.p>

        {/* Names */}
        <div className="mt-2 flex flex-col items-center gap-0">
          <motion.h1
            className="font-serif font-light leading-[0.95] text-charcoal"
            style={{ fontSize: 'clamp(2.25rem, 10vw, 6.5rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: baseDelay, ease: EASE }}
          >
            {brideName}
          </motion.h1>

          <motion.span
            className="font-serif font-light italic text-gold-400"
            style={{ fontSize: 'clamp(1.4rem, 4.5vw, 3.25rem)', lineHeight: 1.3 }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: baseDelay + 0.2, ease: EASE }}
          >
            &amp;
          </motion.span>

          <motion.h1
            className="font-serif font-light leading-[0.95] text-charcoal"
            style={{ fontSize: 'clamp(2.25rem, 10vw, 6.5rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: baseDelay + 0.4, ease: EASE }}
          >
            {groomName}
          </motion.h1>
        </div>

        {/* Ornamental separator — ── ◆ ── */}
        <motion.div
          className="mt-3 flex items-center gap-3.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: baseDelay + 0.65, ease: EASE }}
        >
          <motion.div
            className="h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.55))' }}
            initial={{ width: 0 }}
            animate={{ width: 44 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.7, ease: EASE }}
          />
          <motion.div
            className="h-[5px] w-[5px] rotate-45 bg-gold-400"
            style={{ opacity: 0.75 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: baseDelay + 0.85, ease: EASE }}
          />
          <motion.div
            className="h-px"
            style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.55))' }}
            initial={{ width: 0 }}
            animate={{ width: 44 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.7, ease: EASE }}
          />
        </motion.div>

        {/* Date */}
        <motion.p
          className="font-sans text-[12px] uppercase tracking-[6px] text-warmgray"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: baseDelay + 0.9, ease: EASE }}
        >
          {date}
        </motion.p>

        {/* Venue */}
        <motion.p
          className="font-sans text-[11px] uppercase tracking-[2.5px] text-warmgray/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: baseDelay + 1.05, ease: EASE }}
        >
          {venue}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden={!onScrollDown}
        className="absolute bottom-8 left-1/2 sm:bottom-10"
        style={{ transform: 'translateX(-50%)', cursor: onScrollDown ? 'pointer' : 'default' }}
        onClick={onScrollDown}
        role={onScrollDown ? 'button' : undefined}
        tabIndex={onScrollDown ? 0 : undefined}
        onKeyDown={onScrollDown ? (e) => e.key === 'Enter' && onScrollDown() : undefined}
        whileTap={onScrollDown ? { scale: 0.97 } : {}}
      >
        <motion.div style={{ opacity: scrollHintOpacity }}>
          <motion.div
            className="flex flex-col items-center gap-2 text-warmgray/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 1.4, ease: EASE }}
          >
            {/* Thin vertical line that pulses down */}
            <motion.div
              className="w-px bg-gradient-to-b from-gold-400/60 to-transparent"
              animate={{ height: [16, 28, 16] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ willChange: 'transform' }}
            />
            <p className="whitespace-nowrap font-sans text-[9px] uppercase tracking-[4px]">
              Scroll to explore
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
