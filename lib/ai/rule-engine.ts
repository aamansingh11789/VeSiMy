// @ts-nocheck
// ── lib/ai/rule-engine.ts ────────────────────────────────────────────────────
// Rule-based analysis — free forever, runs in the API route with zero cost.
// Used as fallback when no AI key is configured, AND as a fast first pass
// before any AI call.

// ── Time Study interpreter ───────────────────────────────────────────────────
export function interpretTimeStudy(laps: number[], mean: number, baseline?: number): string {
  if (!laps.length || mean === 0) return 'Add at least 3 observations to get an interpretation.'

  const lines: string[] = []
  const n = laps.length
  const cv = n > 1 ? (Math.sqrt(laps.reduce((a,l)=>a+Math.pow(l-mean,2),0)/(n-1))/mean*100) : 0
  const max = Math.max(...laps)
  const min = Math.min(...laps)
  const outliers = laps.filter(l => Math.abs(l-mean)/mean > 0.3)

  // Sample size
  if (n < 5)  lines.push(`⚠ Sample too small (${n} observations). ILO standards recommend at least 10 for statistical confidence. Collect more before setting an official CT.`)
  else if (n < 10) lines.push(`ℹ Sample size is ${n}. Target 10+ observations for full statistical confidence.`)
  else lines.push(`✓ Sample size is adequate (${n} observations).`)

  // Variation
  if (cv > 25)      lines.push(`⚠ High variation detected (CV = ${cv.toFixed(1)}%). The process is unstable. Investigate what's different between the fastest (${min.toFixed(0)}s) and slowest (${max.toFixed(0)}s) cycles before setting a standard CT. Consider a Fishbone or 5 Why.`)
  else if (cv > 15) lines.push(`ℹ Moderate variation (CV = ${cv.toFixed(1)}%). Acceptable for now — monitor over time. The range of ${(max-min).toFixed(0)}s suggests some step elements may vary by operator or condition.`)
  else              lines.push(`✓ Process is stable (CV = ${cv.toFixed(1)}%). Variation is within acceptable limits.`)

  // Outliers
  if (outliers.length > 0) lines.push(`ℹ ${outliers.length} outlier${outliers.length>1?'s':''} detected (>30% from mean). If excluded due to interruptions, document the reason. If they represent real cycles, investigate the cause before excluding.`)

  // Baseline comparison
  if (baseline && baseline > 0) {
    const pct = ((baseline - mean) / baseline * 100)
    if (pct > 0)  lines.push(`✓ ${pct.toFixed(1)}% improvement from baseline (${(baseline/1000).toFixed(0)}s → ${(mean/1000).toFixed(0)}s). Confirmed improvement.`)
    else if (pct < 0) lines.push(`⚠ Performance regression: ${Math.abs(pct).toFixed(1)}% slower than baseline. Investigate changes since baseline was set.`)
  }

  // Recommendation
  lines.push(`→ Recommended official CT: ${(mean/1000).toFixed(1)}s. Enter this as the step cycle time in your VSM.`)

  return lines.join('\n\n')
}


// ── Waste prioritiser ────────────────────────────────────────────────────────
const WASTE_IMPACT = {
  D:  { name: 'Defects',        score: 10, note: 'Defects create rework, scrap, and customer risk. Always priority #1.' },
  O:  { name: 'Overproduction', score:  9, note: 'Overproduction drives all other wastes. Hardest to recover from.' },
  W:  { name: 'Waiting',        score:  8, note: 'Waiting is visible lead time waste. Usually fast to reduce.' },
  I:  { name: 'Inventory',      score:  7, note: 'Excess WIP hides problems and ties up capital.' },
  T:  { name: 'Transport',      score:  6, note: 'Unnecessary movement adds lead time without value.' },
  O2: { name: 'Over-processing',score:  5, note: 'Work the customer does not require. Often tied to unclear specs.' },
  M:  { name: 'Motion',         score:  4, note: 'Ergonomic risk and minor time loss. Easier to fix but lower immediate ROI.' },
  S:  { name: 'Skills',         score:  3, note: 'Underused talent. Important for culture but hard to quantify short-term.' },
}

export function prioritiseWastes(selected: string[], notes: Record<string,string>): string {
  if (!selected.length) return 'Select at least one waste to get a priority recommendation.'

  const ranked = selected
    .map(id => ({ id, ...(WASTE_IMPACT[id as keyof typeof WASTE_IMPACT] || { name: id, score: 5, note: 'Address through standard lean analysis.' }) }))
    .sort((a,b) => b.score - a.score)

  const lines = ['Recommended priority order for this step:\n']
  ranked.forEach((w, i) => {
    lines.push(`${i+1}. ${w.name}${notes[w.id] ? ` — "${notes[w.id]}"` : ''}\n   ${w.note}`)
  })
  lines.push(`\n→ Open a Kaizen event for ${ranked[0].name} first. It has the highest impact-to-effort ratio of your selected wastes.`)

  return lines.join('\n')
}


