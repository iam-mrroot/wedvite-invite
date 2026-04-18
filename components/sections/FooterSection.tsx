'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface FooterSectionProps {
  hashtag: string;
  shareMessage: string;
  shareUrl: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.005 2.232A9.769 9.769 0 0 0 2.23 12a9.8 9.8 0 0 0 1.512 5.26L2 22.002l4.89-1.726A9.77 9.77 0 0 0 12.005 22 9.769 9.769 0 0 0 21.78 12a9.769 9.769 0 0 0-9.775-9.768zm0 17.87a8.12 8.12 0 0 1-4.14-1.134l-.297-.177-3.073.803.818-2.985-.194-.306A8.086 8.086 0 0 1 3.884 12c0-4.48 3.641-8.12 8.12-8.12 4.481 0 8.121 3.64 8.121 8.12 0 4.481-3.64 8.121-8.12 8.121z" />
    </svg>
  );
}

function SmallOrnament() {
  return (
    <svg viewBox="0 0 60 18" width="52" height="16" fill="none" aria-hidden="true">
      <path d="M30 5 L33.5 9 L30 13 L26.5 9 Z" fill="currentColor" />
      <path d="M26.5 9 C21 9 15.5 5.5 10 7.5 C6 9 3 11 2 9" stroke="currentColor" strokeWidth="0.75" />
      <path d="M33.5 9 C39 9 44.5 5.5 50 7.5 C54 9 57 11 58 9" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="2" cy="9" r="1.5" fill="currentColor" />
      <circle cx="58" cy="9" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function FooterSection({ hashtag, shareMessage, shareUrl }: FooterSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const waHref = `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-20"
      style={{ background: '#181818' }}
    >
      {/* Top gold gradient border */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5) 40%, rgba(201,168,76,0.5) 60%, transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        className="flex flex-col items-center px-6 text-center"
      >

        {/* Ornament */}
        <motion.div
          className="mb-6 text-gold-400/40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <SmallOrnament />
        </motion.div>

        {/* Hashtag with shimmer */}
        <div className="relative overflow-hidden">
          <h2
            className="font-serif italic text-gold-400"
            style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', letterSpacing: '0.01em' }}
          >
            {hashtag}
          </h2>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          />
        </div>

        {/* Thin divider */}
        <div
          className="my-8"
          style={{
            width: '48px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
          }}
        />

        <motion.p
          className="mb-5 font-sans text-[11px] uppercase text-warmgray/50"
          style={{ letterSpacing: '3.5px' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          Share this celebration
        </motion.p>

        {/* WhatsApp button */}
        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full px-7 py-3 font-sans text-[13px] font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
          style={{ background: '#25D366', letterSpacing: '0.5px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
        >
          <WhatsAppIcon />
          Share via WhatsApp
        </motion.a>

        {/* Back to top */}
        <motion.button
          type="button"
          onClick={scrollToTop}
          className="mt-14 flex min-h-[44px] items-center gap-2 px-4 font-sans text-[11px] uppercase tracking-[2px] text-warmgray/35 transition-colors hover:text-warmgray/60 active:scale-[0.97]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        >
          <span style={{ fontSize: '14px' }}>↑</span>
          Back to top
        </motion.button>

        <motion.p
          className="mt-3 font-sans text-[10px] text-warmgray/25"
          style={{ letterSpacing: '1px' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        >
          Made with love
        </motion.p>

      </motion.div>
    </footer>
  );
}
