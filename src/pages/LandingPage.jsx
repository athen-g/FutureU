import { Link } from 'react-router-dom'
import { ArrowRight, Building2, TrendingUp, Calculator, ChevronRight, GraduationCap, CheckCircle2, ShieldCheck } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle'
import './LandingPage.css'

export default function LandingPage() {
  usePageTitle('Your Future, Your Choice')

  return (
    <div className="landing">
      {/* Decorative Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-spark">✨</span> Dynamic MHT-CET Predictor for 2026
            </div>
            <h1 className="hero-title">
              Secure Your Place in <br />
              Top <span>Engineering</span> Colleges
            </h1>
            <p className="hero-tagline">Navigate Your College Admission Journey with Confidence</p>
            <p className="hero-sub">
              Get data-driven recommendations, historical cutoff trend analyses, and dynamic probability percentages based on MHT-CET and JEE Main scores.
            </p>
            <div className="hero-actions">
              <Link to="/home" className="btn btn-primary btn-lg">
                Get Recommendations <ArrowRight size={18} />
              </Link>
              <Link to="/colleges" className="btn btn-outline btn-lg">
                Browse Colleges
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            {/* Interactive Mock Dashboard */}
            <div className="hero-dashboard-mockup">
              <div className="mock-header">
                <div className="mock-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="mock-title">Predictor Dashboard</div>
              </div>
              <div className="mock-body">
                {/* Search Bar Preview */}
                <div className="mock-search-bar">
                  <div className="mock-search-item">
                    <span>MHT-CET Score</span>
                    <strong>98.40%ile</strong>
                  </div>
                  <div className="mock-search-item">
                    <span>Category</span>
                    <strong>OBC (State Level)</strong>
                  </div>
                </div>

                {/* Recommendations List Preview */}
                <div className="mock-results-list">
                  <div className="mock-result-card glow-green">
                    <div className="card-top">
                      <div className="card-meta">
                        <span className="coll-code">DTE: 03012</span>
                        <h4>VJTI, Mumbai</h4>
                        <p>Information Technology</p>
                      </div>
                      <div className="prob-badge prob-safe">92% Chance</div>
                    </div>
                    <div className="card-bottom">
                      <span>Predicted: 98.15%</span>
                      <span className="badge-safe-lbl">Safe</span>
                    </div>
                  </div>

                  <div className="mock-result-card glow-orange">
                    <div className="card-top">
                      <div className="card-meta">
                        <span className="coll-code">DTE: 16006</span>
                        <h4>COEP Technological University, Pune</h4>
                        <p>Computer Engineering</p>
                      </div>
                      <div className="prob-badge prob-reach">46% Chance</div>
                    </div>
                    <div className="card-bottom">
                      <span>Predicted: 98.55%</span>
                      <span className="badge-reach-lbl">Reach</span>
                    </div>
                  </div>

                  <div className="mock-result-card glow-green">
                    <div className="card-top">
                      <div className="card-meta">
                        <span className="coll-code">DTE: 06271</span>
                        <h4>PICT, Pune</h4>
                        <p>Information Technology</p>
                      </div>
                      <div className="prob-badge prob-safe">96% Chance</div>
                    </div>
                    <div className="card-bottom">
                      <span>Predicted: 97.90%</span>
                      <span className="badge-safe-lbl">Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Designed for Admission Excellence</h2>
            <p className="section-subtitle">Powerful tools engineered to help you choose the best college preferences</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap bg-red">
                <Building2 size={24} />
              </div>
              <h3>Intelligent Matching</h3>
              <p>Filter over 350+ colleges by city preferences, branch preferences, autonomous status, and management status.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap bg-purple">
                <TrendingUp size={24} />
              </div>
              <h3>Historical Cutoff Analysis</h3>
              <p>Compare CAP Round 1, 2, and 3 cutoffs from 2022-23 to 2024-25 in a single view with interactive charts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap bg-orange">
                <Calculator size={24} />
              </div>
              <h3>Probability Calculator</h3>
              <p>Uses a mathematical sigmoid-curve regression model to predict your percentage chance of securing admission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="section hiw-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How FutureU Works</h2>
            <p className="section-subtitle">Get your recommendation preference list in three simple steps</p>
          </div>
          <div className="hiw-steps">
            <div className="hiw-step">
              <div className="hiw-num">1</div>
              <h3>Enter Your Scores</h3>
              <p>Input your MHT-CET / JEE percentile and select your reservation category & domicile.</p>
            </div>
            <div className="hiw-arrow"><ChevronRight size={28}/></div>
            <div className="hiw-step">
              <div className="hiw-num">2</div>
              <h3>Get Recommendations</h3>
              <p>Our predictor processes 5,000+ data points to rank options based on your score.</p>
            </div>
            <div className="hiw-arrow"><ChevronRight size={28}/></div>
            <div className="hiw-step">
              <div className="hiw-num">3</div>
              <h3>Secure Your Admission</h3>
              <p>Download your custom preference list PDF and apply with complete clarity and peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap">
                <GraduationCap size={28} />
              </div>
              <div className="stat-val">350+</div>
              <div className="stat-lbl">Colleges Indexed</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap">
                <CheckCircle2 size={28} />
              </div>
              <div className="stat-val">2,000+</div>
              <div className="stat-lbl">Branches Tracked</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap">
                <ShieldCheck size={28} />
              </div>
              <div className="stat-val">100%</div>
              <div className="stat-lbl">Official Data Sourced</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap">
                <TrendingUp size={28} />
              </div>
              <div className="stat-val">3 Years</div>
              <div className="stat-lbl">Historical Trends</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">See how FutureU has helped students secure admission in top institutes</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="t-rating">⭐⭐⭐⭐⭐</div>
              <p className="t-text">
                "The cutoff charts for COEP Computer Science were amazingly precise. Being able to compare 2022 to 2024 trends saved me hours of manual PDF comparisons."
              </p>
              <div className="t-author">
                <strong>Atharva S.</strong>
                <span>COEP Technological University (99.78%ile)</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="t-rating">⭐⭐⭐⭐⭐</div>
              <p className="t-text">
                "The seat matrix color coding and probability calculator made options selection so clear. I locked my VJTI IT seat in CAP Round 2 exactly as predicted."
              </p>
              <div className="t-author">
                <strong>Neha P.</strong>
                <span>VJTI Mumbai (99.24%ile)</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="t-rating">⭐⭐⭐⭐⭐</div>
              <p className="t-text">
                "I was stuck choosing between PCCOE and VIT. FutureU's historical trend lines showed me that VIT CSE was a safer and better trend. It worked out perfectly!"
              </p>
              <div className="t-author">
                <strong>Rohan K.</strong>
                <span>VIT Pune (98.40%ile)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect College?</h2>
            <p>Don't leave your engineering future to chance. Get dynamic predictions and build your preferences now.</p>
            <Link to="/home" className="btn btn-primary btn-lg cta-btn">
              Get Started Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
