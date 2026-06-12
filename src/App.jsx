import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/layout/Navbar'
import SupportModal from './components/layout/SupportModal'
import Footer from './components/layout/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const CollegesPage = lazy(() => import('./pages/CollegesPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const CollegeDetailPage = lazy(() => import('./pages/CollegeDetailPage'))
const ChangeLogPage = lazy(() => import('./pages/ChangeLogPage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))

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

function RouteLoader() {
  return (
    <div className="route-loader">
      <div className="route-spinner"></div>
      <span>Loading Page...</span>
    </div>
  )
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/home" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
          <Route path="/colleges" element={<Layout><CollegesPage /></Layout>} />
          <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
          <Route path="/changelog" element={<Layout><ChangeLogPage /></Layout>} />
          <Route path="/help" element={<Layout><HelpPage /></Layout>} />
          <Route path="/college/:collegeCode" element={<Layout><CollegeDetailPage /></Layout>} />
        </Routes>
      </Suspense>
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
