import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, FileText, Gift, Smile, X } from 'lucide-react'
import './SupportModal.css'

export default function SupportModal({ onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (window.self !== window.top) {
      onClose()
    }
  }, [onClose])

  const handleKofiClick = () => {
    window.open('https://ko-fi.com/athen_g', '_blank', 'noopener,noreferrer')
  }

  const handleGpayClick = () => {
    onClose()
    navigate('/about?support=gpay')
  }

  const handleFeedbackClick = () => {
    window.open('https://forms.gle/3ZEtaRGaurri54Sr6', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="support-modal-backdrop" onClick={onClose}>
      <div className="support-modal-card" onClick={e => e.stopPropagation()}>
        <button className="support-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="support-modal-header">
          <div className="support-modal-icon-wrap">
            <Heart size={26} className="heart-pulse-icon" />
          </div>
          <h2>Thank You for Using FutureU!</h2>
          <p>
            FutureU is built to help Maharashtra engineering students navigate the cutoff analysis and option form process smoothly. If this tool made your admission planning easier, please consider supporting the project.
          </p>
        </div>

        <div className="support-modal-options">
          <button className="support-modal-btn feedback-btn" onClick={handleFeedbackClick}>
            <FileText size={18} />
            <div className="btn-text-wrap">
              <strong>Share Feedback</strong>
              <span>Help us improve with a 1-min form</span>
            </div>
          </button>

          <button className="support-modal-btn kofi-btn" onClick={handleKofiClick}>
            <Gift size={18} />
            <div className="btn-text-wrap">
              <strong>Buy Me a Ko-fi</strong>
              <span>Support via Card or PayPal</span>
            </div>
          </button>

          <button className="support-modal-btn gpay-btn" onClick={handleGpayClick}>
            <Smile size={18} />
            <div className="btn-text-wrap">
              <strong>Support via GPay (UPI)</strong>
              <span>Get UPI QR code on About Page</span>
            </div>
          </button>
        </div>

        <div className="support-modal-footer">
          <button className="btn-later" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
