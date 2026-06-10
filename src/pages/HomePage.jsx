import { useState, useMemo, useCallback, useRef } from 'react'
import { Search, RotateCcw, Download, Heart, MapPin, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { buildRankedList } from '../utils/filterLogic'
import { getAllBranches, getAllCities } from '../utils/dataLoader'
import { eligibilityLabel, eligibilityColor, eligibilityBg } from '../utils/eligibility'
import { exportPreferenceListPDF } from '../utils/exportPdf'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import './HomePage.css'

const CATEGORIES = ['OPEN','OBC','SC','ST','SEBC','VJ','NT-B','NT-C','NT-D','EWS']
const COLLEGE_TYPES = ['Government','Government Autonomous','Private','Private Autonomous','Aided','Deemed','University']

function ChanceBadge({ chance, status }) {
  if (chance === null || chance === undefined || status === 'unknown') return <span style={{color:'var(--color-text-faint)'}}>—</span>
  return (
    <span className="chance-badge" style={{ background: eligibilityBg(status), color: eligibilityColor(status) }}>
      {chance}%
    </span>
  )
}

function ResultRow({ row, index, onShortlist, isShortlisted }) {
  return (
    <tr className={`result-row result-row--${row.eligibilityStatus}`}>
      <td className="col-sr">{index + 1}</td>
      <td className="col-college">
        <Link to={`/college/${row.collegeCode}`} className="college-link">
          {row.collegeName}
          <ExternalLink size={12} className="ext-icon"/>
        </Link>
        <div className="row-meta">
          <span className="row-city"><MapPin size={11}/> {row.city || 'Maharashtra'}</span>
          <span className="row-type">{row.normalizedStatus}</span>
          {row.is_autonomous && <span className="row-auto">Autonomous</span>}
          <span className="row-code">DTE: {row.collegeCode}</span>
        </div>
      </td>
      <td className="col-branch">
        <div>{row.branchName}</div>
        <div className="branch-code-sub">DTE: {row.branchCode}</div>
      </td>
      <td className="col-cutoff">
        <div className="cutoff-cell">
          <span className="cutoff-pred">{row.predictedCutoff != null ? row.predictedCutoff.toFixed(2) + '%' : '—'}</span>
          <span className="cutoff-prev">{row.previousCutoff != null ? 'Prev: ' + row.previousCutoff.toFixed(2) + '%' : ''}</span>
        </div>
      </td>
      <td className="col-chance"><ChanceBadge chance={row.admissionChance} status={row.eligibilityStatus}/></td>
      <td className="col-action">
        <button
          className={`heart-btn ${isShortlisted ? 'active' : ''}`}
          onClick={() => onShortlist(row)}
          aria-label="Toggle shortlist"
        >
          <Heart size={15} fill={isShortlisted ? 'currentColor' : 'none'}/>
        </button>
      </td>
    </tr>
  )
}

const INIT = {
  percentile: '', rank: '', jeePercentile: '', jeeRank: '',
  category: 'OPEN', gender: 'Male', domicile: 'State Level',
  tfws: false, ews: false, pwd: false,
  preferredBranches: [], preferredCities: [], collegeTypes: [],
  autonomy: 'all', searchQuery: '',
}

export default function HomePage() {
  const [filters, setFilters] = useState(INIT)
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [activeTab, setActiveTab] = useState('mh')
  const resultsRef = useRef(null)
  const { addToShortlist, removeFromShortlist, isShortlisted, shortlist } = useApp()
  usePageTitle('College Recommendations')

  const set = useCallback((k, v) => setFilters(f => ({ ...f, [k]: v })), [])
  const toggleArr = useCallback((k, v) => setFilters(f => ({
    ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]
  })), [])

  const allBranches = useMemo(() => getAllBranches(), [])
  const allCities = useMemo(() => getAllCities(), [])

  const handleSearch = () => {
    try {
      sessionStorage.setItem('futureu_percentile', filters.percentile)
      sessionStorage.setItem('futureu_category', filters.category)
      sessionStorage.setItem('futureu_gender', filters.gender)
      sessionStorage.setItem('futureu_domicile', filters.domicile)
      sessionStorage.setItem('futureu_tfws', filters.tfws ? 'true' : 'false')
      sessionStorage.setItem('futureu_ews', filters.ews ? 'true' : 'false')
      sessionStorage.setItem('futureu_pwd', filters.pwd ? 'true' : 'false')
    } catch (e) {
      console.warn('Failed to save filters to sessionStorage', e)
    }

    const mhRows = buildRankedList({ ...filters, type: 'mh' })
    const jeeRows = (filters.jeePercentile || filters.jeeRank)
      ? buildRankedList({ ...filters, percentile: filters.jeePercentile, type: 'ai' })
      : []
    setResults({ mh: mhRows, ai: jeeRows })
    setHasSearched(true)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleReset = () => {
    try {
      sessionStorage.removeItem('futureu_percentile')
      sessionStorage.removeItem('futureu_category')
      sessionStorage.removeItem('futureu_gender')
      sessionStorage.removeItem('futureu_domicile')
      sessionStorage.removeItem('futureu_tfws')
      sessionStorage.removeItem('futureu_ews')
      sessionStorage.removeItem('futureu_pwd')
    } catch (e) {}
    setFilters(INIT); setResults([]); setHasSearched(false)
  }

  const currentRows = hasSearched ? (results[activeTab] || []) : []

  const handleShortlist = (row) => {
    if (isShortlisted(row.collegeCode, row.branchCode)) {
      removeFromShortlist(row.collegeCode, row.branchCode)
    } else {
      addToShortlist({ ...row, collegeName: row.collegeName, branchName: row.branchName })
    }
  }

  const handleDownloadPDF = () => {
    exportPreferenceListPDF(currentRows, {
      percentile: filters.percentile,
      category: filters.category,
      gender: filters.gender,
      date: new Date().toLocaleDateString('en-IN'),
    })
  }

  const hasJEE = filters.jeePercentile || filters.jeeRank

  return (
    <div className="home-page">
      {/* Hero strip */}
      <div className="home-hero">
        <div className="container home-hero-inner">
          <div>
            <h1>Find Your Perfect Engineering College</h1>
            <p>Enter your exam scores and preferences to get personalized college recommendations</p>
            <button className="btn btn-primary" onClick={() => document.getElementById('inputs-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started →
            </button>
          </div>
          <div className="home-hero-img">
            <svg viewBox="0 0 260 200" fill="none" width="100%" height="100%">
              <rect width="260" height="200" fill="white" rx="12"/>
              <rect x="20" y="40" width="220" height="120" rx="8" fill="#f9fafb" stroke="#e5e7eb"/>
              <rect x="40" y="60" width="80" height="80" rx="4" fill="#FF0000" opacity="0.1"/>
              <rect x="44" y="64" width="72" height="72" rx="3" fill="#FF0000" opacity="0.15"/>
              <circle cx="80" cy="100" r="24" fill="#FF0000" opacity="0.2"/>
              <path d="M68 100 L78 110 L96 88" stroke="#FF0000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="140" y="62" width="80" height="10" rx="3" fill="#e5e7eb"/>
              <rect x="140" y="80" width="60" height="8" rx="3" fill="#e5e7eb"/>
              <rect x="140" y="96" width="70" height="8" rx="3" fill="#e5e7eb"/>
              <rect x="140" y="115" width="40" height="8" rx="4" fill="#FF0000"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Input form */}
      <section id="inputs-section" className="inputs-section">
        <div className="container">
          <h2 className="inputs-title">Enter Your Details</h2>
          <div className="inputs-grid">
            {/* Left: Scores */}
            <div className="input-panel">
              <div className="panel-title">Exam Scores</div>

              <div className="panel-sub">MHT-CET Scores</div>
              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">MHT-CET Percentile</label>
                  <input className="form-input" type="number" min="0" max="100" step="0.0001"
                    placeholder="Enter your percentile (0-100)"
                    value={filters.percentile} onChange={e => set('percentile', e.target.value)}/>
                </div>
                <div className="form-group">
                  <label className="form-label">MHT-CET Rank</label>
                  <input className="form-input" type="number" min="1"
                    placeholder="Enter your rank"
                    value={filters.rank} onChange={e => set('rank', e.target.value)}/>
                </div>
              </div>

              <div className="panel-sub">JEE Scores</div>
              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">JEE Percentile (Optional)</label>
                  <input className="form-input" type="number" min="0" max="100" step="0.0001"
                    placeholder="Enter your percentile (0-100)"
                    value={filters.jeePercentile} onChange={e => set('jeePercentile', e.target.value)}/>
                </div>
                <div className="form-group">
                  <label className="form-label">JEE Rank (Optional)</label>
                  <input className="form-input" type="number" min="1"
                    placeholder="Enter your rank"
                    value={filters.jeeRank} onChange={e => set('jeeRank', e.target.value)}/>
                </div>
              </div>

              <div className="two-col" style={{marginTop:12}}>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input form-select" value={filters.gender} onChange={e => set('gender', e.target.value)}>
                    <option>Male</option><option>Female</option><option>Transgender</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">TFWS</label>
                  <select className="form-input form-select" value={filters.tfws ? 'Yes' : 'No'}
                    onChange={e => set('tfws', e.target.value === 'Yes')}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
              </div>
              <div className="two-col" style={{marginTop:8}}>
                <div className="form-group">
                  <label className="form-label">EWS</label>
                  <select className="form-input form-select" value={filters.ews ? 'Yes' : 'No'}
                    onChange={e => set('ews', e.target.value === 'Yes')}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">PWD</label>
                  <select className="form-input form-select" value={filters.pwd ? 'Yes' : 'No'}
                    onChange={e => set('pwd', e.target.value === 'Yes')}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Preferences */}
            <div className="input-panel">
              <div className="panel-title">Preferences</div>
              <div className="panel-sub">Set your preferences</div>

              <div className="form-group">
                <label className="form-label">City Preference</label>
                <select className="form-input form-select" onChange={e => {
                  const v = e.target.value
                  if (v && !filters.preferredCities.includes(v)) set('preferredCities', [...filters.preferredCities, v])
                }}>
                  <option value="">Select City</option>
                  {allCities.map(c => <option key={c}>{c}</option>)}
                </select>
                {filters.preferredCities.length > 0 && (
                  <div className="chip-row">
                    {filters.preferredCities.map(c => (
                      <span key={c} className="chip active" onClick={() => set('preferredCities', filters.preferredCities.filter(x => x !== c))}>
                        {c} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Branch Preference</label>
                <select className="form-input form-select" onChange={e => {
                  const v = e.target.value
                  if (v && !filters.preferredBranches.includes(v)) set('preferredBranches', [...filters.preferredBranches, v])
                }}>
                  <option value="">Select Branch</option>
                  {allBranches.map(b => <option key={b}>{b}</option>)}
                </select>
                {filters.preferredBranches.length > 0 && (
                  <div className="chip-row">
                    {filters.preferredBranches.map(b => (
                      <span key={b} className="chip active" onClick={() => set('preferredBranches', filters.preferredBranches.filter(x => x !== b))}>
                        {b.length > 30 ? b.slice(0,30)+'…' : b} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">College Type</label>
                <div className="checkbox-grid">
                  {COLLEGE_TYPES.map(t => (
                    <label key={t} className="checkbox-label">
                      <input type="checkbox" checked={filters.collegeTypes.includes(t)} onChange={() => toggleArr('collegeTypes', t)} style={{accentColor:'#FF0000'}}/>
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reservation</label>
                <select className="form-input form-select" value={filters.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Domicile</label>
                <select className="form-input form-select" value={filters.domicile} onChange={e => set('domicile', e.target.value)}>
                  <option value="State Level">State Level</option>
                  <option value="Home University">Home University</option>
                  <option value="Other University">Other University</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Institute Autonomy</label>
                <div className="toggle-group">
                  {[['all','All'],['autonomous','Autonomous Only'],['non_autonomous','Non-Autonomous Only']].map(([val, lbl]) => (
                    <button key={val} className={`toggle-btn ${filters.autonomy === val ? 'active' : ''}`}
                      onClick={() => set('autonomy', val)}>{lbl}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary btn-lg" onClick={handleSearch}>
              <Search size={17}/> Get My College Recommendations
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={15}/> Reset Form
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {hasSearched && (
        <section className="results-section" ref={resultsRef}>
          <div className="container">
            <div className="results-header">
              <div>
                <h2>Your College Recommendations</h2>
                <p>Sorted highest cutoff → lowest. Fill your CAP preference form in this order (top to bottom).</p>
              </div>
              <div className="results-actions">
                {hasJEE && (
                  <div className="tab-toggle">
                    <button className={`tab-btn ${activeTab === 'mh' ? 'active' : ''}`} onClick={() => setActiveTab('mh')}>MH Seats</button>
                    <button className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>AI Seats</button>
                  </div>
                )}
                <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF}>
                  <Download size={14}/> Download PDF
                </button>
              </div>
            </div>

            {currentRows.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try adjusting your filters or removing city/branch preferences.</p>
              </div>
            ) : (
              <>
                <div className="results-info">
                  <Info size={14}/>
                  <span>{currentRows.length} college-branch combinations found. Predicted cutoffs use historical CAP data.</span>
                </div>

                <div className="results-legend">
                  {[['safe','Safe (3%+ above cutoff)'],['moderate','Moderate (0–3% above)'],['reach','Reach (0–2% below)'],['unlikely','Unlikely (2%+ below)']].map(([s,l]) => (
                    <span key={s} className="legend-item">
                      <span className="legend-dot" style={{background: eligibilityColor(s)}}/>
                      {l}
                    </span>
                  ))}
                </div>

                <div className="results-table-wrap">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th className="col-sr">#</th>
                        <th className="col-college">College</th>
                        <th className="col-branch">Branch</th>
                        <th className="col-cutoff">Predicted / Prev Cutoff</th>
                        <th className="col-chance">Chance</th>
                        <th className="col-action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.map((row, i) => (
                        <ResultRow
                          key={`${row.collegeCode}-${row.branchCode}`}
                          row={row} index={i}
                          onShortlist={handleShortlist}
                          isShortlisted={isShortlisted(row.collegeCode, row.branchCode)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="results-bottom">
                  <div className="bottom-actions">
                    <button className="btn btn-primary" onClick={handleDownloadPDF}>
                      <Download size={15}/> Download as PDF
                    </button>
                    {shortlist.length > 0 && (
                      <span className="shortlist-count"><Heart size={14} fill="#FF0000" color="#FF0000"/> {shortlist.length} saved</span>
                    )}
                  </div>
                </div>

                <div className="bottom-strip">
                  <div className="quick-stats">
                    <div className="qs-title">Quick Stats</div>
                    <div className="qs-item">📅 Data: 2024-25 CAP Round cutoffs</div>
                    <div className="qs-item">📊 Based on historical cutoff trends</div>
                    <div className="qs-item">🏫 Covers 354+ colleges across Maharashtra</div>
                  </div>
                  <div className="disclaimer">
                    <div className="qs-title">Disclaimer</div>
                    <div className="qs-item">⚠ Predictions are based on historical data and trends</div>
                    <div className="qs-item">⚠ Actual cutoffs may vary based on various factors</div>
                    <div className="qs-item">⚠ Please verify with official sources before making decisions</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
