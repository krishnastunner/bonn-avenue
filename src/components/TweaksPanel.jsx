import { useTheme } from '../context/ThemeContext'

export function TweaksPanel() {
  const { themeKey, setThemeKey, fontKey, setFontKey, THEMES, FONTS } = useTheme()

  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, zIndex: 200, width: 280,
      background: 'var(--bg)', color: 'var(--ink)',
      border: '1px solid var(--ink)', boxShadow: '0 18px 50px rgba(0,0,0,0.25)',
      padding: 20, fontFamily: 'var(--mono)',
    }}>
      <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>Tweaks</div>

      <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>Palette</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {Object.entries(THEMES).map(([k, t]) => (
          <button key={k} onClick={() => setThemeKey(k)} style={{
            flex: 1, padding: '8px 6px', cursor: 'pointer',
            background: t.bg, color: t.ink,
            border: `2px solid ${k === themeKey ? t.accent : 'transparent'}`,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>{t.name}</button>
        ))}
      </div>

      <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>Typography</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(FONTS).map(([k, f]) => (
          <button key={k} onClick={() => setFontKey(k)} style={{
            padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
            background: k === fontKey ? 'var(--ink)' : 'transparent',
            color: k === fontKey ? 'var(--bg)' : 'var(--ink)',
            border: '1px solid var(--line)',
            fontFamily: f.display, fontSize: 15, fontStyle: 'italic',
          }}>{f.name}</button>
        ))}
      </div>
    </div>
  )
}
