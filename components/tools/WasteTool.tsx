// @ts-nocheck
'use client'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'

const WASTES = [
  { id: 'T', label: 'Transport', icon: '🚛', desc: 'Unnecessary movement of materials or products' },
  { id: 'I', label: 'Inventory', icon: '📦', desc: 'Excess stock, WIP, or finished goods beyond need' },
  { id: 'M', label: 'Motion', icon: '🏃', desc: 'Unnecessary movement of people or equipment' },
  { id: 'W', label: 'Waiting', icon: '⏳', desc: 'Idle time waiting for materials, information, or approvals' },
  { id: 'O', label: 'Overproduction', icon: '⚙️', desc: 'Producing more than what is needed or before it is needed' },
  { id: 'O2', label: 'Over-processing', icon: '🔧', desc: 'More processing than the customer requires' },
  { id: 'D', label: 'Defects', icon: '❌', desc: 'Errors, rework, scrap, and corrections' },
  { id: 'S', label: 'Skills', icon: '🧠', desc: 'Unused talent, knowledge, and capabilities of people' },
]

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function WasteTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [selected, setSelected] = useState<string[]>(data?.selected || [])
  const [notes, setNotes] = useState<Record<string, string>>(data?.notes || {})
  const [saving, setSaving] = useState(false)

  const selectedLabels = useMemo(
    () => selected.map(id => WASTES.find(w => w.id === id)?.label).filter(Boolean),
    [selected]
  )

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      selected,
      notes,
      savedAt: Date.now(),
    }

    try {
      await onSave(payload)
      showToast(`${selected.length} waste${selected.length !== 1 ? 's' : ''} identified & saved`, 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={`⚠️ Waste Identification — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : `Save (${selected.length} selected)`}
      disableSave={saving}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            fontSize: 13,
            color: 'var(--text2)',
            lineHeight: 1.65,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(255,107,107,0.05)',
            border: '1px solid rgba(255,107,107,0.15)',
          }}
        >
          Select all wastes present at this step. This feeds your kaizen prioritization and reporting.
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: 10,
          }}
        >
          {WASTES.map(w => {
            const active = selected.includes(w.id)

            return (
              <div key={w.id}>
                <button
                  type="button"
                  onClick={() => toggle(w.id)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: active ? 'rgba(255,107,107,0.07)' : 'var(--bg)',
                    border: `1px solid ${active ? 'rgba(255,107,107,0.35)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    textAlign: 'left',
                    minHeight: 84,
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{w.icon}</span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: active ? '#FF6B6B' : 'var(--text)' }}>
                        {w.label}
                      </span>

                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: 'monospace',
                          color: 'var(--text3)',
                          background: 'var(--bg2)',
                          padding: '1px 5px',
                          borderRadius: 4,
                        }}
                      >
                        {w.id}
                      </span>

                      {active && (
                        <span style={{ marginLeft: 'auto', fontSize: 14, color: '#FF6B6B' }}>✓</span>
                      )}
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, lineHeight: 1.5 }}>
                      {w.desc}
                    </div>
                  </div>
                </button>

                {active && (
                  <div style={{ paddingTop: 6 }}>
                    <textarea
                      className="input"
                      rows={2}
                      placeholder={`Note about ${w.label} waste at this step (optional)`}
                      value={notes[w.id] || ''}
                      onChange={e => setNotes(prev => ({ ...prev, [w.id]: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selected.length > 0 && (
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(255,107,107,0.05)',
              border: '1px solid rgba(255,107,107,0.18)',
              borderRadius: 12,
            }}
          >
            <span style={{ fontSize: 12, color: '#FF6B6B', fontWeight: 600, lineHeight: 1.6 }}>
              {selected.length} waste{selected.length !== 1 ? 's' : ''} identified: {selectedLabels.join(', ')}
            </span>
          </div>
        )}
      </div>
    </Modal>
  )
}