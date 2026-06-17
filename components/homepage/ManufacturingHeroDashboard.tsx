'use client'
// ── components/homepage/ManufacturingHeroDashboard.tsx ────────────────────────
// Premium manufacturing analytics hero, 3D tilted tablet + dark analytics panel
// Self-contained: no external chart libs, CSS-only charts, Tailwind + inline styles

import { useEffect, useRef, useState } from 'react'

// ─── DATA ───────────────────────────────────────────────────────────────────
const WORKFLOW = [
  { id: 'supplier',   label: 'Supplier',    type: 'endpoint', ct: null,   co: null,   warn: false, bot: false },
  { id: 'production', label: 'Production',  type: 'process',  ct: '45s',  co: '8m',   warn: false, bot: false },
  { id: 'assembly',   label: 'Assembly',    type: 'process',  ct: '75s',  co: '12m',  warn: false, bot: true  },
  { id: 'inspection', label: 'Inspection',  type: 'process',  ct: '35s',  co: '5m',   warn: true,  bot: false },
  { id: 'packaging',  label: 'Packaging',   type: 'process',  ct: '20s',  co: '3m',   warn: false, bot: false },
  { id: 'customer',   label: 'Customer',    type: 'endpoint', ct: null,   co: null,   warn: false, bot: false },
]

const MINI_CARDS = [
  { step: 'Production', ct: '45s', wip: 12, va: 'VA' },
  { step: 'Assembly',   ct: '75s', wip: 18, va: 'NVA', hot: true },
  { step: 'Inspection', ct: '35s', wip: 8,  va: 'NNVA' },
  { step: 'Packaging',  ct: '20s', wip: 5,  va: 'VA' },
]

const KPIS = [
  { label: 'Lead Time',         value: '12.6d', delta: '+8%',  up: true,  icon: '⟳' },
  { label: 'Value Added Time',  value: '3.5h',  delta: '+12%', up: true,  icon: '◎' },
  { label: 'PCE',               value: '27.8%', delta: '+6%',  up: true,  icon: '⚡' },
  { label: 'WIP',               value: '49',    delta: '-5%',  up: false, icon: '▦' },
]

const ANALYTICS_KPIS = [
  { label: 'Lead Time',        value: '12.6d', color: '#60A5FA' },
  { label: 'Cycle Time',       value: '210s',  color: '#34D399' },
  { label: 'Value Added Time', value: '3.2d',  color: '#A78BFA' },
  { label: 'PCE',              value: '27.8%', color: '#D9C08A' },
  { label: 'WIP',              value: '49',    color: '#F87171' },
]

const LEAD_TREND = [38, 32, 35, 28, 30, 24, 22, 18, 20, 15, 17, 13]
const PCE_DATA   = [
  { label: 'Jan', target: 30, actual: 22 },
  { label: 'Feb', target: 30, actual: 24 },
  { label: 'Mar', target: 30, actual: 26 },
  { label: 'Apr', target: 30, actual: 25 },
  { label: 'May', target: 30, actual: 28 },
  { label: 'Jun', target: 30, actual: 29 },
]
const WASTE = [
  { label: 'Waiting',         pct: 35, color: '#60A5FA' },
  { label: 'Motion',          pct: 22, color: '#34D399' },
  { label: 'Overprocess',     pct: 18, color: '#A78BFA' },
  { label: 'Overproduction',  pct: 15, color: '#D9C08A' },
  { label: 'Defects',         pct: 10, color: '#F87171' },
]

// ─── TINY DONUT ─────────────────────────────────────────────────────────────
function Donut({ slices }: { slices: typeof WASTE }) {
  const r = 36, cx = 44, cy = 44, stroke = 14
  const circ = 2 * Math.PI * r
  let offset = 0
  const arcs = slices.map(s => {
    const dash = (s.pct / 100) * circ
    const arc = { dash, offset, color: s.color }
    offset += dash
    return arc
  })
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={a.color} strokeWidth={stroke}
          strokeDasharray={`${a.dash} ${circ - a.dash}`}
          strokeDashoffset={circ / 4 - a.offset}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={11} fontWeight={700} fontFamily="monospace">432%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={7} fontFamily="monospace">WASTE</text>
    </svg>
  )
}

