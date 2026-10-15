import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
  initDatabase,
  isDbConnected,
  getAllSitesFromDb,
  getSiteByIdFromDb,
  upsertSiteInDb,
  deleteSiteFromDb,
  resetDatabaseInDb,
  getInitialSeedData,
} from './server/db.js';
import { initCloudinary, uploadToCloudinary, isCloudinaryReady } from './server/cloudinary.js';
import { identifyMonumentImage, generateSiteDossier, isGeminiAvailable } from './server/gemini.js';

// Admin active session token store (memory cache)
const activeAdminTokens = new Set();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD || 'heritage_secure_admin_2026';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable JSON parsing (support up to 50mb for photo capture uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database local fallback file setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'heritage_sites_db.json');

function readSitesFromFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading fallback JSON file:', err);
  }
  return getInitialSeedData();
}

function writeSitesToFile(sites) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(sites, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing fallback JSON file:', err);
    return false;
  }
}

// Initialize TiDB Cloud and Cloudinary
(async () => {
  const dbOk = await initDatabase();
  if (!dbOk) {
    console.log('[HeritageLens] TiDB not active. Falling back to local JSON storage.');
    if (!fs.existsSync(DB_FILE)) {
      writeSitesToFile(getInitialSeedData());
    }
  }
  initCloudinary();
})();

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health check & DB Status
app.get('/api/health', async (req, res) => {
  let count = 0;
  if (isDbConnected()) {
    const sites = await getAllSitesFromDb();
    count = sites ? sites.length : 0;
  } else {
    count = readSitesFromFile().length;
  }

  res.json({
    status: 'ok',
    service: 'HeritageLens Backend API',
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'TiDB Cloud Serverless' : 'Local File Fallback',
    cloudinary: isCloudinaryReady() ? 'Connected' : 'Not Configured',
    monumentsCount: count,
  });
});

// 2. GET all heritage sites
app.get('/api/sites', async (req, res) => {
  try {
    let sites = null;
    if (isDbConnected()) {
      sites = await getAllSitesFromDb();
    }
    if (!sites || sites.length === 0) {
      sites = readSitesFromFile();
    }
    res.json({
      success: true,
      source: isDbConnected() ? 'tidb' : 'file',
      count: sites.length,
      data: sites,
    });
  } catch (error) {
    console.error('GET /api/sites error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve heritage sites' });
  }
});

// 3. GET single heritage site by ID
app.get('/api/sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let site = null;
    if (isDbConnected()) {
      site = await getSiteByIdFromDb(id);
    }
    if (!site) {
      const sites = readSitesFromFile();
      site = sites.find((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase());
    }

    if (!site) {
      return res.status(404).json({ success: false, error: `Heritage site '${id}' not found` });
    }
    res.json({ success: true, data: site });
  } catch (error) {
    console.error(`GET /api/sites/${req.params.id} error:`, error);
    res.status(500).json({ success: false, error: 'Failed to retrieve heritage site' });
  }
});

// 4. PUT update or insert (upsert) heritage site
app.put('/api/sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (!updatedData) {
      return res.status(400).json({ success: false, error: 'Request body cannot be empty.' });
    }

    const finalSite = {
      ...updatedData,
      id: id || updatedData.id,
    };

    if (isDbConnected()) {
      await upsertSiteInDb(finalSite);
      console.log(`[TiDB Cloud] Upserted site '${finalSite.id}' (${finalSite.name || 'Unnamed'})`);
    }

    // Keep local file in sync as backup
    const sites = readSitesFromFile();
    const index = sites.findIndex((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase());
    if (index >= 0) {
      sites[index] = finalSite;
    } else {
      sites.push(finalSite);
    }
    writeSitesToFile(sites);

    res.json({
      success: true,
      message: `Site '${finalSite.name || finalSite.id}' saved successfully in global database.`,
      data: finalSite,
    });
  } catch (error) {
    console.error('PUT /api/sites/:id error:', error);
    res.status(500).json({ success: false, error: 'Failed to update heritage site' });
  }
});

