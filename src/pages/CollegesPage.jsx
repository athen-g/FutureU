import { useState, useMemo, useEffect } from 'react'
import { Search, MapPin, Heart, ExternalLink, ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllColleges, getCityFromCollegeName, normalizeStatus } from '../utils/dataLoader'
import { getHistoricalCutoffs, predictCutoff, getDefaultCutoffs } from '../utils/eligibility'
import { useApp } from '../context/AppContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './CollegesPage.css'

const PAGE_SIZE = 30

const SORT_OPTIONS = [
  { value: 'dte_asc', label: 'DTE Code' },
  { value: 'name_asc', label: 'A → Z' },
  { value: 'name_desc', label: 'Z → A' },
  { value: 'cutoff_desc', label: 'Cutoff: High → Low' },
  { value: 'cutoff_asc', label: 'Cutoff: Low → High' },
  { value: 'seats_desc', label: 'Seats: High → Low' },
  { value: 'seats_asc', label: 'Seats: Low → High' },
]

function getCollegeBestCutoff(college) {
  let best = null
  for (const b of Object.values(college.branches || {})) {
    const { history } = getDefaultCutoffs(b)
    const pred = predictCutoff(history)
    if (pred != null && (best === null || pred > best)) best = pred
  }
  return best
}

function getCollegeTotalSeats(college) {
  return Object.values(college.branches || {}).reduce((s, b) => s + (b.total_seats || 0), 0)
}

function CollegesPageSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="college-dir-card-skeleton">
      <div className="college-dir-header" style={{ marginBottom: '16px' }}>
        <div className="dir-logo skeleton-shimmer" style={{ background: 'transparent' }}></div>
        <div style={{ flex: 1 }}>
          <div className="skeleton-line skeleton-line--long skeleton-shimmer" style={{ height: '14px', marginBottom: '8px' }}></div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton-badge skeleton-shimmer" style={{ width: '60px', height: '18px' }}></div>
            <div className="skeleton-badge skeleton-shimmer" style={{ width: '40px', height: '18px' }}></div>
          </div>
        </div>
      </div>
      
      <div className="college-dir-stats" style={{ marginBottom: '16px' }}>
        <div className="dir-stat">
          <div className="skeleton-line skeleton-shimmer" style={{ width: '24px', height: '12px', margin: '0 auto 6px auto' }}></div>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '40px', height: '10px', margin: '0 auto' }}></div>
        </div>
        <div className="dir-stat">
          <div className="skeleton-line skeleton-shimmer" style={{ width: '28px', height: '12px', margin: '0 auto 6px auto' }}></div>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '40px', height: '10px', margin: '0 auto' }}></div>
        </div>
        <div className="dir-stat">
          <div className="skeleton-line skeleton-shimmer" style={{ width: '32px', height: '12px', margin: '0 auto 6px auto' }}></div>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '40px', height: '10px', margin: '0 auto' }}></div>
        </div>
      </div>

      <div className="college-dir-branches" style={{ borderTop: '1px solid var(--color-divider)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[1, 2, 3].map(j => (
          <div key={j} className="dir-branch-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton-line skeleton-shimmer" style={{ width: '65%', height: '10px' }}></div>
            <div className="skeleton-line skeleton-shimmer" style={{ width: '15%', height: '10px' }}></div>
          </div>
        ))}
      </div>

      <div className="skeleton-button-block skeleton-shimmer" style={{ marginTop: '16px' }}></div>
    </div>
  ))
}

