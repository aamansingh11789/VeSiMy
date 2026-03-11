// @ts-nocheck
'use client'
// ── components/tools/IshikawaTool.tsx ───────────────────────────────────────

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

const FRAMEWORKS: Record<string, string[]> = {
  '6M Manufacturing': ['Machine', 'Method', 'Material', 'Manpower', 'Measurement', 'Mother Nature'],
  '8P Service': ['People', 'Process', 'Policies', 'Procedures', 'Place', 'Product', 'Price', 'Promotion'],
  '4S Service': ['Surroundings', 'Suppliers', 'Systems', 'Skills'],
  'Custom': ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
}

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function IshikawaTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [problem, setProblem] = useState(data?.problem || '')
  const [framework, setFramework] = useState(data?.framework || '6M Manufacturing')
  const [causes, setCauses] = useState<Record<string, string[]>>(data?.causes || {})
  const [newCause, setNewCause] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const cats = FRAMEWORKS[framework] || FRAMEWORKS['6M Manufacturing']

  const addCause = (cat: string) => {
    const val = (newCause[cat] || '').trim()
    if (!val) return
    setCauses((prev) => ({ ...prev, [cat]: [...(prev[cat] || []), val] }))
    setNewCause((prev) => ({ ...prev, [cat]: '' }))
  }

  const removeCause = (cat: string, i: number) =>
    setCauses((prev) => ({
      ...prev,
      [cat]: (prev[cat] || []).filter((_, j) => j !== i),
    }))

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
      title={`🐟 Fishbone Diagram — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Diagram'}
      width={680}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div>
          <label className="label">Problem / Effect Statement *</label>
          <input
            className="input"
            placeholder="What is the problem being analyzed? e.g. High defect rate at this step"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Framework</label>
          <select className="input" value={framework} onChange={(e) => setFramework(e.target.value)}>
            {Object.keys(FRAMEWORKS).map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {problem && (
        <div
          style={{
            background: 'rgba(212,162,8,0.04)',
            border: '1px solid rgba(212,162,8,0.2)',
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 10,
            fontSize: 12,
            color: 'var(--text2)',
          }}
        >
          🎯 Effect: <strong style={{ color: 'var(--text)' }}>{problem}</strong>
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
        {totalCauses} cause{totalCauses !== 1 ? 's' : ''} added
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
        {cats.map((cat) => (
          <div
            key={cat}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 12,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#D4A208',
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              {cat}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8, minHeight: 32 }}>
              {(causes[cat] || []).map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6,
                    fontSize: 12,
                    color: 'var(--text2)',
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflowWrap: 'anywhere',
                      lineHeight: 1.4,
                    }}
                  >
                    → {c}
                  </span>

                  <button
                    onClick={() => removeCause(cat, i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#7070A0',
                      cursor: 'pointer',
                      fontSize: 14,
                      padding: '4px 6px',
                      minWidth: 28,
                      minHeight: 28,
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {(causes[cat] || []).length === 0 && (
                <span style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>
                  No causes added
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
              <input
                className="input"
                style={{
                  fontSize: 12,
                  padding: '8px 10px',
                  flex: 1,
                  minWidth: 0,
                }}
                placeholder="Add cause…"
                value={newCause[cat] || ''}
                onChange={(e) => setNewCause((prev) => ({ ...prev, [cat]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addCause(cat)}
              />

              <button
                onClick={() => addCause(cat)}
                style={{
                  background: 'rgba(212,162,8,0.15)',
                  border: '1px solid rgba(212,162,8,0.3)',
                  color: '#D4A208',
                  borderRadius: 6,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: 14,
                  minWidth: 40,
                  minHeight: 40,
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}