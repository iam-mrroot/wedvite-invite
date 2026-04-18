'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ornament } from './Ornament';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SectionDividerProps {
  /** Show the thin gold lines extending from each side of the ornament */
  showLines?: boolean;
  className?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// SectionDivider
//
// Centered sm ornament with optional 80px gold-200 rules on each side.
// All elements share a single useInView trigger:
//   - Lines animate width 0 → 80px (0.7s)
//   - Ornament fades in 0.25s after lines begin (0→1 opacity, 0.6s)
// ---------------------------------------------------------------------------

export function SectionDivider({ showLines = true, className }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center ${className ?? ''}`}
    >
      {showLines && (
        <motion.div
          className="h-px flex-shrink-0 bg-gold-200"
          initial={{ width: 0 }}
          animate={inView ? { width: 80 } : { width: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      )}

      <motion.span
        className="mx-3 inline-flex flex-shrink-0 text-gold-300"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: showLines ? 0.25 : 0, ease: EASE }}
      >
        <Ornament size="sm" />
      </motion.span>

      {showLines && (
        <motion.div
          className="h-px flex-shrink-0 bg-gold-200"
          initial={{ width: 0 }}
          animate={inView ? { width: 80 } : { width: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      )}
    </div>
  );
}
