import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';

export default function Footer({ couple, eventDate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-6 pb-12 px-4 text-center border-t border-[#DACBB8]/50 mt-6 bg-[#EFE8DE]/60">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
        {/* Second Message Card (تاني ماسيدج) */}
        {couple.thankYouMessage && (
          <div className="relative w-full max-w-[340px] sm:max-w-[370px] mx-auto my-3 rounded-[24px] bg-[#F7F3EE] p-6 text-center shadow-[0_4px_20px_rgba(85,71,60,0.06)] border border-[#E5DCCE]">
            <p className="font-alexandria text-xs sm:text-[13px] leading-relaxed text-[#55473C] font-medium whitespace-pre-line">
              {couple.thankYouMessage}
            </p>
          </div>
        )}

        <h3 className="font-cormorant italic text-2xl sm:text-3xl text-[#55473C] font-normal tracking-wide pt-2">
          {couple.primary || 'Menna & Abdelrahman'}
        </h3>

        <p className="font-alexandria text-xs text-[#7D6E62] tracking-wide">
          {eventDate.displayArabic || '4 أكتوبر 2026'}
        </p>

        <button
          onClick={scrollToTop}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6D5D50] text-white text-xs font-alexandria hover:bg-[#5C4E42] transition-colors cursor-pointer shadow-xs border border-[#877669]/30"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>العودة للأعلى</span>
        </button>

        <p className="text-[11px] font-alexandria text-[#877669]/80 pt-2 flex items-center justify-center gap-1">
          بكل حب <Heart className="w-3 h-3 text-[#C5A880] fill-[#C5A880]" /> {couple.primaryArabic || 'عبد الرحمن ومنة الله'}
        </p>
      </div>
    </footer>
  );
}

