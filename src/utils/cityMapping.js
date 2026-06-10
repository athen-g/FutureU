/**
 * City normalization for Maharashtra engineering colleges.
 *
 * The raw college names often have garbled last-segment "cities" —
 * trailing periods, pin codes, taluka refs, institute names, etc.
 * This module provides a canonical city for every college code, and
 * a normalized unique list of cities.
 */

// ── Hand-curated overrides for every college with a bad/missing city ────────
// Format: college_code → canonical city name
// Only colleges whose regex-extracted city is wrong/missing need an entry here.
const COLLEGE_CITY_OVERRIDES = {
  // Migrated / Code Changed Colleges
  '03033': 'Raigad',     // DBATU Lonere (New)
  '30331': 'Raigad',     // DBATU Lonere (Old 1)
  '30332': 'Raigad',     // DBATU Lonere (Old 2)
  '30333': 'Raigad',     // DBATU Lonere (Old 3)
  '30335': 'Raigad',     // DBATU Lonere (Old 4)
  '30336': 'Raigad',     // DBATU Lonere (Old 5)
  '03035': 'Mumbai',     // Usha Mittal SNDT (New)
  '30352': 'Mumbai',     // Usha Mittal SNDT (Old 1)
  '30353': 'Mumbai',     // Usha Mittal SNDT (Old 2)
  '30359': 'Mumbai',     // Usha Mittal SNDT (Old 3)
  '04304': 'Nagpur',     // Cummins Nagpur (New)
  '43042': 'Nagpur',     // Cummins Nagpur (Old 1)
  '43043': 'Nagpur',     // Cummins Nagpur (Old 2)
  '43046': 'Nagpur',     // Cummins Nagpur (Old 3)
  '06175': 'Pune',       // PCCOE Pune (New)
  '61752': 'Pune',       // PCCOE Pune (Old)
  '06276': 'Pune',       // Cummins Pune (New)
  '62762': 'Pune',       // Cummins Pune (Old 1)
  '62763': 'Pune',       // Cummins Pune (Old 2)
  '62764': 'Pune',       // Cummins Pune (Old 3)
  '62766': 'Pune',       // Cummins Pune (Old 4)
  '06285': 'Pune',       // Bharati Vidyapeeth Women Pune (New)
  '62852': 'Pune',       // Bharati Vidyapeeth Women Pune (Old 1)
  '62853': 'Pune',       // Bharati Vidyapeeth Women Pune (Old 2)
  '06938': 'Solapur',    // Shree Siddheshwar Women Solapur (New)
  '69382': 'Solapur',    // Shree Siddheshwar Women Solapur (Old 1)
  '69383': 'Solapur',    // Shree Siddheshwar Women Solapur (Old 2)
  '69388': 'Solapur',    // Shree Siddheshwar Women Solapur (Old 3)
  '16006': 'Pune',       // COEP (New)
  '06006': 'Pune',       // COEP (Old)

  // Missing city (no comma in name)
  '06271': 'Pune',       // Pune Institute of Computer Technology
  '06315': 'Pune',       // Sanjeevan Group of Institutions (Kopargaon area but often listed Pune)
  '06326': 'Satara',     // Karmayogi Institute of Technology, Satara
  '06622': 'Pune',       // ISBM College Of Engineering Pune
  '06632': 'Pune',       // Navsahyadri Education Society's Group of Institutions (Narayangaon near Pune)
  '06635': 'Pune',       // Samarth College of Engineering and Management (Belhe, Pune dist.)
  '06766': 'Satara',     // Phaltan Education Society's College of Engineering, Phaltan Dist-Satara
  '06811': 'Kolhapur',   // Sanjay Ghodawat Institute (Atigre, Kolhapur)

  // Trailing periods
  '06545': 'Satara',     // Satara.
  '06754': 'Pune',       // Pune.
  '06755': 'Pune',       // Pune.
  '06757': 'Satara',     // Satara.
  '06758': 'Pune',       // Pune. (Rajuri)
  '06767': 'Pune',       // Pune. (Kamshet)
  '06768': 'Pune',       // Pune.
  '06769': 'Pune',       // Pune. (Warje)
  '06770': 'Pune',       // Pune. (Kusgaon)
  '06780': 'Kolhapur',   // Kolhapur.
  '06762': 'Sangli',     // Sangli.

  // Parenthesized / ALL-CAPS city names
  '05017': 'Nashik',     // (Nashik)
  '06402': 'Kolhapur',   // KOLHAPUR
  '06640': 'Solapur',    // solapur (lowercase)

  // Pin codes as city
  '01102': 'Yavatmal',   // 444302

  // Institute names as city
  '03117': 'Kolhapur',   // Ashokrao Mane Group of Institutions → Kolhapur
  '03211': 'Osmanabad',  // Atma Malik Institute Of Technology & Research → Osmanabad

  // Taluka/District references
  '02132': 'Nashik',     // Agaskhind Tal. Sinnar → Nashik dist
  '05081': 'Nashik',     // Adgaon Nashik
  '06307': 'Pune',       // Tal. Haveli → Pune
  '06319': 'Pune',       // Tal. Indapur → Pune dist
  '06308': 'Solapur',    // Solapur(North) → Solapur
  '06313': 'Sangli',     // Kille Macchindragad Tal. Walva District- Sangali
  '06628': 'Pune',       // Swami - Chincholi Tal. Daund Dist. Pune
  '06643': 'Solapur',    // Korti Tal. Pandharpur Dist Solapur
  '06714': 'Kolhapur',   // Dist Kolhapur
  '05078': 'Nagpur',     // Tal. Hingna Hingna Nagpur → Nagpur
  '02187': 'Thane',      // Tal-Ambernath. → Thane dist
  '02205': 'Thane',      // Tal. Shahapur → Thane dist
  '06284': 'Baramati',   // Baramati Dist.Pune → Baramati
  '02168': 'Palghar',    // Kaman Dist. Palghar
  '02161': 'Thane',      // Dist Thane
  '02152': 'Thane',      // Dist.Thane
  '05020': 'Dhule',      // Tal Dist Dhule
  '04127': 'Wardha',     // Dist Wardha
  '03106': 'Nandurbar',  // Dist. Nandurbar
  '03170': 'Nanded',     // District Nanded
  '02131': 'Raigad',     // Tal. Khalapur. Dist. Raigad
  '02173': 'Raigad',     // Khalapur Dist Raigad
  '05079': 'Nashik',     // Chincholi Dist. Nashik
  '06284': 'Baramati',   // Baramati Dist.Pune
  '05082': 'Ahmednagar', // Chas Dist. Ahmednagar
  '06310': 'Pune',       // Talegaon station, Pune → Pune
  '02143': 'Thane',      // Bapsai Tal.Kalyan → Thane dist
  '05083': 'Ahmednagar', // Dist.Ahmednagar
  '02162': 'Pune',       // Dist-Pune
  '06298': 'Pune',       // Narhe, Pune → Pune
  '05052': 'Nashik',     // Bota Sangamner → actually near Nashik/Ahmednagar
  '06275': 'Baramati',   // Malegaon-Baramati → Baramati
  '06311': 'Pune',       // Wagholi → Pune
  '06320': 'Pune',       // Pisoli → Pune
  '06625': 'Pune',       // Sasewadi → Pune dist
  '06318': 'Pune',       // Wadwadi → near Pune
  '06322': 'Pune',       // Dumbarwadi → near Pune
  '06795': 'Baramati',   // Someshwar Nagar → near Baramati

  // Dondaicha with trailing period
  '05019': 'Nandurbar',  // Dondaicha. → Nandurbar dist

  // Ichalkaranji with trailing period
  '06258': 'Kolhapur',   // Ichalkaranji. → Kolhapur dist

  // Ahmednagar with trailing period
  '05053': 'Ahmednagar', // Ahmednagar.

  // Nashik variants
  '05009': 'Nashik',     // Nashik.
  '05036': 'Nashik',     // NASHIK

  // Nanded with trailing period
  '03108': 'Nanded',     // Nanded.

  // Latur with trailing period
  '03177': 'Latur',      // Latur.

  // Ratnagiri with trailing period
  '06242': 'Ratnagiri',  // Ratnagiri.

  // Raigad with trailing period
  '02197': 'Raigad',     // Raigad.

  // Shegaon with trailing period
  '01104': 'Shegaon',    // Shegaon.

  // Sindhudurg with trailing period
  '06240': 'Sindhudurg', // Sindhudurg.

  // Malegaon with trailing period
  '05072': 'Nashik',     // Malegaon. → Nashik dist

  // Navi Mumbai
  '02134': 'Navi Mumbai', // Kharghar Navi Mumbai
  '02150': 'Navi Mumbai', // New Panvel → Navi Mumbai

  // Mumbai / Thane region cleanup
  '02199': 'Thane',      // Thane (E) → Thane
  '02209': 'Thane',      // ULHASNAGAR → Thane dist
  '02135': 'Mumbai',     // Bhayinder (E) Western Rly → Mumbai
  '02147': 'Mumbai',     // Andheri → Mumbai

  // Post/village names that are actually part of larger cities
  '05069': 'Nashik',     // Malwadi-Bota → near Nashik/Sangamner area
  '06609': 'Junnar',     // Kuran → near Junnar, Pune dist
  '06649': 'Pune',       // Narhe (Ambegaon) → Pune
  '06759': 'Pune',       // Lonikand → Pune
  '06771': 'Pune',       // Khopi → Pune
  '06772': 'Pune',       // NBN Sinhgad Campus Pune → Pune
  '06834': 'Pune',       // Talegaon → Pune dist
  '06822': 'Pune',       // Ravet → Pune
  '06991': 'Pune',       // Varale, Talegaon → Pune
  '06419': 'Pune',       // Talegaon Dabhade → Pune
  '05087': 'Pune',       // Post Belhe Tal. Junnar Dist. Pune
  '06815': 'Lonavala',   // Lonavala → keep as-is (distinct city)
  '06324': 'Pune',       // Bhor → Pune dist
  '06444': 'Solapur',    // Paniv → Solapur dist
  '05070': 'Ahmednagar', // Kopargaon → Ahmednagar dist
  '05052': 'Sangamner',  // Bota Sangamner → Sangamner
  '02125': 'Navi Mumbai', // Panvel → Navi Mumbai
  '05069': 'Sangamner',  // Malwadi-Bota → Sangamner area
  '06275': 'Baramati',   // Malegaon-Baramati
  '05054': 'Ahmednagar', // Shevgaon → Ahmednagar dist
  '06317': 'Kolhapur',   // Yadrav(Ichalkaranji) → Kolhapur
  '02156': 'Mumbai',     // Badlapur(W) → Thane/Mumbai region
  '04135': 'Nagpur',     // Mouza Bamni → Nagpur
  '01120': 'Nagpur',     // Sindhi(Meghe) → Nagpur
  '02203': 'Palghar',    // Shirgaon → Palghar
  '06644': 'Sangli',     // Miraj → Sangli dist
  '06799': 'Sangli',     // Patgaon, Miraj → Sangli
  '04124': 'Nagpur',     // Babulgaon → Nagpur
  '16121': 'Sangli',     // Pal → Sangli dist
  '16126': 'Kolhapur',   // Yelur → Kolhapur dist
  '06781': 'Solapur',    // Barshi → Solapur dist
  '06901': 'Solapur',    // Barshi → Solapur dist
  '06782': 'Solapur',    // Akluj → Solapur dist
  '05076': 'Nandurbar',  // Nadurbar → Nandurbar (typo)
  '05055': 'Nashik',     // Nile → near Nashik
  '06756': 'Solapur',    // Sangola → Solapur dist
  '05051': 'Ahmednagar', // Ohar → Ahmednagar dist
  '02165': 'Palghar',    // Boisar → Palghar dist
  '02188': 'Mumbai',     // Vasai → Mumbai/Palghar region
  '02190': 'Palghar',    // Virar → Palghar
  '01116': 'Amravati',   // Nepti → Amravati dist
  '06303': 'Satara',     // Karad → Satara dist
  '06466': 'Satara',     // Karad → Satara dist
  '06277': 'Kolhapur',   // Jaysingpur → Kolhapur dist
  '06258': 'Kolhapur',   // Ichalkaranji → Kolhapur
  '06268': 'Kolhapur',   // Warananagar → Kolhapur dist
  '06304': 'Sangli',     // Vita → Sangli dist
  '06269': 'Sangli',     // Budhgaon, Sangli
  '06283': 'Sangli',     // Ashta, Sangli
  '03176': 'Latur',      // Avasari Khurd → actually Latur area
  '05088': 'Pune',       // Avasari Khurd → Pune dist (Junnar)
  '06265': 'Kolhapur',   // Panhala → Kolhapur
  '06803': 'Kolhapur',   // Gadhinglaj → Kolhapur dist
  '06878': 'Kolhapur',   // Gadhinglaj → Kolhapur
  '06240': 'Sindhudurg', // Kankavli → Sindhudurg
}