// ── Improvement target suggester ─────────────────────────────────────────────
export function suggestImprovementTarget(
  metric: string, baseline: number, isBottleneck: boolean, takt?: number
): { target: number; rationale: string; timeline: string } {
  let pct = 0.20 // default 20% improvement
  let rationale = ''
  let timeline = '60–90 days'

  const m = metric.toLowerCase()

  if (m.includes('cycle time')) {
    if (isBottleneck && takt && baseline > takt) {
      // Must get below takt
      const mustReduce = ((baseline - takt) / baseline * 100)
      pct = Math.min(0.40, (mustReduce + 10) / 100) // 10% below takt
      rationale = `Bottleneck step must reach Takt (${takt}s). Target is 10% below Takt for buffer.`
      timeline = '30–45 days (urgent — this is the constraint)'
    } else {
      pct = 0.20
      rationale = 'A 20% CT reduction is achievable in a first Kaizen cycle through waste elimination and method improvement without capital investment.'
      timeline = '60–90 days'
    }
  } else if (m.includes('defect') || m.includes('scrap')) {
    pct = 0.50
    rationale = 'A 50% defect reduction is a typical first-cycle target after root cause identification. Further reductions require process capability work (Cpk analysis).'
    timeline = '30–60 days'
  } else if (m.includes('wait')) {
    pct = 0.40
    rationale = 'Wait time reductions of 40%+ are achievable through batch size reduction, one-piece flow, or pull signaling — all low-cost interventions.'
    timeline = '14–30 days'
  } else if (m.includes('oee') || m.includes('uptime')) {
    pct = 0.15
    rationale = 'A 15% OEE improvement is realistic in the first 90 days through planned maintenance and setup reduction (SMED). Beyond that requires TPM programme.'
    timeline = '90 days'
  } else if (m.includes('lead time')) {
    pct = 0.30
    rationale = 'Lead time reductions of 30% are achievable through WIP reduction and flow improvement without equipment investment.'
    timeline = '60–90 days'
  } else {
    pct = 0.20
    rationale = 'A 20% improvement is the standard first-cycle lean target — achievable through waste elimination before requiring capital expenditure.'
    timeline = '60–90 days'
  }

  const target = metric.toLowerCase().includes('defect') || metric.toLowerCase().includes('scrap')
    ? Math.max(0, baseline * (1 - pct))
    : metric.toLowerCase().includes('uptime') || metric.toLowerCase().includes('oee') || metric.toLowerCase().includes('quality')
      ? Math.min(100, baseline * (1 + pct))
      : baseline * (1 - pct)

  return { target: Math.round(target * 10) / 10, rationale, timeline }
}


// ── 5 Why prompt library ─────────────────────────────────────────────────────
// When no AI is available, these help teams break through "don't know" moments.
export function suggestNextWhy(level: number, prevAnswer: string): string {
  const prev = prevAnswer.toLowerCase()

  // Pattern-match the previous answer to suggest a useful direction
  if (prev.includes('not trained') || prev.includes('no training')) {
    return `Why was training not completed / kept current?`
  }
  if (prev.includes('procedure') || prev.includes('process') || prev.includes('sop')) {
    return `Why does the procedure not prevent this outcome?`
  }
  if (prev.includes('time') || prev.includes('busy') || prev.includes('workload')) {
    return `Why was there insufficient time or capacity allocated?`
  }
  if (prev.includes('aware') || prev.includes('know') || prev.includes('told')) {
    return `Why was this information not communicated or accessible?`
  }
  if (prev.includes('machine') || prev.includes('equipment') || prev.includes('tool')) {
    return `Why was the equipment in this condition / not maintained?`
  }
  if (prev.includes('standard') || prev.includes('spec') || prev.includes('requirement')) {
    return `Why is the standard not being followed consistently?`
  }
  if (prev.includes('check') || prev.includes('inspect') || prev.includes('verify')) {
    return `Why does the check / inspection not catch this earlier?`
  }

  // Generic prompts by level
  const generics = [
    'Why did this condition exist?',
    'Why was this not detected or prevented?',
    'Why does the system allow this to happen?',
    'Why is there no safeguard against this?',
    'Why has this not been addressed before?',
  ]
  return generics[Math.min(level - 1, generics.length - 1)]
}


