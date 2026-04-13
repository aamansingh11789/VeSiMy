// @ts-nocheck
// ── lib/health-score.ts ───────────────────────────────────────────────────────
import type { Step } from './store'

export interface HealthScore {
  total: number; label: string; color: string
  lead_time: number; bottleneck: number; waiting: number; defect: number
}

export function calcHealth(steps: Step[]): HealthScore {
  if (!steps?.length) return { total:0, label:'No Data', color:'#4E4B45', lead_time:0, bottleneck:0, waiting:0, defect:0 }

  const totalCT   = steps.reduce((a,s) => a+(s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0), 0)
  const totalWait = steps.reduce((a,s) => a+(Number(s.wait_time)||0), 0)
  const avgDefect = steps.reduce((a,s) => a+(Number(s.defect_rate)||0), 0) / steps.length
  const cts       = steps.map(s => s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0).filter(v=>v>0)
  const avgCT     = cts.length ? cts.reduce((a,b)=>a+b,0)/cts.length : 0
  const bottlenecks = cts.filter(ct => ct > avgCT*1.5).length

  const lr         = totalCT+totalWait > 0 ? totalWait/(totalCT+totalWait) : 0
  const lead_time  = Math.max(0, Math.round(100 - lr*100))
  const bottleneck = Math.max(0, Math.round(100 - (bottlenecks/Math.max(steps.length,1))*100))
  const avgW       = totalWait/steps.length
  const waiting    = Math.max(0, Math.round(100 - Math.min(avgCT>0?avgW/avgCT:1, 2)*50))
  const defect     = Math.max(0, Math.round(100 - Math.min(avgDefect,10)*10))
  const total      = Math.round(lead_time*0.30 + bottleneck*0.30 + waiting*0.25 + defect*0.15)

  let label: string, color: string
  if      (total>=85) { label='Excellent'; color='#1DD1A1' }
  else if (total>=70) { label='Good';      color='#1090D4' }
  else if (total>=50) { label='Fair';      color='#F4A623' }
  else if (total>=30) { label='Poor';      color='#FF8C00' }
  else                { label='Critical';  color='#FF6B6B' }

  return { total, label, color, lead_time, bottleneck, waiting, defect }
}
