/**
 * Geolocation & State Registry for HeritageLens AI across all Indian States.
 * Provides verified GPS coordinates and state affiliations for heritage sites.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// Well-known coordinates for famous monuments and heritage hubs across Indian states
export const MONUMENT_COORDINATE_REGISTRY: Record<string, LatLng> = {
  // Delhi
  'red-fort': { lat: 28.6562, lng: 77.2410 },
  'humayun-tomb': { lat: 28.5933, lng: 77.2507 },
  'qutub-minar': { lat: 28.5245, lng: 77.1855 },
  'lotus-temple': { lat: 28.5535, lng: 77.2588 },
  'india-gate': { lat: 28.6129, lng: 77.2295 },
  'bangla-sahib': { lat: 28.6264, lng: 77.2091 },
  'gurudwara-bangla-sahib': { lat: 28.6264, lng: 77.2091 },
  'sis-ganj-sahib': { lat: 28.655988, lng: 77.232561 },
  'gurudwara-sis-ganj-sahib': { lat: 28.655988, lng: 77.232561 },
  'sis-ganj': { lat: 28.655988, lng: 77.232561 },
  'jama-masjid': { lat: 28.6507, lng: 77.2334 },
  'hauz-khas-complex': { lat: 28.5535, lng: 77.1944 },
  'jantar-mantar': { lat: 28.6271, lng: 77.2166 },
  'agrasen-ki-baoli': { lat: 28.6258, lng: 77.2250 },
  'purana-qila': { lat: 28.6096, lng: 77.2437 },
  'akshardham-delhi': { lat: 28.6127, lng: 77.2773 },
  'safdarjung-tomb': { lat: 28.5893, lng: 77.2106 },

  // Punjab
  'golden-temple': { lat: 31.6200, lng: 74.8765 },
  'harmandir-sahib': { lat: 31.6200, lng: 74.8765 },
  'jallianwala-bagh': { lat: 31.6206, lng: 74.8801 },
  'wagah-border': { lat: 31.6047, lng: 74.5732 },
  'qila-mubarak': { lat: 30.3256, lng: 76.4022 },

  // Uttar Pradesh
  'taj-mahal': { lat: 27.1751, lng: 78.0421 },
  'agra-fort': { lat: 27.1795, lng: 78.0211 },
  'fatehpur-sikri': { lat: 27.0945, lng: 77.6679 },
  'kashi-vishwanath': { lat: 25.3109, lng: 83.0107 },
  'dashashwamedh-ghat': { lat: 25.3072, lng: 83.0104 },
  'iskcon-temple-noida': { lat: 28.5833, lng: 77.3486 },
  'sarnath': { lat: 25.3811, lng: 83.0214 },

  // Rajasthan
  'amer-fort': { lat: 26.9855, lng: 75.8513 },
  'hawa-mahal': { lat: 26.9239, lng: 75.8267 },
  'city-palace-jaipur': { lat: 26.9258, lng: 75.8236 },
  'jantar-mantar-jaipur': { lat: 26.9248, lng: 75.8246 },
  'mehrangarh-fort': { lat: 26.2978, lng: 73.0185 },
  'city-palace-udaipur': { lat: 24.5764, lng: 73.6835 },

  // Karnataka
  'virupaksha-temple': { lat: 15.3350, lng: 76.4600 },
  'hampi': { lat: 15.3350, lng: 76.4600 },
  'stone-chariot': { lat: 15.3392, lng: 76.4746 },
  'mysore-palace': { lat: 12.3052, lng: 76.6552 },
  'badami-caves': { lat: 15.9189, lng: 75.6766 },

  // Maharashtra
  'gateway-of-india': { lat: 18.9220, lng: 72.8347 },
  'elephanta-caves': { lat: 18.9633, lng: 72.9315 },
  'ajanta-caves': { lat: 20.5519, lng: 75.7033 },
  'ellora-caves': { lat: 20.0268, lng: 75.1793 },
  'chhatrapati-shivaji-terminus': { lat: 18.9398, lng: 72.8355 },

  // Tamil Nadu
  'meenakshi-temple': { lat: 9.9195, lng: 78.1193 },
  'brihadeeswarar-temple': { lat: 10.7828, lng: 79.1318 },
  'shore-temple-mamallapuram': { lat: 12.6163, lng: 80.1983 },

  // West Bengal
  'victoria-memorial': { lat: 22.5448, lng: 88.3426 },
  'howrah-bridge': { lat: 22.5851, lng: 88.3468 },

  // Gujarat
  'rani-ki-vav': { lat: 23.8589, lng: 72.1017 },
  'somnath-temple': { lat: 20.8880, lng: 70.4012 },
  'sun-temple-modhera': { lat: 23.5835, lng: 72.1331 },

  // Odisha
  'konark-sun-temple': { lat: 19.8876, lng: 86.0945 },
  'jagannath-temple': { lat: 19.8049, lng: 85.8179 },

  // Madhya Pradesh
  'khajuraho-temples': { lat: 24.8518, lng: 79.9250 },
  'sanchi-stupa': { lat: 23.4795, lng: 77.7397 },
  'gwalior-fort': { lat: 26.2307, lng: 78.1695 },
};

// State centroids for fallback centering
export const STATE_CENTROIDS: Record<string, LatLng> = {
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'punjab': { lat: 31.1471, lng: 75.3412 },
  'uttar pradesh': { lat: 26.8467, lng: 80.9462 },
  'rajasthan': { lat: 27.0238, lng: 74.2179 },
  'karnataka': { lat: 15.3173, lng: 75.7139 },
  'maharashtra': { lat: 19.7515, lng: 75.7139 },
  'tamil nadu': { lat: 11.1271, lng: 78.6569 },
  'west bengal': { lat: 22.9868, lng: 87.8550 },
  'gujarat': { lat: 22.2587, lng: 71.1924 },
  'madhya pradesh': { lat: 22.9734, lng: 78.6569 },
  'odisha': { lat: 20.9517, lng: 85.0985 },
  'bihar': { lat: 25.0961, lng: 85.3131 },
  'kerala': { lat: 10.8505, lng: 76.2711 },
  'telangana': { lat: 18.1124, lng: 79.0193 },
  'andhra pradesh': { lat: 15.9129, lng: 79.7400 },
  'goa': { lat: 15.2993, lng: 74.1240 },
  'himachal pradesh': { lat: 31.1048, lng: 77.1734 },
  'uttarakhand': { lat: 30.0668, lng: 79.0193 },
  'jammu and kashmir': { lat: 33.7782, lng: 76.5762 },
};

export const STATE_HINDI_NAMES: Record<string, string> = {
  'Delhi': 'दिल्ली',
  'Punjab': 'पंजाब',
  'Uttar Pradesh': 'उत्तर प्रदेश',
  'Rajasthan': 'राजस्थान',
  'Karnataka': 'कर्नाटक',
  'Maharashtra': 'महाराष्ट्र',
  'Tamil Nadu': 'तमिलनाडु',
  'West Bengal': 'पश्चिम बंगाल',
  'Gujarat': 'गुजरात',
  'Madhya Pradesh': 'मध्य प्रदेश',
  'Odisha': 'ओडिशा',
  'Bihar': 'बिहार',
  'Kerala': 'केरल',
  'Telangana': 'तेलंगाना',
  'Andhra Pradesh': 'आंध्र प्रदेश',
  'Goa': 'गोवा',
  'Himachal Pradesh': 'हिमाचल प्रदेश',
  'Uttarakhand': 'उत्तराखंड',
  'Jammu and Kashmir': 'जम्मू एवं कश्मीर',
};

/**
 * Resolves reliable coordinates for any site using site properties or geographic fallback.
 */
