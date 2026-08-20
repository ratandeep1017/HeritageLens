import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, Sparkles, Check } from 'lucide-react';

interface InstallAppBannerProps {
  currentLang: 'en' | 'hi';
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ currentLang }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already installed / running in standalone mode
    const isRunningStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // Check if previously dismissed in this session
    const dismissed = sessionStorage.getItem('heritagelens_pwa_dismissed');
    if (dismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for Android beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On mobile devices, show prompt after a short delay
    const timer = setTimeout(() => {
      if (!isRunningStandalone && !sessionStorage.getItem('heritagelens_pwa_dismissed')) {
        setIsVisible(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('heritagelens_pwa_dismissed', 'true');
  };

  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Mobile Install App Banner */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="bg-[#1C3229] border border-[#D4AF37]/40 text-white rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#2C4A3E] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0 shadow-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    {currentLang === 'en' ? 'Mobile App Available' : 'मोबाइल ऐप उपलब्ध'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold font-serif-heritage text-white">
                  {currentLang === 'en' ? 'Install HeritageLens on Phone' : 'फोन पर हेरिटेज लेंस इंस्टॉल करें'}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 text-white/60 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            {currentLang === 'en'
              ? 'Get instant full-screen camera scanning, offline audio stories, and zero lag on your smartphone.'
              : 'फुल-स्क्रीन कैमरा स्कैनर, ऑडियो कहानियां और बिना रुकावट अनुभव अपने फोन पर पाएं।'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              id="install-pwa-button"
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Install App' : 'ऐप इंस्टॉल करें'}</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {currentLang === 'en' ? 'Not Now' : 'बाद में'}
            </button>
          </div>
        </div>
      </div>

      {/* iOS Step-by-Step Install Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#1A1A1A] border border-[#E8E2D9] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
              <h3 className="text-base font-bold font-serif-heritage text-[#1A1A1A]">
                {currentLang === 'en' ? 'Install on iPhone / iPad' : 'iPhone पर इंस्टॉल करें'}
              </h3>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg text-[#8C8276] hover:text-[#1A1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="text-xs space-y-3 text-[#5C544E]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                <div>
                  {currentLang === 'en' ? 'Tap the ' : 'सफारी ब्राउज़र में '}
                  <strong className="text-[#1A1A1A] inline-flex items-center gap-1 font-semibold">
                    <Share className="w-3.5 h-3.5 text-[#C05E42]" /> Share button
                  </strong>
                  {currentLang === 'en' ? ' at the bottom of Safari.' : ' बटन पर टैप करें।'}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                <div>
                  {currentLang === 'en' ? 'Scroll down and select ' : 'नीचे स्क्रॉल करें और '}
                  <strong className="text-[#1A1A1A] inline-flex items-center gap-1 font-semibold">
                    <PlusSquare className="w-3.5 h-3.5 text-[#C05E42]" /> Add to Home Screen
                  </strong>.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                <div>
                  {currentLang === 'en' ? 'Tap ' : 'ऊपर दाईं ओर '}
                  <strong className="text-[#1A1A1A] font-semibold">Add</strong>
                  {currentLang === 'en' ? ' in the top right corner.' : ' पर टैप करें।'}
                </div>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#2C4A3E] text-white text-xs font-bold shadow-sm"
            >
              {currentLang === 'en' ? 'Got It' : 'समझ गया'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
