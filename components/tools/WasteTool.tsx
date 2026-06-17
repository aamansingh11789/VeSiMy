// TypeScript enabled
'use client'
import { CheckIcon } from '@/components/ui/Icons'
import { FieldTip } from '@/components/ui/FieldTip'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'

const WASTES = [
  { id: 'T', label: 'Transport', icon: 'TRP', desc: 'Unnecessary movement of materials or products' , tipKey: 'waste_transport' },
  { id: 'I', label: 'Inventory', icon: 'INV', desc: 'Excess stock, WIP, or finished goods beyond need' , tipKey: 'waste_inventory' },
  { id: 'M', label: 'Motion', icon: 'MOT', desc: 'Unnecessary movement of people or equipment' , tipKey: 'waste_motion' },
  { id: 'W', label: 'Waiting', icon: 'WIT', desc: 'Idle time waiting for materials, information, or approvals' , tipKey: 'waste_waiting' },
  { id: 'O', label: 'Overproduction', icon: 'OVP', desc: 'Producing more than what is needed or before it is needed' , tipKey: 'waste_overproduction' },
  { id: 'O2', label: 'Over-processing', icon: 'OVR', desc: 'More processing than the customer requires' , tipKey: 'waste_overprocessing' },
  { id: 'D', label: 'Defects', icon: 'DEF', desc: 'Errors, rework, scrap, and corrections' , tipKey: 'waste_defects' },
  { id: 'S', label: 'Skills', icon: 'SKL', desc: 'Unused talent, knowledge, and capabilities of people' , tipKey: 'waste_skills' },
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
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()

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
      showToast('Save failed, please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={`Waste Identification, ${stepName}`}
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
            background: 'rgba(201,79,79,0.05)',
            border: '1px solid rgba(201,79,79,0.15)',
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
                    background: active ? 'rgba(201,79,79,0.07)' : 'var(--bg)',
                    border: `1px solid ${active ? 'rgba(201,79,79,0.35)' : 'var(--vs-slate-200, #DDE3EA)'}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    textAlign: 'left',
                    minHeight: 84,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: active ? '#C94F4F' : 'var(--text)' }}>
                        {w.label}
                      </span>
                      <FieldTip termKey={w.tipKey} />

                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text3)',
                          background: 'var(--vs-white, #FFFFFF)',
                          padding: '1px 5px',
                          borderRadius: 4,
                        }}
                      >
                        {w.id}
                      </span>

                      {active && (
                        <span style={{ marginLeft: 'auto', fontSize: 14, color: '#C94F4F' }}>✓</span>
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
              background: 'rgba(201,79,79,0.05)',
              border: '1px solid rgba(201,79,79,0.18)',
              borderRadius: 12,
            }}
          >
            <span style={{ fontSize: 12, color: '#C94F4F', fontWeight: 600, lineHeight: 1.6 }}>
              {selected.length} waste{selected.length !== 1 ? 's' : ''} identified: {selectedLabels.join(', ')}
          {selected.length >= 2 && (
            <span style={{ marginLeft: 8 }}>
              <AIAssistButton
                label="Prioritise"
                loading={aiLoading}
                small
                onClick={() => aiAssist('waste_prioritise', { selected, notes, stepName })}
              />
            </span>
          )}
            </span>
          </div>
        )}
      </div>
      <AIResultPanel result={aiResult as string} source={aiSource} error={aiError} onClear={aiClear} />
    </Modal>
  )
}