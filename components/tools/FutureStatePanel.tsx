// TypeScript enabled
'use client'
// ── components/tools/FutureStatePanel.tsx ────────────────────────────────────
// Target / Future State VSM panel, REVIEW FIX #1
// Calls the existing /api/v2/future-state endpoint (already built and auth-gated)
// Shows: target setting → AI analysis → projected metrics → action plan

import { useState, useMemo } from 'react'
import { calcProcessMetrics, fmtPCE } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import type { Step, Project } from '@/lib/store'
import { ZapIcon, BarChartIcon } from '@/components/ui/Icons'

interface Props {
  project: Project
  steps: Step[]
  onClose: () => void
  isPaid: boolean
}

const fmtS = (s: number) => {
  if (!s) return ','
  if (s < 60) return `${Math.round(s)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(1)}h`
}

const CATEGORIES = [
  { id: 'lead_time',   label: 'Lead Time Reduction',   unit: '%', placeholder: '30' },
  { id: 'cycle_time',  label: 'Cycle Time Reduction',  unit: '%', placeholder: '20' },
  { id: 'defect_rate', label: 'Defect Rate Reduction',  unit: '%', placeholder: '50' },
  { id: 'pce',         label: 'PCE Improvement',        unit: '%', placeholder: '40' },
  { id: 'throughput',  label: 'Throughput Increase',    unit: '%', placeholder: '25' },
  { id: 'cost',        label: 'Cost Reduction',         unit: '%', placeholder: '15' },
]

