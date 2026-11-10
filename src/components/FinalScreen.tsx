import React, { useState } from 'react';
import { Sparkles, Heart, Star, Mail, Send, Check, Copy } from 'lucide-react';
import { SECRET_MESSAGE } from '../data/messages';
import confetti from 'canvas-confetti';

interface BlessingItem {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  detailedWish: string;
  color: string;
}

const BLESSINGS_DATA: BlessingItem[] = [
  {
    id: 'love',
    icon: '❤️',
    title: 'Unconditional Love',
    shortDesc: 'A heart surrounded by genuine souls',
    detailedWish: 'May you always be surrounded by people who cherish your purity, protect your peace, and value you for exactly who you are.',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'laughter',
    icon: '😊',
    title: 'Radiant Laughter',
    shortDesc: 'Endless reasons to smile every single day',
    detailedWish: 'May your days be sprinkled with genuine giggles, carefree laughter, and moments that make your soul dance with lighthearted joy.',
    color: 'from-amber-400 to-orange-400'
  },
  {
    id: 'dreams',
    icon: '✨',
    title: 'Limitless Dreams',
    shortDesc: 'The courage to reach every aspiration',
    detailedWish: 'May every vision you build and dream you nurture turn into magnificent milestones. The world is waiting for your unique brilliance.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'happiness',
    icon: '💖',
    title: 'Endless Happiness',
    shortDesc: 'Deep peace and lasting fulfillment',
    detailedWish: 'May a sense of serene contentment and profound joy anchor you through every season of your life. You deserve all the good things.',
    color: 'from-pink-500 to-rose-400'
  },
  {
    id: 'wisdom',
    icon: '🕊️',
    title: 'Inner Wisdom & Peace',
    shortDesc: 'Clarity and calm strength in every step',
    detailedWish: 'May you navigate life with grace, clarity of mind, and the peaceful assurance that you are deeply grounded and capable of greatness.',
    color: 'from-sky-400 to-teal-400'
  },
  {
    id: 'success',
    icon: '🌟',
    title: 'Unstoppable Success',
    shortDesc: 'Triumphs in studies, career, and life',
    detailedWish: 'May doors of golden opportunities fly open wherever you walk, rewarding your hard work, talent, and kind character tenfold.',
    color: 'from-amber-400 to-yellow-300'
  }
];

// Soft golden chime for interactive wishes
const playWishChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch {}
};

