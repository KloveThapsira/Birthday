import React, { useState, useEffect } from 'react';
import { COUNTDOWN_MESSAGES, CountdownItem } from '../data/messages';
import { Sparkles, Heart } from 'lucide-react';
import { fireworkAudioEngine } from './RealisticFireworks';
import confetti from 'canvas-confetti';
import { useMusic } from '../context/MusicContext';

interface CountdownProps {
  onComplete: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { switchTrack } = useMusic();

  const currentItem: CountdownItem = COUNTDOWN_MESSAGES[currentStepIndex] || COUNTDOWN_MESSAGES[COUNTDOWN_MESSAGES.length - 1];

  useEffect(() => {
    switchTrack('celebration');
  }, [switchTrack]);

  useEffect(() => {
    // Launch sound and spark on lower numbers
    if (currentItem.count <= 3) {
      fireworkAudioEngine.playLaunch();
      setTimeout(() => fireworkAudioEngine.playBurst(), 400);

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#f43f5e', '#fb7185', '#ffd700']
      });
    }

    if (currentStepIndex < COUNTDOWN_MESSAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished -> BIG REAL CRACKER BURST!
      fireworkAudioEngine.playLaunch();
      setTimeout(() => {
        fireworkAudioEngine.playBurst();
      }, 350);

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#f59e0b', '#38bdf8', '#ffffff']
      });

      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, currentItem.count, onComplete]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 overflow-hidden bg-[#05070f] select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Something Magical Unfolding</span>
          <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
        </div>

        <div className="py-2">
          <div
            key={currentItem.count}
            className={`text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r ${currentItem.gradient} bg-clip-text text-transparent font-display animate-in zoom-in-75 fade-in duration-500 transform drop-shadow-xl select-none`}
          >
            {currentItem.count}
          </div>
        </div>

        <div key={`msg-${currentItem.count}`} className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            {currentItem.message}
          </h2>
          <p className="text-base sm:text-lg text-pink-300 font-medium">
            {currentItem.subtext}
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-4">
          {COUNTDOWN_MESSAGES.map((item, idx) => (
            <div
              key={item.count}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-6 bg-pink-400'
                  : idx < currentStepIndex
                  ? 'w-2 bg-pink-700'
                  : 'w-1.5 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <div className="pt-4">
          <button
            onClick={onComplete}
            type="button"
            className="text-xs text-slate-500 hover:text-pink-300 underline underline-offset-4 cursor-pointer transition-colors"
          >
            Skip countdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
