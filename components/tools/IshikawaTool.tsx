// @ts-nocheck
'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

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
  const [problem, setProblem] = useState(data?.problem || '')
  const [framework, setFramework] = useState(data?.framework || '6M Manufacturing')
  const [causes, setCauses] = useState<Record<string, string[]>>(data?.causes || {})
  const [newCause, setNewCause] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const categories = FRAMEWORKS[framework] || FRAMEWORKS['6M Manufacturing']

  const addCause = (cat: string) => {
    const value = (newCause[cat] || '').trim()
    if (!value) return

    setCauses((prev) => ({
      ...prev,
      [cat]: [...(prev[cat] || []), value],
    }))

    setNewCause((prev) => ({ ...prev, [cat]: '' }))
  }

  const removeCause = (cat: string, index: number) => {
    setCauses((prev) => ({
      ...prev,
      [cat]: (prev[cat] || []).filter((_, i) => i !== index),
    }))
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
      title={`🐟 Fishbone Diagram — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Diagram'}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <div>
            <label className="label">Problem / Effect Statement *</label>
            <input
              className="input"
              placeholder="What is the problem being analyzed?"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Framework</label>
            <select
              className="input"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
            >
              {Object.keys(FRAMEWORKS).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {problem && (
          <div
            style={{
              background: 'rgba(212,162,8,0.04)',
              border: '1px solid rgba(212,162,8,0.2)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 12,
              color: 'var(--text2)',
            }}
          >
            🎯 Effect: <strong style={{ color: 'var(--text)' }}>{problem}</strong>
          </div>
        )}

        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          {totalCauses} cause{totalCauses !== 1 ? 's' : ''} added
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 10,
                minWidth: 0,
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                {(causes[cat] || []).map((cause, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 32px',
                      gap: 8,
                      alignItems: 'start',
                      padding: '8px 10px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text2)',
                        overflowWrap: 'anywhere',
                        lineHeight: 1.45,
                      }}
                    >
                      {cause}
                    </span>

                    <button
                      onClick={() => removeCause(cat, index)}
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#7070A0',
                        cursor: 'pointer',
                        fontSize: 16,
                        minWidth: 32,
                        minHeight: 32,
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

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 42px',
                  gap: 8,
                  alignItems: 'stretch',
                }}
              >
                <input
                  className="input"
                  style={{ fontSize: 12, minWidth: 0 }}
                  placeholder="Add cause…"
                  value={newCause[cat] || ''}
                  onChange={(e) =>
                    setNewCause((prev) => ({ ...prev, [cat]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && addCause(cat)}
                />

                <button
                  onClick={() => addCause(cat)}
                  type="button"
                  style={{
                    background: 'rgba(212,162,8,0.15)',
                    border: '1px solid rgba(212,162,8,0.3)',
                    color: '#D4A208',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 18,
                    minWidth: 42,
                    minHeight: 42,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}