import { useParams, Link } from 'react-router-dom'
import { useState, useMemo, Fragment } from 'react'
import { MapPin, Heart, Share2, ExternalLink, Info, ChevronRight } from 'lucide-react'
import { getCollege, getAllColleges, getCityFromCollegeName, normalizeStatus } from '../utils/dataLoader'
import { predictCutoff, getHistoricalCutoffs, classifyEligibility, eligibilityColor, eligibilityBg, eligibilityLabel, calculateChance, getChanceStatus, getDefaultCutoffs } from '../utils/eligibility'
import { getRelevantCategoryCodes } from '../utils/categoryMapping'
import { useApp } from '../context/AppContext'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { usePageTitle } from '../hooks/usePageTitle'
import './CollegeDetailPage.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const TABS = ['Courses & Cutoffs', 'Seat Matrix', 'Location & Contact', 'College Information']

function StatCard({ label, value, sub }) {
  return (
    <div className="detail-stat">
      <div className="detail-stat-label">{label}</div>
      <div className="detail-stat-value">{value}</div>
      {sub && <div className="detail-stat-sub">{sub}</div>}
    </div>
  )
}

function CutoffChart({ history, branchName, categoryCode, capRound }) {
  if (!history || history.length < 2) return <p className="no-chart">Not enough historical data for chart</p>
  const roundText = capRound === 'all' ? 'Latest' : capRound.toUpperCase()
  const data = {
    labels: history.map(h => h.year),
    datasets: [{
      label: `${roundText} Cutoff %ile (${categoryCode})`,
      data: history.map(h => h.cap3),
      borderColor: '#FF0000',
      backgroundColor: 'rgba(255,0,0,0.1)',
      tension: 0.3,
      pointBackgroundColor: '#FF0000',
      pointRadius: 5,
    }]
  }
  const options = {
    responsive: true, plugins: { legend: { display: false } },
    scales: {
      y: { min: Math.max(0, Math.min(...history.map(h => h.cap3)) - 2), max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  }
  return (
    <div className="cutoff-chart">
      <div className="chart-title">{branchName} — Historical Cutoff Trend</div>
      <Line data={data} options={options}/>
    </div>
  )
}

function SeatCell({ value, className }) {
  const isZeroOrDash = value === null || value === undefined || value === 0 || value === '0' || value === '—' || value === '';
  const displayVal = isZeroOrDash ? '—' : value;
  return (
    <td className={`${className || ''} ${isZeroOrDash ? 'seat-zero' : 'seat-value'}`}>
      {displayVal}
    </td>
  );
}

export default function CollegeDetailPage() {
  const { collegeCode } = useParams()
  const college = useMemo(() => getCollege(collegeCode), [collegeCode])
  const [activeTab, setActiveTab] = useState(0)
  const [expandedBranch, setExpandedBranch] = useState(null)
  const { addToShortlist, removeFromShortlist, isShortlisted, shortlist } = useApp()
  usePageTitle(college ? `${college.college_name} — Cutoffs & Seats` : 'College Not Found')

  // Use stored student percentile from session if available
  const [studentPercentile] = useState(() => {
    try { return parseFloat(sessionStorage.getItem('futureu_percentile')) || null } catch { return null }
  })

  if (!college) {
    return (
      <div className="container" style={{padding:'80px 24px', textAlign:'center'}}>
        <h2>College not found</h2>
        <p style={{color:'var(--color-text-muted)', marginTop:8}}>College code: {collegeCode}</p>
        <Link to="/colleges" className="btn btn-primary" style={{marginTop:24}}>Browse All Colleges</Link>
      </div>
    )
  }

  const city = getCityFromCollegeName(college.college_name, college.college_code)
  const normStatus = normalizeStatus(college.status)
  const branches = Object.values(college.branches || {})

  // Extract all unique category codes present in college branch cutoffs and map to labels
  const availableCategories = useMemo(() => {
    const cats = {}
    for (const branch of branches) {
      if (!branch.cutoffs) continue
      for (const yearData of Object.values(branch.cutoffs)) {
        for (const capData of Object.values(yearData)) {
          for (const type of ['mh', 'ai']) {
            const catMap = capData?.[type]
            if (catMap) {
              for (const [code, info] of Object.entries(catMap)) {
                if (!cats[code]) {
                  cats[code] = info.category_label || code
                }
              }
            }
          }
        }
      }
    }
    return Object.entries(cats)
      .map(([code, label]) => ({ code, label }))
      .sort((a, b) => a.code.localeCompare(b.code))
  }, [branches])

  const [selectedCategory, setSelectedCategory] = useState(() => {
    // 1. Get student category codes from sessionStorage if available
    let studentCodes = []
    try {
      const category = sessionStorage.getItem('futureu_category')
      if (category) {
        const gender = sessionStorage.getItem('futureu_gender') || 'Male'
        const domicile = sessionStorage.getItem('futureu_domicile') || 'State Level'
        const tfws = sessionStorage.getItem('futureu_tfws') === 'true'
        const ews = sessionStorage.getItem('futureu_ews') === 'true'
        const pwd = sessionStorage.getItem('futureu_pwd') === 'true'
        studentCodes = getRelevantCategoryCodes({ category, gender, domicile, tfws, ews, pwd })
      }
    } catch (e) {}

    // 2. Build quick set of available codes for fast lookup
    const availableCodes = new Set(availableCategories.map(c => c.code))

    // 3. Find the first student code that is available, prioritizing reservation categories over open fallbacks
    const prioritizedCodes = [
      ...studentCodes.filter(c => !c.includes('OPEN')),
      ...studentCodes.filter(c => c.includes('OPEN'))
    ]
    for (const code of prioritizedCodes) {
      if (availableCodes.has(code)) {
        return code
      }
    }

    // 4. Fallback chain if no student code matched
    const defaultChain = ['GOPENS', 'GOPENH', 'GOPENO', 'LOPENS', 'LOPENH', 'LOPENO']
    for (const code of defaultChain) {
      if (availableCodes.has(code)) {
        return code
      }
    }

    // 5. Absolute fallback: first available category in the set, or GOPENS
    if (availableCodes.size > 0) {
      return Array.from(availableCodes).sort()[0]
    }
    return 'GOPENS'
  })
  const [selectedCapRound, setSelectedCapRound] = useState('all')

  // Quick stats calculations
  const totalSeats = branches.reduce((s, b) => s + (b.total_seats || 0), 0)
  const allCutoffs = branches.flatMap(b => {
    const history = getHistoricalCutoffs(b, selectedCategory, selectedCapRound)
    return history.map(h => h.cap3)
  }).filter(v => v != null)
  const cutoffRange = allCutoffs.length > 0
    ? `${Math.min(...allCutoffs).toFixed(2)} – ${Math.max(...allCutoffs).toFixed(2)}`
    : '—'

  const similarColleges = getAllColleges()
    .filter(c => c.college_code !== college.college_code && getCityFromCollegeName(c.college_name, c.college_code) === city)
    .slice(0, 3)

  return (
    <div className="college-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <span><Link to="/">Home</Link></span>
          <ChevronRight size={14}/>
          <span><Link to="/colleges">Colleges</Link></span>
          <ChevronRight size={14}/>
          <span className="bc-current">{college.college_name}</span>
        </div>
      </div>

      {/* Header */}
      <div className="detail-header">
        <div className="container detail-header-inner">
          <div className="detail-logo-name">
            <div className="detail-logo">
              {college.college_name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0,3).map(w => w[0]).join('')}
            </div>
            <div className="detail-name-block">
              <h1>{college.college_name}</h1>
              <div className="detail-meta">
                {city && <span className="detail-city"><MapPin size={13}/> {city}, Maharashtra</span>}
                <span className="status-pill">{normStatus}</span>
                {college.is_autonomous && <span className="auto-pill">Autonomous</span>}
              </div>
            </div>
          </div>
          <div className="detail-actions">
            <button className="detail-action-btn" onClick={() => {
              const firstBranch = branches[0]
              if (firstBranch) {
                if (isShortlisted(college.college_code, firstBranch.branch_code)) {
                  removeFromShortlist(college.college_code, firstBranch.branch_code)
                } else {
                  addToShortlist({ collegeCode: college.college_code, branchCode: firstBranch.branch_code, collegeName: college.college_name, branchName: firstBranch.branch_name })
                }
              }
            }}>
              <Heart size={15}/> Wishlist
            </button>
            <button className="detail-action-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
              <Share2 size={15}/> Share
            </button>
            <a className="detail-action-btn" href={`https://maps.google.com/maps?q=${encodeURIComponent(college.college_name)}`} target="_blank" rel="noopener noreferrer">
              <MapPin size={15}/> Directions
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="detail-stats-bar">
        <div className="container detail-stats-inner">
          {studentPercentile && (
            <StatCard label="Admission Probability" value={`${studentPercentile}%ile entered`} sub="See table below"/>
          )}
          <StatCard label="Total Seats" value={totalSeats || '—'} sub="All branches"/>
          <StatCard label="MHT-CET Cutoff Range" value={cutoffRange} sub="OPEN State Level %ile"/>
          <StatCard label="College Code" value={college.college_code} sub="DTE Code"/>
          <StatCard label="Branches" value={branches.length} sub="Available"/>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs-bar">
        <div className="container">
          <div className="detail-tabs">
            {TABS.map((t, i) => (
              <button key={t} className={`detail-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container detail-body">
        {/* Tab 0: Courses & Cutoffs */}
        {activeTab === 0 && (
          <div className="tab-content">
            <div className="tab-header" style={{ gap: '16px', alignItems: 'center' }}>
              <h2>Available Engineering Branches</h2>
              <div className="cutoff-filters">
                <div className="filter-group">
                  <label htmlFor="category-select" className="filter-label">Reservation Category:</label>
                  <select
                    id="category-select"
                    className="form-input form-select category-select-input"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    {availableCategories.map(cat => (
                      <option key={cat.code} value={cat.code}>
                        {cat.code} — {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="cap-round-select" className="filter-label">CAP Round:</label>
                  <select
                    id="cap-round-select"
                    className="form-input form-select category-select-input"
                    style={{ minWidth: '180px', maxWidth: '240px' }}
                    value={selectedCapRound}
                    onChange={e => setSelectedCapRound(e.target.value)}
                  >
                    <option value="all">All Rounds (Latest)</option>
                    <option value="cap1">CAP Round 1</option>
                    <option value="cap2">CAP Round 2</option>
                    <option value="cap3">CAP Round 3</option>
                    <option value="cap4">CAP Round 4</option>
                  </select>
                </div>
                {studentPercentile && (
                  <div className="student-score-pill">Your score: {studentPercentile} %ile</div>
                )}
              </div>
            </div>

            <div className="branches-table-wrap">
              <table className="branches-table">
                <thead>
                  <tr>
                    <th>Branch Name</th>
                    <th>Seats</th>
                    <th>2025-26 Cutoff ({selectedCapRound === 'all' ? 'Latest' : selectedCapRound.toUpperCase()})</th>
                    <th>Predicted</th>
                    {studentPercentile && <th>Your Probability</th>}
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map(branch => {
                    const hist = getHistoricalCutoffs(branch, selectedCategory, selectedCapRound)
                    const predicted = predictCutoff(hist)
                    const prev2025 = hist.find(h => h.year === '2025-26')?.cap3
                    const chance = studentPercentile && predicted !== null
                      ? calculateChance(studentPercentile, predicted) : null
                    const status = getChanceStatus(chance)
                    const isExpanded = expandedBranch === branch.branch_code
                    const roundLabel = selectedCapRound === 'all' ? 'Latest' : selectedCapRound.toUpperCase()

                    return (
                      <Fragment key={branch.branch_code}>
                        <tr className="branch-tr"
                          onClick={() => setExpandedBranch(isExpanded ? null : branch.branch_code)}
                          style={{cursor:'pointer'}}>
                          <td className="branch-name-cell">
                            <span className="branch-name">{branch.branch_name}</span>
                            <span className="branch-code">{branch.branch_code}</span>
                          </td>
                          <td>{branch.total_seats || '—'}</td>
                          <td>{prev2025 != null ? prev2025.toFixed(2) + '%' : '—'}</td>
                          <td>
                            {predicted != null
                              ? <strong>{predicted.toFixed(2)}%</strong>
                              : <span style={{color:'var(--color-text-faint)'}}>—</span>}
                          </td>
                          {studentPercentile && (
                            <td>
                              {chance !== null && status !== 'unknown'
                                ? <span className="prob-badge" style={{background: eligibilityBg(status), color: eligibilityColor(status)}}>
                                    {chance}%
                                  </span>
                                : '—'}
                            </td>
                          )}
                          <td>
                            <span className="trend-icon">
                              {hist.length >= 2
                                ? hist[hist.length-1].cap3 >= hist[hist.length-2].cap3 ? '↑' : '↓'
                                : '—'}
                            </span>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="branch-expanded">
                            <td colSpan={studentPercentile ? 6 : 5}>
                              <div className="expanded-content">
                                <div className="hist-cutoffs">
                                  <div className="hist-title">Historical Cutoffs ({selectedCategory} - {roundLabel})</div>
                                  <div className="hist-grid">
                                    {['2022-23','2023-24','2024-25','2025-26'].map(yr => {
                                      const val = hist.find(h => h.year === yr)?.cap3
                                      return (
                                        <div key={yr} className="hist-cell">
                                          <div className="hist-year">{yr} ({roundLabel})</div>
                                          <div className="hist-val">{val != null ? val.toFixed(2) + '%' : '—'}</div>
                                        </div>
                                      )
                                    })}
                                    <div className="hist-cell">
                                      <div className="hist-year">Predicted</div>
                                      <div className="hist-val" style={{color:'#FF0000'}}>{predicted != null ? predicted.toFixed(2) + '%' : '—'}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="expanded-chart">
                                  <CutoffChart history={hist} branchName={branch.branch_name} categoryCode={selectedCategory} capRound={selectedCapRound}/>
                                </div>
                                <div className="expanded-seats">
                                  <div className="hist-title">Seat Details</div>
                                  <div className="seats-mini-grid">
                                    <div><span>Total</span><strong>{branch.total_seats || '—'}</strong></div>
                                    <div><span>TFWS</span><strong>{branch.tfws_seats || '—'}</strong></div>
                                    <div><span>EWS</span><strong>{branch.ews_seats || '—'}</strong></div>
                                    <div><span>AI</span><strong>{branch.ai_seats || '—'}</strong></div>
                                    <div><span>PWD</span><strong>{branch.pwd_seats || '—'}</strong></div>
                                    <div><span>DEF</span><strong>{branch.def_seats || '—'}</strong></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="cutoff-note">
              <Info size={13}/> Cutoffs and predictions are shown for the reservation category <strong>{selectedCategory}</strong> and CAP round <strong>{selectedCapRound === 'all' ? 'All (Latest)' : selectedCapRound.toUpperCase()}</strong>. Click any branch to expand historical data, seat counts, and trend chart.
            </p>
          </div>
        )}

        {/* Tab 1: Seat Matrix */}
        {activeTab === 1 && (
          <div className="tab-content">
            <h2 className="tab-section-title">Seat Matrix</h2>
            <div className="seat-matrix-wrap">
              <table className="seat-matrix-table">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th className="col-total">Total</th>
                    <th className="col-open">OPEN G</th>
                    <th className="col-open">OPEN L</th>
                    <th className="col-scst">SC G</th>
                    <th className="col-scst">SC L</th>
                    <th className="col-scst">ST G</th>
                    <th className="col-scst">ST L</th>
                    <th className="col-obc">OBC G</th>
                    <th className="col-obc">OBC L</th>
                    <th className="col-obc">SEBC G</th>
                    <th className="col-obc">SEBC L</th>
                    <th className="col-vjnt">VJ G</th>
                    <th className="col-vjnt">NT1 G</th>
                    <th className="col-vjnt">NT2 G</th>
                    <th className="col-vjnt">NT3 G</th>
                    <th className="col-ews">EWS</th>
                    <th className="col-tfws">TFWS</th>
                    <th className="col-pwd">PWD</th>
                    <th className="col-def">DEF</th>
                    <th className="col-ai">AI</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map(b => {
                    const ds = b.decoded_seats || {}
                    return (
                      <tr key={b.branch_code}>
                        <td className="seat-branch-name">
                          <div>{b.branch_name}</div>
                          <span className="branch-code">{b.branch_code}</span>
                        </td>
                        <td className="col-total"><strong>{b.total_seats || '—'}</strong></td>
                        <SeatCell value={ds.G_OPEN} className="col-open" />
                        <SeatCell value={ds.L_OPEN} className="col-open" />
                        <SeatCell value={ds.G_SC} className="col-scst" />
                        <SeatCell value={ds.L_SC} className="col-scst" />
                        <SeatCell value={ds.G_ST} className="col-scst" />
                        <SeatCell value={ds.L_ST} className="col-scst" />
                        <SeatCell value={ds.G_OBC} className="col-obc" />
                        <SeatCell value={ds.L_OBC} className="col-obc" />
                        <SeatCell value={ds.G_SEBC} className="col-obc" />
                        <SeatCell value={ds.L_SEBC} className="col-obc" />
                        <SeatCell value={ds.G_VJ} className="col-vjnt" />
                        <SeatCell value={ds.G_NT1} className="col-vjnt" />
                        <SeatCell value={ds.G_NT2} className="col-vjnt" />
                        <SeatCell value={ds.G_NT3} className="col-vjnt" />
                        <SeatCell value={b.ews_seats} className="col-ews" />
                        <SeatCell value={b.tfws_seats} className="col-tfws" />
                        <SeatCell value={b.pwd_seats} className="col-pwd" />
                        <SeatCell value={b.def_seats} className="col-def" />
                        <SeatCell value={b.ai_seats} className="col-ai" />
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Location */}
        {activeTab === 2 && (
          <div className="tab-content">
            <h2 className="tab-section-title">Location & Contact</h2>
            <div className="location-grid">
              <div className="map-embed-wrap">
                <iframe
                  title="College Location"
                  width="100%" height="300"
                  frameBorder="0" loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(college.college_name + ' ' + city + ' Maharashtra')}&output=embed`}
                  style={{borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)'}}
                />
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(college.college_name + ' ' + city + ' Maharashtra')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline-red btn-sm" style={{marginTop:12, display:'inline-flex'}}
                >
                  <ExternalLink size={14}/> View on Google Maps
                </a>
              </div>
              <div className="address-block">
                <h3>Address</h3>
                <p>{college.college_name}</p>
                {city && <p>{city}, Maharashtra</p>}
                <div className="address-meta">
                  <div><strong>DTE Code:</strong> {college.college_code}</div>
                  {college.status && college.status !== 'Unknown' && (
                    <div><strong>Status:</strong> {college.status}</div>
                  )}
                  {branches[0]?.home_university && branches[0].home_university !== 'Unknown' && (
                    <div><strong>Affiliating University:</strong> {branches[0].home_university}</div>
                  )}
                  <div><strong>Autonomous:</strong> {college.is_autonomous ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: College Information */}
        {activeTab === 3 && (
          <div className="tab-content">
            <h2 className="tab-section-title">College Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">College Name</div>
                <div className="info-val">{college.college_name}</div>
              </div>
              <div className="info-card">
                <div className="info-label">DTE College Code</div>
                <div className="info-val">{college.college_code}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Location</div>
                <div className="info-val">{city || '—'}, Maharashtra</div>
              </div>
              <div className="info-card">
                <div className="info-label">Institute Type</div>
                <div className="info-val">{normStatus}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Status (Official)</div>
                <div className="info-val">{college.status || '—'}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Autonomous</div>
                <div className="info-val">{college.is_autonomous ? 'Yes — Autonomous Institute' : 'No'}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Affiliating University</div>
                <div className="info-val">{branches[0]?.home_university && branches[0].home_university !== 'Unknown' ? branches[0].home_university : 'Information not available'}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Total Branches</div>
                <div className="info-val">{branches.length}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Total Seats</div>
                <div className="info-val">{totalSeats || '—'}</div>
              </div>
              <div className="info-card info-card--full">
                <div className="info-label">Data Note</div>
                <div className="info-val" style={{color:'var(--color-text-muted)', fontSize:13}}>
                  Detailed information such as fees, NAAC grade, NIRF rank, placement data, and facilities will be added in future updates. All cutoff data is sourced from CET Cell Maharashtra for 2025-26.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Similar Colleges */}
      {similarColleges.length > 0 && (
        <div className="similar-section">
          <div className="container">
            <h2 className="tab-section-title">Similar Colleges You May Consider</h2>
            <div className="similar-grid">
              {similarColleges.map(sc => {
                const scCity = getCityFromCollegeName(sc.college_name, sc.college_code)
                const scStatus = normalizeStatus(sc.status)
                return (
                  <div key={sc.college_code} className="similar-card">
                    <div className="similar-logo">
                      {sc.college_name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0,3).map(w => w[0]).join('')}
                    </div>
                    <div className="similar-info">
                      <div className="similar-name">{sc.college_name}</div>
                      <div className="similar-meta">
                        {scCity && <span><MapPin size={11}/> {scCity}</span>}
                        <span className="status-pill" style={{fontSize:10}}>{scStatus}</span>
                      </div>
                    </div>
                    <Link to={`/college/${sc.college_code}`} className="btn btn-outline-red btn-sm" style={{marginTop:12, width:'100%', justifyContent:'center'}}>
                      View Details
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