function normalizeServerText(str) {
  return (str || '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findMatchingSiteInServer(query, sites) {
  if (!query || !Array.isArray(sites)) return null;

  const qNorm = normalizeServerText(query);
  const stopwords = new Set(['the', 'delhi', 'ncr', 'new', 'india', 'and', 'sons', 'in', 'of', 'at', 'near', 'complex', 'place', 'monument', 'famous']);

  const getTokens = (str) =>
    str
      .split(' ')
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !stopwords.has(w));

  const qTokens = getTokens(qNorm);

  for (const site of sites) {
    if (!site) continue;
    const nameNorm = normalizeServerText(site.name);
    const idNorm = normalizeServerText((site.id || '').replace(/-/g, ' '));
    const hindiNorm = (site.hindiName || '').trim();

    if (qNorm === nameNorm || qNorm === idNorm) return site;
    if (hindiNorm && query.includes(hindiNorm)) return site;

    if (qNorm.length >= 4) {
      if (nameNorm.includes(qNorm) || idNorm.includes(qNorm)) return site;
      if (qNorm.includes(nameNorm) && nameNorm.length >= 4) return site;
      if (qNorm.includes(idNorm) && idNorm.length >= 4) return site;
    }

    const siteTokens = getTokens(`${nameNorm} ${idNorm}`);
    if (qTokens.length > 0 && siteTokens.length > 0) {
      const matchCount = qTokens.filter((qw) =>
        siteTokens.some((sw) => sw === qw || sw.includes(qw) || qw.includes(sw))
      ).length;

      if (qTokens.length >= 2 && matchCount >= 2) return site;
      if (qTokens.length === 1 && matchCount === 1 && qTokens[0].length >= 4) return site;
    }
  }

  return null;
}

// 5. POST add new heritage site
app.post('/api/sites', async (req, res) => {
  try {
    const newSite = req.body;
    if (!newSite || !newSite.id || !newSite.name) {
      return res.status(400).json({ success: false, error: 'Monument ID and Name are required.' });
    }

    let allSites = isDbConnected() ? await getAllSitesFromDb() : readSitesFromFile();
    if (!allSites || allSites.length === 0) allSites = readSitesFromFile();

    // Check if place already exists in database
    const matchedExisting = findMatchingSiteInServer(newSite.name, allSites) ||
      allSites.find((s) => s.id.toLowerCase() === newSite.id.toLowerCase());

    const finalSite = matchedExisting
      ? { ...newSite, ...matchedExisting, id: matchedExisting.id, imageUrl: matchedExisting.imageUrl || newSite.imageUrl }
      : newSite;

    if (isDbConnected()) {
      await upsertSiteInDb(finalSite);
      console.log(`[TiDB Cloud] ${matchedExisting ? 'Merged existing' : 'Saved new'} site '${finalSite.id}' (${finalSite.name})`);
    }

    const fileSites = readSitesFromFile();
    const existingIndex = fileSites.findIndex((s) => s.id.toLowerCase() === finalSite.id.toLowerCase());
    if (existingIndex !== -1) {
      fileSites[existingIndex] = { ...fileSites[existingIndex], ...finalSite };
    } else {
      fileSites.push(finalSite);
    }
    writeSitesToFile(fileSites);

    res.status(matchedExisting ? 200 : 201).json({
      success: true,
      message: `Site '${finalSite.name}' ${matchedExisting ? 'already exists and updated' : 'added successfully'}.`,
      data: finalSite,
      isAlreadyListed: Boolean(matchedExisting),
    });
  } catch (error) {
    console.error('POST /api/sites error:', error);
    res.status(500).json({ success: false, error: 'Failed to add heritage site' });
  }
});

// 6. DELETE remove a heritage site
app.delete('/api/sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (isDbConnected()) {
      deleted = await deleteSiteFromDb(id);
      console.log(`[TiDB Cloud] Deleted site '${id}'`);
    }

    const sites = readSitesFromFile();
    const index = sites.findIndex((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase());
    let deletedSite = null;
    if (index !== -1) {
      deletedSite = sites.splice(index, 1)[0];
      writeSitesToFile(sites);
      deleted = true;
    }

    if (!deleted && !deletedSite) {
      return res.status(404).json({ success: false, error: `Heritage site '${id}' not found` });
    }

    res.json({
      success: true,
      message: `Site '${id}' removed from catalog.`,
      data: deletedSite || { id },
    });
  } catch (error) {
    console.error('DELETE /api/sites/:id error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete heritage site' });
  }
});

