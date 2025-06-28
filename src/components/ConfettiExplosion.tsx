"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  style: React.CSSProperties;
}

export default function ConfettiExplosion() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const starsCount = 20;
    const newStars: Star[] = [];

    for (let i = 0; i < starsCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 150 + 100;
      const size = Math.random() * 12 + 6;
      const delay = Math.random() * 0.5;

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      newStars.push({
        id: i,
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          width: size,
          height: size,
          backgroundColor: "#f4d2c8",
          borderRadius: "50%",
          opacity: 1,
          transform: "translate(0, 0)",
          animationName: "star-move",
          animationDuration: "1.2s",
          animationTimingFunction: "ease-out",
          animationFillMode: "forwards",
          animationDelay: `${delay}s`,
          boxShadow: "0 0 12px #facc15",
          pointerEvents: "none",
          willChange: "transform, opacity",
          "--translate-x": `${x}px`,
          "--translate-y": `${y}px`,
        } as React.CSSProperties,
      });
    }

    setStars(newStars);
  }, []);

  return (
    <>
      <style>{`
        @keyframes star-move {
          to {
            transform: translate(var(--translate-x), var(--translate-y));
            opacity: 0;
          }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-50"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        role="presentation"
      >
        {stars.map((star) => (
          <span
            key={star.id}
            style={star.style}
            aria-hidden="true"
            tabIndex={-1}
          />
        ))}
      </div>
    </>
  );
}
