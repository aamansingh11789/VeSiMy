import React from 'react'
// TypeScript enabled
import type { Metadata } from 'next'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'ISO 22468:2020, Value Stream Mapping Standard | VeSiMy',
  description: 'A practical guide to ISO 22468:2020, the international standard for Value Stream Mapping. Understand the notation, methodology, and how VeSiMy aligns with the standard.',
}

const SANS  = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO  = "'JetBrains Mono',monospace"
const AMBER = '#D4A843'
const NAVY  = '#04111F'
const GRAY  = '#5A6480'
const BORD  = '#E2E8F0'

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: -0.4,
        marginBottom: 16, fontFamily: SANS }}>{title}</h2>
      {children}
    </div>
  )
}

function IconCard({ icon, title, body }: { icon: string; title: string; body: string; key?: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '18px 20px', background: '#fff', borderRadius: 10,
      border: `1px solid ${BORD}`, boxShadow: '0 1px 4px rgba(4,17,31,0.04)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(212,168,67,0.10)',
        border: '1px solid rgba(212,168,67,0.22)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4, fontFamily: SANS }}>{title}</div>
        <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>{body}</p>
      </div>
    </div>
  )
}

export default function ISO22468Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: SANS,
      WebkitFontSmoothing: 'antialiased' }}>

      {/* Nav */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 40px', height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} onDark />
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/learn" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Learning Center</Link>
          <Link href="/lean-glossary" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Lean Glossary</Link>
          <Link href="/auth/signup" style={{ fontSize: 13, fontWeight: 700,
            background: `linear-gradient(135deg,${AMBER},#B8912E)`, color: '#1A0E00',
            padding: '7px 16px', borderRadius: 7, textDecoration: 'none' }}>
            Try VeSiMy Free
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: NAVY, padding: '56px 40px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 500, height: 500,
          background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.12) 0%, transparent 70%)',
          pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.25)',
            borderRadius: 100, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, letterSpacing: 1.5,
              textTransform: 'uppercase', fontFamily: MONO }}>Methodology Standard</span>
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#F0F2FF', letterSpacing: -1.2,
            lineHeight: 1.1, margin: '0 0 16px', fontFamily: SANS }}>
            ISO 22468:2020<br />
            <span style={{ background: `linear-gradient(135deg,${AMBER},#E8C466)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text' }}>Value Stream Mapping</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(240,242,255,0.72)', lineHeight: 1.75,
            maxWidth: 580, margin: 0, fontFamily: SANS }}>
            The international standard for Value Stream Mapping notation and methodology.
            A practical guide for practitioners, what it means, how to apply it, and
            how VeSiMy is structured around it.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 40px' }}>

        {/* Disclaimer */}
        <div style={{ padding: '16px 20px', background: 'rgba(212,168,67,0.06)',
          border: '1px solid rgba(212,168,67,0.20)', borderRadius: 10, marginBottom: 48 }}>
          <p style={{ fontSize: 13, color: '#6B4E00', lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            <strong>Note:</strong> This guide explains the VSM methodology that ISO 22468:2020 codifies.
            VeSiMy is structured around these practices. We are not an ISO-accredited certification body
            and do not offer ISO certification. The standard itself is published by ISO and available for
            purchase through national standards bodies.
          </p>
        </div>

        <Section title="What is ISO 22468:2020?">
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, marginBottom: 16, fontFamily: SANS }}>
            ISO 22468:2020 is the first international standard specifically for Value Stream Mapping (VSM).
            Published in November 2020, it establishes a common notation system, terminology, and methodology
            for VSM so that maps are consistent and interpretable across organizations, countries, and industries.
          </p>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, marginBottom: 16, fontFamily: SANS }}>
            Before this standard, VSM notation varied between Lean consultants, textbooks, and organizations.
            The Toyota Production System used specific icons; Mike Rother and John Shook standardized many
            in "Learning to See" (1998). ISO 22468 formalizes and extends this into a coherent international reference.
          </p>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, fontFamily: SANS }}>
            The standard covers: icon definitions, map construction methodology, current state analysis,
            future state design, and the improvement cycle.
          </p>
        </Section>

        <Section title="Core VSM Concepts the Standard Defines">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { icon: '⊡', title: 'Process Box', body: 'Represents a step where work is performed. Contains cycle time, operators, uptime, and other metrics.' },
              { icon: '▽', title: 'Inventory Triangle', body: 'Shows WIP (work in progress) between process steps. A critical indicator of flow problems.' },
              { icon: '→', title: 'Push Arrow', body: 'Material is pushed downstream regardless of downstream demand. Common source of overproduction waste.' },
              { icon: '⟳', title: 'Pull/Supermarket', body: 'Downstream signals upstream when to produce. Eliminates overproduction and reduces inventory.' },
              { icon: '---', title: 'Information Flow', body: 'Dashed lines show how information moves through the value stream, orders, schedules, signals.' },
              { icon: '改', title: 'Kaizen Burst', body: 'The starburst/lightning bolt marks an improvement opportunity on the current state map.' },
              { icon: '◻', title: 'Supplier/Customer', body: 'Factory icons at the start and end of the map representing the supplier and end customer.' },
              { icon: '⌂', title: 'Production Control', body: 'The planning/scheduling function that governs how information flows between supplier and production.' },
            ].map(item => (
              <IconCard key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </Section>

        <Section title="Key Metrics in VSM">
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${BORD}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: SANS }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Metric', 'Symbol', 'Definition', 'Why It Matters'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11,
                      fontWeight: 700, color: GRAY, letterSpacing: 1, textTransform: 'uppercase',
                      borderBottom: `1px solid ${BORD}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cycle Time', 'CT', 'Time to complete one unit of work at a step', 'Identifies bottlenecks when compared to Takt Time'],
                  ['Wait Time', 'WT', 'Time work sits idle between steps', 'Major component of non-value-added lead time'],
                  ['Lead Time', 'LT', 'Total time from start to finish, CT + WT', 'Customer-visible measure of process speed'],
                  ['Takt Time', 'TT', 'Available time ÷ customer demand rate', 'The pace the process must match to satisfy demand'],
                  ['PCE', 'PCE', 'Value-added time ÷ total lead time × 100%', 'Process Cycle Efficiency. Higher is better. <10% is common in many industries.'],
                  ['WIP', 'WIP', 'Units of work in progress between steps', 'High WIP = poor flow, cash tied up, quality risk'],
                  ['Uptime', 'U%', 'Percentage of scheduled time equipment/process is available', 'Low uptime magnifies every other constraint'],
                  ['Defect Rate', 'D%', 'Percentage of outputs requiring rework or scrap', 'Hidden factory, defects consume capacity invisibly'],
                ].map(([metric, sym, def, why], i) => (
                  <tr key={metric} style={{ borderBottom: i < 7 ? `1px solid ${BORD}` : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: NAVY }}>{metric}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: MONO, color: AMBER, fontWeight: 700 }}>{sym}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: GRAY, lineHeight: 1.5 }}>{def}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: GRAY, lineHeight: 1.5 }}>{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="The VSM Process, Current State to Future State">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { n: '1', title: 'Choose a value stream', body: 'Select a specific product family or service line. VSM works on a single flow, not the whole business at once.' },
              { n: '2', title: 'Map the Current State', body: 'Walk the process. Record every step, cycle time, wait time, operator count, WIP, defect rate, and information flow. Map what actually happens, not the ideal.' },
              { n: '3', title: 'Calculate the metrics', body: 'Lead time, PCE, takt time, bottleneck identification. These numbers reveal where waste concentrates.' },
              { n: '4', title: 'Design the Future State', body: 'Apply Lean principles: reduce wait time, eliminate non-value-added steps, balance to takt, pull rather than push, standardize the work.' },
              { n: '5', title: 'Build the improvement plan', body: 'Kaizen events, SMED, 5 Why, Standard Work. Specific actions, owners, and timelines that close the gap between current and future state.' },
              { n: '6', title: 'Implement and measure', body: 'Execute the plan. Re-map after implementation. The loop continues, future state becomes the next current state.' },
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start',
                padding: '18px 20px', background: '#fff', borderRadius: 10, border: `1px solid ${BORD}` }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: AMBER,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: '#1A0E00', flexShrink: 0 }}>{step.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 5, fontFamily: SANS }}>{step.title}</div>
                  <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="How VeSiMy Aligns with ISO 22468:2020">
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, marginBottom: 20, fontFamily: SANS }}>
            VeSiMy is structured around the methodology ISO 22468:2020 documents. This means:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
            {[
              { icon: '⊡', title: 'Standard notation', body: 'Process boxes, WIP triangles, push arrows, supermarket icons, kaizen bursts, supplier/customer factory icons, and production control, all per ISO 22468.' },
              { icon: '◈', title: 'Correct metric definitions', body: 'Cycle Time, Takt Time, Lead Time, PCE, WIP, and Defect Rate are calculated using the standard definitions, not approximations.' },
              { icon: '⟳', title: 'Current → Future → Implement', body: 'The workflow follows the full VSM improvement cycle: current state mapping, future state design, and structured improvement planning.' },
              { icon: '✦', title: 'Industry language adaptation', body: 'The standard applies across industries. VeSiMy adapts terminology, "cycle time" becomes "appointment duration" in healthcare, "fermentation time" in brewing, while keeping the underlying methodology consistent.' },
              { icon: '◎', title: '17 CI tools', body: 'ISO 22468 focuses on mapping; improvement execution uses Kaizen, 5 Why, Fishbone, SMED, Standard Work, and other Lean tools that complement the VSM methodology.' },
              { icon: '▨', title: 'Not a certification tool', body: 'VeSiMy is a practice tool, not a certification body. We do not issue ISO certificates. The standard is available from ISO and national standards bodies.' },
            ].map(item => (
              <IconCard key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div style={{ padding: '48px', background: NAVY, borderRadius: 16,
          border: '1px solid rgba(212,168,67,0.18)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 300, height: 300,
            background: 'radial-gradient(ellipse,rgba(212,168,67,0.10) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <h3 style={{ fontSize: 28, fontWeight: 800, color: '#F0F2FF', letterSpacing: -0.5,
            marginBottom: 12, fontFamily: SANS, position: 'relative' }}>
            Apply ISO 22468 in practice
          </h3>
          <p style={{ fontSize: 15, color: 'rgba(240,242,255,0.65)', lineHeight: 1.7,
            marginBottom: 28, maxWidth: 460, marginInline: 'auto', position: 'relative', fontFamily: SANS }}>
            VeSiMy gives you the VSM notation, metrics, CI tools, and AI coaching to
            run the full improvement cycle, from current state to measurable results.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/auth/signup"
              style={{ padding: '12px 28px', background: `linear-gradient(135deg,${AMBER},#B8912E)`,
                color: '#1A0E00', fontWeight: 700, fontSize: 14, borderRadius: 10,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start mapping free →
            </Link>
            <Link href="/learn"
              style={{ padding: '12px 28px', border: '1px solid rgba(212,168,67,0.30)',
                color: AMBER, fontWeight: 600, fontSize: 14, borderRadius: 10,
                textDecoration: 'none' }}>
              Learning Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
