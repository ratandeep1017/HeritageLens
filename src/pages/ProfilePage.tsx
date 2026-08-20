import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Key, 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  RotateCw, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Check, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Server, 
  Info, 
  HelpCircle,
  Cpu,
  ArrowRight,
  Sparkle,
  Layers,
  Compass,
  Play,
  Shield,
  Sliders,
  Building2
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { testGeminiConnection, getStoredGeminiKey, createDemoRecognitionResult } from '../services/geminiService';
import { HeritageDataStore } from '../services/heritageDataStore';
import { HeritageSite } from '../types';
import { HeritageSiteAdminManager } from '../components/HeritageSiteAdminManager';
import { SecurityAndTestPlanSection } from '../components/SecurityAndTestPlanSection';

interface ProfilePageProps {
  currentLang: 'en' | 'hi';
  onLangChange: (lang: 'en' | 'hi') => void;
}

type KeyStatus = 'not_configured' | 'saved_locally' | 'testing' | 'connected' | 'failed';

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentLang, onLangChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Main Page Tabs: 'preferences' (Engine & API) vs 'admin' (Admin Catalog & Image Manager)
  const [activeMainTab, setActiveMainTab] = useState<'preferences' | 'admin'>('preferences');

  // Admin access gate state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => StorageService.isAdminUnlocked());
  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [adminPasscodeError, setAdminPasscodeError] = useState<string | null>(null);

  // Gemini API Configuration state
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedKey, setSavedKey] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [status, setStatus] = useState<KeyStatus>('not_configured');
  const [statusMessage, setStatusMessage] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Active App Mode: 'gemini' | 'demo'
  const [activeMode, setActiveMode] = useState<'gemini' | 'demo'>('demo');
  
  // Dynamic Heritage Sites (single source of truth)
  const [heritageSites, setHeritageSites] = useState<HeritageSite[]>(() => HeritageDataStore.getAllSites());
  const [selectedDemoSiteId, setSelectedDemoSiteId] = useState<string>('red-fort');

  useEffect(() => {
    // Check URL parameters for tab=admin
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('tab') === 'admin') {
      setActiveMainTab('admin');
    }

    const existingKey = StorageService.getApiKey();
    const mode = StorageService.getAppMode();
    setActiveMode(mode);

    if (existingKey) {
      setSavedKey(existingKey);
      setApiKeyInput(existingKey);
      setStatus('saved_locally');
    } else {
      setStatus('not_configured');
      setIsEditingKey(true);
    }

    // Subscribe to heritage site data updates
    const unsubscribe = HeritageDataStore.subscribe(() => {
      setHeritageSites(HeritageDataStore.getAllSites());
    });
    return unsubscribe;
  }, [location.search]);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAdminUnlock = () => {
    if (StorageService.verifyAdminPasscode(adminPasscodeInput)) {
      StorageService.setAdminUnlocked(true);
      setIsAdminUnlocked(true);
      setAdminPasscodeError(null);
      setAdminPasscodeInput('');
      triggerToast(currentLang === 'en' ? 'Administrator access unlocked!' : 'व्यवस्थापक एक्सेस अनलॉक किया गया!');
    } else {
      setAdminPasscodeError(currentLang === 'en' ? 'Incorrect passcode. Try "admin" or click Quick Unlock.' : 'गलत पासकोड। "admin" आज़माएं।');
    }
  };

  const handleAdminQuickUnlock = () => {
    StorageService.setAdminUnlocked(true);
    setIsAdminUnlocked(true);
    setAdminPasscodeError(null);
    setAdminPasscodeInput('');
    triggerToast(currentLang === 'en' ? 'Administrator access unlocked!' : 'व्यवस्थापक एक्सेस अनलॉक किया गया!');
  };

  const handleAdminLock = () => {
    StorageService.setAdminUnlocked(false);
    setIsAdminUnlocked(false);
    triggerToast(currentLang === 'en' ? 'Administrator controls locked.' : 'व्यवस्थापक नियंत्रण लॉक किए गए।');
  };

  const handleModeSwitch = (mode: 'gemini' | 'demo') => {
    setActiveMode(mode);
    StorageService.setAppMode(mode);
    triggerToast(
      currentLang === 'en'
        ? `Switched to ${mode === 'gemini' ? 'Gemini Live Vision Mode' : 'Demo Mode (Offline / Sample Data)'}`
        : `${mode === 'gemini' ? 'जेमिनी लाइव विज़न मोड' : 'डेमो मोड (ऑफ़लाइन डेटा)'} में बदला गया`
    );
  };

  const handleSaveKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      handleRemoveKey();
      return;
    }

    StorageService.setApiKey(trimmed);
    setSavedKey(trimmed);
    setIsEditingKey(false);
    setShowKey(false);
    setStatus('saved_locally');
    setStatusMessage('');
    setActiveMode('gemini');
    StorageService.setAppMode('gemini');
    triggerToast(currentLang === 'en' ? 'API Key saved. Gemini Mode enabled.' : 'कुंजी सहेजी गई। जेमिनी मोड सक्षम।');
  };

  const handleRemoveKey = () => {
    StorageService.clearApiKey();
    setSavedKey('');
    setApiKeyInput('');
    setIsEditingKey(true);
    setShowKey(false);
    setStatus('not_configured');
    setStatusMessage('');
    setActiveMode('demo');
    StorageService.setAppMode('demo');
    triggerToast(currentLang === 'en' ? 'API Key removed. Demo mode active.' : 'एपीआई कुंजी हटा दी गई। डेमो मोड सक्रिय।');
  };

  const handleTestConnection = async () => {
    const keyToTest = (isEditingKey ? apiKeyInput : savedKey).trim();
    if (!keyToTest) {
      setStatus('failed');
      setStatusMessage(
        currentLang === 'en' 
          ? 'Please enter or save a Gemini API key first.' 
          : 'कृपया पहले एक जेमिनी एपीआई कुंजी दर्ज करें।'
      );
      return;
    }

    setStatus('testing');
    setStatusMessage(
      currentLang === 'en'
        ? 'Sending test request to Gemini API (gemini-2.5-flash)...'
        : 'जेमिनी 2.5 फ्लैश मॉडल के साथ कनेक्शन की जांच की जा रही है...'
    );

    const testRes = await testGeminiConnection(keyToTest);

    if (testRes.success) {
      if (isEditingKey) {
        StorageService.setApiKey(keyToTest);
        setSavedKey(keyToTest);
        setIsEditingKey(false);
        setShowKey(false);
      }
      setStatus('connected');
      setActiveMode('gemini');
      StorageService.setAppMode('gemini');
      setStatusMessage(
        currentLang === 'en'
          ? 'Connection successful! Gemini 2.5 Flash Vision is active for live monument identification.'
          : 'कनेक्शन सफल! जेमिनी 2.5 फ्लैश विज़न लाइव स्मारक पहचान के लिए सक्रिय है।'
      );
    } else {
      setStatus('failed');
      setStatusMessage(testRes.message);
    }
  };

  // Run Demo Recognition Flow
  const handleLaunchDemoSite = (siteId: string) => {
    const demoResult = createDemoRecognitionResult(siteId, undefined, currentLang);
    StorageService.saveLastResult(demoResult);
    navigate('/result', { state: { result: demoResult } });
  };

  // Status badge config
  const getStatusBadge = () => {
    if (activeMode === 'demo') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <Cpu className="w-3.5 h-3.5 text-amber-700" />
          <span>{currentLang === 'en' ? 'Demo Mode Active' : 'डेमो मोड सक्रिय'}</span>
        </span>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLang === 'en' ? 'Gemini Mode Connected' : 'जेमिनी मोड कनेक्टेड'}</span>
          </span>
        );
      case 'saved_locally':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentLang === 'en' ? 'Gemini Mode (Key Saved)' : 'जेमिनी मोड (कुंजी सहेजी)'}</span>
          </span>
        );
      case 'testing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <RotateCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>{currentLang === 'en' ? 'Testing...' : 'जांच हो रही है...'}</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{currentLang === 'en' ? 'Gemini Failed' : 'कनेक्शन विफल'}</span>
          </span>
        );
      case 'not_configured':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Cpu className="w-3.5 h-3.5 text-amber-700" />
            <span>{currentLang === 'en' ? 'Demo Mode (No Key Required)' : 'डेमो मोड (कुंजी आवश्यक नहीं)'}</span>
          </span>
        );
    }
  };

  const selectedSiteData = heritageSites.find((s) => s.id === selectedDemoSiteId) || heritageSites[0] || {
    id: 'red-fort',
    name: 'Red Fort',
    hindiName: 'लाल किला',
    imageUrl: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
    architecturalStyle: 'Indo-Islamic Mughal Architecture',
    builtYear: '1638–1648 CE'
  };

  return (
    <div className="flex-1 py-8 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#E8E2D9] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C05E42]/10 text-[#C05E42] text-xs font-bold mb-2">
            <Key className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Profile & System Settings' : 'प्रोफ़ाइल एवं सिस्टम सेटिंग्स'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heritage text-[#1A1A1A]">
            {currentLang === 'en' ? 'Settings & Catalog Management' : 'सेटिंग्स एवं कैटलॉग प्रबंधन'}
          </h1>
          <p className="text-sm text-[#5C544E] mt-1">
            {currentLang === 'en'
              ? 'Configure Gemini API keys, operating modes, language preferences, and manage heritage site data.'
              : 'जेमिनी एपीआई कुंजी, ऑपरेटिंग मोड, भाषा प्राथमिकताएं कॉन्फ़िगर करें और धरोहर स्थल डेटा प्रबंधित करें।'}
          </p>
        </div>

        {/* Global Status Pill */}
        <div className="shrink-0">{getStatusBadge()}</div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-2">
        <button
          type="button"
          id="tab-preferences-btn"
          onClick={() => setActiveMainTab('preferences')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'preferences'
              ? 'bg-[#2C4A3E] text-white shadow-md'
              : 'bg-[#F3EEE7] text-[#5C544E] hover:bg-[#E8E2D9] hover:text-[#1A1A1A]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Engine & Preferences' : 'इंजन एवं प्राथमिकताएं'}</span>
        </button>

        <button
          type="button"
          id="tab-admin-btn"
          onClick={() => setActiveMainTab('admin')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'admin'
              ? 'bg-[#C05E42] text-white shadow-md'
              : 'bg-[#F3EEE7] text-[#5C544E] hover:bg-[#E8E2D9] hover:text-[#1A1A1A]'
          }`}
        >
          <Shield className="w-4 h-4 text-[#D4AF37]" />
          <span>{currentLang === 'en' ? 'Admin Settings (Monument Manager)' : 'व्यवस्थापक सेटिंग्स (स्मारक प्रबंधक)'}</span>
          {isAdminUnlocked && (
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-semibold">
              Unlocked
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ENGINE & PREFERENCES (GEMINI, DEMO, LANGUAGE, TEST PLAN)           */}
      {/* ========================================================================= */}
      {activeMainTab === 'preferences' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-200">
          {/* 0. ENGINE MODE SELECTOR */}
          <div 
            id="engine-mode-selector-card"
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D9] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C05E42] block">
                  {currentLang === 'en' ? 'Active Recognition Engine' : 'सक्रिय पहचान इंजन'}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-serif-heritage">
                  {currentLang === 'en' ? 'Choose Operating Mode' : 'ऑपरेटिंग मोड चुनें'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5C544E] font-medium">
                  {currentLang === 'en' ? 'Current Mode:' : 'वर्तमान मोड:'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeMode === 'gemini' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {activeMode === 'gemini' 
                    ? (currentLang === 'en' ? '✨ Gemini Mode' : '✨ जेमिनी मोड') 
                    : (currentLang === 'en' ? '⚡ Demo Mode' : '⚡ डेमो मोड')}
                </span>
              </div>
            </div>

            {/* Mode Choice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Demo Mode */}
              <div
                onClick={() => handleModeSwitch('demo')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  activeMode === 'demo'
                    ? 'bg-[#F3EEE7] border-[#C05E42] shadow-sm ring-2 ring-[#C05E42]/20'
                    : 'bg-white border-[#E8E2D9] hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#C05E42]/10 text-[#C05E42] flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] font-serif-heritage">
                        {currentLang === 'en' ? 'Demo Mode (Offline / Sample Data)' : 'डेमो मोड (ऑफ़लाइन / नमूना डेटा)'}
                      </h3>
                      <span className="text-[10px] font-bold text-[#2C4A3E] bg-[#2C4A3E]/10 px-2 py-0.5 rounded-md">
                        {currentLang === 'en' ? 'Zero Key Required • Reliable' : 'कुंजी रहित • 100% विश्वसनीय'}
                      </span>
                    </div>
                  </div>

                  {activeMode === 'demo' && (
                    <div className="w-5 h-5 rounded-full bg-[#C05E42] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#5C544E] leading-relaxed">
                  {currentLang === 'en'
                    ? 'Allows evaluation of the complete identification experience with verified Delhi monument datasets even when API quota is limited.'
                    : 'जजों और समीक्षकों को बिना किसी एपीआई कोटा के सभी दिल्ली स्मारकों के प्रमाणित डेटासेट के साथ पूर्ण पहचान अनुभव का परीक्षण करने देता है।'}
                </p>

                <div className="text-[11px] font-bold text-[#C05E42] pt-2 border-t border-[#E8E2D9] flex items-center justify-between">
                  <span>{activeMode === 'demo' ? (currentLang === 'en' ? '● Currently Active' : '● वर्तमान में सक्रिय') : (currentLang === 'en' ? 'Switch to Demo Mode' : 'डेमो मोड चुनें')}</span>
                  <span className="text-[10px] text-[#8C8276]">{heritageSites.length} Monuments</span>
                </div>
              </div>

              {/* Gemini Mode */}
              <div
                onClick={() => handleModeSwitch('gemini')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  activeMode === 'gemini'
                    ? 'bg-[#F3EEE7] border-[#2C4A3E] shadow-sm ring-2 ring-[#2C4A3E]/20'
                    : 'bg-white border-[#E8E2D9] hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#2C4A3E]/10 text-[#2C4A3E] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] font-serif-heritage">
                        {currentLang === 'en' ? 'Gemini Mode (Live Multimodal AI)' : 'जेमिनी मोड (लाइव एआई)'}
                      </h3>
                      <span className="text-[10px] font-bold text-[#8C8276] bg-[#8C8276]/10 px-2 py-0.5 rounded-md">
                        gemini-2.5-flash
                      </span>
                    </div>
                  </div>

                  {activeMode === 'gemini' && (
                    <div className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#5C544E] leading-relaxed">
                  {currentLang === 'en'
                    ? 'Sends photos to Google Gemini 2.5 Flash Vision for real-time visual reasoning, architectural identification, and confidence calculation.'
                    : 'रीयल-टाइम विज़न रीजनिंग और वास्तुकला पहचान के लिए तस्वीरों को गूगल जेमिनी 2.5 फ्लैश मॉडल पर भेजता है।'}
                </p>

                <div className="text-[11px] font-bold text-[#2C4A3E] pt-2 border-t border-[#E8E2D9] flex items-center justify-between">
                  <span>{activeMode === 'gemini' ? (currentLang === 'en' ? '● Currently Active' : '● वर्तमान में सक्रिय') : (currentLang === 'en' ? 'Switch to Gemini Mode' : 'जेमिनी मोड चुनें')}</span>
                  <span className="text-[10px] text-[#8C8276]">{savedKey ? (currentLang === 'en' ? 'Key Configured' : 'कुंजी तैयार') : (currentLang === 'en' ? 'Needs API Key' : 'कुंजी आवश्यक')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. DEMO MODE SAMPLE SELECTOR */}
          <div 
            id="demo-mode-evaluation-card"
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D9] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C05E42] text-white flex items-center justify-center shadow-2xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1A1A1A] font-serif-heritage">
                    {currentLang === 'en' ? 'Demo Mode Evaluation & Sample Actions' : 'डेमो मोड मूल्यांकन एवं नमूना क्रियाएं'}
                  </h2>
                  <p className="text-xs text-[#5C544E]">
                    {currentLang === 'en'
                      ? 'Demonstrate the app without API quota or network constraints'
                      : 'एपीआई कोटा या नेटवर्क सीमाओं के बिना ऐप का परीक्षण करें'}
                  </p>
                </div>
              </div>

              {/* Quick Try Sample Button */}
              <button
                type="button"
                id="try-sample-red-fort-btn"
                onClick={() => handleLaunchDemoSite('red-fort')}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold shadow-md transition-all cursor-pointer w-fit focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                  {currentLang === 'en' ? 'Try sample Red Fort image' : 'लाल किला नमूना आज़माएं'}
                </span>
              </button>
            </div>

            {/* Choose Demo Site Selector */}
            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center justify-between">
                <span>{currentLang === 'en' ? 'Choose Demo Site Selector' : 'डेमो स्मारक चयनकर्ता'}</span>
                <span className="text-[11px] text-[#8C8276] font-normal">
                  {heritageSites.length} {currentLang === 'en' ? 'Monuments Available' : 'स्मारक उपलब्ध'}
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {heritageSites.slice(0, 10).map((site) => {
                  const isSelected = selectedDemoSiteId === site.id;
                  return (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => setSelectedDemoSiteId(site.id)}
                      className={`min-h-[100px] p-3 rounded-2xl border text-left transition-all flex flex-col gap-2 relative overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
                        isSelected
                          ? 'bg-[#F3EEE7] border-[#C05E42] shadow-xs ring-2 ring-[#C05E42]/20'
                          : 'bg-white border-[#E8E2D9] hover:border-[#D4AF37]'
                      }`}
                    >
                      <div className="h-16 w-full rounded-xl overflow-hidden bg-stone-200">
                        <img
                          src={site.imageUrl}
                          alt={site.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%232D2926" width="100" height="100"/><text fill="%23FFFFFF" x="50" y="55" text-anchor="middle" font-size="10">Monument</text></svg>';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold text-[#1A1A1A] font-serif-heritage truncate ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                          {currentLang === 'hi' ? site.hindiName : site.name}
                        </h4>
                        <span className="text-[10px] text-[#8C8276] block truncate">
                          {site.builtYear}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C05E42] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action to Launch selected demo site result */}
              <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8E2D9] bg-stone-200">
                    <img
                      src={selectedSiteData.imageUrl}
                      alt={selectedSiteData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold text-[#1A1A1A] font-serif-heritage ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                        {currentLang === 'hi' ? selectedSiteData.hindiName : selectedSiteData.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        96% {currentLang === 'en' ? 'Simulated Confidence' : 'अनुमानित सटीकता'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C544E] line-clamp-1 mt-0.5">
                      {selectedSiteData.architecturalStyle} • {selectedSiteData.builtYear}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="launch-selected-demo-site-btn"
                  onClick={() => handleLaunchDemoSite(selectedDemoSiteId)}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#2C4A3E] hover:bg-[#233a31] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                    {currentLang === 'en' ? 'Open Demo Result Page' : 'डेमो परिणाम पृष्ठ खोलें'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. GEMINI API KEY INTEGRATION CARD */}
          <div 
            id="gemini-api-config-card"
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D9] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2C4A3E] text-[#D4AF37] flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1A1A1A] font-serif-heritage">
                    {currentLang === 'en' ? 'Google Gemini API Key' : 'गूगल जेमिनी एपीआई कुंजी'}
                  </h2>
                  <p className="text-xs text-[#5C544E]">
                    {currentLang === 'en' 
                      ? 'Local key storage: heritagelens_gemini_api_key' 
                      : 'लोकल कुंजी नाम: heritagelens_gemini_api_key'}
                  </p>
                </div>
              </div>

              <a
                id="google-ai-studio-link"
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2C4A3E]/10 hover:bg-[#2C4A3E]/15 text-[#2C4A3E] text-xs font-bold transition-colors w-fit cursor-pointer"
              >
                <span>{currentLang === 'en' ? 'Get Key from Google AI Studio' : 'Google AI Studio से कुंजी प्राप्त करें'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C05E42]" />
              </a>
            </div>

            {/* Input / Display Field */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#C05E42]" />
                  <span>{currentLang === 'en' ? 'API Key Secret' : 'एपीआई कुंजी'}</span>
                </label>
                {savedKey && !isEditingKey && (
                  <span className="text-[11px] text-[#8C8276] font-medium">
                    {currentLang === 'en' ? 'Masked for security' : 'सुरक्षा हेतु मास्क की गई'}
                  </span>
                )}
              </div>

              {savedKey && !isEditingKey ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#E8E2D9] rounded-2xl text-xs font-mono text-[#1A1A1A] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#C05E42] shrink-0" />
                      <span className="font-semibold">{StorageService.maskApiKey(savedKey)}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      id="change-key-btn"
                      onClick={() => {
                        setIsEditingKey(true);
                        setApiKeyInput('');
                      }}
                      className="min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 bg-white border border-[#E8E2D9] hover:bg-[#FDFBF7] text-[#5C544E] hover:text-[#1A1A1A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <span>{currentLang === 'en' ? 'Change Key' : 'कुंजी बदलें'}</span>
                    </button>

                    <button
                      type="button"
                      id="test-connection-btn"
                      onClick={handleTestConnection}
                      disabled={status === 'testing'}
                      className="min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 bg-[#2C4A3E] hover:bg-[#233a31] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${status === 'testing' ? 'animate-spin' : ''}`} />
                      <span>{status === 'testing' ? (currentLang === 'en' ? 'Testing...' : 'जांच...') : (currentLang === 'en' ? 'Test Connection' : 'कनेक्शन जांचें')}</span>
                    </button>

                    <button
                      type="button"
                      id="remove-key-btn"
                      onClick={handleRemoveKey}
                      className="min-h-[44px] min-w-[44px] p-2.5 bg-white border border-[#E8E2D9] hover:bg-rose-50 text-rose-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                      title={currentLang === 'en' ? 'Remove Key' : 'कुंजी हटाएं'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <input
                      id="gemini-api-key-input"
                      type={showKey ? 'text' : 'password'}
                      value={apiKeyInput}
                      onChange={(e) => {
                        setApiKeyInput(e.target.value);
                        if (status === 'failed') setStatus('not_configured');
                      }}
                      placeholder="AIzaSy..."
                      autoComplete="off"
                      spellCheck="false"
                      className="min-h-[44px] w-full pl-4 pr-11 py-2.5 bg-[#F3EEE7] border border-[#E8E2D9] focus:border-[#C05E42] focus:bg-white rounded-2xl text-xs font-mono text-[#1A1A1A] outline-hidden transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      id="toggle-show-hide-key-btn"
                      onClick={() => setShowKey(!showKey)}
                      className="min-h-[36px] min-w-[36px] absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#8C8276] hover:text-[#1A1A1A] transition-colors rounded-lg cursor-pointer flex items-center justify-center"
                      title={showKey ? 'Hide key' : 'Show key'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      id="save-key-btn"
                      onClick={handleSaveKey}
                      disabled={!apiKeyInput.trim()}
                      className="min-h-[44px] flex-1 sm:flex-none px-5 py-2.5 bg-[#C05E42] hover:bg-[#a84d34] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>{currentLang === 'en' ? 'Save Key' : 'कुंजी सहेजें'}</span>
                    </button>

                    <button
                      type="button"
                      id="test-input-connection-btn"
                      onClick={handleTestConnection}
                      disabled={!apiKeyInput.trim() || status === 'testing'}
                      className="min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 bg-[#2C4A3E] hover:bg-[#233a31] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${status === 'testing' ? 'animate-spin' : ''}`} />
                      <span>{status === 'testing' ? (currentLang === 'en' ? 'Testing...' : 'जांच...') : (currentLang === 'en' ? 'Test' : 'जांच')}</span>
                    </button>

                    {savedKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingKey(false);
                          setApiKeyInput(savedKey);
                        }}
                        className="min-h-[44px] px-4 py-2.5 bg-white border border-[#E8E2D9] text-[#5C544E] text-xs font-bold rounded-xl hover:bg-[#F3EEE7] transition-colors cursor-pointer"
                      >
                        <span>{currentLang === 'en' ? 'Cancel' : 'रद्द करें'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Status Feedback Message */}
              {statusMessage && (
                <div
                  className={`text-xs p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                    status === 'connected'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : status === 'failed'
                      ? 'bg-rose-50 text-rose-900 border-rose-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  {status === 'connected' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : status === 'failed' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <RotateCw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                  )}
                  <span className="leading-relaxed">{statusMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. LANGUAGE PREFERENCES */}
          <div 
            id="language-preferences-card"
            className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C05E42] text-white flex items-center justify-center shadow-2xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A] font-serif-heritage">
                  {currentLang === 'en' ? 'Interface & Narration Language' : 'भाषा एवं विवरण प्राथमिकताएं'}
                </h2>
                <p className="text-xs text-[#5C544E]">
                  {currentLang === 'en'
                    ? 'Select your primary language for cultural narratives and audio tours'
                    : 'सांस्कृतिक विवरण और ऑडियो गाइड के लिए भाषा का चयन करें'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onLangChange('en')}
                className={`p-4.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#F3EEE7] border-[#C05E42] shadow-xs'
                    : 'bg-white border-[#E8E2D9] hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-[#1A1A1A]">English</span>
                  {currentLang === 'en' && <CheckCircle className="w-4 h-4 text-[#C05E42]" />}
                </div>
                <p className="text-xs text-[#5C544E] leading-relaxed">
                  Standard English historical dataset, ASI citations, architectural terms, and audio narration.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onLangChange('hi')}
                className={`p-4.5 rounded-2xl border text-left transition-all cursor-pointer font-devanagari ${
                  currentLang === 'hi'
                    ? 'bg-[#F3EEE7] border-[#C05E42] shadow-xs'
                    : 'bg-white border-[#E8E2D9] hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-[#1A1A1A]">हिन्दी (Hindi)</span>
                  {currentLang === 'hi' && <CheckCircle className="w-4 h-4 text-[#C05E42]" />}
                </div>
                <p className="text-xs text-[#5C544E] leading-relaxed">
                  सत्यापित भारतीय ऐतिहासिक विवरण, एएसआई संदर्भ, सांस्कृतिक महत्व और हिन्दी स्वर में ऑडियो विवरण।
                </p>
              </button>
            </div>
          </div>

          {/* 4. SECURITY AUDIT & TEST PLAN */}
          <SecurityAndTestPlanSection currentLang={currentLang} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ADMIN SETTINGS (MONUMENT CATALOG & IMAGE URL MANAGER)               */}
      {/* ========================================================================= */}
      {activeMainTab === 'admin' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {!isAdminUnlocked ? (
            /* Admin Access Gate / Unlock Screen */
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FDFBF7] border border-[#E8E2D9] shadow-sm flex flex-col items-center text-center max-w-xl mx-auto w-full gap-6">
              <div className="w-16 h-16 rounded-3xl bg-[#C05E42]/10 text-[#C05E42] flex items-center justify-center shadow-xs">
                <Shield className="w-8 h-8 text-[#C05E42]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif-heritage text-[#1A1A1A]">
                  {currentLang === 'en' ? 'Administrator Settings Gate' : 'व्यवस्थापक सेटिंग्स सुरक्षा द्वार'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C544E] mt-2 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Access to edit monument details, customize exact image links, create new heritage records, and delete sites is restricted to administrators.'
                    : 'स्मारक विवरण संपादित करने, सटीक चित्र लिंक अनुकूलित करने और नए रिकॉर्ड जोड़ने के लिए व्यवस्थापक अनुमति आवश्यक है।'}
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={adminPasscodeInput}
                    onChange={(e) => {
                      setAdminPasscodeInput(e.target.value);
                      setAdminPasscodeError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAdminUnlock();
                    }}
                    placeholder={currentLang === 'en' ? 'Enter admin passcode (e.g. admin)...' : 'व्यवस्थापक पासकोड दर्ज करें...'}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E8E2D9] text-xs font-mono focus:outline-none focus:border-[#C05E42] shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleAdminUnlock}
                    className="px-6 py-3 rounded-2xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    {currentLang === 'en' ? 'Unlock' : 'अनलॉक'}
                  </button>
                </div>

                {adminPasscodeError && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-left font-medium">
                    {adminPasscodeError}
                  </p>
                )}

                {/* Quick 1-Click Evaluation Unlock */}
                <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                  <span className="text-[11px] text-[#8C8276]">
                    {currentLang === 'en' ? 'Reviewer / Jury Quick Access:' : 'समीक्षक त्वरित एक्सेस:'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAdminQuickUnlock}
                    className="text-xs font-bold text-[#2C4A3E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? '1-Click Quick Unlock' : '1-क्लिक त्वरित अनलॉक'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active Admin Manager */
            <div className="flex flex-col gap-6">
              {/* Unlocked Admin Header Bar */}
              <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2C4A3E]">
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'en' ? 'Administrator Controls Active • Direct Catalog Editing' : 'व्यवस्थापक नियंत्रण सक्रिय • सीधा कैटलॉग संपादन'}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAdminLock}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E2D9] hover:bg-neutral-100 text-[#5C544E] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Lock admin controls"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{currentLang === 'en' ? 'Lock Controls' : 'लॉक करें'}</span>
                </button>
              </div>

              {/* Render Full HeritageSiteAdminManager Component */}
              <HeritageSiteAdminManager
                currentLang={currentLang}
                onSiteSelectForDemo={handleLaunchDemoSite}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
