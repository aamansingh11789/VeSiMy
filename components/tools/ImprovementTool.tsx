// @ts-nocheck
'use client'
// ── components/tools/ImprovementTool.tsx ────────────────────────────────────

import { useState } from 'react'
import { saveToolData } from '@/lib/db'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

const BLANK = { metric:'',baseline:'',target:'',unit:'',notes:'' }
function uid() { return Math.random().toString(36).slice(2,9) }

interface Record_ { id:string; ts:number; value:string; note:string; date:string }
interface Goal { id:string; metric:string; baseline:string; target:string; unit:string; notes:string; records:Record_[] }

interface Props { stepId:string; stepName:string; data?:any; onSave:(data:Record<string,any>)=>Promise<void>; onClose:()=>void }

export default function ImprovementTool({ stepId, stepName, data, onClose }: Props) {
  const { setStepToolData, showToast } = useStore()
  const [goals,    setGoals]    = useState<Goal[]>(data?.goals || [])
  const [editId,   setEditId]   = useState<string|null>(null)
  const [form,     setForm]     = useState({ ...BLANK })
  const [newVal,   setNewVal]   = useState('')
  const [newNote,  setNewNote]  = useState('')
  const [activeId, setActiveId] = useState<string|null>(null)

  const saveGoal = () => {
    if (!form.metric.trim()) return
    if (editId === 'new') {
      setGoals(prev => [...prev, { ...form, id: uid(), records: [] }])
    } else {
      setGoals(prev => prev.map(g => g.id===editId ? { ...g, ...form } : g))
    }
    setEditId(null)
    setForm({ ...BLANK })
  }

  const addRecord = (goalId: string) => {
    const val = newVal.trim()
    if (!val) return
    setGoals(prev => prev.map(g => g.id===goalId
      ? { ...g, records: [...g.records, { id:uid(), ts:Date.now(), value:val, note:newNote, date:new Date().toLocaleDateString() }] }
      : g
    ))
    setNewVal('')
    setNewNote('')
  }

  const progress = (g: Goal) => {
    if (!g.baseline || !g.target || !g.records.length) return null
    const base = parseFloat(g.baseline)
    const tgt  = parseFloat(g.target)
    const curr = parseFloat(g.records[g.records.length-1].value)
    if (isNaN(base)||isNaN(tgt)||isNaN(curr)) return null
    const range = tgt - base
    if (range === 0) return 100
    return Math.round(Math.min(100, Math.max(0, ((curr - base) / range) * 100)))
  }

  const handleSave = async () => {
    const payload = { goals, savedAt: Date.now() }
    setStepToolData(stepId, 'improvement', payload)
    try { await saveToolData(stepId, 'improvement', payload); showToast('Improvements saved', 'success') }
    catch { showToast('Save failed', 'error') }
    onClose()
  }

  return (
    <Modal title={`📈 Improvement Tracking — ${stepName}`} onClose={onClose} onSave={handleSave} width={680}>
      {/* Add/edit goal form */}
      {editId ? (
        <div style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Metric Name</label>
              <input className="input" placeholder="e.g. Cycle Time, Defect Rate, OEE…" value={form.metric} onChange={e=>setForm(f=>({...f,metric:e.target.value}))} />
            </div>
            <div>
              <label className="label">Baseline</label>
              <input className="input" type="number" placeholder="Starting value" value={form.baseline} onChange={e=>setForm(f=>({...f,baseline:e.target.value}))} />
            </div>
            <div>
              <label className="label">Target</label>
              <input className="input" type="number" placeholder="Goal value" value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} />
            </div>
            <div>
              <label className="label">Unit</label>
              <input className="input" placeholder="sec, %, units, ppm…" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Notes</label>
              <input className="input" placeholder="Context or measurement method" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:14 }}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditId(null)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={saveGoal}>{editId==='new'?'Add Metric':'Update'}</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-primary btn-sm" style={{ marginBottom:16 }} onClick={()=>{setForm({...BLANK});setEditId('new')}}>
          ＋ Track New Metric
        </button>
      )}

      {goals.length === 0 && !editId && (
        <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text3)' }}>
          <div style={{ fontSize:28, marginBottom:8 }}>📈</div>
          No metrics yet — add one to start tracking improvement
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {goals.map(g => {
          const pct = progress(g)
          const latest = g.records[g.records.length-1]
          const isOpen = activeId===g.id
          return (
            <div key={g.id} style={{ background:'var(--bg3)', border:`1px solid ${isOpen?'rgba(212,162,8,0.25)':'var(--border)'}`, borderRadius:10, overflow:'hidden' }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', cursor:'pointer' }}
                onClick={()=>setActiveId(a=>a===g.id?null:g.id)}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{g.metric}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>
                    Baseline: {g.baseline}{g.unit} → Target: {g.target}{g.unit}
                    {latest && ` · Current: ${latest.value}${g.unit}`}
                  </div>
                </div>
                {pct !== null && (
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:18, fontWeight:700, color: pct>=100?'#1DD1A1':'#D4A208' }}>{pct}%</div>
                    <div style={{ fontSize:10, color:'var(--text3)' }}>progress</div>
                  </div>
                )}
                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-ghost" style={{ padding:'4px 8px', fontSize:11 }} onClick={e=>{e.stopPropagation();setForm({...g});setEditId(g.id)}}>Edit</button>
                  <button className="btn btn-danger" style={{ padding:'4px 8px', fontSize:11 }} onClick={e=>{e.stopPropagation();setGoals(prev=>prev.filter(x=>x.id!==g.id))}}>✕</button>
                </div>
              </div>

              {/* Progress bar */}
              {pct !== null && (
                <div style={{ height:3, background:'var(--border)', margin:'0 14px' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background: pct>=100 ? '#1DD1A1' : 'linear-gradient(90deg,#D4A208,#F4A623)', borderRadius:2, transition:'width 0.4s ease' }} />
                </div>
              )}

              {/* Expanded: log readings */}
              {isOpen && (
                <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border)' }}>
                  {/* Add reading */}
                  <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                    <input className="input" style={{ flex:1 }} type="number" placeholder={`New reading (${g.unit||'value'})`}
                      value={newVal} onChange={e=>setNewVal(e.target.value)} />
                    <input className="input" style={{ flex:2 }} placeholder="Note…"
                      value={newNote} onChange={e=>setNewNote(e.target.value)} />
                    <button className="btn btn-ghost btn-sm" onClick={()=>addRecord(g.id)}>Log</button>
                  </div>
                  {/* History */}
                  {g.records.length > 0 && (
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      {[...g.records].reverse().map(r => (
                        <div key={r.id} style={{ display:'flex', gap:10, fontSize:12, padding:'5px 0', borderBottom:'1px solid var(--border)' }}>
                          <span style={{ color:'#D4A208', fontFamily:'var(--font-mono)', fontWeight:600 }}>{r.value}{g.unit}</span>
                          <span style={{ color:'var(--text2)', flex:1 }}>{r.note||'—'}</span>
                          <span style={{ color:'var(--text3)' }}>{r.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
