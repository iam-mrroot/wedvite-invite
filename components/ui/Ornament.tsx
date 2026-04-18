'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OrnamentSize = 'sm' | 'md' | 'lg';

export interface OrnamentProps {
  size?: OrnamentSize;
  className?: string;
  animated?: boolean;
}

// ---------------------------------------------------------------------------
// Size map — viewBox is always 120×30; width/height scale it
// ---------------------------------------------------------------------------

const SIZE_MAP: Record<OrnamentSize, { width: number; height: number }> = {
  sm: { width: 60,  height: 15 },
  md: { width: 120, height: 30 },
  lg: { width: 180, height: 45 },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// OrnamentSVG
//
// Victorian-style symmetric scroll ornament. viewBox 120×30, all geometry
// is perfectly mirrored about x = 60. Uses currentColor throughout so
// callers control the gold shade via a text-color utility.
//
// Structure (left side, mirrored right):
//   end curl  ──  terminal dot  ──  outer arm curve  ──
//   mid diamond  ──  inner arm curve  ──  center diamond
// ---------------------------------------------------------------------------

function OrnamentSVG({ width, height }: { width: number; height: number }) {
  return (
    <svg
      viewBox="0 0 120 30"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ── Center diamond motif ─────────────────────────────────────────── */}

      {/* Outer diamond — thin outline only */}
      <path
        d="M60 7 L67 15 L60 23 L53 15 Z"
        stroke="currentColor"
        strokeWidth="0.65"
      />

      {/* Middle ring — semi-transparent fill for depth */}
      <path
        d="M60 10.5 L64 15 L60 19.5 L56 15 Z"
        fill="currentColor"
        opacity={0.14}
      />

      {/* Core diamond — solid, gives visual weight to center */}
      <path
        d="M60 12.5 L63 15 L60 17.5 L57 15 Z"
        fill="currentColor"
      />

      {/* Hairline serifs at the four cardinal tips */}
      <line x1="60" y1="7"  x2="58.5" y2="5.5"  stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" />
      <line x1="60" y1="7"  x2="61.5" y2="5.5"  stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" />
      <line x1="60" y1="23" x2="58.5" y2="24.5" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" />
      <line x1="60" y1="23" x2="61.5" y2="24.5" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" />

      {/* ── Left arm — inner segment ─────────────────────────────────────── */}
      {/*   Gentle upward arch from center diamond → left mid diamond        */}
      <path
        d="M53 15 C49 15 45 11.5 40 12.8 C36.5 13.7 33.5 15.8 30 15"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />

      {/* Left mid diamond */}
      <path
        d="M30 12.5 L33 15 L30 17.5 L27 15 Z"
        fill="currentColor"
        opacity={0.55}
      />

      {/* Left arm — outer segment: mid diamond → terminal */}
      <path
        d="M27 15 C23.5 15 20 12 16 13.2 C13 14 11 16 8.5 15"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />

      {/* Left terminal — solid dot */}
      <circle cx="8.5" cy="15" r="1.6" fill="currentColor" />

      {/* Left end curl — small elliptical scroll around the terminal */}
      <path
        d="M8.5 13.4 C6 10.5 3.5 11.5 3.5 14.5 C3.5 17.5 6 18.5 8.5 16.6"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
      />

      {/* Left subtle accent dot near arch peak */}
      <circle cx="44" cy="12.3" r="1" fill="currentColor" opacity={0.38} />

      {/* ── Right arm — exact horizontal mirror of left ───────────────────── */}

      {/* Right arm — inner segment */}
      <path
        d="M67 15 C71 15 75 11.5 80 12.8 C83.5 13.7 86.5 15.8 90 15"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />

      {/* Right mid diamond */}
      <path
        d="M90 12.5 L93 15 L90 17.5 L87 15 Z"
        fill="currentColor"
        opacity={0.55}
      />

      {/* Right arm — outer segment */}
      <path
        d="M93 15 C96.5 15 100 12 104 13.2 C107 14 109 16 111.5 15"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />

      {/* Right terminal */}
      <circle cx="111.5" cy="15" r="1.6" fill="currentColor" />

      {/* Right end curl */}
      <path
        d="M111.5 13.4 C114 10.5 116.5 11.5 116.5 14.5 C116.5 17.5 114 18.5 111.5 16.6"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
      />

      {/* Right accent dot */}
      <circle cx="76" cy="12.3" r="1" fill="currentColor" opacity={0.38} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Ornament (export)
// ---------------------------------------------------------------------------

export function Ornament({ size = 'md', className, animated = false }: OrnamentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { width, height } = SIZE_MAP[size];

  const svg = <OrnamentSVG width={width} height={height} />;

  if (!animated) {
    return <span className={className}>{svg}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ display: 'inline-flex' }}
    >
      {svg}
    </motion.span>
  );
}