// ── Normalize a raw city string ─────────────────────────────────────────────
function normalizeCity(raw) {
  if (!raw) return ''
  let city = raw.trim()

  // Remove trailing periods
  city = city.replace(/\.+$/, '')

  // Remove surrounding parentheses
  city = city.replace(/^\((.+)\)$/, '$1')

  // Title-case normalisation
  city = city
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())

  // Known aliases / fix-ups
  const ALIASES = {
    'Ulhasnagar': 'Thane',
    'New Panvel': 'Navi Mumbai',
    'Panvel': 'Navi Mumbai',
    'Kharghar Navi Mumbai': 'Navi Mumbai',
    'Thane (E)': 'Thane',
    'Badlapur(W)': 'Thane',
    'Bhayinder (E) Western Rly': 'Mumbai',
    'Andheri': 'Mumbai',
    'Solapur(North)': 'Solapur',
    'Narhe (Ambegaon)': 'Pune',
    'Nadurbar': 'Nandurbar',
  }
  if (ALIASES[city]) city = ALIASES[city]

  // Skip if it looks like a pin code
  if (/^\d{6}$/.test(city)) return ''

  // Skip if starts with Tal. / Dist. / Post
  if (/^(Tal|Dist|Post)\b/i.test(city)) return ''

  return city
}

// ── Extract city from college name (regex fallback) ─────────────────────────
function extractCityFromName(name) {
  if (!name) return ''
  const m = name.match(/,\s*([^,]+)$/)
  return m ? normalizeCity(m[1]) : ''
}

// ── Main API: Get canonical city for a college ──────────────────────────────
export function getCityForCollege(collegeCode, collegeName) {
  if (COLLEGE_CITY_OVERRIDES[collegeCode]) {
    return COLLEGE_CITY_OVERRIDES[collegeCode]
  }
  return extractCityFromName(collegeName)
}

// ── Get deduplicated, sorted list of all unique cities ──────────────────────
export function getUniqueCities(colleges) {
  const set = new Set()
  for (const c of colleges) {
    const city = getCityForCollege(c.college_code, c.college_name)
    if (city) set.add(city)
  }
  return [...set].sort()
}
