import React, { useState, useEffect, useRef } from 'react';
import { Lock, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import RealisticFireworks, { fireworkAudioEngine } from './RealisticFireworks';
import confetti from 'canvas-confetti';

interface PasswordScreenProps {
  onUnlock: () => void;
}

// Gentle typing audio chime
const playKeyChime = (charIndex: number) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const freq = notes[charIndex % notes.length];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {}
};

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ onUnlock }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { unlockAudio } = useMusic();

  const dayRef = useRef<HTMLInputElement | null>(null);
  const monthRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Interactive Starry Cosmos with shooting stars
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const starCount = 130;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
      color: Math.random() < 0.2 ? '#fbcfe8' : Math.random() < 0.4 ? '#fef08a' : '#ffffff'
    }));

    let animId: number;
    const render = () => {
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starry nebulae
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        50,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.65
      );
      grad.addColorStop(0, 'rgba(30, 15, 45, 0.4)');
      grad.addColorStop(0.7, 'rgba(10, 8, 25, 0.25)');
      grad.addColorStop(1, 'rgba(5, 7, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.2) s.twinkleSpeed = -s.twinkleSpeed;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    setDay(val);
    playKeyChime(val.length);
    if (errorMessage) setErrorMessage('');
    if (val.length === 2 && monthRef.current) {
      monthRef.current.focus();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    setMonth(val);
    playKeyChime(val.length + 2);
    if (errorMessage) setErrorMessage('');
    if (val.length === 2 && yearRef.current) {
      yearRef.current.focus();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setYear(val);
    playKeyChime(val.length + 4);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    const isMatch = d === 11 && m === 11 && y === 2007;

    if (isMatch) {
      setIsUnlocking(true);
      unlockAudio();

      fireworkAudioEngine.playLaunch();
      setTimeout(() => fireworkAudioEngine.playBurst(), 420);

      confetti({
        particleCount: 75,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#f43f5e', '#fb7185', '#ffd700', '#c084fc']
      });

      setTimeout(() => {
        onUnlock();
      }, 1000);
    } else {
      setErrorMessage("Oops! Try your special birthday date again 💕");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#05070f] text-slate-100 overflow-hidden select-none">
      {/* Cosmos Canvas */}
      <canvas
        ref={starCanvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Real Flying Rocket Crackers Bursting Across Home Screen */}
      <RealisticFireworks interactive={true} autoLaunch={true} className="z-0 opacity-85" />

      {/* Obsidian Glass Card with Segmented Day / Month / Year Boxes */}
      <div
        className={`relative w-full max-w-lg p-8 sm:p-12 rounded-3xl transition-all duration-700 text-center z-10 border border-white/10 shadow-[0_0_60px_-15px_rgba(244,63,94,0.35)] backdrop-blur-2xl ${
          isUnlocking ? 'scale-105 opacity-90' : 'scale-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(18, 12, 28, 0.88) 0%, rgba(8, 10, 20, 0.92) 100%)'
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight font-display leading-tight">
          Someone Special Has a Surprise Waiting For You... 🎁
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
          Enter your special date to unlock the surprise 💖
        </p>

        {/* Form with DAY - MONTH - YEAR Input Boxes */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-sm mx-auto">
            {/* Day Box */}
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1.5">
                Day
              </label>
              <input
                ref={dayRef}
                type="text"
                inputMode="numeric"
                value={day}
                onChange={handleDayChange}
                placeholder="DD"
                maxLength={2}
                autoFocus
                disabled={isUnlocking}
                className="w-full py-3.5 sm:py-4 text-center text-xl sm:text-2xl font-bold tracking-wider rounded-2xl bg-black/60 border-2 border-pink-500/40 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/25 transition-all shadow-inner"
              />
            </div>

            <span className="text-2xl font-bold text-slate-500 pt-5">/</span>

            {/* Month Box */}
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1.5">
                Month
              </label>
              <input
                ref={monthRef}
                type="text"
                inputMode="numeric"
                value={month}
                onChange={handleMonthChange}
                placeholder="MM"
                maxLength={2}
                disabled={isUnlocking}
                className="w-full py-3.5 sm:py-4 text-center text-xl sm:text-2xl font-bold tracking-wider rounded-2xl bg-black/60 border-2 border-pink-500/40 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/25 transition-all shadow-inner"
              />
            </div>

            <span className="text-2xl font-bold text-slate-500 pt-5">/</span>

            {/* Year Box */}
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1.5">
                Year
              </label>
              <input
                ref={yearRef}
                type="text"
                inputMode="numeric"
                value={year}
                onChange={handleYearChange}
                placeholder="YYYY"
                maxLength={4}
                disabled={isUnlocking}
                className="w-full py-3.5 sm:py-4 text-center text-xl sm:text-2xl font-bold tracking-wider rounded-2xl bg-black/60 border-2 border-pink-500/40 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/25 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Gentle Error Notice */}
          {errorMessage && (
            <div className="text-xs sm:text-sm font-medium text-pink-400 animate-in fade-in flex items-center justify-center gap-1.5 pt-1">
              <Heart className="w-4 h-4 fill-current inline-block" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUnlocking}
              className="magic-button w-full max-w-xs mx-auto py-4 px-8 rounded-full font-bold text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none"
            >
              {isUnlocking ? (
                <span className="font-display tracking-wide">Unlocking Surprise... ✨</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="font-display tracking-wide text-base">Unlock Surprise</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordScreen;
