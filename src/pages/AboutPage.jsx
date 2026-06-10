import { usePageTitle } from '../hooks/usePageTitle'
import { Github, Mail, ExternalLink } from 'lucide-react'
import './AboutPage.css'

export default function AboutPage() {
  usePageTitle('About')

  return (
    <div className="about-page-new">
      <div className="about-container">
        {/* Header Hero */}
        <header className="about-header">
          <h1 className="about-title">About <span>FutureU</span></h1>
          <p className="about-lead">
            Demystifying the engineering college admission process with clean data, transparent metrics, and personalized prediction tools.
          </p>
        </header>

        <hr className="about-divider" />

        {/* Section: Project Mission */}
        <section className="about-section grid-2">
          <div className="section-label">Our Mission</div>
          <div className="section-content">
            <h2 className="content-heading">Empowering students to make informed college decisions through data-driven insights.</h2>
            <p>
              We believe every student deserves complete clarity in their college admission journey. The MHT-CET Centralized Admission Process (CAP) involves hundreds of colleges, thousands of academic branches, and dozens of distinct reservation categories. We decode this complex matrix so you don't have to.
            </p>
            <p>
              FutureU transforms raw official cutoffs into clear, actionable probabilities, allowing you to rank options, simulate allocation rounds, and draft your CAP preference form with complete confidence.
            </p>
          </div>
        </section>

        <hr className="about-divider" />

        {/* Section: Why Trust Us (Stats) */}
        <section className="about-section grid-2">
          <div className="section-label">Trust & Coverage</div>
          <div className="section-content">
            <h2 className="content-heading">Data-driven accuracy you can verify.</h2>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-num">354+</span>
                <span className="stat-desc">Maharashtra engineering colleges indexed and mapped.</span>
              </div>
              <div className="stat-row">
                <span className="stat-num">1,965+</span>
                <span className="stat-desc">Branch combinations tracked across CAP rounds.</span>
              </div>
              <div className="stat-row">
                <span className="stat-num">100%</span>
                <span className="stat-desc">Official cutoffs sourced directly from DTE/CET Cell publications.</span>
              </div>
              <div className="stat-row">
                <span className="stat-num">Free</span>
                <span className="stat-desc">No paywalls, registration, or premium tiers. Sourced for students.</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="about-divider" />

        {/* Section: Developer Profile */}
        <section className="about-section grid-2">
          <div className="section-label">The Developer</div>
          <div className="section-content">
            <h2 className="content-heading">Atharva Ghule</h2>
            <p className="developer-tagline">Creator & Sole Developer of FutureU</p>
            <p>
              Atharva (<a href="https://github.com/athen-g" target="_blank" rel="noopener noreferrer" className="inline-link">@athen-g <ExternalLink size={12} /></a>) built FutureU as an open-source tool to demystify the complex MHT-CET CAP round allocation process for students. Having witnessed the confusion and anxiety that candidates face when organizing their preference forms, he consolidated multiple years of historical cutoff trends into an actionable, real-time prediction model.
            </p>
            <div className="dev-actions">
              <a href="https://github.com/athen-g" target="_blank" rel="noopener noreferrer" className="btn-minimalist">
                <Github size={16} /> View GitHub Profile
              </a>
            </div>
          </div>
        </section>

        <hr className="about-divider" />

        {/* Section: Contact & Disclaimer */}
        <section className="about-section grid-2">
          <div className="section-label">Contact & Support</div>
          <div className="section-content">
            <h2 className="content-heading">Direct Contact</h2>
            <p>
              FutureU is built to be helpful. If you identify any discrepancy in cutoffs, face a bug in predictions, or want to contribute to the project, feel free to reach out directly.
            </p>
            <div className="contact-box-minimal">
              <Mail size={18} className="contact-icon-red" />
              <div className="contact-details">
                <span className="contact-lbl">Email Address</span>
                <a href="mailto:atharvanitinghule@gmail.com" className="contact-link-red">atharvanitinghule@gmail.com</a>
              </div>
            </div>
          </div>
        </section>

        <hr className="about-divider" />

        {/* Section: Disclaimer */}
        <section className="about-section grid-2 disclaimer-wrap">
          <div className="section-label">Disclaimer</div>
          <div className="section-content disclaimer-content">
            <p className="disclaimer-title">Important Disclaimer</p>
            <p>
              FutureU is an independent, student-built tool for informational purposes only. Cutoff predictions and eligibility categories (Safe, Moderate, Reach, Unlikely) are simulated based on historical 2024-25 CAP round data.
            </p>
            <p>
              Cutoffs can vary dynamically based on exam difficulty, total registrations, and student choices in 2026. Candidates must always verify cutoff lists and college options with the official CET Cell / DTE Maharashtra portal before submitting their finalized option forms. FutureU is not affiliated with, endorsed by, or associated with CET Cell Maharashtra or DTE Maharashtra.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
