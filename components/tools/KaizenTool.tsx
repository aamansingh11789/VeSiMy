// @ts-nocheck
'use client'
// ── components/tools/KaizenTool.tsx ─────────────────────────────────────────

import { useState } from 'react'
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

export default function KaizenTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [items,    setItems]    = useState<KaizenItem[]>(data?.items || [])
  const [editId,   setEditId]   = useState<string|null>(null)
  const [form,     setForm]     = useState({ ...BLANK })
  const [newAct,   setNewAct]   = useState('')
  const [expanded, setExpanded] = useState<string|null>(null)
  const [saving,   setSaving]   = useState(false)

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
    setSaving(true)
    const payload = { items, savedAt: Date.now() }
    try {
      await onSave(payload)
      showToast(`Kaizen saved (${items.length} event${items.length!==1?'s':''})`, 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const sLabel = { open:'Open','in-progress':'In Progress',complete:'Complete',verified:'Verified' }

  return (
    <Modal title={`⚡ Kaizen Tracker — ${stepName}`} onClose={onClose}
      onSave={handleSave} saveLabel={saving ? 'Saving…' : `Save (${items.length} event${items.length!==1?'s':''})`} width={720}>
      <div style={{ marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', gap:8 }}>
          {STATUSES.map(s => (
            <span key={s} style={{ fontSize:11, padding:'2px 8px', borderRadius:100, background:`${STATUS_COLOR[s]}18`, color:STATUS_COLOR[s], border:`1px solid ${STATUS_COLOR[s]}33` }}>
              {sLabel[s]} ({items.filter(i=>i.status===s).length})
            </span>
          ))}
        </div>
        <button onClick={openNew} className="btn btn-primary btn-sm">+ New Event</button>
      </div>

      {editId && (
        <div style={{ background:'rgba(212,162,8,0.04)', border:'1px solid rgba(212,162,8,0.2)', borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ fontWeight:700, color:'var(--text)', marginBottom:12, fontSize:13 }}>
            {editId==='new' ? '+ New Kaizen Event' : `Editing: ${items.find(i=>i.id===editId)?.kzId}`}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Title *</label>
              <input className="input" placeholder="Kaizen event title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Description</label>
              <textarea className="input" rows={2} placeholder="What needs to be improved?" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{ resize:'none' }} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                {PRIORITIES.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{sLabel[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Owner</label>
              <input className="input" placeholder="Team member name" value={form.owner} onChange={e=>setForm(f=>({...f,owner:e.target.value}))} />
            </div>
            <div>
              <label className="label">Due Date</label>
              <input className="input" type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} />
            </div>
            <div>
              <label className="label">Actions</label>
              <div style={{ display:'flex', gap:6 }}>
                <input className="input" placeholder="Add action item" value={newAct} onChange={e=>setNewAct(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addAction()} style={{ flex:1 }} />
                <button onClick={addAction} className="btn btn-ghost btn-sm" style={{ flexShrink:0 }}>+</button>
              </div>
              {form.actions.map((a,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, marginTop:4, fontSize:12, color:'var(--text2)' }}>
                  <span style={{ flex:1 }}>• {a}</span>
                  <button onClick={()=>setForm(f=>({...f,actions:f.actions.filter((_,j)=>j!==i)}))} style={{ background:'none', border:'none', color:'#7070A0', cursor:'pointer', fontSize:14 }}>×</button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button onClick={saveItem} disabled={!form.title.trim()} className="btn btn-primary btn-sm">{editId==='new'?'Add Event':'Update Event'}</button>
            <button onClick={()=>setEditId(null)} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--text3)' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>⚡</div>
          <p style={{ fontSize:13 }}>No kaizen events yet. Add one to track improvement activities.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {items.map(item=>(
            <div key={item.id} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden' }}>
              <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>setExpanded(expanded===item.id?null:item.id)}>
                <span style={{ fontSize:10, color:'#7070A0', fontFamily:'monospace', flexShrink:0 }}>{item.kzId}</span>
                <span style={{ flex:1, fontWeight:600, fontSize:13, color:'var(--text)' }}>{item.title}</span>
                <span style={{ fontSize:10, padding:'2px 7px', borderRadius:100, background:`${STATUS_COLOR[item.status]}18`, color:STATUS_COLOR[item.status], border:`1px solid ${STATUS_COLOR[item.status]}33`, flexShrink:0 }}>{sLabel[item.status]}</span>
                <span style={{ fontSize:10, padding:'2px 7px', borderRadius:100, background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text2)', flexShrink:0 }}>{item.priority}</span>
                <button onClick={e=>{e.stopPropagation();openEdit(item)}} style={{ background:'none', border:'none', color:'#7070A0', cursor:'pointer', fontSize:12, padding:'2px 6px' }}>✎</button>
                <button onClick={e=>{e.stopPropagation();deleteItem(item.id)}} style={{ background:'none', border:'none', color:'#FF6B6B', cursor:'pointer', fontSize:14, padding:'2px 6px' }}>×</button>
              </div>
              {expanded===item.id && (
                <div style={{ padding:'0 14px 12px', borderTop:'1px solid var(--border)' }}>
                  {item.description && <p style={{ fontSize:12, color:'var(--text2)', margin:'8px 0', lineHeight:1.6 }}>{item.description}</p>}
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap', fontSize:11, color:'var(--text3)', marginTop:6 }}>
                    {item.category && <span>📁 {item.category}</span>}
                    {item.owner    && <span>👤 {item.owner}</span>}
                    {item.dueDate  && <span>📅 {item.dueDate}</span>}
                  </div>
                  {item.actions.length > 0 && (
                    <div style={{ marginTop:8 }}>
                      {item.actions.map((a,i)=><div key={i} style={{ fontSize:12, color:'var(--text2)', padding:'2px 0' }}>• {a}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
