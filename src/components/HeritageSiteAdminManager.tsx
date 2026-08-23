import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  AlertCircle, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  Code, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  MapPin,
  Clock,
  Ticket,
  Train,
  FileText,
  HelpCircle,
  Layers,
  ChevronRight,
  Info,
  X,
  AlertTriangle,
  Undo2,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeritageSite } from '../types';
import { HeritageDataStore } from '../services/heritageDataStore';
import { handleMonumentImageError } from '../utils/imageFallback';
import { fetchAuthenticPlaceImage } from '../services/geminiService';
import { VisualImagePickerModal } from './VisualImagePickerModal';
import { 
  SAMPLE_HERITAGE_SITE_JSON_STRING, 
  HERITAGE_SITE_SCHEMA_GUIDE, 
  HERITAGE_SITE_SCHEMA_GUIDE_TEXT 
} from '../data/sampleHeritageSiteTemplate';

interface HeritageSiteAdminManagerProps {
  currentLang: 'en' | 'hi';
  onSiteSelectForDemo?: (siteId: string) => void;
}

export const HeritageSiteAdminManager: React.FC<HeritageSiteAdminManagerProps> = ({
  currentLang,
  onSiteSelectForDemo
}) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [editingSite, setEditingSite] = useState<HeritageSite | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active editing tab
  const [activeTab, setActiveTab] = useState<'basic' | 'history' | 'facts' | 'travel' | 'nearby' | 'json'>('basic');
  
  // Image URL validation & state
  const [imageTestStatus, setImageTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [isVisualPickerOpen, setIsVisualPickerOpen] = useState(false);
  
  // Toast notification
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Modals
  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = useState(false);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [sitePendingDelete, setSitePendingDelete] = useState<HeritageSite | null>(null);

  const triggerToast = (toast: { message: string; type: 'success' | 'error' | 'info' }) => {
    setFeedbackToast(toast);
    setTimeout(() => setFeedbackToast(null), 3500);
  };
  
  // Raw JSON editor
  const [importJsonText, setImportJsonText] = useState('');
  const [rawJsonEditText, setRawJsonEditText] = useState('');
  const [rawJsonError, setRawJsonError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Add new site JSON modal state
  const [newSiteJsonText, setNewSiteJsonText] = useState(SAMPLE_HERITAGE_SITE_JSON_STRING);
  const [newSiteJsonError, setNewSiteJsonError] = useState<string | null>(null);
  const [showSchemaGuide, setShowSchemaGuide] = useState(false);
  const [isNewSiteLoading, setIsNewSiteLoading] = useState(false);

  // Load sites from data store
  const refreshSites = () => {
    const loaded = HeritageDataStore.getAllSites();
    setSites(loaded);
    if (loaded.length > 0) {
      const currentExists = loaded.find(s => s.id === selectedSiteId);
      const targetSite = currentExists || loaded[0];
      setSelectedSiteId(targetSite.id);
      setEditingSite(JSON.parse(JSON.stringify(targetSite)));
      setRawJsonEditText(JSON.stringify(targetSite, null, 2));
      setIsDirty(false);
    }
  };

  useEffect(() => {
    refreshSites();
    const unsubscribe = HeritageDataStore.subscribe(() => {
      const all = HeritageDataStore.getAllSites();
      setSites(all);
    });
    return unsubscribe;
  }, []);

  // When selected site changes
  const handleSelectSite = (siteId: string) => {
    if (isDirty) {
      if (!window.confirm(currentLang === 'en' 
        ? 'You have unsaved edits on the current monument. Switch anyway?' 
        : 'वर्तमान स्मारक में बिना सहेजे गए बदलाव हैं। क्या आप फिर भी बदलना चाहते हैं?')) {
        return;
      }
    }
    const target = sites.find((s) => s.id === siteId);
    if (target) {
      setSelectedSiteId(siteId);
      setEditingSite(JSON.parse(JSON.stringify(target)));
      setRawJsonEditText(JSON.stringify(target, null, 2));
      setImageTestStatus('idle');
      setImageErrorMessage('');
      setIsDirty(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Test Image URL helper with strict validation
  const handleTestImageUrl = (url: string) => {
    const trimmed = (url || '').trim();
    if (!trimmed) {
      setImageTestStatus('error');
      setImageErrorMessage(currentLang === 'en' ? 'Image link is empty.' : 'चित्र लिंक खाली है।');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setImageTestStatus('error');
      setImageErrorMessage(currentLang === 'en' ? 'Image URL must start with http:// or https://' : 'चित्र URL http:// या https:// से शुरू होना चाहिए।');
      return;
    }

    setImageTestStatus('loading');
    setImageErrorMessage('');

    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    
    img.onload = () => {
      setImageTestStatus('success');
      showToast(currentLang === 'en' ? 'Image URL loaded successfully!' : 'चित्र लिंक सफलतापूर्वक सत्यापित हुआ!', 'success');
    };

    img.onerror = () => {
      setImageTestStatus('error');
      setImageErrorMessage(currentLang === 'en' 
        ? 'Warning: Unable to render image in browser (CORS policy or broken link). Note: This exact URL will still be saved, and a warning placeholder will be displayed on public pages.' 
        : 'चेतावनी: चित्र ब्राउज़र में लोड नहीं हो सका। यह सटीक URL फिर भी सहेजा जाएगा और सार्वजनिक पृष्ठों पर चेतावनी दिखाई जाएगी।');
    };

    img.src = trimmed;
  };

  // Update specific field in editingSite
  const handleFieldChange = (path: string, value: any) => {
    if (!editingSite) return;
    const updated = { ...editingSite };
    
    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      (updated as any)[parent] = {
        ...(updated as any)[parent],
        [child]: value
      };
    } else {
      (updated as any)[path] = value;
    }

    setEditingSite(updated);
    setRawJsonEditText(JSON.stringify(updated, null, 2));
    setIsDirty(true);

    if (path === 'imageUrl') {
      setImageTestStatus('idle');
      setImageErrorMessage('');
    }
  };

  // Prompt Save Confirmation
  const handleRequestSave = () => {
    if (!editingSite) return;

    if (!editingSite.name?.trim()) {
      showToast(currentLang === 'en' ? 'Monument name cannot be empty!' : 'स्मारक का नाम खाली नहीं हो सकता!', 'error');
      return;
    }

    setIsSaveConfirmModalOpen(true);
  };

  // Execute Save
  // Execute Save
  const handleConfirmSave = async () => {
    if (!editingSite) return;

    try {
      await HeritageDataStore.saveSite(editingSite);
      setIsDirty(false);
      setIsSaveConfirmModalOpen(false);
      refreshSites();
      showToast(
        currentLang === 'en' 
          ? `Saved changes for "${editingSite.name}"! Synced globally.` 
          : `"${editingSite.hindiName || editingSite.name}" के बदलाव सहेजे गए!`,
        'success'
      );
    } catch (err: any) {
      showToast(err?.message || 'Failed to save site', 'error');
    }
  };

  // Discard changes (Cancel)
  const handleCancelEdits = () => {
    if (!editingSite) return;
    const saved = HeritageDataStore.getSiteById(editingSite.id) || sites.find(s => s.id === editingSite.id);
    if (saved) {
      setEditingSite(JSON.parse(JSON.stringify(saved)));
      setRawJsonEditText(JSON.stringify(saved, null, 2));
      setIsDirty(false);
      setImageTestStatus('idle');
      setImageErrorMessage('');
      showToast(currentLang === 'en' ? 'Unsaved edits discarded.' : 'अपरिवर्तित बदलाव रद्द किए गए।', 'info');
    }
  };

  // Reset to defaults
  const handleConfirmResetAll = async () => {
    const defaults = await HeritageDataStore.resetToDefaults();
    setSites(defaults);
    if (defaults.length > 0) {
      setSelectedSiteId(defaults[0].id);
      setEditingSite(JSON.parse(JSON.stringify(defaults[0])));
      setRawJsonEditText(JSON.stringify(defaults[0], null, 2));
    }
    setIsDirty(false);
    setIsResetConfirmModalOpen(false);
    showToast(currentLang === 'en' ? 'Catalog restored to verified baseline records.' : 'सभी मूल स्मारक रिकॉर्ड पुनर्स्थापित किए गए।', 'info');
  };

  // Modal & JSON helper actions
  const handleOpenAddSiteModal = () => {
    setNewSiteJsonText(SAMPLE_HERITAGE_SITE_JSON_STRING);
    setNewSiteJsonError(null);
    setShowSchemaGuide(false);
    setIsNewSiteModalOpen(true);
  };

  const handleCopyJsonTemplate = () => {
    navigator.clipboard.writeText(SAMPLE_HERITAGE_SITE_JSON_STRING);
    showToast(currentLang === 'en' ? 'Copied sample JSON template to clipboard!' : 'नमूना JSON टेम्पलेट क्लिपबोर्ड पर कॉपी किया गया!', 'info');
  };

  const handleCopySchemaGuidelines = () => {
    navigator.clipboard.writeText(HERITAGE_SITE_SCHEMA_GUIDE_TEXT);
    showToast(currentLang === 'en' ? 'Copied schema guidelines to clipboard!' : 'स्कीमा दिशा-निर्देश कॉपी किए गए!', 'info');
  };

  const handleLoadSampleTemplate = () => {
    setNewSiteJsonText(SAMPLE_HERITAGE_SITE_JSON_STRING);
    setNewSiteJsonError(null);
    showToast(currentLang === 'en' ? 'Loaded demo JSON template!' : 'डेमो JSON टेम्पलेट लोड किया गया!', 'info');
  };

  const handleCloneIntoNewSiteJson = (siteId: string) => {
    const template = sites.find(s => s.id === siteId);
    if (template) {
      const cloned = {
        ...JSON.parse(JSON.stringify(template)),
        id: `${template.id}-copy-${Date.now().toString().slice(-4)}`,
        name: `${template.name} (Copy)`,
        hindiName: `${template.hindiName || template.name} (प्रतिलिपि)`
      };
      setNewSiteJsonText(JSON.stringify(cloned, null, 2));
      setNewSiteJsonError(null);
      setIsNewSiteModalOpen(true);
      showToast(currentLang === 'en' ? `Cloned "${template.name}" into editor!` : `"${template.name}" का डेटा लोड किया गया!`, 'info');
    }
  };

  // Add new site from JSON
  const handleCreateSiteFromJson = async () => {
    try {
      setNewSiteJsonError(null);
      if (!newSiteJsonText.trim()) {
        setNewSiteJsonError(currentLang === 'en' ? 'JSON text cannot be empty.' : 'JSON टेक्स्ट खाली नहीं हो सकता।');
        return;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(newSiteJsonText);
      } catch (err: any) {
        setNewSiteJsonError(currentLang === 'en' ? `Invalid JSON syntax: ${err.message}` : `अमान्य JSON प्रारूप: ${err.message}`);
        return;
      }

      const siteObject = Array.isArray(parsed) ? parsed[0] : parsed;

      if (!siteObject || typeof siteObject !== 'object') {
        setNewSiteJsonError(currentLang === 'en' ? 'JSON must be a valid site object.' : 'JSON एक वैध स्मारक ऑब्जेक्ट होना चाहिए।');
        return;
      }

      if (!siteObject.id || !siteObject.name) {
        setNewSiteJsonError(currentLang === 'en' ? "JSON must include 'id' and 'name' fields." : "JSON में 'id' और 'name' फ़ील्ड होना आवश्यक है।");
        return;
      }

      setIsNewSiteLoading(true);
      const res = await HeritageDataStore.addNewSite(siteObject as HeritageSite);
      setIsNewSiteLoading(false);

      if (res.success) {
        refreshSites();
        setSelectedSiteId(res.site.id);
        setEditingSite(res.site);
        setRawJsonEditText(JSON.stringify(res.site, null, 2));
        setIsNewSiteModalOpen(false);
        showToast(
          currentLang === 'en'
            ? `Successfully added "${res.site.name}"!`
            : `"${res.site.hindiName || res.site.name}" सफलतापूर्वक जोड़ा गया!`,
          'success'
        );
      }
    } catch (err: any) {
      setIsNewSiteLoading(false);
      setNewSiteJsonError(err?.message || 'Failed to create site');
    }
  };

  // Request Delete Site
  const handleRequestDelete = (site: HeritageSite) => {
    if (sites.length <= 1) {
      showToast(currentLang === 'en' ? 'Cannot delete the last remaining monument.' : 'अंतिम शेष स्मारक को हटाया नहीं जा सकता।', 'error');
      return;
    }
    setSitePendingDelete(site);
    setIsDeleteConfirmModalOpen(true);
  };

  // Confirm Delete Site
  const handleConfirmDelete = async () => {
    if (!sitePendingDelete) return;
    const deletedName = sitePendingDelete.name;
    await HeritageDataStore.deleteSite(sitePendingDelete.id);
    setSitePendingDelete(null);
    setIsDeleteConfirmModalOpen(false);
    refreshSites();
    showToast(currentLang === 'en' ? `Deleted "${deletedName}" from catalog.` : `"${deletedName}" हटा दिया गया।`, 'info');
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = HeritageDataStore.exportAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heritagelens-delhi-sites-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(currentLang === 'en' ? 'Exported heritage sites JSON.' : 'हेरिटेज साइट्स JSON एक्सपोर्ट किया गया।', 'success');
  };

  // Import JSON
  const handleImportJson = async () => {
    if (!importJsonText.trim()) return;
    const res = await HeritageDataStore.importFromJson(importJsonText);
    if (res.success) {
      refreshSites();
      setIsImportModalOpen(false);
      setImportJsonText('');
      showToast(currentLang === 'en' ? `Successfully imported ${res.count} sites!` : `${res.count} स्थल सफलतापूर्वक आयात किए गए!`, 'success');
    } else {
      showToast(res.error || 'Import failed', 'error');
    }
  };

  // Apply Raw JSON editor changes
  const handleApplyRawJson = async () => {
    try {
      setRawJsonError(null);
      const parsed = JSON.parse(rawJsonEditText);
      if (!parsed.id || !parsed.name) {
        throw new Error("JSON must include 'id' and 'name' properties.");
      }

      // If the ID has changed, delete the old site record to avoid duplicates/lingering templates
      if (editingSite && editingSite.id !== parsed.id) {
        await HeritageDataStore.deleteSite(editingSite.id);
      }

      setEditingSite(parsed);
      await HeritageDataStore.saveSite(parsed);
      setIsDirty(false);
      refreshSites();
      setSelectedSiteId(parsed.id);
      showToast(currentLang === 'en' ? 'Applied raw JSON changes!' : 'रॉ JSON बदलाव लागू किए गए!', 'success');
    } catch (err: any) {
      setRawJsonError(err.message || 'Invalid JSON');
      showToast(err.message || 'Invalid JSON syntax', 'error');
    }
  };

  // Filter sites for sidebar/selector
  const filteredSites = sites.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="heritage-admin-setting-container" className="w-full flex flex-col gap-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-sm font-bold ${
              feedbackToast.type === 'success'
                ? 'bg-[#2C4A3E] text-white border-[#3F6A59]'
                : feedbackToast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-[#1E293B] text-white border-slate-700'
            }`}
          >
            {feedbackToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
            {feedbackToast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300" />}
            {feedbackToast.type === 'info' && <Info className="w-5 h-5 text-sky-300" />}
            <span>{feedbackToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner & Global Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#23201D] text-white border border-[#3D3631] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-wider mb-2 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Admin Catalog & Image URL Manager' : 'व्यवस्थापक कैटलॉग एवं चित्र URL प्रबंधक'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heritage text-white flex items-center gap-3">
              <Building2 className="w-7 h-7 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Heritage Monuments Catalog' : 'धरोहर स्मारक सूची एवं विवरण'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              {currentLang === 'en'
                ? 'Directly inspect and customize every field, history narrative, facts, travel details, and image URLs. All edits immediately update all public pages.'
                : 'सभी 10 प्रमाणित स्मारकों के विवरण, इतिहास, रोचक तथ्य, यात्रा सुझाव और चित्र लिंक को मैन्युअल रूप से संपादित करें अथवा नए स्मारक जोड़ें।'}
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="admin-add-monument-btn"
              onClick={handleOpenAddSiteModal}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLang === 'en' ? '+ Add Heritage Site' : '+ नया स्मारक जोड़ें'}</span>
            </button>

            <button
              type="button"
              id="admin-export-json-btn"
              onClick={handleExportJson}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Export JSON' : 'निर्यात'}</span>
            </button>

            <button
              type="button"
              id="admin-import-json-btn"
              onClick={() => setIsImportModalOpen(true)}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Import JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Import JSON' : 'आयात'}</span>
            </button>

            <button
              type="button"
              id="admin-reset-defaults-btn"
              onClick={() => setIsResetConfirmModalOpen(true)}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-300 hover:text-rose-200 border border-neutral-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset all data to default verified records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Reset Defaults' : 'रीसेट'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Monument Selector Sidebar + Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Monument Selector List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C05E42]" />
                <h3 className="text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
                  {currentLang === 'en' ? `Monuments (${sites.length})` : `स्मारक सूची (${sites.length})`}
                </h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F3EEE7] text-[#5C544E] font-medium">
                {currentLang === 'en' ? 'Select to edit' : 'संपादन हेतु चुनें'}
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'en' ? 'Filter by name or slug...' : 'नाम या आईडी से खोजें...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D9] text-xs text-[#1A1A1A] placeholder-[#8C827A] focus:outline-none focus:border-[#C05E42]"
              />
            </div>
          </div>

          {/* List of Sites */}
          <div className="flex flex-col gap-2 max-h-[680px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredSites.map((site, index) => {
              const isSelected = site.id === selectedSiteId;
              return (
                <div
                  key={site.id}
                  onClick={() => handleSelectSite(site.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group relative ${
                    isSelected
                      ? 'bg-[#FDFBF7] border-[#C05E42] shadow-sm ring-2 ring-[#C05E42]/20'
                      : 'bg-white border-[#E8E2D9] hover:border-[#D4AF37] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail with error fallback */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 border border-[#E8E2D9] shrink-0 relative">
                      <img
                        src={site.imageUrl}
                        alt={site.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleMonumentImageError(e, site.id, site.name, site.imageUrl)}
                      />
                      <span className="absolute top-0.5 left-0.5 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="min-w-0 flex flex-col">
                      <h4 className="text-xs font-bold text-[#1A1A1A] truncate group-hover:text-[#C05E42] transition-colors">
                        {currentLang === 'hi' ? site.hindiName : site.name}
                      </h4>
                      <p className="text-[11px] text-[#8C827A] truncate font-mono">
                        {site.id}
                      </p>
                      <span className="text-[10px] text-[#5C544E] truncate">
                        {site.builtYear}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#C05E42] animate-pulse" />
                    )}
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#C05E42]' : 'text-[#8C827A]'}`} />
                  </div>
                </div>
              );
            })}

            {filteredSites.length === 0 && (
              <div className="p-6 text-center text-xs text-[#8C827A] bg-white rounded-2xl border border-[#E8E2D9]">
                {currentLang === 'en' ? 'No monuments matched your query.' : 'कोई स्मारक नहीं मिला।'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Site Detailed Editor (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {editingSite ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm flex flex-col gap-6">
              
              {/* Site Top Bar with Status & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#F3EEE7] text-[#5C544E] border border-[#E8E2D9]">
                      ID: {editingSite.id}
                    </span>
                    {isDirty ? (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300 animate-pulse">
                        {currentLang === 'en' ? '● Unsaved edits' : '● अपरिवर्तित बदलाव'}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium border border-emerald-300">
                        {currentLang === 'en' ? '✓ Saved' : '✓ सहेजा गया'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-heritage text-[#1A1A1A] mt-1">
                    {editingSite.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onSiteSelectForDemo && (
                    <button
                      type="button"
                      onClick={() => onSiteSelectForDemo(editingSite.id)}
                      className="px-3 py-2 rounded-xl bg-[#FDFBF7] hover:bg-[#F3EEE7] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Test recognition in camera demo"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C05E42]" />
                      <span>{currentLang === 'en' ? 'Test Demo' : 'डेमो देखें'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCloneIntoNewSiteJson(editingSite.id)}
                    className="px-3 py-2 rounded-xl bg-[#FDFBF7] hover:bg-[#F3EEE7] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Clone into JSON editor"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#8C827A]" />
                    <span>{currentLang === 'en' ? 'Clone' : 'प्रतिलिपि'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRequestDelete(editingSite)}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Delete site from catalog"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Delete' : 'हटाएं'}</span>
                  </button>

                  {/* Cancel / Discard button */}
                  {isDirty && (
                    <button
                      type="button"
                      onClick={handleCancelEdits}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F3EEE7] text-[#5C544E] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Discard unsaved changes"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>{currentLang === 'en' ? 'Cancel' : 'रद्द करें'}</span>
                    </button>
                  )}

                  {/* Save button */}
                  <button
                    type="button"
                    id="admin-save-site-btn"
                    onClick={handleRequestSave}
                    className="px-4 py-2 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>{currentLang === 'en' ? 'Save Site' : 'सहेजें'}</span>
                  </button>
                </div>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#F8F5F0] p-1.5 rounded-2xl border border-[#E8E2D9]">
                {[
                  { id: 'basic', labelEn: 'Image & Identity', labelHi: 'चित्र एवं पहचान' },
                  { id: 'history', labelEn: 'Descriptions & History', labelHi: 'विवरण एवं इतिहास' },
                  { id: 'facts', labelEn: 'Facts & Folklore', labelHi: 'तथ्य एवं कथाएं' },
                  { id: 'travel', labelEn: 'Travel & Logistics', labelHi: 'यात्रा एवं नियम' },
                  { id: 'nearby', labelEn: 'Nearby Attractions', labelHi: 'निकटवर्ती आकर्षण' },
                  { id: 'json', labelEn: 'Raw JSON Editor', labelHi: 'रॉ JSON संपादक' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#E8E2D9]'
                        : 'text-[#5C544E] hover:text-[#1A1A1A] hover:bg-white/50'
                    }`}
                  >
                    {currentLang === 'hi' ? tab.labelHi : tab.labelEn}
                  </button>
                ))}
              </div>

              {/* TAB 1: IMAGE & BASIC IDENTITY */}
              {activeTab === 'basic' && (
                <div className="flex flex-col gap-6">
                  {/* Image Link Box with Live Preview */}
                  <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#C05E42]" />
                        <h4 className="text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
                          {currentLang === 'en' ? 'Monument Image URL & Live Preview' : 'स्मारक चित्र URL एवं लाइव प्रीव्यू'}
                        </h4>
                      </div>
                      <span className="text-[11px] text-[#5C544E]">
                        {currentLang === 'en' ? 'Direct HTTPS / CDN URL' : 'सीधा HTTPS लिंक'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Inputs */}
                      <div className="md:col-span-7 flex flex-col gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                            {currentLang === 'en' ? 'Primary Image URL (Exact URL preserved):' : 'मुख्य चित्र URL (सटीक लिंक):'}
                          </label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              value={editingSite.imageUrl}
                              onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                            />
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setIsVisualPickerOpen(true)}
                                className="px-3 py-2 rounded-xl bg-[#C05E42] hover:bg-[#A84F36] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                title="Search & pick authentic photo visually"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{currentLang === 'en' ? 'Visual Picker' : 'चित्र खोजें'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={async () => {
                                  triggerToast({
                                    type: 'info',
                                    message: currentLang === 'en' ? 'Fetching authentic photo from Wikimedia...' : 'विकीमीडिया से वास्तविक चित्र खोजा जा रहा है...'
                                  });
                                  const img = await fetchAuthenticPlaceImage(
                                    editingSite.name,
                                    editingSite.tags || [],
                                    editingSite.shortDescription || editingSite.fullHistory || ''
                                  );
                                  handleFieldChange('imageUrl', img);
                                  handleTestImageUrl(img);
                                  triggerToast({
                                    type: 'success',
                                    message: currentLang === 'en' ? `Updated photo for "${editingSite.name}"!` : `"${editingSite.name}" का चित्र अपडेट हुआ!`
                                  });
                                }}
                                className="px-3 py-2 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-[#D4AF37] hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                title="Fetch real photo from Wikimedia / Wikipedia"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{currentLang === 'en' ? 'Auto Fetch' : 'स्वतः खोजें'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleTestImageUrl(editingSite.imageUrl)}
                                className="px-3 py-2 rounded-xl bg-[#2D2926] hover:bg-[#403A36] text-white text-xs font-bold transition-colors cursor-pointer"
                                title="Test if image loads in browser"
                              >
                                {currentLang === 'en' ? 'Test URL' : 'जांचें'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Status Message */}
                        {imageTestStatus === 'loading' && (
                          <p className="text-xs text-sky-700 flex items-center gap-1.5 font-medium">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{currentLang === 'en' ? 'Checking image link...' : 'चित्र लिंक जांचा जा रहा है...'}</span>
                          </p>
                        )}
                        {imageTestStatus === 'success' && (
                          <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{currentLang === 'en' ? 'Image link is valid and rendered successfully!' : 'चित्र लिंक वैध है और सफलतापूर्वक लोड हुआ!'}</span>
                          </p>
                        )}
                        {imageTestStatus === 'error' && (
                          <div className="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{imageErrorMessage}</span>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                            {currentLang === 'en' ? 'Image Alt Text (Accessibility):' : 'चित्र विवरण (Alt Text):'}
                          </label>
                          <input
                            type="text"
                            value={editingSite.imageAlt}
                            onChange={(e) => handleFieldChange('imageAlt', e.target.value)}
                            placeholder="Architectural facade of monument..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-[#E8E2D9] text-[11px] text-[#5C544E] flex flex-col gap-1">
                          <span className="font-bold text-[#1A1A1A]">
                            {currentLang === 'en' ? '🔒 Exact URL Guarantee:' : '🔒 सटीक URL गारंटी:'}
                          </span>
                          <span>
                            {currentLang === 'en'
                              ? 'HeritageLens AI will never modify, overwrite, or guess your image link. If the URL fails to load, a warning placeholder is shown with this exact URL so you can fix it.'
                              : 'सिस्टम आपके द्वारा दर्ज किए गए URL को कभी नहीं बदलेगा। यदि लिंक विफल होता है तो चेतावनी दिखाई जाएगी।'}
                          </span>
                        </div>
                      </div>

                      {/* Live Image Preview Card */}
                      <div className="md:col-span-5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#5C544E]">
                            {currentLang === 'en' ? 'Live Card Preview:' : 'लाइव कार्ड प्रीव्यू:'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsVisualPickerOpen(true)}
                            className="text-[11px] text-[#C05E42] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>{currentLang === 'en' ? 'Change Photo' : 'फ़ोटो बदलें'}</span>
                          </button>
                        </div>
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-[#D4AF37] shadow-md group">
                          <img
                            src={editingSite.imageUrl}
                            alt={editingSite.imageAlt || editingSite.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleMonumentImageError(e, editingSite.id, editingSite.name, editingSite.imageUrl)}
                          />
                          <button
                            type="button"
                            onClick={() => setIsVisualPickerOpen(true)}
                            className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg group-hover:scale-105"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{currentLang === 'en' ? 'Visual Picker' : 'चित्र खोजें'}</span>
                          </button>
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 pointer-events-none">
                            <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
                              {editingSite.architecturalStyle || 'Heritage Site'}
                            </span>
                            <h5 className="text-sm font-bold text-white font-serif-heritage leading-tight">
                              {currentLang === 'hi' ? editingSite.hindiName : editingSite.name}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL IMAGE SEARCH & PICKER MODAL */}
                  <VisualImagePickerModal
                    isOpen={isVisualPickerOpen}
                    onClose={() => setIsVisualPickerOpen(false)}
                    onSelectImage={async (newUrl, newAlt) => {
                      handleFieldChange('imageUrl', newUrl);
                      if (newAlt) handleFieldChange('imageAlt', newAlt);
                      handleTestImageUrl(newUrl);
                      if (editingSite) {
                        const updated = {
                          ...editingSite,
                          imageUrl: newUrl,
                          imageAlt: newAlt || editingSite.imageAlt
                        };
                        await HeritageDataStore.saveSite(updated);
                        setEditingSite(updated);
                        setIsDirty(false);
                      }
                      triggerToast({
                        type: 'success',
                        message: currentLang === 'en' ? `Saved photo for "${editingSite.name}"!` : `"${editingSite.name}" का चित्र सहेजा गया!`
                      });
                    }}
                    currentImageUrl={editingSite.imageUrl}
                    placeName={editingSite.name}
                    categoryTags={editingSite.tags}
                    currentLang={currentLang}
                  />

                  {/* Core Identity Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Unique ID (Slug):' : 'विशिष्ट आईडी (Slug):'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.id}
                        disabled
                        className="w-full px-3 py-2 rounded-xl bg-neutral-100 border border-[#E8E2D9] text-xs font-mono text-neutral-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Built Year / Era:' : 'निर्माण वर्ष / काल:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.builtYear}
                        onChange={(e) => handleFieldChange('builtYear', e.target.value)}
                        placeholder="e.g. 1638–1648 CE"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'English Name:' : 'अंग्रेज़ी नाम:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Hindi Name (Devanagari):' : 'हिंदी नाम (देवनागरी):'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.hindiName}
                        onChange={(e) => handleFieldChange('hindiName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs font-bold text-[#1A1A1A] font-devanagari focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Built By (Patron / Architect):' : 'निर्माता / वास्तुकार:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.builtBy}
                        onChange={(e) => handleFieldChange('builtBy', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Architectural Style:' : 'वास्तुशिल्प शैली:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.architecturalStyle}
                        onChange={(e) => handleFieldChange('architecturalStyle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Tags (comma separated):' : 'टैग (कॉमा से अलग करें):'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.tags ? editingSite.tags.join(', ') : ''}
                        onChange={(e) => handleFieldChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                        placeholder="Mughal, UNESCO, Fortress"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Source Citation / Records:' : 'स्रोत / अभिलेख:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.sourceNote}
                        onChange={(e) => handleFieldChange('sourceNote', e.target.value)}
                        placeholder="Archaeological Survey of India (ASI)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DESCRIPTIONS & HISTORY */}
              {activeTab === 'history' && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Short Description (English):' : 'संक्षिप्त विवरण (अंग्रेज़ी):'}
                      </label>
                      <textarea
                        rows={3}
                        value={editingSite.shortDescription}
                        onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Short Description (Hindi):' : 'संक्षिप्त विवरण (हिंदी):'}
                      </label>
                      <textarea
                        rows={3}
                        value={editingSite.hindiShortDescription}
                        onChange={(e) => handleFieldChange('hindiShortDescription', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] font-devanagari focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Full Historical Narrative (English):' : 'संपूर्ण ऐतिहासिक वृत्तांत (अंग्रेज़ी):'}
                      </label>
                      <textarea
                        rows={6}
                        value={editingSite.fullHistory}
                        onChange={(e) => handleFieldChange('fullHistory', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] leading-relaxed focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Full Historical Narrative (Hindi):' : 'संपूर्ण ऐतिहासिक वृत्तांत (हिंदी):'}
                      </label>
                      <textarea
                        rows={6}
                        value={editingSite.hindiFullHistory}
                        onChange={(e) => handleFieldChange('hindiFullHistory', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] font-devanagari leading-relaxed focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Cultural & Architectural Significance (English):' : 'सांस्कृतिक एवं वास्तुशिल्प महत्व (अंग्रेज़ी):'}
                      </label>
                      <textarea
                        rows={4}
                        value={editingSite.culturalSignificance}
                        onChange={(e) => handleFieldChange('culturalSignificance', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Cultural & Architectural Significance (Hindi):' : 'सांस्कृतिक एवं वास्तुशिल्प महत्व (हिंदी):'}
                      </label>
                      <textarea
                        rows={4}
                        value={editingSite.hindiCulturalSignificance}
                        onChange={(e) => handleFieldChange('hindiCulturalSignificance', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] font-devanagari focus:outline-none focus:border-[#C05E42]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FACTS & FOLKLORE */}
              {activeTab === 'facts' && (
                <div className="flex flex-col gap-6">
                  {/* Facts List */}
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
                        {currentLang === 'en' ? 'Interesting Facts (English & Hindi Pairs)' : 'रोचक तथ्य (अंग्रेज़ी एवं हिंदी)'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const facts = editingSite.interestingFacts || [];
                          const hiFacts = editingSite.hindiInterestingFacts || [];
                          handleFieldChange('interestingFacts', [...facts, 'New interesting architectural or historical fact']);
                          handleFieldChange('hindiInterestingFacts', [...hiFacts, 'नया रोचक ऐतिहासिक तथ्य']);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#C05E42] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{currentLang === 'en' ? '+ Add Fact' : '+ तथ्य जोड़ें'}</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {(editingSite.interestingFacts || []).map((fact, fIdx) => (
                        <div key={fIdx} className="p-3 rounded-xl bg-white border border-[#E8E2D9] flex flex-col gap-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#8C827A]">
                              Fact #{fIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const facts = [...(editingSite.interestingFacts || [])];
                                const hiFacts = [...(editingSite.hindiInterestingFacts || [])];
                                facts.splice(fIdx, 1);
                                hiFacts.splice(fIdx, 1);
                                handleFieldChange('interestingFacts', facts);
                                handleFieldChange('hindiInterestingFacts', hiFacts);
                              }}
                              className="text-rose-600 hover:text-rose-800 text-[11px] font-bold cursor-pointer"
                            >
                              {currentLang === 'en' ? 'Remove' : 'हटाएं'}
                            </button>
                          </div>
                          <input
                            type="text"
                            value={fact}
                            onChange={(e) => {
                              const facts = [...(editingSite.interestingFacts || [])];
                              facts[fIdx] = e.target.value;
                              handleFieldChange('interestingFacts', facts);
                            }}
                            placeholder="English Fact"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                          />
                          <input
                            type="text"
                            value={(editingSite.hindiInterestingFacts || [])[fIdx] || ''}
                            onChange={(e) => {
                              const hiFacts = [...(editingSite.hindiInterestingFacts || [])];
                              hiFacts[fIdx] = e.target.value;
                              handleFieldChange('hindiInterestingFacts', hiFacts);
                            }}
                            placeholder="हिंदी तथ्य"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#1A1A1A] font-devanagari"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Folklore / Oral Legends */}
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
                        {currentLang === 'en' ? 'Folklore & Oral Traditions' : 'लोककथाएं एवं जनश्रुतियां'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const folk = editingSite.folkloreOrLegends || [];
                          const hiFolk = editingSite.hindiFolkloreOrLegends || [];
                          handleFieldChange('folkloreOrLegends', [...folk, 'Folklore / Oral Tradition: ...']);
                          handleFieldChange('hindiFolkloreOrLegends', [...hiFolk, 'लोककथा / जनश्रुति: ...']);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#2C4A3E] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{currentLang === 'en' ? '+ Add Legend' : '+ कथा जोड़ें'}</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {(editingSite.folkloreOrLegends || []).map((legend, lIdx) => (
                        <div key={lIdx} className="p-3 rounded-xl bg-white border border-[#E8E2D9] flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#8C827A]">Legend #{lIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const folk = [...(editingSite.folkloreOrLegends || [])];
                                const hiFolk = [...(editingSite.hindiFolkloreOrLegends || [])];
                                folk.splice(lIdx, 1);
                                hiFolk.splice(lIdx, 1);
                                handleFieldChange('folkloreOrLegends', folk);
                                handleFieldChange('hindiFolkloreOrLegends', hiFolk);
                              }}
                              className="text-rose-600 hover:text-rose-800 text-[11px] font-bold cursor-pointer"
                            >
                              {currentLang === 'en' ? 'Remove' : 'हटाएं'}
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={legend}
                            onChange={(e) => {
                              const folk = [...(editingSite.folkloreOrLegends || [])];
                              folk[lIdx] = e.target.value;
                              handleFieldChange('folkloreOrLegends', folk);
                            }}
                            className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                          />
                          <textarea
                            rows={2}
                            value={(editingSite.hindiFolkloreOrLegends || [])[lIdx] || ''}
                            onChange={(e) => {
                              const hiFolk = [...(editingSite.hindiFolkloreOrLegends || [])];
                              hiFolk[lIdx] = e.target.value;
                              handleFieldChange('hindiFolkloreOrLegends', hiFolk);
                            }}
                            className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#1A1A1A] font-devanagari"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TRAVEL & LOGISTICS */}
              {activeTab === 'travel' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Visiting Timings:' : 'खुलने का समय:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.travelTips?.timings || ''}
                        onChange={(e) => handleFieldChange('travelTips.timings', e.target.value)}
                        placeholder="e.g. 9:00 AM – 5:30 PM (Closed Mondays)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Entry Fee Details:' : 'प्रवेश शुल्क विवरण:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.travelTips?.entryFee || ''}
                        onChange={(e) => handleFieldChange('travelTips.entryFee', e.target.value)}
                        placeholder="e.g. ₹35 for Indians, ₹500 for Foreigners"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Nearest Metro Station:' : 'निकटतम मेट्रो स्टेशन:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.travelTips?.nearestMetro || ''}
                        onChange={(e) => handleFieldChange('travelTips.nearestMetro', e.target.value)}
                        placeholder="e.g. Lal Qila (Violet Line)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        {currentLang === 'en' ? 'Best Time to Visit:' : 'भ्रमण का सर्वोत्तम समय:'}
                      </label>
                      <input
                        type="text"
                        value={editingSite.travelTips?.bestTimeToVisit || ''}
                        onChange={(e) => handleFieldChange('travelTips.bestTimeToVisit', e.target.value)}
                        placeholder="e.g. October to March"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      {currentLang === 'en' ? 'Visitor Rules & Guidelines (comma separated):' : 'आगंतुक नियम एवं दिशा-निर्देश:'}
                    </label>
                    <input
                      type="text"
                      value={editingSite.travelTips?.rules ? editingSite.travelTips.rules.join(', ') : ''}
                      onChange={(e) => handleFieldChange('travelTips.rules', e.target.value.split(',').map(r => r.trim()).filter(Boolean))}
                      placeholder="Photography allowed, Security check at gate"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: NEARBY ATTRACTIONS */}
              {activeTab === 'nearby' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
                      {currentLang === 'en' ? 'Nearby Attractions' : 'निकटवर्ती दर्शनीय स्थल'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingSite.nearbyAttractions || [];
                        handleFieldChange('nearbyAttractions', [
                          ...current,
                          { name: 'New Attraction', distance: '500 m', description: 'Nearby heritage or culinary spot' }
                        ]);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#C05E42] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{currentLang === 'en' ? '+ Add Attraction' : '+ आकर्षण जोड़ें'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(editingSite.nearbyAttractions || []).map((attr, aIdx) => (
                      <div key={aIdx} className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D9] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-bold text-[#8C827A] mb-0.5">Name</label>
                          <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => {
                              const list = [...(editingSite.nearbyAttractions || [])];
                              list[aIdx] = { ...list[aIdx], name: e.target.value };
                              handleFieldChange('nearbyAttractions', list);
                            }}
                            className="w-full px-2 py-1 rounded-md bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-bold text-[#8C827A] mb-0.5">Distance</label>
                          <input
                            type="text"
                            value={attr.distance}
                            onChange={(e) => {
                              const list = [...(editingSite.nearbyAttractions || [])];
                              list[aIdx] = { ...list[aIdx], distance: e.target.value };
                              handleFieldChange('nearbyAttractions', list);
                            }}
                            placeholder="e.g. 400 m"
                            className="w-full px-2 py-1 rounded-md bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-bold text-[#8C827A] mb-0.5">Description</label>
                          <input
                            type="text"
                            value={attr.description}
                            onChange={(e) => {
                              const list = [...(editingSite.nearbyAttractions || [])];
                              list[aIdx] = { ...list[aIdx], description: e.target.value };
                              handleFieldChange('nearbyAttractions', list);
                            }}
                            className="w-full px-2 py-1 rounded-md bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A]"
                          />
                        </div>
                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(editingSite.nearbyAttractions || [])];
                              list.splice(aIdx, 1);
                              handleFieldChange('nearbyAttractions', list);
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: RAW JSON EDITOR */}
              {activeTab === 'json' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#5C544E]">
                      {currentLang === 'en'
                        ? 'Directly view or modify the complete structured JSON payload for this monument.'
                        : 'इस स्मारक के संपूर्ण JSON डेटा को सीधे देखें अथवा संपादित करें।'}
                    </p>
                    <button
                      type="button"
                      onClick={handleApplyRawJson}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2C4A3E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{currentLang === 'en' ? 'Apply JSON Edits' : 'JSON लागू करें'}</span>
                    </button>
                  </div>

                  {rawJsonError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
                      {rawJsonError}
                    </div>
                  )}

                  <textarea
                    rows={16}
                    value={rawJsonEditText}
                    onChange={(e) => {
                      setRawJsonEditText(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full p-4 rounded-2xl bg-neutral-900 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none border border-neutral-800"
                    spellCheck={false}
                  />
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#E8E2D9] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[#5C544E]">
                  <span>{currentLang === 'en' ? 'Active monument:' : 'सक्रिय स्मारक:'}</span>{' '}
                  <strong className="text-[#1A1A1A]">{editingSite.name}</strong> ({editingSite.id})
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancelEdits}
                    disabled={!isDirty}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E2D9] text-[#5C544E] hover:text-[#1A1A1A] text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    {currentLang === 'en' ? 'Discard Changes' : 'बदलाव छोड़ें'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestSave}
                    className="px-5 py-2.5 rounded-xl bg-[#C05E42] hover:bg-[#a84d34] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>{currentLang === 'en' ? 'Save All Changes' : 'सभी बदलाव सहेजें'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E2D9] text-xs text-[#8C827A]">
              {currentLang === 'en' ? 'Select a monument from the list on the left to view and edit its details.' : 'विवरण देखने और संपादित करने के लिए बाईं ओर से स्मारक चुनें।'}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Save Confirmation */}
      <AnimatePresence>
        {isSaveConfirmModalOpen && editingSite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#E8E2D9] shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2C4A3E]/10 text-[#2C4A3E] flex items-center justify-center font-bold">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {currentLang === 'en' ? 'Confirm Changes' : 'बदलाव की पुष्टि करें'}
                  </h3>
                  <p className="text-xs text-[#5C544E]">
                    {editingSite.name} ({editingSite.id})
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex flex-col gap-2 text-xs text-[#5C544E]">
                <p>
                  {currentLang === 'en'
                    ? 'Are you sure you want to save these modifications to the heritage database? All public views (Home, Explore, Result) will immediately reflect these changes.'
                    : 'क्या आप सुनिश्चित हैं कि आप इस धरोहर स्मारक के विवरण और चित्र लिंक को सहेजना चाहते हैं?'}
                </p>
                <div className="pt-2 border-t border-[#E8E2D9] flex flex-col gap-1">
                  <span className="font-bold text-[#1A1A1A]">{currentLang === 'en' ? 'Image URL configured:' : 'सहेजा जाने वाला चित्र लिंक:'}</span>
                  <span className="font-mono text-[11px] text-[#C05E42] break-all">{editingSite.imageUrl}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C544E] hover:bg-neutral-100 cursor-pointer"
                >
                  {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="px-5 py-2 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{currentLang === 'en' ? 'Confirm & Save' : 'सहेजें'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Reset Confirmation */}
      <AnimatePresence>
        {isResetConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#E8E2D9] shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {currentLang === 'en' ? 'Reset All Monuments?' : 'सभी स्मारक रीसेट करें?'}
                  </h3>
                  <p className="text-xs text-[#5C544E]">
                    {currentLang === 'en' ? 'Restore factory records' : 'मूल प्रमाणित डेटा पुनर्स्थापित करें'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#5C544E] leading-relaxed">
                {currentLang === 'en'
                  ? 'This will restore all 10 heritage sites to the factory default verified ASI records. Any customized fields, added monuments, or edited image URLs will be reset.'
                  : 'यह सभी 10 धरोहर स्थलों को मूल फ़ैक्टरी डेटा पर रीसेट कर देगा। क्या आप आगे बढ़ना चाहते हैं?'}
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C544E] hover:bg-neutral-100 cursor-pointer"
                >
                  {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetAll}
                  className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {currentLang === 'en' ? 'Reset to Defaults' : 'रीसेट करें'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Delete Confirmation */}
      <AnimatePresence>
        {isDeleteConfirmModalOpen && sitePendingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#E8E2D9] shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {currentLang === 'en' ? 'Delete Monument?' : 'स्मारक हटाएं?'}
                  </h3>
                  <p className="text-xs text-[#5C544E]">
                    {sitePendingDelete.name} ({sitePendingDelete.id})
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#5C544E] leading-relaxed">
                {currentLang === 'en'
                  ? `Are you sure you want to delete "${sitePendingDelete.name}" from the active database? This cannot be undone.`
                  : `क्या आप वास्तव में "${sitePendingDelete.hindiName || sitePendingDelete.name}" को डेटाबेस से हटाना चाहते हैं?`}
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteConfirmModalOpen(false);
                    setSitePendingDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C544E] hover:bg-neutral-100 cursor-pointer"
                >
                  {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {currentLang === 'en' ? 'Confirm Delete' : 'हटाएं'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add New Heritage Monument (JSON) */}
      <AnimatePresence>
        {isNewSiteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-3xl bg-white border border-[#E8E2D9] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E8E2D9] bg-[#FDFBF7] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C05E42]/10 text-[#C05E42] flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                      {currentLang === 'en' ? 'Add New Heritage Monument (JSON)' : 'नया धरोहर स्मारक जोड़ें (JSON)'}
                    </h3>
                    <p className="text-xs text-[#5C544E]">
                      {currentLang === 'en' 
                        ? 'Paste the complete structured JSON for the new heritage site.' 
                        : 'नए स्मारक के संपूर्ण JSON विवरण को पेस्ट करें।'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewSiteModalOpen(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 overflow-y-auto flex flex-col gap-4.5 custom-scrollbar flex-1">
                {/* Action Toolbar for JSON Template & Guidelines */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#F8F5F0] p-3 rounded-2xl border border-[#E8E2D9]">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleTemplate}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E2D9] text-[#1A1A1A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Load the standard demo template into editor"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{currentLang === 'en' ? 'Load Demo Template' : 'डेमो टेम्पलेट लोड करें'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyJsonTemplate}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E2D9] text-[#5C544E] hover:text-[#1A1A1A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Copy sample JSON structure to clipboard"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#8C827A]" />
                      <span>{currentLang === 'en' ? 'Copy Template JSON' : 'JSON टेम्पलेट कॉपी करें'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSchemaGuide(!showSchemaGuide)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      showSchemaGuide 
                        ? 'bg-[#2C4A3E] text-white border-[#2C4A3E]' 
                        : 'bg-white text-[#2C4A3E] border-[#2C4A3E]/30 hover:bg-[#2C4A3E]/10'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Field Guidelines' : 'फ़ील्ड नियम'}</span>
                    {showSchemaGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Schema Format Guidelines Accordion */}
                {showSchemaGuide && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] flex flex-col gap-3 text-xs text-[#5C544E] animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
                        {currentLang === 'en' ? '📋 Schema Format Guidelines' : '📋 स्कीमा प्रारूप दिशा-निर्देश'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopySchemaGuidelines}
                        className="text-[11px] text-[#C05E42] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{currentLang === 'en' ? 'Copy Guidelines' : 'नियम कॉपी करें'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] font-mono leading-relaxed bg-white p-3.5 rounded-xl border border-[#E8E2D9] max-h-52 overflow-y-auto">
                      {HERITAGE_SITE_SCHEMA_GUIDE.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5 pb-1.5 border-b border-neutral-100 last:border-0">
                          <span className="font-bold text-[#2C4A3E]">{item.field}:</span>
                          <span className="text-[#5C544E] font-sans">{item.tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clone from existing monument selector (optional helper) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E2D9]">
                  <span className="text-[#8C827A] font-medium">
                    {currentLang === 'en' ? 'Or populate with existing monument as base:' : 'या किसी मौजूदा स्मारक का डेटा लोड करें:'}
                  </span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleCloneIntoNewSiteJson(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#C05E42] cursor-pointer"
                  >
                    <option value="" disabled>
                      {currentLang === 'en' ? '-- Select monument to load --' : '-- स्मारक चुनें --'}
                    </option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Error Message */}
                {newSiteJsonError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{newSiteJsonError}</span>
                  </div>
                )}

                {/* Textarea Code Editor */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1A1A1A]">
                    {currentLang === 'en' ? 'Monument JSON Definition:' : 'स्मारक JSON परिभाषा:'}
                  </label>
                  <textarea
                    rows={12}
                    value={newSiteJsonText}
                    onChange={(e) => {
                      setNewSiteJsonText(e.target.value);
                      if (newSiteJsonError) setNewSiteJsonError(null);
                    }}
                    placeholder={SAMPLE_HERITAGE_SITE_JSON_STRING}
                    className="w-full p-4 rounded-2xl bg-neutral-900 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none border border-neutral-800"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Fixed Modal Footer Actions */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E8E2D9] bg-[#FDFBF7] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewSiteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C544E] hover:bg-neutral-100 cursor-pointer"
                >
                  {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCreateSiteFromJson}
                    disabled={isNewSiteLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {isNewSiteLoading 
                        ? (currentLang === 'en' ? 'Saving...' : 'सहेजा जा रहा है...') 
                        : (currentLang === 'en' ? 'Add Monument to Catalog' : 'स्मारक सूची में जोड़ें')}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Import JSON */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-white p-6 border border-[#E8E2D9] shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#C05E42]" />
                  <h3 className="text-lg font-bold text-[#1A1A1A]">
                    {currentLang === 'en' ? 'Import Heritage Sites JSON' : 'हेरिटेज साइट्स JSON आयात करें'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#5C544E]">
                {currentLang === 'en'
                  ? 'Paste a single heritage site JSON object (or an array of sites) to add or update records in the catalog.'
                  : 'सूची में स्मारकों को जोड़ने या अपडेट करने के लिए एक एकल धरोहर स्थल JSON ऑब्जेक्ट (या स्थलों की सूची) पेस्ट करें।'}
              </p>

              <textarea
                rows={10}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="{ &quot;id&quot;: &quot;salimgarh-fort&quot;, &quot;name&quot;: &quot;Salimgarh Fort&quot;, ... }"
                className="w-full p-3 rounded-xl bg-neutral-900 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none"
              />

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C544E] hover:bg-neutral-100 cursor-pointer"
                >
                  {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="button"
                  onClick={handleImportJson}
                  className="px-4 py-2 rounded-xl bg-[#2C4A3E] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {currentLang === 'en' ? 'Import Sites' : 'आयात करें'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
