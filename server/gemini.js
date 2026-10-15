import { GoogleGenAI } from '@google/genai';

const modelsToTry = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-4-argon',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash'
];

function getApiKey() {
  return (process.env.GEMINI_API_KEY || '').trim();
}

export function isGeminiAvailable() {
  return Boolean(getApiKey());
}

/**
 * Robust caller through multiple fallback models.
 */
async function callGemini(ai, requestConfig) {
  let lastErr = null;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...requestConfig,
        model,
      });
      return { response, model };
    } catch (err) {
      lastErr = err;
      console.warn(`[AI Server] Model ${model} failed (${err.message?.slice(0, 80)}). Trying next...`);
    }
  }
  throw lastErr || new Error('All AI fallback models exhausted.');
}

/**
 * 1. Identify monument / landmark from image (base64 or remote URL).
 */
export async function identifyMonumentImage(imageDataUrl, preferredLang = 'en') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('AI Vision service is not configured on the server environment.');
  }

  const ai = new GoogleGenAI({ apiKey });

  // Extract base64 and mime
  let mimeType = 'image/jpeg';
  let base64Data = imageDataUrl;

  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
  if (match) {
    mimeType = match[1];
    base64Data = match[2];
  }

  const systemInstruction = `You are a precision computer vision system and architectural landmarks guide specializing in Delhi NCR, Indian, and world heritage landmarks, famous places, temples, monuments, and iconic spots.
Your task is to identify whether an uploaded photograph depicts a historical monument, temple, spiritual center, palace, fort, memorial, museum, iconic cultural spot, or famous landmark.

CRITICAL INSTRUCTIONS:
- You must return ONLY a single, valid JSON object without markdown fences, formatting, or commentary.
- Identify the exact canonical name of the place depicted in the image (e.g. "Lotus Temple", "India Gate", "Red Fort", "Qutub Minar", "Humayun's Tomb", "Taj Mahal", "Agrasen ki Baoli").
- If the image depicts a real landmark, famous place, temple, cultural spot, or monument, set isHeritageSite to true and provide confidence between 0.50 and 1.0.
- If the image is not clear, blurry, or unrelated (e.g. personal selfie, pet, food, car), set bestMatchName to "Unknown", isHeritageSite to false, and confidence between 0.0 and 0.3.
- Keep reasoning concise (1-2 sentences) focused on observable architectural and visual features.
- Set needsVerification to true if confidence is below 0.70 or photo is from an unusual angle.`;

  const promptText = `Analyze this image and return the JSON object matching this exact schema:
{
  "bestMatchName": "Exact Place / Monument Name or 'Unknown'",
  "confidence": number,
  "reasoning": "Concise visual/architectural observation of key visible elements",
  "alternativeMatches": string[],
  "isHeritageSite": boolean,
  "needsVerification": boolean
}`;

  const { response, model } = await callGemini(ai, {
    contents: [
      {
        role: 'user',
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  });

  const rawText = response?.text || '';
  let parsed;
  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch (e) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse response JSON from AI engine.');
    }
  }

  return {
    ...parsed,
    modelUsed: model,
  };
}

/**
 * 2. Generate full structured heritage site dossier from place name / query.
 */
