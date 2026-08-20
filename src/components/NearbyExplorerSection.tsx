import React, { useState } from 'react';
import { 
  MapPin, 
  Utensils, 
  ShoppingBag, 
  Landmark, 
  Navigation, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Tag, 
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CuratedSiteNearbyData, getCuratedNearbyForSite } from '../data/delhiNearbyData';
import { SiteLocationMap } from './SiteLocationMap';

interface NearbyExplorerSectionProps {
  siteId: string;
  siteName: string;
  category?: string;
  areaName?: string;
  latitude?: number;
  longitude?: number;
  currentLang: 'en' | 'hi';
}

export const NearbyExplorerSection: React.FC<NearbyExplorerSectionProps> = ({
  siteId,
  siteName,
  category,
  areaName,
  latitude,
  longitude,
  currentLang
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'heritage' | 'food' | 'markets'>('all');

  // Retrieve curated local dataset
  const nearbyData = getCuratedNearbyForSite(siteId);

  const effectiveLat = latitude || nearbyData?.coordinates.latitude;
  const effectiveLng = longitude || nearbyData?.coordinates.longitude;
  const effectiveArea = areaName || nearbyData?.coordinates.areaName;

  const heritageList = nearbyData?.heritagePlaces || [];
  const foodList = nearbyData?.foodSpots || [];
  const marketList = nearbyData?.artisanMarkets || [];

  return (
    <div 
      id="result-nearby-explorer-section"
      className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#C05E42]/10 text-[#C05E42] text-[10px] font-bold uppercase tracking-wider">
              {currentLang === 'en' ? 'Local Heritage Circuit' : 'स्थानीय विरासत परिपथ'}
            </span>
            <span className="text-xs text-[#8C8276] font-medium">
              {currentLang === 'en' ? 'Curated Local Dataset' : 'प्रमाणित स्थानीय डेटासेट'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-heritage text-[#1A1A1A]">
            {currentLang === 'en' ? 'Nearby Culture, Food & Artisan Bazaars' : 'समीपवर्ती संस्कृति, स्वाद व शिल्प बाज़ार'}
          </h3>
          <p className="text-xs text-[#5C544E] mt-1">
            {currentLang === 'en' 
              ? `Authentic neighborhood recommendations within walking or short transit distance of ${siteName}.` 
              : `${siteName} के समीप स्थित प्रामाणिक ऐतिहासिक स्थल, पारंपरिक व्यंजन व हस्तशिल्प बाजार।`}
          </p>
        </div>

        {/* Filter Tabs */}
        <div 
          id="nearby-filter-tabs"
          className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EEE7] rounded-2xl border border-[#E8E2D9] self-start sm:self-auto"
        >
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
              activeFilter === 'all'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            } ${currentLang === 'hi' ? 'font-devanagari' : ''}`}
          >
            {currentLang === 'en' ? 'All' : 'सभी'}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('heritage')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
              activeFilter === 'heritage'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            } ${currentLang === 'hi' ? 'font-devanagari' : ''}`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Heritage' : 'धरोहर'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('food')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
              activeFilter === 'food'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            } ${currentLang === 'hi' ? 'font-devanagari' : ''}`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Food & Chaat' : 'खान-पान'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('markets')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
              activeFilter === 'markets'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            } ${currentLang === 'hi' ? 'font-devanagari' : ''}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Artisan Markets' : 'शिल्प बाज़ार'}</span>
          </button>
        </div>
      </div>

      {/* Interactive OpenStreetMap Geolocation Marker */}
      <div className="w-full">
        <SiteLocationMap
          latitude={effectiveLat}
          longitude={effectiveLng}
          siteName={siteName}
          areaName={effectiveArea}
          category={category}
          currentLang={currentLang}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. NEARBY HERITAGE & CULTURAL SITES                                       */}
      {/* ========================================================================= */}
      {(activeFilter === 'all' || activeFilter === 'heritage') && heritageList.length > 0 && (
        <div id="nearby-heritage-subpanel" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C8276] flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-[#C05E42]" />
              <span>{currentLang === 'en' ? 'Nearby Heritage & Cultural Landmarks' : 'समीपवर्ती ऐतिहासिक व सांस्कृतिक स्थल'}</span>
            </h4>
            <span className="text-[11px] font-semibold text-[#8C8276]">
              {heritageList.length} {currentLang === 'en' ? 'sites within 2 km' : 'स्थल (2 किमी के भीतर)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {heritageList.map((item) => (
              <div
                key={item.id}
                className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-2xl p-4 flex flex-col justify-between hover:border-[#C05E42]/40 transition-colors group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h5 className="text-sm font-bold text-[#1A1A1A] font-serif-heritage leading-tight group-hover:text-[#C05E42] transition-colors">
                      {currentLang === 'hi' && item.hindiName ? item.hindiName : item.name}
                    </h5>
                    <span className="px-2 py-0.5 bg-white border border-[#E8E2D9] text-[#C05E42] rounded-full text-[10px] font-bold shrink-0">
                      {item.distance}
                    </span>
                  </div>

                  <span className="inline-block text-[10px] font-semibold text-[#5C544E] mb-2 uppercase tracking-wide">
                    {item.category}
                  </span>

                  <p className="text-xs text-[#5C544E] leading-relaxed">
                    {currentLang === 'hi' && item.hindiDescription ? item.hindiDescription : item.description}
                  </p>
                </div>

                {item.highlight && (
                  <div className="mt-3 pt-2.5 border-t border-[#E8E2D9] flex items-center gap-1.5 text-[11px] text-[#2C4A3E] font-medium">
                    <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                    <span className="line-clamp-1">{item.highlight}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LOCAL FOOD SUGGESTIONS & CULINARY HERITAGE                             */}
      {/* ========================================================================= */}
      {(activeFilter === 'all' || activeFilter === 'food') && foodList.length > 0 && (
        <div id="nearby-food-subpanel" className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C8276] flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-[#2C4A3E]" />
              <span>{currentLang === 'en' ? 'Iconic Local Food & Culinary Landmarks' : 'प्रसिद्ध स्थानीय खान-पान व व्यंजन'}</span>
            </h4>
            <span className="text-[11px] font-semibold text-[#8C8276]">
              {currentLang === 'en' ? 'Time-tested legacy spots' : 'प्रसिद्ध ऐतिहासिक स्वाद'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {foodList.map((item) => (
              <div
                key={item.id}
                className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-2xl p-4 flex flex-col justify-between hover:border-[#2C4A3E]/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-sm font-bold text-[#1A1A1A] font-serif-heritage leading-tight">
                      {currentLang === 'hi' && item.hindiName ? item.hindiName : item.name}
                    </h5>
                    <span className="px-2 py-0.5 bg-white border border-[#E8E2D9] text-[#2C4A3E] rounded-full text-[10px] font-bold shrink-0">
                      {item.distance}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-[#8C8276] uppercase">
                      {item.cuisineType}
                    </span>
                    <span className="text-[10px] font-bold text-[#C05E42] bg-[#C05E42]/10 px-1.5 py-0.2 rounded">
                      {item.priceRange}
                    </span>
                  </div>

                  <p className="text-xs text-[#2D2926] leading-relaxed">
                    {currentLang === 'hi' && item.hindiSpecialty ? item.hindiSpecialty : item.specialty}
                  </p>
                </div>

                {item.timingNote && (
                  <div className="mt-3 pt-2.5 border-t border-[#E8E2D9] flex items-center gap-1.5 text-[11px] text-[#5C544E]">
                    <Clock className="w-3 h-3 text-[#C05E42] shrink-0" />
                    <span>{item.timingNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MARKETS & ARTISAN EXPERIENCES                                          */}
      {/* ========================================================================= */}
      {(activeFilter === 'all' || activeFilter === 'markets') && marketList.length > 0 && (
        <div id="nearby-markets-subpanel" className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C8276] flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Bazaars & Artisan Craft Experiences' : 'पारंपरिक बाज़ार व हस्तशिल्प अनुभव'}</span>
            </h4>
            <span className="text-[11px] font-semibold text-[#8C8276]">
              {currentLang === 'en' ? 'Handlooms, Zari & Folk Arts' : 'हथकरघा, ज़री व लोक शिल्प'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketList.map((item) => (
              <div
                key={item.id}
                className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-2xl p-5 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-sm font-bold text-[#1A1A1A] font-serif-heritage">
                      {currentLang === 'hi' && item.hindiName ? item.hindiName : item.name}
                    </h5>
                    <span className="px-2 py-0.5 bg-white border border-[#E8E2D9] text-[#8C6B14] rounded-full text-[10px] font-bold shrink-0">
                      {item.distance}
                    </span>
                  </div>

                  <span className="inline-block text-[10px] font-semibold text-[#8C8276] mb-2 uppercase tracking-wide">
                    {item.marketType}
                  </span>

                  <p className="text-xs text-[#5C544E] leading-relaxed mb-3">
                    {currentLang === 'hi' && item.hindiDescription ? item.hindiDescription : item.description}
                  </p>
                </div>

                {item.artisanHighlights && item.artisanHighlights.length > 0 && (
                  <div className="pt-3 border-t border-[#E8E2D9]">
                    <span className="text-[10px] uppercase font-bold text-[#8C8276] tracking-wider block mb-1.5">
                      {currentLang === 'en' ? 'Artisan Highlights' : 'शिल्प विशेषताएं'}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.artisanHighlights.map((craft, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-white border border-[#E8E2D9] text-[10px] font-semibold text-[#2D2926]"
                        >
                          {craft}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. "VERIFY BEFORE VISITING" NOTE FOR TIMINGS, PRICES & AVAILABILITY        */}
      {/* ========================================================================= */}
      <div 
        id="nearby-verify-before-visiting-notice"
        className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-950 shadow-2xs mt-2"
      >
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-amber-900">
            {currentLang === 'en' ? 'Verify Before Visiting' : 'यात्रा से पूर्व पुष्टि करें'}
          </span>
          <p className="leading-relaxed text-[#5C544E]">
            {nearbyData?.verificationNote[currentLang] ||
              (currentLang === 'en'
                ? 'Timings, menus, prices, weekly market holidays, and admission rules may vary seasonally. We recommend verifying operating hours and current rates directly before planning your visit.'
                : 'दुकानों का समय, मेनू, दरें, साप्ताहिक बाजार अवकाश और प्रवेश नियम मौसम के अनुसार बदल सकते हैं। यात्रा की योजना बनाने से पहले संचालन समय और वर्तमान दरों की पुष्टि अवश्य करें।')}
          </p>
        </div>
      </div>
    </div>
  );
};
