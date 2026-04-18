import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import { Mono } from './ui/Mono'
import { Photo } from './ui/Photo'
import { PHOTOS } from '../data/photos'

function GalleryTile({ src, cap, col, row = 1 }) {
  const [hover, setHover] = useState(false)
  return (
    <Reveal>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          gridColumn: col, gridRow: `span ${row}`,
          position: 'relative', overflow: 'hidden',
          aspectRatio: row === 2 ? '1.2/1' : '1.6/1',
          cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          transform: hover ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 1.2s cubic-bezier(0.2,0.6,0.2,1)',
        }}>
          <Photo src={src} style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ position: 'absolute', left: 16, bottom: 16, color: 'var(--cream)', opacity: hover ? 1 : 0.85, transition: 'opacity 0.3s ease' }}>
          <Mono size={10}>{cap}</Mono>
        </div>
      </div>
    </Reveal>
  )
}

export function Gallery() {
  return (
    <section id="gallery" style={{ padding: 'clamp(80px,12vw,160px) 0', background: 'var(--bg)', color: 'var(--ink)' }}>
      <div style={{ padding: '0 clamp(24px,5vw,80px)', maxWidth: 1320, margin: '0 auto' }}>
        <Reveal><Mono>Visual notebook</Mono></Reveal>
        <Reveal delay={100}>
          <h2 style={{ margin: '20px 0 50px', fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            From the <span style={{ fontStyle: 'italic' }}>road</span> —
          </h2>
        </Reveal>
      </div>

      <div className="gallery-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(12,1fr)',
        gap: 12, padding: '0 clamp(24px,5vw,80px)',
        maxWidth: 1500, margin: '0 auto',
      }}>
        <GalleryTile src={PHOTOS.g1} cap="Soulgrove — Goa"       col="span 7" row={2} />
        <GalleryTile src={PHOTOS.g2} cap="Backstage, Mumbai"     col="span 5" row={1} />
        <GalleryTile src={PHOTOS.g3} cap="Sunrise set, Hampi"    col="span 5" row={1} />
        <GalleryTile src={PHOTOS.g4} cap="The Piano Man, Delhi"  col="span 7" row={2} />
        <GalleryTile src={PHOTOS.g5} cap="Koramangala studio"    col="span 4" row={1} />
        <GalleryTile src={PHOTOS.g6} cap="Afterhours"            col="span 8" row={1} />
      </div>

      <Reveal>
        <div style={{ marginTop: 80, padding: '24px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'var(--display)', fontSize: 'clamp(24px,4vw,56px)', fontStyle: 'italic', color: 'var(--ink-soft)' }}>
          <div className="ticker">
            Bengaluru &nbsp;✺&nbsp; Mumbai &nbsp;✺&nbsp; Goa &nbsp;✺&nbsp; Delhi &nbsp;✺&nbsp; Pune &nbsp;✺&nbsp; Hampi &nbsp;✺&nbsp;
            Bengaluru &nbsp;✺&nbsp; Mumbai &nbsp;✺&nbsp; Goa &nbsp;✺&nbsp; Delhi &nbsp;✺&nbsp; Pune &nbsp;✺&nbsp; Hampi &nbsp;✺&nbsp;
          </div>
        </div>
      </Reveal>
    </section>
  )
}
