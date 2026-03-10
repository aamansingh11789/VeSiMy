// @ts-nocheck
'use client'
// ── components/tools/FiveWhyTool.tsx ────────────────────────────────────────

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

interface Props { stepId: string; stepName: string; data?: any; onSave: (data: Record<string, any>) => Promise<void>; onClose: () => void }

export default function FiveWhyTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [problem,   setProblem]   = useState(data?.problem   || '')
  const [whys,      setWhys]      = useState<string[]>(data?.whys      || ['','','','',''])
  const [rootCause, setRootCause] = useState(data?.rootCause || '')
  const [action,    setAction]    = useState(data?.action    || '')
  const [owner,     setOwner]     = useState(data?.owner     || '')
  const [dueDate,   setDueDate]   = useState(data?.dueDate   || '')
  const [saving,    setSaving]    = useState(false)

  const setWhy = (i: number, v: string) => setWhys(w => { const n = [...w]; n[i] = v; return n })

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
    <Modal title={`❓ 5 Why Analysis — ${stepName}`} onClose={onClose} onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Analysis'} width={580}>

      <div style={{ marginBottom:14 }}>
        <label className="label">Problem Statement *</label>
        <textarea className="input" rows={2} placeholder="Describe the problem clearly. What went wrong? When? Where?" style={{ resize:'none' }}
          value={problem} onChange={e => setProblem(e.target.value)} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {whys.map((w, i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
            <div style={{
              width:28, height:28, borderRadius:8, background:'rgba(212,162,8,0.1)', border:'1px solid rgba(212,162,8,0.25)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#D4A208',
              flexShrink:0, marginTop:4
            }}>
              {i+1}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'monospace', letterSpacing:1, marginBottom:3 }}>
                WHY {i+1} {i===0 ? '— Why did the problem occur?' : `— Why did "${whys[i-1]?.slice(0,40)||`Why ${i}`}${whys[i-1]?.length>40?'…':''}" happen?`}
              </div>
              <textarea className="input" rows={2} placeholder={`Why ${i+1}…`} style={{ resize:'none' }}
                value={w} onChange={e => setWhy(i, e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:'rgba(29,209,161,0.04)', border:'1px solid rgba(29,209,161,0.2)', borderRadius:10, padding:14, marginBottom:14 }}>
        <label className="label" style={{ color:'#1DD1A1' }}>✓ Root Cause</label>
        <textarea className="input" rows={2} placeholder="The root cause identified from the 5 Why chain…" style={{ resize:'none' }}
          value={rootCause} onChange={e => setRootCause(e.target.value)} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label className="label">Countermeasure / Action</label>
          <textarea className="input" rows={2} placeholder="What action will prevent this root cause from recurring?" style={{ resize:'none' }}
            value={action} onChange={e => setAction(e.target.value)} />
        </div>
        <div>
          <label className="label">Owner</label>
          <input className="input" placeholder="Who is responsible?" value={owner} onChange={e => setOwner(e.target.value)} />
        </div>
        <div>
          <label className="label">Due Date</label>
          <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
      </div>

    </Modal>
  )
}
