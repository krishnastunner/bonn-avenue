import { useState, useEffect } from 'react'
import { useParallax } from '../hooks/useParallax'
import { Photo } from './ui/Photo'
import { Mono } from './ui/Mono'
import { Pill } from './ui/Pill'
import { PHOTOS } from '../data/photos'

export function Hero() {
  const [, pstyle] = useParallax(0.15)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  return (
    <section id="top" style={{
      position: 'relative', height: '100vh', minHeight: 700,
      overflow: 'hidden', color: 'var(--cream)',
    }}>
      <div style={{ position: 'absolute', inset: '-5% 0', ...pstyle }}>
        <Photo src={PHOTOS.hero} style={{ width: '100%', height: '110%' }} />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 55% 40%, transparent 30%, rgba(30,15,8,0.65) 100%)',
      }} />

      {/* Label top-left */}
      <div style={{
        position: 'absolute', top: 110, left: 40,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
      }}>
        <Mono size={11} style={{ opacity: 0.9 }}>Deep House · Producer & DJ</Mono>
      </div>

      {/* Main title */}
      <div style={{
        position: 'absolute', left: 40, right: 40,
        bottom: 'clamp(140px, 18vh, 220px)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 1s cubic-bezier(0.2,0.6,0.2,1) 0.35s, transform 1s cubic-bezier(0.2,0.6,0.2,1) 0.35s',
      }}>
        <h1 style={{
          margin: 0, fontFamily: 'var(--display)',
          fontSize: 'clamp(80px, 18vw, 260px)', lineHeight: 0.86,
          fontWeight: 400, letterSpacing: '-0.035em',
          color: 'var(--cream)',
          textShadow: '0 4px 60px rgba(30,15,8,0.4)',
        }}>
          <span style={{ fontStyle: 'italic' }}>Bonn</span><br />Avenue
        </h1>
      </div>

      {/* Sidebar note */}
      <div className="hero-side" style={{
        position: 'absolute', top: 190, right: 40, width: 260,
        opacity: mounted ? 0.95 : 0,
        transition: 'opacity 1.2s ease 0.8s',
      }}>
        <div style={{ borderTop: '1px solid rgba(245,234,212,0.5)', paddingTop: 14, marginBottom: 14 }}>
          <Mono size={10} style={{ opacity: 0.85 }}>Issue № 01 · 2026</Mono>
        </div>
        <p style={{ margin: 0, fontFamily: 'var(--body)', fontSize: 16, lineHeight: 1.55, fontStyle: 'italic', color: 'var(--cream)' }}>
          Deep house from the subcontinent — emotive melodies, soulful chords, and the quiet thrill of a floor found late in the night.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="hero-bottom" style={{
        position: 'absolute', left: 40, right: 40, bottom: 40,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTop: '1px solid rgba(245,234,212,0.4)', paddingTop: 22,
        opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 1.1s',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div>
          <Mono size={10} style={{ opacity: 0.85 }}>Now Playing</Mono>
          <div style={{ marginTop: 6, fontFamily: 'var(--display)', fontSize: 22, fontStyle: 'italic' }}>
            Saffron Skies — BA003
          </div>
        </div>
        <div>
          <Mono size={10} style={{ opacity: 0.85 }}>Next Show</Mono>
          <div style={{ marginTop: 6, fontFamily: 'var(--body)', fontSize: 16 }}>Apr 26 — Antisocial, BLR</div>
        </div>
        <Pill href="#book">Book →</Pill>
      </div>

      <div style={{
        position: 'absolute', left: '50%', bottom: 14,
        transform: 'translateX(-50%)',
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.3em', opacity: 0.7,
      }}>
        SCROLL ↓
      </div>
    </section>
  )
}
