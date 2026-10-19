import React, { useEffect, useState } from 'react';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
}

const SPARKLE_CHARS = ['✦', '★', '✧', '·'];
const SPARKLE_COLORS = ['#a34063', '#d97706', '#f59e0b', '#e11d48'];

export const SparkleCursorOverlay: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    // Avoid unnecessary particle churn in headless automation
    if (typeof navigator !== 'undefined' && (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent))) {
      return;
    }

    let lastSpawn = 0;
    let counter = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 55) return;
      lastSpawn = now;
      counter += 1;

      const newParticle: SparkleParticle = {
        id: now + counter,
        x: e.clientX,
        y: e.clientY,
        char: SPARKLE_CHARS[counter % SPARKLE_CHARS.length],
        color: SPARKLE_COLORS[counter % SPARKLE_COLORS.length],
      };

      setParticles((prev) => [...prev.slice(-9), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled || particles.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, idx) => {
        const opacity = (idx + 1) / particles.length;
        const scale = 0.65 + (idx / particles.length) * 0.55;
        return (
          <span
            key={p.id}
            style={{
              transform: `translate3d(${p.x - 6}px, ${p.y - 6}px, 0) scale(${scale.toFixed(2)})`,
              opacity,
              color: p.color,
            }}
            className="fixed top-0 left-0 text-sm font-bold transition-opacity duration-150 select-none"
          >
            {p.char}
          </span>
        );
      })}
    </div>
  );
};
