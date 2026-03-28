// @ts-nocheck
// ── components/v2/AnalysisReport.tsx ─────────────────────────────────────────
// Renders the structured analysis report in the Journal tab.
// Shows bottlenecks, missing info, CI suggestions, improvement potential.
'use client'
import { useState } from 'react'

const BRAND = '#0176D3'; const RED = '#C0402A'; const GREEN = '#2E844A'; const AMBER = '#F4A623'
const TOOL_ICONS: Record<string, string> = {
  time_study:'⏱', fishbone:'🦴', five_why:'🔍', waste_id:'♻️',
  kaizen:'⚡', pdca:'🔄', smed:'🔧', yamazumi:'📊',
}
const SEV_COLOR: Record<string, string> = { critical: RED, high: AMBER, medium: BRAND }
const PRIO_COLOR: Record<string, string> = { critical: RED, important: AMBER, useful: GREEN }

interface Props {
  report: any
  onOpenCITool?: (stepId: string, tool: string) => void
}

export function AnalysisReport({ report, onOpenCITool }: Props) {
  const [expanded, setExpanded] = useState<string | null>('summary')
  const serif = 'DM Serif Display, Georgia, serif'
  const mono = 'IBM Plex Mono, monospace'

  function Section({ id, title, badge, color, children }: any) {
    const open = expanded === id
    return (
      <div style={{ border: '1px solid #E8E5E0', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
        <button onClick={() => setExpanded(open ? null : id)}
          style={{ width: '100%', padding: '13px 16px', background: open ? 'rgba(1,118,211,0.04)' : 'white',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#242220' }}>{title}</span>
          {badge !== undefined && (
            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700,
              background: `${color || BRAND}16`, color: color || BRAND,
              border: `1px solid ${color || BRAND}30`, borderRadius: 5, padding: '2px 8px' }}>
              {badge}
            </span>
          )}
          <span style={{ color: '#8E8A82', fontSize: 14, transform: open ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s', display: 'inline-block' }}>›</span>
        </button>
        {open && <div style={{ padding: '14px 16px', borderTop: '1px solid #E8E5E0' }}>{children}</div>}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(1,118,211,0.06), white)',
        borderBottom: '1px solid #E8E5E0', marginBottom: 20 }}>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, color: BRAND,
          textTransform: 'uppercase', marginBottom: 8 }}>
          Current State Analysis · v{report.version} · {new Date(report.generated_at || Date.now()).toLocaleDateString()}
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Steps', value: report.total_steps, color: BRAND },
            { label: 'VA Ratio', value: report.va_ratio, color: GREEN },
            { label: 'Lead Time', value: report.estimated_lead_time, color: '#6426A0' },
            { label: 'Bottlenecks', value: report.bottlenecks?.length || 0, color: RED },
            { label: 'Missing Info', value: report.missing_information?.length || 0, color: AMBER },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 400, color: s.color,
                lineHeight: 1 }}>{s.value || '—'}</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: '#8E8A82', marginTop: 3,
                letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement potential banner */}
      {report.improvement_potential && (
        <div style={{ margin: '0 24px 16px', padding: '14px 18px',
          background: 'rgba(46,132,74,0.06)', border: '1px solid rgba(46,132,74,0.2)',
          borderRadius: 10, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2, color: GREEN,
              marginBottom: 3 }}>IMPROVEMENT POTENTIAL</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#242220' }}>
              {report.improvement_potential.conservative} — {report.improvement_potential.optimistic}
            </div>
            <div style={{ fontSize: 12, color: '#6B6760', marginTop: 2 }}>
              {report.improvement_potential.basis}
            </div>
          </div>
          <div style={{ flex: 1, fontSize: 12, color: '#6B6760', lineHeight: 1.6, fontStyle: 'italic' }}>
            ⚠ {report.improvement_potential.caveat}
          </div>
        </div>
      )}

      <div style={{ padding: '0 24px 24px' }}>
        {/* Summary */}
        <Section id="summary" title="Process Summary">
          <p style={{ fontSize: 14, color: '#3A3835', lineHeight: 1.8, margin: 0 }}>
            {report.process_summary}
          </p>
        </Section>

        {/* Bottlenecks */}
        <Section id="bottlenecks" title="Bottlenecks & Constraints"
          badge={report.bottlenecks?.length || 0} color={RED}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(report.bottlenecks || []).map((b: any, i: number) => (
              <div key={i} style={{ padding: '12px 14px', background: `${SEV_COLOR[b.severity] || BRAND}08`,
                border: `1px solid ${SEV_COLOR[b.severity] || BRAND}25`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: mono, fontSize: 8, fontWeight: 700,
                    color: SEV_COLOR[b.severity] || BRAND, letterSpacing: 1,
                    background: `${SEV_COLOR[b.severity] || BRAND}12`,
                    padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase' }}>
                    {b.severity}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#242220' }}>{b.step_name}</span>
                </div>
                <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.6, margin: '0 0 8px' }}>
                  {b.reason}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#6B6760' }}>Recommended tool:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: BRAND }}>
                    {TOOL_ICONS[b.ci_tool]} {b.ci_tool?.replace(/_/g, ' ')}
                  </span>
                  {onOpenCITool && b.step_id && (
                    <button onClick={() => onOpenCITool(b.step_id, b.ci_tool)}
                      style={{ marginLeft: 'auto', padding: '4px 12px', background: BRAND, color: 'white',
                        border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                      Open →
                    </button>
                  )}
                </div>
                {b.tool_rationale && (
                  <div style={{ fontSize: 11, color: '#8E8A82', marginTop: 5, fontStyle: 'italic' }}>
                    {b.tool_rationale}
                  </div>
                )}
              </div>
            ))}
            {!report.bottlenecks?.length && (
              <p style={{ fontSize: 13, color: '#8E8A82' }}>No bottlenecks identified — add cycle time data for precise detection.</p>
            )}
          </div>
        </Section>

        {/* Missing info */}
        <Section id="missing" title="Missing Information"
          badge={report.missing_information?.length || 0} color={AMBER}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(report.missing_information || []).map((m: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px',
                background: 'rgba(244,166,35,0.06)', border: '1px solid rgba(244,166,35,0.2)',
                borderRadius: 7, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: mono, fontSize: 8, fontWeight: 700, color: AMBER,
                  background: 'rgba(244,166,35,0.12)', padding: '2px 5px', borderRadius: 3,
                  letterSpacing: 1, textTransform: 'uppercase', flexShrink: 0, marginTop: 2 }}>
                  {m.priority}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#242220' }}>
                    {m.step_name} — <span style={{ color: AMBER }}>{m.field}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B6760', marginTop: 3 }}>{m.impact}</div>
                </div>
              </div>
            ))}
            {!report.missing_information?.length && (
              <p style={{ fontSize: 13, color: GREEN }}>✓ All critical information present.</p>
            )}
          </div>
        </Section>

        {/* Mapping guidance */}
        {report.mapping_guidance?.length > 0 && (
          <Section id="guidance" title="Mapping Guidance" badge="Tips" color={BRAND}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.mapping_guidance.map((g: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start',
                  fontSize: 13, color: '#3A3835', lineHeight: 1.65 }}>
                  <span style={{ color: BRAND, fontWeight: 700, flexShrink: 0 }}>→</span>
                  {g}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Waste analysis */}
        {report.waste_analysis && (
          <Section id="waste" title="Waste Analysis" badge={report.waste_analysis.identified_wastes?.length} color="#6426A0">
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1, color: '#8E8A82', marginBottom: 6 }}>IDENTIFIED WASTES (DOWNTIME)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(report.waste_analysis.identified_wastes || []).map((w: string) => (
                  <span key={w} style={{ padding: '4px 10px', background: 'rgba(100,38,160,0.08)',
                    border: '1px solid rgba(100,38,160,0.2)', borderRadius: 5,
                    fontSize: 12, color: '#6426A0', fontWeight: 500 }}>{w}</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1, color: '#8E8A82', marginBottom: 4 }}>HIGHEST IMPACT</div>
              <div style={{ fontSize: 13, color: '#242220', fontWeight: 600 }}>{report.waste_analysis.highest_impact}</div>
            </div>
            {report.waste_analysis.quick_wins?.length > 0 && (
              <div>
                <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1, color: GREEN, marginBottom: 6 }}>QUICK WINS (NO COST)</div>
                {report.waste_analysis.quick_wins.map((qw: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#3A3835' }}>
                    <span style={{ color: GREEN, fontWeight: 700 }}>✓</span>{qw}
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* CI suggestions per step */}
        {report.ci_suggestions?.length > 0 && (
          <Section id="ci" title="CI Tool Recommendations" badge={report.ci_suggestions?.length} color={BRAND}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.ci_suggestions.map((s: any, i: number) => (
                <div key={i} style={{ padding: '10px 12px', background: 'rgba(1,118,211,0.04)',
                  border: '1px solid rgba(1,118,211,0.12)', borderRadius: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15 }}>{TOOL_ICONS[s.tool?.replace(/ /g,'_')] || '🔧'}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#242220' }}>{s.step_name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: BRAND, fontWeight: 600 }}>{s.tool}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B6760', lineHeight: 1.6 }}>{s.reason}</div>
                  {s.expected_outcome && (
                    <div style={{ fontSize: 11, color: GREEN, marginTop: 4 }}>Expected: {s.expected_outcome}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 16, padding: '12px 16px',
          background: 'rgba(107,103,96,0.06)', border: '1px solid rgba(107,103,96,0.15)',
          borderRadius: 8, fontSize: 11, color: '#6B6760', lineHeight: 1.7 }}>
          <strong>Disclaimer:</strong> {report.disclaimer}
        </div>
      </div>
    </div>
  )
}