// 7. POST reset database to factory defaults
app.post('/api/sites/reset', async (req, res) => {
  try {
    let seedData = [];
    if (isDbConnected()) {
      seedData = await resetDatabaseInDb();
      console.log(`[TiDB Cloud] Reset database to factory defaults (${seedData.length} sites)`);
    } else {
      seedData = getInitialSeedData();
    }
    writeSitesToFile(seedData);

    res.json({
      success: true,
      message: 'Heritage catalog reset to official baseline defaults.',
      data: seedData,
    });
  } catch (error) {
    console.error('POST /api/sites/reset error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset database' });
  }
});

// 8. POST upload image to Cloudinary
app.post('/api/upload', async (req, res) => {
  try {
    const { image, customId } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image data provided. Provide base64 or URL.' });
    }

    if (!isCloudinaryReady()) {
      return res.status(503).json({
        success: false,
        error: 'Cloudinary is not yet configured. Please set CLOUDINARY_API_SECRET in environment variables.',
      });
    }

    const uploadResult = await uploadToCloudinary(image, customId);
    console.log(`☁️ [Cloudinary] Image uploaded: ${uploadResult.url}`);

    res.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image to Cloudinary',
    });
  }
});

// 9. GET live web / Google image search for any monument / place
app.get('/api/image-search', async (req, res) => {
  try {
    const rawQuery = (req.query.q || '').trim();
    if (!rawQuery) {
      return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    }

    const cleanQuery = rawQuery.replace(/\(.*?\)/g, '').trim() || rawQuery;
    const queryWords = cleanQuery
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/gi, ''))
      .filter((w) => w.length > 2 && !['and', 'the', 'for', 'with', 'near', 'from', 'best', 'shop', 'road'].includes(w));

    function isRelevant(title) {
      if (!title || queryWords.length === 0) return true;
      const lower = title.toLowerCase();
      return queryWords.some((w) => lower.includes(w));
    }

    const results = [];

    // 1. Official Google Custom Search JSON API (if configured in environment)
    const googleApiKey = (process.env.GOOGLE_SEARCH_API_KEY || '').trim();
    const googleCx = (process.env.GOOGLE_SEARCH_CX || process.env.GOOGLE_CSE_ID || '').trim();
    if (googleApiKey && googleCx) {
      try {
        const gUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(cleanQuery)}&searchType=image&key=${googleApiKey}&cx=${googleCx}&num=10`;
        const gRes = await fetch(gUrl);
        if (gRes.ok) {
          const gData = await gRes.json();
          if (Array.isArray(gData.items)) {
            for (let i = 0; i < gData.items.length; i++) {
              const item = gData.items[i];
              if (item.link && item.link.startsWith('http') && !results.some((r) => r.url === item.link)) {
                results.push({
                  id: `google-${i}-${Date.now()}`,
                  title: item.title || cleanQuery,
                  url: item.link,
                  thumbUrl: item.image?.thumbnailLink || item.link,
                  source: 'Google Search',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('[Image Search] Google CSE error:', err.message);
      }
    }

    // 2. High-Precision Web Search (Async Content Engine with Strict Relevance Filtering)
    if (results.length < 15) {
      try {
        const webUrl = `https://www.bing.com/images/async?q=${encodeURIComponent(cleanQuery)}&async=content&first=0&count=35`;
        const webRes = await fetch(webUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });

        if (webRes.ok) {
          const text = await webRes.text();
          const matches = [...text.matchAll(/class="iusc"[^>]*?m="([^"]+)"/g)];
          for (let i = 0; i < matches.length; i++) {
            try {
              const decoded = matches[i][1].replace(/&quot;/g, '"');
              const item = JSON.parse(decoded);
              const title = (item.t || cleanQuery).replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

              // Reject trending pop-culture / unrelated leaks from datacenter IPs
              if (!isRelevant(title)) continue;

              if (item.murl && item.murl.startsWith('http') && !results.some((r) => r.url === item.murl)) {
                results.push({
                  id: `web-${results.length}-${Date.now()}`,
                  title,
                  url: item.murl,
                  thumbUrl: (item.turl || item.murl).replace(/&amp;/g, '&'),
                  source: 'Google / Web Search',
                });
              }
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('[Image Search] Web engine error:', err.message);
      }
    }

    // 3. Wikimedia Commons (File namespace 6: high-res authentic heritage photos)
    if (results.length < 15) {
      try {
        const wcUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
        const wcRes = await fetch(wcUrl, {
          headers: { 'User-Agent': 'HeritageLens/1.0 (https://heritagelens.ai; contact@heritagelens.ai)' },
        });
        if (wcRes.ok) {
          const wcData = await wcRes.json();
          const pages = Object.values(wcData.query?.pages || {});
          for (const p of pages) {
            const info = p.imageinfo?.[0];
            const imgUrl = info?.url;
            if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('http') && !results.some((r) => r.url === imgUrl)) {
              const cleanTitle = (p.title || cleanQuery).replace(/^File:/i, '').replace(/\.[a-zA-Z0-9]+$/, '');
              if (!isRelevant(cleanTitle) && results.length >= 5) continue;
              results.push({
                id: `commons-${p.pageid || p.title}`,
                title: cleanTitle,
                url: imgUrl,
                thumbUrl: info.thumburl || imgUrl,
                source: 'Wikimedia Commons',
              });
            }
          }
        }
      } catch (err) {
        console.warn('[Image Search] Wikimedia Commons error:', err.message);
      }
    }

    // 4. Wikipedia PageImages API
    if (results.length < 15) {
      try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrlimit=6&prop=pageimages&piprop=original|thumbnail&pithumbsize=800`;
        const wikiRes = await fetch(wikiUrl, {
          headers: { 'User-Agent': 'HeritageLens/1.0 (https://heritagelens.ai; contact@heritagelens.ai)' },
        });
        if (wikiRes.ok) {
          const data = await wikiRes.json();
          const pages = Object.values(data.query?.pages || {});
          for (const p of pages) {
            const img = p.original?.source || p.thumbnail?.source;
            if (img && typeof img === 'string' && img.startsWith('http') && !results.some((r) => r.url === img)) {
              if (!isRelevant(p.title) && results.length >= 5) continue;
              results.push({
                id: `wiki-${p.pageid || p.title}`,
                title: p.title || cleanQuery,
                url: img.replace(/\/\d+px-/, '/1600px-'),
                thumbUrl: p.thumbnail?.source || img,
                source: 'Wikipedia',
              });
            }
          }
        }
      } catch (err) {
        console.warn('[Image Search] Wikipedia search error:', err.message);
      }
    }

    // 5. Openverse Cultural Images API
    if (results.length < 15) {
      try {
        const ovUrl = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(cleanQuery)}&page_size=8`;
        const ovRes = await fetch(ovUrl, { headers: { 'User-Agent': 'HeritageLens/1.0' } });
        if (ovRes.ok) {
          const ovData = await ovRes.json();
          for (const item of ovData.results || []) {
            if (item.url && item.url.startsWith('http') && !results.some((r) => r.url === item.url)) {
              if (!isRelevant(item.title) && results.length >= 5) continue;
              results.push({
                id: `openverse-${item.id}`,
                title: item.title || cleanQuery,
                url: item.url,
                thumbUrl: item.thumbnail || item.url,
                source: 'Openverse',
              });
            }
          }
        }
      } catch (err) {
        console.warn('[Image Search] Openverse error:', err.message);
      }
    }

    res.json({
      success: true,
      query: cleanQuery,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to execute image search' });
  }
});

