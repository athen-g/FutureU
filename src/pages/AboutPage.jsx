import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { Github, Mail, ExternalLink, Gift, Heart, Linkedin, Globe, Instagram } from 'lucide-react'
import gpayQr from '../assets/gpay-qr.jpeg'
import './AboutPage.css'

export default function AboutPage() {
  usePageTitle('About')
  const [donationMethod, setDonationMethod] = useState('kofi')
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('support') === 'gpay') {
      setDonationMethod('gpay')
      const timer = setTimeout(() => {
        const target = document.getElementById('donation-section')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [location])

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
            <p style={{ marginTop: '10px', fontSize: '14px', borderTop: '1px solid var(--color-divider)', paddingTop: '16px' }}>
              📣 <strong>Help Us Improve!</strong> Your feedback is incredibly valuable. Please take 1 minute to fill out our quick feedback form to help us build a better FutureU.
            </p>
            <div>
              <a href="https://forms.gle/3ZEtaRGaurri54Sr6" target="_blank" rel="noopener noreferrer" className="btn-kofi-style" style={{ textTransform: 'uppercase', textDecoration: 'none' }}>
                Fill Feedback Form
              </a>
            </div>
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

        {/* Section: Privacy Guarantee */}
        <section className="about-section grid-2">
          <div className="section-label">Privacy Guarantee</div>
          <div className="section-content">
            <h2 className="content-heading">Your data is yours alone. No tracking. No spam.</h2>
            <p>
              Unlike standard commercial consulting portals, FutureU guarantees complete candidate privacy:
            </p>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '20px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
              <li><strong>Zero Databases:</strong> We do not run any backend servers or database stores. All your percentiles, ranks, and shortlists are saved locally inside your browser's session storage.</li>
              <li><strong>No Sign-up / Login:</strong> You do not need to register, enter your phone number, or create an account to use any of our features.</li>
              <li><strong>No Spam Calls:</strong> Because we never collect your contact details, you will never receive aggressive marketing, sales, or spam calls from third-party coaching classes or private colleges.</li>
            </ul>
            <p>
              Every tool and calculator is built by a student, for students, to provide clean, uncompromised support.
            </p>
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
              <a href="https://github.com/athen-g" target="_blank" rel="noopener noreferrer" className="btn-minimalist btn-github">
                <Github size={16} /> GitHub Profile
              </a>
              <a href="https://www.linkedin.com/in/atharva-g45/" target="_blank" rel="noopener noreferrer" className="btn-minimalist btn-linkedin">
                <Linkedin size={16} /> LinkedIn Profile
              </a>
              <a href="https://atharvanitinghule.tech" target="_blank" rel="noopener noreferrer" className="btn-minimalist btn-portfolio">
                <Globe size={16} /> My Portfolio
              </a>
              <a href="https://www.instagram.com/athen_g_/" target="_blank" rel="noopener noreferrer" className="btn-minimalist btn-instagram">
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>
        </section>

        <hr className="about-divider" id="donation-section" />

        {/* Section: Support FutureU */}
        <section className="about-section grid-2">
          <div className="section-label">Support Us</div>
          <div className="section-content">
            <h2 className="content-heading">Help keep FutureU free and active.</h2>
            <p>
              FutureU is completely free, open-source, and does not run any advertisements. If the platform helped you organize your CAP preference form or analyze cutoffs, please consider supporting development and hosting costs.
            </p>

            <div className="support-toggle-container">
              <button
                className={`support-toggle-btn ${donationMethod === 'kofi' ? 'active' : ''}`}
                onClick={() => setDonationMethod('kofi')}
              >
                <Gift size={14} /> Donate via Ko-fi
              </button>
              <button
                className={`support-toggle-btn ${donationMethod === 'gpay' ? 'active' : ''}`}
                onClick={() => setDonationMethod('gpay')}
              >
                <Heart size={14} /> Donate via GPay
              </button>
            </div>

            <div className="donation-card-transform">
              {donationMethod === 'kofi' ? (
                <div className="donation-details-box animate-fade-in">
                  <p>Support the project securely through Ko-fi using credit cards, PayPal, or localized mobile wallets.</p>
                  <a href="https://ko-fi.com/athen_g" target="_blank" rel="noopener noreferrer" className="btn-kofi-style" style={{ marginTop: 8 }}>
                    Support on Ko-fi
                  </a>
                </div>
              ) : (
                <div className="donation-details-box qr-reveal animate-fade-in">
                  <p>Scan the UPI QR code below using Google Pay (GPay) or any other UPI app to make a direct donation.</p>
                  <div className="qr-image-wrapper">
                    <img src={gpayQr} alt="GPay UPI QR Code" className="gpay-qr-img" />
                  </div>
                  <div className="upi-details">
                    <span className="upi-lbl">UPI ID</span>
                    <strong className="upi-id">atharvanitinghule@gmail.com</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <hr className="about-divider" />

        {/* Section: Contact & Support */}
        <section className="about-section grid-2">
          <div className="section-label">Contact & Support</div>
          <div className="section-content">
            <h2 className="content-heading">Get in Touch</h2>
            <p>
              FutureU is designed to be a transparent and helpful resource. If you represent an institution wanting to discuss integration opportunities, want to report cutoff issues/bugs, or need personal support, reach out directly.
            </p>
            <div className="contact-box-minimal">
              <Mail size={18} className="contact-icon-red" />
              <div className="contact-details">
                <span className="contact-lbl">Email Address for Support & Partnerships</span>
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
              FutureU is an independent, student-built tool for informational purposes only. Cutoff predictions and eligibility categories (Safe, Moderate, Reach, Unlikely) are simulated based on historical 2025-26 CAP round data.
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
