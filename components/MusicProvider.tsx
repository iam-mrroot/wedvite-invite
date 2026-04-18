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
  toggleMute: () => void;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  isPlaying: false,
  isMuted: false,
  toggleMute: () => {},
  togglePlay: () => {},
});

export function useMusicContext() {
  return useContext(MusicContext);
}

const VOLUME = 0.3;
const FADE_DURATION_MS = 2000;
const FADE_STEP_MS = 50;

// Only click/touchstart count as user gestures for audio on iOS Safari.
// scroll and keydown are NOT valid gestures for audio autoplay.
const UNLOCK_EVENTS = ['click', 'touchstart'] as const;

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isStartingRef = useRef(false);
  const unlockHandlerRef = useRef<(() => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/wedding-bg.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audio.addEventListener('error', () => {});
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const removeUnlockListeners = useCallback(() => {
    if (unlockHandlerRef.current) {
      UNLOCK_EVENTS.forEach((e) =>
        window.removeEventListener(e, unlockHandlerRef.current!)
      );
      unlockHandlerRef.current = null;
    }
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

  // Called by the window unlock listeners (background taps/touches).
  // The button calls togglePlay() directly with stopPropagation to avoid
  // both paths firing at once, which would cause a double-play abort.
  const startMusicFromGesture = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isStartingRef.current || isPlaying) return;
    isStartingRef.current = true;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        fadeIn();
        removeUnlockListeners(); // success — no more background listeners needed
      })
      .catch(() => {
        // play() blocked — keep listeners alive so the next gesture retries
        isStartingRef.current = false;
      });
  }, [fadeIn, isPlaying, removeUnlockListeners]);

  // Attach background gesture listeners. Stays attached until first success.
  useEffect(() => {
    const handler = () => startMusicFromGesture();
    unlockHandlerRef.current = handler;
    UNLOCK_EVENTS.forEach((e) =>
      window.addEventListener(e, handler, { passive: true })
    );
    return () => removeUnlockListeners();
  }, [startMusicFromGesture, removeUnlockListeners]);

  // Used by the toggle button directly (with stopPropagation).
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      isStartingRef.current = true;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeIn();
          removeUnlockListeners();
          isStartingRef.current = false;
        })
        .catch(() => {
          isStartingRef.current = false;
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [fadeIn, removeUnlockListeners]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, toggleMute, togglePlay }}>
      {children}
    </MusicContext.Provider>
  );
}
