'use client';

import { useMusicContext } from './MusicProvider';

export function MusicToggle() {
  const { isMuted, isPlaying, hasStarted, toggleMute, togglePlay } = useMusicContext();

  // On mobile, first tap must start playback; subsequent taps toggle mute
  const handleClick = () => {
    if (!hasStarted) {
      togglePlay();
    } else {
      toggleMute();
    }
  };

  return (
    <>
      <style>{`
        @keyframes soundBar {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1);   }
        }
        .bar {
          display: inline-block;
          width: 3px;
          height: 14px;
          border-radius: 2px;
          background: #fff;
          transform-origin: bottom center;
        }
        .bar.playing {
          animation: soundBar 0.9s ease-in-out infinite;
        }
        .bar.playing:nth-child(1) { animation-delay: 0s;    animation-duration: 0.8s; }
        .bar.playing:nth-child(2) { animation-delay: 0.15s; animation-duration: 1.1s; }
        .bar.playing:nth-child(3) { animation-delay: 0.3s;  animation-duration: 0.7s; }
      `}</style>

      <button
        onClick={handleClick}
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        className="
          fixed z-50
          w-12 h-12 rounded-full
          flex items-center justify-center
          bg-black/40 backdrop-blur-sm
          border border-white/10
          text-white
          transition-transform duration-150 ease-out
          active:scale-[0.97] hover:scale-105
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
        "
        style={{
          right: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))',
          bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
        }}
      >
        {isMuted ? <MutedIcon /> : <SoundWave playing={isPlaying} />}
      </button>
    </>
  );
}

function SoundWave({ playing }: { playing: boolean }) {
  const cls = playing ? 'bar playing' : 'bar';
  return (
    <span className="flex items-end gap-[3px] h-4">
      <span className={cls} style={playing ? {} : { transform: 'scaleY(0.4)' }} />
      <span className={cls} style={playing ? {} : { transform: 'scaleY(0.7)' }} />
      <span className={cls} style={playing ? {} : { transform: 'scaleY(0.5)' }} />
    </span>
  );
}

function MutedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Speaker body */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="none" />
      {/* Mute X lines */}
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
