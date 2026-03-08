// @ts-nocheck
'use client'
// ── components/simulation/ProcessSimulation.tsx ──────────────────────────────
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Step } from '@/lib/store'

interface Props { steps: Step[]; projectId: string }

const fmt = (s: number) => !s ? '0s' : s < 60 ? `${Math.round(s)}s` : `${(s/60).toFixed(1)}m`

export function ProcessSimulation({ steps, projectId }: Props) {
  const main = steps.filter(s => s.is_main_flow !== false)
  const [adj, setAdj] = useState<Record<string,(typeof main)[0] & {fCT:number;fWait:number}>>({})
  const [view, setView] = useState<'edit'|'compare'>('edit')
  const [saving, setSaving] = useState(false)

  function getA(s: Step) {
    return adj[s.id] || { fCT: s.toolData?.stopwatch?.mean||0, fWait: Number(s.wait_time)||0 }
  }
  function setA(s: Step, k:'fCT'|'fWait', v: number) {
    setAdj(p => ({ ...p, [s.id]: { ...getA(s), [k]:v } }))
  }

  const curLT = useMemo(() => main.reduce((a,s) => a+(s.toolData?.stopwatch?.mean||0)+(Number(s.wait_time)||0),0), [main])
  const futLT = useMemo(() => main.reduce((a,s) => { const a_=getA(s); return a+a_.fCT+a_.fWait },0), [main,adj])
  const saved = curLT - futLT
  const curPCE = curLT>0 ? (main.reduce((a,s)=>a+(s.toolData?.stopwatch?.mean||0),0)/curLT*100).toFixed(1) : '0'
  const futPCE = futLT>0 ? (main.reduce((a,s)=>a+getA(s).fCT,0)/futLT*100).toFixed(1)                    : '0'

  async function save() {
    setSaving(true)
    const { error } = await createClient().from('process_simulations').insert({
      project_id: projectId, name:'Future State',
      simulation_steps: Object.entries(adj).map(([id,a]) => ({ step_id:id, ct:a.fCT, wait:a.fWait })),
      current_lead_time:curLT, future_lead_time:futLT, lead_time_savings:saved,
    })
    if (error) toast.error('Save failed'); else toast.success('Simulation saved!')
    setSaving(false)
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:10, marginBottom:20 }}>
        {[['Current LT',fmt(curLT),'var(--text2)'],['Future LT',fmt(futLT),'#1DD1A1'],
          ['Time Saved',saved>0?fmt(saved):'—','var(--gold2)'],
          ['PCE',`${curPCE}% → ${futPCE}%`,'var(--steel)']].map(([l,v,c]) => (
          <div key={l as string} style={{ background:'#0D0D22', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'12px 14px' }}>
            <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:1.5, fontFamily:'var(--font-mono)', marginBottom:4 }}>{l as string}</div>
            <div style={{ fontSize:17, fontWeight:700, color:c as string }}>{v as string}</div>
          </div>
        ))}
      </div>

      {/* View toggle + save */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {(['edit','compare'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding:'7px 16px', borderRadius:'var(--radius-sm)', border:'1px solid',
            background:view===v?'var(--gold-dim)':'transparent', borderColor:view===v?'var(--gold-glow)':'var(--border2)',
            color:view===v?'var(--gold2)':'var(--text2)', fontSize:12, fontWeight:view===v?700:400, cursor:'pointer' }}>
            {v==='edit'?'⚙ Adjust':'⊞ Compare'}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        <button onClick={() => setAdj({})} style={{ padding:'7px 12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border2)', background:'transparent', cursor:'pointer', color:'var(--text3)', fontSize:11 }}>↺ Reset</button>
        <button onClick={save} disabled={saving} className="btn-primary" style={{ fontSize:11 }}>
          {saving?'…':'💾 Save'}
        </button>
      </div>

      {view==='edit' && main.map(s => {
        const a = getA(s)
        const origCT = s.toolData?.stopwatch?.mean||0
        const origW  = Number(s.wait_time)||0
        return (
          <div key={s.id} style={{ background:'#0D0D22', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'14px', marginBottom:10 }}>
            <div style={{ fontWeight:600, color:'var(--text)', marginBottom:12 }}>{s.name}</div>
            {([['Cycle Time (s)', 'fCT' as const, origCT], ['Wait Time (s)', 'fWait' as const, origW]] as any[]).map(([label,key,orig]) => (
              <div key={key} style={{ marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
                  <span style={{ color:'var(--text3)' }}>{label}</span>
                  <span style={{ fontWeight:700, color:a[key]<orig?'#1DD1A1':a[key]>orig?'var(--red)':'var(--text2)' }}>
                    {a[key]}s {orig>0&&a[key]!==orig&&`(was ${orig}s)`}
                  </span>
                </div>
                <input type="range" min={0} max={Math.max(orig*2,300)} value={a[key]}
                  onChange={e => setA(s,key,Number(e.target.value))}
                  style={{ width:'100%', accentColor:a[key]<orig?'#1DD1A1':'var(--gold)' }}/>
              </div>
            ))}
          </div>
        )
      })}

      {view==='compare' && (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr>
                {['Step','Cur CT','Fut CT','Cur Wait','Fut Wait','Δ LT'].map(h => (
                  <th key={h} style={{ padding:'8px 10px', textAlign:'left', color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:1, borderBottom:'1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {main.map(s => {
                const a    = getA(s)
                const oCT  = s.toolData?.stopwatch?.mean||0
                const oW   = Number(s.wait_time)||0
                const dLT  = (a.fCT+a.fWait)-(oCT+oW)
                return (
                  <tr key={s.id} style={{ borderBottom:'1px solid rgba(26,26,64,0.3)' }}>
                    <td style={{ padding:'8px 10px', color:'var(--text)', fontWeight:500 }}>{s.name}</td>
                    <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{oCT?fmt(oCT):'—'}</td>
                    <td style={{ padding:'8px 10px', color:a.fCT<oCT?'#1DD1A1':'var(--text2)' }}>{fmt(a.fCT)}</td>
                    <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{oW?fmt(oW):'—'}</td>
                    <td style={{ padding:'8px 10px', color:a.fWait<oW?'#1DD1A1':'var(--text2)' }}>{fmt(a.fWait)}</td>
                    <td style={{ padding:'8px 10px', fontWeight:700, color:dLT<0?'#1DD1A1':dLT>0?'var(--red)':'var(--text3)' }}>
                      {dLT!==0?`${dLT<0?'':'+'}${fmt(Math.abs(dLT))}`:'—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
