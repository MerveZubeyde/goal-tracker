"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";

const quotes = [
  "Success doesn't come to you, you go to it.",
  "The secret of getting ahead is getting started.",
  "Push yourself, because no one else is going to do it for you.",
  "Dream big. Start small. Act now.",
  "You're closer than you think. Keep going.",
  "Don't watch the clock; do what it does. Keep going.",
  "Believe in yourself and all that you are.",
];

const audios = [
  "/audio/sound1.mp3",
  "/audio/sound2.mp3",
  "/audio/sound3.mp3",
  "/audio/sound4.mp3",
  "/audio/sound5.mp3",
  "/audio/sound6.mp3",
  "/audio/sound7.mp3",
  "/audio/sound8.mp3",
  "/audio/sound9.mp3",
  "/audio/sound10.mp3",
];

export default function MotivationPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNext = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.src = audios[audioIndex];
      audioRef.current.play().catch(() => {});
    }
    setAudioIndex((prev) => (prev + 1) % audios.length);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text)] px-6 text-center transition-colors duration-500"
      aria-label="Motivational Quotes Section"
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={quoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 max-w-xl"
          tabIndex={0}
          aria-live="polite"
        >
          {quotes[quoteIndex]}
        </motion.h1>
      </AnimatePresence>

      <motion.button
        onClick={handleNext}
        whileTap={{ scale: 0.95 }}
        className="bg-[var(--color-accent)] hover:bg-opacity-80 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 mb-4"
        aria-label="Show next motivational quote"
      >
        Next Motivation 🔁
      </motion.button>

      <motion.button
        onClick={handlePlay}
        whileTap={{ scale: 0.95 }}
        className="bg-[var(--color-secondary)] hover:brightness-110 text-[var(--color-text)] font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 flex items-center gap-2 mb-6"
        aria-label="Play motivational audio"
      >
        <Volume2 size={20} />
        Play Motivation 🎵
      </motion.button>

      <audio ref={audioRef} aria-hidden="true" tabIndex={-1} />
    </main>
  );
}
