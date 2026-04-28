// TypeScript enabled
'use client'
// ── app/start/Tier0Flow.tsx ───────────────────────────────────────────────
// Tier 0 free no-account process mapping flow
// 6 steps: contact → target → process steps → timings → pain → submit
// Self-contained: no external CSS dependencies, all inline styles


import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

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
  red:      '#F87171',
  t1:       '#EEF2FF',
  t2:       '#8B9CC8',
  t3:       '#4B5880',
  t4:       '#2A3455',
  b1:       'rgba(255,255,255,0.04)',
  b2:       'rgba(255,255,255,0.07)',
  b3:       'rgba(255,255,255,0.12)',
}

const cardShadow = `
  inset 0 1px 0 rgba(255,255,255,0.07),
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

const inputStyle: React.CSSProperties = {
  width:        '100%',
  padding:      '12px 16px',
  background:   C.bg1,
  border:       `1px solid ${C.b2}`,
  borderRadius: 10,
  color:        C.t1,
  fontSize:     16,
  fontFamily:   'inherit',
  outline:      'none',
  boxShadow:    `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.3)`,
  boxSizing:    'border-box',
}

// ── Industries ────────────────────────────────────────────────────────────
const INDUSTRY_GROUPS: { label: string; options: string[] }[] = [
  { label: 'Manufacturing', options: [
    'Automotive','Aerospace','Food & Bev Mfg','Pharma','Electronics',
    'Medical Devices','Industrial Equipment','Textiles & Apparel',
    'Plastics & Rubber','Metal Fabrication','Craft Brewery','Winery',
    'Packaging',
  ]},
  { label: 'Healthcare', options: [
    'Hospital / ED','Surgery / OR','Primary Care','Pharmacy',
    'Clinical Trials','Medical Lab','Mental Health','Aged Care',
  ]},
  { label: 'Services & Professional', options: [
    'Software Dev','IT Operations','Management Consulting',
    'Engineering Consulting','Law Firm','Accounting & Finance',
    'Marketing Agency','Architecture','Project Management',
    'Insurance','Real Estate','Retail Banking',
  ]},
  { label: 'Retail & Hospitality', options: [
    'Restaurant','Retail Store','E-Commerce','Grocery',
    'Hotel','Fitness Clubs','Food Delivery',
  ]},
  { label: 'Logistics & Infrastructure', options: [
    'Warehouse','Freight & Trucking','Port & Maritime','Rail',
    'Airline','Construction','Power Generation','Oil & Gas',
  ]},
  { label: 'Public & Other', options: [
    'Government','K-12 Education','Higher Education','Corporate L&D',
    'Nonprofit','Social Care','Farming','Aquaculture',
    'Police','Fire & Rescue','Military',
    'Film & TV','Music Production','Live Events','Pro Sports',
  ]},
]

const TARGET_OPTIONS = [
  { id: 'speed',      label: 'Speed',      sub: 'Reduce lead time and cycle time',    icon: '⚡' },
  { id: 'cost',       label: 'Cost',        sub: 'Eliminate waste and rework costs',   icon: '💰' },
  { id: 'quality',    label: 'Quality',     sub: 'Reduce defects and rework',          icon: '🎯' },
  { id: 'compliance', label: 'Compliance',  sub: 'Consistency and audit readiness',    icon: '✅' },
  { id: 'capacity',   label: 'Capacity',    sub: 'Do more with the same resources',    icon: '📈' },
]

const LOADING_MESSAGES = [
  'Analyzing your process against lean benchmarks...',
  'Identifying waste types and constraint positions...',
  'Building your improvement recommendations...',
]

// ── Stopwatch component ───────────────────────────────────────────────────
function Stopwatch({ onSave }: { onSave: (seconds: number) => void }) {
  const [elapsed, setElapsed]   = useState(0)
  const [running, setRunning]   = useState(false)
  const [saved,   setSaved]     = useState<number | null>(null)
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef                = useRef<number>(0)

  const start = () => {
    if (running) return
    startRef.current = Date.now() - elapsed * 1000
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 100)
    setRunning(true)
  }

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(false)
  }

  const reset = () => {
    stop()
    setElapsed(0)
    setSaved(null)
  }

  const save = () => {
    stop()
    if (elapsed > 0) {
      setSaved(elapsed)
      onSave(elapsed)
    }
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '16px 20px', marginTop: 8 }}>
      <div style={{
        fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em',
        color: running ? C.cyan : (saved ? C.green : C.t1),
        fontFamily: '"JetBrains Mono","Courier New",monospace',
        marginBottom: 12, textAlign: 'center',
      }}>
        {fmt(elapsed)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!running && elapsed === 0 && (
          <button onClick={start} style={{
            flex: 1, padding: '10px', borderRadius: 8, border: 'none',
            background: C.blue, color: '#fff', fontWeight: 700, cursor: 'pointer',
            fontSize: 14, fontFamily: 'inherit',
          }}>Start</button>
        )}
        {running && (
          <button onClick={stop} style={{
            flex: 1, padding: '10px', borderRadius: 8, border: 'none',
            background: C.bg4, color: C.t1, fontWeight: 700, cursor: 'pointer',
            fontSize: 14, fontFamily: 'inherit', border: `1px solid ${C.b3}`,
          }}>Stop</button>
        )}
        {!running && elapsed > 0 && (
          <>
            <button onClick={save} style={{
              flex: 2, padding: '10px', borderRadius: 8, border: 'none',
              background: C.green, color: '#000', fontWeight: 700, cursor: 'pointer',
              fontSize: 14, fontFamily: 'inherit',
            }}>{saved ? 'Saved!' : 'Save Time'}</button>
            <button onClick={reset} style={{
              flex: 1, padding: '10px', borderRadius: 8,
              background: 'transparent', color: C.t3, cursor: 'pointer',
              fontSize: 14, fontFamily: 'inherit', border: `1px solid ${C.b2}`,
            }}>Reset</button>
          </>
        )}
        {running && (
          <button onClick={reset} style={{
            flex: 1, padding: '10px', borderRadius: 8,
            background: 'transparent', color: C.t3, cursor: 'pointer',
            fontSize: 14, fontFamily: 'inherit', border: `1px solid ${C.b2}`,
          }}>Reset</button>
        )}
      </div>
    </div>
  )
}

// ── Parse time string ─────────────────────────────────────────────────────
function parseTimeInput(raw: string): number | null {
  const s = raw.trim().toLowerCase()
  if (!s) return null
  // "5m" or "5 min"
  const mMatch = s.match(/^(\d+(?:\.\d+)?)\s*m/)
  if (mMatch) return Math.round(parseFloat(mMatch[1]) * 60)
  // "90s" or "90 sec"
  const sMatch = s.match(/^(\d+(?:\.\d+)?)\s*s/)
  if (sMatch) return Math.round(parseFloat(sMatch[1]))
  // "1:30"
  const colonMatch = s.match(/^(\d+):(\d{1,2})$/)
  if (colonMatch) return parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])
  // plain number = minutes
  const num = parseFloat(s)
  if (!isNaN(num)) return Math.round(num * 60)
  return null
}

// ── Report display ────────────────────────────────────────────────────────
interface Report {
  summary: string
  totalTimeSeconds: number
  vaTimeSeconds: number
  nvaTimeSeconds: number
  pcePct: number
  wasteType: string
  wasteExplanation: string
  bottleneckStep: string
  firstAction: string
  leanConcept: string
  leanConceptExplanation: string
}

function ReportView({ report, email, processName }: { report: Report; email: string; processName: string }) {
  const totalMin = Math.round(report.totalTimeSeconds / 60)
  const vaMin    = Math.round(report.vaTimeSeconds / 60)
  const nvaMin   = Math.round(report.nvaTimeSeconds / 60)
  const vaWidth  = Math.round((report.vaTimeSeconds / Math.max(report.totalTimeSeconds, 1)) * 100)

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 16,
        }}>
          <span style={{ color: C.green, fontSize: 14 }}>✓</span>
          <span style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>Report sent to {email}</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.t1, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          {processName}
        </h2>
        <p style={{ color: C.t2, fontSize: 15, margin: 0 }}>Lean Analysis Report</p>
      </div>

      {/* Summary */}
      <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <p style={{ color: C.t2, fontSize: 14, margin: 0, lineHeight: 1.7 }}>{report.summary}</p>
      </div>

      {/* PCE bar */}
      <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: C.t2, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Process Cycle Efficiency
          </span>
          <span style={{ color: C.blue, fontSize: 22, fontWeight: 800 }}>{report.pcePct}%</span>
        </div>
        <div style={{ height: 8, background: C.b1, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ height: '100%', width: `${vaWidth}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`, borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.blue }} />
            <span style={{ color: C.t3, fontSize: 12 }}>Value-added: {vaMin} min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.b3 }} />
            <span style={{ color: C.t3, fontSize: 12 }}>Non-value-added: {nvaMin} min</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '16px' }}>
          <div style={{ color: C.t3, fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Waste Type</div>
          <div style={{ color: '#F87171', fontSize: 16, fontWeight: 700 }}>{report.wasteType}</div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '16px' }}>
          <div style={{ color: C.t3, fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Bottleneck</div>
          <div style={{ color: C.t1, fontSize: 14, fontWeight: 700 }}>{report.bottleneckStep}</div>
        </div>
      </div>

      {/* Waste explanation */}
      <div style={{ background: C.bg2, border: `1px solid rgba(248,113,113,0.2)`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ color: '#F87171', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          Where the waste is
        </div>
        <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{report.wasteExplanation}</p>
      </div>

      {/* First action */}
      <div style={{ background: C.bg2, border: `1px solid ${C.blueBdr}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ color: C.blueLight, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          First Action This Week
        </div>
        <p style={{ color: C.t1, fontSize: 15, lineHeight: 1.7, margin: 0 }}>{report.firstAction}</p>
      </div>

      {/* Lean concept */}
      <div style={{ background: C.bg2, border: `1px solid rgba(167,139,250,0.2)`, borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <div style={{ color: C.purple, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
          {report.leanConcept}
        </div>
        <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{report.leanConceptExplanation}</p>
      </div>

      {/* Upgrade CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${C.bg3} 0%, ${C.bg4} 100%)`,
        border: `1px solid ${C.blueBdr}`, borderRadius: 16, padding: 24, textAlign: 'center',
      }}>
        <div style={{ color: C.t1, fontSize: 18, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Build the full map
        </div>
        <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
          The report shows the top layer. A full VSM map shows information flows, WIP queues,
          and the complete improvement path. 14-day free trial, no card required.
        </p>
        <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '14px 32px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
            color: '#fff', fontSize: 15, fontWeight: 700,
            fontFamily: 'inherit', boxShadow: btnShadow,
          }}>
            Start Free Trial
          </button>
        </Link>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function Tier0Flow() {
  const [step,            setStep]            = useState(0)
  const [email,           setEmail]           = useState('')
  const [firstName,       setFirstName]       = useState('')
  const [industry,        setIndustry]        = useState('')
  const [processName,     setProcessName]     = useState('')
  const [target,          setTarget]          = useState('')
  const [steps,           setSteps]           = useState<{ label: string; time_seconds: number | null }[]>([{ label: '', time_seconds: null }])
  const [activeStepIdx,   setActiveStepIdx]   = useState<number | null>(null)
  const [manualTime,      setManualTime]      = useState('')
  const [painStep,        setPainStep]        = useState<number | null>(null)
  const [painDescription, setPainDescription] = useState('')
  const [loading,         setLoading]         = useState(false)
  const [loadingMsg,      setLoadingMsg]      = useState(0)
  const [report,          setReport]          = useState<Report | null>(null)
  const [error,           setError]           = useState('')

  // Loading message rotation
  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setLoadingMsg(m => (m + 1) % LOADING_MESSAGES.length), 2200)
    return () => clearInterval(t)
  }, [loading])

  const canAdvance = () => {
    if (step === 0) return email.includes('@') && industry !== ''
    if (step === 1) return processName.trim().length >= 3 && target !== ''
    if (step === 2) return steps.filter(s => s.label.trim()).length >= 2
    if (step === 3) return true // timings optional
    if (step === 4) return true // pain optional
    return false
  }

  const addStep = () => {
    if (steps.length >= 12) return
    setSteps([...steps, { label: '', time_seconds: null }])
  }

  const removeStep = (i: number) => {
    if (steps.length <= 2) return
    setSteps(steps.filter((_, idx) => idx !== i))
    if (painStep === i) setPainStep(null)
    if (painStep !== null && painStep > i) setPainStep(painStep - 1)
  }

  const moveStep = (i: number, dir: -1 | 1) => {
    const ni = i + dir
    if (ni < 0 || ni >= steps.length) return
    const next = [...steps]
    ;[next[i], next[ni]] = [next[ni], next[i]]
    setSteps(next)
    if (painStep === i) setPainStep(ni)
    else if (painStep === ni) setPainStep(i)
  }

  const setStepTime = (i: number, secs: number) => {
    const next = [...steps]
    next[i] = { ...next[i], time_seconds: secs }
    setSteps(next)
  }

  const applyManualTime = (i: number) => {
    const secs = parseTimeInput(manualTime)
    if (secs !== null && secs > 0) {
      setStepTime(i, secs)
      setManualTime('')
      setActiveStepIdx(null)
    }
  }

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tier0/generate-report', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          industry,
          processName,
          steps: steps.filter(s => s.label.trim()),
          painStep,
          painDescription: painDescription || undefined,
          targetCategory: target || undefined,
        }),
      })
      const data = await res.json()
      if (data.success && data.report) {
        setReport(data.report)
        setStep(5)
      } else if (res.status === 429) {
        setError('You already mapped a process in the last 24 hours. Check your inbox for the report.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fmtSeconds = (s: number | null) => {
    if (s === null) return ''
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? (sec > 0 ? `${m}m ${sec}s` : `${m}m`) : `${s}s`
  }

  const validSteps = steps.filter(s => s.label.trim())

  return (
    <div style={{
      background:  C.bg0,
      minHeight:   '100vh',
      fontFamily:  '-apple-system,BlinkMacSystemFont,"Segoe UI","Satoshi",Arial,sans-serif',
      color:       C.t1,
      position:    'relative',
    }}>
      {/* Dot grid */}
      <div style={{
        position:   'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
        backgroundSize: '28px 28px', opacity: 0.14,
      }} />

      {/* Nav */}
      <nav style={{
        position:   'sticky', top: 0, zIndex: 100,
        padding:    '0 20px',
        height:     56,
        display:    'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(2,4,13,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.b1}`,
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 14,
          }}>V</div>
          <span style={{ color: C.t1, fontWeight: 700, fontSize: 15 }}>VeSiMy</span>
        </Link>
        <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '7px 16px', borderRadius: 8, border: `1px solid ${C.b2}`,
            background: 'transparent', color: C.t2, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Sign up free</button>
        </Link>
      </nav>

      {/* Progress bar */}
      {step < 5 && (
        <div style={{ height: 2, background: C.b1, position: 'relative', zIndex: 1 }}>
          <div style={{
            height: '100%',
            width:  `${((step + 1) / 5) * 100}%`,
            background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 24px',
              border: `3px solid ${C.b2}`,
              borderTop: `3px solid ${C.blue}`,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: C.t2, fontSize: 16, lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
              {LOADING_MESSAGES[loadingMsg]}
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ color: '#F87171', margin: 0, fontSize: 15 }}>{error}</p>
            <button onClick={() => setError('')} style={{ color: C.t2, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, marginTop: 8, padding: 0, fontFamily: 'inherit' }}>
              Try again
            </button>
          </div>
        )}

        {/* Report */}
        {!loading && report && step === 5 && (
          <ReportView report={report} email={email} processName={processName} />
        )}

        {/* Step 0: Contact + Industry */}
        {!loading && step === 0 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ color: C.t3, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Step 1 of 5
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Map any process. Free.
              </h1>
              <p style={{ color: C.t2, fontSize: 16, margin: 0, lineHeight: 1.6 }}>
                Tell us where to send your report.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  First name (optional)
                </label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Alex"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Email address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Industry *
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value="" disabled>Select your industry...</option>
                  {INDUSTRY_GROUPS.map(group => (
                    <optgroup key={group.label} label={group.label} style={{ background: C.bg2 }}>
                      {group.options.map(opt => (
                        <option key={opt} value={opt} style={{ background: C.bg2 }}>{opt}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <p style={{ color: C.t4, fontSize: 12, lineHeight: 1.6, marginTop: 16 }}>
              Your email is used only to send your report. No spam, unsubscribe anytime.
            </p>
            {/* Tutorial note per spec §20.4 */}
            <div style={{ background: `${C.blueGlow}`, border: `1px solid ${C.blueBdr}`, borderRadius: 10, padding: '12px 14px', marginTop: 16 }}>
              <div style={{ color: C.blueLight, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Why we ask for your industry</div>
              <div style={{ color: C.t2, fontSize: 12, lineHeight: 1.6 }}>VeSiMy calibrates your report against real benchmarks from your industry. A 10-minute cycle time means something different in a hospital than in a warehouse. Knowing your industry makes the recommendation specific to you.</div>
            </div>
          </div>
        )}

        {/* Step 1: Process + Target */}
        {!loading && step === 1 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ color: C.t3, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Step 2 of 5
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Which process are you mapping?
              </h2>
              <p style={{ color: C.t2, fontSize: 15, margin: 0 }}>
                Name the process and pick your improvement target.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Process name *
                </label>
                <input
                  value={processName}
                  onChange={e => setProcessName(e.target.value)}
                  placeholder={`e.g. "Order fulfilment" or "Patient discharge"`}
                  style={inputStyle}
                />
                {/* Tutorial note per spec §20.4 */}
                <div style={{ color: C.t3, fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                  Name it the way your team talks about it on the floor.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  What are you trying to improve? *
                </label>
                {/* Tutorial note per spec §20.4 */}
                <div style={{ color: C.t3, fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>
                  Every process has a target. Picking one helps VeSiMy judge the process through the right lens.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TARGET_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setTarget(opt.id)}
                      style={{
                        display:     'flex',
                        alignItems:  'center',
                        gap:         14,
                        padding:     '14px 16px',
                        borderRadius: 10,
                        border:      `1px solid ${target === opt.id ? C.blue : C.b2}`,
                        background:  target === opt.id ? C.blueGlow : 'transparent',
                        cursor:      'pointer',
                        textAlign:   'left',
                        fontFamily:  'inherit',
                        transition:  'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>
                      <div>
                        <div style={{ color: target === opt.id ? C.blueLight : C.t1, fontWeight: 700, fontSize: 15 }}>{opt.label}</div>
                        <div style={{ color: C.t3, fontSize: 13 }}>{opt.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Process steps */}
        {!loading && step === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: C.t3, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Step 3 of 5
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                What are the steps?
              </h2>
              <p style={{ color: C.t2, fontSize: 15, margin: 0 }}>
                Add 2 to 12 steps in order from start to finish.
              </p>
              {/* Tutorial note per spec §20.4 */}
              <div style={{ background: `${C.blueGlow}`, border: `1px solid ${C.blueBdr}`, borderRadius: 10, padding: '12px 14px', marginTop: 12 }}>
                <div style={{ color: C.blueLight, fontSize: 12, fontWeight: 700, marginBottom: 3 }}>Write what actually happens today</div>
                <div style={{ color: C.t2, fontSize: 12, lineHeight: 1.6 }}>Do not write the ideal version. Write the steps the way they actually happen right now. Current state means reality. Example: "Waiting for approval" is a valid step if it happens.</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ color: C.t4, fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'right' }}>{i + 1}</div>
                  <input
                    value={s.label}
                    onChange={e => {
                      const next = [...steps]
                      next[i] = { ...next[i], label: e.target.value }
                      setSteps(next)
                    }}
                    placeholder={`Step ${i + 1}`}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => moveStep(i, -1)} disabled={i === 0}
                      style={{ padding: '8px', background: 'none', border: `1px solid ${C.b2}`, borderRadius: 6, color: C.t3, cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                    <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1}
                      style={{ padding: '8px', background: 'none', border: `1px solid ${C.b2}`, borderRadius: 6, color: C.t3, cursor: i === steps.length - 1 ? 'default' : 'pointer', opacity: i === steps.length - 1 ? 0.3 : 1 }}>↓</button>
                    <button onClick={() => removeStep(i)} disabled={steps.length <= 2}
                      style={{ padding: '8px', background: 'none', border: `1px solid ${C.b2}`, borderRadius: 6, color: '#F87171', cursor: steps.length <= 2 ? 'default' : 'pointer', opacity: steps.length <= 2 ? 0.3 : 1 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            {steps.length < 12 && (
              <button onClick={addStep} style={{
                width: '100%', padding: '12px', borderRadius: 10,
                border: `1px dashed ${C.b3}`, background: 'transparent',
                color: C.t3, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                + Add step
              </button>
            )}
          </div>
        )}

        {/* Step 3: Timings */}
        {!loading && step === 3 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: C.t3, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Step 4 of 5
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                How long does each step take?
              </h2>
              <p style={{ color: C.t2, fontSize: 15, margin: '0 0 4px' }}>
                Optional but makes the analysis sharper.
              </p>
              <p style={{ color: C.t4, fontSize: 13, margin: 0 }}>
                Use the stopwatch to time live, or type "5m", "90s", or "2:30"
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {validSteps.map((s, i) => {
                const originalIdx = steps.findIndex(st => st === s)
                return (
                  <div key={i} style={{
                    background: C.bg2, border: `1px solid ${C.b2}`,
                    borderRadius: 12, padding: 16,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ color: C.t1, fontWeight: 600, fontSize: 15 }}>{s.label}</span>
                      {s.time_seconds !== null && (
                        <span style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>{fmtSeconds(s.time_seconds)}</span>
                      )}
                    </div>

                    {activeStepIdx === originalIdx ? (
                      <div>
                        <Stopwatch onSave={secs => setStepTime(originalIdx, secs)} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <input
                            value={manualTime}
                            onChange={e => setManualTime(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyManualTime(originalIdx)}
                            placeholder="Or type: 5m, 90s, 2:30"
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <button onClick={() => applyManualTime(originalIdx)} style={{
                            padding: '0 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: C.blue, color: '#fff', fontWeight: 700, fontFamily: 'inherit',
                          }}>Set</button>
                        </div>
                        <button onClick={() => setActiveStepIdx(null)} style={{
                          color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginTop: 8, padding: 0, fontFamily: 'inherit',
                        }}>Done</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setActiveStepIdx(originalIdx); setManualTime('') }}
                        style={{
                          padding: '8px 16px', borderRadius: 8,
                          border: `1px solid ${C.b2}`, background: 'transparent',
                          color: C.t3, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        {s.time_seconds !== null ? 'Edit time' : 'Add time'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <button onClick={() => setStep(s => s + 1)} style={{
              width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.b2}`,
              background: 'transparent', color: C.t3, fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit', marginTop: 16,
            }}>
              Skip timings
            </button>
            {/* Tutorial note per spec §20.4 */}
            <div style={{ color: C.t3, fontSize: 12, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
              Timing does not have to be perfect. Even a rough estimate shows where the process slows down.
            </div>
          </div>
        )}

        {/* Step 4: Pain point */}
        {!loading && step === 4 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: C.t3, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Step 5 of 5
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Where is the pain?
              </h2>
              <p style={{ color: C.t2, fontSize: 15, margin: '0 0 10px' }}>
                Which step causes the most problems right now?
              </p>
              {/* Tutorial note per spec §20.4 */}
              <div style={{ color: C.t3, fontSize: 12, lineHeight: 1.5, padding: '8px 0' }}>
                Trust your gut. You know your process. The step that causes the most frustration is usually where lean improvement starts.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {validSteps.map((s, i) => {
                const origIdx = steps.findIndex(st => st === s)
                return (
                  <button
                    key={i}
                    onClick={() => setPainStep(painStep === origIdx ? null : origIdx)}
                    style={{
                      padding:     '14px 16px',
                      borderRadius: 10,
                      border:      `1px solid ${painStep === origIdx ? '#F87171' : C.b2}`,
                      background:  painStep === origIdx ? 'rgba(248,113,113,0.1)' : 'transparent',
                      color:       painStep === origIdx ? '#F87171' : C.t2,
                      fontWeight:  painStep === origIdx ? 700 : 500,
                      fontSize:    15, cursor: 'pointer',
                      textAlign:   'left', fontFamily: 'inherit',
                    }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>

            {painStep !== null && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Describe the problem (optional)
                </label>
                <textarea
                  value={painDescription}
                  onChange={e => setPainDescription(e.target.value)}
                  placeholder="What specifically goes wrong here? What does the pain look like?"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <p style={{ color: '#F87171', margin: 0, fontSize: 14 }}>{error}</p>
              </div>
            )}

            <button onClick={submit} style={{
              width:      '100%', padding: '16px', borderRadius: 12, border: 'none',
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
              color:      '#fff', fontSize: 16, fontWeight: 700,
              cursor:     'pointer', fontFamily: 'inherit', boxShadow: btnShadow,
            }}>
              Generate my lean report
            </button>

            <p style={{ color: C.t4, fontSize: 12, textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
              Your report will be emailed to {email}. No account needed.
            </p>
          </div>
        )}

        {/* Next / Back buttons */}
        {!loading && step < 5 && step < 4 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                flex:    1, padding: '14px', borderRadius: 12,
                border:  `1px solid ${C.b2}`, background: 'transparent',
                color:   C.t2, fontSize: 15, fontWeight: 600,
                cursor:  'pointer', fontFamily: 'inherit',
              }}>Back</button>
            )}
            <button onClick={() => canAdvance() && setStep(s => s + 1)} style={{
              flex:     step === 0 ? 1 : 2,
              padding:  '14px', borderRadius: 12, border: 'none',
              background: canAdvance()
                ? `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`
                : C.bg3,
              color:    canAdvance() ? '#fff' : C.t4,
              fontSize: 15, fontWeight: 700,
              cursor:   canAdvance() ? 'pointer' : 'default',
              fontFamily: 'inherit',
              boxShadow: canAdvance() ? btnShadow : 'none',
            }}>
              Continue
            </button>
          </div>
        )}
        {!loading && step === 3 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: '14px', borderRadius: 12,
              border: `1px solid ${C.b2}`, background: 'transparent',
              color: C.t2, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Back</button>
            <button onClick={() => setStep(s => s + 1)} style={{
              flex: 2, padding: '14px', borderRadius: 12, border: 'none',
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', boxShadow: btnShadow,
            }}>Continue</button>
          </div>
        )}
        {!loading && step === 4 && step < 5 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            width: '100%', padding: '12px', borderRadius: 10, marginTop: 12,
            border: `1px solid ${C.b2}`, background: 'transparent',
            color: C.t3, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}>Back</button>
        )}

      </div>
    </div>
  )
}
