import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Image as ImageIcon, 
  X, 
  Check, 
  ExternalLink, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  AlertCircle,
  Eye,
  CheckCircle2,
  BookOpen,
  Building2,
  Trees,
  ShoppingBag
} from 'lucide-react';

export interface VisualImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, imageAlt?: string) => void;
  currentImageUrl?: string;
  placeName: string;
  categoryTags?: string[];
  currentLang?: 'en' | 'hi';
}

interface ImageResultItem {
  id: string;
  url: string;
  thumbUrl: string;
  title: string;
  source: 'Wikimedia' | 'Wikipedia' | 'Curated' | 'Upload' | 'Custom';
  description?: string;
}

// Curated high-res collections by theme
const CURATED_THEMES: Record<string, { label: string; hindiLabel: string; icon: any; images: ImageResultItem[] }> = {
  bookstore: {
    label: 'Bookstores & Libraries',
    hindiLabel: 'किताबों की दुकानें एवं पुस्तकालय',
    icon: BookOpen,
    images: [
      {
        id: 'curated-book-1',
        url: 'https://www.himalayanwritingretreat.com/wp-content/uploads/2021/10/FAQIR-CHAND-1-PIC-COURTESY-FAQIR-CHAND.jpeg',
        thumbUrl: 'https://ts4.mm.bing.net/th?id=OIP.6eEdt7Ds3BHULx3FMXUtqQHaIw&pid=15.1',
        title: 'Fakir Chand & Sons Historic Book Store (Khan Market, Delhi)',
        source: 'Curated'
      },
      {
        id: 'curated-book-2',
        url: 'https://imgmediagumlet.lbb.in/media/2024/12/675134a3fef45a07cdda55cb_1733375139964.jpg',
        thumbUrl: 'https://ts4.mm.bing.net/th?id=OIP.LRTswqt9kkAMkXZNVM30gwAAAA&pid=15.1',
        title: 'Faqir Chand & Sons Bookstore Entrance & Stacks',
        source: 'Curated'
      },
      {
        id: 'curated-book-3',
        url: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=500&q=75',
        title: 'Floor-to-Ceiling Heritage Bookstore Stacks',
        source: 'Curated'
      },
      {
        id: 'curated-book-4',
        url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=500&q=75',
        title: 'Historic Academic Library Stacks',
        source: 'Curated'
      }
    ]
  },
  temple: {
    label: 'Temples & Spiritual Sanctuaries',
    hindiLabel: 'मंदिर एवं आध्यात्मिक स्थल',
    icon: Building2,
    images: [
      {
        id: 'curated-temple-1',
        url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=500&q=75',
        title: 'Majestic White Stone Temple Facade',
        source: 'Curated'
      },
      {
        id: 'curated-temple-2',
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=75',
        title: 'Traditional Ornate Temple Gopuram & Carvings',
        source: 'Curated'
      },
      {
        id: 'curated-temple-3',
        url: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfddc?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfddc?auto=format&fit=crop&w=500&q=75',
        title: 'Vedic Temple Courtyard & Holy Sanctum',
        source: 'Curated'
      },
      {
        id: 'curated-temple-4',
        url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=500&q=75',
        title: 'Swaminarayan Akshardham Complex Delhi',
        source: 'Curated'
      }
    ]
  },
  gardens: {
    label: 'Gardens, Nurseries & Parks',
    hindiLabel: 'उद्यान, नर्सरी एवं पार्क',
    icon: Trees,
    images: [
      {
        id: 'curated-garden-1',
        url: 'https://images.unsplash.com/photo-1588096344356-9a29656515f4?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1588096344356-9a29656515f4?auto=format&fit=crop&w=500&q=75',
        title: 'Lush Mughal Heritage Garden & Pathways',
        source: 'Curated'
      },
      {
        id: 'curated-garden-2',
        url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=500&q=75',
        title: 'Serene Botanical Nursery & Trees',
        source: 'Curated'
      },
      {
        id: 'curated-garden-3',
        url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=500&q=75',
        title: 'Heritage Courtyard Garden',
        source: 'Curated'
      }
    ]
  },
  markets: {
    label: 'Bazaars, Markets & Urban Streets',
    hindiLabel: 'बाज़ार एवं प्रसिद्ध बाज़ार',
    icon: ShoppingBag,
    images: [
      {
        id: 'curated-market-1',
        url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=500&q=75',
        title: 'Vibrant Traditional Market Promenade',
        source: 'Curated'
      },
      {
        id: 'curated-market-2',
        url: 'https://images.unsplash.com/photo-1626017044256-0b6b6a8e8a5d?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1626017044256-0b6b6a8e8a5d?auto=format&fit=crop&w=500&q=75',
        title: 'Connaught Place Colonnaded Heritage Walkway',
        source: 'Curated'
      }
    ]
  },
  monuments: {
    label: 'Historic Forts & Monuments',
    hindiLabel: 'ऐतिहासिक किले एवं स्मारक',
    icon: Layers,
    images: [
      {
        id: 'curated-monument-1',
        url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=75',
        title: 'Grand Red Sandstone Fort Bastion',
        source: 'Curated'
      },
      {
        id: 'curated-monument-2',
        url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=75',
        title: 'India Gate Triumphal Arch Central Vista',
        source: 'Curated'
      },
      {
        id: 'curated-monument-3',
        url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=500&q=75',
        title: 'Taj Mahal White Marble Dome',
        source: 'Curated'
      }
    ]
  }
};

