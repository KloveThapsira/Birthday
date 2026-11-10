import React, { useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface RealisticFireworksProps {
  interactive?: boolean;
  autoLaunch?: boolean;
  className?: string;
}

interface Rocket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: Array<{ x: number; y: number; alpha: number }>;
  dead: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  trail: Array<{ x: number; y: number }>;
  flicker: boolean;
}

class FireworkAudio {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playLaunch() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.45);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  playBurst() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }
}

export const fireworkAudioEngine = new FireworkAudio();

/**
 * Confetti Cannon with multiple bursting angles (sides and center), throwing heart shapes and multicolored ribbons
 */
export const triggerCelebrationConfettiCannon = () => {
  const duration = 1.8 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#ff4e8a', '#ff2e88', '#9d4dff', '#00eaff', '#ff85a2', '#ffd700'];

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 18 * (timeLeft / duration);

    confetti({
      particleCount: Math.floor(particleCount),
      angle: 60,
      spread: 60,
      origin: { x: 0.08, y: 0.8 },
      colors
    });

    confetti({
      particleCount: Math.floor(particleCount),
      angle: 120,
      spread: 60,
      origin: { x: 0.92, y: 0.8 },
      colors
    });

    if (Math.random() < 0.3) {
      confetti({
        particleCount: 14,
        spread: 80,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ff4e8a', '#ff85a2', '#ffd700'],
        scalar: 1.1
      });
    }
  }, 260);
};

export const RealisticFireworks: React.FC<RealisticFireworksProps> = ({
  interactive = true,
  autoLaunch = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameId = useRef<number | null>(null);

  const heartColors = [
    '#ff2e88', // neon hot pink
    '#ff4e8a', // vibrant rose
    '#ff85a2', // flamingo pink
    '#fb7185', // coral rose
    '#ffd700', // golden sparkle
    '#ff007f', // deep rose
    '#ffffff'  // diamond highlight
  ];

  // Launch rocket gracefully upwards
  const launchRocket = useCallback((targetX: number, targetY: number, startX?: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const sx = startX ?? (Math.random() * (canvas.width * 0.75) + canvas.width * 0.12);
    const sy = canvas.height;

    const dx = targetX - sx;
    const dy = targetY - sy;
    const distance = Math.hypot(dx, dy);
    // Slower, graceful ascending flight
    const speed = 11 + Math.random() * 2.5;

    const chosenColor = heartColors[Math.floor(Math.random() * heartColors.length)];

    rocketsRef.current.push({
      x: sx,
      y: sy,
      targetX,
      targetY,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      color: chosenColor,
      trail: [],
      dead: false
    });

    fireworkAudioEngine.playLaunch();
  }, [heartColors]);

  // Burst specifically in a distinct, radiant HEART SHAPE
  const explodeRocketIntoHeart = useCallback((x: number, y: number, baseColor: string) => {
    fireworkAudioEngine.playBurst();

    // 1. Primary Heart Perimeter (85-95 particles mapped on parametric heart curve)
    const perimeterCount = 90;
    const heartScale = 0.28 + Math.random() * 0.06;

    for (let i = 0; i < perimeterCount; i++) {
      const t = (Math.PI * 2 * i) / perimeterCount;
      // Parametric Heart Formula
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      // Slight natural dispersion for organic firework aesthetic
      const jitter = 0.92 + Math.random() * 0.16;
      const vx = hx * heartScale * jitter;
      const vy = hy * heartScale * jitter;

      const pColor = Math.random() < 0.35 ? '#ffd700' : Math.random() < 0.65 ? '#ff2e88' : baseColor;

      sparksRef.current.push({
        x,
        y,
        vx,
        vy,
        color: pColor,
        alpha: 1,
        // Slower decay so the glowing heart stays recognizable in the sky
        decay: 0.0075 + Math.random() * 0.007,
        trail: [{ x, y }],
        flicker: Math.random() < 0.4
      });
    }

    // 2. Inner Heart Sparkle Core (25 twinkling golden & pink ember stars)
    const innerCount = 28;
    for (let i = 0; i < innerCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = 0.05 + Math.random() * 0.14;
      const hx = 16 * Math.pow(Math.sin(t), 3) * r;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;

      sparksRef.current.push({
        x,
        y,
        vx: hx,
        vy: hy,
        color: Math.random() < 0.5 ? '#ffffff' : '#ffd700',
        alpha: 1,
        decay: 0.009 + Math.random() * 0.009,
        trail: [{ x, y }],
        flicker: true
      });
    }
  }, [heartColors]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    launchRocket(x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial heart rocket launch
    launchRocket(canvas.width * 0.5, canvas.height * 0.32, canvas.width * 0.5);

    // Continuous, steady heart firework cadence (fires steadily every 1.6s)
    let autoInterval: number | null = null;
    let step = 0;
    if (autoLaunch) {
      autoInterval = window.setInterval(() => {
        if (!canvas) return;
        step++;
        // Stagger positions across the sky: left, center-left, center-right, right
        const positions = [0.3, 0.7, 0.5, 0.22, 0.78, 0.4, 0.6];
        const posX = positions[step % positions.length];
        const targetX = canvas.width * posX + (Math.random() - 0.5) * (canvas.width * 0.1);
        const targetY = canvas.height * 0.18 + Math.random() * (canvas.height * 0.22);
        launchRocket(targetX, targetY);
      }, 1600);
    }

    const render = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      // 1. Ascending rockets with glowing trail
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.x += r.vx;
        r.y += r.vy;

        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 9) r.trail.shift();

        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          const radius = (t / r.trail.length) * 2.8 + 0.6;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 180, 120, ${t / r.trail.length})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 14;
        ctx.shadowColor = r.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        const reachedTarget = r.y <= r.targetY || Math.hypot(r.x - r.targetX, r.y - r.targetY) < 16;
        if (reachedTarget) {
          explodeRocketIntoHeart(r.x, r.y, r.color);
          rocketsRef.current.splice(i, 1);
        }
      }

      // 2. Glowing Heart Sparks with gentle float physics
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        // Slower air friction keeps the heart silhouette intact
        s.vx *= 0.965;
        s.vy *= 0.965;
        // Gentle downward drift
        s.vy += 0.038;

        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 3) s.trail.shift();

        if (s.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.flicker && Math.random() < 0.25 ? s.alpha * 0.45 : s.alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.6;

        ctx.beginPath();
        if (s.trail.length > 1) {
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          for (let t = 1; t < s.trail.length; t++) {
            ctx.lineTo(s.trail[t].x, s.trail[t].y);
          }
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (autoInterval) clearInterval(autoInterval);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [explodeRocketIntoHeart, launchRocket, autoLaunch]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className={`fixed inset-0 z-0 ${interactive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'} ${className}`}
      title={interactive ? "Click anywhere in the night sky to launch a heart cracker!" : undefined}
    />
  );
};

export default RealisticFireworks;
