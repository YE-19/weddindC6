import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  Heart,
  MessageCircleHeart,
  Sparkles,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  listenToWishes,
  addWish,
  likeWish,
  getDatabaseStatus,
} from '../services/firebase';

export default function Guestbook() {
  const [name, setName] = useState('');
  const [wishes, setWishes] = useState('');
  const [wishesList, setWishesList] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [dbStatus, setDbStatus] = useState({ isCloud: false });
  const [likedMap, setLikedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wedding_liked_wishes') || '{}');
    } catch {
      return {};
    }
  });

  // Check DB status on mount
  useEffect(() => {
    setDbStatus(getDatabaseStatus());
  }, []);

  // Subscribe to real-time wishes from Firebase / local storage
  useEffect(() => {
    const unsubscribe = listenToWishes((data) => {
      setWishesList(data || []);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !wishes.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await addWish({
        name: name.trim(),
        wishes: wishes.trim(),
      });

      setIsSubmitted(true);
      setName('');
      setWishes('');

      // Confetti celebration
      try {
        confetti({
          particleCount: 65,
          spread: 85,
          origin: { y: 0.65 },
          colors: ['#C5A880', '#6D5D50', '#E5D5BA', '#D4AF37'],
        });
      } catch (err) {
        console.error(err);
      }

      setTimeout(() => {
        setIsSubmitted(false);
      }, 4500);
    } catch (err) {
      console.error('Error submitting wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (wishId) => {
    if (likedMap[wishId]) return; // prevent spamming from same device

    const newLikedMap = { ...likedMap, [wishId]: true };
    setLikedMap(newLikedMap);
    try {
      localStorage.setItem('wedding_liked_wishes', JSON.stringify(newLikedMap));
    } catch {
      // ignore
    }

    likeWish(wishId);
  };

  return (
    <section id="guestbook" className="py-8 px-4 max-w-md mx-auto text-center overflow-visible">
      {/* 1. Main Guestbook Input Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[340px] sm:max-w-[370px] mx-auto rounded-[28px] bg-[#EFE8DE] p-6 sm:p-7 shadow-[0_8px_30px_rgba(85,71,60,0.06)] border border-[#E5DCCE] text-center mb-8 relative"
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6D5D50]/10 text-[#6D5D50] mb-3">
          <MessageCircleHeart className="w-5 h-5 text-[#6D5D50]" />
        </div>

        <h2 className="font-alexandria text-lg sm:text-xl font-bold text-[#55473C] mb-2 tracking-wide">
          دفتر التهاني
        </h2>
        <p className="font-alexandria text-xs text-[#7D6E62] mb-6">
          شاركونا فرحتنا بكلماتكم ودعواتكم الجميلة 🤍
        </p>

        {/* Success Alert */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-4 p-3 rounded-2xl bg-[#6D5D50] text-white flex items-center justify-center gap-2 text-xs font-alexandria shadow-md overflow-hidden"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>شكراً لكم! تم إرسال تهنئتكم ومشاركتها مع الجميع ✨</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form Box Area */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-right">
          <div className="relative">
            <input
              type="text"
              required
              maxLength={60}
              placeholder="الاسم الكريم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DACBB8] focus:border-[#6D5D50] focus:ring-1 focus:ring-[#6D5D50] focus:outline-none text-xs text-[#55473C] shadow-xs text-right placeholder:text-[#A49486] transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#A49486]">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              maxLength={350}
              placeholder="اكتب تهنئتك للعروسين..."
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DACBB8] focus:border-[#6D5D50] focus:ring-1 focus:ring-[#6D5D50] focus:outline-none text-xs text-[#55473C] shadow-xs resize-none text-right placeholder:text-[#A49486] transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-[#6D5D50] hover:bg-[#5C4E42] text-white font-alexandria text-xs font-medium flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all border border-[#877669]/30 disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الحفظ والمشاركة...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>إرسال التهنئة</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* 2. Wishes Live Feed Section */}
      <div className="w-full max-w-[340px] sm:max-w-[370px] mx-auto text-right">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <h3 className="font-alexandria text-sm font-bold text-[#55473C]">
              تهاني ومباركات الضيوف
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {dbStatus.isCloud && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-medium font-alexandria border border-emerald-600/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                مباشر
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-[#E8DEC8]/60 text-[#6D5D50] text-[11px] font-medium font-alexandria border border-[#DACBB8]">
              {wishesList.length} {wishesList.length === 1 ? 'تهنئة' : 'تهاني'}
            </span>
          </div>
        </div>

        {/* Wishes List */}
        {wishesList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/70 border border-[#E5DCCE] text-center">
            <Heart className="w-6 h-6 text-[#C5A880] mx-auto mb-2 opacity-60" />
            <p className="font-alexandria text-xs text-[#7D6E62]">
              كن أول من يشارك العروسين فرحتهم بالتهنئة ✨
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {wishesList.slice(0, visibleCount).map((item) => {
                const isLiked = Boolean(likedMap[item.id]);
                const initialLetter = item.name ? item.name.trim().charAt(0) : 'م';

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    transition={{ duration: 0.35 }}
                    className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#E5DCCE] shadow-[0_4px_16px_rgba(85,71,60,0.04)] text-right relative hover:shadow-[0_6px_20px_rgba(85,71,60,0.08)] transition-all"
                  >
                    {/* Header: Avatar, Name & Timestamp */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#6D5D50] text-[#EFE8DE] flex items-center justify-center text-xs font-bold font-alexandria shadow-xs shrink-0">
                          {initialLetter}
                        </div>
                        <div>
                          <h4 className="font-alexandria text-xs font-bold text-[#55473C] leading-tight">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-[#A49486] font-alexandria mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{item.timestamp || 'الآن'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Like Heart Button */}
                      <button
                        type="button"
                        onClick={() => handleLike(item.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-alexandria transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-[#EAE0D5] text-[#8C2D2D] font-bold scale-105'
                            : 'bg-[#F5EFE6] text-[#7D6E62] hover:bg-[#EAE0D5] hover:text-[#55473C]'
                        }`}
                        title="أعجبني"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-transform ${
                            isLiked ? 'fill-[#A63A3A] text-[#A63A3A] scale-110' : 'text-[#877669]'
                          }`}
                        />
                        <span>{item.likes || 0}</span>
                      </button>
                    </div>

                    {/* Wish Message Content */}
                    <p className="font-alexandria text-xs text-[#55473C] leading-relaxed whitespace-pre-line pr-9 pl-1">
                      {item.wishes}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Expand / Collapse Button */}
            {wishesList.length > 5 && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() =>
                  setVisibleCount((prev) =>
                    prev >= wishesList.length ? 5 : prev + 5
                  )
                }
                className="w-full py-2.5 rounded-xl bg-white/70 hover:bg-white border border-[#DACBB8] text-[#6D5D50] font-alexandria text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer mt-2"
              >
                {visibleCount >= wishesList.length ? (
                  <>
                    <span>عرض أقل</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>عرض المزيد من التهاني ({wishesList.length - visibleCount})</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
