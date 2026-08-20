import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable JSON parsing
app.use(express.json({ limit: '10mb' }));

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

// Database file setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'heritage_sites_db.json');
const SEED_FILE = path.join(DATA_DIR, 'heritage_sites_seed.json');

// Helper to load initial seed data
function getInitialSeedData() {
  try {
    if (fs.existsSync(SEED_FILE)) {
      const content = fs.readFileSync(SEED_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading seed JSON file:', err);
  }
  return [];
}

// Initialize database file
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialSites = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSites, null, 2), 'utf8');
    console.log(`[HeritageLens DB] Initialized database with ${initialSites.length} heritage sites at ${DB_FILE}`);
  }
}

initDatabase();

// Database Helper functions
function readSitesFromDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return [];
}

function writeSitesToDb(sites) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(sites, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HeritageLens Backend API',
    timestamp: new Date().toISOString(),
    monumentsCount: readSitesFromDb().length
  });
});

// 2. GET all heritage sites
app.get('/api/sites', (req, res) => {
  try {
    const sites = readSitesFromDb();
    res.json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve heritage sites' });
  }
});

// 3. GET single heritage site by ID
app.get('/api/sites/:id', (req, res) => {
  try {
    const { id } = req.params;
    const sites = readSitesFromDb();
    const site = sites.find((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase());
    if (!site) {
      return res.status(404).json({ success: false, error: `Heritage site '${id}' not found` });
    }
    res.json({ success: true, data: site });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve heritage site' });
  }
});

// 4. PUT update existing heritage site
app.put('/api/sites/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const sites = readSitesFromDb();
    const index = sites.findIndex((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ success: false, error: `Heritage site '${id}' not found` });
    }

    // Preserve id and merge updated fields
    sites[index] = { ...sites[index], ...updatedData, id: sites[index].id };
    writeSitesToDb(sites);

    console.log(`[HeritageLens DB] Updated site '${id}' (${sites[index].name})`);
    res.json({
      success: true,
      message: `Site '${sites[index].name}' updated successfully in global database.`,
      data: sites[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update heritage site' });
  }
});

// 5. POST add new heritage site
app.post('/api/sites', (req, res) => {
  try {
    const newSite = req.body;
    if (!newSite || !newSite.id || !newSite.name) {
      return res.status(400).json({ success: false, error: 'Monument ID and Name are required.' });
    }

    const sites = readSitesFromDb();
    const existingIndex = sites.findIndex((s) => s.id === newSite.id);

    if (existingIndex !== -1) {
      return res.status(409).json({ success: false, error: `A site with ID '${newSite.id}' already exists.` });
    }

    sites.push(newSite);
    writeSitesToDb(sites);

    console.log(`[HeritageLens DB] Added new site '${newSite.id}' (${newSite.name})`);
    res.status(201).json({
      success: true,
      message: `Site '${newSite.name}' added successfully.`,
      data: newSite
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add heritage site' });
  }
});

// 6. DELETE remove a heritage site
app.delete('/api/sites/:id', (req, res) => {
  try {
    const { id } = req.params;
    const sites = readSitesFromDb();
    const index = sites.findIndex((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ success: false, error: `Heritage site '${id}' not found` });
    }

    const deletedSite = sites.splice(index, 1)[0];
    writeSitesToDb(sites);

    console.log(`[HeritageLens DB] Deleted site '${id}' (${deletedSite.name})`);
    res.json({
      success: true,
      message: `Site '${deletedSite.name}' removed from global catalog.`,
      data: deletedSite
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete heritage site' });
  }
});

// 7. POST reset database to factory defaults
app.post('/api/sites/reset', (req, res) => {
  try {
    const seedData = getInitialSeedData();
    writeSitesToDb(seedData);
    console.log(`[HeritageLens DB] Reset database to factory defaults (${seedData.length} sites)`);
    res.json({
      success: true,
      message: 'Heritage catalog reset to official baseline defaults.',
      data: seedData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reset database' });
  }
});

// 8. POST verify admin passcode
app.post('/api/admin/verify', (req, res) => {
  const { passcode } = req.body;
  const validPasscodes = ['admin', 'heritage2026', 'heritagelens'];
  if (passcode && validPasscodes.includes(passcode.toLowerCase().trim())) {
    return res.json({ success: true, verified: true });
  }
  return res.status(401).json({ success: false, verified: false, error: 'Invalid admin passcode.' });
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
  console.log(`====================================================`);
});
