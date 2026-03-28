// @ts-nocheck
// ── components/v2/StepPopupV2.tsx ────────────────────────────────────────────
// Right-side slide-in panel for editing a step. Keeps map visible.
// Enhanced: tasks, governing entity, cycle time type/unit, CI tools dropdown,
// SOP diff warning.
'use client'
import { useState, useEffect } from 'react'
import { STEP_TYPES } from '@/lib/v2/sop-parser'

const BRAND = '#0176D3'
const RED = '#C0402A'
const AMBER = '#F4A623'
const RULE = 'rgba(1,118,211,0.14)'

const CI_TOOLS = [
  { id: 'time_study', label: 'Time Study',        icon: '⏱',  desc: 'Measure actual cycle time' },
  { id: 'fishbone',   label: 'Fishbone Diagram',  icon: '🦴',  desc: 'Map all cause categories' },
  { id: 'five_why',   label: '5 Why Analysis',    icon: '🔍',  desc: 'Drill to root cause' },
  { id: 'waste_id',   label: 'Waste Identification',icon:'♻️', desc: 'Identify DOWNTIME wastes' },
  { id: 'kaizen',     label: 'Kaizen Event',       icon: '⚡',  desc: 'Log improvement action' },
  { id: 'pdca',       label: 'PDCA Cycle',         icon: '🔄',  desc: 'Plan-Do-Check-Act project' },
  { id: 'smed',       label: 'SMED',               icon: '🔧',  desc: 'Reduce changeover/setup' },
  { id: 'yamazumi',   label: 'Yamazumi Chart',     icon: '📊',  desc: 'Balance operator workload' },
]

const CT_UNITS = ['seconds', 'minutes', 'hours', 'days', 'weeks']

const GOVERNING_SUGGESTIONS: Record<string, string[]> = {
  hospital_acute_care:  ['Hospital Board', 'CQC', 'NICE', 'NHS England', 'MHRA'],
  pharmaceutical_manufacturing: ['FDA', 'EMA', 'MHRA', 'ICH', 'ISO 13485 QMS'],
  law_firm:             ['SRA', 'Bar Standards Board', 'Law Society', 'Court Rules'],
  restaurant_food_service: ['Food Standards Agency', 'Environmental Health', 'HSE'],
  automotive_manufacturing: ['IATF 16949', 'OEM Quality System', 'PPAP', 'AIAG'],
  retail_banking:       ['FCA', 'PRA', 'Basel III', 'AML Policy', 'GDPR'],
  software_development: ['SOC 2', 'GDPR', 'ISO 27001', 'Product Roadmap', 'JIRA'],
  default:              ['ISO 9001 QMS', 'Internal Policy', 'Regulatory Body', 'Customer Requirements'],
}

interface Props {
  step: any
  industry?: string
  onSave: (updated: any) => void
  onClose: () => void
  onOpenCITool: (stepId: string, toolId: string) => void
  onDelete?: () => void
  sopDiff?: boolean   // true if this step came from SOP and user edited it
}

