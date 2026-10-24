import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Camera,
  Sparkles,
  Navigation,
  Building2,
  Train,
  Clock,
  Ticket,
  Volume2,
  Landmark,
  Utensils,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Compass,
  Layers,
  MapPin,
  ChevronRight,
  Eye,
  ShoppingBag
} from 'lucide-react';

interface HowToUseDossierGuideProps {
  currentLang: 'en' | 'hi';
}

export const HowToUseDossierGuide: React.FC<HowToUseDossierGuideProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'intel' | 'transit' | 'culture'>('all');

  // 1. Three Simple Steps to Use the Platform
  const workflowSteps = [
    {
      step: '01',
      titleEn: 'Discover by Search or Camera',
      titleHi: 'खोजें या तस्वीर लें',
      descEn: 'Type any monument or city name in the AI search bar, or snap a live photo of any historic facade with the Vision Studio.',
      descHi: 'एआई सर्च बार में किसी भी स्मारक का नाम लिखें, या विज़न स्टूडियो से किसी भी ऐतिहासिक इमारत की तस्वीर खींचें।',
      icon: Search,
      accentBg: 'bg-[#C05E42]/10',
      accentBorder: 'border-[#C05E42]/20',
      accentColor: 'text-[#C05E42]',
      badgeEn: 'Search or Snap',
      badgeHi: 'सर्च या कैमरा'
    },
    {
      step: '02',
      titleEn: 'Instant Multi-Modal Verification',
      titleHi: 'त्वरित एआई प्रमाणीकरण',
      descEn: 'Our neural vision algorithms match architectural motifs against ASI & UNESCO databases and extract real-time GPS coordinates.',
      descHi: 'एआई मेहराबों, गुंबदों और नक्काशी का मिलान एएसआई व यूनेस्को अभिलेखों से कर सटीक भौगोलिक निर्देशांक प्राप्त करता है।',
      icon: Sparkles,
      accentBg: 'bg-[#D4AF37]/15',
      accentBorder: 'border-[#D4AF37]/30',
      accentColor: 'text-[#A07C1C]',
      badgeEn: 'AI Neural Matching',
      badgeHi: 'एआई न्यूरल मिलान'
    },
    {
      step: '03',
      titleEn: 'Unlock Your Complete Dossier',
      titleHi: 'संपूर्ण यात्रा गाइड अनलॉक करें',
      descEn: 'Receive a full traveler dossier with live maps, metro transit, vetted stays with 1-click booking, audio guide, and entry fees.',
      descHi: 'नक्शे, निकटतम मेट्रो, 1-क्लिक होटल बुकिंग, द्विभाषी ऑडियो गाइड और टिकट दरों से युक्त संपूर्ण विवरणिका प्राप्त करें।',
      icon: Compass,
      accentBg: 'bg-[#2C4A3E]/10',
      accentBorder: 'border-[#2C4A3E]/20',
      accentColor: 'text-[#2C4A3E]',
      badgeEn: '360° Intelligence',
      badgeHi: '360° जानकारी'
    }
  ];

  // 2. Comprehensive Intelligence Features User Unlocks
  const dossierFeatures = [
    {
      id: 'maps',
      category: 'transit',
      icon: Navigation,
      iconColor: 'text-[#C05E42]',
      iconBg: 'bg-[#C05E42]/10',
      borderHover: 'hover:border-[#C05E42]',
      titleEn: 'Interactive Maps & 3D Satellite',
      titleHi: 'इंटरैक्टिव मैप्स एवं गूगल 3D',
      badgeEn: 'GPS Coordinates',
      badgeHi: 'सटीक जीपीएस',
      descEn: 'Exact coordinates on interactive Leaflet maps, 1-click turn-by-turn Google Maps directions, and 3D satellite view without API keys.',
      descHi: 'इंटरैक्टिव लीफ़लेट मानचित्र, 1-क्लिक गूगल मैप्स दिशा-निर्देश, तथा उपग्रह 3D व्यू की सुविधा।'
    },
    {
      id: 'hotels',
      category: 'transit',
      icon: Building2,
      iconColor: 'text-[#2C4A3E]',
      iconBg: 'bg-[#2C4A3E]/10',
      borderHover: 'hover:border-[#2C4A3E]',
      titleEn: 'Nearby Hotels & 1-Click Booking',
      titleHi: 'समीपवर्ती होटल व 1-क्लिक बुकिंग',
      badgeEn: 'MakeMyTrip • Booking.com • OYO',
      badgeHi: 'प्रमुख बुकिंग साइट्स',
      descEn: 'Curated pilgrim dharamshalas, sarais, and heritage stays with estimated tariffs and pre-filled 1-click search buttons for MMT, Booking.com, Goibibo, OYO & Google Hotels.',
      descHi: 'किफायती धर्मशालाएं, आश्रम व हेरिटेज होटल, अनुमानित किराया, तथा मेकमाईट्रिप, बुकिंग.कॉम, ओयो व गूगल होटल्स के सीधे लिंक।'
    },
    {
      id: 'metro',
      category: 'transit',
      icon: Train,
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-50',
      borderHover: 'hover:border-blue-400',
      titleEn: 'Nearest Metro Stations & Lines',
      titleHi: 'निकटतम मेट्रो व रेलवे स्टेशन',
      badgeEn: 'Transit Hubs',
      badgeHi: 'मेट्रो कनेक्टिविटी',
      descEn: 'Exact nearest metro line (Violet, Yellow, Blue, etc.), station name, exit gate recommendations, and walking/auto distance to the entry gate.',
      descHi: 'निकटतम मेट्रो लाइन, स्टेशन का नाम, गेट संख्या, और स्मारक के मुख्य द्वार तक की दूरी व आवागमन के साधन।'
    },
    {
      id: 'timings',
      category: 'intel',
      icon: Clock,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-50',
      borderHover: 'hover:border-amber-400',
      titleEn: 'Official Timings & Open Days',
      titleHi: 'आधिकारिक समय एवं खुलने के दिन',
      badgeEn: 'Weekly Schedule',
      badgeHi: 'समय सारणी',
      descEn: 'Official opening and closing hours, weekly closed days (e.g. Mondays), ideal visiting months, and seasonal crowd alerts.',
      descHi: 'स्मारक खुलने व बंद होने का समय, साप्ताहिक अवकाश के दिन (जैसे सोमवार), और मौसम अनुसार भ्रमण का सर्वोत्तम समय।'
    },
    {
      id: 'tickets',
      category: 'intel',
      icon: Ticket,
      iconColor: 'text-rose-700',
      iconBg: 'bg-rose-50',
      borderHover: 'hover:border-rose-400',
      titleEn: 'Entry Fees & Ticket Breakdown',
      titleHi: 'टिकट दरें एवं प्रवेश शुल्क',
      badgeEn: 'ASI Rates',
      badgeHi: 'प्रवेश शुल्क',
      descEn: 'Current entry fee rates for Indian citizens, SAARC visitors, and Foreign tourists; sound & light show charges; and tripod/camera rules.',
      descHi: 'भारतीय, सार्क एवं विदेशी पर्यटकों के लिए प्रवेश शुल्क, ध्वनि एवं प्रकाश (साउंड एंड लाइट) शो की दरें और कैमरा नियम।'
    },
    {
      id: 'audio',
      category: 'culture',
      icon: Volume2,
      iconColor: 'text-[#D4AF37]',
      iconBg: 'bg-[#D4AF37]/15',
      borderHover: 'hover:border-[#D4AF37]',
      titleEn: 'Dual-Language Audio Narration',
      titleHi: 'द्विभाषी ऑडियो गाइड',
      badgeEn: 'English & हिन्दी Speech',
      badgeHi: 'आवाज़ गाइड',
      descEn: 'Hands-free fluent voice narration in English and Hindi. Listen to stories of emperors, queens, and architects while strolling through historic grounds.',
      descHi: 'अंग्रेजी और हिन्दी में सुगम ऑडियो कथन। स्मारक में घूमते हुए राजा-रानियों, शिल्पकारों और इतिहास की रोचक गाथाएं सुनें।'
    },
    {
      id: 'history',
      category: 'intel',
      icon: Landmark,
      iconColor: 'text-[#2C4A3E]',
      iconBg: 'bg-[#2C4A3E]/10',
      borderHover: 'hover:border-[#2C4A3E]',
      titleEn: 'Deep Architecture & Timeline',
      titleHi: 'गहन स्थापत्य कला व कालक्रम',
      badgeEn: 'ASI & UNESCO Records',
      badgeHi: 'प्रमाणित इतिहास',
      descEn: 'Exact built year, patron emperor, architectural style breakdown (Mughal, Rajput, Dravidian, etc.), and oral folklore legends clearly separated from facts.',
      descHi: 'निर्माण वर्ष, मुख्य वास्तुकार व संरक्षक, स्थापत्य शैली (मुगल, राजपूत, द्रविड़), और जनश्रुतियों/लोककथाओं का स्पष्ट विवरण।'
    },
    {
      id: 'food',
      category: 'culture',
      icon: Utensils,
      iconColor: 'text-orange-700',
      iconBg: 'bg-orange-50',
      borderHover: 'hover:border-orange-400',
      titleEn: 'Nearby Food & Artisan Bazaars',
      titleHi: 'स्थानीय खानपान एवं पारंपरिक बाज़ार',
      badgeEn: 'Local Culture',
      badgeHi: 'बाज़ार व स्ट्रीट फ़ूड',
      descEn: 'Curated historic street food specialties, iconic local sweetshops, and centuries-old artisan handicraft markets situated around the monument.',
      descHi: 'स्मारक के पास के प्रसिद्ध स्ट्रीट फूड, ऐतिहासिक मिष्ठान्न भंडार और पारंपरिक दस्तकारी एवं हस्तशिल्प बाज़ारों की जानकारी।'
    }
  ];

  const filteredFeatures = activeTab === 'all' 
    ? dossierFeatures 
    : dossierFeatures.filter(f => f.category === activeTab);

  return (
    <section 
      id="how-it-works-guide"
      className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10"
    >
      {/* ========================================================================= */}
      {/* 1. SECTION HEADER                                                         */}
      {/* ========================================================================= */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C4A3E]/10 border border-[#2C4A3E]/20 text-[#2C4A3E] text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>
            {currentLang === 'en' 
              ? 'Complete Traveler & Heritage Intelligence Guide' 
              : 'संपूर्ण यात्रा एवं धरोहर गाइड'}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold font-serif-heritage text-[#1A1A1A] leading-tight mb-3">
          {currentLang === 'en' ? (
            <>
              How to Use HeritageLens &{' '}
              <span className="text-[#C05E42] italic font-semibold">What You Unlock</span>
            </>
          ) : (
            <>
              वेबसाइट का उपयोग कैसे करें एवं{' '}
              <span className="text-[#C05E42] italic font-semibold">आपको क्या जानकारी मिलेगी</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#5C544E] leading-relaxed">
          {currentLang === 'en'
            ? 'From instant AI visual recognition to verified ASI entry fees, transit directions, and hotel booking links—here is everything waiting for you inside each monument dossier.'
            : 'एआई विज़न पहचान से लेकर एएसआई प्रमाणित टिकट, निकटतम मेट्रो, होटल बुकिंग लिंक और ऑडियो गाइड तक—जानें हर स्मारक खोज पर आपको क्या जानकारी प्राप्त होगी।'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE-STEP WORKFLOW: HOW TO USE THIS WEBSITE                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#8C8276] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C05E42]" />
            <span>{currentLang === 'en' ? 'Method: 3 Simple Steps' : 'प्रक्रिया: 3 सरल चरण'}</span>
          </span>
          <span className="text-[11px] font-semibold text-[#8C8276]">
            {currentLang === 'en' ? 'Zero registration needed • 100% Free' : 'बिना किसी पंजीकरण के • पूर्णतः निःशुल्क'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {workflowSteps.map((ws, idx) => {
            const Icon = ws.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-[#FDFBF7] border border-[#E8E2D9] hover:border-[#D4AF37] rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
              >
                {/* Step watermarked number */}
                <span className="absolute top-4 right-5 text-4xl font-extrabold text-[#E8E2D9]/70 select-none font-serif-heritage">
                  {ws.step}
                </span>

                <div>
                  <div className={`w-11 h-11 rounded-2xl ${ws.accentBg} border ${ws.accentBorder} ${ws.accentColor} flex items-center justify-center mb-4 shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`inline-block px-2.5 py-0.5 rounded-full ${ws.accentBg} ${ws.accentColor} text-[10px] font-extrabold uppercase tracking-wider mb-2`}>
                    {currentLang === 'en' ? ws.badgeEn : ws.badgeHi}
                  </span>

                  <h3 className="text-lg font-bold font-serif-heritage text-[#1A1A1A] mb-2 leading-snug">
                    {currentLang === 'en' ? ws.titleEn : ws.titleHi}
                  </h3>

                  <p className="text-xs text-[#5C544E] leading-relaxed">
                    {currentLang === 'en' ? ws.descEn : ws.descHi}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8E2D9]/70 flex items-center justify-between text-[11px] font-bold text-[#8C8276]">
                  <span>{currentLang === 'en' ? `Step ${idx + 1} of 3` : `चरण ${idx + 1} / 3`}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C4A3E]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. WHAT YOU RECEIVE: FULL DOSSIER INTEL SHOWCASE                          */}
      {/* ========================================================================= */}
      <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl sm:rounded-4xl p-6 sm:p-9 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C05E42]/10 text-[#C05E42] text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'The Complete Information Package' : 'स्मारक खोज पर प्राप्त होने वाली जानकारी'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' 
                ? 'What You Receive When You Click or Search a Place' 
                : 'स्मारक पर क्लिक या सर्च करने पर क्या जानकारी मिलती है'}
            </h3>
            <p className="text-xs text-[#5C544E] mt-0.5">
              {currentLang === 'en'
                ? 'Every monument profile is thoroughly researched across 8 vital domains for travelers and heritage lovers:'
                : 'प्रत्येक स्मारक विवरणिका में यात्रियों एवं शोधकर्ताओं के लिए 8 प्रमुख अनुभाग शामिल होते हैं:'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-white p-1 rounded-2xl border border-[#E8E2D9]">
            {[
              { id: 'all', labelEn: 'All 8 Features', labelHi: 'सभी 8 सुविधाएं' },
              { id: 'transit', labelEn: 'Maps & Stays', labelHi: 'नक्शे व आवास' },
              { id: 'intel', labelEn: 'Tickets & Hours', labelHi: 'टिकट व समय' },
              { id: 'culture', labelEn: 'Audio & Culture', labelHi: 'ऑडियो व खानपान' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#2C4A3E] text-white shadow-2xs'
                    : 'text-[#5C544E] hover:text-[#1A1A1A] hover:bg-[#F3EEE7]'
                }`}
              >
                {currentLang === 'en' ? tab.labelEn : tab.labelHi}
              </button>
            ))}
          </div>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className={`p-5 rounded-2xl bg-white border border-[#E8E2D9] ${feat.borderHover} hover:shadow-sm transition-all flex flex-col justify-between gap-3`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${feat.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${feat.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F3EEE7] text-[#5C544E] border border-[#E8E2D9]">
                      {currentLang === 'en' ? feat.badgeEn : feat.badgeHi}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1A1A1A] leading-snug mb-1.5">
                    {currentLang === 'en' ? feat.titleEn : feat.titleHi}
                  </h4>

                  <p className="text-xs text-[#5C544E] leading-relaxed">
                    {currentLang === 'en' ? feat.descEn : feat.descHi}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#F3EEE7] flex items-center text-[10px] font-bold text-[#2C4A3E] gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2C4A3E]" />
                  <span>{currentLang === 'en' ? 'Included in every profile' : 'प्रत्येक प्रोफाइल में शामिल'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Sample Preview Bar */}
        <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C05E42] text-white flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1A1A1A] block">
                {currentLang === 'en' ? 'Want to test a live dossier right now?' : 'किसी भी स्मारक की लाइव रिपोर्ट देखना चाहते हैं?'}
              </span>
              <span className="text-[11px] text-[#5C544E]">
                {currentLang === 'en' 
                  ? 'Click any sample to experience maps, hotel dots, audio narration, and metro tips:' 
                  : 'नक्शे, होटल डॉट्स, ऑडियो गाइड और मेट्रो की जानकारी देखने के लिए नमूना चुनें:'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'golden-temple-amritsar', nameEn: 'Golden Temple Amritsar', nameHi: 'स्वर्ण मंदिर' },
              { id: 'red-fort', nameEn: 'Red Fort Delhi', nameHi: 'लाल किला' },
              { id: 'qutub-minar', nameEn: 'Qutub Minar', nameHi: 'क़ुतुब मीनार' },
            ].map((samp) => (
              <Link
                key={samp.id}
                to={`/result?site=${samp.id}`}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#2C4A3E] hover:text-white border border-[#D5CDC2] text-[#2C4A3E] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>{currentLang === 'hi' ? samp.nameHi : samp.nameEn}</span>
                <ArrowRight className="w-3 h-3 opacity-70" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
