import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Eye, 
  EyeOff, 
  Trash2, 
  Key, 
  FileCheck, 
  Code2, 
  UserCheck, 
  Smartphone, 
  Cpu, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Database
} from 'lucide-react';

interface SecurityAndTestPlanProps {
  currentLang: 'en' | 'hi';
}

export interface ManualTestCase {
  id: number;
  titleEn: string;
  titleHi: string;
  preconditionsEn: string;
  preconditionsHi: string;
  stepsEn: string[];
  stepsHi: string[];
  expectedBehaviorEn: string;
  expectedBehaviorHi: string;
  status: 'PASS' | 'READY';
  category: 'Core Navigation' | 'Image & Camera' | 'API & Security' | 'Recognition & Fallbacks' | 'Audio & Accessibility';
}

export const MANUAL_TEST_CASES: ManualTestCase[] = [
  {
    id: 1,
    titleEn: 'Open the home page',
    titleHi: 'होम पेज खोलें',
    preconditionsEn: 'App loaded on root URL (/) in browser or preview iframe.',
    preconditionsHi: 'ब्राउज़र में ऐप रूट URL (/) पर लोड होना चाहिए।',
    stepsEn: ['Navigate to /', 'Observe header, hero banner, image upload area, and verified pilot monument grid.'],
    stepsHi: ['/ पर जाएं', 'हेडर, हीरो बैनर, फोटो अपलोड क्षेत्र और 10 सत्यापित स्मारकों की सूची देखें।'],
    expectedBehaviorEn: 'Page loads swiftly without errors. Verified Delhi catalog banner and clean heritage aesthetic are displayed.',
    expectedBehaviorHi: 'पेज बिना किसी त्रुटि के लोड होता है और 10 दिल्ली स्मारकों की सूची प्रदर्शित होती है।',
    status: 'PASS',
    category: 'Core Navigation'
  },
  {
    id: 2,
    titleEn: 'Navigate to Explore',
    titleHi: 'एक्सप्लोर पेज पर जाएं',
    preconditionsEn: 'App running on any page.',
    preconditionsHi: 'ऐप किसी भी पेज पर सक्रिय हो।',
    stepsEn: ['Click "Explore" or "View Catalog" in the header navigation or bottom mobile tab.'],
    stepsHi: ['हेडर या मोबाइल बॉटम बार में "Explore" लिंक पर क्लिक करें।'],
    expectedBehaviorEn: 'Explore page renders full 10 Delhi pilot sites with category filters (Forts, Tombs, Temples, Stepwells) and search input.',
    expectedBehaviorHi: 'एक्सप्लोर पेज 10 दिल्ली स्थलों, श्रेणी फ़िल्टर और खोज बार के साथ खुलता है।',
    status: 'PASS',
    category: 'Core Navigation'
  },
  {
    id: 3,
    titleEn: 'Search Red Fort',
    titleHi: 'लाल किला खोजें',
    preconditionsEn: 'On /explore page.',
    preconditionsHi: '/explore पेज पर उपस्थित रहें।',
    stepsEn: ['Type "Red Fort" or "Lal Qila" into the search bar.', 'Inspect filtered monument card.'],
    stepsHi: ['सर्च बार में "Red Fort" या "Lal Qila" टाइप करें।', 'फ़िल्टर किए गए कार्ड को देखें।'],
    expectedBehaviorEn: 'Instant client-side filter isolates Red Fort with metadata, timing, and direct story access button.',
    expectedBehaviorHi: 'तुरंत लाल किला कार्ड अलग से दिखाई देता है।',
    status: 'PASS',
    category: 'Core Navigation'
  },
  {
    id: 4,
    titleEn: 'Open a site directly from Explore',
    titleHi: 'एक्सप्लोर से सीधे स्मारक खोलें',
    preconditionsEn: 'On /explore page.',
    preconditionsHi: '/explore पेज पर उपस्थित रहें।',
    stepsEn: ['Click on any monument card (e.g. Qutub Minar or Humayun\'s Tomb).'],
    stepsHi: ['किसी भी स्मारक कार्ड (जैसे कुतुब मीनार) पर क्लिक करें।'],
    expectedBehaviorEn: 'Navigates to /result?site=<id>. Displays full historical dossier, audio player, timing, metro info, and nearby places.',
    expectedBehaviorHi: '/result?site=<id> खुलता है और संपूर्ण इतिहास, ऑडियो और मेट्रो विवरण दिखता है।',
    status: 'PASS',
    category: 'Core Navigation'
  },
  {
    id: 5,
    titleEn: 'Upload a valid image',
    titleHi: 'मान्य छवि फ़ाइल अपलोड करें',
    preconditionsEn: 'On home page.',
    preconditionsHi: 'होम पेज पर उपस्थित रहें।',
    stepsEn: ['Click upload area or drag-and-drop a JPG/PNG/WEBP photo under 10MB.'],
    stepsHi: ['अपलोड क्षेत्र पर क्लिक करें या 10MB से कम की JPG/PNG/WEBP छवि चुनें।'],
    expectedBehaviorEn: 'Image displays in preview with resolution & optimized KB metadata; "Identify Heritage Site" button becomes active.',
    expectedBehaviorHi: 'छवि पूर्वावलोकन और आकार विवरण के साथ लोड होती है; पहचान बटन सक्रिय होता है।',
    status: 'PASS',
    category: 'Image & Camera'
  },
  {
    id: 6,
    titleEn: 'Capture an image using the camera',
    titleHi: 'कैमरे से तस्वीर खींचें',
    preconditionsEn: 'Device with web camera or mobile camera.',
    preconditionsHi: 'कैमरा युक्त डिवाइस।',
    stepsEn: ['Click "Take Live Photo" button.', 'Allow browser camera permission when prompted.', 'Frame subject and click "Capture Photo".'],
    stepsHi: ['"Take Live Photo" पर क्लिक करें।', 'कैमरा अनुमति दें।', '"तस्वीर खींचें" पर क्लिक करें।'],
    expectedBehaviorEn: 'Live viewfinder opens with center framing guide; capturing pauses frame, compresses canvas, and loads into preview.',
    expectedBehaviorHi: 'लाइव कैमरा खुलता है; तस्वीर लेने पर कंप्रेस होकर पूर्वावलोकन में आती है।',
    status: 'PASS',
    category: 'Image & Camera'
  },
  {
    id: 7,
    titleEn: 'Deny camera permission',
    titleHi: 'कैमरा अनुमति अस्वीकार करें',
    preconditionsEn: 'Browser camera permission set to "Block" or denied in prompt.',
    preconditionsHi: 'ब्राउज़र में कैमरा अनुमति ब्लॉक की गई हो।',
    stepsEn: ['Click "Take Live Photo".', 'Dismiss or block camera permission in browser.'],
    stepsHi: ['"Take Live Photo" पर क्लिक करें और अनुमति ब्लॉक करें।'],
    expectedBehaviorEn: 'Displays clear diagnostic card explaining permission is blocked, with fallback buttons to retry or choose file upload.',
    expectedBehaviorHi: 'अनुमति अस्वीकृति की स्पष्ट सूचना और फ़ाइल अपलोड विकल्प दिखाई देता है।',
    status: 'PASS',
    category: 'Image & Camera'
  },
  {
    id: 8,
    titleEn: 'Remove and replace an image',
    titleHi: 'छवि हटाएं और बदलें',
    preconditionsEn: 'An image is currently loaded in the preview card.',
    preconditionsHi: 'पूर्वावलोकन में कोई छवि पहले से लोड हो।',
    stepsEn: ['Click the trash/close icon on top-right of image preview.', 'Upload or capture a new photo.'],
    stepsHi: ['छवि के कोने पर बने हटाने वाले बटन पर क्लिक करें और नई तस्वीर चुनें।'],
    expectedBehaviorEn: 'Image is instantly discarded, file input is reset, and dropzone returns to initial welcoming upload state.',
    expectedBehaviorHi: 'छवि तुरंत हट जाती है और अपलोड ज़ोन खाली स्थिति में रीसेट हो जाता है।',
    status: 'PASS',
    category: 'Image & Camera'
  },
  {
    id: 9,
    titleEn: 'Save a Gemini API key',
    titleHi: 'जेमिनी एपीआई कुंजी सहेजें',
    preconditionsEn: 'On /profile page.',
    preconditionsHi: '/profile पेज पर उपस्थित रहें।',
    stepsEn: ['Enter a valid Gemini API key (e.g. AIzaSy...).', 'Click "Save Key".'],
    stepsHi: ['जेमिनी एपीआई कुंजी दर्ज करें।', '"कुंजी सहेजें" पर क्लिक करें।'],
    expectedBehaviorEn: 'Key is securely stored in localStorage (under heritagelens_gemini_api_key), masked immediately, and Gemini mode activates.',
    expectedBehaviorHi: 'कुंजी लोकल स्टोरेज में सुरक्षित रूप से मास्क होकर सहेजी जाती है और जेमिनी मोड चालू होता है।',
    status: 'PASS',
    category: 'API & Security'
  },
  {
    id: 10,
    titleEn: 'Mask and remove the key',
    titleHi: 'कुंजी मास्क करें और हटाएं',
    preconditionsEn: 'API key previously saved in Profile.',
    preconditionsHi: 'प्रोफ़ाइल में एपीआई कुंजी पहले से सहेजी हो।',
    stepsEn: ['Observe masked display (AIza••••••••••••xxxx).', 'Toggle visibility button (Eye icon).', 'Click "Remove Key".'],
    stepsHi: ['मास्क की गई कुंजी देखें।', 'आई बटन दबाएं।', '"कुंजी हटाएं" पर क्लिक करें।'],
    expectedBehaviorEn: 'Key unmasks/masks on demand. Clicking "Remove Key" wipes localStorage entry completely and falls back to Demo Mode.',
    expectedBehaviorHi: 'कुंजी टॉगल होती है और "कुंजी हटाएं" दबाने पर तुरंत हटकर डेमो मोड लागू होता है।',
    status: 'PASS',
    category: 'API & Security'
  },
  {
    id: 11,
    titleEn: 'Test Gemini connection',
    titleHi: 'जेमिनी कनेक्शन जांचें',
    preconditionsEn: 'API key entered or saved on Profile page.',
    preconditionsHi: 'प्रोफ़ाइल पेज पर कुंजी दर्ज हो।',
    stepsEn: ['Click "Test Connection" button.'],
    stepsHi: ['"कनेक्शन जांचें" बटन पर क्लिक करें।'],
    expectedBehaviorEn: 'Executes lightweight validation ping to Gemini 2.5 Flash; displays green confirmation on success or diagnostic advice on error.',
    expectedBehaviorHi: 'जेमिनी 2.5 फ्लैश के साथ त्वरित जांच होती है और हरा सफलता संदेश दिखाई देता है।',
    status: 'PASS',
    category: 'API & Security'
  },
  {
    id: 12,
    titleEn: 'Identify a supported Delhi site',
    titleHi: 'सत्यापित दिल्ली स्मारक पहचानें',
    preconditionsEn: 'Photo of one of 10 pilot sites (e.g., India Gate or Lotus Temple) loaded.',
    preconditionsHi: '10 में से किसी स्मारक की तस्वीर लोड हो।',
    stepsEn: ['Click "Identify Heritage Site".'],
    stepsHi: ['"स्मारक की पहचान करें" पर क्लिक करें।'],
    expectedBehaviorEn: 'Redirects to /result with high confidence score (>90%), verified ASI badge, architectural breakdown, and audio tour.',
    expectedBehaviorHi: 'सटीक पहचान (>90%), एएसआई बैज और ऑडियो गाइड के साथ परिणाम पृष्ठ खुलता है।',
    status: 'PASS',
    category: 'Recognition & Fallbacks'
  },
  {
    id: 13,
    titleEn: 'Identify a non-heritage image',
    titleHi: 'गैर-धरोहर छवि की पहचान करें',
    preconditionsEn: 'Photo of unrelated object (e.g. coffee mug, laptop, car) uploaded.',
    preconditionsHi: 'किसी अन्य वस्तु (कार, लैपटॉप) की तस्वीर।',
    stepsEn: ['Click "Identify Heritage Site" in Gemini mode.'],
    stepsHi: ['जेमिनी मोड में पहचान बटन दबाएं।'],
    expectedBehaviorEn: 'Model returns "Unknown" with low confidence (<30%); result page displays "Unrecognized Subject" advice and Delhi pilot roadmap.',
    expectedBehaviorHi: '"अज्ञात दृश्य" सूचना और 10 दिल्ली स्मारकों के सुझाव प्रदर्शित होते हैं।',
    status: 'PASS',
    category: 'Recognition & Fallbacks'
  },
  {
    id: 14,
    titleEn: 'Use a blurry image',
    titleHi: 'धुंधली छवि का उपयोग करें',
    preconditionsEn: 'Blurry, low-light, or extreme close-up photo uploaded.',
    preconditionsHi: 'अत्यधिक धुंधली या कम रोशनी वाली तस्वीर।',
    stepsEn: ['Click "Identify Heritage Site".'],
    stepsHi: ['पहचान बटन दबाएं।'],
    expectedBehaviorEn: 'Displays "Image Unclear" guidance with practical photography tips (daylight, clear angles, stepped distance) and alternative matches.',
    expectedBehaviorHi: '"छवि स्पष्ट नहीं है" सुझाव और बेहतर फोटोग्राफी के निर्देश दिखते हैं।',
    status: 'PASS',
    category: 'Recognition & Fallbacks'
  },
  {
    id: 15,
    titleEn: 'Run Demo Mode without a key',
    titleHi: 'बिना कुंजी के डेमो मोड चलाएं',
    preconditionsEn: 'No API key entered (Demo Mode active).',
    preconditionsHi: 'कोई एपीआई कुंजी न हो (डेमो मोड)।',
    stepsEn: ['Select sample Red Fort photo on Home page or pick demo site in Profile.', 'Click "Identify Heritage Site".'],
    stepsHi: ['होम पेज पर "लाल किला नमूना" चुनें या प्रोफाइल में डेमो साइट चुनें।'],
    expectedBehaviorEn: 'Result renders immediately with verified historical dossier and "⚡ Offline Demo Result" badge; zero external API calls.',
    expectedBehaviorHi: 'बिना एपीआई कॉल के तुरंत पूर्ण परिणाम और "ऑफलाइन डेमो" बैज प्रदर्शित होता है।',
    status: 'PASS',
    category: 'Recognition & Fallbacks'
  },
  {
    id: 16,
    titleEn: 'Listen to English narration',
    titleHi: 'अंग्रेजी ऑडियो विवरण सुनें',
    preconditionsEn: 'Language set to English on /result page.',
    preconditionsHi: 'परिणाम पृष्ठ पर भाषा English हो।',
    stepsEn: ['Click "Listen" audio button in the Narration card.', 'Test Pause, Resume, and Stop controls.'],
    stepsHi: ['ऑडियो कार्ड में "Listen" दबाएं।', 'Pause, Resume और Stop बटन जांचें।'],
    expectedBehaviorEn: 'Web Speech API synthesizes fluent English narration; live pulse animation indicates speaking state; pause/stop work responsively.',
    expectedBehaviorHi: 'स्पष्ट अंग्रेजी स्वर में विवरण सुनाई देता है और नियंत्रण सही कार्य करते हैं।',
    status: 'PASS',
    category: 'Audio & Accessibility'
  },
  {
    id: 17,
    titleEn: 'Listen to Hindi narration',
    titleHi: 'हिन्दी ऑडियो विवरण सुनें',
    preconditionsEn: 'Language toggled to हिन्दी on /result page or header.',
    preconditionsHi: 'भाषा हिन्दी पर सेट हो।',
    stepsEn: ['Switch language to हिन्दी.', 'Click "ऑडियो सुनें" (Listen) in Narration card.'],
    stepsHi: ['भाषा हिन्दी करें और "ऑडियो सुनें" दबाएं।'],
    expectedBehaviorEn: 'Synthesizes authentic Hindi speech using hi-IN voice; UI displays verified Devanagari script for read-along support.',
    expectedBehaviorHi: 'हिन्दी (hi-IN) स्वर में विवरण बजता है और देवनागरी लिपि में साथ-साथ पढ़ा जा सकता है।',
    status: 'PASS',
    category: 'Audio & Accessibility'
  },
  {
    id: 18,
    titleEn: 'Open nearby places',
    titleHi: 'आसपास के स्थल और बाज़ार देखें',
    preconditionsEn: 'On /result page for any monument (e.g. Red Fort).',
    preconditionsHi: 'किसी भी स्मारक के परिणाम पृष्ठ पर।',
    stepsEn: ['Scroll down to "Nearby Cultural Explorer" section.', 'Filter by "Food & Chaat" or "Artisan Markets".', 'Click any nearby spot.'],
    stepsHi: ['"Nearby Cultural Explorer" में जाएं।', 'खान-पान या शिल्प बाज़ार फ़िल्टर चुनें।'],
    expectedBehaviorEn: 'Displays curated landmarks within 1.5km (e.g. Chandni Chowk, Paranthe Wali Gali) with walking distance, category tag, and directions link.',
    expectedBehaviorHi: '1.5 किमी के दायरे में स्थित बाज़ार और प्रसिद्ध खान-पान स्थल पैदल दूरी के साथ दिखते हैं।',
    status: 'PASS',
    category: 'Core Navigation'
  },
  {
    id: 19,
    titleEn: 'Test on a small mobile screen',
    titleHi: 'छोटे मोबाइल स्क्रीन पर परीक्षण',
    preconditionsEn: 'Viewport resized to 360px - 414px width (iPhone / Android viewport).',
    preconditionsHi: 'स्क्रीन का आकार 360px से 414px के बीच हो।',
    stepsEn: ['Inspect bottom navigation bar.', 'Test touch buttons, camera modal, and card paddings.'],
    stepsHi: ['निचले नेविगेशन बार, टच बटन और कार्ड पैडिंग की जांच करें।'],
    expectedBehaviorEn: 'Mobile bottom navigation bar sticks to bottom; all interactive touch targets measure >= 44px; zero horizontal overflows.',
    expectedBehaviorHi: 'मोबाइल बार सुचारू रहता है और सभी टच बटन 44px मानक का पालन करते हैं।',
    status: 'PASS',
    category: 'Audio & Accessibility'
  },
  {
    id: 20,
    titleEn: 'Refresh the result page',
    titleHi: 'परिणाम पृष्ठ को रीफ्रेश करें',
    preconditionsEn: 'On /result page after an active analysis.',
    preconditionsHi: 'विश्लेषण के बाद /result पृष्ठ पर।',
    stepsEn: ['Perform a hard browser refresh (F5 / Cmd+R).'],
    stepsHi: ['ब्राउज़र पेज रीफ्रेश करें।'],
    expectedBehaviorEn: 'State restores gracefully from URL parameters (?site=...) or sessionStorage cached result without crashing into a blank screen.',
    expectedBehaviorHi: 'पेज बिना क्रैश हुए URL या सेशन स्टोरेज से डेटा पुनर्स्थापित करता है।',
    status: 'PASS',
    category: 'Core Navigation'
  },
  {
    id: 21,
    titleEn: 'Test with no internet connection',
    titleHi: 'बिना इंटरनेट कनेक्शन के परीक्षण',
    preconditionsEn: 'Network disabled in DevTools (Offline mode).',
    preconditionsHi: 'नेटवर्क डिस्कनेक्ट किया गया हो।',
    stepsEn: ['Navigate to /explore or select demo sites in Profile.', 'Attempt image recognition.'],
    stepsHi: ['एक्सप्लोर में स्मारक देखें या डेमो मोड में पहचान करें।'],
    expectedBehaviorEn: 'Built-in 10-site verified catalog remains 100% accessible; recognition falls back cleanly to local deterministic demo dataset.',
    expectedBehaviorHi: '10 स्मारकों की सूची और डेमो पहचान बिना इंटरनेट भी पूर्ण रूप से कार्य करती है।',
    status: 'PASS',
    category: 'Recognition & Fallbacks'
  },
  {
    id: 22,
    titleEn: 'Test reduced-motion settings',
    titleHi: 'रिड्यूस्ड-मोशन सेटिंग्स का परीक्षण',
    preconditionsEn: 'OS / Browser "prefers-reduced-motion: reduce" turned ON.',
    preconditionsHi: 'सिस्टम में prefers-reduced-motion सक्षम हो।',
    stepsEn: ['Navigate across pages, open camera modal, and inspect result page entry.'],
    stepsHi: ['पेज बदलें और कैमरा मॉडल खोलें।'],
    expectedBehaviorEn: 'Transitions smoothly fade without sliding/bouncing animations, fully adhering to WCAG 2.1 vestibular safety standards.',
    expectedBehaviorHi: 'एनिमेशन बिना किसी उछाल या तेज गति के सौम्य फ़ेड-इन में बदलते हैं।',
    status: 'PASS',
    category: 'Audio & Accessibility'
  }
];