export function resolveSiteCoordinates(site: {
  id?: string;
  name?: string;
  state?: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
}): LatLng | null {
  // 1. Direct coordinates
  if (typeof site.latitude === 'number' && typeof site.longitude === 'number' && !isNaN(site.latitude) && site.latitude !== 0) {
    return { lat: site.latitude, lng: site.longitude };
  }
  if (site.coordinates && typeof site.coordinates.lat === 'number' && typeof site.coordinates.lng === 'number' && site.coordinates.lat !== 0) {
    return { lat: site.coordinates.lat, lng: site.coordinates.lng };
  }

  // 2. ID match
  const siteId = (site.id || '').toLowerCase().trim();
  if (MONUMENT_COORDINATE_REGISTRY[siteId]) {
    return MONUMENT_COORDINATE_REGISTRY[siteId];
  }

  // 3. Name keywords match
  const nameLower = (site.name || '').toLowerCase();
  for (const [key, coords] of Object.entries(MONUMENT_COORDINATE_REGISTRY)) {
    const keyClean = key.replace(/-/g, ' ');
    if (nameLower.includes(keyClean) || keyClean.includes(nameLower)) {
      return coords;
    }
  }

  // 4. State centroid match
  const stateLower = (site.state || '').toLowerCase().trim();
  if (STATE_CENTROIDS[stateLower]) {
    return STATE_CENTROIDS[stateLower];
  }

  // Default to National Capital Delhi center
  return STATE_CENTROIDS['delhi'];
}

