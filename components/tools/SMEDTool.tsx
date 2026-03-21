// @ts-nocheck
'use client'
import { TipLabel, FieldTip } from '@/components/ui/FieldTip'
// ── components/tools/SMEDTool.tsx ────────────────────────────────────────────
// Single-Minute Exchange of Die (SMED) Calculator
// ISO 9001:2015 §8.5.1 — Changeover Management
// SMED Methodology — Shingo Prize Standards
// ISO 22468:2020 §5.2.5 — Setup Reduction
//
// Workflow:
//   1. Record every changeover step with built-in timer
//   2. Classify each step: Internal (machine stopped) vs External (can run while machine runs)
//   3. See potential savings if Internal steps are converted to External
//   4. Calculate annual $ value of improvement
//   5. Export ISO-grade PDF report

import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'
import { openISOReport } from '@/lib/isoReport'

// ── Types ─────────────────────────────────────────────────────────────────────
type StepType = 'internal' | 'external' | 'waste'
type Phase    = 'pre' | 'during' | 'post'

interface SMEDStep {
  id:       string
  seq:      number
  name:     string
  type:     StepType
  phase:    Phase
  time:     number  // seconds
  notes:    string
  convertible: boolean // can this internal step be made external?
}

interface Props {
  stepId:   string
  stepName: string
  data?:    any
  onSave:   (data: Record<string, any>) => Promise<void>
  onClose:  () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const uid  = () => Math.random().toString(36).slice(2, 9)
const fmtS = (s: number) => {
  if (!s) return '0s'
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60), sec = s % 60
  return sec > 0 ? `${m}m ${sec}s` : `${m}m`
}

const TYPE_META: Record<StepType, { label: string; color: string; bg: string; desc: string }> = {
  internal: { label: 'Internal',  color: '#C0402A', bg: 'rgba(192,64,42,0.1)',   desc: 'Machine must be stopped' },
  external: { label: 'External',  color: '#1A7A5E', bg: 'rgba(26,122,94,0.1)',   desc: 'Can be done while machine runs' },
  waste:    { label: 'Waste/NVA', color: '#8C44CC', bg: 'rgba(140,68,204,0.1)', desc: 'Eliminate — adds no value' },
}
const PHASE_META: Record<Phase, { label: string; color: string }> = {
  pre:    { label: 'Pre-Changeover',    color: '#1A4F8A' },
  during: { label: 'During Changeover', color: '#C0402A' },
  post:   { label: 'Post-Changeover',   color: '#1A7A5E' },
}

const BLANK_STEP = (seq: number): SMEDStep => ({
  id: uid(), seq, name: '', type: 'internal', phase: 'during',
  time: 0, notes: '', convertible: true,
})

