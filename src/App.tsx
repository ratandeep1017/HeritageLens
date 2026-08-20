import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
      </div>
    </BrowserRouter>
  );
}
