// TypeScript enabled, @ts-nocheck removed as part of quality pass
// lib/supe-engine.ts, rule-based lean analysis engine.
// Uses main-flow steps only and canonical ctSeconds() for all CT values.
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import type { Step } from './store'

export type Severity  = 'high' | 'medium' | 'low'
export type IssueType = 'bottleneck' | 'quality' | 'smed' | 'waiting' | 'capacity'

export interface SupeRec {
  key:        string
  step_id?:   string
  step_name?: string
  issue_type: IssueType
  severity:   Severity
  suggestion: string
  principle:  string
}

function fmt(s: number) {
  if (!s) return '0s'
  if (s < 60)   return `${Math.round(s)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(1)}h`
}

export function analyzeSteps(steps: Step[]): SupeRec[] {
  if (!steps?.length) return []

  // FIX: only analyse main-flow steps, branches must not pollute avg CT
  const mainSteps = steps.filter(s => (s as any).is_main_flow !== false)
  if (!mainSteps.length) return []

  const recs: SupeRec[] = []
  const seen  = new Set<string>()
  function add(r: Omit<SupeRec, 'key'>) {
    const key = `${r.step_id || 'p'}-${r.issue_type}`
    if (seen.has(key)) return
    seen.add(key)
    recs.push({ ...r, key })
  }

  // FIX: use ctSeconds for consistent unit handling
  const cts   = mainSteps.map(s => ctSeconds(s)).filter(v => v > 0)
  const avgCT = cts.length ? cts.reduce((a, b) => a + b, 0) / cts.length : 0

  mainSteps.forEach(s => {
    const ct     = ctSeconds(s)
    const wait   = Number(s.wait_time)   || 0
    const setup  = Number((s as any).setup_time) || 0
    const defect = Number(s.defect_rate) || 0
    const uptime = Number(s.uptime)      || 0
    const wastes = ((s as any).toolData?.waste?.selected || []).length

    if (ct > 0 && avgCT > 0 && ct > avgCT * 1.5)
      add({ step_id: s.id, step_name: s.name, issue_type: 'bottleneck',
        severity: ct > avgCT * 2 ? 'high' : 'medium',
        suggestion: `"${s.name}" cycle time (${fmt(ct)}) is ${Math.round((ct / avgCT - 1) * 100)}% above process average. Balance load or split tasks. Target: within 10% of takt time.`,
        principle: 'Line Balancing' })

    if (wait > 0 && ct > 0 && wait > ct)
      add({ step_id: s.id, step_name: s.name, issue_type: 'waiting',
        severity: wait > ct * 3 ? 'high' : 'medium',
        suggestion: `Wait time (${fmt(wait)}) exceeds cycle time (${fmt(ct)}) at "${s.name}". Check upstream batch sizes or downstream blockage.`,
        principle: '7 Wastes, Waiting' })

    if (setup > 600)
      add({ step_id: s.id, step_name: s.name, issue_type: 'smed',
        severity: setup > 1800 ? 'high' : 'medium',
        suggestion: `Setup time of ${fmt(setup)} at "${s.name}" is a SMED opportunity. Convert internal setup to external. Target: under 10 minutes.`,
        principle: 'SMED' })

    if (defect > 2)
      add({ step_id: s.id, step_name: s.name, issue_type: 'quality',
        severity: defect > 10 ? 'high' : defect > 5 ? 'medium' : 'low',
        suggestion: `${defect}% defect rate at "${s.name}". Apply poka-yoke (error-proofing) or Jidoka. Run a 5-Why analysis.`,
        principle: 'Poka-yoke / Jidoka' })

    if (uptime > 0 && uptime < 85)
      add({ step_id: s.id, step_name: s.name, issue_type: 'capacity',
        severity: uptime < 70 ? 'high' : 'medium',
        suggestion: `Uptime of ${uptime}% at "${s.name}" signals reliability issues. Implement TPM and preventive scheduling. Target OEE ≥ 85%.`,
        principle: 'TPM / OEE' })

    if (wastes >= 3)
      add({ step_id: s.id, step_name: s.name, issue_type: 'waiting',
        severity: wastes >= 5 ? 'high' : 'medium',
        suggestion: `${wastes} waste types at "${s.name}". Schedule a Kaizen event targeting the top 3 wastes.`,
        principle: 'Kaizen Event' })
  })

  // Process-level PCE warning
  const totalCT   = mainSteps.reduce((a, s) => a + ctSeconds(s), 0)
  const totalWait = mainSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  if (totalCT > 0 && totalWait > 0 && totalCT / (totalCT + totalWait) < 0.10)
    add({ issue_type: 'waiting', severity: 'high',
      suggestion: `Process Cycle Efficiency is ${((totalCT / (totalCT + totalWait)) * 100).toFixed(1)}%. Over 90% of lead time is non-value-added. Implement pull system and one-piece flow.`,
      principle: 'Flow & Pull' })

  const order: Record<Severity, number> = { high: 0, medium: 1, low: 2 }
  return recs.sort((a, b) => order[a.severity] - order[b.severity])
}

export const ISSUE_LABEL: Record<IssueType, string> = {
  bottleneck: 'Bottleneck', quality: 'Quality Issue',
  smed: 'Setup Reduction (SMED)', waiting: 'Excess Waiting', capacity: 'Capacity / Uptime',
}
export const SEV_COLOR: Record<Severity, string> = { high: '#FF6B6B', medium: '#F4A623', low: '#1090D4' }
