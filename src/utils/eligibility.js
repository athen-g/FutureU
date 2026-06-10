/**
 * Predict cutoff using weighted average + trend from historical data.
 * historicalData: array of { year, cap3 } sorted ascending by year
 * More recent years get higher weight.
 */
export function predictCutoff(historicalData) {
  const valid = (historicalData || []).filter(d => d.cap3 !== null && d.cap3 !== undefined)
  if (valid.length === 0) return null
  if (valid.length === 1) return valid[0].cap3

  const weights = valid.map((_, i) => i + 1)
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const weightedAvg = valid.reduce((sum, d, i) => sum + d.cap3 * weights[i], 0) / totalWeight

  let trendSum = 0
  for (let i = 1; i < valid.length; i++) trendSum += valid[i].cap3 - valid[i - 1].cap3
  const avgTrend = trendSum / (valid.length - 1)

  return Math.min(100, Math.max(0, parseFloat((weightedAvg + avgTrend * 0.4).toFixed(4))))
}

export function calculateChance(studentPercentile, predictedCutoff) {
  const p = parseFloat(studentPercentile)
  if (predictedCutoff === null || predictedCutoff === undefined || isNaN(p)) return null
  const diff = p - predictedCutoff
  const k = 0.85
  const chance = 100 / (1 + Math.exp(-k * diff))
  return Math.min(99, Math.max(1, Math.round(chance)))
}

export function getChanceStatus(chance) {
  if (chance === null || chance === undefined) return 'unknown'
  if (chance >= 75) return 'safe'
  if (chance >= 50) return 'moderate'
  if (chance >= 15) return 'reach'
  return 'unlikely'
}

export function classifyEligibility(studentPercentile, predictedCutoff) {
  const chance = calculateChance(studentPercentile, predictedCutoff)
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
    let found = null
    if (capRound === 'all') {
      for (const cap of ['cap4', 'cap3', 'cap2', 'cap1']) {
        const val = yearData[cap]?.[typeKey]?.[categoryCode]?.percentile
        if (val != null) { found = val; break }
      }
    } else {
      const val = yearData[capRound]?.[typeKey]?.[categoryCode]?.percentile
      if (val != null) { found = val }
    }
    if (found != null) result.push({ year, cap3: found })
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
        const v = yearData[cap]?.[typeKey]?.[categoryCode]?.percentile
        if (v != null) { found = v; break }
      }
    } else {
      const v = yearData[capRound]?.[typeKey]?.[categoryCode]?.percentile
      if (v != null) { found = v }
    }
    return { year, value: found }
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
 * Tries GOPENS first (State Level), then GOPENH (Home University),
 * GOPENO (Other University), then Ladies equivalents.
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
      if (hist.length === 3) break  // found data for all 3 years, no need to keep looking
    }
  }
  return { history: bestHistory, categoryCode: bestCode }
}
