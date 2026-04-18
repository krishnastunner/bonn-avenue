export function Mono({ children, style = {}, size = 11 }) {
  return (
    <span style={{
      fontFamily: 'var(--mono)',
      fontSize: size,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      ...style,
    }}>
      {children}
    </span>
  )
}
