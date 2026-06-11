import { createContext, useContext, useState, useCallback } from 'react'
import { ensureDataLoaded } from '../utils/dataLoader'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [shortlist, setShortlist] = useState([]) // [{collegeCode, branchCode, collegeName, branchName}]
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)

  const loadAppData = useCallback(async () => {
    if (isDataReady || isDataLoading) return
    setIsDataLoading(true)
    try {
      await ensureDataLoaded()
      setIsDataReady(true)
    } catch (err) {
      console.error('Failed to load application data:', err)
    } finally {
      setIsDataLoading(false)
    }
  }, [isDataReady, isDataLoading])

  const openSupportModal = useCallback(() => setShowSupportModal(true), [])
  const closeSupportModal = useCallback(() => setShowSupportModal(false), [])

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  const addToShortlist = useCallback((item) => {
    setShortlist(sl => {
      const key = `${item.collegeCode}-${item.branchCode}`
      if (sl.find(s => `${s.collegeCode}-${s.branchCode}` === key)) return sl
      return [...sl, item]
    })
  }, [])

  const removeFromShortlist = useCallback((collegeCode, branchCode) => {
    setShortlist(sl => sl.filter(s => !(s.collegeCode === collegeCode && s.branchCode === branchCode)))
  }, [])

  const isShortlisted = useCallback((collegeCode, branchCode) => {
    return shortlist.some(s => s.collegeCode === collegeCode && s.branchCode === branchCode)
  }, [shortlist])

  const clearShortlist = useCallback(() => setShortlist([]), [])

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      shortlist, addToShortlist, removeFromShortlist, isShortlisted, clearShortlist,
      showSupportModal, openSupportModal, closeSupportModal,
      isDataReady, isDataLoading, loadAppData
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