// ── Component ─────────────────────────────────────────────────────────────────
export default function SMEDTool({ stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()

  // ── State ──────────────────────────────────────────────────────────────────
  const [steps,       setSteps]       = useState<SMEDStep[]>(data?.steps || [])
  const [product,     setProduct]     = useState(data?.product     || '')
  const [machine,     setMachine]     = useState(data?.machine     || '')
  const [currentTime, setCurrentTime] = useState<number>(data?.currentTime || 0)  // minutes
  const [targetTime,  setTargetTime]  = useState<number>(data?.targetTime  || 0)  // minutes
  const [hoursPerDay, setHoursPerDay] = useState<number>(data?.hoursPerDay || 8)
  const [changesPerDay,setChangesPerDay]=useState<number>(data?.changesPerDay||4)
  const [workingDays, setWorkingDays] = useState<number>(data?.workingDays || 250)
  const [laborCost,   setLaborCost]   = useState<number>(data?.laborCost   || 35)  // $/hour
  const [saving,      setSaving]      = useState(false)
  const [activeTab,   setActiveTab]   = useState<'steps' | 'analysis' | 'targets'>('steps')
  const [timerActive, setTimerActive] = useState(false)
  const [timerMs,     setTimerMs]     = useState(0)
  const [timerStepId, setTimerStepId] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const timerStart = useRef(0)

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerActive) {
      timerStart.current = Date.now() - timerMs
      timerRef.current = setInterval(() => {
        setTimerMs(Date.now() - timerStart.current)
      }, 100)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerActive])

  function startTimer(stepId: string) {
    setTimerMs(0)
    setTimerStepId(stepId)
    setTimerActive(true)
    timerStart.current = Date.now()
  }

  function stopTimer(stepId: string) {
    setTimerActive(false)
    const secs = Math.round(timerMs / 1000)
    setSteps(ss => ss.map(s => s.id === stepId ? { ...s, time: secs } : s))
    setTimerMs(0)
    setTimerStepId(null)
  }

  // ── Step management ────────────────────────────────────────────────────────
  function addStep() {
    setSteps(ss => [...ss, BLANK_STEP(ss.length + 1)])
  }

  function updateStep(id: string, field: keyof SMEDStep, value: any) {
    setSteps(ss => ss.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function deleteStep(id: string) {
    setSteps(ss => ss.filter(s => s.id !== id).map((s, i) => ({ ...s, seq: i + 1 })))
  }

  function moveStep(id: string, dir: 'up' | 'down') {
    setSteps(ss => {
      const idx = ss.findIndex(s => s.id === id)
      if (dir === 'up' && idx === 0) return ss
      if (dir === 'down' && idx === ss.length - 1) return ss
      const next = [...ss]
      const swap = dir === 'up' ? idx - 1 : idx + 1
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next.map((s, i) => ({ ...s, seq: i + 1 }))
    })
  }

  // ── Calculations ───────────────────────────────────────────────────────────
  const totalTime      = steps.reduce((a, s) => a + s.time, 0)  // seconds
  const internalTime   = steps.filter(s => s.type === 'internal').reduce((a, s) => a + s.time, 0)
  const externalTime   = steps.filter(s => s.type === 'external').reduce((a, s) => a + s.time, 0)
  const wasteTime      = steps.filter(s => s.type === 'waste').reduce((a, s) => a + s.time, 0)
  const convertibleTime= steps.filter(s => s.type === 'internal' && s.convertible).reduce((a, s) => a + s.time, 0)

  // SMED potential: if all convertible internals become external, new changeover = pure internal non-convertible + waste-free flow
  const nonConvertibleInternal = steps.filter(s => s.type === 'internal' && !s.convertible).reduce((a, s) => a + s.time, 0)
  const smedPotential  = totalTime - convertibleTime - wasteTime  // theoretical minimum
  const currentMin     = currentTime > 0 ? currentTime * 60 : totalTime  // seconds
  const savingPerChange = Math.max(0, currentMin - smedPotential)
  const annualChanges  = changesPerDay * workingDays
  const annualTimeSavedHrs = (savingPerChange * annualChanges) / 3600
  const annualDollarSaving = annualTimeSavedHrs * laborCost

  const smInternalPct  = totalTime > 0 ? (internalTime  / totalTime * 100).toFixed(0) : 0
  const smExternalPct  = totalTime > 0 ? (externalTime  / totalTime * 100).toFixed(0) : 0
  const smWastePct     = totalTime > 0 ? (wasteTime     / totalTime * 100).toFixed(0) : 0
  const smedReductionPct = currentMin > 0 ? ((savingPerChange / currentMin) * 100).toFixed(0) : 0

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true)
    try {
      await onSave({
        steps, product, machine, currentTime, targetTime,
        hoursPerDay, changesPerDay, workingDays, laborCost,
        totalTime, internalTime, externalTime, wasteTime,
        smedPotential, annualDollarSaving,
        savedAt: Date.now(),
      })
      showToast('SMED analysis saved', 'success')
    } catch {
      showToast('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── ISO Report ─────────────────────────────────────────────────────────────
  function exportISOReport() {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const stepRows = steps.map((s, i) => {
      const meta = TYPE_META[s.type]
      return `
        <tr>
          <td style="text-align:center;font-weight:600;">${s.seq}</td>
          <td>${PHASE_META[s.phase].label}</td>
          <td style="font-weight:600;">${s.name || '(unnamed step)'}</td>
          <td style="text-align:center;color:${meta.color};font-weight:700;">${meta.label}</td>
          <td style="text-align:center;font-family:monospace;font-weight:600;">${fmtS(s.time)}</td>
          <td style="text-align:center;">${s.type === 'internal' ? (s.convertible ? '✓ Yes' : '✗ No') : '—'}</td>
          <td style="font-size:9pt;color:#555;">${s.notes || '—'}</td>
        </tr>`
    }).join('')

    const body = `
      <section class="doc">
        <div class="doc-header">
          <div class="doc-title-block">
            <h1>SMED Analysis — ${stepName}</h1>
            <p class="subtitle">Single-Minute Exchange of Die · Changeover Reduction Study</p>
            ${product ? `<p style="font-size:9.5pt;margin-top:4pt;color:#333;">Product / Part: <strong>${product}</strong>${machine ? ` · Machine / Station: <strong>${machine}</strong>` : ''}</p>` : ''}
          </div>
          <div class="doc-meta-block">
            <table class="meta-table">
              <tr><td>Document</td><td>SMD-${Date.now().toString(36).toUpperCase().slice(-4)}-001</td></tr>
              <tr><td>Process Step</td><td>${stepName}</td></tr>
              <tr><td>Prepared</td><td>${today}</td></tr>
              <tr><td>Revision</td><td>Rev. A</td></tr>
              <tr><td>Standard</td><td>ISO 9001:2015 §8.5.1</td></tr>
            </table>
          </div>
        </div>

        <div class="standards-block">
          <strong>Standards Reference:</strong>
          ISO 9001:2015 §8.5.1 (Changeover Management) &nbsp;·&nbsp;
          SMED Methodology (Shingo Prize Standards) &nbsp;·&nbsp;
          ISO 22468:2020 §5.2.5 (Setup Reduction)
        </div>

        <!-- CURRENT STATE SUMMARY -->
        <h2>1. Current State — Changeover Analysis</h2>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10pt;margin-bottom:14pt;">
          <div class="kpi-card"><div class="kpi-label">Total Changeover Time</div><div class="kpi-value">${fmtS(totalTime)}</div></div>
          <div class="kpi-card"><div class="kpi-label">Internal Steps</div><div class="kpi-value" style="color:#C0402A;">${fmtS(internalTime)}<span style="font-size:9pt;font-weight:400;"> (${smInternalPct}%)</span></div></div>
          <div class="kpi-card"><div class="kpi-label">External Steps</div><div class="kpi-value" style="color:#1A7A5E;">${fmtS(externalTime)}<span style="font-size:9pt;font-weight:400;"> (${smExternalPct}%)</span></div></div>
          <div class="kpi-card"><div class="kpi-label">Waste / NVA</div><div class="kpi-value" style="color:#8C44CC;">${fmtS(wasteTime)}<span style="font-size:9pt;font-weight:400;"> (${smWastePct}%)</span></div></div>
        </div>

        <!-- SMED POTENTIAL -->
        <h2>2. SMED Improvement Potential</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10pt;margin-bottom:14pt;">
          <div class="kpi-card"><div class="kpi-label">Convertible Internal Time</div><div class="kpi-value" style="color:#C0402A;">${fmtS(convertibleTime)}</div><div class="kpi-sub">Can be performed while machine runs</div></div>
          <div class="kpi-card"><div class="kpi-label">SMED Target Minimum</div><div class="kpi-value" style="color:#1A7A5E;">${fmtS(smedPotential)}</div><div class="kpi-sub">After conversion + waste elimination</div></div>
          <div class="kpi-card"><div class="kpi-label">Reduction Potential</div><div class="kpi-value">${smedReductionPct}%</div><div class="kpi-sub">Savings per changeover: ${fmtS(savingPerChange)}</div></div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width:4%">#</th>
              <th style="width:12%">Phase</th>
              <th style="width:28%">Step Description</th>
              <th style="width:12%">Classification</th>
              <th style="width:8%">Time</th>
              <th style="width:10%">Convertible?</th>
              <th>Notes / Actions</th>
            </tr>
          </thead>
          <tbody>${stepRows}</tbody>
        </table>

        <!-- FINANCIAL IMPACT -->
        ${annualDollarSaving > 0 ? `
        <h2>3. Financial Impact Analysis</h2>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10pt;margin-bottom:14pt;">
          <div class="kpi-card"><div class="kpi-label">Changes Per Day</div><div class="kpi-value">${changesPerDay}</div></div>
          <div class="kpi-card"><div class="kpi-label">Annual Changeovers</div><div class="kpi-value">${annualChanges.toLocaleString()}</div></div>
          <div class="kpi-card"><div class="kpi-label">Annual Time Saved</div><div class="kpi-value">${annualTimeSavedHrs.toFixed(0)}h</div></div>
          <div class="kpi-card"><div class="kpi-label">Annual Cost Saving</div><div class="kpi-value" style="color:#1A7A5E;">$${annualDollarSaving.toLocaleString(undefined,{maximumFractionDigits:0})}</div></div>
        </div>
        ` : ''}

        <!-- IMPLEMENTATION ROADMAP -->
        <h2>${annualDollarSaving > 0 ? 4 : 3}. SMED Implementation Roadmap</h2>
        <table class="data-table">
          <thead><tr><th>Stage</th><th>Action</th><th>Expected Benefit</th><th>Reference</th></tr></thead>
          <tbody>
            <tr><td><strong>Stage 1</strong><br/>Observe &amp; Record</td><td>Video record entire changeover. Document every step as performed — do not improve yet.</td><td>Baseline established. Team aligned on true current state.</td><td>SMED §2.1 — Observation Stage</td></tr>
            <tr><td><strong>Stage 2</strong><br/>Separate Internal / External</td><td>Classify each step. Identify which steps can be performed while machine is running (pre-staging, pre-heating, tool preparation, paperwork).</td><td>External preparation eliminates ${fmtS(convertibleTime)} of machine-stopped time.</td><td>SMED §2.2 — Separation Stage</td></tr>
            <tr><td><strong>Stage 3</strong><br/>Convert Internal to External</td><td>Redesign procedures, fixtures, and checklists to move identified convertible steps outside the machine-stopped window. Use standardized tool carts, pre-staging areas, and parallel workflows.</td><td>Machine-stopped time reduced by ${fmtS(convertibleTime)}. Target: ${fmtS(smedPotential)} total changeover.</td><td>ISO 9001:2015 §8.5.1 &amp; SMED §2.3</td></tr>
            <tr><td><strong>Stage 4</strong><br/>Streamline All Steps</td><td>Eliminate NVA steps (${fmtS(wasteTime)} identified). Standardize remaining internal steps. Implement quick-connect tooling, color-coding, and one-touch adjustments.</td><td>Further reduction toward single-digit changeover. Improved repeatability and operator safety.</td><td>ISO 22468:2020 §5.2.5</td></tr>
            <tr><td><strong>Stage 5</strong><br/>Document &amp; Sustain</td><td>Create Standard Work for the new changeover sequence. Train all operators. Validate with 10 consecutive changeovers. Update VSM with new setup time.</td><td>Gains locked in. Knowledge transferred. VSM current-state updated.</td><td>ISO 9001:2015 §8.5.1(g) &amp; §7.2</td></tr>
          </tbody>
        </table>

        <div class="footer-note">
          <p>SMED (Single-Minute Exchange of Die) methodology developed by Shigeo Shingo. The goal of SMED is to reduce all changeover times to under 10 minutes. This document has been prepared in accordance with ISO 9001:2015 §8.5.1 requirements for controlled changeover management and ISO 22468:2020 §5.2.5 for setup reduction within value stream improvement programmes.</p>
        </div>
      </section>`

    openISOReport(body, {
      title: `SMED Analysis — ${stepName}`,
      subtitle: 'Single-Minute Exchange of Die · Changeover Reduction Study',
      toolType: 'SMED',
      projectName: stepName,
      stepName,
      revision: 'Rev. A',
      preparedBy: 'VeSiMy CI Platform',
    })
  }

  // ── Render helpers ─────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6,
    color: 'var(--text)', fontSize: 12, padding: '6px 8px', fontFamily: 'inherit', width: '100%',
  }
  const selectStyle: React.CSSProperties = { ...inputStyle }

  return (
    <Modal
      title={`⚙️ SMED — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Analysis'}
      disableSave={saving}
    >
      {/* ── ISO standards badge ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['ISO 9001:2015 §8.5.1', 'SMED Methodology', 'ISO 22468:2020 §5.2.5'].map(s => (
          <span key={s} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: 'rgba(26,79,138,0.1)', color: '#1A4F8A', border: '1px solid rgba(26,79,138,0.2)', fontFamily: 'monospace' }}>{s}</span>
        ))}
      </div>

      {/* ── Context fields ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Product / Part</label>
          <input style={inputStyle} placeholder="e.g. Model A Seat Assembly" value={product} onChange={e => setProduct(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Machine / Station</label>
          <input style={inputStyle} placeholder="e.g. Foam Press Line 3" value={machine} onChange={e => setMachine(e.target.value)} />
        </div>
      </div>

      {/* ── Summary KPIs (always visible) ── */}
      {steps.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
          {[
            { label: 'Total',    val: fmtS(totalTime),    color: 'var(--text)' },
            { label: 'Internal', val: fmtS(internalTime), color: '#C0402A' },
            { label: 'External', val: fmtS(externalTime), color: '#1A7A5E' },
            { label: 'Waste',    val: fmtS(wasteTime),    color: '#8C44CC' },
          ].map(k => (
            <div key={k.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: k.color, fontFamily: 'monospace' }}>{k.val}</div>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2, letterSpacing: 0.5 }}>{k.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Stacked bar visualisation ── */}
      {totalTime > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 1 }}>
            {internalTime > 0  && <div style={{ width: `${smInternalPct}%`, background: '#C0402A', transition: 'width .4s' }} title={`Internal: ${fmtS(internalTime)}`} />}
            {externalTime > 0  && <div style={{ width: `${smExternalPct}%`, background: '#1A7A5E', transition: 'width .4s' }} title={`External: ${fmtS(externalTime)}`} />}
            {wasteTime > 0     && <div style={{ width: `${smWastePct}%`,    background: '#8C44CC', transition: 'width .4s' }} title={`Waste: ${fmtS(wasteTime)}`}     />}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 10, color: 'var(--text3)', flexWrap: 'wrap' }}>
            <span style={{ color: '#C0402A' }}>● Internal {smInternalPct}%</span>
            <span style={{ color: '#1A7A5E' }}>● External {smExternalPct}%</span>
            <span style={{ color: '#8C44CC' }}>● Waste/NVA {smWastePct}%</span>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        {(['steps', 'analysis', 'targets'] as const).map(tab => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
            padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: activeTab === tab ? 'rgba(212,162,8,0.08)' : 'transparent',
            borderBottom: activeTab === tab ? '2px solid #D4A208' : '2px solid transparent',
            color: activeTab === tab ? '#D4A208' : 'var(--text3)',
            border: 'none', fontFamily: 'inherit', textTransform: 'capitalize',
            transition: 'all .15s',
          }}>
            {tab === 'steps' ? `📋 Steps (${steps.length})` : tab === 'analysis' ? '⚡ SMED Analysis' : '💰 Targets & ROI'}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TAB 1 — STEPS
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'steps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.65, marginBottom: 4 }}>
            Record every changeover step. Classify each as <strong style={{ color: '#C0402A' }}>Internal</strong> (machine must be stopped), <strong style={{ color: '#1A7A5E' }}>External</strong> (can run while machine is running), or <strong style={{ color: '#8C44CC' }}>Waste/NVA</strong> (eliminate entirely). Use the stopwatch to time each step live, or enter times manually.
          </div>

          {/* Live timer indicator */}
          {timerActive && (
            <div style={{ padding: '8px 12px', background: 'rgba(212,162,8,0.1)', border: '1px solid rgba(212,162,8,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#D4A208' }}>
              <span style={{ animation: 'pulse 0.8s ease-in-out infinite', display: 'inline-block' }}>⏱</span>
              <span>Timer running: <strong style={{ fontFamily: 'monospace' }}>{(timerMs / 1000).toFixed(1)}s</strong></span>
            </div>
          )}

          {steps.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13, border: '1px dashed var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚙️</div>
              No steps recorded yet.<br />
              <span style={{ fontSize: 12 }}>Add your first changeover step below. Work through the changeover sequentially.</span>
            </div>
          )}

          {steps.map((s, idx) => {
            const meta = TYPE_META[s.type]
            const isTimingThis = timerStepId === s.id && timerActive
            return (
              <div key={s.id} style={{ border: `1px solid ${isTimingThis ? '#D4A208' : meta.color + '40'}`, borderRadius: 10, overflow: 'hidden', background: isTimingThis ? 'rgba(212,162,8,0.04)' : meta.bg + '66' }}>
                {/* Step header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace', minWidth: 20, textAlign: 'center', fontWeight: 700 }}>#{s.seq}</span>

                  {/* Name */}
                  <input
                    style={{ ...inputStyle, flex: 3, minWidth: 80 }}
                    placeholder="Step description…"
                    value={s.name}
                    onChange={e => updateStep(s.id, 'name', e.target.value)}
                  />

                  {/* Type */}
                  <select style={{ ...selectStyle, flex: 1.2, minWidth: 90 }} value={s.type} onChange={e => updateStep(s.id, 'type', e.target.value as StepType)}>
                    <option value="internal">🔴 Internal</option>
                    <option value="external">🟢 External</option>
                    <option value="waste">🟣 Waste/NVA</option>
                  </select>

                  {/* Phase */}
                  <select style={{ ...selectStyle, flex: 1, minWidth: 80 }} value={s.phase} onChange={e => updateStep(s.id, 'phase', e.target.value as Phase)}>
                    <option value="pre">Pre</option>
                    <option value="during">During</option>
                    <option value="post">Post</option>
                  </select>

                  {/* Time + timer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 100 }}>
                    <input
                      style={{ ...inputStyle, width: 52, textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}
                      type="number"
                      placeholder="sec"
                      min={0}
                      value={s.time || ''}
                      onChange={e => updateStep(s.id, 'time', Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <button
                      type="button"
                      onClick={() => isTimingThis ? stopTimer(s.id) : startTimer(s.id)}
                      disabled={timerActive && !isTimingThis}
                      style={{
                        padding: '5px 7px', borderRadius: 6, border: '1px solid var(--border)',
                        background: isTimingThis ? '#D4A208' : 'var(--bg)',
                        color: isTimingThis ? '#fff' : 'var(--text3)',
                        cursor: timerActive && !isTimingThis ? 'not-allowed' : 'pointer',
                        fontSize: 11, fontWeight: 700,
                        opacity: timerActive && !isTimingThis ? 0.4 : 1,
                      }}
                      title={isTimingThis ? 'Stop timer & record' : 'Start timer'}
                    >
                      {isTimingThis ? '■' : '▶'}
                    </button>
                  </div>

                  {/* Move + delete */}
                  <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                    <button type="button" onClick={() => moveStep(s.id, 'up')} disabled={idx === 0} style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: idx===0?'default':'pointer', color: 'var(--text3)', opacity: idx===0?0.3:1, fontSize: 11 }}>↑</button>
                    <button type="button" onClick={() => moveStep(s.id, 'down')} disabled={idx === steps.length-1} style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: idx===steps.length-1?'default':'pointer', color: 'var(--text3)', opacity: idx===steps.length-1?0.3:1, fontSize: 11 }}>↓</button>
                    <button type="button" onClick={() => deleteStep(s.id)} style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: 'pointer', color: '#FF6B6B', fontSize: 14 }}>×</button>
                  </div>
                </div>

                {/* Convertible flag (only for Internal) + notes */}
                <div style={{ display: 'flex', gap: 8, padding: '6px 10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {s.type === 'internal' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2)', cursor: 'pointer', flexShrink: 0 }}>
                      <input
                        type="checkbox"
                        checked={s.convertible}
                        onChange={e => updateStep(s.id, 'convertible', e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>Can convert to External</span>
                    </label>
                  )}
                  {s.type === 'waste' && (
                    <span style={{ fontSize: 10, color: '#8C44CC', background: 'rgba(140,68,204,0.1)', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>Target for elimination</span>
                  )}
                  <input
                    style={{ ...inputStyle, flex: 1, minWidth: 120, fontSize: 11 }}
                    placeholder="Notes, actions, owner…"
                    value={s.notes}
                    onChange={e => updateStep(s.id, 'notes', e.target.value)}
                  />
                </div>
              </div>
            )
          })}

          <button type="button" onClick={addStep} style={{ padding: '8px 14px', borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add changeover step
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB 2 — SMED ANALYSIS
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
              Add changeover steps first to see the SMED analysis.
            </div>
          ) : (
            <>
              {/* SMED Potential */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>SMED Potential</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Current Total</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#C0402A', fontFamily: 'monospace' }}>{fmtS(totalTime)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>SMED Target</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1A7A5E', fontFamily: 'monospace' }}>{fmtS(smedPotential)}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>after conversion &amp; waste removal</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Reduction</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#D4A208', fontFamily: 'monospace' }}>{smedReductionPct}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>save {fmtS(savingPerChange)} per change</div>
                  </div>
                </div>

                {/* Before → After bar */}
                {totalTime > 0 && smedPotential < totalTime && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>Current vs. SMED Target</div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text3)', width: 36, textAlign: 'right', flexShrink: 0 }}>Before</div>
                      <div style={{ flex: 1, height: 14, background: '#C0402A', borderRadius: 4, position: 'relative', overflow: 'visible' }}>
                        <div style={{ position: 'absolute', right: 4, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 9, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>{fmtS(totalTime)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 3 }}>
                      <div style={{ fontSize: 10, color: 'var(--text3)', width: 36, textAlign: 'right', flexShrink: 0 }}>Target</div>
                      <div style={{ width: `${(smedPotential/totalTime)*100}%`, minWidth: 32, height: 14, background: '#1A7A5E', borderRadius: 4, position: 'relative', overflow: 'visible', transition: 'width .5s' }}>
                        <div style={{ position: 'absolute', right: 4, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 9, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>{fmtS(smedPotential)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4-Stage roadmap */}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>Implementation Stages (Shingo SMED)</div>
                {[
                  { stage: '1', title: 'Observe & Record', desc: 'Video the full changeover. Document every step as-is before any improvement.', done: steps.length > 0 },
                  { stage: '2', title: 'Separate Internal / External', desc: 'Classify each step. Mark what can be done while machine still runs.', done: steps.some(s => s.type === 'external') },
                  { stage: '3', title: 'Convert Internal → External', desc: `Move ${fmtS(convertibleTime)} of convertible internal work outside the stopped window.`, done: false },
                  { stage: '4', title: 'Streamline & Standardise', desc: `Eliminate ${fmtS(wasteTime)} of waste. Standardise remaining internal steps. Update Standard Work.`, done: false },
                ].map(row => (
                  <div key={row.stage} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: row.done ? '#1A7A5E' : 'var(--bg)', border: `2px solid ${row.done ? '#1A7A5E' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: row.done ? '#fff' : 'var(--text3)', flexShrink: 0 }}>
                      {row.done ? '✓' : row.stage}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{row.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>{row.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Assist */}
              <div>
                <AIAssistButton
                  label="⚡ AI Rebalancing Suggestions"
                  loading={aiLoading}
                  onClick={() => aiAssist('smed_analysis' as any, {
                    stepName, steps, totalTime, internalTime, convertibleTime, wasteTime, smedPotential, smedReductionPct,
                  })}
                />
                <AIResultPanel result={aiResult as string} source={aiSource} error={aiError} onClear={aiClear} title="SMED AI ASSIST" />
              </div>

              {/* Export */}
              <button type="button" onClick={exportISOReport} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}>
                📄 Export ISO Report (SMED / ISO 9001:2015 §8.5.1)
              </button>
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB 3 — TARGETS & ROI
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'targets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.65 }}>
            Calculate the annual financial impact of reducing changeover time. Based on actual changeover steps recorded in the Steps tab.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Current changeover time (min)', val: currentTime, set: setCurrentTime, hint: '0 = use recorded step times' },
              { label: 'Target changeover time (min)',  val: targetTime,  set: setTargetTime,  hint: 'Your SMED goal' },
              { label: 'Changeovers per day',           val: changesPerDay, set: setChangesPerDay, hint: '' },
              { label: 'Working days per year',         val: workingDays, set: setWorkingDays, hint: 'Typically 250' },
              { label: 'Labour cost ($/hour)',          val: laborCost,   set: setLaborCost,   hint: 'Including benefits' },
              { label: 'Hours available per day',       val: hoursPerDay, set: setHoursPerDay, hint: 'Net productive hours' },
            ].map(({ label, val, set, hint }) => (
              <div key={label}>
                <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>{label}</label>
                <input
                  style={inputStyle}
                  type="number"
                  min={0}
                  value={val || ''}
                  onChange={e => set(Number(e.target.value) || 0)}
                  placeholder={hint}
                />
                {hint && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{hint}</div>}
              </div>
            ))}
          </div>

          {/* ROI summary */}
          {steps.length > 0 && (
            <div style={{ background: 'rgba(26,122,94,0.06)', border: '1px solid rgba(26,122,94,0.2)', borderRadius: 12, padding: 14, marginTop: 4 }}>
              <div style={{ fontSize: 11, color: '#1A7A5E', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>Annual ROI Projection</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                {[
                  { label: 'Saving per changeover', val: fmtS(savingPerChange) },
                  { label: 'Annual changeovers',     val: annualChanges.toLocaleString() },
                  { label: 'Annual time saved',       val: `${annualTimeSavedHrs.toFixed(1)} hrs` },
                  { label: 'Annual cost saving',      val: `$${annualDollarSaving.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, highlight: true },
                ].map(k => (
                  <div key={k.label} style={{ padding: '10px 12px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>{k.label}</div>
                    <div style={{ fontSize: k.highlight ? 20 : 16, fontWeight: 700, color: k.highlight ? '#1A7A5E' : 'var(--text)', fontFamily: 'monospace' }}>{k.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text3)', lineHeight: 1.6 }}>
                Based on {fmtS(savingPerChange)} savings × {annualChanges.toLocaleString()} changeovers/year × ${laborCost}/hr labour rate.
                SMED methodology (Shingo). Financial model reference: ISO 9001:2015 §8.5.1.
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>
    </Modal>
  )
}
