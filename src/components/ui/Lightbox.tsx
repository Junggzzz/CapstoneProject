"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface LightboxProps {
  images: { id: string; url: string; title: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}: LightboxProps) {
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        >
          {/* Controls */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-50"
          >
            <X size={28} />
          </button>

          <button 
            onClick={onPrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full transition-colors z-50"
          >
            <ChevronLeft size={32} />
          </button>

          <button 
            onClick={onNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full transition-colors z-50"
          >
            <ChevronRight size={32} />
          </button>

          {/* Image Container */}
          <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-auto px-16 flex items-center justify-center">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage.url}
                alt={currentImage.title}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
              />
              <div className="absolute bottom-[-60px] left-0 right-0 flex flex-col items-center justify-center text-white/80 gap-2">
                <p className="text-lg font-medium">{currentImage.title}</p>
                <div className="flex items-center gap-4">
                  <p className="text-sm opacity-60">{currentIndex + 1} / {images.length}</p>
                  <a
                    href={`https://wa.me/6285847487597?text=${encodeURIComponent(`Halo Motrek Aja, saya tertarik untuk booking sesi foto seperti di portfolio "${currentImage.title}"`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.947 9.947 0 0 0 4.88 1.28c5.505 0 9.988-4.478 9.99-9.985A9.998 9.998 0 0 0 12.012 2zm5.718 13.962c-.252.708-1.461 1.38-2.014 1.47-.502.082-1.157.154-3.378-.764-2.839-1.176-4.636-4.062-4.778-4.25-.138-.19-1.127-1.49-1.127-2.844 0-1.356.708-2.019.959-2.285.253-.266.55-.333.734-.333.184 0 .367.007.525.014.165.007.387-.063.606.463.226.541.777 1.892.845 2.029.068.138.113.298.02.485-.091.188-.138.298-.276.463-.137.165-.289.367-.412.493-.138.14-.282.29-.12.568.162.277.72 1.184 1.543 1.916.823.732 1.517.957 1.733 1.054.217.097.346.082.474-.065.127-.147.55-.642.698-.86.148-.22.296-.183.5-.104.204.08.13.06 1.303.645 1.174.584 1.954.912 2.023 1.026.069.115.069.664-.183 1.372z" />
                    </svg>
                    Tanyakan Sesi Foto via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
