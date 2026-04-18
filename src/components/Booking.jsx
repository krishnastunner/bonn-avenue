import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import { Mono } from './ui/Mono'
import { Pill } from './ui/Pill'
import { Photo } from './ui/Photo'
import { PHOTOS } from '../data/photos'
import { supabase } from '../lib/supabase'

function Field({ label, value, onChange, type = 'text', placeholder, multiline, wide }) {
  const [focus, setFocus] = useState(false)
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <label style={{ gridColumn: wide ? '1 / -1' : 'auto', display: 'block' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,234,212,0.6)', marginBottom: 8 }}>
        {label}
      </div>
      <Tag
        type={type} value={value} placeholder={placeholder || ''}
        rows={multiline ? 3 : undefined}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          borderBottom: `1px solid ${focus ? 'var(--accent)' : 'rgba(245,234,212,0.35)'}`,
          padding: '12px 2px', color: 'var(--cream)',
          fontFamily: 'var(--body)', fontSize: 20, fontStyle: 'italic',
          outline: 'none', resize: 'vertical', transition: 'border 0.25s ease',
        }}
      />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,234,212,0.6)', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(o => (
          <button key={o} type="button" onClick={() => onChange(o)} style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            padding: '10px 16px', borderRadius: 999,
            border: `1px solid ${value === o ? 'var(--accent)' : 'rgba(245,234,212,0.35)'}`,
            background: value === o ? 'var(--accent)' : 'transparent',
            color: 'var(--cream)', cursor: 'pointer', transition: 'all 0.2s ease',
          }}>{o}</button>
        ))}
      </div>
    </label>
  )
}

function ContactItem({ label, value, href }) {
  return (
    <div>
      <Mono style={{ color: 'rgba(245,234,212,0.55)' }}>{label}</Mono>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, marginTop: 6, color: 'var(--cream)', textDecoration: 'none' }}>{value}</a>
        : <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, marginTop: 6 }}>{value}</div>
      }
    </div>
  )
}

export function Booking() {
  const [form, setForm] = useState({ name: '', email: '', type: 'Club', date: '', city: '', note: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const { error: dbError } = await supabase.from('bookings').insert({
        name: form.name,
        email: form.email,
        event_type: form.type,
        proposed_date: form.date,
        city: form.city,
        note: form.note,
      })
      if (dbError) throw dbError
      setSent(true)
    } catch (err) {
      console.error('Booking error:', err)
      setError('Something went wrong. Please email us directly at hello@bonnavenue.in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="book" style={{
      padding: 'clamp(80px,12vw,160px) clamp(24px,5vw,80px)',
      background: 'var(--ink)', color: 'var(--cream)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
        <Photo src={PHOTOS.grass} style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <Mono style={{ color: 'rgba(245,234,212,0.7)' }}>Bookings · Press · Promoters</Mono>
        </Reveal>
        <Reveal delay={100}>
          <h2 style={{ margin: '20px 0 48px', fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Book a <span style={{ fontStyle: 'italic' }}>night</span> —
          </h2>
        </Reveal>

        <Reveal>
          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '24px 40px' }} className="book-form">
              <Field label="Your name"     value={form.name}  onChange={v => set('name', v)}  />
              <Field label="Email"         value={form.email} onChange={v => set('email', v)} type="email" />
              <SelectField label="Event type" value={form.type} onChange={v => set('type', v)} options={['Club','Festival','Private','Wedding','Radio/Press']} />
              <Field label="Proposed date" value={form.date}  onChange={v => set('date', v)}  placeholder="e.g. 14 Sep 2026" />
              <Field label="City"          value={form.city}  onChange={v => set('city', v)}  wide />
              <Field label="A note"        value={form.note}  onChange={v => set('note', v)}  multiline wide />
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 16 }}>
                <Mono style={{ color: 'rgba(245,234,212,0.6)' }}>
                  {error || 'We reply within 48 hrs'}
                </Mono>
                <button type="submit" disabled={loading} style={{
                  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                  padding: '16px 34px', borderRadius: 999, border: '1px solid var(--cream)',
                  background: 'var(--cream)', color: 'var(--ink)', cursor: loading ? 'wait' : 'pointer',
                  transition: 'letter-spacing 0.3s ease', opacity: loading ? 0.7 : 1,
                }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.letterSpacing = '0.3em' }}
                  onMouseLeave={e => { e.currentTarget.style.letterSpacing = '0.22em' }}
                >
                  {loading ? 'Sending…' : 'Send inquiry →'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ padding: '60px 0', maxWidth: 620 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 64, fontStyle: 'italic', lineHeight: 1 }}>Thank you.</div>
              <p style={{ fontFamily: 'var(--body)', fontSize: 18, lineHeight: 1.6, marginTop: 20, color: 'rgba(245,234,212,0.85)' }}>
                Your note is on its way. Bonn will be in touch personally within 48 hours. In the meantime, a mix for the road —
              </p>
              <div style={{ marginTop: 20 }}>
                <Pill onClick={() => { setSent(false); setForm({ name:'',email:'',type:'Club',date:'',city:'',note:'' }) }} style={{ color: 'var(--cream)' }}>
                  ← Send another
                </Pill>
              </div>
            </div>
          )}
        </Reveal>

        <Reveal>
          <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px solid rgba(245,234,212,0.25)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 28 }}>
            <ContactItem label="Management" value="hello@bonnavenue.in" href="mailto:hello@bonnavenue.in" />
            <ContactItem label="Instagram"  value="@bonnavenue" href="https://instagram.com/bonnavenue" />
            <ContactItem label="SoundCloud" value="/bonnavenue"  href="https://soundcloud.com/bonnavenue" />
            <ContactItem label="YouTube"    value="@bonnavenue" href="https://youtube.com/@bonnavenue" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
