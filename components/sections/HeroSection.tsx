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

const IVORY = '#F2E8D4';
const GOLD  = '#C9A84C';
const BG    = '#141210';

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ── Corner bracket with terminal dot ────────────────────────────────────────
function CornerBracket() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path d="M43 1.5 L1.5 1.5 L1.5 43" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="1.5" cy="1.5" r="2" fill="currentColor" />
    </svg>
  );
}

// ── Arch motif above names ───────────────────────────────────────────────────
function TopArch() {
  return (
    <svg viewBox="0 0 200 58" width="170" height="49" fill="none" aria-hidden="true">
      <path d="M18 54 C18 54 48 22 100 7 C152 22 182 54 182 54"
        stroke={GOLD} strokeWidth="0.6" strokeLinecap="round" opacity={0.38} />
      <path d="M36 54 C36 54 62 28 100 16 C138 28 164 54 164 54"
        stroke={GOLD} strokeWidth="0.4" strokeLinecap="round" opacity={0.18} />
      {/* Apex diamond */}
      <path d="M100 3 L104.5 9 L100 15 L95.5 9 Z" fill={GOLD} opacity={0.82} />
      <path d="M100 6 L102.5 9 L100 12 L97.5 9 Z" fill={GOLD} opacity={0.25} />
      {/* Side accent diamonds */}
      <path d="M58 38 L61 42 L58 46 L55 42 Z" fill={GOLD} opacity={0.32} />
      <path d="M142 38 L145 42 L142 46 L139 42 Z" fill={GOLD} opacity={0.32} />
      {/* End circles */}
      <circle cx="18" cy="54" r="2.2" fill={GOLD} opacity={0.35} />
      <circle cx="182" cy="54" r="2.2" fill={GOLD} opacity={0.35} />
      <circle cx="8"  cy="54" r="1.2" fill={GOLD} opacity={0.18} />
      <circle cx="192" cy="54" r="1.2" fill={GOLD} opacity={0.18} />
    </svg>
  );
}

// ── Central ornamental flourish ──────────────────────────────────────────────
function Flourish({ scale = 1 }: { scale?: number }) {
  const w = 280 * scale;
  const h = 44  * scale;
  return (
    <svg viewBox="0 0 280 44" width={w} height={h} fill="none" aria-hidden="true">
      {/* Large centre diamond */}
      <path d="M140 9 L149 22 L140 35 L131 22 Z" fill={GOLD} opacity={0.88} />
      <path d="M140 15 L145 22 L140 29 L135 22 Z" fill={GOLD} opacity={0.22} />

      {/* Flanking small diamonds */}
      <path d="M116 18 L121 22 L116 26 L111 22 Z" fill={GOLD} opacity={0.52} />
      <path d="M164 18 L169 22 L164 26 L159 22 Z" fill={GOLD} opacity={0.52} />

      {/* Connector dots between large and flanking */}
      <circle cx="128" cy="22" r="1.3" fill={GOLD} opacity={0.38} />
      <circle cx="152" cy="22" r="1.3" fill={GOLD} opacity={0.38} />

      {/* Left scroll arm */}
      <path d="M110 22 C96 22 80 14 62 17.5 C46 21 34 27 22 22"
        stroke={GOLD} strokeWidth="0.65" strokeLinecap="round" opacity={0.58} fill="none" />
      {/* Right scroll arm */}
      <path d="M170 22 C184 22 200 14 218 17.5 C234 21 246 27 258 22"
        stroke={GOLD} strokeWidth="0.65" strokeLinecap="round" opacity={0.58} fill="none" />

      {/* Mid-arm accent diamonds */}
      <path d="M80  16 L83.5 20 L80  24 L76.5 20 Z" fill={GOLD} opacity={0.38} />
      <path d="M200 16 L203.5 20 L200 24 L196.5 20 Z" fill={GOLD} opacity={0.38} />
      <path d="M50  19 L53  22 L50  25 L47  22 Z" fill={GOLD} opacity={0.25} />
      <path d="M230 19 L233 22 L230 25 L227 22 Z" fill={GOLD} opacity={0.25} />

      {/* Terminal dots */}
      <circle cx="22"  cy="22" r="2.6" fill={GOLD} opacity={0.52} />
      <circle cx="258" cy="22" r="2.6" fill={GOLD} opacity={0.52} />
      <circle cx="10"  cy="22" r="1.4" fill={GOLD} opacity={0.28} />
      <circle cx="270" cy="22" r="1.4" fill={GOLD} opacity={0.28} />
    </svg>
  );
}

