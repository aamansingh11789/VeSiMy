// @ts-nocheck
'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { FieldTip } from '@/components/ui/FieldTip'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'

interface Props {
  steps: any[]
  takt: number
  onClose: () => void
}

const VA_COLORS = {
  va:   { bar: '#1DD1A1', label: 'Value Add',                text: '#1DD1A1' },
  nnva: { bar: '#0176D3', label: 'Necessary Non-Value Add',  text: '#0176D3' },
  nva:  { bar: '#FF6B6B', label: 'Non-Value Add',            text: '#FF6B6B' },
}

function exportYamazumiHTML(operators: any[], steps: any[], takt: number, summary: any) {
  // Build an HTML Yamazumi chart that can be printed/saved as PDF
  const barH = 240
  const barW = 64
  const gap  = 16
  const padLeft = 60
  const maxVal = Math.max(takt > 0 ? takt : 0, ...operators.map((op: any) => op.total || 0), 1)
  const scale  = (barH - 20) / maxVal

  const VA_COLORS: Record<string, string> = { va: '#34D399', nnva: '#FCD34D', nva: '#F87171' }
  const VA_LABELS: Record<string, string> = { va: 'Value Add', nnva: 'Necessary NVA', nva: 'Non-Value Add' }

  const svgW = padLeft + operators.length * (barW + gap) + 60
  const svgH = barH + 80

  const bars = operators.map((op: any, idx: number) => {
    const x = padLeft + idx * (barW + gap)
    let yOffset = barH
    const segments = (['nva','nnva','va'] as const).map(type => {
      const val = op[type] || 0
      const h   = val * scale
      yOffset  -= h
      return h > 0 ? `<rect x="${x}" y="${yOffset}" width="${barW}" height="${h}" fill="${VA_COLORS[type]}" opacity="0.9"/>
        ${h > 14 ? `<text x="${x + barW/2}" y="${yOffset + h/2 + 4}" text-anchor="middle" font-size="9" fill="white" font-weight="700">${val}s</text>` : ''}` : ''
    }).join('')
    const label = `<text x="${x + barW/2}" y="${barH + 16}" text-anchor="middle" font-size="10" fill="#374151" font-weight="600">${op.name || 'Op ' + (idx+1)}</text>
      <text x="${x + barW/2}" y="${barH + 28}" text-anchor="middle" font-size="9" fill="${op.total > takt && takt > 0 ? '#EF4444' : '#6B7280'}">${op.total || 0}s ${op.pct !== undefined ? '· ' + op.pct + '% VA' : ''}</text>`
    return segments + label
  }).join('')

  const taktLine = takt > 0 ? `
    <line x1="${padLeft - 10}" y1="${barH - takt * scale}" x2="${svgW - 20}" y2="${barH - takt * scale}" stroke="#EF4444" stroke-width="2" stroke-dasharray="6 3"/>
    <text x="${svgW - 22}" y="${barH - takt * scale - 4}" text-anchor="end" font-size="9" fill="#EF4444" font-weight="700">Takt ${takt}s</text>` : ''

  const yAxis = Array.from({ length: 6 }, (_, i) => {
    const val = Math.round((maxVal / 5) * i)
    const y   = barH - val * scale
    return `<line x1="${padLeft - 6}" y1="${y}" x2="${svgW - 20}" y2="${y}" stroke="#E5E7EB" stroke-width="0.8"/>
      <text x="${padLeft - 10}" y="${y + 4}" text-anchor="end" font-size="9" fill="#9CA3AF">${val}s</text>`
  }).join('')

  const legend = Object.entries(VA_LABELS).map(([k, label]) =>
    `<span style="display:inline-flex;align-items:center;gap:5px;margin-right:16px;font-size:12px;">
      <span style="width:12px;height:12px;border-radius:2px;background:${VA_COLORS[k]};display:inline-block;"></span>${label}
    </span>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Yamazumi Chart — Operator Balance</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system,'Segoe UI',sans-serif; padding: 36px 44px; max-width: 900px; margin: 0 auto; color: #1A1A1A; }
    .header { border-bottom: 3px solid #0176D3; padding-bottom: 16px; margin-bottom: 24px; }
    .doc-type { font-size: 10px; letter-spacing: 2.5px; font-family: monospace; color: #0176D3; font-weight: 700; margin-bottom: 6px; }
    .doc-title { font-size: 22px; font-weight: 700; color: #111; }
    .metrics { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
    .metric { background: #F8F6F0; border: 1px solid #E8E5E0; border-radius: 8px; padding: 10px 16px; text-align: center; min-width: 100px; }
    .metric-label { font-size: 9px; font-family: monospace; letter-spacing: 1px; color: #999; margin-bottom: 3px; }
    .metric-val { font-size: 20px; font-weight: 700; }
    .legend { margin: 16px 0; }
    .no-print { background:#EEF4FB;border:1px solid #0176D3;border-radius:6px;padding:8px 14px;font-size:11px;color:#0176D3;margin-bottom:18px; }
    .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #E8E5E0; font-size: 10px; color: #999; font-family: monospace; }
    @media print { .no-print { display: none; } body { padding: 20px; } }
  </style>
</head>
<body>
  <p class="no-print">TIP: To save as PDF: File → Print → Destination: Save as PDF</p>
  <div class="header">
    <div class="doc-type">YAMAZUMI CHART — OPERATOR BALANCE</div>
    <div class="doc-title">Operator Time Distribution</div>
  </div>
  <div class="metrics">
    ${takt > 0 ? `<div class="metric"><div class="metric-label">TAKT TIME</div><div class="metric-val" style="color:#EF4444">${takt}s</div></div>` : ''}
    <div class="metric"><div class="metric-label">OPERATORS</div><div class="metric-val">${operators.length}</div></div>
    <div class="metric"><div class="metric-label">STEPS</div><div class="metric-val">${steps.length}</div></div>
    ${summary ? `<div class="metric"><div class="metric-label">AVG VA%</div><div class="metric-val" style="color:#34D399">${summary.pct || 0}%</div></div>` : ''}
  </div>
  <div class="legend">${legend}</div>
  <svg width="${svgW}" height="${svgH}" style="display:block;margin:0 auto;">
    <rect width="${svgW}" height="${svgH}" fill="#FAFAF8" rx="8"/>
    ${yAxis}
    <line x1="${padLeft}" y1="10" x2="${padLeft}" y2="${barH}" stroke="#D1D5DB" stroke-width="1.5"/>
    <line x1="${padLeft}" y1="${barH}" x2="${svgW - 20}" y2="${barH}" stroke="#D1D5DB" stroke-width="1.5"/>
    ${bars}
    ${taktLine}
  </svg>
  <div class="footer">Generated by VeSiMy — vesimy.com · ${new Date().toISOString().split('T')[0]}</div>
</body>
</html>`
}

export default function YamazumiTool({ steps, takt, onClose }: Props) {
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()

  const [showNva, setShowNva] = useState(true)

  // Build operator data from steps with op_steps
  const operators = useMemo(() => {
    const ops: any[] = []
    steps.forEach(step => {
      const opSteps = step.op_steps || []
      if (opSteps.length > 0) {
        ops.push({
          stepName: step.name,
          stepId: step.id,
          tasks: opSteps,
          totalTime: opSteps.reduce((a: number, s: any) => a + s.time, 0),
          va_type: step.va_type || 'va',
        })
      } else if (step.cycle_time) {
        // Fallback: treat whole CT as the step's VA type
        ops.push({
          stepName: step.name,
          stepId: step.id,
          tasks: [{ id: step.id, name: step.name, time: Number(step.cycle_time), va_type: step.va_type || 'va' }],
          totalTime: Number(step.cycle_time),
          va_type: step.va_type || 'va',
        })
      }
    })
    return ops
  }, [steps])

  const maxTime = Math.max(takt || 0, ...operators.map(o => o.totalTime), 10)

  const summary = useMemo(() => {
    const allTasks = operators.flatMap(o => o.tasks)
    const total  = allTasks.reduce((a, t) => a + t.time, 0)
    const va     = allTasks.filter(t => t.va_type === 'va').reduce((a, t) => a + t.time, 0)
    const nnva   = allTasks.filter(t => t.va_type === 'nnva').reduce((a, t) => a + t.time, 0)
    const nva    = allTasks.filter(t => t.va_type === 'nva').reduce((a, t) => a + t.time, 0)
    return { total, va, nnva, nva, pct: total > 0 ? Math.round(va / total * 100) : 0 }
  }, [operators])

  const CHART_H = 240
  const BAR_W   = 56

  return (
    <Modal
      title="Yamazumi Chart — Operator Balance"
      onClose={onClose}
    >
      {/* View-only notice + export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, padding: '6px 14px', background: 'rgba(244,166,35,0.08)', border: '1px solid rgba(244,166,35,0.2)', borderRadius: 8, fontSize: 12, color: '#F4A623' }}>
          View only — this chart reads from your step data. Edit cycle times and op steps in each step to update it.
        </div>
        <button
          onClick={() => {
            const html = exportYamazumiHTML(operators, steps, takt, summary)
            const blob = new Blob([html], { type: 'text/html' })
            const url  = URL.createObjectURL(blob)
            const a    = document.createElement('a')
            a.href = url; a.download = 'yamazumi-chart.html'; a.click()
            URL.revokeObjectURL(url)
          }}
          style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text2)', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          ↓ Export (PDF)
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {Object.entries(VA_COLORS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: v.bar }} />
              <span style={{ color: 'var(--text2)' }}>{v.label}</span>
            </div>
          ))}
          {takt > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
              <div style={{ width: 16, height: 2, background: '#FF6B6B', borderTop: '2px dashed #FF6B6B' }} />
              <span style={{ color: '#FF6B6B', display:'flex', alignItems:'center', gap:4 }}>Takt Time ({takt}s)<FieldTip termKey="takt_time" /></span>
            </div>
          )}
        </div>

        {operators.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text3)', fontSize: 13 }}>
            
            No operator steps defined yet.<br />
            Edit each process step and add operator tasks under <strong>Operator Steps</strong> to populate this chart.
          </div>
        ) : (
          <>
            {/* Chart */}
            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minWidth: operators.length * (BAR_W + 8), position: 'relative', height: CHART_H + 50 }}>

                {/* Takt line */}
                {takt > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    bottom: 42 + (takt / maxTime) * CHART_H,
                    borderTop: '2px dashed #FF6B6B',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}>
                    <span style={{ position: 'absolute', right: 4, top: -14, fontSize: 9, color: '#FF6B6B', fontFamily: 'monospace', background: 'var(--bg)', padding: '0 3px' }}>
                      TAKT {takt}s
                    </span>
                  </div>
                )}

                {operators.map((op) => {
                  const stackedTasks = [...op.tasks].reverse()
                  let bottom = 42

                  return (
                    <div key={op.stepId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {/* Stacked bar */}
                      <div style={{ width: BAR_W, height: CHART_H, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        {op.tasks.map((task: any) => {
                          const h = Math.max(2, (task.time / maxTime) * CHART_H)
                          const color = VA_COLORS[task.va_type as keyof typeof VA_COLORS]?.bar || 'var(--text3)'
                          return (
                            <div
                              key={task.id}
                              title={`${task.name}: ${task.time}s (${task.va_type.toUpperCase()})`}
                              style={{
                                width: '100%', height: h, background: color,
                                borderTop: '1px solid rgba(0,0,0,0.15)',
                                overflow: 'hidden', cursor: 'default',
                              }}
                            >
                              {h > 16 && (
                                <span style={{ fontSize: 8, color: 'rgba(0,0,0,0.7)', padding: '1px 3px', display: 'block', fontFamily: 'monospace', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {task.time}s
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Total time label */}
                      <div style={{ marginTop: 4, fontSize: 10, fontFamily: 'monospace', color: op.totalTime > (takt || 9999) ? '#FF6B6B' : '#1DD1A1', fontWeight: 700 }}>
                        {op.totalTime}s
                      </div>

                      {/* Step name */}
                      <div style={{ fontSize: 9, color: 'var(--text3)', textAlign: 'center', maxWidth: BAR_W + 8, wordBreak: 'break-word', marginTop: 2 }}>
                        {op.stepName}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI rebalance button */}
            {operators.length > 1 && takt > 0 && (
              <div>
                <AIAssistButton
                  label="AI Suggest rebalance"
                  loading={aiLoading}
                  onClick={() => aiAssist('yamazumi_rebalance', { operators, takt })}
                />
                {aiResult && (
                  <AIResultPanel
                    result={aiResult as string} source={aiSource} error={aiError} onClear={aiClear}
                    title="REBALANCE SUGGESTION"
                  />
                )}
              </div>
            )}

            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
              {[
                { label: 'Total CT',    val: `${summary.total}s`, color: 'var(--text)' },
                { label: '% VA',        val: `${summary.pct}%`,   color: '#1DD1A1' },
                { label: 'VA Time',     val: `${summary.va}s`,    color: '#1DD1A1' },
                { label: 'NNVA Time',   val: `${summary.nnva}s`,  color: '#0176D3' },
                { label: 'NVA Waste',   val: `${summary.nva}s`,   color: '#FF6B6B' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 9, color: 'var(--text3)' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Imbalance warnings */}
            {takt > 0 && operators.some(o => o.totalTime > takt) && (
              <div style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#FF6B6B' }}>
                <strong style={{color:'#0176D3'}}>OVER TAKT:</strong> <strong>{operators.filter(o => o.totalTime > takt).map(o => o.stepName).join(', ')}</strong> exceed takt time — these are your bottlenecks. Balance work content by moving tasks to under-loaded operators.
              </div>
            )}

            {summary.nva > 0 && (
              <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#0176D3' }}>
                <strong style={{color:'#1DD1A1'}}>NVA WASTE:</strong> <strong>{summary.nva}s of NVA waste</strong> identified across all operators. Target these tasks for elimination in your next kaizen event.
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
