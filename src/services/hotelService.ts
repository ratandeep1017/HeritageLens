import { HotelItem } from '../types/index';
import { getCuratedHotelsForSite } from '../data/curatedHotelsData';

export interface FetchHotelsParams {
  siteId?: string;
  placeName: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Service to retrieve hotel suggestions for a monument or traveler location.
 * First queries the server API (/api/hotels/nearby), which merges curated database
 * stays with Gemini AI suggestions and in-memory caching.
 * If server is offline or fails, falls back seamlessly to client curated dataset.
 */
export async function fetchNearbyHotels(params: FetchHotelsParams): Promise<{
  hotels: HotelItem[];
  source: 'hybrid' | 'curated' | 'fallback';
}> {
  const { siteId, placeName, city = 'Delhi', latitude, longitude } = params;

  try {
    const queryParts: string[] = [];
    if (siteId) queryParts.push(`siteId=${encodeURIComponent(siteId)}`);
    if (placeName) queryParts.push(`place=${encodeURIComponent(placeName)}`);
    if (city) queryParts.push(`city=${encodeURIComponent(city)}`);
    if (latitude !== undefined) queryParts.push(`lat=${encodeURIComponent(String(latitude))}`);
    if (longitude !== undefined) queryParts.push(`lng=${encodeURIComponent(String(longitude))}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`/api/hotels/nearby${queryString}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        return {
          hotels: json.data,
          source: json.source || 'hybrid',
        };
      }
    }
  } catch (err) {
    console.warn('[HotelService] Server API request failed. Using curated local fallback:', err);
  }

  // Resilient fallback to local curated stays
  const fallbackList = getCuratedHotelsForSite(siteId || '', city);
  return {
    hotels: fallbackList,
    source: 'fallback',
  };
}
