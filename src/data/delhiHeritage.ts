/**
 * ============================================================================
 * HERITAGELENS AI — DELHI PILOT HERITAGE DATASET (10 SITES)
 * ============================================================================
 * 
 * IMPORTANT DATASET REVIEW NOTICE:
 * All records compiled in this file represent cautious, commonly accepted
 * historical and architectural information sourced from authoritative open
 * cultural documentation, including the Archaeological Survey of India (ASI),
 * UNESCO World Heritage Centre, Delhi Sikh Gurdwara Management Committee (DSGMC),
 * and academic monographs.
 *
 * All content must be periodically reviewed against authoritative official
 * sources prior to live production deployment. Opening hours, entry fees, and
 * visitor rules are subject to seasonal changes and administrative revisions.
 *
 * Folklore, oral traditions, and popular beliefs are explicitly segregated and
 * labeled separately from verified historical documentation.
 * ============================================================================
 */

import { HeritageSiteRecord } from '../types/heritage';

export const DELHI_HERITAGE_RECORDS: HeritageSiteRecord[] = [
  // 1. Red Fort
  {
    id: 'red-fort',
    name: 'Red Fort',
    alternateName: 'Lal Qila / Qila-e-Mubarak',
    category: 'Fort',
    city: 'Delhi',
    area: 'Old Delhi / Chandni Chowk (Nearest Metro: Lal Qila on Violet Line / Chandni Chowk on Yellow Line)',
    shortDescription: 'A 17th-century Mughal fortification of red sandstone that served as the primary residence and ceremonial seat of Mughal emperors in Shahjahanabad.',
    timings: '9:30 AM – 4:30 PM (Closed on Mondays; check official ASI portal for current holiday schedules)',
    tickets: 'Entry ticket required. Nominal fee for Indian citizens; higher tier for foreign tourists. Online ticketing via ASI portal recommended.',
    historicalSummary: 'Commissioned by Mughal Emperor Shah Jahan in 1638 upon shifting the imperial capital from Agra to Delhi (Shahjahanabad). Construction was supervised by architect Ustad Ahmad Lahori and completed around 1648. It became the political epicenter of the Mughal Empire and later played key roles during the events of 1857 and Indian independence.',
    architecture: 'Indo-Islamic Mughal architectural style integrating Persian, Timurid, and Hindu motifs. Features massive octagonal defensive walls, ceremonial pavilions such as the Diwan-i-Aam and Diwan-i-Khas, and water channels (Nahr-i-Bihisht).',
    culturalSignificance: 'Designated a UNESCO World Heritage Site in 2007. Serves as the national venue where the Prime Minister of India addresses the nation on Independence Day.',
    interestingFacts: [
      'Originally referred to in contemporary chronicles as Qila-e-Mubarak (The Blessed Fort).',
      'The famous Peacock Throne once stood in the Diwan-i-Khas before being taken by Nader Shah in 1739.',
      'Its ramparts extend over approximately 2.4 kilometers in circumference.'
    ],
    folklore: [
      'Folklore / Oral Tradition: Local urban legends often suggest secret escape tunnels connecting Red Fort to Agra or Purana Qila, though no archaeological validation exists for long-distance subterranean routes.'
    ],
    travelTips: [
      'Pre-book tickets via the ASI website to avoid ticket counter queues.',
      'Wear comfortable walking shoes as the complex is expansive.',
      'Audio guides and sound-and-light evening shows are subject to seasonal schedules.'
    ],
    nearbyPlaces: [
      { name: 'Chandni Chowk Market', distance: '400 m', description: 'Historic 17th-century bustling street market' },
      { name: 'Jama Masjid', distance: '1.2 km', description: 'One of the largest congregational mosques in India' },
      { name: 'Gauri Shankar Temple', distance: '600 m', description: 'Historic Hindu temple in Chandni Chowk' }
    ],
    latitude: 28.6562,
    longitude: 77.2410,
    imageKeywords: ['red fort', 'lal qila', 'mughal architecture', 'delhi fort', 'lahori gate'],
    sourceNote: 'Archaeological Survey of India (ASI) & UNESCO World Heritage Centre Records',
    supportedLanguages: ['en', 'hi']
  },

  // 2. Gurudwara Bangla Sahib
  {
    id: 'gurudwara-bangla-sahib',
    name: 'Gurudwara Bangla Sahib',
    alternateName: 'Bangla Sahib',
    category: 'Religious Place',
    city: 'Delhi',
    area: 'Connaught Place / Baba Kharak Singh Marg (Nearest Metro: Patel Chowk or Shivaji Stadium on Airport Express / Rajiv Chowk on Yellow & Blue Lines)',
    shortDescription: 'One of the most prominent Sikh gurdwaras in Delhi, revered for its association with the eighth Sikh Guru, Guru Har Krishan.',
    timings: 'Open 24 hours daily (Community kitchen / Langar serves meals throughout the day; check visitor guidelines before visiting)',
    tickets: 'Free entry for all visitors of all backgrounds and faiths.',
    historicalSummary: 'Originally a 17th-century haveli (bungalow) owned by Raja Jai Singh of Amer (Amber), known as Jaisinghpura Palace. Guru Har Krishan, the eighth Sikh Guru, stayed here in 1664 during an outbreak of cholera and smallpox, providing clean water and compassionate relief to the afflicted from the well on the premises. General Sardar Baghel Singh established the shrine in 1783.',
    architecture: 'Sikh architecture featuring brilliant white marble facades, a prominent gilded golden dome (fluted dome), intricate marble inlay carvings, a sprawling sacred pool (Sarovar), and a spacious congregational prayer hall (Darbar Sahib).',
    culturalSignificance: 'A cornerstone of Sikh spiritual life, humanitarian community service, and interfaith harmony in the heart of Delhi, known for its round-the-clock free community kitchen (Langar).',
    interestingFacts: [
      'The holy water of the Sarovar pool is revered by devotees as "Amrit" with curative spiritual significance.',
      'The Langar serves tens of thousands of free, nutritious vegetarian meals to visitors every single day regardless of caste, religion, or background.',
      'Houses a high-tech charitable hospital, library, and museum depicting Sikh history within its complex.'
    ],
    folklore: [
      'Oral Tradition / Sacred Tradition: Devotees recount that Guru Har Krishan blessed the well water during the 1664 epidemic, which brought healing and respite to thousands suffering from disease in Delhi.'
    ],
    travelTips: [
      'Visitors must cover their heads (scarves provided free at entry) and remove footwear at the shoe stand.',
      'Dress modestly and wash hands and feet at the designated cleansing pool before entering the Darbar Sahib.',
      'Photography inside the sanctum sanctorum / prayer hall is strictly restricted.'
    ],
    nearbyPlaces: [
      { name: 'Connaught Place', distance: '1.0 km', description: 'Colonial-era Georgian-style shopping and dining hub' },
      { name: 'Sacred Heart Cathedral', distance: '300 m', description: 'Prominent Roman Catholic cathedral' },
      { name: 'Jantar Mantar', distance: '1.2 km', description: '18th-century equinoctial sundial and observatory' }
    ],
    latitude: 28.6264,
    longitude: 77.2090,
    imageKeywords: ['bangla sahib', 'sikh temple delhi', 'golden dome', 'sarovar', 'delhi gurudwara'],
    sourceNote: 'Delhi Sikh Gurdwara Management Committee (DSGMC) & historical records',
    supportedLanguages: ['en', 'hi']
  },

  // 3. Gurudwara Sis Ganj Sahib
  {
    id: 'gurudwara-sis-ganj-sahib',
    name: 'Gurudwara Sis Ganj Sahib',
    alternateName: 'Sis Ganj Sahib',
    category: 'Religious Place',
    city: 'Delhi',
    area: 'Chandni Chowk, Old Delhi (Nearest Metro: Chandni Chowk on Yellow Line / Lal Qila on Violet Line)',
    shortDescription: 'A historic Sikh shrine established at the site of the martyrdom of the ninth Sikh Guru, Guru Tegh Bahadur, in 1675.',
    timings: 'Open 24 hours daily (Check visitor protocols during major Sikh festivals)',
    tickets: 'Free entry for all visitors.',
    historicalSummary: 'Marks the exact location in Chandni Chowk where Guru Tegh Bahadur was executed in November 1675 on the orders of Mughal Emperor Aurangzeb for defending the religious freedom of Kashmiri Pandits and non-Muslims. The first memorial structure was established by Sikh general Sardar Baghel Singh in 1783, and the present grand shrine structure was constructed in 1930.',
    architecture: 'Traditional Sikh architectural style in gold and white marble, featuring elaborate domes, arches, and polished brass doors. Preserves the trunk of the banyan tree beneath which the Guru was martyred and the well used by him during his captivity.',
    culturalSignificance: 'A profound national and spiritual symbol of supreme sacrifice for human rights, religious tolerance, and conscience.',
    interestingFacts: [
      'Guru Tegh Bahadur is revered as "Hind Di Chhadar" (Shield of India) for his sacrifice protecting religious freedom.',
      'The shrine maintains continuous recitation of Gurbani and round-the-clock Langar.',
      'Adjacent to the historic Kotwali (police station) where the Guru and his disciples were imprisoned.'
    ],
    folklore: [
      'Oral Tradition / Devotional Lore: Traditional accounts describe how Bhai Jaita courageously carried the Guru’s severed head (Sis) to Anandpur Sahib through imperial guards, while Bhai Lakhi Shah Vanjara cremated the Guru’s body by burning his own house.'
    ],
    travelTips: [
      'Head coverings must be worn at all times within the complex.',
      'Located in the heart of pedestrian-dense Chandni Chowk; walking or e-rickshaws from metro are recommended.',
      'Respect silence in the central prayer chamber.'
    ],
    nearbyPlaces: [
      { name: 'Sunheri Masjid', distance: '150 m', description: '18th-century mosque in Chandni Chowk' },
      { name: 'Town Hall Old Delhi', distance: '300 m', description: 'Victorian-era municipal building' },
      { name: 'Red Fort', distance: '800 m', description: '17th-century Mughal fortress' }
    ],
    latitude: 28.6568,
    longitude: 77.2324,
    imageKeywords: ['sis ganj sahib', 'chandni chowk gurudwara', 'guru tegh bahadur memorial', 'old delhi sikh shrine'],
    sourceNote: 'Delhi Sikh Gurdwara Management Committee (DSGMC) records',
    supportedLanguages: ['en', 'hi']
  },

  // 4. Jama Masjid, Delhi
  {
    id: 'jama-masjid-delhi',
    name: 'Jama Masjid, Delhi',
    alternateName: 'Masjid-i-Jahan-Numa',
    category: 'Mosque',
    city: 'Delhi',
    area: 'Old Delhi (Nearest Metro: Jama Masjid on Violet Line / Chawri Bazar on Yellow Line)',
    shortDescription: 'One of the largest and most renowned congregational mosques in India, built of red sandstone and white marble.',
    timings: '7:00 AM to 12:00 PM and 1:30 PM to 6:30 PM (Non-Muslim visitors not permitted during congregational prayer / Namaz hours)',
    tickets: 'Free entry for worship. Modest camera/phone photography fee may be charged at the entrance. Separate small fee to climb the southern minaret.',
    historicalSummary: 'Commissioned by Mughal Emperor Shah Jahan between 1650 and 1656 CE at a cost of approximately one million rupees. Inaugurated by an Islamic scholar from Bukhara, Syed Abdul Ghafoor Shah Bukhari, appointed as the first Shahi Imam. It served as the principal imperial congregational mosque of Shahjahanabad.',
    architecture: 'Classic Mughal architectural masterpiece built on a high red sandstone plinth. Features three immense marble bulbous domes with black stripes, two 40-meter-tall minarets of red sandstone and white marble, and an expansive courtyard capable of holding over 25,000 worshippers.',
    culturalSignificance: 'A central hub for Islamic worship, festive congregations during Eid, and a vibrant cultural heart of Old Delhi cuisine and heritage.',
    interestingFacts: [
      'Its historical Persian name "Masjid-i-Jahan-Numa" translates to "Mosque commanding a view of the world".',
      'Built on the natural hillock of Bhojla Pahari, raising it prominently above the surrounding cityscape.',
      'Contains ancient Islamic relics including an antique Quran transcribed on deerskin.'
    ],
    folklore: [
      'Oral Tradition: Local narratives recount that Shah Jahan designed the mosque on an elevated rock plinth intentionally so that the house of God would stand higher than the imperial emperor’s palace at the Red Fort.'
    ],
    travelTips: [
      'Visitors must remove shoes before entering the courtyard (shoe bags/guards available).',
      'Robes/lungis are provided at the entrance for visitors wearing clothing that exposes shoulders or knees.',
      'Climbing the southern minaret offers panoramic 360-degree vistas across Old Delhi.'
    ],
    nearbyPlaces: [
      { name: 'Karim’s & Matia Mahal Food Lane', distance: '100 m', description: 'Famous historic culinary hub for Mughlai cuisine' },
      { name: 'Meena Bazaar', distance: '100 m', description: 'Traditional market at the foot of the mosque stairs' },
      { name: 'Red Fort', distance: '1.2 km', description: 'Historic Mughal seat of power' }
    ],
    latitude: 28.6507,
    longitude: 77.2334,
    imageKeywords: ['jama masjid delhi', 'masjid i jahan numa', 'old delhi mosque', 'mughal mosque', 'minaret'],
    sourceNote: 'Archaeological Survey of India & Delhi Waqf Board historical documentation',
    supportedLanguages: ['en', 'hi']
  },

  // 5. India Gate
  {
    id: 'india-gate',
    name: 'India Gate',
    alternateName: 'All India War Memorial',
    category: 'Memorial',
    city: 'Delhi',
    area: 'Kartavya Path / Central Vista (Nearest Metro: Central Secretariat on Yellow & Violet Lines / Supreme Court on Blue Line)',
    shortDescription: 'An imposing 42-metre-high triumphal arch war memorial honoring Indian soldiers who fell during the First World War and Third Anglo-Afghan War.',
    timings: 'Open 24 hours daily (Illuminated in the evening; check Central Vista traffic regulations during national ceremonies)',
    tickets: 'Free public access.',
    historicalSummary: 'Designed by Sir Edwin Lutyens as part of the Imperial Delhi urban master plan, with the foundation stone laid by the Duke of Connaught in 1921. Dedicated in 1931 by Viceroy Lord Irwin. In 1972, following the Indo-Pakistani War of 1971, the Amar Jawan Jyoti memorial was added underneath the arch, later integrated with the adjacent National War Memorial.',
    architecture: 'Secular triumphal arch architecture inspired by the Arc de Triomphe in Paris, constructed from pale red and yellow sandstone from Bharatpur. Stands 42 meters high on a low red stone base, aligned symmetrically along the Rajpath / Kartavya Path axis facing Rashtrapati Bhavan.',
    culturalSignificance: 'A solemn national memorial inscribed with the names of over 13,000 Commonwealth servicemen and a prime civic promenade for public gatherings and the annual Republic Day parade.',
    interestingFacts: [
      'The names of 13,313 individual servicemen from the First World War and Afghan campaigns are engraved onto the stone surfaces.',
      'The architectural style intentionally avoids religious symbols to remain inclusive of all soldiers.',
      'The canopy 150 meters east of the arch now houses the monumental statue of Netaji Subhas Chandra Bose.'
    ],
    folklore: [
      'Urban Folklore: Popular Delhi belief frequently associates evening visits to the lawns of India Gate with ice cream vendors and family strolls as an essential Delhi rite of passage, though strictly a modern cultural tradition.'
    ],
    travelTips: [
      'Evenings between 6:00 PM and 9:00 PM are best for viewing the grand architectural illumination and water fountains.',
      'Combine your visit with the adjoining National War Memorial and Kartavya Path promenade.',
      'Security checks and designated parking areas are enforced along the Central Vista.'
    ],
    nearbyPlaces: [
      { name: 'National War Memorial', distance: '100 m', description: 'State-of-the-art national military memorial and tribute walls' },
      { name: 'National Gallery of Modern Art (NGMA)', distance: '400 m', description: 'Premier art museum at Jaipur House' },
      { name: 'Rashtrapati Bhavan', distance: '2.5 km', description: 'Official residence of the President of India' }
    ],
    latitude: 28.6129,
    longitude: 77.2295,
    imageKeywords: ['india gate', 'all india war memorial', 'kartavya path', 'lutyens delhi', 'amar jawan jyoti'],
    sourceNote: 'Ministry of Defence & Central Public Works Department (CPWD) records',
    supportedLanguages: ['en', 'hi']
  },

  // 6. Humayun’s Tomb
  {
    id: 'humayun-tomb',
    name: 'Humayun’s Tomb',
    alternateName: 'Maqbara-e-Humayun',
    category: 'Tomb',
    city: 'Delhi',
    area: 'Nizamuddin East (Nearest Metro: JLN Stadium on Violet Line / Sarai Kale Khan–Nizamuddin on Pink Line)',
    shortDescription: 'The grand garden mausoleum of Mughal Emperor Humayun, celebrated as the first monumental garden tomb on the Indian subcontinent.',
    timings: 'Sunrise to Sunset daily (Approximately 6:00 AM – 6:00 PM; check official ASI portal for exact seasonal hours)',
    tickets: 'Entry ticket required. Nominal fee for Indian citizens; higher tier for foreign tourists. Concessions for BIMSTEC/SAARC nationals. Online booking available.',
    historicalSummary: 'Commissioned in 1565–1572 by Humayun’s chief consort, Empress Bega Begum (Haji Begum), and designed by Persian master architect Mirak Mirza Ghiyas. It introduced Persian Charbagh symmetry to India and served as the direct conceptual and architectural precedent for the Taj Mahal in Agra. Restored extensively through an exemplary public-private partnership with the Aga Khan Trust for Culture.',
    architecture: 'Exemplary early Mughal architecture showcasing red sandstone trimmed with white marble, the first substantial Indian use of the Persian double dome, high arched alcoves (iwans), and a geometrically partitioned 30-acre Charbagh (four-fold garden) layout with water channels.',
    culturalSignificance: 'Inscribed as a UNESCO World Heritage Site in 1993. Contains over 150 royal Mughal dynastic graves, earning it the nickname "Dormitory of the House of Timur".',
    interestingFacts: [
      'It was the first building in India to utilize the double dome engineering technique, creating proportional balance both internally and externally.',
      'Last Mughal Emperor Bahadur Shah Zafar took refuge here with his sons during the siege of Delhi in 1857 before being captured by Captain William Hodson.',
      'The complex also houses Isa Khan’s tomb, Barber’s Tomb, and Afsarwala Tomb.'
    ],
    folklore: [
      'Folklore / Historical Anecdote: British chroniclers noted the tragic final standoff in 1857 within the garden cloisters where the Mughal dynasty formally met its political conclusion.'
    ],
    travelTips: [
      'Morning golden hour and late afternoon light are ideal for photography and tranquil walks.',
      'Visit the nearby underground Humayun’s Tomb World Heritage Site Interpretation Centre Museum.',
      'Keep ticket QR codes accessible on your phone for scanner turnstiles.'
    ],
    nearbyPlaces: [
      { name: 'Sundar Nursery', distance: '300 m', description: 'Restored 16th-century heritage ecological park with Mughal monuments' },
      { name: 'Hazrat Nizamuddin Dargah', distance: '700 m', description: 'Famous Sufi shrine of mystic Nizamuddin Auliya and Amir Khusrau' },
      { name: 'Isa Khan Tomb Complex', distance: '100 m', description: 'Octagonal Suri-dynasty garden tomb pre-dating Humayun’s mausoleum' }
    ],
    latitude: 28.5933,
    longitude: 77.2507,
    imageKeywords: ['humayun tomb', 'charbagh', 'unesco delhi', 'mughal garden tomb', 'nizamuddin heritage'],
    sourceNote: 'Archaeological Survey of India (ASI) & Aga Khan Trust for Culture (AKTC)',
    supportedLanguages: ['en', 'hi']
  },

  // 7. Qutub Minar
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    alternateName: 'Qutb Minar / Vijay Stambh',
    category: 'Monument',
    city: 'Delhi',
    area: 'Mehrauli (Nearest Metro: Qutab Minar on Yellow Line)',
    shortDescription: 'A towering 72.5-metre-high 12th-century minaret of fluted red sandstone and marble, anchoring a historic Islamic complex in Mehrauli.',
    timings: 'Sunrise to Sunset daily (Approximately 7:00 AM – 5:00 PM; complex illuminated in evenings; verify on ASI website)',
    tickets: 'Entry ticket required. Nominal fee for Indian nationals; standard foreign tourist fee. Booking via ASI online portal encouraged.',
    historicalSummary: 'Construction was initiated in 1192 CE by Qutb-ud-din Aibak, founder of the Delhi Sultanate, to mark the establishment of the Mamluk dynasty. His successor Shams-ud-din Iltutmish added three storeys, and later Sultan Firoz Shah Tughlaq restored damaged upper storeys using white marble after lightning strikes in 1368. The complex also features the ancient 4th-century Iron Pillar of Chandragupta II.',
    architecture: 'Indo-Islamic Gothic-scale minaret with five distinct tapering storeys, fluted cylindrical balconies supported by intricate stone corbels and muqarnas, and carved Quranic calligraphy intertwined with Indian floral arabesques.',
    culturalSignificance: 'Inscribed as a UNESCO World Heritage Site in 1993, representing the earliest substantial and surviving architectural milestone of the Delhi Sultanate.',
    interestingFacts: [
      'At 72.5 meters (238 feet), it is one of the tallest brick minarets in the world, with 379 spiral steps inside (steps closed to visitors).',
      'The 1,600-year-old rust-resistant Iron Pillar in the courtyard is renowned globally for its advanced ancient metallurgical composition.',
      'The nearby Alai Minar was commissioned by Alauddin Khalji to stand twice as tall as Qutub Minar, but remained unfinished after his death.'
    ],
    folklore: [
      'Folklore / Popular Belief: A traditional folk belief held that if a visitor could stand with their back against the Iron Pillar and encircle it with their hands behind them, good fortune and wish fulfillment would follow (pillar is now barricaded for preservation).'
    ],
    travelTips: [
      'Combine with exploring the broader Mehrauli Archaeological Park located just across the road.',
      'Early morning hours avoid peak tourist buses and harsh sunlight on the stone facades.',
      'Climbing inside the minaret is permanently restricted for safety and preservation reasons.'
    ],
    nearbyPlaces: [
      { name: 'Iron Pillar of Delhi', distance: '50 m', description: '4th-century metallurgical marvel of the Gupta era' },
      { name: 'Quwwat-ul-Islam Mosque', distance: '40 m', description: 'Earliest surviving Delhi Sultanate mosque in northern India' },
      { name: 'Alai Darwaza & Alai Minar', distance: '80 m', description: 'Intricate red sandstone gateway by Alauddin Khalji' },
      { name: 'Mehrauli Archaeological Park', distance: '600 m', description: 'Over 200 historic ruins including Jamali Kamali and Balban’s tomb' }
    ],
    latitude: 28.5245,
    longitude: 77.1855,
    imageKeywords: ['qutub minar', 'mehrauli', 'iron pillar', 'unesco world heritage delhi', 'delhi sultanate minaret'],
    sourceNote: 'Archaeological Survey of India (ASI) & UNESCO World Heritage Centre',
    supportedLanguages: ['en', 'hi']
  },

  // 8. Lotus Temple
  {
    id: 'lotus-temple',
    name: 'Lotus Temple',
    alternateName: 'Bahá\'í House of Worship',
    category: 'Temple',
    city: 'Delhi',
    area: 'Kalkaji / Nehru Place (Nearest Metro: Kalkaji Mandir on Violet & Magenta Lines)',
    shortDescription: 'A modern architectural landmark shaped like a blooming lotus flower, welcoming people of all faiths, backgrounds, and philosophies for silent meditation and prayer.',
    timings: '9:00 AM – 5:30 PM (Winter) / 9:00 AM – 7:00 PM (Summer). Closed on Mondays. (Check official Bahá\'í community site before visiting)',
    tickets: 'Free entry for all visitors.',
    historicalSummary: 'Designed by Iranian-Canadian architect Fariborz Sahba and dedicated in December 1986. It functions as the continental Bahá\'í House of Worship for the Indian subcontinent, embodying the oneness of God, the oneness of religions, and the oneness of humanity.',
    architecture: 'Expressionist modern architecture composed of 27 free-standing petals made of pure white Greek Penteli marble, arranged in clusters of three to form nine doors opening into a central hall capable of holding 2,500 people. Surrounded by nine tranquil ponds.',
    culturalSignificance: 'One of the most visited buildings in the world, celebrated globally for its universal spiritual inclusivity and sustainable architectural design.',
    interestingFacts: [
      'The temple has won numerous international architectural accolades, including awards from the Institution of Structural Engineers and AIA.',
      'No idols, pictures, or religious ceremonies are held inside; only silent prayer or readings of holy scriptures of any faith without musical instruments.',
      'The white marble cladding was sourced from Mount Pentelikon in Greece, the same source used for the Parthenon in Athens.'
    ],
    folklore: [
      'Architectural Lore: The lotus motif was intentionally selected by the architect because it serves as an enduring symbol of purity, sacredness, and divine beauty across almost all spiritual traditions of India.'
    ],
    travelTips: [
      'Silence must be strictly maintained inside the central prayer hall.',
      'Visitors remove footwear before stepping onto the marble plaza (volunteer-managed shoe tokens provided free).',
      'Photography is permitted in the manicured gardens, but prohibited inside the prayer auditorium.'
    ],
    nearbyPlaces: [
      { name: 'Kalkaji Mandir', distance: '600 m', description: 'Ancient Hindu temple dedicated to Goddess Kali' },
      { name: 'Nehru Place', distance: '1.2 km', description: 'Major commercial IT and electronics market' },
      { name: 'ISKCON Temple Delhi', distance: '1.5 km', description: 'Vaishnavite temple complex with Vedic cultural exhibits' }
    ],
    latitude: 28.5535,
    longitude: 77.2588,
    imageKeywords: ['lotus temple', 'bahai house of worship delhi', 'penteli marble', 'kalkaji', 'modern architecture'],
    sourceNote: 'National Spiritual Assembly of the Bahá\'ís of India',
    supportedLanguages: ['en', 'hi']
  },

  // 9. Purana Qila
  {
    id: 'purana-qila',
    name: 'Purana Qila',
    alternateName: 'Old Fort / Shergarh / Pandava Fort',
    category: 'Fort',
    city: 'Delhi',
    area: 'Mathura Road / Pragati Maidan (Nearest Metro: Supreme Court on Blue Line / Khan Market on Violet Line)',
    shortDescription: 'One of the oldest forts in Delhi, standing atop ancient mound layers historically associated with the legendary city of Indraprastha.',
    timings: 'Sunrise to Sunset daily (Approximately 7:00 AM – 5:00 PM; Evening Sound and Light show timings vary by season)',
    tickets: 'Entry ticket required. Nominal fee for Indian citizens; higher tier for foreign tourists. Bookings via ASI portal.',
    historicalSummary: 'Rebuilt by the Sur dynasty ruler Sher Shah Suri (1540–1545) and completed under Mughal Emperor Humayun following his restoration. Archaeological excavations led by Prof. B. B. Lal and ASI have uncovered stratigraphy spanning Painted Grey Ware (c. 1000 BCE), Maurya, Sunga, Kushana, Gupta, Rajput, and Sultanate periods.',
    architecture: 'Sturdy Indo-Afghan defensive fortress architecture featuring massive circular bastions, imposing red sandstone and quartzite gates (such as the Bada Darwaza and Talaqi Darwaza), the Qila-i-Kuhna Mosque showcasing refined masonry, and the octagonal red sandstone Sher Mandal observatory.',
    culturalSignificance: 'A crucial archaeological site in Delhi yielding continuous human habitation evidence over millennia, traditionally identified with the Mahabharata site of Indraprastha.',
    interestingFacts: [
      'Mughal Emperor Humayun tragically slipped and fell on the stairs of the Sher Mandal library inside this fort in 1556, leading to his demise.',
      'Served as a temporary refugee camp for thousands during the turbulent Partition of India in 1947.',
      'The on-site ASI Archaeological Museum displays antiquities and pottery uncovered directly from excavations on the premises.'
    ],
    folklore: [
      'Folklore & Epic Tradition: Folk memory and local folklore have long associated the elevated mound of Purana Qila with the capital city of the Pandavas, Indraprastha, mentioned in the Mahabharata. Archaeological excavations have identified ancient Iron Age Painted Grey Ware artifacts at the site, though definitive textual linkage to epic characters remains outside archaeological certainty.'
    ],
    travelTips: [
      'Boating facilities are available at the outer lake adjacent to the fort walls.',
      'Visit the on-site ASI site museum to inspect excavated artifacts dating back over 2,500 years.',
      'Evenings feature an acclaimed multimedia Sound & Light show depicting Delhi’s 7 historic cities.'
    ],
    nearbyPlaces: [
      { name: 'National Zoological Park (Delhi Zoo)', distance: '400 m', description: 'Sprawling ecological zoo bordering the fort walls' },
      { name: 'National Crafts Museum', distance: '600 m', description: 'Rural village craft museum and textile galleries' },
      { name: 'National Science Centre', distance: '800 m', description: 'Interactive science museum and planetarium' }
    ],
    latitude: 28.6096,
    longitude: 77.2437,
    imageKeywords: ['purana qila', 'old fort delhi', 'sher shah suri', 'qila i kuhna', 'indraprastha archaeology'],
    sourceNote: 'Archaeological Survey of India (ASI) excavation reports & monographs',
    supportedLanguages: ['en', 'hi']
  },

  // 10. Agrasen ki Baoli
  {
    id: 'agrasen-ki-baoli',
    name: 'Agrasen ki Baoli',
    alternateName: 'Ugrasen ki Baoli',
    category: 'Stepwell',
    city: 'Delhi',
    area: 'Hailey Road / Connaught Place (Nearest Metro: Janpath on Violet Line / Barakhamba Road on Blue Line)',
    shortDescription: 'A protected 14th-century stepped water reservoir (baoli) descending 108 steps across three levels in the heart of New Delhi.',
    timings: '9:00 AM – 5:30 PM daily (Check official ASI notices for special maintenance closures)',
    tickets: 'Free entry (Protected monument under the Archaeological Survey of India).',
    historicalSummary: 'Believed to have been originally commissioned by the legendary King Agrasen of the Agroha kingdom and reconstructed around the 14th-century Tughlaq or Lodi period of the Delhi Sultanate. It functioned as both a water preservation reservoir and a cool community retreat for travelers during scorching north Indian summers.',
    architecture: 'Traditional stepped well architecture measuring 60 meters long and 15 meters wide. Built of rubble masonry dressed with Delhi quartzite and sandstone, featuring three tiers of arched niches lining both flank walls leading down to the well shaft.',
    culturalSignificance: 'A designated Monument of National Importance under the Ancient Monuments and Archaeological Sites and Remains (AMASR) Act, exemplifying medieval traditional water harvesting systems.',
    interestingFacts: [
      'Features 108 steep stone steps descending toward the historic subterranean water table.',
      'A small medieval mosque with whale-shaped arches sits at the western end of the monument.',
      'Has been featured prominently in several major contemporary Indian and international films.'
    ],
    folklore: [
      'Urban Folklore & Ghost Legends: Numerous modern sensational ghost stories and urban myths claiming the stepwell is haunted by "black mystical waters" circulate on social media. ASI and historical scholars dismiss these claims as entirely fictional modern folklore.'
    ],
    travelTips: [
      'Tucked in an alleyway near Hailey Road just a 10-minute walk from Connaught Place / Kasturba Gandhi Marg.',
      'Watch your step carefully when descending the stone steps, as surfaces can be uneven.',
      'Tripod photography and professional filming require prior ASI permission.'
    ],
    nearbyPlaces: [
      { name: 'Janpath Market', distance: '800 m', description: 'Popular street market for handicrafts, brassware, and clothing' },
      { name: 'Connaught Place (Inner Circle)', distance: '900 m', description: 'Historic colonnaded shopping and cultural hub' },
      { name: 'National Museum', distance: '1.8 km', description: 'Premier repository of Indian art, Indus Valley antiquities, and relics' }
    ],
    latitude: 28.6258,
    longitude: 77.2250,
    imageKeywords: ['agrasen ki baoli', 'stepwell delhi', 'hailey road baoli', 'tughlaq architecture', 'water heritage'],
    sourceNote: 'Archaeological Survey of India (ASI) Protected Monument Records',
    supportedLanguages: ['en', 'hi']
  }
];

