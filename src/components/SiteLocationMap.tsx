import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink, AlertCircle, Compass, Layers } from 'lucide-react';
import { resolveSiteCoordinates, fetchLiveCoordinates } from '../utils/geoCoordinates';

interface SiteLocationMapProps {
  latitude?: number;
  longitude?: number;
  siteName: string;
  areaName?: string;
  category?: string;
  state?: string;
  currentLang: 'en' | 'hi';
  hotelMarkers?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    category?: string;
    priceRange?: string;
  }>;
}

type MapMode = 'streets' | 'satellite' | 'embed';

export const SiteLocationMap: React.FC<SiteLocationMapProps> = ({
  latitude,
  longitude,
  siteName,
  areaName,
  category,
  state,
  currentLang,
  hotelMarkers
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const hotelLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapMode, setMapMode] = useState<MapMode>('streets');
  const [mapError, setMapError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Auto-resolve coordinates from props or geographic monument/city registry across India
  const initialResolved = (typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0)
    ? { lat: latitude, lng: longitude }
    : resolveSiteCoordinates({ name: siteName, state, latitude, longitude });

  // Use live-geocoded coordinates if resolved, otherwise static/registry coordinates
  const effectiveLat = liveCoords?.lat ?? initialResolved?.lat;
  const effectiveLng = liveCoords?.lng ?? initialResolved?.lng;
  const hasValidCoordinates = typeof effectiveLat === 'number' && typeof effectiveLng === 'number' && effectiveLat !== 0;

  // Search directly on live Google Maps / Geocoding APIs
  useEffect(() => {
    let isSubscribed = true;
    fetchLiveCoordinates(siteName, state, areaName).then((res) => {
      if (isSubscribed && res && (res.lat !== initialResolved?.lat || res.lng !== initialResolved?.lng)) {
        setLiveCoords(res);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [siteName, state, areaName]);

  // When live coordinates are fetched, smoothly pan the map and update the marker
  useEffect(() => {
    if (mapInstanceRef.current && liveCoords) {
      mapInstanceRef.current.setView([liveCoords.lat, liveCoords.lng], 16, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng([liveCoords.lat, liveCoords.lng]);
      }
    }
  }, [liveCoords]);

  // Clean query for direct Google Maps searching
  const directMapSearchQuery = `${siteName}, ${areaName ? areaName.split('(')[0].trim() : ''}, ${state || 'Delhi'}, India`.replace(/,\s*,/g, ',').trim();

  // External directions / place URL directly on Google Maps
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directMapSearchQuery)}`;

  // Google Maps native embed URL directly searching the place name (100% free, no credit card or API key required)
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(directMapSearchQuery)}&hl=${currentLang === 'hi' ? 'hi' : 'en'}&z=16&output=embed`;

  // Helper to create appropriate Google tile layer
  const createTileLayer = (mode: 'streets' | 'satellite') => {
    if (mode === 'satellite') {
      const satTile = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
      satTile.on('tileerror', () => {
        try {
          if (mapInstanceRef.current) {
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              maxZoom: 19,
              attribution: 'Tiles &copy; Esri'
            }).addTo(mapInstanceRef.current);
          }
        } catch (_) {}
      });
      return satTile;
    } else {
      const roadTile = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
      roadTile.on('tileerror', () => {
        try {
          if (mapInstanceRef.current) {
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
              maxZoom: 19,
              attribution: 'Tiles &copy; Esri'
            }).addTo(mapInstanceRef.current);
          }
        } catch (_) {}
      });
      return roadTile;
    }
  };

  // Switch tile layer smoothly when toggling streets/satellite in Leaflet mode
  useEffect(() => {
    if (mapMode === 'embed' || !mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTile = createTileLayer(mapMode);
    newTile.addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [mapMode]);

  // Initialize Leaflet map
  useEffect(() => {
    if (mapMode === 'embed' || !hasValidCoordinates || !mapContainerRef.current) {
      return;
    }

    try {
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

      // Add selected Google Maps tile layer
      const primaryTile = createTileLayer(mapMode === 'satellite' ? 'satellite' : 'streets');
      primaryTile.addTo(map);
      tileLayerRef.current = primaryTile;

      // Add Zoom Control on top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Custom animated Heritage Pin Marker
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
      markerRef.current = marker;

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

      // Invalidate size to ensure full tile rendering
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
  }, [latitude, longitude, siteName, areaName, category, state, hasValidCoordinates, effectiveLat, effectiveLng, mapMode === 'embed']);

  // Update hotel pins dynamically on the map
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    if (hotelLayerGroupRef.current) {
      hotelLayerGroupRef.current.clearLayers();
    } else {
      hotelLayerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    if (!hotelMarkers || hotelMarkers.length === 0) return;

    hotelMarkers.forEach((hotel) => {
      if (typeof hotel.latitude !== 'number' || typeof hotel.longitude !== 'number' || isNaN(hotel.latitude) || isNaN(hotel.longitude)) return;

      const hotelPinHtml = `
        <div style="width: 28px; height: 28px; background-color: #0284c7; border: 2.5px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 13px; cursor: pointer;">
          🏨
        </div>
      `;
      const hotelIcon = L.divIcon({
        html: hotelPinHtml,
        className: 'hotel-map-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const hMarker = L.marker([hotel.latitude, hotel.longitude], { icon: hotelIcon });
      const hPopup = `
        <div style="font-family: inherit; padding: 4px; max-width: 190px;">
          <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #0284c7; letter-spacing: 0.5px; margin-bottom: 2px;">
            ${hotel.category || 'Hotel / Stay'}
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #1A1A1A; line-height: 1.2;">
            ${hotel.name}
          </div>
          ${hotel.priceRange ? `<div style="font-size: 11px; font-weight: 700; color: #15803d; margin-top: 3px;">${hotel.priceRange}</div>` : ''}
        </div>
      `;
      hMarker.bindPopup(hPopup);
      hotelLayerGroupRef.current?.addLayer(hMarker);
    });
  }, [hotelMarkers, isLoaded]);


  // Recenter helper
  const handleRecenter = () => {
    if (mapInstanceRef.current && hasValidCoordinates) {
      mapInstanceRef.current.setView([effectiveLat!, effectiveLng!], 15, { animate: true });
    }
  };

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
            {currentLang === 'en' ? 'Map View' : 'मानचित्र दृश्य'}
          </span>
          <h4 className="text-sm sm:text-base font-bold font-serif-heritage text-[#1A1A1A]">
            {currentLang === 'en'
              ? 'Open Google Maps for Live Navigation'
              : 'लाइव नेविगेशन के लिए गूगल मैप्स खोलें'}
          </h4>
          <p className="text-xs text-[#5C544E] leading-relaxed">
            {currentLang === 'en'
              ? 'Access accurate directions, live traffic, and street view directly via Google Maps.'
              : 'सटीक दिशा-निर्देश, लाइव ट्रैफ़िक और स्ट्रीट व्यू गूगल मैप्स पर देखें।'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
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
      {/* Header bar with controls & Google Maps mode toggle */}
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
              {latitude?.toFixed(4)}° N, {longitude?.toFixed(4)}° E • {areaName?.split('(')[0] || state || 'India'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Map Type Switcher + Recenter + Directions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="inline-flex p-1 bg-white border border-[#E8E2D9] rounded-xl shadow-2xs text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setMapMode('streets')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                mapMode === 'streets'
                  ? 'bg-[#2C4A3E] text-white'
                  : 'text-[#5C544E] hover:text-[#1A1A1A]'
              }`}
            >
              {currentLang === 'en' ? 'Map' : 'मानचित्र'}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-[#2C4A3E] text-white'
                  : 'text-[#5C544E] hover:text-[#1A1A1A]'
              }`}
            >
              {currentLang === 'en' ? 'Satellite' : 'सैटेलाइट'}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('embed')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                mapMode === 'embed'
                  ? 'bg-[#2C4A3E] text-white'
                  : 'text-[#5C544E] hover:text-[#1A1A1A]'
              }`}
            >
              {currentLang === 'en' ? 'Google 3D' : 'गूगल 3D'}
            </button>
          </div>

          {mapMode !== 'embed' && (
            <button
              type="button"
              onClick={handleRecenter}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#E8E2D9] text-xs font-semibold text-[#5C544E] hover:text-[#C05E42] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Recenter map"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C05E42]" />
              <span className="hidden sm:inline">{currentLang === 'en' ? 'Recenter' : 'पुनः केंद्रित'}</span>
            </button>
          )}

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

      {/* Map Viewport: Leaflet Interactive or Google Embed */}
      <div className="relative w-full h-72 sm:h-80 bg-[#E8E2D9]">
        {mapMode === 'embed' ? (
          <iframe
            title={`Google Maps location of ${siteName}`}
            src={embedMapUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <div 
            ref={mapContainerRef} 
            className="w-full h-full z-10"
            style={{ minHeight: '288px' }}
          />
        )}
      </div>

      {/* Footer Info Notice with Google Maps Attribution */}
      <div className="px-4 py-2.5 bg-[#FDFBF7] border-t border-[#E8E2D9] flex flex-wrap items-center justify-between text-[10px] text-[#8C8276] gap-2">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#C05E42]" />
          <span>
            {currentLang === 'en'
              ? 'Powered by Google Maps • Real-time Geographic Positioning'
              : 'गूगल मैप्स द्वारा संचालित • वास्तविक समय भौगोलिक स्थिति'}
          </span>
        </span>
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2C4A3E] hover:underline font-bold inline-flex items-center gap-1"
        >
          <span>{currentLang === 'en' ? 'Open in Google Maps' : 'गूगल मैप्स में खोलें'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
