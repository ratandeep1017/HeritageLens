import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEED_FILE = path.join(__dirname, '..', 'data', 'heritage_sites_seed.json');

let pool = null;
let isConnected = false;

export function getInitialSeedData() {
  try {
    if (fs.existsSync(SEED_FILE)) {
      const content = fs.readFileSync(SEED_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[TiDB] Error reading seed JSON file:', err.message);
  }
  return [];
}

/**
 * Initialize TiDB Cloud connection pool and create the heritage_sites table.
 */
export async function initDatabase() {
  const connectionUri = process.env.DATABASE_URL || process.env.TIDB_DATABASE_URL;
  const host = process.env.TIDB_HOST;
  const user = process.env.TIDB_USER;
  const password = process.env.TIDB_PASSWORD;
  const database = process.env.TIDB_DATABASE || 'test';
  const port = parseInt(process.env.TIDB_PORT || '4000', 10);

  // If no TiDB credentials, fallback gracefully
  if (!connectionUri && (!host || !user)) {
    console.warn('[TiDB] No TiDB credentials provided. Running in local fallback mode.');
    return false;
  }

  try {
    const config = connectionUri
      ? {
          uri: connectionUri,
          ssl: { rejectUnauthorized: true },
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        }
      : {
          host,
          port,
          user,
          password,
          database,
          ssl: { rejectUnauthorized: true },
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        };

    pool = mysql.createPool(config);

    // Test connection
    const [test] = await pool.query('SELECT 1 as connected');
    if (test && test[0]?.connected === 1) {
      console.log('✅ [TiDB Cloud] Successfully connected to TiDB Serverless instance!');
      isConnected = true;
    }

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS heritage_sites (
        id VARCHAR(120) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ [TiDB Cloud] Table `heritage_sites` verified/ready.');

    // Auto-seed if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM heritage_sites');
    const count = rows[0]?.count || 0;
    if (count === 0) {
      console.log('🌱 [TiDB Cloud] Database table is empty. Seeding initial Delhi heritage sites...');
      const seedData = getInitialSeedData();
      for (const site of seedData) {
        if (!site || !site.id) continue;
        await pool.query(
          `INSERT INTO heritage_sites (id, name, category, data)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), data=VALUES(data)`,
          [site.id, site.name || 'Unnamed', site.category || 'Monument', JSON.stringify(site)]
        );
      }
      console.log(`✅ [TiDB Cloud] Successfully seeded ${seedData.length} monuments into TiDB!`);
    } else {
      console.log(`📊 [TiDB Cloud] Currently storing ${count} heritage sites in cloud DB.`);
    }

    return true;
  } catch (err) {
    console.error('❌ [TiDB Cloud] Connection / setup failed:', err.message);
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected && pool !== null;
}

/**
 * Fetch all heritage sites from TiDB.
 */
export async function getAllSitesFromDb() {
  if (!isDbConnected()) return null;
  const [rows] = await pool.query('SELECT data FROM heritage_sites ORDER BY name ASC');
  return rows.map((r) => (typeof r.data === 'string' ? JSON.parse(r.data) : r.data));
}

/**
 * Fetch single heritage site by ID.
 */
export async function getSiteByIdFromDb(id) {
  if (!isDbConnected()) return null;
  const [rows] = await pool.query('SELECT data FROM heritage_sites WHERE LOWER(id) = LOWER(?) LIMIT 1', [id]);
  if (rows.length === 0) return null;
  return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
}

/**
 * Upsert heritage site into TiDB.
 */
export async function upsertSiteInDb(site) {
  if (!isDbConnected() || !site || !site.id) return null;
  await pool.query(
    `INSERT INTO heritage_sites (id, name, category, data)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), data=VALUES(data), updated_at=CURRENT_TIMESTAMP`,
    [site.id, site.name || 'Unnamed', site.category || 'Monument', JSON.stringify(site)]
  );
  return site;
}

/**
 * Delete heritage site from TiDB.
 */
export async function deleteSiteFromDb(id) {
  if (!isDbConnected()) return false;
  const [result] = await pool.query('DELETE FROM heritage_sites WHERE LOWER(id) = LOWER(?)', [id]);
  return result.affectedRows > 0;
}

/**
 * Reset database to baseline seed data in TiDB.
 */
export async function resetDatabaseInDb() {
  if (!isDbConnected()) return null;
  await pool.query('DELETE FROM heritage_sites');
  const seedData = getInitialSeedData();
  for (const site of seedData) {
    if (!site || !site.id) continue;
    await pool.query(
      `INSERT INTO heritage_sites (id, name, category, data)
       VALUES (?, ?, ?, ?)`,
      [site.id, site.name || 'Unnamed', site.category || 'Monument', JSON.stringify(site)]
    );
  }
  return seedData;
}
