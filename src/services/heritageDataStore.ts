import { useState, useEffect } from 'react';
import { DELHI_HERITAGE_SITES } from '../data/heritageSites';
import { HeritageSite } from '../types';
import { isMonumentMatch } from '../utils/monumentMatcher';

const STORAGE_KEY = 'heritagelens_custom_heritage_sites_v2';
const EVENT_NAME = 'heritagelens_heritage_data_updated';

// Relative API Base URL
const API_BASE = '';

/**
 * Service to manage the editable catalog of heritage sites.
 * Connects directly to the Node.js / Express REST API (/api/sites)
 * with instant client updates and automatic multi-browser synchronization.
 */
export const HeritageDataStore = {
  /**
   * Initializes the store and registers window focus sync.
   */
  init(): void {
    this.syncWithServer().catch(() => {});

    if (typeof window !== 'undefined') {
      // Auto re-sync whenever user focuses the tab
      window.addEventListener('focus', () => {
        this.syncWithServer().catch(() => {});
      });
      // Also sync across tabs via storage event
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.notifySubscribers();
        }
      });
    }
  },

  /**
   * Fetches latest global dataset from Node.js backend.
   */
  async syncWithServer(): Promise<HeritageSite[]> {
    try {
      const res = await fetch(`${API_BASE}/api/sites?_t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Merge server data with current local cache so newly discovered or edited sites are never wiped
          let localList: HeritageSite[] = [];
          try {
            const localStored = localStorage.getItem(STORAGE_KEY);
            if (localStored) localList = JSON.parse(localStored);
          } catch {}

          const mergedMap = new Map<string, HeritageSite>();
          // 1. Populate server data
          for (const s of json.data) {
            if (s && s.id) mergedMap.set(s.id.toLowerCase(), s);
          }
          // 2. Preserve any local custom sites and locally updated photos
          if (Array.isArray(localList)) {
            for (const s of localList) {
              if (s && s.id) {
                const sId = s.id.toLowerCase();
                const serverVer = mergedMap.get(sId);
                if (!serverVer) {
                  mergedMap.set(sId, s);
                  // Background push to server
                  fetch(`${API_BASE}/api/sites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(s)
                  }).catch(() => {});
                } else if (s.imageUrl && s.imageUrl !== serverVer.imageUrl) {
                  // Local user customized or updated this photo - preserve local photo!
                  mergedMap.set(sId, { ...serverVer, imageUrl: s.imageUrl, imageAlt: s.imageAlt || serverVer.imageAlt });
                }
              }
            }
          }

          const finalList = Array.from(mergedMap.values());
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalList));
          this.notifySubscribers();
          return finalList;
        }
      }
    } catch (err) {
      console.log('[HeritageDataStore] Server sync offline, using local cache.');
    }
    return this.getAllSites();
  },

  /**
   * Returns all heritage sites (from memory / local cache, merged with baseline 11 sites).
   */
  getAllSites(): HeritageSite[] {
    const baseSites = JSON.parse(JSON.stringify(DELHI_HERITAGE_SITES)) as HeritageSite[];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge baseSites and custom stored sites by ID
          const mergedMap = new Map<string, HeritageSite>();
          // Put base sites first
          for (const s of baseSites) {
            if (s && s.id) mergedMap.set(s.id.toLowerCase(), s);
          }
          // Merge / add user's customized & newly added sites
          for (const s of parsed) {
            if (s && s.id) {
              const existing = mergedMap.get(s.id.toLowerCase());
              mergedMap.set(s.id.toLowerCase(), { ...existing, ...s });
            }
          }
          return Array.from(mergedMap.values());
        }
      }
    } catch (error) {
      console.warn('Failed to parse customized heritage sites from localStorage:', error);
    }
    // Return deep copy of default sites
    return baseSites;
  },

  /**
   * Returns a single heritage site by ID.
   */
  getSiteById(id: string): HeritageSite | undefined {
    const sites = this.getAllSites();
    return sites.find((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase());
  },

  /**
   * Saves a modified heritage site (updates both global server DB and local cache).
   */
  async saveSite(updatedSite: HeritageSite): Promise<{ success: boolean; site: HeritageSite }> {
    try {
      const sites = this.getAllSites();
      const index = sites.findIndex((s) => s.id === updatedSite.id || s.id.toLowerCase() === updatedSite.id.toLowerCase());

      if (index >= 0) {
        sites[index] = { ...sites[index], ...updatedSite };
      } else {
        sites.push(updatedSite);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
      this.notifySubscribers();

      // Persist to global backend database
      try {
        const res = await fetch(`${API_BASE}/api/sites/${encodeURIComponent(updatedSite.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSite)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            const freshSites = this.getAllSites();
            const idx = freshSites.findIndex((s) => s.id === updatedSite.id);
            if (idx >= 0) freshSites[idx] = data.data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(freshSites));
            this.notifySubscribers();
          }
        }
      } catch (err) {
        console.warn('[HeritageDataStore] Backend PUT offline/failed:', err);
      }

      return { success: true, site: updatedSite };
    } catch (error) {
      console.error('Error saving heritage site:', error);
      throw error;
    }
  },

  /**
   * Adds a new heritage site globally.
   */
  async addNewSite(newSite: HeritageSite): Promise<{ success: boolean; site: HeritageSite; isAlreadyListed?: boolean }> {
    const sites = this.getAllSites();

    // Check if place already exists by ID OR by fuzzy monument name/alias
    const existingIndex = sites.findIndex(
      (s) => (newSite.id && s.id.toLowerCase() === newSite.id.toLowerCase()) || isMonumentMatch(newSite.name, s)
    );

    if (existingIndex >= 0) {
      // Monument is already listed in catalog! Merge to preserve canonical ID and update image/details
      const merged: HeritageSite = {
        ...existing,
        ...newSite,
        imageUrl: (newSite.imageUrl && newSite.imageUrl.trim()) || existing.imageUrl,
        imageAlt: newSite.imageAlt || existing.imageAlt,
        id: existing.id,
      };
      sites[existingIndex] = merged;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
      this.notifySubscribers();

      // Persist update to global server database
      try {
        fetch(`${API_BASE}/api/sites/${encodeURIComponent(existing.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged),
        }).catch(() => {});
      } catch {}

      return { success: true, site: merged, isAlreadyListed: true };
    }

    // Ensure clean ID for truly new monuments
    let finalId = newSite.id?.trim() || `site-${Date.now()}`;
    finalId = finalId.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const completeSite: HeritageSite = {
      ...newSite,
      id: finalId,
    };

    sites.push(completeSite);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    this.notifySubscribers();

    // Persist to global backend database
    try {
      const res = await fetch(`${API_BASE}/api/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeSite)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const freshSites = this.getAllSites();
          const idx = freshSites.findIndex((s) => s.id === completeSite.id);
          if (idx >= 0) freshSites[idx] = data.data;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(freshSites));
          this.notifySubscribers();
        }
      }
    } catch (err) {
      console.warn('[HeritageDataStore] Backend POST offline/failed:', err);
    }

    return { success: true, site: completeSite, isAlreadyListed: false };
  },

  /**
   * Deletes a heritage site by ID globally.
   */
  async deleteSite(id: string): Promise<boolean> {
    try {
      const sites = this.getAllSites();
      const filtered = sites.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      this.notifySubscribers();

      // Persist to global backend database
      try {
        await fetch(`${API_BASE}/api/sites/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.warn('[HeritageDataStore] Backend DELETE offline/failed:', err);
      }

      return true;
    } catch (error) {
      console.error('Failed to delete site:', error);
      return false;
    }
  },

  /**
   * Resets all heritage sites back to the official default baseline.
   */
  async resetToDefaults(): Promise<HeritageSite[]> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.notifySubscribers();

      // Reset backend database
      try {
        const res = await fetch(`${API_BASE}/api/sites/reset`, {
          method: 'POST'
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
            this.notifySubscribers();
            return json.data;
          }
        }
      } catch (err) {
        console.warn('[HeritageDataStore] Backend reset failed:', err);
      }

      return JSON.parse(JSON.stringify(DELHI_HERITAGE_SITES));
    } catch (error) {
      console.error('Failed to reset heritage sites:', error);
      return DELHI_HERITAGE_SITES;
    }
  },

  /**
   * Overwrites all sites with a new list (e.g. from JSON import).
   */
  saveAllSites(sites: HeritageSite[]): boolean {
    try {
      if (!Array.isArray(sites) || sites.length === 0) return false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
      this.notifySubscribers();
      return true;
    } catch (error) {
      console.error('Failed to save all sites:', error);
      return false;
    }
  },

  /**
   * Exports all sites as formatted JSON string for backup/sharing.
   */
  exportAsJson(): string {
    const sites = this.getAllSites();
    return JSON.stringify(sites, null, 2);
  },

  /**
   * Imports sites from JSON string with validation. Merges with existing records.
   */
  async importFromJson(jsonString: string): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      let parsed = JSON.parse(jsonString);
      const isArray = Array.isArray(parsed);
      
      if (!isArray) {
        parsed = [parsed];
      }

      if (parsed.length === 0) {
        return { success: false, error: 'The imported list is empty.' };
      }

      // Basic field validation
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item || typeof item !== 'object' || !item.id || !item.name) {
          return { success: false, error: `Item at index ${i} is missing required 'id' or 'name' fields.` };
        }
      }

      const existingSites = this.getAllSites();
      let importedCount = 0;

      for (const item of parsed) {
        const index = existingSites.findIndex((s) => s.id === item.id || s.id.toLowerCase() === item.id.toLowerCase());
        if (index >= 0) {
          existingSites[index] = { ...existingSites[index], ...item };
        } else {
          existingSites.push(item);
        }
        importedCount++;

        // Persist to global backend database
        try {
          await fetch(`${API_BASE}/api/sites/${encodeURIComponent(item.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } catch (err) {
          console.warn('[HeritageDataStore] Backend PUT offline/failed for imported site:', item.id, err);
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSites));
      this.notifySubscribers();
      return { success: true, count: importedCount };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Invalid JSON syntax' };
    }
  },

  /**
   * Dispatches a custom event so all active React views can re-render.
   */
  notifySubscribers(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  },

  /**
   * Subscribes to updates.
   */
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(EVENT_NAME, handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
    };
  }
};

/**
 * React Hook for real-time, auto-syncing heritage sites data.
 */
export function useHeritageSites() {
  const [sites, setSites] = useState<HeritageSite[]>(() => HeritageDataStore.getAllSites());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // Initial server fetch on mount
    HeritageDataStore.syncWithServer().then((freshSites) => {
      if (isMounted && freshSites && freshSites.length > 0) {
        setSites(freshSites);
        setIsLoading(false);
      }
    });

    // Real-time subscriber
    const unsubscribe = HeritageDataStore.subscribe(() => {
      if (isMounted) {
        setSites(HeritageDataStore.getAllSites());
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { sites, isLoading };
}

// Automatically initialize sync on module load in browser
if (typeof window !== 'undefined') {
  HeritageDataStore.init();
}
