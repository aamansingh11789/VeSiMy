// @ts-nocheck
'use client'
// ── components/tools/StepModal.tsx ─────────────────────────────────────────
// Add/Edit VSM process step — scrollable, full-featured, no access blocking

import { useState } from 'react'
import type { Step } from '@/lib/store'

interface Props {
  step?: Step | null
  onSave: (form: Partial<Step>) => Promise<void>
  onClose: () => void
}

const FLOW_TYPES = [
  { value: 'push',         label: '→ Push'        },
  { value: 'pull',         label: '← Pull'        },
  { value: 'fifo',         label: '⊳ FIFO'        },
  { value: 'batch',        label: '⊞ Batch'       },
  { value: 'supermarket',  label: '◼ Supermarket' },
]

export function StepModal({ step, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name:                step?.name                ?? '',
    department:          step?.department          ?? '',
    operators:           step?.operators           ?? 1,
    setup_time:          (step as any)?.setup_time ?? '',
    uptime:              step?.uptime              ?? '',
    defect_rate:         step?.defect_rate         ?? '',
    completion_accuracy: step?.completion_accuracy ?? '',
    wait_time:           step?.wait_time           ?? '',
    trans_time:          step?.trans_time          ?? '',
    wip:                 step?.wip                 ?? '',
    flow_type:           step?.flow_type           ?? 'push',
    sm_min:              step?.sm_min              ?? '',
    sm_max:              step?.sm_max              ?? '',
    notes:               step?.notes               ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setError('')
    if (!form.name.trim()) { setError('Step name is required'); return }
    setSaving(true)
    try {
      await onSave(form as any)
      // onSave is responsible for closing the modal on success
    } catch (e: any) {
      setError(e?.message || 'Failed to save step. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const isSupermarket = form.flow_type === 'supermarket'

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ alignItems: 'center' }}
    >
      <div
        className="modal"
        style={{ maxWidth: 600, maxHeight: 'calc(100vh - 40px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">
            {step ? '✎ Edit Process Step' : '＋ Add Process Step'}
          </span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:20, lineHeight:1, padding:'2px 6px', borderRadius:4 }}>✕</button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>

          {/* Error banner */}
          {error && (
            <div style={{ background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#FF6B6B' }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

            {/* Step Name — full width */}
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Step Name *</label>
              <input
                className="input"
                placeholder="e.g. Weld Sub-Assembly"
                autoFocus
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
            </div>

            {/* Department */}
            <div>
              <label className="label">Department</label>
              <input className="input" placeholder="e.g. Production"
                value={form.department} onChange={e => set('department', e.target.value)} />
            </div>

            {/* Operators */}
            <div>
              <label className="label">Operators</label>
              <input className="input" type="number" min={0} placeholder="1"
                value={form.operators} onChange={e => set('operators', e.target.value)} />
            </div>

            {/* Setup Time */}
            <div>
              <label className="label">Setup Time (sec) <span style={{ color:'var(--gold)', fontSize:9, letterSpacing:1 }}>SMED</span></label>
              <input className="input" type="number" min={0} placeholder="e.g. 300"
                value={form.setup_time} onChange={e => set('setup_time', e.target.value)} />
            </div>

            {/* Uptime */}
            <div>
              <label className="label">Uptime (%)</label>
              <input className="input" type="number" min={0} max={100} placeholder="e.g. 95"
                value={form.uptime} onChange={e => set('uptime', e.target.value)} />
            </div>

            {/* Defect Rate */}
            <div>
              <label className="label">Defect Rate (%)</label>
              <input className="input" type="number" min={0} max={100} step={0.1} placeholder="e.g. 1.5"
                value={form.defect_rate} onChange={e => set('defect_rate', e.target.value)} />
            </div>

            {/* Completion Accuracy */}
            <div>
              <label className="label">Completion Accuracy (%)</label>
              <input className="input" type="number" min={0} max={100} placeholder="e.g. 98"
                value={form.completion_accuracy} onChange={e => set('completion_accuracy', e.target.value)} />
            </div>

            {/* Wait Time */}
            <div>
              <label className="label">Wait / Queue Time (sec)</label>
              <input className="input" type="number" min={0} placeholder="e.g. 120"
                value={form.wait_time} onChange={e => set('wait_time', e.target.value)} />
            </div>

            {/* Transfer Time */}
            <div>
              <label className="label">Transfer / Move Time (sec)</label>
              <input className="input" type="number" min={0} placeholder="e.g. 60"
                value={form.trans_time} onChange={e => set('trans_time', e.target.value)} />
            </div>

            {/* WIP */}
            <div>
              <label className="label">WIP (units in queue)</label>
              <input className="input" type="number" min={0} placeholder="e.g. 5"
                value={form.wip} onChange={e => set('wip', e.target.value)} />
            </div>

            {/* Flow Type */}
            <div>
              <label className="label">Flow Type</label>
              <select className="input" value={form.flow_type} onChange={e => set('flow_type', e.target.value)}>
                {FLOW_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            {/* Supermarket fields — shown only when flow_type = supermarket */}
            {isSupermarket && (
              <>
                <div>
                  <label className="label">Supermarket Min</label>
                  <input className="input" type="number" min={0} placeholder="Min inventory"
                    value={form.sm_min} onChange={e => set('sm_min', e.target.value)} />
                </div>
                <div>
                  <label className="label">Supermarket Max</label>
                  <input className="input" type="number" min={0} placeholder="Max inventory"
                    value={form.sm_max} onChange={e => set('sm_max', e.target.value)} />
                </div>
              </>
            )}

            {/* Notes — full width */}
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Notes / Observations</label>
              <textarea className="input" rows={3}
                placeholder="Any additional notes, observations, or improvement ideas..."
                style={{ resize:'vertical' }}
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="btn btn-primary"
            style={{ minWidth: 120 }}
          >
            {saving ? '⟳ Saving…' : step ? '✓ Save Changes' : '＋ Add Step'}
          </button>
        </div>

      </div>
    </div>
  )
}
