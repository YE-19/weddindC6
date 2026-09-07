import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function VenueLocation({ venue }) {
  return (
    <section id="venue" className="py-6 px-4 max-w-md mx-auto text-center overflow-visible">
      {/* Header matching Screenshot 3 */}
      <h2 className="font-alexandria text-lg sm:text-xl font-bold text-[#55473C] mb-3 tracking-wide">
        مكان الاستقبال
      </h2>

      {/* Address line matching Screenshot 3 */}
      <p className="font-alexandria text-xs sm:text-[13px] text-[#7D6E62] leading-relaxed mb-6 font-normal px-2">
        {venue.name} - {venue.subtitle}
      </p>

      {/* Map Embed Container (Matching Screenshot 3) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-[340px] sm:max-w-[370px] mx-auto aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-[0_10px_30px_rgba(85,71,60,0.12)] border border-[#E5DCCE]"
      >
        {/* Floating "الفتح في 'خرائط Google'" Button (Top-Left of map, matching Screenshot 3) */}
        <div className="absolute top-3 left-3 z-20">
          <a
            href={venue.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-[#55473C] hover:text-[#3A3028] border border-[#DACBB8] text-xs font-alexandria font-medium shadow-md transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#55473C]" />
            <span>الفتح في "خرائط Google"</span>
          </a>
        </div>

        {/* Google Maps iframe */}
        <iframe
          title="موقع حفل الزفاف"
          src={venue.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </motion.div>
    </section>
  );
}
