import { useRef, useState, useEffect } from 'react'

export function useParallax(speed = 0.2) {
  const ref = useRef(null)
  const [y, setY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const dist = r.top + r.height / 2 - vh / 2
      setY(-dist * speed)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return [ref, { transform: `translate3d(0, ${y}px, 0)` }]
}