/**
 * Detects state from site name and text if not explicitly provided.
 */
export function inferStateFromText(text: string): { state: string; hindiState: string } {
  const lower = (text || '').toLowerCase();

  if (/golden temple|harmandir|amritsar|punjab|jallianwala|wagah/i.test(lower)) {
    return { state: 'Punjab', hindiState: 'पंजाब' };
  }
  if (/taj mahal|agra|varanasi|kashi|fatehpur|sarnath|mathura|vrindavan|ayodhya|noida|uttar pradesh/i.test(lower)) {
    return { state: 'Uttar Pradesh', hindiState: 'उत्तर प्रदेश' };
  }
  if (/jaipur|udaipur|jodhpur|jaisalmer|amer|hawa mahal|city palace|mehrangarh|rajasthan/i.test(lower)) {
    return { state: 'Rajasthan', hindiState: 'राजस्थान' };
  }
  if (/hampi|virupaksha|mysore|badami|pattadakal|belur|karnataka|bengaluru/i.test(lower)) {
    return { state: 'Karnataka', hindiState: 'कर्नाटक' };
  }
  if (/mumbai|gateway of india|elephanta|ajanta|ellora|aurangabad|pune|maharashtra/i.test(lower)) {
    return { state: 'Maharashtra', hindiState: 'महाराष्ट्र' };
  }
  if (/madurai|meenakshi|thanjavur|brihadeeswarar|mamallapuram|chennai|tamil nadu/i.test(lower)) {
    return { state: 'Tamil Nadu', hindiState: 'तमिलनाडु' };
  }
  if (/kolkata|victoria memorial|howrah|darjeeling|west bengal/i.test(lower)) {
    return { state: 'West Bengal', hindiState: 'पश्चिम बंगाल' };
  }
  if (/ahmedabad|rani ki vav|somnath|dwarka|modhera|gujarat/i.test(lower)) {
    return { state: 'Gujarat', hindiState: 'गुजरात' };
  }
  if (/khajuraho|sanchi|gwalior|bhimbetka|madhya pradesh/i.test(lower)) {
    return { state: 'Madhya Pradesh', hindiState: 'मध्य प्रदेश' };
  }
  if (/konark|puri|jagannath|bhubaneswar|odisha/i.test(lower)) {
    return { state: 'Odisha', hindiState: 'ओडिशा' };
  }

  return { state: 'Delhi', hindiState: 'दिल्ली' };
}

/**
 * Dynamically queries live geocoding APIs (Server Proxy -> Nominatim -> Wikipedia)
 * to resolve exact, real-time GPS coordinates for ANY monument in India or worldwide.
 */
export async function fetchLiveCoordinates(
  siteName: string,
  state?: string,
  areaName?: string
): Promise<LatLng | null> {
  const cleanName = siteName.replace(/\(.*?\)/g, '').trim();
  const query = `${cleanName} ${areaName ? areaName.split('(')[0] : ''} ${state || ''} India`.trim();

  // 1. First try server-side geocoding endpoint
  try {
    const srvRes = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
    if (srvRes.ok) {
      const srvData = await srvRes.json();
      if (srvData.success && typeof srvData.lat === 'number' && typeof srvData.lng === 'number') {
        return { lat: srvData.lat, lng: srvData.lng };
      }
    }
  } catch (e) {
    // Continue to direct browser fallbacks
  }

  // 2. Direct OpenStreetMap Nominatim geocoding (client-side)
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const nomRes = await fetch(nomUrl, {
      headers: { 'User-Agent': 'HeritageLens/1.0 (contact@heritagelens.ai)' }
    });
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData) && nomData.length > 0) {
        const lat = parseFloat(nomData[0].lat);
        const lng = parseFloat(nomData[0].lon);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          return { lat, lng };
        }
      }
    }
  } catch (e) {
    // Continue to Wikipedia fallback
  }

  // 3. Direct Wikipedia Geosearch API (CORS origin=*)
  try {
    const wikiTitle = cleanName.replace(/\s+/g, '_');
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&titles=${encodeURIComponent(wikiTitle)}&format=json&origin=*`;
    const wikiRes = await fetch(wikiUrl);
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      const pages = wikiData?.query?.pages;
      if (pages) {
        for (const pid in pages) {
          const coords = pages[pid]?.coordinates;
          if (Array.isArray(coords) && coords.length > 0) {
            const lat = coords[0].lat;
            const lng = coords[0].lon;
            if (typeof lat === 'number' && typeof lng === 'number') {
              return { lat, lng };
            }
          }
        }
      }
    }
  } catch (e) {
    // Safe fallback
  }

  return null;
}
