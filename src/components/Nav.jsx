import { useState, useEffect } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Listen', 'Booth', 'Shows', 'About', 'Gallery', 'Book']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '14px 28px' : '24px 40px',
      transition: 'all 0.35s ease',
      background: scrolled ? 'color-mix(in oklab, var(--bg) 85%, transparent)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      color: scrolled ? 'var(--ink)' : 'var(--cream)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'var(--mono)', fontSize: 11,
      letterSpacing: '0.2em', textTransform: 'uppercase',
    }}>
      <a href="#top" style={{ color: 'inherit', textDecoration: 'none', fontSize: 13, letterSpacing: '0.15em' }}>
        ✺ Bonn Avenue
      </a>
      <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.6' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
            {l}
          </a>
        ))}
      </div>
      <span className="nav-loc">Bengaluru · IN</span>
    </nav>
  )
}
