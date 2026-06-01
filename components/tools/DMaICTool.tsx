// TypeScript enabled
'use client'
// ── components/tools/DMaICTool.tsx ────────────────────────────────────────────
// DMAIC, Define, Measure, Analyze, Improve, Control
// Purpose: Complex data-driven problems requiring statistical analysis.
// Visual identity: Five-phase linear progression.
// Spec: VeSiMy v4 Section 7.2


import React from 'react'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'

interface DMaICData {
  title: string
  sponsor: string
  team: string
  // Define
  problem_statement: string
  project_scope: string
  customer_impact: string
  business_case: string
  start_date: string
  target_date: string
  // Measure
  current_data: string
  measurement_plan: string
  baseline_capability: string
  msa_notes: string
  // Analyze
  root_cause: string
  statistical_tools: string
  validated_root_cause: string
  // Improve
  solution_options: string
  selected_solution: string
  pilot_plan: string
  risk_assessment: string
  // Control
  control_plan: string
  standard_work_ref: string
  monitoring_plan: string
  handoff_notes: string
  status: 'define' | 'measure' | 'analyze' | 'improve' | 'control' | 'closed'
}

const BLANK: DMaICData = {
  title: '', sponsor: '', team: '',
  problem_statement: '', project_scope: '', customer_impact: '', business_case: '', start_date: '', target_date: '',
  current_data: '', measurement_plan: '', baseline_capability: '', msa_notes: '',
  root_cause: '', statistical_tools: '', validated_root_cause: '',
  solution_options: '', selected_solution: '', pilot_plan: '', risk_assessment: '',
  control_plan: '', standard_work_ref: '', monitoring_plan: '', handoff_notes: '',
  status: 'define',
}

const PHASES = [
  { key: 'define',   label: 'Define',   color: '#6CB9FC', icon: '🎯',
    desc: 'Problem statement, scope, customer impact, business case, team.' },
  { key: 'measure',  label: 'Measure',  color: '#C9A66B', icon: '📏',
    desc: 'Current process data, measurement plan, baseline capability.' },
  { key: 'analyze',  label: 'Analyze',  color: '#F4A623', icon: '🔍',
    desc: 'Root cause identification, statistical analysis, validated root cause.' },
  { key: 'improve',  label: 'Improve',  color: '#A8854F', icon: '⚡',
    desc: 'Solution options, pilot, implementation, risk assessment.' },
  { key: 'control',  label: 'Control',  color: '#2E844A', icon: '🛡',
    desc: 'Control plan, standard work, monitoring, project closure.' },
]

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 7,
  background: 'var(--bg)', border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
  boxSizing: 'border-box' as const, outline: 'none',
}
const area: React.CSSProperties = { ...inp, resize: 'vertical' as const }

