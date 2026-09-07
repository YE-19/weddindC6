import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BotanicalBranch, WheatFlowers, GoldWaxSeal } from './FloralElements';

export default function EnvelopeCover({ couple, eventDate, isOpened, onOpen, onStartAudio }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpened || isOpening) return;
    setIsOpening(true);

    if (onStartAudio) {
      onStartAudio();
    }

    try {
      // Golden, ivory and mocha warm confetti burst
      confetti({
        particleCount: 80,
        spread: 120,
        startVelocity: 45,
        origin: { y: 0.65 },
        colors: ['#C5A880', '#E5D5BA', '#6D5D50', '#877669', '#FFFFFF'],
        scalar: 1.1,
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 140,
          startVelocity: 30,
          origin: { y: 0.3 },
          colors: ['#C5A880', '#E5D5BA', '#FFFFFF'],
          scalar: 1.15,
          gravity: 0.7,
        });
      }, 250);
    } catch (e) {
      console.error(e);
    }

    // Delay for opening animation
    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 1100);
  };

  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="envelope-modal"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3E35]/80 backdrop-blur-md p-4 sm:p-6 select-none overflow-hidden"
        >
          {/* Main Invitation Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative w-full max-w-[320px] sm:max-w-[350px] bg-[#F7F3EE] rounded-[30px] pt-8 pb-9 px-6 text-center shadow-[0_25px_60px_rgba(40,30,20,0.38)] border border-[#E5DCCE] overflow-hidden"
          >
            {/* Top-Left Botanical Eucalyptus/Olive Branch */}
            <div className="absolute -top-3 -left-3 w-24 sm:w-28 pointer-events-none select-none z-0">
              <BotanicalBranch className="w-full" flip={false} rotate={-15} />
            </div>

            {/* Bottom-Right Golden Wheat/Flower Branch */}
            <div className="absolute -bottom-4 -right-4 w-24 sm:w-28 pointer-events-none select-none z-0">
              <WheatFlowers className="w-full" flip={true} rotate={15} />
            </div>

            {/* Inner Content */}
            <div className="relative z-10 flex flex-col items-center">
              {/* 3D Wax Seal with Heart (Central Top Ornament) */}
              <div className="relative mt-2 mb-4">
                <GoldWaxSeal className="w-16 h-16 sm:w-18 sm:h-18" onClick={handleOpenClick} />
              </div>

              {/* Template / Subtitle */}
              <p className="font-serif text-[11px] sm:text-xs tracking-[0.28em] text-[#877669] uppercase mb-2">
                {couple.eventTitle || 'THE WEDDING OF'}
              </p>

              {/* Couple Names */}
              <div className="space-y-0.5 my-1">
                <h1 className="font-cormorant italic text-3xl sm:text-4xl text-[#55473C] font-normal leading-tight">
                  {couple.primary || 'Menna & Abdelrahman'}
                </h1>
                <p className="font-alexandria text-sm text-[#7D6E62] font-normal mt-1">
                  {couple.primaryArabic || 'عبد الرحمن ومنة الله'}
                </p>
              </div>

              {/* Thin Divider */}
              <div className="flex items-center justify-center gap-2 w-28 my-4">
                <div className="h-[0.8px] bg-[#C5A880]/50 flex-1" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A880] bg-[#C5A880]/40" />
                <div className="h-[0.8px] bg-[#C5A880]/50 flex-1" />
              </div>

              {/* Date in Arabic */}
              <p className="font-alexandria text-xs sm:text-sm text-[#6D5D50] font-medium tracking-wide">
                {eventDate.displayArabic || '4 أكتوبر 2026'}
              </p>

              <p className="font-alexandria text-xs text-[#877669] tracking-wide mt-1 mb-6">
                يسعدنا مشاركتكم فرحتنا
              </p>

              {/* Open Button in Mocha Brown */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenClick}
                disabled={isOpening}
                className="w-full max-w-[180px] py-3 rounded-full bg-[#6D5D50] hover:bg-[#5C4E42] text-white font-alexandria font-medium text-xs sm:text-sm shadow-[0_6px_20px_rgba(85,71,60,0.28)] transition-all duration-300 cursor-pointer border border-[#877669]/30"
              >
                {isOpening ? 'جاري الفتح...' : 'افتح الدعوة 🤍'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

