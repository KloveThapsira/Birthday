import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  size: number;
  color: string;
}

export const CursorSparkles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch / mobile device or reduced motion
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touchCheck || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const chars = ['✨', '💖', '⭐', '🌸', '🪄'];
    const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#a855f7', '#fb7185'];
    let lastMoveTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < 45) return; // throttle emission
      lastMoveTime = now;

      const newParticle: Particle = {
        id: now + Math.random(),
        x: e.clientX,
        y: e.clientY,
        char: chars[Math.floor(Math.random() * chars.length)],
        size: 10 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)]
      };

      setParticles((prev) => [...prev.slice(-14), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Auto cleanup expired particles
    const interval = setInterval(() => {
      setParticles((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 120);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  if (isTouchDevice || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none transition-all duration-700 ease-out pointer-events-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            color: p.color,
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0.85
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};

export default CursorSparkles;
