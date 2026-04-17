// lib/v2/cycle-time-utils.ts
// Canonical cycle-time unit normalization for VeSiMy.
// EVERY calculation that reads a step's cycle time MUST use ctSeconds() or ctInSeconds().
// Never read s.cycle_time directly in a numeric context — the stored value is in the
// unit specified by s.cycle_time_unit, which is NOT always seconds.

const UNIT_TO_SECONDS: Record<string, number> = {
  seconds: 1,
  minutes: 60,
  hours:   3600,
  days:    86400,
  weeks:   604800,
}

/**
 * Convert a raw cycle_time value + unit string to seconds.
 * Returns 0 for null/undefined/NaN/negative.
 */
export function toSeconds(
  value: number | null | undefined,
  unit:  string | null | undefined
): number {
  if (value == null || isNaN(Number(value)) || Number(value) < 0) return 0
  const multiplier = UNIT_TO_SECONDS[unit ?? 'seconds'] ?? 1
  return Number(value) * multiplier
}

/**
 * Get a step's cycle time in seconds, preferring a stopwatch measurement
 * (toolData.stopwatch.mean) over the manually-entered cycle_time.
 * The stopwatch stores its mean in milliseconds — divide by 1000.
 */
export function ctSeconds(step: {
  cycle_time?:      number | null
  cycle_time_unit?: string | null
  toolData?:        Record<string, any> | null
}): number {
  const swMean = step.toolData?.stopwatch?.mean
  if (swMean && swMean > 0) {
    // StopwatchTool stores laps in ms; mean is in ms too
    return swMean / 1000
  }
  return toSeconds(step.cycle_time, step.cycle_time_unit)
}

/**
 * Format a seconds value to a human-readable string.
 */
export function fmtSeconds(s: number): string {
  if (!s || s <= 0) return '—'
  if (s < 60)     return `${Math.round(s)}s`
  if (s < 3600)   return `${(s / 60).toFixed(1)}m`
  if (s < 86400)  return `${(s / 3600).toFixed(2)}h`
  return `${(s / 86400).toFixed(1)}d`
}
