"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const quotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Dream it. Wish it. Do it.",
  "Stay positive, work hard, make it happen.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
];

const audioFiles = [
  "/audio/sound1.mp3.mp3",
  "/audio/sound2.mp3.mp3",
  "/audio/sound3.mp3.mp3",
  "/audio/sound4.mp3.mp3",
  "/audio/sound5.mp3.mp3",
  "/audio/sound6.mp3.mp3",
  "/audio/sound7.mp3.mp3",
  "/audio/sound8.mp3.mp3",
  "/audio/sound9.mp3.mp3",
  "/audio/sound10.mp3.mp3",
];

interface MotivationModalProps {
  onClose: () => void;
}

export default function MotivationModal({ onClose }: MotivationModalProps) {
  const [quote, setQuote] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomQuoteIndex]);

    const randomAudioIndex = Math.floor(Math.random() * audioFiles.length);
    const audio = new Audio(audioFiles[randomAudioIndex]);
    audioRef.current = audio;
    audio.loop = true;
    audio.play().catch(() => {
      setIsPlaying(false);
    });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      audio.pause();
      audioRef.current = null;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // User interaction required for playback.
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      id="motivation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="motivation-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-[rgba(0,0,0,0.3)] dark:bg-[rgba(0,0,0,0.6)]"
      tabIndex={-1}
    >
      <div
        className="
          relative
          bg-[var(--color-background)]
          rounded-3xl
          p-10
          max-w-3xl
          w-full
          shadow-2xl
          border border-[var(--color-primary)]
          flex flex-col items-center gap-6
          animate-fadeIn
          overflow-hidden
        "
        role="document"
        aria-describedby="motivation-quote"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30 blur-2xl z-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--color-accent), transparent 60%)",
          }}
          aria-hidden="true"
        />

        <h2
          id="motivation-title"
          className="
            text-4xl
            font-extrabold
            text-[var(--color-accent)]
            tracking-wide
            select-none
            text-center
            z-10
          "
        >
          ✨ Motivation for Today
        </h2>

        <div
          id="motivation-quote"
          className="
            bg-[rgba(255,255,255,0.05)]
            border border-[var(--color-primary)]
            rounded-xl
            p-8
            text-center
            text-xl
            leading-relaxed
            italic
            text-[var(--color-text)]
            font-medium
            z-10
          "
          tabIndex={0}
          aria-live="polite"
        >
          {quote}
        </div>

        <div className="flex justify-center gap-6 w-full max-w-md z-10">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            className="
              bg-[var(--color-accent)]
              text-[var(--color-primary)]
              px-6 py-4
              rounded-xl
              font-semibold
              flex items-center justify-center gap-2
              hover:brightness-110
              transition
              flex-1
            "
            type="button"
          >
            {isPlaying ? <Pause size={22} aria-hidden="true" /> : <Play size={22} aria-hidden="true" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="
              bg-[var(--color-accent)]
              text-[var(--color-primary)]
              px-6 py-4
              rounded-xl
              font-semibold
              flex items-center justify-center gap-2
              hover:brightness-110
              transition
              flex-1
            "
            type="button"
          >
            {isMuted ? <VolumeX size={22} aria-hidden="true" /> : <Volume2 size={22} aria-hidden="true" />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          aria-label="Close motivation modal"
          className="
            absolute top-5 right-5
            text-[var(--color-primary)]
            hover:text-[var(--color-accent)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--color-accent)]
            text-3xl
            transition
            z-10
          "
          type="button"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}