// ─── TINY LINE CHART ─────────────────────────────────────────────────────────
function LineChart({ data, color = '#60A5FA' }: { data: number[]; color?: string }) {
  const W = 120, H = 44
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - 8) + 4
    const y = H - 4 - ((v - min) / range) * (H - 12)
    return `${x},${y}`
  }).join(' ')
  const fill = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - 8) + 4
    const y = H - 4 - ((v - min) / range) * (H - 12)
    return `${x},${y}`
  })
  const areaD = `M ${fill[0]} ${fill.slice(1).map(p => 'L ' + p).join(' ')} L ${(W - 8) + 4},${H - 4} L 4,${H - 4} Z`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lg1)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* last dot */}
      {(() => {
        const lx = parseFloat(fill[fill.length - 1].split(',')[0])
        const ly = parseFloat(fill[fill.length - 1].split(',')[1])
        return <circle cx={lx} cy={ly} r={2.5} fill={color} />
      })()}
    </svg>
  )
}

// ─── TINY BAR CHART ─────────────────────────────────────────────────────────
function BarChart({ data }: { data: typeof PCE_DATA }) {
  const W = 120, H = 44, barW = 8, gap = (W - data.length * barW * 2 - 4) / (data.length - 1)
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {data.map((d, i) => {
        const x = 2 + i * (barW * 2 + gap)
        const tH = (d.target / 35) * (H - 8)
        const aH = (d.actual / 35) * (H - 8)
        return (
          <g key={i}>
            <rect x={x} y={H - 4 - tH} width={barW} height={tH} rx={2} fill="rgba(96,165,250,0.25)" />
            <rect x={x + barW + 1} y={H - 4 - aH} width={barW} height={aH} rx={2} fill="#60A5FA" />
          </g>
        )
      })}
    </svg>
  )
}

