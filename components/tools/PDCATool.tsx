// @ts-nocheck
'use client'
import { TipLabel } from '@/components/ui/FieldTip'

import { useState, useMemo } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { openISOReport } from '@/lib/isoReport'

// ── Types ─────────────────────────────────────────────────────────────────────
interface TeamMember { id: string; name: string; role: string }
interface CounterMeasure { id: string; action: string; owner: string; dueDate: string; status: 'open' | 'done' }
interface Metric { id: string; name: string; before: string; after: string; unit: string }

interface PDCAData {
  // META
  projectTitle: string
  problemStatement: string
  background: string
  team: TeamMember[]
  startDate: string
  targetDate: string
  // PLAN
  currentCondition: string
  targetCondition: string
  rootCause: string
  hypothesis: string
  // DO
  countermeasures: CounterMeasure[]
  implementation: string
  // CHECK
  metrics: Metric[]
  results: string
  achieved: 'yes' | 'partial' | 'no' | ''
  // ACT
  standardisation: string
  lessonsLearned: string
  nextCycle: string
}

const BLANK: PDCAData = {
  projectTitle: '', problemStatement: '', background: '', team: [], startDate: '', targetDate: '',
  currentCondition: '', targetCondition: '', rootCause: '', hypothesis: '',
  countermeasures: [], implementation: '',
  metrics: [], results: '', achieved: '',
  standardisation: '', lessonsLearned: '', nextCycle: '',
}

function uid() { return Math.random().toString(36).slice(2, 9) }

const PHASE_CFG = [
  { key: 'plan', label: 'Plan',  color: '#6CB9FC', icon: '', desc: 'Define the problem, analyse root cause, set target' },
  { key: 'do',   label: 'Do',   color: '#0176D3', icon: '', desc: 'Implement countermeasures on a small scale' },
  { key: 'check',label: 'Check',color: '#1DD1A1', icon: '', desc: 'Measure results against the target' },
  { key: 'act',  label: 'Act',  color: '#8C44CC', icon: '', desc: 'Standardise success or loop back to Plan' },
]

const FORMAT_CFG = [
  { id: 'pdca',  label: 'PDCA',  color: '#0176D3', desc: 'Plan-Do-Check-Act cycle report' },
  { id: 'a3',   label: 'A3',    color: '#1DD1A1', desc: 'Toyota one-page A3 format' },
  { id: '8d',   label: '8D',    color: '#FF6B6B', desc: 'Ford 8-Disciplines customer report' },
  { id: 'dmaic',label: 'DMAIC', color: '#6CB9FC', desc: 'Six Sigma structured project format' },
  { id: 'ooda', label: 'OODA',  color: '#8C44CC', desc: 'Observe-Orient-Decide-Act framework' },
]

