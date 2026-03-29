// @ts-nocheck
'use client'
import { SERIF, CI_LABELS, BRAND, RED, GREEN, AMBER } from './v2-constants'
// ── components/v2/V2Journal.tsx ───────────────────────────────────────────────
// Process Journal — all analysis reports for this project in chronological order.
// Each entry expandable inline. Download PDCA / OODA / 8D.

import { useState } from 'react'


function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  catch { return iso }
}

function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function buildPDCA(report: any, project: any, t?: any, indLabel?: string) {
  const ip = report.improvement_potential || {}
  const actions = report.action_plan || []
  return {
    document_type: 'PDCA Report',
    document_id: `PDCA-${report.id?.slice(0,8).toUpperCase()}`,
    revision: report.report_version || 1,
    date: new Date(report.generated_at).toISOString().split('T')[0],
    project: project.name,
    standard_reference: 'ISO 9001:2015 §10, ISO 9000:2015 §3.3.5',
    disclaimer: report.disclaimer,
    PLAN: {
      problem_statement: report.summary,
      current_condition: { [t?.leadTime || 'lead_time']: report.estimated_lead_time, pce: report.va_ratio, [t?.processSteps || 'steps']: report.total_steps, industry: indLabel || project.industry },
      target_condition: report.target_statement || 'Defined in future state report',
      root_cause_summary: (report.bottlenecks || []).map((b: any) => `${b.step_name}: ${b.reason}`),
      improvement_potential: ip,
    },
    DO: {
      countermeasures: actions.map((a: any) => ({
        step: a.step, action: a.action, ci_tool: CI_LABELS[a.ci_tool] || a.ci_tool,
        expected_gain: a.expected_gain,
      })),
    },
    CHECK: {
      metrics_to_track: ['Lead Time', 'PCE', 'Defect Rate', 'Cycle Time by Step'],
      missing_data: (report.missing_information || []).map((m: any) => m.step_name + ': ' + m.field),
    },
    ACT: {
      standardisation_actions: ['Update Standard Operating Procedure', 'Train affected team members', 'Schedule review in 30 days'],
    },
  }
}

function buildOODA(report: any, project: any, t?: any, indLabel?: string) {
  return {
    document_type: 'OODA Loop Report',
    document_id: `OODA-${report.id?.slice(0,8).toUpperCase()}`,
    revision: report.report_version || 1,
    date: new Date(report.generated_at).toISOString().split('T')[0],
    project: project.name,
    disclaimer: report.disclaimer,
    OBSERVE: {
      process: project.name,
      steps_mapped: report.total_steps,
      lead_time: report.estimated_lead_time,
      pce: report.va_ratio,
      critical_findings: (report.bottlenecks || []).map((b: any) => b.step_name),
    },
    ORIENT: {
      industry_context: report.summary,
      improvement_potential: report.improvement_potential,
      mapping_gaps: (report.missing_information || []).map((m: any) => m.step_name),
    },
    DECIDE: {
      priority_actions: (report.action_plan || []).map((a: any) => a.action),
      ci_tools_selected: [...new Set((report.ci_suggestions || []).map((c: any) => CI_LABELS[c.tool] || c.tool))],
    },
    ACT: {
      next_steps: (report.mapping_guidance || []),
    },
  }
}

