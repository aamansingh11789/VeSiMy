// TypeScript enabled
import type { Metadata } from 'next'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'Features — VeSiMy Process Intelligence Platform',
  description: 'Value stream mapping, 17 CI tools, AI-powered Supe advisor, simulation, target state planning, and PDF reports. Everything your team needs to improve any process.',
}

const SANS  = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO  = "'JetBrains Mono',monospace"
const AMBER = '#D4A843'
const NAVY  = '#04111F'
const GRAY  = '#5A6480'
const BORD  = '#E2E8F0'

const FEATURES = [
  {
    group: 'Map',
    color: '#1670D4',
    items: [
      { title: 'Value Stream Builder', body: 'Build a current state map step by step. Add cycle time, wait time, WIP, operators, defect rate, and uptime to every process block.' },
      { title: 'VSM Map View', body: 'See your full value stream rendered as an industrial-grade SVG map. Customer, supplier, production control, information flows, WIP triangles, and kaizen bursts all included.' },
      { title: 'Branching and Parallel Flows', body: 'Model sub-processes, rework loops, and parallel production lanes. Each branch tracks its own metrics independently.' },
      { title: 'SOP Upload', body: 'Upload a Standard Operating Procedure and Supe AI parses it into draft process steps automatically.' },
    ]
  },
  {
    group: 'Measure',
    color: AMBER,
    items: [
      { title: 'Time Study Tool', body: 'Record cycle time observations with a built-in stopwatch. Get mean, standard deviation, coefficient of variation, and Cp capability index from real observations.' },
      { title: 'Live Metrics', body: 'Lead time, total cycle time, total wait, WIP, PCE, takt time, and bottleneck identification update in real time as you edit steps.' },
      { title: 'Yamazumi Chart', body: 'Operator balance chart showing how work is distributed across your team relative to takt time.' },
      { title: 'OEE Tracking', body: 'Track Availability, Performance, and Quality components of Overall Equipment Effectiveness per step.' },
    ]
  },
  {
    group: 'Analyze',
    color: '#7C3AED',
    items: [
      { title: 'Supe AI Advisor', body: 'Supe reads your actual process data, cycle times, and CI tool findings to give specific, Lean-grounded recommendations. Not generic advice.' },
      { title: 'Fishbone Diagram', body: 'Structured root cause analysis using 6M Manufacturing, 4P Service, or 4S Healthcare frameworks. Vote on causes and route to 5 Why automatically.' },
      { title: '5 Why Analysis', body: 'Causal chain format that validates each step, requires substantive answers, and produces a clear root cause statement.' },
      { title: 'Waste Identification', body: 'Tag all 8 lean wastes across your process steps. See a summary of waste concentration and suggested countermeasures.' },
    ]
  },
  {
    group: 'Improve',
    color: '#16803C',
    items: [
      { title: 'Kaizen Actions', body: 'Create improvement actions with owners, priority, status, and due dates. Overdue actions surface as alerts on your dashboard.' },
      { title: 'SMED Analysis', body: 'Record internal and external changeover activities, calculate current changeover time, and model the impact of converting internal to external steps.' },
      { title: 'Target State Planning', body: 'AI generates a Future State VSM with projected metric improvements, step-by-step action plan, and change timeline based on your actual process data.' },
      { title: 'Simulation Engine', body: 'Model demand spikes, labor shortages, and equipment downtime using Littles Law queue mathematics, not hardcoded multipliers.' },
    ]
  },
  {
    group: 'Report',
    color: '#C0180C',
    items: [
      { title: 'PDF Export', body: 'Generate a professional report with executive summary, current state metrics, bottleneck analysis, CI tool findings, root cause, improvement actions, and target state.' },
      { title: 'PDCA Framework', body: 'Structure your improvement cycle using the Plan, Do, Check, Act framework tied to your actual step and tool data.' },
      { title: 'Kaizen Roadmap', body: 'Phase-based improvement roadmap showing which actions are planned, in progress, complete, and verified.' },
      { title: 'Standard Work Sheet', body: 'Generate a standard work document from your process steps, operator assignments, and cycle time data.' },
    ]
  },
]

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: SANS,
      WebkitFontSmoothing: 'antialiased' }}>

      {/* Nav */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 24px', height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} onDark />
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/pricing" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Pricing</Link>
          <Link href="/auth/signup"
            style={{ fontSize: 13, fontWeight: 700,
              background: 'linear-gradient(135deg,#D4A843,#B8912E)', color: '#1A0E00',
              padding: '7px 16px', borderRadius: 7, textDecoration: 'none' }}>
            Try Free
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: NAVY, padding: '52px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -60, top: -60, width: 500, height: 500,
          background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.12) 0%, transparent 70%)',
          pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.25)',
            borderRadius: 100, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, letterSpacing: 1.5,
              textTransform: 'uppercase', fontFamily: MONO }}>Platform Features</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#F0F2FF', letterSpacing: -1,
            lineHeight: 1.1, margin: '0 0 16px', fontFamily: SANS }}>
            Everything you need to map, measure, and improve any process
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(240,242,255,0.65)', lineHeight: 1.75,
            maxWidth: 540, margin: '0 auto 28px', fontFamily: SANS }}>
            20 integrated tools across 5 phases. Works for manufacturing, healthcare, logistics,
            food and beverage, financial services, and any business with a repeatable process.
          </p>
          <Link href="/auth/signup"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', background: 'linear-gradient(135deg,#D4A843,#B8912E)',
              color: '#1A0E00', fontWeight: 700, fontSize: 14, borderRadius: 10,
              textDecoration: 'none' }}>
            Start free, no account required
          </Link>
        </div>
      </div>

      {/* Feature groups */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px' }}>
        {FEATURES.map(group => (
          <div key={group.group} style={{ marginBottom: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8,
                background: `${group.color}18`, border: `1px solid ${group.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: group.color, fontFamily: MONO }}>
                {group.group[0]}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY,
                letterSpacing: -0.3, fontFamily: SANS, margin: 0 }}>
                {group.group}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
              {group.items.map(item => (
                <div key={item.title} style={{ background: '#fff', borderRadius: 10,
                  border: `1px solid ${BORD}`, padding: '18px 20px',
                  boxShadow: '0 1px 4px rgba(4,17,31,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, fontFamily: SANS }}>{item.title}</div>
                  </div>
                  <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.65, margin: 0, fontFamily: SANS }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 24px', background: NAVY,
          borderRadius: 16, border: '1px solid rgba(212,168,67,0.18)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 300, height: 300,
            background: 'radial-gradient(ellipse,rgba(212,168,67,0.10) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <h3 style={{ fontSize: 28, fontWeight: 800, color: '#F0F2FF',
            letterSpacing: -0.5, marginBottom: 12, fontFamily: SANS, position: 'relative' }}>
            Start with one process
          </h3>
          <p style={{ fontSize: 15, color: 'rgba(240,242,255,0.60)', lineHeight: 1.7,
            marginBottom: 24, maxWidth: 400, marginInline: 'auto', position: 'relative', fontFamily: SANS }}>
            Map a process today. No account needed for the free tier.
            Upgrade when Supe AI finds your first real bottleneck.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/start"
              style={{ padding: '12px 28px',
                background: 'linear-gradient(135deg,#D4A843,#B8912E)', color: '#1A0E00',
                fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Try free now
            </Link>
            <Link href="/pricing"
              style={{ padding: '12px 28px', border: '1px solid rgba(212,168,67,0.30)',
                color: AMBER, fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
