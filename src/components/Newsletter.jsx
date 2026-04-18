import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import { Mono } from './ui/Mono'
import { supabase } from '../lib/supabase'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setLoading(true); setError(null)
    try {
      const { error: dbError } = await supabase.from('subscribers').insert({ email })
      if (dbError) {
        // 23505 = unique_violation (already subscribed)
        if (dbError.code === '23505') { setDone(true); return }
        throw dbError
      }
      setDone(true)
    } catch (err) {
      console.error('Subscribe error:', err)
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" style={{
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      background: 'var(--bg-alt)', color: 'var(--ink)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <Reveal><Mono>The Postcard Club</Mono></Reveal>
        <Reveal delay={80}>
          <h2 style={{ margin: '22px auto 24px', fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(40px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.02em', maxWidth: 900 }}>
            Get a <span style={{ fontStyle: 'italic' }}>warm letter</span> & a new mix — once a month.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ fontFamily: 'var(--body)', fontSize: 18, color: 'var(--ink-soft)', maxWidth: 560, margin: '0 auto 36px' }}>
            No algorithms. Just a personal note from Bonn — upcoming shows, unreleased tracks, photos from the road.
          </p>
        </Reveal>
        <Reveal delay={220}>
          {!done ? (
            <>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0, maxWidth: 520, margin: '0 auto', borderBottom: '1px solid var(--ink)', alignItems: 'center' }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@somewhere.com" required
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '14px 4px', fontFamily: 'var(--body)', fontSize: 20, fontStyle: 'italic', color: 'var(--ink)' }}
                />
                <button type="submit" disabled={loading} style={{ background: 'transparent', border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 18px', color: 'var(--ink)', opacity: loading ? 0.6 : 1 }}>
                  {loading ? '…' : 'Subscribe →'}
                </button>
              </form>
              {error && <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', marginTop: 12 }}>{error}</p>}
            </>
          ) : (
            <div style={{ fontFamily: 'var(--display)', fontSize: 42, fontStyle: 'italic' }}>
              Welcome aboard. ✺
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
