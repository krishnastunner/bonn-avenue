import { useReveal } from '../../hooks/useReveal'

export function Reveal({ children, delay = 0, y = 16 }) {
  const [ref, shown] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 0.9s cubic-bezier(0.2,0.6,0.2,1) ${delay}ms, transform 0.9s cubic-bezier(0.2,0.6,0.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}
