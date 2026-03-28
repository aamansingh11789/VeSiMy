// @ts-nocheck
'use client'
import { BRAND } from './v2-constants'
// ── components/v2/V2ProjectClient.tsx ─────────────────────────────────────────
// V2 Project Builder: SOP upload → interactive map → analyze → future state
// Single source of truth. Everything else is downstream of the map.

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { getIndustryTerms, getIndustryLabel } from '@/lib/industry-language'
import { V2MapCanvas } from './V2MapCanvas'
import { V2StepPanel } from './V2StepPanel'
import { V2AnalysisReport } from './V2AnalysisReport'
import { V2FutureStatePanel } from './V2FutureStatePanel'
import { V2Journal } from './V2Journal'
import { SupePanel } from '@/components/supe/SupePanel'
import toast from 'react-hot-toast'

type V2Tab = 'map' | 'analyze' | 'journal' | 'future'

export interface V2Step {
  id: string; project_id: string; name: string; position: number
  step_type: string; tasks: string[]; governing_entity: string; department: string
  notes: string; cycle_time: number; cycle_time_unit: string; cycle_time_type: string
  cycle_time_notes: string; operators: number; uptime: number; defect_rate: number
  wait_time: number; wip: number; flow_type: string; sm_min: number; sm_max: number
  is_value_added: string; missing_info_flags: string[]; from_sop: boolean
  sop_original_text: string; map_x: number; map_y: number; version: string
  toolData?: Record<string, any>
}

interface Props {
  project: any; profile: any; steps: V2Step[]
  onMigrateV1?: () => void
}


