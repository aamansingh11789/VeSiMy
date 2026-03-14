// @ts-nocheck
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'

const FLOW_TYPES = [
  { value: 'push',         label: 'Push →' },
  { value: 'pull',         label: 'Pull ←' },
  { value: 'fifo',         label: 'FIFO Lane' },
  { value: 'supermarket',  label: 'Supermarket ▦' },
  { value: 'queue',        label: '⏳ Queue (wait step)' },
]

const VA_TYPES = [
  { value: 'va',   label: 'Value Add (VA)',                color: '#1DD1A1', bg: 'rgba(29,209,161,0.08)',  hint: 'Transforms the product — customer pays for this' },
  { value: 'nnva', label: 'Necessary Non-Value Add (NNVA)', color: '#D4A208', bg: 'rgba(212,162,8,0.08)',   hint: 'Required but adds no value — inspect, transport, setup' },
  { value: 'nva',  label: 'Non-Value Add (NVA)',            color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', hint: 'Pure waste — target for elimination' },
]

function uid() { return Math.random().toString(36).slice(2, 9) }

interface StepModalProps {
  step?: any
  onSave: (data: any) => Promise<void>
  onClose: () => void
}

export function StepModal({ step, onSave, onClose }: StepModalProps) {
  const isEdit = !!step?.id

  const [form, setForm] = useState({
    name: '', description: '', department: '',
    operators: '1', cycle_time: '', wait_time: '',
    setup_time: '', trans_time: '', defect_rate: '',
    uptime: '', completion_accuracy: '',
    wip: '', flow_type: 'push', notes: '',
    va_type: 'va',
  })

  // Operator sub-steps for Standard Work / Yamazumi
  const [opSteps, setOpSteps] = useState([])
  const [newStep, setNewStep] = useState({ name: '', time: '', va_type: 'va' })
  const [showOpSteps, setShowOpSteps] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  useEffect(() => {
    if (!step) return
    setForm({
      name:                 step.name || '',
      description:          step.description || '',
      department:           step.department || '',
      operators:            step.operators !== undefined && step.operators !== null ? String(step.operators) : '1',
      cycle_time:           step.cycle_time !== undefined && step.cycle_time !== null ? String(step.cycle_time) : '',
      wait_time:            step.wait_time !== undefined && step.wait_time !== null ? String(step.wait_time) : '',
      setup_time:           step.setup_time !== undefined && step.setup_time !== null ? String(step.setup_time) : '',
      trans_time:           step.trans_time !== undefined && step.trans_time !== null ? String(step.trans_time) : '',
      defect_rate:          step.defect_rate !== undefined && step.defect_rate !== null ? String(step.defect_rate) : '',
      uptime:               step.uptime !== undefined && step.uptime !== null ? String(step.uptime) : '',
      completion_accuracy:  step.completion_accuracy !== undefined && step.completion_accuracy !== null ? String(step.completion_accuracy) : '',
      wip:                  step.wip !== undefined && step.wip !== null ? String(step.wip) : '',
      flow_type:            step.flow_type || 'push',
      notes:                step.notes || '',
      va_type:              step.va_type || 'va',
    })
    setOpSteps(step.op_steps || [])
  }, [step])

  const canSave = useMemo(() => form.name.trim().length > 0 && !saving, [form.name, saving])

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  function toN(value) {
    if (value === '' || value === null || value === undefined) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  function addOpStep() {
    if (!newStep.name.trim() || !newStep.time) return
    setOpSteps(prev => [...prev, { id: uid(), name: newStep.name.trim(), time: Number(newStep.time), va_type: newStep.va_type }])
    setNewStep({ name: '', time: '', va_type: 'va' })
  }

  function removeOpStep(id) {
    setOpSteps(prev => prev.filter(s => s.id !== id))
  }

  const opTotalTime = opSteps.reduce((a, s) => a + s.time, 0)
  const vaTime   = opSteps.filter(s => s.va_type === 'va').reduce((a, s) => a + s.time, 0)
  const nnvaTime = opSteps.filter(s => s.va_type === 'nnva').reduce((a, s) => a + s.time, 0)
  const nvaTime  = opSteps.filter(s => s.va_type === 'nva').reduce((a, s) => a + s.time, 0)

  const vaColor   = VA_TYPES.find(v => v.value === form.va_type)?.color || 'var(--text3)'
  const vaBg      = VA_TYPES.find(v => v.value === form.va_type)?.bg    || 'transparent'

  async function handleSave() {
    if (!form.name.trim()) { setError('Step name is required.'); return }
    setSaving(true); setError('')
    try {
      await onSave({
        name:                 form.name.trim(),
        description:          form.description.trim() || null,
        department:           form.department.trim() || null,
        operators:            toN(form.operators) ?? 1,
        cycle_time:           toN(form.cycle_time),
        wait_time:            toN(form.wait_time) ?? 0,
        setup_time:           toN(form.setup_time) ?? 0,
        trans_time:           toN(form.trans_time) ?? 0,
        defect_rate:          toN(form.defect_rate),
        uptime:               toN(form.uptime),
        completion_accuracy:  toN(form.completion_accuracy),
        wip:                  toN(form.wip) ?? 0,
        flow_type:            form.flow_type || 'push',
        notes:                form.notes.trim() || null,
        va_type:              form.va_type,
        op_steps:             opSteps,
      })
    } catch (e) {
      setError(e?.message || 'Failed to save step.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={isEdit ? `Edit Step — ${step?.name || ''}` : 'Add New Step'}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : isEdit ? 'Save Step' : 'Add Step'}
      disableSave={!canSave}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && (
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.20)', color: '#FF6B6B', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* ── VA Classification ── */}
        <div>
          <label className="label">Step Classification</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {VA_TYPES.map(vt => (
              <button
                key={vt.value}
                type="button"
                onClick={() => updateField('va_type', vt.value)}
                style={{
                  flex: 1, minWidth: 80, padding: '8px 6px', borderRadius: 8, cursor: 'pointer',
                  background: form.va_type === vt.value ? vt.bg : 'var(--bg)',
                  border: `1.5px solid ${form.va_type === vt.value ? vt.color : 'var(--border)'}`,
                  color: form.va_type === vt.value ? vt.color : 'var(--text2)',
                  fontSize: 10, fontWeight: 700, transition: 'all 0.15s',
                }}
              >
                {vt.label}
              </button>
            ))}
          </div>
          {form.va_type && (
            <div style={{ fontSize: 11, color: vaColor, marginTop: 5, fontStyle: 'italic' }}>
              {VA_TYPES.find(v => v.value === form.va_type)?.hint}
            </div>
          )}
        </div>

        <div>
          <label className="label">Step Name *</label>
          <input className="input" placeholder="e.g. Final Assembly" value={form.name} onChange={(e) => updateField('name', e.target.value)} autoFocus />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={2} placeholder="Optional step description" value={form.description} onChange={(e) => updateField('description', e.target.value)} style={{ minHeight: 60 }} />
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Department</label>
            <input className="input" placeholder="e.g. Fabrication" value={form.department} onChange={(e) => updateField('department', e.target.value)} />
          </div>
          <div>
            <label className="label">Flow Type</label>
            <select className="input" value={form.flow_type} onChange={(e) => updateField('flow_type', e.target.value)}>
              {FLOW_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Operators</label>
            <input className="input" type="number" min="1" inputMode="numeric" value={form.operators} onChange={(e) => updateField('operators', e.target.value)} />
          </div>
          <div>
            <label className="label">WIP</label>
            <input className="input" type="number" min="0" inputMode="numeric" value={form.wip} onChange={(e) => updateField('wip', e.target.value)} />
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Cycle Time (sec)</label>
            <input className="input" type="number" min="0" inputMode="decimal" placeholder="e.g. 120" value={form.cycle_time} onChange={(e) => updateField('cycle_time', e.target.value)} />
          </div>
          <div>
            <label className="label">Wait Time (sec)</label>
            <input className="input" type="number" min="0" inputMode="decimal" value={form.wait_time} onChange={(e) => updateField('wait_time', e.target.value)} />
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Setup Time (sec)</label>
            <input className="input" type="number" min="0" inputMode="decimal" value={form.setup_time} onChange={(e) => updateField('setup_time', e.target.value)} />
          </div>
          <div>
            <label className="label">Transport Time (sec)</label>
            <input className="input" type="number" min="0" inputMode="decimal" value={form.trans_time} onChange={(e) => updateField('trans_time', e.target.value)} />
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Defect Rate (%)</label>
            <input className="input" type="number" min="0" max="100" inputMode="decimal" value={form.defect_rate} onChange={(e) => updateField('defect_rate', e.target.value)} />
          </div>
          <div>
            <label className="label">Uptime (%)</label>
            <input className="input" type="number" min="0" max="100" inputMode="decimal" value={form.uptime} onChange={(e) => updateField('uptime', e.target.value)} />
          </div>
        </div>

        {/* ── Operator Steps (for Standard Work & Yamazumi) ── */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setShowOpSteps(v => !v)}
            style={{ width: '100%', padding: '10px 14px', background: 'rgba(212,162,8,0.06)', border: 'none', color: '#D4A208', fontWeight: 700, fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>📋 Operator Steps — Standard Work & Yamazumi ({opSteps.length} steps)</span>
            <span>{showOpSteps ? '▲' : '▼'}</span>
          </button>
          {showOpSteps && (
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                Break this step into individual operator tasks. Each task is classified as VA, NNVA, or NVA — this feeds the Yamazumi chart and Standard Work Sheet.
              </div>

              {/* VA summary bar */}
              {opSteps.length > 0 && (
                <div>
                  <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1, marginBottom: 4 }}>
                    {opTotalTime > 0 && <div style={{ width: `${(vaTime/opTotalTime)*100}%`, background: '#1DD1A1' }} />}
                    {opTotalTime > 0 && <div style={{ width: `${(nnvaTime/opTotalTime)*100}%`, background: '#D4A208' }} />}
                    {opTotalTime > 0 && <div style={{ width: `${(nvaTime/opTotalTime)*100}%`, background: '#FF6B6B' }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text3)' }}>
                    <span style={{ color: '#1DD1A1' }}>VA: {vaTime}s ({Math.round(vaTime/opTotalTime*100)}%)</span>
                    <span style={{ color: '#D4A208' }}>NNVA: {nnvaTime}s</span>
                    <span style={{ color: '#FF6B6B' }}>NVA: {nvaTime}s ({Math.round(nvaTime/opTotalTime*100)}%)</span>
                  </div>
                </div>
              )}

              {opSteps.map((s, i) => {
                const vc = VA_TYPES.find(v => v.value === s.va_type)?.color || 'var(--text3)'
                return (
                  <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace', minWidth: 20 }}>{i+1}</span>
                    <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: `${vc}22`, color: vc, fontWeight: 700, fontSize: 9, minWidth: 36, textAlign: 'center' }}>{s.va_type.toUpperCase()}</span>
                    <span style={{ flex: 1, fontSize: 12, color: 'var(--text2)' }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>{s.time}s</span>
                    <button type="button" onClick={() => removeOpStep(s.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}>×</button>
                  </div>
                )
              })}

              {/* Add step row */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={newStep.va_type}
                  onChange={e => setNewStep(p => ({ ...p, va_type: e.target.value }))}
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, padding: '6px 4px' }}
                >
                  <option value="va">VA</option>
                  <option value="nnva">NNVA</option>
                  <option value="nva">NVA</option>
                </select>
                <input
                  className="input"
                  style={{ flex: 3, minWidth: 100, fontSize: 12 }}
                  placeholder="Task name…"
                  value={newStep.name}
                  onChange={e => setNewStep(p => ({ ...p, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addOpStep()}
                />
                <input
                  className="input"
                  type="number"
                  style={{ flex: 1, minWidth: 60, fontSize: 12 }}
                  placeholder="sec"
                  value={newStep.time}
                  onChange={e => setNewStep(p => ({ ...p, time: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addOpStep()}
                />
                <button type="button" onClick={addOpStep} style={{ background: 'rgba(212,162,8,0.15)', border: '1px solid rgba(212,162,8,0.3)', color: '#D4A208', borderRadius: 8, cursor: 'pointer', fontSize: 16, minWidth: 36, minHeight: 36 }}>+</button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={3} placeholder="Special instructions, observations, bottlenecks, safety notes…" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} style={{ minHeight: 72 }} />
        </div>
      </div>
    </Modal>
  )
}
