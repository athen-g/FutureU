import { decodeSeatBreakdown } from './seatMatrixColumns'
import { getCityForCollege, getUniqueCities } from './cityMapping'

// ── 2024-25 ──────────────────────────────────────────────────────────────────
import seatMatrix2024  from '../data/2024-25/seat_matrix.json'
import cap1Mh2024      from '../data/2024-25/cap1/mh_cutoff.json'
import cap1Ai2024      from '../data/2024-25/cap1/ai_cutoff.json'
import cap2Mh2024      from '../data/2024-25/cap2/mh_cutoff.json'
import cap2Ai2024      from '../data/2024-25/cap2/ai_cutoff.json'
import cap3Mh2024      from '../data/2024-25/cap3/mh_cutoff.json'
import cap3Ai2024      from '../data/2024-25/cap3/ai_cutoff.json'
import cap3Diploma2024 from '../data/2024-25/cap3/diploma_cutoff.json'

// ── 2023-24 ──────────────────────────────────────────────────────────────────
import seatMatrix2023  from '../data/2023-24/seat_matrix.json'
import cap1Mh2023      from '../data/2023-24/cap1/mh_cutoff.json'
import cap1Ai2023      from '../data/2023-24/cap1/ai_cutoff.json'
import cap2Mh2023      from '../data/2023-24/cap2/mh_cutoff.json'
import cap2Ai2023      from '../data/2023-24/cap2/ai_cutoff.json'
import cap3Mh2023      from '../data/2023-24/cap3/mh_cutoff.json'
import cap3Ai2023      from '../data/2023-24/cap3/ai_cutoff.json'

// ── 2022-23 ──────────────────────────────────────────────────────────────────
import seatMatrix2022  from '../data/2022-23/seat_matrix.json'
import cap1Mh2022      from '../data/2022-23/cap1/mh_cutoff.json'
import cap1Ai2022      from '../data/2022-23/cap1/ai_cutoff.json'
import cap2Mh2022      from '../data/2022-23/cap2/mh_cutoff.json'
import cap2Ai2022      from '../data/2022-23/cap2/ai_cutoff.json'
import cap3Mh2022      from '../data/2022-23/cap3/mh_cutoff.json'
import cap3Ai2022      from '../data/2022-23/cap3/ai_cutoff.json'

// ── Code migration map ──────────────────────────────────────────────────────
// When DTE changes a college's code across years, map old → new so data merges
// into a single entry instead of creating duplicates.
const CODE_MIGRATION_MAP = {
  '06006': '16006', // COEP Technological University (code changed 2023→2024)
  '6006': '16006',

  // Dr. Babasaheb Ambedkar Technological University, Lonere
  '30331': '03033',
  '30332': '03033',
  '30333': '03033',
  '30335': '03033',
  '30336': '03033',

  // Usha Mittal Institute of Technology SNDT Women's University, Mumbai
  '30352': '03035',
  '30353': '03035',
  '30359': '03035',

  // Cummins College of Engineering For Women, Nagpur
  '43042': '04304',
  '43043': '04304',
  '43046': '04304',

  // Pimpri Chinchwad College of Engineering, Pune
  '61752': '06175',

  // MKSSS's Cummins College of Engineering for Women, Karvenagar, Pune
  '62762': '06276',
  '62763': '06276',
  '62764': '06276',
  '62766': '06276',

  // Bharati Vidyapeeth's College of Engineering for Women, Pune
  '62852': '06285',
  '62853': '06285',

  // Shree Siddheshwar Women's College Of Engineering, Solapur
  '69382': '06938',
  '69383': '06938',
  '69388': '06938',
}

function migrateCode(code) {
  return CODE_MIGRATION_MAP[code] || code
}

const BRANCH_MIGRATION_MAP = {
  // COEP (Old code 06006 -> New code 16006)
  '0600619110': '1600619110', // Civil Engineering
  '0600624510': '1600624210', // Computer Engineering (Old 24510 -> New 24210 CSE)
  '0600626610': '1600626610', // Robotics & AI
  '0600629310': '1600629310', // Electrical Engineering
  '0600637210': '1600637210', // EnTC Engineering
  '0600646410': '1600646410', // Instrumentation & Control
  '0600661210': '1600661210', // Mechanical Engineering
  '0600662710': '1600662710', // Manufacturing Science
  '0600669410': '1600669410', // Metallurgy Engineering

  // DBATU Lonere (Old choice codes ending in 13K / 90L mapped to standard 10)
  '0303319113K': '0303319110',
  '0303324513K': '0303324510',
  '0303324613K': '0303324610',
  '0303329313K': '0303329310',
  '0303337213K': '0303337210',
  '0303337290L': '0303337210',
  '0303350713K': '0303350710',
  '0303352713K': '0303352710',
  '0303361213K': '0303361210',

  // PCCOE Pune (Old choice codes ending in 90L mapped to standard 10)
  '0617524590L': '0617524510',
}

