import React, { useState } from 'react';
import { HEART_COMPLIMENTS } from '../data/messages';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import { triggerHeartShower } from './Fireworks';

interface PopHeart {
  id: number;
  message: string;
  isPopped: boolean;
  color: string;
  size: string;
}

export const MemoryHearts: React.FC = () => {
  const heartColors = [
    'from-rose-500 to-pink-500',
    'from-pink-500 to-rose-400',
    'from-fuchsia-500 to-pink-500',
    'from-rose-600 to-red-400',
    'from-amber-400 to-rose-500',
    'from-pink-400 to-purple-500'
  ];

  const [hearts, setHearts] = useState<PopHeart[]>(() =>
    HEART_COMPLIMENTS.slice(0, 6).map((msg, i) => ({
      id: i,
      message: msg,
      isPopped: false,
      color: heartColors[i % heartColors.length],
      size: i % 2 === 0 ? 'w-16 h-16' : 'w-14 h-14'
    }))
  );

  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handlePop = (id: number, msg: string, e: React.MouseEvent) => {
    setHearts((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isPopped: true } : h))
    );
    setActiveMessage(msg);

    // Get click coords for localized confetti
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartShower(x, y);
  };

  const handleResetHearts = () => {
    setHearts((prev) =>
      prev.map((h) => ({
        ...h,
        isPopped: false
      }))
    );
    setActiveMessage(null);
  };

  const poppedCount = hearts.filter((h) => h.isPopped).length;

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl glass-panel text-center border border-pink-200/80 dark:border-pink-500/30 overflow-hidden flex flex-col items-center justify-between">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-rose-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 dark:text-pink-400">
          Surprise 2
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-800 dark:text-white mt-0.5">
          Memory Hearts 💕
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tap each floating heart to reveal a sweet note for you! ({poppedCount}/{hearts.length} revealed)
        </p>
      </div>

      {/* Floating Hearts Grid */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-3 max-w-sm">
        {hearts.map((h) => (
          <div key={h.id} className="relative">
            {!h.isPopped ? (
              <button
                onClick={(e) => handlePop(h.id, h.message, e)}
                type="button"
                className={`group relative ${h.size} rounded-full bg-gradient-to-tr ${h.color} shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-115 active:scale-90 transition-all duration-300 flex items-center justify-center cursor-pointer animate-gentle-float`}
                title="Tap to pop heart!"
              >
                <Heart className="w-7 h-7 text-white fill-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 text-xs">✨</span>
              </button>
            ) : (
              <div
                className={`${h.size} rounded-full border-2 border-dashed border-pink-300 dark:border-pink-800 flex items-center justify-center text-xs text-rose-400 dark:text-pink-500 opacity-60`}
                title="Heart Popped"
              >
                💌
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Revealed Active Message Banner */}
      <div className="w-full min-h-[64px] flex items-center justify-center mt-3">
        {activeMessage ? (
          <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-pink-300 dark:border-pink-500/40 shadow-md text-xs sm:text-sm font-semibold text-rose-600 dark:text-pink-300 animate-in zoom-in-95 fade-in flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>"{activeMessage}"</span>
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            Click any heart to discover what it says ✨
          </p>
        )}
      </div>

      {/* Reset button if all are popped */}
      {poppedCount === hearts.length && (
        <button
          onClick={handleResetHearts}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 text-rose-600 dark:text-pink-300 text-xs font-medium cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Pop Hearts Again</span>
        </button>
      )}
    </div>
  );
};

export default MemoryHearts;
