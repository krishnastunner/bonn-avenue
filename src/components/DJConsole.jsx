import { useState, useEffect } from 'react'
import { Reveal } from './ui/Reveal'
import { Mono } from './ui/Mono'

function Spec({ label, value }) {
  return (
    <div style={{ borderTop: '1px solid rgba(245,234,212,0.25)', paddingTop: 14 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,234,212,0.55)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, marginTop: 8 }}>{value}</div>
    </div>
  )
}

export function DJConsole() {
  const [time, setTime] = useState(0)
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (!active) return
    let raf
    const start = performance.now()
    const loop = (now) => { setTime((now - start) / 1000); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])

  const spin = (time * 33) % 360
  const vu1 = Array.from({ length: 14 }, (_, i) => Math.abs(Math.sin(time * 4 + i * 0.7)) * 0.8 + Math.random() * 0.2)
  const vu2 = Array.from({ length: 14 }, (_, i) => Math.abs(Math.sin(time * 3.3 + i * 0.5 + 1)) * 0.8 + Math.random() * 0.2)
  const knob = (f) => Math.sin(time * f) * 40
  const xfader = 50 + Math.sin(time * 0.4) * 35

  return (
    <section id="booth" style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      background: 'var(--ink)', color: 'var(--cream)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,90,63,0.25), transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(216,132,64,0.2), transparent 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <div style={{ position: 'relative', maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <Mono style={{ color: 'rgba(245,234,212,0.7)' }}>The Booth · Live from Bengaluru</Mono>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            <h2 style={{ margin: '20px 0 0', fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.95, letterSpacing: '-0.02em', maxWidth: 1000 }}>
              <span style={{ fontStyle: 'italic' }}>Two decks</span>, a mixer,<br />
              and whatever the <span style={{ fontStyle: 'italic' }}>night</span> asks for.
            </h2>
            <button onClick={() => setActive(a => !a)} style={{ background: 'transparent', border: '1px solid rgba(245,234,212,0.5)', color: 'var(--cream)', padding: '10px 18px', borderRadius: 999, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {active ? '● Live' : '○ Paused'}
            </button>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div style={{ marginTop: 56, padding: 'clamp(18px,2vw,28px)', background: 'linear-gradient(180deg,#1a0d06 0%,#0a0504 100%)', border: '1px solid rgba(245,234,212,0.15)', borderRadius: 8, boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,234,212,0.05)' }}>
            <svg viewBox="0 0 900 340" style={{ width: '100%', display: 'block' }}>
              <defs>
                <radialGradient id="platter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3a1e10"/><stop offset="40%" stopColor="#1e0e06"/><stop offset="100%" stopColor="#0a0503"/>
                </radialGradient>
                <radialGradient id="label" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e8a76a"/><stop offset="80%" stopColor="#c85a3f"/><stop offset="100%" stopColor="#8a2818"/>
                </radialGradient>
              </defs>

              {/* LEFT DECK */}
              <g transform="translate(70,30)">
                <circle cx="120" cy="120" r="118" fill="url(#platter)" stroke="rgba(245,234,212,0.15)"/>
                <g transform={`rotate(${spin} 120 120)`}>
                  <circle cx="120" cy="120" r="55" fill="url(#label)"/>
                  <text x="120" y="118" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="14" fill="#f5ead4">Bonn</text>
                  <text x="120" y="134" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="14" fill="#f5ead4">Avenue</text>
                  <circle cx="120" cy="120" r="4" fill="#0a0503"/>
                  <circle cx="120" cy="30" r="2" fill="rgba(245,234,212,0.4)"/>
                </g>
                {[95,85,75,65].map(r => <circle key={r} cx="120" cy="120" r={r} fill="none" stroke="rgba(245,234,212,0.06)" strokeWidth="0.5"/>)}
                <g transform={`translate(220,10) rotate(${Math.sin(time*0.3)*8-20} 10 10)`}>
                  <circle cx="10" cy="10" r="10" fill="#2a1610" stroke="rgba(245,234,212,0.2)"/>
                  <rect x="8" y="10" width="4" height="130" fill="#4a2a1a" rx="1"/>
                  <polygon points="6,140 14,140 12,155 8,155" fill="#c85a3f"/>
                </g>
                <text x="120" y="260" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" letterSpacing="2" fill="rgba(245,234,212,0.4)">DECK A · 33⅓</text>
              </g>

              {/* MIXER */}
              <g transform="translate(320,30)">
                <rect x="0" y="0" width="260" height="270" rx="4" fill="#1a0d06" stroke="rgba(245,234,212,0.15)"/>
                <g transform="translate(20,20)">
                  <text fontFamily="JetBrains Mono,monospace" fontSize="8" letterSpacing="1.5" fill="rgba(245,234,212,0.4)">CH A</text>
                  {vu1.map((v,i) => <rect key={i} x={0} y={14+(13-i)*7} width={18*v} height="5" fill={i<10?'#d8a855':i<12?'#d88440':'#c85a3f'} opacity={v>0.1?1:0.15}/>)}
                </g>
                <g transform="translate(222,20)">
                  <text fontFamily="JetBrains Mono,monospace" fontSize="8" letterSpacing="1.5" fill="rgba(245,234,212,0.4)">CH B</text>
                  {vu2.map((v,i) => <rect key={i} x={0} y={14+(13-i)*7} width={18*v} height="5" fill={i<10?'#d8a855':i<12?'#d88440':'#c85a3f'} opacity={v>0.1?1:0.15}/>)}
                </g>
                <g transform="translate(60,20)">
                  {['HI','MID','LOW'].map((l,i) => (
                    <g key={l} transform={`translate(0,${i*55})`}>
                      <circle cx="20" cy="20" r="16" fill="#2a1610" stroke="rgba(245,234,212,0.25)"/>
                      <line x1="20" y1="20" x2={20+Math.cos((knob(0.8+i*0.4)-90)*Math.PI/180)*12} y2={20+Math.sin((knob(0.8+i*0.4)-90)*Math.PI/180)*12} stroke="#e8a76a" strokeWidth="2"/>
                      <circle cx="20" cy="20" r="3" fill="#e8a76a"/>
                      <text x="45" y="24" fontFamily="JetBrains Mono,monospace" fontSize="8" letterSpacing="1.5" fill="rgba(245,234,212,0.55)">{l}</text>
                    </g>
                  ))}
                </g>
                <g transform="translate(160,20)">
                  {['HI','MID','LOW'].map((l,i) => (
                    <g key={l} transform={`translate(0,${i*55})`}>
                      <circle cx="20" cy="20" r="16" fill="#2a1610" stroke="rgba(245,234,212,0.25)"/>
                      <line x1="20" y1="20" x2={20+Math.cos((knob(1.1+i*0.5)-90)*Math.PI/180)*12} y2={20+Math.sin((knob(1.1+i*0.5)-90)*Math.PI/180)*12} stroke="#e8a76a" strokeWidth="2"/>
                      <circle cx="20" cy="20" r="3" fill="#e8a76a"/>
                      <text x="45" y="24" fontFamily="JetBrains Mono,monospace" fontSize="8" letterSpacing="1.5" fill="rgba(245,234,212,0.55)">{l}</text>
                    </g>
                  ))}
                </g>
                <g transform="translate(30,210)">
                  <rect x="0" y="8" width="200" height="4" rx="2" fill="#0a0503"/>
                  <rect x={(xfader/100)*180} y="0" width="20" height="20" rx="2" fill="#d8a855" stroke="#8a2818"/>
                  <text x="100" y="40" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="8" letterSpacing="1.5" fill="rgba(245,234,212,0.5)">CROSSFADE</text>
                </g>
              </g>

              {/* RIGHT DECK */}
              <g transform="translate(640,30)">
                <circle cx="120" cy="120" r="118" fill="url(#platter)" stroke="rgba(245,234,212,0.15)"/>
                <g transform={`rotate(${-spin*1.03} 120 120)`}>
                  <circle cx="120" cy="120" r="55" fill="url(#label)"/>
                  <text x="120" y="118" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="14" fill="#f5ead4">BA</text>
                  <text x="120" y="134" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" letterSpacing="2" fill="#f5ead4">004</text>
                  <circle cx="120" cy="120" r="4" fill="#0a0503"/>
                  <circle cx="120" cy="30" r="2" fill="rgba(245,234,212,0.4)"/>
                </g>
                {[95,85,75,65].map(r => <circle key={r} cx="120" cy="120" r={r} fill="none" stroke="rgba(245,234,212,0.06)" strokeWidth="0.5"/>)}
                <g transform={`translate(220,10) rotate(${Math.sin(time*0.35+1)*6-22} 10 10)`}>
                  <circle cx="10" cy="10" r="10" fill="#2a1610" stroke="rgba(245,234,212,0.2)"/>
                  <rect x="8" y="10" width="4" height="130" fill="#4a2a1a" rx="1"/>
                  <polygon points="6,140 14,140 12,155 8,155" fill="#c85a3f"/>
                </g>
                <text x="120" y="260" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" letterSpacing="2" fill="rgba(245,234,212,0.4)">DECK B · 33⅓</text>
              </g>

              <g transform="translate(385,310)">
                <text fontFamily="JetBrains Mono,monospace" fontSize="11" letterSpacing="3" fill="#e8a76a">
                  BPM 122.0  ·  KEY F♯m  ·  —{active ? '●' : '○'} REC
                </text>
              </g>
            </svg>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 32 }}>
            <Spec label="Primary rig" value="Pioneer CDJ-3000 · DJM-900NXS2" />
            <Spec label="Home studio" value="Ableton Live 12 · Moog Matriarch" />
            <Spec label="Signature" value="Live edits, unreleased IDs, one-take sets" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