interface Props {
  stepId: string; stepName: string; data: Partial<DMaICData>
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function DMaICTool({ stepName, data, onSave, onClose }: Props) {
  const [form,   setForm]   = useState<DMaICData>({ ...BLANK, ...data })
  const [saving, setSaving] = useState(false)
  const [phase,  setPhase]  = useState(0)

  const set = (field: keyof DMaICData, value: string) => setForm(f => ({ ...f, [field]: value }))
  const current = PHASES[phase]

  async function handleSave() {
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const completion = [
    form.problem_statement !== '' && form.project_scope !== '',
    form.current_data !== '' && form.baseline_capability !== '',
    form.validated_root_cause !== '',
    form.selected_solution !== '' && form.pilot_plan !== '',
    form.control_plan !== '',
  ]

  return (
    <Modal title={`DMAIC, ${stepName}`} onClose={onClose} onSave={handleSave} saveLabel={saving ? 'Saving…' : 'Save DMAIC'}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Project title" style={{ ...inp, flex: 2 }} />
        <input value={form.sponsor} onChange={e => set('sponsor', e.target.value)} placeholder="Sponsor" style={{ ...inp, flex: 1 }} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input value={form.team} onChange={e => set('team', e.target.value)} placeholder="Team members" style={{ ...inp, flex: 2 }} />
        <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} style={{ ...inp, flex: 1 }} />
        <input type="date" value={form.target_date} onChange={e => set('target_date', e.target.value)} style={{ ...inp, flex: 1 }} />
      </div>

      {/* Phase progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {PHASES.map((p, i) => (
          <button key={p.key} onClick={() => setPhase(i)} style={{
            flex: 1, padding: '10px 4px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${phase === i ? p.color : completion[i] ? `${p.color}60` : 'var(--border)'}`,
            background: phase === i ? `${p.color}15` : completion[i] ? `${p.color}08` : 'transparent',
          }}>
            <div style={{ fontSize: 16, marginBottom: 2 }}>{completion[i] ? '✓' : p.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: phase === i ? p.color : completion[i] ? p.color : 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{p.label.toUpperCase()}</div>
          </button>
        ))}
      </div>

      {/* Phase description */}
      <div style={{ background: `${current.color}08`, border: `1px solid ${current.color}25`, borderRadius: 9, padding: '10px 14px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>{current.icon}</span>
          <div style={{ fontSize: 10, fontWeight: 700, color: current.color, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>{current.label.toUpperCase()} PHASE</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{current.desc}</div>
      </div>

      {/* DEFINE */}
      {phase === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>PROBLEM STATEMENT</label>
            <textarea rows={3} value={form.problem_statement} onChange={e => set('problem_statement', e.target.value)}
              placeholder="Specific, measurable description of the problem. What is happening, where, when, how much?" style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>PROJECT SCOPE</label>
            <textarea rows={2} value={form.project_scope} onChange={e => set('project_scope', e.target.value)}
              placeholder="What is in scope and out of scope for this project?" style={area} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>CUSTOMER IMPACT</label>
              <textarea rows={2} value={form.customer_impact} onChange={e => set('customer_impact', e.target.value)} placeholder="How does this problem affect the customer?" style={area} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>BUSINESS CASE</label>
              <textarea rows={2} value={form.business_case} onChange={e => set('business_case', e.target.value)} placeholder="Financial or operational benefit of solving this. Estimate if needed." style={area} />
            </div>
          </div>
        </div>
      )}

      {/* MEASURE */}
      {phase === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>CURRENT PROCESS DATA</label>
            <textarea rows={3} value={form.current_data} onChange={e => set('current_data', e.target.value)}
              placeholder="What data do you have? Defect rates, cycle times, DPMO, Cpk? Enter key numbers." style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>MEASUREMENT PLAN</label>
            <textarea rows={2} value={form.measurement_plan} onChange={e => set('measurement_plan', e.target.value)}
              placeholder="What will you measure, how, who, and how often?" style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>BASELINE PROCESS CAPABILITY</label>
            <input value={form.baseline_capability} onChange={e => set('baseline_capability', e.target.value)}
              placeholder="e.g. Defect rate: 3.2%, Cpk: 0.8, Sigma level: 2.4" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>MEASUREMENT SYSTEM ANALYSIS (MSA)</label>
            <input value={form.msa_notes} onChange={e => set('msa_notes', e.target.value)}
              placeholder="Notes on data reliability / gauge R&R if conducted" style={inp} />
          </div>
        </div>
      )}

      {/* ANALYZE */}
      {phase === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>ROOT CAUSE ANALYSIS</label>
            <textarea rows={3} value={form.root_cause} onChange={e => set('root_cause', e.target.value)}
              placeholder="What hypotheses did you test? What did you find?" style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>STATISTICAL / ANALYTICAL TOOLS USED</label>
            <input value={form.statistical_tools} onChange={e => set('statistical_tools', e.target.value)}
              placeholder="e.g. Fishbone, 5 Whys, Pareto, regression analysis, hypothesis test" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>VALIDATED ROOT CAUSE</label>
            <textarea rows={2} value={form.validated_root_cause} onChange={e => set('validated_root_cause', e.target.value)}
              placeholder="State the root cause with the evidence that confirms it. Not a hypothesis, a confirmed cause." style={area} />
          </div>
        </div>
      )}

      {/* IMPROVE */}
      {phase === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>SOLUTION OPTIONS CONSIDERED</label>
            <textarea rows={2} value={form.solution_options} onChange={e => set('solution_options', e.target.value)} placeholder="What options did you evaluate?" style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>SELECTED SOLUTION</label>
            <textarea rows={2} value={form.selected_solution} onChange={e => set('selected_solution', e.target.value)} placeholder="Which solution was selected and why?" style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>PILOT PLAN</label>
            <textarea rows={2} value={form.pilot_plan} onChange={e => set('pilot_plan', e.target.value)} placeholder="Small-scale test plan. Who, what, when, how success is measured." style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>RISK ASSESSMENT</label>
            <input value={form.risk_assessment} onChange={e => set('risk_assessment', e.target.value)} placeholder="Risks of implementing this solution" style={inp} />
          </div>
        </div>
      )}

      {/* CONTROL */}
      {phase === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>CONTROL PLAN</label>
            <textarea rows={3} value={form.control_plan} onChange={e => set('control_plan', e.target.value)}
              placeholder="What ongoing controls ensure the improvement holds? Control charts, inspection points, process checks?" style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>STANDARD WORK REFERENCE</label>
            <input value={form.standard_work_ref} onChange={e => set('standard_work_ref', e.target.value)} placeholder="Document number or name of updated standard work" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>MONITORING PLAN</label>
            <textarea rows={2} value={form.monitoring_plan} onChange={e => set('monitoring_plan', e.target.value)} placeholder="How and how often will performance be monitored going forward?" style={area} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>PROJECT CLOSURE / HANDOFF</label>
            <textarea rows={2} value={form.handoff_notes} onChange={e => set('handoff_notes', e.target.value)} placeholder="Final results vs baseline. Handoff to process owner." style={area} />
          </div>
        </div>
      )}

      {/* Phase nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        <button onClick={() => setPhase(p => Math.max(0, p - 1))} disabled={phase === 0}
          style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: phase === 0 ? 'var(--text4)' : 'var(--text2)', cursor: phase === 0 ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          ← Previous
        </button>
        <span style={{ fontSize: 12, color: 'var(--text3)', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>{phase + 1} / 5</span>
        <button onClick={() => setPhase(p => Math.min(4, p + 1))} disabled={phase === 4}
          style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: phase === 4 ? 'var(--text4)' : 'var(--text2)', cursor: phase === 4 ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          Next →
        </button>
      </div>
    </Modal>
  )
}
