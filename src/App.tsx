import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Agentation } from 'agentation';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ResultPage } from './pages/ResultPage';
import { ProfilePage } from './pages/ProfilePage';
import { InstallAppBanner } from './components/InstallAppBanner';
import { StorageService } from './services/storage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLang = StorageService.getPreferredLanguage();
    if (savedLang) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleLangChange = (lang: 'en' | 'hi') => {
    setCurrentLang(lang);
    StorageService.setPreferredLanguage(lang);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] flex flex-col font-sans selection:bg-[#C05E42]/20 selection:text-[#C05E42]">
        {/* Navigation */}
        <Navbar currentLang={currentLang} onLangChange={handleLangChange} />

        {/* Dynamic Route Pages */}
        <main className="flex-1 flex flex-col pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage currentLang={currentLang} />} />
            <Route path="/explore" element={<ExplorePage currentLang={currentLang} onLangChange={handleLangChange} />} />
            <Route path="/result" element={<ResultPage currentLang={currentLang} />} />
            <Route path="/profile" element={<ProfilePage currentLang={currentLang} onLangChange={handleLangChange} />} />
            <Route path="*" element={<HomePage currentLang={currentLang} />} />
          </Routes>
        </main>

        {/* Smartphone PWA Install Banner */}
        <InstallAppBanner currentLang={currentLang} />

        {/* Cultural Footer */}
        <Footer currentLang={currentLang} onLangChange={handleLangChange} />

        {/* Agentation Visual Feedback (Development Mode Only) */}
        {import.meta.env.DEV && (
          <Agentation
            endpoint="http://localhost:4747"
            copyToClipboard={true}
            onSessionCreated={(sessionId) => {
              console.log('[Agentation] Session created:', sessionId);
            }}
            onCopy={(markdown) => {
              console.log('[Agentation] Copied annotations to clipboard:\n', markdown);
              // Fallback clipboard write to handle browser permission restrictions
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(markdown).catch(() => {
                  const textArea = document.createElement('textarea');
                  textArea.value = markdown;
                  textArea.style.position = 'fixed';
                  textArea.style.opacity = '0';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  try {
                    document.execCommand('copy');
                  } catch (err) {
                    console.error('[Agentation] Fallback copy failed:', err);
                  }
                  document.body.removeChild(textArea);
                });
              }
            }}
            onSubmit={(output, annotations) => {
              console.log('[Agentation] Submitted annotations for agent:\n', output, annotations);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}
