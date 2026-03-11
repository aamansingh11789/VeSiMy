// @ts-nocheck
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import type { Step } from '@/lib/store'

interface StepModalProps {
  step?: Partial<Step> | null
  onSave: (form: Partial<Step>) => Promise<void>
  onClose: () => void
}

const FLOW_TYPES = [
  { value: 'push', label: 'Push' },
  { value: 'pull', label: 'Pull' },
  { value: 'fifo', label: 'FIFO' },
  { value: 'supermarket', label: 'Supermarket' },
]

export function StepModal({ step, onSave, onClose }: StepModalProps) {
  const isEdit = !!step?.id

  const [form, setForm] = useState({
    name: '',
    description: '',
    department: '',
    operators: '1',
    cycle_time: '',
    wait_time: '',
    setup_time: '',
    trans_time: '',
    defect_rate: '',
    uptime: '',
    completion_accuracy: '',
    wip: '',
    flow_type: 'push',
    notes: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!step) return
    setForm({
      name: step.name || '',
      description: step.description || '',
      department: step.department || '',
      operators:
        step.operators !== undefined && step.operators !== null
          ? String(step.operators)
          : '1',
      cycle_time:
        step.cycle_time !== undefined && step.cycle_time !== null
          ? String(step.cycle_time)
          : '',
      wait_time:
        step.wait_time !== undefined && step.wait_time !== null
          ? String(step.wait_time)
          : '',
      setup_time:
        step.setup_time !== undefined && step.setup_time !== null
          ? String(step.setup_time)
          : '',
      trans_time:
        step.trans_time !== undefined && step.trans_time !== null
          ? String(step.trans_time)
          : '',
      defect_rate:
        step.defect_rate !== undefined && step.defect_rate !== null
          ? String(step.defect_rate)
          : '',
      uptime:
        step.uptime !== undefined && step.uptime !== null
          ? String(step.uptime)
          : '',
      completion_accuracy:
        step.completion_accuracy !== undefined && step.completion_accuracy !== null
          ? String(step.completion_accuracy)
          : '',
      wip:
        step.wip !== undefined && step.wip !== null
          ? String(step.wip)
          : '',
      flow_type: step.flow_type || 'push',
      notes: step.notes || '',
    })
  }, [step])

  const canSave = useMemo(() => form.name.trim().length > 0 && !saving, [form.name, saving])

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  function toNumberOrNull(value: string) {
    if (value === '' || value === null || value === undefined) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Step name is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim() || null,
        department: form.department.trim() || null,
        operators: toNumberOrNull(form.operators) ?? 1,
        cycle_time: toNumberOrNull(form.cycle_time),
        wait_time: toNumberOrNull(form.wait_time) ?? 0,
        setup_time: toNumberOrNull(form.setup_time) ?? 0,
        trans_time: toNumberOrNull(form.trans_time) ?? 0,
        defect_rate: toNumberOrNull(form.defect_rate),
        uptime: toNumberOrNull(form.uptime),
        completion_accuracy: toNumberOrNull(form.completion_accuracy),
        wip: toNumberOrNull(form.wip) ?? 0,
        flow_type: form.flow_type || 'push',
        notes: form.notes.trim() || null,
      })
    } catch (e: any) {
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

        <div>
          <label className="label">Step Name *</label>
          <input
            className="input"
            placeholder="e.g. Final Assembly"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Optional step description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Department</label>
            <input
              className="input"
              placeholder="e.g. Fabrication"
              value={form.department}
              onChange={(e) => updateField('department', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Flow Type</label>
            <select
              className="input"
              value={form.flow_type}
              onChange={(e) => updateField('flow_type', e.target.value)}
            >
              {FLOW_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Operators</label>
            <input
              className="input"
              type="number"
              min="1"
              inputMode="numeric"
              value={form.operators}
              onChange={(e) => updateField('operators', e.target.value)}
            />
          </div>

          <div>
            <label className="label">WIP</label>
            <input
              className="input"
              type="number"
              min="0"
              inputMode="numeric"
              value={form.wip}
              onChange={(e) => updateField('wip', e.target.value)}
            />
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Cycle Time (sec)</label>
            <input
              className="input"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="e.g. 120"
              value={form.cycle_time}
              onChange={(e) => updateField('cycle_time', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Wait Time (sec)</label>
            <input
              className="input"
              type="number"
              min="0"
              inputMode="decimal"
              value={form.wait_time}
              onChange={(e) => updateField('wait_time', e.target.value)}
            />
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Setup Time (sec)</label>
            <input
              className="input"
              type="number"
              min="0"
              inputMode="decimal"
              value={form.setup_time}
              onChange={(e) => updateField('setup_time', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Transport Time (sec)</label>
            <input
              className="input"
              type="number"
              min="0"
              inputMode="decimal"
              value={form.trans_time}
              onChange={(e) => updateField('trans_time', e.target.value)}
            />
          </div>
        </div>

        <div className="vesimy-mobile-grid">
          <div>
            <label className="label">Defect Rate (%)</label>
            <input
              className="input"
              type="number"
              min="0"
              max="100"
              inputMode="decimal"
              value={form.defect_rate}
              onChange={(e) => updateField('defect_rate', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Uptime (%)</label>
            <input
              className="input"
              type="number"
              min="0"
              max="100"
              inputMode="decimal"
              value={form.uptime}
              onChange={(e) => updateField('uptime', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Completion Accuracy (%)</label>
          <input
            className="input"
            type="number"
            min="0"
            max="100"
            inputMode="decimal"
            value={form.completion_accuracy}
            onChange={(e) => updateField('completion_accuracy', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input"
            rows={4}
            placeholder="Special instructions, observations, bottlenecks, safety notes…"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}

export default StepModal