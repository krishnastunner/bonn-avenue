export function Pill({ children, onClick, variant = 'outline', style = {}, href, target }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '12px 22px', borderRadius: 999,
    fontFamily: 'var(--mono)', fontSize: 11,
    letterSpacing: '0.2em', textTransform: 'uppercase',
    cursor: 'pointer', transition: 'letter-spacing 0.25s ease',
    textDecoration: 'none', border: '1px solid currentColor',
    background: 'transparent', color: 'inherit',
  }
  const filled = variant === 'solid'
    ? { background: 'var(--ink)', color: 'var(--bg)', borderColor: 'var(--ink)' }
    : {}

  const combined = { ...base, ...filled, ...style }
  const handlers = {
    onMouseEnter: e => { e.currentTarget.style.letterSpacing = '0.28em' },
    onMouseLeave: e => { e.currentTarget.style.letterSpacing = '0.2em' },
  }

  if (href) {
    return (
      <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        style={combined} {...handlers}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} style={combined} {...handlers}>
      {children}
    </button>
  )
}
