// @ts-nocheck
'use client'
// ── components/live/LiveFloorPanel.tsx ───────────────────────────────────────
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Step } from '@/lib/store'

interface Metric { id:string; step_id:string; metric_type:string; value:number; timestamp:string }
interface Props   { steps: Step[]; projectId: string }

const TYPES = [
  { key:'cycle_time',   label:'Cycle Time (s)' },
  { key:'queue_length', label:'Queue Length'   },
  { key:'completions',  label:'Completions'    },
]

export function LiveFloorPanel({ steps, projectId }: Props) {
  const [stepId,  setStepId]  = useState(steps[0]?.id || '')
  const [mType,   setMType]   = useState('cycle_time')
  const [value,   setValue]   = useState('')
  const [notes,   setNotes]   = useState('')
  const [recent,  setRecent]  = useState<Metric[]>([])
  const [live,    setLive]    = useState(false)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    if (!steps.length) return
    createClient().from('live_metrics').select('*').eq('project_id', projectId)
      .order('timestamp', { ascending:false }).limit(10)
      .then(({ data }) => setRecent(data||[]))
  }, [projectId])

  useEffect(() => {
    if (!live) return
    const sub = createClient().channel(`live-${projectId}`)
      .on('postgres_changes',
        { event:'INSERT', schema:'public', table:'live_metrics', filter:`project_id=eq.${projectId}` },
        p => setRecent(prev => [p.new as Metric, ...prev].slice(0,10)))
      .subscribe()
    return () => { createClient().removeChannel(sub) }
  }, [live, projectId])

  async function log() {
    if (!value||!stepId) return
    setSaving(true)
    const res = await fetch('/api/metrics/live', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ step_id:stepId, project_id:projectId, metric_type:mType, value:Number(value), notes }),
    })
    if (res.ok) { toast.success('Logged'); setValue(''); setNotes('') }
    else toast.error('Failed to log metric')
    setSaving(false)
  }

  const sName = (id:string) => steps.find(s=>s.id===id)?.name || id

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h3 style={{ margin:0, fontFamily:'var(--font-serif)', fontSize:18, color:'var(--text)' }}>📡 Live Floor Metrics</h3>
        <button onClick={() => setLive(l=>!l)} style={{ fontSize:10, padding:'3px 10px', borderRadius:100, border:'1px solid', cursor:'pointer',
          background:live?'rgba(29,209,161,0.1)':'transparent',
          borderColor:live?'#1DD1A1':'var(--border2)', color:live?'#1DD1A1':'var(--text3)' }}>
          {live ? '● LIVE' : '○ Connect Live'}
        </button>
      </div>

      <div className="card" style={{ padding:18, marginBottom:16 }}>
        <div style={{ marginBottom:10 }}>
          <label className="label">Process Step</label>
          <select className="input" value={stepId} onChange={e => setStepId(e.target.value)}>
            {steps.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
          {TYPES.map(t => (
            <button key={t.key} onClick={() => setMType(t.key)} style={{ flex:1, minWidth:90, padding:'6px 8px', borderRadius:6, border:'1px solid', fontSize:11, cursor:'pointer',
              background:mType===t.key?'var(--steel-dim)':'transparent',
              borderColor:mType===t.key?'var(--steel)':'var(--border2)',
              color:mType===t.key?'var(--steel)':'var(--text2)' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          <input className="input" type="number" placeholder="Value" style={{ flex:1 }}
            value={value} onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key==='Enter' && log()} />
          <button onClick={log} disabled={saving||!value} className="btn-primary" style={{ whiteSpace:'nowrap' }}>
            {saving?'…':'⊳ Log'}
          </button>
        </div>
        <input className="input" placeholder="Notes (optional)" style={{ fontSize:12 }}
          value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      {recent.length > 0 && (
        <div className="card" style={{ padding:14 }}>
          <div style={{ fontSize:10, color:'var(--text3)', letterSpacing:1.5, marginBottom:8, fontFamily:'var(--font-mono)' }}>RECENT ENTRIES</div>
          {recent.map(m => (
            <div key={m.id} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text2)', padding:'5px 0', borderBottom:'1px solid rgba(215,213,206,0.9)' }}>
              <span style={{ color:'var(--text3)' }}>{sName(m.step_id)}</span>
              <span>{m.metric_type.replace('_',' ')}: <strong style={{ color:'var(--steel)' }}>{m.value}</strong></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