// ── Yamazumi rebalancer ──────────────────────────────────────────────────────
export function suggestYamazumiRebalance(
  operators: { stepName: string; tasks: { name: string; time: number; va_type: string; step_type?: string }[]; totalTime: number }[],
  takt: number
): string {
  if (!operators.length || takt === 0) return 'Add operator steps and set Takt Time to get a rebalance suggestion.'

  const overloaded  = operators.filter(o => o.totalTime > takt * 1.02)
  const underloaded = operators.filter(o => o.totalTime < takt * 0.85)

  if (!overloaded.length) return '✓ No operators are over Takt Time. Line is balanced.'
  if (!underloaded.length) {
    return `⚠ ${overloaded.length} operator${overloaded.length>1?'s are':' is'} over Takt but no capacity exists to absorb work. Options:\n1. Add an operator to the line\n2. Reduce NVA tasks at overloaded stations\n3. Revisit the Takt Time calculation (demand rate or available time)`
  }

  const lines: string[] = [`Rebalancing recommendation (Takt = ${takt}s):\n`]

  overloaded.forEach(op => {
    const excess = op.totalTime - takt
    const nvaWork = op.tasks.filter(t => t.va_type === 'nva')
    const recipient = underloaded.sort((a,b) => a.totalTime - b.totalTime)[0]
    const capacity = takt - recipient.totalTime

    lines.push(`Overloaded: ${op.stepName} (${op.totalTime}s, ${((op.totalTime-takt)/takt*100).toFixed(0)}% over)`)

    if (nvaWork.length) {
      const nvaTotal = nvaWork.reduce((a,t)=>a+t.time,0)
      lines.push(`  → Eliminate NVA tasks first: ${nvaWork.map(t=>t.name).join(', ')} (${nvaTotal}s total)`)
    }

    if (capacity > 0) {
      // Find transferable tasks that fit capacity
      const moveable = op.tasks
        .filter(t => t.va_type !== 'nva' && t.time <= capacity)
        .sort((a,b) => b.time - a.time)

      if (moveable.length) {
        lines.push(`  → Move to ${recipient.stepName} (${Math.round(capacity)}s available): "${moveable[0].name}" (${moveable[0].time}s)`)
      }
    }
  })

  return lines.join('\n')
}


// ── Step quick-diagnosis ─────────────────────────────────────────────────────
export function diagnoseStep(step: {
  name: string; cycle_time?: number; wait_time?: number; va_type?: string;
  wip?: number; defect_rate?: number; uptime?: number;
  toolData?: { waste?: { selected?: string[] }; fivewhy?: { rootCause?: string }; kaizen?: { items?: any[] } }
}, takt?: number): string {
  const lines: string[] = []
  const ct = step.toolData?.stopwatch?.mean || Number(step.cycle_time) || 0
  const wt = Number(step.wait_time) || 0
  const openKaizens = (step.toolData?.kaizen?.items || []).filter((k:any) => k.status !== 'complete' && k.status !== 'verified')
  const wastes = step.toolData?.waste?.selected || []
  const hasRoot = !!(step.toolData?.fivewhy?.rootCause)

  if (takt && ct > 0 && ct > takt * 1.05) {
    lines.push(`BOTTLENECK: This step runs ${((ct-takt)/takt*100).toFixed(0)}% over Takt (${ct}s vs ${takt}s). This is your constraint — it determines the output rate of the entire line.`)
  }

  if (wt > ct && ct > 0) {
    lines.push(`⚠ Wait time (${wt}s) exceeds cycle time (${ct}s). This step spends more time waiting than working — a strong signal for batch reduction or pull system implementation.`)
  }

  if (step.wip && step.wip > 5) {
    lines.push(`⚠ ${step.wip} units queued at this step (WIP). Elevated WIP hides problems and increases lead time. Target: reduce to 1–3 units maximum.`)
  }

  if (step.defect_rate && step.defect_rate > 1) {
    const action = hasRoot ? 'Root cause has been identified — ensure countermeasure is implemented and verified.' : 'No root cause analysis on file. Open a 5 Why to find the systemic cause.'
    lines.push(`⚠ Defect rate of ${step.defect_rate}% is above the 1% threshold. ${action}`)
  }

  if (wastes.length >= 3) {
    lines.push(`ℹ ${wastes.length} waste types identified at this step. This is a high-priority Kaizen candidate. Run a Fishbone to find the systemic causes before jumping to solutions.`)
  }

  if (openKaizens.length > 0) {
    lines.push(`ℹ ${openKaizens.length} open Kaizen event${openKaizens.length>1?'s':''} at this step. Ensure ownership and due dates are assigned.`)
  }

  if (step.uptime && step.uptime < 85) {
    lines.push(`⚠ Machine uptime is ${step.uptime}%. Below 85% indicates maintenance issues. Consider a TPM or PM schedule review.`)
  }

  if (!lines.length) {
    if (ct === 0) return 'No cycle time data yet. Run a Time Study to get data-driven recommendations for this step.'
    return '✓ No critical issues detected at this step based on current data. Keep monitoring and run a Time Study if cycle time data is missing.'
  }

  return lines.join('\n\n')
}
