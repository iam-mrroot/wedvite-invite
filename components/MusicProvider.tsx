'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface MusicContextValue {
  isPlaying: boolean;
  isMuted: boolean;
  hasStarted: boolean;
  toggleMute: () => void;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  isPlaying: false,
  isMuted: false,
  hasStarted: false,
  toggleMute: () => {},
  togglePlay: () => {},
});

export function useMusicContext() {
  return useContext(MusicContext);
}

const VOLUME = 0.3;
const FADE_DURATION_MS = 2000;
const FADE_STEP_MS = 50;

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Initialise the Audio element once on the client
  useEffect(() => {
    const audio = new Audio('/music/wedding-bg.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';

    // Swallow missing-file errors silently
    audio.addEventListener('error', () => {});

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);

    const steps = FADE_DURATION_MS / FADE_STEP_MS;
    const increment = VOLUME / steps;

    audio.volume = 0;

    fadeTimerRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const next = Math.min(audioRef.current.volume + increment, VOLUME);
      audioRef.current.volume = next;
      if (next >= VOLUME) {
        clearInterval(fadeTimerRef.current!);
        fadeTimerRef.current = null;
      }
    }, FADE_STEP_MS);
  }, []);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasStartedRef.current) return;
    hasStartedRef.current = true;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        fadeIn();
      })
      .catch(() => {
        // Autoplay still blocked — reset so we can retry on the next interaction
        hasStartedRef.current = false;
      });
  }, [fadeIn]);

  // Attach one-time interaction listeners to kick off autoplay
  useEffect(() => {
    const events = ['click', 'touchstart', 'scroll', 'keydown'] as const;

    const handler = () => {
      startMusic();
      // Once started, remove all listeners
      events.forEach((e) => window.removeEventListener(e, handler));
    };

    events.forEach((e) => window.addEventListener(e, handler, { once: true, passive: true }));

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [startMusic]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
          fadeIn();
        })
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [fadeIn]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, hasStarted, toggleMute, togglePlay }}>
      {children}
    </MusicContext.Provider>
  );
}
