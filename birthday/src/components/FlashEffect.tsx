import React, { useEffect, useState } from 'react';

interface FlashEffectProps {
  active: boolean;
  onComplete?: () => void;
}

export const FlashEffect: React.FC<FlashEffectProps> = ({ active, onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white z-[110] pointer-events-none animate-flash mix-blend-overlay" />
  );
};
