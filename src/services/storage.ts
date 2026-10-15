import { UserSettings } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'heritagelens_settings_v1',
  AI_API_KEY: 'heritagelens_ai_api_key',
  GEMINI_API_KEY_LEGACY: 'heritagelens_gemini_api_key',
  APP_MODE: 'heritagelens_app_mode_v1',
  SAVED_SEARCHES: 'heritagelens_saved_history_v1',
  LAST_RESULT: 'heritagelens_last_result_v1',
  ADMIN_UNLOCKED: 'heritagelens_admin_unlocked_v1'
};

const DEFAULT_SETTINGS: UserSettings = {
  apiKey: '',
  aiApiKey: '',
  geminiApiKey: '',
  preferredLanguage: 'en',
  speechRate: 0.95,
  autoPlayAudio: false,
  appMode: 'ai',
};

export const StorageService = {
  isAdminUnlocked(): boolean {
    try {
      const token = localStorage.getItem('heritagelens_admin_token_v2');
      return Boolean(token && token.length > 20);
    } catch (e) {
      return false;
    }
  },

  getAdminToken(): string | null {
    try {
      return localStorage.getItem('heritagelens_admin_token_v2');
    } catch {
      return null;
    }
  },

  setAdminUnlocked(unlocked: boolean, token?: string): void {
    try {
      if (unlocked && token) {
        localStorage.setItem('heritagelens_admin_token_v2', token);
      } else {
        localStorage.removeItem('heritagelens_admin_token_v2');
      }
    } catch (e) {
      console.warn('Failed to update admin unlock state in localStorage');
    }
  },

  async verifyAdminPasscode(passcode: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        this.setAdminUnlocked(true, data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Incorrect administrator password.' };
    } catch (err: any) {
      return { success: false, error: 'Network error communicating with authentication server.' };
    }
  },

  async checkAdminSession(): Promise<boolean> {
    const token = this.getAdminToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/check-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.active) return true;
      this.setAdminUnlocked(false);
      return false;
    } catch {
      return false;
    }
  },

  async adminLogout(): Promise<void> {
    const token = this.getAdminToken();
    this.setAdminUnlocked(false);
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch {}
    }
  },

  getSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Unable to access localStorage for settings:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
      return { ...DEFAULT_SETTINGS, ...settings };
    }
  },

  getAppMode(): 'gemini' | 'demo' {
    return 'gemini';
  },

  setAppMode(_mode: 'gemini' | 'demo'): void {
    // No-op: operating mode selection removed
  },

  isDemoMode(): boolean {
    return false;
  },

  getApiKey(): string {
    try {
      const directKey = localStorage.getItem(STORAGE_KEYS.AI_API_KEY) || localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY_LEGACY);
      if (directKey && directKey.trim()) {
        return directKey.trim();
      }
      const settings = this.getSettings();
      return (settings.apiKey || settings.aiApiKey || settings.geminiApiKey || '').trim();
    } catch (e) {
      return '';
    }
  },

  setApiKey(key: string): void {
    const trimmed = key.trim();
    try {
      if (trimmed) {
        localStorage.setItem(STORAGE_KEYS.AI_API_KEY, trimmed);
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY_LEGACY);
      } else {
        localStorage.removeItem(STORAGE_KEYS.AI_API_KEY);
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY_LEGACY);
      }
    } catch (e) {
      console.warn('Failed to set API key in localStorage');
    }
    this.saveSettings({ apiKey: trimmed, aiApiKey: trimmed, geminiApiKey: trimmed });
  },

  clearApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AI_API_KEY);
      localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY_LEGACY);
    } catch (e) {
      // safe fallback
    }
    this.saveSettings({ apiKey: '', aiApiKey: '', geminiApiKey: '' });
  },

  maskApiKey(key: string): string {
    if (!key || key.length < 8) return '••••••••';
    const start = key.slice(0, 4);
    const end = key.slice(-4);
    return `${start}••••••••••••••••${end}`;
  },

  getPreferredLanguage(): 'en' | 'hi' {
    return this.getSettings().preferredLanguage;
  },

  setPreferredLanguage(lang: 'en' | 'hi'): void {
    this.saveSettings({ preferredLanguage: lang });
  },

  saveLastResult(result: any): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.LAST_RESULT, JSON.stringify(result));
    } catch (e) {
      console.warn('Failed to cache last result:', e);
    }
  },

  getLastResult(): any | null {
    try {
      const item = sessionStorage.getItem(STORAGE_KEYS.LAST_RESULT);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  }
};
