import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export type TrackType = 'welcome' | 'celebration' | 'journey' | 'letter';

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: TrackType;
  currentTrackTitle: string;
  isAudioUnlocked: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  switchTrack: (track: TrackType) => void;
  unlockAudio: () => void;
}

const TRACK_CONFIG: Record<TrackType, { title: string; file: string }> = {
  welcome: {
    title: "Cosmic Prelude 🎵",
    file: "/music/welcome-music.mp3"
  },
  celebration: {
    title: "Birthday Jubilee 🎉",
    file: "/music/celebration-music.mp3"
  },
  journey: {
    title: "Enchanted Journey ✨",
    file: "/music/journey-music.mp3"
  },
  letter: {
    title: "Heartfelt Melodies 💌",
    file: "/music/letter-music.mp3"
  }
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<TrackType>('welcome');
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const webAudioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);

  const stopSynth = useCallback(() => {
    if (synthTimerRef.current) {
      window.clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  }, []);

  // Web Audio procedural musical melodies (instant backup if mp3 files are absent)
  const startSynth = useCallback((track: TrackType) => {
    stopSynth();
    try {
      if (!webAudioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        webAudioCtxRef.current = new AudioCtx();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (!synthGainRef.current) {
        synthGainRef.current = ctx.createGain();
        synthGainRef.current.connect(ctx.destination);
      }
      synthGainRef.current.gain.setValueAtTime(isMuted ? 0 : 0.15, ctx.currentTime);

      const scales: Record<TrackType, number[]> = {
        welcome: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25], // C Major pentatonic
        celebration: [329.63, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99], // Joyful energetic
        journey: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99], // Uplifting D major
        letter: [220.00, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25] // Emotional Lydian
      };

      const notes = scales[track];

      const playTone = () => {
        if (!ctx || ctx.state === 'suspended' || isMuted) return;
        const noteIndex = Math.floor(Math.random() * notes.length);
        const freq = notes[noteIndex];

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = track === 'celebration' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (track === 'letter' ? 1.6 : 1.1));

        osc.connect(noteGain);
        if (synthGainRef.current) {
          noteGain.connect(synthGainRef.current);
        }
        osc.start(now);
        osc.stop(now + 1.8);
      };

      playTone();
      const interval = track === 'celebration' ? 420 : track === 'journey' ? 520 : 680;
      synthTimerRef.current = window.setInterval(playTone, interval);
    } catch (err) {
      console.warn("WebAudio synth init notice:", err);
    }
  }, [isMuted, stopSynth]);

  const playTrackAudio = useCallback((track: TrackType) => {
    const config = TRACK_CONFIG[track];
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    stopSynth();

    const audio = new Audio(config.file);
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.6;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          startSynth(track);
          setIsPlaying(true);
        });
    }

    audio.onerror = () => {
      startSynth(track);
      setIsPlaying(true);
    };
  }, [isMuted, startSynth, stopSynth]);

  const switchTrack = useCallback((newTrack: TrackType) => {
    setCurrentTrack(newTrack);
    if (isPlaying) {
      if (audioRef.current) {
        let vol = audioRef.current.volume;
        const fadeInterval = setInterval(() => {
          if (audioRef.current && vol > 0.05) {
            vol -= 0.1;
            audioRef.current.volume = Math.max(0, vol);
          } else {
            clearInterval(fadeInterval);
            playTrackAudio(newTrack);
          }
        }, 40);
      } else {
        stopSynth();
        startSynth(newTrack);
      }
    }
  }, [isPlaying, playTrackAudio, startSynth, stopSynth]);

  const play = useCallback(() => {
    setIsPlaying(true);
    setIsAudioUnlocked(true);
    playTrackAudio(currentTrack);
  }, [currentTrack, playTrackAudio]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSynth();
  }, [stopSynth]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (audioRef.current) {
        audioRef.current.volume = nextMuted ? 0 : 0.6;
      }
      if (synthGainRef.current && webAudioCtxRef.current) {
        synthGainRef.current.gain.setValueAtTime(
          nextMuted ? 0 : 0.15,
          webAudioCtxRef.current.currentTime
        );
      }
      return nextMuted;
    });
  }, []);

  const unlockAudio = useCallback(() => {
    setIsAudioUnlocked(true);
    if (!isPlaying) {
      play();
    }
  }, [isPlaying, play]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSynth();
      if (webAudioCtxRef.current) {
        webAudioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopSynth]);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        currentTrack,
        currentTrackTitle: TRACK_CONFIG[currentTrack].title,
        isAudioUnlocked,
        play,
        pause,
        togglePlay,
        toggleMute,
        switchTrack,
        unlockAudio
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
