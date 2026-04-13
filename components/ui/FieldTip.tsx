// @ts-nocheck
'use client'
import { AlertIcon } from '@/components/ui/Icons'
import React from 'react'
// ── components/ui/FieldTip.tsx ─────────────────────────────────────────────
// Reusable "?" tooltip button + label wrapper used across all CI tool forms.
// Plain-English definitions for every term a new user might encounter.

import { useEffect, useRef, useState } from 'react'

// ── All term definitions ───────────────────────────────────────────────────
export const TERM_TIPS: Record<string, { title: string; body: string; unit?: string }> = {

  // ── Step fields ──────────────────────────────────────────────────────────
  cycle_time: {
    title: 'Cycle Time',
    body: 'The time from when one unit STARTS a step to when it is complete and the next can begin. The most important lean measurement.\n\nIf Cycle Time > Takt Time, this step is your bottleneck and cannot keep up with customer demand.\n\nAlways measure with a stopwatch — never estimate.',
    unit: 'seconds',
  },
  wait_time: {
    title: 'Wait Time (Queue Time)',
    body: 'How long a unit sits WAITING before this step begins — in a queue, waiting for a machine, approval, or the previous step to finish.\n\nNot the same as cycle time. A step can take 30 seconds of work but wait 4 hours to start.\n\nWait time is almost always pure waste and the #1 driver of long lead times.',
    unit: 'seconds',
  },
  setup_time: {
    title: 'Setup / Changeover Time',
    body: 'Time to prepare a workstation, machine, or system before processing a new product type or batch.\n\nTarget of SMED improvement. Reducing setup time allows smaller batches and faster response to demand.',
    unit: 'seconds',
  },
  takt_time: {
    title: 'Takt Time',
    body: 'The maximum cycle time allowed to meet customer demand without overtime.\n\nFormula: Available working time ÷ Customer demand\n\nExample: 28,800 seconds available, 240 units ordered = 120 seconds takt time. If any step takes longer than 120 seconds, you will miss demand.\n\n"Takt" comes from the German word for a conductor\'s baton — it sets the rhythm of production.',
    unit: 'seconds',
  },
  uptime: {
    title: 'Machine / Process Uptime',
    body: 'The % of SCHEDULED time this step is actually running — not broken, in maintenance, or waiting for parts.\n\n100% = always running.\n95% = 5% of scheduled time is lost.\n\nWorld-class targets 85–95%. Leave blank for manual steps with no equipment.',
    unit: '% of scheduled time (0–100)',
  },
  defect_rate: {
    title: 'Defect / Rework Rate',
    body: 'The % of units that exit this step with a problem — requiring rework, repair, or scrapping.\n\n5% = 5 out of every 100 units need correction.\n\nEven small rates compound across a multi-step process. World-class is under 1%.',
    unit: '% of units (0–100)',
  },
  wip: {
    title: 'Work In Progress (WIP)',
    body: 'Units, patients, files, or cases sitting between this step and the previous one — started but not yet processed here.\n\nHigh WIP = imbalance or blockage. Appears as a triangle on the VSM.\n\nTarget: as close to zero as possible.',
    unit: 'units in queue',
  },
  operators: {
    title: 'Number of Operators',
    body: 'How many people are assigned to this step per cycle. Used in Yamazumi to show workload balance.\n\nUse 0 for fully automated steps.',
    unit: 'people',
  },
  lead_time: {
    title: 'Lead Time',
    body: 'The total elapsed time from when a unit enters the process to when it is delivered to the customer — including all wait times.\n\nLead time = sum of all cycle times + all wait times.\n\nReducing lead time is often more valuable to customers than reducing individual cycle times.',
    unit: 'seconds (or hours/days)',
  },
  pce: {
    title: 'Process Cycle Efficiency (PCE)',
    body: 'The % of lead time that is actually spent on value-adding work.\n\nFormula: Total VA time ÷ Total lead time × 100\n\nWorld-class manufacturing: 25%+. Most processes start at 5–10%. Low PCE means most time is spent waiting, not working.',
    unit: '% (higher is better)',
  },

  // ── Time Study ───────────────────────────────────────────────────────────
  baseline_ct: {
    title: 'Baseline Cycle Time',
    body: 'The cycle time before any improvement was made — your starting point. Used to calculate improvement % after a kaizen.\n\nCaptured from your first time study or historical records. Enter in seconds.',
    unit: 'seconds',
  },
  target_ct: {
    title: 'Target Cycle Time',
    body: 'The cycle time you are aiming to achieve after improvement — must be at or below takt time to meet demand.\n\nSet this based on root cause analysis and kaizen plans, not guesswork.',
    unit: 'seconds',
  },
  observations: {
    title: 'Number of Observations',
    body: 'How many timing measurements to take for a valid study.\n\nLean standard: minimum 10 observations. More is better — 20–30 for statistical confidence.\n\nExclude obvious outliers (machine jams, interruptions) before calculating the mean.',
  },
  coeff_variation: {
    title: 'Coefficient of Variation (CV)',
    body: 'A measure of process consistency — how much cycle times vary relative to the mean.\n\nFormula: Standard Deviation ÷ Mean × 100\n\nUnder 15% = stable, predictable process.\nOver 15% = high variation — investigate before improving. The root cause may be inconsistency, not slow speed.',
    unit: '% (lower is better)',
  },

  // ── 5 Why ────────────────────────────────────────────────────────────────
  problem_statement: {
    title: 'Problem Statement',
    body: 'A clear, specific description of the problem you are solving. A good problem statement includes:\n\n• WHAT is happening (the symptom)\n• WHERE it is happening (the step or location)\n• HOW MUCH (the measure — frequency, cost, time lost)\n\nBad: "Quality is poor"\nGood: "Foam & Fabric CT 145s exceeds Takt 120s — 3 seats/shift below target since March 2026"',
  },
  root_cause: {
    title: 'Root Cause',
    body: 'The deepest underlying reason a problem exists — the one that, if fixed, permanently eliminates the problem.\n\nA root cause is NOT the same as a symptom. "Machine broke down" is a symptom. "No preventive maintenance schedule exists" is a root cause.\n\nVerify by checking: if you fixed this cause, would the problem be eliminated permanently?',
  },
  countermeasure: {
    title: 'Countermeasure',
    body: 'The action that addresses the root cause — not just the symptom.\n\nA countermeasure is different from a quick fix. A quick fix stops the immediate pain. A countermeasure changes the system so the problem cannot recur.\n\nGood countermeasures are: specific, measurable, owned by one person, and time-bound.',
  },

  // ── Fishbone ─────────────────────────────────────────────────────────────
  fishbone_effect: {
    title: 'Effect (Problem)',
    body: 'The problem or quality defect you are analysing — the "head" of the fishbone diagram.\n\nBe specific and measurable. "CT 145s exceeds Takt 120s" is better than "slow process".\n\nEverything on the diagram is a potential cause of this effect.',
  },
  fishbone_6m: {
    title: '6M Framework',
    body: 'The 6 categories used to organise potential causes:\n\nMachine — equipment, tools, technology\nMethod — procedures, processes, work instructions\nMaterial — raw materials, components, consumables\nManpower — people, training, experience\nMeasurement — how you measure, data quality, gauges\nMother Nature (Environment) — temperature, humidity, shift patterns\n\nBrainstorm at least 2–3 causes per category before filtering.',
  },

  // ── Waste ────────────────────────────────────────────────────────────────
  waste_transport: {
    title: 'Transport Waste',
    body: 'Unnecessary movement of materials, products, or information from one location to another.\n\nExamples: walking parts across the floor, emailing documents that could be shared digitally, moving inventory between warehouses.\n\nTarget: co-locate steps. Eliminate physical movement where possible.',
  },
  waste_inventory: {
    title: 'Inventory Waste',
    body: 'Excess stock, WIP, or finished goods beyond what is immediately needed.\n\nInventory hides problems (defects, downtime, scheduling issues) and ties up cash. It is not an asset — it is a liability that delays problem detection.\n\nTarget: reduce batch sizes and WIP to expose and solve root causes.',
  },
  waste_motion: {
    title: 'Motion Waste',
    body: 'Unnecessary movement of PEOPLE or equipment — reaching, walking, turning, searching for tools or materials.\n\nDifferent from transport (which is about moving things). Motion is about the movements people make during their work.\n\nTarget: design workstations so everything needed is within arm\'s reach.',
  },
  waste_waiting: {
    title: 'Waiting Waste',
    body: 'Idle time — people or machines waiting for the next step, material, approval, or information.\n\nThe most visible waste in service processes. Patients waiting for doctors, files waiting for signatures, parts waiting for machines.\n\nTarget: balance workloads to takt time. Eliminate approval bottlenecks.',
  },
  waste_overproduction: {
    title: 'Overproduction Waste',
    body: 'Making more than what is needed, or making it before it is needed.\n\nThe worst waste because it creates all the others — excess inventory, transport, storage, and defects that may not be caught until much later.\n\nTarget: produce only what is needed, when it is needed, in the quantity needed.',
  },
  waste_overprocessing: {
    title: 'Over-processing Waste',
    body: 'Doing more work, or higher quality work, than the customer requires or can detect.\n\nExamples: polishing a surface that will be hidden, triple-checking work that only needs one check, generating reports nobody reads.\n\nTarget: ask "would the customer pay for this?" If not, eliminate or reduce it.',
  },
  waste_defects: {
    title: 'Defects Waste',
    body: 'Errors, rework, scrap, and corrections — any output that does not meet requirements on the first attempt.\n\nDefects consume resources twice: once to make the defect, and again to fix it. They also create delays and unhappy customers.\n\nTarget: build quality in at the source. Use poka-yoke (mistake-proofing) to prevent defects rather than inspecting for them.',
  },
  waste_skills: {
    title: 'Non-Utilisation of Skills (Waste)',
    body: 'Failing to use the knowledge, skills, experience, and ideas of your team.\n\nThe 8th waste — added to the original 7 by Toyota. Examples: not involving operators in improvement decisions, assigning skilled people to tasks that could be automated, ignoring shop-floor ideas.\n\nTarget: involve everyone in improvement. The people doing the work know where the waste is.',
  },

  // ── Kaizen ───────────────────────────────────────────────────────────────
  kaizen_title: {
    title: 'Kaizen Event Title',
    body: '"Kaizen" means "change for the better" in Japanese — a focused improvement action.\n\nGive each kaizen a clear, action-oriented title:\n"Relocate foam rack to point of use" — specific and actionable\n"Improve quality" — too vague\n\nOne title = one clear improvement action.',
  },
  kaizen_priority: {
    title: 'Priority Level',
    body: 'How urgently this improvement needs to be addressed.\n\nCritical — blocking production or safety issue. Fix immediately.\nHigh — significant impact on quality, cost, or delivery. Fix this sprint.\nMedium — improvement opportunity. Plan into next 30–60 days.\nLow — nice-to-have. Backlog for future.',
  },
  kaizen_category: {
    title: 'Improvement Category',
    body: 'The type of improvement this kaizen addresses.\n\nQuality — reducing defects, errors, rework\nProductivity — faster cycle time, better uptime, reduced waste\nSafety — reducing injury risk, ergonomic improvement\nCost — direct cost reduction\nDelivery — improving on-time delivery or lead time\nMorale — improving team engagement and work environment',
  },
  kaizen_owner: {
    title: 'Owner',
    body: 'The single person responsible for completing this kaizen action.\n\nOne owner per action — not a team. If everyone owns it, no one owns it.\n\nThe owner does not have to do all the work, but they are accountable for the action being completed by the due date.',
  },
  kaizen_due: {
    title: 'Due Date',
    body: 'The target date to have this improvement completed and verified.\n\nKaizen actions without due dates are not kaizen actions — they are wishes.\n\nSet a realistic date. Critical items should be days, not months. If it takes more than 30 days, break it into smaller actions.',
  },

  // ── Improvement Goals ────────────────────────────────────────────────────
  improvement_metric: {
    title: 'Improvement Metric',
    body: 'What you are measuring to track progress.\n\nBe specific: "Cycle Time (seconds)", not "speed".\n"Defect Rate (%)", not "quality".\n\nA good metric is: measurable with a number, clearly owned, and directly connected to a customer or business need.',
  },
  improvement_baseline: {
    title: 'Baseline Value',
    body: 'The current measured value before improvement begins — your starting point.\n\nThis must be a real measurement, not an estimate. If you do not have a baseline, your first action is to measure.\n\nWithout a baseline, you cannot prove improvement happened.',
  },
  improvement_target: {
    title: 'Target Value',
    body: 'The value you are aiming to achieve after improvement is complete.\n\nSet targets based on: takt time requirements, industry benchmarks, or root cause analysis.\n\nA stretch target pushes the team. An impossible target demoralises them. Aim for 20–50% improvement in the first kaizen cycle.',
  },
  improvement_actual: {
    title: 'Actual (Result)',
    body: 'The measured value after the improvement has been implemented.\n\nFill this in after you have verified the improvement is sustained — not just on the first day. Measure over at least 5–10 cycles.\n\nThis is what goes in your A3 report as proof of improvement.',
  },

  // ── SMED ─────────────────────────────────────────────────────────────────
  smed_internal: {
    title: 'Internal Setup Time',
    body: 'Setup tasks that REQUIRE the machine or process to be stopped.\n\nExamples: removing tooling, loading raw material, calibrating equipment.\n\nSMED goal: convert as many internal tasks to external as possible. Only truly machine-dependent tasks should stay internal.',
  },
  smed_external: {
    title: 'External Setup Time',
    body: 'Setup tasks that CAN BE DONE while the machine is still running — before the changeover begins.\n\nExamples: gathering tools, pre-staging materials, preparing paperwork, pre-warming components.\n\nExternal tasks do NOT add to changeover time if done before the machine stops. This is the biggest SMED opportunity.',
  },
  smed_changeover: {
    title: 'Changeover Time',
    body: 'The total time from the LAST GOOD PART of one run to the FIRST GOOD PART of the next.\n\nThis is the measure SMED targets. It starts when the machine stops and ends when production is confirmed running at quality.\n\nSMED (Single Minute Exchange of Die) aims to reduce changeover to under 10 minutes.',
  },

  // ── PDCA ─────────────────────────────────────────────────────────────────
  pdca_plan: {
    title: 'Plan',
    body: 'Define the problem, analyse the root cause, and set a measurable target.\n\nOutputs: clear problem statement, root cause confirmed (5 Why or fishbone), specific target condition, list of countermeasures, timeline, and owner.\n\nDo not skip planning. A well-planned kaizen is 80% complete before implementation begins.',
  },
  pdca_do: {
    title: 'Do',
    body: 'Implement countermeasures on a SMALL SCALE first — a pilot, a single shift, or one workstation.\n\nDocument everything you do. Note unexpected obstacles. Do not full-scale rollout until Check confirms it is working.\n\nThis is an experiment, not a permanent change yet.',
  },
  pdca_check: {
    title: 'Check',
    body: 'Measure the results of your pilot against the target you set in Plan.\n\nUse the same measurement method as baseline. Run for enough cycles to be statistically meaningful (minimum 10).\n\nIf results match the target, proceed to Act. If not, return to Plan with new information.',
  },
  pdca_act: {
    title: 'Act',
    body: 'If the improvement worked: standardise it. Update SOPs, train operators, replicate to similar processes.\n\nIf it did not work: return to Plan with what you learned. Failure is data — do not skip this reflection.\n\n"Act" is the step most teams skip. Without standardisation, improvements disappear within weeks.',
  },
}

