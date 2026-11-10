import confetti from 'canvas-confetti';

/**
 * Triggers multiple colorful fireworks and confetti bursts across the screen
 */
export const triggerGrandCelebration = () => {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ffd700'];

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 45 * (timeLeft / duration);

    // Left cannon
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 60,
      spread: 65,
      origin: { x: 0.05, y: 0.8 },
      colors
    });

    // Right cannon
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 120,
      spread: 65,
      origin: { x: 0.95, y: 0.8 },
      colors
    });

    // Center star burst
    if (Math.random() < 0.4) {
      confetti({
        particleCount: 25,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ffd700', '#f43f5e', '#ec4899']
      });
    }
  }, 220);
};

/**
 * Triggers a heart-shaped confetti burst for sweet moments
 */
export const triggerHeartShower = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 35,
    spread: 70,
    origin: { x, y },
    colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffd700']
  });
};

/**
 * Candle blow out sparkle burst
 */
export const triggerCandleWishSparkles = () => {
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { x: 0.5, y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#ec4899', '#ffffff', '#a855f7']
  });
};

export default {
  triggerGrandCelebration,
  triggerHeartShower,
  triggerCandleWishSparkles
};
