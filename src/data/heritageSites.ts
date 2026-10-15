import { HeritageSite } from '../types';

export const DELHI_HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'red-fort',
    name: 'Red Fort (Lal Qila)',
    hindiName: 'लाल किला',
    shortDescription: 'Historic red sandstone Mughal fortress that served as the primary residence of Mughal emperors for nearly 200 years.',
    hindiShortDescription: 'लाल बलुआ पत्थर से निर्मित ऐतिहासिक मुग़ल किला जो लगभग 200 वर्षों तक मुग़ल सम्राटों का मुख्य निवास रहा।',
    fullHistory: 'Commissioned by Mughal Emperor Shah Jahan in 1638 when he decided to shift his capital from Agra to Shahjahanabad (Old Delhi). Designed by architect Ustad Ahmad Lahori, the fort synthesizes Mughal, Persian, Timurid, and Hindu traditions of architecture. Every year on Independence Day (15th August), the Prime Minister of India hoists the national flag and addresses the nation from its ramparts.',
    hindiFullHistory: '1638 में मुग़ल सम्राट शाहजहाँ द्वारा जब राजधानी आगरा से दिल्ली स्थानांतरित की गई तब इसका निर्माण शुरू हुआ। इसके मुख्य वास्तुकार उस्ताद अहमद लाहौरी थे। हर वर्ष स्वतंत्रता दिवस पर भारत के प्रधानमंत्री इसकी प्राचीर से राष्ट्रीय ध्वज फहराते हैं।',
    builtYear: '1638–1648 CE',
    builtBy: 'Mughal Emperor Shah Jahan',
    architecturalStyle: 'Indo-Islamic / Mughal Architecture',
    culturalSignificance: 'A supreme symbol of Indian sovereignty and independence, inscribed as a UNESCO World Heritage Site in 2007.',
    hindiCulturalSignificance: 'भारतीय संप्रभुता और स्वतंत्रता का एक प्रमुख प्रतीक, जिसे 2007 में यूनेस्को विश्व धरोहर स्थल घोषित किया गया।',
    interestingFacts: [
      'The fort was originally named "Qila-e-Mubarak" (The Blessed Fort).',
      'The Koh-i-Noor diamond was once part of Shah Jahan’s famous Peacock Throne housed inside Diwan-i-Khas.',
      'Constructed primarily of red sandstone from Rajasthan, which gives it its iconic hue.'
    ],
    hindiInterestingFacts: [
      'मूल रूप से इस किले का नाम "क़िला-ए-मुबारक" था।',
      'दीवान-ए-खास में स्थित मयूर सिंहासन पर कभी कोहिनूर हीरा जड़ा हुआ था।',
      'इसका निर्माण मुख्य रूप से राजस्थान के लाल बलुआ पत्थर से हुआ है।'
    ],
    folkloreOrLegends: [
      'Folklore / Oral Tradition: Local legend claims secret subterranean tunnels connected the Red Fort directly to Agra Fort and Purana Qila, though no archaeological evidence supports long-distance tunnels.'
    ],
    hindiFolkloreOrLegends: [
      'लोककथा / जनश्रुति: पुरानी लोककथाओं के अनुसार लाल किले से आगरा किले तक गुप्त सुरंगें थीं, हालाँकि इसका कोई पुरातात्विक प्रमाण नहीं मिला है।'
    ],
    travelTips: {
      timings: '9:30 AM – 4:30 PM (Closed on Mondays)',
      entryFee: '₹35 for Indians, ₹500 for Foreign Tourists (Sound & Light show ticket extra)',
      nearestMetro: 'Lal Qila Metro Station (Violet Line) or Chandni Chowk (Yellow Line)',
      bestTimeToVisit: 'October to March during morning or late afternoon hours.',
      rules: ['Photography allowed (tripods need permission)', 'Security check at Lahori Gate']
    },
    nearbyAttractions: [
      { name: 'Chandni Chowk Market', distance: '400 m', description: 'Historic 17th-century vibrant shopping bazaar and street food haven.' },
      { name: 'Jama Masjid', distance: '1.2 km', description: 'One of the largest mosques in India, built by Shah Jahan.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1705524220939-dac17cf94236?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Red Fort (Lal Qila) Lahori Gate and red sandstone ramparts in Delhi',
    sourceNote: 'Archaeological Survey of India (ASI) & UNESCO World Heritage Centre Records',
    tags: ['Mughal', 'UNESCO', 'Fortress', 'Shahjahanabad', 'Old Delhi']
  },
  {
    id: 'humayun-tomb',
    name: 'Humayun’s Tomb',
    hindiName: 'हुमायूँ का मक़बरा',
    shortDescription: 'The grand garden tomb built in 1570 that served as the architectural inspiration for the Taj Mahal.',
    hindiShortDescription: '1570 में निर्मित भव्य चारबाग उद्यान मक़बरा, जिसने ताजमहल के निर्माण के लिए वास्तुशिल्प प्रेरणा प्रदान की।',
    fullHistory: 'Constructed by Empress Bega Begum (Haji Begum) in memory of her husband, the second Mughal Emperor Humayun. Designed by Persian architect Mirak Mirza Ghiyas, this monument introduced the Persian Charbagh (four-quadrant garden) concept to the Indian subcontinent on a monumental scale and pioneered the double-dome technique in Indian architecture.',
    hindiFullHistory: 'यह मक़बरा महारानी बेगा बेगम द्वारा अपने पति सम्राट हुमायूँ की याद में बनवाया गया था। इसके वास्तुकार फ़ारसी मिराक मिर्ज़ा गियास थे। इसने भारत में चारबाग शैली और दोहरे गुंबद तकनीक को लोकप्रिय बनाया।',
    builtYear: '1565–1572 CE',
    builtBy: 'Empress Bega Begum (Architect: Mirak Mirza Ghiyas)',
    architecturalStyle: 'Mughal / Persian Charbagh Architecture',
    culturalSignificance: 'Declared a UNESCO World Heritage Site in 1993; it marks the zenith of early Mughal dynastic architecture.',
    hindiCulturalSignificance: '1993 में यूनेस्को विश्व धरोहर स्थल घोषित; यह आरंभिक मुग़ल वास्तुकला का उत्कृष्ट उदाहरण है।',
    interestingFacts: [
      'Contains over 150 graves of Mughal royalty, earning it the nickname "Dormitory of the House of Timur".',
      'First garden-tomb on the Indian subcontinent.',
      'The red sandstone and white marble inlay work pioneered techniques later perfected in the Taj Mahal.'
    ],
    hindiInterestingFacts: [
      'यहाँ मुग़ल राजपरिवार के 150 से अधिक मक़बरे हैं, जिससे इसे "तैमूरी घराने का शयनागार" भी कहा जाता है।',
      'भारतीय उपमहाद्वीप का पहला उद्यान-मक़बरा।',
      'लाल बलुआ पत्थर और सफेद संगमरमर की नक्काशी का अनूठा संगम।'
    ],
    folkloreOrLegends: [
      'Folklore / Oral Tradition: Bahadur Shah Zafar, the last Mughal emperor, took refuge here with three princes during the 1857 Rebellion before his capture by British Captain Hodson.'
    ],
    hindiFolkloreOrLegends: [
      'ऐतिहासिक घटना / जनश्रुति: 1857 की क्रांति के समय अंतिम मुग़ल सम्राट बहादुर शाह ज़फ़र ने यहीं शरण ली थी।'
    ],
    travelTips: {
      timings: 'Sunrise to Sunset (Daily)',
      entryFee: '₹35 for Indians, ₹550 for Foreign Nationals',
      nearestMetro: 'JLN Stadium Metro Station (Violet Line) or Sarai Kale Khan (Pink Line)',
      bestTimeToVisit: 'Early morning or golden hour (4:00 PM - 6:00 PM) for photography.',
      rules: ['Lawn preservation rules apply', 'Wheelchair accessibility available in central pathways']
    },
    nearbyAttractions: [
      { name: 'Sundar Nursery', distance: '300 m', description: 'Restored 16th-century heritage park with 15 heritage monuments and lake.' },
      { name: 'Hazrat Nizamuddin Dargah', distance: '800 m', description: 'Famous Sufi shrine dedicated to Saint Nizamuddin Auliya.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1624361899662-3ce9c0f44817?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Humayuns Tomb red sandstone facade and Persian garden in Delhi',
    sourceNote: 'Aga Khan Trust for Culture (AKTC) & Archaeological Survey of India (ASI)',
    tags: ['Mughal', 'UNESCO', 'Garden Tomb', 'Nizamuddin']
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar Complex',
    hindiName: 'क़ुतुब मीनार',
    shortDescription: 'The tallest brick minaret in the world standing at 72.5 meters, adorned with ornate Arabic inscriptions and balconies.',
    hindiShortDescription: '72.5 मीटर ऊँची दुनिया की सबसे ऊँची ईंटों से बनी मीनार, जिस पर अरबी शिलालेख और नक्काशीदार बालकनियाँ हैं।',
    fullHistory: 'Started by Qutb-ud-din Aibak in 1199 CE after defeating the Chauhans, and completed by his successor Shams-ud-din Iltutmish. Later repairs and additional fifth storey were undertaken by Firoz Shah Tughlaq in 1368 after lightning damage. The surrounding complex includes the Quwwat-ul-Islam Mosque, the Iron Pillar of Delhi, the Tomb of Iltutmish, and the unfinished Alai Minar.',
    hindiFullHistory: 'क़ुतुबुद्दीन ऐबक ने 1199 ईस्वी में इसका निर्माण शुरू करवाया और उसके उत्तराधिकारी इल्तुतमिश ने इसे पूरा किया। 1368 में आकाशीय बिजली से क्षति के बाद फ़िरोज़ शाह तुग़लक़ ने इसकी मरम्मत करवाई। परिसर में प्रसिद्ध लौह स्तंभ भी स्थित है।',
    builtYear: '1199–1220 CE (Repairs in 1368)',
    builtBy: 'Qutb-ud-din Aibak & Shams-ud-din Iltutmish',
    architecturalStyle: 'Indo-Islamic Afghan Style with Fluted Columns',
    culturalSignificance: 'UNESCO World Heritage Site since 1993; standing symbol of early Delhi Sultanate architectural prowess.',
    hindiCulturalSignificance: '1993 से यूनेस्को विश्व धरोहर स्थल; दिल्ली सल्तनत के प्रारंभिक काल का प्रमुख स्मारक।',
    interestingFacts: [
      'Contains 379 spiral staircase steps to the top.',
      'The 1,600-year-old rust-resistant Iron Pillar in the courtyard was erected by King Chandragupta II (Vikramaditya).',
      'The minaret has a slight 65 cm tilt, documented by structural engineers.'
    ],
    hindiInterestingFacts: [
      'शीर्ष तक जाने के लिए इसमें 379 घुमावदार सीढ़ियाँ हैं।',
      'परिसर में स्थित 1,600 वर्ष पुराना लौह स्तंभ आज भी जंग-मुक्त और प्राचीन धातु विज्ञान का चमत्कार है।',
      'मीनार में लगभग 65 सेमी का सूक्ष्म झुकाव है।'
    ],
    folkloreOrLegends: [
      'Folklore / Oral Tradition: It was believed that if you stood with your back against the Iron Pillar and wrapped your arms around it until fingers touched, your wish would come true.'
    ],
    hindiFolkloreOrLegends: [
      'लोककथा / जनश्रुति: माना जाता था कि जो व्यक्ति लौह स्तंभ के पीछे पीठ करके अपनी बाहों से इसे घेर ले, उसकी मनोकामना पूरी होती है।'
    ],
    travelTips: {
      timings: '7:00 AM – 5:00 PM (Daily)',
      entryFee: '₹35 for Indians, ₹550 for Foreign Nationals',
      nearestMetro: 'Qutub Minar Metro Station (Yellow Line)',
      bestTimeToVisit: 'Winter afternoons or early mornings before tour buses arrive.',
      rules: ['Climbing inside the minaret has been restricted since 1981 for safety.']
    },
    nearbyAttractions: [
      { name: 'Mehrauli Archaeological Park', distance: '600 m', description: 'Over 200 historical monuments spanning 1,000 years of Delhi history.' },
      { name: 'Jamali Kamali Mosque & Tomb', distance: '900 m', description: 'Historic 16th-century Sufi shrine and mosque in Mehrauli.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1632426237957-5ea14aae7100?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Qutub Minar fluted sandstone tower in Mehrauli Delhi',
    sourceNote: 'Archaeological Survey of India (ASI) & Ministry of Culture',
    tags: ['Delhi Sultanate', 'UNESCO', 'Minaret', 'Mehrauli', 'Iron Pillar']
  },
  {
    id: 'lotus-temple',
    name: 'Lotus Temple (Baháʼí House of Worship)',
    hindiName: 'लोटस टेम्पल (बहाई उपासना मंदिर)',
    shortDescription: 'World-renowned modern architectural masterpiece shaped like a blossoming 27-petal white marble lotus flower.',
    hindiShortDescription: 'खिलते हुए 27 पंखुड़ियों वाले सफेद संगमरमर के कमल के आकार में निर्मित विश्व प्रसिद्ध आधुनिक वास्तुशिल्प का चमत्कार।',
    fullHistory: 'Designed by Iranian-Canadian architect Fariborz Sahba and dedicated in December 1986. Built entirely with Greek white Penteli marble, concrete, and dolomite. As a Baháʼí House of Worship, it is open to all people regardless of religion, race, gender, or nationality for silent prayer and contemplation without rituals or idols.',
    hindiFullHistory: 'ईरानी-कनाडाई वास्तुकार फरीबोर्ज़ सहबा द्वारा डिज़ाइन किया गया और दिसंबर 1986 में जनता के लिए खोला गया। यह सभी धर्मों और आस्थाओं के लोगों के लिए मौन प्रार्थना और ध्यान हेतु खुला है।',
    builtYear: '1980–1986 CE',
    builtBy: 'Architect Fariborz Sahba (Baháʼí Faith)',
    architecturalStyle: 'Modern Expressionist / Biomimetic Architecture',
    culturalSignificance: 'An internationally celebrated symbol of universal brotherhood, peace, and interfaith unity with over 100 million visitors.',
    hindiCulturalSignificance: 'सर्वधर्म सद्भाव, शांति और सार्वभौमिक एकता का वैश्विक प्रतीक, जिसे करोड़ों लोग देख चुके हैं।',
    interestingFacts: [
      'Features 27 free-standing petals arranged in clusters of three to form nine doors opening into a central hall.',
      'Capacity to seat 2,500 people in total silence with no artificial amplification needed due to organic acoustic design.',
      'Surrounded by nine serene blue reflection ponds symbolizing the lotus leaves.'
    ],
    hindiInterestingFacts: [
      'इसमें 27 स्वतंत्र पंखुड़ियाँ हैं जो 9 दरवाजों का निर्माण करती हैं।',
      'केंद्रीय प्रार्थना कक्ष में बिना किसी लाउडस्पीकर के 2,500 लोग शांत ध्यान कर सकते हैं।',
      'मंदिर 9 सुंदर जलकुंडों से घिरा हुआ है जो कमल के पत्तों का आभास कराते हैं।'
    ],
    folkloreOrLegends: [
      'Cultural Symbolism: The lotus is deeply revered across traditional Indian spiritual paths (Hinduism, Buddhism, Jainism) as a symbol of purity arising unsullied from murky waters.'
    ],
    hindiFolkloreOrLegends: [
      'सांस्कृतिक प्रतीक: कमल भारतीय संस्कृति में पवित्रता और आध्यात्मिक चेतना का सर्वमान्य प्रतीक है।'
    ],
    travelTips: {
      timings: '9:00 AM – 5:30 PM (Winter), 9:00 AM – 7:00 PM (Summer), Closed on Mondays',
      entryFee: 'Free entry for everyone',
      nearestMetro: 'Kalkaji Mandir Metro Station (Violet & Magenta Lines)',
      bestTimeToVisit: 'Sunset when lights illuminate the white marble petals against the blue sky.',
      rules: ['Maintain strict silence in the inner sanctuary', 'Shoes must be deposited at the counter']
    },
    nearbyAttractions: [
      { name: 'Kalkaji Mandir', distance: '700 m', description: 'Ancient temple dedicated to Goddess Kali, visited by thousands of devotees.' },
      { name: 'ISKCON Temple Delhi', distance: '1.8 km', description: 'Sprawling temple complex with Vedic cultural museum and robotics display.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1688257899811-d96d969416bf?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Lotus Temple Bahai House of Worship white marble petals and reflection pool in Delhi',
    sourceNote: 'National Spiritual Assembly of the Baháʼís of India',
    tags: ['Modern Heritage', 'Interfaith', 'Architecture', 'Kalkaji']
  },
  {
    id: 'india-gate',
    name: 'India Gate',
    hindiName: 'इण्डिया गेट',
    shortDescription: 'Triumphal 42-meter war memorial arch honoring 84,000 Indian soldiers of the British Indian Army.',
    hindiShortDescription: '42 मीटर ऊँचा विजय स्मारक तोरण जो प्रथम विश्व युद्ध में शहीद 84,000 से अधिक भारतीय सैनिकों को समर्पित है।',
    fullHistory: 'Designed by Sir Edwin Lutyens and founded in 1921 by the Duke of Connaught. It pays homage to soldiers who laid down their lives during the First World War (1914–1918) and the Third Anglo-Afghan War (1919). In 1972, following the Indo-Pakistan War of 1971, the Amar Jawan Jyoti (Flame of the Immortal Soldier) was inaugurated beneath the arch. The flame was merged with the adjacent National War Memorial in 2022.',
    hindiFullHistory: 'सर एडविन लुटियंस द्वारा डिज़ाइन किया गया और 1921 में इसकी आधारशिला रखी गई। यह प्रथम विश्व युद्ध और तीसरे अफगान युद्ध में शहीद सैनिकों की स्मृति में बनाया गया। 1972 में इसके नीचे अमर जवान ज्योति स्थापित की गई थी।',
    builtYear: '1921–1931 CE',
    builtBy: 'Architect Sir Edwin Lutyens (Imperial War Graves Commission)',
    architecturalStyle: 'Beaux-Arts Classical Triumphal Arch (Sandstone)',
    culturalSignificance: 'India’s paramount national memorial along the ceremonial Kartavya Path leading to Rashtrapati Bhavan.',
    hindiCulturalSignificance: 'भारत का प्रमुख राष्ट्रीय युद्ध स्मारक जो कर्तव्य पथ पर राष्ट्रपति भवन के सामने स्थित है।',
    interestingFacts: [
      'Inscribed with names of over 13,300 individual soldiers on the stone surfaces.',
      'Stands at the heart of Delhi with surrounding manicured lawns and fountains.',
      'Inspired by the Arc de Triomphe in Paris.'
    ],
    hindiInterestingFacts: [
      'इसकी दीवारों पर 13,300 से अधिक सैनिकों के नाम उत्कीर्ण हैं।',
      'यह पेरिस के आर्क डी ट्रायम्फ से प्रेरित होकर बनाया गया था।',
      'शाम के समय यह आकर्षक प्रकाश व्यवस्था से जगमगा उठता है।'
    ],
    folkloreOrLegends: [
      'Historical Anecdote: The canopy behind India Gate originally housed a 73-foot marble statue of King George V, which was relocated to Coronation Park in 1968 and replaced in 2022 by a 28-foot granite statue of Netaji Subhas Chandra Bose.'
    ],
    hindiFolkloreOrLegends: [
      'ऐतिहासिक तथ्य: इंडिया गेट के पीछे स्थित छतरी में 2022 में नेताजी सुभाष चंद्र बोस की 28 फीट ऊँची ग्रेनाइट प्रतिमा स्थापित की गई।'
    ],
    travelTips: {
      timings: 'Open 24 hours (Best visited in late evenings)',
      entryFee: 'Free entry',
      nearestMetro: 'Central Secretariat (Yellow & Violet Lines) or Khan Market',
      bestTimeToVisit: 'Evenings (6:30 PM - 9:30 PM) when illuminated with civic pride and breeze.',
      rules: ['Pedestrian pathways strictly maintained along Kartavya Path']
    },
    nearbyAttractions: [
      { name: 'National War Memorial', distance: '200 m', description: 'State-of-the-art tribute to Indian armed forces personnel posthumously decorated.' },
      { name: 'National Gallery of Modern Art (NGMA)', distance: '400 m', description: 'Premier art gallery housed inside Jaipur House.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'India Gate 42-meter triumphal war memorial arch on Kartavya Path New Delhi',
    sourceNote: 'Ministry of Defence & Central Public Works Department (CPWD)',
    tags: ['Colonial Era', 'War Memorial', 'Lutyens Delhi', 'Kartavya Path']
  },
  {
    id: 'bangla-sahib',
    name: 'Gurudwara Bangla Sahib',
    hindiName: 'गुरुद्वारा बंगला साहिब',
    shortDescription: 'One of the most revered Sikh shrines in Delhi, known for its golden dome, holy pond (Sarovar), and massive community kitchen (Langar).',
    hindiShortDescription: 'दिल्ली का अत्यंत पावन सिख धर्मस्थल, जो अपने स्वर्णिम गुंबद, पवित्र सरोवर और विशाल लंगर (सामुदायिक रसोई) के लिए प्रसिद्ध है।',
    fullHistory: 'Originally a 17th-century haveli (bungalow) owned by Raja Jai Singh of Amber (Jaipur). The eighth Sikh Guru, Guru Har Krishan Sahib Ji, stayed here during his visit to Delhi in 1664. During a severe smallpox and cholera epidemic, Guru Ji distributed clean sanctified water from the well to heal the suffering citizens before contracting the disease himself. Sardar Baghel Singh constructed the shrine in 1783.',
    hindiFullHistory: 'यह स्थान मूलतः राजा जय सिंह का बंगला था। सिखों के आठवें गुरु, गुरु हरिकृष्ण साहिब जी 1664 में यहाँ ठहरे थे। महामारी के दौरान गुरु जी ने यहाँ के कुएं से पवित्र जल वितरित कर रोगियों की सेवा की थी। 1783 में सरदार बघेल सिंह ने यहाँ गुरुद्वारे का निर्माण कराया।',
    builtYear: '1783 CE (Current structure expanded throughout 20th century)',
    builtBy: 'Sardar Baghel Singh (Expanded by DSGMC)',
    architecturalStyle: 'Sikh Architecture with Marble & Gold Leaf Finish',
    culturalSignificance: 'Supreme sanctuary of selfless service (Seva), communal harmony, and spiritual healing in the heart of Connaught Place.',
    hindiCulturalSignificance: 'निःस्वार्थ सेवा, लंगर और आध्यात्मिक शांति का अनुपम केंद्र जो दिन-रात लाखों श्रद्धालुओं की सेवा करता है।',
    interestingFacts: [
      'The Langar hall serves over 25,000 to 50,000 free hot nutritious vegetarian meals every single day to anyone irrespective of caste or status.',
      'The holy pond (Amrit Sarovar) contains large colorful carp fish and sanctified healing water.',
      'Features a 24/7 charitable diagnostic centre and hospital on campus.'
    ],
    hindiInterestingFacts: [
      'यहाँ के लंगर में प्रतिदिन 25,000 से 50,000 लोगों को बिना किसी भेदभाव के निःशुल्क भोजन कराया जाता है।',
      'इसके पवित्र सरोवर में रंग-बिरंगी मछलियाँ तैरती हैं और इस जल को औषधीय माना जाता है।',
      'परिसर में एक 24x7 चैरिटेबल अस्पताल और आधुनिक रसोई संचालित होती है।'
    ],
    folkloreOrLegends: [
      'Sikh Tradition: Guru Har Krishan Sahib Ji was known as "Baal Peer" (the child healer) as he was only seven years old when he tended to the cholera victims of Delhi.'
    ],
    hindiFolkloreOrLegends: [
      'सिख इतिहास: गुरु हरिकृष्ण साहिब जी को "बाल पीर" के रूप में स्मरण किया जाता है, जिन्होंने अल्पायु में महामारी पीड़ितों की निःस्वार्थ सेवा की।'
    ],
    travelTips: {
      timings: 'Open 24 hours, 7 days a week',
      entryFee: 'Free entry (Donations voluntary)',
      nearestMetro: 'Shivaji Stadium (Airport Express) or Patel Chowk (Yellow Line)',
      bestTimeToVisit: 'Early morning for Gurbani Kirtan or dusk to experience the lit reflection over the Sarovar.',
      rules: ['Cover your head with a scarf or bandana before entering', 'Remove shoes and wash feet at the entrance', 'No tobacco or alcohol allowed']
    },
    nearbyAttractions: [
      { name: 'Connaught Place (CP)', distance: '800 m', description: 'Colonial Georgian-style circular commercial and shopping hub.' },
      { name: 'Jantar Mantar', distance: '1.1 km', description: 'Astronomical observatory built by Maharaja Jai Singh II of Jaipur in 1724.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1705924270497-5b01bb7b49fe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Gurudwara Bangla Sahib golden dome and water sarovar pool in Delhi',
    sourceNote: 'Delhi Sikh Gurdwara Management Committee (DSGMC)',
    tags: ['Sikh Heritage', 'Gurudwara', 'Langar', 'Connaught Place']
  },
  {
    id: 'sis-ganj-sahib',
    name: 'Gurudwara Sis Ganj Sahib',
    hindiName: 'गुरुद्वारा सीस गंज साहिब',
    shortDescription: 'Sacred Sikh shrine in Chandni Chowk marking the site where the ninth Sikh Guru, Guru Tegh Bahadur, was martyred in 1675.',
    hindiShortDescription: 'चांदनी चौक स्थित पवित्र सिख तीर्थ जहाँ 1675 में नौवें सिख गुरु, गुरु तेग बहादुर जी ने धार्मिक स्वतंत्रता की रक्षा हेतु शहादत दी थी।',
    fullHistory: 'Erected on the exact spot in Chandni Chowk where Guru Tegh Bahadur was publicly executed under Mughal Emperor Aurangzeb’s orders in November 1675 for defending religious freedom of Kashmiri Pandits and freedom of conscience. In 1783, Sikh military general Sardar Baghel Singh captured Delhi and built this historic gurdwara.',
    hindiFullHistory: 'यह गुरुद्वारा उस पावन स्थल पर बना है जहाँ नवंबर 1675 में मुग़ल शासक औरंगज़ेब के आदेश पर गुरु तेग बहादुर जी ने कश्मीरी पंडितों के धर्म और विचार की स्वतंत्रता की रक्षा के लिए अपना शीश बलिदान कर दिया था। 1783 में सरदार बघेल सिंह ने इस गुरुद्वारे का निर्माण करवाया।',
    builtYear: '1783 CE (Current structure remodeled in 1930)',
    builtBy: 'Sardar Baghel Singh',
    architecturalStyle: 'Traditional Sikh Architectural Style',
    culturalSignificance: 'World symbol of moral courage, supreme sacrifice, and human rights to religious self-determination.',
    hindiCulturalSignificance: 'धार्मिक स्वतंत्रता, मानवाधिकार और सर्वोच्च आत्म-बलिदान का वैश्विक ऐतिहासिक प्रतीक।',
    interestingFacts: [
      'The historic trunk of the banyan tree beneath which the Guru was kept in an iron cage still stands preserved inside the gurudwara.',
      'The well from which the Guru bathed before his execution is also preserved.',
      'Located directly in the historic heart of Old Delhi near Fountain Chowk.'
    ],
    hindiInterestingFacts: [
      'उस बरगद के पेड़ का तना आज भी गुरुद्वारे के अंदर सुरक्षित है जिसके नीचे गुरु जी को रखा गया था।',
      'वह ऐतिहासिक कुआं भी परिसर में संरक्षित है जहाँ से गुरु जी ने शहादत से पूर्व स्नान किया था।',
      'यह पुरानी दिल्ली के ऐतिहासिक चांदनी चौक फव्वारा चौक के समीप स्थित है।'
    ],
    folkloreOrLegends: [
      'Sikh Tradition: After the Guru’s martyrdom, brave disciple Bhai Jaita Ji secretly took the Guru’s holy head (Sis) to Anandpur Sahib, while Lakhi Shah Vanjara took the Guru’s body and cremated it by setting fire to his own home at Rakab Ganj.'
    ],
    hindiFolkloreOrLegends: [
      'सिख इतिहास: शहादत के बाद भाई जैता जी गुरु जी के पावन शीश को आनंदपुर साहिब ले गए, और लखी शाह वंजारा ने अपने घर को आग लगाकर गुरु जी के पावन शरीर का अंतिम संस्कार किया।'
    ],
    travelTips: {
      timings: 'Open 24 hours daily',
      entryFee: 'Free entry',
      nearestMetro: 'Chandni Chowk Metro Station (Yellow Line)',
      bestTimeToVisit: 'Morning hours to enjoy tranquil devotion before street markets get crowded.',
      rules: ['Head covering is mandatory', 'Shoes must be deposited at Joda Ghar']
    },
    nearbyAttractions: [
      { name: 'Sunheri Masjid (Golden Mosque)', distance: '150 m', description: 'Historic mosque associated with Nadir Shah in 1739.' },
      { name: 'Red Fort', distance: '600 m', description: 'Historic Mughal citadel at the end of Chandni Chowk.' }
    ],
    imageUrl: 'https://res.cloudinary.com/purnesh/image/upload/w_1000,f_auto,q_auto:eco,c_limit/sgs2-1.jpg',
    imageAlt: 'Gurudwara Sis Ganj Sahib historic shrine facade in Chandni Chowk Old Delhi',
    sourceNote: 'Delhi Sikh Gurdwara Management Committee (DSGMC) & Shiromani Gurdwara Parbandhak Committee',
    tags: ['Sikh Heritage', 'Martyrdom', 'Chandni Chowk', 'Old Delhi'],
    latitude: 28.655988,
    longitude: 77.232561,
    coordinates: { lat: 28.655988, lng: 77.232561 },
    city: 'Old Delhi',
    hindiCity: 'पुरानी दिल्ली',
    state: 'Delhi',
    hindiState: 'दिल्ली'
  },
  {
    id: 'jama-masjid',
    name: 'Jama Masjid, Delhi',
    hindiName: 'जामा मस्जिद',
    shortDescription: 'One of India’s largest and most majestic congregational mosques, built by Shah Jahan with red sandstone and white marble.',
    hindiShortDescription: 'भारत की सबसे बड़ी और भव्य मस्जिदों में से एक, जिसका निर्माण शाहजहाँ ने लाल बलुआ पत्थर और सफेद संगमरमर से कराया।',
    fullHistory: 'Inaugurated by Imam Syed Abdul Ghafoor Shah Bukhari of Bukhara in 1656. Commissioned by Emperor Shah Jahan as the central mosque of his new capital Shahjahanabad. Over 5,000 workers labored for six years to complete the elevated structure which features three grand gates, four towers, and two 40-meter-high minarets constructed of alternating vertical strips of red sandstone and white marble.',
    hindiFullHistory: '1656 में बुखारा के इमाम सैयद अब्दुल गफूर शाह बुखारी द्वारा इसका उद्घाटन किया गया। शाहजहाँ द्वारा निर्मित इस मस्जिद में 25,000 से अधिक नमाज़ी एक साथ प्रार्थना कर सकते हैं। इसके दो 40 मीटर ऊँचे मीनार और तीन विशाल गुंबद हैं।',
    builtYear: '1650–1656 CE',
    builtBy: 'Mughal Emperor Shah Jahan',
    architecturalStyle: 'Mughal Islamic Architecture with Striped Marble Domes',
    culturalSignificance: 'The premier congregational mosque of Delhi, capable of accommodating over 25,000 worshippers during Eid prayers.',
    hindiCulturalSignificance: 'दिल्ली की प्रमुख जामा मस्जिद जहाँ ईद के अवसर पर 25,000 से अधिक श्रद्धालु एक साथ नमाज़ अदा करते हैं।',
    interestingFacts: [
      'The courtyard can hold over 25,000 people simultaneously.',
      'Contains an antique copy of the Quran written on deerskin preserved in the north gate relic room.',
      'The southern minaret provides a 360-degree panoramic view across Old Delhi and the Red Fort.'
    ],
    hindiInterestingFacts: [
      'इसके विशाल प्रांगण में एक साथ 25,000 लोग नमाज़ पढ़ सकते हैं।',
      'यहाँ हिरण की खाल पर लिखी गई पवित्र क़ुरान की प्राचीन पांडुलिपि सुरक्षित है।',
      'दक्षिणी मीनार से पुरानी दिल्ली और लाल किले का विहंगम 360 डिग्री दृश्य दिखाई देता है।'
    ],
    folkloreOrLegends: [
      'Historical Anecdote: Emperor Shah Jahan intentionally built the mosque on a high hillock called Bhojla Pahari so that the mosque would tower over the Red Fort and remind all mortals of divine supremacy.'
    ],
    hindiFolkloreOrLegends: [
      'ऐतिहासिक विवरण: शाहजहाँ ने इसे भोजला पहाड़ी पर ऊँचाई पर बनवाया ताकि मस्जिद किले से भी ऊँची दिखाई दे और ईश्वर की सर्वोच्चता का स्मरण कराए।'
    ],
    travelTips: {
      timings: '7:00 AM – 12:00 PM and 1:30 PM – 6:30 PM (Closed to tourists during prayer times)',
      entryFee: 'Free entry (Camera/Mobile photography pass ₹300, Minaret climb ₹100)',
      nearestMetro: 'Jama Masjid Metro Station (Heritage Violet Line)',
      bestTimeToVisit: 'Early morning light or during culinary walking tours in the evening.',
      rules: ['Modest dress code required; robes are available at gates', 'Footwear must be taken off at entrance']
    },
    nearbyAttractions: [
      { name: 'Karim’s & Al Jawahar', distance: '100 m', description: 'Iconic century-old Mughlai culinary institutions at Matia Mahal.' },
      { name: 'Chor Bazaar', distance: '500 m', description: 'Famous Sunday flea market near the mosque steps.' }
    ],
    imageUrl: 'https://plus.unsplash.com/premium_photo-1697730332011-11f027c6aa60?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Jama Masjid grand red sandstone courtyard and striped marble domes in Delhi',
    sourceNote: 'Delhi Waqf Board & Archaeological Survey of India (ASI)',
    tags: ['Mughal', 'Mosque', 'Shahjahanabad', 'Old Delhi']
  },
  {
    id: 'purana-qila',
    name: 'Purana Qila (Old Fort)',
    hindiName: 'पुराना किला',
    shortDescription: 'Ancient 16th-century fortress situated on the legendary mound of Indraprastha, dating back over 3,000 years.',
    hindiShortDescription: '16वीं सदी का ऐतिहासिक दुर्ग, जो प्राचीन इंद्रप्रस्थ के 3,000 वर्ष पुराने टीले पर यमुना नदी के किनारे स्थित है।',
    fullHistory: 'Reconstructed by Afghan ruler Sher Shah Suri (1538–1545) and Mughal Emperor Humayun. The site has yielded archaeological layers from the Painted Grey Ware period (c. 1000 BCE), closely linking it to the mythological city of Indraprastha from the Mahabharata epic. Key structures include Qila-i-Kuhna Mosque, Sher Mandal (where Humayun fatally fell in 1556), and majestic stone gates.',
    hindiFullHistory: 'शेर शाह सूरी और मुग़ल सम्राट हुमायूँ द्वारा निर्मित। पुरातात्विक उत्खनन में यहाँ महाभारत कालीन चित्रित धूसर मृद्भाण्ड (PGW) मिले हैं जो इसे प्राचीन इंद्रप्रस्थ से जोड़ते हैं। यहाँ किला-ए-कुहना मस्जिद और शेर मंडल स्थित हैं।',
    builtYear: '1538–1545 CE (Mound archaeological history dating to 1000 BCE)',
    builtBy: 'Sher Shah Suri & Humayun',
    architecturalStyle: 'Afghan / Early Mughal Stone Masonry',
    culturalSignificance: 'Archaeological cradle of Delhi representing the mythological and early medieval origins of the capital.',
    hindiCulturalSignificance: 'दिल्ली का सबसे प्राचीन जीवित दुर्ग क्षेत्र, जो महाभारत काल से लेकर मध्यकाल तक की निरंतर सभ्यता का प्रमाण है।',
    interestingFacts: [
      'Excavations by ASI director BB Lal discovered pottery and terracotta figures confirming continuous habitation from the 3rd century BCE to Mughal times.',
      'The Sher Mandal served as Humayun’s astronomical library.',
      'Hosts a popular evening sound and light show exploring 5,000 years of Delhi history.'
    ],
    hindiInterestingFacts: [
      'एएसआई के उत्खनन में यहाँ मौर्य, शुंग, कुषाण और गुप्त काल के सिक्के और बर्तन मिले हैं।',
      'शेर मंडल हुमायूँ की वेधशाला और पुस्तकालय था।',
      'यहाँ शाम को दिल्ली के 5000 वर्षों के इतिहास पर आधारित लाइट एंड साउंड शो आयोजित होता है।'
    ],
    folkloreOrLegends: [
      'Mythological Tradition: According to tradition, Purana Qila marks the exact location of the Pandava citadel of Indraprastha mentioned in the ancient Indian epic Mahabharata.'
    ],
    hindiFolkloreOrLegends: [
      'पौराणिक मान्यता: जनश्रुति और परंपरा के अनुसार यह दुर्ग महाभारत के पांडवों की प्राचीन राजधानी इंद्रप्रस्थ के स्थल पर बना है।'
    ],
    travelTips: {
      timings: '7:00 AM – 5:00 PM (Sound and light show in the evening)',
      entryFee: '₹25 for Indians, ₹300 for Foreign Nationals',
      nearestMetro: 'Supreme Court (Pragati Maidan) Metro Station (Blue Line)',
      bestTimeToVisit: 'Winter mornings and evenings for boating in the moat lake.',
      rules: ['Boating lake is subject to seasonal water management']
    },
    nearbyAttractions: [
      { name: 'National Zoological Park', distance: '400 m', description: 'Sprawling Delhi Zoo housing diverse wildlife and white tigers.' },
      { name: 'National Crafts Museum', distance: '600 m', description: 'Fabulous open-air folk craft museum showcasing traditional village huts.' }
    ],
    imageUrl: 'https://plus.unsplash.com/premium_photo-1697730392744-f02b027471b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Purana Qila ancient fortress gate and bastions in Delhi',
    sourceNote: 'Archaeological Survey of India (ASI) Excavation Reports',
    tags: ['Indraprastha', 'Sher Shah Suri', 'Mahabharata', 'Fortress']
  },
  {
    id: 'agrasen-ki-baoli',
    name: 'Agrasen ki Baoli',
    hindiName: 'अग्रसेन की बावली',
    shortDescription: 'Intricate 14th-century stepped water reservoir (stepwell) with 108 stone steps plunging 15 meters deep into the earth.',
    hindiShortDescription: '14वीं सदी की भव्य 60 मीटर लंबी और 15 मीटर चौड़ी बावली जिसमें 108 पत्थर की सीढ़ियाँ गहराई में उतरती हैं।',
    fullHistory: 'Believed by historical tradition to have been originally built by the legendary King Agrasen of Agroha and rebuilt during the Tughlaq or Lodi dynasty period (14th century). It served as both a crucial groundwater conservation reservoir in arid Delhi and a cool social retreat for travelers and community gatherings during scorching summer months.',
    hindiFullHistory: 'परंपरा के अनुसार इसे सूर्यवंशी राजा अग्रसेन ने बनवाया था और बाद में 14वीं सदी में तुग़लक़ या लोदी काल में इसका पुनर्निर्माण हुआ। यह जल संचयन के साथ-साथ गर्मियों में विश्राम का प्रमुख सामाजिक केंद्र थी।',
    builtYear: '14th Century (Tughlaq/Lodi reconstruction of ancient foundation)',
    builtBy: 'Legendary King Agrasen / Rebuilt by Delhi Sultanate Rulers',
    architecturalStyle: 'Delhi Sultanate Stepped Well Architecture with Arched Niches',
    culturalSignificance: 'A designated protected monument under ASI highlighting ancient Indian hydraulic engineering and water conservation.',
    hindiCulturalSignificance: 'प्राचीन भारतीय जल संरक्षण, वापी स्थापत्य और हाइड्रोलिक इंजीनियरिंग का बेजोड़ संरक्षित नमूना।',
    interestingFacts: [
      'Measures 60 meters long by 15 meters wide with 108 stone steps descending across three distinct levels.',
      'Featured prominently in popular Indian films like PK (2014) and Sultan (2016).',
      'Hidden right beside high-rise glass commercial skyscrapers near Connaught Place.'
    ],
    hindiInterestingFacts: [
      'यह 60 मीटर लंबी और 15 मीटर चौड़ी है, जिसमें तीन मंजिलों पर 108 सीढ़ियाँ हैं।',
      'यह बॉलीवुड फिल्म \'पीके\' और \'सुल्तान\' के प्रमुख दृश्यों में नजर आई है।',
      'कनॉट प्लेस के आधुनिक गगनचुंबी भवनों के ठीक बीच एक ऐतिहासिक शांति का नखलिस्तान।'
    ],
    folkloreOrLegends: [
      'Folklore / Urban Legend: Popular ghost folklore and internet myths claim the stepwell once contained mystical "black water" that hypnotized people into jumping, although historians and ASI debunk this as harmless fictional storytelling.'
    ],
    hindiFolkloreOrLegends: [
      'लोककथा / शहरी अफ़वाह: इंटरनेट पर इसके \'काले पानी\' और अलौकिक शक्तियों की कई अफ़वाहें प्रचलित हैं, जिन्हें इतिहासकारों ने कोरी कल्पना बताया है।'
    ],
    travelTips: {
      timings: '9:00 AM – 5:30 PM (Daily)',
      entryFee: 'Free entry',
      nearestMetro: 'Barakhamba Road Metro Station (Blue Line) or Janpath (Violet Line)',
      bestTimeToVisit: 'Morning around 9:00 AM to 11:00 AM before afternoon crowds.',
      rules: ['Tripods require ASI permission', 'Sitting on dangerous ledge edges is prohibited']
    },
    nearbyAttractions: [
      { name: 'Connaught Place', distance: '700 m', description: 'Central shopping, dining, and cultural circle of New Delhi.' },
      { name: 'National Museum Delhi', distance: '1.8 km', description: 'Premier museum with Harappan gallery, miniature paintings, and relics.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1627729115602-2b2a44cec5c0?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Agrasen ki Baoli 14th-century stepwell stone arches and steps in Delhi',
    sourceNote: 'Archaeological Survey of India (ASI) Gazetteers',
    tags: ['Stepwell', 'Water Architecture', 'Connaught Place', 'Baoli']
  },
  {
    "id": "monument-lodhi-garden",
    "name": "Lodhi Garden",
    "hindiName": "लोधी गार्डन",
    "shortDescription": "Lodhi Garden is a historic urban garden in New Delhi that preserves an important group of medieval Indo-Islamic monuments, including the tombs of Mohammed Shah and Sikandar Lodi, Bara Gumbad, Sheesh Gumbad, mosques, gateways, and other architectural remains. The garden combines Delhi Sultanate heritage with a landscaped public park and is one of Delhi's best-known heritage landscapes.",
    "hindiShortDescription": "लोधी गार्डन नई दिल्ली का एक ऐतिहासिक उद्यान है, जिसमें दिल्ली सल्तनत और बाद के मध्यकालीन स्थापत्य से जुड़े कई महत्वपूर्ण स्मारक संरक्षित हैं। यहाँ मोहम्मद शाह का मकबरा, सिकंदर लोदी का मकबरा, बड़ा गुम्बद, शीश गुम्बद, मस्जिदें, प्रवेशद्वार और अन्य स्थापत्य अवशेष स्थित हैं। यह ऐतिहासिक विरासत और आधुनिक हरित सार्वजनिक स्थल का सुंदर संयोजन है।",

    "fullHistory": "The area now known as Lodhi Garden was historically associated with the village of Khairpur and contains monuments dating mainly from the Lodi period of the Delhi Sultanate, with some later Mughal-period remains. The complex developed as a landscape containing royal and elite tombs, religious structures, enclosed gardens and associated architectural features. Sikandar Lodi, the second ruler of the Lodi dynasty, ruled Delhi from 1489 to 1517 CE. His tomb was erected by his son Ibrahim Lodi after his death and was constructed around 1517–1518 CE. It is regarded as an important early example of the garden-tomb tradition in India. The official Delhi government educational material identifies the tomb as being about 100 metres from Bara Gumbad. Mohammed Shah's tomb, also known as Mubarak Khan-ka-Gumbad, belongs to the Sayyid period and predates the Lodi monuments. The Bara Gumbad complex includes a large domed structure, a mosque and associated architectural elements, while Sheesh Gumbad is distinguished by its historic glazed-tile decoration. The surviving structures collectively illustrate the development of Delhi Sultanate architecture immediately before the Mughal period. During the development of modern New Delhi, the historic landscape was retained as a garden and became an important public recreational and heritage space. Today, Lodhi Garden is both a major green space and an open-air heritage landscape where visitors can see medieval monuments within a landscaped setting.",
    "hindiFullHistory": "वर्तमान लोधी गार्डन का क्षेत्र ऐतिहासिक रूप से खैरपुर गाँव से जुड़ा हुआ था और यहाँ मुख्यतः दिल्ली सल्तनत के लोधी काल के स्मारक तथा कुछ बाद के मुगलकालीन अवशेष मिलते हैं। इस क्षेत्र का विकास शाही एवं उच्चवर्गीय मकबरों, धार्मिक इमारतों, चारदीवारी से घिरे उद्यानों और उनसे जुड़े स्थापत्य तत्वों वाले ऐतिहासिक परिसर के रूप में हुआ। लोधी वंश के दूसरे शासक सिकंदर लोदी ने 1489 से 1517 ईस्वी तक दिल्ली पर शासन किया। उनकी मृत्यु के बाद उनके पुत्र इब्राहिम लोदी ने लगभग 1517–1518 ईस्वी में उनका मकबरा बनवाया। यह भारत में विकसित होने वाली उद्यान-मकबरा परंपरा के प्रारंभिक महत्वपूर्ण उदाहरणों में से एक माना जाता है। दिल्ली सरकार की सामग्री के अनुसार सिकंदर लोदी का मकबरा बड़ा गुम्बद से लगभग 100 मीटर की दूरी पर स्थित है। मोहम्मद शाह का मकबरा, जिसे मुबारक खान-का-गुम्बद भी कहा जाता है, सैय्यद काल से संबंधित है और लोधी काल के स्मारकों से पहले का है। बड़ा गुम्बद परिसर में एक विशाल गुम्बद, मस्जिद और अन्य स्थापत्य अवशेष शामिल हैं, जबकि शीश गुम्बद अपनी ऐतिहासिक चमकीली टाइलों की सजावट के लिए विशेष रूप से जाना जाता है। ये सभी संरचनाएँ मुगल काल से ठीक पहले की दिल्ली सल्तनत की स्थापत्य परंपराओं और उनके विकास को समझने में महत्वपूर्ण हैं। आधुनिक नई दिल्ली के विकास के दौरान इस ऐतिहासिक क्षेत्र को उद्यान के रूप में संरक्षित किया गया और बाद में यह एक महत्वपूर्ण सार्वजनिक हरित एवं विरासत स्थल बन गया। आज लोधी गार्डन एक लोकप्रिय सार्वजनिक उद्यान होने के साथ-साथ मध्यकालीन स्थापत्य को प्राकृतिक परिवेश में देखने का महत्वपूर्ण स्थान है।",

    "builtYear": "15th–16th Century CE (the monuments within the garden belong to different periods)",
    "builtBy": "Various patrons, including the Sayyid and Lodi rulers and members of their courts; Sikandar Lodi's tomb was commissioned by his son Ibrahim Lodi",
    "architecturalStyle": "Indo-Islamic architecture / Delhi Sultanate architecture, primarily Sayyid and Lodi-period styles, with later Mughal-period elements",
    "culturalSignificance": "Lodhi Garden is an important heritage landscape because it preserves multiple medieval monuments within a historic garden setting. The Delhi government archaeology records list the Tomb of Sikandar Lodi, the Mohammed Shah tomb (Mubarak Khan-ka-Gumbad), Bara Gumbad with its mosque, Sheesh Gumbad, and other associated structures in the Khairpur/Lodhi Garden area. The garden demonstrates the evolution of Delhi Sultanate funerary and religious architecture and remains an important cultural and recreational landmark of New Delhi.",
    "hindiCulturalSignificance": "लोधी गार्डन एक महत्वपूर्ण ऐतिहासिक विरासत क्षेत्र है क्योंकि यहाँ एक ही उद्यान परिसर में मध्यकालीन काल के अनेक स्मारक संरक्षित हैं। दिल्ली सरकार के पुरातत्व अभिलेखों में सिकंदर लोदी का मकबरा, मोहम्मद शाह का मकबरा (मुबारक खान-का-गुम्बद), बड़ा गुम्बद एवं उससे जुड़ी मस्जिद, शीश गुम्बद तथा अन्य स्थापत्य अवशेषों का उल्लेख मिलता है। यह परिसर दिल्ली सल्तनत की समाधि एवं धार्मिक स्थापत्य परंपरा के विकास को समझने में महत्वपूर्ण है और आज नई दिल्ली के प्रमुख सांस्कृतिक, ऐतिहासिक एवं मनोरंजक स्थलों में शामिल है।",

    "interestingFacts": [
      "Lodhi Garden is not a single monument; it is a historic garden containing several independent medieval monuments.",
      "The Tomb of Sikandar Lodi was built by his son Ibrahim Lodi around 1517–1518 CE.",
      "Sikandar Lodi's tomb is an important early example of the garden-tomb tradition in India.",
      "The Tomb of Mohammed Shah is also known as Mubarak Khan-ka-Gumbad and belongs to the Sayyid period.",
      "The Bara Gumbad complex contains a mosque and other architectural remains in addition to the large domed structure.",
      "Sheesh Gumbad is named for its historic glazed-tile decoration.",
      "The garden also contains lesser-known remains such as a turret, mosque structures, enclosure walls and the remains of a baoli.",
      "The Delhi Archaeology Department records a turret inside Lodhi Garden with a jharokha, brackets and a ribbed dome."
    ],

    "hindiInterestingFacts": [
      "लोधी गार्डन स्वयं एक अकेला स्मारक नहीं बल्कि कई मध्यकालीन स्मारकों वाला ऐतिहासिक उद्यान परिसर है।",
      "सिकंदर लोदी का मकबरा उनके पुत्र इब्राहिम लोदी ने लगभग 1517–1518 ईस्वी में बनवाया था।",
      "सिकंदर लोदी का मकबरा भारत की प्रारंभिक उद्यान-मकबरा परंपरा का एक महत्वपूर्ण उदाहरण है।",
      "मोहम्मद शाह के मकबरे को मुबारक खान-का-गुम्बद के नाम से भी जाना जाता है और यह सैय्यद काल से संबंधित है।",
      "बड़ा गुम्बद परिसर में बड़े गुम्बद के साथ एक मस्जिद और अन्य स्थापत्य अवशेष भी हैं।",
      "शीश गुम्बद का नाम इसकी ऐतिहासिक चमकीली टाइलों की सजावट से जुड़ा है।",
      "उद्यान में अपेक्षाकृत कम प्रसिद्ध स्थापत्य अवशेष भी हैं, जिनमें एक बुर्ज, मस्जिदें, चारदीवारी और बावली के अवशेष शामिल हैं।",
      "दिल्ली पुरातत्व विभाग के अनुसार लोधी गार्डन का एक बुर्ज झरोखे, ब्रैकेट और रिब्ड गुम्बद जैसी स्थापत्य विशेषताएँ रखता है।"
    ],

    "folkloreOrLegends": [
      "Lodhi Garden is popularly associated with stories and traditions surrounding the medieval rulers whose tombs survive in the garden, although many specific local legends are not supported by firm historical records.",
      "The garden's atmosphere has long encouraged popular associations between its monuments, old Delhi stories and the lives of the rulers and nobles buried in the area."
    ],

    "hindiFolkloreOrLegends": [
      "लोधी गार्डन से जुड़े कई लोकप्रिय किस्से यहाँ स्थित मध्यकालीन शासकों और उनके मकबरों से संबंधित हैं, हालांकि इनमें से कई लोककथाओं का ठोस ऐतिहासिक प्रमाण उपलब्ध नहीं है।",
      "उद्यान के ऐतिहासिक वातावरण के कारण स्थानीय स्तर पर इसके स्मारकों, पुराने दिल्ली के किस्सों और यहाँ दफन शासकों एवं उच्चवर्गीय व्यक्तियों के जीवन से जुड़ी अनेक लोकप्रिय कथाएँ प्रचलित रही हैं।"
    ],

    "travelTips": {
      "timings": "Commonly open from early morning until evening; visitors should verify current entry and park timings before visiting.",
      "entryFee": "Generally free public access; individual monument access rules may differ.",
      "nearestMetro": "Jor Bagh Metro Station (Yellow Line) is a nearby metro option.",
      "bestTimeToVisit": "October to March, especially early morning or late afternoon. The cooler months are more comfortable for walking around the large garden.",
      "rules": [
        "Photography is generally suitable for personal use, but restrictions may apply to specific protected structures or professional/commercial filming.",
        "Do not climb, sit on, lean against, or touch protected monument surfaces.",
        "Keep the garden clean and dispose of waste in designated bins.",
        "Respect the monuments, graves and prayer-related spaces.",
        "Commercial filming or professional shoots may require prior permission from the relevant authority.",
        "Check current park timings and access conditions before travelling because operating arrangements can change."
      ]
    },

    "nearbyAttractions": [
      {
        "name": "Khan Market",
        "distance": "Nearby",
        "description": "A well-known shopping, dining and lifestyle district close to Lodhi Garden."
      },
      {
        "name": "India Habitat Centre",
        "distance": "Approx. 2 km",
        "description": "A major cultural venue hosting exhibitions, performances, talks and other events."
      },
      {
        "name": "Safdarjung's Tomb",
        "distance": "Approx. 2.5 km",
        "description": "An 18th-century Mughal-era garden tomb and one of Delhi's prominent architectural landmarks."
      },
      {
        "name": "Humayun's Tomb",
        "distance": "Approx. 3–4 km",
        "description": "A major Mughal garden-tomb complex and UNESCO World Heritage Site."
      },
      {
        "name": "Sunder Nursery",
        "distance": "Approx. 3–4 km",
        "description": "A historic garden and heritage landscape near Humayun's Tomb containing several protected monuments."
      }
    ],

    "imageUrl": "https://images.unsplash.com/photo-1715633742350-94c3d9727520?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "imageAlt": "Historic medieval monument surrounded by the landscaped greenery of Lodhi Garden in New Delhi",

    "sourceNote": "Compiled using Delhi Tourism and Government of NCT of Delhi Department of Archaeology records. Official archaeology records document multiple individual monuments within Lodhi Garden, including the Sikandar Lodi tomb, Bara Gumbad complex, Sheesh Gumbad, mosque remains, enclosure walls and the garden turret.",
    "tags": [
      "Lodhi Garden",
      "Lodi Garden",
      "Delhi Heritage",
      "Delhi Sultanate",
      "Lodi Dynasty",
      "Sayyid Dynasty",
      "Indo-Islamic Architecture",
      "Historic Garden",
      "Tombs",
      "Bara Gumbad",
      "Sheesh Gumbad",
      "Sikandar Lodi",
      "Mohammed Shah",
      "New Delhi"
    ]
  }

];