function migrateBranchCode(bcode) {
  if (!bcode) return bcode
  let cleanCode = bcode
  const baseLength = bcode.replace(/[A-Za-z]/g, '').length
  if (baseLength === 9) {
    cleanCode = '0' + bcode
  }
  return BRANCH_MIGRATION_MAP[cleanCode] || cleanCode
}function cleanCollegeName(name) {
  if (!name) return name
  return name.replace(/\s*CAP\s*Seats\s*:\s*\d+/i, '').trim()
}

// ─────────────────────────────────────────────────────────────────────────────

function emptyYearCutoffs() {
  return {
    cap1: { mh: {}, ai: {} },
    cap2: { mh: {}, ai: {}, diploma: {} },
    cap3: { mh: {}, ai: {}, diploma: {} }
  }
}

function buildDataIndex() {
  const index = {}

  // Seed from 2024-25 seat matrix (most complete)
  for (const college of (seatMatrix2024.colleges || [])) {
    const cc = migrateCode(college.college_code)
    if (!index[cc]) {
      index[cc] = {
        college_code: cc, college_name: cleanCollegeName(college.college_name),
        status: college.status || 'Unknown', is_autonomous: false, branches: {}
      }
    }
    for (const [bk, branch] of Object.entries(college.branches || {})) {
      const mbk = migrateBranchCode(bk)
      const rawArr = branch.seat_breakdown?.['State Level']
      index[cc].branches[mbk] = {
        branch_code: mbk, branch_name: branch.branch_name, college_code: cc,
        total_seats:     branch.total_seats    || 0,
        ms_seats:        branch.ms_seats       || 0,
        ai_seats:        branch.ai_seats       || 0,
        minority_seats:  branch.minority_seats || 0,
        ews_seats:       branch.ews_seats      || 0,
        tfws_seats:      branch.tfws_seats     || 0,
        orphan_seats:    branch.orphan_seats   || 0,
        pwd_seats:  branch.seat_breakdown?.['PWD']?.[0] ?? 0,
        def_seats:  branch.seat_breakdown?.['DEF']?.[0] ?? 0,
        decoded_seats: decodeSeatBreakdown(rawArr),
        status: 'Unknown', home_university: 'Unknown', is_autonomous: false,
        cutoffs: {}
      }
    }
  }

  // Seed from 2023-24 seat matrix (for colleges missing from 2024-25)
  for (const college of (seatMatrix2023.colleges || [])) {
    const cc = migrateCode(college.college_code)
    if (!index[cc]) {
      index[cc] = {
        college_code: cc, college_name: cleanCollegeName(college.college_name),
        status: college.status || 'Unknown', is_autonomous: false, branches: {}
      }
    }
    for (const [bk, branch] of Object.entries(college.branches || {})) {
      const mbk = migrateBranchCode(bk)
      if (index[cc].branches[mbk]) continue   // 2024-25 takes priority
      const rawArr = branch.seat_breakdown?.['State Level']
      index[cc].branches[mbk] = {
        branch_code: mbk, branch_name: branch.branch_name, college_code: cc,
        total_seats: branch.total_seats || 0, ms_seats: branch.ms_seats || 0,
        ai_seats: branch.ai_seats || 0, minority_seats: branch.minority_seats || 0,
        ews_seats: branch.ews_seats || 0, tfws_seats: branch.tfws_seats || 0,
        orphan_seats: branch.orphan_seats || 0,
        pwd_seats: branch.seat_breakdown?.['PWD']?.[0] ?? 0,
        def_seats: branch.seat_breakdown?.['DEF']?.[0] ?? 0,
        decoded_seats: decodeSeatBreakdown(rawArr),
        status: 'Unknown', home_university: 'Unknown', is_autonomous: false,
        cutoffs: {}
      }
    }
  }

  // Seed from 2022-23 seat matrix (for colleges missing from both 2024-25 and 2023-24)
  for (const college of (seatMatrix2022.colleges || [])) {
    const cc = migrateCode(college.college_code)
    if (!index[cc]) {
      index[cc] = {
        college_code: cc, college_name: cleanCollegeName(college.college_name),
        status: college.status || 'Unknown', is_autonomous: false, branches: {}
      }
    }
    for (const [bk, branch] of Object.entries(college.branches || {})) {
      const mbk = migrateBranchCode(bk)
      if (index[cc].branches[mbk]) continue   // 2024-25 or 2023-24 takes priority
      const rawArr = branch.seat_breakdown?.['State Level']
      index[cc].branches[mbk] = {
        branch_code: mbk, branch_name: branch.branch_name, college_code: cc,
        total_seats: branch.total_seats || 0, ms_seats: branch.ms_seats || 0,
        ai_seats: branch.ai_seats || 0, minority_seats: branch.minority_seats || 0,
        ews_seats: branch.ews_seats || 0, tfws_seats: branch.tfws_seats || 0,
        orphan_seats: branch.orphan_seats || 0,
        pwd_seats: branch.seat_breakdown?.['PWD']?.[0] ?? 0,
        def_seats: branch.seat_breakdown?.['DEF']?.[0] ?? 0,
        decoded_seats: decodeSeatBreakdown(rawArr),
        status: 'Unknown', home_university: 'Unknown', is_autonomous: false,
        cutoffs: {}
      }
    }
  }

  // Merge cutoffs helper
  function merge(cutoffData, year, cap, type) {
    for (const college of (cutoffData.colleges || [])) {
      const cc = migrateCode(college.college_code)
      if (!index[cc]) {
        index[cc] = {
          college_code: cc, college_name: cleanCollegeName(college.college_name),
          status: 'Unknown', is_autonomous: false, branches: {}
        }
      }
      for (const [bk, branch] of Object.entries(college.branches || {})) {
        const mbk = migrateBranchCode(bk)
        if (!index[cc].branches[mbk]) {
          index[cc].branches[mbk] = {
            branch_code: mbk, branch_name: branch.branch_name, college_code: cc,
            total_seats: 0, ms_seats: 0, ai_seats: 0, minority_seats: 0,
            ews_seats: 0, tfws_seats: 0, orphan_seats: 0, pwd_seats: 0, def_seats: 0,
            decoded_seats: {}, status: 'Unknown', home_university: 'Unknown',
            is_autonomous: false, cutoffs: {}
          }
        }
        const b = index[cc].branches[mbk]
        if (branch.status && branch.status !== 'Unknown') {
          b.status = branch.status
          index[cc].status = branch.status
        }
        if (branch.home_university && branch.home_university !== 'Unknown') {
          b.home_university = branch.home_university
        }
        if (branch.is_autonomous) {
          b.is_autonomous = true
          index[cc].is_autonomous = true
        }
        if (!b.cutoffs[year])     b.cutoffs[year]         = emptyYearCutoffs()
        if (!b.cutoffs[year][cap]) b.cutoffs[year][cap]   = { mh:{}, ai:{}, diploma:{} }
        b.cutoffs[year][cap][type] = branch.cutoffs || {}
      }
    }
  }

  // 2022-23
  merge(cap1Mh2022, '2022-23', 'cap1', 'mh')
  merge(cap1Ai2022, '2022-23', 'cap1', 'ai')
  merge(cap2Mh2022, '2022-23', 'cap2', 'mh')
  merge(cap2Ai2022, '2022-23', 'cap2', 'ai')
  merge(cap3Mh2022, '2022-23', 'cap3', 'mh')
  merge(cap3Ai2022, '2022-23', 'cap3', 'ai')

  // 2023-24
  merge(cap1Mh2023, '2023-24', 'cap1', 'mh')
  merge(cap1Ai2023, '2023-24', 'cap1', 'ai')
  merge(cap2Mh2023, '2023-24', 'cap2', 'mh')
  merge(cap2Ai2023, '2023-24', 'cap2', 'ai')
  merge(cap3Mh2023, '2023-24', 'cap3', 'mh')
  merge(cap3Ai2023, '2023-24', 'cap3', 'ai')

  // 2024-25
  merge(cap1Mh2024, '2024-25', 'cap1', 'mh')
  merge(cap1Ai2024, '2024-25', 'cap1', 'ai')
  merge(cap2Mh2024, '2024-25', 'cap2', 'mh')
  merge(cap2Ai2024, '2024-25', 'cap2', 'ai')
  merge(cap3Mh2024, '2024-25', 'cap3', 'mh')
  merge(cap3Ai2024, '2024-25', 'cap3', 'ai')
  merge(cap3Diploma2024, '2024-25', 'cap3', 'diploma')

  return index
}

