'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LoadingScreenProps {
  monogram: string;
  tagline?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MIN_MS = 1800;

function CornerBracket() {
  return (
    <svg width="28" height="28" viewBox="0 0 38 38" fill="none" aria-hidden="true">
      <path d="M38 1 L1 1 L1 38" stroke="currentColor" strokeWidth="0.65" />
    </svg>
  );
}

export function LoadingScreen({ monogram, tagline }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), MIN_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #FAF7F2 0%, #F4EDE1 100%)' }}
          aria-hidden="true"
        >
          {/* Grain texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.032]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />

          {/* Inner border */}
          <div className="pointer-events-none absolute inset-3 border border-gold-300/20 sm:inset-6" />

          {/* Corner brackets */}
          {[
            'absolute top-3 left-3 sm:top-6 sm:left-6',
            'absolute top-3 right-3 rotate-90 sm:top-6 sm:right-6',
            'absolute bottom-3 right-3 rotate-180 sm:bottom-6 sm:right-6',
            'absolute bottom-3 left-3 -rotate-90 sm:bottom-6 sm:left-6',
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`pointer-events-none text-gold-400/35 ${cls}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.08, ease: EASE }}
            >
              <CornerBracket />
            </motion.div>
          ))}

          {/* Content */}
          <div className="flex flex-col items-center gap-4">
            {/* Monogram */}
            <motion.p
              className="select-none font-serif font-light text-charcoal"
              style={{ fontSize: 'clamp(2.75rem, 9vw, 4.5rem)', letterSpacing: '0.04em' }}
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {monogram}
            </motion.p>

            {/* Gold diamond accent */}
            <motion.div
              className="h-[5px] w-[5px] rotate-45 bg-gold-400"
              style={{ opacity: 0.6 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            />

            {/* Tagline */}
            {tagline && (
              <motion.p
                className="select-none font-sans text-[10px] uppercase tracking-[4px] text-warmgray/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              >
                {tagline}
              </motion.p>
            )}

            {/* Progress bar */}
            <div
              className="mt-4 overflow-hidden rounded-full"
              style={{ width: '100px', height: '1px', background: 'rgba(201,168,76,0.15)' }}
            >
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.4), rgba(201,168,76,0.9), rgba(201,168,76,0.4))' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: EASE }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
