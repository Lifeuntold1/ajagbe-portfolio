import React, { useState, useEffect, useCallback } from 'react';
import { BookPage } from './BookPage';
import { BookData } from '../types/book';
import { useCelebrationEffects } from '../utils/useCelebrationEffects';
import { StickyHeader } from './StickyHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Balloons } from './Balloons';
import { FlashEffect } from './FlashEffect';
import { AnalogClock } from './AnalogClock';
import { ImageLightbox } from './ImageLightbox';

interface BookReaderProps {
  bookData: BookData;
}

export const BookReader: React.FC<BookReaderProps> = ({ bookData }) => {
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 25 = back cover
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { 
    triggerPageTurnEffect, 
    showBalloons, 
    triggerBalloons, 
    resetBalloons,
    showFlash,
    triggerFlash,
    resetFlash
  } = useCelebrationEffects();

  // Trigger flash on initial load
  useEffect(() => {
    triggerFlash();
    triggerBalloons(); // Balloons on cover
  }, [triggerFlash, triggerBalloons]);

  const goToPage = useCallback((pageNumber: number) => {
    const next = Math.max(0, Math.min(pageNumber, bookData.totalPages - 1));
    if (next !== currentPage) {
      setCurrentPage(next);
      triggerPageTurnEffect();
      
      // Trigger balloons on final content page (24) or cover (0)
      if (next === 24 || next === 0) {
        triggerBalloons();
      }
    }
  }, [bookData.totalPages, currentPage, triggerPageTurnEffect, triggerBalloons]);

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't navigate if lightbox is open
      if (activeImage) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextPage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevPage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, bookData.totalPages, activeImage]);

  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < bookData.totalPages - 1;
  const displayPageNumber = currentPage;

  return (
    <div className="relative w-full h-screen bg-transparent overflow-hidden flex flex-col items-center justify-center">
      <StickyHeader currentPage={displayPageNumber} />
      
      <AnalogClock pageNumber={currentPage} totalPages={24} />
      <Balloons active={showBalloons} onComplete={resetBalloons} />
      <FlashEffect active={showFlash} onComplete={resetFlash} />
      <ImageLightbox src={activeImage} onClose={() => setActiveImage(null)} />

      <div className="relative w-full max-w-lg md:max-w-4xl lg:max-w-5xl h-[80vh] md:h-[85vh] perspective-[2000px] mt-12 z-10">
        <div className="relative w-full h-full flex justify-center transform-style-3d">
          
          {/* Mobile view - Single page stack */}
          <div className="md:hidden relative w-[90%] h-full">
            {bookData.pages.map((page) => (
              <BookPage
                key={page.id}
                content={page.content}
                pageNumber={page.pageNumber}
                isVisible={page.pageNumber === currentPage}
                side={page.pageNumber > currentPage ? 'right' : 'left'}
                isMobile={true}
                onImageClick={setActiveImage}
              />
            ))}
          </div>

          {/* Desktop view - Two pages side by side stack */}
          <div className="hidden md:flex relative w-full h-full max-w-4xl">
            {/* Left page stack */}
            <div className="absolute left-0 top-0 w-1/2 h-full pr-1 perspective-[2000px]">
              {bookData.pages.map((page) => {
                // The left side shows the page immediately preceding the current page
                const isLeftVisible = page.pageNumber === currentPage - 1;
                // If it's far past, we hide it completely to avoid z-index fighting
                if (page.pageNumber < currentPage - 2 || page.pageNumber > currentPage) return null;
                
                return (
                  <BookPage
                    key={`left-${page.id}`}
                    content={page.content}
                    pageNumber={page.pageNumber}
                    isVisible={isLeftVisible}
                    side="left"
                    onImageClick={setActiveImage}
                  />
                );
              })}
              {currentPage === 0 && (
                <div className="absolute inset-0 bg-slate-200 border border-slate-300 rounded-sm opacity-50 shadow-inner" />
              )}
            </div>

            {/* Right page stack */}
            <div className="absolute right-0 top-0 w-1/2 h-full pl-1 perspective-[2000px]">
              {bookData.pages.map((page) => {
                // The right side shows the current page
                const isRightVisible = page.pageNumber === currentPage;
                // Avoid rendering too many invisible pages
                if (page.pageNumber < currentPage || page.pageNumber > currentPage + 2) return null;

                return (
                  <BookPage
                    key={`right-${page.id}`}
                    content={page.content}
                    pageNumber={page.pageNumber}
                    isVisible={isRightVisible}
                    side="right"
                    onImageClick={setActiveImage}
                  />
                );
              })}
            </div>

            {/* Book spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-slate-200 via-white to-slate-200 z-20 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] border-l border-r border-slate-300 rounded-sm" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-2 md:-mx-12 lg:-mx-16 pointer-events-none z-30">
          <button
            onClick={prevPage}
            disabled={!canGoBack}
            className={`pointer-events-auto p-3 rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-md transition-all duration-200 ${canGoBack ? 'text-slate-700 hover:bg-white hover:shadow-lg hover:scale-105 active:scale-95' : 'opacity-0'}`}
            aria-label="Previous page"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextPage}
            disabled={!canGoForward}
            className={`pointer-events-auto p-3 rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-md transition-all duration-200 ${canGoForward ? 'text-slate-700 hover:bg-white hover:shadow-lg hover:scale-105 active:scale-95' : 'opacity-0'}`}
            aria-label="Next page"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};