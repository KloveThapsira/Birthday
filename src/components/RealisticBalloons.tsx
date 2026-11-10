import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface BalloonItem {
  id: number;
  x: number;          // left percentage 5-90
  y: number;          // bottom offset in px
  speed: number;      // px per frame
  swayAmp: number;    // sway width in px
  swaySpeed: number;  // sway cycle speed
  phase: number;      // initial angle
  colorStart: string;
  colorEnd: string;
  size: number;       // base scale
  popped: boolean;
  message?: string;
}

// Synthesize audio pop sound
const playBalloonPopSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // High snap noise
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {}
};

const BALLOON_PALETTES = [
  { start: '#f43f5e', end: '#be123c', name: 'Ruby Rose' },
  { start: '#fb7185', end: '#e11d48', name: 'Pink Pearl' },
  { start: '#fbbf24', end: '#d97706', name: 'Golden Amber' },
  { start: '#c084fc', end: '#7e22ce', name: 'Royal Amethyst' },
  { start: '#38bdf8', end: '#0284c7', name: 'Sky Sapphire' },
  { start: '#34d399', end: '#059669', name: 'Emerald Jade' },
  { start: '#f472b6', end: '#db2777', name: 'Coral Blossom' }
];

const COMPLIMENTS = [
  "Brilliant! 🌟",
  "Stay Blessed! 💖",
  "Keep Soaring! ✨",
  "Inspiring Sister! 🌸",
  "Never Stop Dreaming! 💫",
  "Pure Joy! 😊"
];

export const RealisticBalloons: React.FC<{ count?: number; allowInteractivePop?: boolean }> = ({
  count = 12,
  allowInteractivePop = true
}) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [lastCheer, setLastCheer] = useState<string | null>(null);

  useEffect(() => {
    // Generate initial balloons spread across screen
    const items: BalloonItem[] = Array.from({ length: count }, (_, i) => {
      const palette = BALLOON_PALETTES[i % BALLOON_PALETTES.length];
      return {
        id: Date.now() + i,
        x: 6 + ((i * 15 + 4) % 86),
        y: -120 - Math.random() * 300, // staggered start below viewport
        speed: 1.2 + Math.random() * 1.5,
        swayAmp: 18 + Math.random() * 24,
        swaySpeed: 0.02 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
        colorStart: palette.start,
        colorEnd: palette.end,
        size: 0.85 + Math.random() * 0.3,
        popped: false,
        message: COMPLIMENTS[i % COMPLIMENTS.length]
      };
    });
    setBalloons(items);
  }, [count]);

  // Balloon rise animation frame
  useEffect(() => {
    let animId: number;
    let tick = 0;

    const animate = () => {
      tick++;
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.popped) return b;
          let newY = b.y + b.speed;
          // Loop balloon back to bottom if it floats past top
          if (newY > window.innerHeight + 160) {
            newY = -120;
          }
          return {
            ...b,
            y: newY
          };
        })
      );
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePop = (balloon: BalloonItem, e: React.MouseEvent) => {
    if (!allowInteractivePop || balloon.popped) return;

    playBalloonPopSound();

    // Trigger localized confetti pop
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = (rect.left + rect.width / 2) / window.innerWidth;
    const clickY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 24,
      spread: 60,
      origin: { x: clickX, y: clickY },
      colors: [balloon.colorStart, balloon.colorEnd, '#ffffff', '#ffd700']
    });

    setPoppedCount((c) => c + 1);
    if (balloon.message) {
      setLastCheer(balloon.message);
      setTimeout(() => setLastCheer(null), 2400);
    }

    setBalloons((prev) =>
      prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
    );

    // Respawn after 4 seconds
    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) =>
          b.id === balloon.id
            ? {
                ...b,
                popped: false,
                y: -120,
                x: 6 + Math.random() * 84
              }
            : b
        )
      );
    }, 4000);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none">
      {/* Floating cheer message when a balloon is popped */}
      {lastCheer && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full glass-panel border border-pink-400 text-rose-500 font-bold text-sm shadow-xl animate-in zoom-in-90 fade-in duration-300">
          🎉 {lastCheer}
        </div>
      )}

      {balloons.map((b) => {
        if (b.popped) return null;

        // Calculate smooth horizontal sinusoidal sway
        const swayX = Math.sin(b.y * b.swaySpeed + b.phase) * b.swayAmp;

        return (
          <div
            key={b.id}
            onClick={(e) => handlePop(b, e)}
            className="pointer-events-auto absolute cursor-pointer group transition-transform duration-100 ease-out hover:scale-110 active:scale-90"
            style={{
              left: `calc(${b.x}% + ${swayX}px)`,
              bottom: `${b.y}px`,
              transform: `scale(${b.size})`,
              transformOrigin: 'bottom center'
            }}
            title="Click to POP balloon! 🎈"
          >
            {/* 3D Realistic Balloon SVG */}
            <svg width="84" height="130" viewBox="0 0 84 130" className="overflow-visible filter drop-shadow-lg">
              <defs>
                {/* 3D Radial light gradient for glossy pearlescent rubber shine */}
                <radialGradient id={`grad-${b.id}`} cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="25%" stopColor={b.colorStart} />
                  <stop offset="85%" stopColor={b.colorEnd} />
                  <stop offset="100%" stopColor="#1a0b16" stopOpacity="0.85" />
                </radialGradient>

                {/* Specular high-gloss reflection */}
                <linearGradient id={`spec-${b.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Balloon Body with realistic curved teardrop */}
              <path
                d="M42,92 C16,92 4,70 4,44 C4,20 20,4 42,4 C64,4 80,20 80,44 C80,70 68,92 42,92 Z"
                fill={`url(#grad-${b.id})`}
              />

              {/* Specular Highlight Oval (simulates window/sunlight reflection) */}
              <ellipse
                cx="28"
                cy="26"
                rx="14"
                ry="20"
                fill={`url(#spec-${b.id})`}
                transform="rotate(-20 28 26)"
              />

              {/* Secondary bottom soft glow bounce */}
              <ellipse
                cx="58"
                cy="68"
                rx="8"
                ry="12"
                fill="#ffffff"
                opacity="0.18"
              />

              {/* Balloon tie knot */}
              <polygon
                points="38,92 46,92 44,98 40,98"
                fill={b.colorEnd}
              />

              {/* Realistic swaying string */}
              <path
                d="M42,98 Q36,110 44,120 T38,135"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default RealisticBalloons;
