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
      width={620}
    >
      <div style={{ marginBottom: 14 }}>
        <label className="label">Problem Statement *</label>
        <textarea
          className="input"
          rows={3}
          placeholder="Describe the problem clearly. What went wrong? When? Where?"
          style={{ resize: 'vertical', minHeight: 86 }}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {whys.map((w, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '36px 1fr',
              gap: 10,
              alignItems: 'start',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(212,162,8,0.1)',
                border: '1px solid rgba(212,162,8,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#D4A208',
                marginTop: 2,
              }}
            >
              {i + 1}
            </div>

            <div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4 }}>
                WHY {i + 1}
              </div>
              <textarea
                className="input"
                rows={2}
                placeholder={`Why ${i + 1}…`}
                style={{ resize: 'vertical', minHeight: 72 }}
                value={w}
                onChange={(e) => setWhy(i, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'rgba(29,209,161,0.04)',
          border: '1px solid rgba(29,209,161,0.2)',
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <label className="label" style={{ color: '#1DD1A1' }}>
          ✓ Root Cause
        </label>
        <textarea
          className="input"
          rows={3}
          placeholder="The root cause identified from the 5 Why chain…"
          style={{ resize: 'vertical', minHeight: 86 }}
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
        <div>
          <label className="label">Countermeasure / Action</label>
          <textarea
            className="input"
            rows={3}
            placeholder="What action will prevent this root cause from recurring?"
            style={{ resize: 'vertical', minHeight: 86 }}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          <div>
            <label className="label">Owner</label>
            <input className="input" placeholder="Who is responsible?" value={owner} onChange={(e) => setOwner(e.target.value)} />
          </div>
          <div>
            <label className="label">Due Date</label>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ height: 8 }} />
    </Modal>
  )
}
