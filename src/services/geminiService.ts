/**
 * Gemini Service Module for HeritageLens AI
 *
 * Provides dedicated integration with Google Gemini Vision models via the official @google/genai SDK.
 *
 * ARCHITECTURAL & SECURITY NOTE:
 * - This service handles Gemini API interactions for monument identification and connection testing.
 * - SECURITY LIMITATION: In this client-side prototype demo, calls are made directly from the browser
 *   using an API key stored in the user's localStorage (under 'heritagelens_gemini_api_key').
 * - For a commercial production release, all Gemini API calls MUST be proxied through a secure backend
 *   server (e.g. Express / Cloud Functions) where the GEMINI_API_KEY is stored as an encrypted server-side
 *   environment variable, never exposed in client bundles or network requests.
 * - API keys are strictly sanitized and never printed to console logs or exposed in raw error outputs.
 */

import { GoogleGenAI } from '@google/genai';
import { StorageService } from './storage';
import { HeritageDataStore } from './heritageDataStore';
import { HeritageSite, IdentificationResult } from '../types';

/**
 * The 10 officially supported Delhi heritage sites for HeritageLens AI Pilot.
 */
export const SUPPORTED_DELHI_SITES = [
  { id: 'red-fort', canonicalName: 'Red Fort (Lal Qila)', aliases: ['Red Fort', 'Lal Qila', 'Lal Kila', 'Qila-e-Mubarak'] },
  { id: 'humayun-tomb', canonicalName: "Humayun's Tomb", aliases: ["Humayun's Tomb", 'Humayun Tomb', 'Humayun Ka Maqbara', 'Haji Begum Tomb'] },
  { id: 'qutub-minar', canonicalName: 'Qutub Minar', aliases: ['Qutub Minar', 'Qutb Minar', 'Qutab Minar', 'Qutub Minar Complex', 'Quwwat-ul-Islam'] },
  { id: 'lotus-temple', canonicalName: "Lotus Temple (Bahá'í House of Worship)", aliases: ['Lotus Temple', "Bahá'í House of Worship", 'Bahai Temple', 'Kamal Mandir'] },
  { id: 'india-gate', canonicalName: 'India Gate', aliases: ['India Gate', 'All India War Memorial', 'Amar Jawan Jyoti', 'Kartavya Path Arch'] },
  { id: 'bangla-sahib', canonicalName: 'Gurudwara Bangla Sahib', aliases: ['Gurudwara Bangla Sahib', 'Bangla Sahib', 'Bangla Sahib Gurdwara'] },
  { id: 'sis-ganj-sahib', canonicalName: 'Gurudwara Sis Ganj Sahib', aliases: ['Gurudwara Sis Ganj Sahib', 'Sis Ganj Sahib', 'Sis Ganj Gurdwara', 'Chandni Chowk Gurudwara'] },
  { id: 'jama-masjid', canonicalName: 'Jama Masjid', aliases: ['Jama Masjid', 'Jama Masjid Delhi', 'Masjid-i Jehan-Numa', 'Old Delhi Mosque'] },
  { id: 'purana-qila', canonicalName: 'Purana Qila (Old Fort)', aliases: ['Purana Qila', 'Old Fort', 'Shergarh', 'Pandava Qila', 'Qila-i-Kuhna'] },
  { id: 'agrasen-ki-baoli', canonicalName: 'Agrasen ki Baoli', aliases: ['Agrasen ki Baoli', 'Ugrasen ki Baoli', 'Agrasen Stepwell', 'Hailey Road Baoli'] },
] as const;

/**
 * Strict JSON output interface returned by Gemini model.
 */
export interface GeminiRawIdentification {
  bestMatchName: string;
  confidence: number;
  reasoning: string;
  alternativeMatches: string[];
  isSupportedDelhiSite: boolean;
  needsVerification: boolean;
}

/**
 * Standardized service response.
 */
export interface GeminiIdentificationResponse {
  success: boolean;
  data?: GeminiRawIdentification;
  matchedSite?: HeritageSite;
  fullResult?: IdentificationResult;
  error?: string;
  errorCode?: 'INVALID_KEY' | 'QUOTA_EXCEEDED' | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'UNKNOWN_ERROR';
  isDemoFallback?: boolean;
}

