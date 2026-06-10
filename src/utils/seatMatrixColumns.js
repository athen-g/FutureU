export const STATE_LEVEL_COLUMNS = [
  { index: 0,  category: 'OPEN', gender: 'G', label: 'OPEN General' },
  { index: 1,  category: 'OPEN', gender: 'L', label: 'OPEN Ladies' },
  { index: 2,  category: 'SC',   gender: 'G', label: 'SC General' },
  { index: 3,  category: 'SC',   gender: 'L', label: 'SC Ladies' },
  { index: 4,  category: 'ST',   gender: 'G', label: 'ST General' },
  { index: 5,  category: 'ST',   gender: 'L', label: 'ST Ladies' },
  { index: 6,  category: 'VJ',   gender: 'G', label: 'VJ/DT General' },
  { index: 7,  category: 'VJ',   gender: 'L', label: 'VJ/DT Ladies' },
  { index: 8,  category: 'NT1',  gender: 'G', label: 'NTB General' },
  { index: 9,  category: 'NT1',  gender: 'L', label: 'NTB Ladies' },
  { index: 10, category: 'NT2',  gender: 'G', label: 'NTC General' },
  { index: 11, category: 'NT2',  gender: 'L', label: 'NTC Ladies' },
  { index: 12, category: 'NT3',  gender: 'G', label: 'NTD General' },
  { index: 13, category: 'NT3',  gender: 'L', label: 'NTD Ladies' },
  { index: 14, category: 'OBC',  gender: 'G', label: 'OBC General' },
  { index: 15, category: 'OBC',  gender: 'L', label: 'OBC Ladies' },
  { index: 16, category: 'SEBC', gender: 'G', label: 'SEBC General' },
  { index: 17, category: 'SEBC', gender: 'L', label: 'SEBC Ladies' },
  { index: 18, category: 'TOTAL', gender: null, label: 'Total (G+L)' },
]

export function decodeSeatBreakdown(stateLevelArray) {
  if (!Array.isArray(stateLevelArray)) return {}
  const result = {}
  for (const col of STATE_LEVEL_COLUMNS) {
    const value = stateLevelArray[col.index] ?? 0
    if (col.category === 'TOTAL') {
      result.total_state_level = value
    } else {
      result[`${col.gender}_${col.category}`] = value
    }
  }
  return result
}

export function getSeatsForCategory(decodedSeats, category, gender = 'any') {
  if (gender === 'any') {
    return (decodedSeats[`G_${category}`] ?? 0) + (decodedSeats[`L_${category}`] ?? 0)
  }
  return decodedSeats[`${gender}_${category}`] ?? 0
}
