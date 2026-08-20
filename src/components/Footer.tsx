import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Compass, Sparkles } from 'lucide-react';

interface FooterProps {
  currentLang: 'en' | 'hi';
  onLangChange: (lang: 'en' | 'hi') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLangChange }) => {
  return (
    <footer className="border-t border-[#E8E2D9] bg-[#2D2926] text-[#E8E2D9] pt-8 pb-28 md:pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#C05E42] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border border-white rotate-45"></div>
            </div>
            <span className="font-serif-heritage text-lg text-white font-bold tracking-tight">
              HeritageLens <span className="text-[#D4AF37]">AI</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#D4AF37] font-semibold">
              Prototype v1.0
            </span>
          </div>

          {/* Quick links & language */}
          <div className="flex items-center gap-6 text-xs text-[#A69E95]">
            <Link to="/" className="hover:text-white transition-colors">
              {currentLang === 'en' ? 'Home' : 'होम'}
            </Link>
            <Link to="/explore" className="hover:text-white transition-colors">
              {currentLang === 'en' ? 'Explore' : 'अन्वेषण'}
            </Link>
            <Link to="/profile" className="hover:text-white transition-colors">
              {currentLang === 'en' ? 'Profile Settings' : 'प्रोफ़ाइल सेटिंग्स'}
            </Link>
            <span className="text-[#5C544E]">|</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLangChange('en')}
                className={`text-xs font-semibold ${
                  currentLang === 'en' ? 'text-[#D4AF37] underline' : 'hover:text-white'
                }`}
              >
                English
              </button>
              <span>/</span>
              <button
                onClick={() => onLangChange('hi')}
                className={`text-xs font-semibold font-devanagari ${
                  currentLang === 'hi' ? 'text-[#D4AF37] underline' : 'hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Information */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C8276]">
          <div className="flex items-start sm:items-center gap-2 max-w-2xl text-center sm:text-left">
            <ShieldAlert className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0" />
            <p>
              {currentLang === 'en'
                ? 'Prototype Disclaimer: This is an educational demonstration prototype. AI image identification is powered by Google Gemini Vision. Historical facts are compiled from Archaeological Survey of India (ASI) & UNESCO World Heritage Centre records. Map data © OpenStreetMap contributors.'
                : 'प्रोटोटाइप अस्वीकरण: यह एक शैक्षिक प्रदर्शन प्रोटोटाइप है। एआई छवि पहचान गूगल जेमिनी विज़न द्वारा संचालित है। ऐतिहासिक तथ्य एएसआई और यूनेस्को रिकॉर्ड से लिए गए हैं। मानचित्र डेटा © OpenStreetMap योगदानकर्ता।'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[#D4AF37] font-semibold uppercase tracking-widest text-[10px]">
              INDIA HERITAGE • PILOT SERIES
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
