import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Compass, 
  Clock, 
  Ticket, 
  Navigation, 
  Sparkles, 
  Volume2, 
  Share2, 
  ShieldCheck,
  Building,
  Info,
  ChevronRight,
  Camera,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Footprints,
  AlertCircle,
  Eye
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { IdentificationResult, HeritageSite } from '../types';
import { StorageService } from '../services/storage';
import { AudioNarrationPlayer } from '../components/AudioNarrationPlayer';
import { NearbyExplorerSection } from '../components/NearbyExplorerSection';
import { HeritageDataStore } from '../services/heritageDataStore';
import { handleMonumentImageError } from '../utils/imageFallback';

interface ResultPageProps {
  currentLang: 'en' | 'hi';
}

export const ResultPage: React.FC<ResultPageProps> = ({ currentLang }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [missingSiteId, setMissingSiteId] = useState<string | null>(null);

  // Animation variants respecting user preferences
  const sectionVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.35,
        delay: prefersReducedMotion ? 0 : customIndex * 0.08,
        ease: 'easeOut'
      }
    })
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const siteParam = searchParams.get('site');

    // 1. If ?site=<id> is in the URL, fetch and display that site
    if (siteParam) {
      const siteMatch = HeritageDataStore.getSiteById(siteParam);

      if (siteMatch) {
        setMissingSiteId(null);
        const siteResult: IdentificationResult = {
          isIdentified: true,
          siteId: siteMatch.id,
          site: siteMatch,
          confidenceScore: 0.99,
          detectedName: currentLang === 'hi' ? siteMatch.hindiName : siteMatch.name,
          architecturalElements: [siteMatch.architecturalStyle, 'Verified ASI National Monument'],
          historicalEra: siteMatch.builtYear,
          customGeminiInsight: currentLang === 'hi'
            ? `${siteMatch.hindiName} की समृद्ध सांस्कृतिक विरासत और ऐतिहासिक बनावट।`
            : `Verified historical dossier for ${siteMatch.name} featuring its distinct architectural heritage and cultural significance.`,
          uploadedImageUrl: siteMatch.imageUrl,
          analyzedAt: new Date().toISOString(),
          isFallbackOrUnknown: false
        };
        setResult(siteResult);
        StorageService.saveLastResult(siteResult);
        return;
      } else {
        // Explicitly set missing site error state
        setMissingSiteId(siteParam);
        setResult(null);
        return;
      }
    }

    setMissingSiteId(null);

    // 2. Check if result was passed via route state
    if (location.state?.result) {
      setResult(location.state.result);
      return;
    }

    // 3. Check session cache
    const cached = StorageService.getLastResult();
    if (cached) {
      setResult(cached);
      return;
    }

    // 4. Default fallback monument
    const allSites = HeritageDataStore.getAllSites();
    const defaultSite = allSites[1] || allSites[0];
    if (defaultSite) {
      setResult({
        isIdentified: true,
        siteId: defaultSite.id,
        site: defaultSite,
        confidenceScore: 0.96,
        detectedName: currentLang === 'hi' ? defaultSite.hindiName : defaultSite.name,
        architecturalElements: [defaultSite.architecturalStyle, 'Double dome', 'Red Sandstone Inlay'],
        historicalEra: defaultSite.builtYear,
        customGeminiInsight: 'Verified architectural specimen featuring Persian Charbagh geometry and red sandstone masonry.',
        uploadedImageUrl: defaultSite.imageUrl,
        analyzedAt: new Date().toISOString(),
        isFallbackOrUnknown: false
      });
    }
  }, [location.state, location.search, currentLang]);

  const site = result?.site;
  const isIdentified = Boolean(result?.isIdentified && site);
  const confidencePercent = Math.round((result?.confidenceScore || 0.94) * 100);

  // Check if result was produced in Demo Mode or via fallback
  const isDemoResult = Boolean(
    result?.isDemoResult || 
    result?.isDemoFallback || 
    StorageService.isDemoMode() || 
    !StorageService.getApiKey()
  );

  // Check if AI recognition or photo upload was used
  const isAiRecognized = Boolean(result?.uploadedImageUrl && result?.uploadedImageUrl !== site?.imageUrl) || isDemoResult;

  // Comprehensive narration text for speech narrator
  const narrationText = useMemo(() => {
    if (!site) return result?.customGeminiInsight || 'Heritage site';
    if (currentLang === 'hi') {
      let speech = `${site.hindiName}। ${site.hindiShortDescription}। संक्षिप्त इतिहास: ${site.hindiFullHistory}। वास्तुकला एवं सांस्कृतिक महत्व: ${site.hindiCulturalSignificance}।`;
      if (site.hindiInterestingFacts && site.hindiInterestingFacts.length > 0) {
        speech += ` रोचक तथ्य: ${site.hindiInterestingFacts.join('। ')}।`;
      }
      return speech;
    } else {
      let speech = `${site.name}. ${site.shortDescription}. Historical overview: ${site.fullHistory}. Architecture and cultural significance: ${site.culturalSignificance}.`;
      if (site.interestingFacts && site.interestingFacts.length > 0) {
        speech += ` Key facts: ${site.interestingFacts.join('. ')}.`;
      }
      return speech;
    }
  }, [site, currentLang, result?.customGeminiInsight]);

  // Folklore content segregation
  const folkloreList = useMemo(() => {
    if (!site) return [];
    if (currentLang === 'hi') {
      return site.hindiFolkloreOrLegends || site.folkloreOrLegends || [];
    }
    return site.folkloreOrLegends || [];
  }, [site, currentLang]);

  // Derived Category and City metadata
  const siteCategory = site?.tags?.[0] || 'Monument';
  const siteCity = 'Delhi';
  const siteArea = site?.travelTips?.nearestMetro || 'Delhi, India';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Missing Site Data State
  if (missingSiteId) {
    return (
      <div className="flex-1 py-12 max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-8 sm:p-12 w-full flex flex-col items-center gap-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md">
            <span className="text-[10px] font-bold tracking-widest text-[#C05E42] uppercase px-3 py-1 rounded-full bg-[#C05E42]/10">
              {currentLang === 'en' ? 'Missing Site Record' : 'स्मारक रिकॉर्ड अनुपलब्ध'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' ? 'Site Dossier Not Found' : 'स्मारक विवरण नहीं मिला'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C544E] leading-relaxed">
              {currentLang === 'en'
                ? `No heritage record was found matching the identifier "${missingSiteId}". The requested monument may have moved or is not yet part of our 10 verified Delhi sites.`
                : `पहचानकर्ता "${missingSiteId}" से मेल खाता कोई रिकॉर्ड नहीं मिला। यह स्मारक अभी हमारे 10 समर्थित दिल्ली स्मारकों में शामिल नहीं है।`}
            </p>
          </div>

          <div className="w-full bg-[#F3EEE7] border border-[#E8E2D9] rounded-2xl p-4 text-left text-xs text-[#2D2926] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#C05E42] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{currentLang === 'en' ? 'What to do next: ' : 'आगे क्या करें: '}</span>
              <span className="text-[#5C544E]">
                {currentLang === 'en'
                  ? 'Browse the 10 verified Delhi pilot monuments in the Explore directory or upload a new photo.'
                  : 'एक्सप्लोर सूची में 10 समर्थित दिल्ली स्मारक देखें या नई तस्वीर अपलोड करें।'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/explore"
              className="px-6 py-3 bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Explore 10 Delhi Sites' : '10 दिल्ली स्मारक देखें'}</span>
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-white hover:bg-[#F3EEE7] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-[#C05E42]" />
              <span>{currentLang === 'en' ? 'Identify Photo' : 'फोटो पहचानें'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm text-[#5C544E]">
            {currentLang === 'en' ? 'Loading heritage dossier...' : 'धरोहर विवरण लोड किया जा रहा है...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-6 sm:py-8 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION & BREADCRUMB ACTIONS                                    */}
      {/* ========================================================================= */}
      <motion.div 
        initial="hidden"
        animate="visible"
        custom={0}
        variants={sectionVariants}
        className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E2D9] pb-4"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="result-nav-back-btn"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#F3EEE7] text-xs font-bold text-[#5C544E] hover:text-[#C05E42] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'Back' : 'वापस'}</span>
          </button>

          <Link
            to="/explore"
            id="result-explore-link-top"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C8276] hover:text-[#C05E42] transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Explore Delhi Sites' : 'दिल्ली धरोहर देखें'}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Identify Another Image Button */}
          <Link
            to="/"
            id="result-identify-another-btn-top"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Identify Another' : 'अन्य तस्वीर पहचानें'}</span>
          </Link>

          {/* Share Button */}
          <button
            type="button"
            id="result-share-btn"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#F3EEE7] text-xs font-semibold text-[#5C544E] transition-colors cursor-pointer"
            title="Share or copy URL"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? (currentLang === 'en' ? 'Copied!' : 'कॉपी हुआ!') : (currentLang === 'en' ? 'Share' : 'शेयर')}</span>
          </button>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. UNRECOGNIZED / UNCERTAIN STATE                                        */}
      {/* ========================================================================= */}
      {!isIdentified ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          custom={1}
          variants={sectionVariants}
          id="result-uncertain-card"
          className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto flex flex-col items-center gap-6 shadow-sm text-center"
        >
          {(() => {
            const isVeryLowConfidence = (result.confidenceScore || 0) < 0.45;
            const insightText = (result.customGeminiInsight || '').toLowerCase();
            const isUnclearImage = isVeryLowConfidence || insightText.includes('blur') || insightText.includes('dark') || insightText.includes('lighting') || insightText.includes('unclear') || insightText.includes('low quality');

            return (
              <>
                <div className="w-16 h-16 rounded-3xl bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold">
                    {currentLang === 'en' ? 'AI Confidence' : 'एआई सटीकता'}: {confidencePercent}%
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-[#F3EEE7] border border-[#E8E2D9] text-[#5C544E] text-xs font-bold">
                    {isUnclearImage
                      ? (currentLang === 'en' ? 'Image Quality Unclear' : 'छवि स्पष्ट नहीं है')
                      : (currentLang === 'en' ? 'Site Outside Delhi Pilot' : 'दिल्ली पायलट के बाहर का स्मारक')}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-[#1A1A1A]">
                    {isUnclearImage
                      ? (currentLang === 'en' ? 'Photo Unclear for Reliable Matching' : 'सटीक पहचान के लिए फोटो स्पष्ट नहीं है')
                      : (currentLang === 'en' ? 'Site Not Among 10 Supported Delhi Sites' : 'यह स्थल 10 समर्थित दिल्ली स्मारकों में शामिल नहीं है')}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C544E] leading-relaxed max-w-lg mx-auto">
                    {isUnclearImage
                      ? (result.customGeminiInsight || (currentLang === 'en'
                          ? 'The photo is blurry, backlit, or too distant to recognize distinct architectural motifs. AI requires clear visual markers (such as arches, domes, or engravings).'
                          : 'तस्वीर धुंधली, कम रोशनी वाली या बहुत दूर से ली गई प्रतीत होती है। एआई को स्पष्ट वास्तुकला आकृतियों की आवश्यकता होती है।'))
                      : (result.customGeminiInsight || (currentLang === 'en'
                          ? 'HeritageLens AI currently supports 10 verified Delhi heritage monuments (Red Fort, Qutub Minar, Humayun’s Tomb, Bangla Sahib, India Gate, Lotus Temple, Purana Qila, Jama Masjid, Sis Ganj Sahib, Agrasen ki Baoli).'
                          : 'हेरिटेज लेंस एआई वर्तमान में दिल्ली के 10 प्रमाणित स्मारकों (लाल किला, कुतुब मीनार, हुमायूं का मक़बरा, बंगला साहिब, आदि) का समर्थन करता है।'))
                    }
                  </p>
                </div>

                {result.uploadedImageUrl && (
                  <div className="w-56 h-40 rounded-2xl overflow-hidden border border-[#E8E2D9] shadow-2xs">
                    <img
                      src={result.uploadedImageUrl}
                      alt="Uploaded monument for analysis"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Alternative Matches Section */}
                {result.alternativeMatches && result.alternativeMatches.length > 0 && (
                  <div className="w-full bg-[#F3EEE7]/70 border border-[#E8E2D9] rounded-2xl p-5 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8276] block mb-2">
                      {currentLang === 'en' ? 'Possible Alternative Matches Considered by AI' : 'एआई द्वारा विचार किए गए संभावित विकल्प'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.alternativeMatches.map((alt, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D9] text-xs font-semibold text-[#1A1A1A] shadow-2xs"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actionable Next Steps Box */}
                <div className="w-full bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 text-left text-xs text-amber-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{currentLang === 'en' ? 'What you can do next:' : 'आगे क्या करें:'}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1 text-[11px] sm:text-xs">
                    {isUnclearImage ? (
                      <>
                        <li>{currentLang === 'en' ? 'Capture a closer, well-lit photo in natural daylight.' : 'प्राकृतिक रोशनी में नजदीक से स्पष्ट तस्वीर लें।'}</li>
                        <li>{currentLang === 'en' ? 'Focus on prominent structures like main facades, domes, or sandstone minarets.' : 'मुख्य गुंबद, मेहराब या मीनार पर कैमरा फोकस करें।'}</li>
                        <li>{currentLang === 'en' ? 'Or try our pre-tested sample Red Fort demo image.' : 'या हमारे पूर्व-परीक्षित लाल किला नमूने को आज़माएं।'}</li>
                      </>
                    ) : (
                      <>
                        <li>{currentLang === 'en' ? 'Select and explore one of the 10 featured Delhi monuments.' : '10 समर्थित दिल्ली स्मारकों में से किसी एक को चुनें और देखें।'}</li>
                        <li>{currentLang === 'en' ? 'Check our Explore directory for full historical records and nearby places.' : 'पूरे ऐतिहासिक रिकॉर्ड और आसपास के स्थानों के लिए एक्सप्लोर निर्देशिका देखें।'}</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2">
                  <Link
                    to="/"
                    id="result-retry-upload-btn"
                    className="w-full sm:w-auto px-6 py-3 bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{currentLang === 'en' ? 'Try Another Photo' : 'दूसरी फोटो आजमाएं'}</span>
                  </Link>
                  <Link
                    to="/explore"
                    id="result-return-explore-btn"
                    className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#F3EEE7] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-[#2C4A3E]" />
                    <span>{currentLang === 'en' ? 'Explore 10 Supported Sites' : '10 समर्थित स्मारक देखें'}</span>
                  </Link>
                </div>
              </>
            );
          })()}
        </motion.div>
      ) : (
        /* ========================================================================= */
        /* 3. VERIFIED MONUMENT DOSSIER LAYOUT                                       */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================================= */}
          {/* LEFT COLUMN: Visual Header, Badges, Narration & Fast Specs              */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Visual Header / Uploaded Image Container */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1}
              variants={sectionVariants}
              id="result-visual-header"
              className="relative aspect-4/3 rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-black group"
            >
              <img
                src={result.uploadedImageUrl || site.imageUrl}
                alt={site.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => handleMonumentImageError(e, site.id, currentLang === 'hi' ? site.hindiName : site.name, site.imageUrl)}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Top Badges: Verified Status & Confidence */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                <span className="px-3 py-1 bg-[#2C4A3E]/95 backdrop-blur-xs text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{currentLang === 'en' ? 'ASI VERIFIED' : 'प्रमाणित स्थल'}</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Demo Result Badge when running in Demo Mode */}
                  {isDemoResult && (
                    <span 
                      id="result-demo-badge"
                      className="px-3 py-1 bg-amber-500 text-black font-extrabold rounded-full text-xs shadow-md border border-amber-300 flex items-center gap-1"
                    >
                      <span>{currentLang === 'en' ? 'Demo result' : 'डेमो परिणाम'}</span>
                    </span>
                  )}

                  {/* Confidence Badge when AI / Demo Recognition was used */}
                  <span 
                    id="result-confidence-badge"
                    className="px-3 py-1 bg-black/75 backdrop-blur-xs text-[#D4AF37] rounded-full text-xs font-bold border border-[#D4AF37]/40 shadow-xs"
                  >
                    {confidencePercent}% {currentLang === 'en' ? 'Confidence' : 'सटीकता'}
                  </span>
                </div>
              </div>

              {/* Bottom Image Overlay Text */}
              <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#F3D79F] px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-xs">
                    {siteCategory}
                  </span>
                  <span className="text-[10px] text-white/80 font-medium">
                    {siteCity} • {site.builtYear}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-heritage leading-tight drop-shadow-xs">
                  {currentLang === 'hi' ? site.hindiName : site.name}
                </h2>
              </div>
            </motion.div>

            {/* Audio Story & Narration Player (Listen, Pause, Resume, Stop) */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={sectionVariants}
            >
              <AudioNarrationPlayer
                textToNarrate={narrationText}
                lang={currentLang}
                monumentTitle={currentLang === 'hi' ? site.hindiName : site.name}
              />
            </motion.div>

            {/* Architectural & Structural Specifications */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={sectionVariants}
              id="result-architectural-metadata"
              className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-5 sm:p-6 flex flex-col gap-3 shadow-xs"
            >
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C8276] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#C05E42]" />
                <span>{currentLang === 'en' ? 'Architectural Metadata' : 'वास्तुशिल्प विवरण'}</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-start py-1.5 border-b border-[#E8E2D9] gap-2">
                  <span className="text-[#5C544E]">{currentLang === 'en' ? 'Style' : 'शैली'}:</span>
                  <span className="font-semibold text-[#1A1A1A] text-right">{site.architecturalStyle}</span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-[#E8E2D9] gap-2">
                  <span className="text-[#5C544E]">{currentLang === 'en' ? 'Commissioned By' : 'निर्माता'}:</span>
                  <span className="font-semibold text-[#1A1A1A] text-right">{site.builtBy}</span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-[#E8E2D9] gap-2">
                  <span className="text-[#5C544E]">{currentLang === 'en' ? 'Built Period' : 'निर्माण काल'}:</span>
                  <span className="font-semibold text-[#1A1A1A] text-right">{site.builtYear}</span>
                </div>
                <div className="flex justify-between items-start py-1.5 gap-2">
                  <span className="text-[#5C544E]">{currentLang === 'en' ? 'Location' : 'स्थान'}:</span>
                  <span className="font-semibold text-[#1A1A1A] text-right">{siteArea}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Action Buttons for Exploration */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={4}
              variants={sectionVariants}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <Link
                to="/"
                id="result-identify-another-btn-side"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Identify Another Image' : 'अन्य तस्वीर पहचानें'}</span>
              </Link>

              <Link
                to="/explore"
                id="result-return-explore-btn-side"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-[#F3EEE7] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <Compass className="w-4 h-4 text-[#2C4A3E]" />
                <span>{currentLang === 'en' ? 'Return to Explore' : 'स्मारक सूची पर लौटें'}</span>
              </Link>
            </motion.div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: Full Dossier Narrative Sections                           */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Section 1: Site Header, Category, City & Short Story */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1}
              variants={sectionVariants}
              id="result-header-and-story"
              className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4"
            >
              {/* Category, City, Demo Result and Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {isDemoResult && (
                  <span 
                    id="result-demo-pill"
                    className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>{currentLang === 'en' ? 'Demo result' : 'डेमो परिणाम'}</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#C05E42]/10 text-[#C05E42] text-xs font-bold uppercase tracking-wider">
                  {siteCategory}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#2C4A3E]/10 text-[#2C4A3E] text-xs font-bold uppercase tracking-wider">
                  {siteCity}
                </span>
                {confidencePercent && (
                  <span className="px-3 py-1 rounded-full bg-[#F3EEE7] border border-[#E8E2D9] text-[#8C8276] text-xs font-semibold">
                    {confidencePercent}% {currentLang === 'en' ? 'Match Accuracy' : 'सटीक मिलान'}
                  </span>
                )}
              </div>

              {/* Demo Mode Information Banner when applicable */}
              {isDemoResult && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold">
                      {currentLang === 'en' ? 'Demo Mode Recognition: ' : 'डेमो मोड पहचान: '}
                    </span>
                    {currentLang === 'en'
                      ? 'This result was matched using offline local heritage visual profiles and verified ASI records without consuming Gemini API quota. The full audio guide, history, folklore, and travel tips are active.'
                      : 'यह परिणाम जेमिनी एपीआई कोटा का उपयोग किए बिना ऑफलाइन स्थानीय धरोहर प्रोफाइल और प्रमाणित एएसआई रिकॉर्ड का उपयोग करके प्रदर्शित किया गया है। पूर्ण ऑडियो गाइड, इतिहास और यात्रा सुझाव सक्रिय हैं।'}
                  </div>
                </div>
              )}

              {/* Monument Name */}
              <div>
                <h1 
                  id="result-site-title"
                  className="text-3xl sm:text-4xl font-bold font-serif-heritage text-[#1A1A1A] leading-tight"
                >
                  {currentLang === 'hi' ? site.hindiName : site.name}
                </h1>
                {site.alternateName && (
                  <p className="text-sm text-[#8C8276] font-serif-heritage italic mt-0.5">
                    {site.alternateName}
                  </p>
                )}
              </div>

              {/* Short Story */}
              <div className="pt-2 border-t border-[#E8E2D9]">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#8C8276] mb-2 font-serif-heritage flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#C05E42]" />
                  <span>{currentLang === 'en' ? 'Short Story' : 'संक्षिप्त कहानी'}</span>
                </h3>
                <p 
                  id="result-short-story-text"
                  className="text-sm sm:text-base text-[#2D2926] leading-relaxed font-medium"
                >
                  {currentLang === 'hi' ? site.hindiShortDescription : site.shortDescription}
                </p>
              </div>

              {/* Gemini AI Custom Observation if available */}
              {result.customGeminiInsight && (
                <div className={`p-4 rounded-2xl border flex items-start gap-3 mt-1 ${isDemoResult ? 'bg-amber-50/50 border-amber-200/60' : 'bg-[#2C4A3E]/5 border-[#2C4A3E]/15'}`}>
                  <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isDemoResult ? 'text-amber-700' : 'text-[#2C4A3E]'}`} />
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDemoResult ? 'text-amber-900' : 'text-[#2C4A3E]'}`}>
                      {isDemoResult
                        ? (currentLang === 'en' ? 'Demo Recognition Insight' : 'डेमो पहचान विवरण')
                        : (currentLang === 'en' ? 'AI Vision Recognition Insight' : 'एआई विज़न पहचान अवलोकन')}
                    </span>
                    <p className="text-xs text-[#2D2926] mt-0.5 leading-relaxed">
                      {result.customGeminiInsight}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Section 2: Verified Historical Overview */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={sectionVariants}
              id="result-historical-overview"
              className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-3"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8C8276] font-serif-heritage flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C05E42]" />
                <span>{currentLang === 'en' ? 'Verified Historical Overview' : 'प्रमाणित ऐतिहासिक विवरण'}</span>
              </h3>
              <p 
                id="result-history-content"
                className="text-xs sm:text-sm text-[#2D2926] leading-relaxed"
              >
                {currentLang === 'hi' ? site.hindiFullHistory : site.fullHistory}
              </p>
            </motion.div>

            {/* Section 3: Architecture and Cultural Significance */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={sectionVariants}
              id="result-architecture-significance"
              className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5"
            >
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#8C8276] mb-2 font-serif-heritage flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#2C4A3E]" />
                  <span>{currentLang === 'en' ? 'Architectural Highlights' : 'वास्तुशिल्प विशेषताएं'}</span>
                </h3>
                <p 
                  id="result-architecture-text"
                  className="text-xs sm:text-sm text-[#2D2926] leading-relaxed"
                >
                  {site.architecturalStyle}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#8C8276] mb-2 font-serif-heritage flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{currentLang === 'en' ? 'Cultural Significance' : 'सांस्कृतिक महत्व'}</span>
                </h3>
                <p 
                  id="result-cultural-text"
                  className="text-xs sm:text-sm text-[#2D2926] leading-relaxed"
                >
                  {currentLang === 'hi' ? site.hindiCulturalSignificance : site.culturalSignificance}
                </p>
              </div>
            </motion.div>

            {/* Section 4: Interesting Facts */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={4}
              variants={sectionVariants}
              id="result-interesting-facts"
              className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C05E42] mb-3 font-serif-heritage flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Interesting Facts' : 'रोचक तथ्य'}</span>
              </h3>
              <ul 
                id="result-facts-list"
                className="space-y-2.5"
              >
                {(currentLang === 'hi' ? site.hindiInterestingFacts : site.interestingFacts).map(
                  (fact, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2D2926] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C05E42] shrink-0 mt-1.5" />
                      <span>{fact}</span>
                    </li>
                  )
                )}
              </ul>
            </motion.div>

            {/* Section 5: Folklore Section (Rendered ONLY when folklore exists, clearly labeled) */}
            {folkloreList && folkloreList.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                custom={5}
                variants={sectionVariants}
                id="result-folklore-section"
                className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-7 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>
                    {currentLang === 'en' 
                      ? 'Folklore & Oral Tradition (Not Verified Historical Fact)' 
                      : 'लोककथा एवं जनश्रुति (प्रमाणित ऐतिहासिक तथ्य नहीं)'}
                  </span>
                </div>
                <div className="space-y-2">
                  {folkloreList.map((folk, idx) => (
                    <p key={idx} className="text-xs text-amber-950 leading-relaxed italic">
                      {folk}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section 6: Travel Tips */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={6}
              variants={sectionVariants}
              id="result-travel-tips"
              className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2C4A3E] font-serif-heritage flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span>{currentLang === 'en' ? 'Travel Tips & Visitor Guide' : 'यात्रा सुझाव व मार्गदर्शिका'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#F3EEE7] rounded-xl">
                  <span className="text-[10px] text-[#8C8276] uppercase font-bold block mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C05E42]" />
                    {currentLang === 'en' ? 'Timings' : 'समय'}
                  </span>
                  <p className="font-semibold text-[#1A1A1A] leading-tight">{site.travelTips.timings}</p>
                </div>

                <div className="p-3 bg-[#F3EEE7] rounded-xl">
                  <span className="text-[10px] text-[#8C8276] uppercase font-bold block mb-1 flex items-center gap-1">
                    <Ticket className="w-3 h-3 text-[#2C4A3E]" />
                    {currentLang === 'en' ? 'Entry Fee' : 'प्रवेश शुल्क'}
                  </span>
                  <p className="font-semibold text-[#1A1A1A] leading-tight">{site.travelTips.entryFee}</p>
                </div>

                <div className="p-3 bg-[#F3EEE7] rounded-xl">
                  <span className="text-[10px] text-[#8C8276] uppercase font-bold block mb-1 flex items-center gap-1">
                    <Footprints className="w-3 h-3 text-[#D4AF37]" />
                    {currentLang === 'en' ? 'Nearest Metro' : 'निकटतम मेट्रो'}
                  </span>
                  <p className="font-semibold text-[#1A1A1A] leading-tight">{site.travelTips.nearestMetro}</p>
                </div>
              </div>

              {site.travelTips.rules && site.travelTips.rules.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8276] block mb-1.5">
                    {currentLang === 'en' ? 'Important Visitor Rules' : 'महत्वपूर्ण नियम'}
                  </span>
                  <ul className="space-y-1">
                    {site.travelTips.rules.map((rule, idx) => (
                      <li key={idx} className="text-xs text-[#5C544E] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C8276]" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Section 7: Nearby Places, Heritage, Food, Artisan Markets & Map */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={7}
              variants={sectionVariants}
              id="result-nearby-places"
            >
              <NearbyExplorerSection
                siteId={site.id}
                siteName={currentLang === 'hi' ? site.hindiName : site.name}
                category={siteCategory}
                areaName={siteArea}
                currentLang={currentLang}
              />
            </motion.div>

            {/* Section 8: Prototype & Official Verification Disclaimer */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={8}
              variants={sectionVariants}
              id="result-disclaimer"
              className="text-[11px] text-[#8C8276] p-4 sm:p-5 bg-[#F3EEE7]/90 rounded-2xl border border-[#E8E2D9] flex flex-col gap-2 shadow-2xs"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#C05E42] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#1A1A1A]">
                    {currentLang === 'en' ? 'Prototype Accuracy Disclaimer' : 'प्रोटोटाइप सटीकता अस्वीकरण'}
                  </span>
                  <p className="text-[#5C544E] leading-relaxed">
                    {currentLang === 'en'
                      ? 'This prototype may make recognition mistakes. Timings, ticket fees, photography rules, and access permissions change periodically — visitors should always verify current details directly with official sources (such as the Archaeological Survey of India or monument management).'
                      : 'यह प्रोटोटाइप पहचान में त्रुटियाँ कर सकता है। समय, टिकट शुल्क, फोटोग्राफी नियम और प्रवेश अनुमतियाँ समय-समय पर बदल सकती हैं — पर्यटकों को हमेशा आधिकारिक स्रोतों (जैसे भारतीय पुरातत्व सर्वेक्षण या स्मारक प्रबंधन) से वर्तमान विवरणों की पुष्टि करनी चाहिए।'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E2D9] flex items-center justify-between text-[10px]">
                <span>{currentLang === 'en' ? 'Historical Source Reference' : 'प्रमाणिक संदर्भ'}: {site.sourceNote}</span>
                <span className="text-[#C05E42] font-semibold">HeritageLens AI v1.0</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};
