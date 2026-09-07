import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar as CalendarIcon, Check } from 'lucide-react';
import { BotanicalBranch, WheatFlowers } from './FloralElements';

export default function CountdownCalendar({ eventDate, venue, couple }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [addedToCal, setAddedToCal] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(eventDate.targetIso || '2026-10-04T20:00:00').getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventDate.targetIso]);

  // Calendar Calculation for October 2026
  // Weekday columns order in Screenshot 1: إث (Mon), ثل (Tue), أر (Wed), خم (Thu), جم (Fri), سب (Sat), أح (Sun)
  const year = parseInt(eventDate.year, 10) || 2026;
  const monthIndex = eventDate.monthIndex ?? 9; // October = 9 (0-indexed)
  const highlightDay = eventDate.highlightDay || 4;

  // Day of week for 1st of month: 0 is Sun, 1 is Mon, etc.
  // Monday-based index: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1; // Oct 1, 2026 is Thursday -> index 3
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); // 31 days

  const calendarSlots = [];
  for (let i = 0; i < startDay; i++) {
    calendarSlots.push({ day: null, isCurrent: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarSlots.push({
      day: d,
      isCurrent: true,
      isHighlighted: d === highlightDay,
    });
  }

  // Handle Add to Calendar (.ics and Google Calendar)
  const handleAddToCalendar = (e) => {
    e.preventDefault();
    const eventYear = eventDate.year || '2026';
    const eventMonth = String(eventDate.monthIndex !== undefined ? eventDate.monthIndex + 1 : 10).padStart(2, '0');
    const eventDay = String(eventDate.dayNumber || '04').padStart(2, '0');
    const dtStart = `${eventYear}${eventMonth}${eventDay}T170000Z`;
    const dtEnd = `${eventYear}${eventMonth}${eventDay}T230000Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:حفل زفاف ${couple.primaryArabic || 'عبد الرحمن ومنة الله'}`,
      `DESCRIPTION:يسعدنا حضوركم حفل زفافنا في ${venue?.name || 'قاعة ريفيرا'}.`,
      `LOCATION:${venue?.name || 'قاعة ريفيرا'}, ${venue?.address || ''}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Wedding_Invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAddedToCal(true);
    setTimeout(() => setAddedToCal(false), 3000);
  };

  return (
    <section id="reception" className="relative py-6 px-4 max-w-md mx-auto text-center overflow-visible">
      {/* Outer Paper Card Container (Matching Screenshot 1) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative w-full max-w-[340px] sm:max-w-[370px] mx-auto rounded-[28px] bg-[#EFE8DE] p-6 sm:p-7 shadow-[0_8px_30px_rgba(85,71,60,0.06)] border border-[#E5DCCE] overflow-visible text-center"
      >
        {/* Dried Botanical Branch on the Right Margin (Matching Screenshot 1) */}
        <div className="absolute top-28 -right-8 w-24 sm:w-28 pointer-events-none select-none z-20">
          <BotanicalBranch className="w-full" flip={true} rotate={20} />
        </div>

        {/* Dried Golden Flowers on bottom-left corner (Matching Screenshot 1) */}
        <div className="absolute -bottom-5 -left-6 w-20 pointer-events-none select-none z-20">
          <WheatFlowers className="w-full" flip={false} rotate={-10} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Header: معلومات الاستقبال */}
          <h2 className="font-alexandria text-lg sm:text-xl font-bold text-[#55473C] mb-3 tracking-wide">
            {couple.receptionHeader || 'معلومات الاستقبال'}
          </h2>

          {/* Subtitle: سيقام الاستقبال في: */}
          <p className="font-alexandria text-xs sm:text-sm text-[#7D6E62] mb-3">
            {couple.receptionSubtitle || 'سيقام الاستقبال في:'}
          </p>

          {/* Event Time: PM 8:00 */}
          <div className="font-cormorant text-3xl sm:text-4xl text-[#55473C] font-normal tracking-wide my-1">
            {eventDate.time || 'PM 8:00'}
          </div>

          {/* Date Row: الأحد | 04 | أكتوبر */}
          <div className="flex items-center justify-center gap-3 my-2 text-[#55473C]">
            <span className="font-alexandria text-xs sm:text-sm font-medium text-[#7D6E62]">
              {eventDate.dayOfWeekArabic || 'الأحد'}
            </span>
            <span className="text-[#C5A880] text-sm font-light">|</span>
            <span className="font-cormorant text-3xl sm:text-4xl font-normal tracking-tight text-[#55473C]">
              {eventDate.dayNumber || '04'}
            </span>
            <span className="text-[#C5A880] text-sm font-light">|</span>
            <span className="font-alexandria text-xs sm:text-sm font-medium text-[#7D6E62]">
              {eventDate.monthNameArabic || 'أكتوبر'}
            </span>
          </div>

          {/* Year: 2026 */}
          <div className="font-cormorant text-xl text-[#7D6E62] font-normal mb-6">
            {eventDate.year || '2026'}
          </div>

          {/* Countdown Section (Matching Screenshot 1) */}
          <div className="w-full mb-6 text-center">
            <p className="font-alexandria text-xs sm:text-sm text-[#7D6E62] mb-1.5 font-medium">
              {couple.countdownTitle || 'العد التنازلي'}
            </p>
            <p className="font-alexandria text-xs sm:text-[13px] text-[#55473C] font-semibold tracking-wide dir-rtl">
              {timeLeft.days} يوم {timeLeft.hours} ساعة {timeLeft.minutes} دقيقة {timeLeft.seconds} ثانية
            </p>
          </div>

          {/* ============================================================
              MOCHA CALENDAR CARD (Exact Match to Screenshot 1 & 3)
              ============================================================ */}
          <div className="w-full max-w-[300px] sm:max-w-[320px] rounded-2xl bg-[#6D5D50] text-white p-4 sm:p-5 shadow-[0_8px_20px_rgba(70,55,45,0.22)] my-2">
            {/* Month & Year: أكتوبر 2026 in elegant white script/serif */}
            <h3 className="font-cormorant italic text-lg sm:text-xl font-normal text-white text-center mb-3">
              {eventDate.monthNameArabic || 'أكتوبر'} {eventDate.year || '2026'}
            </h3>

            {/* Divider line */}
            <div className="w-full h-[0.8px] bg-white/25 mb-3" />

            {/* Weekdays Row in Arabic: إث  ثل  أر  خم  جم  سب  أح */}
            <div className="grid grid-cols-7 text-center text-[10px] sm:text-[11px] font-alexandria font-normal text-white/75 pb-2 mb-2">
              <span>إث</span>
              <span>ثل</span>
              <span>أر</span>
              <span>خم</span>
              <span>جم</span>
              <span>سب</span>
              <span>أح</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs sm:text-sm font-alexandria">
              {calendarSlots.map((slot, idx) => (
                <div key={idx} className="h-7 flex items-center justify-center relative">
                  {!slot.day ? (
                    <span className="text-transparent" />
                  ) : slot.isHighlighted ? (
                    // White Heart Badge with number inside in mocha brown (Exact match to Screenshot 1)
                    <div className="relative flex items-center justify-center">
                      <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white drop-shadow-xs" />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-[#6D5D50]">
                        {slot.day}
                      </span>
                    </div>
                  ) : (
                    <span className="text-white/90 font-light">
                      {slot.day}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add to Calendar Link Button (Matching Screenshot 3) */}
          <button
            onClick={handleAddToCalendar}
            className="font-alexandria text-xs sm:text-sm text-[#7D6E62] hover:text-[#55473C] underline underline-offset-4 decoration-[#C5A880] my-4 tracking-wide cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            {addedToCal ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تمت الإضافة للتقويم</span>
              </>
            ) : (
              <>
                <CalendarIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>أضف إلى التقويم</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </section>
  );
}

