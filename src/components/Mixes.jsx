import { useState, useRef, useEffect } from 'react'
import { Reveal } from './ui/Reveal'
import { Mono } from './ui/Mono'
import { Pill } from './ui/Pill'
import { Photo } from './ui/Photo'
import { MIXES } from '../data/mixes'

const SC_PROFILE = 'https://soundcloud.com/bonnavenue'

const TRACK_PARAMS = [
  { bpm: 122, root: 110.00, scale: [0,3,5,7,10],  chordMix: 0.5, bassDrive: 0.7, duration: 180 },
  { bpm: 118, root: 130.81, scale: [0,2,5,7,10],  chordMix: 0.6, bassDrive: 0.6, duration: 210 },
  { bpm: 124, root: 98.00,  scale: [0,3,5,8,10],  chordMix: 0.4, bassDrive: 0.8, duration: 195 },
  { bpm: 120, root: 116.54, scale: [0,3,5,7,12],  chordMix: 0.7, bassDrive: 0.5, duration: 225 },
  { bpm: 126, root: 146.83, scale: [0,2,4,7,11],  chordMix: 0.55, bassDrive: 0.7, duration: 200 },
]

const N_BARS = 64

function fmt(s) {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60), sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

// ─── Web Audio synth helpers ───────────────────────────────────
function mkKick(ctx, out, time) {
  const o = ctx.createOscillator(); const g = ctx.createGain()
  o.frequency.setValueAtTime(120, time)
  o.frequency.exponentialRampToValueAtTime(40, time + 0.15)
  g.gain.setValueAtTime(0.9, time); g.gain.exponentialRampToValueAtTime(0.001, time + 0.3)
  o.connect(g); g.connect(out); o.start(time); o.stop(time + 0.35)
}
function mkHat(ctx, out, time, open = false) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate)
  const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource(); src.buffer = buf
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000
  const g = ctx.createGain()
  g.gain.setValueAtTime(open ? 0.18 : 0.12, time)
  g.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.25 : 0.05))
  src.connect(hp); hp.connect(g); g.connect(out); src.start(time); src.stop(time + 0.3)
}
function mkClap(ctx, out, time) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
  const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1)*(1-i/d.length)
  const src = ctx.createBufferSource(); src.buffer = buf
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.8
  const g = ctx.createGain(); g.gain.setValueAtTime(0.35, time); g.gain.exponentialRampToValueAtTime(0.001, time+0.2)
  src.connect(bp); bp.connect(g); g.connect(out); src.start(time); src.stop(time+0.25)
}
function mkBass(ctx, out, time, freq, dur, drive) {
  const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'
  lp.frequency.setValueAtTime(300+drive*800,time); lp.frequency.exponentialRampToValueAtTime(120,time+dur*0.7); lp.Q.value=4
  const g = ctx.createGain(); g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(0.32,time+0.01); g.gain.exponentialRampToValueAtTime(0.001,time+dur)
  o.connect(lp); lp.connect(g); g.connect(out); o.start(time); o.stop(time+dur+0.05)
}
function mkChord(ctx, out, time, freqs, dur) {
  freqs.forEach(f => {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f*2
    const g = ctx.createGain()
    g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(0.06,time+0.3); g.gain.linearRampToValueAtTime(0.045,time+dur*0.7); g.gain.exponentialRampToValueAtTime(0.001,time+dur)
    const g2 = ctx.createGain(); g2.gain.value = 0.25
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(out)
    o.start(time); o2.start(time); o.stop(time+dur+0.1); o2.stop(time+dur+0.1)
  })
}
function mkPluck(ctx, out, time, freq) {
  const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = freq
  const g = ctx.createGain(); g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(0.14,time+0.005); g.gain.exponentialRampToValueAtTime(0.001,time+0.35)
  const delay = ctx.createDelay(); delay.delayTime.value = 0.22
  const fb = ctx.createGain(); fb.gain.value = 0.32
  const wet = ctx.createGain(); wet.gain.value = 0.4
  o.connect(g); g.connect(out); g.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(out)
  o.start(time); o.stop(time+0.5)
}
const midi = (root, semi) => root * Math.pow(2, semi / 12)

