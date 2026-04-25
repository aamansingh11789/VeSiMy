// TypeScript enabled
// ── app/page.tsx ──────────────────────────────────────────────────────────
// VeSiMy v4.0 homepage
// Design: blue-steel dark, Satoshi + JetBrains Mono, 3D physical depth

// @ts-nocheck
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase'

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg0:      '#02040D',
  bg1:      '#060C1A',
  bg2:      '#0A1228',
  bg3:      '#0F1830',
  bg4:      '#162040',
  bg5:      '#1C2850',
  blue:     '#3B7CFF',
  blueDim:  '#2760E0',
  blueGlow: 'rgba(59,124,255,0.15)',
  blueBdr:  'rgba(59,124,255,0.25)',
  blueLight:'#90BAFF',
  cyan:     '#22D3EE',
  purple:   '#A78BFA',
  green:    '#34D399',
  t1:       '#EEF2FF',
  t2:       '#8B9CC8',
  t3:       '#4B5880',
  t4:       '#2A3455',
  b1:       'rgba(255,255,255,0.04)',
  b2:       'rgba(255,255,255,0.07)',
  b3:       'rgba(255,255,255,0.12)',
  b4:       'rgba(255,255,255,0.18)',
}

const sans = '-apple-system,BlinkMacSystemFont,"Segoe UI","Satoshi",Arial,sans-serif'
const mono = '"JetBrains Mono","IBM Plex Mono","Courier New",monospace'

const cardShadow = `
  inset 0 1px 0 rgba(255,255,255,0.09),
  inset 0 -1px 0 rgba(0,0,0,0.5),
  3px 3px 0 rgba(4,8,20,0.9),
  6px 6px 0 rgba(3,6,15,0.7),
  9px 9px 0 rgba(2,4,10,0.4),
  0 16px 40px rgba(0,0,0,0.7)
`
const btnShadow = `
  inset 0 1px 0 rgba(255,255,255,0.25),
  inset 0 -1px 0 rgba(0,0,0,0.3),
  0 2px 0 rgba(20,50,140,0.9),
  0 4px 0 rgba(15,38,105,0.7),
  0 6px 0 rgba(10,25,70,0.5),
  0 8px 24px rgba(59,124,255,0.25)
`
const textShadow3d = '0 2px 0 rgba(0,0,0,0.4), 0 4px 0 rgba(0,0,0,0.25), 0 6px 20px rgba(0,0,0,0.5)'

// ── Counter ───────────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let t0 = 0
      const dur = 1400
      const step = (t: number) => {
        if (!t0) t0 = t
        const p = Math.min((t - t0) / dur, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(ease * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val}{suffix}</span>
}

// ── Dot grid ──────────────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div style={{
      position:   'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
      backgroundSize: '28px 28px', opacity: 0.16,
    }} />
  )
}

