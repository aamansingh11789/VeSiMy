// TypeScript enabled
// lib/health-score.ts
// Revised per VeSiMy Deep Review:
//   - Returns null score until 3+ steps have real cycle time data
//   - Adds operator balance score (new: 10% weight)
//   - Increases defect weight to 20% (from 15%)
//   - Correct formula: lead_time 0.25 + bottleneck 0.25 + waiting 0.20 + defect 0.20 + balance 0.10

import { calcProcessMetrics } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import type { Step } from './store'

export interface HealthScore {
  total:      number | null  // null = insufficient data (< 3 steps with CT)
  label:      string
  color:      string
  lead_time:  number
  bottleneck: number
  waiting:    number
  defect:     number
  balance:    number
  hasData:    boolean
}

export function calcHealth(steps: Step[]): HealthScore {
  const noData: HealthScore = {
    total: null, label: 'No Data', color: '#94A3B8',
    lead_time: 0, bottleneck: 0, waiting: 0, defect: 0, balance: 0,
    hasData: false,
  }

  if (!steps?.length) return noData

  const { mainSteps, totalCT, totalWait, leadTime, bottleneck } =
    calcProcessMetrics(steps as any[])

  // REVIEW FIX #19: Require at least 3 steps with cycle time data
  // An empty or sparse project was incorrectly showing "Good" health
  const stepsWithCT = mainSteps.filter(s => ctSeconds(s) > 0)
  if (stepsWithCT.length < 3) return { ...noData, hasData: stepsWithCT.length > 0 }

  // ── Lead time score (efficiency of flow) ─────────────────────────
  // Lower wait/lead ratio = better flow efficiency
  const lr        = leadTime > 0 ? totalWait / leadTime : 0
  const lead_time = Math.max(0, Math.round(100 - lr * 100))

  // ── Bottleneck score (how severe is the constraint) ───────────────
  const cts   = stepsWithCT.map(s => ctSeconds(s))
  const avgCT = cts.length ? cts.reduce((a, b) => a + b, 0) / cts.length : 0
  const bnCt  = bottleneck ? ctSeconds(bottleneck) : 0
  const bnScore = avgCT > 0 && bnCt > 0
    ? Math.max(0, Math.round(100 - ((bnCt / avgCT - 1) * 100)))
    : 100

  // ── Waiting score (wait time relative to cycle time) ─────────────
  const avgWait = mainSteps.length ? totalWait / mainSteps.length : 0
  const waiting = avgCT > 0
    ? Math.max(0, Math.round(100 - Math.min(avgWait / avgCT, 2) * 50))
    : 100

  // ── Defect score (quality penalty) ───────────────────────────────
  // REVIEW FIX: 10%+ defect rate should be "Critical", scaled to 0-100
  const avgDefect = mainSteps.length
    ? mainSteps.reduce((a, s) => a + (Number(s.defect_rate) || 0), 0) / mainSteps.length
    : 0
  // 0% defect = 100, 5% defect = 50, 10%+ defect = 0
  const defect = Math.max(0, Math.round(100 - Math.min(avgDefect, 10) * 10))

  // ── Balance score (REVIEW FIX: line balance efficiency) ──────────
  // Measures variation in cycle time across operators/steps
  // Perfect balance = all steps at same CT = score 100
  // High variation = one step is a hard bottleneck = score drops
  const maxCT = Math.max(...cts)
  const minCT = Math.min(...cts)
  const balance = maxCT > 0
    ? Math.max(0, Math.round((1 - (maxCT - minCT) / maxCT) * 100))
    : 100

  // ── Weighted total ────────────────────────────────────────────────
  // REVIEW FIX: Revised weights
  //   lead_time  0.25 (was 0.30)
  //   bottleneck 0.25 (was 0.30)
  //   waiting    0.20 (was 0.25)
  //   defect     0.20 (was 0.15) ← increased
  //   balance    0.10 (was 0.00) ← new
  const total = Math.round(
    lead_time  * 0.25 +
    bnScore    * 0.25 +
    waiting    * 0.20 +
    defect     * 0.20 +
    balance    * 0.10
  )

  let label: string, color: string
  if      (total >= 85) { label = 'Excellent'; color = '#3A5A7D' }
  else if (total >= 70) { label = 'Good';      color = '#3A5A7D' }
  else if (total >= 50) { label = 'Fair';      color = '#D97706' }
  else if (total >= 30) { label = 'Poor';      color = '#C05621' }
  else                  { label = 'Critical';  color = '#C0180C' }

  return { total, label, color, lead_time, bottleneck: bnScore, waiting, defect, balance, hasData: true }
}