export const FinalScreen: React.FC = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [activeBlessing, setActiveBlessing] = useState<BlessingItem | null>(null);

  // Concluding wish saved state
  const [isWishSaved, setIsWishSaved] = useState(false);

  // Mail surprise message state
  const [senderName, setSenderName] = useState('Nagalakshmi');
  const [surpriseNote, setSurpriseNote] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSecretClick = () => {
    setShowSecret(true);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fbbf24', '#c084fc']
    });
  };

  const handleBlessingClick = (blessing: BlessingItem) => {
    setActiveBlessing(blessing);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ffd700', '#f43f5e', '#ec4899']
    });
  };

  const handleSaveWish = () => {
    playWishChime();
    const fullWish = `Dear Nagalakshmi, life is an endless tapestry of possibilities, and having you as a cherished sister by heart is one of its most graceful blessings. Walk into this new year with unwavering confidence ✨, knowing that your dignity, intellect, and pure spirit have the power to illuminate any room. May the universe conspire to surround you with boundless peace 🌿, protect your gentle heart, and reward your highest aspirations with unyielding triumph 🏆. Always cheering for your happiness, dreams, and success as a proud brother figure · Forever Treasured 💖`;
    navigator.clipboard.writeText(fullWish);
    setIsWishSaved(true);
    setTimeout(() => setIsWishSaved(false), 2500);
  };

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = 'kishorekannan146@gmail.com';
    const noteContent = surpriseNote.trim() || 'Thank you so much for this wonderful birthday surprise! 💖';
    const subject = encodeURIComponent(`Birthday Surprise Response from ${senderName}! 🎁💖`);
    const body = encodeURIComponent(
      `Dear Brother,\n\n${noteContent}\n\nWith heartfelt love & gratitude,\n${senderName}`
    );

    setIsSent(true);
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#ffd700', '#38bdf8']
    });

    // Trigger mail client
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  const handleCopyNote = () => {
    const noteContent = surpriseNote.trim() || 'Thank you so much for this wonderful birthday surprise! 💖';
    navigator.clipboard.writeText(
      `To: kishorekannan146@gmail.com\n\n${noteContent}\n\n- ${senderName}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2400);
  };

  return (
    <footer className="relative py-20 px-4 sm:px-6 z-10 text-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-tr from-rose-500/15 via-pink-500/10 to-amber-500/15 blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-4xl mx-auto space-y-12">
        {/* Interactive Blessings Card Container */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl glow-box-pink border border-pink-200/90 dark:border-pink-500/40 relative">
          {/* Secret Easter Egg Icon */}
          <div className="flex justify-end -mt-3 sm:-mt-5 mb-2">
            <button
              onClick={handleSecretClick}
              type="button"
              className="group relative p-2 text-pink-300 dark:text-pink-600 hover:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
              title="A hidden star..."
            >
              <Star className="w-5 h-5 group-hover:scale-125 transition-transform animate-spin" style={{ animationDuration: '6s' }} />
              <span className="sr-only">Secret message</span>
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-sm uppercase tracking-widest font-black text-rose-500 dark:text-pink-400">
              Lifetime Blessings
            </h3>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-800 dark:text-white">
              May Your Life Always Be Blessed With ✨
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Tap on any blessing below to unfold a personal wish for your path ahead.
            </p>
          </div>

          {/* Interactive Blessing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 text-left">
            {BLESSINGS_DATA.map((b) => (
              <div
                key={b.id}
                onClick={() => handleBlessingClick(b)}
                className="group relative cursor-pointer p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-pink-200 dark:border-pink-500/30 hover:border-pink-400 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {b.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-rose-500 dark:group-hover:text-pink-400 transition-colors font-display">
                  {b.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {b.shortDesc}
                </p>
                <span className="inline-block text-[10px] text-rose-500 dark:text-pink-400 font-medium mt-2">
                  Tap to read wish →
                </span>
              </div>
            ))}
          </div>

          {/* Heartfelt End-of-Website Final Wishes Message */}
          <div className="pt-8 space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display tracking-tight text-slate-800 dark:text-white leading-snug">
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 dark:from-pink-300 dark:via-rose-300 dark:to-amber-200 bg-clip-text text-transparent">
                May Your Life Forever Shine Bright & Beautiful
              </span>{' '}
              <span className="inline-block text-rose-500 dark:text-pink-400">🌸✨</span>
            </h2>

            <div className="relative max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border-2 border-pink-200/90 dark:border-pink-500/40 shadow-xl text-center space-y-5 transition-all hover:border-rose-400/80 overflow-hidden">
              {/* Soft Ambient Neon Glow Behind Card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 blur-xl pointer-events-none -z-10" />

              {/* Heart Emblem */}
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md -mb-2">
                <Heart className="w-6 h-6 fill-current" />
              </div>

              {/* The Core Wish Content (Clean Text Alone - No Highlight Boxes) */}
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-body">
                "Dear Nagalakshmi, life is an endless tapestry of possibilities, and having you as a cherished sister by heart is one of its most graceful blessings. Walk into this new year with unwavering confidence ✨, knowing that your dignity, intellect, and pure spirit have the power to illuminate any room. May the universe conspire to surround you with boundless peace 🌿, protect your gentle heart, and reward your highest aspirations with unyielding triumph 🏆."
              </p>

              {/* Brotherly Signoff */}
              <div className="pt-1 flex items-center justify-center gap-2 text-xs sm:text-sm text-rose-600 dark:text-pink-300 font-semibold font-display italic">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Always cheering for your happiness, dreams, and success as a proud brother figure · Forever Treasured 💖</span>
              </div>

              {/* Interactive Action Bar on Card (Shower Blessings removed as requested) */}
              <div className="pt-3 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleSaveWish}
                  className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-800/60 text-slate-700 dark:text-slate-200 hover:bg-pink-50 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  {isWishSaved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-rose-500" />}
                  <span>{isWishSaved ? 'Wish Copied to Clipboard!' : 'Save This Wish to Keepsake 📜'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mail Response / Surprise Feedback Box */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-pink-200/90 dark:border-pink-500/40 text-left relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-slate-800 dark:text-white">
                Share Your Reaction & Thoughts 💌
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send a quick reply to let him know how you felt about this birthday gift!
              </p>
            </div>
          </div>

          <form onSubmit={handleSendMail} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full sm:max-w-xs px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-pink-200 dark:border-pink-500/30 text-slate-800 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Your Message / Birthday Reaction
              </label>
              <textarea
                rows={4}
                value={surpriseNote}
                onChange={(e) => setSurpriseNote(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-pink-200 dark:border-pink-500/30 text-slate-800 dark:text-white text-sm leading-relaxed focus:outline-none focus:border-rose-400"
                placeholder="Write your heartfelt reaction or thoughts here..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="magic-button px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-lg cursor-pointer flex items-center gap-2 select-none"
              >
                <Send className="w-4 h-4" />
                <span className="font-display tracking-wide">Send Surprise Response via Mail 💌</span>
              </button>

              <button
                type="button"
                onClick={handleCopyNote}
                className="px-4 py-3 rounded-2xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800 hover:bg-white border border-pink-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>

            {isSent && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                ✓ Opening your email client to send to kishorekannan146@gmail.com!
              </p>
            )}
          </form>
        </div>

        {/* Footer Credit */}
        <div className="pt-4 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <span>Crafted with genuine respect & brotherly affection for Nagalakshmi</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline-block" />
        </div>
      </div>

      {/* Interactive Blessing Detail Modal */}
      {activeBlessing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveBlessing(null)}
        >
          <div
            className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-pink-300 dark:border-pink-500/50 shadow-2xl text-center space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl">{activeBlessing.icon}</div>
            <h3 className="text-2xl font-black font-display text-slate-800 dark:text-white">
              {activeBlessing.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "{activeBlessing.detailedWish}"
            </p>
            <button
              onClick={() => setActiveBlessing(null)}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs"
            >
              Embrace this Blessing ✨
            </button>
          </div>
        </div>
      )}

      {/* Secret Message Modal */}
      {showSecret && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowSecret(false)}
        >
          <div
            className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-pink-300 dark:border-pink-500/50 shadow-2xl text-center space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-pink-100 dark:bg-pink-950/60 text-rose-500 dark:text-pink-400 flex items-center justify-center shadow-inner">
              <Star className="w-7 h-7 fill-current" />
            </div>

            <h4 className="text-xl font-bold font-display text-slate-800 dark:text-white">
              {SECRET_MESSAGE.title}
            </h4>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "{SECRET_MESSAGE.body}"
            </p>

            <blockquote className="text-xs italic text-rose-600 dark:text-pink-400 bg-rose-50 dark:bg-slate-800/80 p-3 rounded-xl">
              {SECRET_MESSAGE.quote}
            </blockquote>

            <button
              onClick={() => setShowSecret(false)}
              className="mt-2 w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Note 💖
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default FinalScreen;
