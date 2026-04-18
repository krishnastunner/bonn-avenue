import { Mono } from './ui/Mono'

export function Footer() {
  return (
    <footer style={{
      padding: 'clamp(40px,5vw,70px) clamp(24px,5vw,80px) 32px',
      background: 'var(--bg)', color: 'var(--ink-soft)',
      borderTop: '1px solid var(--line)',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 36, fontStyle: 'italic', color: 'var(--ink)' }}>Bonn Avenue</div>
          <Mono style={{ marginTop: 8, display: 'block' }}>N 12.97° · E 77.59°</Mono>
        </div>
        <Mono>© 2026 · Made with warm light in Bengaluru</Mono>
      </div>
    </footer>
  )
}