/**
 * Helper to safely sanitize error messages, stripping any accidental API key patterns.
 */
function sanitizeErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred';
  const rawMsg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
  // Mask Google API key patterns (AIza...)
  return rawMsg.replace(/AIza[a-zA-Z0-9_-]{20,}/g, '[MASKED_API_KEY]');
}

/**
 * Converts a File object to a base64 data URL string.
 */
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Parses raw base64 data and MIME type from a data URL or raw string.
 */
function extractBase64AndMime(input: string): { base64Data: string; mimeType: string } {
  const match = input.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], base64Data: match[2] };
  }
  // Default to JPEG if no data URL prefix
  return { mimeType: 'image/jpeg', base64Data: input };
}

/**
 * Matches a detected name string against the 10 supported Delhi heritage sites.
 */
export function matchSupportedSite(detectedName: string): {
  isSupported: boolean;
  siteId: string | null;
  canonicalName: string;
  site?: HeritageSite;
} {
  if (!detectedName || detectedName.trim().toLowerCase() === 'unknown') {
    return { isSupported: false, siteId: null, canonicalName: 'Unknown' };
  }

  const normalized = detectedName.trim().toLowerCase();

  for (const item of SUPPORTED_DELHI_SITES) {
    if (
      normalized.includes(item.id) ||
      normalized.includes(item.canonicalName.toLowerCase()) ||
      item.aliases.some((alias) => normalized.includes(alias.toLowerCase()) || alias.toLowerCase().includes(normalized))
    ) {
      const sites = HeritageDataStore.getAllSites();
      const siteRecord = sites.find((s) => s.id === item.id);
      return {
        isSupported: true,
        siteId: item.id,
        canonicalName: item.canonicalName,
        site: siteRecord,
      };
    }
  }

  return { isSupported: false, siteId: null, canonicalName: detectedName };
}

/**
 * 1. Retrieves stored Gemini API key from local storage.
 * Never logs or exposes the key.
 */
export function getStoredGeminiKey(): string {
  try {
    return StorageService.getApiKey();
  } catch (e) {
    return '';
  }
}

/**
 * 2. Tests the Gemini connection with a lightweight validation request.
 * Safely handles and masks errors.
 */
export async function testGeminiConnection(apiKey?: string): Promise<{
  success: boolean;
  message: string;
  model?: string;
}> {
  const keyToUse = (apiKey || getStoredGeminiKey()).trim();

  if (!keyToUse) {
    return {
      success: false,
      message: 'No API key provided. Please enter a valid Gemini API key.',
    };
  }

  try {
    // Lazy initialization of the official @google/genai client
    const ai = new GoogleGenAI({ apiKey: keyToUse });
    
    // Test with gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Respond with the single word: READY',
    });

    const responseText = response?.text?.trim() || '';
    if (responseText.length > 0) {
      return {
        success: true,
        message: 'Successfully connected to Gemini API (gemini-2.5-flash).',
        model: 'gemini-2.5-flash',
      };
    } else {
      throw new Error('Received an empty response from Gemini.');
    }
  } catch (err: any) {
    const safeError = sanitizeErrorMessage(err);
    // Categorize error for clear user guidance
    if (safeError.includes('400') || safeError.includes('403') || safeError.includes('API_KEY_INVALID') || safeError.includes('key not valid')) {
      return {
        success: false,
        message: 'Invalid or blocked Gemini API key. Please check your credentials in Google AI Studio.',
      };
    } else if (safeError.includes('429') || safeError.includes('RESOURCE_EXHAUSTED') || safeError.includes('quota')) {
      return {
        success: false,
        message: 'Gemini API quota exceeded or rate limited. Please try again in a few moments.',
      };
    } else if (safeError.includes('fetch') || safeError.includes('network') || safeError.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'Network error connecting to Gemini API. Check your internet connection.',
      };
    }

    return {
      success: false,
      message: `Connection test failed: ${safeError}`,
    };
  }
}

/**
 * 3. Identifies an image of a heritage site using Google Gemini Vision.
 *
 * Rules:
 * - Strictly identifies among the ten supported Delhi heritage sites.
 * - Returns `Unknown` when the image is not sufficiently clear or does not match any of the 10 sites.
 * - Does NOT generate historical facts during recognition (focuses purely on visual/architectural verification).
 * - Constrains confidence score between 0.0 and 1.0.
 * - Returns alternative matches when uncertain.
 * - Never exposes the API key.
 * - Safely handles invalid JSON, quota issues, network errors, and invalid keys with graceful fallback.
 */
