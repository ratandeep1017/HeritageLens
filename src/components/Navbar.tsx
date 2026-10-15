import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Key, Compass, Home, Sparkles, Menu, X, Landmark, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storage';

interface NavbarProps {
  currentLang: 'en' | 'hi';
  onLangChange: (lang: 'en' | 'hi') => void;
}

interface NavLinkItem {
  to: string;
  labelEn: string;
  labelHi: string;
  icon: React.ComponentType<{ className?: string }>;
  id: string;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLangChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const hasApiKey = Boolean(StorageService.getApiKey());
  const isDemoMode = StorageService.isDemoMode();

  const navLinks: NavLinkItem[] = [
    {
      to: '/',
      labelEn: 'Home',
      labelHi: 'होम',
      icon: Home,
      id: 'nav-home'
    },
    {
      to: '/explore',
      labelEn: 'Explore',
      labelHi: 'अन्वेषण',
      icon: Compass,
      id: 'nav-explore'
    },
    {
      to: '/profile',
      labelEn: 'Admin Portal',
      labelHi: 'प्रशासन',
      icon: ShieldCheck,
      id: 'nav-profile'
    }
  ];

  return (
    <>
      {/* Sticky Top Header */}
      <header className="border-b border-[#E8E2D9] bg-[#FDFBF7]/95 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2">
          {/* Heritage-Inspired Brand Logo */}
          <Link
            to="/"
            id="brand-logo-link"
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:ring-2 focus-visible:ring-[#C05E42] focus-visible:ring-offset-2 rounded-xl p-1 shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#C05E42] rounded-xl flex items-center justify-center shadow-md group-hover:bg-[#a84d34] group-hover:scale-105 transition-all duration-200 shrink-0">
              {/* Heritage Mandala/Jharokha Geometric Mark */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-[#FDFBF7] rotate-45 rounded-xs transition-transform duration-300 group-hover:rotate-90"></div>
                <div className="absolute w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-xs"></div>
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-2xl font-bold tracking-tight font-serif-heritage text-[#1A1A1A] block leading-tight truncate">
                HeritageLens <span className="text-[#C05E42]">AI</span>
              </span>
              <p className="text-[10px] text-[#8C8276] font-semibold tracking-wider uppercase flex items-center gap-1 leading-none mt-0.5">
                <span className="truncate">{currentLang === 'en' ? "India's Cultural Lens" : 'भारतीय धरोहर'}</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#5C544E]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  id={link.id}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 py-2 px-1 transition-all relative focus-visible:ring-2 focus-visible:ring-[#C05E42] rounded-lg ${
                      isActive
                        ? 'text-[#C05E42] font-extrabold'
                        : 'text-[#5C544E] hover:text-[#1A1A1A]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={currentLang === 'hi' ? 'font-devanagari text-sm font-semibold' : ''}>
                    {currentLang === 'en' ? link.labelEn : link.labelHi}
                  </span>
                  {link.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#C05E42]/10 text-[#C05E42] border border-[#C05E42]/20">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C05E42] rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dual Language Switcher with WCAG 44px touch targets */}
            <div className="flex items-center bg-[#F3EEE7] p-0.5 rounded-xl border border-[#E8E2D9]" role="group" aria-label="Language selector">
              <button
                type="button"
                id="lang-btn-en"
                onClick={() => onLangChange('en')}
                className={`min-h-[38px] sm:min-h-[32px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
                  currentLang === 'en'
                    ? 'bg-[#2C4A3E] text-white shadow-2xs'
                    : 'text-[#5C544E] hover:text-[#1A1A1A]'
                }`}
                title="Switch to English"
                aria-pressed={currentLang === 'en'}
              >
                ENG
              </button>
              <button
                type="button"
                id="lang-btn-hi"
                onClick={() => onLangChange('hi')}
                className={`min-h-[38px] sm:min-h-[32px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-devanagari cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
                  currentLang === 'hi'
                    ? 'bg-[#2C4A3E] text-white shadow-2xs'
                    : 'text-[#5C544E] hover:text-[#1A1A1A]'
                }`}
                title="हिन्दी में बदलें"
                aria-pressed={currentLang === 'hi'}
              >
                हिन्दी
              </button>
            </div>

            {/* Mobile Menu Drawer Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-[#F3EEE7] border border-[#E8E2D9] text-[#1A1A1A] hover:bg-[#E8E2D9] transition-colors focus-visible:ring-2 focus-visible:ring-[#C05E42]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Overlay Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="md:hidden border-t border-[#E8E2D9] bg-[#FDFBF7] px-4 py-4 flex flex-col gap-2.5 shadow-lg animate-in slide-in-from-top-2 duration-200"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
                    isActive
                      ? 'bg-[#C05E42] text-white shadow-xs'
                      : 'bg-[#F3EEE7] text-[#2D2926] hover:bg-[#E8E2D9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={currentLang === 'hi' ? 'font-devanagari text-sm font-semibold' : ''}>
                      {currentLang === 'en' ? link.labelEn : link.labelHi}
                    </span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#C05E42]/10 text-[#C05E42]'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#E8E2D9] flex items-center justify-end text-xs text-[#5C544E] px-1 py-1">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#C05E42] font-bold hover:underline py-1 px-2 focus-visible:ring-2 focus-visible:ring-[#C05E42] rounded-lg"
              >
                {currentLang === 'en' ? 'Settings & Preferences →' : 'सेटिंग्स एवं प्राथमिकताएं →'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Fixed Ergonomic Mobile Bottom Navigation Bar (WCAG compliant 48px+ touch targets) */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E8E2D9] pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)] transition-all"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-3 h-16 items-center px-3 max-w-md mx-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all relative focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
                    isActive
                      ? 'text-[#C05E42] font-extrabold'
                      : 'text-[#5C544E] hover:text-[#1A1A1A]'
                  }`
                }
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-[#C05E42]/10 scale-105' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] leading-tight mt-0.5 tracking-tight ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                  {currentLang === 'en' ? link.labelEn : link.labelHi}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-[#C05E42] rounded-full absolute bottom-1" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

