import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Building2,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CuratedSiteNearbyData, getCuratedNearbyForSite } from '../data/delhiNearbyData';
import { SiteLocationMap } from './SiteLocationMap';
import { HotelItem, BookingPlatformConfig } from '../types/index';
import { getBookingPlatforms, buildBookingUrl } from '../config/bookingPlatforms';
import { fetchNearbyHotels } from '../services/hotelService';

interface NearbyExplorerSectionProps {
  siteId: string;
  siteName: string;
  category?: string;
  areaName?: string;
  latitude?: number;
  longitude?: number;
  state?: string;
  city?: string;
  nearbyAttractions?: { name: string; distance: string; description: string }[];
  currentLang: 'en' | 'hi';
}

export const NearbyExplorerSection: React.FC<NearbyExplorerSectionProps> = ({
  siteId,
  siteName,
  category,
  areaName,
  latitude,
  longitude,
  state,
  city,
  nearbyAttractions,
  currentLang
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'heritage' | 'food' | 'markets' | 'hotels'>('all');

  // Hotel suggestions state
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState<boolean>(true);
  const [hotelsSource, setHotelsSource] = useState<'hybrid' | 'curated' | 'fallback'>('curated');
  const [hotelCategoryFilter, setHotelCategoryFilter] = useState<string>('all');
  const [bookingPlatforms, setBookingPlatforms] = useState<BookingPlatformConfig[]>([]);

  useEffect(() => {
    setBookingPlatforms(getBookingPlatforms());
  }, []);


  // Retrieve curated local dataset if available
  const nearbyData = getCuratedNearbyForSite(siteId);

  // Clean, sanitized city & state (guarantee no transit strings)
  const isTransitString = (str?: string) => !!str && (/metro|station|line|\(/i.test(str) || str.length > 30);
  const cleanCity = (!isTransitString(city) && city) ? city : ((!isTransitString(state) && state) ? state : 'Delhi');
  const cleanState = (!isTransitString(state) && state) ? state : 'Delhi';
  const cleanArea = (!isTransitString(areaName) && areaName) ? areaName : `${cleanCity}, ${cleanState}`;

  const effectiveLat = latitude || nearbyData?.coordinates.latitude;
  const effectiveLng = longitude || nearbyData?.coordinates.longitude;
  const effectiveArea = cleanArea;

  // If curated Delhi list exists, use it; otherwise use AI-generated nearbyAttractions
  const fallbackHeritageList = (nearbyAttractions || []).map((att, idx) => ({
    id: `dyn-nearby-${idx}`,
    name: att.name,
    distance: att.distance || '1 km',
    category: 'Landmark',
    description: att.description || `Historic and cultural landmark in the vicinity of ${siteName}.`
  }));

  const heritageList = (nearbyData?.heritagePlaces && nearbyData.heritagePlaces.length > 0)
    ? nearbyData.heritagePlaces
    : fallbackHeritageList;
  const foodList = nearbyData?.foodSpots || [];
  const marketList = nearbyData?.artisanMarkets || [];

  // Fetch hotels for the current monument and coordinates
  useEffect(() => {
    let isSubscribed = true;
    setHotelsLoading(true);

    fetchNearbyHotels({
      siteId,
      placeName: siteName,
      city: cleanCity,
      latitude: effectiveLat,
      longitude: effectiveLng,
    }).then((res) => {
      if (isSubscribed) {
        setHotels(res.hotels);
        setHotelsSource(res.source);
        setHotelsLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [siteId, siteName, effectiveLat, effectiveLng, cleanCity]);

  const enabledPlatforms = bookingPlatforms.filter((p) => p.enabled);

  const filteredHotels = hotels.filter((h) => {
    if (hotelCategoryFilter === 'all') return true;
    const cat = (h.category || '').toLowerCase();
    if (hotelCategoryFilter === 'budget') return cat.includes('budget') || cat.includes('hostel');
    if (hotelCategoryFilter === 'dharamshala') return cat.includes('dharamshala') || cat.includes('sarai') || cat.includes('hostel');
    if (hotelCategoryFilter === 'mid') return cat.includes('mid') || cat.includes('standard');
    if (hotelCategoryFilter === 'luxury') return cat.includes('luxury') || cat.includes('heritage') || cat.includes('boutique');
    return true;
  });


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
          <button
            type="button"
            onClick={() => setActiveFilter('hotels')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
              activeFilter === 'hotels'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            } ${currentLang === 'hi' ? 'font-devanagari' : ''}`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Hotels & Stays' : 'होटल व आवास'}</span>
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
          state={state}
          currentLang={currentLang}
          hotelMarkers={hotels
            .filter((h) => typeof h.latitude === 'number' && typeof h.longitude === 'number')
            .map((h) => ({
              name: h.name,
              latitude: h.latitude!,
              longitude: h.longitude!,
              category: h.category,
              priceRange: h.priceRange,
            }))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {heritageList.map((item) => (
              <div
                key={item.id}
                className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-2xl p-4 flex flex-col justify-between hover:border-[#C05E42]/40 transition-colors group min-h-[190px]"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodList.map((item) => (
              <div
                key={item.id}
                className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-2xl p-4 flex flex-col justify-between hover:border-[#2C4A3E]/40 transition-colors min-h-[190px]"
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
      {/* 3b. NEARBY HOTELS & STAYS (CURATED + GEMINI AI + DEEP BOOKING BUTTONS)     */}
      {/* ========================================================================= */}
      {(activeFilter === 'all' || activeFilter === 'hotels') && (
        <div id="nearby-hotels-subpanel" className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D9] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C8276] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#C05E42]" />
                  <span>{currentLang === 'en' ? 'Nearby Hotels, Stays & Dharamshalas' : 'समीपवर्ती होटल, आश्रम व धर्मशालाएं'}</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2C4A3E]/10 text-[#2C4A3E]">
                  {hotelsSource === 'hybrid' ? '✨ AI + Curated' : '✅ Curated Local'}
                </span>
              </div>
              <p className="text-[11px] text-[#5C544E] mt-0.5">
                {currentLang === 'en' 
                  ? 'Recommended stays from budget dharamshalas to heritage rooms with direct booking links.' 
                  : 'सस्ती धर्मशालाओं से लेकर हेरिटेज होटलों तक ठहरने के विकल्प, सीधे बुकिंग लिंक के साथ।'}
              </p>
            </div>
            
            <span className="text-[11px] font-semibold text-[#8C8276] shrink-0 self-start sm:self-auto">
              {filteredHotels.length} {currentLang === 'en' ? 'stays nearby' : 'आवास उपलब्ध'}
            </span>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', labelEn: 'All Stays', labelHi: 'सभी आवास' },
              { id: 'budget', labelEn: 'Budget (< ₹1,500)', labelHi: 'बजट (< ₹1,500)' },
              { id: 'dharamshala', labelEn: 'Dharamshalas & Hostels', labelHi: 'धर्मशालाएं व हॉस्टल' },
              { id: 'mid', labelEn: 'Mid-range', labelHi: 'मध्यम वर्ग' },
              { id: 'luxury', labelEn: 'Heritage & Luxury', labelHi: 'हेरिटेज व लक्जरी' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setHotelCategoryFilter(cat.id)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  hotelCategoryFilter === cat.id
                    ? 'bg-[#C05E42] text-white border-[#C05E42] shadow-2xs'
                    : 'bg-white text-[#5C544E] border-[#E8E2D9] hover:bg-[#F3EEE7]'
                }`}
              >
                {currentLang === 'en' ? cat.labelEn : cat.labelHi}
              </button>
            ))}
          </div>

          {/* Hotel Cards Grid */}
          {hotelsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E8E2D9] animate-pulse flex flex-col gap-3">
                  <div className="h-4 bg-[#E8E2D9] rounded w-2/3"></div>
                  <div className="h-3 bg-[#E8E2D9] rounded w-1/3"></div>
                  <div className="h-10 bg-[#E8E2D9] rounded w-full mt-2"></div>
                </div>
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D9] text-center text-xs text-[#8C8276]">
              {currentLang === 'en' ? 'No stays match this filter.' : 'इस फ़िल्टर में कोई आवास नहीं मिला।'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHotels.map(hotel => (
                <div
                  key={hotel.id}
                  className="p-5 rounded-2xl bg-white border border-[#E8E2D9] hover:border-[#C05E42]/50 hover:shadow-sm transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          (hotel.category || '').toLowerCase().includes('dharamshala') || (hotel.category || '').toLowerCase().includes('sarai')
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : (hotel.category || '').toLowerCase().includes('luxury') || (hotel.category || '').toLowerCase().includes('heritage')
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : (hotel.category || '').toLowerCase().includes('hostel') || (hotel.category || '').toLowerCase().includes('budget')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {hotel.category}
                        </span>
                        {hotel.source === 'curated' ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{currentLang === 'en' ? 'Verified' : 'प्रमाणित'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{currentLang === 'en' ? 'AI Suggested' : 'AI सुझाव'}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold text-xs shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{hotel.rating.toFixed(1)}</span>
                        {hotel.reviewsCount && (
                          <span className="text-[10px] text-amber-800/80 font-normal">({hotel.reviewsCount})</span>
                        )}
                      </div>
                    </div>

                    <h5 className="text-base font-bold text-[#1A1A1A] leading-tight mt-1">
                      {hotel.name}
                    </h5>

                    <div className="flex items-center gap-1.5 text-xs text-[#5C544E]">
                      <MapPin className="w-3.5 h-3.5 text-[#C05E42] shrink-0" />
                      <span>{hotel.distance}</span>
                    </div>

                    {hotel.notes && (
                      <p className="text-xs text-[#6F675F] italic bg-[#FBF9F5] p-2 rounded-lg border border-[#EDE8E1]">
                        "{hotel.notes}"
                      </p>
                    )}

                    {/* Amenities pills */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hotel.amenities.slice(0, 4).map((amenity, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F3EEE7] text-[#5C544E] font-medium">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-3 border-t border-[#E8E2D9] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#8C8276] tracking-wider">
                        {currentLang === 'en' ? 'Est. Tariff' : 'अनुमानित किराया'}:
                      </span>
                      <span className="text-sm font-extrabold text-[#2C4A3E]">
                        {hotel.priceRange}
                      </span>
                    </div>

                    {/* "Book On" website colored dots with hover tooltip */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-[#8C8276] uppercase tracking-wider">
                        {currentLang === 'en' ? 'Book on:' : 'बुकिंग साइट्स:'}
                      </span>
                      <div className="flex items-center gap-2">
                        {enabledPlatforms.map((platform) => {
                          const targetUrl = buildBookingUrl(platform.urlTemplate, {
                            hotelName: hotel.name,
                            placeName: siteName,
                            city: city || state || areaName || 'Delhi',
                            lat: hotel.latitude,
                            lng: hotel.longitude,
                          });

                          return (
                            <div key={platform.id} className="relative group flex items-center justify-center">
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Book on ${platform.name}`}
                                style={{ backgroundColor: platform.badgeColor }}
                                className="w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-all duration-200 transform hover:scale-125 hover:shadow-md cursor-pointer ring-2 ring-white/90 hover:ring-offset-1 hover:ring-[#2C4A3E]/30"
                              >
                                {/* Inner dot for brand contrast */}
                                <span className="w-1.5 h-1.5 rounded-full bg-white/70 group-hover:bg-white transition-colors" />
                              </a>

                              {/* Hover Tooltip displaying website name */}
                              <div
                                role="tooltip"
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-30 pointer-events-none transform group-hover:-translate-y-0.5"
                              >
                                <div className="bg-[#1A1A1A] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-white/10">
                                  <span>{platform.name}</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-white/80 shrink-0" />
                                </div>
                                <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#1A1A1A] mx-auto" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Search All Hotels Banner */}
          <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1A1A1A]">
                {currentLang === 'en'
                  ? `Looking for more hotels in ${cleanCity} near ${siteName}?`
                  : `क्या आप ${siteName} (${cleanCity}) के आसपास अन्य विकल्प ढूंढ रहे हैं?`}
              </span>
              <span className="text-[11px] text-[#5C544E]">
                {currentLang === 'en'
                  ? `Search all available stays near ${siteName} on partner booking sites:`
                  : `सभी उपलब्ध कमरे सीधे इन वेबसाइट्स पर खोजें:`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {enabledPlatforms.map((platform) => {
                const areaUrl = buildBookingUrl(platform.urlTemplate, {
                  placeName: siteName,
                  city: cleanCity,
                  lat: effectiveLat,
                  lng: effectiveLng,
                });
                return (
                  <div key={`gen-dot-${platform.id}`} className="relative group">
                    <a
                      href={areaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Search stays on ${platform.name}`}
                      style={{ backgroundColor: platform.badgeColor }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-2xs hover:scale-115 active:scale-95 transition-all duration-200 cursor-pointer border border-black/10 focus-visible:ring-2 focus-visible:ring-[#C05E42]"
                    >
                      <span className="text-[10px] font-black uppercase tracking-tight">
                        {platform.name.substring(0, 2)}
                      </span>
                    </a>

                    {/* Floating Tooltip */}
                    <div
                      role="tooltip"
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-30 pointer-events-none transform group-hover:-translate-y-0.5"
                    >
                      <div className="bg-[#1A1A1A] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-white/10">
                        <span>{platform.name}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-white/80 shrink-0" />
                      </div>
                      <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#1A1A1A] mx-auto" />
                    </div>
                  </div>
                );
              })}
            </div>
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
