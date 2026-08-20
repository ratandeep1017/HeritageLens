export type HeritageCategory = 
  | 'Fort' 
  | 'Tomb' 
  | 'Monument' 
  | 'Religious Place' 
  | 'Stepwell' 
  | 'Mosque' 
  | 'Memorial' 
  | 'Temple' 
  | string;

export interface NearbyPlace {
  name: string;
  distance?: string;
  description?: string;
}

export interface HeritageSiteRecord {
  id: string;
  name: string;
  alternateName?: string;
  category: HeritageCategory;
  city: string;
  area: string; // Nearest metro line / locality
  shortDescription: string;
  timings: string;
  tickets?: string;
  historicalSummary: string;
  architecture: string;
  culturalSignificance: string;
  interestingFacts: string[];
  folklore?: string[]; // Clearly labeled separately as oral tradition / unverified lore
  travelTips: string[];
  nearbyPlaces: NearbyPlace[];
  latitude: number;
  longitude: number;
  imageKeywords: string[];
  sourceNote: string;
  supportedLanguages: string[];
}
