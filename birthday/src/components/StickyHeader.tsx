import React, { useEffect, useState } from 'react';

interface StickyHeaderProps {
  currentPage: number;
}

export function StickyHeader({ currentPage }: StickyHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Display counter logic:
  // If page is 0 (Front Cover), we don't necessarily show a number, or we show 0/24
  // The pages are 1 to 24.
  const displayPage = currentPage > 0 && currentPage <= 24 ? currentPage : (currentPage === 0 ? 0 : 24);

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Ticking Clock */}
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/60 shadow-sm text-sm font-medium text-slate-600 tracking-wide font-sans pointer-events-auto">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        
        {/* Page Counter */}
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/60 shadow-sm text-sm font-medium text-slate-600 tracking-wide font-sans pointer-events-auto">
          Page {displayPage} <span className="text-slate-400">/</span> 24
        </div>
      </div>
    </div>
  );
}
