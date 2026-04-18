import { useState } from 'react'
import { useParallax } from '../hooks/useParallax'
import { Reveal } from './ui/Reveal'
import { Mono } from './ui/Mono'
import { Photo } from './ui/Photo'
import { PHOTOS } from '../data/photos'

function Stat({ n, label }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--display)', fontSize: 44, lineHeight: 1, fontStyle: 'italic' }}>{n}</div>
      <Mono size={10} style={{ color: 'var(--ink-faint)', marginTop: 6, display: 'block' }}>{label}</Mono>
    </div>
  )
}

function Polaroid({ src, caption, rotate = 0, offsetX = 0 }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--cream)', padding: 12, paddingBottom: 44,
        boxShadow: hover
          ? '0 24px 60px rgba(42,22,16,0.28), 0 6px 14px rgba(42,22,16,0.2)'
          : '0 14px 36px rgba(42,22,16,0.2), 0 3px 8px rgba(42,22,16,0.14)',
        transform: `rotate(${hover ? rotate * 0.3 : rotate}deg) translateX(${offsetX}px) ${hover ? 'translateY(-4px)' : ''}`,
        transition: 'transform 0.5s cubic-bezier(0.2,0.6,0.2,1), box-shadow 0.4s ease',
        position: 'relative', maxWidth: 380,
      }}
    >
      <Photo src={src} style={{ aspectRatio: '4/5', width: '100%' }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 12, right: 12, textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--ink-faint)',
      }}>{caption}</div>
    </div>
  )
}

export function About() {
  const [ref, pstyle] = useParallax(0.08)

  return (
    <section id="about" style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      background: 'var(--bg)', color: 'var(--ink)', position: 'relative',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal><Mono>On the record</Mono></Reveal>

        <div className="about-grid" style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 'clamp(30px, 5vw, 100px)', marginTop: 36, alignItems: 'start',
        }}>
          <Reveal delay={100}>
            <h2 style={{
              margin: 0, fontFamily: 'var(--display)', fontWeight: 400,
              fontSize: 'clamp(42px, 6.5vw, 92px)', lineHeight: 0.98, letterSpacing: '-0.02em',
            }}>
              Bonn Avenue is a <span style={{ fontStyle: 'italic' }}>deep house</span> producer & DJ — making{' '}
              <span style={{ fontStyle: 'italic' }}>emotive</span>, soulful music in{' '}
              <span style={{ fontStyle: 'italic' }}>Bengaluru</span>.
            </h2>
            <div style={{
              marginTop: 40, fontFamily: 'var(--body)', fontSize: 18, lineHeight: 1.65,
              color: 'var(--ink-soft)', maxWidth: 620,
            }}>
              <p style={{ marginTop: 0 }}>
                His sets live at the meeting point of warm chord progressions and slow-moving melodies.
                Organic textures, a four-on-the-floor you can feel in your chest, and the kind of restraint that earns the drop.
              </p>
              <p>
                On stage he's energetic and smiling — you can see him enjoying the music as much as the room.
                Five originals, two live mixes, and a list of venues growing faster than the setlist.
              </p>
            </div>
            <div style={{ marginTop: 44, display: 'flex', gap: 48, flexWrap: 'wrap', fontFamily: 'var(--body)' }}>
              <Stat n="05" label="Originals released" />
              <Stat n="02" label="Live mix videos" />
              <Stat n="6K" label="Listeners this year" />
              <Stat n="2023" label="Started playing" />
            </div>
          </Reveal>

          <Reveal delay={250}>
            <div ref={ref} style={{ position: 'relative', paddingTop: 40, ...pstyle }}>
              <Polaroid src={PHOTOS.portrait} caption="Backlit — Koramangala" rotate={2.5} />
              <div style={{ height: 32 }} />
              <Polaroid src={PHOTOS.sunrays} caption="Studio mornings" rotate={-2.8} offsetX={24} />
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal>
        <div style={{
          marginTop: 100, borderTop: '1px solid var(--line)', paddingTop: 22,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 20, flexWrap: 'wrap', maxWidth: 1320, margin: '100px auto 0',
        }}>
          <Mono>Influences · Aspirations</Mono>
          <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 'clamp(18px, 2.2vw, 30px)', color: 'var(--ink-soft)' }}>
            Lane 8 · Ben Böhmer · Yotto · Anjunadeep · This Never Happened
          </div>
        </div>
      </Reveal>
    </section>
  )
}
