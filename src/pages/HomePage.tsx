import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Play,
  Search,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  CheckCircle,
  Plus,
  Check,
  SearchX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeritageDataStore, useHeritageSites } from '../services/heritageDataStore';
import { HeritageSite } from '../types';
import { UPCOMING_REGIONS, getStateBanner } from '../data/upcomingRegions';
import { STATE_HINDI_NAMES } from '../utils/geoCoordinates';
import { StorageService } from '../services/storage';
import { 
  identifyHeritageImage, 
  getStoredGeminiKey, 
  createDemoRecognitionResult,
  generateHeritageSiteFromSearch,
  GenerateSiteResponse
} from '../services/geminiService';
import { ImageInput } from '../components/ImageInput';
import { ApiKeyPromptModal } from '../components/ApiKeyPromptModal';
import { VisualImagePickerModal } from '../components/VisualImagePickerModal';
import { handleMonumentImageError } from '../utils/imageFallback';
import { findExistingHeritageSite } from '../utils/monumentMatcher';
import { cleanSearchQuery } from '../utils/searchValidator';
import { HowToUseDossierGuide } from '../components/HowToUseDossierGuide';

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

  // AI Monument Discovery & Search State
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchStep, setAiSearchStep] = useState('');
  const [aiSearchResult, setAiSearchResult] = useState<GenerateSiteResponse | null>(() => {
    try {
      const saved = sessionStorage.getItem('heritagelens_last_ai_search_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isVisualPickerOpen, setIsVisualPickerOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isAddingToCatalog, setIsAddingToCatalog] = useState(false);
  const [selectedHomeState, setSelectedHomeState] = useState<string>('all');

  // Extract unique sorted states from current live heritage catalog
  const availableStates = useMemo(() => {
    const states: string[] = Array.from(new Set(heritageSites.map((s) => s.state || 'Delhi'))).filter(Boolean) as string[];
    return states.sort((a, b) => a.localeCompare(b));
  }, [heritageSites]);

  // Filter sites for collection showcase based on selectedHomeState
  const displayedSites = useMemo(() => {
    if (selectedHomeState === 'all') return heritageSites;
    return heritageSites.filter(
      (s) => (s.state || 'Delhi').toLowerCase() === selectedHomeState.toLowerCase()
    );
  }, [heritageSites, selectedHomeState]);

  // Combine curated upcoming regions with any newly added states in the catalog
  const allStateRegions = useMemo(() => {
    const regions = [...UPCOMING_REGIONS];
    availableStates.forEach((st) => {
      if (!regions.some((r) => r.state.toLowerCase() === st.toLowerCase())) {
        const sitesInState = heritageSites.filter(
          (s) => (s.state || 'Delhi').toLowerCase() === st.toLowerCase()
        );
        regions.push({
          id: `state-${st.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          state: st,
          hindiState: STATE_HINDI_NAMES[st] || st,
          city: sitesInState[0]?.city ? `${sitesInState[0].city} & Region` : `${st} Region`,
          hindiCity: sitesInState[0]?.hindiCity ? `${sitesInState[0].hindiCity} एवं क्षेत्र` : `${STATE_HINDI_NAMES[st] || st} क्षेत्र`,
          keyMonuments: sitesInState.map((s) => s.name).slice(0, 4),
          hindiKeyMonuments: sitesInState.map((s) => s.hindiName || s.name).slice(0, 4),
          bannerUrl: getStateBanner(st),
          tag: 'Active State',
          monumentCountEstimate: `${sitesInState.length} Monuments`,
        });
      }
    });
    return regions;
  }, [availableStates, heritageSites]);

  // Determine if the current search result is already saved in the active catalog
  const isCurrentResultInCatalog = Boolean(
    aiSearchResult?.site &&
      (aiSearchResult.isAlreadyListed ||
        heritageSites.some((s) => s.id.toLowerCase() === aiSearchResult.site!.id.toLowerCase()))
  );

  const handleAddSiteToCatalog = async () => {
    if (!aiSearchResult?.site) return;
    setIsAddingToCatalog(true);
    try {
      const res = await HeritageDataStore.addNewSite(aiSearchResult.site);
      const updated: GenerateSiteResponse = {
        ...aiSearchResult,
        site: res.site || aiSearchResult.site,
        isAlreadyListed: true,
      };
      setAiSearchResult(updated);
      try {
        sessionStorage.setItem('heritagelens_last_ai_search_result', JSON.stringify(updated));
      } catch {}

      const siteState = res.site?.state || aiSearchResult.site.state || 'Punjab';
      const siteHindiState = res.site?.hindiState || aiSearchResult.site.hindiState || STATE_HINDI_NAMES[siteState] || siteState;

      triggerToast(
        currentLang === 'en'
          ? `✨ Successfully added "${aiSearchResult.site.name}" to ${siteState} listing!`
          : `✨ "${aiSearchResult.site.hindiName || aiSearchResult.site.name}" ${siteHindiState} सूची में जोड़ा गया!`
      );

      // Automatically switch home state filter to this state so user sees it right away in the listing!
      setSelectedHomeState(siteState);
    } catch (err: any) {
      triggerToast(currentLang === 'en' ? 'Failed to add place to catalog' : 'कैटलॉग में जोड़ने में त्रुटि हुई');
    } finally {
      setIsAddingToCatalog(false);
    }
  };

  // Keep aiSearchResult in sync with heritageSites when user updates photo or catalog
  useEffect(() => {
    if (aiSearchResult?.site?.id) {
      const liveSite = heritageSites.find(
        (s) => s.id.toLowerCase() === aiSearchResult.site!.id.toLowerCase()
      );
      // Only sync if aiSearchResult does not currently have an image
      if (liveSite && liveSite.imageUrl && !aiSearchResult.site.imageUrl) {
        setAiSearchResult((prev) => {
          if (!prev || !prev.site) return prev;
          const updated = {
            ...prev,
            site: { ...prev.site, imageUrl: liveSite.imageUrl, imageAlt: liveSite.imageAlt || prev.site.imageAlt },
          };
          try {
            sessionStorage.setItem('heritagelens_last_ai_search_result', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    }
  }, [heritageSites]);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleAiMonumentSearch = async (queryToSearch?: string) => {
    const rawTarget = (queryToSearch || aiSearchQuery).trim();
    if (!rawTarget) return;

    const targetQuery = cleanSearchQuery(rawTarget) || rawTarget;

    // 1. Prevent duplicate AI calls & duplicate catalog entries if place is already listed!
    const existing = findExistingHeritageSite(targetQuery, heritageSites) || findExistingHeritageSite(rawTarget, heritageSites);
    if (existing) {
      const existingResult: GenerateSiteResponse = {
        success: true,
        isRealHeritageSite: true,
        site: existing,
        isAlreadyListed: true,
      };
      setAiSearchResult(existingResult);
      try {
        sessionStorage.setItem('heritagelens_last_ai_search_result', JSON.stringify(existingResult));
      } catch {}

      triggerToast(
        currentLang === 'en'
          ? `📌 "${existing.name}" is already in your catalog! Loaded existing dossier.`
          : `📌 "${existing.hindiName || existing.name}" पहले से कैटलॉग में मौजूद है!`
      );
      return;
    }

    const key = StorageService.getApiKey() || '';
    setIsAiSearching(true);
    setAiSearchResult(null);
    setAiSearchStep(currentLang === 'en' ? 'Analyzing heritage records with AI...' : 'एआई हेरिटेज रिकॉर्ड का विश्लेषण हो रहा है...');

    try {
      const res = await generateHeritageSiteFromSearch(targetQuery, key, currentLang);
      setAiSearchResult(res);
      try {
        sessionStorage.setItem('heritagelens_last_ai_search_result', JSON.stringify(res));
      } catch {}

      if (res.success && res.isRealHeritageSite && res.site) {
        if (res.isAlreadyListed) {
          triggerToast(
            currentLang === 'en'
              ? `📌 "${res.site.name}" is already listed in the catalog.`
              : `📌 "${res.site.hindiName || res.site.name}" पहले से कैटलॉग में मौजूद है।`
          );
        } else {
          triggerToast(
            currentLang === 'en'
              ? `✨ Discovered "${res.site.name}"! Click "+ Add to Catalog" to save it.`
              : `✨ "${res.site.hindiName || res.site.name}" खोजा गया! सहेजने के लिए "+ कैटलॉग में जोड़ें" दबाएं।`
          );
        }
      } else if (res.rejectionReason) {
        triggerToast(
          currentLang === 'en'
            ? 'Place not verified as a heritage site.'
            : 'स्थल एक धरोहर स्मारक के रूप में प्रमाणित नहीं हुआ।'
        );
      }
    } catch (err: any) {
      const errObj = {
        success: false,
        isRealHeritageSite: false,
        error: err?.message || 'AI Search encountered an error',
      };
      setAiSearchResult(errObj);
      try {
        sessionStorage.setItem('heritagelens_last_ai_search_result', JSON.stringify(errObj));
      } catch {}
    } finally {
      setIsAiSearching(false);
    }
  };

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
    executeIdentification();
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
      navigate('/result', { state: { result, analysisData: response.data } });
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
    const query = suggestedMonument.trim();
    setSuggestedMonument('');
    setAiSearchQuery(query);
    const inputEl = document.getElementById('ai-monument-search-input');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputEl.focus();
    }
    handleAiMonumentSearch(query);
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
              <span>{currentLang === 'en' ? `Explore All-India Sites (${heritageSites.length})` : `अखिल भारतीय स्मारक (${heritageSites.length})`}</span>
            </Link>
          </div>

          {/* Pilot Scope Clarification Bar */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D9]/70 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#8C8276]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2C4A3E]" />
              {currentLang === 'en' ? `${heritageSites.length} Monuments Active across ${availableStates.length} States` : `${availableStates.length} राज्यों के ${heritageSites.length} स्मारक सक्रिय`}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C05E42]" />
              {currentLang === 'en' ? 'State Hubs: Punjab, Delhi, Rajasthan, UP...' : 'राज्य हब: पंजाब, दिल्ली, राजस्थान, उप्र...'}
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
          </div>

          <div className="pt-6">
            <ImageInput
              value={selectedImage}
              onChange={handleImageChange}
              onAnalyze={handleAnalyzeClick}
              isAnalyzing={isAnalyzing}
              currentLang={currentLang}
            />

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

      {/* 3.5. AI MONUMENT DISCOVERY & AUTO-CATALOGING SEARCH */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div 
          id="ai-monument-search-card"
          className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl sm:rounded-4xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D9] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2C4A3E] text-[#D4AF37] flex items-center justify-center shadow-2xs">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif-heritage">
                    {currentLang === 'en' ? 'AI Monument Discovery & Auto-Cataloging' : 'एआई स्मारक खोज एवं स्वचालित कैटलॉग'}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#8B7319] border border-[#D4AF37]/30">
                    AI Neural Engine
                  </span>
                </div>
                <p className="text-xs text-[#5C544E] mt-0.5">
                  {currentLang === 'en'
                    ? 'Search any monument, temple, fort, gurdwara, or palace across Indian states to detect its state and generate a verified bilingual dossier.'
                    : 'भारत के किसी भी स्मारक, मंदिर, किले, गुरुद्वारे या महल को खोजकर उसका राज्य पहचानें और विस्तृत गाइड तैयार करें।'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Search Input Box (No page reload) */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  id="ai-monument-search-input"
                  type="text"
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      if (aiSearchQuery.trim() && !isAiSearching) {
                        handleAiMonumentSearch();
                      }
                    }
                  }}
                  placeholder={currentLang === 'en' ? "Enter any famous place or landmark across India (e.g. 'Golden Temple Amritsar', 'Taj Mahal', 'Hawa Mahal', 'Lotus Temple')..." : "भारत के किसी भी प्रसिद्ध स्थल या स्मारक का नाम दर्ज करें (जैसे 'स्वर्ण मंदिर अमृतसर', 'ताज महल', 'हवा महल')..."}
                  disabled={isAiSearching}
                  className="min-h-[46px] w-full pl-11 pr-4 py-2.5 bg-white border border-[#E8E2D9] focus:border-[#C05E42] focus:ring-2 focus:ring-[#C05E42]/20 rounded-2xl text-xs text-[#1A1A1A] outline-hidden transition-all shadow-2xs font-medium"
                />
                <Search className="w-4 h-4 text-[#8C8276] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                id="ai-monument-search-submit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAiMonumentSearch();
                }}
                disabled={!aiSearchQuery.trim() || isAiSearching}
                className="min-h-[46px] px-6 py-2.5 bg-[#2C4A3E] hover:bg-[#233a31] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isAiSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    <span>{currentLang === 'en' ? 'Generating...' : 'तैयार किया जा रहा है...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>{currentLang === 'en' ? 'Discover & Add Place' : 'खोजें और जोड़ें'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#8C8276] mr-1">
                {currentLang === 'en' ? 'Try sample places:' : 'नमूना स्थल आज़माएं:'}
              </span>
              {[
                { en: 'Golden Temple Amritsar', hi: 'स्वर्ण मंदिर (हरमंदिर साहिब) अमृतसर' },
                { en: 'Taj Mahal Agra', hi: 'ताज महल आगरा' },
                { en: 'Hawa Mahal Jaipur', hi: 'हवा महल जयपुर' },
                { en: 'Lotus Temple Delhi', hi: 'लोटस टेम्पल दिल्ली' },
                { en: 'Gateway of India Mumbai', hi: 'गेटवे ऑफ इंडिया मुंबई' },
                { en: 'Meenakshi Temple Madurai', hi: 'मीनाक्षी मंदिर मदुरै' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const val = currentLang === 'hi' ? item.hi : item.en;
                    setAiSearchQuery(val);
                    handleAiMonumentSearch(val);
                  }}
                  disabled={isAiSearching}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F3EEE7] border border-[#E8E2D9] text-[11px] text-[#5C544E] hover:text-[#1A1A1A] font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  ✨ {currentLang === 'hi' ? item.hi : item.en}
                </button>
              ))}
            </div>
          </div>

          {/* In-Progress Loading Status */}
          {isAiSearching && (
            <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-5 h-5 text-[#C05E42] animate-spin shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1A1A1A]">{aiSearchStep}</span>
                <span className="text-[11px] text-[#5C544E]">
                  {currentLang === 'en'
                    ? 'HeritageLens AI is researching historical archives, architectural styles, and authentic imagery.'
                    : 'हेरिटेज लेंस एआई ऐतिहासिक रिकॉर्ड, स्थापत्य शैली और चित्रों का संकलन कर रहा है।'}
                </span>
              </div>
            </div>
          )}

          {/* Result Banner (Clean user-facing: NO Admin button) */}
          {aiSearchResult && (
            <div className="flex flex-col gap-3">
              {aiSearchResult.success && aiSearchResult.isRealHeritageSite && aiSearchResult.site ? (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-emerald-200 shadow-2xs">
                      <img
                        src={aiSearchResult.site.imageUrl}
                        alt={aiSearchResult.site.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {isCurrentResultInCatalog ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <span>✓</span>
                            <span>{currentLang === 'en' ? 'Saved in Catalog & Database' : 'कैटलॉग एवं डेटाबेस में सहेजा गया'}</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <span>✨</span>
                            <span>{currentLang === 'en' ? 'Discovered Place (Ready to Add)' : 'खोजा गया (कैटलॉग में नहीं जुड़ा)'}</span>
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-700 font-mono">
                          ID: {aiSearchResult.site.id}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#1A1A1A] font-serif-heritage mt-1">
                        {currentLang === 'hi' ? aiSearchResult.site.hindiName : aiSearchResult.site.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {aiSearchResult.site.state && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2C4A3E]/10 text-[#2C4A3E] border border-[#2C4A3E]/20 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#C05E42]" />
                            {currentLang === 'hi'
                              ? `${aiSearchResult.site.hindiCity ? aiSearchResult.site.hindiCity + ', ' : ''}${aiSearchResult.site.hindiState || aiSearchResult.site.state}`
                              : `${aiSearchResult.site.city ? aiSearchResult.site.city + ', ' : ''}${aiSearchResult.site.state}`}
                          </span>
                        )}
                        <span className="text-xs text-[#5C544E]">
                          {aiSearchResult.site.builtYear} • {aiSearchResult.site.architecturalStyle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-emerald-200">
                    {/* Explicit ADD Button */}
                    {isCurrentResultInCatalog ? (
                      <span className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-100/80 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                        <span>{currentLang === 'en' ? 'In Catalog' : 'कैटलॉग में मौजूद है'}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddSiteToCatalog}
                        disabled={isAddingToCatalog}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#2C4A3E] hover:bg-[#233a31] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
                      >
                        {isAddingToCatalog ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-[#D4AF37] stroke-[3]" />
                        )}
                        <span>{currentLang === 'en' ? '+ Add to Catalog' : '+ कैटलॉग में जोड़ें'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsVisualPickerOpen(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-[#C05E42] hover:bg-[#a84f36] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{currentLang === 'en' ? 'Change Photo' : 'फ़ोटो बदलें'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/result?site=${aiSearchResult.site?.id}`)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#1A1A1A] hover:bg-[#2D2926] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{currentLang === 'en' ? 'View Result Dossier' : 'परिणाम देखें'}</span>
                    </button>
                  </div>

                  {/* Image Picker for newly generated site */}
                  {aiSearchResult.site && (
                    <VisualImagePickerModal
                      isOpen={isVisualPickerOpen}
                      onClose={() => setIsVisualPickerOpen(false)}
                      onSelectImage={async (newUrl, newAlt) => {
                        if (!aiSearchResult.site) return;
                        const updatedSite = {
                          ...aiSearchResult.site,
                          imageUrl: newUrl,
                          imageAlt: newAlt || aiSearchResult.site.imageAlt
                        };
                        if (isCurrentResultInCatalog) {
                          await HeritageDataStore.saveSite(updatedSite);
                        }
                        const newResult = {
                          ...aiSearchResult,
                          site: updatedSite
                        };
                        setAiSearchResult(newResult);
                        try {
                          sessionStorage.setItem('heritagelens_last_ai_search_result', JSON.stringify(newResult));
                        } catch {}
                        triggerToast(currentLang === 'en' ? 'Updated photo successfully!' : 'फ़ोटो सफलतापूर्वक सहेजी गई!');
                      }}
                      currentImageUrl={aiSearchResult.site.imageUrl}
                      placeName={aiSearchResult.site.name}
                      categoryTags={aiSearchResult.site.tags}
                      currentLang={currentLang}
                    />
                  )}
                </div>
              ) : (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 flex items-center justify-center shrink-0 mt-0.5">
                      <SearchX className="w-5 h-5 text-stone-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 uppercase tracking-wider">
                          {currentLang === 'en' ? 'Nothing Found' : 'कोई परिणाम नहीं मिला'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] font-serif-heritage mt-1.5">
                        {aiSearchResult.rejectionReason || aiSearchResult.error || (currentLang === 'en' ? `No monument or heritage place found matching "${aiSearchQuery}".` : `"${aiSearchQuery}" से मेल खाता कोई स्मारक नहीं मिला।`)}
                      </h4>
                      <p className="text-xs text-[#8C8276] mt-1 leading-relaxed">
                        {currentLang === 'en'
                          ? 'Please ensure you search for a real, physical monument, temple, fort, or historic place (e.g. Red Fort, ISKCON Temple, Taj Mahal).'
                          : 'कृपया किसी वास्तविक भौतिक स्मारक, मंदिर, किले या ऐतिहासिक स्थल का नाम खोजें (जैसे लाल किला, इस्कॉन मंदिर, ताजमहल)।'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAiSearchResult(null);
                      setAiSearchQuery('');
                      try {
                        sessionStorage.removeItem('heritagelens_last_ai_search_result');
                      } catch {}
                    }}
                    className="self-end sm:self-center px-4 py-2 rounded-xl bg-white hover:bg-[#F3EEE7] border border-[#E8E2D9] text-xs font-bold text-[#5C544E] hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    {currentLang === 'en' ? 'Clear Search' : 'खोज साफ़ करें'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}



      {/* 3.8. HOW TO USE HERITAGELENS & WHAT INFORMATION YOU UNLOCK */}
      <HowToUseDossierGuide currentLang={currentLang} />

      {/* 4. ALL-INDIA FEATURED HERITAGE COLLECTION */}
      <section id="monuments-collection" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C05E42]/10 text-[#C05E42] text-xs font-bold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'All-India Heritage Collection' : 'अखिल भारतीय धरोहर संकलन'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' ? 'Featured Monuments by State' : 'राज्यों के अनुसार प्रमुख धरोहर स्थल'}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C544E] mt-1">
              {currentLang === 'en'
                ? `Explore ${heritageSites.length} verified historical monuments across ${availableStates.length} Indian states. Filter by state or test recognition.`
                : `${availableStates.length} राज्यों के ${heritageSites.length} प्रमाणित स्मारकों का अन्वेषण करें। राज्य अनुसार फ़िल्टर करें या पहचान का परीक्षण करें।`}
            </p>
          </div>

          <Link
            to="/explore"
            className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C05E42] hover:text-[#9c3f25] transition-colors py-2"
          >
            <span>
              {currentLang === 'en'
                ? `View Full All-India Catalog (${heritageSites.length} Sites)`
                : `संपूर्ण राष्ट्रीय सूची देखें (${heritageSites.length} स्थल)`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* State Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedHomeState('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedHomeState === 'all'
                ? 'bg-[#1A1A1A] text-white shadow-2xs'
                : 'bg-white hover:bg-[#F3EEE7] text-[#5C544E] border border-[#E8E2D9]'
            }`}
          >
            {currentLang === 'en' ? 'All States' : 'सभी राज्य'} ({heritageSites.length})
          </button>
          {availableStates.map((st) => {
            const count = heritageSites.filter(
              (s) => (s.state || 'Delhi').toLowerCase() === st.toLowerCase()
            ).length;
            const hindiName = STATE_HINDI_NAMES[st] || st;
            const isSelected = selectedHomeState.toLowerCase() === st.toLowerCase();
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedHomeState(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#C05E42] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#F3EEE7] text-[#5C544E] border border-[#E8E2D9]'
                }`}
              >
                <span>{currentLang === 'hi' ? hindiName : st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-[#F3EEE7] text-[#8C8276]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Monuments Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {displayedSites.map((site) => (
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
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-all pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start pointer-events-none">
                <span className="px-2 py-0.5 bg-[#2C4A3E]/90 backdrop-blur-xs text-white rounded-md text-[9px] font-bold tracking-wider">
                  {currentLang === 'hi' ? site.hindiState || site.state || 'दिल्ली' : site.state || 'Delhi'}
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
                  {site.city ? `${site.city} • ` : ''}{site.builtYear}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. ALL-INDIA STATE DIRECTORY & ACCESS HUB */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-6" id="state-directory">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#8C6B14] text-xs font-bold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'All-India State Directory' : 'अखिल भारतीय राज्य निर्देशिका'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' ? 'Explore Heritage by State' : 'राज्यों के अनुसार धरोहर अन्वेषण'}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C544E] mt-1">
              {currentLang === 'en'
                ? 'Access heritage monuments state by state. Click any target monument to discover and add it with AI, or browse active listings.'
                : 'राज्यों के अनुसार ऐतिहासिक स्मारकों का अन्वेषण करें। एआई से खोजने और जोड़ने के लिए किसी भी स्मारक पर क्लिक करें।'}
            </p>
          </div>

          <Link
            to="/explore"
            className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2C4A3E] hover:text-[#1d322a] transition-colors py-2"
          >
            <span>{currentLang === 'en' ? 'Browse State Filters in Directory' : 'राज्य निर्देशिका देखें'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* State / Region Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allStateRegions.map((region) => {
            const stateSites = heritageSites.filter(
              (s) => (s.state || 'Delhi').toLowerCase() === region.state.toLowerCase()
            );
            const isActive = stateSites.length > 0;

            return (
              <div
                key={region.id}
                className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl overflow-hidden flex flex-col shadow-2xs hover:border-[#D4AF37] transition-all group"
              >
                {/* Region Banner */}
                <div className="relative h-36 bg-black overflow-hidden">
                  <img
                    src={region.bannerUrl}
                    alt={region.city}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackApplied) {
                        target.dataset.fallbackApplied = 'true';
                        target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80';
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Active vs Planned Tag */}
                  <div className="absolute top-3 right-3">
                    {isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold tracking-wider shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                        <span>{currentLang === 'en' ? `Active • ${stateSites.length} Sites` : `सक्रिय • ${stateSites.length} स्थल`}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#1A1A1A] text-[9px] font-extrabold tracking-wider">
                        {region.tag}
                      </span>
                    )}
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

                {/* Key Monuments with Clickable AI Discovery */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8C8276] uppercase tracking-wider">
                        {currentLang === 'en' ? 'Featured Monuments:' : 'प्रमुख स्मारक:'}
                      </span>
                      <span className="text-[9px] text-[#C05E42] font-semibold">
                        {currentLang === 'en' ? 'Click to Discover' : 'खोजने हेतु क्लिक करें'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {region.keyMonuments.map((monument, idx) => {
                        const hindiMon = region.hindiKeyMonuments[idx] || monument;
                        const monumentDisplayName = currentLang === 'hi' ? hindiMon : monument;
                        const existingSite = heritageSites.find(
                          (s) => s.name.toLowerCase().includes(monument.toLowerCase()) ||
                                 (s.hindiName && s.hindiName.includes(hindiMon))
                        );

                        return (
                          <button
                            key={monument}
                            type="button"
                            onClick={() => {
                              if (existingSite) {
                                navigate(`/result?site=${existingSite.id}`);
                              } else {
                                setAiSearchQuery(monument);
                                const inputEl = document.getElementById('ai-monument-search-input');
                                if (inputEl) {
                                  inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  inputEl.focus();
                                }
                                handleAiMonumentSearch(monument);
                              }
                            }}
                            title={existingSite ? 'View verified dossier' : 'Discover and add with AI'}
                            className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                              existingSite
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold hover:bg-emerald-100'
                                : 'bg-[#F3EEE7] hover:bg-[#E8E2D9] text-[#5C544E] hover:text-[#1A1A1A] border border-transparent'
                            }`}
                          >
                            <span>{existingSite ? '✓' : '+'}</span>
                            <span>{monumentDisplayName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-[11px]">
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHomeState(region.state);
                          const collEl = document.getElementById('monuments-collection');
                          if (collEl) {
                            collEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="text-xs font-bold text-[#C05E42] hover:text-[#9c3f25] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{currentLang === 'en' ? `View ${region.state} Sites (${stateSites.length})` : `${currentLang === 'hi' ? region.hindiState : region.state} के स्मारक देखें (${stateSites.length})`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[#8C8276]">{region.monumentCountEstimate}</span>
                    )}

                    <Link
                      to={`/explore?state=${encodeURIComponent(region.state)}`}
                      className="text-[10px] font-bold text-[#2C4A3E] hover:underline"
                    >
                      {currentLang === 'en' ? 'State Catalog →' : 'राज्य सूची →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggest / Add Any Indian Monument with Direct AI Search */}
        <div className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h4 className="text-lg font-bold font-serif-heritage text-[#1A1A1A] mb-1">
              {currentLang === 'en' ? 'Search & Add Any Indian Monument by State' : 'भारत के किसी भी राज्य का स्मारक खोजें और जोड़ें'}
            </h4>
            <p className="text-xs text-[#5C544E]">
              {currentLang === 'en'
                ? 'Type any historic temple, fort, gurdwara, stepwell, or palace from any Indian state to instantly generate its verified dossier with HeritageLens AI.'
                : 'भारत के किसी भी राज्य के ऐतिहासिक मंदिर, किले, गुरुद्वारे, बावड़ी या महल का नाम दर्ज करें और तुरंत एआई विवरण तैयार करें।'}
            </p>
          </div>

          <form onSubmit={handleSuggestMonument} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={suggestedMonument}
              onChange={(e) => setSuggestedMonument(e.target.value)}
              placeholder={currentLang === 'en' ? 'e.g., Golden Temple Amritsar, Rani ki Vav' : 'उदा. स्वर्ण मंदिर अमृतसर, रानी की वाव गुजरात'}
              className="px-4 py-2.5 bg-white border border-[#E8E2D9] focus:border-[#D4AF37] rounded-xl text-xs text-[#1A1A1A] outline-hidden w-full md:w-72"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#2C4A3E] hover:bg-[#233a31] text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Search with AI' : 'एआई से खोजें'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