export async function generateSiteDossier(query, preferredLang = 'en') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('AI Vision service is not configured on the server environment.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a cultural landmarks guide, architectural expert, and heritage researcher.
Your task is to strictly evaluate whether a user's query refers to a REAL, PHYSICAL landmark, monument, cultural site, temple, museum, or historic location on Earth.

STRICT REJECTION RULES:
You MUST reject and return "isRealHeritageSite": false if the query:
1. Is illegal, dangerous, weapons, violence, drugs, contraband, adult, or inappropriate.
2. Is NOT a physical place or monument (e.g. an object, gadget, animal, person, software, company, food, abstract concept).
3. Does NOT exist or is purely fictional/fantasy/mythological (e.g. Hogwarts, Wakanda, Gotham City, Atlantis).
4. Is random gibberish, meaningless typing, or an unrecognized term.
In any of these cases, do NOT fabricate or hallucinate a place. Return ONLY:
{
  "isRealHeritageSite": false,
  "rejectionReason": "Nothing found. \\"${query}\\" is not a recognized monument, cultural heritage site, or real physical place."
}

ACCEPTANCE RULES:
Accept ONLY if the query is a genuine, verified physical place, historic monument, spiritual site, or cultural landmark (e.g. Taj Mahal, Red Fort, ISKCON Temple, Lotus Temple, Qutub Minar).
Return ONLY valid JSON without backticks.`;

  const promptText = `Evaluate this query: "${query}".
If it is NOT a real existing place, monument, or cultural landmark (or if it is illegal, an object, fictional, or gibberish), return:
{
  "isRealHeritageSite": false,
  "rejectionReason": "Nothing found. \\"${query}\\" is not a recognized monument, cultural heritage site, or real physical place."
}

If and ONLY IF it is a real physical landmark/monument, return:
{
  "isRealHeritageSite": true,
  "name": "Full English Name",
  "hindiName": "हिन्दी नाम",
  "state": "Official Indian State or Union Territory (e.g. 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Delhi', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'West Bengal')",
  "hindiState": "राज्य का नाम हिंदी में (जैसे 'पंजाब', 'उत्तर प्रदेश', 'राजस्थान', 'दिल्ली', 'कर्नाटक')",
  "city": "City or District (e.g. 'Amritsar', 'Agra', 'Jaipur', 'Noida', 'New Delhi', 'Mumbai')",
  "hindiCity": "शहर या जिले का नाम हिंदी में",
  "coordinates": {
    "lat": 31.6200,
    "lng": 74.8765
  },
  "latitude": 31.6200,
  "longitude": 74.8765,
  "shortDescription": "2-3 sentences overview in English",
  "hindiShortDescription": "2-3 sentences overview in Hindi",
  "fullHistory": "Comprehensive 3-4 paragraph historical narrative in English",
  "hindiFullHistory": "Comprehensive historical narrative in Hindi",
  "builtYear": "e.g. 1648 CE or 14th Century",
  "builtBy": "e.g. Shah Jahan or Ancient rulers",
  "architecturalStyle": "e.g. Indo-Islamic Mughal or Sikh Gurudwara Style or Nagara Temple Style",
  "culturalSignificance": "Detailed cultural and spiritual significance in English",
  "hindiCulturalSignificance": "Cultural significance in Hindi",
  "interestingFacts": ["fact 1", "fact 2", "fact 3"],
  "hindiInterestingFacts": ["तथ्य 1", "तथ्य 2", "तथ्य 3"],
  "folkloreOrLegends": ["folklore 1", "folklore 2"],
  "hindiFolkloreOrLegends": ["लोककथा 1", "लोककथा 2"],
  "travelTips": {
    "timings": "e.g. 4:00 AM – 10:00 PM or Sunrise to Sunset",
    "entryFee": "e.g. Free Entry or ₹50 (Indians), ₹600 (Foreigners)",
    "nearestMetro": "e.g. Amritsar Railway Station / Metro (if applicable) or nearest transit",
    "bestTimeToVisit": "e.g. October to March",
    "rules": ["rule 1", "rule 2"]
  },
  "nearbyAttractions": [
    { "name": "Name", "distance": "500 m", "description": "Short info" }
  ],
  "imageAlt": "Visual description",
  "sourceNote": "Official Archaeological Records & Historical Archives",
  "tags": ["Heritage", "Monument"]
}`;

  const { response, model } = await callGemini(ai, {
    contents: promptText,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  });

  const rawText = response?.text || '';
  let parsed;
  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch (e) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      return {
        isRealHeritageSite: false,
        rejectionReason: `Nothing found. "${query}" is not a recognized monument or place.`,
        modelUsed: model,
      };
    }
  }

  // Normalize coordinates and state
  const lat = typeof parsed.latitude === 'number' ? parsed.latitude : parsed.coordinates?.lat;
  const lng = typeof parsed.longitude === 'number' ? parsed.longitude : parsed.coordinates?.lng;
  if (typeof lat === 'number' && typeof lng === 'number') {
    parsed.latitude = lat;
    parsed.longitude = lng;
    parsed.coordinates = { lat, lng };
  }

  if (!parsed.state) {
    parsed.state = 'Delhi';
  }

  return {
    ...parsed,
    modelUsed: model,
  };
}

/**
 * 3. Search for real photograph URLs of a place using Gemini + Google Search grounding.
 *    This works reliably from any IP (including cloud datacenter IPs like Render/AWS)
 *    because it uses Google's own search infrastructure through the Gemini API.
 */
export async function searchImagesWithGemini(query) {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });

  const promptText = `Search for "${query}" and find 12 real, publicly accessible photographs.
Return ONLY a valid JSON array of objects. Each object must have:
- "title": descriptive title of the image (string)
- "url": direct URL to the image file, must end in .jpg, .jpeg, .png, or .webp (string)
- "source": the website name where the image is hosted (string)

RULES:
- Every URL must be a REAL, working direct link to an actual image file
- Prefer travel photography blogs, tourism sites, Wikimedia Commons, Flickr, and stock photo sites
- Focus on photos showing the actual place/monument/building itself
- Do NOT invent or guess URLs - only include URLs you can verify from search results
- Do NOT include placeholder or generic stock images
- Return the JSON array directly without markdown formatting`;

  // Try models that support Google Search grounding
  const searchModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  
  for (const model of searchModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: promptText,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response?.text || '';
      
      // Parse JSON array from response
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const items = JSON.parse(jsonMatch[0]);
          if (Array.isArray(items) && items.length > 0) {
            const validItems = items
              .filter(item => item.url && typeof item.url === 'string' && item.url.startsWith('http') && /\.(jpg|jpeg|png|webp)($|\?)/i.test(item.url))
              .map((item, idx) => ({
                id: `img-${idx}-${Date.now()}`,
                title: item.title || query,
                url: item.url,
                thumbUrl: item.url,
                source: item.source ? item.source : 'Web Archives',
              }));
            
            if (validItems.length > 0) {
              console.log(`[AI Image Search] Found ${validItems.length} images for "${query}" via ${model}`);
              return validItems;
            }
          }
        } catch (parseErr) {
          console.warn(`[AI Image Search] JSON parse error for ${model}:`, parseErr.message);
        }
      }

      // Fallback: extract only direct image URLs from grounding metadata
      const candidate = response?.candidates?.[0];
      const groundingChunks = candidate?.groundingMetadata?.groundingChunks;
      if (groundingChunks && groundingChunks.length > 0) {
        const webResults = groundingChunks
          .filter(chunk => chunk.web?.uri && /\.(jpg|jpeg|png|webp)($|\?)/i.test(chunk.web.uri))
          .map((chunk, idx) => ({
            id: `img-g-${idx}-${Date.now()}`,
            title: chunk.web.title || query,
            url: chunk.web.uri,
            thumbUrl: chunk.web.uri,
            source: 'Web Archives',
          }));
        if (webResults.length > 0) {
          console.log(`[AI Image Search] Found ${webResults.length} grounding image results for "${query}"`);
          return webResults;
        }
      }
    } catch (err) {
      console.warn(`[AI Image Search] Model ${model} failed:`, err.message?.slice(0, 100));
    }
  }

  return [];
}

