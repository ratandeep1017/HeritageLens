import type React from 'react';

/**
 * Image Utilities and Warning Placeholder Generator for HeritageLens AI
 * 
 * STRICT POLICY:
 * Never automatically guess, replace, or silently substitute configured image URLs.
 * The exact URL entered in Admin Settings or loaded from the data store is used.
 * If an image fails to load (CORS, network error, broken link), an explicit
 * warning placeholder is displayed indicating the failed URL so it can be corrected in Admin Settings.
 */

/**
 * Returns an explicit SVG warning banner placeholder when an image fails to load.
 * Clearly displays a warning message and the exact failed URL so it is never hidden.
 */
export function getWarningPlaceholderSvg(
  siteName: string = 'Monument',
  failedUrl?: string,
  reason: string = 'Image failed to load from configured URL'
): string {
  const safeName = (siteName || 'Heritage Monument')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  const displayUrl = failedUrl ? failedUrl.slice(0, 55) + (failedUrl.length > 55 ? '...' : '') : 'URL not accessible';
  const safeUrl = displayUrl
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D2926" />
        <stop offset="100%" stop-color="#1A1817" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C05E42" stroke-width="0.5" opacity="0.15" />
      </pattern>
    </defs>
    
    <!-- Dark Heritage Sandstone Canvas -->
    <rect width="800" height="600" fill="url(#bg)" />
    <rect width="800" height="600" fill="url(#grid)" />
    
    <!-- Warning Frame & Accent Border -->
    <rect x="40" y="40" width="720" height="520" rx="20" fill="#242120" stroke="#C05E42" stroke-width="2" stroke-dasharray="6,6" opacity="0.75" />
    
    <!-- Warning Icon Motif (Shield & Alert Triangle) -->
    <circle cx="400" cy="200" r="54" fill="#C05E42" opacity="0.15" />
    <circle cx="400" cy="200" r="42" fill="#C05E42" opacity="0.25" />
    <path d="M 400 165 L 435 228 L 365 228 Z" fill="#D4AF37" stroke="#D4AF37" stroke-width="2" stroke-linejoin="round" />
    <text x="400" y="215" fill="#1A1817" font-family="sans-serif" font-size="24" font-weight="900" text-anchor="middle">!</text>
    
    <!-- Monument Title -->
    <text x="400" y="295" fill="#FDFBF7" font-family="Georgia, serif" font-size="26" font-weight="bold" text-anchor="middle">${safeName}</text>
    
    <!-- Warning Badge -->
    <rect x="250" y="325" width="300" height="32" rx="16" fill="#C05E42" />
    <text x="400" y="346" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="1.5">⚠️ IMAGE FAILED TO LOAD</text>
    
    <!-- Explanatory Subtitles -->
    <text x="400" y="390" fill="#E8E2D9" font-family="sans-serif" font-size="13" font-weight="500" text-anchor="middle">${reason}</text>
    <text x="400" y="420" fill="#A8A29E" font-family="monospace" font-size="11" text-anchor="middle">${safeUrl}</text>
    
    <!-- Action Guidance -->
    <rect x="210" y="460" width="380" height="40" rx="10" fill="#383330" stroke="#5C544E" stroke-width="1" />
    <text x="400" y="485" fill="#D4AF37" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="middle">Update or verify image link in Profile → Admin Settings</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns the exact image URL configured for the monument without guessing or modifying.
 */
export function getSafeMonumentImageUrl(siteId?: string, customUrl?: string): string {
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }
  return '';
}

/**
 * Image error handler attached to <img> `onError`.
 * Replaces the broken visual with an explicit warning SVG that displays the failed URL and advice,
 * without silently pretending another image was intended.
 */
export function handleMonumentImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  siteId?: string,
  siteName?: string,
  originalUrl?: string
) {
  const target = event.currentTarget;
  const currentSrc = target.src;

  // Prevent recursive loop if already showing SVG warning
  if (currentSrc.startsWith('data:image/svg+xml')) {
    return;
  }

  const failedLink = originalUrl || currentSrc;
  target.src = getWarningPlaceholderSvg(siteName || 'Delhi Heritage Monument', failedLink);
}