// ─── ICON RAIL ───────────────────────────────────────────────────────────────
const RAIL_ICONS = ['◈', '▦', '⚡', '◎', '⚙']

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function ManufacturingHeroDashboard() {
  const [activeStep, setActiveStep] = useState('assembly')
  const [animated, setAnimated]     = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{
      background: 'linear-gradient(160deg, #F0F4FF 0%, #EAF0FB 40%, #F5F0FF 100%)',
      padding: '80px 24px 96px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Subtle background blobs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        {/* ── HERO COPY ── */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 999, padding: '5px 16px', marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3A5A7D', display: 'inline-block', boxShadow: '0 0 6px #3A5A7D' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#3A5A7D', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Manufacturing Intelligence</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1,
            color: '#0F172A', letterSpacing: -1, marginBottom: 16,
            fontFamily: '"Sora","Book Antiqua",Sora,Inter,sans-serif',
          }}>
            See every bottleneck<br />
            <span style={{ color: '#3A5A7D' }}>before it slows production.</span>
          </h2>
          <p style={{ fontSize: 15, color: '#64748B', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Track cycle time, WIP, value-added time, and process efficiency across your line in one visual command center.
          </p>
        </div>

        {/* ── 3D TABLET DASHBOARD ── */}
        <div style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 40%',
          marginBottom: 32,
          opacity: animated ? 1 : 0,
          transform: animated ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div style={{
            transform: 'rotateX(14deg) rotateY(-3deg)',
            transformStyle: 'preserve-3d',
            borderRadius: 24,
            background: 'white',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 2px 0 rgba(0,0,0,0.04), 0 8px 0 rgba(0,0,0,0.03), 0 24px 48px rgba(0,0,0,0.12), 0 48px 80px rgba(99,102,241,0.08)',
            overflow: 'hidden',
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {/* Tablet chrome top bar */}
            <div style={{ height: 36, background: '#F8FAFF', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#C94F4F' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFD93D' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6BCB77' }} />
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 6, padding: '3px 20px', fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>vesimy.com/project/asm-line-a</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['○', '□', '⟳'].map(s => <span key={s} style={{ fontSize: 11, color: '#CBD5E1', cursor: 'pointer' }}>{s}</span>)}
              </div>
            </div>

            {/* Dashboard body */}
            <div style={{ display: 'flex', height: 380 }}>
              {/* Left icon rail */}
              <div style={{
                width: 48, background: '#F1F5F9', borderRight: '1px solid rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '12px 0', gap: 4,
              }}>
                {/* Logo mark */}
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#3A5A7D,#1E2E4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'white', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>V</span>
                </div>
                {RAIL_ICONS.map((icon, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i === 0 ? 'white' : 'transparent',
                    boxShadow: i === 0 ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer', fontSize: 13, color: i === 0 ? '#3A5A7D' : '#94A3B8',
                  }}>{icon}</div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ flex: 1, padding: '14px 18px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#94A3B8', letterSpacing: 1, marginBottom: 2 }}>ACME MANUFACTURING</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Current State, Assembly Line A</span>
                      <span style={{ fontSize: 10, color: '#3A5A7D', cursor: 'pointer' }}>✎</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 4, padding: '2px 7px' }}>● LIVE</span>
                    <span style={{ fontSize: 13, color: '#94A3B8', cursor: 'pointer' }}>⋮</span>
                  </div>
                </div>

                {/* Workflow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 2 }}>
                  {WORKFLOW.map((step, i) => (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {/* Node */}
                      {step.type === 'endpoint' ? (
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: '#E2E8F0', border: '2px solid #CBD5E1',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexDirection: 'column', cursor: 'pointer',
                        }}>
                          <span style={{ fontSize: 6, fontWeight: 700, color: '#475569', fontFamily: 'var(--font-mono)', textAlign: 'center', lineHeight: 1.2 }}>{step.label.slice(0, 4).toUpperCase()}</span>
                        </div>
                      ) : (
                        <div
                          onClick={() => setActiveStep(step.id)}
                          style={{
                            position: 'relative', cursor: 'pointer',
                            background: step.id === activeStep ? '#EFF6FF' : 'white',
                            border: `1.5px solid ${step.bot ? '#EF4444' : step.id === activeStep ? '#3A5A7D' : '#E2E8F0'}`,
                            borderRadius: 8, padding: '6px 10px', minWidth: 72,
                            boxShadow: step.id === activeStep ? '0 0 0 3px rgba(59,130,246,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
                            transition: 'all 0.15s',
                          }}
                        >
                          {/* Bottleneck or warning badge */}
                          {(step.bot || step.warn) && (
                            <div style={{
                              position: 'absolute', top: -5, right: -5, width: 14, height: 14,
                              borderRadius: '50%', background: step.bot ? '#EF4444' : '#C9A66B',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 7, color: 'white', fontWeight: 700, zIndex: 1,
                            }}>!</div>
                          )}
                          <div style={{ fontSize: 9, fontWeight: 700, color: step.bot ? '#EF4444' : '#0F172A', marginBottom: 3 }}>{step.label}</div>
                          <div style={{ fontSize: 7.5, color: '#64748B', fontFamily: 'var(--font-mono)' }}>CT: {step.ct}</div>
                          <div style={{ fontSize: 7.5, color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>CO: {step.co}</div>
                        </div>
                      )}
                      {/* Arrow */}
                      {i < WORKFLOW.length - 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', padding: '0 3px' }}>
                          <div style={{ width: 16, height: 1, background: '#CBD5E1' }} />
                          <div style={{ width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '4px solid #CBD5E1' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mini process cards */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {MINI_CARDS.map(card => {
                    const vaColor = card.va === 'VA' ? '#10B981' : card.va === 'NVA' ? '#EF4444' : '#C9A66B'
                    return (
                      <div key={card.step} style={{
                        flex: 1, background: card.hot ? 'rgba(239,68,68,0.03)' : '#FAFBFF',
                        border: `1px solid ${card.hot ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.05)'}`,
                        borderRadius: 8, padding: '6px 8px',
                      }}>
                        <div style={{ fontSize: 7.5, fontWeight: 700, color: '#475569', marginBottom: 4, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.step}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          {[['CT', card.ct], ['WIP', String(card.wip)]].map(([k, v]) => (
                            <div key={k}>
                              <div style={{ fontSize: 6, color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{k}</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 4, display: 'inline-block', fontSize: 6.5, fontWeight: 700, color: vaColor, background: `${vaColor}18`, padding: '1px 5px', borderRadius: 3 }}>{card.va}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend + KPI strip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {[['On Track', '#10B981'], ['At Risk', '#C9A66B'], ['Bottleneck', '#EF4444']].map(([label, color]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                      <span style={{ fontSize: 8.5, color: '#64748B' }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom KPIs + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
                  {KPIS.map(kpi => (
                    <div key={kpi.label} style={{
                      flex: 1, background: '#F8FAFF', border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: 8, padding: '8px 10px',
                    }}>
                      <div style={{ fontSize: 7, color: '#94A3B8', fontFamily: 'var(--font-mono)', letterSpacing: 0.5, marginBottom: 3 }}>{kpi.label.toUpperCase()}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)', letterSpacing: -0.5 }}>{kpi.value}</div>
                      <div style={{ fontSize: 8, fontWeight: 600, color: kpi.up ? '#10B981' : '#EF4444', marginTop: 2 }}>
                        {kpi.up ? '↑' : '↓'} {kpi.delta}
                      </div>
                    </div>
                  ))}
                  <a href="/start" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'linear-gradient(135deg, #3A5A7D, #1E2E4A)',
                      border: 'none', borderRadius: 10, color: 'white',
                      padding: '10px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
                      whiteSpace: 'nowrap' as const,
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 18px rgba(59,130,246,0.45)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(59,130,246,0.35)' }}
                    >View Full Map →</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ANALYTICS PANEL ── */}
        <div style={{
          opacity: animated ? 1 : 0,
          transform: animated ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
        }}>
          <div style={{
            background: 'linear-gradient(160deg, #0F1C38 0%, #0A1628 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '24px 28px',
            maxWidth: 900,
            margin: '0 auto',
            boxShadow: '0 8px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            {/* Panel header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#60A5FA', letterSpacing: 1.5, marginBottom: 4 }}>CURRENT STATE ANALYSIS</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Analytics & Insights</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['1W', '1M', '3M', 'YTD'].map((r, i) => (
                  <button key={r} style={{
                    fontSize: 9, fontFamily: 'var(--font-mono)', padding: '3px 9px',
                    borderRadius: 5, border: '1px solid',
                    borderColor: i === 1 ? '#60A5FA' : 'rgba(255,255,255,0.1)',
                    background: i === 1 ? 'rgba(96,165,250,0.15)' : 'transparent',
                    color: i === 1 ? '#60A5FA' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                  }}>{r}</button>
                ))}
              </div>
            </div>

            {/* KPI strip */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const }}>
              {ANALYTICS_KPIS.map(kpi => (
                <div key={kpi.label} style={{
                  flex: '1 1 120px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${kpi.color}30`,
                  borderTop: `2px solid ${kpi.color}`,
                  borderRadius: 10, padding: '10px 14px',
                }}>
                  <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: 1, marginBottom: 6 }}>{kpi.label.toUpperCase()}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)', letterSpacing: -0.5 }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              {/* Lead time trend */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 8 }}>LEAD TIME TREND (DAYS)</div>
                <LineChart data={LEAD_TREND} color="#60A5FA" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {['Jan', 'Mar', 'May', 'Jun'].map(m => (
                    <span key={m} style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* PCE over time */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 6 }}>PCE OVER TIME (%)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {[['Target', 'rgba(96,165,250,0.4)'], ['Actual', '#60A5FA']].map(([l, c]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: 8, height: 4, background: c, borderRadius: 2 }} />
                      <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>{l}</span>
                    </div>
                  ))}
                </div>
                <BarChart data={PCE_DATA} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {PCE_DATA.map(d => (
                    <span key={d.label} style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>{d.label.slice(0, 1)}</span>
                  ))}
                </div>
              </div>

              {/* Waste breakdown donut */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 8 }}>WASTE BREAKDOWN</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Donut slices={WASTE} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {WASTE.map(w => (
                      <div key={w.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: w.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>{w.label}</span>
                        </div>
                        <span style={{ fontSize: 8, fontWeight: 700, color: w.color, fontFamily: 'var(--font-mono)' }}>{w.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-responsive style tag */}
      <style>{`
        @media (max-width: 640px) {
          .mfg-tablet-tilt { transform: none !important; }
          .mfg-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export default ManufacturingHeroDashboard
