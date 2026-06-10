import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, BookMarked, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import './Navbar.css'

export function Logo({ size = 'md' }) {
  return (
    <Link to="/" className={`nav-logo nav-logo--${size}`}>
      <span className="nav-wordmark">Future<span>U</span></span>
    </Link>
  )
}

export default function Navbar() {
  const { theme, toggleTheme, shortlist } = useApp()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/home', label: 'Home' },
    { to: '/colleges', label: 'Colleges' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Logo />
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          {shortlist.length > 0 && (
            <Link to="/home" className="nav-shortlist-badge">
              <BookMarked size={15}/> <span>{shortlist.length}<span className="hide-mobile"> saved</span></span>
            </Link>
          )}
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}
          </button>
          <button className="hamburger hide-desktop" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>
    </nav>
  )
}
