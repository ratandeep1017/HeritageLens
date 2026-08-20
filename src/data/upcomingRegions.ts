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
    id: 'rajasthan-jaipur',
    state: 'Rajasthan',
    hindiState: 'राजस्थान',
    city: 'Jaipur & Udaipur',
    hindiCity: 'जयपुर एवं उदयपुर',
    keyMonuments: ['Amer Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    hindiKeyMonuments: ['आमेर का किला', 'हवा महल', 'सिटी पैलेस', 'जंतर मंतर'],
    bannerUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    tag: 'Next Expansion',
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
    tag: 'In Research',
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
    tag: 'Planned',
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
    tag: 'Planned',
    monumentCountEstimate: '10+ Monuments'
  }
];
