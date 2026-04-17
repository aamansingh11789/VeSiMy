// @ts-nocheck
// lib/health-score.ts — uses canonical process-metrics for all calculations.
import { calcProcessMetrics } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import type { Step } from './store'

export interface HealthScore {
  total: number; label: string; color: string
  lead_time: number; bottleneck: number; waiting: number; defect: number
}

export function calcHealth(steps: Step[]): HealthScore {
  if (!steps?.length) return { total:0, label:'No Data', color:'#4E4B45', lead_time:0, bottleneck:0, waiting:0, defect:0 }

  const { mainSteps, totalCT, totalWait, leadTime, bottleneck } = calcProcessMetrics(steps as any[])

  const lr        = leadTime > 0 ? totalWait / leadTime : 0
  const lead_time = Math.max(0, Math.round(100 - lr * 100))

  const cts   = mainSteps.map(s => ctSeconds(s)).filter(v => v > 0)
  const avgCT = cts.length ? cts.reduce((a, b) => a + b, 0) / cts.length : 0
  const bnCt  = bottleneck ? ctSeconds(bottleneck) : 0
  const bnScore = avgCT > 0 && bnCt > 0
    ? Math.max(0, Math.round(100 - ((bnCt / avgCT - 1) * 100)))
    : 100

  const avgWait = mainSteps.length ? totalWait / mainSteps.length : 0
  const waiting = avgCT > 0 ? Math.max(0, Math.round(100 - Math.min(avgWait / avgCT, 2) * 50)) : 100

  const avgDefect = mainSteps.length
    ? mainSteps.reduce((a, s) => a + (Number(s.defect_rate) || 0), 0) / mainSteps.length
    : 0
  const defect = Math.max(0, Math.round(100 - Math.min(avgDefect, 10) * 10))

  const total = Math.round(lead_time * 0.30 + bnScore * 0.30 + waiting * 0.25 + defect * 0.15)

  let label: string, color: string
  if      (total >= 85) { label = 'Excellent'; color = '#1DD1A1' }
  else if (total >= 70) { label = 'Good';      color = '#1090D4' }
  else if (total >= 50) { label = 'Fair';      color = '#F4A623' }
  else if (total >= 30) { label = 'Poor';      color = '#FF8C00' }
  else                  { label = 'Critical';  color = '#FF6B6B' }

  return { total, label, color, lead_time, bottleneck: bnScore, waiting, defect }
}