function build8D(report: any, project: any, t?: any, indLabel?: string) {
  const bottlenecks = report.bottlenecks || []
  return {
    document_type: '8D Problem Solving Report',
    document_id: `8D-${report.id?.slice(0,8).toUpperCase()}`,
    revision: report.report_version || 1,
    date: new Date(report.generated_at).toISOString().split('T')[0],
    project: project.name,
    standard_reference: 'IATF 16949 §10.2',
    disclaimer: report.disclaimer,
    D1_Team: 'Process owner + CI team (define based on your organisation)',
    D2_Problem: report.summary,
    D3_Containment: bottlenecks.length > 0
      ? `Immediate monitoring of: ${bottlenecks.map((b: any) => b.step_name).join(', ')}`
      : 'Monitor all steps with missing cycle time data',
    D4_RootCause: (report.bottlenecks || []).map((b: any) => ({ step: b.step_name, cause: b.reason, tool: CI_LABELS[b.tool] || b.tool })),
    D5_CorrectiveActions: (report.action_plan || []).map((a: any) => ({ action: a.action, step: a.step, expected_gain: a.expected_gain })),
    D6_Implementation: 'Implement per action plan — assign owners and due dates from the map',
    D7_Prevention: ['Update SOP to reflect improvements', 'Add steps to process audit checklist', 'Schedule regular VSM review'],
    D8_Close: 'Close when target state metrics are verified and standardised',
  }
}

interface Props {
  reports: any[]
  project: any
  t: any
  indLabel: string
  onLoadReport: (r: any) => void
}

