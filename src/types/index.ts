export * from './heritage';

export interface HeritageSite {
  id: string;
  name: string;
  hindiName: string;
  state?: string;
  hindiState?: string;
  city?: string;
  hindiCity?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  latitude?: number;
  longitude?: number;
  shortDescription: string;
  hindiShortDescription: string;
  fullHistory: string;
  hindiFullHistory: string;
  builtYear: string;
  builtBy: string;
  architecturalStyle: string;
  culturalSignificance: string;
  hindiCulturalSignificance: string;
  interestingFacts: string[];
  hindiInterestingFacts: string[];
  folkloreOrLegends?: string[];
  hindiFolkloreOrLegends?: string[];
  travelTips: {
    timings: string;
    entryFee: string;
    nearestMetro: string;
    bestTimeToVisit: string;
    rules: string[];
  };
  nearbyAttractions: {
    name: string;
    distance: string;
    description: string;
  }[];
  imageUrl: string;
  imageAlt: string;
  sourceNote: string;
  tags: string[];
}

export interface IdentificationResult {
  siteId?: string;
  site?: HeritageSite;
  isIdentified: boolean;
  confidenceScore: number; // 0.0 - 1.0
  detectedName?: string;
  architecturalElements?: string[];
  historicalEra?: string;
  customGeminiInsight?: string;
  alternativeMatches?: string[];
  isSupportedDelhiSite?: boolean;
  needsVerification?: boolean;
  isFallbackOrUnknown?: boolean;
  isDemoFallback?: boolean;
  isDemoResult?: boolean;
  uploadedImageUrl?: string;
  analyzedAt: string;
}

export interface UserSettings {
  geminiApiKey: string;
  preferredLanguage: 'en' | 'hi';
  speechRate: number;
  autoPlayAudio: boolean;
  appMode?: 'gemini' | 'demo';
}