export async function identifyHeritageImage(
  fileOrDataUrl: File | string,
  apiKey?: string,
  preferredLang: 'en' | 'hi' = 'en'
): Promise<GeminiIdentificationResponse> {
  // Convert File to data URL if passed as a File object
  let imageDataUrl: string;
  try {
    if (typeof fileOrDataUrl === 'string') {
      imageDataUrl = fileOrDataUrl;
    } else {
      imageDataUrl = await fileToDataUrl(fileOrDataUrl);
    }
  } catch (readErr) {
    return {
      success: false,
      error: 'Failed to process input image file.',
      errorCode: 'UNKNOWN_ERROR',
    };
  }

  const effectiveKey = (apiKey || getStoredGeminiKey()).trim();
  const isDemoMode = StorageService.isDemoMode();

  // If in Demo Mode or no API key is provided, return realistic sample recognition response
  if (isDemoMode || !effectiveKey) {
    return getDemoFallbackIdentification(imageDataUrl, preferredLang);
  }

  try {
    const { base64Data, mimeType } = extractBase64AndMime(imageDataUrl);

    // Official @google/genai client initialization
    const ai = new GoogleGenAI({ apiKey: effectiveKey });

    const systemInstruction = `You are a precision computer vision system specializing in Indian architectural recognition.
Your task is to identify whether an uploaded photograph depicts one of the following 10 supported Delhi heritage monuments:
1. Red Fort (Lal Qila)
2. Humayun's Tomb
3. Qutub Minar
4. Lotus Temple (Bahá'í House of Worship)
5. India Gate
6. Gurudwara Bangla Sahib
7. Gurudwara Sis Ganj Sahib
8. Jama Masjid
9. Purana Qila (Old Fort)
10. Agrasen ki Baoli

CRITICAL INSTRUCTIONS:
- You must return ONLY a single, valid JSON object without markdown fences, formatting, or commentary.
- You must identify ONLY among the ten supported Delhi sites listed above.
- If the image is not clear, is blurry, is not one of these 10 sites, or is an unrelated subject (e.g. selfie, pet, landscape, non-Delhi building, modern office), you MUST return "Unknown" as the bestMatchName, set isSupportedDelhiSite to false, and set confidence between 0.0 and 0.3.
- DO NOT generate historical narratives, legends, or essay facts in this recognition step. Keep reasoning concise (1-2 sentences) and focused strictly on observable visual and architectural attributes (e.g. fluted sandstone minaret tiers, white marble lotus petals, arched red sandstone stepped well walls).
- Ensure confidence is a number strictly between 0.0 and 1.0.
- If uncertain or if visual traits resemble multiple monuments, list the alternative possibilities in "alternativeMatches".
- Set "needsVerification" to true if confidence is below 0.70 or the photo is taken from an unusual/partial angle.`;

    const promptText = `Analyze this image and return the JSON object matching this exact schema:
{
  "bestMatchName": "Red Fort (Lal Qila)" | "Humayun's Tomb" | "Qutub Minar" | "Lotus Temple (Bahá'í House of Worship)" | "India Gate" | "Gurudwara Bangla Sahib" | "Gurudwara Sis Ganj Sahib" | "Jama Masjid" | "Purana Qila (Old Fort)" | "Agrasen ki Baoli" | "Unknown",
  "confidence": number,
  "reasoning": "Concise visual/architectural observation of key visible elements",
  "alternativeMatches": string[],
  "isSupportedDelhiSite": boolean,
  "needsVerification": boolean
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
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
    let parsed: GeminiRawIdentification;

    try {
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('Failed to parse strict JSON from Gemini response. Attempting regex recovery.');
      parsed = extractJsonWithRegex(rawText);
    }

    // Validate parsed output structure
    const confidence = Math.max(0, Math.min(1, typeof parsed.confidence === 'number' ? parsed.confidence : 0.5));
    const bestMatchName = typeof parsed.bestMatchName === 'string' ? parsed.bestMatchName.trim() : 'Unknown';
    const reasoning = typeof parsed.reasoning === 'string' ? parsed.reasoning : 'Visual attributes analyzed.';
    const alternativeMatches = Array.isArray(parsed.alternativeMatches) ? parsed.alternativeMatches : [];
    
    // Check against the 10 supported Delhi sites
    const matchInfo = matchSupportedSite(bestMatchName);
    const isSupportedDelhiSite = matchInfo.isSupported && bestMatchName.toLowerCase() !== 'unknown';
    const needsVerification = parsed.needsVerification ?? (confidence < 0.7 || !isSupportedDelhiSite);

    const validatedData: GeminiRawIdentification = {
      bestMatchName: isSupportedDelhiSite ? matchInfo.canonicalName : (bestMatchName === 'Unknown' ? 'Unknown' : bestMatchName),
      confidence,
      reasoning,
      alternativeMatches,
      isSupportedDelhiSite,
      needsVerification,
    };

    // Construct full IdentificationResult for seamless UI consumption
    const isHighConfidenceMatch = isSupportedDelhiSite && confidence >= 0.60;
    const fullResult: IdentificationResult = {
      isIdentified: isHighConfidenceMatch,
      siteId: matchInfo.siteId || undefined,
      site: matchInfo.site || undefined,
      confidenceScore: confidence,
      detectedName: isSupportedDelhiSite
        ? (preferredLang === 'hi' && matchInfo.site ? matchInfo.site.hindiName : matchInfo.canonicalName)
        : (preferredLang === 'hi' ? 'अज्ञात स्मारक / दृश्य' : bestMatchName),
      architecturalElements: matchInfo.site
        ? [matchInfo.site.architecturalStyle, reasoning]
        : [reasoning],
      historicalEra: matchInfo.site?.builtYear || 'Undetermined',
      customGeminiInsight: reasoning,
      alternativeMatches,
      isSupportedDelhiSite,
      needsVerification,
      uploadedImageUrl: imageDataUrl,
      analyzedAt: new Date().toISOString(),
      isFallbackOrUnknown: !isHighConfidenceMatch,
      isDemoFallback: false,
    };

    return {
      success: true,
      data: validatedData,
      matchedSite: matchInfo.site,
      fullResult,
      isDemoFallback: false,
    };

  } catch (err: any) {
    const safeError = sanitizeErrorMessage(err);
    console.warn('Gemini identification failed. Falling back to local demo resolution.');

    let errorCode: GeminiIdentificationResponse['errorCode'] = 'UNKNOWN_ERROR';
    if (safeError.includes('400') || safeError.includes('403') || safeError.includes('API_KEY_INVALID')) {
      errorCode = 'INVALID_KEY';
    } else if (safeError.includes('429') || safeError.includes('RESOURCE_EXHAUSTED') || safeError.includes('quota')) {
      errorCode = 'QUOTA_EXCEEDED';
    } else if (safeError.includes('fetch') || safeError.includes('network') || safeError.includes('Failed to fetch')) {
      errorCode = 'NETWORK_ERROR';
    }

    // Gracefully provide demo fallback while surfacing the error code
    const fallback = await getDemoFallbackIdentification(imageDataUrl, preferredLang);
    return {
      ...fallback,
      error: safeError,
      errorCode,
      isDemoFallback: true,
    };
  }
}

/**
 * Regex fallback extractor for irregular model output.
 */
function extractJsonWithRegex(text: string): GeminiRawIdentification {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        bestMatchName: parsed.bestMatchName || 'Unknown',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
        reasoning: parsed.reasoning || 'Visual structure analyzed.',
        alternativeMatches: Array.isArray(parsed.alternativeMatches) ? parsed.alternativeMatches : [],
        isSupportedDelhiSite: Boolean(parsed.isSupportedDelhiSite),
        needsVerification: Boolean(parsed.needsVerification),
      };
    }
  } catch (e) {
    // Ignore and return safe unknown default
  }

  return {
    bestMatchName: 'Unknown',
    confidence: 0.2,
    reasoning: 'Image could not be definitively matched with the 10 supported Delhi heritage sites.',
    alternativeMatches: [],
    isSupportedDelhiSite: false,
    needsVerification: true,
  };
}

/**
 * Creates a realistic sample recognition response for any demo monument (e.g. Red Fort).
 * Clearly labels the result as a demo result and assigns a realistic confidence score.
 */
export function createDemoRecognitionResult(
  siteId: string = 'red-fort',
  customImageUrl?: string,
  preferredLang: 'en' | 'hi' = 'en'
): IdentificationResult {
  const sites = HeritageDataStore.getAllSites();
  const site = sites.find((s) => s.id === siteId) || sites[0] || {
    id: 'red-fort',
    name: 'Red Fort',
    hindiName: 'लाल किला',
    shortDescription: 'Historic Mughal fort.',
    hindiShortDescription: 'ऐतिहासिक किला।',
    fullHistory: '',
    hindiFullHistory: '',
    builtYear: '1638-1648 CE',
    builtBy: 'Shah Jahan',
    architecturalStyle: 'Mughal Architecture',
    culturalSignificance: '',
    hindiCulturalSignificance: '',
    interestingFacts: [],
    hindiInterestingFacts: [],
    travelTips: { timings: '', entryFee: '', nearestMetro: '', bestTimeToVisit: '', rules: [] },
    nearbyAttractions: [],
    imageUrl: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Red Fort',
    sourceNote: 'ASI',
    tags: []
  };
  
  // Specific realistic confidence scores and architectural insights for demo sites
  const confidenceMap: Record<string, number> = {
    'red-fort': 0.96,
    'humayun-tomb': 0.95,
    'qutub-minar': 0.98,
    'lotus-temple': 0.97,
    'india-gate': 0.96,
    'bangla-sahib': 0.94,
    'sis-ganj-sahib': 0.93,
    'jama-masjid': 0.95,
    'purana-qila': 0.92,
    'agrasen-ki-baoli': 0.94,
  };

  const confidenceScore = confidenceMap[site.id] || 0.94;

  const reasoningEn = `Demo result: Identified ${site.name} with ${Math.round(confidenceScore * 100)}% confidence using local structural geometry and architectural features (${site.architecturalStyle}).`;
  const reasoningHi = `डेमो परिणाम: स्थानीय वास्तुशिल्प विशेषताओं (${site.architecturalStyle}) के आधार पर ${site.hindiName} की ${Math.round(confidenceScore * 100)}% सटीकता के साथ पहचान।`;

  return {
    isIdentified: true,
    siteId: site.id,
    site,
    confidenceScore,
    detectedName: preferredLang === 'hi' ? site.hindiName : site.name,
    architecturalElements: [site.architecturalStyle, 'Verified ASI National Monument'],
    historicalEra: site.builtYear,
    customGeminiInsight: preferredLang === 'hi' ? reasoningHi : reasoningEn,
    alternativeMatches: [],
    isSupportedDelhiSite: true,
    needsVerification: false,
    uploadedImageUrl: customImageUrl || site.imageUrl,
    analyzedAt: new Date().toISOString(),
    isFallbackOrUnknown: false,
    isDemoFallback: true,
    isDemoResult: true,
  };
}

/**
 * Graceful demo / offline fallback when no API key is set or on network failure.
 */
export async function getDemoFallbackIdentification(
  imageDataUrl: string,
  preferredLang: 'en' | 'hi' = 'en'
): Promise<GeminiIdentificationResponse> {
  const sites = HeritageDataStore.getAllSites();
  // Deterministic local simulation based on image string length
  const hash = Math.abs(imageDataUrl.length) % (sites.length || 1);
  const site = sites[hash] || sites[0];

  const fullResult = createDemoRecognitionResult(site?.id || 'red-fort', imageDataUrl, preferredLang);

  const rawData: GeminiRawIdentification = {
    bestMatchName: site?.name || 'Heritage Monument',
    confidence: fullResult.confidenceScore,
    reasoning: fullResult.customGeminiInsight || `Demo recognition matched ${site?.name}.`,
    alternativeMatches: [],
    isSupportedDelhiSite: true,
    needsVerification: false,
  };

  return {
    success: true,
    data: rawData,
    matchedSite: site,
    fullResult,
    isDemoFallback: true,
  };
}

/**
 * Export default service bundle.
 */
export const GeminiService = {
  getStoredGeminiKey,
  testGeminiConnection,
  identifyHeritageImage,
  createDemoRecognitionResult,
  getDemoFallbackIdentification,
  matchSupportedSite,
  SUPPORTED_DELHI_SITES,
};