// ── Export engine ─────────────────────────────────────────────────────────────
function buildReport(data: PDCAData, format: string, linkedData: any): string {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const teamStr = data.team.map(t => `${t.name}${t.role ? ' (' + t.role + ')' : ''}`).join(', ') || '—'
  const metricsTable = data.metrics.length > 0 ? `
    <table class="data-table">
      <thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Unit</th><th>Improvement</th></tr></thead>
      <tbody>${data.metrics.map(m => {
        const before = parseFloat(m.before)
        const after = parseFloat(m.after)
        const delta = !isNaN(before) && !isNaN(after) ? ((after - before) / before * 100).toFixed(1) + '%' : '—'
        return `<tr><td><strong>${m.name}</strong></td><td>${m.before || '—'}</td><td>${m.after || '—'}</td><td>${m.unit || '—'}</td><td style="color:${!isNaN(after-before) && after < before ? '#15803D' : '#DC2626'};font-weight:700">${delta}</td></tr>`
      }).join('')}</tbody>
    </table>` : '<p>(No metrics recorded)</p>'

  const cmTable = data.countermeasures.length > 0 ? `
    <table class="data-table">
      <thead><tr><th>Action / Countermeasure</th><th>Owner</th><th>Due Date</th><th>Status</th></tr></thead>
      <tbody>${data.countermeasures.map(c => `
        <tr>
          <td>${c.action}</td>
          <td>${c.owner || '—'}</td>
          <td>${c.dueDate || '—'}</td>
          <td style="color:${c.status === 'done' ? '#15803D' : '#B45309'};font-weight:700">${c.status === 'done' ? 'Complete' : 'Open'}</td>
        </tr>`).join('')}</tbody>
    </table>` : '<p>(No countermeasures recorded)</p>'

  // Linked data section
  const linkedSection = linkedData ? `
    ${linkedData.vsm ? `<h3>VSM Data — Process Baseline</h3>
      <table class="data-table">
        <thead><tr><th>Step</th><th>Cycle Time</th><th>WIP</th><th>Classification</th></tr></thead>
        <tbody>${linkedData.vsm.map((s: any) => `<tr><td>${s.name}</td><td>${s.ct || '—'}</td><td>${s.wip || '—'}</td><td>${s.va_type?.toUpperCase() || '—'}</td></tr>`).join('')}</tbody>
      </table>` : ''}
    ${linkedData.rootCause5Why ? `<h3>Root Cause (from 5 Why Analysis)</h3><p>${linkedData.rootCause5Why}</p>` : ''}
  ` : ''

  if (format === 'pdca') return `
    <h2>1. Plan — Problem Definition & Analysis</h2>
    <table class="data-table" style="width:100%">
      <tbody>
        <tr><td style="width:160pt;font-weight:700">Project Title</td><td>${data.projectTitle || '—'}</td><td style="width:120pt;font-weight:700">Date</td><td>${today}</td></tr>
        <tr><td style="font-weight:700">Team</td><td colspan="3">${teamStr}</td></tr>
        <tr><td style="font-weight:700">Start Date</td><td>${data.startDate || '—'}</td><td style="font-weight:700">Target Date</td><td>${data.targetDate || '—'}</td></tr>
      </tbody>
    </table>
    <h3>Problem Statement</h3><p>${data.problemStatement || '—'}</p>
    <h3>Background / Context</h3><p>${data.background || '—'}</p>
    <h3>Current Condition</h3><p>${data.currentCondition || '—'}</p>
    <h3>Target Condition</h3><p>${data.targetCondition || '—'}</p>
    <h3>Root Cause Analysis</h3><p>${data.rootCause || '—'}</p>
    <h3>Improvement Hypothesis</h3><p><em>${data.hypothesis || '—'}</em></p>
    ${linkedSection}
    <h2>2. Do — Implementation</h2>
    <h3>Countermeasures Implemented</h3>${cmTable}
    <h3>Implementation Notes</h3><p>${data.implementation || '—'}</p>
    <h2>3. Check — Results Measurement</h2>
    <h3>Before vs After Metrics</h3>${metricsTable}
    <h3>Results Summary</h3><p>${data.results || '—'}</p>
    <p><strong>Target Achieved:</strong> <span style="font-weight:700;color:${data.achieved === 'yes' ? '#15803D' : data.achieved === 'partial' ? '#B45309' : '#DC2626'}">${data.achieved === 'yes' ? 'Yes — target met' : data.achieved === 'partial' ? 'Partially — continue improvement' : data.achieved === 'no' ? 'No — return to Plan' : 'Not assessed'}</span></p>
    <h2>4. Act — Standardise or Adjust</h2>
    <h3>Standardisation Actions</h3><p>${data.standardisation || '—'}</p>
    <h3>Lessons Learned</h3><p>${data.lessonsLearned || '—'}</p>
    <h3>Next PDCA Cycle</h3><p>${data.nextCycle || '—'}</p>`

  if (format === 'a3') return `
    <h2>A3 Problem Solving Report</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20pt;margin-top:12pt;">
      <div>
        <h3>1. Background</h3><p>${data.background || data.problemStatement || '—'}</p>
        <h3>2. Current Condition</h3><p>${data.currentCondition || '—'}</p>
        <h3>3. Goal / Target Condition</h3><p>${data.targetCondition || '—'}</p>
        <h3>4. Root Cause Analysis</h3><p>${data.rootCause || '—'}</p>
      </div>
      <div>
        <h3>5. Countermeasures</h3>${cmTable}
        <h3>6. Implementation Plan</h3><p>${data.implementation || '—'}</p>
        <h3>7. Results</h3>${metricsTable}<p>${data.results || '—'}</p>
        <h3>8. Follow-Up Actions</h3><p>${data.standardisation || '—'}</p>
      </div>
    </div>
    <hr/>
    <p style="font-size:9pt;color:#888">Author: ${teamStr} &nbsp;|&nbsp; Date: ${today} &nbsp;|&nbsp; Project: ${data.projectTitle || '—'}</p>`

  if (format === '8d') return `
    <h2>8D — Eight Disciplines Problem Solving Report</h2>
    <p style="color:#888;margin-bottom:16pt">Customer complaint / non-conformance report — ISO 9001:2015 §10.2 compliant</p>
    <div style="background:#fff8e1;border:1pt solid #F59E0B;border-radius:6pt;padding:10pt;margin-bottom:12pt;">
      <strong>Problem:</strong> ${data.problemStatement || '—'} &nbsp;|&nbsp; <strong>Date:</strong> ${today} &nbsp;|&nbsp; <strong>Reference:</strong> 8D-${Date.now().toString().slice(-6)}
    </div>
    <h3>D1 — Team</h3>
    <table class="data-table"><thead><tr><th>Name</th><th>Role</th></tr></thead>
    <tbody>${data.team.length > 0 ? data.team.map(t => `<tr><td>${t.name}</td><td>${t.role || '—'}</td></tr>`).join('') : '<tr><td colspan="2">(Team not specified)</td></tr>'}</tbody></table>
    <h3>D2 — Problem Description</h3><p>${data.problemStatement || '—'}</p><p><em>Background: ${data.background || '—'}</em></p>
    <h3>D3 — Interim Containment Action (ICA)</h3><p>${data.currentCondition || '—'}</p>
    <h3>D4 — Root Cause Analysis</h3><p>${data.rootCause || '—'}</p><p><em>Escape cause: Why did this reach the customer? ${data.hypothesis || '—'}</em></p>
    <h3>D5 — Permanent Corrective Actions (PCA)</h3>${cmTable}
    <h3>D6 — Implementation & Validation</h3><p>${data.implementation || '—'}</p>${metricsTable}
    <h3>D7 — Prevent Recurrence</h3><p>${data.standardisation || '—'}</p>
    <h3>D8 — Congratulate the Team & Lessons Learned</h3><p>${data.lessonsLearned || '—'}</p>
    <p><strong>Closure Status:</strong> <span style="color:${data.achieved === 'yes' ? '#15803D' : '#DC2626'};font-weight:700">${data.achieved === 'yes' ? '✓ CLOSED' : 'OPEN'}</span></p>`

  if (format === 'dmaic') return `
    <h2>DMAIC Project Charter & Report</h2>
    <p style="color:#888;margin-bottom:16pt">Six Sigma structured improvement project — ISO 13053 aligned</p>
    <h3>Define</h3>
    <table class="data-table"><tbody>
      <tr><td style="font-weight:700;width:140pt">Project Title</td><td>${data.projectTitle || '—'}</td></tr>
      <tr><td style="font-weight:700">Business Case</td><td>${data.background || '—'}</td></tr>
      <tr><td style="font-weight:700">Problem Statement</td><td>${data.problemStatement || '—'}</td></tr>
      <tr><td style="font-weight:700">Goal Statement</td><td>${data.targetCondition || '—'}</td></tr>
      <tr><td style="font-weight:700">Project Scope</td><td>${data.currentCondition || '—'}</td></tr>
      <tr><td style="font-weight:700">Team</td><td>${teamStr}</td></tr>
      <tr><td style="font-weight:700">Timeline</td><td>${data.startDate || '—'} → ${data.targetDate || '—'}</td></tr>
    </tbody></table>
    <h3>Measure</h3>
    <p>Current process baseline and measurement plan:</p>${metricsTable}
    <h3>Analyse</h3>
    <p><strong>Root Cause(s) Identified:</strong></p><p>${data.rootCause || '—'}</p>
    <p><strong>Validated Hypothesis:</strong> <em>${data.hypothesis || '—'}</em></p>
    ${linkedSection}
    <h3>Improve</h3>
    <p><strong>Selected Solutions:</strong></p>${cmTable}
    <p><strong>Pilot / Implementation Notes:</strong></p><p>${data.implementation || '—'}</p>
    <h3>Control</h3>
    <p><strong>Results vs Target:</strong></p>${metricsTable}
    <p>${data.results || '—'}</p>
    <p><strong>Control Plan / Standardisation:</strong></p><p>${data.standardisation || '—'}</p>
    <p><strong>Lessons Learned:</strong></p><p>${data.lessonsLearned || '—'}</p>
    <p><strong>Project Status:</strong> <span style="font-weight:700;color:${data.achieved === 'yes' ? '#15803D' : '#B45309'}">${data.achieved === 'yes' ? '✓ CLOSED — Benefits verified' : data.achieved === 'partial' ? 'IN PROGRESS' : 'OPEN'}</span></p>`

  if (format === 'ooda') return `
    <h2>OODA Loop — Operational Decision Cycle</h2>
    <p style="color:#888;margin-bottom:16pt">Observe-Orient-Decide-Act rapid improvement framework</p>
    <h3>Observe — What is happening?</h3>
    <p><strong>Current Condition:</strong></p><p>${data.currentCondition || '—'}</p>
    <p><strong>Data Collected:</strong></p>${metricsTable}
    <p><strong>Background Context:</strong></p><p>${data.background || '—'}</p>
    ${linkedSection}
    <h3>Orient — What does it mean?</h3>
    <p><strong>Problem Statement:</strong></p><p>${data.problemStatement || '—'}</p>
    <p><strong>Root Cause / Analysis:</strong></p><p>${data.rootCause || '—'}</p>
    <p><strong>Mental Model / Hypothesis:</strong></p><p>${data.hypothesis || '—'}</p>
    <h3>Decide — What will we do?</h3>
    <p><strong>Target Condition:</strong></p><p>${data.targetCondition || '—'}</p>
    <p><strong>Decisions Made:</strong></p>${cmTable}
    <h3>Act — Implement and observe again</h3>
    <p><strong>Actions Taken:</strong></p><p>${data.implementation || '—'}</p>
    <p><strong>Outcomes Observed:</strong></p><p>${data.results || '—'}</p>
    <p><strong>Loop Back:</strong></p><p>${data.nextCycle || data.standardisation || '—'}</p>
    <p><strong>Lessons for Next Loop:</strong></p><p>${data.lessonsLearned || '—'}</p>`

  return '<p>Unknown format</p>'
}

