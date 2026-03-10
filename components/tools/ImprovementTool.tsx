// @ts-nocheck
'use client'
// ── components/tools/ImprovementTool.tsx ────────────────────────────────────

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

const METRICS = ['Cycle Time (s)','Wait Time (s)','Defect Rate (%)','Uptime (%)','Lead Time (s)','Throughput (units/hr)','Labor Cost ($)','Quality Score (%)','OEE (%)','Custom']
function uid() { return Math.random().toString(36).slice(2,9) }

interface Goal {
  id: string; metric: string; customMetric?: string
  baseline: string; target: string; actual: string
  status: 'open'|'in-progress'|'achieved'|'not-achieved'
  notes: string; owner: string; dueDate: string
}

interface Props { stepId: string; stepName: string; data?: any; onSave: (data: Record<string, any>) => Promise<void>; onClose: () => void }

const BLANK_GOAL = (): Goal => ({
  id: uid(), metric:'Cycle Time (s)', customMetric:'',
  baseline:'', target:'', actual:'',
  status:'open', notes:'', owner:'', dueDate:''
})

const STATUS_COL = { open:'#7070A0','in-progress':'#D4A208',achieved:'#1DD1A1','not-achieved':'#FF6B6B' }
const STATUS_LBL = { open:'Open','in-progress':'In Progress',achieved:'✓ Achieved','not-achieved':'✗ Not Achieved' }

export default function ImprovementTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [goals,   setGoals]   = useState<Goal[]>(data?.goals || [BLANK_GOAL()])
  const [editId,  setEditId]  = useState<string|null>(goals.length === 1 ? goals[0].id : null)
  const [saving,  setSaving]  = useState(false)

  const setGoal = (id: string, k: keyof Goal, v: any) =>
    setGoals(gs => gs.map(g => g.id === id ? { ...g, [k]: v } : g))

  const addGoal  = () => { const g = BLANK_GOAL(); setGoals(gs => [...gs, g]); setEditId(g.id) }
  const delGoal  = (id: string) => setGoals(gs => gs.filter(g => g.id !== id))

  const handleSave = async () => {
    setSaving(true)
    const payload = { goals, savedAt: Date.now() }
    try {
      await onSave(payload)
      showToast(`${goals.length} improvement goal${goals.length!==1?'s':''} saved`, 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const g = goals.find(g => g.id === editId)

  return (
    <Modal title={`📈 Improvement Tracking — ${stepName}`} onClose={onClose} onSave={handleSave}
      saveLabel={saving ? 'Saving…' : `Save (${goals.length} goal${goals.length!==1?'s':''})`} width={680}>

      {/* Goal tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {goals.map((goal, i) => (
          <button key={goal.id} onClick={() => setEditId(goal.id)} style={{
            padding:'5px 12px', borderRadius:8, border:`1px solid ${editId===goal.id ? '#D4A208' : 'var(--border)'}`,
            background: editId===goal.id ? 'rgba(212,162,8,0.1)' : 'var(--bg)',
            color: editId===goal.id ? '#D4A208' : 'var(--text2)',
            cursor:'pointer', fontSize:12, fontWeight: editId===goal.id ? 700 : 400,
          }}>
            #{i+1} {goal.metric.replace(' (s)','').replace(' (%)','').replace(' ($)','').slice(0,12)}
            {goal.actual && <span style={{ color:STATUS_COL[goal.status], marginLeft:4 }}>●</span>}
          </button>
        ))}
        <button onClick={addGoal} style={{ padding:'5px 12px', borderRadius:8, border:'1px dashed var(--border)', background:'transparent', color:'var(--text3)', cursor:'pointer', fontSize:12 }}>
          + Add Goal
        </button>
      </div>

      {g && (
        <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, padding:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>
              {goals.findIndex(x=>x.id===g.id)+1}. Improvement Goal
            </div>
            {goals.length > 1 && (
              <button onClick={() => { delGoal(g.id); setEditId(goals.find(x=>x.id!==g.id)?.id||null) }}
                style={{ background:'none', border:'none', color:'#FF6B6B', cursor:'pointer', fontSize:12 }}>
                🗑 Remove
              </button>
            )}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div style={{ gridColumn: g.metric==='Custom' ? '1' : '1/-1' }}>
              <label className="label">Metric</label>
              <select className="input" value={g.metric} onChange={e => setGoal(g.id,'metric',e.target.value)}>
                {METRICS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            {g.metric === 'Custom' && (
              <div>
                <label className="label">Custom Metric Name</label>
                <input className="input" placeholder="e.g. Setup Time (min)" value={g.customMetric||''} onChange={e=>setGoal(g.id,'customMetric',e.target.value)} />
              </div>
            )}

            <div>
              <label className="label">Baseline (Current State)</label>
              <input className="input" type="number" placeholder="Current value" value={g.baseline} onChange={e=>setGoal(g.id,'baseline',e.target.value)} />
            </div>
            <div>
              <label className="label">Target (Future State)</label>
              <input className="input" type="number" placeholder="Target value" value={g.target} onChange={e=>setGoal(g.id,'target',e.target.value)} />
            </div>
            <div>
              <label className="label">Actual Result</label>
              <input className="input" type="number" placeholder="Fill after improvement" value={g.actual} onChange={e=>setGoal(g.id,'actual',e.target.value)} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={g.status} onChange={e=>setGoal(g.id,'status',e.target.value as any)}>
                {Object.entries(STATUS_LBL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            {g.baseline && g.target && (
              <div style={{ gridColumn:'1/-1', padding:'10px 14px', borderRadius:8, background:'rgba(29,209,161,0.04)', border:'1px solid rgba(29,209,161,0.2)' }}>
                <div style={{ fontSize:12, color:'var(--text2)' }}>
                  Target improvement: <strong style={{ color:'#1DD1A1' }}>
                    {Math.abs(Number(g.target)-Number(g.baseline)).toFixed(1)} units
                    ({Math.abs(((Number(g.target)-Number(g.baseline))/Number(g.baseline))*100).toFixed(1)}%)
                  </strong>
                  {g.actual && <span style={{ marginLeft:8, color: STATUS_COL[g.status] }}>
                    → Actual: {Math.abs(Number(g.actual)-Number(g.baseline)).toFixed(1)} units achieved
                  </span>}
                </div>
              </div>
            )}

            <div>
              <label className="label">Owner</label>
              <input className="input" placeholder="Responsible person" value={g.owner} onChange={e=>setGoal(g.id,'owner',e.target.value)} />
            </div>
            <div>
              <label className="label">Due Date</label>
              <input className="input" type="date" value={g.dueDate} onChange={e=>setGoal(g.id,'dueDate',e.target.value)} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label className="label">Notes</label>
              <textarea className="input" rows={2} placeholder="Describe the improvement approach, obstacles, or context…" style={{ resize:'none' }}
                value={g.notes} onChange={e=>setGoal(g.id,'notes',e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
