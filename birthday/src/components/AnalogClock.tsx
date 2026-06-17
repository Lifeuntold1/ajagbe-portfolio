import React from 'react';

interface AnalogClockProps {
  pageNumber: number;
  totalPages: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ pageNumber, totalPages }) => {
  // We have 24 pages. Each page represents 15 degrees (360 / 24 = 15).
  // At page 24, it reaches 360 degrees (back to top).
  const rotation = pageNumber * 15;

  const renderTicks = () => {
    const ticks = [];
    for (let i = 1; i <= 24; i++) {
      const angle = i * 15;
      const isMajor = i % 6 === 0;
      ticks.push(
        <line
          key={i}
          x1="50"
          y1={isMajor ? "6" : "8"}
          x2="50"
          y2={isMajor ? "14" : "12"}
          stroke="currentColor"
          strokeWidth={isMajor ? "1.5" : "0.75"}
          className="text-slate-400"
          transform={`rotate(${angle} 50 50)`}
        />
      );
      
      // Add numbers for 6, 12, 18, 24
      if (isMajor) {
        // Calculate position for the text
        const rad = (angle - 90) * (Math.PI / 180);
        const radius = 34; // distance from center
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        
        ticks.push(
          <text
            key={`text-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] font-serif font-medium fill-slate-500"
          >
            {i}
          </text>
        );
      }
    }
    return ticks;
  };

  return (
    <div className="fixed top-6 right-6 md:top-8 md:right-8 z-50 pointer-events-none transition-opacity duration-500">
      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/80 backdrop-blur-md border border-white/60 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Outer ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-slate-200" strokeWidth="1" />
          
          {/* Ticks and Numbers */}
          {renderTicks()}
          
          {/* Clock Hand (Deep Slate for maximum contrast) */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: '50px 50px',
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.8))'
            }}
          />
          
          {/* Center Dot */}
          <circle cx="50" cy="50" r="3" fill="#0f172a" />
          <circle cx="50" cy="50" r="1" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
};
