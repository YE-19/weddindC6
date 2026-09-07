import p1 from '../assets/p1.jpg';
import p2 from '../assets/p2.jpg';
import p3 from '../assets/p3.jpg';
import g1 from '../assets/g1.jpg';

export const invitationConfig = {
  // Couple details (Abdelrahman Mahmoud & Mennatallah Hamed)
  couple: {
    groom: "Abdelrahman",
    groomArabic: "عبد الرحمن محمود",
    groomFull: "Abdelrahman Mahmoud",
    groomTitle: "GROOM",
    
    bride: "Menna",
    brideArabic: "منة الله حامد",
    brideFull: "Mennatallah Hamed",
    brideTitle: "BRIDE",
    
    primary: "Menna & Abdelrahman",
    primaryArabic: "عبد الرحمن ومنة الله",
    initials: "M & A",
    monogram: "MA",
    
    eventTitle: "THE WEDDING OF",
    partyHeader: "معلومات الحفل",
    receptionHeader: "معلومات الاستقبال",
    galleryHeader: "معرض الصور",
    venueHeader: "مكان الاستقبال",
    
    // First message (اول ماسيدج)
    poeticQuote: "ومن بين كل الحكايات، اختارنا أن نبدأ حكايتنا معًا…\nوبقلوبٍ ممتنة لله على أجمل ما رزقنا، ندعوكم لتشاركونا أول فصول فرحتنا،\nفوجودكم بيننا هو أجمل ما تكتمل به ليلتنا 🤍",
    
    // Second message (تاني ماسيدج)
    thankYouMessage: "شكرًا لكل قلب فرح لنا ولكل دعوة جميلة رافقت بدايتنا 🤍",
    
    receptionSubtitle: "سيقام الاستقبال في:",
    countdownTitle: "العد التنازلي",
  },

  // Date & Time (Sunday, 04 October 2026 at 8:00 PM)
  eventDate: {
    display: "October 04, 2026",
    displayArabic: "4 أكتوبر 2026",
    dayOfWeek: "SUNDAY",
    dayOfWeekArabic: "الأحد",
    dayNumber: "04",
    dayNumberNum: 4,
    monthName: "OCTOBER",
    monthNameArabic: "أكتوبر",
    year: "2026",
    time: "PM 8:00",
    timeArabic: "8:00 مساءً",
    targetIso: "2026-10-04T20:00:00",
    monthIndex: 9, // 0-based: October = 9
    highlightDay: 4,
  },

  // Venue details (قاعة ريفيرا كورنيش النيل نادي الري أمام البنك الاهلي)
  venue: {
    name: "قاعة ريفيرا كورنيش النيل",
    subtitle: "نادي الري - أمام البنك الأهلي",
    address: "قاعة ريفيرا، كورنيش النيل، نادي الري أمام البنك الأهلي",
    city: "القاهرة",
    googleMapsLink: "https://maps.app.goo.gl/dpjDv7GdaqHV9jx86?g_st=aw",
    mapEmbedUrl: "https://maps.google.com/maps?q=Rivera+Hall+Corniche+El+Nile&hl=ar&z=15&output=embed",
    image: g1,
  },

  // Photos
  gallery: [
    {
      id: 1,
      role: "Couple",
      src: p3,
      title: "Menna & Abdelrahman",
      caption: "معاً نبدأ رحلتنا",
    },
    {
      id: 2,
      role: "Groom",
      src: p1,
      title: "Abdelrahman Mahmoud",
      caption: "العريس",
    },
    {
      id: 3,
      role: "Bride",
      src: p2,
      title: "Mennatallah Hamed",
      caption: "العروس",
    },
  ],

  // Initial guestbook wishes
  initialWishes: [
    {
      id: "w-1",
      name: "أحمد و سارة",
      wishes: "ألف مليون مبروك لأحلى عروسين! بارك الله لكما وبارك عليكما وجمع بينكما في خير 🤍",
      timestamp: "اليوم",
      likes: 24,
    },
    {
      id: "w-2",
      name: "محمد الشناوي",
      wishes: "ألف مبروك يا عبد الرحمن وربنا يتمملكم على خير وسعادة دائمة يا رب!",
      timestamp: "اليوم",
      likes: 18,
    },
  ],
};


