// @ts-nocheck
'use client'
// ── components/tools/WasteTool.tsx ──────────────────────────────────────────

import { useState } from 'react'
import { saveToolData } from '@/lib/db'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

const WASTES = [
  { id: 'D', letter: 'D', name: 'Defects',          color: '#FF6B6B', desc: 'Errors, rework, scrap, warranty claims' },
  { id: 'O', letter: 'O', name: 'Overproduction',   color: '#D4A208', desc: 'Making more than needed, before needed' },
  { id: 'W', letter: 'W', name: 'Waiting',           color: '#F4A623', desc: 'Idle time, people or processes waiting' },
  { id: 'N', letter: 'N', name: 'Non-Utilized Talent', color: '#6CB9FC', desc: 'Skills, knowledge or creativity unused' },
  { id: 'T', letter: 'T', name: 'Transportation',   color: '#8C44CC', desc: 'Unnecessary movement of materials/info' },
  { id: 'I', letter: 'I', name: 'Inventory',         color: '#1DD1A1', desc: 'Excess stock, WIP beyond immediate need' },
  { id: 'M', letter: 'M', name: 'Motion',             color: '#AC3A5A', desc: 'Unnecessary movement of people' },
  { id: 'E', letter: 'E', name: 'Extra-Processing',  color: '#6426A0', desc: 'More work than the customer requires' },
]

interface Props { stepId: string; stepName: string; data?: any; onSave: (data: Record<string, any>) => Promise<void>; onClose: () => void }

export default function WasteTool({ stepId, stepName, data, onClose }: Props) {
  const { setStepToolData, showToast } = useStore()
  const [selected, setSelected] = useState<string[]>(data?.selected || [])
  const [notes,    setNotes]    = useState<Record<string,string>>(data?.notes || {})

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])

  const handleSave = async () => {
    const payload = { selected, notes, savedAt: Date.now() }
    setStepToolData(stepId, 'waste', payload)
    try { await saveToolData(stepId, 'waste', payload); showToast('Waste identified & saved', 'success') }
    catch { showToast('Save failed', 'error') }
    onClose()
  }

  return (
    <Modal title={`♻ DOWNTIME Waste — ${stepName}`} onClose={onClose} onSave={handleSave} saveLabel={`Save (${selected.length} selected)`} width={680}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Summary pill */}
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
          Select all wastes present at this step. Add notes to explain each.
        </div>

        {WASTES.map(w => {
          const isSelected = selected.includes(w.id)
          return (
            <div key={w.id} style={{
              border: `1px solid ${isSelected ? w.color + '55' : 'var(--border)'}`,
              borderRadius: 10, overflow: 'hidden',
              background: isSelected ? `${w.color}0A` : 'var(--bg3)',
              transition: 'all 0.18s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', cursor: 'pointer' }}
                onClick={() => toggle(w.id)}>
                {/* Letter badge */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: isSelected ? w.color : 'var(--bg4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 16,
                  color: isSelected ? '#03030D' : 'var(--text3)',
                  transition: 'all 0.18s',
                }}>
                  {w.letter}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: isSelected ? w.color : 'var(--text)' }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{w.desc}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: 5,
                  border: `2px solid ${isSelected ? w.color : 'var(--border2)'}`,
                  background: isSelected ? w.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#03030D', transition: 'all 0.18s', flexShrink: 0,
                }}>
                  {isSelected ? '✓' : ''}
                </div>
              </div>
              {isSelected && (
                <div style={{ padding: '0 16px 12px' }}>
                  <input className="input" placeholder={`Notes on ${w.name} waste at this step…`}
                    style={{ fontSize: 12, borderColor: `${w.color}44` }}
                    value={notes[w.id] || ''} onChange={e => setNotes(prev => ({ ...prev, [w.id]: e.target.value }))} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
