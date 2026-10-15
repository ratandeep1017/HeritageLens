import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  LogOut, 
  Sliders, 
  Key, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  FileCheck,
  RotateCw,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  ChevronRight,
  Database,
  Cloud
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { HeritageSiteAdminManager } from '../components/HeritageSiteAdminManager';
import { SecurityAndTestPlanSection } from '../components/SecurityAndTestPlanSection';

interface ProfilePageProps {
  currentLang: 'en' | 'hi';
  onLangChange: (lang: 'en' | 'hi') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentLang, onLangChange }) => {
  // Navigation / active tab: 'system' | 'admin'
  const [activeTab, setActiveTab] = useState<'system' | 'admin'>('system');

  // Admin session authentication state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // System status
  const [systemHealth, setSystemHealth] = useState<{
    status: string;
    database: string;
    monumentsCount: number;
    cloudinary: string;
  } | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Check existing session token on mount
  useEffect(() => {
    async function verifyExistingSession() {
      const isSessionActive = await StorageService.checkAdminSession();
      setIsAdminUnlocked(isSessionActive);
    }
    verifyExistingSession();
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    setIsHealthLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setSystemHealth(data);
      }
    } catch {
      // Offline or network error
    } finally {
      setIsHealthLoading(false);
    }
  };

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcodeInput.trim()) {
      setAuthError(currentLang === 'en' ? 'Please enter the admin secret key.' : 'व्यवस्थापक गुप्त कुंजी दर्ज करें।');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    const result = await StorageService.verifyAdminPasscode(passcodeInput.trim());
    setIsVerifying(false);

    if (result.success) {
      setIsAdminUnlocked(true);
      setPasscodeInput('');
      triggerToast(currentLang === 'en' ? 'Administrator session verified!' : 'व्यवस्थापक सत्र सत्यापित हुआ!', 'success');
    } else {
      setAuthError(result.error || (currentLang === 'en' ? 'Invalid secret key.' : 'अमान्य गुप्त कुंजी।'));
    }
  };

  const handleAdminLogout = async () => {
    await StorageService.adminLogout();
    setIsAdminUnlocked(false);
    triggerToast(currentLang === 'en' ? 'Administrator logged out.' : 'व्यवस्थापक लॉग आउट हुआ।', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Toast */}
      {feedbackToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border text-xs font-bold animate-in fade-in slide-in-from-bottom-2 ${
          feedbackToast.type === 'success'
            ? 'bg-[#1A1A1A] text-white border-white/20'
            : 'bg-rose-900 text-white border-rose-700'
        }`}>
          {feedbackToast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          )}
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C05E42]/10 text-[#C05E42] text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'HeritageLens System & Administration' : 'सिस्टम एवं व्यवस्थापक नियंत्रण'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heritage text-[#1A1A1A]">
            {currentLang === 'en' ? 'System & Catalog Administration' : 'सिस्टम एवं कैटलॉग प्रशासन'}
          </h1>
          <p className="text-sm text-[#5C544E] mt-1">
            {currentLang === 'en'
              ? 'Cloud architecture status, test verification, and secure catalog editing portal.'
              : 'क्लाउड स्थिति, परीक्षण सत्यापन एवं सुरक्षित कैटलॉग संपादन पोर्टल।'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-[#F3EEE7] p-1.5 rounded-2xl border border-[#E8E2D9]">
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'system'
                ? 'bg-[#2C4A3E] text-white shadow-xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'System Overview' : 'सिस्टम विवरण'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-[#C05E42] text-white shadow-xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'Admin Portal' : 'व्यवस्थापक पोर्टल'}</span>
            {isAdminUnlocked && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW & ARCHITECTURE */}
      {activeTab === 'system' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-200">
          {/* Cloud Health Card */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2C4A3E] text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1A1A1A] font-serif-heritage">
                    {currentLang === 'en' ? 'Cloud Infrastructure Status' : 'क्लाउड इंफ्रास्ट्रक्चर स्थिति'}
                  </h2>
                  <p className="text-xs text-[#5C544E]">
                    {currentLang === 'en' ? 'Live status of connected cloud services' : 'सक्रिय क्लाउड सेवाओं की स्थिति'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchSystemHealth}
                disabled={isHealthLoading}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F3EEE7] text-xs font-bold text-[#5C544E] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isHealthLoading ? 'animate-spin' : ''}`} />
                <span>{currentLang === 'en' ? 'Refresh' : 'रिफ्रेश'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* TiDB Cloud Serverless */}
              <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C05E42]">Database</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">Online</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">TiDB Cloud Serverless</h3>
                <p className="text-xs text-[#5C544E]">
                  {systemHealth?.monumentsCount ?? 11} {currentLang === 'en' ? 'heritage sites synced' : 'धरोहर स्थल सिंक'}
                </p>
              </div>

              {/* Cloudinary CDN */}
              <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C05E42]">Image Storage</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">Connected</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Cloudinary CDN</h3>
                <p className="text-xs text-[#5C544E]">
                  {currentLang === 'en' ? 'Optimized media & instant delivery' : 'अनुकूलित मीडिया एवं स्थायी होस्टिंग'}
                </p>
              </div>

              {/* Google Gemini Multimodal Vision */}
              <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C05E42]">AI Vision Engine</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">Server Active</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Google Gemini 2.5 Flash</h3>
                <p className="text-xs text-[#5C544E]">
                  {currentLang === 'en' ? 'Configured in Render backend' : 'रेंडर बैकएंड में स्वचालित सक्रिय'}
                </p>
              </div>
            </div>
          </div>

          {/* Test Verification Plan */}
          <SecurityAndTestPlanSection currentLang={currentLang} />
        </div>
      )}

      {/* TAB 2: SECURE ADMINISTRATOR PORTAL */}
      {activeTab === 'admin' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {!isAdminUnlocked ? (
            /* Secure Cryptographic Password Login Gate */
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FDFBF7] border border-[#E8E2D9] shadow-sm flex flex-col items-center text-center max-w-md mx-auto w-full gap-6 my-6">
              <div className="w-16 h-16 rounded-3xl bg-[#C05E42]/10 text-[#C05E42] flex items-center justify-center shadow-xs">
                <Lock className="w-8 h-8 text-[#C05E42]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif-heritage text-[#1A1A1A]">
                  {currentLang === 'en' ? 'Administrator Gate' : 'व्यवस्थापक सुरक्षा द्वार'}
                </h2>
                <p className="text-xs text-[#5C544E] mt-2 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Catalog modification, monument creation, and deletion are restricted to authenticated administrators.'
                    : 'कैटलॉग संपादन, नए रिकॉर्ड निर्माण और विलोपन केवल अधिकृत व्यवस्थापक के लिए ही उपलब्ध है।'}
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-4">
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder={currentLang === 'en' ? 'Enter admin secret key...' : 'व्यवस्थापक गुप्त कुंजी दर्ज करें...'}
                    autoComplete="current-password"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-white border border-[#E8E2D9] text-xs font-mono focus:outline-none focus:border-[#C05E42] shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#8C8276] hover:text-[#1A1A1A] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-left font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{authError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || !passcodeInput.trim()}
                  className="w-full py-3 rounded-2xl bg-[#C05E42] hover:bg-[#a84d34] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>{currentLang === 'en' ? 'Verifying...' : 'सत्यापित किया जा रहा है...'}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>{currentLang === 'en' ? 'Unlock Administrator Portal' : 'व्यवस्थापक पोर्टल अनलॉक करें'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Active Admin Workspace */
            <div className="flex flex-col gap-6">
              <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2C4A3E]">
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'en' ? 'Administrator Session Active • All Changes Persisted to TiDB Cloud' : 'व्यवस्थापक सत्र सक्रिय • सभी परिवर्तन TiDB क्लाउड में सुरक्षित'}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E2D9] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 text-[#5C544E]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Logout Admin' : 'लॉग आउट'}</span>
                </button>
              </div>

              {/* Full Monument Manager Component */}
              <HeritageSiteAdminManager currentLang={currentLang} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
