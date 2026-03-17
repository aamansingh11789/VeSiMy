// @ts-nocheck
'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'

interface Props {
  steps: any[]
  takt: number
  onClose: () => void
}

const VA_COLORS = {
  va:   { bar: '#1DD1A1', label: 'Value Add',                text: '#1DD1A1' },
  nnva: { bar: '#D4A208', label: 'Necessary Non-Value Add',  text: '#D4A208' },
  nva:  { bar: '#FF6B6B', label: 'Non-Value Add',            text: '#FF6B6B' },
}

export default function YamazumiTool({ steps, takt, onClose }: Props) {
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
      title="📊 Yamazumi Chart — Operator Balance"
      onClose={onClose}
    >
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
              <span style={{ color: '#FF6B6B' }}>Takt Time ({takt}s)</span>
            </div>
          )}
        </div>

        {operators.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text3)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
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
                  label="⚡ Suggest rebalance"
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
                { label: 'NNVA Time',   val: `${summary.nnva}s`,  color: '#D4A208' },
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
                ⚠️ <strong>{operators.filter(o => o.totalTime > takt).map(o => o.stepName).join(', ')}</strong> exceed takt time — these are your bottlenecks. Balance work content by moving tasks to under-loaded operators.
              </div>
            )}

            {summary.nva > 0 && (
              <div style={{ background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#D4A208' }}>
                💡 <strong>{summary.nva}s of NVA waste</strong> identified across all operators. Target these tasks for elimination in your next kaizen event.
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