/**
 * ============================================================================
 * DATASET HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Retrieve a single heritage site record by its unique ID.
 * @param id - The unique site identifier (e.g., 'red-fort', 'lotus-temple')
 * @returns The matching HeritageSiteRecord or undefined if not found
 */
export function getSiteById(id: string): HeritageSiteRecord | undefined {
  if (!id) return undefined;
  const normalizedId = id.trim().toLowerCase();
  return DELHI_HERITAGE_RECORDS.find((site) => site.id.toLowerCase() === normalizedId);
}

/**
 * Search heritage sites across name, alternateName, category, area, keywords, and description.
 * @param query - The search query term
 * @returns Array of matching HeritageSiteRecord objects
 */
export function searchSites(query: string): HeritageSiteRecord[] {
  if (!query || !query.trim()) {
    return [...DELHI_HERITAGE_RECORDS];
  }

  const cleanQuery = query.trim().toLowerCase();

  return DELHI_HERITAGE_RECORDS.filter((site) => {
    const matchName = site.name.toLowerCase().includes(cleanQuery);
    const matchAlt = site.alternateName?.toLowerCase().includes(cleanQuery) ?? false;
    const matchCategory = site.category.toLowerCase().includes(cleanQuery);
    const matchArea = site.area.toLowerCase().includes(cleanQuery);
    const matchCity = site.city.toLowerCase().includes(cleanQuery);
    const matchDesc = site.shortDescription.toLowerCase().includes(cleanQuery);
    const matchArchitecture = site.architecture.toLowerCase().includes(cleanQuery);
    const matchKeywords = site.imageKeywords.some((kw) => kw.toLowerCase().includes(cleanQuery));

    return (
      matchName ||
      matchAlt ||
      matchCategory ||
      matchArea ||
      matchCity ||
      matchDesc ||
      matchArchitecture ||
      matchKeywords
    );
  });
}

/**
 * Retrieve a single heritage site record by matching its exact or partial name.
 * @param name - The name or alternate name of the monument
 * @returns The matching HeritageSiteRecord or undefined if not found
 */
export function getSiteByName(name: string): HeritageSiteRecord | undefined {
  if (!name) return undefined;
  const normalizedName = name.trim().toLowerCase();

  // Try exact match first
  const exact = DELHI_HERITAGE_RECORDS.find(
    (site) =>
      site.name.toLowerCase() === normalizedName ||
      site.alternateName?.toLowerCase() === normalizedName
  );
  if (exact) return exact;

  // Fallback to substring matching
  return DELHI_HERITAGE_RECORDS.find(
    (site) =>
      site.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(site.name.toLowerCase()) ||
      (site.alternateName && site.alternateName.toLowerCase().includes(normalizedName))
  );
}
