// @ts-nocheck
'use client'
// ── components/tools/WasteTool.tsx ──────────────────────────────────────────

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

const WASTES = [
  { id:'T', label:'Transport',      icon:'🚛', desc:'Unnecessary movement of materials or products' },
  { id:'I', label:'Inventory',      icon:'📦', desc:'Excess stock, WIP, or finished goods beyond need' },
  { id:'M', label:'Motion',         icon:'🏃', desc:'Unnecessary movement of people or equipment' },
  { id:'W', label:'Waiting',        icon:'⏳', desc:'Idle time waiting for materials, information, or approvals' },
  { id:'O', label:'Overproduction', icon:'⚙️', desc:'Producing more than what is needed or before it is needed' },
  { id:'O2',label:'Over-processing',icon:'🔧', desc:'More processing than the customer requires' },
  { id:'D', label:'Defects',        icon:'❌', desc:'Errors, rework, scrap, and corrections' },
  { id:'S', label:'Skills',         icon:'🧠', desc:'Unused talent, knowledge, and capabilities of people' },
]

interface Props { stepId: string; stepName: string; data?: any; onSave: (data: Record<string, any>) => Promise<void>; onClose: () => void }

export default function WasteTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [selected, setSelected] = useState<string[]>(data?.selected || [])
  const [notes,    setNotes]    = useState<Record<string,string>>(data?.notes || {})
  const [saving,   setSaving]   = useState(false)

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSave = async () => {
    setSaving(true)
    const payload = { selected, notes, savedAt: Date.now() }
    try {
      await onSave(payload)
      showToast(`${selected.length} waste${selected.length!==1?'s':''} identified & saved`, 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`⚠️ Waste Identification — ${stepName}`} onClose={onClose} onSave={handleSave}
      saveLabel={saving ? 'Saving…' : `Save (${selected.length} selected)`} width={640}>

      <p style={{ fontSize:13, color:'var(--text2)', marginBottom:16, lineHeight:1.6 }}>
        Select all wastes present at this step. Be specific — this data drives your Kaizen prioritization and Report.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:8 }}>
        {WASTES.map(w => {
          const active = selected.includes(w.id)
          return (
            <div key={w.id}>
              <div
                onClick={() => toggle(w.id)}
                style={{
                  padding:'12px 14px', borderRadius:8, cursor:'pointer', transition:'all 0.15s',
                  background: active ? 'rgba(255,107,107,0.06)' : 'var(--bg)',
                  border: `1px solid ${active ? 'rgba(255,107,107,0.35)' : 'var(--border)'}`,
                  display:'flex', alignItems:'flex-start', gap:10,
                }}
              >
                <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{w.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontWeight:700, fontSize:13, color: active ? '#FF6B6B' : 'var(--text)' }}>{w.label}</span>
                    <span style={{ fontSize:10, fontFamily:'monospace', color:'#7070A0', background:'var(--bg2)', padding:'1px 5px', borderRadius:3 }}>{w.id}</span>
                    {active && <span style={{ marginLeft:'auto', fontSize:14, color:'#FF6B6B' }}>✓</span>}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:2, lineHeight:1.5 }}>{w.desc}</div>
                </div>
              </div>
              {active && (
                <div style={{ paddingTop:4 }}>
                  <input
                    className="input"
                    style={{ fontSize:12, padding:'5px 10px' }}
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
        <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(255,107,107,0.04)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:8 }}>
          <span style={{ fontSize:12, color:'#FF6B6B', fontWeight:600 }}>
            {selected.length} waste{selected.length!==1?'s':''} identified: {selected.map(id => WASTES.find(w=>w.id===id)?.label).join(', ')}
          </span>
        </div>
      )}
    </Modal>
  )
}
