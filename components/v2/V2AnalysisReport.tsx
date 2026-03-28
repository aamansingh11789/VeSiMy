// @ts-nocheck
'use client'
import { SERIF, CI_LABELS, BRAND, RED, GREEN, AMBER } from './v2-constants'
// ── components/v2/V2AnalysisReport.tsx ────────────────────────────────────────
// Current state analysis report display.
// Disclaimer always visible. Improvement potential. CI suggestions. Action plan.


export function V2AnalysisReport({ report, project, t, indLabel, onGoFuture, onGoMap }: any) {
  if (!report) return null
  const ip = report.improvement_potential || {}
  const bottlenecks = report.bottlenecks || []
  const missing = report.missing_information || []
  const guidance = report.mapping_guidance || []
  const actionPlan = report.action_plan || []
  const ciSugs = report.ci_suggestions || []

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      {/* Disclaimer — always first */}
      <div style={{ background: 'rgba(244,166,35,.07)', border: '1px solid rgba(244,166,35,.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7A5200', marginBottom: 4, fontFamily: 'monospace', letterSpacing: 1 }}>DISCLAIMER</div>
          <p style={{ fontSize: 12, color: '#7A5200', lineHeight: 1.7, margin: 0 }}>{report.disclaimer}</p>
        </div>
      </div>

      {/* Process summary */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: BRAND, marginBottom: 8 }}>CURRENT STATE ANALYSIS · {indLabel?.toUpperCase()}</div>
        <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 }}>{project.name}</h2>
        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.85, marginBottom: 20 }}>{report.summary}</p>

        {/* Key metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            { label: t?.processSteps ? `${t.processSteps} Mapped`.replace(/^\w/, (c: string) => c.toUpperCase()) : 'Steps Mapped', value: report.total_steps },
            { label: t?.leadTime || 'Lead Time', value: report.estimated_lead_time },
            { label: 'PCE — Process Cycle Efficiency', value: report.va_ratio, color: parseInt(report.va_ratio) >= 70 ? GREEN : parseInt(report.va_ratio) >= 40 ? AMBER : RED },
            { label: 'Data Completeness', value: `${Math.max(0, 100 - (missing.length * 8))}%` },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 1, color: 'var(--text3)', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: SERIF, color: color || 'var(--text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement potential */}
      <div style={{ background: 'rgba(1,118,211,.04)', border: '1px solid rgba(1,118,211,.2)', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
        <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: BRAND, marginBottom: 10 }}>IMPROVEMENT POTENTIAL</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Conservative estimate</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: SERIF, color: GREEN }}>{ip.conservative}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Optimistic estimate</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: SERIF, color: BRAND }}>{ip.optimistic}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 10 }}>
          <strong>Based on:</strong> {ip.basis}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
          <strong>Primary lever:</strong> {ip.primary_lever}
        </div>
      </div>

      {/* Bottlenecks / critical steps */}
      {bottlenecks.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: RED, marginBottom: 12 }}>CRITICAL FINDINGS — PRIORITY STEPS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bottlenecks.map((b: any, i: number) => (
              <div key={i} style={{ background: 'rgba(192,64,42,.04)', border: '1px solid rgba(192,64,42,.2)', borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{b.step_name}</div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 4, background: RED, color: 'white', letterSpacing: 1 }}>CRITICAL</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>{b.reason}</div>
                <div style={{ fontSize: 11, color: BRAND, fontWeight: 600 }}>
                  → Recommended: {CI_LABELS[b.tool] || b.tool}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing information */}
      {missing.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: AMBER, marginBottom: 12 }}>MISSING INFORMATION — AFFECTS ACCURACY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {missing.slice(0, 8).map((m: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 12px', background: 'rgba(244,166,35,.05)', border: '1px solid rgba(244,166,35,.2)', borderRadius: 7 }}>
                <span style={{ fontSize: 12, flexShrink: 0 }}>⚠</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{m.step_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{m.impact}</div>
                </div>
              </div>
            ))}
          </div>
          {missing.length > 0 && (
            <button onClick={onGoMap} style={{ marginTop: 10, padding: '8px 14px', borderRadius: 7, border: `1px solid ${AMBER}`, background: 'rgba(244,166,35,.06)', color: '#7A5200', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              ← Complete missing information in map
            </button>
          )}
        </div>
      )}

      {/* Mapping guidance */}
      {guidance.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: 'var(--text3)', marginBottom: 12 }}>MAPPING GUIDANCE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {guidance.map((g: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text2)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: BRAND, fontFamily: 'monospace', fontSize: 10, marginTop: 2 }}>{i+1}</span>
                {g}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CI tool recommendations per step */}
      {ciSugs.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: BRAND, marginBottom: 12 }}>CI TOOL RECOMMENDATIONS — PER STEP</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {ciSugs.map((s: any, i: number) => (
              <div key={i} style={{ padding: '10px 12px', background: 'white', border: '1px solid var(--border)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justify: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{s.step_name}</div>
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: s.priority === 'critical' ? 'rgba(192,64,42,.1)' : 'rgba(1,118,211,.08)', color: s.priority === 'critical' ? RED : BRAND, fontFamily: 'monospace', flexShrink: 0 }}>
                    {s.priority?.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: BRAND, fontWeight: 600, marginBottom: 3 }}>⚡ {CI_LABELS[s.tool] || s.tool}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action plan */}
      {actionPlan.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: 'var(--text3)', marginBottom: 12 }}>ACTION PLAN — CURRENT STATE RECOMMENDATIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {actionPlan.map((a: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: BRAND, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{a.step}</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 5 }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Why: {a.why}</div>
                  {a.expected_gain && <div style={{ fontSize: 11, color: GREEN, marginTop: 3, fontWeight: 600 }}>Expected gain: {a.expected_gain}</div>}
                  {a.ci_tool && <div style={{ fontSize: 10, color: BRAND, marginTop: 4 }}>Tool: {CI_LABELS[a.ci_tool] || a.ci_tool}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA to future state */}
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '28px 28px', textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,.4)', letterSpacing: 2, marginBottom: 12 }}>NEXT STEP</div>
        <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 10 }}>Define your target. Generate your future state.</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
          Tell Supe what you're trying to achieve and by when. Supe will ask the right questions and build a data-backed future state VSM and action plan.
        </p>
        <button onClick={onGoFuture} style={{ padding: '12px 28px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#0a5eaa,#0176D3)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Set target → Generate future state
        </button>
      </div>
    </div>
  )
}
