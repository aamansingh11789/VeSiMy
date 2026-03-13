// @ts-nocheck
'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function FiveWhyTool({ stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [problem, setProblem] = useState(data?.problem || '')
  const [whys, setWhys] = useState<string[]>(data?.whys || ['', '', '', '', ''])
  const [rootCause, setRootCause] = useState(data?.rootCause || '')
  const [action, setAction] = useState(data?.action || '')
  const [owner, setOwner] = useState(data?.owner || '')
  const [dueDate, setDueDate] = useState(data?.dueDate || '')
  const [saving, setSaving] = useState(false)

  const setWhy = (i: number, v: string) =>
    setWhys((current) => {
      const next = [...current]
      next[i] = v
      return next
    })

  const handleSave = async () => {
    setSaving(true)
    const payload = { problem, whys, rootCause, action, owner, dueDate, savedAt: Date.now() }

    try {
      await onSave(payload)
      showToast('5 Why analysis saved', 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={`❓ 5 Why Analysis — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Analysis'}
    >
      <div style={{ display: 'grid', gap: 10 }}>
        <div>
          <label className="label">Problem Statement *</label>
          <textarea
            className="input"
            rows={2}
            placeholder="Describe the problem clearly."
            style={{ resize: 'vertical', minHeight: 64 }}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {whys.map((w, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr',
                gap: 8,
                alignItems: 'start',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(212,162,8,0.1)',
                  border: '1px solid rgba(212,162,8,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#D4A208',
                  marginTop: 2,
                }}
              >
                {i + 1}
              </div>

              <textarea
                className="input"
                rows={2}
                placeholder={`Why ${i + 1}…`}
                style={{ resize: 'vertical', minHeight: 56 }}
                value={w}
                onChange={(e) => setWhy(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'rgba(29,209,161,0.04)',
            border: '1px solid rgba(29,209,161,0.2)',
            borderRadius: 10,
            padding: 10,
          }}
        >
          <label className="label" style={{ color: '#1DD1A1' }}>
            Root Cause
          </label>
          <textarea
            className="input"
            rows={2}
            style={{ resize: 'vertical', minHeight: 60 }}
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Countermeasure / Action</label>
          <textarea
            className="input"
            rows={2}
            style={{ resize: 'vertical', minHeight: 60 }}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <label className="label">Owner</label>
            <input className="input" value={owner} onChange={(e) => setOwner(e.target.value)} />
          </div>

          <div>
            <label className="label">Due Date</label>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
      </div>
    </Modal>
  )
}