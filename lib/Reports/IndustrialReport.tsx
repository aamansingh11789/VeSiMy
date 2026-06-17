// TypeScript enabled
'use client'

import ReportFooter from './ReportFooter'

// VeSiMy brand colors for reports
const NAVY = '#0B1D33'
const NAVY_2 = '#1E2E4A'
const STEEL = '#3A5A7D'
const CHAMPAGNE = '#C9A66B'
const SAND = '#D9C8A9'
const SLATE = '#73879C'
const SLATE_LIGHT = '#DDE3EA'
const PAPER = '#FFFFFF'

function fmtS(s?: number | null) {
  if (!s && s !== 0) return '—'
  if (s < 60) return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(2)}h`
}

// VeSiMy logo as inline SVG for the report header (works in PDF export)
function LogoMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rep-vL" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2F4670"/><stop offset="100%" stopColor="#1E2E4A"/>
        </linearGradient>
        <linearGradient id="rep-vR" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E2E4A"/><stop offset="100%" stopColor="#0B1D33"/>
        </linearGradient>
        <radialGradient id="rep-vC" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E5D4B0"/>
          <stop offset="55%" stopColor="#C9A66B"/>
          <stop offset="100%" stopColor="#A8854F"/>
        </radialGradient>
      </defs>
      <path d="M 20 28 Q 20 24 24 24 L 38 24 Q 42 24 44 28 L 50 40 L 50 86 Q 50 92 44 91 L 28 89 Q 22 88 21 82 L 20 28 Z" fill="url(#rep-vL)"/>
      <path d="M 56 28 Q 58 24 62 24 L 76 24 Q 80 24 80 28 L 79 82 Q 78 88 72 89 L 56 91 Q 50 92 50 86 L 50 40 L 56 28 Z" fill="url(#rep-vR)"/>
      <circle cx="50" cy="20" r="12" fill="url(#rep-vC)"/>
    </svg>
  )
}

export default function IndustrialReport({ project, metrics, rootCause, waste, improvements, vsmHtml }: any) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{
      background: PAPER, color: NAVY, padding: '40px 48px',
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      lineHeight: 1.55, maxWidth: 920, margin: '0 auto',
    }}>
      {/* HEADER with logo, title, and document control table */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: 32,
        paddingBottom: 20, marginBottom: 28,
        borderBottom: `3px solid ${NAVY}`,
        position: 'relative',
      }}>
        {/* Champagne gold accent strip */}
        <div style={{
          position: 'absolute', bottom: -3, left: 0, width: 80, height: 3,
          background: CHAMPAGNE,
        }}/>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <LogoMark />
          <div>
            <div style={{
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontSize: 28, fontWeight: 700, color: NAVY,
              letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6,
            }}>
              Process Analysis Report
            </div>
            <div style={{ fontSize: 14, color: STEEL, fontWeight: 500 }}>
              {project?.name || 'Unnamed Process'}
            </div>
            <div style={{
              fontSize: 10, color: CHAMPAGNE, fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1.5, marginTop: 8, textTransform: 'uppercase',
            }}>
              VeSiMy · The execution layer for Lean
            </div>
          </div>
        </div>

        <table style={{
          borderCollapse: 'collapse', minWidth: 280, fontSize: 11,
          alignSelf: 'flex-start',
        }}>
          <tbody>
            <tr>
              <td style={cellLabel}>Document ID</td>
              <td style={cellValue}>VSM-{(project?.id || '001').toString().slice(0, 8)}</td>
            </tr>
            <tr>
              <td style={cellLabel}>Revision</td>
              <td style={cellValue}>1.0</td>
            </tr>
            <tr>
              <td style={cellLabel}>Prepared By</td>
              <td style={cellValue}>VeSiMy</td>
            </tr>
            <tr>
              <td style={cellLabel}>Date</td>
              <td style={cellValue}>{today}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTIONS */}
      <Section title="Executive Summary" number="01">
        <p style={bodyStyle}>
          This report summarizes the current-state process analysis for{' '}
          <strong style={{ color: NAVY }}>{project?.name || 'this process'}</strong>.
          It is intended to support operational analysis, bottleneck identification, root-cause review,
          and continuous improvement planning across the documented value stream.
        </p>
      </Section>

      <Section title="Process Overview" number="02">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: 13 }}>
          <Field label="Industry"          value={project?.industry || '—'} />
          <Field label="Product / Service" value={project?.product || '—'} />
          <Field label="Customer"          value={project?.customer || '—'} />
          <Field label="Supplier"          value={project?.supplier || '—'} />
        </div>
      </Section>

      <Section title="Performance Metrics" number="03">
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Metric</th>
              <th style={{ ...th, textAlign: 'right' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <MetricRow label="Lead Time"       value={fmtS(metrics?.leadTime)} />
            <MetricRow label="Value Added Time" value={fmtS(metrics?.valueAdded)} />
            <MetricRow label="Main Flow Cycle Time" value={fmtS(metrics?.mainCT)} />
            <MetricRow label="Takt Time"       value={fmtS(metrics?.takt)} />
            <MetricRow label="Process Cycle Efficiency" value={metrics?.pce ? `${metrics.pce.toFixed(1)}%` : '—'} />
            <MetricRow label="Total WIP"       value={metrics?.totalWIP ?? '—'} />
          </tbody>
        </table>
      </Section>

      <Section title="Current-State Value Stream Map" number="04">
        <div style={{ background: '#F7F8FA', border: `1px solid ${SLATE_LIGHT}`, borderRadius: 8, padding: 16 }}>
          <div dangerouslySetInnerHTML={{ __html: vsmHtml || '<p style="color:#73879C;font-size:13px;margin:0;">No VSM export available for this report.</p>' }} />
        </div>
      </Section>

      <Section title="Root Cause Analysis" number="05">
        <p style={bodyStyle}>{rootCause || 'Root cause analysis not yet completed for this process.'}</p>
      </Section>

      <Section title="Waste Analysis" number="06">
        <p style={bodyStyle}>{waste || 'Waste analysis not yet completed for this process.'}</p>
      </Section>

      <Section title="Improvement Plan" number="07">
        <p style={bodyStyle}>{improvements || 'Improvement actions not yet defined for this process.'}</p>
      </Section>

      <Section title="Standards Notice" number="08">
        <p style={{ ...bodyStyle, marginBottom: 10 }}>
          This document was generated using the VeSiMy Process Intelligence Platform.
          The document structure is designed to align with widely recognized industrial process analysis practices
          and relevant standards guidance, including ISO 9001 process-documentation principles and ISO 22468
          value stream management concepts, where applicable.
        </p>
        <p style={{ ...bodyStyle, fontSize: 11, color: SLATE, fontStyle: 'italic' }}>
          This document is intended to support operational analysis, continuous improvement,
          and internal decision-making. It does not by itself certify organizational compliance with any ISO standard.
        </p>
      </Section>

      <ReportFooter />
    </div>
  )
}

function Section({ title, number, children }: any) {
  return (
    <section style={{ marginBottom: 28, pageBreakInside: 'avoid' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12,
        marginBottom: 12, paddingBottom: 8,
        borderBottom: `1px solid ${SLATE_LIGHT}`,
        position: 'relative',
      }}>
        {/* Champagne gold accent dot */}
        <div style={{
          position: 'absolute', bottom: -1, left: 0, width: 40, height: 1,
          background: CHAMPAGNE,
        }}/>
        {number && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: CHAMPAGNE, fontWeight: 700,
            letterSpacing: 1.5,
          }}>{number}</span>
        )}
        <h2 style={{
          fontFamily: "'Sora', 'Inter', sans-serif",
          fontSize: 17, fontWeight: 650, margin: 0,
          color: NAVY, letterSpacing: '-0.01em',
        }}>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div style={{
        fontSize: 10, color: SLATE, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: 1.2,
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 3,
      }}>{label}</div>
      <div style={{ fontSize: 13, color: NAVY, fontWeight: 500 }}>{value}</div>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: any }) {
  return (
    <tr>
      <td style={td}>{label}</td>
      <td style={{ ...td, textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{value}</td>
    </tr>
  )
}

const bodyStyle = { fontSize: 13, color: STEEL, lineHeight: 1.65, margin: 0 }

const cellLabel = {
  border: `1px solid ${SLATE_LIGHT}`,
  padding: '7px 10px',
  fontWeight: 600,
  background: '#F7F8FA',
  color: STEEL,
  fontSize: 10,
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: 0.8,
  textTransform: 'uppercase' as const,
}
const cellValue = {
  border: `1px solid ${SLATE_LIGHT}`,
  padding: '7px 10px',
  color: NAVY,
  fontWeight: 500,
}
const table = {
  width: '100%' as const,
  borderCollapse: 'collapse' as const,
  fontSize: 13,
}
const th = {
  border: `1px solid ${SLATE_LIGHT}`,
  padding: '10px 12px',
  background: NAVY,
  color: PAPER,
  textAlign: 'left' as const,
  fontFamily: "'Sora', 'Inter', sans-serif",
  fontSize: 12, fontWeight: 650, letterSpacing: 0.3,
}
const td = {
  border: `1px solid ${SLATE_LIGHT}`,
  padding: '9px 12px',
  fontSize: 13, color: NAVY,
}
