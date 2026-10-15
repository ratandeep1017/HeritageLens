import React from 'react';
import { Key, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApiKeyPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueDemo: () => void;
  currentLang: 'en' | 'hi';
}

export const ApiKeyPromptModal: React.FC<ApiKeyPromptModalProps> = ({
  isOpen,
  onClose,
  onContinueDemo,
  currentLang,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      id="api-key-prompt-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="api-key-prompt-dialog"
        className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-6 relative"
      >
        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#E8E2D9] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C05E42]/10 border border-[#C05E42]/20 text-[#C05E42] flex items-center justify-center shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C05E42] block">
              {currentLang === 'en' ? 'AI Vision Access Configuration' : 'एआई विज़न कॉन्फ़िगरेशन'}
            </span>
            <h3 className="text-xl font-bold font-serif-heritage text-[#1A1A1A]">
              {currentLang === 'en' ? 'Configure Key or Use Verified Mode?' : 'कुंजी सेट करें या सत्यापित मोड चुनें?'}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm text-[#5C544E] leading-relaxed">
          <p>
            {currentLang === 'en'
              ? 'An AI Vision key connects your browser to live multimodal recognition across all Indian heritage monuments. You can also explore instantly using our built-in Verified Catalog.'
              : 'एआई विज़न कुंजी सभी भारतीय स्मारकों के लाइव मल्टीमॉडल विश्लेषण को सक्षम करती है। आप हमारे अंतर्निहित प्रमाणित कैटलॉग में भी तुरंत अन्वेषण कर सकते हैं।'}
          </p>

          <div className="p-3.5 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex items-start gap-2.5 text-xs text-[#2D2926]">
            <ShieldCheck className="w-4 h-4 text-[#2C4A3E] shrink-0 mt-0.5" />
            <span>
              {currentLang === 'en'
                ? 'Verified Mode uses comprehensive ASI & UNESCO records and high-resolution recognition profiles across Indian states without requiring an external key.'
                : 'सत्यापित मोड बिना किसी अतिरिक्त कुंजी के विभिन्न राज्यों के प्रमाणित एएसआई और यूनेस्को रिकॉर्ड के साथ कार्य करता है।'}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            id="modal-continue-demo-btn"
            onClick={onContinueDemo}
            className="w-full sm:flex-1 min-h-[44px] py-3 px-4 rounded-xl bg-white hover:bg-[#F3EEE7] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42]"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
              {currentLang === 'en' ? 'Continue in Demo Mode' : 'डेमो मोड में जारी रखें'}
            </span>
          </button>

          <button
            type="button"
            id="modal-configure-key-btn"
            onClick={() => {
              onClose();
              navigate('/profile');
            }}
            className="w-full sm:flex-1 min-h-[44px] py-3 px-4 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <Key className="w-4 h-4" />
            <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
              {currentLang === 'en' ? 'Configure API Key' : 'कुंजी कॉन्फ़िगर करें'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
