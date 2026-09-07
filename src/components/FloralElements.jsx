import React from 'react';
import botanicalBranchImg from '../assets/botanical_branch.png';
import wheatFlowersImg from '../assets/wheat_flowers.png';
import waxSealImg from '../assets/wax_seal.png';

/**
 * Dried Eucalyptus & Olive Branch (Transparent PNG)
 * Matches the botanical branch on the left and right in the screenshots
 */
export function BotanicalBranch({ className = 'w-24', flip = false, rotate = 0 }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        transform: `${flip ? 'scaleX(-1)' : ''} rotate(${rotate}deg)`,
      }}
    >
      <img
        src={botanicalBranchImg}
        alt="Botanical branch"
        className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(109,93,80,0.12)]"
      />
    </div>
  );
}

/**
 * Dried Golden Baby's Breath & Wheat Flowers (Transparent PNG)
 * Matches the dried wildflower spray in the screenshots
 */
export function WheatFlowers({ className = 'w-24', flip = false, rotate = 0 }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        transform: `${flip ? 'scaleX(-1)' : ''} rotate(${rotate}deg)`,
      }}
    >
      <img
        src={wheatFlowersImg}
        alt="Dried wheat and flowers"
        className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(109,93,80,0.12)]"
      />
    </div>
  );
}

/**
 * Realistic 3D Gold Wax Seal with Embossed Heart
 * Matches the wax seal on the Polaroid frame and top template badge
 */
export function GoldWaxSeal({ className = 'w-14 h-14', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`select-none cursor-pointer drop-shadow-[0_6px_14px_rgba(90,70,50,0.28)] hover:scale-105 active:scale-95 transition-transform duration-300 ${className}`}
    >
      <img
        src={waxSealImg}
        alt="Gold wax seal stamp"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

/**
 * Semi-translucent Kraft Washi Tape
 * Matches the washi tape pinning the Polaroid frame at the top
 */
export function WashiTape({ className = 'w-28 h-7', rotate = -1 }) {
  return (
    <div
      className={`relative select-none pointer-events-none z-20 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="w-full h-full bg-[#E4D0B5]/85 backdrop-blur-[1px] shadow-[0_2px_5px_rgba(90,70,50,0.15)] border-y border-[#D6BF9E]/50 flex items-center justify-center">
        {/* Subtle fiber texture lines */}
        <div className="w-full h-[1px] bg-white/25" />
      </div>
      {/* Left torn edge */}
      <div
        className="absolute left-[-4px] top-0 bottom-0 w-[5px] bg-[#E4D0B5]/85"
        style={{
          clipPath: 'polygon(100% 0, 0 15%, 100% 30%, 0 45%, 100% 60%, 0 75%, 100% 90%, 0 100%)',
        }}
      />
      {/* Right torn edge */}
      <div
        className="absolute right-[-4px] top-0 bottom-0 w-[5px] bg-[#E4D0B5]/85"
        style={{
          clipPath: 'polygon(0 0, 100% 15%, 0 30%, 100% 45%, 0 60%, 100% 75%, 0 90%, 100% 100%)',
        }}
      />
    </div>
  );
}

/**
 * Minimalist Warm Earth Divider
 */
export function WarmDivider({ className = 'my-4' }) {
  return (
    <div className={`flex items-center justify-center gap-2 w-32 mx-auto select-none ${className}`}>
      <div className="h-[0.8px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-[#C5A880]/60 flex-1" />
      <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A880] bg-[#C5A880]/30" />
      <div className="h-[0.8px] bg-gradient-to-l from-transparent via-[#C5A880]/60 to-[#C5A880]/60 flex-1" />
    </div>
  );
}

