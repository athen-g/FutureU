import { Link } from 'react-router-dom'
import { Database, Shield, RefreshCw, Eye, ArrowRight } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle'
import './AboutPage.css'

export default function AboutPage() {
  usePageTitle('About Us')
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>Your College Journey Partner</h1>
          <p>Empowering students to make informed college decisions through data-driven insights.</p>
          <Link to="/home" className="btn btn-primary">Start Your College Search <ArrowRight size={16}/></Link>
        </div>
      </section>

      <section className="section">
        <div className="container about-mission">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>We believe every student deserves clarity in their college admission journey. FutureU transforms complex admission data into actionable insights, making college selection accessible, transparent, and stress-free.</p>
            <p>The MHT-CET CAP process involves hundreds of colleges, thousands of branches, and dozens of reservation categories. We decode all of that so you don't have to.</p>
          </div>
          <div className="mission-visual">
            <div className="mission-icon-grid">
              {[Database, Shield, RefreshCw, Eye].map((Icon, i) => (
                <div key={i} className="mission-icon-box"><Icon size={28}/></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center',marginBottom:40}}>How We Make a Difference</h2>
          <div className="diff-grid">
            {[
              { icon: Database, title: 'Data Sources', desc: 'We collect and process cutoff data directly from CET Cell / DTE Maharashtra official publications for CAP Rounds 1, 2, and 3.' },
              { icon: Shield, title: 'Algorithm', desc: 'Our matching model considers your percentile, reservation category, domicile, gender, and TFWS/EWS/PWD status to find the most relevant cutoffs.' },
              { icon: RefreshCw, title: 'Accuracy', desc: 'Data is sourced from the official 2024-25 CAP round cutoff lists. We parse and structure it faithfully without modification.' },
              { icon: Eye, title: 'Transparency', desc: 'We show you exactly which cutoff category code is being used for each comparison, so you can verify independently.' },
            ].map((item, i) => (
              <div key={i} className="diff-card">
                <div className="diff-icon"><item.icon size={22}/></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center',marginBottom:40}}>Why Students Trust FutureU</h2>
          <div className="trust-grid">
            <div className="trust-card">
              <span className="trust-value">354+</span>
              <span className="trust-label">Colleges Covered</span>
            </div>
            <div className="trust-card">
              <span className="trust-value">1965+</span>
              <span className="trust-label">Branch Options</span>
            </div>
            <div className="trust-card">
              <span className="trust-value">100%</span>
              <span className="trust-label">Official Data</span>
            </div>
            <div className="trust-card">
              <span className="trust-value">Free</span>
              <span className="trust-label">Always & Forever</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container disclaimer-section">
          <h2>Important Disclaimer</h2>
          <div className="disclaimer-box">
            <p>FutureU is an independent, student-built tool for informational purposes only. All cutoff data is sourced from the official CET Cell Maharashtra publications for 2024-25 and processed as-is.</p>
            <ul>
              <li>Predictions and classifications are based on historical data and may not exactly reflect future cutoffs.</li>
              <li>Always verify college information and cutoffs with the official DTE Maharashtra / CET Cell website before making admission decisions.</li>
              <li>FutureU is not affiliated with DTE Maharashtra, CET Cell, or any college.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Find Your Perfect College?</h2>
          <p>Get data-driven recommendations based on real CAP cutoffs.</p>
          <Link to="/home" className="btn btn-primary btn-lg">Get Started Now <ArrowRight size={18}/></Link>
        </div>
      </section>
    </div>
  )
}
