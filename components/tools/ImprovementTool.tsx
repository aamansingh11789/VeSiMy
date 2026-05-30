// TypeScript enabled
'use client'
import { CheckIcon, XIcon } from '@/components/ui/Icons'
import { TipLabel, FieldWarn } from '@/components/ui/FieldTip'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'

const METRICS = [
  'Cycle Time (s)',
  'Wait Time (s)',
  'Defect Rate (%)',
  'Uptime (%)',
  'Lead Time (s)',
  'Throughput (units/hr)',
  'Labor Cost ($)',
  'Quality Score (%)',
  'OEE (%)',
  'Custom',
]

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

interface Goal {
  id: string
  metric: string
  customMetric?: string
  baseline: string
  target: string
  actual: string
  status: 'open' | 'in-progress' | 'achieved' | 'not-achieved'
  notes: string
  owner: string
  dueDate: string
}

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

const BLANK_GOAL = (): Goal => ({
  id: uid(),
  metric: 'Cycle Time (s)',
  customMetric: '',
  baseline: '',
  target: '',
  actual: '',
  status: 'open',
  notes: '',
  owner: '',
  dueDate: '',
})

const STATUS_COL = {
  open: 'var(--text3)',
  'in-progress': '#D4A843',
  achieved: '#1DD1A1',
  'not-achieved': '#FF6B6B',
}

const STATUS_LBL = {
  open: 'Open',
  'in-progress': 'In Progress',
  achieved: 'Achieved',
  'not-achieved': 'Not Achieved',
}

