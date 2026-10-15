import fetch from 'node-fetch';

/**
 * Google Places & Google Maps Photos API Service
 * 
 * Searches Google Places (New and Legacy APIs) by monument/place name
 * and retrieves verified, high-resolution photographs directly from
 * the official Google Maps listing.
 */

export function getGooglePlacesApiKey() {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_SEARCH_API_KEY ||
    ''
  ).trim();
}

export function isGooglePlacesConfigured() {
  return Boolean(getGooglePlacesApiKey());
}

/**
 * Searches for a place by text query and retrieves all verified photos from Google Maps.
 * Returns an array of image items: { id, title, url, thumbUrl, source, description }
 */
export async function searchPlacePhotos(query) {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey || !query) return [];

  const cleanQuery = query.replace(/\(.*?\)/g, '').trim() || query;
  const photos = [];

  // ========================================================
  // Method 1: Google Places API (New) - places.googleapis.com
  // ========================================================
  try {
    const newApiUrl = 'https://places.googleapis.com/v1/places:searchText';
    const res = await fetch(newApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos',
      },
      body: JSON.stringify({
        textQuery: cleanQuery,
        maxResultCount: 3,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const places = data.places || [];

      for (const place of places) {
        const placeName = place.displayName?.text || cleanQuery;
        const placeAddress = place.formattedAddress || '';
        const placePhotos = place.photos || [];

        for (let i = 0; i < placePhotos.length; i++) {
          const photo = placePhotos[i];
          if (!photo.name) continue;

          // Request direct CDN URL using skipHttpRedirect=true (returns JSON with photoUri)
          let directPhotoUri = null;
          try {
            const mediaUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=1200&maxWidthPx=1600&skipHttpRedirect=true&key=${apiKey}`;
            const mediaRes = await fetch(mediaUrl);
            if (mediaRes.ok) {
              const mediaData = await mediaRes.json();
              if (mediaData.photoUri) {
                directPhotoUri = mediaData.photoUri;
              }
            }
          } catch (e) {
            console.warn('[Google Places New] photoUri fetch skipped:', e.message);
          }

          const finalUrl = directPhotoUri || `/api/places/photo-proxy?name=${encodeURIComponent(photo.name)}`;
          const thumbUrl = directPhotoUri || `/api/places/photo-proxy?name=${encodeURIComponent(photo.name)}&max=600`;

          photos.push({
            id: `places-new-${photo.name.replace(/[^a-zA-Z0-9]/g, '_').slice(-25)}-${i}`,
            title: `${placeName} · Google Maps Photo`,
            url: finalUrl,
            thumbUrl: thumbUrl,
            source: 'Google Maps · Verified Place Photo',
            description: placeAddress,
          });
        }
      }

      if (photos.length > 0) {
        console.log(`[Google Places] Found ${photos.length} verified photos for "${cleanQuery}" via Places API (New)`);
        return photos;
      }
    }
  } catch (err) {
    console.warn('[Google Places New] Error:', err.message);
  }

  // ========================================================
  // Method 2: Google Places API (Legacy) - maps.googleapis.com
  // ========================================================
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(cleanQuery)}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const results = searchData.results || [];

      for (const place of results.slice(0, 2)) {
        const placeName = place.name || cleanQuery;
        const placeAddress = place.formatted_address || '';
        const placePhotos = place.photos || [];

        for (let i = 0; i < placePhotos.length; i++) {
          const p = placePhotos[i];
          const photoRef = p.photo_reference;
          if (!photoRef) continue;

          // Attempt to resolve direct lh3.googleusercontent CDN URL by inspecting 302 redirect
          let directPhotoUrl = null;
          try {
            const redirectUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=${encodeURIComponent(photoRef)}&key=${apiKey}`;
            const headRes = await fetch(redirectUrl, { redirect: 'manual' });
            const loc = headRes.headers.get('location');
            if (loc && loc.startsWith('http')) {
              directPhotoUrl = loc;
            }
          } catch {}

          const finalUrl = directPhotoUrl || `/api/places/photo-proxy?ref=${encodeURIComponent(photoRef)}`;
          const thumbUrl = directPhotoUrl || `/api/places/photo-proxy?ref=${encodeURIComponent(photoRef)}&max=600`;

          photos.push({
            id: `gmaps-legacy-${photoRef.slice(0, 20)}-${i}`,
            title: `${placeName} · Google Maps Photo`,
            url: finalUrl,
            thumbUrl: thumbUrl,
            source: 'Google Maps · Verified Place Photo',
            description: placeAddress,
          });
        }
      }

      if (photos.length > 0) {
        console.log(`[Google Places] Found ${photos.length} verified photos for "${cleanQuery}" via Legacy API`);
        return photos;
      }
    }
  } catch (err) {
    console.warn('[Google Places Legacy] Error:', err.message);
  }

  return photos;
}
