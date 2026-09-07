import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Share2, Check, Maximize2, X } from 'lucide-react';
import { BotanicalBranch, WheatFlowers, GoldWaxSeal, WashiTape } from './FloralElements';
import defaultCouplePhoto from '../assets/p3.jpg';

export default function Announcement({ couple, onReopenCover }) {
  const [copied, setCopied] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Polaroid couple photo
  const couplePhoto = couple?.coverPhoto || couple?.gallery?.[0]?.src || defaultCouplePhoto;

  const handleShare = async () => {
    const shareData = {
      title: `${couple.primary || 'Menna & Abdelrahman'} — دعوة زفاف`,
      text: `يسعدنا دعوتكم لحضور حفل زفاف ${couple.primaryArabic || 'عبد الرحمن ومنة الله'} 🤍`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative pt-3 pb-8 px-4 text-center overflow-visible">
      {/* Background Soft Dried Leaf Watermark (Left side matching Screenshot 2) */}
      <div className="absolute top-12 left-0 w-36 sm:w-44 opacity-25 pointer-events-none select-none z-0">
        <BotanicalBranch className="w-full" flip={false} rotate={-15} />
      </div>

      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        {/* ============================================================
            TOP NAVIGATION BAR (Matching reference screenshots)
            ============================================================ */}
        <div className="w-full flex items-center justify-between mb-8 px-1">
          {/* Share Button (Left side) */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3A3028]/90 hover:bg-[#3A3028] text-[#E5D5BA] border border-[#C5A880]/30 text-xs font-alexandria font-medium shadow-md transition-all cursor-pointer"
            title="مشاركة الدعوة"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#E5D5BA]" />
                <span>مشاركة</span>
              </>
            )}
          </button>

          {/* Back/Home Icon (Right side) */}
          <button
            onClick={onReopenCover}
            title="العودة للغلاف"
            className="w-8 h-8 rounded-full bg-[#EFE8DE]/90 hover:bg-[#E5DCCE] border border-[#DACBB8] flex items-center justify-center text-[#55473C] transition-all cursor-pointer shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================
            HERO SECTION: THE WEDDING OF + POLAROID FRAME
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full flex flex-col items-center"
        >
          {/* THE WEDDING OF */}
          <p className="font-serif text-xs sm:text-sm font-semibold tracking-[0.3em] text-[#877669] uppercase mb-2">
            {couple.eventTitle || 'THE WEDDING OF'}
          </p>

          {/* Menna & Abdelrahman */}
          <h1 className="font-cormorant italic text-4xl sm:text-5xl text-[#55473C] font-normal tracking-wide leading-tight mb-8">
            {couple.primary || 'Menna & Abdelrahman'}
          </h1>

          {/* POLAROID FRAME (Exact Match to Screenshot 2) */}
          <div className="relative my-4 w-full max-w-[280px] sm:max-w-[310px] flex justify-center">
            {/* Dried Olive/Eucalyptus Branch peeking on the left */}
            <div className="absolute -left-10 bottom-6 w-24 sm:w-28 pointer-events-none select-none z-10">
              <BotanicalBranch className="w-full" flip={false} rotate={-25} />
            </div>

            {/* Dried Golden Flowers on bottom-left */}
            <div className="absolute -left-8 -bottom-4 w-20 pointer-events-none select-none z-20">
              <WheatFlowers className="w-full" flip={false} rotate={15} />
            </div>

            {/* Polaroid Container with subtle -2.5deg tilt */}
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative w-full bg-white p-3.5 pt-4 pb-8 rounded-xs shadow-[0_16px_40px_rgba(85,71,60,0.18)] border border-[#EBE3D6] cursor-pointer"
              style={{ transform: 'rotate(-2.5deg)' }}
              onClick={() => setIsPhotoModalOpen(true)}
            >
              {/* Kraft Washi Tape Pinned at Top Center */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                <WashiTape className="w-24 sm:w-28 h-6 sm:h-7" rotate={-1} />
              </div>

              {/* Photo Area */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EBE1] rounded-2xs group">
                <img
                  src={couplePhoto}
                  alt={couple.primary || 'Couple wedding photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Subtle Inner Highlight Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 3D Gold Wax Seal Stamp on Bottom-Right Corner (Exact match to Screenshot 2) */}
              <div className="absolute -bottom-4 -right-4 z-30">
                <GoldWaxSeal className="w-16 h-16 sm:w-18 sm:h-18" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ============================================================
            PARTY INFO CARD ("معلومات الحفل" - Matching Screenshot 5)
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="relative w-full max-w-[340px] sm:max-w-[370px] mt-12 mb-6 rounded-[28px] bg-[#EFE8DE] p-7 sm:p-8 text-center shadow-[0_8px_30px_rgba(85,71,60,0.06)] border border-[#E5DCCE] overflow-visible"
        >
          {/* Corner Dried Botanicals: Olive Branch (Left) & Wheat Flowers (Right) */}
          <div className="absolute -bottom-4 -left-6 w-24 sm:w-28 pointer-events-none select-none z-10">
            <BotanicalBranch className="w-full" flip={false} rotate={-10} />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 sm:w-28 pointer-events-none select-none z-10">
            <WheatFlowers className="w-full" flip={false} rotate={10} />
          </div>

          <div className="relative z-20 flex flex-col items-center">
            {/* Card Header: معلومات الحفل */}
            <h2 className="font-alexandria text-lg sm:text-xl font-bold text-[#55473C] mb-4 tracking-wide">
              {couple.partyHeader || 'معلومات الحفل'}
            </h2>

            {/* Arabic Poetic Text with Heart */}
            <p className="font-alexandria text-xs sm:text-[13px] leading-relaxed text-[#6B5B4E] whitespace-pre-line mb-8 font-normal max-w-xs">
              {couple.poeticQuote}
            </p>

            {/* Couple Full Names */}
            <div className="w-full space-y-3 my-2">
              <h3 className="font-cormorant text-2xl sm:text-3xl text-[#55473C] font-normal tracking-wide">
                {couple.groomFull || 'Abdelrahman Mahmoud'}
              </h3>

              {/* & symbol in elegant script */}
              <div className="font-cormorant italic text-3xl sm:text-4xl text-[#877669] my-1">
                &
              </div>

              <h3 className="font-cormorant text-2xl sm:text-3xl text-[#55473C] font-normal tracking-wide">
                {couple.brideFull || 'Mennatallah Hamed'}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal for Hero Polaroid Photo */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#3A3028]/85 backdrop-blur-sm flex items-center justify-center p-4 select-none"
            onClick={() => setIsPhotoModalOpen(false)}
          >
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={couplePhoto}
                alt={couple.primary}
                className="w-full h-auto object-cover max-h-[80vh] rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

