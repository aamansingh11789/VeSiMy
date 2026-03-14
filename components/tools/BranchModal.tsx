// @ts-nocheck
'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import type { Branch, Step } from '@/lib/store'

const COLORS = [
  { label: 'Violet', value: '#6426A0' },
  { label: 'Steel Blue', value: '#1090D4' },
  { label: 'Teal', value: '#1DD1A1' },
  { label: 'Amber', value: '#F4A623' },
  { label: 'Pink', value: '#E84393' },
  { label: 'Cyan', value: '#00BCD4' },
]

interface Props {
  mainSteps: Step[]
  branch?: Branch | null
  onSave: (data: Partial<Branch>) => Promise<void>
  onClose: () => void
}

export function BranchModal({ mainSteps, branch, onSave, onClose }: Props) {
  const isEdit = !!branch

  const [label, setLabel] = useState(branch?.label || '')
  const [color, setColor] = useState(branch?.color || '#6426A0')
  const [parentStepId, setParentStepId] = useState(branch?.parent_step_id || '')
  const [mergeStepId, setMergeStepId] = useState(branch?.merge_step_id || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!label.trim()) {
      setError('Branch name is required.')
      return
    }

    if (!parentStepId) {
      setError('Select which step this branch starts from.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onSave({
        label: label.trim(),
        color,
        parent_step_id: parentStepId,
        merge_step_id: mergeStepId || null,
      })
    } catch (e: any) {
      setError(e?.message || 'Failed to save branch.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={isEdit ? `Edit Branch — ${branch?.label}` : 'Create Process Branch'}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Branch'}
      disableSave={saving}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {error && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(255,107,107,0.08)',
              border: '1px solid rgba(255,107,107,0.20)',
              color: '#FF6B6B',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Explainer */}
        <div
          style={{
            background: 'rgba(100,38,160,0.08)',
            border: '1px solid rgba(100,38,160,0.22)',
            borderRadius: 12,
            padding: '12px 14px',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text2)',
          }}
        >
          A branch represents a **parallel process lane** running alongside your
          main value stream — such as a sub-assembly line, inspection loop,
          or support process.
        </div>

        {/* Branch Name */}
        <div>
          <label className="label">Branch Name *</label>
          <input
            className="input"
            placeholder="Example: Sub-Assembly A"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="label">Lane Color</label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 10,
            }}
          >
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                style={{
                  height: 40,
                  borderRadius: 10,
                  border: 'none',
                  background: c.value,
                  cursor: 'pointer',
                  outline:
                    color === c.value
                      ? '3px solid white'
                      : '1px solid rgba(255,255,255,0.08)',
                  outlineOffset: 2,
                }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Parent Step */}
        <div>
          <label className="label">Branches Off Step *</label>

          <select
            className="input"
            value={parentStepId}
            onChange={(e) => setParentStepId(e.target.value)}
          >
            <option value="">Select step</option>
            {mainSteps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div
            style={{
              fontSize: 11,
              color: 'var(--text3)',
              marginTop: 4,
            }}
          >
            This is where the branch splits from the main process.
          </div>
        </div>

        {/* Merge Step */}
        <div>
          <label className="label">Merge Back Into (optional)</label>

          <select
            className="input"
            value={mergeStepId}
            onChange={(e) => setMergeStepId(e.target.value)}
          >
            <option value="">Branch ends independently</option>
            {mainSteps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div
            style={{
              fontSize: 11,
              color: 'var(--text3)',
              marginTop: 4,
            }}
          >
            If this branch feeds back into the main flow, select that step.
          </div>
        </div>

      </div>
    </Modal>
  )
}

export default BranchModal