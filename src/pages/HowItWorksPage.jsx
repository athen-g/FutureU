import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle'
import './HowItWorksPage.css'

const GLOSSARY = [
  { term: 'CAP', def: 'Centralized Admission Process — the admission system for engineering colleges in Maharashtra managed by DTE.' },
  { term: 'MHT-CET', def: 'Maharashtra Common Entrance Test — the state-level entrance exam for engineering admission.' },
  { term: 'Percentile', def: 'A score indicating the percentage of candidates who scored below you. Higher is better.' },
  { term: 'GOPENS', def: 'General + Open category + State Level — the most common cutoff code seen in results.' },
  { term: 'TFWS', def: 'Tuition Fee Waiver Scheme — seats where the tuition fee is waived, but a merit cutoff applies.' },
  { term: 'EWS', def: 'Economically Weaker Section — 10% reservation for general category students with family income below ₹8 lakh/year.' },
  { term: 'SEBC', def: 'Socially and Educationally Backward Class — also known as OBC-C in some contexts.' },
  { term: 'Home University', def: 'Seats reserved for students from the same university jurisdiction as the college.' },
  { term: 'State Level', def: 'Seats open to all Maharashtra domicile students regardless of their home university.' },
]

function Accordion({ term, def }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="accord-item">
      <button className="accord-q" onClick={() => setOpen(o => !o)}>
        <span className="accord-term">{term}</span>
        {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </button>
      {open && <div className="accord-def">{def}</div>}
    </div>
  )
}

