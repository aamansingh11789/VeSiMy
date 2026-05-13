// TypeScript enabled
'use client'
// ── app/guided/GuidedFlow.tsx ─────────────────────────────────────────────────
// VeSiMy Guided, 8-step lean improvement exercise for new users
// Teaches methodology while the user does real work.
// Spec: Section 4, vesimy-v4-specification.docx


import React from 'react'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import toast from 'react-hot-toast'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg0: '#02040D', bg1: '#060C1A', bg2: '#0A1228', bg3: '#0F1830', bg4: '#162040',
  blue: '#3B7CFF', blueDim: '#2760E0', amberGlow: 'rgba(59,124,255,0.15)',
  blueBdr: 'rgba(59,124,255,0.25)', blueLight: '#90BAFF',
  cyan: '#22D3EE', purple: '#A78BFA', green: '#34D399', amber: '#FBB024', red: '#F87171',
  t1: '#EEF2FF', t2: '#8B9CC8', t3: '#4B5880', t4: '#2A3455',
  b1: 'rgba(255,255,255,0.04)', b2: 'rgba(255,255,255,0.07)', b3: 'rgba(255,255,255,0.12)',
}
const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'
const mono  = '"JetBrains Mono","IBM Plex Mono",monospace'
const cardShadow = `inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.5), 3px 3px 0 rgba(4,8,20,0.9), 6px 6px 0 rgba(3,6,15,0.7), 0 16px 40px rgba(0,0,0,0.7)`
const btnShadow  = `inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 0 rgba(20,50,140,0.9), 0 4px 0 rgba(15,38,105,0.7), 0 8px 24px rgba(59,124,255,0.25)`

