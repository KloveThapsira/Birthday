import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const MusicControl: React.FC = () => {
  const { isPlaying, isMuted, currentTrackTitle, togglePlay, toggleMute, switchTrack, currentTrack } = useMusic();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {/* Expanded Track Selector Card */}
      {isExpanded && (
        <div className="mb-2 w-64 p-3 rounded-2xl glass-panel shadow-2xl border border-pink-200 dark:border-pink-900/50 text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-pink-100 dark:border-slate-800 text-xs font-semibold text-rose-500 dark:text-pink-400">
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" /> Soundtrack
            </span>
            <span className="text-[10px] uppercase tracking-wider opacity-70">
              {isPlaying ? (isMuted ? 'Muted' : 'Playing') : 'Paused'}
            </span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => switchTrack('welcome')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentTrack === 'welcome'
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>1. Magical Prelude</span>
              <span className="text-[10px] opacity-80">Welcome</span>
            </button>

            <button
              onClick={() => switchTrack('celebration')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentTrack === 'celebration'
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>2. Birthday Jubilee</span>
              <span className="text-[10px] opacity-80">Party</span>
            </button>

            <button
              onClick={() => switchTrack('letter')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentTrack === 'letter'
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>3. Heartfelt Melodies</span>
              <span className="text-[10px] opacity-80">Letter</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Main Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-panel shadow-xl border border-pink-200/90 dark:border-pink-500/30">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 hover:bg-rose-600'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-700'
          }`}
          title={isPlaying ? 'Pause music' : 'Play music'}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Track Title and Equalizer */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-pink-300 transition-colors cursor-pointer select-none"
          title="Click to change soundtrack"
        >
          {/* Animated Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span
              className={`w-0.5 bg-rose-500 dark:bg-pink-400 rounded-full transition-all ${
                isPlaying && !isMuted ? 'animate-bounce h-3.5' : 'h-1'
              }`}
              style={{ animationDuration: '0.6s' }}
            />
            <span
              className={`w-0.5 bg-rose-500 dark:bg-pink-400 rounded-full transition-all ${
                isPlaying && !isMuted ? 'animate-bounce h-2.5' : 'h-2'
              }`}
              style={{ animationDuration: '0.4s', animationDelay: '0.2s' }}
            />
            <span
              className={`w-0.5 bg-rose-500 dark:bg-pink-400 rounded-full transition-all ${
                isPlaying && !isMuted ? 'animate-bounce h-3' : 'h-1.5'
              }`}
              style={{ animationDuration: '0.8s', animationDelay: '0.1s' }}
            />
          </div>

          <span className="font-medium max-w-[120px] truncate">{currentTrackTitle}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronUp className="w-3.5 h-3.5 opacity-60" />}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-pink-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default MusicControl;
