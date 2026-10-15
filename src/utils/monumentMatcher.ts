import { HeritageSite } from '../types';

/**
 * Normalizes strings by lowercasing, removing special characters, and trimming.
 */
export function normalizeMonumentText(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Common filler words that do not distinguish one monument from another.
 */
const COMMON_STOPWORDS = new Set([
  'the', 'delhi', 'ncr', 'new', 'india', 'and', 'sons', 'in', 'of', 'at',
  'near', 'complex', 'place', 'monument', 'famous', 'historic', 'historical'
]);

/**
 * Checks if query or candidate name refers to the same monument as existingSite.
 */
export function isMonumentMatch(queryOrName: string, site: HeritageSite): boolean {
  if (!queryOrName || !site) return false;

  const qNorm = normalizeMonumentText(queryOrName);
  const nameNorm = normalizeMonumentText(site.name);
  const idNorm = normalizeMonumentText((site.id || '').replace(/-/g, ' '));
  const hindiNorm = (site.hindiName || '').trim();

  // 1. Direct or ID equality
  if (qNorm === nameNorm || qNorm === idNorm) return true;
  if (hindiNorm && queryOrName.trim().includes(hindiNorm)) return true;

  // 2. Substring matching for meaningful queries
  if (qNorm.length >= 4) {
    if (nameNorm.includes(qNorm) || idNorm.includes(qNorm)) return true;
    if (qNorm.includes(nameNorm) && nameNorm.length >= 4) return true;
    if (qNorm.includes(idNorm) && idNorm.length >= 4) return true;
  }

  // 3. Significant Token Overlap Analysis
  const getTokens = (str: string) =>
    str
      .split(' ')
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !COMMON_STOPWORDS.has(w));

  const qTokens = getTokens(qNorm);
  const siteTokens = getTokens(`${nameNorm} ${idNorm}`);

  if (qTokens.length === 0 || siteTokens.length === 0) return false;

  // Count matching anchor tokens
  const matchingTokens = qTokens.filter((qw) =>
    siteTokens.some((sw) => sw === qw || sw.includes(qw) || qw.includes(sw))
  );

  // If query has 2+ significant words and at least 2 match (e.g. 'fakir', 'chand' or 'lotus', 'temple')
  if (qTokens.length >= 2 && matchingTokens.length >= 2) return true;

  // If query has 1 significant word of length >= 4 and it matches (e.g. 'salimgarh')
  if (qTokens.length === 1 && matchingTokens.length === 1 && qTokens[0].length >= 4) return true;

  return false;
}

/**
 * Searches an array of HeritageSites for an existing match.
 */
export function findExistingHeritageSite(
  query: string,
  sites: HeritageSite[]
): HeritageSite | undefined {
  if (!query || !Array.isArray(sites)) return undefined;
  return sites.find((site) => isMonumentMatch(query, site));
}
