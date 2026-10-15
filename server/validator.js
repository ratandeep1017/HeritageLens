/**
 * Fast search query validator for HeritageLens.
 * Rejects illegal, dangerous, harmful, non-place objects, fictional, and gibberish queries
 * before deep API/LLM calls are made ("no need to find too deep").
 */

// Illegal, violent, dangerous, weapons, adult, contraband keywords
const ILLEGAL_OR_HARMFUL_TERMS = [
  // Weapons & violence
  'bomb', 'explosive', 'terrorist', 'terrorism', 'weapon', 'gun', 'guns', 'ammo', 'ammunition',
  'knife', 'kill', 'killing', 'murder', 'assassinate', 'assassination', 'suicide', 'attack',
  'shoot', 'shooting', 'massacre', 'genocide', 'torture', 'hostage', 'kidnap',
  // Drugs & contraband
  'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'methamphetamine', 'weed', 'cannabis',
  'marijuana', 'lsd', 'ecstasy', 'narcotic', 'narcotics', 'opium', 'smuggle', 'smuggling',
  // Adult & sensitive
  'porn', 'pornography', 'xxx', 'nude', 'nudity', 'naked', 'sex', 'sexual', 'erotic',
  'hentai', 'boobs', 'penis', 'vagina', 'escort', 'prostitution',
  // Cyber & fraud
  'hack', 'hacking', 'exploit', 'phishing', 'malware', 'trojan', 'ransomware', 'ddos',
  'credit card fraud', 'stolen card', 'counterfeit',
];

// Common non-place items, gadgets, clothing, foods, abstract concepts
const NON_PLACE_OBJECTS = [
  'iphone', 'ipad', 'macbook', 'samsung', 'android', 'laptop', 'computer', 'smartphone',
  'tablet', 'headphone', 'headphones', 'earbuds', 'airpods', 'charger', 'usb',
  'car', 'cars', 'automobile', 'motorcycle', 'bike', 'bicycle', 'truck', 'bus',
  'shoes', 'sneakers', 'shirt', 'pants', 'tshirt', 'jeans', 'dress', 'jacket', 'watch',
  'pizza', 'burger', 'sandwich', 'noodles', 'pasta', 'ice cream', 'coffee', 'tea',
  'python', 'javascript', 'typescript', 'react', 'nodejs', 'html', 'css', 'coding', 'source code',
  'crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'nft', 'stock market',
  'movie', 'song', 'album', 'singer', 'actor', 'actress', 'celebrity',
  'chair', 'table', 'sofa', 'bed', 'furniture', 'fridge', 'television', 'tv',
];

// Fictional, fantasy, mythological non-existent places
const FICTIONAL_PLACES = [
  'hogwarts', 'wakanda', 'gotham', 'gotham city', 'narnia', 'mordor', 'middle earth',
  'westeros', 'winterfell', 'bikini bottom', 'tatooine', 'asgard', 'krypton', 'diagon alley',
  'riverdale', 'metropolis', 'springfield', 'emerald city', 'neverland', 'el dorado',
];

// Pure keyboard mash patterns
const KEYBOARD_MASH_PATTERNS = [
  /^[asdfghjklqwertyuiopzxcvbnm]{6,}$/i, // single row keyboard mash
  /(.)\1{4,}/, // same character repeated 5+ times (e.g. aaaaaa, 111111)
  /^[0-9\s!@#$%^&*()_+=\-[\]{}|;':",.<>?/`~]+$/, // purely numbers or punctuation
];

/**
 * Validates whether a query is suitable for a heritage/place search.
 * Returns { valid: true } OR { valid: false, reason: string }.
 */
export function validateSearchQuery(query) {
  if (!query || typeof query !== 'string') {
    return { valid: false, reason: 'Please enter a monument or place name to search.' };
  }

  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { valid: false, reason: 'Query is too short. Please enter a valid monument or place name.' };
  }

  if (trimmed.length > 150) {
    return { valid: false, reason: 'Query is too long. Please search for a specific monument or place name.' };
  }

  const lower = trimmed.toLowerCase();
  const words = lower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  // 1. Check for pure symbols / numbers / keyboard mash
  for (const pattern of KEYBOARD_MASH_PATTERNS) {
    if (pattern.test(lower) && !lower.includes('temple') && !lower.includes('fort') && !lower.includes('mahal')) {
      return {
        valid: false,
        reason: `Nothing found. "${trimmed}" is not a recognized monument or place.`,
      };
    }
  }

  // 2. Check for words >= 6 chars with 0 vowels (likely gibberish like 'sdfghjk', 'bcdfgh')
  for (const word of words) {
    if (word.length >= 6 && !/[aeiouy]/.test(word)) {
      return {
        valid: false,
        reason: `Nothing found. "${trimmed}" is not a recognized monument or place.`,
      };
    }
  }

  // 3. Check for illegal, harmful, or dangerous terms
  for (const bad of ILLEGAL_OR_HARMFUL_TERMS) {
    // Match whole word or exact phrase
    const regex = new RegExp(`\\b${bad}\\b`, 'i');
    if (regex.test(lower)) {
      return {
        valid: false,
        reason: 'Nothing found. Searches related to harmful, illegal, or inappropriate terms are not supported.',
      };
    }
  }

  // 4. Check for common non-place physical objects / gadgets / concepts
  for (const obj of NON_PLACE_OBJECTS) {
    const regex = new RegExp(`\\b${obj}\\b`, 'i');
    if (regex.test(lower) && !lower.includes('temple') && !lower.includes('fort') && !lower.includes('museum') && !lower.includes('memorial') && !lower.includes('park') && !lower.includes('garden')) {
      return {
        valid: false,
        reason: `Nothing found. "${trimmed}" appears to be an object or concept, not a heritage site or physical place.`,
      };
    }
  }

  // 5. Check for fictional / fantasy locations
  for (const fic of FICTIONAL_PLACES) {
    const regex = new RegExp(`\\b${fic}\\b`, 'i');
    if (regex.test(lower)) {
      return {
        valid: false,
        reason: `Nothing found. "${trimmed}" is a fictional or fantasy location and does not exist as a real heritage destination.`,
      };
    }
  }

  return { valid: true };
}
