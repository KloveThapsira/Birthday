import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Heart, Sparkles, Play, Pause, RotateCcw, X, Feather } from 'lucide-react';
import { BIRTHDAY_LETTER_DATA } from '../data/birthdayLetter';
import { useMusic } from '../context/MusicContext';
import confetti from 'canvas-confetti';

// Soft realistic typewriter / quill pen tick sound
const playPenTick = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820 + Math.random() * 160, now);

    gain.gain.setValueAtTime(0.012, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {}
};

export const BirthdayLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>([]);
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState<'fast' | 'superfast'>('superfast');

  const { switchTrack } = useMusic();
  const typewriterTimerRef = useRef<number | null>(null);

  const fullParagraphs = [
    BIRTHDAY_LETTER_DATA.salutation,
    ...BIRTHDAY_LETTER_DATA.paragraphs,
    `${BIRTHDAY_LETTER_DATA.closing}\n${BIRTHDAY_LETTER_DATA.signature}`,
    BIRTHDAY_LETTER_DATA.postScript
  ];

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    switchTrack('letter');

    // Gentle, reduced heart spark burst
    confetti({
      particleCount: 22,
      spread: 60,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ff4e8a', '#ff85a2', '#ffd700']
    });

    setDisplayedParagraphs([]);
    setCurrentParaIndex(0);
    setCurrentCharIndex(0);
    setIsPaused(false);
    setIsFinished(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
  };

  const handleReplay = () => {
    setDisplayedParagraphs([]);
    setCurrentParaIndex(0);
    setCurrentCharIndex(0);
    setIsPaused(false);
    setIsFinished(false);
  };

  const handleShowAll = () => {
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    setDisplayedParagraphs(fullParagraphs);
    setCurrentParaIndex(fullParagraphs.length);
    setIsFinished(true);
  };

  // Fast, snappy typewriter effect (progressive character-by-character text reveal)
  useEffect(() => {
    if (!isOpen || isPaused || isFinished) return;

    if (currentParaIndex >= fullParagraphs.length) {
      setIsFinished(true);
      confetti({
        particleCount: 28,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ff4e8a', '#ec4899', '#fbbf24']
      });
      return;
    }

    const currentTargetText = fullParagraphs[currentParaIndex];
    // Superfast constant typing speed
    const step = speed === 'superfast' ? 2 : 1;
    const delay = speed === 'superfast' ? 3 : 5;

    typewriterTimerRef.current = window.setInterval(() => {
      if (currentCharIndex < currentTargetText.length) {
        const nextChar = Math.min(currentCharIndex + step, currentTargetText.length);
        setCurrentCharIndex(nextChar);

        if (nextChar % 8 === 0) playPenTick();

        setDisplayedParagraphs((prev) => {
          const updated = [...prev];
          updated[currentParaIndex] = currentTargetText.substring(0, nextChar);
          return updated;
        });
      } else {
        if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
        // Snappy inter-paragraph transition
        setTimeout(() => {
          setCurrentParaIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, speed === 'superfast' ? 35 : 60);
      }
    }, delay);

    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    };
  }, [isOpen, isPaused, isFinished, currentParaIndex, currentCharIndex, speed, fullParagraphs]);

  // Modal dialog rendered via Portal directly into document.body so background scrolling cannot hide it
  const modalContent = isOpen && typeof document !== 'undefined' ? createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={handleClose}
    >
      {/* Parchment Paper Container with deckled border & shadow */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl vintage-parchment rounded-[22px] p-6 sm:p-12 text-left my-auto transition-all transform animate-in zoom-in-95 duration-300 select-text overflow-hidden z-[101]"
        style={{
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: '22px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
        }}
      >
        {/* Heartfelt Wax Seal Stamp Emblem */}
        <div className="absolute top-4 sm:top-6 left-6 sm:left-10 flex items-center gap-2 select-none">
          <div
            className="w-10 h-10 rounded-full bg-rose-700 text-amber-100 flex items-center justify-center shadow-md font-bold text-sm border-2 border-rose-900 select-none transform -rotate-12"
            title="Heartfelt Seal Emblem"
          >
            ❤️
          </div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-rose-800 dark:text-rose-200 font-body">
            Dedicated to My Sister by Heart 🌸
          </span>
        </div>

        {/* Top Floating Minimalist Controls */}
        <div className="flex items-center justify-end gap-2 mb-8 select-none">
          <button
            onClick={() => setSpeed(speed === 'superfast' ? 'fast' : 'superfast')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-amber-900/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer font-body flex items-center gap-1"
            title="Toggle typing pace"
          >
            <span>{speed === 'superfast' ? '⚡ Superfast' : 'Fast'}</span>
          </button>

          {!isFinished && (
            <button
              onClick={handleShowAll}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-amber-900/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer font-body"
              title="Show all text"
            >
              Show All
            </button>
          )}

          {!isFinished && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg border border-amber-900/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
              title={isPaused ? 'Resume typing' : 'Pause typing'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleReplay}
            className="p-1.5 rounded-lg border border-amber-900/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
            title="Replay letter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg border border-amber-900/20 hover:bg-rose-100/80 text-rose-700 dark:hover:bg-amber-950/60 transition-colors cursor-pointer"
            title="Close Letter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Letter Content: 1.4rem (22px), line-height: 1.8, handwritten script, pulsing pink ink cursor */}
        <div
          className="space-y-6 pt-2 font-handwriting"
          style={{
            fontSize: '1.4rem',
            lineHeight: '1.8',
            letterSpacing: '0.015em'
          }}
        >
          {displayedParagraphs.map((para, idx) => {
            const isSalutation = idx === 0;
            const isSignature = idx === fullParagraphs.length - 2;
            const isPS = idx === fullParagraphs.length - 1;
            const isCurrentlyTyping = idx === displayedParagraphs.length - 1 && !isFinished;

            if (isSalutation) {
              return (
                <div key={idx} className="font-display font-bold text-2xl sm:text-3xl pb-1">
                  {para}
                  {isCurrentlyTyping && (
                    <span
                      className="inline-block font-sans font-bold text-rose-500 dark:text-rose-400 ml-1 animate-cursor-blink align-baseline"
                      style={{ color: '#ff4e8a' }}
                    >
                      |
                    </span>
                  )}
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`${
                  isSignature
                    ? 'font-bold text-2xl sm:text-3xl pt-3'
                    : isPS
                    ? 'text-lg italic pt-2 border-t border-amber-900/15'
                    : ''
                }`}
              >
                <p className="whitespace-pre-line">
                  {para}
                  {isCurrentlyTyping && (
                    <span
                      className="inline-block font-sans font-bold text-rose-500 dark:text-rose-400 ml-1 animate-cursor-blink align-baseline"
                      style={{ color: '#ff4e8a' }}
                    >
                      |
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* Finished Ribbon & Seal Footer */}
        {isFinished && (
          <div className="mt-10 pt-6 border-t border-amber-900/20 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
            <span className="font-semibold flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-body">
              <Heart className="w-4 h-4 fill-current" />
              Sealed with timeless brotherly affection
            </span>

            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-amber-900/10 dark:bg-amber-100/10 hover:bg-amber-900/20 font-bold transition-colors cursor-pointer font-body"
            >
              Keep in Heart 💖
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <section id="letter-section" className="relative py-16 px-4 sm:px-6 max-w-4xl mx-auto z-10">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/80 dark:bg-pink-950/60 border border-rose-200 dark:border-pink-800 text-rose-600 dark:text-pink-300 text-xs font-semibold">
          <Feather className="w-3.5 h-3.5" />
          <span>Words Written from the Heart 💕</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-wide text-rose-600 dark:text-pink-300">
          A Letter Written Just for You 💌
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-body">
          Honoring an exceptional sister by heart with timeless handwritten words.
        </p>
      </div>

      {/* Envelope Card in Page Flow */}
      <div className="flex justify-center">
        <div
          onClick={handleOpenEnvelope}
          className="group relative cursor-pointer p-8 sm:p-12 rounded-3xl glass-panel glow-box-pink border-2 border-dashed border-pink-300 dark:border-pink-500/40 text-center max-w-md w-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-400"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
            <Mail className="w-10 h-10 animate-bounce" />
          </div>

          <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-2">
            Tap to Open Your Letter
          </h3>
          <p className="text-xs text-rose-600 dark:text-pink-400 font-medium font-body">
            A heartfelt, timeless letter for Nagalakshmi 💖
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold shadow-md group-hover:from-rose-600 group-hover:to-pink-600 transition-all font-body">
            <span>Read Letter</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Portal Modal Dialog */}
      {modalContent}
    </section>
  );
};

export default BirthdayLetter;
