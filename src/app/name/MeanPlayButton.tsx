'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/config';

type MeanPlayButtonProps = {
  text: string;
  label: string;
};

const playingResetters = new Set<() => void>();

function resetAllPlayingStates() {
  playingResetters.forEach((reset) => reset());
}

function pickVietnameseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  const vi = voices.filter((v) => v.lang.toLowerCase().startsWith('vi'));
  if (vi.length === 0) {
    return null;
  }
  const preferred = vi.find((v) => /hoai|google/i.test(v.name)) ?? vi[0];
  return preferred;
}

export function MeanPlayButton({ text, label }: MeanPlayButtonProps) {
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const buttonId = useId();
  const trimmed = text.trim();
  const disabled = trimmed.length === 0;

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setPlaying(false);
  }, []);

  const speak = useCallback(() => {
    if (disabled || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    resetAllPlayingStates();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voice = pickVietnameseVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      utteranceRef.current = null;
      setPlaying(false);
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setPlaying(false);
    };

    utteranceRef.current = utterance;
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, [disabled, trimmed]);

  const handleClick = () => {
    if (playing) {
      stop();
      return;
    }
    speak();
  };

  useEffect(() => {
    const resetPlaying = () => setPlaying(false);
    playingResetters.add(resetPlaying);

    const onVoicesChanged = () => {
      pickVietnameseVoice();
    };
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        playingResetters.delete(resetPlaying);
        window.speechSynthesis.removeEventListener(
          'voiceschanged',
          onVoicesChanged,
        );
        window.speechSynthesis.cancel();
        setPlaying(false);
      };
    }
    return () => {
      playingResetters.delete(resetPlaying);
    };
  }, []);

  return (
    <button
      id={buttonId}
      type='button'
      disabled={disabled}
      onClick={handleClick}
      aria-label={playing ? `Dừng đọc nghĩa ${label}` : `Đọc nghĩa ${label}`}
      aria-pressed={playing}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors',
        'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-40',
        playing && 'bg-muted',
      )}
    >
      {playing ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='h-4 w-4'
          aria-hidden
        >
          <rect x='6' y='5' width='4' height='14' rx='1' />
          <rect x='14' y='5' width='4' height='14' rx='1' />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='h-4 w-4'
          aria-hidden
        >
          <path d='M8 5.14v14.72a1 1 0 0 0 1.5.86l11.04-7.36a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z' />
        </svg>
      )}
    </button>
  );
}
