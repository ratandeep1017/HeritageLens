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
      console.warn(`[Gemini Server] Model ${model} failed (${err.message?.slice(0, 80)}). Trying next...`);
    }
  }
  throw lastErr || new Error('All Gemini fallback models exhausted.');
}

/**
 * 1. Identify monument / landmark from image (base64 or remote URL).
 */
export async function identifyMonumentImage(imageDataUrl, preferredLang = 'en') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server environment.');
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
      throw new Error('Failed to parse response JSON from Gemini.');
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
    throw new Error('GEMINI_API_KEY is not configured on the server environment.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a cultural landmarks guide, architectural expert, and heritage researcher specializing in Delhi NCR, India, and famous world destinations.
Your task is to evaluate user queries for real places and generate rich, structured JSON dossiers.
Return ONLY valid JSON without backticks.`;

  const promptText = `Generate a complete structured JSON dossier for the place: "${query}".
Format as a single JSON object with these exact keys:
{
  "isRealHeritageSite": true,
  "name": "Full English Name",
  "hindiName": "हिन्दी नाम",
  "shortDescription": "2-3 sentences overview in English",
  "hindiShortDescription": "2-3 sentences overview in Hindi",
  "fullHistory": "Comprehensive 3-4 paragraph historical narrative in English",
  "hindiFullHistory": "Comprehensive historical narrative in Hindi",
  "builtYear": "e.g. 1648 CE or 14th Century",
  "builtBy": "e.g. Shah Jahan or Ancient rulers",
  "architecturalStyle": "e.g. Indo-Islamic Mughal or Nagara Temple Style",
  "culturalSignificance": "Detailed cultural and spiritual significance in English",
  "hindiCulturalSignificance": "Cultural significance in Hindi",
  "interestingFacts": ["fact 1", "fact 2", "fact 3"],
  "hindiInterestingFacts": ["तथ्य 1", "तथ्य 2", "तथ्य 3"],
  "folkloreOrLegends": ["folklore 1", "folklore 2"],
  "hindiFolkloreOrLegends": ["लोककथा 1", "लोककथा 2"],
  "travelTips": {
    "timings": "e.g. Sunrise to Sunset (Closed Mondays)",
    "entryFee": "e.g. ₹50 (Indians), ₹600 (Foreigners)",
    "nearestMetro": "e.g. Chandni Chowk Metro (Yellow Line)",
    "bestTimeToVisit": "e.g. October to March (Early morning or late afternoon)",
    "rules": ["rule 1", "rule 2"]
  },
  "nearbyAttractions": [
    { "name": "Name", "distance": "500 m", "description": "Short info" }
  ],
  "imageAlt": "Visual description",
  "sourceNote": "Official Archaeological Records & Historical Archives",
  "tags": ["Heritage", "Monument", "Delhi NCR"]
}`;

  const { response, model } = await callGemini(ai, {
    contents: promptText,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  });

  const rawText = response?.text || '';
  const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  return {
    ...parsed,
    modelUsed: model,
  };
}
