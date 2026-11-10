import React, { useState } from 'react';
import { Gift, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { triggerHeartShower } from './Fireworks';
import { GIFT_SURPRISES } from '../data/messages';

export const GiftSurprise: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSurpriseIndex, setCurrentSurpriseIndex] = useState(0);

  const surprise = GIFT_SURPRISES[currentSurpriseIndex % GIFT_SURPRISES.length];

  const handleOpenGift = () => {
    if (!isOpen) {
      setIsOpen(true);
      triggerHeartShower(0.5, 0.45);
    }
  };

  const handleNextOrReset = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => {
        setCurrentSurpriseIndex((prev) => (prev + 1) % GIFT_SURPRISES.length);
      }, 300);
    }
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl glass-panel text-center border border-pink-200/80 dark:border-pink-500/30 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-pink-500/10 pointer-events-none" />

      {/* Header */}
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 dark:text-pink-400">
          Surprise 1
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-800 dark:text-white mt-0.5">
          {isOpen ? "Surprise Unwrapped! 🎁✨" : "Tap the Gift! 🎁"}
        </h3>
      </div>

      {/* Gift Box Container */}
      <div className="relative py-4 my-2 flex items-center justify-center min-h-[170px]">
        {!isOpen ? (
          <button
            onClick={handleOpenGift}
            className="group relative cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95"
            title="Click to unwrap gift"
          >
            {/* Animated Glow Halo */}
            <div className="absolute -inset-4 bg-pink-500/20 rounded-full blur-xl group-hover:bg-pink-500/35 transition-all" />

            {/* Stylized Gift Icon and Ribbon */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 shadow-xl shadow-rose-500/30 flex items-center justify-center border-2 border-white/60 animate-bounce">
              <Gift className="w-14 h-14 text-white drop-shadow-md" />
              {/* Ribbon cross */}
              <div className="absolute inset-x-0 h-3 bg-amber-300/90 shadow-sm top-1/2 -translate-y-1/2" />
              <div className="absolute inset-y-0 w-3 bg-amber-300/90 shadow-sm left-1/2 -translate-x-1/2" />
              <div className="absolute -top-3 w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center text-xs text-amber-900 font-bold shadow-md">
                🎀
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-rose-600 dark:text-pink-300 animate-pulse">
              Click to Open 💖
            </p>
          </button>
        ) : (
          /* Opened Gift Box Content */
          <div className="relative max-w-sm w-full p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-pink-300 dark:border-pink-500/40 shadow-xl animate-in zoom-in-90 fade-in duration-500">
            <div className="flex items-center justify-center gap-1.5 text-rose-500 dark:text-pink-400 mb-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold tracking-wider uppercase">{surprise.badge}</span>
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>

            <h4 className="font-bold text-slate-800 dark:text-white text-base mb-2 font-display">
              {surprise.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              "{surprise.content}"
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-pink-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <span className="font-handwriting text-base text-rose-500 dark:text-pink-400">
                {surprise.signature}
              </span>
              <button
                onClick={handleNextOrReset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 text-rose-600 dark:text-pink-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Wrap Box</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftSurprise;
