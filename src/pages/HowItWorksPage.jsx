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
          <h2 className="section-title" style={{marginBottom:32}}>The CAP Process</h2>
          <div className="cap-steps">
            {[
              { step: '1', title: 'MHT-CET / JEE Exam', desc: 'Students appear for MHT-CET (Maharashtra state exam) or JEE Main (for AI seats). Scores are converted to percentiles.' },
              { step: '2', title: 'Registration & Document Verification', desc: 'Students register on the CET Cell portal and submit documents for category, domicile, and income verification.' },
              { step: '3', title: 'Option Form Submission', desc: 'Students fill their preferred colleges and branches in priority order. This is the most critical step — choose wisely.' },
              { step: '4', title: 'CAP Round 1', desc: 'First allotment based on merit and preferences. Students can accept, freeze, or upgrade in subsequent rounds.' },
              { step: '5', title: 'CAP Round 2 & 3', desc: 'Further allotment rounds to fill remaining seats. Cutoffs may rise or fall depending on remaining seat availability.' },
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
