import React from 'react';

export const GlobalBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden">
      {/* Global fixed background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Faded image canvas */}
        <div className="absolute inset-0 opacity-40 overflow-hidden">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 w-[120%] h-[120%] -ml-[10%] -mt-[10%] transform -rotate-2">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={`global-bg-${i}`} className="w-full aspect-square bg-slate-800">
                <img 
                  src={`${import.meta.env.BASE_URL}images/bukky (${((i * 2) % 55) + 1}).jpeg`} 
                  className="w-full h-full object-cover filter brightness-75"
                  alt=""
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-slate-900/50" />
        
        {/* Subtle noise/texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
      </div>

      {/* Main content layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
