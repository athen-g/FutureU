import { getRelevantCategoryCodes } from './categoryMapping'
import { predictCutoff, classifyEligibility, getBestCategoryData, calculateChance, convertPercentileToRank, convertRankToPercentile } from './eligibility'
import { getAllColleges, getCityFromCollegeName, normalizeStatus } from './dataLoader'

/**
 * Build ranked preference list sorted highest predicted cutoff rank → lowest (hardest first: lowest rank numbers first).
 * This is the order students should fill their CAP form.
 */
export function buildRankedList(filters) {
  const {
    percentile,
    rank,
    customInflationRate,
    category = 'OPEN',
    gender = 'Male',
    domicile = 'State Level',
    tfws = false,
    ews = false,
    pwd = false,
    preferredBranches = [],
    preferredCities = [],
    collegeTypes = [],
    autonomy = 'all',
    searchQuery = '',
    type = 'mh',
  } = filters

  const categoryCodes = type === 'ai'
    ? ['AI_AI_to_AI']
    : getRelevantCategoryCodes({ category, gender, domicile, tfws, ews, pwd })
  const allColleges = getAllColleges()
  const rows = []

  // Resolve student rank and percentile
  let studentRank = null
  let studentPct = null

  if (rank != null && rank !== '') {
    studentRank = parseInt(rank)
    studentPct = convertRankToPercentile(studentRank, '2026-27', customInflationRate)
  } else if (percentile != null && percentile !== '') {
    studentPct = parseFloat(percentile)
    studentRank = convertPercentileToRank(studentPct, '2026-27', customInflationRate)
  }

  for (const college of allColleges) {
    const city = getCityFromCollegeName(college.college_name, college.college_code)
    const normStatus = normalizeStatus(college.status)

    if (preferredCities.length > 0 &&
      !preferredCities.some(c => city.toLowerCase().includes(c.toLowerCase()))) continue
    if (collegeTypes.length > 0 && !collegeTypes.includes(normStatus)) continue
    if (searchQuery &&
      !college.college_name.toLowerCase().includes(searchQuery.toLowerCase())) continue

    for (const branch of Object.values(college.branches || {})) {
      if (preferredBranches.length > 0 &&
        !preferredBranches.some(b => branch.branch_name.toLowerCase().includes(b.toLowerCase()))) continue

      if (autonomy === 'autonomous' && !branch.is_autonomous) continue
      if (autonomy === 'non_autonomous' && branch.is_autonomous) continue

      const { bestHistory, bestCode } = getBestCategoryData(branch, categoryCodes)
      
      // Predict cutoff rank
      const predictedRank = predictCutoff(bestHistory)
      const prevRank = bestHistory.length > 0 ? bestHistory[bestHistory.length - 1].rank : null
      const prevPercentile = bestHistory.length > 0 ? bestHistory[bestHistory.length - 1].percentile : null

      if (predictedRank === null) {
        continue
      }

      // Convert predicted rank back to projected percentile for display and filtering
      const predictedPercentile = convertRankToPercentile(predictedRank, '2026-27', customInflationRate)

      // Filter out colleges that are too easy (predicted cutoff percentile is more than 5% below student's score)
      if (studentPct !== null && predictedPercentile !== null) {
        if (predictedPercentile < studentPct - 5) {
          continue
        }
      }

      const status = (studentRank !== null && predictedRank !== null)
        ? classifyEligibility(studentRank, predictedRank)
        : 'unknown'
      const chance = (studentRank !== null && predictedRank !== null)
        ? calculateChance(studentRank, predictedRank)
        : null

      rows.push({
        collegeCode: college.college_code,
        collegeName: college.college_name,
        city,
        normalizedStatus: normStatus,
        is_autonomous: branch.is_autonomous,
        branchCode: branch.branch_code,
        branchName: branch.branch_name,
        totalSeats: branch.total_seats,
        predictedRank,
        predictedPercentile,
        previousRank: prevRank,
        previousPercentile: prevPercentile,
        eligibilityStatus: status,
        admissionChance: chance,
        categoryCode: bestCode,
        historicalData: bestHistory,
        tfws_seats: branch.tfws_seats,
        ews_seats: branch.ews_seats,
        pwd_seats: branch.pwd_seats,
      })
    }
  }

  // Sort hardest first (lowest predicted rank first)
  rows.sort((a, b) => {
    const ra = a.predictedRank ?? Infinity
    const rb = b.predictedRank ?? Infinity
    if (ra !== rb) return ra - rb
    return a.collegeName.localeCompare(b.collegeName)
  })

  return rows
}