export function V2ProjectClient({ project: initialProject, profile, steps: initialSteps }: Props) {
  const supabase = createClient()
  const t = getIndustryTerms(initialProject.industry || profile.industry)
  const indLabel = getIndustryLabel(initialProject.industry || profile.industry)

  const [project, setProject] = useState(initialProject)
  const [steps, setSteps] = useState<V2Step[]>(initialSteps)
  const [tab, setTab] = useState<V2Tab>('map')
  const [selectedStep, setSelectedStep] = useState<V2Step | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSupe, setShowSupe] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [currentReport, setCurrentReport] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [sopMode, setSopMode] = useState<'upload' | 'manual' | 'reference' | null>(
    steps.length === 0 ? null : null
  )
  const [showStartModal, setShowStartModal] = useState(steps.length === 0)
  const [parsing, setParsing] = useState(false)
  const [showFuturePanel, setShowFuturePanel] = useState(false)

  const isPaid = ['pro','lifetime','enterprise'].includes(profile.plan_tier) ||
    profile.lifetime_access || profile.is_beta

  // ── Load reports from DB on mount ────────────────────────────────────────
  useEffect(() => {
    supabase.from('analysis_reports')
      .select('*').eq('project_id', project.id)
      .order('generated_at', { ascending: false })
      .then(({ data }) => { if (data) setReports(data) })
  }, [project.id])

  // ── Save step to DB ───────────────────────────────────────────────────────
  const saveStep = useCallback(async (step: V2Step) => {
    const { id, toolData, ...data } = step
    const { error } = await supabase.from('steps').upsert({ id, ...data, version: 'v2' })
    if (error) toast.error('Save failed: ' + error.message)
    return !error
  }, [supabase])

  // ── Create new step ───────────────────────────────────────────────────────
  const addStep = useCallback(async (afterPosition?: number) => {
    const pos = afterPosition !== undefined ? afterPosition + 1 : steps.length
    const { data, error } = await supabase.from('steps').insert({
      project_id: project.id,
      user_id: profile.id,
      name: `Step ${pos + 1}`,
      position: pos,
      step_type: 'process',
      tasks: [],
      version: 'v2',
      cycle_time_unit: 'seconds',
      cycle_time_type: 'assumed',
      missing_info_flags: ['cycle_time', 'operators', 'defect_rate'],
      from_sop: false,
    }).select('*').single()

    if (error) { toast.error('Could not add step'); return }
    const newStep = { ...data, tasks: [], missing_info_flags: data.missing_info_flags || [] }
    setSteps(prev => {
      const updated = [...prev]
      updated.splice(pos, 0, newStep)
      return updated.map((s, i) => ({ ...s, position: i }))
    })
    setSelectedStep(newStep)
    setPanelOpen(true)
  }, [steps, project.id, profile.id, supabase])

  // ── Update step locally + save ────────────────────────────────────────────
  const updateStep = useCallback(async (updated: V2Step) => {
    setSteps(prev => prev.map(s => s.id === updated.id ? updated : s))
    setSelectedStep(updated)
    await saveStep(updated)
  }, [saveStep])

  // ── Delete step ───────────────────────────────────────────────────────────
  const deleteStep = useCallback(async (stepId: string) => {
    const { error } = await supabase.from('steps').delete().eq('id', stepId)
    if (error) { toast.error('Delete failed'); return }
    setSteps(prev => prev.filter(s => s.id !== stepId).map((s, i) => ({ ...s, position: i })))
    if (selectedStep?.id === stepId) { setSelectedStep(null); setPanelOpen(false) }
  }, [supabase, selectedStep])

  // ── SOP Upload → parse → populate steps ──────────────────────────────────
  const handleSopUpload = useCallback(async (file?: File, manualText?: string) => {
    setParsing(true)
    setShowStartModal(false)
    try {
      const fd = new FormData()
      if (file) fd.append('file', file)
      if (manualText) fd.append('manual_text', manualText)

      const res = await fetch('/api/v2/parse-sop', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Parse failed')

      const { parsed, filename } = data
      toast.success(`Parsed "${filename}" — ${parsed.steps.length} steps extracted`)

      // Save raw text + parsed steps to project
      await supabase.from('projects').update({
        sop_raw_text: data.raw_text_preview,
        sop_filename: filename,
        sop_parsed_at: new Date().toISOString(),
        description: parsed.process_description || project.description,
        version: 'v2',
      }).eq('id', project.id)

      // Insert all parsed steps
      const insertedSteps: V2Step[] = []
      for (let i = 0; i < parsed.steps.length; i++) {
        const ps = parsed.steps[i]
        const { data: stepData } = await supabase.from('steps').insert({
          project_id: project.id,
          user_id: profile.id,
          position: i,
          name: ps.name,
          step_type: ps.step_type || 'process',
          tasks: ps.tasks || [],
          governing_entity: ps.governing_entity || '',
          department: ps.department || '',
          notes: ps.notes || '',
          cycle_time_type: 'assumed',
          cycle_time_unit: ps.cycle_time_unit || 'seconds',
          operators: ps.operators || 1,
          defect_rate: ps.defect_rate || 0,
          wait_time: ps.wait_time || 0,
          wip: ps.wip || 0,
          flow_type: ps.flow_type || 'push',
          missing_info_flags: ps.missing_info_flags || ['cycle_time'],
          from_sop: true,
          sop_original_text: ps.sop_original_text || ps.name,
          version: 'v2',
        }).select('*').single()

        if (stepData) insertedSteps.push({ ...stepData, tasks: stepData.tasks || [], missing_info_flags: stepData.missing_info_flags || [] })
      }

      setSteps(insertedSteps)
      if (parsed.governing_entities?.length > 0) {
        toast(`Governing entities detected: ${parsed.governing_entities.join(', ')}`, { icon: 'ℹ️' })
      }
    } catch (e: any) {
      toast.error(e.message || 'SOP parsing failed')
    } finally {
      setParsing(false)
    }
  }, [project, profile, supabase])

  // ── Analyze current state ─────────────────────────────────────────────────
  const runAnalysis = useCallback(async () => {
    if (steps.length === 0) { toast.error('Add at least one step before analyzing'); return }
    setAnalyzing(true)
    setTab('analyze')
    try {
      const res = await fetch('/api/v2/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCurrentReport(data.report)
      setReports(prev => [data.report, ...prev.filter(r => r.report_type !== 'current_state')])
      toast.success('Analysis complete — see report below')
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed')
      setTab('map')
    } finally {
      setAnalyzing(false)
    }
  }, [steps, project.id])

  // ── Counts ────────────────────────────────────────────────────────────────
  const missingCount = useMemo(() => steps.filter(s => (s.missing_info_flags || []).length > 0).length, [steps])
  const completePct = useMemo(() => {
    if (!steps.length) return 0
    const complete = steps.filter(s => (s.missing_info_flags || []).length === 0).length
    return Math.round((complete / steps.length) * 100)
  }, [steps])

  const TABS: { id: V2Tab; label: string }[] = [
    { id: 'map', label: 'Process Map' },
    { id: 'analyze', label: 'Analysis' },
    { id: 'journal', label: `Journal${reports.length > 0 ? ` (${reports.length})` : ''}` },
    { id: 'future', label: 'Future State' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '0 16px', height: 52,
        borderBottom: '1px solid var(--border)', background: '#FFFFFF', flexShrink: 0, gap: 12,
      }}>
        {/* Project name */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flex: '0 0 auto', maxWidth: 300 }}>
          <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.name}
          </span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: BRAND, background: 'rgba(1,118,211,.08)', border: '1px solid rgba(1,118,211,.2)', borderRadius: 4, padding: '1px 5px', letterSpacing: 1 }}>
            V2
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: tab === t.id ? 700 : 400,
              background: tab === t.id ? 'rgba(1,118,211,.1)' : 'transparent',
              color: tab === t.id ? BRAND : 'var(--text3)',
              transition: 'all .15s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
          {/* Map completeness */}
          {tab === 'map' && steps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: 'var(--sl-100)', border: '1px solid var(--border)' }}>
              <div style={{ width: 60, height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${completePct}%`, background: completePct === 100 ? '#2E844A' : BRAND, transition: 'width .3s' }}/>
              </div>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text3)' }}>{completePct}%</span>
            </div>
          )}

          {/* Add step */}
          {tab === 'map' && (
            <button onClick={() => addStep(steps.length - 1)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
              borderRadius: 7, border: '1px solid var(--border)', background: 'white',
              fontSize: 12, fontWeight: 600, color: 'var(--text2)', cursor: 'pointer',
            }}>
              + Add Step
            </button>
          )}

          {/* Analyze button */}
          <button onClick={runAnalysis} disabled={analyzing || steps.length === 0} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
            borderRadius: 7, border: 'none', cursor: steps.length === 0 ? 'not-allowed' : 'pointer',
            background: analyzing ? 'var(--sl-200)' : 'linear-gradient(135deg,#0a5eaa,#0176D3)',
            color: analyzing ? 'var(--text3)' : 'white', fontSize: 12, fontWeight: 700,
            opacity: steps.length === 0 ? .5 : 1, transition: 'all .15s',
          }}>
            {analyzing ? (
              <><span style={{ width: 10, height: 10, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}/> Analysing…</>
            ) : '⚡ Analyze'}
          </button>

          {/* Supe */}
          {isPaid && (
            <button onClick={() => setShowSupe(v => !v)} title="Supe AI" style={{
              width: 32, height: 32, borderRadius: 7, border: '1px solid var(--border)',
              background: showSupe ? 'rgba(1,118,211,.1)' : 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}>⚡</button>
          )}
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* MAP TAB */}
        {tab === 'map' && (
          <>
            <V2MapCanvas
              steps={steps}
              project={project}
              t={t}
              selectedStepId={selectedStep?.id}
              onStepClick={(step) => { setSelectedStep(step); setPanelOpen(true) }}
              onAddStep={addStep}
              onDeleteStep={deleteStep}
              missingCount={missingCount}
            />
            {/* Step panel (slide-in from right) */}
            {panelOpen && selectedStep && (
              <V2StepPanel
                step={selectedStep}
                project={project}
                profile={profile}
                t={t}
                onUpdate={updateStep}
                onDelete={() => deleteStep(selectedStep.id)}
                onClose={() => { setPanelOpen(false); setSelectedStep(null) }}
              />
            )}
          </>
        )}

        {/* ANALYZE TAB */}
        {tab === 'analyze' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            {analyzing && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(1,118,211,.2)', borderTopColor: BRAND, borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
                <p style={{ color: 'var(--text2)', fontSize: 14 }}>Analysing your {t.valueStream}…</p>
              </div>
            )}
            {!analyzing && currentReport && (
              <V2AnalysisReport report={currentReport} project={project} t={t} indLabel={indLabel}
                onGoFuture={() => { setShowFuturePanel(true); setTab('future') }}
                onGoMap={() => setTab('map')}
              />
            )}
            {!analyzing && !currentReport && (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Ready to analyse</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                  Complete your {t.valueStream} map then click Analyze to generate your current state report.
                </p>
                <button onClick={() => setTab('map')} style={{
                  padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>← Go to map</button>
              </div>
            )}
          </div>
        )}

        {/* JOURNAL TAB */}
        {tab === 'journal' && (
          <V2Journal reports={reports} project={project} t={t} indLabel={indLabel}
            onLoadReport={(r) => { setCurrentReport(r); setTab('analyze') }}
          />
        )}

        {/* FUTURE STATE TAB */}
        {tab === 'future' && (
          <V2FutureStatePanel
            project={project} profile={profile} t={t} indLabel={indLabel}
            currentReport={currentReport} steps={steps} isPaid={isPaid}
            onReportGenerated={(r) => setReports(prev => [r, ...prev])}
          />
        )}

        {/* Supe panel */}
        {showSupe && isPaid && (
          <div style={{ width: 380, flexShrink: 0, borderLeft: '1px solid var(--border)', background: 'white', overflow: 'hidden' }}>
            <SupePanel steps={steps} projectId={project.id} />
          </div>
        )}
      </div>

      {/* ── START MODAL (empty project) ───────────────────────────────── */}
      {showStartModal && (
        <StartModal
          project={project} t={t} indLabel={indLabel}
          onSOP={() => { setShowStartModal(false); setSopMode('upload') }}
          onManual={() => { setShowStartModal(false); addStep() }}
          onReference={() => { setShowStartModal(false) /* reference handled separately */ }}
          parsing={parsing}
        />
      )}

      {/* SOP upload mode */}
      {sopMode === 'upload' && !parsing && (
        <SOPUploadOverlay
          onFile={(f) => handleSopUpload(f)}
          onManualText={(text) => handleSopUpload(undefined, text)}
          onCancel={() => setSopMode(null)}
          t={t}
        />
      )}

      {parsing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', maxWidth: 360 }}>
            <div style={{ width: 48, height: 48, border: '3px solid rgba(1,118,211,.2)', borderTopColor: BRAND, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}/>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Parsing your SOP…</h3>
            <p style={{ color: 'var(--text2)', fontSize: 13 }}>Extracting steps, tasks, and process structure. This takes 10–30 seconds.</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}

// ── Start Modal ───────────────────────────────────────────────────────────────
function StartModal({ project, t, indLabel, onSOP, onManual, onReference, parsing }: any) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 36, maxWidth: 540, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,.2)' }}>
        <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, color: '#0176D3', background: 'rgba(1,118,211,.07)', border: '1px solid rgba(1,118,211,.15)', borderRadius: 4, padding: '3px 10px', display: 'inline-block', marginBottom: 16 }}>
          NEW PROJECT — V2 BUILDER
        </div>
        <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.2 }}>
          How do you want to start<br/>mapping your {t.process}?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, lineHeight: 1.7 }}>
          Upload an existing {t.standardWork || 'Standard Operating Procedure'} and the AI will extract every step automatically. Or build it step by step yourself. Either way, the map is yours to edit.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={onSOP} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
            borderRadius: 12, border: '1.5px solid rgba(1,118,211,.3)', background: 'rgba(1,118,211,.04)',
            cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#0176D3'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(1,118,211,.3)'}>
            <span style={{ fontSize: 24 }}>📄</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Upload SOP / Process Document</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>PDF, Word, text file — the AI extracts every step, task, and governing entity. You review and fill in what's missing.</div>
            </div>
          </button>
          <button onClick={onManual} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
            borderRadius: 12, border: '1.5px solid var(--border)', background: 'white',
            cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#0176D3'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <span style={{ fontSize: 24 }}>✏️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Build step by step manually</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>Add each {t.processStep} yourself. Best if you know the process and want full control from the start.</div>
            </div>
          </button>
          <button onClick={onReference} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
            borderRadius: 12, border: '1.5px solid var(--border)', background: 'white',
            cursor: 'pointer', textAlign: 'left', transition: 'all .15s', opacity: .7,
          }}>
            <span style={{ fontSize: 24 }}>🗂️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Load reference project</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>See how a completed {indLabel} map looks. Use as a template or to understand the tool.</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── SOP Upload Overlay ────────────────────────────────────────────────────────
function SOPUploadOverlay({ onFile, onManualText, onCancel, t }: any) {
  const [dragOver, setDragOver] = useState(false)
  const [manualText, setManualText] = useState('')
  const [mode, setMode] = useState<'file' | 'paste'>('file')
  const fileRef = useRef<HTMLInputElement>(null)

  const ACCEPTED = '.pdf,.docx,.doc,.txt,.rtf,.md,.csv,.odt,.pages'

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 36, maxWidth: 520, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Upload your {t.standardWork || 'SOP'}</h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>×</button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {(['file', 'paste'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '8px 0', borderRadius: 7, border: '1.5px solid',
              borderColor: mode === m ? BRAND : 'var(--border)',
              background: mode === m ? 'rgba(1,118,211,.06)' : 'white',
              color: mode === m ? BRAND : 'var(--text2)',
              fontWeight: mode === m ? 700 : 400, fontSize: 13, cursor: 'pointer',
            }}>
              {m === 'file' ? '📎 Upload file' : '📋 Paste text'}
            </button>
          ))}
        </div>

        {mode === 'file' ? (
          <>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? BRAND : 'var(--border)'}`,
                borderRadius: 12, padding: 48, textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(1,118,211,.04)' : 'var(--sl-50)',
                transition: 'all .15s', marginBottom: 12,
              }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Drop your SOP here</p>
              <p style={{ fontSize: 12, color: 'var(--text3)' }}>PDF, Word, TXT, RTF, Markdown, CSV, ODT</p>
              <p style={{ fontSize: 11, color: BRAND, marginTop: 10, fontWeight: 600 }}>or click to browse</p>
              <input ref={fileRef} type="file" accept={ACCEPTED} style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.6 }}>
              The AI will extract every step, task description, and governing entity. You review and complete missing information.
            </p>
          </>
        ) : (
          <>
            <textarea
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder={`Paste your process description or SOP text here…\n\nFor example:\n1. Receive raw materials from supplier\n2. Inspect incoming goods against specification\n3. Move to production area…`}
              style={{
                width: '100%', minHeight: 220, padding: 14, borderRadius: 10,
                border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit',
                lineHeight: 1.65, resize: 'vertical', color: 'var(--text)',
                background: 'var(--sl-50)', outline: 'none',
              }}
            />
            <button
              onClick={() => { manualText.trim().length > 20 ? onManualText(manualText) : toast.error('Add more text — at least a few process steps') }}
              style={{
                width: '100%', marginTop: 12, padding: '12px 0', borderRadius: 9,
                border: 'none', background: 'linear-gradient(135deg,#0a5eaa,#0176D3)',
                color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>
              Extract steps from text →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