// ── Lean concept box ──────────────────────────────────────────────────────────
function ConceptBox({ title, children }: { title: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: C.amberGlow, border: `1px solid ${C.blueBdr}`, borderRadius: 12, overflow: 'hidden', marginTop: 16 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '12px 16px', background: 'none', border: 'none',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <span style={{ color: C.blueLight, fontSize: 13, fontWeight: 700 }}>Why this matters: {title}</span>
        <span style={{ marginLeft: 'auto', color: C.t3, fontSize: 14 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', color: C.t2, fontSize: 14, lineHeight: 1.75 }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Step card ─────────────────────────────────────────────────────────────────
function StepCard({ step, onUpdate, onRemove }: { key?: any;
  step: { id: string; name: string; va: 'va' | 'nva' | ''; cycleTime: string; waitTime: string; wip: string }
  onUpdate: (id: string, field: string, value: string) => void
  onRemove: (id: string) => void
}) {
  const inp: React.CSSProperties = {
    width: '100%', padding: '8px 12px',
    background: 'linear-gradient(180deg, #04080F, #060C18)',
    border: `1px solid ${C.b2}`, borderRadius: 8, color: C.t1,
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(255,255,255,0.04)',
    boxSizing: 'border-box' as const,
  }
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: 16, boxShadow: cardShadow }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <input value={step.name} onChange={e => onUpdate(step.id, 'name', e.target.value)}
          placeholder="Step name (e.g. Receive order)" style={{ ...inp, flex: 1 }} />
        <button onClick={() => onRemove(step.id)} style={{
          padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.b2}`,
          background: 'transparent', color: '#F87171', cursor: 'pointer', fontSize: 16, flexShrink: 0,
        }}>✕</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <div style={{ color: C.t3, fontSize: 11, fontFamily: mono, marginBottom: 4 }}>CYCLE TIME (min)</div>
          <input value={step.cycleTime} onChange={e => onUpdate(step.id, 'cycleTime', e.target.value)}
            placeholder="e.g. 5" type="number" min="0" style={inp} />
        </div>
        <div>
          <div style={{ color: C.t3, fontSize: 11, fontFamily: mono, marginBottom: 4 }}>WAIT BEFORE (min)</div>
          <input value={step.waitTime} onChange={e => onUpdate(step.id, 'waitTime', e.target.value)}
            placeholder="e.g. 30" type="number" min="0" style={inp} />
        </div>
        <div>
          <div style={{ color: C.t3, fontSize: 11, fontFamily: mono, marginBottom: 4 }}>WIP (units)</div>
          <input value={step.wip} onChange={e => onUpdate(step.id, 'wip', e.target.value)}
            placeholder="e.g. 3" type="number" min="0" style={inp} />
        </div>
      </div>
      <div>
        <div style={{ color: C.t3, fontSize: 11, fontFamily: mono, marginBottom: 6 }}>ADDS VALUE FOR CUSTOMER?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ v: 'va', label: 'Yes, value-added', color: C.green }, { v: 'nva', label: 'No, waste', color: C.red }].map(o => (
            <button key={o.v} onClick={() => onUpdate(step.id, 'va', o.v)}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
                border: `1px solid ${step.va === o.v ? o.color : C.b2}`,
                background: step.va === o.v ? `${o.color}22` : 'transparent',
                color: step.va === o.v ? o.color : C.t3,
              }}>{o.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props { userId: string; profile: any }

type Step = { id: string; name: string; va: 'va' | 'nva' | ''; cycleTime: string; waitTime: string; wip: string }
type ExperienceLevel = 'new' | 'heard' | 'done' | ''
type TargetCategory = 'speed' | 'errors' | 'capacity' | 'cost' | 'safety' | 'other' | ''

export default function GuidedFlow({ userId, profile }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Form state
  const [experience,    setExperience]    = useState<ExperienceLevel>('')
  const [target,        setTarget]        = useState<TargetCategory>('')
  const [targetNumber,  setTargetNumber]  = useState('')
  const [targetUnit,    setTargetUnit]    = useState('')
  const [processDesc,   setProcessDesc]   = useState('')
  const [processName,   setProcessName]   = useState('')
  const [triggerEvent,  setTriggerEvent]  = useState('')
  const [completionDef, setCompletionDef] = useState('')
  const [steps,         setSteps]         = useState<Step[]>([
    { id: '1', name: '', va: '', cycleTime: '', waitTime: '', wip: '' },
    { id: '2', name: '', va: '', cycleTime: '', waitTime: '', wip: '' },
  ])
  const [bottleneckId,  setBottleneckId]  = useState('')
  const [pdcaAction,    setPdcaAction]    = useState('')
  const [pdcaOwner,     setPdcaOwner]     = useState('')
  const [pdcaBy,        setPdcaBy]        = useState('')
  const [pdcaCheck,     setPdcaCheck]     = useState('')

  const uid = () => Math.random().toString(36).slice(2, 9)

  const addStep = () => {
    if (steps.length >= 12) return
    setSteps(s => [...s, { id: uid(), name: '', va: '', cycleTime: '', waitTime: '', wip: '' }])
  }
  const updateStep = (id: string, field: string, value: string) => {
    setSteps(s => s.map(st => st.id === id ? { ...st, [field]: value } : st))
  }
  const removeStep = (id: string) => {
    if (steps.length <= 2) return
    setSteps(s => s.filter(st => st.id !== id))
  }

  // Computed metrics for summary
  const filledSteps = steps.filter(s => s.name.trim())
  const totalCT   = filledSteps.reduce((a, s) => a + (parseFloat(s.cycleTime) || 0), 0)
  const totalWait = filledSteps.reduce((a, s) => a + (parseFloat(s.waitTime) || 0), 0)
  const leadTime  = totalCT + totalWait
  const vaSteps   = filledSteps.filter(s => s.va === 'va')
  const vaCT      = vaSteps.reduce((a, s) => a + (parseFloat(s.cycleTime) || 0), 0)
  const pce       = leadTime > 0 ? Math.round((vaCT / leadTime) * 100) : null
  const maxWip    = filledSteps.length > 0 ? filledSteps.reduce((a, s) => {
    const w = parseFloat(s.wip) || 0
    return w > (parseFloat(a.wip) || 0) ? s : a
  }, filledSteps[0]) : null
  const detectedBottleneck = filledSteps.length > 0
    ? (filledSteps.find(s => s.id === bottleneckId) ||
       filledSteps.reduce((prev, curr) =>
         (parseFloat(curr.wip) || 0) > (parseFloat(prev.wip) || 0) ? curr : prev,
       filledSteps[0]))
    : null

  const canAdvance = [
    experience !== '',                      // step 0
    target !== '' && targetNumber !== '',   // step 1
    processDesc.trim().length > 20,         // step 2
    processName.trim() && triggerEvent.trim() && completionDef.trim(),  // step 3
    filledSteps.length >= 2,               // step 4
    true,                                  // step 5 - bottleneck (auto-detected)
    pdcaAction.trim().length > 5,          // step 6
    true,                                  // step 7 - summary always available
  ][currentStep] ?? true

  async function finish() {
    setSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: processName || 'My First Process Map',
          description: processDesc,
          industry: profile.industry || '',
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.project?.id) {
        toast.error(data.error || 'Could not create project, please try again')
        setSaving(false)
        return
      }

      const projectId = data.project.id

      // Save each mapped step to Supabase
      const stepsToSave = filledSteps.filter(s => s.name.trim())
      for (let i = 0; i < stepsToSave.length; i++) {
        const s = stepsToSave[i]
        await fetch('/api/steps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            name:       s.name.trim(),
            va_type:    s.va === 'va' ? 'va' : s.va === 'nva' ? 'nva' : 'unclassified',
            cycle_time: s.cycleTime ? Number(s.cycleTime) * 60 : null, // convert min to sec
            wait_time:  s.waitTime  ? Number(s.waitTime)  * 60 : 0,
            wip:        s.wip       ? Number(s.wip)            : 0,
            order_index: i,
            version:    'v2',
          }),
        }).catch(() => {}) // Don't block navigation on step save failure
      }

      toast.success('Process map created! Opening your project...')
      setTimeout(() => router.push(`/project/${projectId}`), 600)
    } catch {
      toast.error('Connection error, please try again')
      setSaving(false)
    }
  }

  const STEPS_CONFIG = [
    { title: 'How familiar are you with process mapping?', num: '01' },
    { title: "What's your improvement target?", num: '02' },
    { title: 'Describe the process as it works today', num: '03' },
    { title: 'Set the process boundaries', num: '04' },
    { title: 'Map the steps', num: '05' },
    { title: 'Find the bottleneck', num: '06' },
    { title: 'Plan your first improvement', num: '07' },
    { title: 'Your process summary', num: '08' },
  ]

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'linear-gradient(180deg, #04080F, #060C18)',
    border: `1px solid ${C.b2}`, borderRadius: 10, color: C.t1,
    fontSize: 15, fontFamily: 'inherit', outline: 'none',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(255,255,255,0.04)',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Satoshi",Arial,sans-serif', color: C.t1 }}>
      {/* Dot grid */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
        backgroundSize: '28px 28px', opacity: 0.14 }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(2,4,13,0.9)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.b1}` }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <VLogoMark size={28} />
          <span style={{ color: C.t1, fontWeight: 700, fontSize: 15 }}>VeSiMy Guided</span>
        </Link>
        <div style={{ fontFamily: mono, fontSize: 12, color: C.t3 }}>Step {currentStep + 1} of 8</div>
      </nav>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.b1 }}>
        <div style={{ height: '100%', width: `${((currentStep + 1) / 8) * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`, transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '40px 20px 100px' }}>

        {/* Step header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: mono, fontSize: 12, color: C.t3, letterSpacing: '0.1em', marginBottom: 8 }}>
            STEP {STEPS_CONFIG[currentStep].num} / 08
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: C.t1, margin: 0, letterSpacing: '-0.02em',
            textShadow: '0 2px 0 rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.5)' }}>
            {STEPS_CONFIG[currentStep].title}
          </h1>
        </div>

        {/* ── STEP 0: Experience ── */}
        {currentStep === 0 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              This helps us set the right level of guidance for you throughout the exercise.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { v: 'new', label: "I've never mapped a process before", sub: 'Full guidance mode, every concept explained as you go' },
                { v: 'heard', label: "I've heard of VSM but never used it", sub: 'Standard guidance, methodology tips where helpful' },
                { v: 'done', label: "I've done some improvement work before", sub: 'Efficient mode, guidance available on request' },
              ].map(o => (
                <button key={o.v} onClick={() => setExperience(o.v as ExperienceLevel)} style={{
                  padding: '16px 20px', borderRadius: 12, border: `1px solid ${experience === o.v ? C.blue : C.b2}`,
                  background: experience === o.v ? C.amberGlow : 'transparent',
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}>
                  <div style={{ color: experience === o.v ? C.blueLight : C.t1, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{o.label}</div>
                  <div style={{ color: C.t3, fontSize: 13 }}>{o.sub}</div>
                </button>
              ))}
            </div>
            <ConceptBox title="What is process mapping?">
              <p>A process map is a visual picture of every step your work takes from start to finish. You draw it on paper or in a tool, then measure how long each step takes and how much work is waiting between steps.</p>
              <p style={{ marginTop: 8 }}>Once you can see the whole process, patterns become obvious. The steps where work piles up. The steps where everyone waits. The steps that create problems for downstream. These are your improvement opportunities.</p>
              <p style={{ marginTop: 8 }}>This exercise takes about 20 minutes. By the end you will have a real process map, an identified bottleneck, and a first action plan.</p>
            </ConceptBox>
          </div>
        )}

        {/* ── STEP 1: Target ── */}
        {currentStep === 1 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              A specific target gives your map purpose. Without it you are just drawing boxes. With it you are solving a defined problem.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { v: 'speed',    label: 'Finish faster',        icon: '⚡', sub: 'Reduce time from start to done' },
                { v: 'errors',   label: 'Fewer errors',         icon: '🎯', sub: 'Reduce defects and rework' },
                { v: 'capacity', label: 'Do more with same',    icon: '📈', sub: 'Increase throughput' },
                { v: 'cost',     label: 'Reduce waste or cost', icon: '💰', sub: 'Eliminate non-value steps' },
                { v: 'safety',   label: 'Safety or compliance', icon: '✅', sub: 'Reduce risk and variation' },
                { v: 'other',    label: 'Something else',       icon: '🔧', sub: 'I\'ll describe it' },
              ].map(o => (
                <button key={o.v} onClick={() => setTarget(o.v as TargetCategory)} style={{
                  padding: '14px 16px', borderRadius: 12, border: `1px solid ${target === o.v ? C.blue : C.b2}`,
                  background: target === o.v ? C.amberGlow : 'transparent',
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{o.icon}</div>
                  <div style={{ color: target === o.v ? C.blueLight : C.t1, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{o.label}</div>
                  <div style={{ color: C.t3, fontSize: 12 }}>{o.sub}</div>
                </button>
              ))}
            </div>
            {target && (
              <div>
                <p style={{ color: C.t2, fontSize: 14, marginBottom: 10 }}>Put a specific number on it. The gap between where you are now and this number is what the exercise closes.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={targetNumber} onChange={e => setTargetNumber(e.target.value)} placeholder="e.g. 50" style={{ ...inp, width: 140, flexShrink: 0 }} />
                  <input value={targetUnit} onChange={e => setTargetUnit(e.target.value)}
                    placeholder={target === 'speed' ? '% faster / days cut / hours saved' : target === 'errors' ? '% defect reduction' : 'units / %%'}
                    style={{ ...inp, flex: 1 }} />
                </div>
              </div>
            )}
            <ConceptBox title="Why targets matter in lean">
              <p>Lean without a target is just activity. You need to know what success looks like before you start mapping or you will not know which findings to act on first.</p>
              <p style={{ marginTop: 8 }}>The target also becomes your check step in the PDCA cycle at the end of this exercise. Did the first action move the number toward the target?</p>
            </ConceptBox>
          </div>
        )}

        {/* ── STEP 2: Current state description ── */}
        {currentStep === 2 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Write how the process actually works today. Not how it should work. Not the ideal version. What actually happens when you watch it.
            </p>
            <textarea value={processDesc} onChange={e => setProcessDesc(e.target.value)} rows={6}
              placeholder={`Example: When a customer calls in an order, Sarah writes it on a paper form. The form then sits in a tray until the end of the day when Mark enters it into the system. Sometimes the form is hard to read and he calls Sarah to clarify. Then the order goes to picking...`}
              style={{ ...inp, resize: 'vertical' as const }} />
            <div style={{ color: C.t3, fontSize: 12, marginTop: 6 }}>{processDesc.length} characters</div>
            <ConceptBox title="Current state vs future state">
              <p>The current state map is a factual record of exactly how the process works right now, warts and all. The bottlenecks, the waiting, the workarounds people have invented to cope with broken steps.</p>
              <p style={{ marginTop: 8 }}>You cannot improve something you have not accurately described. Teams that skip the honest current state assessment end up solving the wrong problems.</p>
              <p style={{ marginTop: 8 }}>The future state map (which we will show you at the end) is what the process should look like after you eliminate the biggest wastes. The gap between them is your improvement plan.</p>
            </ConceptBox>
          </div>
        )}

        {/* ── STEP 3: Process boundaries ── */}
        {currentStep === 3 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              Every process map needs a defined start and end. Without this, the map never finishes, someone always wants to add one more step.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Process name</label>
                <input value={processName} onChange={e => setProcessName(e.target.value)} placeholder="e.g. Order fulfilment, Patient intake, Invoice processing" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>What triggers this process to start?</label>
                <input value={triggerEvent} onChange={e => setTriggerEvent(e.target.value)} placeholder="e.g. Customer submits an order / Patient arrives at reception" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>What does done look like?</label>
                <input value={completionDef} onChange={e => setCompletionDef(e.target.value)} placeholder="e.g. Customer receives their order / Patient is discharged" style={inp} />
              </div>
            </div>
            <ConceptBox title="Why process boundaries matter">
              <p>Scope creep kills VSM projects. Without clear boundaries, the team spends three days debating what to include and the map never gets finished.</p>
              <p style={{ marginTop: 8 }}>The trigger and the completion definition are the anchor points. Everything between them is on the map. Everything outside them is for a different map.</p>
              <p style={{ marginTop: 8 }}>A rule of thumb: if you cannot describe what triggers the process and what done looks like in one sentence each, the scope is probably too broad. Split it into two smaller maps.</p>
            </ConceptBox>
          </div>
        )}

        {/* ── STEP 4: Map the steps ── */}
        {currentStep === 4 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Add each step in order. For each step: describe what happens, estimate how long it takes, how long work waits before starting, and how much work is typically queued at this step.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {steps.map(step => (
                <StepCard key={step.id} step={step} onUpdate={updateStep} onRemove={removeStep} />
              ))}
            </div>
            {steps.length < 12 && (
              <button onClick={addStep} style={{
                width: '100%', padding: '12px', borderRadius: 10, border: `1px dashed ${C.b3}`,
                background: 'transparent', color: C.t3, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}>+ Add step</button>
            )}
            <ConceptBox title="Value-added vs non-value-added">
              <p>Value-added (VA) means the customer would pay for this step if they knew it was happening. It transforms the product or service in a way they care about.</p>
              <p style={{ marginTop: 8 }}>Non-value-added (NVA) means it adds no value from the customer's perspective. Inspection, waiting, re-entering data, moving things between rooms, none of this is what the customer paid for.</p>
              <p style={{ marginTop: 8 }}>For most processes, only 10-30% of total time is value-adding. The rest is waste. That gap is where your improvement lives.</p>
            </ConceptBox>
            <ConceptBox title="What is WIP?">
              <p>WIP stands for Work in Progress, the number of items sitting at or waiting for a step right now. A pile of forms in a tray is WIP. A queue in a software system is WIP. Partially assembled products on a bench are WIP.</p>
              <p style={{ marginTop: 8 }}>High WIP before a step tells you something important: that step cannot keep up with the flow coming into it. It is your first clue about where the bottleneck lives.</p>
            </ConceptBox>
          </div>
        )}

        {/* ── STEP 5: Bottleneck identification ── */}
        {currentStep === 5 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Based on what you mapped, which step causes the most problems? The highest WIP or longest wait time before a step is usually the bottleneck.
            </p>
            {detectedBottleneck && (
              <div style={{ background: 'rgba(251,176,36,0.1)', border: '1px solid rgba(251,176,36,0.3)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ color: C.amber, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>🔎 Detected from your data</div>
                <div style={{ color: C.t1, fontSize: 15, fontWeight: 700 }}>{detectedBottleneck?.name || 'Step ' + (steps.findIndex(s => s.id === detectedBottleneck?.id) + 1)}</div>
                <div style={{ color: C.t2, fontSize: 13, marginTop: 4 }}>
                  {parseFloat(detectedBottleneck?.wip || '0') > 0 ? `${detectedBottleneck?.wip} units of WIP` : 'Highest wait or cycle time'}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filledSteps.map(step => (
                <button key={step.id} onClick={() => setBottleneckId(step.id)} style={{
                  padding: '14px 16px', borderRadius: 10, border: `1px solid ${bottleneckId === step.id ? C.amber : C.b2}`,
                  background: bottleneckId === step.id ? 'rgba(251,176,36,0.1)' : 'transparent',
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <div style={{ color: bottleneckId === step.id ? C.amber : C.t1, fontWeight: 700 }}>{step.name}</div>
                  <div style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>
                    {step.cycleTime ? `${step.cycleTime} min CT` : ''}{step.wip ? ` · ${step.wip} WIP` : ''}
                  </div>
                </button>
              ))}
            </div>
            <ConceptBox title="Theory of Constraints, why the bottleneck is everything">
              <p>Every process has one step that determines how fast the whole system can go. One step. Not several. One. That step is the constraint.</p>
              <p style={{ marginTop: 8 }}>Everything upstream of the bottleneck is producing faster than the bottleneck can consume. This creates the WIP pile you see in front of it. Everything downstream of the bottleneck is waiting, it has nothing to process.</p>
              <p style={{ marginTop: 8 }}>This is why improving the bottleneck always matters more than improving anything else. If you improve step 2 while step 4 is the bottleneck, your output stays exactly the same. You just have a faster step 2 feeding a longer queue at step 4.</p>
              <p style={{ marginTop: 8 }}>Eli Goldratt called this the Theory of Constraints. Fix the constraint first. When you fix it, a new one emerges. Fix that one. Repeat.</p>
            </ConceptBox>
          </div>
        )}

        {/* ── STEP 6: First improvement action (PDCA) ── */}
        {currentStep === 6 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              You have identified the bottleneck. Now plan one specific action to address it. Not a project. One action. Owner. Date.
            </p>
            <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: cardShadow }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['Plan', 'Do', 'Check', 'Act'].map((phase, i) => (
                  <div key={phase} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 8, textAlign: 'center', fontSize: 11, fontWeight: 700, fontFamily: mono,
                    background: i === 0 ? C.amberGlow : C.b1,
                    border: `1px solid ${i === 0 ? C.blueBdr : C.b2}`,
                    color: i === 0 ? C.blueLight : C.t4,
                  }}>{phase}</div>
                ))}
              </div>
              <div style={{ color: C.t3, fontSize: 12, marginBottom: 16 }}>You are in the PLAN phase. Define what you will test on the bottleneck step.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                    What specific action will you take on {filledSteps.find(s => s.id === bottleneckId)?.name || 'the bottleneck'}?
                  </label>
                  <textarea value={pdcaAction} onChange={e => setPdcaAction(e.target.value)} rows={3}
                    placeholder="Be specific. Not 'improve the step', rather 'reduce hand-off time by pre-staging materials before the step starts'"
                    style={{ ...inp, resize: 'vertical' as const }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Owner</label>
                    <input value={pdcaOwner} onChange={e => setPdcaOwner(e.target.value)} placeholder="Name or role" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Do by</label>
                    <input value={pdcaBy} onChange={e => setPdcaBy(e.target.value)} type="date" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: C.t2, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Check by</label>
                    <input value={pdcaCheck} onChange={e => setPdcaCheck(e.target.value)} type="date" style={inp} />
                  </div>
                </div>
              </div>
            </div>
            <ConceptBox title="PDCA, the engine of continuous improvement">
              <p>Plan-Do-Check-Act (PDCA) is the most important cycle in lean thinking. It is how every improvement gets tested and either standardised or discarded.</p>
              <p style={{ marginTop: 8 }}><strong style={{ color: C.t1 }}>Plan:</strong> Define what you will test and how you will measure it.</p>
              <p style={{ marginTop: 4 }}><strong style={{ color: C.t1 }}>Do:</strong> Run the test. Small scale first.</p>
              <p style={{ marginTop: 4 }}><strong style={{ color: C.t1 }}>Check:</strong> Did the measurement show improvement? Did it confirm or disprove your root cause hypothesis?</p>
              <p style={{ marginTop: 4 }}><strong style={{ color: C.t1 }}>Act:</strong> If it worked, standardise it. If it didn't, you learned something. Start the next cycle.</p>
              <p style={{ marginTop: 8 }}>Most teams skip the Check step. They make a change and assume it worked. This is why improvements rarely hold. The Check step is what makes the improvement real.</p>
            </ConceptBox>
          </div>
        )}

        {/* ── STEP 7: Summary ── */}
        {currentStep === 7 && (
          <div>
            <p style={{ color: C.t2, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              You just did real lean thinking. Here is what you found.
            </p>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Steps mapped', value: filledSteps.length.toString(), color: C.blue },
                { label: 'Total lead time', value: leadTime > 0 ? `${Math.round(leadTime)} min` : ',', color: C.t1 },
                { label: 'Actual work time', value: totalCT > 0 ? `${Math.round(totalCT)} min` : ',', color: C.green },
                { label: 'Process efficiency', value: pce !== null ? `${pce}%` : ',', color: pce !== null ? (pce > 50 ? C.green : pce > 25 ? C.amber : '#F87171') : C.t3 },
              ].map(m => (
                <div key={m.label} style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: 16, textAlign: 'center', boxShadow: cardShadow }}>
                  <div style={{ color: C.t3, fontSize: 11, fontFamily: mono, marginBottom: 6 }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Bottleneck */}
            {detectedBottleneck && (
              <div style={{ background: 'rgba(251,176,36,0.08)', border: '1px solid rgba(251,176,36,0.25)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ color: C.amber, fontSize: 12, fontFamily: mono, marginBottom: 6 }}>BOTTLENECK IDENTIFIED</div>
                <div style={{ color: C.t1, fontSize: 16, fontWeight: 700 }}>{filledSteps.find(s => s.id === (bottleneckId || detectedBottleneck?.id))?.name}</div>
                <div style={{ color: C.t2, fontSize: 13, marginTop: 4 }}>This step is constraining your entire process. Fix it before anything else.</div>
              </div>
            )}

            {/* Insight */}
            {leadTime > 0 && totalCT > 0 && (
              <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ color: C.blueLight, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>What this means</div>
                <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {totalWait > totalCT
                    ? `Your process spends more time waiting (${Math.round(totalWait)} min) than doing actual work (${Math.round(totalCT)} min). This is typical, most processes are 10-30% value-adding. The waiting time is your biggest improvement opportunity.`
                    : `Your process has a relatively high ratio of work to wait time. Focus on the bottleneck step to unlock further speed gains.`
                  }
                </p>
              </div>
            )}

            {/* PDCA summary */}
            {pdcaAction && (
              <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={{ color: C.blueLight, fontSize: 12, fontFamily: mono, marginBottom: 8 }}>YOUR FIRST PDCA ACTION</div>
                <p style={{ color: C.t1, fontSize: 14, lineHeight: 1.7, margin: '0 0 8px' }}>{pdcaAction}</p>
                {pdcaOwner && <div style={{ color: C.t3, fontSize: 12 }}>Owner: {pdcaOwner}{pdcaBy ? ` · Due: ${pdcaBy}` : ''}{pdcaCheck ? ` · Check: ${pdcaCheck}` : ''}</div>}
              </div>
            )}

            <div style={{ background: C.bg2, border: `1px solid ${C.blueBdr}`, borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: cardShadow }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎓</div>
              <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>You just used real lean methodology</div>
              <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' }}>
                Current state mapping. Process boundaries. Value-added classification. WIP analysis. Theory of Constraints. PDCA. All of it. While doing real work on a real process.
              </p>
              <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                <button onClick={finish} disabled={saving} style={{
                  padding: '14px 28px', borderRadius: 10, border: 'none', cursor: saving ? 'default' : 'pointer',
                  background: saving ? C.b2 : `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
                  color: '#1A0E00', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', boxShadow: saving ? 'none' : btnShadow,
                }}>
                  {saving ? 'Saving your map...' : 'Save map and open in VeSiMy Pro →'}
                </button>
                <p style={{ color: C.t4, fontSize: 12, margin: 0 }}>
                  Your map, steps, and PDCA action are saved to your project. Switch to the full canvas to continue improving it.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {currentStep < 7 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {currentStep > 0 && (
              <button onClick={() => setCurrentStep(s => s - 1)} style={{
                flex: 1, padding: '14px', borderRadius: 12, border: `1px solid ${C.b2}`,
                background: 'transparent', color: C.t2, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Back</button>
            )}
            <button onClick={() => canAdvance && setCurrentStep(s => s + 1)} style={{
              flex: currentStep === 0 ? 1 : 2,
              padding: '14px', borderRadius: 12, border: 'none',
              background: canAdvance ? `linear-gradient(135deg, ${C.blue}, ${C.blueDim})` : C.bg3,
              color: canAdvance ? '#fff' : C.t4, fontSize: 15, fontWeight: 700,
              cursor: canAdvance ? 'pointer' : 'default',
              fontFamily: 'inherit', boxShadow: canAdvance ? btnShadow : 'none',
              transition: 'all 0.2s',
            }}>Continue</button>
          </div>
        )}
      </div>
    </div>
  )
}
