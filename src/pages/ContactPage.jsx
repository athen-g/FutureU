import { useState } from 'react'
import { Mail, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle'
import './ContactPage.css'

const FAQS = [
  { q: 'How accurate are the cutoff predictions?', a: 'FutureU uses real CAP Round cutoff data from CET Cell Maharashtra for 2024-25. The eligibility classification (Safe/Moderate/Reach) is based directly on comparing your percentile with the actual historical cutoffs.' },
  { q: 'Is FutureU completely free to use?', a: 'Yes — FutureU is 100% free with no registration required, no premium tiers, and no hidden features. All data and tools are open to all students.' },
  { q: 'How often is the cutoff data updated?', a: 'The data is updated whenever new CAP round cutoff lists are published by CET Cell Maharashtra. Currently we have 2024-25 CAP 1, 2, and 3 MH and AI cutoffs.' },
  { q: 'Can I get predictions for both MHT-CET and JEE?', a: 'FutureU currently focuses on MH-state cutoffs (MH seats). AI seats use JEE scores — this functionality can be extended with your JEE rank.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        {open ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
      </button>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  )
}

export default function ContactPage() {
  usePageTitle('Contact Us')
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.subject) e.subject = 'Please select a subject'
    if (!form.message || form.message.length < 20) e.message = 'Message must be at least 20 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setSubmitted(true)
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(er => ({ ...er, [k]: undefined })) }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <div>
            <h1>We're Here to Help</h1>
            <p>Have questions about college admissions? Reach out and we'll get back to you.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center', marginBottom:32}}>Reach Out to Us</h2>
          <div className="contact-card">
            <div className="contact-icon"><Mail size={24}/></div>
            <h3>Email Us</h3>
            <p>Get detailed answers to your questions</p>
            <a href="mailto:support@futureu.in" className="contact-email">support@futureu.in</a>
            <p style={{fontSize:12,color:'var(--color-text-faint)',marginTop:4}}>We respond within 24 hours</p>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container contact-form-wrap">
          <h2 className="section-title" style={{textAlign:'center', marginBottom:32}}>Send Us a Message</h2>
          {submitted ? (
            <div className="success-state">
              <CheckCircle size={48} color="var(--color-success)"/>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your Full Name"
                    value={form.name} onChange={e => set('name', e.target.value)}/>
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" placeholder="your.email@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)}/>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="Your Phone Number"
                    value={form.phone} onChange={e => set('phone', e.target.value)}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className={`form-input form-select ${errors.subject ? 'error' : ''}`}
                    value={form.subject} onChange={e => set('subject', e.target.value)}>
                    <option value="">Select a subject</option>
                    <option>College Admission Query</option>
                    <option>Data Correction</option>
                    <option>Technical Issue</option>
                    <option>General Feedback</option>
                    <option>Partnership</option>
                  </select>
                  {errors.subject && <span className="field-error">{errors.subject}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                  rows={5} placeholder="Tell us how we can help you..."
                  value={form.message} onChange={e => set('message', e.target.value)}/>
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
            </form>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container faq-section">
          <h2 className="section-title" style={{textAlign:'center', marginBottom:32}}>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => <FAQItem key={i} {...faq}/>)}
          </div>
        </div>
      </section>
    </div>
  )
}
