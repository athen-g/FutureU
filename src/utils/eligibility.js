const CANDIDATE_COUNTS = {
  '2022-23': 232964,
  '2023-24': 313730,
  '2024-25': 295577,
  '2025-26': 422863,
}

/**
 * Gets the candidate count for a specific year, projecting it for 2026-27 using inflation.
 */
export function getCandidateCountForYear(year, customInflationRate) {
  if (CANDIDATE_COUNTS[year]) return CANDIDATE_COUNTS[year]
  const baseCount = CANDIDATE_COUNTS['2025-26']
  const rate = customInflationRate !== undefined ? parseFloat(customInflationRate) : 22.38
  return Math.round(baseCount * (1 + rate / 100))
}

/**
 * Converts percentile to estimated rank.
 */
export function convertPercentileToRank(percentile, year, customInflationRate) {
  const p = parseFloat(percentile)
  if (isNaN(p)) return null
  const count = getCandidateCountForYear(year, customInflationRate)
  return Math.round(count * (1 - p / 100)) + 1
}

/**
 * Converts rank to estimated percentile.
 */
export function convertRankToPercentile(rank, year, customInflationRate) {
  const r = parseFloat(rank)
  if (isNaN(r)) return null
  const count = getCandidateCountForYear(year, customInflationRate)
  return Math.min(100, Math.max(0, parseFloat((100 * (1 - (r - 1) / count)).toFixed(4))))
}

/**
 * Predict cutoff rank using weighted average + trend from historical ranks.
 * historicalData: array of { year, rank } sorted ascending by year
 */
export function predictCutoff(historicalData) {
  const valid = (historicalData || []).filter(d => d.rank !== null && d.rank !== undefined)
  if (valid.length === 0) return null
  if (valid.length === 1) return valid[0].rank

  const weights = valid.map((_, i) => i + 1)
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const weightedAvg = valid.reduce((sum, d, i) => sum + d.rank * weights[i], 0) / totalWeight

  let trendSum = 0
  for (let i = 1; i < valid.length; i++) trendSum += valid[i].rank - valid[i - 1].rank
  const avgTrend = trendSum / (valid.length - 1)

  return Math.max(1, Math.round(weightedAvg + avgTrend * 0.4))
}

/**
 * Calculates admission probability based on rank-based ratio power sigmoid curve.
 */
export function calculateChance(studentRank, predictedCutoffRank) {
  const r = parseFloat(studentRank)
  const c = parseFloat(predictedCutoffRank)
  if (isNaN(r) || isNaN(c) || c <= 0 || r <= 0) return null
  
  const ratio = r / c
  const chance = 100 / (1 + Math.pow(ratio, 10))
  return Math.min(99, Math.max(1, Math.round(chance)))
}

export function getChanceStatus(chance) {
  if (chance === null || chance === undefined) return 'unknown'
  if (chance >= 75) return 'safe'
  if (chance >= 50) return 'moderate'
  if (chance >= 15) return 'reach'
  return 'unlikely'
}

export function classifyEligibility(studentRank, predictedCutoffRank) {
  const chance = calculateChance(studentRank, predictedCutoffRank)
  return getChanceStatus(chance)
}

export function eligibilityLabel(status) {
  const map = { safe:'Safe', moderate:'Moderate', reach:'Reach', unlikely:'Unlikely' }
  return map[status] || 'Unknown'
}

export function eligibilityColor(status) {
  const map = { safe:'#16a34a', moderate:'#d97706', reach:'#ea580c', unlikely:'#FF0000' }
  return map[status] || '#9ca3af'
}

export function eligibilityBg(status) {
  const map = { safe:'#dcfce7', moderate:'#fef3c7', reach:'#ffedd5', unlikely:'#FFF0F0' }
  return map[status] || '#f3f4f6'
}

/**
 * Extract historical cutoffs for a branch+category across all available years.
 * Tries cap3 first (most final), then cap2, then cap1 if capRound is 'all'.
 * Returns array sorted oldest→newest.
 */
export function getHistoricalCutoffs(branchData, categoryCode, capRound = 'all') {
  const years = ['2022-23', '2023-24', '2024-25', '2025-26']
  const result = []
  const isAi = categoryCode && categoryCode.startsWith('AI_')
  const typeKey = isAi ? 'ai' : 'mh'
  for (const year of years) {
    const yearData = branchData.cutoffs?.[year]
    if (!yearData) continue
    let foundNode = null
    if (capRound === 'all') {
      for (const cap of ['cap4', 'cap3', 'cap2', 'cap1']) {
        const val = yearData[cap]?.[typeKey]?.[categoryCode]
        if (val && val.percentile != null) { foundNode = val; break }
      }
    } else {
      const val = yearData[capRound]?.[typeKey]?.[categoryCode]
      if (val && val.percentile != null) { foundNode = val }
    }
    if (foundNode != null) {
      const percentile = foundNode.percentile
      const rank = foundNode.rank != null ? foundNode.rank : convertPercentileToRank(percentile, year)
      result.push({
        year,
        percentile,
        rank,
        cap3: percentile // Backwards compatibility alias
      })
    }
  }
  return result
}

/**
 * Get historical cutoffs for chart (including nulls for missing years).
 */
export function getCutoffHistory(branchData, categoryCode, capRound = 'all') {
  const years = ['2022-23', '2023-24', '2024-25', '2025-26']
  const isAi = categoryCode && categoryCode.startsWith('AI_')
  const typeKey = isAi ? 'ai' : 'mh'
  return years.map(year => {
    const yearData = branchData.cutoffs?.[year]
    if (!yearData) return { year, value: null }
    let found = null
    if (capRound === 'all') {
      for (const cap of ['cap4', 'cap3', 'cap2', 'cap1']) {
        const v = yearData[cap]?.[typeKey]?.[categoryCode]
        if (v && v.rank != null) { found = v; break }
      }
    } else {
      const v = yearData[capRound]?.[typeKey]?.[categoryCode]
      if (v && v.rank != null) { found = v }
    }
    return { year, value: found ? found.rank : null }
  })
}

/**
 * Get best category code and its historical data for a branch given a list of codes.
 */
export function getBestCategoryData(branchData, categoryCodes) {
  let bestHistory = []
  let bestCode = null
  for (const code of (categoryCodes || [])) {
    const hist = getHistoricalCutoffs(branchData, code)
    if (hist.length > bestHistory.length) {
      bestHistory = hist
      bestCode = code
    }
  }
  return { bestHistory, bestCode }
}

/**
 * Fallback chain for default cutoff display.
 * Returns { history, categoryCode } with the best available data.
 */
const DEFAULT_OPEN_FALLBACK = [
  'GOPENS', 'GOPENH', 'GOPENO',
  'LOPENS', 'LOPENH', 'LOPENO'
]

export function getDefaultCutoffs(branchData) {
  let bestHistory = []
  let bestCode = 'GOPENS'
  for (const code of DEFAULT_OPEN_FALLBACK) {
    const hist = getHistoricalCutoffs(branchData, code)
    if (hist.length > bestHistory.length) {
      bestHistory = hist
      bestCode = code
      if (hist.length === 3) break
    }
  }
  return { history: bestHistory, categoryCode: bestCode }
}
