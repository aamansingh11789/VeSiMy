// @ts-nocheck
'use client'

import ReportFooter from './ReportFooter'

function fmtS(s?: number | null) {
  if (!s && s !== 0) return '—'
  if (s < 60) return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(2)}h`
}

export default function IndustrialReport({ project, metrics, rootCause, waste, improvements, vsmHtml }: any) {
  const today = new Date().toLocaleDateString()

  return (
    <div
      style={{
        background: '#fff',
        color: '#111',
        padding: 32,
        fontFamily: 'Arial, Helvetica, sans-serif',
        lineHeight: 1.45,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, borderBottom: '2px solid #222', paddingBottom: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Process Analysis Report</div>
          <div style={{ fontSize: 13, color: '#666' }}>{project?.name || 'Unnamed Process'}</div>
        </div>

        <table style={{ borderCollapse: 'collapse', minWidth: 320, fontSize: 12 }}>
          <tbody>
            <tr><td style={cellLabel}>Document ID</td><td style={cellValue}>VSM-{project?.id || '001'}</td></tr>
            <tr><td style={cellLabel}>Revision</td><td style={cellValue}>1.0</td></tr>
            <tr><td style={cellLabel}>Prepared By</td><td style={cellValue}>Vesimy</td></tr>
            <tr><td style={cellLabel}>Date</td><td style={cellValue}>{today}</td></tr>
          </tbody>
        </table>
      </div>

      <Section title="1. Executive Summary">
        <p>
          This report summarizes the current-state process analysis for <strong>{project?.name || 'this process'}</strong>.
          It is intended to support operational analysis, bottleneck identification, root-cause review,
          and continuous improvement planning.
        </p>
      </Section>

      <Section title="2. Process Overview">
        <p><strong>Industry:</strong> {project?.industry || '—'}</p>
        <p><strong>Product / Service:</strong> {project?.product || '—'}</p>
        <p><strong>Customer:</strong> {project?.customer || '—'}</p>
        <p><strong>Supplier:</strong> {project?.supplier || '—'}</p>
      </Section>

      <Section title="3. Performance Metrics">
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Metric</th>
              <th style={th}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>Lead Time</td><td style={td}>{fmtS(metrics?.leadTime)}</td></tr>
            <tr><td style={td}>Value Added Time</td><td style={td}>{fmtS(metrics?.valueAdded)}</td></tr>
            <tr><td style={td}>Main Flow CT</td><td style={td}>{fmtS(metrics?.mainCT)}</td></tr>
            <tr><td style={td}>Takt Time</td><td style={td}>{fmtS(metrics?.takt)}</td></tr>
            <tr><td style={td}>PCE</td><td style={td}>{metrics?.pce ? `${metrics.pce.toFixed(1)}%` : '—'}</td></tr>
            <tr><td style={td}>Total WIP</td><td style={td}>{metrics?.totalWIP ?? '—'}</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="4. Current-State Value Stream Map">
        <div dangerouslySetInnerHTML={{ __html: vsmHtml || '<p>No VSM export available.</p>' }} />
      </Section>

      <Section title="5. Root Cause Analysis">
        <p>{rootCause || 'Root cause analysis not yet completed.'}</p>
      </Section>

      <Section title="6. Waste Analysis">
        <p>{waste || 'Waste analysis not yet completed.'}</p>
      </Section>

      <Section title="7. Improvement Plan">
        <p>{improvements || 'Improvement actions not yet defined.'}</p>
      </Section>

      <Section title="8. Standards Notice">
        <p>
          This document was generated using the Vesimy Process Intelligence Platform.
          The document structure is designed to align with widely recognized industrial process analysis practices
          and relevant standards guidance, including ISO 9001 process-documentation principles and ISO 22468
          value stream management concepts, where applicable.
        </p>
        <p>
          This document is intended to support operational analysis, continuous improvement,
          and internal decision-making. It does not by itself certify organizational compliance with any ISO standard.
        </p>
      </Section>

      <ReportFooter />
    </div>
  )
}

function Section({ title, children }: any) {
  return (
    <section style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 16, margin: '0 0 8px', paddingBottom: 4, borderBottom: '1px solid #ddd' }}>{title}</h2>
      {children}
    </section>
  )
}

const cellLabel = { border: '1px solid #ccc', padding: '6px 8px', fontWeight: 700, background: '#f5f5f5' }
const cellValue = { border: '1px solid #ccc', padding: '6px 8px' }
const table = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 }
const th = { border: '1px solid #d9d9d9', padding: '7px 8px', background: '#f2f2f2', textAlign: 'left' as const }
const td = { border: '1px solid #d9d9d9', padding: '7px 8px' }