// ── Section label ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: C.blueGlow, border: `1px solid ${C.blueBdr}`,
      borderRadius: 20, padding: '5px 14px', marginBottom: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue, display: 'block' }} />
      <span style={{ fontSize: 12, color: C.blueLight, letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' as const }}>
        {children}
      </span>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────
function FeatureCard({ icon, title, body, accent }: { icon: string; title: string; body: string; accent?: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   `linear-gradient(145deg, ${C.bg2}, ${C.bg3})`,
        border:       `1px solid ${hovered ? (accent || C.blue) + '44' : C.b2}`,
        borderRadius: 16,
        padding:      '24px',
        boxShadow:    cardShadow,
        transition:   'transform 0.2s, border-color 0.2s',
        transform:    hovered ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
      <div style={{ color: C.t1, fontSize: 16, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{title}</div>
      <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{body}</p>
    </div>
  )
}

// ── Typewriter ────────────────────────────────────────────────────────────
const SUPE_LINES = [
  'Analyzing your value stream...',
  'Bottleneck detected at step 4.',
  'Process cycle efficiency: 14.2%',
  'Waste type: Waiting (52% of lead time)',
  'First action: Time study on step 4.',
  'Expected gain: 3.2 day lead time cut.',
]

function Typewriter() {
  const [lineIdx, setLineIdx] = useState(0)
  const [chars,   setChars]   = useState(0)
  const [done,    setDone]    = useState(false)

  useEffect(() => {
    const line = SUPE_LINES[lineIdx]
    if (chars < line.length) {
      const t = setTimeout(() => setChars(c => c + 1), 28)
      return () => clearTimeout(t)
    }
    if (!done) {
      setDone(true)
      const t = setTimeout(() => {
        setDone(false)
        setChars(0)
        setLineIdx(i => (i + 1) % SUPE_LINES.length)
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [chars, lineIdx, done])

  return (
    <div style={{ fontFamily: mono, fontSize: 13, color: C.cyan, lineHeight: 1.6, minHeight: 22 }}>
      {SUPE_LINES[lineIdx].slice(0, chars)}
      <span style={{ opacity: done ? 0 : 1, transition: 'opacity 0.1s', color: C.t1 }}>|</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function HomePage() {
  const [user,       setUser]       = useState<any>(null)
  const [showPromo,  setShowPromo]  = useState(true)
  const [navScroll,  setNavScroll]  = useState(false)
  const [copied,     setCopied]     = useState(false)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
    const handler = () => setNavScroll(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const copyPromo = () => {
    navigator.clipboard?.writeText('SPRING25').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: C.bg0, color: C.t1, fontFamily: sans, position: 'relative', overflowX: 'hidden' }}>
      <DotGrid />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position:     'sticky', top: 0, zIndex: 100,
        padding:      '0 clamp(16px,4vw,48px)',
        height:       64,
        display:      'flex', alignItems: 'center', justifyContent: 'space-between',
        background:   navScroll ? 'rgba(2,4,13,0.92)' : 'transparent',
        backdropFilter: navScroll ? 'blur(16px)' : 'none',
        borderBottom: navScroll ? `1px solid ${C.b1}` : '1px solid transparent',
        transition:   'background 0.3s, border-color 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
              borderRadius: 8, padding: 6,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 2px 2px 0 rgba(0,0,0,0.4)`,
            }}>
              <VLogoMark size={22} />
            </div>
            <VeSiMyWordmark size={15} onDark />
          </Link>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: C.t2 }}>
            {[['Guided', '/auth/signup'], ['Industries', '/industries'], ['Blog', '/blog'], ['Pricing', '/pricing']].map(([l, h]) => (
              <Link key={l} href={h} style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
                onMouseLeave={e => (e.currentTarget.style.color = C.t2)}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '9px 20px', borderRadius: 9, border: 'none',
                background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
                color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: sans, boxShadow: btnShadow,
              }}>Dashboard</button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" style={{ textDecoration: 'none', color: C.t2, fontSize: 14, fontWeight: 500 }}>Log in</Link>
              <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '9px 20px', borderRadius: 9, border: 'none',
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
                  color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: sans, boxShadow: btnShadow,
                }}>Start free</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{
        position:   'relative', zIndex: 1,
        padding:    'clamp(80px,12vh,140px) clamp(16px,4vw,48px) clamp(60px,8vh,100px)',
        textAlign:  'center',
        maxWidth:   900, margin: '0 auto',
      }}>
        <SectionLabel>Value Stream Mapping — Reimagined</SectionLabel>

        <h1 style={{
          fontSize:      'clamp(32px,5.5vw,72px)',
          fontWeight:    800,
          letterSpacing: '-0.03em',
          lineHeight:    1.05,
          margin:        '0 0 28px',
          textShadow:    textShadow3d,
        }}>
          Every operation has a process.
          <br />Every process has waste.
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${C.blue} 0%, ${C.cyan} 55%, ${C.purple} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Most teams cannot see it clearly enough to fix it.
          </span>
        </h1>

        <p style={{ fontSize: 18, color: C.t2, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 48px' }}>
          VeSiMy changes that. Map your process, find the waste, prove the improvement.
          Simple enough for anyone. Rigorous enough for a Master Black Belt.
        </p>

        {/* Two entry paths */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))',
          gap: 20, maxWidth: 680, margin: '0 auto 56px',
        }}>
          {/* Guided */}
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <div style={{
              background: `linear-gradient(145deg, ${C.bg2}, ${C.bg3})`,
              border:     `1px solid ${C.blueBdr}`,
              borderRadius: 16, padding: '24px 20px',
              boxShadow:  cardShadow, textAlign: 'left', cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>🧭</div>
              <div style={{ color: C.t1, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>VeSiMy Guided</div>
              <div style={{ color: C.blueLight, fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>New to process mapping?</div>
              <p style={{ color: C.t2, fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' }}>
                8-step onboarding walks you through your first VSM from scratch. No methodology knowledge required.
              </p>
              <div style={{ color: C.blueLight, fontSize: 13, fontWeight: 700 }}>Start here →</div>
            </div>
          </Link>
          {/* Pro */}
          <Link href="/auth/signup?plan=pro" style={{ textDecoration: 'none' }}>
            <div style={{
              background: `linear-gradient(145deg, ${C.bg2}, ${C.bg3})`,
              border:     `1px solid ${C.b3}`,
              borderRadius: 16, padding: '24px 20px',
              boxShadow:  cardShadow, textAlign: 'left', cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>⚡</div>
              <div style={{ color: C.t1, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>VeSiMy Pro</div>
              <div style={{ color: C.t3, fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Already know lean?</div>
              <p style={{ color: C.t2, fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' }}>
                Full VSM canvas, all methodology tools, AI lean report engine. No hand-holding.
              </p>
              <div style={{ color: C.t3, fontSize: 13, fontWeight: 700 }}>Use the full tool →</div>
            </div>
          </Link>
        </div>

        {/* Free start CTA */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/start" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 40px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
              color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: sans,
              boxShadow: btnShadow,
            }}>
              Map a process free — no account needed
            </button>
          </Link>
          <p style={{ color: C.t4, fontSize: 13, marginTop: 10 }}>
            Or{' '}
            <Link href="/auth/signup" style={{ color: C.blueLight, textDecoration: 'none' }}>
              start your 14-day free trial
            </Link>
            {' '}— no card required
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 'clamp(20px,4vw,60px)', flexWrap: 'wrap',
        }}>
          {[
            { target: 68,  suffix: '',   label: 'Industries' },
            { target: 70,  suffix: '+',  label: 'Reference projects' },
            { target: 200, suffix: '+',  label: 'Lean knowledge chunks' },
            { target: 14,  suffix: 'd',  label: 'Free trial' },
          ].map(({ target, suffix, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: mono, fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700,
                color: C.t1, letterSpacing: '-0.02em',
                textShadow: textShadow3d,
              }}>
                <Counter target={target} suffix={suffix} />
              </div>
              <div style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHOTO DIVIDER 1 ──────────────────────────────────────────────── */}
      <section style={{
        position:   'relative', zIndex: 1, overflow: 'hidden',
        height:     'clamp(180px,25vw,320px)',
      }}>
        <div style={{
          position:   'absolute', inset: 0,
          backgroundImage:  'url(/photos/IMG_4913.webp)',
          backgroundSize:   'cover',
          backgroundPosition: 'center 35%',
          filter:     'brightness(0.35) saturate(0.6)',
        }} />
        <div style={{
          position:   'absolute', inset: 0,
          background: `linear-gradient(to right, ${C.bg0}, transparent 30%, transparent 70%, ${C.bg0})`,
        }} />
        <div style={{
          position:   'relative', zIndex: 1,
          height:     '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding:    '0 24px', textAlign: 'center',
        }}>
          <p style={{
            fontSize: 'clamp(18px,3vw,28px)', fontWeight: 700,
            color: C.t1, letterSpacing: '-0.01em',
            textShadow: textShadow3d,
            maxWidth: 600,
          }}>
            Every process has a constraint.{' '}
            <span style={{ color: C.cyan }}>VeSiMy finds it.</span>
          </p>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding:  'clamp(60px,8vh,100px) clamp(16px,4vw,48px)',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel>Platform</SectionLabel>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 12px', textShadow: textShadow3d }}>
            Built on real methodology
          </h2>
          <p style={{ color: C.t2, fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Not a digital sticky note board. A lean practitioner's tool that knows the difference between
            a bottleneck and a constraint.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          <FeatureCard
            icon="🗺"
            title="Value Stream Mapping"
            body="ISO 22468-aligned VSM canvas with current state, future state, and gap analysis. Information flows, WIP queues, push/pull, takt time — all there."
            accent={C.blue}
          />
          <FeatureCard
            icon="🔄"
            title="PDCA, 8D, DMAIC, OODA"
            body="Every major methodology tool in one platform. Each connected to your VSM so the analysis informs the improvement cycle automatically."
            accent={C.cyan}
          />
          <FeatureCard
            icon="🧠"
            title="AI Lean Report Engine"
            body="Not generic AI advice. Reports built from a 200+ chunk lean knowledge base, your actual process data, and 12+ years of real operations experience."
            accent={C.purple}
          />
          <FeatureCard
            icon="🏭"
            title="68 Industries"
            body="A craft brewery never sees hospital terminology. The language engine adapts every step, metric, and AI response to your industry. 40+ terms adapted per industry."
            accent={C.green}
          />
          <FeatureCard
            icon="📱"
            title="Mobile Floor Observation"
            body="Stopwatch-based time study on the floor from your phone. Offline capable. Syncs when connected. Cycle time data feeds directly into your VSM data strips."
            accent={C.cyan}
          />
          <FeatureCard
            icon="📊"
            title="Version History"
            body="Every saved state of every project is kept. Compare current state to where you were six months ago. The improvement is on record."
            accent={C.blue}
          />
        </div>
      </section>

      {/* ── PHOTO DIVIDER 2 — Problem ────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/photos/IMG_4867.webp)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.2) saturate(0.5)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.bg0} 0%, transparent 20%, transparent 80%, ${C.bg0} 100%)` }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: 'clamp(60px,8vh,100px) clamp(16px,4vw,48px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel>The Problem</SectionLabel>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 12px', textShadow: textShadow3d }}>
              Most operations know where the waste is.
              <br />
              <span style={{ color: C.t3 }}>Almost none can prove it clearly enough to fix it.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {[
              { color: C.blue,   title: 'The data is scattered', body: 'Stopwatch on a phone. Times in a spreadsheet. Notes from the floor walk. Nobody can see it as a whole picture.' },
              { color: C.purple, title: 'The methodology is disconnected', body: 'PDCA runs. 8D forms. Kaizen boards. None of it connected to the actual value stream. Improvement is anecdotal.' },
              { color: '#F87171',  title: 'The case is hard to make', body: 'You know the bottleneck is step 4. Proving the 3-day lead time reduction requires a document nobody has time to build.' },
            ].map(({ color, title, body }) => (
              <div key={title} style={{
                borderTop: `3px solid ${color}`,
                background: `linear-gradient(145deg, ${C.bg2}, ${C.bg3})`,
                border: `1px solid ${C.b2}`, borderTop: `3px solid ${color}`,
                borderRadius: 16, padding: '24px',
                boxShadow: cardShadow,
              }}>
                <div style={{ color: C.t1, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{title}</div>
                <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPE AI ──────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/photos/IMG_4866.webp)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.15) saturate(0.4)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.bg0} 0%, transparent 15%, transparent 85%, ${C.bg0} 100%)` }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: 'clamp(60px,8vh,100px) clamp(16px,4vw,48px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <SectionLabel>Supe AI</SectionLabel>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 16px', textShadow: textShadow3d }}>
                An AI that knows lean.<br />
                <span style={{ color: C.cyan }}>Not just language models.</span>
              </h2>
              <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                Supe is trained on 200+ lean methodology chunks from VSM, PDCA, 8D, DMAIC, SMED,
                Takt Time, OEE, Little's Law, and more. It responds in your industry's language.
                It never hallucinates a lean concept it doesn't know.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Bottleneck identification from your actual data',
                  'Waste classification with methodology explanations',
                  'Improvement recommendations with effort estimates',
                  '68 industry-aware terminology engine',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: C.cyan, fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
                    <span style={{ color: C.t2, fontSize: 14, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Live demo card */}
            <div style={{
              background: C.bg2, border: `1px solid ${C.b2}`,
              borderRadius: 16, padding: '20px',
              boxShadow: cardShadow,
              fontFamily: mono,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${C.b1}` }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#F87171', '#FBBF24', '#34D399'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ color: C.t3, fontSize: 12 }}>Supe AI — Live Analysis</span>
              </div>
              <div style={{ fontSize: 12, color: C.t3, marginBottom: 6 }}>{'>'} analyze /project/morning-prep</div>
              <Typewriter />
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.b1}` }}>
                <div style={{ color: C.t4, fontSize: 11, marginBottom: 6 }}>KNOWLEDGE BASE</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['VSM', 'SMED', 'OEE', 'Takt', 'PCE', 'LT', '5S', 'Kanban'].map(t => (
                    <span key={t} style={{
                      background: C.blueGlow, border: `1px solid ${C.blueBdr}`,
                      color: C.blueLight, fontSize: 10, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 4,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRACTITIONER STATEMENT ──────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,8vh,100px) clamp(16px,4vw,48px)', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: `linear-gradient(145deg, ${C.bg2}, ${C.bg3})`,
          border: `1px solid ${C.b2}`, borderRadius: 20, padding: 'clamp(28px,4vw,48px)',
          boxShadow: cardShadow,
        }}>
          <div style={{ fontSize: 40, marginBottom: 20, opacity: 0.6 }}>"</div>
          <blockquote style={{ fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 600, lineHeight: 1.55, color: C.t1, margin: '0 0 20px', letterSpacing: '-0.01em', fontStyle: 'italic' }}>
            Lean is not a manufacturing methodology. It is the discipline of seeing clearly.
            Every business has a process. Every process has waste. The only question is whether
            you can see it. VeSiMy makes it visible.
          </blockquote>
          <div style={{ color: C.t3, fontSize: 13, lineHeight: 1.6 }}>
            Max Singh, Founder VeSiMy<br />
            <span style={{ color: C.t4 }}>LSS Green Belt · 12+ years manufacturing operations · ex-Tesla</span>
          </div>
        </div>
      </section>

      {/* ── FOUNDER PHOTO SECTION ────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/photos/IMG_4901.webp)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'brightness(0.18) saturate(0.4)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.bg0} 0%, transparent 20%, transparent 80%, ${C.bg0} 100%)` }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: 'clamp(60px,8vh,100px) clamp(16px,4vw,48px)', textAlign: 'center' }}>
          <SectionLabel>Methodology</SectionLabel>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 20px', textShadow: textShadow3d }}>
            Built by someone who spent 12+ years on the floor.
          </h2>
          <p style={{ color: C.t2, fontSize: 16, lineHeight: 1.7, maxWidth: 580, margin: '0 auto 32px' }}>
            Not a software company that added lean terminology to a flowchart builder. The methodology
            is correct because the person who built it used it on real problems in real operations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {['ISO 22468 compliant', 'LSS Green Belt built', 'ex-Tesla operations', '68 industries calibrated'].map(b => (
              <div key={b} style={{
                background: C.blueGlow, border: `1px solid ${C.blueBdr}`,
                color: C.blueLight, fontSize: 13, fontWeight: 600,
                padding: '8px 16px', borderRadius: 20,
              }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,8vh,100px) clamp(16px,4vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <SectionLabel>Pricing</SectionLabel>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.025em', margin: 0, textShadow: textShadow3d }}>
            Start free. Upgrade when it earns it.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Free Start', price: 'Free', sub: 'No account', cta: 'Map now', href: '/start', accent: C.cyan },
            { label: 'Free Trial', price: 'Free', sub: '14 days, no card', cta: 'Start trial', href: '/auth/signup', accent: C.blue },
            { label: 'Pro', price: '$49/mo', sub: 'Full platform', cta: 'Get Pro', href: '/auth/signup?plan=pro', accent: C.t1, highlight: true },
            { label: 'Enterprise', price: 'Custom', sub: 'Team + SLA', cta: 'Contact sales', href: '/enterprise', accent: C.purple },
          ].map(({ label, price, sub, cta, href, accent, highlight }) => (
            <div key={label} style={{
              background: highlight
                ? `linear-gradient(135deg, rgba(240,240,245,0.96), rgba(210,215,235,0.95))`
                : `linear-gradient(145deg, ${C.bg2}, ${C.bg3})`,
              border: `1px solid ${highlight ? 'rgba(255,255,255,0.6)' : C.b2}`,
              borderRadius: 16, padding: '22px 18px',
              boxShadow: highlight ? `inset 0 1px 0 rgba(255,255,255,0.6), 3px 3px 0 rgba(80,80,80,0.4), 6px 6px 0 rgba(60,60,60,0.3), 0 16px 40px rgba(0,0,0,0.6)` : cardShadow,
              textAlign: 'center',
            }}>
              <div style={{ color: highlight ? C.bg2 : accent, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: highlight ? C.bg0 : C.t1, marginBottom: 4 }}>{price}</div>
              <div style={{ color: highlight ? C.bg3 : C.t3, fontSize: 12, marginBottom: 16 }}>{sub}</div>
              <Link href={href} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: highlight ? `linear-gradient(135deg, ${C.bg0}, ${C.bg2})` : 'transparent',
                  color: highlight ? C.t1 : accent,
                  border: highlight ? 'none' : `1px solid ${accent}44`,
                  fontSize: 13, fontWeight: 700, fontFamily: sans,
                }}>{cta}</button>
              </Link>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link href="/pricing" style={{ color: C.t3, fontSize: 13, textDecoration: 'none', borderBottom: `1px solid ${C.b3}`, paddingBottom: 2 }}>
            View full pricing details →
          </Link>
        </div>
      </section>

      {/* ── PROMO ────────────────────────────────────────────────────────── */}
      {showPromo && (
        <div style={{ padding: '0 clamp(16px,4vw,48px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 24 }}>
            <div style={{
              background: C.blueGlow, border: `1px solid ${C.blueBdr}`,
              borderRadius: 12, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 18 }}>🌱</span>
              <div style={{ flex: 1, minWidth: 180, fontSize: 14, color: C.t2, lineHeight: 1.5 }}>
                <strong style={{ color: C.t1 }}>Spring CI Sprint</strong>{' '}
                — 25% off your first 3 months. Use code{' '}
                <code style={{ background: C.blueGlow, border: `1px solid ${C.blueBdr}`, padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: C.blueLight, fontFamily: mono }}>
                  SPRING25
                </code>
              </div>
              <button onClick={copyPromo} style={{
                padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.blueBdr}`,
                background: C.blueGlow, cursor: 'pointer', fontSize: 13, color: C.blueLight,
                fontWeight: 600, fontFamily: sans,
              }}>
                {copied ? 'Copied!' : 'Copy code'}
              </button>
              <button onClick={() => setShowPromo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(80px,12vh,120px) clamp(16px,4vw,48px)',
        textAlign: 'center',
        background: `linear-gradient(180deg, ${C.bg0} 0%, ${C.bg1} 100%)`,
        borderTop: `1px solid ${C.b1}`,
      }}>
        <h2 style={{
          fontSize: 'clamp(28px,5vw,60px)',
          fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08,
          margin: '0 0 16px', textShadow: textShadow3d,
        }}>
          Your process has a bottleneck.
          <br />
          <span style={{ color: C.cyan }}>Now you can see it.</span>
        </h2>
        <p style={{ color: C.t2, fontSize: 17, maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.7 }}>
          Free to start. No credit card. No methodology jargon unless you want it.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 40px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
              color: '#fff', fontSize: 16, fontWeight: 700,
              fontFamily: sans, boxShadow: btnShadow,
            }}>Start 14-day free trial</button>
          </Link>
          <Link href="/start" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 32px', borderRadius: 12, cursor: 'pointer',
              background: 'transparent', border: `2px solid ${C.b3}`,
              color: C.t2, fontSize: 15, fontWeight: 600, fontFamily: sans,
            }}>Try without an account</button>
          </Link>
        </div>
        <p style={{ fontFamily: mono, fontSize: 11, color: C.t4, marginTop: 24 }}>
          ISO 9001:2015 · ISO 22468:2020 · IATF 16949 aligned
        </p>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${C.b1}`,
        padding: 'clamp(20px,3vw,28px) clamp(16px,4vw,48px)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 16,
        background: C.bg0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={24} />
          <VeSiMyWordmark size={14} onDark />
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: C.t4, flexWrap: 'wrap' }}>
          {[['About','/about'],['Blog','/blog'],['Changelog','/changelog'],['Pricing','/pricing'],['Learn','/learn'],['Privacy','/privacy'],['Terms','/terms'],['Contact','mailto:founder@vesimy.com']].map(([l,h]) => (
            <Link key={l} href={h} style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.blueLight)}
              onMouseLeave={e => (e.currentTarget.style.color = C.t4)}>
              {l}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.t4, letterSpacing: 1.5 }}>© 2026 VeSiMy</span>
      </footer>

    </div>
  )
}
