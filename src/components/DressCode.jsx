import React from 'react';
import { motion } from 'framer-motion';
import { GoldDivider } from './FloralElements';

export default function DressCode({ dressCode }) {
  return (
    <section id="dresscode" className="py-8 sm:py-10 px-4 max-w-md mx-auto text-center">
      {/* Title */}
      <h2 className="font-serif text-lg sm:text-xl font-bold tracking-[0.2em] text-[#A8586E] uppercase">
        DRESS CODE
      </h2>

      {/* Subtitle */}
      <p className="font-serif text-xs sm:text-sm text-[#A8586E]/80 tracking-wide mt-1 mb-6">
        {dressCode.theme || 'Dusty Rose • Blush Pink • Champagne Gold'}
      </p>

      {/* Horizontal Color Palette Circles */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 my-5 flex-wrap">
        {dressCode.palettes.map((item, index) => (
          <motion.div
            key={item.name || index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-full shadow-md border-2 border-white ring-1 ring-[#D8B26E]/40 transition-transform duration-300 hover:scale-110 cursor-pointer"
              style={{ backgroundColor: item.hex }}
              title={item.name}
            />
            <span className="font-serif text-[11px] sm:text-xs tracking-wider text-[#A8586E]/90 font-medium">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-7">
        <GoldDivider className="w-40" />
      </div>
    </section>
  );
}