export default function ImprovementTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()

  const initialGoals = data?.goals?.length ? data.goals : [BLANK_GOAL()]

  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [editId, setEditId] = useState<string | null>(initialGoals[0]?.id || null)
  const [saving, setSaving] = useState(false)

  const currentGoal = useMemo(
    () => goals.find(g => g.id === editId) || null,
    [goals, editId]
  )

  function setGoal(id: string, key: keyof Goal, value: any) {
    setGoals(gs => gs.map(g => (g.id === id ? { ...g, [key]: value } : g)))
  }

  function addGoal() {
    const g = BLANK_GOAL()
    setGoals(gs => [...gs, g])
    setEditId(g.id)
  }

  function removeGoal(id: string) {
    const next = goals.filter(g => g.id !== id)
    setGoals(next)
    setEditId(next[0]?.id || null)
  }

  async function handleSave() {
    setSaving(true)
    const payload = { goals, savedAt: Date.now() }

    try {
      await onSave(payload)
      showToast(`${goals.length} improvement goal${goals.length !== 1 ? 's' : ''} saved`, 'success')
      onClose()
    } catch {
      showToast('Save failed, please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const g = currentGoal

  const baselineNum = g?.baseline !== '' ? Number(g.baseline) : null
  const targetNum = g?.target !== '' ? Number(g.target) : null
  const actualNum = g?.actual !== '' ? Number(g.actual) : null

  const hasImprovementCalc =
    baselineNum !== null &&
    !Number.isNaN(baselineNum) &&
    targetNum !== null &&
    !Number.isNaN(targetNum) &&
    baselineNum !== 0

  const targetDelta = hasImprovementCalc ? Math.abs(targetNum - baselineNum) : null
  const targetPct = hasImprovementCalc ? Math.abs(((targetNum - baselineNum) / baselineNum) * 100) : null
  const actualDelta =
    actualNum !== null &&
    !Number.isNaN(actualNum) &&
    baselineNum !== null &&
    !Number.isNaN(baselineNum)
      ? Math.abs(actualNum - baselineNum)
      : null

  return (
    <Modal
      title={`Improvement Tracking, ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : `Save (${goals.length} goal${goals.length !== 1 ? 's' : ''})`}
      disableSave={saving}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Goal tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          {goals.map((goal, i) => {
            const shortMetric = goal.metric
              .replace(' (s)', '')
              .replace(' (%)', '')
              .replace(' ($)', '')
              .slice(0, 14)

            return (
              <button
                key={goal.id}
                onClick={() => setEditId(goal.id)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 10,
                  border: `1px solid ${editId === goal.id ? '#D4A843' : 'var(--border)'}`,
                  background: editId === goal.id ? 'rgba(212,168,67,0.10)' : 'var(--bg)',
                  color: editId === goal.id ? '#D4A843' : 'var(--text2)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: editId === goal.id ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>#{i + 1}</span>
                <span>{shortMetric}</span>
                {goal.actual && <span style={{ color: STATUS_COL[goal.status] }}>●</span>}
              </button>
            )
          })}

          <button
            onClick={addGoal}
            style={{
              padding: '7px 12px',
              borderRadius: 10,
              border: '1px dashed var(--border)',
              background: 'transparent',
              color: 'var(--text3)',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            + Add Goal
          </button>
        </div>

        {g && (
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                {goals.findIndex(x => x.id === g.id) + 1}. Improvement Goal
              </div>

              {goals.length > 1 && (
                <button onClick={() => removeGoal(g.id)} className="btn btn-danger btn-xs">
                  Remove Goal
                </button>
              )}
            </div>

            <div className="vesimy-mobile-grid">
              <div style={{ gridColumn: g.metric === 'Custom' ? 'auto' : '1 / -1' }}>
                <TipLabel termKey="improvement_metric">Metric</TipLabel>
                <select
                  className="input"
                  value={g.metric}
                  onChange={e => setGoal(g.id, 'metric', e.target.value)}
                >
                  {METRICS.map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              {g.metric === 'Custom' && (
                <div>
                  <label className="label">Custom Metric Name</label>
                  <input
                    className="input"
                    placeholder="e.g. Setup Time (min)"
                    value={g.customMetric || ''}
                    onChange={e => setGoal(g.id, 'customMetric', e.target.value)}
                  />
                </div>
              )}

              <div>
                <TipLabel termKey="improvement_baseline">Baseline (Current State)</TipLabel>
                <input
                  className="input"
                  type="number"
                  placeholder="Current value"
                  value={g.baseline}
                  onChange={e => setGoal(g.id, 'baseline', e.target.value)}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label className="label" style={{ margin: 0 }}>Target (Future State)</label>
                  {g.baseline && (
                    <AIAssistButton
                      label="AI suggest"
                      loading={aiLoading}
                      small
                      onClick={() => aiAssist('improvement_target', {
                        metric: g.metric === 'Custom' ? (g.customMetric || 'metric') : g.metric,
                        baseline: g.baseline,
                        stepName,
                        isBottleneck: false,
                      })}
                    />
                  )}
                </div>
                {aiResult && (
                  <AIResultPanel
                    result={aiResult as string} source={aiSource} error={aiError} onClear={aiClear}
                    useLabel="Use target"
                    onUse={(r: any) => {
                      const match = String(r).match(/[0-9]+\.?[0-9]*/)
                      if (match) setGoal(g.id, 'target', match[0])
                      aiClear()
                    }}
                  />
                )}
                <input
                  className="input"
                  type="number"
                  placeholder="Target value"
                  value={g.target}
                  onChange={e => setGoal(g.id, 'target', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Actual Result</label>
                <input
                  className="input"
                  type="number"
                  placeholder="Fill after improvement"
                  value={g.actual}
                  onChange={e => setGoal(g.id, 'actual', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={g.status}
                  onChange={e => setGoal(g.id, 'status', e.target.value as any)}
                >
                  {Object.entries(STATUS_LBL).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {hasImprovementCalc && (
                <div
                  style={{
                    gridColumn: '1/-1',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(29,209,161,0.04)',
                    border: '1px solid rgba(29,209,161,0.2)',
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>
                    Target improvement:{' '}
                    <strong style={{ color: '#1DD1A1' }}>
                      {targetDelta?.toFixed(1)} units ({targetPct?.toFixed(1)}%)
                    </strong>
                    {actualDelta !== null && (
                      <span style={{ marginLeft: 8, color: STATUS_COL[g.status] }}>
                        → Actual: {actualDelta.toFixed(1)} units achieved
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="label">Owner</label>
                <input
                  className="input"
                  placeholder="Responsible person"
                  value={g.owner}
                  onChange={e => setGoal(g.id, 'owner', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Due Date</label>
                <input
                  className="input"
                  type="date"
                  value={g.dueDate}
                  onChange={e => setGoal(g.id, 'dueDate', e.target.value)}
                />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label className="label">Notes</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Describe the improvement approach, obstacles, or context…"
                  value={g.notes}
                  onChange={e => setGoal(g.id, 'notes', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}