// @ts-nocheck
'use client'
// ── components/tools/KaizenTool.tsx ─────────────────────────────────────────

import { useState } from 'react'
import { saveToolData } from '@/lib/db'
import { useStore } from '@/lib/store'
import { Modal, Badge } from '@/components/ui'

const CATEGORIES = ['Safety','Quality','Delivery','Cost','Morale','Environment','Productivity','5S']
const PRIORITIES  = ['low','medium','high','critical'] as const
const STATUSES    = ['open','in-progress','complete','verified'] as const
const STATUS_COLOR: Record<string,string> = {
  'open': '#7070A0', 'in-progress': '#D4A208', 'complete': '#1DD1A1', 'verified': '#6CB9FC',
}

const BLANK = { title:'',description:'',category:'Quality',priority:'medium',status:'open',owner:'',dueDate:'',actions:[] as string[] }

function uid() { return Math.random().toString(36).slice(2,9) }

interface KaizenItem { id:string; kzId:string; title:string; description:string; category:string; priority:string; status:string; owner:string; dueDate:string; actions:string[]; created:number }
interface Props { stepId:string; stepName:string; data?:any; onSave:(data:Record<string,any>)=>Promise<void>; onClose:()=>void }

export default function KaizenTool({ stepId, stepName, data, onClose }: Props) {
  const { setStepToolData, showToast } = useStore()
  const [items,    setItems]    = useState<KaizenItem[]>(data?.items || [])
  const [editId,   setEditId]   = useState<string|null>(null)
  const [form,     setForm]     = useState({ ...BLANK })
  const [newAct,   setNewAct]   = useState('')
  const [expanded, setExpanded] = useState<string|null>(null)

  const openNew = () => { setForm({ ...BLANK }); setEditId('new') }
  const openEdit = (item: KaizenItem) => { setForm({ ...item } as any); setEditId(item.id) }

  const saveItem = () => {
    if (!form.title.trim()) return
    if (editId === 'new') {
      const num = String(items.length + 1).padStart(3,'0')
      setItems(prev => [...prev, { ...form, id: uid(), kzId: `KZ-${num}`, created: Date.now() }])
    } else {
      setItems(prev => prev.map(it => it.id === editId ? { ...it, ...form } : it))
    }
    setEditId(null)
    setForm({ ...BLANK })
  }

  const deleteItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id))

  const addAction = () => {
    if (!newAct.trim()) return
    setForm(f => ({ ...f, actions: [...f.actions, newAct.trim()] }))
    setNewAct('')
  }

  const handleSave = async () => {
    const payload = { items, savedAt: Date.now() }
    setStepToolData(stepId, 'kaizen', payload)
    try { await saveToolData(stepId, 'kaizen', payload); showToast('Kaizen events saved', 'success') }
    catch { showToast('Save failed', 'error') }
    onClose()
  }

  return (
    <Modal title={`⚡ Kaizen Tracker — ${stepName}`} onClose={onClose} onSave={handleSave}
      saveLabel={`Save (${items.length} event${items.length!==1?'s':''})`} width={720}>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', gap:8 }}>
          {STATUSES.map(s => {
            const count = items.filter(i=>i.status===s).length
            return count > 0 ? (
              <div key={s} style={{ fontSize:11, color: STATUS_COLOR[s], background: `${STATUS_COLOR[s]}15`, border:`1px solid ${STATUS_COLOR[s]}40`, borderRadius:100, padding:'2px 10px', fontWeight:600 }}>
                {count} {s}
              </div>
            ) : null
          })}
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>＋ New Event</button>
      </div>

      {/* Edit form */}
      {editId && (
        <div style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Title</label>
              <input className="input" placeholder="What needs to be improved?" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value}))}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Owner</label>
              <input className="input" placeholder="Responsible person" value={form.owner} onChange={e => setForm(f=>({...f,owner:e.target.value}))} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Description</label>
              <textarea className="input" rows={2} placeholder="Describe the improvement…" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
            </div>
            <div>
              <label className="label">Due Date</label>
              <input className="input" type="date" value={form.dueDate} onChange={e => setForm(f=>({...f,dueDate:e.target.value}))} />
            </div>
          </div>
          {/* Actions */}
          <label className="label">Action Items</label>
          {form.actions.map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
              <div style={{ flex:1, fontSize:12, color:'var(--text)', background:'var(--bg4)', padding:'5px 8px', borderRadius:5 }}>✓ {a}</div>
              <button onClick={() => setForm(f=>({...f,actions:f.actions.filter((_,j)=>j!==i)}))}
                style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text3)',fontSize:14 }}>×</button>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, marginTop:6 }}>
            <input className="input" style={{ flex:1,fontSize:12 }} placeholder="Add action item…" value={newAct}
              onChange={e => setNewAct(e.target.value)} onKeyDown={e => e.key==='Enter' && addAction()} />
            <button className="btn btn-ghost btn-sm" onClick={addAction}>Add</button>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:14 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={saveItem}>
              {editId === 'new' ? 'Create Event' : 'Update Event'}
            </button>
          </div>
        </div>
      )}

      {/* Event list */}
      {items.length === 0 && !editId && (
        <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text3)' }}>
          <div style={{ fontSize:28, marginBottom:8 }}>⚡</div>
          No kaizen events yet — click New Event to add one
        </div>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(item => (
          <div key={item.id} style={{
            background:'var(--bg3)', border:`1px solid ${expanded===item.id ? 'rgba(212,162,8,0.25)' : 'var(--border)'}`,
            borderRadius:10, overflow:'hidden', transition:'border-color 0.15s',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', cursor:'pointer' }}
              onClick={() => setExpanded(ex => ex===item.id ? null : item.id)}>
              <div style={{ fontSize:10, fontFamily:'var(--font-mono)', color:'var(--text3)', flexShrink:0, minWidth:48 }}>{item.kzId}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>{item.title}</div>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{item.category} · {item.owner || 'Unassigned'}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:600, color: STATUS_COLOR[item.status], background:`${STATUS_COLOR[item.status]}15`, border:`1px solid ${STATUS_COLOR[item.status]}40`, padding:'2px 8px', borderRadius:100, flexShrink:0 }}>
                {item.status}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button className="btn btn-ghost" style={{ padding:'4px 8px', fontSize:11 }} onClick={e=>{e.stopPropagation();openEdit(item)}}>Edit</button>
                <button className="btn btn-danger" style={{ padding:'4px 8px', fontSize:11 }} onClick={e=>{e.stopPropagation();deleteItem(item.id)}}>✕</button>
              </div>
            </div>
            {expanded===item.id && item.description && (
              <div style={{ padding:'0 14px 12px', borderTop:'1px solid var(--border)', paddingTop:10 }}>
                <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.5 }}>{item.description}</p>
                {item.actions.length > 0 && (
                  <div style={{ marginTop:8 }}>
                    {item.actions.map((a,i)=>(
                      <div key={i} style={{ fontSize:12, color:'var(--text2)', padding:'3px 0' }}>✓ {a}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  )
}