// ── HeroSection ──────────────────────────────────────────────────────────────
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
  const archY             = useTransform(scrollY, [0, 500], [0, -30]);
  const bottomFlourishY   = useTransform(scrollY, [0, 500], [0,  30]);
  const contentY          = useTransform(scrollY, [0, 600], [0, -120]);
  const contentOpacity    = useTransform(scrollY, [0, 400], [1, 0]);
  const scrollHintOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Wait for the LoadingScreen envelope animation to resolve before showing hero content
  const MASTER_DELAY = 4.6;
  const baseDelay = MASTER_DELAY + (guestName ? 0.6 : 0);

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: BG }}
    >
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: NOISE, backgroundSize: '200px 200px', opacity: 0.06 }}
      />

      {/* Warm centre glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 72% 58% at 50% 48%, rgba(201,168,76,0.075) 0%, rgba(201,168,76,0.02) 45%, transparent 70%)',
        }}
      />

      {/* Outer gold frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 sm:inset-6"
        style={{ border: '1px solid rgba(201,168,76,0.18)' }}
      />
      {/* Inner double-rule */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] sm:inset-[38px]"
        style={{ border: '0.5px solid rgba(201,168,76,0.07)' }}
      />

      {/* Corner brackets */}
      {(
        [
          'absolute top-3 left-3 sm:top-6 sm:left-6',
          'absolute top-3 right-3 rotate-90 sm:top-6 sm:right-6',
          'absolute bottom-3 right-3 rotate-180 sm:bottom-6 sm:right-6',
          'absolute bottom-3 left-3 -rotate-90 sm:bottom-6 sm:left-6',
        ] as const
      ).map((cls, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className={`pointer-events-none ${cls}`}
          style={{ color: 'rgba(201,168,76,0.52)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: MASTER_DELAY + 0.05 + i * 0.1, ease: EASE }}
        >
          <CornerBracket />
        </motion.div>
      ))}

      {/* Top arch (parallax) */}
      <div className="absolute top-14 left-1/2 sm:top-20" style={{ transform: 'translateX(-50%)' }}>
        <motion.div
          style={{ y: archY }}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: MASTER_DELAY + 0.2, ease: EASE }}
        >
          <TopArch />
        </motion.div>
      </div>

      {/* Bottom flourish (parallax) */}
      <div className="absolute bottom-20 left-1/2 sm:bottom-24" style={{ transform: 'translateX(-50%)' }}>
        <motion.div
          style={{ y: bottomFlourishY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: MASTER_DELAY + 0.45, ease: EASE }}
        >
          <Flourish scale={0.78} />
        </motion.div>
      </div>

      {/* ── Content ── */}
      <motion.div 
        className="relative z-10 flex flex-col items-center px-8 text-center sm:px-14"
        style={{ y: contentY, opacity: contentOpacity }}
      >

        {/* Personal greeting */}
        {guestName && (
          <motion.p
            className="mb-5 font-sans text-[10px] uppercase"
            style={{ letterSpacing: '5.5px', color: GOLD }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Dear {guestName}
          </motion.p>
        )}

        {/* Tagline — flanked by hairlines */}
        <motion.div
          className="mb-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: guestName ? 0.3 : 0.15, ease: EASE }}
        >
          <div
            style={{
              width: 42,
              height: '0.5px',
              background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.52))',
            }}
          />
          <p
            className="font-sans text-[9px] uppercase"
            style={{
              letterSpacing: '4px',
              color: 'rgba(242,232,212,0.42)',
              whiteSpace: 'nowrap',
            }}
          >
            {tagline ?? 'Together with their families'}
          </p>
          <div
            style={{
              width: 42,
              height: '0.5px',
              background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.52))',
            }}
          />
        </motion.div>

        {/* ── Names ── */}
        <div className="flex flex-col items-center">
          {/* Bride */}
          <div className="relative overflow-hidden">
            <h1
              className="font-serif font-light text-center"
              style={{
                fontSize: 'clamp(3rem, 12vw, 7.5rem)',
                color: IVORY,
                letterSpacing: '0.03em',
                lineHeight: 1.0,
                perspective: '1200px'
              }}
            >
              {brideName.split('').map((char, i) => (
                char === ' ' ? <span key={`b-space-${i}`}>&nbsp;</span> :
                <motion.span
                  key={`b-${i}`}
                  initial={{ opacity: 0, y: 35, rotateX: -40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, delay: baseDelay + (i * 0.06), ease: EASE }}
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(108deg, transparent 28%, rgba(255,248,220,0.065) 50%, transparent 72%)',
              }}
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{ delay: baseDelay + 1.0, duration: 1.4, ease: 'easeInOut' }}
            />
          </div>

          {/* Ampersand */}
          <motion.div
            className="font-serif font-light italic"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 4rem)',
              color: GOLD,
              lineHeight: 1.3,
              marginTop: '0.06em',
              marginBottom: '0.06em',
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: baseDelay + 0.38, ease: EASE }}
          >
            &amp;
          </motion.div>

          {/* Groom */}
          <div className="relative overflow-hidden">
            <h1
              className="font-serif font-light text-center"
              style={{
                fontSize: 'clamp(3rem, 12vw, 7.5rem)',
                color: IVORY,
                letterSpacing: '0.03em',
                lineHeight: 1.0,
                perspective: '1200px'
              }}
            >
              {groomName.split('').map((char, i) => (
                char === ' ' ? <span key={`g-space-${i}`}>&nbsp;</span> :
                <motion.span
                  key={`g-${i}`}
                  initial={{ opacity: 0, y: 35, rotateX: -40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, delay: baseDelay + 0.56 + (i * 0.06), ease: EASE }}
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(108deg, transparent 28%, rgba(255,248,220,0.065) 50%, transparent 72%)',
              }}
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{ delay: baseDelay + 1.45, duration: 1.4, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Central flourish between names and date */}
        <motion.div
          className="mb-6 mt-8"
          initial={{ opacity: 0, scaleX: 0.45 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: baseDelay + 0.92, ease: EASE }}
        >
          <Flourish scale={0.92} />
        </motion.div>

        {/* Date */}
        <motion.p
          className="font-sans"
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '8px',
            color: GOLD,
            opacity: 0.92,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.92 }}
          transition={{ duration: 0.85, delay: baseDelay + 1.12, ease: EASE }}
        >
          {date}
        </motion.p>

        {/* Thin rule */}
        <motion.div
          className="my-3"
          style={{ height: '0.5px', background: 'rgba(201,168,76,0.28)' }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 30, opacity: 1 }}
          transition={{ duration: 0.7, delay: baseDelay + 1.28, ease: EASE }}
        />

        {/* Venue */}
        <motion.p
          className="font-sans"
          style={{
            fontSize: '9.5px',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: 'rgba(242,232,212,0.28)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.85, delay: baseDelay + 1.38, ease: EASE }}
        >
          {venue}
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden={!onScrollDown}
        className="absolute bottom-8 left-1/2 sm:bottom-10"
        style={{ transform: 'translateX(-50%)', cursor: onScrollDown ? 'pointer' : 'default' }}
        onClick={onScrollDown}
        role={onScrollDown ? 'button' : undefined}
        tabIndex={onScrollDown ? 0 : undefined}
        onKeyDown={
          onScrollDown ? (e) => e.key === 'Enter' && onScrollDown() : undefined
        }
        whileTap={onScrollDown ? { scale: 0.95 } : {}}
      >
        <motion.div style={{ opacity: scrollHintOpacity }}>
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: baseDelay + 1.75, ease: EASE }}
          >
            <motion.div
              style={{
                width: 1,
                background: 'linear-gradient(to bottom, rgba(201,168,76,0.72), transparent)',
              }}
              animate={{ height: [16, 30, 16] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p
              className="whitespace-nowrap font-sans"
              style={{
                fontSize: '8px',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                color: 'rgba(201,168,76,0.42)',
              }}
            >
              Scroll to explore
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
