import { useState, useEffect } from 'react';
import { DELHI_HERITAGE_SITES } from '../data/heritageSites';
import { HeritageSite } from '../types';

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
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          this.notifySubscribers();
          return json.data;
        }
      }
    } catch (err) {
      console.log('[HeritageDataStore] Server sync offline, using local cache.');
    }
    return this.getAllSites();
  },

  /**
   * Returns all heritage sites (from memory / local cache or default 11 sites).
   */
  getAllSites(): HeritageSite[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to parse customized heritage sites from localStorage:', error);
    }
    // Return deep copy of default sites
    return JSON.parse(JSON.stringify(DELHI_HERITAGE_SITES));
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
      const index = sites.findIndex((s) => s.id === updatedSite.id);

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
  async addNewSite(newSite: HeritageSite): Promise<{ success: boolean; site: HeritageSite }> {
    const sites = this.getAllSites();
    // Ensure unique ID
    let finalId = newSite.id?.trim() || `site-${Date.now()}`;
    finalId = finalId.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    
    // If ID already exists, append timestamp
    if (sites.some((s) => s.id === finalId)) {
      finalId = `${finalId}-${Date.now().toString().slice(-4)}`;
    }

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

    return { success: true, site: completeSite };
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
   * Imports sites from JSON string with validation.
   */
  importFromJson(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, error: 'JSON content must be an array of heritage site objects.' };
      }
      if (parsed.length === 0) {
        return { success: false, error: 'The imported list is empty.' };
      }

      // Basic field validation
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.id || !item.name) {
          return { success: false, error: `Item at index ${i} is missing required 'id' or 'name' fields.` };
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      this.notifySubscribers();
      return { success: true, count: parsed.length };
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
