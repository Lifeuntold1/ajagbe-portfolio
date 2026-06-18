import React from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 transition-opacity duration-300 cursor-pointer"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-md z-[250]"
        style={{ 
          marginTop: 'env(safe-area-inset-top, 0px)',
          marginRight: 'env(safe-area-inset-right, 0px)'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClose();
        }}
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>
      
      <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex justify-center items-center">
        <img 
          src={src} 
          alt="Enlarged memory" 
          className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-fade-in"
          style={{ animationDuration: '400ms' }}
        />
      </div>
    </div>
  );
};