export const VisualImagePickerModal: React.FC<VisualImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImageUrl,
  placeName,
  categoryTags = [],
  currentLang = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'curated' | 'url' | 'upload'>('search');
  const [searchQuery, setSearchQuery] = useState(placeName || '');
  const [searchResults, setSearchResults] = useState<ImageResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageResultItem | null>(null);
  
  // Custom URL Tab State
  const [customUrl, setCustomUrl] = useState(currentImageUrl || '');
  const [customUrlStatus, setCustomUrlStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');

  // Device Upload Tab State
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | null>(null);

  // Auto-search when modal opens or place name changes
  const executeSearch = useCallback(async (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setIsLoading(true);
    const results: ImageResultItem[] = [];

    // 1. Live Web / Google Image Search via backend endpoint
    try {
      const simplifiedQuery = cleanQuery.replace(/\(.*?\)/g, '').trim();
      const res = await fetch(`/api/image-search?q=${encodeURIComponent(simplifiedQuery || cleanQuery)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          results.push(...json.data);
        }
      }
    } catch (err) {
      console.warn('Backend image search failed, falling back to direct browser APIs:', err);
    }

    // 2. Direct Wikipedia PageImages API
    if (results.length < 8) {
      const headers = { 'User-Agent': 'HeritageLens/1.0 (https://heritagelens.ai; contact@heritagelens.ai)' };
      try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrlimit=8&prop=pageimages|extracts&piprop=original|thumbnail&pithumbsize=800`;
        const wikiRes = await fetch(wikiUrl, { headers });
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          const pages = wikiData.query?.pages || {};
          for (const page of Object.values(pages) as any[]) {
            const imgUrl = page.original?.source || page.thumbnail?.source;
            if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('http') && !results.some(r => r.url === imgUrl)) {
              results.push({
                id: `wiki-${page.pageid || page.title}`,
                url: imgUrl.replace(/\/\d+px-/, '/1600px-'),
                thumbUrl: page.thumbnail?.source || imgUrl,
                title: page.title || cleanQuery,
                source: 'Wikipedia',
                description: page.extract || ''
              });
            }
          }
        }
      } catch (e) {
        console.warn('Wikipedia search error:', e);
      }
    }

    // Keep Live Web Search purely containing actual web & Wikipedia results
    setSearchResults(results);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(placeName);
      setSelectedImage(
        currentImageUrl
          ? {
              id: 'current-site-image',
              url: currentImageUrl,
              thumbUrl: currentImageUrl,
              title: placeName,
              source: 'Custom'
            }
          : null
      );
      executeSearch(placeName);
    }
  }, [isOpen, placeName, currentImageUrl, executeSearch]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(currentLang === 'en' ? 'Please select a valid image file (JPG, PNG, WebP).' : 'कृपया वैध चित्र फ़ाइल चुनें (JPG, PNG, WebP)।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setUploadedDataUrl(result);
        setSelectedImage({
          id: `upload-${Date.now()}`,
          url: result,
          thumbUrl: result,
          title: file.name,
          source: 'Upload'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle custom URL validation
  const handleTestCustomUrl = (url: string) => {
    if (!url || !url.startsWith('http')) {
      setCustomUrlStatus('invalid');
      return;
    }
    setCustomUrlStatus('testing');
    const img = new Image();
    img.onload = () => {
      setCustomUrlStatus('valid');
      setSelectedImage({
        id: `custom-${Date.now()}`,
        url,
        thumbUrl: url,
        title: placeName || 'Custom URL',
        source: 'Custom'
      });
    };
    img.onerror = () => {
      setCustomUrlStatus('invalid');
    };
    img.src = url;
  };

  // Confirm selection
  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage.url, `${selectedImage.title || placeName} photograph`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-5xl max-h-[92vh] bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1A1A1A]"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-[#23201D] border-b border-[#3D3631] flex items-center justify-between shrink-0 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C05E42]/20 border border-[#C05E42]/50 flex items-center justify-center text-[#E07A5F]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-serif-heritage text-white tracking-wide">
                  {currentLang === 'en' ? 'Visual Image Search & Photo Picker' : 'चित्र खोज एवं फ़ोटो चयनकर्ता'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  {currentLang === 'en' ? 'Live Web & Commons' : 'लाइव वेब एवं विकी'}
                </span>
              </div>
              <p className="text-xs text-[#A89F91]">
                {currentLang === 'en' 
                  ? `Select or upload the authentic photograph for "${placeName}"`
                  : `"${placeName}" के लिए वास्तविक और सटीक फ़ोटो चुनें या अपलोड करें`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-6 pt-3 pb-2 bg-white border-b border-[#E8E2D9] flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#2C4A3E] text-white shadow-xs'
                : 'bg-neutral-100 text-[#5C544E] hover:bg-neutral-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Google & Web Search' : 'गूगल और वेब खोज'}</span>
            {searchResults.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {searchResults.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('curated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'curated'
                ? 'bg-[#2C4A3E] text-white shadow-xs'
                : 'bg-neutral-100 text-[#5C544E] hover:bg-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Curated HD Collections' : 'क्यूरेटेड संग्रह'}</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-[#2C4A3E] text-white shadow-xs'
                : 'bg-neutral-100 text-[#5C544E] hover:bg-neutral-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Direct Image URL' : 'सीधा URL'}</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#2C4A3E] text-white shadow-xs'
                : 'bg-neutral-100 text-[#5C544E] hover:bg-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Upload from Device' : 'डिवाइस से अपलोड'}</span>
          </button>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[380px]">
          {/* 1. LIVE SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="flex flex-col gap-5">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchQuery)}
                    placeholder={currentLang === 'en' ? "Search place, monument, or keywords (e.g. 'Fakir Chand', 'Khan Market', 'ISKCON Noida')..." : "स्थल या कीवर्ड खोजें..."}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E2D9] focus:border-[#C05E42] focus:ring-2 focus:ring-[#C05E42]/20 rounded-2xl text-xs text-[#1A1A1A] outline-hidden shadow-2xs font-medium"
                  />
                  <Search className="w-4 h-4 text-[#8C8276] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  type="button"
                  onClick={() => executeSearch(searchQuery)}
                  disabled={isLoading || !searchQuery.trim()}
                  className="px-5 py-2.5 bg-[#2C4A3E] hover:bg-[#223930] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-[#D4AF37] animate-spin" />
                      <span>{currentLang === 'en' ? 'Searching...' : 'खोजा जा रहा है...'}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{currentLang === 'en' ? 'Search Photos' : 'फ़ोटो खोजें'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Keyword Query Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#8C8276] mr-1">
                  {currentLang === 'en' ? 'Quick queries:' : 'त्वरित खोज:'}
                </span>
                {[
                  placeName,
                  placeName.replace(/\b(Temple|Fort|Store|Bookstore|Market|Delhi|Noida)\b/gi, '').trim(),
                  `${placeName} Delhi`,
                  ...categoryTags.slice(0, 3)
                ]
                  .filter((v, i, a) => v && v.length > 2 && a.indexOf(v) === i)
                  .map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchQuery(chip);
                        executeSearch(chip);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white hover:bg-neutral-100 border border-[#E8E2D9] text-[#5C544E] transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
              </div>

              {/* Grid of Results */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-4/3 rounded-2xl bg-neutral-200 animate-pulse" />
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-[#E8E2D9]">
                  <ImageIcon className="w-12 h-12 text-neutral-300 mb-3" />
                  <h4 className="text-sm font-bold text-[#1A1A1A]">
                    {currentLang === 'en' ? 'No web photos found for this search' : 'इस खोज के लिए कोई वेब फ़ोटो नहीं मिली'}
                  </h4>
                  <p className="text-xs text-[#8C8276] max-w-md mt-1 mb-4">
                    {currentLang === 'en'
                      ? 'Try searching broader keywords above, choose from our Curated Collections tab, or copy an image link from Google Images.'
                      : 'अन्य कीवर्ड आज़माएं या Google Images से लिंक कॉपी करके पेस्ट करें।'}
                  </p>
                  <a
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(placeName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D2926] text-[#D4AF37] hover:text-white text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{currentLang === 'en' ? 'Search on Google Images ↗' : 'गूगल इमेजेज़ पर खोजें ↗'}</span>
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {searchResults.map((item) => {
                    const isSelected = selectedImage?.url === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImage(item)}
                        onDoubleClick={() => {
                          onSelectImage(item.url, `${item.title || placeName} photograph`);
                          onClose();
                        }}
                        className={`group relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-xs ${
                          isSelected
                            ? 'border-[#C05E42] ring-3 ring-[#C05E42]/30 scale-[1.02]'
                            : 'border-[#E8E2D9] hover:border-[#C05E42]/50 hover:shadow-md'
                        }`}
                      >
                        <img
                          src={item.thumbUrl || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                          <span className="text-[10px] text-white/80 font-medium line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">
                            {item.source}
                          </span>
                        </div>

                        {/* Hover Quick Apply Button */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectImage(item.url, `${item.title || placeName} photograph`);
                              onClose();
                            }}
                            className="pointer-events-auto px-3 py-1.5 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-[11px] font-bold shadow-lg flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                          >
                            <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{currentLang === 'en' ? 'Use Photo' : 'यह चुनें'}</span>
                          </button>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#C05E42] text-white flex items-center justify-center shadow-md z-10">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. CURATED COLLECTIONS TAB */}
          {activeTab === 'curated' && (
            <div className="flex flex-col gap-6">
              {Object.entries(CURATED_THEMES).map(([catKey, category]) => {
                const IconComponent = category.icon;
                return (
                  <div key={catKey} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-[#C05E42]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                        {currentLang === 'hi' ? category.hindiLabel : category.label}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {category.images.map((item) => {
                        const isSelected = selectedImage?.url === item.url;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedImage(item)}
                            className={`group relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-xs ${
                              isSelected
                                ? 'border-[#C05E42] ring-3 ring-[#C05E42]/30 scale-[1.02]'
                                : 'border-[#E8E2D9] hover:border-[#C05E42]/50 hover:shadow-md'
                            }`}
                          >
                            <img
                              src={item.thumbUrl}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                              <span className="text-[10px] text-white/90 font-medium line-clamp-1">
                                {item.title}
                              </span>
                              <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">
                                {item.source}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#C05E42] text-white flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. DIRECT URL TAB */}
          {activeTab === 'url' && (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              <div className="p-5 bg-white rounded-2xl border border-[#E8E2D9] flex flex-col gap-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[#C05E42]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                      {currentLang === 'en' ? 'Paste Any Direct Image Link' : 'चित्र का सीधा लिंक दर्ज करें'}
                    </h4>
                  </div>

                  <a
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(placeName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#C05E42] hover:underline font-bold"
                  >
                    <span>{currentLang === 'en' ? 'Find on Google Images' : 'गूगल इमेजेज़ पर खोजें'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => {
                      setCustomUrl(e.target.value);
                      setCustomUrlStatus('idle');
                    }}
                    placeholder="https://images.unsplash.com/... or https://upload.wikimedia.org/..."
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-[#E8E2D9] focus:border-[#C05E42] rounded-xl text-xs font-mono text-[#1A1A1A] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleTestCustomUrl(customUrl)}
                    className="px-5 py-2.5 bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    {currentLang === 'en' ? 'Validate & Preview' : 'जांचें एवं पूर्वावलोकन'}
                  </button>
                </div>

                {customUrlStatus === 'valid' && (
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentLang === 'en' ? 'Image link is valid and ready to use!' : 'चित्र लिंक वैध है!'}</span>
                  </p>
                )}

                {customUrlStatus === 'invalid' && (
                  <p className="text-xs text-rose-700 font-bold flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{currentLang === 'en' ? 'Could not load image from this URL. Please check the link.' : 'इस लिंक से चित्र लोड नहीं हो सका।'}</span>
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-neutral-100 text-xs text-[#5C544E] leading-relaxed flex flex-col gap-2">
                <span className="font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '💡 How to get a direct image link from Google Images:' : '💡 गूगल इमेजेज़ से लिंक कैसे प्राप्त करें:'}
                </span>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Click <strong>Find on Google Images</strong> above to open Google Images.</li>
                  <li>Click on the exact photo of <em>{placeName}</em> you prefer.</li>
                  <li>Right-click on the enlarged preview image and select <strong>"Copy Image Address"</strong> (or "Copy image link").</li>
                  <li>Paste the copied URL here and click <strong>Validate & Preview</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* 4. UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center p-8 max-w-xl mx-auto">
              <label className="w-full flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-[#C05E42]/40 hover:border-[#C05E42] rounded-3xl cursor-pointer transition-all hover:bg-[#FDFBF7] shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#C05E42]/10 text-[#C05E42] flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? 'Click to select photo from device' : 'डिवाइस से फ़ोटो चुनें'}
                </h4>
                <p className="text-xs text-[#8C8276] mt-1 text-center">
                  {currentLang === 'en' ? 'Supports JPG, PNG, WebP up to 10MB' : 'JPG, PNG, WebP फ़ाइलें समर्थित हैं'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedDataUrl && (
                <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 mt-4 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'en' ? 'Photo loaded successfully from device!' : 'डिवाइस से फ़ोटो लोड हो गई!'}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER WITH LIVE PREVIEW & CONFIRM BUTTON */}
        <div className="px-6 py-4 bg-white border-t border-[#E8E2D9] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Selected Thumbnail Preview */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedImage ? (
              <>
                <div className="w-14 h-11 rounded-xl overflow-hidden border border-[#D4AF37] bg-neutral-900 shrink-0 shadow-xs">
                  <img
                    src={selectedImage.thumbUrl || selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-[#8C8276] font-bold uppercase tracking-wider">
                    {currentLang === 'en' ? 'Selected Photo:' : 'चयनित चित्र:'}
                  </span>
                  <span className="text-xs font-bold text-[#1A1A1A] truncate max-w-xs">
                    {selectedImage.title || placeName}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-xs text-[#8C8276] italic">
                {currentLang === 'en' ? 'No photo selected yet' : 'कोई चित्र चयनित नहीं है'}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E8E2D9] text-[#5C544E] hover:bg-neutral-100 text-xs font-bold transition-colors cursor-pointer"
            >
              {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>

            <button
              type="button"
              onClick={handleConfirmSelection}
              disabled={!selectedImage}
              className="px-6 py-2.5 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Use This Photo' : 'यह फ़ोटो चुनें'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
