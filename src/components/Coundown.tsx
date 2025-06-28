"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function updateTimer() {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Time is up");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [targetDate]);

  return (
    <time
      aria-live="polite"
      aria-atomic="true"
      dateTime={timeLeft === "Time is up" ? undefined : new Date(targetDate).toISOString()}
      className={`font-semibold ${
        timeLeft === "Time is up"
          ? "text-[var(--color-warning)]"
          : "text-[var(--color-accent)]"
      }`}
    >
      {timeLeft}
    </time>
  );
}
