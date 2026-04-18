'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LoadingScreenProps {
  monogram: string;
  tagline?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SPRING: [number, number, number, number] = [0.34, 1.3, 0.64, 1];
const MIN_MS = 4800; // Increased to let the beautiful sequence complete fully

// Envelope dimensions
const ENV_W = 300;
const ENV_H = 190;
const FLAP_H = 110; 

function WaxSeal({ initial }: { initial: string }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #C0392B, #7B1F1F)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 4,
        borderRadius: '50%',
        border: '0.5px solid rgba(255,255,255,0.2)',
      }} />
      <span style={{
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: '0.02em',
        marginTop: 1,
      }}>
        {initial}
      </span>
    </div>
  );
}

export function LoadingScreen({ monogram, tagline }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), MIN_MS);
    return () => clearTimeout(t);
  }, []);

  const sealInitial = monogram.charAt(0);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #FAF7F2 0%, #F0E6D3 100%)' }}
          aria-hidden="true"
        >
          {/* Grain texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />

          {/* Master Envelope Scene Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ position: 'relative', width: ENV_W, height: ENV_H, perspective: '1200px' }}
          >
            {/* ── ENVELOPE BODY (Drops away after opening) ── */}
            <motion.div
              style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 500, opacity: 0 }}
              transition={{ delay: 2.3, duration: 1.0, ease: [0.36, 0, 0.66, -0.56] }} // drops down smoothly
            >
              {/* Back Wall of Envelope */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#D4C5A0',
                borderRadius: 3,
                boxShadow: '0 12px 40px rgba(80,60,20,0.12), 0 2px 8px rgba(80,60,20,0.06)',
                zIndex: 1,
              }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.03,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l10 10L0 20z' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E")`
                }} />
              </div>

              {/* Envelope Front Pockets */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
                <svg viewBox={`0 0 ${ENV_W} ${ENV_H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(2px 0px 4px rgba(0,0,0,0.06))' }}>
                  <path d={`M0 0 L${ENV_W / 2} ${ENV_H * 0.62} L0 ${ENV_H} Z`} fill="#EBE0C8" stroke="rgba(201,168,76,0.1)" strokeWidth="1" />
                </svg>
                <svg viewBox={`0 0 ${ENV_W} ${ENV_H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(-2px 0px 4px rgba(0,0,0,0.06))' }}>
                  <path d={`M${ENV_W} 0 L${ENV_W / 2} ${ENV_H * 0.62} L${ENV_W} ${ENV_H} Z`} fill="#EBE0C8" stroke="rgba(201,168,76,0.1)" strokeWidth="1" />
                </svg>
                <svg viewBox={`0 0 ${ENV_W} ${ENV_H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(0px -3px 6px rgba(0,0,0,0.08))' }}>
                  <path d={`M0 ${ENV_H} L${ENV_W / 2} ${ENV_H * 0.55} L${ENV_W} ${ENV_H} Z`} fill="#E4D5B8" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
                </svg>
              </div>

              {/* Top Flap */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: FLAP_H,
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
                initial={{ rotateX: 0, zIndex: 4 }}
                // Animate open past 90 degrees to fully behind
                animate={{ rotateX: -175, zIndex: 0 }}
                transition={{
                  rotateX: { delay: 0.6, duration: 1.0, ease: EASE_SPRING },
                  zIndex: { delay: 1.1, duration: 0 } // Switch zIndex exactly as it flips backwards
                }}
              >
                {/* Front face of Flap */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
                  <svg viewBox={`0 0 ${ENV_W} ${FLAP_H}`} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.08))' }}>
                    <path d={`M0 0 L${ENV_W} 0 L${ENV_W / 2} ${FLAP_H} Z`} fill="#EBE0C8" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
                  </svg>
                  {/* Wax Seal affixed to front */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '100%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 5,
                    }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.55, ease: EASE_SPRING }}
                  >
                    <WaxSeal initial={sealInitial} />
                  </motion.div>
                </div>
                {/* Back face of Flap */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <svg viewBox={`0 0 ${ENV_W} ${FLAP_H}`} style={{ width: '100%', height: '100%' }}>
                    <path d={`M0 0 L${ENV_W} 0 L${ENV_W / 2} ${FLAP_H} Z`} fill="#D4C5A0" stroke="rgba(201,168,76,0.1)" strokeWidth="1" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* ── THE LETTER ── */}
            <motion.div
              style={{
                position: 'absolute',
                top: 10, left: 16, right: 16, bottom: 10, // Nested inside properly
                background: 'linear-gradient(170deg, #FFFDF8 0%, #FBF6EC 100%)',
                borderRadius: 2,
                border: '1px solid rgba(201,168,76,0.22)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                zIndex: 2,
                overflow: 'hidden',
              }}
              initial={{ y: 0, scale: 1 }}
              // Letter slides UP (-170), then floats DOWN to center (0), whilst scaling UP
              animate={{ y: [0, -170, 0], scale: [1, 1, 1.3] }}
              transition={{
                times: [0, 0.45, 1], // Spacing of keyframes
                delay: 1.3,         // Start rising after flap opens
                duration: 2.1,      // Total floating sequence duration
                ease: "easeInOut"
              }}
            >
              {/* Decorative top rule on letter */}
              <div style={{
                position: 'absolute',
                top: 14, left: 20, right: 20, height: '0.5px',
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
              }} />

              {/* Text content fading in slightly delayed */}
              <motion.p
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '4px',
                  color: 'rgba(80,65,45,0.4)',
                  margin: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8, ease: EASE }}
              >
                Wedding Invitation
              </motion.p>

              <motion.p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
                  letterSpacing: '0.06em',
                  color: '#2E2820',
                  margin: 0,
                  lineHeight: 1,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.8, ease: EASE }}
              >
                {monogram}
              </motion.p>

              <motion.div
                style={{
                  width: 4, height: 4, background: '#C9A84C', transform: 'rotate(45deg)', opacity: 0.7,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.9, duration: 0.4, ease: EASE_SPRING }}
              />

              {tagline && (
                <motion.p
                  style={{
                    fontFamily: 'sans-serif',
                    fontSize: '7px',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    color: 'rgba(80,65,45,0.4)',
                    margin: 0,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.05, duration: 0.8, ease: EASE }}
                >
                  {tagline}
                </motion.p>
              )}

              {/* Decorative bottom rule */}
              <div style={{
                position: 'absolute',
                bottom: 14, left: 20, right: 20, height: '0.5px',
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
              }} />
            </motion.div>
          </motion.div>

          <motion.p
            style={{
              position: 'absolute',
              bottom: 40,
              fontFamily: 'sans-serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              color: 'rgba(80,65,45,0.35)',
              margin: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ times: [0, 0.2, 1], delay: 0.5, duration: 3.5, ease: EASE }}
          >
            opening your invitation
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
