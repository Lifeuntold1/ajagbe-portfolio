import React, { useEffect, useState } from 'react';

interface BalloonsProps {
  active: boolean;
  onComplete?: () => void;
}

export const Balloons: React.FC<BalloonsProps> = ({ active, onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 6000); // Hide after animation finishes
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!show) return null;

  const balloons = Array.from({ length: 20 });
  const colors = ['#8b5cf6', '#3b82f6', '#0ea5e9', '#ec4899', '#f43f5e', '#64748b'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {balloons.map((_, i) => {
        const left = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 4 + Math.random() * 2;
        const delay = Math.random() * 1.5;
        
        return (
          <div 
            key={i}
            className="absolute bottom-[-120px] w-10 h-14 md:w-14 md:h-20 animate-float-up opacity-90"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Balloon Body */}
            <div 
              className="w-full h-full rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] relative shadow-sm"
              style={{
                backgroundColor: color,
                boxShadow: `inset -6px -6px 12px rgba(0,0,0,0.15), inset 6px 6px 12px rgba(255,255,255,0.2)`
              }}
            >
              {/* Knot */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            {/* String */}
            <div className="absolute top-[100%] left-1/2 w-[1px] h-24 bg-slate-300/60 transform -translate-x-1/2 origin-top rotate-3" />
          </div>
        );
      })}
    </div>
  );
};
