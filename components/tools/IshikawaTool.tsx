// TypeScript enabled
'use client'
import { FieldTip, TipLabel } from '@/components/ui/FieldTip'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'

const FRAMEWORKS: Record<string, string[]> = {
  '6M Manufacturing': ['Machine', 'Method', 'Material', 'Manpower', 'Measurement', 'Mother Nature'],
  '8P Service': ['People', 'Process', 'Policies', 'Procedures', 'Place', 'Product', 'Price', 'Promotion'],
  '4S Service': ['Surroundings', 'Suppliers', 'Systems', 'Skills'],
  Custom: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
}

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function IshikawaTool({ stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()
  const [problem, setProblem] = useState(data?.problem || '')
  const [framework, setFramework] = useState(data?.framework || '6M Manufacturing')
  const [causes, setCauses] = useState<Record<string, string[]>>(data?.causes || {})
  const [newCause, setNewCause] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const categories = FRAMEWORKS[framework] || FRAMEWORKS['6M Manufacturing']

  const addCause = (cat: string) => {
    const value = (newCause[cat] || '').trim()
    if (!value) return
    setCauses((prev) => ({ ...prev, [cat]: [...(prev[cat] || []), value] }))
    setNewCause((prev) => ({ ...prev, [cat]: '' }))
  }

  const removeCause = (cat: string, index: number) => {
    setCauses((prev) => ({ ...prev, [cat]: (prev[cat] || []).filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { problem, framework, causes, savedAt: Date.now() }
    try {
      await onSave(payload)
      showToast('Fishbone diagram saved', 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const totalCauses = Object.values(causes).flat().length

  return (
    <Modal
      title={`Fishbone Diagram — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Diagram'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <TipLabel termKey="fishbone_effect" style={{ margin: 0 }}>Problem / Effect Statement *</TipLabel>
        </div>
        <input
          className="input"
          placeholder="What is the problem being analyzed?"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <div>
          <TipLabel termKey="fishbone_6m">Framework</TipLabel>
          <select className="input" value={framework} onChange={(e) => setFramework(e.target.value)}>
            {Object.keys(FRAMEWORKS).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {problem && (
          <div
            style={{
              background: 'rgba(1,118,211,0.04)',
              border: '1px solid rgba(1,118,211,0.2)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 12,
              color: 'var(--text2)',
            }}
          >
            Effect: <strong style={{ color: 'var(--text)' }}>{problem}</strong>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
            {totalCauses} cause{totalCauses !== 1 ? 's' : ''} added
          </span>
          {problem && (
            <AIAssistButton
              label="Generate causes with AI"
              loading={aiLoading}
              small
              onClick={() => aiAssist('fishbone_causes', { problem, framework, stepName })}
            />
          )}
        </div>
        {aiResult && typeof aiResult === 'object' && (
          <AIResultPanel
            result={`AI suggested causes — click "Apply all" to add them to the diagram, or add individually below.`}
            source={aiSource} error={aiError} onClear={aiClear}
            useLabel="Apply all causes"
            onUse={(r) => {
              if (r && typeof r === 'object') {
                const updated = { ...causes }
                Object.entries(r as Record<string, string[]>).forEach(([cat, cs]) => {
                  if (categories.includes(cat)) {
                    updated[cat] = [...(updated[cat] || []), ...(cs as string[])]
                  }
                })
                setCauses(updated)
              }
              aiClear()
            }}
          />
        )}

        <div style={{ display: 'grid', gap: 8 }}>
          {categories.map((cat) => (
            <details key={cat} open style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 10 }}>
              <summary style={{ cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#D4A843', marginBottom: 8 }}>
                {cat}
              </summary>
              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {(causes[cat] || []).map((cause, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 30px', gap: 8, alignItems: 'start', padding: '8px 10px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)', overflowWrap: 'anywhere', lineHeight: 1.4 }}>{cause}</span>
                    <button onClick={() => removeCause(cat, index)} type="button" style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, minWidth: 30, minHeight: 30, lineHeight: 1 }}>×</button>
                  </div>
                ))}
                {(causes[cat] || []).length === 0 && (
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>No causes added</span>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px', gap: 8, marginBottom: 4 }}>
                  <input className="input" style={{ fontSize: 12, minWidth: 0 }} placeholder="Add cause…" value={newCause[cat] || ''} onChange={(e) => setNewCause((prev) => ({ ...prev, [cat]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addCause(cat)} />
                  <button onClick={() => addCause(cat)} type="button" style={{ background: 'rgba(1,118,211,0.15)', border: '1px solid rgba(212,168,67,0.3)', color: '#D4A843', borderRadius: 8, cursor: 'pointer', fontSize: 18, minWidth: 40, minHeight: 40 }}>+</button>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Modal>
  )
}