export default function HowItWorksPage() {
  usePageTitle('How It Works — MHT-CET CAP Process')
  return (
    <div className="hiw-page">
      <div className="hiw-hero">
        <div className="container">
          <h1>How FutureU Works</h1>
          <p>Everything you need to know about the MHT-CET CAP process and how FutureU helps you navigate it.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{marginBottom:32}}>How to Use FutureU</h2>
          <div className="cap-steps">
            {[
              { step: '1', title: 'Enter Your Scores', desc: 'Input your MHT-CET or JEE percentile/rank. If you enter a percentile, our candidate model automatically projects your state merit rank for the 2026-27 cycle.' },
              { step: '2', title: 'Apply Preferences & Filters', desc: 'Filter recommendations by selecting target branch preferences (e.g. CS, IT, E&TC), specific cities (e.g. Pune, Mumbai), and college type/autonomy.' },
              { step: '3', title: 'Analyze Recommendations', desc: 'Review lists categorized by Safe, Moderate, Reach, or Unlikely, dynamically sorted by previous cutoff ranks. Specific reservation cutoffs (OBC, EWS, TFWS) are automatically prioritized if selected.' },
              { step: '4', title: 'Download & Submit Preference List', desc: 'Shortlist target choices, verify seat matrices, and download a finalized custom preference list PDF to refer to during official State CET portal submissions.' },
            ].map((s, i) => (
              <div key={i} className="cap-step">
                <div className="cap-step-num">{s.step}</div>
                <div className="cap-step-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <h2 className="section-title" style={{marginBottom:12}}>Understanding Admission Probability</h2>
          <p style={{color:'var(--color-text-muted)',marginBottom:32}}>FutureU calculates the percentage chance of getting each college-branch combination based on how your percentile compares to the predicted cutoff.</p>
          <div className="smr-grid">
            <div className="smr-card smr-safe">
              <div className="smr-label">✅ Safe (75% – 99%)</div>
              <div className="smr-rule">Your percentile is <strong>1.3+ above</strong> the predicted cutoff</div>
              <p>Very high probability of getting the seat. Include some options in this range to guarantee admission.</p>
            </div>
            <div className="smr-card smr-moderate">
              <div className="smr-label">🟡 Moderate (50% – 74%)</div>
              <div className="smr-rule">Your percentile is <strong>0 to 1.3 above</strong> the predicted cutoff</div>
              <p>Good chance of admission. These are your target options — include several in this range in your list.</p>
            </div>
            <div className="smr-card smr-reach">
              <div className="smr-label">🔴 Reach (15% – 49%)</div>
              <div className="smr-rule">Your percentile is <strong>0 to 2.0 below</strong> the predicted cutoff</div>
              <p>Lower probability but possible — cutoffs fluctuate between rounds. List a few options in this range.</p>
            </div>
            <div className="smr-card smr-unlikely">
              <div className="smr-label">❌ Unlikely (1% – 14%)</div>
              <div className="smr-rule">Your percentile is <strong>more than 2.0 below</strong> the predicted cutoff</div>
              <p>Very low probability of admission. Do not rely heavily on these choices.</p>
            </div>
          </div>

          {/* Math Modeling Section */}
          <div className="math-modeling-section" style={{ marginTop: '56px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.01em' }}>Prediction Model Mathematics</h3>
            
            <div className="math-formula-grid">
              <div className="math-card">
                <h4>1. Weighted Historical Trend Prediction</h4>
                <p className="math-card-desc">Calculates the predicted 2026 cutoff rank by applying recency weighting factors across preceding admission years:</p>
                <div className="math-equation">
                  R<sub>pred</sub> = &Sigma; (w<sub>t</sub> &middot; R<sub>t</sub>) / &Sigma; w<sub>t</sub>
                </div>
                <div className="math-legend">
                  <span><strong>R<sub>pred</sub></strong>: Predicted 2026 Cutoff Rank</span>
                  <span><strong>R<sub>t</sub></strong>: Historical Cutoff Rank in year <em>t</em></span>
                  <span><strong>w<sub>t</sub></strong>: Exponential weight &lambda;<sup>(t - base_year)</sup></span>
                </div>
                <div className="math-example-box" style={{ marginTop: '16px', padding: '12px', background: 'var(--color-surface-offset)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)', fontSize: '12.5px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}>Example Calculation:</strong>
                  If cutoff ranks were 5,400 (2023), 5,200 (2024), and 4,900 (2025):
                  <div style={{ margin: '6px 0', fontFamily: 'monospace' }}>
                    Weighted Avg = (5400*1 + 5200*2 + 4900*3)/6 = 5,083
                  </div>
                  <div style={{ fontFamily: 'monospace' }}>
                    Trend Delta = (4900 - 5400)/2 = -250 (rising demand)
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <strong>R<sub>pred</sub></strong> = 5,083 + (-250 * 0.4) &approx; <strong>4,983</strong>
                  </div>
                </div>
              </div>

              <div className="math-card">
                <h4>2. Sigmoid Power Curve Admission Chance</h4>
                <p className="math-card-desc">Computes the admission allocation probability based on the ratio of candidate rank vs predicted cutoff rank:</p>
                <div className="math-equation">
                  P(r, c) = 100 / (1 + (r / c)<sup>10</sup>)
                </div>
                <div className="math-legend">
                  <span><strong>P(r, c)</strong>: Admission Probability Percentage</span>
                  <span><strong>r</strong>: Student state merit rank</span>
                  <span><strong>c</strong>: Predicted cutoff rank (R<sub>pred</sub>)</span>
                </div>
                <div className="math-example-box" style={{ marginTop: '16px', padding: '12px', background: 'var(--color-surface-offset)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)', fontSize: '12.5px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}>Example Allocation Chances:</strong>
                  For a predicted cutoff rank of <strong>5,000</strong>:
                  <ul style={{ paddingLeft: '16px', margin: '4px 0 0', lineHeight: '1.4' }}>
                    <li><strong>Rank 5,000</strong> (100% match): 100 / (1 + 1<sup>10</sup>) = <strong>50% (Moderate)</strong></li>
                    <li><strong>Rank 4,000</strong> (20% better): 100 / (1 + 0.8<sup>10</sup>) &approx; <strong>90% (Safe)</strong></li>
                    <li><strong>Rank 6,000</strong> (20% worse): 100 / (1 + 1.2<sup>10</sup>) &approx; <strong>14% (Unlikely)</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{marginBottom:12}}>Reservation Categories</h2>
          <p style={{color:'var(--color-text-muted)',marginBottom:32}}>Maharashtra engineering admissions have a complex reservation structure. Here's how the key categories work.</p>
          <div className="cat-grid">
            {[
              { code: 'OPEN', label: 'Open / Unreserved', pct: 'No fixed %', desc: 'All students compete. Highest cutoffs.' },
              { code: 'OBC', label: 'Other Backward Class', pct: '19%', desc: 'Non-creamy layer certificate required.' },
              { code: 'SC', label: 'Scheduled Caste', pct: '13%', desc: 'Caste certificate required.' },
              { code: 'ST', label: 'Scheduled Tribe', pct: '7%', desc: 'Tribal certificate required.' },
              { code: 'SEBC', label: 'Socially & Educationally Backward Class', pct: '16%', desc: 'SEBC/OBC-C certificate required.' },
              { code: 'EWS', label: 'Economically Weaker Section', pct: '10%', desc: 'Annual income below ₹8L, general category.' },
              { code: 'TFWS', label: 'Tuition Fee Waiver Scheme', pct: '5% of seats', desc: 'Fee waiver for deserving students. Merit-based.' },
            ].map(c => (
              <div key={c.code} className="cat-card">
                <div className="cat-code">{c.code}</div>
                <div className="cat-label">{c.label}</div>
                <div className="cat-pct">{c.pct}</div>
                <div className="cat-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Sourcing and Verification */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 12 }}>Official Verification & Sourcing</h2>
          <p className="section-subtitle" style={{ marginBottom: 32 }}>All database cutoffs and parameters are fully audit-compliant and cross-referenced with official archives.</p>
          
          <div className="verification-grid">
            <a href="https://cetcell.mahacet.org/" target="_blank" rel="noopener noreferrer" className="verification-card">
              <h4>Official CET Cell Portal</h4>
              <p>Register, upload documents, check allocations, and submit preference lists on the government admission system.</p>
            </a>
            
            <a href="https://cetcell.mahacet.org/" target="_blank" rel="noopener noreferrer" className="verification-card">
              <h4>Historical Cutoffs Archives</h4>
              <p>Download official CAP Round 1, Round 2, and Round 3 cutoff lists published directly by the State CET Cell.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container glossary-section">
          <h2 className="section-title" style={{marginBottom:32}}>Glossary</h2>
          <div className="glossary-list">
            {GLOSSARY.map((g, i) => <Accordion key={i} {...g}/>)}
          </div>
        </div>
      </section>
    </div>
  )
}
