// lib/v2/process-metrics.ts
// Single canonical source of truth for ALL process metric calculations.
// Import this instead of writing inline PCE/lead-time formulas.
// Replaces 6+ divergent implementations found across the codebase.

import { ctSeconds } from './cycle-time-utils'

export interface ProcessMetrics {
  /** Only steps where is_main_flow !== false */
  mainSteps:  any[]
  /** Sum of main-flow step cycle times (seconds) */
  totalCT:    number
  /** Sum of main-flow step wait times (seconds) */
  totalWait:  number
  /** totalCT + totalWait (seconds) */
  leadTime:   number
  /** Sum of VA-only step cycle times (seconds) */
  vaCT:       number
  /**
   * Process Cycle Efficiency: vaCT / leadTime × 100
   * null  = cannot be calculated (no VA steps classified, or leadTime = 0)
   * 0-100 = valid percentage
   */
  pce:        number | null
  /** Calculated takt time in seconds, or null if insufficient data */
  takt:       number | null
  /**
   * Primary bottleneck step (highest CT over takt), or null if takt unknown.
   * Uses relative bottleneck (CT > 1.5× avg) when takt is not set.
   */
  bottleneck: any | null
  /** Sum of WIP across ALL steps (including branches) */
  totalWIP:   number
  /** Count of steps with missing cycle-time data */
  missingCTCount: number
}

export function calcProcessMetrics(
  steps:    any[],
  project?: {
    takt_time?:          number | string | null
    demand?:             number | string | null
    available_time_sec?: number | string | null
    working_hours?:      number | string | null
  }
): ProcessMetrics {
  const allSteps  = steps ?? []
  const mainSteps = allSteps.filter(s => s.is_main_flow !== false)

  const totalCT   = mainSteps.reduce((a, s) => a + ctSeconds(s), 0)
  const totalWait = mainSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const leadTime  = totalCT + totalWait

  // VA cycle time, requires explicit va_type OR is_value_added classification
  const vaSteps = mainSteps.filter(s =>
    s.va_type === 'va' || s.is_value_added === 'va'
  )
  const vaCT = vaSteps.reduce((a, s) => a + ctSeconds(s), 0)

  // PCE is null when: no VA steps classified, or lead time is 0
  const pce = (leadTime > 0 && vaSteps.length > 0)
    ? (vaCT / leadTime) * 100
    : null

  // Takt: explicit field first, then demand÷available_time calculation
  let takt: number | null = null
  if (project) {
    if (project.takt_time && Number(project.takt_time) > 0) {
      takt = Number(project.takt_time)
    } else if (project.demand && Number(project.demand) > 0) {
      const availSec = project.available_time_sec
        ? Number(project.available_time_sec)
        : project.working_hours
          ? Number(project.working_hours) * 3600
          : 0
      if (availSec > 0) takt = availSec / Number(project.demand)
    }
  }

  // Bottleneck: CT > takt when takt is set; otherwise CT > 1.5× average
  let bottleneck: any | null = null
  if (takt && takt > 0) {
    const overTakt = mainSteps
      .filter(s => ctSeconds(s) > takt!)
      .sort((a, b) => ctSeconds(b) - ctSeconds(a))
    bottleneck = overTakt[0] ?? null
  } else if (mainSteps.length > 1) {
    const avg = totalCT / mainSteps.length
    if (avg > 0) {
      const over = mainSteps
        .filter(s => ctSeconds(s) > avg * 1.5)
        .sort((a, b) => ctSeconds(b) - ctSeconds(a))
      bottleneck = over[0] ?? null
    }
  }

  const totalWIP     = allSteps.reduce((a, s) => a + (Number(s.wip) || 0), 0)
  const missingCTCount = mainSteps.filter(s => ctSeconds(s) === 0).length

  return {
    mainSteps, totalCT, totalWait, leadTime,
    vaCT, pce, takt, bottleneck, totalWIP, missingCTCount,
  }
}

/**
 * Format a PCE value for display.
 * null  → ','   (classification not done)
 * 0–100 → 'X.X%'
 */
export function fmtPCE(pce: number | null): string {
  if (pce == null) return ','
  return `${pce.toFixed(1)}%`
}

/**
 * PCE colour: green ≥60, amber 30–59, red <30, grey for null.
 */
export function pceColor(pce: number | null): string {
  if (pce == null) return '#706E6B'
  if (pce >= 60)   return '#1DD1A1'
  if (pce >= 30)   return '#F4A623'
  return '#FF6B6B'
}
