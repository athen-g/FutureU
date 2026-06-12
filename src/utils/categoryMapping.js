export function getRelevantCategoryCodes({ category, gender, domicile, tfws, ews, pwd }) {
  const codes = []
  const gPrefix = gender === 'Female' ? 'L' : 'G'
  const suffix =
    domicile === 'Home University' ? 'H' :
    domicile === 'Other University' ? 'O' :
    'S'

  // 1. TFWS (highest priority specific category)
  if (tfws) codes.push('TFWS')

  // 2. EWS
  if (ews) codes.push('EWS')

  // 3. PWD specific OPEN
  if (pwd) codes.push(`PWDOPEN${suffix}`)

  // 4. Selected reservation category (OBC, SC, ST, etc.)
  const catCodeMap = {
    OBC: 'OBC',
    SC: 'SC',
    ST: 'ST',
    SEBC: 'SEBC',
    VJ: 'VJ',
    'NT-B': 'NT1',
    'NT-C': 'NT2',
    'NT-D': 'NT3',
  }

  if (category && category !== 'OPEN' && catCodeMap[category]) {
    codes.push(`${gPrefix}${catCodeMap[category]}${suffix}`)
    if (gender === 'Female') codes.push(`G${catCodeMap[category]}${suffix}`)
  }

  // 5. General OPEN (lowest priority fallback)
  codes.push(`${gPrefix}OPEN${suffix}`)
  if (gender === 'Female') codes.push(`GOPEN${suffix}`)

  return [...new Set(codes)]
}

export const CATEGORY_LABELS = {
  OPEN: 'Open / Unreserved',
  OBC: 'OBC',
  SC: 'Scheduled Caste',
  ST: 'Scheduled Tribe',
  SEBC: 'SEBC',
  VJ: 'Vimukta Jati (DT-A)',
  'NT-B': 'Nomadic Tribe NT-B',
  'NT-C': 'Nomadic Tribe NT-C',
  'NT-D': 'Nomadic Tribe NT-D',
  EWS: 'Economically Weaker Section',
}

export const DOMICILE_OPTIONS = [
  { value: 'State Level', label: 'State Level (All Maharashtra)' },
  { value: 'Home University', label: 'Home University' },
  { value: 'Other University', label: 'Other University' },
]
