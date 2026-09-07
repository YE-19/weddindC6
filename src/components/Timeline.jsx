import React from 'react';
import { motion } from 'framer-motion';
import { FloralBouquetCorner } from './FloralElements';

export default function Timeline({ timeline }) {
  return (
    <section id="schedule" className="relative py-10 sm:py-14 px-4 max-w-md mx-auto overflow-hidden">
      {/* Side Floral Bouquets */}
      <FloralBouquetCorner position="bottom-left" className="w-24 sm:w-32 -bottom-4 -left-4 opacity-70" />
      <FloralBouquetCorner position="bottom-right" className="w-24 sm:w-32 -bottom-4 -right-4 opacity-70" />

      {/* Header: WEDDING DAY SCHEDULE */}
      <h2 className="font-serif text-lg sm:text-xl font-bold tracking-[0.2em] text-[#6B0F23] uppercase text-center mb-10">
        WEDDING DAY SCHEDULE
      </h2>

      {/* Timeline with Gift Box Graphic */}
      <div className="relative flex items-center justify-center">
        {/* Timeline Core */}
        <div className="relative w-full max-w-xs mx-auto py-2">
          {/* Continuous Center Vertical Line */}
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[1px] bg-[#D49CA8]" />

          {/* Timeline Nodes */}
          <div className="space-y-6 sm:space-y-7">
            {timeline.map((item, index) => (
              <motion.div
                key={item.time + index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="relative flex items-center"
              >
                {/* Left Side: Time */}
                <div className="w-1/2 pr-6 text-right">
                  <span className="font-serif text-xs sm:text-sm font-medium text-[#6B0F23] tracking-wider">
                    {item.time}
                  </span>
                </div>

                {/* Center Node: Burgundy Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#6B0F23] ring-2 ring-[#FAF8F5] z-10" />

                {/* Right Side: Title */}
                <div className="w-1/2 pl-6 text-left">
                  <span className="font-serif text-xs sm:text-sm font-medium text-[#6B0F23] tracking-wide">
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3D Wedding Gift Box (100% Transparent PNG, No White Box) */}
        <div className="absolute -bottom-4 left-2 w-16 sm:w-20 h-16 sm:h-20 pointer-events-none select-none z-10">
          <img
            src="/images/gift-box.png"
            alt="Wedding Gift Box"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
