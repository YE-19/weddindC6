import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import p1 from '../assets/p1.jpg';
import p2 from '../assets/p2.jpg';
import p3 from '../assets/p3.jpg';

export default function PhotoGallery({ gallery = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const defaultPhotos = [
    { id: 1, src: p3, title: 'Menna & Abdelrahman' },
    { id: 2, src: p1, title: 'Abdelrahman' },
    { id: 3, src: p2, title: 'Menna' },
  ];

  const photos = gallery && gallery.length > 0 ? gallery : defaultPhotos;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section id="gallery" className="py-8 px-4 max-w-md mx-auto text-center overflow-visible">
      {/* Title matching Screenshot 4 */}
      <h2 className="font-alexandria text-lg sm:text-xl font-bold text-[#55473C] mb-6 tracking-wide">
        معرض الصور
      </h2>

      {/* 3D Coverflow Carousel Container */}
      <div className="relative w-full py-4 flex items-center justify-center min-h-[360px] sm:min-h-[400px]">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous photo"
          className="absolute right-1 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#55473C] shadow-md border border-[#DACBB8] flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute left-1 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#55473C] shadow-md border border-[#DACBB8] flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Slides */}
        <div className="relative w-full h-[340px] sm:h-[370px] flex items-center justify-center">
          {photos.map((photo, index) => {
            // Calculate relative offset from current active slide
            let offset = index - currentIndex;
            if (offset < -1) offset += photos.length;
            if (offset > 1) offset -= photos.length;

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;

            if (!isCenter && !isLeft && !isRight) return null;

            return (
              <motion.div
                key={photo.id}
                initial={false}
                animate={{
                  x: isCenter ? '0%' : isLeft ? '-42%' : '42%',
                  scale: isCenter ? 1 : 0.82,
                  zIndex: isCenter ? 20 : 10,
                  opacity: isCenter ? 1 : 0.65,
                  rotateY: isCenter ? 0 : isLeft ? 15 : -15,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[220px] sm:w-[250px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-[0_12px_30px_rgba(85,71,60,0.14)] border border-[#E5DCCE] cursor-pointer"
                onClick={() => {
                  if (isCenter) {
                    setSelectedPhoto(photo);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.title || 'Wedding moment'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50" />
                {isCenter && (
                  <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white opacity-80 hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators matching Screenshot 4 */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to photo ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-6 h-2 bg-[#6D5D50]'
                : 'w-2 h-2 bg-[#DACBB8] hover:bg-[#C5A880]'
            }`}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#3A3028]/85 backdrop-blur-sm flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-auto object-cover max-h-[80vh] rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

