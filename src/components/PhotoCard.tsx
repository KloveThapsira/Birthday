import React, { useState } from 'react';
import { MemoryItem } from '../data/memories';
import { Heart, Maximize2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface PhotoCardProps {
  memory: MemoryItem;
  onClick: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ memory, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-3xl glass-panel p-3.5 sm:p-4 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_0_25px_rgba(255,78,138,0.4),0_0_50px_rgba(157,77,255,0.2)] border border-pink-200/90 dark:border-pink-500/40 hover:border-rose-400 dark:hover:border-pink-400 flex flex-col justify-between"
    >
      {/* Radiant Glowing Neon Backlight on Hover */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500/0 via-rose-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none -z-10" />

      {/* Soft Ambient Card Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-pink-500/5 via-rose-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Photo Frame Container with Glowing Border */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-rose-100/50 dark:bg-slate-800/80 mb-3.5 border border-pink-200/60 dark:border-pink-500/30 group-hover:border-rose-300 dark:group-hover:border-pink-400 transition-colors shadow-sm">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-rose-300 dark:text-pink-500/50 animate-pulse">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-rose-100 to-pink-200 dark:from-slate-800 dark:to-pink-950/40 text-slate-700 dark:text-slate-200">
            <Sparkles className="w-8 h-8 text-rose-500 mb-2" />
            <p className="text-xs font-semibold">{memory.title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Photo placeholder</p>
          </div>
        ) : (
          <img
            src={memory.image}
            alt={memory.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Floating Tag */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
          {memory.tag}
        </div>

        {/* Quick Zoom Indicator */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Card Content */}
      <div className="px-1 space-y-1.5 text-left">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white group-hover:text-rose-500 dark:group-hover:text-pink-400 transition-colors">
            {memory.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="p-1 rounded-full hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Heart this memory"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'
              }`}
            />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {memory.caption}
        </p>

        <div className="pt-2 flex items-center justify-between text-[11px] text-rose-500 dark:text-pink-400/90 font-medium">
          <span>{memory.date}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 dark:text-slate-500">
            Click to view full photo →
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
