export interface UpcomingRegion {
  id: string;
  state: string;
  hindiState: string;
  city: string;
  hindiCity: string;
  keyMonuments: string[];
  hindiKeyMonuments: string[];
  bannerUrl: string;
  tag: string;
  monumentCountEstimate: string;
}

export const UPCOMING_REGIONS: UpcomingRegion[] = [
  {
    id: 'delhi-ncr',
    state: 'Delhi',
    hindiState: 'दिल्ली',
    city: 'New Delhi & Old Delhi',
    hindiCity: 'नई दिल्ली एवं पुरानी दिल्ली',
    keyMonuments: ['Red Fort', "Humayun's Tomb", 'Qutub Minar', 'India Gate', 'Lotus Temple'],
    hindiKeyMonuments: ['लाल किला', 'हुमायूँ का मकबरा', 'क़ुतुब मीनार', 'इंडिया गेट', 'लोटस टेम्पल'],
    bannerUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    tag: 'National Capital',
    monumentCountEstimate: '10+ Monuments'
  },
  {
    id: 'punjab-amritsar',
    state: 'Punjab',
    hindiState: 'पंजाब',
    city: 'Amritsar & Patiala',
    hindiCity: 'अमृतसर एवं पटियाला',
    keyMonuments: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border', 'Qila Mubarak'],
    hindiKeyMonuments: ['स्वर्ण मंदिर (हरमंदिर साहिब)', 'जलियांवाला बाग', 'वाघा बॉर्डर', 'किला मुबारक'],
    bannerUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80',
    tag: 'Sikh Heritage',
    monumentCountEstimate: '8+ Monuments'
  },
  {
    id: 'rajasthan-jaipur',
    state: 'Rajasthan',
    hindiState: 'राजस्थान',
    city: 'Jaipur & Udaipur',
    hindiCity: 'जयपुर एवं उदयपुर',
    keyMonuments: ['Amer Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    hindiKeyMonuments: ['आमेर का किला', 'हवा महल', 'सिटी पैलेस', 'जंतर मंतर'],
    bannerUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    tag: 'Rajputana',
    monumentCountEstimate: '18+ Monuments'
  },
  {
    id: 'up-agra-varanasi',
    state: 'Uttar Pradesh',
    hindiState: 'उत्तर प्रदेश',
    city: 'Agra & Varanasi',
    hindiCity: 'आगरा एवं वाराणसी',
    keyMonuments: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Kashi Vishwanath Ghats'],
    hindiKeyMonuments: ['ताजमहल', 'आगरा किला', 'फ़तेहपुर सीकरी', 'काशी विश्वनाथ घाट'],
    bannerUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    tag: 'Mughal & Sacred',
    monumentCountEstimate: '15+ Monuments'
  },
  {
    id: 'karnataka-hampi',
    state: 'Karnataka',
    hindiState: 'कर्नाटक',
    city: 'Hampi & Mysore',
    hindiCity: 'हम्पी एवं मैसूर',
    keyMonuments: ['Virupaksha Temple', 'Stone Chariot', 'Mysore Palace', 'Badami Caves'],
    hindiKeyMonuments: ['विरूपाक्ष मंदिर', 'पत्थर का रथ', 'मैसूर पैलेस', 'बादामी गुफाएं'],
    bannerUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    tag: 'Vijayanagara',
    monumentCountEstimate: '12+ Monuments'
  },
  {
    id: 'maharashtra-mumbai-caves',
    state: 'Maharashtra',
    hindiState: 'महाराष्ट्र',
    city: 'Mumbai & Aurangabad',
    hindiCity: 'मुंबई एवं छत्रपति संभाजीनगर',
    keyMonuments: ['Gateway of India', 'Ajanta Caves', 'Ellora Caves', 'Elephanta Island'],
    hindiKeyMonuments: ['गेटवे ऑफ इंडिया', 'अजंता गुफाएं', 'एलोरा गुफाएं', 'एलिफेंटा'],
    bannerUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Maratha & Caves',
    monumentCountEstimate: '10+ Monuments'
  },
  {
    id: 'tamil-nadu-madurai',
    state: 'Tamil Nadu',
    hindiState: 'तमिलनाडु',
    city: 'Madurai & Thanjavur',
    hindiCity: 'मदुरै एवं तंजावुर',
    keyMonuments: ['Meenakshi Temple', 'Brihadeeswarar Temple', 'Shore Temple', 'Mahabalipuram'],
    hindiKeyMonuments: ['मीनाक्षी मंदिर', 'बृहदेश्वर मंदिर', 'शोर मंदिर', 'महाबलीपुरम'],
    bannerUrl: 'https://images.unsplash.com/photo-1692173248120-59547c3d4653?auto=format&fit=crop&w=1200&q=80',
    tag: 'Dravidian',
    monumentCountEstimate: '14+ Monuments'
  },
  {
    id: 'west-bengal-kolkata',
    state: 'West Bengal',
    hindiState: 'पश्चिम बंगाल',
    city: 'Kolkata & Murshidabad',
    hindiCity: 'कोलकाता एवं मुर्शिदाबाद',
    keyMonuments: ['Victoria Memorial', 'Howrah Bridge', 'Dakshineswar Temple', 'Hazarduari Palace'],
    hindiKeyMonuments: ['विक्टोरिया मेमोरियल', 'हावड़ा ब्रिज', 'दक्षिणेश्वर मंदिर', 'हज़ारदुआरी पैलेस'],
    bannerUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
    tag: 'Heritage & Arts',
    monumentCountEstimate: '10+ Monuments'
  }
];

export const STATE_BANNER_FALLBACKS: Record<string, string> = {
  'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  'punjab': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80',
  'rajasthan': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  'uttar pradesh': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  'karnataka': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  'maharashtra': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  'tamil nadu': 'https://images.unsplash.com/photo-1692173248120-59547c3d4653?auto=format&fit=crop&w=1200&q=80',
  'west bengal': 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
  'gujarat': 'https://images.unsplash.com/photo-1590812855152-7d2bc336a5e8?auto=format&fit=crop&w=1200&q=80',
  'madhya pradesh': 'https://images.unsplash.com/photo-1663762440402-e09c319de419?auto=format&fit=crop&w=1200&q=80',
  'odisha': 'https://images.unsplash.com/photo-1725046908999-195118679132?auto=format&fit=crop&w=1200&q=80',
};

export function getStateBanner(stateName: string): string {
  const lower = (stateName || '').toLowerCase().trim();
  if (STATE_BANNER_FALLBACKS[lower]) {
    return STATE_BANNER_FALLBACKS[lower];
  }
  return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80';
}
