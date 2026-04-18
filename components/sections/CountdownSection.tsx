'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export interface CountdownSectionProps {
  countdownTo: string;
  eventName?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000)  / 60_000);
  const seconds = Math.floor((diff % 60_000)     / 1_000);
  return { days, hours, minutes, seconds, passed: false };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ---------------------------------------------------------------------------
// NumberUnit — large serif numeral with thin underline and label
// No boxes — clean, editorial countdown aesthetic
// ---------------------------------------------------------------------------
function NumberUnit({ value, label }: { value: number | null; label: string }) {
  const display = value === null ? '--' : pad(value);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* The number */}
      <motion.span
        key={display}
        initial={{ opacity: 0.2, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="font-serif font-light tabular-nums text-cream"
        style={{ fontSize: 'clamp(2.75rem, 9vw, 5rem)', lineHeight: 1, letterSpacing: '-0.01em' }}
      >
        {display}
      </motion.span>

      {/* Thin gold underline */}
      <div
        className="w-full"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)',
          minWidth: '40px',
        }}
      />

      {/* Label */}
      <span
        className="font-sans text-gold-400/50"
        style={{ fontSize: '9px', letterSpacing: '3.5px', textTransform: 'uppercase' }}
      >
        {label}
      </span>
    </div>
  );
}

// Thin colon separator between units
function ColonSep() {
  return (
    <span
      className="font-serif font-light text-gold-500/20 self-start"
      style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1, marginTop: '0.1em' }}
    >
      :
    </span>
  );
}

// ---------------------------------------------------------------------------
// CountdownSection
// ---------------------------------------------------------------------------
export function CountdownSection({ countdownTo, eventName }: CountdownSectionProps) {
  const target = new Date(countdownTo);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calcTimeLeft(target));
    const id = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdownTo]);

  if (timeLeft?.passed) return null;

  return (
    <section
      className="relative py-16 sm:py-24"
      style={{ background: '#181818' }}
    >
      {/* Top gradient rule */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)' }}
      />
      {/* Bottom gradient rule */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)' }}
      />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        className="flex flex-col items-center gap-10 px-6 text-center"
      >

        {/* Section header */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="font-sans text-gold-400/50"
            style={{ fontSize: '10px', letterSpacing: '6px', textTransform: 'uppercase' }}
          >
            Counting down to
          </p>
          <p
            className="font-serif font-light italic text-cream/80"
            style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)' }}
          >
            {eventName ?? 'The Wedding'}
          </p>
          {/* Small gold diamond accent */}
          <div
            className="mt-1 h-[5px] w-[5px] rotate-45"
            style={{ background: 'rgba(201,168,76,0.45)' }}
          />
        </div>

        {/* Countdown units */}
        <div className="flex items-start gap-4 sm:gap-8">
          <NumberUnit value={timeLeft?.days    ?? null} label="Days"    />
          <ColonSep />
          <NumberUnit value={timeLeft?.hours   ?? null} label="Hours"   />
          <ColonSep />
          <NumberUnit value={timeLeft?.minutes ?? null} label="Minutes" />
          <ColonSep />
          <NumberUnit value={timeLeft?.seconds ?? null} label="Seconds" />
        </div>

      </motion.div>
    </section>
  );
}
