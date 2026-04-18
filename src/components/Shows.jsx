import { useState, useEffect } from 'react'
import { Reveal } from './ui/Reveal'
import { Mono } from './ui/Mono'
import { Pill } from './ui/Pill'
import { supabase } from '../lib/supabase'

function ShowRow({ show }) {
  const [hover, setHover] = useState(false)
  const sold   = show.status === 'soldout'
  const invite = show.status === 'invite'

  return (
    <Reveal>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'grid', gridTemplateColumns: '130px 1fr auto', gap: 24,
          alignItems: 'center', padding: '30px 12px',
          borderTop: '1px solid var(--line)',
          transition: 'background 0.3s ease',
          background: hover ? 'color-mix(in oklab, var(--ink) 4%, transparent)' : 'transparent',
          opacity: sold ? 0.55 : 1,
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(26px,3vw,38px)', fontStyle: 'italic' }}>{show.date}</div>
          <Mono style={{ color: 'var(--ink-faint)', marginTop: 4, display: 'block' }}>{show.year}</Mono>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--display)', fontSize: 'clamp(22px,2.6vw,32px)', fontWeight: 400,
            transform: hover && !sold ? 'translateX(8px)' : 'translateX(0)',
            transition: 'transform 0.35s ease',
          }}>{show.venue}</div>
          <Mono style={{ color: 'var(--ink-soft)', marginTop: 6, display: 'block' }}>
            {show.city} · {show.country}
          </Mono>
        </div>
        <div>
          {sold   && <Mono style={{ color: 'var(--ink-faint)' }}>Sold out</Mono>}
          {invite && <Mono style={{ color: 'var(--ink-faint)' }}>Invite only</Mono>}
          {!sold && !invite && (
            <Pill href={show.ticket_url || '#book'} target={show.ticket_url ? '_blank' : undefined}>
              Tickets ↗
            </Pill>
          )}
        </div>
      </div>
    </Reveal>
  )
}

export function Shows() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('shows')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setShows(data)
        setLoading(false)
      })
  }, [])

  return (
    <section id="shows" style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      background: 'var(--bg)', color: 'var(--ink)',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
            <Mono>Tour · Spring / Summer 2026</Mono>
            <Mono style={{ color: 'var(--ink-faint)' }}>Last updated 14 Apr</Mono>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 style={{ margin: '20px 0 60px', fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Where to <span style={{ fontStyle: 'italic' }}>find him</span> —
          </h2>
        </Reveal>

        <div>
          {loading
            ? <div style={{ padding: '40px 12px', fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.5 }}>Loading…</div>
            : shows.map(s => <ShowRow key={s.id} show={s} />)
          }
        </div>

        <Reveal>
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ fontFamily: 'var(--body)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-soft)' }}>
              Interested in having Bonn at your event?
            </div>
            <Pill href="#book" variant="solid">Send a booking →</Pill>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