// ── Main Component ─────────────────────────────────────────────────────────────
interface Props {
  steps: any[]
  project: any
  onClose: () => void
  initialData?: PDCAData
  onSave?: (data: PDCAData) => void
}

export default function PDCATool({ steps, project, onClose, initialData, onSave }: Props) {
  const { showToast } = useStore()
  const [data, setData] = useState<PDCAData>(initialData || { ...BLANK, projectTitle: project?.name || '' })
  const [phase, setPhase] = useState<'plan' | 'do' | 'check' | 'act'>('plan')
  const [showExport, setShowExport] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdca')
  const [saving, setSaving] = useState(false)

  // Team
  const [newMember, setNewMember] = useState({ name: '', role: '' })
  // Countermeasures
  const [newCM, setNewCM] = useState({ action: '', owner: '', dueDate: '' })
  // Metrics
  const [newMetric, setNewMetric] = useState({ name: '', before: '', after: '', unit: '' })

  function set(key: keyof PDCAData, value: any) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function addTeam() {
    if (!newMember.name.trim()) return
    set('team', [...data.team, { id: uid(), ...newMember }])
    setNewMember({ name: '', role: '' })
  }

  function addCM() {
    if (!newCM.action.trim()) return
    set('countermeasures', [...data.countermeasures, { id: uid(), status: 'open', ...newCM }])
    setNewCM({ action: '', owner: '', dueDate: '' })
  }

  function toggleCM(id: string) {
    set('countermeasures', data.countermeasures.map(c =>
      c.id === id ? { ...c, status: c.status === 'done' ? 'open' : 'done' } : c))
  }

  function removeCM(id: string) { set('countermeasures', data.countermeasures.filter(c => c.id !== id)) }

  function addMetric() {
    if (!newMetric.name.trim()) return
    set('metrics', [...data.metrics, { id: uid(), ...newMetric }])
    setNewMetric({ name: '', before: '', after: '', unit: '' })
  }

  function removeMetric(id: string) { set('metrics', data.metrics.filter(m => m.id !== id)) }

  // Linked VSM data for export
  const linkedData = useMemo(() => {
    const vsm = steps
      .filter(s => s.is_main_flow !== false)
      .map(s => ({
        name: s.name,
        ct: s.cycle_time ? `${s.cycle_time}s` : null,
        wip: s.wip || null,
        va_type: s.va_type,
      }))
      .filter(s => s.ct || s.wip)
    return vsm.length > 0 ? { vsm } : null
  }, [steps])

  async function handleSave() {
    setSaving(true)
    try {
      onSave?.(data)
      showToast('PDCA project saved', 'success')
    } catch {
      showToast('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  function exportReport() {
    const format = exportFormat
    const fmt = FORMAT_CFG.find(f => f.id === format)
    const body = buildReport(data, format, linkedData)
    openISOReport(body, {
      title: `${fmt?.label} Report — ${data.projectTitle || project?.name}`,
      toolType: 'PDCA',
      projectName: project?.name || '',
      stepName: data.projectTitle || 'Improvement Project',
      revision: 'Rev. A',
      preparedBy: data.team[0]?.name || 'VeSiMy CI Platform',
    })
  }

  const completedCMs = data.countermeasures.filter(c => c.status === 'done').length
  const phasePct = { plan: 0, do: 1, check: 2, act: 3 }
  const progress = Math.round(((phasePct[phase] + 1) / 4) * 100)

  const inputStyle = { fontSize: 12, minHeight: 60 }

  return (
    <Modal
      title={`PDCA — ${data.projectTitle || project?.name || 'Improvement Project'}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Project'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Phase selector */}
        <div style={{ display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {PHASE_CFG.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPhase(p.key as any)}
              style={{
                flex: 1, padding: '8px 4px', border: 'none', cursor: 'pointer',
                background: phase === p.key ? p.color + '22' : 'var(--bg)',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                borderBottom: `3px solid ${phase === p.key ? p.color : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 14 }}>{p.icon}</div>
              <div style={{ fontSize: 10, fontWeight: phase === p.key ? 700 : 400, color: phase === p.key ? p.color : 'var(--text3)' }}>
                {p.label}
              </div>
            </button>
          ))}
        </div>

        {/* Project header — always visible */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Project Title</label>
            <input className="input" style={{ fontSize: 12 }} placeholder="e.g. Reduce Line 3 Changeover Time" value={data.projectTitle} onChange={e => set('projectTitle', e.target.value)} />
          </div>
          <div>
            <label className="label">Start Date</label>
            <input className="input" type="date" style={{ fontSize: 12 }} value={data.startDate} onChange={e => set('startDate', e.target.value)} />
          </div>
          <div>
            <label className="label">Target Date</label>
            <input className="input" type="date" style={{ fontSize: 12 }} value={data.targetDate} onChange={e => set('targetDate', e.target.value)} />
          </div>
        </div>

        {/* ── PLAN ── */}
        {phase === 'plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(108,185,252,0.06)', border: '1px solid rgba(108,185,252,0.2)', borderRadius: 8, fontSize: 11, color: '#6CB9FC' }}>
              Define the problem clearly, describe current condition, identify root cause, and set the target.
            </div>

            <div>
              <TipLabel termKey="problem_statement">Problem Statement *</TipLabel>
              <textarea className="input" style={inputStyle} rows={3} placeholder="Describe the problem with data — what is wrong, where, how often, since when?" value={data.problemStatement} onChange={e => set('problemStatement', e.target.value)} />
            </div>
            <div>
              <TipLabel termKey="fishbone_effect">Background / Context</TipLabel>
              <textarea className="input" style={inputStyle} rows={2} placeholder="Why does this matter? Impact on customer, safety, quality, cost?" value={data.background} onChange={e => set('background', e.target.value)} />
            </div>
            <div>
              <TipLabel termKey="improvement_baseline">Current Condition</TipLabel>
              <textarea className="input" style={inputStyle} rows={2} placeholder="What does the process look like today? Include data — CT, WIP, defect rate, lead time…" value={data.currentCondition} onChange={e => set('currentCondition', e.target.value)} />
            </div>
            <div>
              <TipLabel termKey="improvement_target">Target Condition</TipLabel>
              <textarea className="input" style={inputStyle} rows={2} placeholder="What does success look like? Be specific — e.g. 'CT reduced from 180s to 120s, WIP from 15 to 3'" value={data.targetCondition} onChange={e => set('targetCondition', e.target.value)} />
            </div>
            <div>
              <TipLabel termKey="root_cause">Root Cause Analysis</TipLabel>
              <textarea className="input" style={inputStyle} rows={3} placeholder="What is the verified root cause? Use 5 Why or Fishbone tools to support this." value={data.rootCause} onChange={e => set('rootCause', e.target.value)} />
            </div>
            <div>
              <label className="label">Improvement Hypothesis</label>
              <textarea className="input" style={inputStyle} rows={2} placeholder="If we do X, we expect Y because Z." value={data.hypothesis} onChange={e => set('hypothesis', e.target.value)} />
            </div>

            {/* Team */}
            <div>
              <label className="label">Team Members</label>
              {data.team.map(m => (
                <div key={m.id} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text2)' }}>{m.name}{m.role ? ` — ${m.role}` : ''}</span>
                  <button type="button" onClick={() => set('team', data.team.filter(t => t.id !== m.id))} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>×</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" style={{ flex: 2, fontSize: 12 }} placeholder="Name" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTeam()} />
                <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Role" value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTeam()} />
                <button type="button" onClick={addTeam} style={{ background: 'rgba(1,118,211,0.15)', border: '1px solid rgba(1,118,211,0.3)', color: '#0176D3', borderRadius: 8, cursor: 'pointer', fontSize: 16, minWidth: 36 }}>+</button>
              </div>
            </div>
          </div>
        )}

        {/* ── DO ── */}
        {phase === 'do' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 8, fontSize: 11, color: '#0176D3' }}>
              Implement your countermeasures. Start small — test on one shift or one product before full rollout.
            </div>

            <div>
              <label className="label">Countermeasures / Actions ({completedCMs}/{data.countermeasures.length} done)</label>
              {data.countermeasures.map(cm => (
                <div key={cm.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start', padding: '8px 10px', borderRadius: 8, background: cm.status === 'done' ? 'rgba(29,209,161,0.06)' : 'transparent', border: `1px solid ${cm.status === 'done' ? 'rgba(29,209,161,0.2)' : 'var(--border)'}` }}>
                  <button type="button" onClick={() => toggleCM(cm.id)} style={{ background: 'none', border: `2px solid ${cm.status === 'done' ? '#1DD1A1' : 'var(--text3)'}`, borderRadius: 4, width: 18, height: 18, cursor: 'pointer', flexShrink: 0, marginTop: 1, color: cm.status === 'done' ? '#1DD1A1' : 'transparent', fontSize: 12, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cm.status === 'done' ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: cm.status === 'done' ? 'var(--text3)' : 'var(--text2)', textDecoration: cm.status === 'done' ? 'line-through' : 'none' }}>{cm.action}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                      {cm.owner && `${cm.owner}`}{cm.dueDate && ` · ${cm.dueDate}`}
                    </div>
                  </div>
                  <button type="button" onClick={() => removeCM(cm.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>×</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <input className="input" style={{ flex: 3, minWidth: 120, fontSize: 12 }} placeholder="Action / countermeasure *" value={newCM.action} onChange={e => setNewCM(p => ({ ...p, action: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addCM()} />
                <input className="input" style={{ flex: 1, minWidth: 80, fontSize: 12 }} placeholder="Owner" value={newCM.owner} onChange={e => setNewCM(p => ({ ...p, owner: e.target.value }))} />
                <input className="input" type="date" style={{ flex: 1, minWidth: 100, fontSize: 12 }} value={newCM.dueDate} onChange={e => setNewCM(p => ({ ...p, dueDate: e.target.value }))} />
                <button type="button" onClick={addCM} style={{ background: 'rgba(1,118,211,0.15)', border: '1px solid rgba(1,118,211,0.3)', color: '#0176D3', borderRadius: 8, cursor: 'pointer', fontSize: 16, minWidth: 36 }}>+</button>
              </div>
            </div>

            <div>
              <label className="label">Implementation Notes</label>
              <textarea className="input" style={inputStyle} rows={3} placeholder="What was done, what challenges arose, what was adjusted during implementation?" value={data.implementation} onChange={e => set('implementation', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── CHECK ── */}
        {phase === 'check' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 8, fontSize: 11, color: '#1DD1A1' }}>
              Measure whether the countermeasures worked. Compare before vs after using the same metrics you defined in Plan.
            </div>

            <div>
              <label className="label">Before / After Metrics</label>
              {data.metrics.map(m => (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 60px 32px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{m.name}</span>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)' }}>Before</div>
                    <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#FF6B6B' }}>{m.before || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)' }}>After</div>
                    <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#1DD1A1' }}>{m.after || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--text3)' }}>{m.unit}</div>
                  <button type="button" onClick={() => removeMetric(m.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>×</button>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 60px 36px', gap: 6 }}>
                <input className="input" style={{ fontSize: 12 }} placeholder="Metric name" value={newMetric.name} onChange={e => setNewMetric(p => ({ ...p, name: e.target.value }))} />
                <input className="input" style={{ fontSize: 12 }} placeholder="Before" value={newMetric.before} onChange={e => setNewMetric(p => ({ ...p, before: e.target.value }))} />
                <input className="input" style={{ fontSize: 12 }} placeholder="After" value={newMetric.after} onChange={e => setNewMetric(p => ({ ...p, after: e.target.value }))} />
                <input className="input" style={{ fontSize: 12 }} placeholder="Unit" value={newMetric.unit} onChange={e => setNewMetric(p => ({ ...p, unit: e.target.value }))} />
                <button type="button" onClick={addMetric} style={{ background: 'rgba(29,209,161,0.15)', border: '1px solid rgba(29,209,161,0.3)', color: '#1DD1A1', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
            </div>

            <div>
              <label className="label">Results Summary</label>
              <textarea className="input" style={inputStyle} rows={3} placeholder="Describe what happened. Did the metrics improve? By how much? Were there any unexpected effects?" value={data.results} onChange={e => set('results', e.target.value)} />
            </div>

            <div>
              <label className="label">Was the target achieved?</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { val: 'yes', label: 'Yes', color: '#1DD1A1' },
                  { val: 'partial', label: 'Partially', color: '#0176D3' },
                  { val: 'no', label: 'No — loop back', color: '#FF6B6B' },
                ].map(o => (
                  <button key={o.val} type="button" onClick={() => set('achieved', o.val)}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700,
                      background: data.achieved === o.val ? o.color + '22' : 'var(--bg)',
                      border: `1.5px solid ${data.achieved === o.val ? o.color : 'var(--border)'}`,
                      color: data.achieved === o.val ? o.color : 'var(--text3)' }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ACT ── */}
        {phase === 'act' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(140,68,204,0.06)', border: '1px solid rgba(140,68,204,0.2)', borderRadius: 8, fontSize: 11, color: '#8C44CC' }}>
              If the target was met — standardise and prevent reversion. If not — adjust the plan and run the next cycle.
            </div>

            <div>
              <label className="label">Standardisation Actions</label>
              <textarea className="input" style={inputStyle} rows={3} placeholder="How will you lock in the gains? Update SOPs, train operators, update control plans, change specifications?" value={data.standardisation} onChange={e => set('standardisation', e.target.value)} />
            </div>
            <div>
              <label className="label">Lessons Learned</label>
              <textarea className="input" style={inputStyle} rows={3} placeholder="What worked? What didn't? What would you do differently? What should the whole team know?" value={data.lessonsLearned} onChange={e => set('lessonsLearned', e.target.value)} />
            </div>
            <div>
              <label className="label">Next PDCA Cycle / Remaining Gaps</label>
              <textarea className="input" style={inputStyle} rows={2} placeholder="What still needs improvement? What is the next cycle's problem statement?" value={data.nextCycle} onChange={e => set('nextCycle', e.target.value)} />
            </div>
          </div>
        )}

        {/* Export section */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <button type="button" onClick={() => setShowExport(v => !v)}
            style={{ width: '100%', padding: '10px 14px', background: 'rgba(1,118,211,0.06)', border: 'none', color: '#0176D3', fontWeight: 700, fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
            <span>Export Report — Choose Format</span>
            <span>{showExport ? '▲' : '▼'}</span>
          </button>
          {showExport && (
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                One project, five professional formats. Same data — different lens for your audience.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {FORMAT_CFG.map(fmt => (
                  <button key={fmt.id} type="button"
                    onClick={() => setExportFormat(fmt.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      background: exportFormat === fmt.id ? `${fmt.color}15` : 'var(--bg)',
                      border: `1.5px solid ${exportFormat === fmt.id ? fmt.color : 'var(--border)'}` }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: fmt.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: exportFormat === fmt.id ? fmt.color : 'var(--text)' }}>{fmt.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{fmt.desc}</div>
                    </div>
                    {exportFormat === fmt.id && <span style={{ marginLeft: 'auto', color: fmt.color, fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
              <button type="button" onClick={exportReport} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                Export as {FORMAT_CFG.find(f => f.id === exportFormat)?.label} Report
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
