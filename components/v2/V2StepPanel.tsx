// @ts-nocheck
'use client'
import { SERIF, CI_TOOLS, STEP_TYPES, VA_OPTIONS, CT_UNITS, BRAND, RED, GREEN, AMBER } from './v2-constants'
// ── components/v2/V2StepPanel.tsx ──────────────────────────────────────────────
// Slide-in right panel for editing a step.
// All step data editable. CI tools via dropdown. SOP diff prompt when editing.

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { saveToolData } from '@/lib/db'
import toast from 'react-hot-toast'

interface Props { step: any; project: any; profile: any; t: any; onUpdate: (s: any) => void; onDelete: () => void; onClose: () => void }

export function V2StepPanel({ step, project, profile, t, onUpdate, onDelete, onClose }: Props) {
  const [form, setForm] = useState({ ...step, tasks: step.tasks || [] })
  const [newTask, setNewTask] = useState('')
  const [showCIMenu, setShowCIMenu] = useState(false)
  const [activeCITool, setActiveCITool] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [sopChanged, setSopChanged] = useState(false)
  const [sopDismissed, setSopDismissed] = useState(false)
  const supabase = createClient()

  // Detect SOP diff — show prompt when user edits a parsed step
  useEffect(() => {
    if (form.from_sop && !sopDismissed) {
      const changed = form.name !== step.name || form.cycle_time !== step.cycle_time ||
        JSON.stringify(form.tasks) !== JSON.stringify(step.tasks || [])
      setSopChanged(changed)
    }
  }, [form, step, sopDismissed])

  const update = (patch: any) => setForm((f: any) => ({ ...f, ...patch }))

  const save = async () => {
    setSaving(true)
    const missing: string[] = []
    if (!form.cycle_time || form.cycle_time === 0) missing.push('cycle_time')
    if (!form.operators || form.operators === 0) missing.push('operators')
    if (!form.department) missing.push('department')
    const updated = { ...form, missing_info_flags: missing }
    await onUpdate(updated)
    toast.success('Step saved')
    setSaving(false)
  }

  const addTask = () => {
    if (!newTask.trim()) return
    update({ tasks: [...(form.tasks || []), newTask.trim()] })
    setNewTask('')
  }

  const removeTask = (i: number) => update({ tasks: form.tasks.filter((_: any, idx: number) => idx !== i) })

  const ia = (field: string, placeholder: string, type = 'text', style: any = {}) => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[field] ?? ''}
      onChange={e => update({ [field]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--sl-50)', ...style }}
    />
  )

  const iLabel = (label: string, required = false) => (
    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginBottom: 4, display: 'block' }}>
      {label}{required && <span style={{ color: '#C0402A', marginLeft: 2 }}>*</span>}
    </label>
  )

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: 1.5, color: BRAND, marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
        {title}
      </div>
      {children}
    </div>
  )

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: 380,
      background: 'white', borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 20,
      boxShadow: '-8px 0 32px rgba(0,0,0,.08)',
      animation: 'slideIn .2s ease',
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>

      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontFamily: 'monospace', color: BRAND, letterSpacing: 1.5, marginBottom: 4 }}>
              STEP {(step.position || 0) + 1} · {STEP_TYPES.find(s => s.id === form.step_type)?.iso}
            </div>
            <input
              value={form.name}
              onChange={e => update({ name: e.target.value })}
              style={{ width: '100%', fontFamily: SERIF, fontSize: 17, fontWeight: 700, border: 'none', outline: 'none', padding: 0, color: 'var(--text)', background: 'transparent' }}
              placeholder="Step name…"
            />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text3)', padding: '2px 4px', flexShrink: 0 }}>×</button>
        </div>

        {/* SOP change prompt */}
        {form.from_sop && sopChanged && !sopDismissed && (
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(244,166,35,.08)', border: '1px solid rgba(244,166,35,.3)', borderRadius: 7, fontSize: 11, color: '#7A5200', lineHeight: 1.6 }}>
            ℹ️ This step came from your uploaded SOP. Your changes differ from the original. If this improvement is not yet in your action plan, <strong>consider reporting this change to your process control department</strong> for future SOP updates.
            <button onClick={() => setSopDismissed(true)} style={{ display: 'block', marginTop: 5, fontSize: 10, color: '#7A5200', background: 'none', border: '1px solid rgba(244,166,35,.4)', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Understood — dismiss</button>
          </div>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

        {section('STEP TYPE & CLASSIFICATION', (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {iLabel('Step Type')}
              <select value={form.step_type} onChange={e => update({ step_type: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, background: 'var(--sl-50)', color: 'var(--text)' }}>
                {STEP_TYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              {iLabel('VA Classification')}
              <select value={form.is_value_added || 'unclassified'} onChange={e => update({ is_value_added: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, background: 'var(--sl-50)', color: 'var(--text)' }}>
                {VA_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              {form.is_value_added && form.is_value_added !== 'unclassified' && (
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                  {VA_OPTIONS.find(o => o.id === form.is_value_added)?.desc}
                </div>
              )}
            </div>
          </div>
        ))}

        {section('TASKS — What physically happens here', (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
              {(form.tasks || []).map((task: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '6px 9px', background: 'var(--sl-50)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 10, color: BRAND, fontFamily: 'monospace', flexShrink: 0, marginTop: 2 }}>{i+1}.</span>
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{task}</span>
                  <button onClick={() => removeTask(i)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 14, padding: 0, flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTask() }}
                placeholder={`e.g. Pick ${t?.product || 'product'} from shelf…`}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--sl-50)' }}
              />
              <button onClick={addTask} style={{ padding: '7px 14px', borderRadius: 7, border: 'none', background: BRAND, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
            <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>
              Be specific — e.g. "Move pallet to staging area" not "Move product"
            </p>
          </>
        ))}

        {section('CYCLE TIME & PARAMETERS', (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
              <div>
                {iLabel(`${t?.cycleTime || 'Cycle Time'} *`, true)}
                <input type="number" value={form.cycle_time || ''} min="0"
                  onChange={e => update({ cycle_time: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--sl-50)' }}/>
              </div>
              <div>
                {iLabel('Unit')}
                <select value={form.cycle_time_unit || 'seconds'} onChange={e => update({ cycle_time_unit: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, background: 'var(--sl-50)', color: 'var(--text)' }}>
                  {CT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              {iLabel('Data type')}
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ id: 'measured', label: 'Measured (real data)' }, { id: 'assumed', label: 'Estimated / Assumed' }].map(opt => (
                  <button key={opt.id} onClick={() => update({ cycle_time_type: opt.id })}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: '1.5px solid', borderColor: form.cycle_time_type === opt.id ? BRAND : 'var(--border)', background: form.cycle_time_type === opt.id ? 'rgba(1,118,211,.06)' : 'white', fontSize: 11, fontWeight: form.cycle_time_type === opt.id ? 700 : 400, color: form.cycle_time_type === opt.id ? BRAND : 'var(--text2)', cursor: 'pointer' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {form.cycle_time_type === 'assumed' && (
                <input value={form.cycle_time_notes || ''} onChange={e => update({ cycle_time_notes: e.target.value })}
                  placeholder="Reason for estimate (e.g. based on similar process, industry benchmark)…"
                  style={{ width: '100%', marginTop: 6, padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 11, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--sl-50)' }}/>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>{iLabel('Wait time')}{ia('wait_time', '0', 'number')}</div>
              <div>{iLabel('Operators')}{ia('operators', '1', 'number')}</div>
              <div>{iLabel('Defect rate %')}{ia('defect_rate', '0', 'number')}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>{iLabel('WIP')}{ia('wip', '0', 'number')}</div>
              <div>{iLabel('Uptime %')}{ia('uptime', '95', 'number')}</div>
            </div>
          </div>
        ))}

        {section('FLOW TYPE', (
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ id: 'push', label: '→ Push', desc: 'Upstream pushes regardless of demand' },
              { id: 'supermarket', label: '⟵ Pull/Supermarket', desc: 'Downstream pulls when ready' }].map(opt => (
              <button key={opt.id} onClick={() => update({ flow_type: opt.id })}
                style={{ flex: 1, padding: '8px 10px', borderRadius: 7, border: '1.5px solid', borderColor: form.flow_type === opt.id ? BRAND : 'var(--border)', background: form.flow_type === opt.id ? 'rgba(1,118,211,.06)' : 'white', fontSize: 11, fontWeight: form.flow_type === opt.id ? 700 : 400, color: form.flow_type === opt.id ? BRAND : 'var(--text2)', cursor: 'pointer', textAlign: 'center' }}>
                <div>{opt.label}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        ))}

        {section('GOVERNING ENTITY (Process Control)', (
          <>
            <input
              value={form.governing_entity || ''}
              onChange={e => update({ governing_entity: e.target.value })}
              placeholder="e.g. FDA, Hospital Board, CQC, Food Standards Agency, CRM System…"
              style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--sl-50)' }}
            />
            <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, lineHeight: 1.6 }}>
              The regulatory body, department, or system that controls or monitors this step. Appears on the map as a process control box (ISO convention).
            </p>
          </>
        ))}

        {section('DEPARTMENT', (
          ia('department', `e.g. ${t?.gemba || 'Operations'}, Quality, Finance, Nursing…`)
        ))}

        {section('NOTES', (
          <textarea value={form.notes || ''} onChange={e => update({ notes: e.target.value })}
            placeholder="Observations, constraints, issues, context…"
            style={{ width: '100%', minHeight: 70, padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'inherit', resize: 'vertical', color: 'var(--text)', background: 'var(--sl-50)' }}/>
        ))}

        {/* CI Tools dropdown */}
        {section('CI TOOLS', (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowCIMenu(v => !v)} style={{
              width: '100%', padding: '9px 14px', borderRadius: 8, border: '1.5px solid var(--border)',
              background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text2)',
            }}>
              <span>⚡ Select CI tool for this step…</span>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{showCIMenu ? '▲' : '▼'}</span>
            </button>
            {showCIMenu && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30, background: 'white', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,.12)', marginTop: 4, overflow: 'hidden' }}>
                {CI_TOOLS.map(tool => (
                  <button key={tool.id} onClick={() => { setActiveCITool(tool.id); setShowCIMenu(false) }}
                    style={{ width: '100%', padding: '10px 14px', background: activeCITool === tool.id ? 'rgba(1,118,211,.06)' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 18 }}>{tool.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{tool.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {activeCITool && (
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(1,118,211,.05)', border: '1px solid rgba(1,118,211,.2)', borderRadius: 8, fontSize: 12, color: 'var(--text2)' }}>
                <strong>{CI_TOOLS.find(c => c.id === activeCITool)?.icon} {CI_TOOLS.find(c => c.id === activeCITool)?.label}</strong> selected.
                Save this step first, then open the tool from the step card in the builder tab.
                <button onClick={() => setActiveCITool(null)} style={{ marginLeft: 8, fontSize: 10, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
              </div>
            )}
          </div>
        ))}

        {/* Delete */}
        <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <button onClick={() => { if (confirm('Delete this step? This cannot be undone.')) onDelete() }}
            style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(192,64,42,.3)', background: 'rgba(192,64,42,.05)', color: '#C0402A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Delete step
          </button>
        </div>
      </div>

      {/* Save footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'white' }}>
        <button onClick={save} disabled={saving} style={{
          width: '100%', padding: '11px 0', borderRadius: 9, border: 'none',
          background: saving ? 'var(--sl-200)' : 'linear-gradient(135deg,#0a5eaa,#0176D3)',
          color: saving ? 'var(--text3)' : 'white', fontSize: 14, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
        }}>
          {saving ? 'Saving…' : 'Save step ✓'}
        </button>
      </div>
    </div>
  )
}
