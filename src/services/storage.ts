import { UserSettings } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'heritagelens_settings_v1',
  GEMINI_API_KEY: 'heritagelens_gemini_api_key',
  APP_MODE: 'heritagelens_app_mode_v1',
  SAVED_SEARCHES: 'heritagelens_saved_history_v1',
  LAST_RESULT: 'heritagelens_last_result_v1',
  ADMIN_UNLOCKED: 'heritagelens_admin_unlocked_v1'
};

const DEFAULT_SETTINGS: UserSettings = {
  geminiApiKey: '',
  preferredLanguage: 'en',
  speechRate: 0.95,
  autoPlayAudio: false,
  appMode: 'demo',
};

export const StorageService = {
  isAdminUnlocked(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_UNLOCKED) === 'true';
    } catch (e) {
      return false;
    }
  },

  setAdminUnlocked(unlocked: boolean): void {
    try {
      if (unlocked) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_UNLOCKED, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_UNLOCKED);
      }
    } catch (e) {
      console.warn('Failed to update admin unlock state in localStorage');
    }
  },

  verifyAdminPasscode(input: string): boolean {
    const clean = (input || '').trim().toLowerCase();
    const validCodes = ['admin', 'admin123', 'heritage2026', 'heritage', '1234'];
    return validCodes.includes(clean);
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
    try {
      const directMode = localStorage.getItem(STORAGE_KEYS.APP_MODE) as 'gemini' | 'demo' | null;
      if (directMode === 'demo' || directMode === 'gemini') {
        return directMode;
      }
      const hasKey = Boolean(this.getApiKey());
      return hasKey ? 'gemini' : 'demo';
    } catch (e) {
      return 'demo';
    }
  },

  setAppMode(mode: 'gemini' | 'demo'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_MODE, mode);
    } catch (e) {
      console.warn('Failed to save app mode to localStorage');
    }
    this.saveSettings({ appMode: mode });
  },

  isDemoMode(): boolean {
    return this.getAppMode() === 'demo' || !this.getApiKey();
  },

  getApiKey(): string {
    try {
      const directKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
      if (directKey && directKey.trim()) {
        return directKey.trim();
      }
      return this.getSettings().geminiApiKey?.trim() || '';
    } catch (e) {
      return '';
    }
  },

  setApiKey(key: string): void {
    const trimmed = key.trim();
    try {
      if (trimmed) {
        localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, trimmed);
      } else {
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
      }
    } catch (e) {
      console.warn('Failed to set API key in localStorage');
    }
    this.saveSettings({ geminiApiKey: trimmed });
  },

  clearApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    } catch (e) {
      // safe fallback
    }
    this.saveSettings({ geminiApiKey: '' });
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