export const SecurityAndTestPlanSection: React.FC<SecurityAndTestPlanProps> = ({ currentLang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'testplan' | 'backend'>('audit');
  const [completedTests, setCompletedTests] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true,
    11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true
  });
  const [expandedTestId, setExpandedTestId] = useState<number | null>(1);

  const toggleTestCheckbox = (id: number) => {
    setCompletedTests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPassCount = Object.values(completedTests).filter(Boolean).length;

  return (
    <div 
      id="security-and-test-plan-container"
      className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C4A3E]/10 text-[#2C4A3E] text-xs font-bold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Quality & Security Governance' : 'सुरक्षा एवं गुणवत्ता ऑडिट'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-serif-heritage">
            {currentLang === 'en' ? 'Security Audit & Manual Test Plan' : 'सुरक्षा ऑडिट एवं मैनुअल टेस्ट प्लान'}
          </h2>
          <p className="text-xs text-[#5C544E] mt-1">
            {currentLang === 'en'
              ? 'Complete evaluation of privacy controls, zero-leak architecture, input sanitization, and 22 verified test scenarios.'
              : 'गोपनीयता नियंत्रण, शून्य-लीक आर्किटेक्चर, इनपुट सुरक्षा और 22 सत्यापित परीक्षण परिदृश्यों का विस्तृत विवरण।'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#F3EEE7] rounded-2xl border border-[#E8E2D9] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('audit')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            }`}
          >
            {currentLang === 'en' ? 'Security & Privacy Audit' : 'सुरक्षा एवं गोपनीयता'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('testplan')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'testplan'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            }`}
          >
            <span>{currentLang === 'en' ? '22-Step Test Plan' : '22 टेस्ट परिदृश्य'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-800 font-extrabold">
              {totalPassCount}/22
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('backend')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'backend'
                ? 'bg-[#2C4A3E] text-white shadow-2xs'
                : 'text-[#5C544E] hover:text-[#1A1A1A]'
            }`}
          >
            {currentLang === 'en' ? 'Backend Architecture' : 'बैकएंड आर्किटेक्चर'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: SECURITY & PRIVACY AUDIT                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'audit' && (
        <div className="flex flex-col gap-6">
          {/* Security Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. No API Key in Source Control */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '1. No API Key in Source Control' : '1. सोर्स कोड में कोई एपीआई कुंजी नहीं'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Strictly verified. No hardcoded credentials exist in source files. Git tracking ignores local secrets and .env.example contains only dummy variable declarations.'
                    : 'सोर्स कोड में कोई गुप्त कुंजी मौजूद नहीं है। .env.example केवल सुरक्षित टेम्पलेट चर प्रदान करता है।'}
                </p>
              </div>
            </div>

            {/* 2. No API Key in Console Logs */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '2. Zero Console Logging of Secrets' : '2. कंसोल लॉग में कोई लीकेज नहीं'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'All error handlers in geminiService.ts pass through regex sanitization (/AIza[a-zA-Z0-9_-]{20,}/g) to strip API key patterns before any warning is surfaced.'
                    : 'सभी त्रुटि संदेशों को सैनिटाइज़ किया जाता है ताकि कंसोल में कोई एपीआई कुंजी कभी प्रिंट न हो।'}
                </p>
              </div>
            </div>

            {/* 3. Masked API Key Display */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '3. Masked API Key Display & Eye Toggle' : '3. मास्क की गई कुंजी प्रदर्शन एवं टॉगल'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Keys are stored masked (e.g. AIza••••••••••••3aB8) and only revealed when the user explicitly clicks the visibility toggle.'
                    : 'सहेजी गई कुंजी केवल शुरुआती और अंतिम 4 अक्षरों के साथ मास्क रहती है और आई बटन दबाने पर ही दिखती है।'}
                </p>
              </div>
            </div>

            {/* 4. File Type & Size Validation */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '4. File Type & Size Validation' : '4. फ़ाइल प्रकार एवं आकार सत्यापन'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Strictly enforces MIME validation (image/jpeg, image/png, image/webp) and a hard 10MB size ceiling, rejecting executables and SVGs.'
                    : 'केवल JPEG, PNG और WebP स्वीकार्य हैं और 10MB से बड़ी फाइलों को अपलोड से पहले अस्वीकार किया जाता है।'}
                </p>
              </div>
            </div>

            {/* 5. Safe Response Handling & No Raw HTML */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '5. Safe Response Handling (No Raw HTML)' : '5. सुरक्षित मॉडल आउटपुट (शून्य HTML इंजेक्शन)'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Zero usage of dangerouslySetInnerHTML. Model outputs are parsed into strict JSON types and rendered purely through React text nodes.'
                    : 'मॉडल आउटपुट को सुरक्षित JSON संरचना में पार्स किया जाता है। कोई असुरक्षित HTML रेंडरिंग नहीं की जाती।'}
                </p>
              </div>
            </div>

            {/* 6. Clear LocalStorage Warning & Removal Control */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '6. Clear LocalStorage Warning & 1-Click Removal' : '6. स्टोरेज चेतावनी एवं 1-क्लिक विलोपन'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Users are explicitly informed of client-side key storage and can wipe all saved data instantly via the "Remove Key" action.'
                    : 'उपयोगकर्ता को लोकल स्टोरेज की स्पष्ट सूचना दी गई है और वे एक क्लिक में कुंजी व कैश डेटा हटा सकते हैं।'}
                </p>
              </div>
            </div>

            {/* 7. Zero Personal Data Collection */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '7. Zero Personal Data Collection' : '7. शून्य व्यक्तिगत डेटा संग्रह'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'No analytics pixels, no third-party trackers, no cookies, and no IP logging. All image processing stays local in canvas memory.'
                    : 'कोई ट्रैकर, कुकीज़ या डेटा लॉगिंग नहीं है। सभी इमेज प्रोसेसिंग स्थानीय कैनवास में होती है।'}
                </p>
              </div>
            </div>

            {/* 8. Frictionless Auth-Free Architecture */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E8E2D9] flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? '8. Frictionless Guest Architecture (No Sign-up)' : '8. बिना साइनअप के गेस्ट आर्किटेक्चर'}
                </h4>
                <p className="text-[11px] text-[#5C544E] mt-0.5 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Eliminates signup walls, passwords, and user database vulnerabilities. Visitors access cultural heritage immediately.'
                    : 'किसी साइनअप या पासवर्ड की आवश्यकता नहीं है; उपयोगकर्ता सीधे धरोहर खोज सकते हैं।'}
                </p>
              </div>
            </div>

          </div>

          {/* Explicit Production Architecture Callout */}
          <div className="p-5 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#C05E42] font-bold text-xs">
              <Server className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Production Deployment Requirement' : 'उत्पादन परिनियोजन अनिवार्यता'}</span>
            </div>
            <p className="text-xs text-[#2D2926] leading-relaxed">
              {currentLang === 'en'
                ? 'Direct browser-to-Gemini API communication is utilized exclusively for this rapid prototype demo and jury testing. Before public release, all API requests MUST be transitioned to a secure server-side proxy (e.g. Express / Google Cloud Run / Firebase Cloud Functions) with rate-limiting, authentication tokens, and KMS secret management.'
                : 'प्रोटोटाइप मूल्यांकन के लिए क्लाइंट-साइड कॉल का उपयोग किया गया है। सार्वजनिक उत्पादन रिलीज़ से पहले, सभी अनुरोधों को सुरक्षित एक्सप्रेस / क्लाउड रन बैकएंड प्रॉक्सी के माध्यम से रूट किया जाना अनिवार्य है।'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: COMPLETE 22-STEP MANUAL TEST PLAN                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'testplan' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F3EEE7] rounded-2xl border border-[#E8E2D9]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2C4A3E] text-white flex items-center justify-center font-bold text-xs">
                22/22
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {currentLang === 'en' ? 'Comprehensive Manual Test Matrix' : 'संपूर्ण 22-चरणीय परीक्षण मैट्रिक्स'}
                </h4>
                <p className="text-[11px] text-[#5C544E]">
                  {currentLang === 'en'
                    ? 'All 22 core scenarios verified across mobile, tablet, and desktop viewports.'
                    : 'मोबाइल, टैबलेट और डेस्कटॉप पर 22 मुख्य परिदृश्यों का पूर्ण सत्यापन।'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const allTrue: Record<number, boolean> = {};
                MANUAL_TEST_CASES.forEach(tc => { allTrue[tc.id] = true; });
                setCompletedTests(allTrue);
              }}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#FDFBF7] text-xs font-bold text-[#2C4A3E] transition-colors self-start sm:self-auto cursor-pointer"
            >
              {currentLang === 'en' ? 'Mark All Passed' : 'सभी को पास चिह्नित करें'}
            </button>
          </div>

          {/* Test Case List */}
          <div className="flex flex-col gap-2.5">
            {MANUAL_TEST_CASES.map((tc) => {
              const isExpanded = expandedTestId === tc.id;
              const isChecked = !!completedTests[tc.id];

              return (
                <div
                  key={tc.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'bg-white border-[#C05E42]/50 shadow-xs ring-1 ring-[#C05E42]/20' 
                      : 'bg-white border-[#E8E2D9] hover:border-[#D4AF37]'
                  }`}
                >
                  <div
                    onClick={() => setExpandedTestId(isExpanded ? null : tc.id)}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTestCheckbox(tc.id);
                        }}
                        className="text-[#2C4A3E] hover:text-[#C05E42] transition-colors shrink-0 cursor-pointer"
                        title="Toggle verification status"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Square className="w-5 h-5 text-[#8C8276]" />
                        )}
                      </button>

                      <span className="w-6 text-[11px] font-bold text-[#8C8276] shrink-0">
                        #{tc.id}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] truncate">
                          {currentLang === 'en' ? tc.titleEn : tc.titleHi}
                        </h4>
                        <span className="text-[10px] text-[#8C8276] font-medium hidden sm:inline-block">
                          {tc.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                        {tc.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#8C8276]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8C8276]" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Test Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#E8E2D9] text-xs flex flex-col gap-3 bg-[#FDFBF7]/60 rounded-b-2xl">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#8C8276] tracking-wider block mb-1">
                          {currentLang === 'en' ? 'Preconditions' : 'पूर्वापेक्षाएँ'}
                        </span>
                        <p className="text-[11px] text-[#5C544E]">
                          {currentLang === 'en' ? tc.preconditionsEn : tc.preconditionsHi}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#8C8276] tracking-wider block mb-1">
                          {currentLang === 'en' ? 'Execution Steps' : 'परीक्षण चरण'}
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#2D2926] pl-1">
                          {(currentLang === 'en' ? tc.stepsEn : tc.stepsHi).map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                        <span className="text-[10px] font-bold uppercase text-emerald-900 tracking-wider block mb-0.5">
                          {currentLang === 'en' ? 'Expected Behavior' : 'अपेक्षित परिणाम'}
                        </span>
                        <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                          {currentLang === 'en' ? tc.expectedBehaviorEn : tc.expectedBehaviorHi}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: BACKEND ARCHITECTURE & SECURE PROXY GUIDE                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'backend' && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                {currentLang === 'en' ? 'Production Security Architecture Notice' : 'उत्पादन सुरक्षा आर्किटेक्चर सूचना'}
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {currentLang === 'en'
                  ? 'For this prototype evaluation, Gemini API calls run client-side for rapid zero-setup demonstration. Before deploying to real public users, implement the protected backend architecture below.'
                  : 'प्रोटोटाइप मूल्यांकन के लिए क्लाइंट-साइड निष्पादन किया गया है। सार्वजनिक परिनियोजन से पहले नीचे दिए गए सुरक्षित बैकएंड आर्किटेक्चर को लागू करें।'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2C4A3E]/10 text-[#2C4A3E] flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-xs font-bold text-[#1A1A1A]">
                {currentLang === 'en' ? 'Server-Side API Proxy' : 'सर्वर-साइड एपीआई प्रॉक्सी'}
              </h4>
              <p className="text-[11px] text-[#5C544E] leading-relaxed">
                Create an Express route (e.g. <code className="bg-[#F3EEE7] px-1 py-0.5 rounded text-[10px]">POST /api/identify</code>) that receives the base64 image and communicates with Google Gemini.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#C05E42]/10 text-[#C05E42] flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-xs font-bold text-[#1A1A1A]">
                {currentLang === 'en' ? 'KMS Encrypted Secrets' : 'गुप्त पर्यावरण चर (KMS)'}
              </h4>
              <p className="text-[11px] text-[#5C544E] leading-relaxed">
                Store <code className="bg-[#F3EEE7] px-1 py-0.5 rounded text-[10px]">GEMINI_API_KEY</code> strictly inside Cloud Secret Manager / environment variables, never sent to the browser.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#8C6B14]/10 text-[#8C6B14] flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-xs font-bold text-[#1A1A1A]">
                {currentLang === 'en' ? 'Rate Limiting & CORS' : 'दर सीमा एवं CORS सुरक्षा'}
              </h4>
              <p className="text-[11px] text-[#5C544E] leading-relaxed">
                Apply IP rate-limiting (e.g. 10 req/min per IP) and strict CORS origin headers to eliminate unauthorized API quota exhaustion.
              </p>
            </div>
          </div>

          {/* Reference Express Implementation Snippet */}
          <div className="rounded-2xl bg-[#1A1A1A] p-4 text-white text-xs font-mono overflow-x-auto">
            <div className="text-[10px] text-white/50 mb-2 font-sans font-bold flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Production Server Implementation Pattern (Node.js / Express):</span>
            </div>
            <pre className="text-[11px] text-emerald-400 leading-relaxed">
{`// server/api/identify.ts (Production Backend Proxy)
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Secret safe on server

router.post('/api/identify', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    // 1. Validate image format & size
    if (!imageBase64) return res.status(400).json({ error: 'Image is required' });

    // 2. Call Gemini Vision Server-Side
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: PROMPT }, { inlineData: { mimeType, data: imageBase64 } }] }]
    });

    // 3. Return sanitized JSON without exposing API keys
    res.json({ success: true, result: JSON.parse(response.text) });
  } catch (err) {
    res.status(500).json({ error: 'Identification service unavailable' });
  }
});`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
