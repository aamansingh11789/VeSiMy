// TypeScript enabled
'use client'
// ── components/health/ProcessHealthScore.tsx ─────────────────────────────────
import { useMemo } from 'react'
import { calcHealth } from '@/lib/health-score'
import type { Step } from '@/lib/store'

type HealthStep = Record<string, any>

interface Props { steps: HealthStep[]; compact?: boolean }

export function ProcessHealthScore({ steps, compact=false }: Props) {
  const h = useMemo(() => calcHealth(steps as Step[]), [steps])

  if (compact) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 11px', background:`${h.color}12`, border:`1px solid ${h.color}35`, borderRadius:100 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:h.color }} />
        <span style={{ fontSize:12, fontWeight:700, color:h.color }}>{h.total}</span>
        <span style={{ fontSize:11, color:'var(--text2)' }}>{h.label}</span>
      </div>
    )
  }

  const ARC = 148
  return (
    <div className="card" style={{ padding:'20px' }}>
      <div style={{ textAlign:'center', marginBottom:16 }}>
        <svg width={110} height={66} viewBox="0 0 110 66">
          <path d="M8 58 A47 47 0 0 1 102 58" fill="none" stroke="var(--border2)" strokeWidth="9" strokeLinecap="round"/>
          <path d="M8 58 A47 47 0 0 1 102 58" fill="none" stroke={h.color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={`${(h.total/100)*ARC} ${ARC}`}
            style={{ transition:'stroke-dasharray 0.7s ease' }}/>
        </svg>
        <div style={{ marginTop:-8 }}>
          <div style={{ fontSize:28, fontWeight:900, color:h.color, lineHeight:1 }}>{h.total}</div>
          <div style={{ fontSize:10, color:'var(--text3)' }}>/ 100</div>
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:h.color, marginTop:4 }}>{h.label}</div>
        <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:2, fontFamily:'var(--font-mono)' }}>PROCESS HEALTH</div>
      </div>
      {([['Lead Time', h.lead_time,'var(--steel)'],['Bottlenecks',h.bottleneck,'var(--red)'],
         ['Waiting',   h.waiting,  'var(--brand)'],['Defects',   h.defect,  '#1DD1A1']] as any[]).map(([l,v,c])=>(
        <div key={l} style={{ marginBottom:7 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, marginBottom:3 }}>
            <span style={{ color:'var(--text3)', fontFamily:'var(--font-mono)' }}>{l}</span>
            <span style={{ color:c, fontWeight:700 }}>{v}</span>
          </div>
          <div style={{ height:3, background:'var(--border2)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${v}%`, background:c, borderRadius:2, transition:'width 0.7s ease' }}/>
          </div>
        </div>
      ))}
      {!steps.length && <p style={{ textAlign:'center', color:'var(--text3)', fontSize:12, marginTop:10 }}>Add steps to calculate</p>}
    </div>
  )
}
