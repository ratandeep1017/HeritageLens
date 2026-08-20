/**
 * HeritageLens AI - Legacy Gemini Service Entry
 * Re-exports the unified Gemini service module from ./geminiService.ts
 */

export * from './geminiService';
import { identifyHeritageImage, GeminiIdentificationResponse } from './geminiService';
import { IdentificationResult } from '../types';

export class GeminiHeritageService {
  /**
   * Identifies a Delhi heritage site from a base64 or data URL image.
   * Delegates to the primary identifyHeritageImage service function.
   */
  static async identifyMonument(
    imageDataUrl: string,
    apiKey?: string,
    preferredLang: 'en' | 'hi' = 'en'
  ): Promise<IdentificationResult> {
    const response: GeminiIdentificationResponse = await identifyHeritageImage(
      imageDataUrl,
      apiKey,
      preferredLang
    );

    if (response.fullResult) {
      return response.fullResult;
    }

    // Safety fallback
    return {
      isIdentified: false,
      confidenceScore: 0.2,
      detectedName: preferredLang === 'hi' ? 'अज्ञात स्मारक' : 'Unknown Monument',
      architecturalElements: [],
      historicalEra: 'Undetermined',
      customGeminiInsight: response.error || 'Recognition could not determine a match.',
      isFallbackOrUnknown: true,
      uploadedImageUrl: imageDataUrl,
      analyzedAt: new Date().toISOString(),
    };
  }
}