// ── FieldTip component ─────────────────────────────────────────────────────
export function FieldTip({ termKey }: { termKey: string }) {
  const tip = TERM_TIPS[termKey]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  if (!tip) return null

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 5 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={`What is ${tip.title}?`}
        style={{
          width: 16, height: 16, borderRadius: '50%',
          background: open ? 'var(--brand)' : 'rgba(1,118,211,0.12)',
          border: '1px solid rgba(1,118,211,0.3)',
          color: open ? '#0D0C0A' : 'rgba(1,118,211,0.7)',
          fontSize: 10, fontWeight: 800, cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s', flexShrink: 0,
        }}
      >?</button>
      {open && (
        <div style={{
          position: 'absolute', top: 22, left: 0, zIndex: 9999,
          width: 300, padding: '12px 14px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--brand)',
          borderRadius: '0 10px 10px 10px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', marginBottom: 7 }}>
            {tip.title}
            {tip.unit && (
              <span style={{ fontWeight: 400, color: 'var(--text3)', marginLeft: 6, fontSize: 10 }}>
                — {tip.unit}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {tip.body}
          </div>
        </div>
      )}
    </div>
  )
}

// ── FieldLabel with built-in tooltip ──────────────────────────────────────
export function TipLabel({
  termKey,
  htmlFor,
  children,
  style,
}: {
  termKey: string
  htmlFor?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="label"
      style={{ display: 'flex', alignItems: 'center', marginBottom: 4, ...style }}
    >
      {children}
      <FieldTip termKey={termKey} />
    </label>
  )
}

// ── Inline warning helper ──────────────────────────────────────────────────
export function FieldWarn({ msg }: { msg?: string | null }) {
  if (!msg) return null
  return (
    <div style={{
      fontSize: 11, color: '#0176D3', marginTop: 4,
      display: 'flex', alignItems: 'flex-start', gap: 5, lineHeight: 1.5,
    }}>
      <AlertIcon size={13} color="#F4A623"/>
      {msg}
    </div>
  )
}

// ── Value clamp helpers ────────────────────────────────────────────────────
export function clampPct(raw: string): string {
  const n = parseFloat(raw)
  if (isNaN(n)) return raw
  if (n > 100)  return '100'
  if (n < 0)    return '0'
  return raw
}

export function clampMin(raw: string, min = 0): string {
  const n = parseFloat(raw)
  if (isNaN(n)) return raw
  if (n < min)  return String(min)
  return raw
}

export function pctWarn(v: string): string | null {
  if (!v || v === '') return null
  const n = parseFloat(v)
  if (isNaN(n))  return 'Enter a number between 0 and 100'
  if (n > 100)   return 'Maximum is 100% — clamped automatically'
  if (n < 0)     return 'Cannot be negative'
  return null
}

export function timeWarn(v: string, label = 'Value'): string | null {
  if (!v || v === '') return null
  const n = parseFloat(v)
  if (isNaN(n) || n < 0) return 'Must be 0 or greater'
  if (n > 86400)         return `${label} over 24 hours — check the unit (use seconds)`
  return null
}

export function secToHuman(sec: string | number): string | null {
  const n = Number(sec)
  if (!n || n <= 0) return null
  if (n >= 3600) return `${(n / 3600).toFixed(1)} hrs`
  if (n >= 60)   return `${(n / 60).toFixed(1)} min`
  return null
}