export function V2Journal({ reports, project, t, indLabel, onLoadReport }: Props) {
  const [expanded, setExpanded] = useState<string | null>(reports[0]?.id || null)

  const currentReports = reports.filter(r => r.report_type === 'current_state')
  const futureReports = reports.filter(r => r.report_type === 'future_state')

  if (reports.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--text3)', padding: 40 }}>
        <div style={{ fontSize: 48 }}>📓</div>
        <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>No reports yet</h3>
        <p style={{ fontSize: 14, textAlign: 'center', maxWidth: 340, lineHeight: 1.7 }}>
          Complete your {t?.valueStream || 'value stream'} map and click <strong>⚡ Analyze</strong> to generate your first current state report.
        </p>
      </div>
    )
  }

  const ReportCard = ({ report }: { report: any }) => {
    const isOpen = expanded === report.id
    const ip = report.improvement_potential || {}
    const isFuture = report.report_type === 'future_state'

    return (
      <div style={{
        background: 'white', border: `1px solid ${isFuture ? 'rgba(46,132,74,.3)' : 'var(--border)'}`,
        borderRadius: 12, overflow: 'hidden', marginBottom: 12,
      }}>
        {/* Card header */}
        <div
          style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, background: isFuture ? 'rgba(46,132,74,.03)' : 'white' }}
          onClick={() => setExpanded(isOpen ? null : report.id)}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{
                fontSize: 9, fontFamily: 'monospace', letterSpacing: 1.5, padding: '2px 8px', borderRadius: 4,
                background: isFuture ? 'rgba(46,132,74,.1)' : 'rgba(1,118,211,.08)',
                color: isFuture ? GREEN : BRAND, fontWeight: 700,
              }}>
                {isFuture ? 'FUTURE STATE' : 'CURRENT STATE'} v{report.report_version}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace' }}>
                {fmtDate(report.generated_at)}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isFuture && report.target_statement ? `Target: ${report.target_statement}` : (report.summary || project.name)}
            </div>
          </div>

          {/* Key metrics chips */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {report.va_ratio && (
              <span style={{ fontSize: 11, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 5, background: 'var(--sl-100)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
                PCE {report.va_ratio}
              </span>
            )}
            {ip.conservative && (
              <span style={{ fontSize: 11, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 5, background: 'rgba(46,132,74,.08)', color: GREEN, border: '1px solid rgba(46,132,74,.2)' }}>
                ↑ {ip.conservative}
              </span>
            )}
          </div>

          <span style={{ fontSize: 16, color: 'var(--text3)', flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none', display: 'inline-block' }}>›</span>
        </div>

        {/* Expanded body */}
        {isOpen && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '16px 18px' }}>

            {/* Summary */}
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
              {report.summary}
            </p>

            {/* Disclaimer */}
            <div style={{ padding: '10px 12px', background: 'rgba(244,166,35,.06)', border: '1px solid rgba(244,166,35,.25)', borderRadius: 7, fontSize: 11, color: '#7A5200', lineHeight: 1.6, marginBottom: 16 }}>
              ⚠️ {report.disclaimer}
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Steps', value: report.total_steps },
                { label: 'Lead Time', value: report.estimated_lead_time },
                { label: 'PCE', value: report.va_ratio },
              ].filter(m => m.value).map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'center', padding: '10px 8px', background: 'var(--sl-50)', borderRadius: 7, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'var(--text3)', letterSpacing: 1 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: SERIF, color: 'var(--text)' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Improvement potential */}
            {ip.conservative && (
              <div style={{ padding: '12px 14px', background: 'rgba(1,118,211,.05)', border: '1px solid rgba(1,118,211,.15)', borderRadius: 8, marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: BRAND, letterSpacing: 1.5, marginBottom: 8 }}>IMPROVEMENT POTENTIAL</div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div><div style={{ fontSize: 10, color: 'var(--text3)' }}>Conservative</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: SERIF, color: GREEN }}>{ip.conservative}</div></div>
                  <div><div style={{ fontSize: 10, color: 'var(--text3)' }}>Optimistic</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: SERIF, color: BRAND }}>{ip.optimistic}</div></div>
                </div>
                {ip.basis && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>{ip.basis}</div>}
              </div>
            )}

            {/* Future state specifics */}
            {isFuture && report.target_achievement && (
              <div style={{ padding: '12px 14px', background: 'rgba(46,132,74,.05)', border: '1px solid rgba(46,132,74,.2)', borderRadius: 8, marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: GREEN, letterSpacing: 1.5, marginBottom: 6 }}>TARGET ASSESSMENT</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{report.target_achievement}</p>
                {report.tolerance_range && (
                  <div style={{ fontSize: 11, color: GREEN, marginTop: 6, fontWeight: 600 }}>Tolerance: {report.tolerance_range}</div>
                )}
              </div>
            )}

            {/* Action plan preview */}
            {(report.action_plan || []).length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>ACTION PLAN ({report.action_plan.length} items)</div>
                {(report.action_plan || []).slice(0, 3).map((a: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: BRAND, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                    <div><strong style={{ color: 'var(--text)' }}>{a.step}</strong> — {a.action}</div>
                  </div>
                ))}
                {(report.action_plan || []).length > 3 && (
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>+{report.action_plan.length - 3} more actions…</div>
                )}
              </div>
            )}

            {/* Actions bar */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => onLoadReport(report)} style={{
                padding: '7px 14px', borderRadius: 7, border: 'none', background: BRAND,
                color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>View full report</button>

              <button onClick={() => downloadJSON(buildPDCA(report, project, t, indLabel), `${project.name}-PDCA-v${report.report_version}.json`)}
                style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--text2)' }}>
                ↓ PDCA
              </button>
              <button onClick={() => downloadJSON(buildOODA(report, project, t, indLabel), `${project.name}-OODA-v${report.report_version}.json`)}
                style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--text2)' }}>
                ↓ OODA
              </button>
              <button onClick={() => downloadJSON(build8D(report, project, t, indLabel), `${project.name}-8D-v${report.report_version}.json`)}
                style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--text2)' }}>
                ↓ 8D
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: 'var(--text3)', marginBottom: 6 }}>PROCESS JOURNAL</div>
          <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{project.name}</h2>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>
            {reports.length} report{reports.length !== 1 ? 's' : ''} · {currentReports.length} current state · {futureReports.length} future state
          </p>
        </div>

        {/* Future state reports first */}
        {futureReports.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: GREEN, marginBottom: 12 }}>FUTURE STATE REPORTS</div>
            {futureReports.map(r => <ReportCard key={r.id} report={r as any} />)}
          </div>
        )}

        {/* Current state reports */}
        {currentReports.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: BRAND, marginBottom: 12 }}>CURRENT STATE REPORTS</div>
            {currentReports.map(r => <ReportCard key={r.id} report={r as any} />)}
          </div>
        )}
      </div>
    </div>
  )
}
