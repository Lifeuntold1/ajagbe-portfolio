import React from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 transition-opacity duration-300">
      {/* Separated backdrop layer to prevent Safari hit-testing bugs with backdrop-filter */}
      <div 
        className="absolute inset-0 bg-slate-900/95 backdrop-blur-md cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 z-10 cursor-pointer"
        style={{ 
          marginTop: 'env(safe-area-inset-top, 0px)',
          marginRight: 'env(safe-area-inset-right, 0px)'
        }}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>
      
      {/* Image Content */}
      <div 
        className="relative z-10 max-w-5xl max-h-[90vh] w-full h-full flex justify-center items-center cursor-pointer"
        onClick={onClose}
      >
        <img 
          src={src} 
          alt="Enlarged memory" 
          className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-fade-in pointer-events-none"
          style={{ animationDuration: '400ms' }}
        />
      </div>
    </div>
  );
};
