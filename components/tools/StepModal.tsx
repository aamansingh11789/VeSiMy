// TypeScript enabled
'use client'
import { AlertIcon } from '@/components/ui/Icons'

import { useEffect, useMemo, useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'

// ── Tooltip definitions for every field ──────────────────────────────────────
const FIELD_HELP = {
  va_type: {
    title: 'Step Classification',
    body: 'Every step falls into one of three categories. Value-Add (VA): directly transforms the product or service, the customer pays for this. Necessary Non-Value-Add (NNVA): required by regulations or system constraints, but adds no direct customer value (inspections, compliance, mandatory sign-offs). Non-Value-Add (NVA): pure waste, target for elimination.',
    example: 'Welding a joint = VA · ISO audit = NNVA · Waiting for email reply = NVA',
  },
  name: {
    title: 'Step Name',
    body: 'A short, action-based name for this process step. Use the format: Action + Subject. Describe what is happening, not who does it.',
    example: '"Frame Sub-Assembly" · "Patient Triage" · "Offer Preparation" · "Barrel Ageing"',
  },
  department: {
    title: 'Department or Team',
    body: 'The team, function, or area responsible for completing this step. This helps identify ownership, cross-functional handoffs, and where bottlenecks are owned.',
    example: '"Assembly" · "Nursing" · "Lender Liaison" · "Cellar"',
  },
  flow_type: {
    title: 'Flow Type, How Work Moves Forward',
    body: 'Push: work is produced based on a schedule and pushed to the next step whether it is needed or not. Pull: the downstream step signals when it needs more, nothing is made until requested. FIFO Lane: a controlled first-in, first-out queue with a maximum cap. Supermarket: a controlled inventory buffer that downstream pulls from. Queue: a pure wait step with no work transformation.',
    example: 'Assembly line running to schedule = Push · Lean cell responding to demand = Pull',
  },
  operators: {
    title: 'Number of Operators',
    body: 'How many people are assigned to this step at any one time. This feeds the Yamazumi operator balance chart, comparing each operator\'s workload against Takt Time to identify overloading and imbalance.',
    example: '1 operator on a solo task · 2 operators on a high-volume assembly step',
  },
  wip: {
    title: 'WIP / Inventory (units)',
    body: 'The average number of items (units, patients, cases, batches, files) that are waiting or currently being processed at this step. High WIP is a signal of a bottleneck, batch processing, or unbalanced flow. In VSM notation, WIP is shown as an inventory triangle with a number inside.',
    example: '2 units = healthy flow · 20 units = likely bottleneck upstream',
  },
  cycle_time: {
    title: 'Cycle Time, ISO 22468 §5.2',
    body: 'The actual time it takes to complete one unit of work at this step, from when work starts to when it is finished and ready to pass to the next step. Measured in seconds. If your Cycle Time is higher than your Takt Time, this step cannot keep up with demand and is a bottleneck. Use the built-in Time Study tool to measure it accurately rather than estimating.',
    example: 'Welding a joint = 45 seconds · Filling out a loan application = 7,200 seconds (2 hrs)',
  },
  wait_time: {
    title: 'Queue Time, ISO 22468 §5.3',
    body: 'The time work spends waiting before this step begins, sitting in a queue, waiting for an operator, waiting for a machine, waiting for approval, or waiting for the previous step to finish. Wait time is always Non-Value-Add. It is often the biggest contributor to long lead times. This time appears as the "valleys" on the VSM timeline.',
    example: 'Parts sitting at a bottleneck machine · A patient waiting in the waiting room · A document waiting for review',
  },
  setup_time: {
    title: 'Changeover Time (C/O), SMED',
    body: 'The time required to prepare this step before processing can begin, switching from one product to another, setting up a machine, loading a fixture, or configuring a process. Setup time is typically Necessary NVA. The SMED methodology focuses on reducing this. Enter the total setup time per changeover event.',
    example: 'Tool change between products = 600 seconds (10 min) · Reconfiguring a software environment = 300 seconds',
  },
  trans_time: {
    title: 'Transport Time (seconds)',
    body: 'The time spent physically moving work to or from this step, carrying parts between stations, transporting a patient between wards, moving files between offices. Transport is Non-Value-Add waste (the T in DOWNTIME). It often signals a layout problem or unnecessary handoffs.',
    example: 'Moving pallets between two ends of a warehouse = 120 seconds',
  },
  defect_rate: {
    title: 'Defect Rate (%)',
    body: 'The percentage of units that come out of this step with a defect, requiring rework, repair, or scrapping before they can continue. Enter a number between 0 and 100. Even a 2% defect rate compounds across a value stream: a 2% defect rate at each of 5 steps means only about 90% of product exits without a defect somewhere.',
    example: '0% = perfect quality · 2.1% = common in manual assembly · 30%+ = serious quality crisis',
  },
  uptime: {
    title: 'Uptime / Machine Availability (%)',
    body: 'The percentage of scheduled production time that this step is actually running and available, not stopped for breakdowns, planned maintenance, changeovers, or adjustment. 100% means the step ran every minute it was scheduled. This is the Availability component of OEE (Overall Equipment Effectiveness). A machine cannot run more than 100% of scheduled time, this field is capped at 100.',
    example: '100% = always available · 92% = 8% of time lost to stoppages · 75% = significant reliability problem',
  },
  completion_accuracy: {
    title: 'Completion Accuracy / First Pass Yield (%)',
    body: 'The percentage of work items that exit this step correctly and completely the first time, with no rework, re-do, or return needed. Also called First Pass Yield (FPY) or First Time Right. Capped at 100% since no step can produce more correct output than it receives input. Different from Defect Rate: defect rate tracks what goes wrong, completion accuracy tracks what goes right.',
    example: '95% = 5 out of every 100 items need some form of rework · 100% = every item exits correctly first time',
  },
  notes: {
    title: 'Step Notes',
    body: 'Free-form observations about this step, bottleneck evidence, known problems, safety concerns, improvement ideas, or anything that helps your team understand what is really happening here. These notes appear in your A3 report and are read by Supe when running gap analysis.',
    example: '"Operator walks 4m to foam rack each cycle, 16s NVA" · "3% stuck sparge on rye batches, rice hulls needed"',
  },
}

const FLOW_TYPES = [
  { value: 'push',        label: 'Push, scheduled production' },
  { value: 'pull',        label: 'Pull, downstream signal' },
  { value: 'fifo',        label: 'FIFO Lane, first in, first out' },
  { value: 'supermarket', label: 'Supermarket, controlled buffer' },
  { value: 'queue',       label: 'Queue, pure wait step' },
]

const VA_TYPES = [
  { value: 'va',   label: 'Value-Add (VA)',                color: '#1DD1A1', bg: 'rgba(29,209,161,0.08)',  hint: 'Customer pays for this, directly transforms the product or service' },
  { value: 'nnva', label: 'Necessary Non-Value-Add',       color: '#D4A843', bg: 'rgba(212,168,67,0.08)',   hint: 'Required but adds no customer value, inspections, compliance, setup' },
  { value: 'nva',  label: 'Non-Value-Add (Waste)',         color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', hint: 'Pure waste, target for elimination first' },
]

// ── Validation limits ─────────────────────────────────────────────────────────
const LIMITS = {
  operators:           { min: 1,   max: 999 },
  wip:                 { min: 0,   max: 99999 },
  cycle_time:          { min: 0,   max: 999999 },
  wait_time:           { min: 0,   max: 999999 },
  setup_time:          { min: 0,   max: 999999 },
  trans_time:          { min: 0,   max: 999999 },
  defect_rate:         { min: 0,   max: 100, warn: 'Defect rate cannot exceed 100%' },
  uptime:              { min: 0,   max: 100, warn: 'Uptime cannot exceed 100%, a step cannot run more than its scheduled time' },
  completion_accuracy: { min: 0,   max: 100, warn: 'Completion accuracy cannot exceed 100%' },
}

function uid() { return Math.random().toString(36).slice(2, 9) }

// ── FieldLabel: label + ? tooltip button ──────────────────────────────────────
function FieldLabel({ field, children }: { field: any; children?: any }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const help = FIELD_HELP[field]

  useEffect(() => {
    if (!open) return
    function away(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [open])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
      <label className="label" style={{ margin: 0, flex: 1 }}>{children}</label>
      {help && (
        <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            style={{
              width: 16, height: 16, borderRadius: '50%', cursor: 'pointer',
              background: open ? 'var(--brand)' : 'rgba(212,168,67,0.14)',
              border: '1px solid rgba(1,118,211,0.35)',
              color: open ? '#0D0C0A' : 'var(--brand)',
              fontSize: 9, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1, transition: 'all .15s',
            }}
          >?</button>
          {open && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
              width: 290, zIndex: 9999,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', marginBottom: 7 }}>{help.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.65, marginBottom: help.example ? 8 : 0 }}>{help.body}</div>
              {help.example && (
                <div style={{ fontSize: 10, color: 'var(--text3)', fontStyle: 'italic', lineHeight: 1.5, paddingTop: 7, borderTop: '1px solid var(--border)' }}>
                  {help.example}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: -5, right: 5, width: 9, height: 9, background: 'var(--bg)', border: '1px solid var(--border)', transform: 'rotate(45deg)', borderTop: 'none', borderLeft: 'none' }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── ValidatedInput: clamps to limits and shows warning ────────────────────────
function ValidatedInput({ field, value, onChange, hint, ...rest }) {
  const limits = LIMITS[field]
  const [warn, setWarn] = useState('')

  function handleChange(e) {
    const raw = e.target.value
    if (raw === '' || raw === '-') { setWarn(''); onChange(raw); return }
    const n = Number(raw)
    if (!Number.isFinite(n)) { onChange(raw); return }
    if (limits?.max !== undefined && n > limits.max) {
      setWarn(limits.warn || `Maximum is ${limits.max}`)
      onChange(String(limits.max))
      return
    }
    if (limits?.min !== undefined && n < limits.min) {
      onChange(String(limits.min))
      setWarn('')
      return
    }
    setWarn('')
    onChange(raw)
  }

  return (
    <div>
      <input className="input" type="number" value={value} onChange={handleChange}
        min={limits?.min} max={limits?.max} {...rest} />
      {hint && !warn && (
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, lineHeight: 1.4 }}>{hint}</div>
      )}
      {warn && (
        <div style={{ fontSize: 10, color: '#D4A843', marginTop: 3, display: 'flex', alignItems: 'flex-start', gap: 4, lineHeight: 1.4 }}>
          <AlertIcon size={13} color="#F4A623"/><span>{warn}</span>
        </div>
      )}
    </div>
  )
}

// ── StepModal ─────────────────────────────────────────────────────────────────
export function StepModal({ step, onSave, onClose }: { step?: any; onSave: any; onClose: any }) {
  const isEdit = !!step?.id
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()

  const [form, setForm] = useState({
    name: '', description: '', department: '',
    operators: '1', cycle_time: '', wait_time: '',
    setup_time: '', trans_time: '', defect_rate: '',
    uptime: '', completion_accuracy: '',
    wip: '', flow_type: 'push', notes: '', va_type: 'va',
  })
  const [opSteps, setOpSteps] = useState([])
  const [newStep, setNewStep] = useState({ name: '', time: '', va_type: 'va', step_type: 'man' })
  const [showOpSteps, setShowOpSteps] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!step) return
    setForm({
      name:                 step.name || '',
      description:          step.description || '',
      department:           step.department || '',
      operators:            step.operators != null ? String(step.operators) : '1',
      cycle_time:           step.cycle_time != null ? String(step.cycle_time) : '',
      wait_time:            step.wait_time != null ? String(step.wait_time) : '',
      setup_time:           step.setup_time != null ? String(step.setup_time) : '',
      trans_time:           step.trans_time != null ? String(step.trans_time) : '',
      defect_rate:          step.defect_rate != null ? String(step.defect_rate) : '',
      uptime:               step.uptime != null ? String(step.uptime) : '',
      completion_accuracy:  step.completion_accuracy != null ? String(step.completion_accuracy) : '',
      wip:                  step.wip != null ? String(step.wip) : '',
      flow_type:            step.flow_type || 'push',
      notes:                step.notes || '',
      va_type:              step.va_type || 'va',
    })
    setOpSteps(step.op_steps || [])
  }, [step])

  const canSave = useMemo(() => form.name.trim().length > 0 && !saving, [form.name, saving])

  function upd(key, val) { setForm(p => ({ ...p, [key]: val })); if (error) setError('') }

  function toN(v) {
    if (v === '' || v == null) return null
    const n = Number(v); return Number.isFinite(n) ? n : null
  }

  function addOpStep() {
    if (!newStep.name.trim() || !newStep.time) return
    setOpSteps(p => [...p, { id: uid(), name: newStep.name.trim(), time: Number(newStep.time), va_type: newStep.va_type, step_type: newStep.step_type || 'man' }])
    setNewStep({ name: '', time: '', va_type: 'va', step_type: 'man' })
  }

  const opTotal = opSteps.reduce((a, s) => a + s.time, 0)
  const vaT  = opSteps.filter(s => s.va_type === 'va').reduce((a, s) => a + s.time, 0)
  const nnvT = opSteps.filter(s => s.va_type === 'nnva').reduce((a, s) => a + s.time, 0)
  const nvT  = opSteps.filter(s => s.va_type === 'nva').reduce((a, s) => a + s.time, 0)

  const vaColor = VA_TYPES.find(v => v.value === form.va_type)?.color || 'var(--text3)'

  async function handleSave() {
    if (!form.name.trim()) { setError('Step name is required.'); return }
    setSaving(true); setError('')
    try {
      await onSave({
        name: form.name.trim(), description: form.description.trim() || null,
        department: form.department.trim() || null,
        operators: toN(form.operators) ?? 1,
        cycle_time: toN(form.cycle_time), wait_time: toN(form.wait_time) ?? 0,
        setup_time: toN(form.setup_time) ?? 0, trans_time: toN(form.trans_time) ?? 0,
        defect_rate: toN(form.defect_rate), uptime: toN(form.uptime),
        completion_accuracy: toN(form.completion_accuracy),
        wip: toN(form.wip) ?? 0, flow_type: form.flow_type || 'push',
        notes: form.notes.trim() || null, va_type: form.va_type, op_steps: opSteps,
      })
    } catch (e) { setError(e?.message || 'Failed to save step.') }
    finally { setSaving(false) }
  }

  return (
    <Modal
      title={isEdit ? `Edit Step, ${step?.name || ''}` : 'Add New Step'}
      onClose={onClose} onSave={handleSave}
      saveLabel={saving ? 'Saving…' : isEdit ? 'Save Step' : 'Add Step'}
      disableSave={!canSave}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {error && (
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.20)', color: '#FF6B6B', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* ── Step Classification ── */}
        <div>
          <FieldLabel field="va_type">Step Classification</FieldLabel>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {VA_TYPES.map(vt => (
              <button key={vt.value} type="button" onClick={() => upd('va_type', vt.value)}
                style={{ flex: 1, minWidth: 80, padding: '8px 6px', borderRadius: 8, cursor: 'pointer', transition: 'all .15s', fontSize: 10, fontWeight: 700, background: form.va_type === vt.value ? vt.bg : 'var(--bg)', border: `1.5px solid ${form.va_type === vt.value ? vt.color : 'var(--border)'}`, color: form.va_type === vt.value ? vt.color : 'var(--text2)' }}>
                {vt.label}
              </button>
            ))}
          </div>
          {form.va_type && (
            <div style={{ fontSize: 11, color: vaColor, marginTop: 6, fontStyle: 'italic', lineHeight: 1.4 }}>
              {VA_TYPES.find(v => v.value === form.va_type)?.hint}
            </div>
          )}
        </div>

        {/* ── Step Name ── */}
        <div>
          <FieldLabel field="name">Step Name *</FieldLabel>
          <input className="input" placeholder="e.g. Final Assembly · Patient Triage · Offer Preparation" value={form.name} onChange={e => upd('name', e.target.value)} autoFocus />
        </div>

        {/* ── Description ── */}
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={2} placeholder="Optional, describe what happens at this step" value={form.description} onChange={e => upd('description', e.target.value)} style={{ minHeight: 58 }} />
        </div>

        {/* ── Department + Flow Type ── */}
        <div className="vesimy-mobile-grid">
          <div>
            <FieldLabel field="department">Department / Team</FieldLabel>
            <input className="input" placeholder="e.g. Assembly, Nursing, Legal" value={form.department} onChange={e => upd('department', e.target.value)} />
          </div>
          <div>
            <FieldLabel field="flow_type">Flow Type</FieldLabel>
            <select className="input" value={form.flow_type} onChange={e => upd('flow_type', e.target.value)}>
              {FLOW_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Operators + WIP ── */}
        <div className="vesimy-mobile-grid">
          <div>
            <FieldLabel field="operators">Operators</FieldLabel>
            <ValidatedInput field="operators" value={form.operators} onChange={v => upd('operators', v)}
              inputMode="numeric" placeholder="1"
              hint="Number of people assigned to this step at one time" />
          </div>
          <div>
            <FieldLabel field="wip">WIP / Inventory (units)</FieldLabel>
            <ValidatedInput field="wip" value={form.wip} onChange={v => upd('wip', v)}
              inputMode="numeric" placeholder="e.g. 5"
              hint="Average items waiting or in process at this step" />
          </div>
        </div>

        {/* ── Cycle Time + Wait Time ── */}
        <div className="vesimy-mobile-grid">
          <div>
            <FieldLabel field="cycle_time">Cycle Time (seconds)</FieldLabel>
            <ValidatedInput field="cycle_time" value={form.cycle_time} onChange={v => upd('cycle_time', v)}
              inputMode="decimal" placeholder="e.g. 120"
              hint="Time to complete one unit, if higher than Takt Time, this is a bottleneck" />
          </div>
          <div>
            <FieldLabel field="wait_time">Queue Time (seconds)</FieldLabel>
            <ValidatedInput field="wait_time" value={form.wait_time} onChange={v => upd('wait_time', v)}
              inputMode="decimal" placeholder="e.g. 300"
              hint="Time work sits idle before this step begins" />
          </div>
        </div>

        {/* ── Setup Time + Transport Time ── */}
        <div className="vesimy-mobile-grid">
          <div>
            <FieldLabel field="setup_time">Changeover Time C/O (seconds)</FieldLabel>
            <ValidatedInput field="setup_time" value={form.setup_time} onChange={v => upd('setup_time', v)}
              inputMode="decimal" placeholder="e.g. 600"
              hint="Time to prepare or switch before processing starts" />
          </div>
          <div>
            <FieldLabel field="trans_time">Transport Time (seconds)</FieldLabel>
            <ValidatedInput field="trans_time" value={form.trans_time} onChange={v => upd('trans_time', v)}
              inputMode="decimal" placeholder="e.g. 60"
              hint="Time spent moving work to or from this step" />
          </div>
        </div>

        {/* ── Defect Rate + Uptime, enforced 0–100 ── */}
        <div className="vesimy-mobile-grid">
          <div>
            <FieldLabel field="defect_rate">Defect Rate (%)</FieldLabel>
            <ValidatedInput field="defect_rate" value={form.defect_rate} onChange={v => upd('defect_rate', v)}
              inputMode="decimal" placeholder="e.g. 2.1"
              hint="0 = no defects · 100 = everything fails (capped at 100)" />
          </div>
          <div>
            <FieldLabel field="uptime">Uptime / Availability (%)</FieldLabel>
            <ValidatedInput field="uptime" value={form.uptime} onChange={v => upd('uptime', v)}
              inputMode="decimal" placeholder="e.g. 92"
              hint="100 = always running · 80 = 20% of time lost to stops (capped at 100)" />
          </div>
        </div>

        {/* ── Completion Accuracy ── */}
        <div>
          <FieldLabel field="completion_accuracy">First Pass Yield / FPY / First Pass Yield (%)</FieldLabel>
          <ValidatedInput field="completion_accuracy" value={form.completion_accuracy} onChange={v => upd('completion_accuracy', v)}
            inputMode="decimal" placeholder="e.g. 97"
            hint="% of items that exit correctly first time, no rework needed (capped at 100)" />
        </div>

        {/* ── Operator Steps (Standard Work & Yamazumi) ── */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <button type="button" onClick={() => setShowOpSteps(v => !v)}
            style={{ width: '100%', padding: '10px 14px', background: 'rgba(1,118,211,0.06)', border: 'none', color: '#D4A843', fontWeight: 700, fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Operator Steps, Standard Work &amp; Yamazumi ({opSteps.length} tasks)</span>
            <span style={{ fontSize: 10 }}>{showOpSteps ? '▲ Hide' : '▼ Expand'}</span>
          </button>
          {showOpSteps && (
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.55 }}>
                Break this step into individual operator tasks, each timed and classified as VA, NNVA, or NVA. This feeds the Yamazumi operator balance chart and Standard Work Combination Sheet, showing exactly where time is spent and where waste can be found.
              </div>
              {opSteps.length > 0 && (
                <div>
                  <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1, marginBottom: 4 }}>
                    {opTotal > 0 && <div style={{ width: `${(vaT/opTotal)*100}%`, background: '#1DD1A1' }} />}
                    {opTotal > 0 && <div style={{ width: `${(nnvT/opTotal)*100}%`, background: '#D4A843' }} />}
                    {opTotal > 0 && <div style={{ width: `${(nvT/opTotal)*100}%`, background: '#FF6B6B' }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text3)' }}>
                    <span style={{ color: '#1DD1A1' }}>VA: {vaT}s ({Math.round(vaT/opTotal*100)}%)</span>
                    <span style={{ color: '#D4A843' }}>NNVA: {nnvT}s</span>
                    <span style={{ color: '#FF6B6B' }}>NVA: {nvT}s ({Math.round(nvT/opTotal*100)}%)</span>
                  </div>
                </div>
              )}
              {opSteps.map((s, i) => {
                const vc = VA_TYPES.find(v => v.value === s.va_type)?.color || 'var(--text3)'
                return (
                  <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', minWidth: 20 }}>{i+1}</span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: `${vc}22`, color: vc, fontWeight: 700, minWidth: 36, textAlign: 'center' }}>{s.va_type.toUpperCase()}</span>
                    <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, background: 'var(--bg3)', color: 'var(--text3)', fontFamily: 'var(--font-mono)', minWidth: 40, textAlign: 'center' }}>{(s.step_type||'man').toUpperCase()}</span>
                    <span style={{ flex: 1, fontSize: 12, color: 'var(--text2)' }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{s.time}s</span>
                    <button type="button" onClick={() => setOpSteps(p => p.filter(x => x.id !== s.id))} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}>×</button>
                  </div>
                )
              })}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={newStep.va_type} onChange={e => setNewStep(p => ({ ...p, va_type: e.target.value }))} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, padding: '6px 4px' }}>
                  <option value="va">VA</option><option value="nnva">NNVA</option><option value="nva">NVA</option>
                </select>
                <select value={newStep.step_type} onChange={e => setNewStep(p => ({ ...p, step_type: e.target.value }))} title="Man = operator work · Machine = waiting for machine · Walk = movement between locations" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, padding: '6px 4px' }}>
                  <option value="man">Man</option><option value="machine">Machine</option><option value="walk">Walk</option>
                </select>
                <input className="input" style={{ flex: 3, minWidth: 100, fontSize: 12 }} placeholder="Task name…" value={newStep.name} onChange={e => setNewStep(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addOpStep()} />
                <input className="input" type="number" style={{ flex: 1, minWidth: 60, fontSize: 12 }} placeholder="sec" value={newStep.time} onChange={e => setNewStep(p => ({ ...p, time: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addOpStep()} />
                <button type="button" onClick={addOpStep} style={{ background: 'rgba(1,118,211,0.15)', border: '1px solid rgba(212,168,67,0.3)', color: '#D4A843', borderRadius: 8, cursor: 'pointer', fontSize: 16, minWidth: 36, minHeight: 36 }}>+</button>
              </div>
            </div>
          )}
        </div>

        {/* ── AI Diagnosis ── */}
        {(form.cycle_time || step?.toolData?.stopwatch?.mean) && (
          <div>
            <AIAssistButton label="Diagnose this step with Supe" loading={aiLoading}
              onClick={() => aiAssist('step_diagnose', { step: { ...step, ...form, name: form.name }, takt: step?.takt })} />
            <AIResultPanel result={aiResult} source={aiSource} error={aiError} onClear={aiClear} title="STEP DIAGNOSIS" />
          </div>
        )}

        {/* ── Notes ── */}
        <div>
          <FieldLabel field="notes">Notes</FieldLabel>
          <textarea className="input" rows={3} placeholder="Observations, bottlenecks, known problems, improvement ideas, safety notes…" value={form.notes} onChange={e => upd('notes', e.target.value)} style={{ minHeight: 72 }} />
        </div>

      </div>
    </Modal>
  )
}
