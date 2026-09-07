import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import s1Mpeg from '../assets/s1.mpeg';

export default function AudioPlayer({
  audioRef: externalAudioRef,
  isPlaying: controlledIsPlaying,
  onTogglePlay,
}) {
  const internalAudioRef = useRef(null);
  const audioRef = externalAudioRef || internalAudioRef;

  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;

  const handleToggle = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      const nextState = !isPlaying;
      setInternalIsPlaying(nextState);
      if (audioRef.current) {
        if (nextState) {
          audioRef.current.play().catch((err) => console.warn('Audio play error:', err));
        } else {
          audioRef.current.pause();
        }
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.75;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio playback error (waiting for user interaction):', err);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, audioRef]);

  return (
    <div className="fixed bottom-6 left-5 z-40">
      <audio
        ref={audioRef}
        src={s1Mpeg}
        loop
        preload="auto"
      />
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggle}
        title={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        className="w-11 h-11 rounded-full bg-[#6D5D50] hover:bg-[#5C4E42] text-white shadow-[0_6px_18px_rgba(85,71,60,0.35)] flex items-center justify-center cursor-pointer transition-all border border-[#C5A880]/40"
      >
        {/* Animated equalizer bars */}
        <div className="flex items-end gap-1 h-3.5">
          <span
            className={`w-0.5 rounded-full bg-white transition-all ${
              isPlaying ? 'animate-bounce h-2.5 [animation-delay:-0.3s]' : 'h-2.5'
            }`}
          />
          <span
            className={`w-0.5 rounded-full bg-white transition-all ${
              isPlaying ? 'animate-bounce h-4 [animation-delay:-0.15s]' : 'h-4'
            }`}
          />
          <span
            className={`w-0.5 rounded-full bg-white transition-all ${
              isPlaying ? 'animate-bounce h-3' : 'h-3'
            }`}
          />
        </div>
      </motion.button>
    </div>
  );
}
