import React, { useState } from 'react';
import { Sparkles, Flame, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { triggerGrandCelebration, triggerCandleWishSparkles } from './Fireworks';

export const BirthdayCake: React.FC = () => {
  // 5 candles for an elegant symmetric cake
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [wishMade, setWishMade] = useState(false);

  const activeCandlesCount = candles.filter(Boolean).length;

  const handleBlowCandle = (index: number) => {
    if (!candles[index]) return;

    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);
    triggerCandleWishSparkles();

    // Check if all candles are blown out
    if (newCandles.every((lit) => !lit)) {
      setWishMade(true);
      triggerGrandCelebration();
    }
  };

  const handleBlowAll = () => {
    setCandles([false, false, false, false, false]);
    setWishMade(true);
    triggerGrandCelebration();
  };

  const handleRelight = () => {
    setCandles([true, true, true, true, true]);
    setWishMade(false);
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl glass-panel text-center border border-pink-200/80 dark:border-pink-500/30 overflow-hidden flex flex-col items-center justify-between">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-rose-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 dark:text-pink-400">
          Surprise 3
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-800 dark:text-white mt-0.5">
          Make a Wish & Blow the Candles 🕯️
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {wishMade
            ? "All candles blown out! 🌟"
            : `Tap each candle to blow it out (${activeCandlesCount} remaining)`}
        </p>
      </div>

      {/* Interactive Birthday Cake Graphic */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        {/* Candles Row */}
        <div className="flex items-end justify-center gap-4 sm:gap-6 z-20 mb-[-6px]">
          {candles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => handleBlowCandle(idx)}
              className="flex flex-col items-center cursor-pointer group"
              title={isLit ? "Click to blow out candle" : "Blown out"}
            >
              {/* Flame */}
              {isLit ? (
                <div className="relative flex items-center justify-center mb-0.5">
                  <div className="w-4 h-6 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-full animate-bounce filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                  <div className="w-1.5 h-3 bg-white/80 rounded-full absolute bottom-1" />
                </div>
              ) : (
                <div className="h-6 flex items-center justify-center text-[10px] text-slate-400 opacity-60">
                  💨
                </div>
              )}

              {/* Candle Body */}
              <div
                className={`w-3.5 sm:w-4 h-12 sm:h-14 rounded-t-sm shadow-md transition-all ${
                  idx % 2 === 0
                    ? 'bg-gradient-to-b from-rose-300 via-pink-400 to-rose-400'
                    : 'bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-300'
                } ${isLit ? 'group-hover:scale-105' : 'opacity-80'}`}
              >
                {/* Diagonal stripes */}
                <div className="w-full h-1 bg-white/40 my-2" />
                <div className="w-full h-1 bg-white/40 my-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Cake Layers */}
        <div className="relative flex flex-col items-center z-10">
          {/* Top Tier */}
          <div className="w-36 sm:w-44 h-10 sm:h-12 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 dark:from-pink-800 dark:via-rose-700 dark:to-pink-800 rounded-t-2xl shadow-md border-b-2 border-white/50 flex items-center justify-around px-3">
            <span className="text-xs">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-xs">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-xs">🍓</span>
          </div>

          {/* Frosting drips */}
          <div className="w-36 sm:w-44 h-2 bg-white/90 dark:bg-pink-300/80 rounded-b-md shadow-sm" />

          {/* Bottom Tier */}
          <div className="w-48 sm:w-56 h-14 sm:h-16 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 dark:from-rose-900 dark:via-pink-800 dark:to-rose-900 rounded-b-3xl shadow-xl flex items-center justify-around px-4 border-t-2 border-pink-200/40">
            <span className="text-xs font-bold text-white/90 tracking-wider">NAGALAKSHMI</span>
          </div>

          {/* Cake Stand / Plate */}
          <div className="w-56 sm:w-64 h-3 bg-gradient-to-r from-slate-200 via-white to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-full shadow-lg mt-1" />
        </div>
      </div>

      {/* Outcome / Notification */}
      <div className="w-full min-h-[64px] flex items-center justify-center mt-2">
        {wishMade ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/15 to-amber-500/10 border border-pink-300 dark:border-pink-500/50 shadow-md text-sm font-bold text-rose-600 dark:text-pink-300 animate-in zoom-in-95 fade-in space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Your wish is on its way... ✨💫</span>
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              May the universe conspire to fulfill your deepest dreams!
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBlowAll}
              className="text-xs px-3 py-1.5 rounded-full bg-rose-100 dark:bg-slate-800 hover:bg-rose-200 text-rose-600 dark:text-pink-300 font-medium transition-colors cursor-pointer"
            >
              Blow all candles at once 💨
            </button>
          </div>
        )}
      </div>

      {/* Relight button */}
      {wishMade && (
        <button
          onClick={handleRelight}
          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 text-rose-600 dark:text-pink-300 text-xs font-semibold cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Relight Candles & Wish Again</span>
        </button>
      )}
    </div>
  );
};

export default BirthdayCake;
