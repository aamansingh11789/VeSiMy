'use client'
// ── app/page.tsx — VeSiMy Homepage v6.0 ──────────────────────────────────────
// Refined Precision / Quiet Industrial Clarity
// Brand: deep navy + champagne gold, Instrument Serif display + Inter body

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'

// ── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY      = '#0B1D33'  // Deep Navy
const NAVY_2    = '#1E2E4A'  // Indigo
const STEEL     = '#3A5A7D'  // Steel Blue
const SLATE     = '#73879C'  // Soft Slate
const CHAMPAGNE = '#C9A66B'  // Champagne Gold
const SAND      = '#D9C8A9'  // Warm Sand
const BG        = '#F7F8FA'  // Clean canvas
const PAPER     = '#FFFFFF'  // Pure white
const SOFT_GRAY = '#E6E8EC'  // Border / divider
const INK       = '#0B1D33'  // Body text
const INK_2     = '#3A5A7D'  // Secondary text
const INK_3     = '#73879C'  // Muted text

const SANS  = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
const SERIF = "'Instrument Serif', 'Cormorant Garamond', Georgia, serif"
const MONO  = "'JetBrains Mono', monospace"

// ── Inline styles ────────────────────────────────────────────────────────────
const CSS = `
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fu  { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .fu1 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
  .fu2 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.16s both; }
  .fu3 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
  .fu4 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s both; }
  .fu5 { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.40s both; }
  
  .btn-navy {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:12px 22px; border-radius:8px;
    font-size:14px; font-weight:600; cursor:pointer;
    background:#0B1D33; color:#F7F8FA;
    border:none; text-decoration:none;
    font-family:${SANS};
    transition:all 0.18s;
    box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 2px 8px rgba(11,29,51,0.20);
  }
  .btn-navy:hover {
    background:#1E2E4A; transform: translateY(-1px);
    box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 6px 18px rgba(11,29,51,0.30);
  }
  .btn-ghost {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:12px 20px; border-radius:8px;
    font-size:14px; font-weight:500; cursor:pointer;
    background:transparent; color:#0B1D33;
    border:1px solid rgba(11,29,51,0.16);
    text-decoration:none; font-family:${SANS};
    transition:all 0.18s;
  }
  .btn-ghost:hover {
    background:#F0F4F9; border-color: rgba(11,29,51,0.28);
  }
  .nav-link {
    font-size:13px; font-weight:500; color:#3A5A7D;
    text-decoration:none; transition: color 0.15s;
    font-family:${SANS};
  }
  .nav-link:hover { color: #0B1D33; }
  
  @media (max-width: 900px) {
    .nav-links-desktop { display: none !important; }
  }
  @media (max-width: 768px) {
    .hero-headline { font-size: clamp(36px, 11vw, 56px) !important; }
    .industry-pills { gap: 12px !important; }
    .industry-pills > * { font-size: 13px !important; }
    .feature-grid { grid-template-columns: 1fr !important; }
    .metric-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .vsm-row { grid-template-columns: 1fr !important; }
    .footer-cols { grid-template-columns: 1fr 1fr !important; }
  }
`

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('vesimy-v6')) return
  const s = document.createElement('style')
  s.id = 'vesimy-v6'
  s.textContent = CSS
  document.head.appendChild(s)
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200, height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      background: scrolled ? 'rgba(247,248,250,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? `1px solid ${SOFT_GRAY}` : '1px solid transparent',
      transition: 'all 0.25s',
    }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <VLogoMark size={32} />
        <VeSiMyWordmark size={22} />
      </Link>
      <div className="nav-links-desktop" style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
        {[['Product','/#features'],['Solutions','/#solutions'],['Pricing','/pricing'],['Resources','/learn']].map(([l,h])=>(
          <Link key={l} href={h} className="nav-link">{l}</Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link href="/auth/login" className="nav-link" style={{ padding: '7px 14px' }}>Sign in</Link>
        <Link href="/auth/signup" className="btn-navy" style={{ padding: '8px 18px', fontSize: 13 }}>
          Start free
        </Link>
      </div>
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: 'relative', padding: '64px 28px 80px', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative' }}>

        {/* Top eyebrow */}
        <div className="fu" style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32,
        }}>
          <div style={{
            width: 32, height: 1, background: NAVY,
          }}/>
          <span style={{
            fontFamily: MONO, fontSize: 11, color: INK_2,
            letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 600,
          }}>
            BRAND CONCEPT · Refined Precision
          </span>
        </div>

        {/* Editorial headline — serif italic + sans */}
        <h1 className="fu1 hero-headline" style={{
          fontFamily: SERIF, fontSize: 'clamp(48px, 9vw, 96px)',
          fontWeight: 400, color: NAVY, lineHeight: 1.0,
          letterSpacing: '-0.025em', marginBottom: 28,
          maxWidth: 1000,
        }}>
          The execution layer<br/>
          for <em style={{ fontStyle: 'italic' }}>Lean</em>.
        </h1>

        {/* Two-column intro */}
        <div className="fu2" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60,
          maxWidth: 1100, marginBottom: 56, alignItems: 'end',
        }}>
          <p style={{
            fontFamily: SANS, fontSize: 18, color: INK_2,
            lineHeight: 1.6, fontWeight: 400,
          }}>
            VeSiMy empowers operations teams to <strong style={{ color: NAVY, fontWeight: 600 }}>visualize work,
            track performance, and drive continuous improvement</strong> with precision and clarity.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/auth/signup" className="btn-navy">
              Start free <span style={{ fontSize: 13 }}>→</span>
            </Link>
            <Link href="/start" className="btn-ghost">
              See it in action
            </Link>
          </div>
        </div>

        {/* The product slab - matches reference */}
        <ProductSlab />

        {/* Brand principles row */}
        <div className="fu5" style={{
          marginTop: 56, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 28, paddingTop: 32, borderTop: `1px solid ${SOFT_GRAY}`,
        }}>
          {[
            { icon: '◇', title: 'Trusted', body: 'Built for enterprise governance and security.' },
            { icon: '◎', title: 'Focused', body: 'Designed to connect strategy to daily work.' },
            { icon: '↻', title: 'Adaptive', body: 'Flexible flows that evolve with your business.' },
            { icon: '↗', title: 'Impactful', body: 'Insights that drive measurable results.' },
          ].map(p => (
            <div key={p.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6,
                border: `1px solid ${SOFT_GRAY}`, color: CHAMPAGNE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>{p.icon}</div>
              <div style={{
                fontFamily: SANS, fontSize: 13, fontWeight: 600, color: NAVY,
              }}>{p.title}</div>
              <div style={{
                fontFamily: SANS, fontSize: 12, color: INK_3, lineHeight: 1.55, maxWidth: 180,
              }}>{p.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Product Slab (live VSM-style dashboard rendered inline) ──────────────────
function ProductSlab() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 5), 1400)
    return () => clearInterval(t)
  }, [])

  const stepNames = ['Intake','Review','Approve','Execute','Complete']

  return (
    <div className="fu3" style={{
      background: NAVY, borderRadius: 18, padding: 28,
      boxShadow: '0 24px 60px -20px rgba(11,29,51,0.35), 0 1px 0 rgba(255,255,255,0.06) inset',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle champagne glow upper right */}
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(201,166,107,0.18) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}/>

      {/* Header inside the slab */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, paddingBottom: 16,
        borderBottom: '1px solid rgba(247,248,250,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={26} onDark />
          <span style={{
            fontFamily: SERIF, fontSize: 18, color: '#F7F8FA',
            letterSpacing: '-0.01em',
          }}>VeSiMy</span>
          <span style={{ color: 'rgba(247,248,250,0.20)', fontSize: 18 }}>·</span>
          <span style={{
            fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(247,248,250,0.65)',
          }}>Overview</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          fontFamily: MONO, fontSize: 10,
          color: 'rgba(247,248,250,0.4)', letterSpacing: 1,
        }}>
          <span>This Month</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="metric-grid" style={{
        position: 'relative',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16,
      }}>
        {[
          { label: 'Process Compliance', value: '92', suffix: '%', delta: '+6% vs last month', deltaPos: true },
          { label: 'Cycle Time (Avg)',   value: '4.2', suffix: 'h', delta: '–8% vs last month', deltaPos: true },
          { label: 'Tasks Completed',    value: '128', suffix: '',  delta: '+12% vs last month', deltaPos: true },
        ].map(k => (
          <div key={k.label} style={{
            background: 'rgba(247,248,250,0.04)',
            border: '1px solid rgba(247,248,250,0.08)',
            borderRadius: 10, padding: '16px 18px',
          }}>
            <div style={{
              fontFamily: SANS, fontSize: 11, color: 'rgba(247,248,250,0.5)',
              fontWeight: 500, marginBottom: 8,
            }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 8 }}>
              <span style={{
                fontFamily: SERIF, fontSize: 36, color: '#F7F8FA',
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
              }}>{k.value}</span>
              <span style={{
                fontFamily: SERIF, fontSize: 22, color: 'rgba(247,248,250,0.65)',
                fontWeight: 400,
              }}>{k.suffix}</span>
            </div>
            {/* Mini sparkline */}
            <svg width="100%" height="20" viewBox="0 0 120 20" style={{ display: 'block', marginBottom: 6 }}>
              <polyline
                points="0,15 15,12 30,14 45,9 60,11 75,7 90,8 105,5 120,3"
                fill="none" stroke={STEEL} strokeWidth="1.4" strokeLinecap="round"
              />
            </svg>
            <div style={{
              fontFamily: SANS, fontSize: 10, color: k.deltaPos ? '#7FCAA0' : '#E89B6E',
            }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Process Flow visualization */}
      <div style={{
        position: 'relative',
        background: 'rgba(247,248,250,0.04)',
        border: '1px solid rgba(247,248,250,0.08)',
        borderRadius: 10, padding: '18px 20px', marginBottom: 16,
      }}>
        <div style={{
          fontFamily: SANS, fontSize: 11, color: 'rgba(247,248,250,0.5)',
          marginBottom: 14, fontWeight: 500,
        }}>Process Flow</div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 4,
        }}>
          {stepNames.map((name, i) => {
            const active = i === step
            const complete = i < step
            return (
              <React.Fragment key={name}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  flex: '0 0 auto', transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `1.5px solid ${active ? CHAMPAGNE : complete ? STEEL : 'rgba(247,248,250,0.18)'}`,
                    background: active ? 'rgba(201,166,107,0.15)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                    boxShadow: active ? '0 0 0 4px rgba(201,166,107,0.15)' : 'none',
                  }}>
                    <span style={{
                      fontSize: 12, color: active ? CHAMPAGNE : complete ? STEEL : 'rgba(247,248,250,0.45)',
                    }}>
                      {complete ? '✓' : i === 0 ? '◇' : i === 1 ? '☰' : i === 2 ? '◉' : i === 3 ? '⚙' : '✓'}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: SANS, fontSize: 10, color: 'rgba(247,248,250,0.55)',
                    fontWeight: 500,
                  }}>{name}</span>
                </div>
                {i < stepNames.length - 1 && (
                  <div style={{
                    flex: 1, height: 1,
                    background: i < step
                      ? STEEL
                      : 'rgba(247,248,250,0.12)',
                    margin: '0 4px',
                    transition: 'all 0.3s',
                  }}/>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Bottom row */}
      <div className="vsm-row" style={{
        position: 'relative',
        display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12,
      }}>
        {/* Performance trend chart */}
        <div style={{
          background: 'rgba(247,248,250,0.04)',
          border: '1px solid rgba(247,248,250,0.08)',
          borderRadius: 10, padding: '16px 18px',
        }}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: 'rgba(247,248,250,0.5)',
            marginBottom: 12, fontWeight: 500,
          }}>Performance Trend</div>
          <svg width="100%" height="80" viewBox="0 0 320 80" style={{ display: 'block' }}>
            {/* Grid lines */}
            {[20, 40, 60].map(y => (
              <line key={y} x1="0" y1={y} x2="320" y2={y}
                stroke="rgba(247,248,250,0.06)" strokeWidth="1"/>
            ))}
            {/* Trend line */}
            <polyline
              points="0,60 40,52 80,55 120,45 160,40 200,32 240,28 280,18 320,10"
              fill="none" stroke={CHAMPAGNE} strokeWidth="2" strokeLinecap="round"
            />
            {/* Area fill */}
            <polyline
              points="0,60 40,52 80,55 120,45 160,40 200,32 240,28 280,18 320,10 320,80 0,80"
              fill="rgba(201,166,107,0.10)" stroke="none"
            />
          </svg>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 8, fontFamily: MONO, fontSize: 9,
            color: 'rgba(247,248,250,0.35)',
          }}>
            <span>Apr 1</span><span>Apr 15</span><span>Apr 29</span>
          </div>
        </div>

        {/* Top improvement donut */}
        <div style={{
          background: 'rgba(247,248,250,0.04)',
          border: '1px solid rgba(247,248,250,0.08)',
          borderRadius: 10, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* Donut */}
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
            <circle cx="32" cy="32" r="26" fill="none"
              stroke="rgba(247,248,250,0.08)" strokeWidth="6"/>
            <circle cx="32" cy="32" r="26" fill="none"
              stroke={CHAMPAGNE} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${0.68 * 163} 163`}
              transform="rotate(-90 32 32)"/>
            <text x="32" y="36" textAnchor="middle"
              fontFamily={SERIF} fontSize="18" fill="#F7F8FA" letterSpacing="-0.02em">68%</text>
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: SANS, fontSize: 11, color: 'rgba(247,248,250,0.5)',
              marginBottom: 4,
            }}>Top Improvement</div>
            <div style={{
              fontFamily: SANS, fontSize: 13, color: '#F7F8FA',
              fontWeight: 600, lineHeight: 1.3, marginBottom: 4,
            }}>Changeover Reduction</div>
            <div style={{
              fontFamily: MONO, fontSize: 10, color: 'rgba(247,248,250,0.45)',
              letterSpacing: 0.3,
            }}>● Goal: 75%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Industries strip ─────────────────────────────────────────────────────────
function Industries() {
  return (
    <section style={{ background: PAPER, padding: '40px 28px', borderTop: `1px solid ${SOFT_GRAY}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex',
        alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{
          fontFamily: MONO, fontSize: 11, color: INK_3,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
        }}>
          Built for
        </div>
        <div className="industry-pills" style={{
          display: 'flex', gap: 28, flexWrap: 'wrap',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 20, color: INK_2, fontWeight: 400,
        }}>
          {['Manufacturing','Healthcare','Logistics','Food & Beverage','Construction','Financial Services'].map(i => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How it works section ────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n:'01', title:'Map', body:'Build a current state map step by step. Capture cycle time, wait time, WIP, defects, and operators.' },
    { n:'02', title:'Measure', body:'Lead time, takt, PCE, and bottleneck identification update automatically as you work.' },
    { n:'03', title:'Improve', body:'Run 17 CI tools and let Supe AI surface the highest-leverage actions for your team.' },
    { n:'04', title:'Verify', body:'Generate a Future State VSM, track Kaizen progress, and export professional reports.' },
  ]
  return (
    <section style={{ background: BG, padding: '80px 28px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div style={{
            fontFamily: MONO, fontSize: 11, color: CHAMPAGNE,
            letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
            marginBottom: 16,
          }}>How it works</div>
          <h2 style={{
            fontFamily: SERIF, fontSize: 'clamp(36px, 5vw, 56px)',
            color: NAVY, fontWeight: 400, lineHeight: 1.05,
            letterSpacing: '-0.02em', margin: 0,
          }}>
            From process chaos<br/>
            to <em style={{ fontStyle: 'italic' }}>measurable clarity</em>.
          </h2>
        </div>
        <div className="feature-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
        }}>
          {steps.map(s => (
            <div key={s.n} style={{
              background: PAPER, borderRadius: 14, padding: '28px 24px',
              border: `1px solid ${SOFT_GRAY}`,
              boxShadow: '0 1px 2px rgba(11,29,51,0.04)',
            }}>
              <div style={{
                fontFamily: MONO, fontSize: 11, color: CHAMPAGNE,
                fontWeight: 700, letterSpacing: 1.5, marginBottom: 16,
              }}>{s.n}</div>
              <h3 style={{
                fontFamily: SERIF, fontSize: 24, color: NAVY,
                fontWeight: 400, marginBottom: 12, letterSpacing: '-0.01em',
              }}>{s.title}</h3>
              <p style={{
                fontFamily: SANS, fontSize: 13, color: INK_2,
                lineHeight: 1.65, margin: 0,
              }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    { name: 'Free Start', price: 'Free', sub: 'No account needed', cta: 'Start mapping', href: '/start',
      features: ['1 process map','Stopwatch & time study','Plain language report','1 improvement action'], featured: false },
    { name: 'Trial', price: '14 days', sub: 'No credit card', cta: 'Create account', href: '/auth/signup',
      features: ['All 17 CI tools','AI-guided workflow','Up to 3 projects','AI report preview'], featured: false },
    { name: 'Pro', price: '$29', priceSub: '/mo', sub: 'Or $23/mo billed annually', cta: 'Start Pro', href: '/auth/signup',
      features: ['Everything in Trial','Supe AI full analysis','Target State VSM','PDF export','Simulation engine','Kaizen roadmap'], featured: true },
    { name: 'Enterprise', price: 'Custom', sub: 'Volume discounts', cta: 'Talk to us', href: '/contact',
      features: ['Team collaboration','Roles & permissions','Version comparison','API + SSO + SLA'], featured: false },
  ]
  return (
    <section id="pricing" style={{ background: PAPER, padding: '80px 28px', borderTop: `1px solid ${SOFT_GRAY}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontFamily: MONO, fontSize: 11, color: CHAMPAGNE,
            letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14,
          }}>Pricing</div>
          <h2 style={{
            fontFamily: SERIF, fontSize: 'clamp(36px, 5vw, 56px)',
            color: NAVY, fontWeight: 400, lineHeight: 1.05,
            letterSpacing: '-0.02em', margin: 0,
          }}>
            Start free. Upgrade when <em style={{ fontStyle: 'italic' }}>it earns it</em>.
          </h2>
        </div>
        <div className="feature-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16, alignItems: 'start',
        }}>
          {plans.map(p => (
            <div key={p.name} style={{
              position: 'relative',
              background: p.featured ? NAVY : PAPER,
              borderRadius: 14, padding: '28px 24px',
              border: p.featured ? `1px solid ${NAVY_2}` : `1px solid ${SOFT_GRAY}`,
              boxShadow: p.featured ? '0 16px 40px -16px rgba(11,29,51,0.30)' : '0 1px 2px rgba(11,29,51,0.04)',
            }}>
              {p.featured && (
                <div style={{
                  position: 'absolute', top: -12, left: 24,
                  background: CHAMPAGNE, padding: '4px 12px', borderRadius: 100,
                }}>
                  <span style={{
                    fontFamily: MONO, fontSize: 10, fontWeight: 700,
                    color: NAVY, letterSpacing: 1.5, textTransform: 'uppercase',
                  }}>Most Popular</span>
                </div>
              )}
              <div style={{
                fontFamily: MONO, fontSize: 11, color: p.featured ? SAND : INK_3,
                letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12,
              }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{
                  fontFamily: SERIF, fontSize: 40, color: p.featured ? PAPER : NAVY,
                  fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1,
                }}>{p.price}</span>
                {(p as any).priceSub && (
                  <span style={{ fontFamily: SANS, fontSize: 14, color: p.featured ? 'rgba(247,248,250,0.6)' : INK_2 }}>
                    {(p as any).priceSub}
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 12, color: p.featured ? 'rgba(247,248,250,0.55)' : INK_3, marginBottom: 20,
              }}>{p.sub}</div>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
                  <span style={{ color: CHAMPAGNE, fontSize: 13, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
                  <span style={{
                    fontFamily: SANS, fontSize: 13,
                    color: p.featured ? 'rgba(247,248,250,0.85)' : INK_2, lineHeight: 1.5,
                  }}>{f}</span>
                </div>
              ))}
              <Link href={p.href} style={{
                display: 'block', marginTop: 22, textAlign: 'center',
                padding: '11px 18px', borderRadius: 8,
                background: p.featured ? CHAMPAGNE : NAVY,
                color: p.featured ? NAVY : PAPER,
                fontFamily: SANS, fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
              }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Bottom CTA ───────────────────────────────────────────────────────────────
function BottomCTA() {
  return (
    <section style={{ background: BG, padding: '64px 28px' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', borderRadius: 20, padding: '64px 48px',
        background: NAVY, position: 'relative', overflow: 'hidden',
        boxShadow: '0 24px 60px -20px rgba(11,29,51,0.30)',
      }}>
        {/* Subtle champagne accent */}
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(201,166,107,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}/>
        <div style={{ position: 'relative', maxWidth: 720 }}>
          <div style={{
            fontFamily: MONO, fontSize: 11, color: CHAMPAGNE,
            letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16,
          }}>Get started</div>
          <h2 style={{
            fontFamily: SERIF, fontSize: 'clamp(32px, 4.5vw, 48px)',
            color: PAPER, fontWeight: 400, lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 32,
          }}>
            Map your first process<br/>
            <em style={{ fontStyle: 'italic', color: SAND }}>in under five minutes</em>.
          </h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{
              padding: '14px 28px', borderRadius: 8,
              background: CHAMPAGNE, color: NAVY,
              fontFamily: SANS, fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(201,166,107,0.25)',
            }}>Start free →</Link>
            <Link href="/start" style={{
              padding: '14px 24px', borderRadius: 8,
              background: 'transparent', color: PAPER,
              border: '1px solid rgba(247,248,250,0.20)',
              fontFamily: SANS, fontSize: 14, fontWeight: 500,
              textDecoration: 'none',
            }}>Watch the demo</Link>
            <span style={{
              fontFamily: MONO, fontSize: 11, color: 'rgba(247,248,250,0.40)',
              letterSpacing: 0.5, marginLeft: 8,
            }}>No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: PAPER, borderTop: `1px solid ${SOFT_GRAY}`, padding: '48px 28px 32px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="footer-cols" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 32,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <VLogoMark size={28} />
              <VeSiMyWordmark size={20} />
            </div>
            <p style={{
              fontFamily: SANS, fontSize: 13, color: INK_3,
              lineHeight: 1.6, maxWidth: 280, margin: 0,
            }}>
              The execution layer for Lean. Map it. Measure it. Improve it.
            </p>
          </div>
          {[
            ['Product', [['Features','/features'],['Pricing','/pricing'],['Resources','/learn']]],
            ['Company', [['About','/about'],['Blog','/blog'],['Contact','/contact']]],
            ['Resources', [['Documentation','/docs'],['ISO 22468','/iso-22468'],['Glossary','/lean-glossary']]],
          ].map(([h, links]) => (
            <div key={h as string}>
              <div style={{
                fontFamily: MONO, fontSize: 11, color: NAVY,
                letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14,
              }}>{h as string}</div>
              {(links as [string,string][]).map(([l,href]) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <Link href={href} style={{
                    fontFamily: SANS, fontSize: 13, color: INK_2,
                    textDecoration: 'none',
                  }}>{l}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: `1px solid ${SOFT_GRAY}`, paddingTop: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 11, color: INK_3, letterSpacing: 0.3,
          }}>© 2026 VeSiMy · Structured using ISO 22468:2020 methodology</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy','Terms','Security'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{
                fontFamily: SANS, fontSize: 12, color: INK_3, textDecoration: 'none',
              }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function HomePage() {
  useEffect(() => { injectStyles() }, [])
  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: SANS, color: INK }}>
      <Nav />
      <Hero />
      <Industries />
      <HowItWorks />
      <Pricing />
      <BottomCTA />
      <Footer />
    </div>
  )
}