export function FutureStatePanel({ project, steps, onClose, isPaid }: Props) {
  const [category,  setCategory]  = useState('lead_time')
  const [statement, setStatement] = useState('')
  const [value,     setValue]     = useState('')
  const [deadline,  setDeadline]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<any>(null)
  const [error,     setError]     = useState('')
  const [tab,       setTab]       = useState<'setup' | 'plan' | 'compare'>('setup')

  const metrics = useMemo(() =>
    calcProcessMetrics(steps as any[], project as any), [steps, project])

  const selectedCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0]

  async function runAnalysis() {
    if (!statement.trim()) { setError('Describe what you want to achieve'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/v2/future-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id:       project.id,
          target_statement: statement,
          target_category:  category,
          target_value:     value,
          target_unit:      selectedCat.unit,
          target_deadline:  deadline || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data.future_state)
      setTab('plan')
    } catch (e: any) {
      setError(e.message || 'Analysis failed, check your process data')
    } finally {
      setLoading(false)
    }
  }

  if (!isPaid) return (
    <div className="vesimy-modal-body" style={{ textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        Target State Analysis is a Pro feature
      </div>
      <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, maxWidth: 340, marginInline: 'auto' }}>
        Upgrade to Pro to generate AI-powered Future State VSMs with projected metrics and action plans.
      </p>
      <a href="/pricing" className="btn-primary btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
        View Pro Plans →
      </a>
    </div>
  )

  return (
    <>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--vs-slate-200, #DDE3EA)', padding: '0 22px', background: 'var(--vs-paper, #F7F8FA)', gap: 0 }}>
        {([['setup', 'Set Target'], ['plan', 'Action Plan'], ['compare', 'Compare']] as const).map(([id, label]) => (
          <button key={id}
            onClick={() => setTab(id)}
            disabled={id !== 'setup' && !result}
            style={{
              padding: '10px 16px', fontSize: 12, fontWeight: tab === id ? 700 : 500,
              color: tab === id ? 'var(--brand)' : 'var(--text3)',
              background: 'none', border: 'none', cursor: result || id === 'setup' ? 'pointer' : 'not-allowed',
              borderBottom: `2px solid ${tab === id ? 'var(--amber)' : 'transparent'}`,
              transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
            }}
          >{label}</button>
        ))}
      </div>

      <div className="vesimy-modal-body">

        {/* ── Setup tab ─────────────────────────────────────────────────────── */}
        {tab === 'setup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Current state snapshot */}
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--vs-paper, #F7F8FA)', border: '1px solid var(--vs-slate-200, #DDE3EA)' }}>
              <div className="section-label" style={{ marginBottom: 8 }}>Current State Snapshot</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  ['Lead Time', fmtS(metrics.leadTime), 'var(--brand)'],
                  ['PCE', fmtPCE(metrics.pce), metrics.pce !== null && metrics.pce >= 30 ? 'var(--green2)' : 'var(--red2)'],
                  ['Total CT', fmtS(metrics.totalCT), 'var(--text2)'],
                  ['Bottleneck', metrics.bottleneck?.name || ',', 'var(--red2)'],
                ].map(([l, v, c]) => (
                  <div key={l as string} style={{ flex: '1 1 80px' }}>
                    <div className="kpi-label">{l}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: c as string, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target setting */}
            <div>
              <label className="label">Improvement Category *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {CATEGORIES.map(c => (
                  <button key={c.id}
                    onClick={() => setCategory(c.id)}
                    style={{
                      padding: '7px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      border: `1.5px solid ${category === c.id ? 'var(--amber)' : 'var(--vs-slate-200, #DDE3EA)'}`,
                      background: category === c.id ? 'var(--amber-dim)' : '#FFFFFF',
                      color: category === c.id ? 'var(--amber2)' : 'var(--text2)',
                    }}
                  >{c.label}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10 }}>
              <div>
                <label className="label">Target Value</label>
                <input
                  className="input"
                  type="number"
                  placeholder={selectedCat.placeholder}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                />
              </div>
              <div style={{ paddingTop: 20, fontSize: 13, color: 'var(--text3)', fontWeight: 600 }}>
                {selectedCat.unit}
              </div>
              <div>
                <label className="label">Deadline</label>
                <input
                  className="input"
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  style={{ width: 140 }}
                />
              </div>
            </div>

            <div>
              <label className="label">Target Statement *</label>
              <textarea
                className="input"
                rows={3}
                placeholder={`e.g. "Reduce order-to-delivery lead time by ${value || selectedCat.placeholder}% within ${deadline ? new Date(deadline).toLocaleDateString() : '90 days'} by eliminating waiting and reducing changeover time at the bottleneck step."`}
                value={statement}
                onChange={e => setStatement(e.target.value)}
              />
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                Be specific. Supe AI uses this to design the improvement path.
              </div>
            </div>

            {error && (
              <div style={{ padding: '8px 12px', borderRadius: 7, background: 'var(--red-dim)', border: '1px solid rgba(192,24,12,0.20)', color: 'var(--red)', fontSize: 12 }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── Plan tab ─────────────────────────────────────────────────────── */}
        {tab === 'plan' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Projected metrics */}
            {result.projected_metrics && (
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(232,148,26,0.05)', border: '1px solid var(--amber-border)' }}>
                <div className="section-label" style={{ marginBottom: 10 }}>Projected Improvements</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {Object.entries(result.projected_metrics).map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 3, fontFamily: 'var(--font-sans)' }}>
                        {k.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--amber)' }}>
                        {String(v)}
                      </div>
                    </div>
                  ))}
                </div>
                {result.target_achievement && (
                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)', borderTop: '1px solid var(--amber-border)', paddingTop: 10, lineHeight: 1.6 }}>
                    <strong>Assessment:</strong> {result.target_achievement}
                  </div>
                )}
              </div>
            )}

            {/* Action plan */}
            {result.action_plan?.length > 0 && (
              <div>
                <div className="section-label" style={{ marginBottom: 10 }}>Implementation Plan</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.action_plan.map((action: any) => (
                    <div key={action.sequence} style={{ padding: '12px 14px', borderRadius: 9, border: '1px solid var(--vs-slate-200, #DDE3EA)', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--brand-dim)', border: '1px solid rgba(201,166,107,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--brand)', flexShrink: 0 }}>
                          {action.sequence}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{action.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55, marginBottom: 6 }}>{action.description}</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {action.timeframe && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--vs-paper, #F7F8FA)', color: 'var(--text3)', border: '1px solid var(--vs-slate-200, #DDE3EA)' }}>⏱ {action.timeframe}</span>}
                            {action.ci_tool && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--amber-dim)', color: 'var(--amber2)', border: '1px solid var(--amber-border)' }}>Tool: {action.ci_tool}</span>}
                            {action.expected_outcome && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(22,128,60,0.18)' }}>→ {action.expected_outcome}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.disclaimer && (
              <div style={{ fontSize: 10, color: 'var(--text3)', borderTop: '1px solid var(--vs-slate-200, #DDE3EA)', paddingTop: 10, lineHeight: 1.6, fontStyle: 'italic' }}>
                {result.disclaimer}
              </div>
            )}
          </div>
        )}

        {/* ── Compare tab ───────────────────────────────────────────────────── */}
        {tab === 'compare' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="section-label">Current State vs Target State</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--vs-paper, #F7F8FA)', border: '1px solid var(--vs-slate-200, #DDE3EA)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 12 }}>Current State</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    ['Lead Time', fmtS(metrics.leadTime)],
                    ['PCE', fmtPCE(metrics.pce)],
                    ['Bottleneck', metrics.bottleneck?.name || ','],
                    ['Total WIP', String(metrics.totalWIP || ',')],
                  ].map(([l, v]) => (
                    <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--text3)' }}>{l}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(232,148,26,0.05)', border: '1px solid var(--amber-border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: 'var(--amber2)', textTransform: 'uppercase', marginBottom: 12 }}>Target State (Projected)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.projected_metrics && Object.entries(result.projected_metrics).slice(0, 4).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--text3)' }}>{k.replace(/_/g, ' ')}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--amber)' }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {result.future_state_steps?.length > 0 && (
              <div>
                <div className="section-label" style={{ marginBottom: 8 }}>Recommended Step Changes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.future_state_steps.map((fs: any) => (
                    <div key={fs.position} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: '#FFFFFF', border: '1px solid var(--vs-slate-200, #DDE3EA)' }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: fs.change_type === 'eliminated' ? 'var(--red-dim)' : fs.change_type === 'improved' ? 'var(--green-dim)' : fs.change_type === 'added' ? 'var(--brand-dim)' : 'var(--vs-paper, #F7F8FA)', color: fs.change_type === 'eliminated' ? 'var(--red)' : fs.change_type === 'improved' ? 'var(--green)' : fs.change_type === 'added' ? 'var(--brand)' : 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {fs.change_type}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{fs.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text3)', flex: 1 }}>{fs.change_description}</span>
                      {fs.target_cycle_time && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', fontWeight: 700 }}>CT→{fs.target_cycle_time}{fs.cycle_time_unit === 'seconds' ? 's' : fs.cycle_time_unit}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="vesimy-modal-footer">
        <button className="btn-ghost btn" onClick={onClose}>Close</button>
        {tab === 'setup' && (
          <button
            className="btn-amber btn"
            onClick={runAnalysis}
            disabled={loading || !statement.trim()}
            style={{ gap: 6, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </svg>
                Analysing…
              </>
            ) : (
              <>✦ Generate Target State</>
            )}
          </button>
        )}
        {tab !== 'setup' && result && (
          <button className="btn-ghost btn" onClick={() => setTab('setup')}>← Refine Target</button>
        )}
      </div>
    </>
  )
}