export function StepPopupV2({ step, industry, onSave, onClose, onOpenCITool, onDelete, sopDiff }: Props) {
  const [form, setForm] = useState({ ...step, tasks: step.tasks || [] })
  const [newTask, setNewTask] = useState('')
  const [showCIMenu, setShowCIMenu] = useState(false)
  const [showSopWarning, setShowSopWarning] = useState(false)
  const [dirty, setDirty] = useState(false)
  const govSuggestions = GOVERNING_SUGGESTIONS[industry || 'default'] || GOVERNING_SUGGESTIONS.default

  function set(key: string, val: any) {
    setForm((f: any) => ({ ...f, [key]: val }))
    setDirty(true)
    if (sopDiff && step.from_sop && !showSopWarning) setShowSopWarning(true)
  }

  function addTask() {
    if (!newTask.trim()) return
    set('tasks', [...(form.tasks || []), newTask.trim()])
    setNewTask('')
  }

  function removeTask(i: number) {
    set('tasks', form.tasks.filter((_: any, idx: number) => idx !== i))
  }

  function handleSave() {
    onSave(form)
    setDirty(false)
    setShowSopWarning(false)
  }

  const serif = 'DM Serif Display, Georgia, serif'
  const mono = 'IBM Plex Mono, monospace'

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
      background: 'white', borderLeft: `1px solid ${RULE}`,
      boxShadow: '-8px 0 40px rgba(0,0,0,0.1)', zIndex: 200,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${RULE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(1,118,211,0.04), white)', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 9, color: BRAND, letterSpacing: 2,
            textTransform: 'uppercase', marginBottom: 4 }}>
            {STEP_TYPES.find(t => t.id === form.step_type)?.label || 'Process Step'}
            <span style={{ opacity: 0.5 }}> · ISO {STEP_TYPES.find(t => t.id === form.step_type)?.iso}</span>
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, color: '#0D0C0A',
            margin: 0, lineHeight: 1.2 }}>
            {form.name || 'Edit Step'}
          </h2>
        </div>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%',
          border: `1px solid ${RULE}`, background: 'white', cursor: 'pointer',
          fontSize: 18, color: '#6B6760', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ×
        </button>
      </div>

      {/* SOP change warning */}
      {showSopWarning && (
        <div style={{ margin: '12px 16px 0', padding: '10px 14px',
          background: 'rgba(244,166,35,0.08)', border: `1px solid ${AMBER}`,
          borderRadius: 8, fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>
          <strong>⚠ SOP difference detected.</strong> This step was extracted from your uploaded SOP. If this change is not part of your improvement plan, consider flagging it to your Process Control department for SOP revision.
          <button onClick={() => setShowSopWarning(false)} style={{ display: 'block', marginTop: 6,
            background: 'none', border: 'none', color: AMBER, cursor: 'pointer', fontSize: 11, padding: 0 }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Body — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex',
        flexDirection: 'column', gap: 20 }}>

        {/* Name + Step type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>Step Name *</label>
            <input className="input" value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Quality Inspection"
              style={{ width: '100%' }}/>
          </div>
          <div>
            <label style={lbl}>Step Type</label>
            <select className="input" value={form.step_type || 'process'}
              onChange={e => set('step_type', e.target.value)} style={{ width: '100%' }}>
              {STEP_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Department + Governing entity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>Department / Role</label>
            <input className="input" value={form.department || ''}
              onChange={e => set('department', e.target.value)}
              placeholder="e.g. Quality, Nursing, Legal"
              style={{ width: '100%' }}/>
          </div>
          <div>
            <label style={lbl}>Governing / Control Entity</label>
            <input className="input" list="gov-suggestions" value={form.governing_entity || ''}
              onChange={e => set('governing_entity', e.target.value)}
              placeholder="e.g. FDA, Hospital Board"
              style={{ width: '100%' }}/>
            <datalist id="gov-suggestions">
              {govSuggestions.map(s => <option key={s} value={s}/>)}
            </datalist>
            <div style={{ fontSize: 10, color: '#8E8A82', marginTop: 3 }}>
              Appears as Process Control on map
            </div>
          </div>
        </div>

        {/* Cycle time */}
        <div>
          <label style={lbl}>Cycle Time</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <input className="input" type="number" min="0"
              value={form.cycle_time || ''} onChange={e => set('cycle_time', e.target.value)}
              placeholder="Value"/>
            <select className="input" value={form.cycle_time_unit || 'seconds'}
              onChange={e => set('cycle_time_unit', e.target.value)}>
              {CT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select className="input" value={form.cycle_time_type || 'measured'}
              onChange={e => set('cycle_time_type', e.target.value)}>
              <option value="measured">Measured</option>
              <option value="assumed">Assumed</option>
            </select>
          </div>
          {form.cycle_time_type === 'assumed' && (
            <input className="input" style={{ marginTop: 6, width: '100%' }}
              value={form.cycle_time_notes || ''}
              onChange={e => set('cycle_time_notes', e.target.value)}
              placeholder="Basis for assumption (e.g. historical average, industry benchmark)"/>
          )}
        </div>

        {/* Operators + WIP + Wait */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div>
            <label style={lbl}>Operators</label>
            <input className="input" type="number" min="0" value={form.operators || ''}
              onChange={e => set('operators', e.target.value)} placeholder="0"/>
          </div>
          <div>
            <label style={lbl}>WIP</label>
            <input className="input" type="number" min="0" value={form.wip || ''}
              onChange={e => set('wip', e.target.value)} placeholder="0"/>
          </div>
          <div>
            <label style={lbl}>Wait Time</label>
            <input className="input" type="number" min="0" value={form.wait_time || ''}
              onChange={e => set('wait_time', e.target.value)} placeholder="0"/>
          </div>
        </div>

        {/* Defect rate + Uptime + Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div>
            <label style={lbl}>Defect Rate %</label>
            <input className="input" type="number" min="0" max="100"
              value={form.defect_rate || ''} onChange={e => set('defect_rate', e.target.value)}
              placeholder="0"/>
          </div>
          <div>
            <label style={lbl}>Uptime %</label>
            <input className="input" type="number" min="0" max="100"
              value={form.uptime || ''} onChange={e => set('uptime', e.target.value)}
              placeholder="100"/>
          </div>
          <div>
            <label style={lbl}>Flow Type</label>
            <select className="input" value={form.flow_type || 'push'}
              onChange={e => set('flow_type', e.target.value)}>
              <option value="push">Push</option>
              <option value="supermarket">Supermarket (Pull)</option>
            </select>
          </div>
        </div>

        {/* Tasks — what physically happens */}
        <div>
          <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 6 }}>
            Tasks in this step
            <span style={{ fontFamily: mono, fontSize: 8, letterSpacing: 1,
              background: 'rgba(1,118,211,0.08)', color: BRAND, padding: '2px 6px', borderRadius: 3 }}>
              WHAT PHYSICALLY HAPPENS
            </span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
            {(form.tasks || []).map((task: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ flex: 1, padding: '7px 10px', background: '#F8F6F0',
                  border: '1px solid #E8E5E0', borderRadius: 6, fontSize: 13, color: '#242220' }}>
                  {task}
                </div>
                <button onClick={() => removeTask(i)} style={{ width: 24, height: 24,
                  border: 'none', background: 'none', cursor: 'pointer', color: '#8E8A82', fontSize: 16 }}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" style={{ flex: 1 }} value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="e.g. Scan barcode, Enter data in CRM, Move pallet to station"/>
            <button onClick={addTask} style={{ padding: '8px 14px', background: BRAND,
              color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              + Add
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={lbl}>Notes</label>
          <textarea className="input" rows={2} value={form.notes || ''}
            onChange={e => set('notes', e.target.value)}
            placeholder="Any specific observations, conditions, or context for this step"
            style={{ width: '100%', resize: 'vertical' }}/>
        </div>

        {/* CI Tools dropdown */}
        <div>
          <label style={lbl}>CI Tools</label>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowCIMenu(v => !v)}
              style={{ width: '100%', padding: '9px 12px', background: 'white',
                border: `1.5px solid ${RULE}`, borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 13, color: '#3A3835' }}>
              <span>Open a CI tool for this step…</span>
              <span style={{ fontSize: 10, opacity: 0.5 }}>{showCIMenu ? '▲' : '▼'}</span>
            </button>
            {showCIMenu && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                background: 'white', border: `1px solid ${RULE}`, borderRadius: 8, marginTop: 4,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {CI_TOOLS.map(tool => (
                  <button key={tool.id}
                    onClick={() => { setShowCIMenu(false); onOpenCITool(step.id, tool.id) }}
                    style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                      textAlign: 'left', transition: 'background .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8F6F0')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{tool.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#242220' }}>{tool.label}</div>
                      <div style={{ fontSize: 11, color: '#8E8A82' }}>{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SOP original text (read-only reference) */}
        {form.sop_original_text && (
          <details>
            <summary style={{ cursor: 'pointer', fontFamily: mono, fontSize: 10,
              letterSpacing: 1, color: '#8E8A82', userSelect: 'none', marginBottom: 6 }}>
              ORIGINAL SOP TEXT ↓
            </summary>
            <div style={{ padding: '10px 12px', background: '#F8F6F0',
              border: '1px solid #E8E5E0', borderRadius: 6, fontSize: 12,
              color: '#6B6760', lineHeight: 1.7, fontStyle: 'italic' }}>
              {form.sop_original_text}
            </div>
          </details>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 20px', borderTop: `1px solid ${RULE}`,
        display: 'flex', gap: 10, flexShrink: 0, background: 'white' }}>
        {onDelete && (
          <button onClick={onDelete} style={{ padding: '9px 14px', border: `1px solid ${RED}`,
            background: 'white', color: RED, borderRadius: 7, cursor: 'pointer',
            fontSize: 13, fontWeight: 600 }}>
            Delete step
          </button>
        )}
        <div style={{ flex: 1 }}/>
        <button onClick={onClose} style={{ padding: '9px 16px', border: `1px solid ${RULE}`,
          background: 'white', color: '#6B6760', borderRadius: 7, cursor: 'pointer',
          fontSize: 13, fontWeight: 500 }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{ padding: '9px 20px',
          background: `linear-gradient(135deg, #0a5eaa, ${BRAND})`, color: 'white',
          border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          Save step ✓
        </button>
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: '#3A3835',
  letterSpacing: 0.3, marginBottom: 5,
}
