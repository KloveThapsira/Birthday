/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { MusicProvider, useMusic } from './context/MusicContext';
import PasswordScreen from './components/PasswordScreen';
import Countdown from './components/Countdown';
import Celebration from './components/Celebration';
import PhotoGallery from './components/PhotoGallery';
import GiftSurprise from './components/GiftSurprise';
import MemoryHearts from './components/MemoryHearts';
import BirthdayCake from './components/BirthdayCake';
import BirthdayLetter from './components/BirthdayLetter';
import FinalScreen from './components/FinalScreen';
import ThemeToggle from './components/ThemeToggle';
import MusicControl from './components/MusicControl';
import FloatingParticles from './components/FloatingParticles';
import CursorSparkles from './components/CursorSparkles';
import RealisticFireworks from './components/RealisticFireworks';
import { Heart, Sparkles, Gift, ArrowUp } from 'lucide-react';

type JourneyStage = 'password' | 'countdown' | 'celebration' | 'journey';

function BirthdayAppContent() {
  const [stage, setStage] = useState<JourneyStage>('password');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { switchTrack } = useMusic();

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUnlock = () => {
    setStage('countdown');
  };

  const handleCountdownComplete = () => {
    setStage('celebration');
  };

  const handleStartJourney = () => {
    setStage('journey');
    // Switch to separate journey background music
    switchTrack('journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden">
      {/* Gentle Floating Hearts Flow Across Entire Website */}
      <FloatingParticles count={18} type="hearts" />

      {/* Desktop Mouse Sparkle Trail */}
      <CursorSparkles />

      {/* Floating Audio Player */}
      <MusicControl />

      {/* Stage 1: Welcome & Segmented Day/Month/Year Authentication */}
      {stage === 'password' && (
        <div className="relative">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <PasswordScreen onUnlock={handleUnlock} />
        </div>
      )}

      {/* Stage 2: 10-Second Countdown with Real Cracker Detonation */}
      {stage === 'countdown' && (
        <div className="relative bg-[#05070f] min-h-screen text-slate-100">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Countdown onComplete={handleCountdownComplete} />
        </div>
      )}

      {/* Stage 3: Grand Birthday Celebration Banner with Photos Showcase */}
      {stage === 'celebration' && (
        <div className="relative bg-[#05070f] min-h-screen">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Celebration onStartJourney={handleStartJourney} />
        </div>
      )}

      {/* Stage 4: Full Birthday Journey Experience */}
      {stage === 'journey' && (
        <div className="relative animate-in fade-in duration-700">
          {/* Continuous Heart Cracker Fireworks across the journey page */}
          <RealisticFireworks interactive={true} autoLaunch={true} className="opacity-75 z-0" />

          {/* Top Bar adhering to Top Bar Contract */}
          <header className="sticky top-0 z-40 w-full glass-panel border-b border-pink-200/60 dark:border-pink-900/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
              {/* Zone 1: Single element brand wordmark */}
              <a
                href="#hero"
                className="text-lg font-bold tracking-tight text-rose-600 dark:text-pink-400 font-display whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <span>Nagalakshmi's Celebration</span>
                <Heart className="w-4 h-4 fill-current text-rose-500" />
              </a>

              {/* Zone 2: Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                <button
                  onClick={() => scrollToSection('memories-section')}
                  className="hover:text-rose-600 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Memories
                </button>
                <button
                  onClick={() => scrollToSection('surprises-section')}
                  className="hover:text-rose-600 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Surprises
                </button>
                <button
                  onClick={() => scrollToSection('letter-section')}
                  className="hover:text-rose-600 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Birthday Letter
                </button>
                <button
                  onClick={() => scrollToSection('wishes-section')}
                  className="hover:text-rose-600 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Blessings & Wishes
                </button>
              </nav>

              {/* Zone 3: Primary Action / Theme Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main id="hero" className="space-y-8 sm:space-y-10">
            {/* Journey Hero Ribbon with Big High-End Typography (No date clutter) */}
            <div className="pt-12 sm:pt-16 pb-2 sm:pb-3 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 dark:bg-pink-950/60 border border-rose-200 dark:border-pink-800 text-rose-600 dark:text-pink-300 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Special Sister by Heart</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>

              {/* Big, Breathtaking Headline */}
              <div className="py-2">
                <h1 className="hero-birthday-title text-4xl sm:text-6xl md:text-7xl">
                  Happy Birthday Nagalakshmi!
                </h1>
              </div>

              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-body font-medium leading-relaxed">
                A heartfelt tribute filled with cherished memories, interactive gifts, blessings, and words written just for you.
              </p>
            </div>

            {/* Photo Memories Gallery */}
            <PhotoGallery />

            {/* Surprises Section */}
            <section id="surprises-section" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto z-10">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/80 dark:bg-pink-950/60 border border-rose-200 dark:border-pink-800 text-rose-600 dark:text-pink-300 text-xs font-semibold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Magic Moments</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white font-display">
                  Birthday Surprise 🎁
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Touch, tap, and interact with each surprise below!
                </p>
              </div>

              {/* 3 Interactive Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GiftSurprise />
                <MemoryHearts />
                <BirthdayCake />
              </div>
            </section>

            {/* Birthday Letter Section with Running Notes */}
            <BirthdayLetter />

            {/* Final Celebration & Interactive Blessings with Reaction Mailbox */}
            <div id="wishes-section">
              <FinalScreen />
            </div>
          </main>

          {/* Quick Back to Top Button */}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-20 right-4 z-30 p-2.5 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-110"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <BirthdayAppContent />
      </MusicProvider>
    </ThemeProvider>
  );
}
