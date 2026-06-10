import { Link } from 'react-router-dom'
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>Future<span>U</span></span>
          </div>
          <p>Helping students navigate their college journey with confidence and data-driven insights.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><Link to="/colleges">College Database</Link></li>
              <li><Link to="/how-it-works">Cutoff Trends</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <div className="footer-social">
              <a href="#" aria-label="Twitter"><Twitter size={17}/></a>
              <a href="#" aria-label="Instagram"><Instagram size={17}/></a>
              <a href="#" aria-label="Facebook"><Facebook size={17}/></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={17}/></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2025-26 FutureU. All rights reserved. Data from DTE Maharashtra / CET Cell. Verify with official sources before making decisions.</p>
        </div>
      </div>
    </footer>
  )
}
