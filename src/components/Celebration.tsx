import React, { useEffect, useState } from 'react';
import { Sparkles, Heart, ArrowDown, Star, Maximize2, X } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import RealisticFireworks, { triggerCelebrationConfettiCannon } from './RealisticFireworks';
import { MEMORIES_DATA, MemoryItem } from '../data/memories';

interface CelebrationProps {
  onStartJourney: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({ onStartJourney }) => {
  const { switchTrack } = useMusic();
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);

  useEffect(() => {
    switchTrack('celebration');
    triggerCelebrationConfettiCannon();
  }, [switchTrack]);

  const handleStart = () => {
    triggerCelebrationConfettiCannon();
    switchTrack('journey');
    onStartJourney();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 sm:px-6 text-center z-10 overflow-hidden select-none">
      {/* Fullscreen Canvas Fireworks positioned fixed at inset: 0 with heart bursts */}
      <RealisticFireworks interactive={true} autoLaunch={true} className="opacity-95" />

      {/* Main Content Stage */}
      <div className="relative max-w-5xl mx-auto space-y-8 z-10 my-auto">
        {/* Top Kicker */}
        <div className="flex items-center justify-center gap-2 text-rose-500 dark:text-pink-400">
          <Sparkles className="w-5 h-5 animate-sparkle" />
          <span className="text-xs uppercase tracking-[0.25em] font-bold font-body">
            A Celestial Birthday Celebration
          </span>
          <Sparkles className="w-5 h-5 animate-sparkle" />
        </div>

        {/* Section Header with exact Playfair Display + 0 0 10px rgba(255, 78, 138, 0.4) glow */}
        <h2 className="text-xl sm:text-2xl font-bold section-header-glow tracking-wide text-rose-600 dark:text-pink-300">
          Honoring an Extraordinary Sister by Heart
        </h2>

        {/* Hero Birthday Title with Dancing Script, 4.5rem bold, gradient, and 2.5s text wipe reveal */}
        <div className="py-2 overflow-hidden flex justify-center">
          <div className="animate-text-wipe max-w-full">
            <h1 className="hero-birthday-title tracking-normal select-none">
              Happy Birthday Nagalakshmi!
            </h1>
          </div>
        </div>

        <div className="text-3xl sm:text-4xl tracking-widest">🎂🎉💖</div>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 max-w-xl mx-auto font-body leading-relaxed">
          Honoring an exceptional soul sister whose elegance, kindness, and radiant spirit bring genuine warmth to everyone fortunate to know her. May this milestone year unfold with boundless triumphs, pure serenity, and magnificent moments.
        </p>

        {/* ============================================================== */}
        {/* HANGING PHOTOS WITH GLOWING NEON FRAME CARDS */}
        {/* ============================================================== */}
        <div className="relative pt-6 pb-2 max-w-4xl mx-auto">
          {/* Glowing Fairy Light Wire */}
          <div className="relative w-full h-1 bg-gradient-to-r from-amber-400/20 via-amber-300/80 to-amber-400/20 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)] mb-6">
            <div className="absolute -top-1.5 left-[12%] w-3 h-3 rounded-full bg-yellow-200 shadow-[0_0_10px_rgba(251,191,36,1)] animate-ping" />
            <div className="absolute -top-1.5 left-[37%] w-3 h-3 rounded-full bg-yellow-200 shadow-[0_0_10px_rgba(251,191,36,1)] animate-pulse" />
            <div className="absolute -top-1.5 left-[62%] w-3 h-3 rounded-full bg-yellow-200 shadow-[0_0_10px_rgba(251,191,36,1)] animate-ping" />
            <div className="absolute -top-1.5 left-[87%] w-3 h-3 rounded-full bg-yellow-200 shadow-[0_0_10px_rgba(251,191,36,1)] animate-pulse" />
          </div>

          {/* 4 Hanging Cards using 4-Step Animated Neon Glow Box-Shadow */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {MEMORIES_DATA.map((mem, idx) => {
              const isEven = idx % 2 === 0;
              const swayClass = isEven ? 'animate-sway-left' : 'animate-sway-right';

              return (
                <div
                  key={mem.id}
                  className={`flex flex-col items-center cursor-pointer group transition-all duration-300 ${swayClass}`}
                  style={{
                    animationDelay: `${idx * 0.35}s`
                  }}
                  onClick={() => setSelectedPhoto(mem)}
                >
                  {/* Hanging Twine String + Wooden Clip */}
                  <div className="w-0.5 h-6 sm:h-8 bg-amber-300/70 shadow-sm" />
                  <div className="w-4 h-3 bg-amber-600 rounded-sm shadow-md border border-amber-800 -mb-1 z-20 flex items-center justify-center text-[8px] text-amber-200 font-bold select-none">
                    📎
                  </div>

                  {/* 4-Step Neon Glow Card Frame */}
                  <div className="relative w-full rounded-2xl p-2.5 sm:p-3 bg-white/95 dark:bg-black/90 neon-card-glow group-hover:scale-105 transition-transform duration-300 text-left">
                    <div className="aspect-[4/3] w-full bg-slate-950 rounded-xl overflow-hidden relative mb-2">
                      <img
                        src={mem.image}
                        alt={mem.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="px-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate font-display">
                        {mem.title}
                      </p>
                      <p className="text-[10px] text-rose-500 dark:text-pink-400 font-semibold truncate mt-0.5 font-body">
                        {mem.tag}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE MAGIC BUTTON (PILL-SHAPED, GLOW PULSE, LIGHT SHEEN) */}
        {/* ============================================================== */}
        <div className="pt-6 sm:pt-8 pb-4">
          <button
            onClick={handleStart}
            type="button"
            className="magic-button inline-flex items-center gap-3 px-10 sm:px-12 py-5 rounded-full font-bold text-lg sm:text-xl text-white cursor-pointer select-none"
          >
            <span className="font-display tracking-wide">Start the Birthday Journey ✨</span>
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </button>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-body">
            Tap any hanging photo to view full keepsake memory
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full p-5 rounded-3xl bg-white dark:bg-slate-900 border border-pink-500/50 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-rose-500 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden mb-3 aspect-[4/3] bg-black">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {selectedPhoto.title}
            </h3>
            <p className="text-xs text-rose-500 dark:text-pink-400 font-semibold mb-1">
              {selectedPhoto.tag}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
              {selectedPhoto.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Celebration;
