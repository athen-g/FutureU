import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle'
import './FAQPage.css'

const FAQS = {
  'About FutureU': [
    { q: 'What is FutureU?', a: 'FutureU is a free college shortlisting tool for Maharashtra engineering aspirants. It helps you find eligible colleges based on your MHT-CET percentile, category, and preferences using official CET Cell cutoff data.' },
    { q: 'Is FutureU affiliated with DTE Maharashtra or CET Cell?', a: 'No. FutureU is an independent tool built by students. Data is sourced from official CET Cell publications but FutureU is not affiliated with or endorsed by any government body.' },
    { q: 'Is there any cost to use FutureU?', a: 'Absolutely not. FutureU is 100% free with no registration, no premium tier, and no hidden charges.' },
  ],
  'MHT-CET & CAP Process': [
    { q: 'What is the difference between CAP Round 1, 2, and 3?', a: 'CAP rounds are successive allotment rounds. Round 1 fills most seats; Round 2 & 3 fill remaining seats with potentially different cutoffs. FutureU lets you view cutoffs for any round.' },
    { q: 'What does "State Level" vs "Home University" domicile mean?', a: 'State Level (suffix S) seats are open to all Maharashtra domicile students. Home University (suffix H) seats are reserved for students from the college\'s university jurisdiction. Other University (O) covers the rest.' },
    { q: 'What is TFWS?', a: 'Tuition Fee Waiver Scheme — 5% supernumerary seats where tuition fee is waived. Has its own merit-based cutoff (usually higher than regular). Check the TFWS box if you are eligible.' },
    { q: 'How do Ladies seats work?', a: 'Ladies (L prefix) seats are supernumerary seats exclusively for female students. Female students who don\'t get a seat through OPEN can use these. FutureU automatically adds L-category codes when you select Female gender.' },
  ],
  'Using FutureU': [
    { q: 'How is the admission probability percentage calculated?', a: 'FutureU uses a logistic regression formula to calculate your chance (0% to 100%) based on how your percentile compares to the predicted cutoff. A higher difference results in a higher percentage chance (75%+ is Safe, 50-74% is Moderate, 15-49% is Reach, and <15% is Unlikely).' },
    { q: 'Which CAP round cutoff should I use?', a: 'CAP Round 3 cutoffs are generally the most conservative (lowest) since seats are filled over three rounds. Use CAP 3 for a realistic picture. Use CAP 1 to see initial demand-based cutoffs.' },
    { q: 'What if my preferred branch or college doesn\'t show up?', a: 'Try removing branch and city filters. Some colleges may not have cutoff data for all rounds — this shows as "—" in results. The college may still have seats.' },
    { q: 'Can I export or save my shortlist?', a: 'You can add branches to your shortlist using the heart icon. The shortlist is saved for your current session. Export functionality can be added — please contact us if you need this.' },
  ],
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </button>
      {open && <div className="faq-a">{a}</div>}
    </div>
  )
}

export default function FAQPage() {
  usePageTitle('FAQ — Frequently Asked Questions')
  return (
    <div className="faq-page">
      <div className="faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about FutureU and the MHT-CET CAP process.</p>
        </div>
      </div>
      <section className="section">
        <div className="container faq-container">
          {Object.entries(FAQS).map(([group, items]) => (
            <div key={group} className="faq-group">
              <h2 className="faq-group-title">{group}</h2>
              <div className="faq-list">
                {items.map((item, i) => <FAQItem key={i} {...item}/>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
