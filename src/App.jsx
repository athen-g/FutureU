import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/layout/Navbar'
import SupportModal from './components/layout/SupportModal'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import HowItWorksPage from './pages/HowItWorksPage'
import CollegesPage from './pages/CollegesPage'
import FAQPage from './pages/FAQPage'
import CollegeDetailPage from './pages/CollegeDetailPage'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  const { showSupportModal, openSupportModal, closeSupportModal } = useApp()

  useEffect(() => {
    const shown = sessionStorage.getItem('futureu_support_modal_shown')
    if (!shown) {
      const timer = setTimeout(() => {
        openSupportModal()
        sessionStorage.setItem('futureu_support_modal_shown', 'true')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [openSupportModal])

  return (
    <div className="page-wrapper">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
      <Footer />
      {showSupportModal && <SupportModal onClose={closeSupportModal} />}
    </div>
  )
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
        <Route path="/colleges" element={<Layout><CollegesPage /></Layout>} />
        <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
        <Route path="/college/:collegeCode" element={<Layout><CollegeDetailPage /></Layout>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Analytics />
        <SpeedInsights />
      </AppProvider>
    </BrowserRouter>
  )
}
