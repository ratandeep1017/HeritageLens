export interface NearbyHeritageItem {
  id: string;
  name: string;
  hindiName?: string;
  distance: string;
  category: string;
  description: string;
  hindiDescription?: string;
  highlight?: string;
}

export interface NearbyFoodItem {
  id: string;
  name: string;
  hindiName?: string;
  distance: string;
  cuisineType: string;
  specialty: string;
  hindiSpecialty?: string;
  priceRange: '₹' | '₹₹' | '₹₹₹';
  timingNote?: string;
}

export interface NearbyArtisanMarketItem {
  id: string;
  name: string;
  hindiName?: string;
  distance: string;
  marketType: string;
  description: string;
  hindiDescription?: string;
  artisanHighlights: string[];
}

export interface CuratedSiteNearbyData {
  siteId: string;
  coordinates: {
    latitude: number;
    longitude: number;
    areaName: string;
  };
  heritagePlaces: NearbyHeritageItem[];
  foodSpots: NearbyFoodItem[];
  artisanMarkets: NearbyArtisanMarketItem[];
  verificationNote: {
    en: string;
    hi: string;
  };
}

export const DELHI_NEARBY_CURATED: Record<string, CuratedSiteNearbyData> = {
  // 1. Red Fort
  'red-fort': {
    siteId: 'red-fort',
    coordinates: {
      latitude: 28.6562,
      longitude: 77.2410,
      areaName: 'Netaji Subhash Marg, Chandni Chowk, Old Delhi'
    },
    heritagePlaces: [
      {
        id: 'rf-h1',
        name: 'Jama Masjid',
        hindiName: 'जामा मस्जिद',
        distance: '1.1 km',
        category: 'Historic Mosque',
        description: 'India’s celebrated 17th-century grand congregational mosque built by Shah Jahan on Bhojla Pahari.',
        hindiDescription: 'शाहजहाँ द्वारा निर्मित 17वीं सदी की भव्य ऐतिहासिक शाही मस्जिद।',
        highlight: 'Panoramic Southern Minaret View'
      },
      {
        id: 'rf-h2',
        name: 'Gauri Shankar Temple',
        hindiName: 'गौरी शंकर मंदिर',
        distance: '600 m',
        category: 'Hindu Temple',
        description: 'An 800-year-old Shiva temple in Chandni Chowk housing a revered 800-year-old brown lingam.',
        hindiDescription: 'चांदनी चौक में स्थित लगभग 800 वर्ष पुराना ऐतिहासिक शिव मंदिर।',
        highlight: 'Centuries-old lingam in silver casing'
      },
      {
        id: 'rf-h3',
        name: 'Salimgarh Fort',
        hindiName: 'सलीमगढ़ किला',
        distance: '450 m',
        category: '16th-Century Fortress',
        description: 'Built in 1546 by Salim Shah Suri on an island in the Yamuna, connected to Red Fort by an arch bridge.',
        hindiDescription: '1546 में सलीम शाह सूरी द्वारा निर्मित किला जो मेहराबदार पुल से लाल किले से जुड़ा है।',
        highlight: 'INA prisoner trials historical site'
      }
    ],
    foodSpots: [
      {
        id: 'rf-f1',
        name: 'Paranthe Wali Gali',
        hindiName: 'पराठे वाली गली',
        distance: '750 m',
        cuisineType: 'Traditional Street Food',
        specialty: 'Deep-fried stuffed crisp parathas with pumpkin mash (kaddu sabzi) and banana-tamarind chutney.',
        hindiSpecialty: 'कद्दू की सब्जी और इमली-केले की चटनी के साथ कुरकुरे तले हुए पराठे।',
        priceRange: '₹',
        timingNote: '9:00 AM – 10:30 PM'
      },
      {
        id: 'rf-f2',
        name: 'Giani’s Di Hatti',
        hindiName: 'ज्ञानी दी हट्टी',
        distance: '850 m',
        cuisineType: 'Legendary Desserts',
        specialty: 'Iconic Rabri Faluda served in tall chilled glasses and winter Gajar ka Halwa.',
        hindiSpecialty: 'ठंडी रबड़ी फालूदा और सर्दियों में देसी घी का गाजर का हलवा।',
        priceRange: '₹',
        timingNote: '10:00 AM – 11:00 PM'
      },
      {
        id: 'rf-f3',
        name: 'Natraj Dahi Bhalle Corner',
        hindiName: 'नटराज दही भल्ले',
        distance: '900 m',
        cuisineType: 'Old Delhi Chaat',
        specialty: 'Melt-in-mouth dahi bhallas and crispy aloo tikkis with spiced curd since 1940.',
        hindiSpecialty: '1940 से प्रसिद्ध मखमली दही भल्ले और कुरकुरी आलू टिक्की।',
        priceRange: '₹',
        timingNote: '11:00 AM – 9:00 PM'
      }
    ],
    artisanMarkets: [
      {
        id: 'rf-m1',
        name: 'Dariba Kalan (Silver & Zari Street)',
        hindiName: 'दरीबा कलां (चांदी व ज़री बाजार)',
        distance: '700 m',
        marketType: 'Historic Jewelry & Artisan Silver',
        description: '17th-century street famous for handmade silver filigree jewelry, vintage coins, attar (natural perfumes), and wedding silverware.',
        hindiDescription: 'चांदी के हस्तनिर्मित आभूषण, इत्र और पारंपरिक कलाकृतियों का ऐतिहासिक बाजार।',
        artisanHighlights: ['Handmade silver filigree', 'Pure gulab & khus attar', 'Bridal silverware']
      },
      {
        id: 'rf-m2',
        name: 'Kinari Bazaar (Lace & Trimming Market)',
        hindiName: 'किनारी बाजार',
        distance: '800 m',
        marketType: 'Craft & Textile Embellishments',
        description: 'A vibrant alley bursting with traditional gota patti, zardozi embroidery threads, festive turbans, and handmade craft ribbons.',
        hindiDescription: 'पारंपरिक गोटा-पत्ती, ज़रदोज़ी कढ़ाई और उत्सव हस्तशिल्प की संकरी जीवंत गली।',
        artisanHighlights: ['Gota patti borders', 'Zardozi threads', 'Hand-stitched turbans (sehras)']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Chandni Chowk markets remain predominantly closed on Sundays. Evening pedestrian-only rules apply on the main avenue.',
      hi: 'यात्रा से पूर्व पुष्टि करें: चांदनी चौक के अधिकांश बाजार रविवार को बंद रहते हैं। मुख्य मार्ग पर शाम को वाहन प्रतिबंधित रहते हैं।'
    }
  },

  // 2. Gurudwara Bangla Sahib
  'gurudwara-bangla-sahib': {
    siteId: 'gurudwara-bangla-sahib',
    coordinates: {
      latitude: 28.6264,
      longitude: 77.2090,
      areaName: 'Ashoka Road & Baba Kharak Singh Marg, Connaught Place'
    },
    heritagePlaces: [
      {
        id: 'gbs-h1',
        name: 'Sacred Heart Cathedral',
        hindiName: 'सैक्रेड हार्ट कैथेड्रल',
        distance: '300 m',
        category: 'Historic Cathedral',
        description: 'One of the oldest Catholic churches in New Delhi, designed by British architect Henry Medd with Italian marble altars.',
        hindiDescription: 'इटैलियन संगमरमर की वेदियों से सुसज्जित नई दिल्ली का प्रतिष्ठित कैथोलिक चर्च।',
        highlight: 'Grand colonnaded facade & peaceful gardens'
      },
      {
        id: 'gbs-h2',
        name: 'Jantar Mantar',
        hindiName: 'जंतर मंतर',
        distance: '1.1 km',
        category: 'Astronomical Observatory',
        description: '18th-century masonry astronomical observatory erected by Maharaja Jai Singh II of Jaipur.',
        hindiDescription: 'महाराजा जय सिंह द्वितीय द्वारा 1724 में निर्मित खगोलीय वेधशाला।',
        highlight: 'Samrat Yantra equinoctial sundial'
      },
      {
        id: 'gbs-h3',
        name: 'Pracheen Hanuman Mandir',
        hindiName: 'प्राचीन हनुमान मंदिर, कनाट प्लेस',
        distance: '850 m',
        category: 'Ancient Hindu Temple',
        description: 'One of the five historic Mahabharata-era Hanuman temples in Delhi, renowned for its continuous Sri Ram chant Guinness record.',
        hindiDescription: 'निरंतर राम-नाम संकीर्तन के लिए विख्यात ऐतिहासिक हनुमान मंदिर।',
        highlight: 'Traditional mehendi artisans in temple courtyard'
      }
    ],
    foodSpots: [
      {
        id: 'gbs-f1',
        name: 'Bangla Sahib Langar (Community Kitchen)',
        hindiName: 'गुरुद्वारा लंगर हॉल',
        distance: 'On site',
        cuisineType: 'Sacred Community Meal',
        specialty: 'Nutritious, soul-nourishing vegetarian meal prepared by volunteers with lentils (dal), rotis, and kadha prashad.',
        hindiSpecialty: 'श्रद्धापूर्वक परोसा जाने वाला नि:शुल्क पौष्टिक शाकाहारी लंगर और कड़ाह प्रसाद।',
        priceRange: '₹',
        timingNote: 'Served continuously throughout the day'
      },
      {
        id: 'gbs-f2',
        name: 'Saravana Bhavan (Janpath / CP)',
        hindiName: 'सरवण भवन',
        distance: '900 m',
        cuisineType: 'Authentic South Indian',
        specialty: 'Crispy ghee roast dosas, steamed idlis with fresh coconut chutney, and South Indian filter coffee.',
        hindiSpecialty: 'घी रोस्ट डोसा, सांभर-इडली और गरमागरम फिल्टर कॉफी।',
        priceRange: '₹₹',
        timingNote: '8:00 AM – 10:45 PM'
      },
      {
        id: 'gbs-f3',
        name: 'Kake Da Dhaba (Connaught Place)',
        hindiName: 'काके दा ढाबा',
        distance: '1.2 km',
        cuisineType: 'Legendary Punjabi Dhaba',
        specialty: 'Rich Dal Makhani, Paneer Tikka, Dahi Meat, and butter tandoori rotis since 1931.',
        hindiSpecialty: '1931 से प्रसिद्ध दाल मखनी, कढ़ाई पनीर और तंदूरी रोटियां।',
        priceRange: '₹₹',
        timingNote: '12:00 PM – 11:30 PM'
      }
    ],
    artisanMarkets: [
      {
        id: 'gbs-m1',
        name: 'State Emporia Complex (Baba Kharak Singh Marg)',
        hindiName: 'स्टेट एम्पोरिया कॉम्प्लेक्स',
        distance: '400 m',
        marketType: 'Official State Handicraft Showrooms',
        description: 'Government-certified artisan emporiums from every Indian state (Kashmir to Kerala) showcasing authentic silks, woodwork, and metal craft.',
        hindiDescription: 'भारत के विभिन्न राज्यों के प्रामाणिक हस्तशिल्प और हथकरघा का आधिकारिक केंद्र।',
        artisanHighlights: ['Kashmiri Pashmina shawls', 'Bidri metalware', 'Madhubani folk paintings', 'Sandalwood carvings']
      },
      {
        id: 'gbs-m2',
        name: 'Janpath Street Market',
        hindiName: 'जनपथ मार्केट',
        distance: '1.0 km',
        marketType: 'Handicrafts & Tibetan Curios',
        description: 'Lively open-air market known for brass deity figurines, bohemian jewelry, embroidered mirror-work tote bags, and Tibetan brass bells.',
        hindiDescription: 'पीतल की मूर्तियां, हस्तनिर्मित आभूषण और कढ़ाई वाले परिधानों का लोकप्रिय बाजार।',
        artisanHighlights: ['Tibetan singing bowls', 'Brass lamps', 'Kutch embroidered wall hangings']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Head coverings and modest attire are strictly mandatory at Bangla Sahib. State emporiums operate from 10:30 AM to 7:00 PM.',
      hi: 'यात्रा से पूर्व पुष्टि करें: गुरुद्वारे में सिर ढंकना अनिवार्य है। स्टेट एम्पोरिया की दुकानें सुबह 10:30 से शाम 7:00 बजे तक खुली रहती हैं।'
    }
  },

  // 3. Gurudwara Sis Ganj Sahib
  'gurudwara-sis-ganj-sahib': {
    siteId: 'gurudwara-sis-ganj-sahib',
    coordinates: {
      latitude: 28.6568,
      longitude: 77.2324,
      areaName: 'Chandni Chowk, opposite Town Hall, Old Delhi'
    },
    heritagePlaces: [
      {
        id: 'gsg-h1',
        name: 'Sunheri Masjid (Golden Mosque)',
        hindiName: 'सुनहरी मस्जिद',
        distance: '150 m',
        category: '18th-Century Mughal Mosque',
        description: 'Historic mosque with gilded copper domes built in 1721 by Roshan-ud-Daula; infamous site of Nader Shah’s Delhi siege in 1739.',
        hindiDescription: 'तांबे के सुनहरे गुंबदों वाली ऐतिहासिक मस्जिद जिसका निर्माण 1721 में हुआ था।',
        highlight: 'Gilded domes on raised stone platform'
      },
      {
        id: 'gsg-h2',
        name: 'Old Delhi Town Hall',
        hindiName: 'टाउन हॉल',
        distance: '300 m',
        category: 'Victorian Civic Heritage',
        description: 'Yellow-hued Victorian municipal headquarters constructed in 1863, formerly fronted by a statue of Queen Victoria.',
        hindiDescription: '1863 में निर्मित विक्टोरियन स्थापत्य शैली की पीली ऐतिहासिक नगरपालिका इमारत।',
        highlight: 'Colonial arched arcade & vintage clock tower'
      },
      {
        id: 'gsg-h3',
        name: 'Fatehpuri Masjid',
        hindiName: 'फतेहपुरी मस्जिद',
        distance: '650 m',
        category: 'Mughal Mosque',
        description: '1650 CE red sandstone mosque constructed by Fatehpuri Begum at the western terminus of Chandni Chowk.',
        hindiDescription: 'चांदनी चौक के पश्चिमी छोर पर 1650 में निर्मित लाल बलुआ पत्थर की भव्य मस्जिद।',
        highlight: 'Tranquil central pool framed by fluted arches'
      }
    ],
    foodSpots: [
      {
        id: 'gsg-f1',
        name: 'Kanwarji Bhagirath Mal',
        hindiName: 'कंवरजी भगीरथ मल',
        distance: '100 m',
        cuisineType: 'Royal Old Delhi Halwai',
        specialty: 'Desi ghee Gulab Jamun, Pista Lauj, and spiced Dalmoth namkeen since the mid-18th century.',
        hindiSpecialty: 'देसी घी के गुलाब जामुन, पिस्ता लौज और पारंपरिक दालमोठ नमकीन।',
        priceRange: '₹₹',
        timingNote: '9:00 AM – 9:30 PM'
      },
      {
        id: 'gsg-f2',
        name: 'Old Famous Jalebi Wala',
        hindiName: 'ओल्ड फेमस जलेबी वाला',
        distance: '200 m',
        cuisineType: 'Heritage Sweet Shop',
        specialty: 'Thick, piping-hot jalebis fried in pure desi ghee over charcoal fire and soaked in saffron syrup.',
        hindiSpecialty: 'कोयले की आंच पर देसी घी में तली केसरिया चाशनी वाली मोटी जलेबियां।',
        priceRange: '₹',
        timingNote: '8:00 AM – 10:00 PM'
      },
      {
        id: 'gsg-f3',
        name: 'Sis Ganj Guru ka Langar',
        hindiName: 'शीश गंज लंगर',
        distance: 'On site',
        cuisineType: 'Community Kitchen',
        specialty: 'Hot freshly baked tandoori rotis, seasonal subzi, dal, and sweet kheer served with devotion.',
        hindiSpecialty: 'गरमागरम तंदूरी रोटियां, दाल और स्वादिष्ट खीर।',
        priceRange: '₹',
        timingNote: 'Open 24/7'
      }
    ],
    artisanMarkets: [
      {
        id: 'gsg-m1',
        name: 'Khari Baoli (Asia’s Largest Spice Market)',
        hindiName: 'खारी बावली (एशिया का सबसे बड़ा मसाला बाजार)',
        distance: '700 m',
        marketType: 'Heritage Wholesale Spice & Herb Market',
        description: 'Operating since the 17th century; an olfactory wonderland brimming with Kashmir saffron, dry fruits, medicinal herbs, and whole whole spices.',
        hindiDescription: '17वीं सदी से संचालित मसालों, मेवों, जड़ी-बूटियों और कश्मीरी केसर का एशिया प्रसिद्ध बाजार।',
        artisanHighlights: ['Pure Kashmiri saffron', 'Sun-dried Himalayan morels (gucchi)', 'Custom spice blends']
      },
      {
        id: 'gsg-m2',
        name: 'Chawri Bazar (Brass & Paper Heritage Market)',
        hindiName: 'चावड़ी बाजार',
        distance: '650 m',
        marketType: 'Handmade Paper & Brassware Alley',
        description: 'Renowned for handcrafted wedding invitations, handmade paper crafts, and historic brass hardware workshops.',
        hindiDescription: 'हस्तनिर्मित पेपर क्राफ्ट, निमंत्रण पत्र और पीतल के कारीगरों का पुराना बाजार।',
        artisanHighlights: ['Handmade marbled papers', 'Cast brass bells & knockers', 'Calligraphy scrolls']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Chandni Chowk is a designated non-motorized zone from 9 AM to 9 PM. Walking or e-rickshaws from Metro Gate 5 are recommended.',
      hi: 'यात्रा से पूर्व पुष्टि करें: चांदनी चौक में सुबह 9 से रात 9 बजे तक वाहनों का प्रवेश वर्जित है। मेट्रो गेट 5 से पैदल या ई-रिक्शा सुगम है।'
    }
  },

  // 4. Jama Masjid, Delhi
  'jama-masjid-delhi': {
    siteId: 'jama-masjid-delhi',
    coordinates: {
      latitude: 28.6507,
      longitude: 77.2334,
      areaName: 'Matia Mahal & Meena Bazaar, Old Delhi'
    },
    heritagePlaces: [
      {
        id: 'jm-h1',
        name: 'Chitli Qabar & Haveli Heritage Alleys',
        hindiName: 'चितली क़ब्र व ऐतिहासिक हवेलियाँ',
        distance: '350 m',
        category: 'Living Heritage Quarter',
        description: 'Labyrinthine medieval lanes lined with Mughal-era arched doorways, lakhori brick walls, and century-old bakeries.',
        hindiDescription: 'लखौरी ईंटों और मुगलकालीन मेहराबों से सुसज्जित पुरानी दिल्ली की संकरी गलियां।',
        highlight: 'Intricate carved sandstone door lintels'
      },
      {
        id: 'jm-h2',
        name: 'Mirza Ghalib’s Haveli (Gali Qasim Jan)',
        hindiName: 'मिर्ज़ा ग़ालिब की हवेली (गली क़ासिम जान)',
        distance: '950 m',
        category: 'Literary Memorial Museum',
        description: 'The 19th-century residence of legendary Urdu and Persian poet Mirza Asadullah Baig Khan (Ghalib), now an ASI memorial museum.',
        hindiDescription: 'महान शायर मिर्ज़ा ग़ालिब का 19वीं सदी का ऐतिहासिक आवास व संग्रहालय।',
        highlight: 'Ghalib’s handwritten verses & portraits'
      },
      {
        id: 'jm-h3',
        name: 'Red Fort',
        hindiName: 'लाल किला',
        distance: '1.2 km',
        category: 'Mughal Imperial Fortress',
        description: 'The imperial red sandstone fortress palace commissioned by Shah Jahan in 1638.',
        hindiDescription: 'शाहजहाँ द्वारा निर्मित विशाल लाल बलुआ पत्थर का शाही किला।',
        highlight: 'Diwan-i-Khas & Nahr-i-Bihisht marble channels'
      }
    ],
    foodSpots: [
      {
        id: 'jm-f1',
        name: 'Karim’s (Gali Kababian)',
        hindiName: 'करीम्स',
        distance: '120 m',
        cuisineType: 'Historic Mughlai',
        specialty: 'Mutton Burra Kebabs, Mutton Korma, and Shahi Rogan Josh prepared using imperial royal recipes since 1913.',
        hindiSpecialty: '1913 से मुग़लई मटन बुर्रा कबाब, कोरमा और रोगन जोश।',
        priceRange: '₹₹',
        timingNote: '11:00 AM – 11:30 PM'
      },
      {
        id: 'jm-f2',
        name: 'Al Jawahar Restaurant',
        hindiName: 'अल जवाहर',
        distance: '100 m',
        cuisineType: 'Royal Mughlai Cuisine',
        specialty: 'Creamy Chicken Changezi, soft Khamiri Rotis, and Badam Pasanda right opposite Gate 1.',
        hindiSpecialty: 'चिकन चंगेज़ी, खमीरी रोटी और बादाम पसंदा।',
        priceRange: '₹₹',
        timingNote: '12:00 PM – 12:00 AM'
      },
      {
        id: 'jm-f3',
        name: 'Cool Point Shahi Tukda',
        hindiName: 'कूल पॉइंट शाही टुकड़ा',
        distance: '150 m',
        cuisineType: 'Traditional Old Delhi Sweets',
        specialty: 'Warm Shahi Tukda topped with thick rabri and homemade mango ice cream.',
        hindiSpecialty: 'रबड़ी से लबालब गर्म शाही टुकड़ा और आम की मलाईदार कुल्फी।',
        priceRange: '₹',
        timingNote: '12:00 PM – 1:00 AM'
      }
    ],
    artisanMarkets: [
      {
        id: 'jm-m1',
        name: 'Meena Bazaar (Steps of Jama Masjid)',
        hindiName: 'मीना बाजार',
        distance: '50 m',
        marketType: 'Traditional Bazaar & Attar Sellers',
        description: 'Vibrant market located directly beneath the eastern stairs of Jama Masjid, famous for traditional prayer rugs, ittar perfumes, and hand-embroidered kurtas.',
        hindiDescription: 'जामा मस्जिद की सीढ़ियों के नीचे स्थित इत्र, नमाज़ चटाई और चिकनकारी परिधानों का पारंपरिक बाजार।',
        artisanHighlights: ['Oud & Jannat-ul-Firdaus attar', 'Chikan embroidered fabrics', 'Copper prayer vessels']
      },
      {
        id: 'jm-m2',
        name: 'Ballimaran Leather & Shoe Market',
        hindiName: 'बल्लीमारान जूती व चमड़ा बाजार',
        distance: '600 m',
        marketType: 'Handcrafted Footwear Alley',
        description: 'Famous historic lane known for handcrafted Punjabi & Mughal juttis with intricate tilla embroidery and vintage spectacles.',
        hindiDescription: 'हाथ से सिली कशीदाकारी वाली जूती और पारंपरिक चश्मों का ऐतिहासिक बाजार।',
        artisanHighlights: ['Handcrafted zardozi juttis', 'Leather slippers', 'Custom eyewear']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Non-Muslim tourists are not permitted inside the prayer courtyard during congregational prayer times. Modest attire covering shoulders and knees is mandatory.',
      hi: 'यात्रा से पूर्व पुष्टि करें: नमाज़ के समय पर्यटकों का प्रवेश प्रतिबंधित रहता है। मर्यादित परिधान अनिवार्य हैं।'
    }
  },

  // 5. India Gate
  'india-gate': {
    siteId: 'india-gate',
    coordinates: {
      latitude: 28.6129,
      longitude: 77.2295,
      areaName: 'Kartavya Path / Central Vista, New Delhi'
    },
    heritagePlaces: [
      {
        id: 'ig-h1',
        name: 'National War Memorial',
        hindiName: 'राष्ट्रीय समर स्मारक',
        distance: '100 m',
        category: 'National Military Memorial',
        description: 'Dedicated to Indian armed forces personnel with four concentric thematic circles (Chakras) and the eternal flame.',
        hindiDescription: 'भारतीय सेना के अमर बलिदानियों को समर्पित चार चक्रों वाला भव्य स्मारक।',
        highlight: 'Param Yoddha Sthal with 21 PVC recipient busts'
      },
      {
        id: 'ig-h2',
        name: 'National Gallery of Modern Art (NGMA)',
        hindiName: 'राष्ट्रीय आधुनिक कला संग्रहालय (NGMA)',
        distance: '400 m',
        category: 'Premier Art Museum',
        description: 'Housed in the historic Jaipur House palace, exhibiting masterpieces by Raja Ravi Varma, Amrita Sher-Gil, and Rabindranath Tagore.',
        hindiDescription: 'जयपुर हाउस में स्थित अमृता शेरगिल व राजा रवि वर्मा की उत्कृष्ट कृतियों का संग्रहालय।',
        highlight: 'Sculpture garden & Amrita Sher-Gil gallery'
      },
      {
        id: 'ig-h3',
        name: 'Rashtrapati Bhavan & Amrit Udyan',
        hindiName: 'राष्ट्रपति भवन व अमृत उद्यान',
        distance: '2.4 km',
        category: 'Presidential Residence & Mughal Gardens',
        description: 'Monumental 340-room residence of the President of India designed by Sir Edwin Lutyens with sprawling manicured gardens.',
        hindiDescription: 'एडविन लुटियंस द्वारा निर्मित राष्ट्रपति भवन एवं विश्व प्रसिद्ध अमृत उद्यान।',
        highlight: 'Durbar Hall central dome & seasonal flower garden'
      }
    ],
    foodSpots: [
      {
        id: 'ig-f1',
        name: 'Pandara Road Food Market',
        hindiName: 'पंडारा रोड मार्केट',
        distance: '900 m',
        cuisineType: 'Iconic North Indian Cuisine',
        specialty: 'Gulati’s Butter Chicken, Butter Naan, and Veg Gulati’s Dal Makhani, a premier late-night dining strip.',
        hindiSpecialty: 'गुलाटी का बटर चिकन, दाल मखनी और काबुली नान।',
        priceRange: '₹₹₹',
        timingNote: '12:00 PM – 12:00 AM'
      },
      {
        id: 'ig-f2',
        name: 'Andhra Bhavan Canteen',
        hindiName: 'आंध्र भवन कैंटीन (अशोक रोड)',
        distance: '1.2 km',
        cuisineType: 'Authentic South Indian Thali',
        specialty: 'Unlimited South Indian vegetarian thali with spicy gunpowder podi, mutton fry, and Sunday Hyderabadi biryani.',
        hindiSpecialty: 'असीमित दक्षिण भारतीय शाकाहारी थाली, गनपाउडर पोड़ी और मटन फ्राई।',
        priceRange: '₹₹',
        timingNote: '12:00 PM – 3:00 PM & 7:30 PM – 10:00 PM'
      },
      {
        id: 'ig-f3',
        name: 'Kartavya Path Food Kiosks',
        hindiName: 'कर्तव्य पथ फ़ूड कियोस्क',
        distance: '200 m',
        cuisineType: 'Street Snacks & Ice Creams',
        specialty: 'Chilled Matka Kulfi, chana jor garam, sweet corn, and ice cream cones while taking evening promenade walks.',
        hindiSpecialty: 'मटका कुल्फी, चाट, भुट्टा और आइसक्रीम।',
        priceRange: '₹',
        timingNote: '4:00 PM – 11:00 PM'
      }
    ],
    artisanMarkets: [
      {
        id: 'ig-m1',
        name: 'National Crafts Museum Shop & Village Complex',
        hindiName: 'राष्ट्रीय हस्तशिल्प संग्रहालय हाट',
        distance: '1.4 km',
        marketType: 'Master Artisan Studios & Crafts',
        description: 'Authentic artisan shops and live craft workshops where master folk artists from across India weave sarees, cast Dhokra brass, and paint Madhubani scrolls.',
        hindiDescription: 'देश भर के राष्ट्रीय पुरस्कार विजेता कारीगरों द्वारा हस्तनिर्मित कलाकृतियों की प्रदर्शनी व बिक्री।',
        artisanHighlights: ['Dhokra lost-wax brass castings', 'Handwoven Chanderi & Ikat textiles', 'Terracotta pottery']
      },
      {
        id: 'ig-m2',
        name: 'Khan Market',
        hindiName: 'खान मार्केट',
        distance: '1.6 km',
        marketType: 'Boutique Crafts & Independent Bookshops',
        description: 'Upscale market home to legendary independent bookstores (Faqir Chand, Bahrisons), Indian artisanal luxury apparel, and Ayurvedic fragrances.',
        hindiDescription: 'प्रसिद्ध बुकस्टोर्स, भारतीय लक्ज़री हैंडलूम और हर्बल इत्र का प्रमुख बाज़ार।',
        artisanHighlights: ['Vintage Delhi books & prints', 'Handcrafted ceramic tableware', 'Organic khadi fashion']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Traffic and access along Kartavya Path are subject to VIP movements and national rehearsals. Public parking is available at designated Central Vista lots.',
      hi: 'यात्रा से पूर्व पुष्टि करें: कर्तव्य पथ पर सुरक्षा कारणों से कभी-कभी यातायात प्रतिबंधित हो सकता है। निर्धारित पार्किंग का ही उपयोग करें।'
    }
  },

  // 6. Humayun’s Tomb
  'humayun-tomb': {
    siteId: 'humayun-tomb',
    coordinates: {
      latitude: 28.5933,
      longitude: 77.2507,
      areaName: 'Nizamuddin East & Sundar Nursery, New Delhi'
    },
    heritagePlaces: [
      {
        id: 'ht-h1',
        name: 'Sundar Nursery (Heritage Ecological Park)',
        hindiName: 'सुंदर नर्सरी (विरासत पार्क)',
        distance: '300 m',
        category: 'UNESCO-Restored Heritage Garden',
        description: '90-acre Mughal-era botanical park and heritage zone housing 15 restored monuments, flowing water cascades, and 300+ tree species.',
        hindiDescription: 'मुगलकालीन स्मारकों और दुर्लभ वनस्पतियों से सजा 90 एकड़ का भव्य हेरिटेज पार्क।',
        highlight: 'Sundar Burj marble ceiling & lotus ponds'
      },
      {
        id: 'ht-h2',
        name: 'Hazrat Nizamuddin Dargah',
        hindiName: 'हज़रत निज़ामुद्दीन दरगाह',
        distance: '700 m',
        category: 'Sufi Shrine & Cultural Center',
        description: '14th-century Sufi shrine of mystic saint Hazrat Nizamuddin Auliya and poet Amir Khusrau, world-famous for Thursday evening Sufi Qawwalis.',
        hindiDescription: 'सूफी संत हज़रत निज़ामुद्दीन औलिया और अमीर खुसरो की विश्व प्रसिद्ध दरगाह।',
        highlight: 'Thursday sunset Sufi Qawwali devotional gatherings'
      },
      {
        id: 'ht-h3',
        name: 'Isa Khan Niazi Tomb Complex',
        hindiName: 'ईसा खां नियाज़ी का मकबरा',
        distance: '150 m',
        category: 'Suri Dynasty Octagonal Tomb',
        description: 'Built in 1547–1548 CE, this octagonal garden tomb pre-dates Humayun’s Tomb and features vibrant glazed ceramic tile canopies.',
        hindiDescription: '1547 में निर्मित अष्टकोणीय मकबरा जिसमें रंगीन सिरेमिक टाइलें लगी हैं।',
        highlight: 'Early Suri octagonal garden tomb architecture'
      }
    ],
    foodSpots: [
      {
        id: 'ht-f1',
        name: 'Fabcafe by the Lake (Sundar Nursery)',
        hindiName: 'फैबकैफे बाय द लेक',
        distance: '400 m',
        cuisineType: 'Artisanal Indian Organic Dining',
        specialty: 'Jackfruit flour rotis, wild berry coolers, artisanal chaats, and organic cold-pressed coffees overlooking the nursery lake.',
        hindiSpecialty: 'झील किनारे जैविक अनाज की रोटियां, मिलेट्स और स्वादिष्ट पेय।',
        priceRange: '₹₹₹',
        timingNote: '8:00 AM – 9:00 PM'
      },
      {
        id: 'ht-f2',
        name: 'Ghalib Kabab Corner (Nizamuddin Basti)',
        hindiName: 'ग़ालिब कबाब कॉर्नर',
        distance: '800 m',
        cuisineType: 'Traditional Street Kebabs',
        specialty: 'Smoky Shami kebabs, melt-in-mouth Kakori and seekh kebabs served with onion rings and mint chutney.',
        hindiSpecialty: 'मुलायम काकोरी कबाब, शामी कबाब और रुमाली रोटी।',
        priceRange: '₹',
        timingNote: '12:00 PM – 11:30 PM'
      },
      {
        id: 'ht-f3',
        name: 'Indian Accent (Lodhi Hotel)',
        hindiName: 'इंडियन एक्सेंट (द लोधी)',
        distance: '1.5 km',
        cuisineType: 'Contemporary Indian Fine Dining',
        specialty: 'Celebrated progressive modern Indian tasting menus by Chef Manish Mehrotra.',
        hindiSpecialty: 'विश्व प्रसिद्ध आधुनिक भारतीय फाइन डाइनिंग का अनुभव।',
        priceRange: '₹₹₹',
        timingNote: 'Reservation mandatory well in advance'
      }
    ],
    artisanMarkets: [
      {
        id: 'ht-m1',
        name: 'Sundar Nursery Artisan Weekend Market',
        hindiName: 'सुंदर नर्सरी सप्ताहांत ऑर्गेनिक हाट',
        distance: '350 m',
        marketType: 'Organic Farmers & Craft Collective',
        description: 'Hosted on Saturdays and Sundays; features local potters, women-led craft cooperatives, natural honey harvesters, and handmade soaps.',
        hindiDescription: 'शनिवार और रविवार को लगने वाला जैविक उत्पादों, हस्तशिल्प और मिट्टी के बर्तनों का बाजार।',
        artisanHighlights: ['Terracotta planter pottery', 'Wild forest honey', 'Hand-stitched quilt textiles']
      },
      {
        id: 'ht-m2',
        name: 'Insha-e-Noor Women’s Craft Collective (Nizamuddin)',
        hindiName: 'इंशा-ए-नूर महिला शिल्प केंद्र',
        distance: '650 m',
        marketType: 'Community Heritage Craft Center',
        description: 'A social initiative by Aga Khan Foundation empowering local Nizamuddin women who handcraft crochet items, Sanjhi paper cuttings, and embroidered apparel.',
        hindiDescription: 'निज़ामुद्दीन बस्ती की महिलाओं द्वारा बनाई गई सांझी पेपर कटिंग और सुंदर कढ़ाई।',
        artisanHighlights: ['Sanjhi paper cut bookmarks', 'Hand-crochet tableware', 'Zardozi pouches']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Sundar Nursery requires a separate nominal entry ticket. Dress modestly when visiting Hazrat Nizamuddin Dargah.',
      hi: 'यात्रा से पूर्व पुष्टि करें: सुंदर नर्सरी के लिए अलग प्रवेश टिकट लगता है। दरगाह में जाते समय सिर ढंकना और शालीन वस्त्र पहनना अनिवार्य है।'
    }
  },

  // 7. Qutub Minar
  'qutub-minar': {
    siteId: 'qutub-minar',
    coordinates: {
      latitude: 28.5245,
      longitude: 77.1855,
      areaName: 'Seth Sarai, Mehrauli, New Delhi'
    },
    heritagePlaces: [
      {
        id: 'qm-h1',
        name: 'Mehrauli Archaeological Park',
        hindiName: 'महरौली पुरातत्व पार्क',
        distance: '500 m',
        category: 'Sprawling Archaeological Reserve',
        description: '200-acre heritage landscape containing over 100 historic monuments spanning Delhi Sultanate, Suri, Mughal, and British periods.',
        hindiDescription: '200 एकड़ में फैला ऐतिहासिक पार्क जिसमें 100 से अधिक प्राचीन स्मारक हैं।',
        highlight: 'Jamali Kamali Mosque & Tomb & Balban’s 13th-century tomb'
      },
      {
        id: 'qm-h2',
        name: 'Gandhak ki Baoli & Rajon ki Baoli',
        hindiName: 'गंधक की बावली व राजों की बावली',
        distance: '850 m',
        category: 'Medieval Stepwells',
        description: '13th to 16th-century multi-tiered stepwells with carved quartzite colonnades and subterranean chambers in Mehrauli village.',
        hindiDescription: 'महरौली में 13वीं और 16वीं सदी की खूबसूरत बहुमंजिला ऐतिहासिक बावलियां।',
        highlight: 'Symmetrical arched corridors reflecting in cool water'
      },
      {
        id: 'qm-h3',
        name: 'Zafar Mahal & Dargah Qutbuddin Bakhtiyar Kaki',
        hindiName: 'ज़फ़र महल व हज़रत बख्तियार काकी दरगाह',
        distance: '1.1 km',
        category: 'Last Mughal Palace',
        description: 'The final summer palace built by the Mughals (Akbar II & Bahadur Shah Zafar) adjacent to the revered Chishti Sufi shrine.',
        hindiDescription: 'मुगलों का अंतिम ग्रीष्मकालीन महल और प्रसिद्ध चिश्ती सूफी दरगाह।',
        highlight: 'Hathi Gate red sandstone grand portal'
      }
    ],
    foodSpots: [
      {
        id: 'qm-f1',
        name: 'Olive Bar & Kitchen (One Style Mile)',
        hindiName: 'ओलिव बार एंड किचन',
        distance: '450 m',
        cuisineType: 'Mediterranean Heritage Dining',
        specialty: 'Wood-fired sourdough pizzas, fresh burrata, and handcrafted pastas in a colonial banyan courtyard facing Qutub Minar.',
        hindiSpecialty: 'कुतुब मीनार के पास बरगद के पेड़ तले वुड-फायर्ड पिज्जा और भूमध्यसागरीय व्यंजन।',
        priceRange: '₹₹₹',
        timingNote: '12:30 PM – 11:30 PM'
      },
      {
        id: 'qm-f2',
        name: 'Rooh New Delhi',
        hindiName: 'रूह न्यू दिल्ली',
        distance: '400 m',
        cuisineType: 'Progressive Indian & Rooftop Views',
        specialty: 'Fermented dough kulchas, duck shami, and signature botanical cocktails with direct rooftop views of the illuminated Qutub Minar.',
        hindiSpecialty: 'रोमांचक आधुनिक भारतीय व्यंजन और कुतुब मीनार का मनोरम दृश्य।',
        priceRange: '₹₹₹',
        timingNote: '12:30 PM – 11:30 PM'
      },
      {
        id: 'qm-f3',
        name: 'Mehrauli Village Street Sweets & Chaat',
        hindiName: 'महरौली हलवाई व चाट भंडार',
        distance: '600 m',
        cuisineType: 'Local Heritage Street Sweets',
        specialty: 'Hot Bedmi Puri with spicy aloo subzi, sooji halwa, and refreshing rabri lassi in the old village bazaar.',
        hindiSpecialty: 'बेड़मी पूरी आलू की सब्जी, सूजी का हलवा और गाढ़ी मलाईदार लस्सी।',
        priceRange: '₹',
        timingNote: '7:30 AM – 9:00 PM'
      }
    ],
    artisanMarkets: [
      {
        id: 'qm-m1',
        name: 'One Style Mile & Ambawatta Heritage Complex',
        hindiName: 'अंबावट्टा हेरिटेज बुटीक कॉम्प्लेक्स',
        distance: '350 m',
        marketType: 'Luxury Indian Designer Atelier & Crafts',
        description: 'Restored haveli-style shopping arcade housing premier Indian fashion couturiers, handwoven silk ateliers, and artisan jewelry studios.',
        hindiDescription: 'हवेली शैली में निर्मित भारतीय डिजाइनरों के परिधानों और आभूषणों का प्रमुख केंद्र।',
        artisanHighlights: ['Hand-embroidered silk couture', 'Bespoke polki jewelry', 'Handmade ceramic decor']
      },
      {
        id: 'qm-m2',
        name: 'Mehrauli Potters & Traditional Village Bazaar',
        hindiName: 'महरौली कुम्हार बस्ती व बाजार',
        distance: '750 m',
        marketType: 'Folk Pottery & Village Artisan Quarter',
        description: 'Generational clay potters creating terracotta kulhads, ornate diyas, garden urns, and decorative hanging planters.',
        hindiDescription: 'पीढ़ियों से मिट्टी के बर्तन, दीये और कलात्मक गमले बनाने वाले कुम्हारों की बस्ती।',
        artisanHighlights: ['Hand-thrown terracotta kulhads', 'Unglazed clay water matkas', 'Decorative windchimes']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: The Qutub Minar complex gets crowded during sunset; purchasing online ASI QR tickets in advance avoids long ticket lines. Mehrauli Archaeological Park is free entry.',
      hi: 'यात्रा से पूर्व पुष्टि करें: सूर्यास्त के समय भीड़ अधिक होती है; ऑनलाइन एएसआई टिकट पहले से बुक करें। महरौली पुरातत्व पार्क में प्रवेश नि:शुल्क है।'
    }
  },

  // 8. Lotus Temple
  'lotus-temple': {
    siteId: 'lotus-temple',
    coordinates: {
      latitude: 28.5535,
      longitude: 77.2588,
      areaName: 'Lotus Temple Road, Bahapur, Kalkaji, New Delhi'
    },
    heritagePlaces: [
      {
        id: 'lt-h1',
        name: 'Pracheen Kalkaji Mandir',
        hindiName: 'प्राचीन कालकाजी मंदिर',
        distance: '600 m',
        category: 'Ancient Hindu Shrine',
        description: 'One of the oldest surviving Shakti Peeth temples in Delhi dedicated to Goddess Kali, holding ancient religious significance.',
        hindiDescription: 'मां काली को समर्पित दिल्ली का प्रसिद्ध व प्राचीन शक्तिपीठ मंदिर।',
        highlight: 'Octagonal 18th-century sanctum and evening aarti'
      },
      {
        id: 'lt-h2',
        name: 'ISKCON Temple Delhi (Sri Sri Radha Parthasarathi Mandir)',
        hindiName: 'इस्कॉन मंदिर दिल्ली',
        distance: '1.4 km',
        category: 'Contemporary Vaishnavite Complex',
        description: 'Imposing stone temple complex on Hare Krishna Hills featuring animatronic Vedic exhibits, art galleries, and devotional halls.',
        hindiDescription: 'हरे कृष्णा हिल्स पर स्थित भव्य वैष्णव मंदिर और वैदिक कला प्रदर्शनी।',
        highlight: 'Astounding world’s largest printed Bhagavad Gita'
      },
      {
        id: 'lt-h3',
        name: 'Ashoka Rock Edict (East of Kailash)',
        hindiName: 'अशोक कालीन शिलालेख (कैलाश कॉलोनी)',
        distance: '1.8 km',
        category: '3rd-Century BCE Mauryan Edict',
        description: 'An authentic rock-cut edict inscribed in Brahmi script by Emperor Ashoka around 250 BCE, confirming Delhi’s ancient trade roots.',
        hindiDescription: 'सम्राट अशोक द्वारा 250 ईसा पूर्व ब्राह्मी लिपि में उत्कीर्ण ऐतिहासिक शिलालेख।',
        highlight: 'Protected Mauryan archaeological rock inscription'
      }
    ],
    foodSpots: [
      {
        id: 'lt-f1',
        name: 'Govinda’s Pure Vegetarian Restaurant (ISKCON)',
        hindiName: 'गोविंदास रेस्टोरेंट (इस्कॉन)',
        distance: '1.4 km',
        cuisineType: 'Sattvic Pure Vegetarian Buffet',
        specialty: 'Pure sattvic Indian and continental vegetarian banquet with rich paneer curries, freshly churned butter, and herbal sweets.',
        hindiSpecialty: 'शुद्ध सात्विक शाकाहारी व्यंजन, पनीर और देसी मिठाइयां।',
        priceRange: '₹₹',
        timingNote: '12:00 PM – 3:30 PM & 7:00 PM – 10:00 PM'
      },
      {
        id: 'lt-f2',
        name: 'Nehru Place Epicuria Food Mall',
        hindiName: 'एपिक्यूरिया फूड हब (नेहरू प्लेस)',
        distance: '1.1 km',
        cuisineType: 'Modern Food Hub & Multi-Cuisine',
        specialty: 'Lively culinary complex underneath Nehru Place metro with artisanal coffee shops, Asian noodle bars, and modern Indian bistros.',
        hindiSpecialty: 'मेट्रो स्टेशन के पास आधुनिक कैफे, बेकरी और भारतीय भोजन।',
        priceRange: '₹₹',
        timingNote: '11:00 AM – 11:00 PM'
      },
      {
        id: 'lt-f3',
        name: 'Kalkaji Street Chaat & Sweet Corners',
        hindiName: 'कालकाजी स्वीट्स व चाट',
        distance: '500 m',
        cuisineType: 'Traditional Street Delights',
        specialty: 'Crispy golgappe with five flavored waters, sweet raj kachori, and freshly pressed sugarcane juice.',
        hindiSpecialty: 'पांच स्वादों के पानी के गोलगप्पे और स्वादिष्ट राज कचौड़ी।',
        priceRange: '₹',
        timingNote: '11:00 AM – 10:00 PM'
      }
    ],
    artisanMarkets: [
      {
        id: 'lt-m1',
        name: 'Kalkaji Main Market & Pooja Craft Stalls',
        hindiName: 'कालकाजी बाजार व पूजन सामग्री स्टॉल',
        distance: '550 m',
        marketType: 'Traditional Brass & Floral Market',
        description: 'Vibrant local bazaar famous for brass pooja lamps, incenses, colorful marigold garlands, and embroidered chunris.',
        hindiDescription: 'पीतल के दीये, धूप, पूजा सामग्री और कढ़ाई वाली चुनरियों का जीवंत बाज़ार।',
        artisanHighlights: ['Engraved brass aarti thalis', 'Hand-rolled sandalwood incense', 'Traditional festive lights']
      },
      {
        id: 'lt-m2',
        name: 'Dilli Haat INA (Short Metro Ride via Magenta/Yellow Line)',
        hindiName: 'दिल्ली हाट (आईएनए)',
        distance: '6.5 km (Direct Metro)',
        marketType: 'National Open-Air Crafts Emporium',
        description: 'India’s celebrated open-air crafts village where rotational master artisans from all 28 states sell handlooms, pottery, woodwork, and tribal art directly.',
        hindiDescription: 'पूरे भारत के बुनकरों और शिल्पकारों का प्रसिद्ध खुला सांस्कृतिक हाट।',
        artisanHighlights: ['Pashmina shawls', 'Kalamkari hand-painted sarees', 'Rosewood & brass handicrafts']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Lotus Temple is closed to visitors every Monday. Absolute silence is maintained inside the prayer hall. Photography is prohibited inside.',
      hi: 'यात्रा से पूर्व पुष्टि करें: लोटस टेम्पल प्रत्येक सोमवार को बंद रहता है। मुख्य प्रार्थना सभागार में पूर्ण मौन अनिवार्य है।'
    }
  },

  // 9. Purana Qila
  'purana-qila': {
    siteId: 'purana-qila',
    coordinates: {
      latitude: 28.6096,
      longitude: 77.2437,
      areaName: 'Mathura Road, Pragati Maidan, New Delhi'
    },
    heritagePlaces: [
      {
        id: 'pq-h1',
        name: 'National Zoological Park (Delhi Zoo)',
        hindiName: 'राष्ट्रीय प्राणी उद्यान (दिल्ली चिड़ियाघर)',
        distance: '300 m',
        category: 'Sprawling 176-Acre Ecological Park',
        description: 'Bordering the massive stone ramparts of Purana Qila, housing white tigers, Asiatic lions, and migratory water birds on scenic islands.',
        hindiDescription: 'पुराने किले की दीवारों से सटा विशाल प्राणी उद्यान जहां सफेद बाघ व दुर्लभ पक्षी हैं।',
        highlight: 'Scenic lakeside walks with views of medieval battlements'
      },
      {
        id: 'pq-h2',
        name: 'National Crafts Museum & Hastkala Academy',
        hindiName: 'राष्ट्रीय हस्तशिल्प संग्रहालय व हस्‍तशिल्‍प अकादमी',
        distance: '600 m',
        category: 'Folk Art & Rural Architecture Museum',
        description: 'A tranquil rural village-style museum housing over 35,000 rare Indian folk textiles, tribal woodcarvings, and terracotta shrines.',
        hindiDescription: '35,000 से अधिक दुर्लभ भारतीय लोक कलाकृतियों व ग्रामीण घरों का संग्रहालय।',
        highlight: 'Live courtyard demonstrations by master folk artists'
      },
      {
        id: 'pq-h3',
        name: 'National Science Centre',
        hindiName: 'राष्ट्रीय विज्ञान केंद्र',
        distance: '750 m',
        category: 'Interactive Science & History Centre',
        description: 'Six floors of engaging interactive science galleries, human biology displays, and a digital planetarium.',
        hindiDescription: 'इंटरैक्टिव विज्ञान दीर्घाओं और तारामंडल वाला छह मंजिला आधुनिक केंद्र।',
        highlight: 'Ancient Indian metallurgy and science pavilion'
      }
    ],
    foodSpots: [
      {
        id: 'pq-f1',
        name: 'Café Lota (National Crafts Museum)',
        hindiName: 'कैफे लोटा',
        distance: '600 m',
        cuisineType: 'Contemporary Regional Indian Cafe',
        specialty: 'Palak Patta Chaat, Sabudana Popcorn, Apple Cinnamon Jalebi, and Pondicherry Filter Coffee in an airy semi-open courtyard.',
        hindiSpecialty: 'पालक पत्ता चाट, सेब-दालचीनी की जलेबी और दक्षिण भारतीय फिल्टर कॉफी।',
        priceRange: '₹₹',
        timingNote: '8:00 AM – 9:30 PM (Closed Mondays)'
      },
      {
        id: 'pq-f2',
        name: 'Purana Qila Lake Food & Boating Pavilion',
        hindiName: 'पुराना किला लेक फूड पवेलियन',
        distance: '150 m',
        cuisineType: 'Lake Promenade Snacks',
        specialty: 'Fresh nimbu pani, sweet roasted corn on the cob, bhel puri, and ice creams near the paddle boating jetty.',
        hindiSpecialty: 'नींबू पानी, भुट्टा, भेलपूरी और आइसक्रीम।',
        priceRange: '₹',
        timingNote: '10:00 AM – 6:00 PM'
      },
      {
        id: 'pq-f3',
        name: 'Sunder Nagar Market Cafes & Dining',
        hindiName: 'सुंदर नगर मार्केट',
        distance: '1.2 km',
        cuisineType: 'Artisanal European & Bakery',
        specialty: 'Artisan sourdough sandwiches, fresh croissants, and gourmet Continental grills in a quiet heritage residential market.',
        hindiSpecialty: 'स्वादिष्ट बेकरी उत्पाद, सैंडविच और कॉन्टिनेंटल व्यंजन।',
        priceRange: '₹₹₹',
        timingNote: '10:00 AM – 11:00 PM'
      }
    ],
    artisanMarkets: [
      {
        id: 'pq-m1',
        name: 'Lota Craft Shop & Master Craftsman Stalls',
        hindiName: 'लोटा क्राफ्ट शॉप (हस्तशिल्प संग्रहालय)',
        distance: '600 m',
        marketType: 'Authentic Traditional Artisan Guild Shop',
        description: 'Curated showroom selling direct artisan brass figurines, handmade ikat shawls, miniature paintings, and blue pottery from verified master craftsmen.',
        hindiDescription: 'कारीगरों से सीधे खरीदी गई पीतल की मूर्तियां, इकत शॉल और ब्लू पॉटरी।',
        artisanHighlights: ['Jaipur Blue Pottery tiles', 'Madhubani hand-painted canvases', 'Tribal bell metal statues']
      },
      {
        id: 'pq-m2',
        name: 'Sunder Nagar Antique & Art Market',
        hindiName: 'सुंदर नगर प्राचीन कला व एंटीक मार्केट',
        distance: '1.2 km',
        marketType: 'High-End Antiquities & Fine Silverware',
        description: 'Historic upscale market world-famous for vintage Mughal-style miniatures, antique silverware, carved wooden chests, and brass artifacts.',
        hindiDescription: 'प्राचीन कलाकृतियों, विंटेज चांदी के बर्तनों और नक्काशीदार लकड़ी के सामान का बाजार।',
        artisanHighlights: ['Antique brass door knockers', 'Mughal miniature paintings', 'Vintage silver filigree']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Evening Sound and Light show in Hindi and English is ticketed separately at Purana Qila. The Crafts Museum is closed on Mondays.',
      hi: 'यात्रा से पूर्व पुष्टि करें: पुराने किले में शाम के लाइट एंड साउंड शो का अलग टिकट है। हस्तशिल्प संग्रहालय सोमवार को बंद रहता है।'
    }
  },

  // 10. Agrasen ki Baoli
  'agrasen-ki-baoli': {
    siteId: 'agrasen-ki-baoli',
    coordinates: {
      latitude: 28.6258,
      longitude: 77.2250,
      areaName: 'Hailey Road, near Kasturba Gandhi Marg, Connaught Place'
    },
    heritagePlaces: [
      {
        id: 'akb-h1',
        name: 'Jantar Mantar',
        hindiName: 'जंतर मंतर',
        distance: '800 m',
        category: 'Astronomical Observatory',
        description: '18th-century equinoctial sundials and cosmic instruments erected by Maharaja Jai Singh II of Amber.',
        hindiDescription: '18वीं सदी के विशाल खगोलीय उपकरण और सूर्य घड़ी।',
        highlight: 'Samrat Yantra massive triangular gnomon'
      },
      {
        id: 'akb-h2',
        name: 'National Museum, New Delhi',
        hindiName: 'राष्ट्रीय संग्रहालय (जनपथ)',
        distance: '1.7 km',
        category: 'Premier National Antiquities Museum',
        description: 'Treasures of Indian civilization from the Indus Valley Dancing Girl and Harappan seals to Chola bronzes and Mughal manuscripts.',
        hindiDescription: 'सिंधु घाटी की नर्तकी मूर्ति और मौर्य व मुगलकालीन कलाकृतियों का प्रमुख संग्रहालय।',
        highlight: 'Harappan gallery & Sacred Buddha relics'
      },
      {
        id: 'akb-h3',
        name: 'Connaught Place Heritage Inner Circle',
        hindiName: 'कनाट प्लेस हेरिटेज इनर सर्कल',
        distance: '850 m',
        category: 'Colonial Georgian Classical Architecture',
        description: 'Iconic white colonnaded circular architectural plaza constructed in 1933, named after the Duke of Connaught.',
        hindiDescription: '1933 में निर्मित सफेद खंभों वाली भव्य वृत्ताकार औपनिवेशिक इमारतें।',
        highlight: 'Central Park flag plaza & vintage underground Palika Bazaar'
      }
    ],
    foodSpots: [
      {
        id: 'akb-f1',
        name: 'Bengali Sweet House (Bengali Market)',
        hindiName: 'बंगाली स्वीट हाउस (बंगाली मार्केट)',
        distance: '650 m',
        cuisineType: 'Heritage Street Chaat & Mithai',
        specialty: 'Crisp Aloo Tikki with spiced chana, Matar Kulcha, fresh Rasmalai, and Sandesh since 1937.',
        hindiSpecialty: '1937 से मशहूर आलू टिक्की, मटर कुल्चा, रसमलाई और संदेश।',
        priceRange: '₹₹',
        timingNote: '8:30 AM – 11:00 PM'
      },
      {
        id: 'akb-f2',
        name: 'United Coffee House (E-Block, CP)',
        hindiName: 'यूनाइटेड कॉफी हाउस (कनाट प्लेस)',
        distance: '900 m',
        cuisineType: 'Colonial Aristocratic Dining',
        specialty: 'Signature Cona Coffee, Cheese Balls, Chicken a la Kiev, and Lahori Mutton in a vintage Victorian chandelier salon since 1942.',
        hindiSpecialty: '1942 का विंटेज माहौल, कोना कॉफी, पनीर बॉल्स और रोस्ट चिकन।',
        priceRange: '₹₹₹',
        timingNote: '11:00 AM – 11:30 PM'
      },
      {
        id: 'akb-f3',
        name: 'Wenger’s Bakery & Deli (A-Block, CP)',
        hindiName: 'वेंगर्स बेकरी (कनाट प्लेस)',
        distance: '950 m',
        cuisineType: 'Historic Swiss-Style Bakery',
        specialty: 'Delhi’s oldest bakery since 1926, famous for hot Chicken Patties, Shami Kebabs, Pineapple pastries, and French Baguettes.',
        hindiSpecialty: '1926 से संचालित ऐतिहासिक बेकरी - क्रिस्पी चिकन पैटी और पेस्ट्री।',
        priceRange: '₹₹',
        timingNote: '10:30 AM – 8:00 PM'
      }
    ],
    artisanMarkets: [
      {
        id: 'akb-m1',
        name: 'Janpath Handicrafts & Tibetan Market',
        hindiName: 'जनपथ हस्तशिल्प व तिब्बती बाजार',
        distance: '750 m',
        marketType: 'Handicrafts & Curio Street Bazaar',
        description: 'Vibrant outdoor lane packed with brass figurines, wooden block prints, silver oxidized earrings, mirror-work bags, and ethnic textiles.',
        hindiDescription: 'पीतल के शोपीस, लकड़ी के ब्लॉक प्रिंट, एथनिक बैग और आभूषणों का बाज़ार।',
        artisanHighlights: ['Oxidized silver bohemian jewelry', 'Handmade leather journals', 'Kutch embroidered jackets']
      },
      {
        id: 'akb-m2',
        name: 'Shankar Market (Textiles & Tailors)',
        hindiName: 'शंकर मार्केट (हथकरघा व वस्त्र बाज़ार)',
        distance: '950 m',
        marketType: 'Handloom Cotton & Block Print Hub',
        description: 'Colonial-era two-story corridor renowned for pure Ikat, Kalamkari, Chanderi, and Block-printed handloom fabrics by the meter.',
        hindiDescription: 'हाथ से छपे कॉटन, इकत, कलमकारी और चंदेरी कपड़ों का विश्वसनीय बाज़ार।',
        artisanHighlights: ['Bagru & Sanganeri block-print fabrics', 'Pure handloom Ikat weaves', 'Custom master tailoring']
      }
    ],
    verificationNote: {
      en: 'Verify before visiting: Agrasen ki Baoli is tucked in an alleyway on Hailey Road; visiting during morning daylight is best for photography. Entry is free.',
      hi: 'यात्रा से पूर्व पुष्टि करें: अग्रसेन की बावली हेली रोड की गली में स्थित है। सुबह की रोशनी में दर्शन सुगम है। प्रवेश नि:शुल्क है।'
    }
  }
};

/**
 * Get curated nearby data for a monument site ID
 */
export function getCuratedNearbyForSite(siteId?: string): CuratedSiteNearbyData | undefined {
  if (!siteId) return undefined;
  const normalized = siteId.toLowerCase().trim();
  return DELHI_NEARBY_CURATED[normalized];
}
