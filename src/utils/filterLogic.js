import { getRelevantCategoryCodes } from './categoryMapping'
import { predictCutoff, classifyEligibility, getBestCategoryData, calculateChance } from './eligibility'
import { getAllColleges, getCityFromCollegeName, normalizeStatus } from './dataLoader'

/**
 * Build ranked preference list sorted highest predicted cutoff → lowest.
 * This is the order students should fill their CAP form.
 */
export function buildRankedList(filters) {
  const {
    percentile,
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
      const predicted = predictCutoff(bestHistory)
      const prev = bestHistory.length > 0 ? bestHistory[bestHistory.length - 1].cap3 : null

      if (predicted === null) {
        continue
      }

      if (percentile != null && percentile !== '') {
        const studentPct = parseFloat(percentile)
        if (!isNaN(studentPct) && predicted < studentPct - 5) {
          continue
        }
      }

      const status = (percentile != null && percentile !== '')
        ? classifyEligibility(parseFloat(percentile), predicted)
        : 'unknown'
      const chance = (percentile != null && percentile !== '' && predicted !== null)
        ? calculateChance(parseFloat(percentile), predicted)
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
        predictedCutoff: predicted,
        previousCutoff: prev,
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

  // Sort hardest first (highest predicted cutoff → lowest)
  rows.sort((a, b) => {
    const pa = a.predictedCutoff ?? -1
    const pb = b.predictedCutoff ?? -1
    if (Math.abs(pb - pa) > 0.0001) return pb - pa
    return a.collegeName.localeCompare(b.collegeName)
  })

  return rows
}
