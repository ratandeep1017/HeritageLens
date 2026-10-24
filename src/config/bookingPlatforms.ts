import { BookingPlatformConfig } from '../types/index';

export const DEFAULT_BOOKING_PLATFORMS: BookingPlatformConfig[] = [
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    badgeColor: '#e41d36',
    textColor: '#ffffff',
    urlTemplate: 'https://www.makemytrip.com/hotels/hotel-listing/?searchText={query}',
    enabled: true,
  },
  {
    id: 'booking_com',
    name: 'Booking.com',
    badgeColor: '#003580',
    textColor: '#ffffff',
    urlTemplate: 'https://www.booking.com/searchresults.html?ss={query}',
    enabled: true,
  },
  {
    id: 'goibibo',
    name: 'Goibibo',
    badgeColor: '#f26722',
    textColor: '#ffffff',
    urlTemplate: 'https://www.goibibo.com/hotels/find-hotels-by-name?search={query}',
    enabled: true,
  },
  {
    id: 'oyo',
    name: 'OYO Rooms',
    badgeColor: '#ee2e24',
    textColor: '#ffffff',
    urlTemplate: 'https://www.oyorooms.com/search/?city={city}',
    enabled: true,
  },
  {
    id: 'google_hotels',
    name: 'Google Hotels',
    badgeColor: '#1a73e8',
    textColor: '#ffffff',
    urlTemplate: 'https://www.google.com/travel/hotels?q={query}',
    enabled: true,
  },
];

const PLATFORMS_STORAGE_KEY = 'heritagelens_booking_platforms_config_v3';

/**
 * Retrieves configured booking platforms from localStorage (customized by admin)
 * or falls back to defaults.
 */
export function getBookingPlatforms(): BookingPlatformConfig[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKING_PLATFORMS;
  try {
    const saved = localStorage.getItem(PLATFORMS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[BookingConfig] Failed to read platforms from storage:', err);
  }
  return DEFAULT_BOOKING_PLATFORMS;
}

/**
 * Saves customized booking platforms to localStorage.
 */
export function saveBookingPlatforms(platforms: BookingPlatformConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLATFORMS_STORAGE_KEY, JSON.stringify(platforms));
  } catch (err) {
    console.error('[BookingConfig] Failed to save platforms:', err);
  }
}

export interface BookingUrlParams {
  hotelName?: string;
  placeName: string;
  city?: string;
  lat?: number;
  lng?: number;
}

/**
 * Builds a dynamic, fully URL-encoded deep search URL for any configured platform.
 * Strips transit station phrases from city, and avoids prepending "hotels near "
 * which causes MakeMyTrip and Booking.com to treat it as a literal hotel title.
 */
export function buildBookingUrl(
  template: string,
  params: BookingUrlParams
): string {
  // 1. Sanitize city: strip out transit/metro station names or overly long lines
  let rawCity = (params.city || '').trim();
  if (/metro|station|line|\(/i.test(rawCity) || rawCity.length > 30) {
    rawCity = 'Delhi';
  }
  const city = rawCity || 'Delhi';
  const place = (params.placeName || '').trim();
  const hotel = (params.hotelName || '').trim();

  // 2. Build clean query without literal "hotels near" prefix so MMT and Booking POI matching succeeds
  let rawQuery = '';
  if (hotel) {
    rawQuery = hotel.toLowerCase().includes(city.toLowerCase()) ? hotel : `${hotel} ${city}`;
  } else if (place) {
    rawQuery = place.toLowerCase().includes(city.toLowerCase()) ? place : `${place} ${city}`;
  } else {
    rawQuery = city;
  }
  rawQuery = rawQuery.trim();

  let url = template;

  // Google Travel Hotels works best with explicit "hotels near" prefix
  if (template.includes('google.com/travel/hotels') && !rawQuery.toLowerCase().startsWith('hotels')) {
    url = url.replace(/\{query\}/gi, encodeURIComponent(`hotels near ${rawQuery}`));
  } else {
    url = url.replace(/\{query\}/gi, encodeURIComponent(rawQuery));
  }

  url = url.replace(/\{place\}/gi, encodeURIComponent(place || city));
  url = url.replace(/\{city\}/gi, encodeURIComponent(city));

  if (params.lat !== undefined && params.lng !== undefined) {
    url = url.replace(/\{lat\}/gi, encodeURIComponent(String(params.lat)));
    url = url.replace(/\{lng\}/gi, encodeURIComponent(String(params.lng)));
  } else {
    url = url.replace(/\{lat\}/gi, '');
    url = url.replace(/\{lng\}/gi, '');
  }

  return url;
}
