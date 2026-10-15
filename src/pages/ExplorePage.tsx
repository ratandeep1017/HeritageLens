import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Globe2, 
  AlertCircle, 
  RotateCw, 
  Landmark, 
  Search, 
  MapPin, 
  Layers, 
  Clock, 
  Ticket, 
  Compass, 
  Info,
  CheckCircle2,
  X,
  Building2,
  HelpCircle,
  Camera,
  Upload
} from 'lucide-react';
import { ImageInput } from '../components/ImageInput';
import { ApiKeyPromptModal } from '../components/ApiKeyPromptModal';
import { identifyHeritageImage, getStoredGeminiKey } from '../services/geminiService';
import { StorageService } from '../services/storage';
import { HeritageDataStore, useHeritageSites } from '../services/heritageDataStore';
import { HeritageSite, IdentificationResult } from '../types';
import { handleMonumentImageError } from '../utils/imageFallback';

interface ExplorePageProps {
  currentLang: 'en' | 'hi';
  onLangChange?: (lang: 'en' | 'hi') => void;
}

const CATEGORIES = [
  { id: 'all', labelEn: 'All Categories', labelHi: 'सभी श्रेणियां' },
  { id: 'Fort', labelEn: 'Forts', labelHi: 'किले' },
  { id: 'Religious Place', labelEn: 'Religious Places', labelHi: 'धार्मिक स्थल' },
  { id: 'Mosque', labelEn: 'Mosques', labelHi: 'मस्जिदें' },
  { id: 'Memorial', labelEn: 'Memorials', labelHi: 'स्मारक' },
  { id: 'Tomb', labelEn: 'Tombs', labelHi: 'मक़बरे' },
  { id: 'Monument', labelEn: 'Monuments', labelHi: 'स्तंभ एवं मीनार' },
  { id: 'Temple', labelEn: 'Temples', labelHi: 'मंदिर' },
  { id: 'Stepwell', labelEn: 'Stepwells', labelHi: 'बाओली' }
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ currentLang, onLangChange }) => {
  const navigate = useNavigate();

  // Dynamic Heritage Sites (single source of truth with real-time sync)
  const { sites: heritageSites } = useHeritageSites();

  // Identification State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationError, setIdentificationError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Local collection search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  // Compute states represented in the catalog
  const stateCounts = useMemo(() => {
    const counts = new Map<string, number>();
    heritageSites.forEach((s) => {
      const st = (s.state || 'Delhi').trim();
      counts.set(st, (counts.get(st) || 0) + 1);
    });
    return counts;
  }, [heritageSites]);

  // Loading animation step simulator
  const loadingSteps = useMemo(() => [
    currentLang === 'en' ? 'Scanning architectural geometry & motifs...' : 'वास्तुशिल्प बनावट और रूपांकनों की स्कैनिंग...',
    currentLang === 'en' ? 'Matching against ASI & UNESCO national heritage archives...' : 'एएसआई और यूनेस्को राष्ट्रीय धरोहर अभिलेखागार से मिलान...',
    currentLang === 'en' ? 'Compiling verified historical narrative...' : 'प्रमाणित ऐतिहासिक विवरण संकलित किया जा रहा है...'
  ], [currentLang]);

  const handleIdentifyClick = () => {
    if (!selectedImage) return;
    executeIdentify();
  };

  // Execute Identification
  const executeIdentify = async (apiKey?: string) => {
    if (!selectedImage) return;

    setIsIdentifying(true);
    setIdentificationError(null);
    setLoadingStage(0);

    const stepInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < 2 ? prev + 1 : prev));
    }, 600);

    try {
      const response = await identifyHeritageImage(
        selectedImage,
        apiKey,
        currentLang
      );

      clearInterval(stepInterval);

      const result = response.fullResult || {
        isIdentified: false,
        confidenceScore: 0.2,
        detectedName: currentLang === 'hi' ? 'अज्ञात स्मारक' : 'Unknown Monument',
        architecturalElements: [],
        historicalEra: 'Undetermined',
        customGeminiInsight: response.error || 'Recognition completed.',
        isFallbackOrUnknown: true,
        uploadedImageUrl: selectedImage,
        analyzedAt: new Date().toISOString(),
      };

      StorageService.saveLastResult(result);
      navigate('/result', { state: { result, analysisData: response.data } });
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Identification failed:', err);
      setIdentificationError(
        currentLang === 'en'
          ? 'An unexpected error occurred during visual analysis. Please check your internet connection or retry.'
          : 'दृश्य विश्लेषण के दौरान एक त्रुटि हुई। कृपया अपना इंटरनेट कनेक्शन जांचें या पुनः प्रयास करें।'
      );
      setIsIdentifying(false);
    }
  };

  const handleRetry = () => {
    setIdentificationError(null);
    handleIdentifyClick();
  };

  const handleChooseAnother = () => {
    setSelectedImage(null);
    setIdentificationError(null);
  };

  // Filtered dynamically sourced sites
  const filteredSites = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return heritageSites.filter((site) => {
      // 1. State filter
      const siteState = (site.state || 'Delhi').trim().toLowerCase();
      const matchesState =
        selectedState === 'all' ||
        siteState === selectedState.toLowerCase();

      if (!matchesState) return false;

      // 2. Category filter
      const matchesCategory =
        selectedCategory === 'all' ||
        (site.tags && site.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase())) ||
        site.architecturalStyle.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        site.name.toLowerCase().includes(selectedCategory.toLowerCase());

      if (!matchesCategory) return false;
      if (!query) return true;

      const nameMatch = site.name.toLowerCase().includes(query);
      const hindiNameMatch = site.hindiName.toLowerCase().includes(query);
      const styleMatch = site.architecturalStyle.toLowerCase().includes(query);
      const builderMatch = site.builtBy.toLowerCase().includes(query);
      const descMatch = site.shortDescription.toLowerCase().includes(query);
      const tagMatch = site.tags ? site.tags.some(t => t.toLowerCase().includes(query)) : false;

      return nameMatch || hindiNameMatch || styleMatch || builderMatch || descMatch || tagMatch;
    });
  }, [heritageSites, searchQuery, selectedCategory, selectedState]);

  const handleCardClick = (siteId: string) => {
    navigate(`/result?site=${encodeURIComponent(siteId)}`);
  };

  return (
    <div className="flex-1 flex flex-col gap-12 py-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      {/* ========================================================================= */}
      {/* 1. PRIMARY IDENTIFICATION SECTION                                         */}
      {/* ========================================================================= */}
      <section 
        id="explore-identification-experience"
        className="w-full bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden"
      >
        {/* Decorative Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C05E42]/10 via-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Top Label & Language Selector Pill */}
          <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C05E42]/10 border border-[#C05E42]/20 text-[#C05E42] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#C05E42]" />
              <span>{currentLang === 'en' ? 'AI Heritage Recognition' : 'एआई हेरिटेज पहचान'}</span>
            </div>

            {/* Language Selector: English / Hindi */}
            {onLangChange && (
              <div 
                id="explore-language-selector"
                className="inline-flex items-center gap-1.5 bg-[#F3EEE7] border border-[#E8E2D9] p-1 rounded-2xl shadow-2xs"
                role="group"
                aria-label="Language selection"
              >
                <button
                  type="button"
                  id="lang-select-en"
                  onClick={() => onLangChange('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    currentLang === 'en'
                      ? 'bg-[#2C4A3E] text-white shadow-2xs'
                      : 'text-[#5C544E] hover:text-[#1A1A1A]'
                  }`}
                  aria-pressed={currentLang === 'en'}
                >
                  English
                </button>
                <button
                  type="button"
                  id="lang-select-hi"
                  onClick={() => onLangChange('hi')}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    currentLang === 'hi'
                      ? 'bg-[#2C4A3E] text-white shadow-2xs'
                      : 'text-[#5C544E] hover:text-[#1A1A1A]'
                  }`}
                  aria-pressed={currentLang === 'hi'}
                >
                  हिन्दी
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heritage text-[#1A1A1A] tracking-tight leading-tight">
            {currentLang === 'en' ? 'Show us a place worth remembering.' : 'संजोने योग्य एक ऐतिहासिक धरोहर दिखाएँ।'}
          </h1>

          <p className="text-sm sm:text-base text-[#5C544E] mt-3 mb-8 max-w-xl leading-relaxed">
            {currentLang === 'en'
              ? 'Capture or upload a photo of any Indian heritage monument. HeritageLens AI will identify its architectural style, history, and verified cultural story.'
              : 'भारत के किसी भी ऐतिहासिक स्मारक की फोटो खींचें या अपलोड करें। हेरिटेज लेंस तुरंत उसकी वास्तुकला, इतिहास और कथा प्रस्तुत करेगा।'}
          </p>

          <div className="w-full text-left">
            <AnimatePresence mode="wait">
              {isIdentifying ? (
                <motion.div
                  key="identifying-loading-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xs"
                >
                  <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#C05E42]/40 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-2.5 rounded-full border-2 border-[#D4AF37]/60 animate-[spin_6s_linear_infinite_reverse]" />
                    <div className="w-16 h-16 rounded-2xl bg-[#2C4A3E] text-[#D4AF37] flex items-center justify-center shadow-lg transform rotate-45 animate-pulse">
                      <Landmark className="w-8 h-8 -rotate-45" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-serif-heritage text-[#1A1A1A]">
                    {currentLang === 'en' ? 'Analyzing Monument Architecture' : 'स्मारक वास्तुकला का विश्लेषण'}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#C05E42] font-semibold mt-2 min-h-6 transition-all duration-300">
                    {loadingSteps[loadingStage]}
                  </p>

                  <div className="w-48 h-1.5 bg-[#E8E2D9] rounded-full mt-4 overflow-hidden">
                    <div 
                      className="h-full bg-[#C05E42] transition-all duration-500 rounded-full"
                      style={{ width: `${((loadingStage + 1) / 3) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ) : identificationError ? (
                <motion.div
                  key="identifying-error-state"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center shadow-xs"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                    <AlertCircle className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold font-serif-heritage text-amber-950">
                    {currentLang === 'en' ? 'Identification Unsuccessful' : 'पहचान पूरी नहीं हो सकी'}
                  </h3>

                  <p className="text-xs sm:text-sm text-amber-900 mt-2 max-w-md leading-relaxed">
                    {identificationError}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    <button
                      type="button"
                      id="error-retry-btn"
                      onClick={handleRetry}
                      className="px-5 py-2.5 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{currentLang === 'en' ? 'Retry Analysis' : 'पुनः प्रयास करें'}</span>
                    </button>

                    <button
                      type="button"
                      id="error-choose-another-btn"
                      onClick={handleChooseAnother}
                      className="px-5 py-2.5 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#FDFBF7] text-[#5C544E] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{currentLang === 'en' ? 'Choose Another Image' : 'दूसरी छवि चुनें'}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-6">
                  <ImageInput
                    value={selectedImage}
                    onChange={(url) => {
                      setSelectedImage(url);
                      setIdentificationError(null);
                    }}
                    currentLang={currentLang}
                  />

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      id="identify-this-site-btn"
                      onClick={handleIdentifyClick}
                      disabled={!selectedImage || isIdentifying}
                      className={`w-full sm:w-auto min-w-[280px] py-3.5 px-8 rounded-2xl font-serif-heritage text-sm font-bold flex items-center justify-center gap-2.5 shadow-md transition-all ${
                        selectedImage && !isIdentifying
                          ? 'bg-[#C05E42] hover:bg-[#A34B32] text-white active:scale-98 cursor-pointer'
                          : 'bg-[#E8E2D9] text-[#8C8276] cursor-not-allowed opacity-80 shadow-none'
                      }`}
                      aria-disabled={!selectedImage || isIdentifying}
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>
                        {currentLang === 'en' ? 'Identify this site' : 'इस स्मारक की पहचान करें'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {!selectedImage && (
                      <p className="text-[11px] text-[#8C8276] font-medium text-center">
                        {currentLang === 'en'
                          ? 'Please take a photo or select an image above to activate identification.'
                          : 'पहचान शुरू करने के लिए कृपया ऊपर एक फोटो खींचें या चुनें।'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Catalog Count Note */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D9] w-full flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] text-xs text-[#5C544E] text-center">
              <Info className="w-4 h-4 text-[#C05E42] shrink-0" />
              <span>
                {currentLang === 'en'
                  ? `Active Catalog: ${heritageSites.length} verified heritage monuments across Indian states available with dual-language audio dossiers.`
                  : `सक्रिय सूची: ${heritageSites.length} प्रमाणित भारतीय धरोहर स्मारक दोहरी भाषा ऑडियो विवरण के साथ उपलब्ध हैं।`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMICALLY SOURCED HERITAGE COLLECTION CATALOG                         */}
      {/* ========================================================================= */}
      <section className="w-full flex flex-col gap-6">
        {/* Collection Header & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E2D9] pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#2C4A3E]/10 border border-[#2C4A3E]/20 text-[#2C4A3E] text-[11px] font-bold tracking-wide">
              <Building2 className="w-3.5 h-3.5" />
              <span>
                {currentLang === 'en'
                  ? `All-India Heritage Collection (${filteredSites.length} Monuments across ${stateCounts.size} States)`
                  : `अखिल भारतीय धरोहर संकलन (${filteredSites.length} स्मारक, ${stateCounts.size} राज्य)`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' ? 'Explore Monuments by State & Category' : 'राज्य एवं श्रेणी अनुसार स्मारकों का अन्वेषण'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C544E]">
              {currentLang === 'en'
                ? 'Browse verified dossiers, visiting timings, architectural details, and cultural histories across India.'
                : 'भारत भर के प्रमाणित इतिहास, समय, वास्तुकला और सांस्कृतिक विवरण देखें।'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8C8276] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="collection-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'en' ? 'Search by name, state, era...' : 'नाम, राज्य, काल से खोजें...'}
              className="w-full pl-9.5 pr-8 py-2.5 bg-[#F3EEE7] border border-[#E8E2D9] focus:border-[#C05E42] focus:bg-white rounded-xl text-xs text-[#1A1A1A] placeholder-[#8C8276] outline-hidden transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8C8276] hover:text-[#1A1A1A] rounded-full transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* State / UT Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-[11px] font-bold text-[#8C8276] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Compass className="w-3.5 h-3.5 text-[#2C4A3E]" />
            <span>{currentLang === 'en' ? 'State:' : 'राज्य:'}</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedState('all')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedState === 'all'
                ? 'bg-[#C05E42] text-white shadow-xs'
                : 'bg-[#F3EEE7] text-[#5C544E] hover:bg-[#E8E2D9] hover:text-[#1A1A1A]'
            }`}
          >
            <span>{currentLang === 'en' ? 'All States' : 'सभी राज्य'}</span>
            <span className="text-[10px] opacity-80">({heritageSites.length})</span>
          </button>
          {Array.from(stateCounts.entries()).map(([st, count]) => {
            const isActive = selectedState.toLowerCase() === st.toLowerCase();
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#C05E42] text-white shadow-xs'
                    : 'bg-[#F3EEE7] text-[#5C544E] hover:bg-[#E8E2D9] hover:text-[#1A1A1A]'
                }`}
              >
                <span>{st}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-black/10 text-[#5C544E]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <span className="text-[11px] font-bold text-[#8C8276] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#C05E42]" />
            <span>{currentLang === 'en' ? 'Category:' : 'श्रेणी:'}</span>
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
                  isActive
                    ? 'bg-[#2C4A3E] text-white shadow-xs'
                    : 'bg-[#F3EEE7] text-[#5C544E] hover:bg-[#E8E2D9] hover:text-[#1A1A1A] border border-transparent'
                } ${currentLang === 'hi' ? 'font-devanagari' : ''}`}
              >
                {currentLang === 'en' ? cat.labelEn : cat.labelHi}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        {filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((site) => {
              return (
                <div
                  key={site.id}
                  id={`explore-site-card-${site.id}`}
                  onClick={() => handleCardClick(site.id)}
                  className="bg-[#FDFBF7] border border-[#E8E2D9] hover:border-[#C05E42]/60 rounded-3xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] outline-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(site.id);
                    }
                  }}
                  aria-label={`View story of ${site.name}`}
                >
                  {/* Exact Visual Header / Image with failure warning placeholder */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-[#2D2926]">
                    <img
                      src={site.imageUrl}
                      alt={site.imageAlt || site.name}
                      onError={(e) => handleMonumentImageError(e, site.id, currentLang === 'hi' ? site.hindiName : site.name, site.imageUrl)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shadow-2xs backdrop-blur-xs bg-black/60 text-[#D4AF37] border-[#D4AF37]/30">
                        {site.state || 'Delhi'} • {site.tags?.[0] || 'Monument'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>ASI Verified</span>
                      </span>
                    </div>

                    {/* Bottom Title */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 pointer-events-none">
                      <h3 className={`text-lg font-bold text-white font-serif-heritage leading-snug group-hover:text-[#F3D79F] transition-colors break-words ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                        {currentLang === 'hi' ? site.hindiName : site.name}
                      </h3>
                      <p className={`text-xs text-white/80 font-medium line-clamp-1 ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                        {site.builtYear} • {site.architecturalStyle}
                      </p>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C8276]">
                        <MapPin className="w-3.5 h-3.5 text-[#C05E42] shrink-0" />
                        <span className="line-clamp-1">{site.city ? `${site.city}, ${site.state || 'India'}` : (site.travelTips?.nearestMetro || `${site.state || 'India'}`)}</span>
                      </div>
                      <p className={`text-xs text-[#5C544E] leading-relaxed line-clamp-2 ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                        {currentLang === 'hi' ? (site.hindiShortDescription || site.shortDescription) : site.shortDescription}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(site.id);
                        }}
                        className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-[#C05E42] hover:bg-[#A34B32] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                      >
                        <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                          {currentLang === 'en' ? 'View story' : 'कहानी देखें'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            id="explore-no-search-results"
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-4 shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center mb-4">
              <Search className="w-7 h-7" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C05E42] px-3 py-0.5 rounded-full bg-[#C05E42]/10 mb-2">
              {currentLang === 'en' ? 'No Matching Monuments' : 'कोई स्मारक नहीं मिला'}
            </span>

            <h4 className={`text-xl sm:text-2xl font-bold font-serif-heritage text-[#1A1A1A] ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
              {currentLang === 'en'
                ? `No results for "${searchQuery || selectedCategory}"`
                : `"${searchQuery || selectedCategory}" के लिए कोई परिणाम नहीं`}
            </h4>

            <p className={`text-xs sm:text-sm text-[#5C544E] mt-2 mb-4 max-w-md leading-relaxed ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
              {currentLang === 'en'
                ? 'We could not find any monument in our active catalog matching your keywords or filter.'
                : 'आपके द्वारा खोजे गए शब्दों से मेल खाता कोई स्मारक नहीं मिला।'}
            </p>

            <button
              type="button"
              id="explore-reset-search-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="min-h-[44px] px-6 py-3 bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <RotateCw className="w-4 h-4" />
              <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                {currentLang === 'en' ? 'Reset Filters & Show All Monuments' : 'फ़िल्टर हटाएं और सभी स्मारक देखें'}
              </span>
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
