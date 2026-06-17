import React, { useMemo } from 'react';
import { getImagesForPage } from '../utils/imageDistributor';

interface BookPageProps {
  content: string;
  pageNumber: number; // 0 for front cover, 25 for back cover, 1-24 for main pages
  isVisible: boolean;
  side: 'left' | 'right';
  isMobile?: boolean;
  onImageClick?: (src: string) => void;
}

export const BookPage: React.FC<BookPageProps> = ({ 
  content, 
  pageNumber, 
  isVisible, 
  side,
  isMobile = false,
  onImageClick
}) => {
  const images = useMemo(() => getImagesForPage(pageNumber), [pageNumber]);
  
  // pageNumber 0 is front cover, 25 is back cover
  const isCover = pageNumber === 0 || pageNumber === 25;
  
  // Modulo 3 to get 3 alternating layouts: 0, 1, 2
  const layoutVariant = pageNumber % 3;

  const renderCover = () => (
    <div className="h-full flex flex-col justify-center items-center text-center relative p-8">
      {/* Light premium background for covers */}
      <div className="absolute inset-0 bg-[#FDFBF7] pointer-events-none rounded-[inherit] overflow-hidden">
        {/* Subtle premium paper texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%222%22 cy=%222%22 r=%221%22 fill=%22rgba(0,0,0,0.03)%22/%3E%3C/svg%3E')] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] pointer-events-none" />
        
        {/* 4 Images background watermark */}
        <div className="absolute inset-0 opacity-30 mix-blend-multiply overflow-hidden">
          <div className="grid grid-cols-2 gap-4 w-full h-full p-8 transform rotate-1 scale-110">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`cover-bg-${i}`} className="w-full h-full rounded-2xl overflow-hidden grayscale-[50%]">
                <img 
                  src={`/images/bukky (${(pageNumber + i * 13) % 55 + 1}).jpeg`} 
                  className="w-full h-full object-cover"
                  alt=""
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Soft gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-[#FDFBF7]" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 mb-16 mt-12">
        <span className="font-display text-5xl md:text-6xl lg:text-7xl text-slate-800 tracking-[0.15em] animate-fade-in" style={{ animationDelay: '200ms' }}>
          KAJOLA
        </span>
        <span className="font-display text-5xl md:text-6xl lg:text-7xl text-slate-800 tracking-[0.15em] animate-fade-in" style={{ animationDelay: '500ms' }}>
          BUKOLA
        </span>
        <span className="font-display text-5xl md:text-6xl lg:text-7xl text-slate-700 tracking-[0.15em] animate-fade-in" style={{ animationDelay: '800ms' }}>
          REBECCA
        </span>
      </div>

      {/* Extracted Cover Content (e.g. Chapter 24 / Greeting) */}
      <div 
        className="relative z-10 text-slate-600 prose prose-slate prose-p:leading-relaxed prose-p:tracking-wide max-w-sm animate-fade-in text-sm md:text-base mx-auto text-center"
        style={{ animationDelay: '1200ms' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );

  const renderContentLayout = () => {
    switch (layoutVariant) {
      case 1: // Layout B: Images Top, Text Bottom
        return (
          <div className="relative z-10 flex-1 flex flex-col h-full">
            {images.length > 0 && (
              <div className="mb-8 pb-6 border-b border-slate-100 flex-shrink-0">
                <div className="flex gap-4 items-center justify-center">
                  {images.map((src, idx) => (
                    <div 
                      key={idx} 
                      className="relative rounded-2xl overflow-hidden shadow-sm transition-transform duration-500 hover:scale-[1.02] hover:shadow-md bg-slate-100 cursor-zoom-in"
                      style={{ 
                        flex: 1, 
                        aspectRatio: images.length === 3 ? '4/5' : '1/1',
                        maxWidth: images.length === 3 ? '32%' : '48%'
                      }}
                      onClick={() => onImageClick?.(src)}
                    >
                      <img src={src} alt={`Bukky ${idx}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div 
              className="flex-1 text-slate-700 leading-relaxed overflow-visible prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        );
      
      case 2: // Layout C: Split / Staggered Layout
        return (
          <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-8 h-full">
            <div 
              className="flex-1 text-slate-700 leading-relaxed overflow-visible prose prose-slate max-w-none md:w-1/2 order-2 md:order-1"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {images.length > 0 && (
              <div className="flex flex-col gap-4 md:w-1/2 order-1 md:order-2 justify-center flex-shrink-0 mb-6 md:mb-0">
                {images.map((src, idx) => (
                  <div 
                    key={idx} 
                    className={`relative rounded-2xl overflow-hidden shadow-sm transition-transform duration-500 hover:scale-[1.02] hover:shadow-md bg-slate-100 cursor-zoom-in ${idx % 2 === 0 && !isMobile ? 'md:mr-4 md:ml-0' : 'md:ml-4 md:mr-0'}`}
                    style={{ 
                      aspectRatio: '16/9'
                    }}
                    onClick={() => onImageClick?.(src)}
                  >
                    <img src={src} alt={`Bukky ${idx}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 0:
      default: // Layout A: Text Top, Images Bottom
        return (
          <div className="relative z-10 flex-1 flex flex-col h-full">
            <div 
              className="flex-1 text-slate-700 leading-relaxed overflow-visible mb-8 prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {images.length > 0 && (
              <div className="mt-auto pt-6 border-t border-slate-100 flex-shrink-0">
                <div className="flex gap-4 items-center justify-center">
                  {images.map((src, idx) => (
                    <div 
                      key={idx} 
                      className="relative rounded-2xl overflow-hidden shadow-sm transition-transform duration-500 hover:scale-[1.02] hover:shadow-md bg-slate-100 cursor-zoom-in"
                      style={{ 
                        flex: 1, 
                        aspectRatio: images.length === 3 ? '4/5' : '1/1',
                        maxWidth: images.length === 3 ? '32%' : '48%'
                      }}
                      onClick={() => onImageClick?.(src)}
                    >
                      <img src={src} alt={`Bukky ${idx}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`
        absolute inset-0 bg-[#FCFBF7]
        border border-slate-200 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)]
        transform-gpu transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'}
        ${side === 'left' ? 'origin-right' : 'origin-left'}
        ${isMobile ? 'rounded-2xl' : 'rounded-sm'}
        overflow-y-auto
        overflow-x-hidden
        scrollbar-hide
      `}
      style={{
        transform: isVisible ? 'rotateY(0deg)' : `rotateY(${side === 'left' ? '-180deg' : '180deg'})`,
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
      }}
    >
      {isCover ? (
        renderCover()
      ) : (
        <div className="h-full flex flex-col p-6 sm:p-8 md:p-10 lg:p-12 relative">
          {/* Subtle creamy page texture, glow and premium dot pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%222%22 cy=%222%22 r=%221%22 fill=%22rgba(0,0,0,0.03)%22/%3E%3C/svg%3E')] pointer-events-none rounded-[inherit]" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] pointer-events-none rounded-[inherit]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF8]/80 via-transparent to-[#F3EFE6]/40 pointer-events-none rounded-[inherit]" />
          
          {/* Content Container */}
          {renderContentLayout()}
        </div>
      )}
    </div>
  );
};