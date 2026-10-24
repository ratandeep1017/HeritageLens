import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Navigation,
  Building2,
  Train,
  Clock,
  Ticket,
  Volume2,
  Landmark,
  Utensils,
  ArrowRight,
  Eye,
  Compass,
  Layers,
  ChevronRight,
  Zap,
  MapPin,
  Globe,
} from 'lucide-react';

interface HowToUseDossierGuideProps {
  currentLang: 'en' | 'hi';
}

export const HowToUseDossierGuide: React.FC<HowToUseDossierGuideProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'intel' | 'transit' | 'culture'>('all');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' });

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' });

  // 1. Three Simple Steps
  const workflowSteps = [
    {
      step: '01',
      titleEn: 'Search or Snap',
      titleHi: 'खोजें या तस्वीर लें',
      descEn: 'Type any monument name or snap a photo with AI Vision Studio.',
      descHi: 'किसी स्मारक का नाम लिखें या कैमरे से तस्वीर लें।',
      icon: Search,
      gradient: 'from-[#C05E42] to-[#E8845C]',
      glowColor: 'rgba(192,94,66,0.15)',
    },
    {
      step: '02',
      titleEn: 'AI Verifies',
      titleHi: 'AI सत्यापन',
      descEn: 'Neural algorithms match architecture against ASI & UNESCO databases.',
      descHi: 'AI स्थापत्य का मिलान ASI व UNESCO से करता है।',
      icon: Sparkles,
      gradient: 'from-[#D4AF37] to-[#F0D060]',
      glowColor: 'rgba(212,175,55,0.15)',
    },
    {
      step: '03',
      titleEn: 'Get Full Dossier',
      titleHi: 'पूरी जानकारी पाएं',
      descEn: 'Unlock maps, hotels, audio guide, metro info & ticket prices instantly.',
      descHi: 'नक्शे, होटल, ऑडियो गाइड, मेट्रो व टिकट जानकारी तुरंत पाएं।',
      icon: Compass,
      gradient: 'from-[#2C4A3E] to-[#4A7A6A]',
      glowColor: 'rgba(44,74,62,0.15)',
    },
  ];

  // 2. Feature cards
  const dossierFeatures = [
    {
      id: 'maps',
      category: 'transit',
      icon: Navigation,
      gradient: 'from-[#C05E42] to-[#E88A60]',
      titleEn: 'Live Maps & Satellite',
      titleHi: 'लाइव मैप व सैटेलाइट',
      tagEn: 'GPS',
      tagHi: 'GPS',
      descEn: 'Interactive maps with 1-click Google directions & 3D satellite view.',
      descHi: 'इंटरैक्टिव मैप, गूगल दिशा-निर्देश व 3D सैटेलाइट व्यू।',
    },
    {
      id: 'hotels',
      category: 'transit',
      icon: Building2,
      gradient: 'from-[#2C4A3E] to-[#4B8A72]',
      titleEn: 'Hotels & Booking',
      titleHi: 'होटल व बुकिंग',
      tagEn: 'Booking.com · OYO',
      tagHi: 'बुकिंग साइट्स',
      descEn: 'Dharamshalas, heritage stays with 1-click booking on partner sites.',
      descHi: 'धर्मशालाएं, हेरिटेज होटल व पार्टनर साइट पर 1-क्लिक बुकिंग।',
    },
    {
      id: 'metro',
      category: 'transit',
      icon: Train,
      gradient: 'from-[#2563EB] to-[#60A5FA]',
      titleEn: 'Metro & Transit',
      titleHi: 'मेट्रो व ट्रांजिट',
      tagEn: 'Routes',
      tagHi: 'मार्ग',
      descEn: 'Nearest metro line, station, exit gate & walking distance.',
      descHi: 'निकटतम मेट्रो लाइन, स्टेशन, गेट व पैदल दूरी।',
    },
    {
      id: 'timings',
      category: 'intel',
      icon: Clock,
      gradient: 'from-[#B45309] to-[#F59E0B]',
      titleEn: 'Timings & Days',
      titleHi: 'समय व दिन',
      tagEn: 'Schedule',
      tagHi: 'समय सारणी',
      descEn: 'Opening hours, closed days, best visiting months & crowd alerts.',
      descHi: 'खुलने का समय, अवकाश, सर्वोत्तम महीने व भीड़ अलर्ट।',
    },
    {
      id: 'tickets',
      category: 'intel',
      icon: Ticket,
      gradient: 'from-[#BE123C] to-[#FB7185]',
      titleEn: 'Entry Fees',
      titleHi: 'प्रवेश शुल्क',
      tagEn: 'ASI Rates',
      tagHi: 'ASI दरें',
      descEn: 'Indian, SAARC & foreign tourist fees, light show & camera charges.',
      descHi: 'भारतीय, SAARC व विदेशी शुल्क, लाइट शो व कैमरा शुल्क।',
    },
    {
      id: 'audio',
      category: 'culture',
      icon: Volume2,
      gradient: 'from-[#A07C1C] to-[#D4AF37]',
      titleEn: 'Audio Guide',
      titleHi: 'ऑडियो गाइड',
      tagEn: 'EN & हिन्दी',
      tagHi: 'EN & हिन्दी',
      descEn: 'Hands-free bilingual narration — walk & listen to history come alive.',
      descHi: 'अंग्रेजी-हिन्दी ऑडियो कथन — चलते-चलते इतिहास सुनें।',
    },
    {
      id: 'history',
      category: 'intel',
      icon: Landmark,
      gradient: 'from-[#2C4A3E] to-[#5B9E82]',
      titleEn: 'Architecture & History',
      titleHi: 'स्थापत्य व इतिहास',
      tagEn: 'UNESCO',
      tagHi: 'UNESCO',
      descEn: 'Built year, patron, architectural style, folklore separated from facts.',
      descHi: 'निर्माण वर्ष, संरक्षक, शैली, लोककथाएं तथ्यों से अलग।',
    },
    {
      id: 'food',
      category: 'culture',
      icon: Utensils,
      gradient: 'from-[#C2410C] to-[#FB923C]',
      titleEn: 'Food & Bazaars',
      titleHi: 'खानपान व बाज़ार',
      tagEn: 'Local',
      tagHi: 'स्थानीय',
      descEn: 'Historic street food, iconic sweetshops & artisan handicraft markets.',
      descHi: 'प्रसिद्ध स्ट्रीट फूड, मिठाई दुकानें व हस्तशिल्प बाज़ार।',
    },
  ];

  const filteredFeatures =
    activeTab === 'all' ? dossierFeatures : dossierFeatures.filter((f) => f.category === activeTab);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, type: 'spring', stiffness: 200, damping: 18 },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works-guide"
      className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-12 overflow-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION HEADER — animated entrance                                   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2C4A3E]/10 to-[#D4AF37]/10 border border-[#2C4A3E]/15 text-[#2C4A3E] text-xs font-bold mb-4 shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span>{currentLang === 'en' ? 'Heritage Intelligence Guide' : 'धरोहर इंटेलिजेंस गाइड'}</span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-serif-heritage text-[#1A1A1A] leading-tight mb-3">
          {currentLang === 'en' ? (
            <>
              How It Works &{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#C05E42] to-[#D4AF37] bg-clip-text text-transparent">
                  What You Unlock
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C05E42] to-[#D4AF37] rounded-full origin-left"
                />
              </span>
            </>
          ) : (
            <>
              कैसे काम करता है &{' '}
              <span className="bg-gradient-to-r from-[#C05E42] to-[#D4AF37] bg-clip-text text-transparent">
                आपको क्या मिलता है
              </span>
            </>
          )}
        </h2>

        <p className="text-sm text-[#5C544E] leading-relaxed max-w-xl mx-auto">
          {currentLang === 'en'
            ? 'Three steps to unlock 8 intelligence layers for every monument — maps, hotels, audio, metro routes & more.'
            : 'हर स्मारक के लिए 8 जानकारी — नक्शे, होटल, ऑडियो, मेट्रो व अन्य — पाने के 3 कदम।'}
        </p>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* THREE-STEP WORKFLOW — animated cards with gradient accents             */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div ref={stepsRef}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={stepsInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F3EEE7] border border-[#E8E2D9]">
            <Layers className="w-4 h-4 text-[#C05E42]" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#8C8276]">
              {currentLang === 'en' ? '3 Simple Steps' : '3 सरल चरण'}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#E8E2D9] to-transparent" />
          <span className="text-[11px] font-semibold text-[#8C8276] hidden sm:inline">
            {currentLang === 'en' ? 'Free • No signup' : 'निःशुल्क • बिना पंजीकरण'}
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={stepsInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {workflowSteps.map((ws, idx) => {
            const Icon = ws.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative rounded-3xl overflow-hidden cursor-default"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1.5px]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${ws.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                </div>

                <div
                  className="relative bg-white/90 backdrop-blur-sm border border-[#E8E2D9] group-hover:border-transparent rounded-3xl p-6 h-full flex flex-col gap-4 transition-all duration-300"
                  style={{
                    boxShadow: `0 2px 8px rgba(0,0,0,0.03), 0 0 0 0 ${ws.glowColor}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${ws.glowColor}, 0 4px 12px rgba(0,0,0,0.06)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 8px rgba(0,0,0,0.03)`;
                  }}
                >
                  {/* Step number — large watermark */}
                  <span className="absolute top-3 right-4 text-[3.5rem] font-black text-[#E8E2D9]/50 group-hover:text-[#E8E2D9]/80 select-none font-serif-heritage transition-colors duration-300 leading-none">
                    {ws.step}
                  </span>

                  {/* Icon with animated gradient background */}
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${ws.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>

                  <div>
                    <h3 className="text-lg font-bold font-serif-heritage text-[#1A1A1A] mb-1.5 leading-tight">
                      {currentLang === 'en' ? ws.titleEn : ws.titleHi}
                    </h3>
                    <p className="text-[13px] text-[#5C544E] leading-relaxed">
                      {currentLang === 'en' ? ws.descEn : ws.descHi}
                    </p>
                  </div>

                  {/* Animated progress line */}
                  <div className="mt-auto pt-3">
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          initial={false}
                          animate={{
                            scale: dot <= idx ? 1 : 0.7,
                            opacity: dot <= idx ? 1 : 0.3,
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            dot <= idx
                              ? `bg-gradient-to-r ${ws.gradient} flex-1`
                              : 'bg-[#E8E2D9] flex-1'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#8C8276] mt-1.5 block">
                      {currentLang === 'en' ? `Step ${idx + 1} of 3` : `चरण ${idx + 1} / 3`}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Connector arrows between steps (desktop) */}
        <div className="hidden md:flex justify-around px-16 -mt-3 pointer-events-none">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={stepsInView ? { opacity: 0.4, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              <ChevronRight className="w-5 h-5 text-[#C05E42]" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* WHAT YOU RECEIVE — 8-feature glassmorphic grid                        */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={gridRef}
        className="relative rounded-[2rem] overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] via-[#F8F4EE] to-[#F3EEE7] -z-10" />
        <div
          className="absolute inset-0 opacity-[0.02] -z-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #2C4A3E 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="p-6 sm:p-8 flex flex-col gap-6 border border-[#E8E2D9] rounded-[2rem]">
          {/* Header + Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <motion.div
                  animate={gridInView ? { rotate: [0, 360] } : {}}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                >
                  <Zap className="w-4.5 h-4.5 text-[#D4AF37]" />
                </motion.div>
                <span className="text-xs font-bold text-[#C05E42] uppercase tracking-wider">
                  {currentLang === 'en' ? '8 Intelligence Layers' : '8 जानकारी परतें'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-heritage text-[#1A1A1A]">
                {currentLang === 'en'
                  ? 'What Every Monument Profile Contains'
                  : 'हर स्मारक प्रोफ़ाइल में क्या मिलता है'}
              </h3>
            </div>

            {/* Animated Filter Pills */}
            <div className="flex items-center gap-1 self-start sm:self-auto shrink-0 bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-[#E8E2D9] shadow-sm">
              {[
                { id: 'all', labelEn: 'All', labelHi: 'सभी', icon: Globe },
                { id: 'transit', labelEn: 'Maps & Stays', labelHi: 'नक्शे', icon: MapPin },
                { id: 'intel', labelEn: 'Info & Fees', labelHi: 'जानकारी', icon: Ticket },
                { id: 'culture', labelEn: 'Audio & Food', labelHi: 'ऑडियो', icon: Volume2 },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? 'text-white shadow-md'
                        : 'text-[#5C544E] hover:text-[#1A1A1A] hover:bg-[#F3EEE7]'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 bg-gradient-to-r from-[#2C4A3E] to-[#4A7A6A] rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <TabIcon className="w-3 h-3 relative z-10" />
                    <span className="relative z-10">{currentLang === 'en' ? tab.labelEn : tab.labelHi}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* 8-Card Grid — Animated stagger */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filteredFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              const isHovered = hoveredFeature === feat.id;

              return (
                <motion.div
                  key={feat.id}
                  custom={idx}
                  variants={featureCardVariants}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredFeature(feat.id)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="group relative rounded-2xl cursor-default overflow-hidden"
                >
                  {/* Hover glow border */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.gradient} transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ padding: '1.5px' }}
                  >
                    <div className="w-full h-full rounded-2xl bg-white" />
                  </div>

                  <div className="relative bg-white/95 backdrop-blur-sm border border-[#E8E2D9] group-hover:border-transparent rounded-2xl p-5 h-full flex flex-col gap-3 transition-all duration-300 group-hover:shadow-lg">
                    {/* Top row: Icon + Tag */}
                    <div className="flex items-center justify-between">
                      <motion.div
                        animate={isHovered ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-[18px] h-[18px] text-white" />
                      </motion.div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all duration-300 ${
                          isHovered
                            ? `bg-gradient-to-r ${feat.gradient} text-white shadow-sm`
                            : 'bg-[#F3EEE7] text-[#5C544E] border border-[#E8E2D9]'
                        }`}
                      >
                        {currentLang === 'en' ? feat.tagEn : feat.tagHi}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-[15px] font-bold text-[#1A1A1A] leading-snug">
                      {currentLang === 'en' ? feat.titleEn : feat.titleHi}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-[#6B635B] leading-relaxed flex-1">
                      {currentLang === 'en' ? feat.descEn : feat.descHi}
                    </p>

                    {/* Bottom animated indicator */}
                    <div className="pt-2">
                      <div className="h-[3px] rounded-full bg-[#F3EEE7] overflow-hidden">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={isHovered ? { width: '100%' } : { width: '30%' }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${feat.gradient}`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Live Sample Preview Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#2C4A3E] to-[#1A332A] -z-10" />
            <div
              className="absolute inset-0 opacity-[0.04] -z-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            />

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C05E42] flex items-center justify-center shadow-lg shrink-0"
                >
                  <Eye className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <span className="text-sm font-bold text-white block">
                    {currentLang === 'en' ? 'Try a live dossier now' : 'अभी लाइव देखें'}
                  </span>
                  <span className="text-[11px] text-white/60">
                    {currentLang === 'en'
                      ? 'Experience maps, booking dots, audio & more:'
                      : 'नक्शे, बुकिंग, ऑडियो अभी अनुभव करें:'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'golden-temple-amritsar', nameEn: 'Golden Temple', nameHi: 'स्वर्ण मंदिर' },
                  { id: 'red-fort', nameEn: 'Red Fort', nameHi: 'लाल किला' },
                  { id: 'qutub-minar', nameEn: 'Qutub Minar', nameHi: 'क़ुतुब मीनार' },
                ].map((samp) => (
                  <Link
                    key={samp.id}
                    to={`/result?site=${samp.id}`}
                    className="group/link px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white border border-white/20 hover:border-white text-white hover:text-[#2C4A3E] text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 backdrop-blur-sm"
                  >
                    <span>{currentLang === 'hi' ? samp.nameHi : samp.nameEn}</span>
                    <ArrowRight className="w-3 h-3 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
