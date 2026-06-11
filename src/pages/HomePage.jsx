import { useState, useMemo, useCallback, useRef, memo, useEffect } from 'react'
import { Search, RotateCcw, Download, Heart, MapPin, Info, ChevronDown, ChevronUp, ExternalLink, Sparkles, Lock } from 'lucide-react'
import { buildRankedList } from '../utils/filterLogic'
import { getAllBranches, getAllCities } from '../utils/dataLoader'
import { eligibilityLabel, eligibilityColor, eligibilityBg, convertPercentileToRank, convertRankToPercentile, getCandidateCountForYear } from '../utils/eligibility'
import { exportPreferenceListPDF } from '../utils/exportPdf'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'
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

const ResultRow = memo(function ResultRow({ row, index, onShortlist, isShortlisted }) {
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
          <span className="cutoff-pred text-gradient" style={{ fontWeight: 700 }}>
            {row.predictedRank != null ? `Rank: ${row.predictedRank.toLocaleString()}` : '—'}
            {row.predictedPercentile != null && ` (${row.predictedPercentile.toFixed(2)}%)`}
          </span>
          <span className="cutoff-prev">
            {row.previousRank != null ? `Prev: ${row.previousRank.toLocaleString()}` : ''}
            {row.previousPercentile != null && ` (${row.previousPercentile.toFixed(2)}%)`}
          </span>
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
})

const INIT = {
  percentile: '', rank: '', jeePercentile: '', jeeRank: '',
  category: 'OPEN', gender: 'Male', domicile: 'State Level',
  tfws: false, ews: false, pwd: false,
  preferredBranches: [], preferredCities: [], collegeTypes: [],
  autonomy: 'all', searchQuery: '',
  customInflationRate: 22.38,
}

function SearchTableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="result-row-skeleton">
      <td className="col-sr"><div className="skeleton-circle skeleton-shimmer"></div></td>
      <td className="col-college">
        <div className="skeleton-line skeleton-line--long skeleton-shimmer" style={{ height: '14px', marginBottom: '8px' }}></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="skeleton-line skeleton-line--short skeleton-shimmer" style={{ width: '80px', height: '10px' }}></div>
          <div className="skeleton-line skeleton-line--short skeleton-shimmer" style={{ width: '60px', height: '10px' }}></div>
        </div>
      </td>
      <td className="col-branch">
        <div className="skeleton-line skeleton-line--medium skeleton-shimmer" style={{ height: '12px', marginBottom: '6px' }}></div>
        <div className="skeleton-line skeleton-line--short skeleton-shimmer" style={{ width: '70px', height: '9px' }}></div>
      </td>
      <td className="col-cutoff">
        <div className="skeleton-line skeleton-line--medium skeleton-shimmer" style={{ height: '12px', marginBottom: '4px' }}></div>
        <div className="skeleton-line skeleton-line--short skeleton-shimmer" style={{ width: '80px', height: '10px' }}></div>
      </td>
      <td className="col-chance"><div className="skeleton-badge skeleton-shimmer"></div></td>
      <td className="col-action"><div className="skeleton-button skeleton-shimmer"></div></td>
    </tr>
  ))
}

