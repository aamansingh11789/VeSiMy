// @ts-nocheck
'use client'
// ── components/tools/BranchModal.tsx ─────────────────────────────────────────
// Create / edit a VSM branch lane

import { useState } from 'react'
import type { Branch, Step } from '@/lib/store'

const COLORS = [
  { label: 'Violet',    value: '#6426A0' },
  { label: 'Steel Blue',value: '#1090D4' },
  { label: 'Teal',      value: '#1DD1A1' },
  { label: 'Amber',     value: '#F4A623' },
  { label: 'Pink',      value: '#E84393' },
  { label: 'Cyan',      value: '#00BCD4' },
]

interface Props {
  mainSteps:  Step[]
  branch?:    Branch | null
  onSave:     (data: Partial<Branch>) => Promise<void>
  onClose:    () => void
}

export function BranchModal({ mainSteps, branch, onSave, onClose }: Props) {
  const [label,        setLabel]        = useState(branch?.label          || '')
  const [color,        setColor]        = useState(branch?.color          || '#6426A0')
  const [parentStepId, setParentStepId] = useState(branch?.parent_step_id || '')
  const [mergeStepId,  setMergeStepId]  = useState(branch?.merge_step_id  || '')
  const [saving,       setSaving]       = useState(false)

  const handleSave = async () => {
    if (!label.trim())    return alert('Branch name is required')
    if (!parentStepId)    return alert('Select which main-flow step this branch starts from')
    setSaving(true)
    await onSave({
      label,
      color,
      parent_step_id: parentStepId || null,
      merge_step_id:  mergeStepId  || null,
    })
    setSaving(false)
  }

  const xBtn: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#7070A0', fontSize: 16, padding: '4px 6px',
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">
            {branch ? '✎ Edit Branch' : '⊕ New Process Branch'}
          </span>
          <button onClick={onClose} style={xBtn}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Explainer */}
          <div style={{
            background: 'rgba(100,38,160,0.08)', border: '1px solid rgba(100,38,160,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#7070A0', lineHeight: 1.6,
          }}>
            📌 A branch is a parallel process that runs alongside your main flow — for example, a
            sub-assembly line, a quality inspection loop, or a support process.
            It appears as a separate lane below the main VSM flow.
          </div>

          {/* Branch name */}
          <div>
            <label className="label">Branch Name *</label>
            <input className="input" placeholder="e.g. Sub-Assembly A, Paint Line, QC Loop"
              value={label} onChange={e => setLabel(e.target.value)} autoFocus />
          </div>

          {/* Color */}
          <div>
            <label className="label">Lane Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c.value} onClick={() => setColor(c.value)}
                  style={{
                    width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: c.value,
                    outline: color === c.value ? `3px solid white` : 'none',
                    outlineOffset: 2,
                    opacity: color === c.value ? 1 : 0.6,
                    transition: 'all 0.15s',
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Parent step — where branch splits from main flow */}
          <div>
            <label className="label">Branches off of (main flow step) *</label>
            <select className="input" value={parentStepId} onChange={e => setParentStepId(e.target.value)}>
              <option value="">— Select main flow step —</option>
              {mainSteps.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div style={{ fontSize: 11, color: '#38385C', marginTop: 4 }}>
              This is where the branch visually splits from the main flow.
            </div>
          </div>

          {/* Merge step — where branch rejoins main flow (optional) */}
          <div>
            <label className="label">Merges back into (optional)</label>
            <select className="input" value={mergeStepId} onChange={e => setMergeStepId(e.target.value)}>
              <option value="">— None (branch ends independently) —</option>
              {mainSteps.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div style={{ fontSize: 11, color: '#38385C', marginTop: 4 }}>
              If this branch feeds back into the main flow (e.g. sub-assembly feeds into Final Assembly),
              select that step here. A merge line will be drawn.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
            {saving ? 'Saving…' : (branch ? 'Save Changes' : 'Create Branch')}
          </button>
        </div>
      </div>
    </div>
  )
}