export default function CollegesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [autonomyFilter, setAutonomyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dte_asc')
  const [page, setPage] = useState(1)
  const { addToShortlist, removeFromShortlist, isShortlisted, isDataReady, loadAppData } = useApp()

  useEffect(() => {
    loadAppData()
  }, [loadAppData])

  usePageTitle('College Directory — 350+ Engineering Colleges in Maharashtra')

  const allColleges = useMemo(() => isDataReady ? getAllColleges() : [], [isDataReady])

  const types = useMemo(() => {
    const s = new Set(allColleges.map(c => normalizeStatus(c.status)).filter(Boolean))
    return ['All', ...s].sort()
  }, [allColleges])

  const filtered = useMemo(() => {
    const list = allColleges.filter(c => {
      const matchSearch = !search || c.college_name.toLowerCase().includes(search.toLowerCase()) || c.college_code.includes(search)
      const matchType = typeFilter === 'All' || normalizeStatus(c.status) === typeFilter
      const matchAuto = autonomyFilter === 'all' || (autonomyFilter === 'autonomous' ? c.is_autonomous : !c.is_autonomous)
      return matchSearch && matchType && matchAuto
    })

    // Apply sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'dte_asc':
          return a.college_code.localeCompare(b.college_code, undefined, { numeric: true })
        case 'name_asc':
          return a.college_name.localeCompare(b.college_name)
        case 'name_desc':
          return b.college_name.localeCompare(a.college_name)
        case 'cutoff_desc': {
          const ca = getCollegeBestCutoff(a) ?? -1
          const cb = getCollegeBestCutoff(b) ?? -1
          return cb - ca
        }
        case 'cutoff_asc': {
          const ca = getCollegeBestCutoff(a) ?? 999
          const cb = getCollegeBestCutoff(b) ?? 999
          return ca - cb
        }
        case 'seats_desc':
          return getCollegeTotalSeats(b) - getCollegeTotalSeats(a)
        case 'seats_asc':
          return getCollegeTotalSeats(a) - getCollegeTotalSeats(b)
        default:
          return 0
      }
    })

    return list
  }, [allColleges, search, typeFilter, autonomyFilter, sortBy])

  const paginated = filtered.slice(0, page * PAGE_SIZE)

  // Skeletons are rendered during dataset loading, ensuring immediate frame paint.

  return (
    <div className="colleges-page">
      <div className="container">
        <div className="colleges-header">
          <h1>College Directory</h1>
          <p>Browse all {allColleges.length}+ engineering colleges in Maharashtra with cutoff data</p>
        </div>

        <div className="colleges-toolbar">
          <div className="toolbar-top-row">
            <div className="search-wrap">
              <Search size={16} className="search-icon"/>
              <input className="search-input" placeholder="Search by college name or DTE code..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}/>
            </div>
            <div className="sort-wrap">
              <ArrowUpDown size={14} className="sort-icon"/>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1) }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="type-filters">
              {types.map(t => (
                <button key={t} className={`chip ${typeFilter === t ? 'active' : ''}`}
                  onClick={() => { setTypeFilter(t); setPage(1) }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="auto-toggle">
              {[['all','All'],['autonomous','Autonomous'],['non_autonomous','Non-Auto']].map(([v,l]) => (
                <button key={v} className={`chip ${autonomyFilter === v ? 'active' : ''}`}
                  onClick={() => { setAutonomyFilter(v); setPage(1) }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="colleges-count">
          {isDataReady ? (
            `${filtered.length} colleges found`
          ) : (
            <span className="skeleton-shimmer" style={{ display: 'inline-block', width: '120px', height: '16px', borderRadius: '4px' }}></span>
          )}
        </div>

        <div className="colleges-grid">
          {isDataReady ? (
            paginated.map(college => {
              const city = getCityFromCollegeName(college.college_name, college.college_code)
              const status = normalizeStatus(college.status)
              const branchCount = Object.keys(college.branches || {}).length
              const totalSeats = Object.values(college.branches || {}).reduce((s, b) => s + (b.total_seats || 0), 0)

              return (
                <div key={college.college_code} className="college-dir-card">
                  <div className="college-dir-header">
                    <div className="dir-logo">
                      {college.college_name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0,3).map(w => w[0]).join('')}
                    </div>
                    <div>
                      <h3>{college.college_name}</h3>
                      <div className="college-dir-meta">
                        {city && <span><MapPin size={11}/> {city}</span>}
                        <span className="status-chip">{status}</span>
                        {college.is_autonomous && <span className="auto-chip">Auto</span>}
                      </div>
                    </div>
                  </div>
                  <div className="college-dir-stats">
                    <div className="dir-stat"><strong>{branchCount}</strong><span>Branches</span></div>
                    <div className="dir-stat"><strong>{totalSeats || '—'}</strong><span>Total Seats</span></div>
                    <div className="dir-stat"><strong>{college.college_code}</strong><span>DTE Code</span></div>
                  </div>
                  <div className="college-dir-branches">
                    {Object.values(college.branches || {}).slice(0, 3).map(b => (
                      <div key={b.branch_code} className="dir-branch-row">
                        <span className="dir-branch-name">{b.branch_name}</span>
                        <span className="dir-branch-seats">{b.total_seats || '—'} seats</span>
                        <button
                          className={`shortlist-btn ${isShortlisted(college.college_code, b.branch_code) ? 'active' : ''}`}
                          onClick={() => isShortlisted(college.college_code, b.branch_code)
                            ? removeFromShortlist(college.college_code, b.branch_code)
                            : addToShortlist({ collegeCode: college.college_code, branchCode: b.branch_code, collegeName: college.college_name, branchName: b.branch_name })
                          }
                        >
                          <Heart size={13} fill={isShortlisted(college.college_code, b.branch_code) ? 'currentColor' : 'none'}/>
                        </button>
                      </div>
                    ))}
                    {branchCount > 3 && <div className="dir-more">+{branchCount - 3} more branches</div>}
                  </div>
                  <Link to={`/college/${college.college_code}`} className="btn btn-outline-red btn-sm" style={{marginTop:14, width:'100%', justifyContent:'center', display:'flex'}}>
                    <ExternalLink size={13}/> View Details
                  </Link>
                </div>
              )
            })
          ) : (
            <CollegesPageSkeleton />
          )}
        </div>

        {isDataReady && paginated.length < filtered.length && (
          <div className="load-more-wrap">
            <button className="btn btn-secondary" onClick={() => setPage(p => p + 1)}>
              Load More ({filtered.length - paginated.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