export default function HomePage() {
  const [filters, setFilters] = useState(() => {
    try {
      return {
        ...INIT,
        percentile: sessionStorage.getItem('futureu_percentile') || '',
        rank: sessionStorage.getItem('futureu_rank') || '',
        category: sessionStorage.getItem('futureu_category') || 'OPEN',
        gender: sessionStorage.getItem('futureu_gender') || 'Male',
        domicile: sessionStorage.getItem('futureu_domicile') || 'State Level',
        tfws: sessionStorage.getItem('futureu_tfws') === 'true',
        ews: sessionStorage.getItem('futureu_ews') === 'true',
        pwd: sessionStorage.getItem('futureu_pwd') === 'true',
        customInflationRate: parseFloat(sessionStorage.getItem('futureu_inflation')) || 22.38
      }
    } catch (e) {
      return INIT
    }
  })
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('mh')
  const [visibleCount, setVisibleCount] = useState(100)
  const [showCalc, setShowCalc] = useState(false)
  const [calcPct, setCalcPct] = useState('')
  const [calcRank, setCalcRank] = useState('')
  const resultsRef = useRef(null)
  const { addToShortlist, removeFromShortlist, isShortlisted, shortlist, openSupportModal, isDataReady, loadAppData } = useApp()
  
  useEffect(() => {
    loadAppData()
  }, [loadAppData])

  useMeta(
    'College Recommendations',
    'Find your perfect engineering college in Maharashtra with FutureU. Get customized MHT-CET & JEE cutoff predictions, seat matrix data, and automated preference list generation.'
  )

  const set = useCallback((k, v) => setFilters(f => ({ ...f, [k]: v })), [])
  const toggleArr = useCallback((k, v) => setFilters(f => ({
    ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]
  })), [])

  const allBranches = useMemo(() => isDataReady ? getAllBranches() : [], [isDataReady])
  const allCities = useMemo(() => isDataReady ? getAllCities() : [], [isDataReady])

  const estimatedRank = useMemo(() => {
    if (filters.percentile && !filters.rank) {
      return convertPercentileToRank(filters.percentile, '2026-27', filters.customInflationRate)
    }
    return null
  }, [filters.percentile, filters.rank, filters.customInflationRate])

  const handleSearch = async () => {
    try {
      sessionStorage.setItem('futureu_percentile', filters.percentile)
      sessionStorage.setItem('futureu_rank', filters.rank)
      sessionStorage.setItem('futureu_inflation', filters.customInflationRate.toString())
      sessionStorage.setItem('futureu_category', filters.category)
      sessionStorage.setItem('futureu_gender', filters.gender)
      sessionStorage.setItem('futureu_domicile', filters.domicile)
      sessionStorage.setItem('futureu_tfws', filters.tfws ? 'true' : 'false')
      sessionStorage.setItem('futureu_ews', filters.ews ? 'true' : 'false')
      sessionStorage.setItem('futureu_pwd', filters.pwd ? 'true' : 'false')
    } catch (e) {
      console.warn('Failed to save filters to sessionStorage', e)
    }

    setHasSearched(true)
    setIsSearching(true)
    
    // Scroll to results section immediately to let user see the shimmering table skeleton
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    const startTime = Date.now()

    if (!isDataReady) {
      await loadAppData()
    }

    const elapsed = Date.now() - startTime
    const remainingTime = Math.max(0, 1200 - elapsed)

    setTimeout(() => {
      const mhRows = buildRankedList({ ...filters, type: 'mh' })
      const jeeRows = (filters.jeePercentile || filters.jeeRank)
        ? buildRankedList({ ...filters, percentile: filters.jeePercentile, rank: filters.jeeRank, type: 'ai' })
        : []
      setResults({ mh: mhRows, ai: jeeRows })
      setIsSearching(false)
      setVisibleCount(100)
    }, remainingTime)
  }

  const handleReset = () => {
    try {
      sessionStorage.removeItem('futureu_percentile')
      sessionStorage.removeItem('futureu_rank')
      sessionStorage.removeItem('futureu_inflation')
      sessionStorage.removeItem('futureu_category')
      sessionStorage.removeItem('futureu_gender')
      sessionStorage.removeItem('futureu_domicile')
      sessionStorage.removeItem('futureu_tfws')
      sessionStorage.removeItem('futureu_ews')
      sessionStorage.removeItem('futureu_pwd')
    } catch (e) {}
    setFilters(INIT); setResults([]); setHasSearched(false)
    setVisibleCount(100)
  }

  const currentRows = hasSearched ? (results[activeTab] || []) : []

  const handleShortlist = useCallback((row) => {
    if (isShortlisted(row.collegeCode, row.branchCode)) {
      removeFromShortlist(row.collegeCode, row.branchCode)
    } else {
      addToShortlist({ ...row, collegeName: row.collegeName, branchName: row.branchName })
    }
  }, [isShortlisted, addToShortlist, removeFromShortlist])

  const handleDownloadPDF = () => {
    exportPreferenceListPDF(currentRows, {
      percentile: filters.percentile,
      rank: filters.rank || estimatedRank,
      category: filters.category,
      gender: filters.gender,
      date: new Date().toLocaleDateString('en-IN'),
    })
    openSupportModal()
  }

  // Data loader triggers silently in the background via useEffect, so the UI is ready immediately.

  const hasJEE = filters.jeePercentile || filters.jeeRank

  return (
    <div className="home-page">
      {/* Hero strip */}
      <div className="home-hero">
        <div className="container home-hero-inner">
          <div className="home-hero-text">
            <div className="home-hero-badge">
              <Sparkles size={13} className="badge-spark-icon" /> CAP Preference Optimizer
            </div>
            <h1 className="home-hero-title">
              Find Your Ideal <br />
              <span>Engineering College</span>
            </h1>
            <p className="home-hero-tagline">Real-time MHT-CET & JEE predictive modeling</p>
            <p className="home-hero-sub">
              Enter your exam scores and category options below. Our regression model calculates matching likelihoods across all 350+ Maharashtra engineering institutes.
            </p>
            <div className="home-hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('inputs-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Configure Dashboard
              </button>
            </div>
          </div>
          <div className="home-hero-visual">
            <div className="home-hero-mockup">
              <div className="mock-header">
                <div className="mock-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="mock-title">Prediction Analyzer</div>
              </div>
              <div className="mock-body">
                <div className="mock-stats-grid">
                  <div className="mock-stat-box">
                    <span className="stat-label">Exam Score</span>
                    <strong className="stat-value text-gradient">99.12%ile</strong>
                  </div>
                  <div className="mock-stat-box">
                    <span className="stat-label">Preference List</span>
                    <strong className="stat-value">CAP Round I</strong>
                  </div>
                </div>

                <div className="mock-quick-filters">
                  <span className="filter-badge active">CS / IT</span>
                  <span className="filter-badge active">Pune</span>
                  <span className="filter-badge active">Mumbai</span>
                  <span className="filter-badge">Autonomous</span>
                </div>

                <div className="mock-list">
                  <div className="mock-item glow-green">
                    <div className="item-details">
                      <span className="item-dte">DTE: 6271</span>
                      <h5>PICT Pune</h5>
                      <span className="item-branch">Computer Engineering</span>
                    </div>
                    <div className="item-probability safe">88% Chance</div>
                  </div>

                  <div className="mock-item glow-orange">
                    <div className="item-details">
                      <span className="item-dte">DTE: 3012</span>
                      <h5>VJTI Mumbai</h5>
                      <span className="item-branch">Information Technology</span>
                    </div>
                    <div className="item-probability moderate">54% Chance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input form */}
      <section id="inputs-section" className="inputs-section">
        <div className="container">
          <h2 className="inputs-title">Enter Your Details</h2>
          <div className="inputs-grid">
            {/* Merit List Autoload Panel (Locked Mock) */}
            <div className="input-panel autoload-panel" style={{ gridColumn: '1 / -1' }}>
              <div className="panel-title" style={{ color: 'var(--color-primary)', borderBottomColor: 'var(--color-primary)' }}>Merit List Autoload</div>
              <p className="panel-desc" style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Retrieve your official State CET Cell merit details automatically.
              </p>
              
              <div className="autoload-content-layout">
                {/* Active input for Examination ID */}
                <div className="form-group autoload-id-group">
                  <label className="form-label">Examination Roll Number / Application ID</label>
                  <div style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. EN26102948" 
                      defaultValue=""
                    />
                    <button className="btn btn-primary" onClick={(e) => e.preventDefault()} style={{ whiteSpace: 'nowrap' }}>
                      Fetch Merit
                    </button>
                  </div>
                </div>

                {/* Mock Output Fields with Lock Overlay */}
                <div className="autoload-mock-fields-container">
                  <div className="autoload-fields-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" type="text" disabled placeholder="Pending Merit List..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">MHT-CET Percentile</label>
                      <input className="form-input" type="text" disabled placeholder="Pending Merit List..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State Merit Rank</label>
                      <input className="form-input" type="text" disabled placeholder="Pending Merit List..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category Rank</label>
                      <input className="form-input" type="text" disabled placeholder="Pending Merit List..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Domicile / Gender</label>
                      <input className="form-input" type="text" disabled placeholder="Pending Merit List..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Seat Type Category</label>
                      <input className="form-input" type="text" disabled placeholder="Pending Merit List..." />
                    </div>
                  </div>

                  {/* Lock Overlay */}
                  <div className="autoload-overlay">
                    <div className="autoload-overlay-card">
                      <Lock className="lock-icon" size={24} />
                      <p className="lock-text">
                        <strong>Merit Autoload Feature</strong> — Will be enabled once the State CET Cell releases the official 2026 Merit List. You can manually enter your scores below in the meantime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    placeholder={estimatedRank ? `Est: ${estimatedRank}` : "Enter your rank"}
                    value={filters.rank} onChange={e => set('rank', e.target.value)}/>
                  {estimatedRank && (
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                      Rank calculated automatically: <strong>{estimatedRank}</strong> based on candidate inflation (you don't need to use the manual calculator).
                    </div>
                  )}
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

              {/* Collapsible Calculator Widget */}
              <div className="calculator-widget" style={{ marginTop: '20px', borderTop: '1px solid var(--color-divider)', paddingTop: '16px' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={(e) => { e.preventDefault(); setShowCalc(prev => !prev); }}
                  style={{ width: '100%', justifyContent: 'space-between', display: 'inline-flex' }}
                >
                  <span>📊 Rank & Inflation Calculator</span>
                  <span>{showCalc ? '▲' : '▼'}</span>
                </button>
                
                {showCalc && (
                  <div className="calculator-body" style={{ marginTop: '12px', background: 'var(--color-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-divider)' }}>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span>2026-27 Candidate Inflation Rate</span>
                        <strong>{filters.customInflationRate}%</strong>
                      </label>
                      <input 
                        type="range" min="10" max="40" step="0.1" 
                        value={filters.customInflationRate} 
                        onChange={e => set('customInflationRate', parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: '#FF0000', cursor: 'pointer' }}
                      />
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Projected 2026-27 Candidates: <strong>{getCandidateCountForYear('2026-27', filters.customInflationRate).toLocaleString()}</strong> (+{filters.customInflationRate}% growth)
                      </div>
                    </div>

                    <div className="calc-converters" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Percentile → Rank</label>
                        <input 
                          type="number" className="form-input" placeholder="Percentile" min="0" max="100" step="0.0001"
                          value={calcPct} onChange={e => {
                            setCalcPct(e.target.value);
                            const r = convertPercentileToRank(e.target.value, '2026-27', filters.customInflationRate);
                            setCalcRank(r !== null ? r.toString() : '');
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Rank → Percentile</label>
                        <input 
                          type="number" className="form-input" placeholder="Rank" min="1"
                          value={calcRank} onChange={e => {
                            setCalcRank(e.target.value);
                            const p = convertRankToPercentile(e.target.value, '2026-27', filters.customInflationRate);
                            setCalcPct(p !== null ? p.toString() : '');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                    <button className={`tab-btn ${activeTab === 'mh' ? 'active' : ''}`} onClick={() => { setActiveTab('mh'); setVisibleCount(100); }}>MH Seats</button>
                    <button className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => { setActiveTab('ai'); setVisibleCount(100); }}>AI Seats</button>
                  </div>
                )}
                <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF}>
                  <Download size={14}/> Download PDF
                </button>
              </div>
            </div>

            {isSearching ? (
              <>
                <div className="results-info">
                  <Info size={14}/>
                  <span>Admissions probability analyzer is preparing customized recommendations...</span>
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
                      <SearchTableSkeleton />
                    </tbody>
                  </table>
                </div>
              </>
            ) : currentRows.length === 0 ? (
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
                      {currentRows.slice(0, visibleCount).map((row, i) => (
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

                {currentRows.length > visibleCount && (
                  <div className="show-more-wrap">
                    <button className="btn btn-outline-red show-more-btn" onClick={() => setVisibleCount(prev => prev + 100)}>
                      Show More ({currentRows.length - visibleCount} Remaining)
                    </button>
                  </div>
                )}

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
                    <div className="qs-item">📅 Data: 2025-26 CAP Round cutoffs</div>
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
