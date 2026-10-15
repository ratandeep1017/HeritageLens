/**
 * Client-side fast search query validator for HeritageLens.
 * Evaluates queries before calling APIs to quickly reject illegal, dangerous,
 * fictional, non-place objects, and random gibberish ("no need to find too deep").
 */

const ILLEGAL_OR_HARMFUL_TERMS = [
  'bomb', 'explosive', 'terrorist', 'terrorism', 'weapon', 'gun', 'guns', 'ammo',
  'knife', 'kill', 'killing', 'murder', 'assassinate', 'assassination', 'suicide', 'attack',
  'shoot', 'shooting', 'massacre', 'genocide', 'torture', 'hostage', 'kidnap',
  'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'methamphetamine', 'weed', 'cannabis',
  'marijuana', 'lsd', 'ecstasy', 'narcotic', 'narcotics', 'opium', 'smuggle', 'smuggling',
  'porn', 'pornography', 'xxx', 'nude', 'nudity', 'naked', 'sex', 'sexual', 'erotic',
  'hentai', 'boobs', 'penis', 'vagina', 'escort', 'prostitution',
  'hack', 'hacking', 'exploit', 'phishing', 'malware', 'trojan', 'ransomware', 'ddos',
  'credit card fraud', 'stolen card', 'counterfeit',
];

const NON_PLACE_OBJECTS = [
  'iphone', 'ipad', 'macbook', 'samsung', 'android', 'laptop', 'computer', 'smartphone',
  'tablet', 'headphone', 'headphones', 'earbuds', 'airpods', 'charger', 'usb',
  'car', 'cars', 'automobile', 'motorcycle', 'bike', 'bicycle', 'truck', 'bus',
  'shoes', 'sneakers', 'shirt', 'pants', 'tshirt', 'jeans', 'dress', 'jacket', 'watch',
  'pizza', 'burger', 'sandwich', 'noodles', 'pasta', 'ice cream', 'coffee', 'tea',
  'python', 'javascript', 'typescript', 'react', 'nodejs', 'html', 'css', 'coding',
  'crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'nft', 'stock market',
  'movie', 'song', 'album', 'singer', 'actor', 'actress', 'celebrity',
  'chair', 'table', 'sofa', 'bed', 'furniture', 'fridge', 'television', 'tv',
];

const FICTIONAL_PLACES = [
  'hogwarts', 'wakanda', 'gotham', 'gotham city', 'narnia', 'mordor', 'middle earth',
  'westeros', 'winterfell', 'bikini bottom', 'tatooine', 'asgard', 'krypton', 'diagon alley',
  'riverdale', 'metropolis', 'springfield', 'emerald city', 'neverland', 'el dorado',
];

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  reasonHi?: string;
}

export function validateClientSearchQuery(query: string): ValidationResult {
  if (!query || typeof query !== 'string') {
    return {
      valid: false,
      reason: 'Please enter a monument or place name to search.',
      reasonHi: 'कृपया खोजने के लिए किसी स्मारक या स्थल का नाम दर्ज करें।'
    };
  }

  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return {
      valid: false,
      reason: 'Query is too short. Please enter a valid monument or place name.',
      reasonHi: 'नाम बहुत छोटा है। कृपया सही स्मारक या स्थल दर्ज करें।'
    };
  }

  if (trimmed.length > 150) {
    return {
      valid: false,
      reason: 'Query is too long. Please search for a specific monument or place name.',
      reasonHi: 'नाम बहुत लंबा है। कृपया किसी विशिष्ट स्मारक या स्थल को खोजें।'
    };
  }

  const lower = trimmed.toLowerCase();
  const words = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  // 1. Pure symbols or repeated characters
  if (/(.)\1{4,}/.test(lower)) {
    return {
      valid: false,
      reason: `Nothing found. "${trimmed}" is not a recognized monument or place.`,
      reasonHi: `कोई परिणाम नहीं मिला। "${trimmed}" एक मान्य धरोहर स्थल नहीं है।`
    };
  }

  // 2. Long words with no vowels (gibberish like sdfghjk)
  for (const word of words) {
    if (word.length >= 6 && !/[aeiouy]/.test(word)) {
      return {
        valid: false,
        reason: `Nothing found. "${trimmed}" is not a recognized monument or place.`,
        reasonHi: `कोई परिणाम नहीं मिला। "${trimmed}" एक मान्य धरोहर स्थल नहीं है।`
      };
    }
  }

  // 3. Illegal / dangerous / harmful
  for (const bad of ILLEGAL_OR_HARMFUL_TERMS) {
    const regex = new RegExp(`\\b${bad}\\b`, 'i');
    if (regex.test(lower)) {
      return {
        valid: false,
        reason: 'Nothing found. Searches related to harmful, illegal, or inappropriate terms are not supported.',
        reasonHi: 'कोई परिणाम नहीं मिला। अनुचित या हानिकारक खोज समर्थित नहीं है।'
      };
    }
  }

  // 4. Non-place objects
  for (const obj of NON_PLACE_OBJECTS) {
    const regex = new RegExp(`\\b${obj}\\b`, 'i');
    if (regex.test(lower) && !lower.includes('temple') && !lower.includes('fort') && !lower.includes('museum') && !lower.includes('memorial') && !lower.includes('park') && !lower.includes('garden')) {
      return {
        valid: false,
        reason: `Nothing found. "${trimmed}" appears to be an object or concept, not a heritage site or physical place.`,
        reasonHi: `कोई परिणाम नहीं मिला। "${trimmed}" कोई धरोहर स्थल या स्थान नहीं है।`
      };
    }
  }

  // 5. Fictional / non-existent fantasy places
  for (const fic of FICTIONAL_PLACES) {
    const regex = new RegExp(`\\b${fic}\\b`, 'i');
    if (regex.test(lower)) {
      return {
        valid: false,
        reason: `Nothing found. "${trimmed}" is a fictional place and does not exist in the real world.`,
        reasonHi: `कोई परिणाम नहीं मिला। "${trimmed}" एक काल्पनिक स्थान है और वास्तविक दुनिया में अस्तित्व में नहीं है।`
      };
    }
  }

  return { valid: true };
}