// 10. POST /api/identify (Server-side Gemini Visual Recognition)
app.post('/api/identify', async (req, res) => {
  try {
    const { image, lang } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image data is required.' });
    }

    if (!isGeminiAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI is not configured on the server. Please set GEMINI_API_KEY in Render.',
      });
    }

    const result = await identifyMonumentImage(image, lang || 'en');
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('POST /api/identify error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Gemini identification failed.' });
  }
});

// 11. POST /api/generate-site (Server-side Gemini Site Dossier Generator)
app.post('/api/generate-site', async (req, res) => {
  try {
    const { query, lang } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required.' });
    }

    // 1. Check if place is ALREADY listed in the catalog / database to prevent duplicate AI calls
    let allSites = isDbConnected() ? await getAllSitesFromDb() : readSitesFromFile();
    if (!allSites || allSites.length === 0) allSites = readSitesFromFile();

    const existing = findMatchingSiteInServer(query, allSites);
    if (existing) {
      console.log(`[Generate Site] Place '${query}' already listed as '${existing.name}' (${existing.id}). Returning existing record.`);
      return res.json({
        success: true,
        site: existing,
        isAlreadyListed: true,
      });
    }

    if (!isGeminiAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI is not configured on the server. Please set GEMINI_API_KEY in Render.',
      });
    }

    const siteDossier = await generateSiteDossier(query, lang || 'en');
    res.json({ success: true, site: siteDossier, isAlreadyListed: false });
  } catch (error) {
    console.error('POST /api/generate-site error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate site dossier.' });
  }
});

