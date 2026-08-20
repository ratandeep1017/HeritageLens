import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Key, 
  Compass, 
  MapPin, 
  ArrowRight, 
  Loader2, 
  Volume2, 
  ShieldCheck, 
  BookOpen, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Layers,
  Sparkle,
  Cpu,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeritageDataStore, useHeritageSites } from '../services/heritageDataStore';
import { HeritageSite } from '../types';
import { UPCOMING_REGIONS } from '../data/upcomingRegions';
import { StorageService } from '../services/storage';
import { identifyHeritageImage, getStoredGeminiKey, createDemoRecognitionResult } from '../services/geminiService';
import { ImageInput } from '../components/ImageInput';
import { ApiKeyPromptModal } from '../components/ApiKeyPromptModal';
import { handleMonumentImageError } from '../utils/imageFallback';

interface HomePageProps {
  currentLang: 'en' | 'hi';
}

export const HomePage: React.FC<HomePageProps> = ({ currentLang }) => {
  const navigate = useNavigate();
  const captureSectionRef = useRef<HTMLDivElement | null>(null);

  const { sites: heritageSites } = useHeritageSites();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [suggestedMonument, setSuggestedMonument] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const isDemoMode = StorageService.isDemoMode();
  const hasApiKey = Boolean(StorageService.getApiKey()) && !isDemoMode;

  const scrollToCapture = () => {
    captureSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleImageChange = (imageDataUrl: string | null) => {
    setSelectedImage(imageDataUrl);
    setAnalysisError(null);
    if (imageDataUrl) {
      scrollToCapture();
    }
  };

  const handleAnalyzeClick = () => {
    if (!selectedImage) return;
    const apiKey = getStoredGeminiKey();
    if (isDemoMode || !apiKey) {
      executeIdentification();
      return;
    }
    executeIdentification(apiKey);
  };

  const executeIdentification = async (apiKey?: string) => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await identifyHeritageImage(selectedImage, apiKey, currentLang);
      
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
        isDemoResult: isDemoMode || !apiKey,
      };

      StorageService.saveLastResult(result);
      
      // Navigate to /result with result state
      navigate('/result', { state: { result, geminiData: response.data } });
    } catch (err: any) {
      console.error('Identification failed:', err);
      setAnalysisError(
        currentLang === 'en'
          ? 'Analysis encountered an error. Falling back to local demonstration matcher.'
          : 'विश्लेषण में त्रुटि हुई। स्थानीय डेमो डेटा का उपयोग किया जा रहा है।'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick test demo monument with standard demo recognition
  const handleSelectDemoSite = (siteId: string) => {
    const demoResult = createDemoRecognitionResult(siteId, undefined, currentLang);
    StorageService.saveLastResult(demoResult);
    navigate('/result', { state: { result: demoResult } });
  };

  const handleTryRedFortSample = () => {
    const redFortSite = heritageSites.find((s) => s.id === 'red-fort') || heritageSites[0];
    if (redFortSite) {
      setSelectedImage(redFortSite.imageUrl);
      handleSelectDemoSite(redFortSite.id);
    }
  };

  const handleSuggestMonument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestedMonument.trim()) return;
    setSuggestionSubmitted(true);
    setSuggestedMonument('');
    setTimeout(() => setSuggestionSubmitted(false), 3500);
  };

  return (
    <div className="flex-1 flex flex-col gap-12 sm:gap-16 py-6 sm:py-10">
      {/* 1. HERO SECTION & VISUAL HERITAGE PANEL */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-b from-[#F3EEE7] via-[#FDFBF7] to-[#F3EEE7] border border-[#E8E2D9] p-6 sm:p-12 md:p-16 shadow-sm overflow-hidden flex flex-col items-center text-center"
        >
          {/* Subtle Jaali / Arch Background Accents */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#C05E42]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Pilot Series Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C05E42]/10 border border-[#C05E42]/20 text-[#C05E42] text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C05E42]" />
            <span>
              {currentLang === 'en'
                ? 'AI Heritage Lens • India Pilot Release'
                : 'एआई धरोहर लेंस • भारत पायलट रिलीज़'}
            </span>
          </div>

          {/* Required Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-[#1A1A1A] font-serif-heritage max-w-4xl leading-[1.15] mb-5 tracking-tight">
            {currentLang === 'en' ? (
              <>
                Discover the stories behind{' '}
                <span className="text-[#C05E42] italic font-semibold">India’s heritage.</span>
              </>
            ) : (
              <>
                भारतीय धरोहर की{' '}
                <span className="text-[#C05E42] italic font-semibold font-devanagari">
                  अनकही कहानियों
                </span>{' '}
                को जानें।
              </>
            )}
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#5C544E] leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
            {currentLang === 'en'
              ? 'Point your camera or upload a photo of any historic Indian monument to unlock verified timelines, architectural breakdowns, oral folklore, and immersive audio narration.'
              : 'किसी भी ऐतिहासिक भारतीय स्मारक की तस्वीर खींचें या अपलोड करें और तुरंत प्रमाणित इतिहास, स्थापत्य विवरण, लोककथाएं और ऑडियो गाइड प्राप्त करें।'}
          </p>

          {/* Required Primary & Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* Primary Button */}
            <button
              id="hero-identify-primary-btn"
              onClick={scrollToCapture}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Identify a Heritage Site' : 'धरोहर स्थल की पहचान करें'}</span>
            </button>

            {/* Secondary Button */}
            <Link
              to="/explore"
              id="hero-explore-delhi-btn"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-[#F3EEE7] border border-[#E8E2D9] hover:border-[#D4AF37] text-[#1A1A1A] text-sm font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98"
            >
              <Compass className="w-4 h-4 text-[#2C4A3E]" />
              <span>{currentLang === 'en' ? 'Explore Delhi Sites' : 'दिल्ली स्मारक देखें (10)'}</span>
            </Link>
          </div>

          {/* Pilot Scope Clarification Bar */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D9]/70 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#8C8276]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2C4A3E]" />
              {currentLang === 'en' ? '10 Delhi Pilot Monuments Live' : '10 दिल्ली पायलट स्मारक सक्रिय'}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C05E42]" />
              {currentLang === 'en' ? 'Upcoming States: RJ, UP, KA, MH' : 'आगामी राज्य: राजस्थान, उप्र, कर्नाटक, महा.'}
            </span>
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              {currentLang === 'en' ? 'Dual Audio in ENG & हिन्दी' : 'द्विभाषी ऑडियो गाइड'}
            </span>
          </div>
        </motion.div>
      </section>

      {/* 2. THREE CORE FEATURE CARDS: IDENTIFY, LISTEN, EXPLORE */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8276] mb-1">
            {currentLang === 'en' ? 'Interactive Heritage Experience' : 'धरोहर अन्वेषण के तीन स्तम्भ'}
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
            {currentLang === 'en' ? 'How HeritageLens AI Works' : 'हेरिटेज लेंस एआई कैसे कार्य करता है'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: IDENTIFY */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-7 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#D4AF37] transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C05E42]/10 border border-[#C05E42]/20 text-[#C05E42] flex items-center justify-center mb-5">
                <Camera className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#C05E42]/10 text-[#C05E42] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                01 • {currentLang === 'en' ? 'Identify' : 'पहचानें'}
              </div>
              <h4 className="text-xl font-bold font-serif-heritage text-[#1A1A1A] mb-2.5">
                {currentLang === 'en' ? 'Visual Landmark Detection' : 'विज़न स्मारक पहचान'}
              </h4>
              <p className="text-xs text-[#5C544E] leading-relaxed">
                {currentLang === 'en'
                  ? 'Take a live snapshot or upload photos from any angle. The multimodal AI model analyzes arches, domes, motifs, and materials to identify the monument and architectural style.'
                  : 'लाइव फोटो लें या गैलरी से अपलोड करें। एआई मेहराब, गुंबद, नक्काशी और पत्थरों का विश्लेषण कर स्मारक और वास्तु शैली की सटीक पहचान करता है।'}
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-[#E8E2D9] text-[11px] font-bold text-[#C05E42] flex items-center gap-1.5">
              <span>{currentLang === 'en' ? 'Instant Vision Analysis' : 'त्वरित विज़न विश्लेषण'}</span>
              <Sparkle className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Feature 2: LISTEN */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-7 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#D4AF37] transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#2C4A3E]/10 border border-[#2C4A3E]/20 text-[#2C4A3E] flex items-center justify-center mb-5">
                <Volume2 className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#2C4A3E]/10 text-[#2C4A3E] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                02 • {currentLang === 'en' ? 'Listen' : 'सुनें'}
              </div>
              <h4 className="text-xl font-bold font-serif-heritage text-[#1A1A1A] mb-2.5">
                {currentLang === 'en' ? 'Dual-Language Audio Guide' : 'द्विभाषी ऑडियो गाइड'}
              </h4>
              <p className="text-xs text-[#5C544E] leading-relaxed">
                {currentLang === 'en'
                  ? 'Listen to fluent audio narration in English or Hindi. Hear stories of Mughal emperors, Rajput chivalry, and Delhi Sultanate architects as you walk through historic grounds.'
                  : 'अंग्रेज़ी या हिन्दी में सुगम ऑडियो विवरण सुनें। ऐतिहासिक स्थलों पर भ्रमण करते हुए सम्राटों, कारीगरों और स्थापत्य की गाथाओं का आनंद लें।'}
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-[#E8E2D9] text-[11px] font-bold text-[#2C4A3E] flex items-center gap-1.5">
              <span>{currentLang === 'en' ? 'English & Hindi Speech' : 'अंग्रेज़ी एवं हिन्दी वाणी'}</span>
              <Volume2 className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Feature 3: EXPLORE */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-7 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#D4AF37] transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#A07C1C] flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#8C6B14] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                03 • {currentLang === 'en' ? 'Explore' : 'अन्वेषण'}
              </div>
              <h4 className="text-xl font-bold font-serif-heritage text-[#1A1A1A] mb-2.5">
                {currentLang === 'en' ? 'Verified History & Tips' : 'सत्यापित इतिहास एवं सुझाव'}
              </h4>
              <p className="text-xs text-[#5C544E] leading-relaxed">
                {currentLang === 'en'
                  ? 'Access verified ASI & UNESCO historical records, timeline milestones, oral folklore legends (clearly flagged), entry fees, timings, and nearest metro directions.'
                  : 'एएसआई और यूनेस्को के प्रमाणित रिकॉर्ड, निर्माण कालक्रम, लोककथाएं, टिकट शुल्क, समय और निकटतम मेट्रो की सटीक जानकारी पाएं।'}
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-[#E8E2D9] text-[11px] font-bold text-[#A07C1C] flex items-center gap-1.5">
              <span>{currentLang === 'en' ? 'ASI & UNESCO Records' : 'एएसआई व यूनेस्को आंकड़े'}</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. INTERACTIVE SCANNER & UPLOAD INTERFACE */}
      <section ref={captureSectionRef} className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl sm:rounded-4xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C4A3E]/10 text-[#2C4A3E] text-xs font-bold mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>{currentLang === 'en' ? 'Interactive Vision Studio' : 'इंटरैक्टिव विज़न स्टूडियो'}</span>
              </div>
              <h3 className="text-2xl font-bold font-serif-heritage text-[#1A1A1A]">
                {currentLang === 'en' ? 'Capture or Upload Monument' : 'स्मारक की तस्वीर लें या अपलोड करें'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-xs text-[#5C544E] font-medium">
                {hasApiKey ? (currentLang === 'en' ? 'Gemini 2.5 Active' : 'जेमिनी 2.5 सक्रिय') : (currentLang === 'en' ? 'Demo Mode Ready' : 'डेमो मोड तैयार')}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <ImageInput
              value={selectedImage}
              onChange={handleImageChange}
              onAnalyze={handleAnalyzeClick}
              isAnalyzing={isAnalyzing}
              currentLang={currentLang}
            />

            {/* Quick Demo Test Actions for Judges and Reviewers */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                <Cpu className="w-4 h-4 text-[#C05E42] shrink-0" />
                <div>
                  <span className="font-bold">
                    {currentLang === 'en' ? 'Demo Mode Presets:' : 'डेमो मोड प्रीसेट:'}
                  </span>{' '}
                  <span className="text-[#5C544E]">
                    {currentLang === 'en'
                      ? 'Test recognition without API key or live camera'
                      : 'एपीआई कुंजी के बिना पहचान का परीक्षण करें'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  id="home-try-sample-red-fort-btn"
                  onClick={handleTryRedFortSample}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                    {currentLang === 'en' ? 'Try sample Red Fort image' : 'लाल किला नमूना आज़माएं'}
                  </span>
                </button>

                <Link
                  to="/profile"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42]"
                >
                  <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                    {currentLang === 'en' ? 'All Demo Sites →' : 'सभी डेमो स्थल →'}
                  </span>
                </Link>
              </div>
            </div>

            {analysisError && (
              <div className="mt-4 w-full text-xs text-amber-900 bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span className={`leading-relaxed ${currentLang === 'hi' ? 'font-devanagari text-sm' : ''}`}>
                  {analysisError}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* API Key Modal */}
      <ApiKeyPromptModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onContinueDemo={() => {
          setShowKeyModal(false);
          executeIdentification();
        }}
        currentLang={currentLang}
      />

      {/* 4. VISIBLE "DELHI COLLECTION" PILOT SECTION */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C05E42]/10 text-[#C05E42] text-xs font-bold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Delhi Collection • Pilot Series' : 'दिल्ली संकलन • पायलट श्रृंखला'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' ? 'Featured Delhi Monuments' : 'प्रमुख दिल्ली धरोहर स्थल'}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C544E] mt-1">
              {currentLang === 'en'
                ? 'Test instant AI identification and dual-language audio narration on these 10 verified monuments.'
                : 'इन 10 प्रमाणित स्मारकों पर तुरंत एआई पहचान और ऑडियो गाइड का परीक्षण करें।'}
            </p>
          </div>

          <Link
            to="/explore"
            className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C05E42] hover:text-[#9c3f25] transition-colors py-2"
          >
            <span>{currentLang === 'en' ? 'View Full Delhi Catalog (10 Sites)' : 'संपूर्ण दिल्ली सूची देखें'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Monuments Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {heritageSites.map((site) => (
            <motion.div
              key={site.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              onClick={() => handleSelectDemoSite(site.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectDemoSite(site.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Test recognition for ${site.name}`}
              className="h-52 rounded-2xl bg-[#2D2926] p-3.5 flex flex-col justify-between border border-[#E8E2D9] hover:border-[#D4AF37] hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#C05E42] outline-none"
            >
              <img
                src={site.imageUrl}
                alt={site.imageAlt || site.name}
                onError={(e) => handleMonumentImageError(e, site.id, currentLang === 'hi' ? site.hindiName : site.name, site.imageUrl)}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-all pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start pointer-events-none">
                <span className="px-2 py-0.5 bg-[#2C4A3E]/90 backdrop-blur-xs text-white rounded-md text-[9px] font-bold tracking-wider">
                  VERIFIED
                </span>
                <span className="text-[10px] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity font-bold bg-black/50 px-1.5 py-0.5 rounded-md">
                  Test →
                </span>
              </div>

              <div className="relative z-10 pointer-events-none">
                <h5 className={`text-xs sm:text-sm font-bold text-white leading-tight font-serif-heritage drop-shadow-xs break-words ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                  {currentLang === 'hi' ? site.hindiName : site.name}
                </h5>
                <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                  {site.builtYear}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. "MORE SITES AND CITIES COMING SOON" SECTION */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#8C6B14] text-xs font-bold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'India Expansion Roadmap' : 'भारत विस्तार योजना'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' ? 'More Sites & Cities Coming Soon' : 'आगामी राज्य एवं शहर'}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C544E] mt-1">
              {currentLang === 'en'
                ? 'We are expanding the verified heritage knowledge base to encompass palaces, cave temples, and forts across all Indian states.'
                : 'हम प्रमाणित ऐतिहासिक जानकारी का विस्तार भारत के सभी प्रमुख राज्यों, महलों, गुफाओं और दुर्गों तक कर रहे हैं।'}
            </p>
          </div>
        </div>

        {/* State / Region Roadmap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UPCOMING_REGIONS.map((region) => (
            <div
              key={region.id}
              className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl overflow-hidden flex flex-col shadow-2xs hover:border-[#D4AF37] transition-all group"
            >
              {/* Region Banner */}
              <div className="relative h-36 bg-black overflow-hidden">
                <img
                  src={region.bannerUrl}
                  alt={region.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#1A1A1A] text-[9px] font-extrabold tracking-wider">
                    {region.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
                    {currentLang === 'hi' ? region.hindiState : region.state}
                  </span>
                  <h4 className="text-base font-bold text-white font-serif-heritage">
                    {currentLang === 'hi' ? region.hindiCity : region.city}
                  </h4>
                </div>
              </div>

              {/* Key Planned Monuments */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#8C8276] uppercase tracking-wider">
                    {currentLang === 'en' ? 'Target Monuments:' : 'प्रस्तावित स्मारक:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(currentLang === 'hi' ? region.hindiKeyMonuments : region.keyMonuments).map((monument) => (
                      <span
                        key={monument}
                        className="px-2 py-0.5 rounded-md bg-[#F3EEE7] text-[#5C544E] text-[10px] font-medium"
                      >
                        {monument}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-[11px] text-[#8C8276]">
                  <span>{region.monumentCountEstimate}</span>
                  <span className="text-[#C05E42] font-semibold">
                    {currentLang === 'en' ? 'In Curation' : 'तैयारी में'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggest a Monument / City Interactive Card */}
        <div className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h4 className="text-lg font-bold font-serif-heritage text-[#1A1A1A] mb-1">
              {currentLang === 'en' ? 'Have a Favorite Indian Monument in Mind?' : 'क्या आप किसी विशेष स्मारक को जोड़ना चाहते हैं?'}
            </h4>
            <p className="text-xs text-[#5C544E]">
              {currentLang === 'en'
                ? 'Suggest a historic temple, fort, stepwell, or palace from your home state to be added in the next dataset release.'
                : 'अपने गृह राज्य के किसी ऐतिहासिक मंदिर, किले, बावड़ी या महल का सुझाव दें।'}
            </p>
          </div>

          <form onSubmit={handleSuggestMonument} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={suggestedMonument}
              onChange={(e) => setSuggestedMonument(e.target.value)}
              placeholder={currentLang === 'en' ? 'e.g., Rani ki Vav, Gujarat' : 'उदा. रानी की वाव, गुजरात'}
              className="px-4 py-2.5 bg-white border border-[#E8E2D9] focus:border-[#D4AF37] rounded-xl text-xs text-[#1A1A1A] outline-hidden w-full md:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#2C4A3E] hover:bg-[#233a31] text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-2xs cursor-pointer"
            >
              {suggestionSubmitted
                ? currentLang === 'en' ? 'Received ✓' : 'धन्यवाद ✓'
                : currentLang === 'en' ? 'Suggest' : 'सुझाव दें'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
