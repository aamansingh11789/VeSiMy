// @ts-nocheck
'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

interface Props {
  steps: any[]
  project: any
  takt: number
  pce: number | null
  onSaveRoadmap?: (roadmap: any) => void
}

const PHASE_COLORS = ['#0176D3', '#1DD1A1', '#6CB9FC', '#FF6B6B', '#8C44CC']
const STATUS_CFG = {
  planned:     { label: 'Planned',     color: 'var(--text3)', bg: 'rgba(112,112,160,0.1)' },
  active:      { label: 'Active',      color: '#0176D3', bg: 'rgba(1,118,211,0.1)'   },
  complete:    { label: 'Complete',    color: '#1DD1A1', bg: 'rgba(29,209,161,0.1)'  },
  cancelled:   { label: 'Cancelled',  color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)' },
}

function uid() { return Math.random().toString(36).slice(2, 9) }
function fmtS(s: number) { if (!s) return '—'; if (s < 60) return `${s}s`; return `${Math.floor(s/60)}m ${s%60}s` }

export default function KaizenRoadmap({ steps, project, takt, pce, onSaveRoadmap }: Props) {
  const mainSteps = steps.filter(s => s.is_main_flow !== false)

  // Load saved roadmap from project or init empty
  const [phases, setPhases] = useState<any[]>(project?.kaizen_roadmap?.phases || [
    { id: uid(), name: 'Phase 1 — Quick Wins', color: PHASE_COLORS[0], target_pce: '', events: [] },
  ])
  const [showAddPhase, setShowAddPhase] = useState(false)
  const [newPhaseName, setNewPhaseName] = useState('')
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id || null)
  const [showAddEvent, setShowAddEvent] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState({ title: '', stepId: '', target_ct: '', target_wip: '', owner: '', dueDate: '', expected_pce_gain: '' })

  const currentPCE = pce !== null ? pce : 0

  const saveTimer = useRef<any>(null)
  const supabase = createClient()
  useEffect(() => {
    if (!project?.id) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await supabase.from('projects')
        .update({ kaizen_roadmap: { phases }, updated_at: new Date().toISOString() })
        .eq('id', project.id)
        .eq('user_id', project.user_id)
      if (onSaveRoadmap) onSaveRoadmap({ phases })
    }, 1500)
    return () => clearTimeout(saveTimer.current)
  }, [phases, project?.id])

  const totalEvents = phases.flatMap(p => p.events).length
  const completeEvents = phases.flatMap(p => p.events).filter(e => e.status === 'complete').length
  const progressPct = totalEvents > 0 ? Math.round(completeEvents / totalEvents * 100) : 0

  function addPhase() {
    if (!newPhaseName.trim()) return
    const color = PHASE_COLORS[phases.length % PHASE_COLORS.length]
    const id = uid()
    setPhases(prev => [...prev, { id, name: newPhaseName.trim(), color, target_pce: '', events: [] }])
    setExpandedPhase(id)
    setNewPhaseName('')
    setShowAddPhase(false)
  }

  function deletePhase(pid: string) {
    if (!confirm('Delete this phase and all its events?')) return
    setPhases(prev => prev.filter(p => p.id !== pid))
  }

  function updatePhase(pid: string, key: string, value: string) {
    setPhases(prev => prev.map(p => p.id === pid ? { ...p, [key]: value } : p))
  }

  function addEvent(pid: string) {
    if (!newEvent.title.trim()) return
    const event = { id: uid(), status: 'planned', ...newEvent, created: Date.now() }
    setPhases(prev => prev.map(p => p.id === pid ? { ...p, events: [...p.events, event] } : p))
    setNewEvent({ title: '', stepId: '', target_ct: '', target_wip: '', owner: '', dueDate: '', expected_pce_gain: '' })
    setShowAddEvent(null)
  }

  function updateEventStatus(pid: string, eid: string, status: string) {
    setPhases(prev => prev.map(p =>
      p.id === pid ? { ...p, events: p.events.map((e: any) => e.id === eid ? { ...e, status } : e) } : p
    ))
  }

  function deleteEvent(pid: string, eid: string) {
    setPhases(prev => prev.map(p =>
      p.id === pid ? { ...p, events: p.events.filter((e: any) => e.id !== eid) } : p
    ))
  }

  // Project PCE projections per phase
  const projections = useMemo(() => {
    let running = currentPCE
    return phases.map(p => {
      const gain = p.events
        .filter((e: any) => e.expected_pce_gain)
        .reduce((a: number, e: any) => a + Number(e.expected_pce_gain || 0), 0)
      running = Math.min(100, running + gain)
      return { phaseId: p.id, projectedPCE: running }
    })
  }, [phases, currentPCE])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '0 0 40px' }}>

      {/* Header */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace', marginBottom: 4 }}>KAIZEN ROADMAP — MISSION CONTROL</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{project?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Current State → Future State Improvement Plan</div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Current PCE', value: pce !== null ? `${pce.toFixed(0)}%` : '—', color: pce !== null && pce >= 80 ? '#1DD1A1' : pce !== null && pce >= 50 ? '#0176D3' : '#FF6B6B' },
              { label: 'Target PCE', value: phases.length > 0 && phases[phases.length-1].target_pce ? `${phases[phases.length-1].target_pce}%` : '95%', color: '#1DD1A1' },
              { label: 'Events', value: `${completeEvents}/${totalEvents}`, color: '#6CB9FC' },
              { label: 'Progress', value: `${progressPct}%`, color: '#0176D3' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        {totalEvents > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
              <span>Overall completion</span>
              <span>{completeEvents} of {totalEvents} events complete</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #0176D3, #1DD1A1)', borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
          </div>
        )}
      </div>

      {/* PCE Journey */}
      {projections.length > 0 && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace', marginBottom: 10 }}>PCE IMPROVEMENT JOURNEY</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
            {/* Current state */}
            <div style={{ textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: pce !== null && pce >= 80 ? '#1DD1A1' : '#FF6B6B', marginBottom: 4 }}>
                {pce !== null ? `${pce.toFixed(0)}%` : '—'}
              </div>
              <div style={{ height: pce !== null ? Math.max(8, pce * 0.8) : 8, background: 'var(--text3)', borderRadius: '4px 4px 0 0', width: 40, margin: '0 auto' }} />
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 4 }}>Current</div>
            </div>
            {projections.map((proj, i) => {
              const phase = phases.find(p => p.id === proj.phaseId)
              const color = phase?.color || PHASE_COLORS[i % PHASE_COLORS.length]
              return (
                <div key={proj.phaseId} style={{ textAlign: 'center', minWidth: 70, flex: 1 }}>
                  <div style={{ height: 1, background: color, opacity: 0.4, margin: '0 0 24px' }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 4 }}>{proj.projectedPCE.toFixed(0)}%</div>
                  <div style={{ height: Math.max(8, proj.projectedPCE * 0.8), background: color, borderRadius: '4px 4px 0 0', width: 40, margin: '0 auto', opacity: 0.8 }} />
                  <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 70 }}>
                    {phase?.name?.split('—')[0]?.trim() || `Phase ${i+1}`}
                  </div>
                </div>
              )
            })}
            {/* Target 95% line */}
            <div style={{ position: 'absolute', right: 20, top: 0 }} />
          </div>
        </div>
      )}

      {/* Phases */}
      {phases.map((phase, pi) => {
        const isExpanded = expandedPhase === phase.id
        const phaseComplete = phase.events.length > 0 && phase.events.every((e: any) => e.status === 'complete')
        const phaseActive = phase.events.some((e: any) => e.status === 'active')
        const projPCE = projections.find(p => p.phaseId === phase.id)?.projectedPCE

        return (
          <div key={phase.id} style={{ border: `1px solid ${phase.color}44`, borderRadius: 12, overflow: 'hidden' }}>
            {/* Phase header */}
            <div
              onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: `${phase.color}10`, cursor: 'pointer', gap: 10, flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: phase.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{phase.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                    {phase.events.length} events · {phase.events.filter((e: any) => e.status === 'complete').length} complete
                    {projPCE ? ` · PCE target: ${projPCE.toFixed(0)}%` : ''}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 999, background: phaseComplete ? 'rgba(29,209,161,0.15)' : phaseActive ? 'rgba(1,118,211,0.15)' : 'rgba(112,112,160,0.15)', color: phaseComplete ? '#1DD1A1' : phaseActive ? '#0176D3' : 'var(--text3)', fontWeight: 700 }}>
                  {phaseComplete ? 'COMPLETE' : phaseActive ? 'ACTIVE' : 'PLANNED'}
                </span>
                <span style={{ color: 'var(--text3)', fontSize: 12 }}>{isExpanded ? '▲' : '▼'}</span>
              </div>
            </div>

            {isExpanded && (
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Phase target PCE */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: 10, color: 'var(--text3)', minWidth: 100 }}>Target PCE for phase:</label>
                  <input
                    className="input"
                    type="number" min="0" max="100"
                    placeholder="e.g. 75"
                    value={phase.target_pce}
                    onChange={e => updatePhase(phase.id, 'target_pce', e.target.value)}
                    style={{ width: 80, fontSize: 12 }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--text3)' }}>%</span>
                  <button type="button" onClick={() => deletePhase(phase.id)} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>
                    Delete Phase
                  </button>
                </div>

                {/* Events list */}
                {phase.events.map((event: any) => {
                  const sc = STATUS_CFG[event.status as keyof typeof STATUS_CFG] || STATUS_CFG.planned
                  const linkedStep = steps.find(s => s.id === event.stepId)
                  return (
                    <div key={event.id} style={{ border: `1px solid ${sc.color}33`, borderRadius: 8, padding: '10px 14px', background: sc.bg }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{event.title}</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 10, color: 'var(--text3)' }}>
                            {linkedStep && <span>Step: {linkedStep.name}</span>}
                            {event.owner && <span>{event.owner}</span>}
                            {event.dueDate && <span>{event.dueDate}</span>}
                            {event.target_ct && <span>CT target: {event.target_ct}s</span>}
                            {event.target_wip && <span>WIP target: {event.target_wip}</span>}
                            {event.expected_pce_gain && <span style={{ color: '#1DD1A1' }}>+{event.expected_pce_gain}% PCE</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                          <select
                            value={event.status}
                            onChange={e => updateEventStatus(phase.id, event.id, e.target.value)}
                            style={{ background: 'var(--bg)', border: `1px solid ${sc.color}`, borderRadius: 6, color: sc.color, fontSize: 10, padding: '3px 6px', fontWeight: 700 }}
                          >
                            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                          <button type="button" onClick={() => deleteEvent(phase.id, event.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>×</button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Add event form */}
                {showAddEvent === phase.id ? (
                  <div style={{ border: '1px solid rgba(1,118,211,0.3)', borderRadius: 10, padding: '12px 14px', background: 'rgba(1,118,211,0.04)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0176D3' }}>Add Kaizen Event</div>
                    <input className="input" placeholder="Event title *" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} style={{ fontSize: 12 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Linked Step</label>
                        <select className="input" value={newEvent.stepId} onChange={e => setNewEvent(p => ({ ...p, stepId: e.target.value }))} style={{ fontSize: 12 }}>
                          <option value="">— none —</option>
                          {steps.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Owner</label>
                        <input className="input" placeholder="Name" value={newEvent.owner} onChange={e => setNewEvent(p => ({ ...p, owner: e.target.value }))} style={{ fontSize: 12 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Target CT (sec)</label>
                        <input className="input" type="number" placeholder="e.g. 90" value={newEvent.target_ct} onChange={e => setNewEvent(p => ({ ...p, target_ct: e.target.value }))} style={{ fontSize: 12 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Target WIP</label>
                        <input className="input" type="number" placeholder="e.g. 5" value={newEvent.target_wip} onChange={e => setNewEvent(p => ({ ...p, target_wip: e.target.value }))} style={{ fontSize: 12 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Due Date</label>
                        <input className="input" type="date" value={newEvent.dueDate} onChange={e => setNewEvent(p => ({ ...p, dueDate: e.target.value }))} style={{ fontSize: 12 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>Expected PCE Gain (%)</label>
                        <input className="input" type="number" placeholder="e.g. 5" value={newEvent.expected_pce_gain} onChange={e => setNewEvent(p => ({ ...p, expected_pce_gain: e.target.value }))} style={{ fontSize: 12 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => addEvent(phase.id)} className="btn btn-primary" style={{ flex: 1 }}>Add Event</button>
                      <button type="button" onClick={() => setShowAddEvent(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(phase.id)}
                    style={{ border: `1px dashed ${phase.color}66`, background: 'transparent', color: phase.color, borderRadius: 8, padding: '8px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                  >
                    + Add Kaizen Event to this Phase
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Add phase */}
      {showAddPhase ? (
        <div style={{ border: '1px solid rgba(1,118,211,0.3)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 8 }}>
          <input className="input" placeholder="Phase name e.g. Phase 2 — Flow Improvement" value={newPhaseName} onChange={e => setNewPhaseName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPhase()} style={{ flex: 1, fontSize: 12 }} autoFocus />
          <button type="button" onClick={addPhase} className="btn btn-primary">Add</button>
          <button type="button" onClick={() => setShowAddPhase(false)} className="btn btn-ghost">Cancel</button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddPhase(true)}
          style={{ border: '1px dashed rgba(1,118,211,0.4)', background: 'transparent', color: '#0176D3', borderRadius: 10, padding: '10px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >
          + Add Phase
        </button>
      )}
    </div>
  )
}
