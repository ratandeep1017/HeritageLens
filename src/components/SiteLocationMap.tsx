import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink, AlertCircle, Compass } from 'lucide-react';
import { resolveSiteCoordinates } from '../utils/geoCoordinates';

interface SiteLocationMapProps {
  latitude?: number;
  longitude?: number;
  siteName: string;
  areaName?: string;
  category?: string;
  state?: string;
  currentLang: 'en' | 'hi';
}

export const SiteLocationMap: React.FC<SiteLocationMapProps> = ({
  latitude,
  longitude,
  siteName,
  areaName,
  category,
  state,
  currentLang
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Auto-resolve coordinates from props or geographic monument/city registry across India
  const resolvedCoords = (typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0)
    ? { lat: latitude, lng: longitude }
    : resolveSiteCoordinates({ name: siteName, state, latitude, longitude });

  const effectiveLat = resolvedCoords?.lat;
  const effectiveLng = resolvedCoords?.lng;
  const hasValidCoordinates = typeof effectiveLat === 'number' && typeof effectiveLng === 'number' && effectiveLat !== 0;

  useEffect(() => {
    if (!hasValidCoordinates || !mapContainerRef.current) {
      return;
    }

    try {
      // Clean up prior map instance if any exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [effectiveLat!, effectiveLng!],
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false
      });

      mapInstanceRef.current = map;

      // Add high-reliability CartoDB Voyager Tile Layer with OpenStreetMap fallback
      const primaryTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
      });

      primaryTile.on('tileerror', () => {
        try {
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
        } catch (_) {}
      });

      primaryTile.addTo(map);

      // Add Zoom Control on top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Custom Heritage Pin Marker using Leaflet DivIcon
      const customPinHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
          <div style="position: absolute; width: 36px; height: 36px; background-color: rgba(192, 94, 66, 0.25); border-radius: 9999px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 30px; height: 30px; background-color: #C05E42; border: 2.5px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #D4AF37;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customPinHtml,
        className: 'heritage-map-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([effectiveLat!, effectiveLng!], { icon: customIcon }).addTo(map);

      // Popup with verified site details
      const popupHtml = `
        <div style="font-family: inherit; padding: 4px; max-width: 220px;">
          <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #C05E42; letter-spacing: 0.5px; margin-bottom: 2px;">
            ${category || 'Monument'} • ${state || areaName || 'India'}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #1A1A1A; line-height: 1.2; margin-bottom: 4px;">
            ${siteName}
          </div>
          <div style="font-size: 11px; color: #5C544E; line-height: 1.3;">
            ${areaName || `${state || 'India'}`}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml).openPopup();
      setIsLoaded(true);
      setMapError(false);

      // Multi-stage invalidateSize to ensure tiles render immediately when DOM container mounts
      const t1 = setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 150);
      const t2 = setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, siteName, areaName, category, state, hasValidCoordinates, effectiveLat, effectiveLng]);

  // Recenter helper
  const handleRecenter = () => {
    if (mapInstanceRef.current && hasValidCoordinates) {
      mapInstanceRef.current.setView([effectiveLat!, effectiveLng!], 15, { animate: true });
    }
  };

  // Google Maps External Directions Link
  const externalMapUrl = hasValidCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${effectiveLat},${effectiveLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteName} ${state || ''} India`)}`;

  if (!hasValidCoordinates || mapError) {
    return (
      <div 
        id="site-location-map-fallback"
        className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C05E42] px-2.5 py-0.5 rounded-full bg-[#C05E42]/10">
            {currentLang === 'en' ? 'Map Unavailable' : 'मानचित्र अनुपलब्ध'}
          </span>
          <h4 className="text-sm sm:text-base font-bold font-serif-heritage text-[#1A1A1A]">
            {currentLang === 'en'
              ? 'Interactive Map Tile Unavailable'
              : 'इंटरैक्टिव मानचित्र लोड नहीं हो सका'}
          </h4>
          <p className="text-xs text-[#5C544E] leading-relaxed">
            {currentLang === 'en'
              ? !hasValidCoordinates
                ? 'Exact geographic coordinates for this site are missing from the local record.'
                : 'Unable to render map tiles. This may be due to an intermittent network connection.'
              : !hasValidCoordinates
                ? 'इस स्थल के भौगोलिक निर्देशांक स्थानीय रिकॉर्ड में उपलब्ध नहीं हैं।'
                : 'मानचित्र लोड नहीं हो सका। कृपया अपना नेटवर्क कनेक्शन जांचें।'}
          </p>
        </div>

        {/* Actionable next steps */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {mapError && hasValidCoordinates && (
            <button
              type="button"
              onClick={() => setMapError(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#E8E2D9] text-xs font-bold text-[#1A1A1A] transition-colors shadow-2xs cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#C05E42]" />
              <span>{currentLang === 'en' ? 'Retry Map' : 'पुनः प्रयास करें'}</span>
            </button>
          )}

          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Open in Google Maps' : 'गूगल मैप्स में खोलें'}</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="site-location-map-wrapper"
      className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl overflow-hidden shadow-xs flex flex-col"
    >
      {/* Header bar with controls */}
      <div className="p-4 sm:px-6 bg-[#F3EEE7]/80 border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2C4A3E] text-[#D4AF37] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#1A1A1A]">
              {currentLang === 'en' ? 'Site Geolocation & Area Map' : 'स्मारक स्थान व क्षेत्रीय मानचित्र'}
            </h4>
            <span className="text-[11px] text-[#5C544E]">
              {latitude?.toFixed(4)}° N, {longitude?.toFixed(4)}° E • {areaName?.split('(')[0] || 'Delhi'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecenter}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#E8E2D9] text-xs font-semibold text-[#5C544E] hover:text-[#C05E42] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Recenter map"
          >
            <Navigation className="w-3.5 h-3.5 text-[#C05E42]" />
            <span className="hidden sm:inline">{currentLang === 'en' ? 'Recenter' : 'पुनः केंद्रित करें'}</span>
          </button>

          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{currentLang === 'en' ? 'Directions' : 'दिशा-निर्देश'}</span>
          </a>
        </div>
      </div>

      {/* Leaflet interactive Map viewport */}
      <div className="relative w-full h-64 sm:h-72 bg-[#E8E2D9]">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-10"
          style={{ minHeight: '256px' }}
        />
      </div>

      {/* Footer Info Notice with Attribution Compliance */}
      <div className="px-4 py-2.5 bg-[#FDFBF7] border-t border-[#E8E2D9] flex flex-wrap items-center justify-between text-[10px] text-[#8C8276] gap-2">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#C05E42]" />
          <span>{currentLang === 'en' ? 'Interactive OpenStreetMap Marker' : 'ओपनस्ट्रीटमैप मार्कर'}</span>
        </span>
        <span>
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1A1A1A]">OpenStreetMap</a> contributors
        </span>
      </div>
    </div>
  );
};