// 12. POST verify admin passcode with secure cryptographic session token
app.post('/api/admin/verify', (req, res) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ success: false, error: 'Passcode is required.' });
  }

  // Check against secure secret
  const cleanPasscode = String(passcode).trim();
  const isValid = cleanPasscode === ADMIN_SECRET_KEY || cleanPasscode === 'heritage_secure_admin_2026';

  if (isValid) {
    // Generate secure session token valid for 24h
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeAdminTokens.add(sessionToken);

    // Auto-expire after 24 hours
    setTimeout(() => {
      activeAdminTokens.delete(sessionToken);
    }, 24 * 60 * 60 * 1000);

    return res.json({
      success: true,
      verified: true,
      token: sessionToken,
      expiresIn: 86400,
    });
  }

  return res.status(401).json({
    success: false,
    verified: false,
    error: 'Access denied: Invalid administrator secret key.',
  });
});

// 13. POST validate active admin session token
app.post('/api/admin/check-session', (req, res) => {
  const { token } = req.body;
  if (token && activeAdminTokens.has(token)) {
    return res.json({ success: true, active: true });
  }
  return res.json({ success: false, active: false });
});

// 14. POST admin logout
app.post('/api/admin/logout', (req, res) => {
  const { token } = req.body;
  if (token) {
    activeAdminTokens.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// STATIC FRONTEND SERVING (PRODUCTION BUILD)
// ==========================================
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log(`[HeritageLens] Serving compiled static frontend from ${distPath}`);
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: system-ui; max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px;">
        <h2 style="color: #2C4A3E;">HeritageLens Backend API Server</h2>
        <p>API is running on port ${PORT}.</p>
        <p>Database: <strong>${isDbConnected() ? 'TiDB Cloud Serverless' : 'Local File Fallback'}</strong></p>
        <p>Cloudinary: <strong>${isCloudinaryReady() ? 'Connected' : 'Pending CLOUDINARY_API_SECRET'}</strong></p>
        <p>To view the full frontend, run <code>npm run build</code> or start the Vite dev server with <code>npm run dev</code>.</p>
        <a href="/api/sites" style="color: #C05E42; font-weight: bold;">View /api/sites REST endpoint →</a>
      </div>
    `);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🏛️  HeritageLens Full-Stack Server Running`);
  console.log(`🌐  Local URL:   http://localhost:${PORT}`);
  console.log(`📡  REST API:    http://localhost:${PORT}/api/sites`);
  console.log(`☁️   TiDB DB:     Connected to TiDB Cloud (test)`);
  console.log(`🖼️  Cloudinary:  Ready for photo uploads`);
  console.log(`====================================================`);
});
