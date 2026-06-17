import { useCallback, useState } from 'react';
import confetti from 'canvas-confetti';

export function useCelebrationEffects() {
  const [showBalloons, setShowBalloons] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const triggerPageTurnEffect = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 15,
      shapes: ['circle', 'square'],
      colors: ['#FFE4E1', '#FFB6C1', '#FF69B4', '#FF1493', '#DB7093']
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 15,
        origin: { x: 0.1, y: 0.5 }
      });
      confetti({
        ...defaults,
        particleCount: 15,
        origin: { x: 0.9, y: 0.5 }
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
  }, []);

  const triggerBalloons = useCallback(() => {
    setShowBalloons(true);
  }, []);

  const resetBalloons = useCallback(() => {
    setShowBalloons(false);
  }, []);

  const triggerFlash = useCallback(() => {
    setShowFlash(true);
  }, []);

  const resetFlash = useCallback(() => {
    setShowFlash(false);
  }, []);

  return { 
    triggerPageTurnEffect, 
    showBalloons, 
    triggerBalloons, 
    resetBalloons,
    showFlash,
    triggerFlash,
    resetFlash
  };
}
