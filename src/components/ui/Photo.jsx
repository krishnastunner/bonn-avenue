import { useTheme } from '../../context/ThemeContext'

export function Photo({ src, style = {}, filter = true, overlay = true, children }) {
  const { theme } = useTheme()

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: filter ? theme.photoFilter : 'none',
      }} />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: theme.photoOverlay,
          mixBlendMode: 'multiply',
        }} />
      )}
      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0.3, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      {children}
    </div>
  )
}