let _idx = null
export function getDataIndex() {
  if (!_idx) _idx = buildDataIndex()
  return _idx
}

export function getAllColleges()        { return Object.values(getDataIndex()) }
export function getCollege(code)       { return getDataIndex()[migrateCode(code)] || null }

export function getCityFromCollegeName(name, collegeCode) {
  return getCityForCollege(collegeCode || '', name)
}

export function normalizeStatus(status) {
  if (!status) return 'Private'
  const s = status.toLowerCase()
  if (s.includes('government') && s.includes('autonomous')) return 'Government Autonomous'
  if (s.includes('government'))     return 'Government'
  if (s.includes('university managed') || s.includes('university department')) return 'University'
  if (s.includes('deemed'))         return 'Deemed'
  if (s.includes('aided') && !s.includes('un-aided')) return 'Aided'
  if (s.includes('un-aided') && s.includes('autonomous')) return 'Private Autonomous'
  if (s.includes('un-aided') || s.includes('unaided')) return 'Private'
  return 'Private'
}

export function getAllBranches() {
  const set = new Set()
  for (const c of Object.values(getDataIndex()))
    for (const b of Object.values(c.branches)) set.add(b.branch_name)
  return [...set].sort()
}

export function getAllCities() {
  return getUniqueCities(getAllColleges())
}
