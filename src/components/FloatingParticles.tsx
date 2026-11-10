import React, { useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  type?: 'hearts' | 'sparkles' | 'mixed';
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 20,
  type = 'hearts'
}) => {
  const pastelColors = [
    'rgba(255, 133, 162, 0.45)', // pastel rose
    'rgba(255, 182, 193, 0.5)',  // light pink
    'rgba(244, 114, 182, 0.45)', // pink
    'rgba(251, 207, 232, 0.55)', // blush
    'rgba(249, 168, 212, 0.45)', // lavender pink
    'rgba(253, 164, 175, 0.5)'   // rose petal
  ];

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = (i * 17 + 5) % 94;
      const duration = 9 + ((i * 3.5) % 10); // 9s to 19s
      const delay = (i * 1.4) % 8; // 0s to 8s
      const size = 16 + ((i * 5) % 24); // 16px to 40px
      const color = pastelColors[i % pastelColors.length];

      return {
        id: i,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        size,
        color
      };
    });
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-heart-float"
          style={{
            left: p.left,
            bottom: '0px',
            animationDuration: p.duration,
            animationDelay: p.delay
          }}
        >
          {/* Translucent pastel heart SVG with gentle glow */}
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill={p.color}
            className="filter drop-shadow-[0_0_8px_rgba(255,133,162,0.4)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;
