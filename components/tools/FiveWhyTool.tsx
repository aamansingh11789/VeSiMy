// @ts-nocheck
'use client'
// ── components/tools/FiveWhyTool.tsx ────────────────────────────────────────

import { useState } from 'react'
import { saveToolData } from '@/lib/db'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

interface Props { stepId: string; stepName: string; data?: any; onSave: (data: Record<string, any>) => Promise<void>; onClose: () => void }

export default function FiveWhyTool({ stepId, stepName, data, onClose }: Props) {
  const { setStepToolData, showToast } = useStore()
  const [problem,   setProblem]   = useState(data?.problem   || '')
  const [whys,      setWhys]      = useState<string[]>(data?.whys?.length ? data.whys : ['','','','',''])
  const [rootCause, setRootCause] = useState(data?.rootCause || '')
  const [action,    setAction]    = useState(data?.action    || '')

  const setWhy = (i: number, val: string) => setWhys(prev => prev.map((w,j) => j===i ? val : w))

  const handleSave = async () => {
    const payload = { problem, whys, rootCause, action, savedAt: Date.now() }
    setStepToolData(stepId, 'fivewhy', payload)
    try { await saveToolData(stepId, 'fivewhy', payload); showToast('5 Why saved', 'success') }
    catch { showToast('Save failed', 'error') }
    onClose()
  }

  return (
    <Modal title={`❓ 5 Why Analysis — ${stepName}`} onClose={onClose} onSave={handleSave} width={580}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Problem statement */}
        <div>
          <label className="label">Problem Statement</label>
          <textarea className="input" rows={2} placeholder="Describe the specific problem clearly…"
            value={problem} onChange={e => setProblem(e.target.value)} />
        </div>

        {/* 5 Whys chain */}
        {whys.map((w, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {i > 0 && (
              <div style={{ position: 'absolute', left: 20, top: -10, fontSize: 14, color: 'var(--gold)', opacity: 0.6 }}>↓</div>
            )}
            <label className="label">Why #{i+1}</label>
            <textarea className="input" rows={2}
              placeholder={i === 0 ? 'Why did the problem occur?' : `Why did the answer to Why #${i} occur?`}
              value={w} onChange={e => setWhy(i, e.target.value)} />
          </div>
        ))}

        {/* Root cause */}
        <div style={{ background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.20)', borderRadius: 8, padding: 14 }}>
          <label className="label" style={{ color: '#D4A208' }}>✦ Root Cause Identified</label>
          <textarea className="input" rows={2} placeholder="Summarise the root cause from the 5 Why chain…"
            value={rootCause} onChange={e => setRootCause(e.target.value)}
            style={{ borderColor: 'rgba(212,162,8,0.25)' }} />
        </div>

        {/* Corrective action */}
        <div>
          <label className="label">Corrective Action</label>
          <textarea className="input" rows={2} placeholder="What action will address the root cause?"
            value={action} onChange={e => setAction(e.target.value)} />
        </div>
      </div>
    </Modal>
  )
}
