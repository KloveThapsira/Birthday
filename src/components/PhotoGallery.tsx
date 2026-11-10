import React, { useState, useEffect } from 'react';
import { MEMORIES_DATA, MemoryItem } from '../data/memories';
import PhotoCard from './PhotoCard';
import { Sparkles, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openLightbox = (item: MemoryItem, index: number) => {
    setSelectedPhoto(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const nextIdx = (currentIndex + 1) % MEMORIES_DATA.length;
    setCurrentIndex(nextIdx);
    setSelectedPhoto(MEMORIES_DATA[nextIdx]);
  };

  const prevPhoto = () => {
    const prevIdx = (currentIndex - 1 + MEMORIES_DATA.length) % MEMORIES_DATA.length;
    setCurrentIndex(prevIdx);
    setSelectedPhoto(MEMORIES_DATA[prevIdx]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, currentIndex]);

  return (
    <section id="memories-section" className="relative pt-1 sm:pt-2 pb-16 px-4 sm:px-6 max-w-6xl mx-auto z-10">
      {/* Spotlight Image: Positioned Exactly In-Between Heartfelt Tribute and Cherished Chapters */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
        <div
          onClick={() => openLightbox(MEMORIES_DATA[1], 1)}
          className="group relative cursor-pointer text-center"
          title="Click to view full spotlight photo"
        >
          {/* Ambient Glow Halo */}
          <div className="absolute -inset-2.5 sm:-inset-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse" />

          {/* Glowing Portrait Container */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 neon-card-glow spotlight-glow bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 shadow-2xl transition-all duration-500 group-hover:scale-105">
            <img
              src="/src/assets/images/memory_festive_smile_1794297842366.jpg"
              alt="Nagalakshmi Birthday Spotlight"
              className="w-full h-full object-cover rounded-full border-2 border-white/80 dark:border-slate-900/80 shadow-inner"
              referrerPolicy="no-referrer"
            />

            {/* Glowing Corner Badge */}
            <div className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-900 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-panel border border-pink-300/80 dark:border-pink-500/50 text-[11px] font-bold text-rose-600 dark:text-pink-300 shadow-sm hover:border-rose-400 transition-colors">
            <span>✨ Birthday Spotlight ✨</span>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/80 dark:bg-pink-950/60 border border-rose-200 dark:border-pink-800 text-rose-600 dark:text-pink-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Cherished Chapters</span>
        </div>

        {/* Crisp, Beautiful Heading (No Glow) */}
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-800 dark:text-white transition-all">
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 dark:from-pink-300 dark:via-rose-300 dark:to-amber-200 bg-clip-text text-transparent">
            Beautiful Memories We Share
          </span>{' '}
          <span className="inline-block text-rose-500 dark:text-pink-400">💕</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Every picture holds heartfelt moments and conversations that time will never fade.
        </p>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel text-xs text-slate-700 dark:text-slate-200 border border-pink-200/60 dark:border-pink-900/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-rose-500 dark:text-pink-400">
              Celebrating Nagalakshmi's Grace, Smiles & Dreams ✨
            </span>
          </div>
        </div>
      </div>

      {/* Photo Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MEMORIES_DATA.map((memory, idx) => (
          <PhotoCard
            key={memory.id}
            memory={memory}
            onClick={() => openLightbox(memory, idx)}
          />
        ))}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900/95 border border-pink-500/30 rounded-3xl p-4 sm:p-6 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="w-full max-h-[65vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 mb-4">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="space-y-1 text-left px-2">
              <div className="flex items-center justify-between text-xs text-pink-400 font-medium">
                <span>{selectedPhoto.tag}</span>
                <span>Photo {currentIndex + 1} of {MEMORIES_DATA.length}</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                {selectedPhoto.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