// ─── SoundCloud Widget embed ────────────────────────────────────
function SCWidget({ scUrl, playing, onReady, onProgress, onFinish, iframeRef }) {
  return (
    <div className="sc-widget-hidden">
      <iframe
        ref={iframeRef}
        title="SoundCloud player"
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(scUrl)}&color=%23c85a3f&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
      />
    </div>
  )
}

export function Mixes() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [curTime, setCurTime] = useState(0)

  // Web Audio refs
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const masterGainRef = useRef(null)
  const dataRef = useRef(null)
  const rafRef = useRef(null)
  const schedulerRef = useRef(null)
  const barRefs = useRef([])
  const startTimeRef = useRef(0)
  const pauseOffsetRef = useRef(0)

  // SoundCloud widget ref
  const scIframeRef = useRef(null)
  const scWidgetRef = useRef(null)

  const m = MIXES[active]
  const hasScUrl = Boolean(m.scUrl)

  // Load SC Widget API once
  useEffect(() => {
    if (window.SC) return
    const s = document.createElement('script')
    s.src = 'https://w.soundcloud.com/player/api.js'
    s.async = true
    document.head.appendChild(s)
  }, [])

  // Reset on track change
  useEffect(() => {
    stopAll()
    setProgress(0); setCurTime(0)
    pauseOffsetRef.current = 0
    scWidgetRef.current = null
  }, [active])

  // Wire SC Widget when iframe mounts
  useEffect(() => {
    if (!hasScUrl || !scIframeRef.current) return
    const tryBind = () => {
      if (!window.SC) { setTimeout(tryBind, 200); return }
      const widget = window.SC.Widget(scIframeRef.current)
      scWidgetRef.current = widget
      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, ({ currentPosition, relativePosition }) => {
        setProgress(relativePosition)
        setCurTime(currentPosition / 1000)
      })
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        setPlaying(false); setProgress(0); setCurTime(0)
      })
    }
    tryBind()
  }, [active, hasScUrl])

  // ── Audio engine ───────────────────────────────────────────────
  const ensureCtx = () => {
    if (ctxRef.current) return ctxRef.current
    const AC = window.AudioContext || window.webkitAudioContext
    const ctx = new AC()
    const analyser = ctx.createAnalyser(); analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.78
    const master = ctx.createGain(); master.gain.value = 0.6
    master.connect(analyser); analyser.connect(ctx.destination)
    ctxRef.current = ctx; analyserRef.current = analyser; masterGainRef.current = master
    dataRef.current = new Uint8Array(analyser.frequencyBinCount)
    return ctx
  }

  const scheduleLoop = () => {
    const ctx = ctxRef.current; const out = masterGainRef.current
    const t = TRACK_PARAMS[active]; const beat = 60 / t.bpm; const bar = beat * 4
    const schedule = () => {
      const now = ctx.currentTime
      while (schedulerRef.current && schedulerRef.current.nextTime < now + 0.25) {
        const { nextTime: time, step } = schedulerRef.current
        const barIdx = Math.floor(step / 16); const inBar = step % 16
        if (inBar % 4 === 0) mkKick(ctx, out, time)
        if (inBar === 4 || inBar === 12) mkClap(ctx, out, time)
        if (inBar % 2 === 1) mkHat(ctx, out, time, inBar === 15)
        if (inBar % 2 === 0) { const n = [0,0,0,-5,0,0,-2,-5][inBar/2]; mkBass(ctx, out, time, midi(t.root/2,n), beat*0.7, t.bassDrive) }
        if (inBar === 0 && barIdx % 2 === 0) mkChord(ctx, out, time, [0,7,12,15].map(n => midi(t.root, n + (barIdx%4<2?0:-2))), bar*1.8)
        if (barIdx % 4 >= 2 && [2,6,10,14].includes(inBar)) { const idx = [0,3,2,4,3,0,2,3][Math.floor(step/2)%8]; mkPluck(ctx, out, time, midi(t.root*2, t.scale[idx])) }
        schedulerRef.current.nextTime += beat / 4
        schedulerRef.current.step += 1
      }
      if (schedulerRef.current) schedulerRef.current.timer = setTimeout(schedule, 50)
    }
    schedule()
  }

  const stopAll = () => {
    if (schedulerRef.current) { clearTimeout(schedulerRef.current.timer); schedulerRef.current = null }
    if (scWidgetRef.current) { try { scWidgetRef.current.pause() } catch (e) {} }
    setPlaying(false)
  }

  const toggle = async () => {
    if (playing) {
      if (hasScUrl && scWidgetRef.current) { scWidgetRef.current.pause() }
      else { if (ctxRef.current) pauseOffsetRef.current = ctxRef.current.currentTime - startTimeRef.current; stopAll() }
      setPlaying(false)
    } else {
      if (hasScUrl && scWidgetRef.current) {
        scWidgetRef.current.play()
        setPlaying(true)
      } else {
        const ctx = ensureCtx()
        if (ctx.state === 'suspended') await ctx.resume()
        startTimeRef.current = ctx.currentTime - pauseOffsetRef.current
        schedulerRef.current = { nextTime: ctx.currentTime + 0.05, step: 0, timer: null }
        scheduleLoop()
        setPlaying(true)
      }
    }
  }

  // Animation loop for waveform bars
  useEffect(() => {
    let t0 = performance.now()
    const loop = (now) => {
      const t = (now - t0) / 1000
      const heights = new Array(N_BARS)
      const ctx = ctxRef.current; const analyser = analyserRef.current; const data = dataRef.current

      if (playing && !hasScUrl && analyser && data && ctx) {
        analyser.getByteFrequencyData(data)
        const srcLen = data.length - 6; let hasSignal = false
        for (let i = 0; i < N_BARS; i++) {
          const start = 3 + Math.floor((i/N_BARS)*srcLen); const end = 3 + Math.floor(((i+1)/N_BARS)*srcLen)
          let sum = 0; for (let j = start; j < Math.max(end, start+1); j++) sum += data[j]
          heights[i] = Math.min(1, (sum / Math.max(1, end-start)) / 180)
          if (heights[i] > 0.05) hasSignal = true
        }
        if (!hasSignal) for (let i = 0; i < N_BARS; i++) heights[i] = 0.22 + Math.sin(i*0.3+t*1.1)*0.1 + Math.sin(i*0.15+t*0.6)*0.08
        if (!hasScUrl) {
          const tr = TRACK_PARAMS[active]; const elapsed = pauseOffsetRef.current + (ctx.currentTime - startTimeRef.current - pauseOffsetRef.current)
          setProgress(Math.min(1, elapsed / tr.duration)); setCurTime(elapsed)
        }
      } else {
        for (let i = 0; i < N_BARS; i++) heights[i] = 0.22 + Math.sin(i*0.3+t*1.1)*0.1 + Math.sin(i*0.15+t*0.6)*0.08
      }
      for (let i = 0; i < N_BARS; i++) { const el = barRefs.current[i]; if (el) el.style.height = `${Math.max(4, heights[i]*100)}%` }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, active, hasScUrl])

  const mixDur = hasScUrl ? null : TRACK_PARAMS[active].duration

  return (
    <section id="listen" style={{ padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)', background: 'var(--bg-alt)', color: 'var(--ink)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
            <Mono>The Catalog · 2023—26</Mono>
            <Mono style={{ color: 'var(--ink-faint)' }}>{MIXES.length} releases</Mono>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 style={{ margin: '20px 0 60px', fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(48px, 8vw, 120px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Listen — <span style={{ fontStyle: 'italic' }}>mixes & originals</span>
          </h2>
        </Reveal>

        <Reveal>
          <div className="mix-featured" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'clamp(24px,4vw,60px)', alignItems: 'stretch', paddingBottom: 60, borderBottom: '1px solid var(--line)' }}>
            <div style={{ position: 'relative' }}>
              <Photo src={m.cover} style={{ aspectRatio: '1/1', width: '100%' }} />
              <div style={{ position: 'absolute', top: 18, left: 18, padding: '6px 12px', background: 'var(--cream)', color: 'var(--ink)' }}>
                <Mono size={10}>BA {m.n}{playing ? ' · ●' : ''}</Mono>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Mono style={{ color: 'var(--ink-faint)' }}>{m.date} · {m.len}</Mono>
                <div style={{ marginTop: 16, fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(32px,5vw,72px)', lineHeight: 1, fontStyle: 'italic' }}>{m.title}</div>
                <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {m.tags.map(tag => (
                    <span key={tag} style={{ padding: '5px 12px', border: '1px solid var(--line)', borderRadius: 999, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Waveform visualiser */}
              <div style={{ margin: '36px 0 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 72 }}>
                  {Array.from({ length: N_BARS }).map((_, i) => {
                    const played = (i / N_BARS) < progress
                    return (
                      <div key={i} ref={el => barRefs.current[i] = el} style={{
                        flex: 1, minWidth: 2,
                        background: played ? 'var(--accent)' : 'var(--ink)',
                        opacity: playing ? (played ? 1 : 0.6) : 0.5,
                        height: '15%',
                        transition: 'background 0.2s ease, opacity 0.2s ease',
                      }} />
                    )
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--ink-faint)', marginTop: 10 }}>
                  <span>{fmt(curTime)}</span>
                  <span>{mixDur ? fmt(mixDur) : m.len}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <Pill variant="solid" onClick={toggle}>
                  {playing ? '❙❙ Pause' : '▶ Play preview'}
                </Pill>
                <Pill href={m.scUrl || SC_PROFILE} target="_blank">SoundCloud ↗</Pill>
                {m.spotifyUrl && <Pill href={m.spotifyUrl} target="_blank">Spotify ↗</Pill>}
                {m.youtubeUrl && <Pill href={m.youtubeUrl} target="_blank">YouTube ↗</Pill>}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Hidden SC Widget iframe for audio engine */}
        {hasScUrl && (
          <SCWidget
            scUrl={m.scUrl}
            playing={playing}
            iframeRef={scIframeRef}
          />
        )}

        {/* Catalog list */}
        <div style={{ marginTop: 10 }}>
          {MIXES.map((mix, i) => (
            <CatalogRow key={mix.n} mix={mix} active={i === active} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CatalogRow({ mix, active, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', gap: 24,
        alignItems: 'center', padding: '26px 12px',
        borderTop: '1px solid var(--line)', cursor: 'pointer',
        transition: 'background 0.3s ease',
        background: hover ? 'color-mix(in oklab, var(--ink) 4%, transparent)' : 'transparent',
      }}
    >
      <Mono style={{ color: active ? 'var(--accent)' : 'var(--ink-faint)' }}>BA {mix.n}</Mono>
      <div style={{
        fontFamily: 'var(--display)', fontSize: 'clamp(22px,2.8vw,34px)', fontStyle: 'italic', fontWeight: 400,
        color: active ? 'var(--accent)' : 'var(--ink)',
        transform: hover ? 'translateX(6px)' : 'translateX(0)',
        transition: 'transform 0.35s ease, color 0.3s ease',
      }}>{mix.title}</div>
      <Mono style={{ color: 'var(--ink-soft)' }}>{mix.tags.join(' · ')}</Mono>
      <Mono style={{ color: 'var(--ink-faint)' }}>{mix.date} · {mix.len}</Mono>
    </div>
  )
}
