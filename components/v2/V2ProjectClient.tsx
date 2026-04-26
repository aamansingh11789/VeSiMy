// TypeScript enabled
'use client'
// ── components/v2/V2ProjectClient.tsx ─────────────────────────────────────────
// V2 Project Builder: SOP upload → interactive map → analyze → future state

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { BRAND, SERIF, GREEN, AMBER, RED } from './v2-constants'
import { FolderIcon, EditIcon, PDFIcon, BookIcon, LayersIcon, ZapIcon, VSMIcon, ImprovementIcon, KaizenIcon, LiveFloorIcon, RoadmapIcon, PDCAIcon, SimulationIcon } from '@/components/ui/Icons'
import { createClient } from '@/lib/supabase'
import { getIndustryTerms, getIndustryLabel } from '@/lib/industry-language'
import { V2MapCanvas } from './V2MapCanvas'
import { V2StepPanel } from './V2StepPanel'
import { V2AnalysisReport } from './V2AnalysisReport'
import { V2FutureStatePanel } from './V2FutureStatePanel'
import { V2Journal } from './V2Journal'
import { SupePanel } from '@/components/supe/SupePanel'
import { ToolModal } from '@/components/tools/ToolModal'
import { PDFExportButton } from '@/components/export/PDFExport'
import { saveToolData, upsertV2Step, deleteV2Step, createV2Step, updateV2Project, fetchKanbanBoard, createBranch, fetchBranches } from '@/lib/db'
import { isPaidProfile } from '@/lib/require-plan'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import toast from 'react-hot-toast'
import { ProcessSimulation } from '@/components/simulation/ProcessSimulation'
import { LiveFloorPanel } from '@/components/live/LiveFloorPanel'
import { ProcessHealthScore } from '@/components/health/ProcessHealthScore'
import { KanbanBoard } from '@/components/tools/KanbanBoard'
import KaizenRoadmap from '@/components/tools/KaizenRoadmap'
import PDCATool from '@/components/tools/PDCATool'
import type { KanbanColumn } from '@/lib/store'

type V2Tab = 'map' | 'analyze' | 'journal' | 'future' | 'branches' | 'simulation' | 'live' | 'roadmap' | 'pdca' | 'kaizen' | 'kanban' | 'report'

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
  const [activeTool, setActiveTool] = useState<{ tool: string; stepId: string } | null>(null)
  const [branches, setBranches] = useState<any[]>([])
  const [showAddBranch, setShowAddBranch] = useState(false)
  const [newBranchName, setNewBranchName] = useState('')
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([])
  const [kanbanLoaded, setKanbanLoaded] = useState(false)
  const [showPDCA, setShowPDCA] = useState(false)
  const [pdcaData, setPdcaData] = useState<any>(null)
  const [showProjectSettings, setShowProjectSettings] = useState(false)

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return
    try {
      const nb = await createBranch(project.id, {
        label: newBranchName.trim(),
        color: '#0176D3',
        parent_step_id: null,
        merge_step_id: null,
      })
      setBranches(prev => [...prev, nb])
      setNewBranchName('')
      setShowAddBranch(false)
      toast.success('Sub-process branch created')
    } catch { toast.error('Could not create branch') }
  }

  const isPaid = isPaidProfile(profile)

  // ── Load reports from DB on mount ────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    fetchBranches(project.id).then(b => { if (mounted) setBranches(b) }).catch(() => {})
    return () => { mounted = false }
  }, [project.id])

  useEffect(() => {
    let mounted = true
    supabase.from('analysis_reports')
      .select('*').eq('project_id', project.id).eq('user_id', profile.id)
      .order('generated_at', { ascending: false })
      .then(({ data }) => { if (mounted && data) setReports(data) })
    return () => { mounted = false }
  }, [project.id])

  // ── Lazy-load kanban columns ──────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'kanban' || kanbanLoaded) return
    let mounted = true
    fetchKanbanBoard(project.id)
      .then(cols => { if (mounted) { setKanbanColumns(cols); setKanbanLoaded(true) } })
      .catch(() => { if (mounted) setKanbanLoaded(true) })
    return () => { mounted = false }
  }, [tab, project.id, kanbanLoaded])

  // ── Save step to DB ───────────────────────────────────────────────────────
  const saveDebounceRef = useRef<Record<string, any>>({})

  const saveStep = useCallback(async (step: V2Step) => {
    try {
      await upsertV2Step(step)
      return true
    } catch (err: any) {
      toast.error('Save failed: ' + (err?.message || 'Unknown error'))
      return false
    }
  }, [])

  const debouncedSaveStep = useCallback((step: V2Step) => {
    if (saveDebounceRef.current[step.id]) clearTimeout(saveDebounceRef.current[step.id])
    saveDebounceRef.current[step.id] = setTimeout(async () => {
      try { await upsertV2Step(step) } catch (e) { console.error('Step save failed', e) }
    }, 800)
  }, [])

  // ── Create new step ───────────────────────────────────────────────────────
  const addStep = useCallback(async (afterPosition?: number) => {
    const pos = afterPosition !== undefined ? afterPosition + 1 : steps.length
    try {
      const newStep = await createV2Step({
        project_id: project.id,
        name: `Step ${pos + 1}`,
        position: pos,
        step_type: 'process',
        tasks: [],
        cycle_time_unit: 'seconds',
        cycle_time_type: 'assumed',
        missing_info_flags: ['cycle_time', 'operators', 'defect_rate'],
        from_sop: false,
      })
      setSteps(prev => {
        const updated = [...prev]
        updated.splice(pos, 0, newStep)
        return updated.map((s, i) => ({ ...s, position: i }))
      })
      setSelectedStep(newStep)
      setPanelOpen(true)
    } catch {
      toast.error('Could not add step')
    }
  }, [steps, project.id])

  // ── Update step locally + save ────────────────────────────────────────────
  const handleSaveToolData = async (stepId: string, tool: string, data: Record<string, any>) => {
    await saveToolData(stepId, tool, data)
    setSteps(prev => prev.map(s =>
      s.id === stepId ? { ...s, toolData: { ...(s.toolData || {}), [tool]: data } } : s
    ))
    // If the step is currently selected, update it too
    if (activeTool?.stepId === stepId) {
      setSelectedStep(prev => prev && prev.id === stepId
        ? { ...prev, toolData: { ...(prev.toolData || {}), [tool]: data } }
        : prev
      )
    }
  }

  const updateStep = useCallback(async (updated: V2Step) => {
    // FIX: capture previous state BEFORE optimistic update so rollback actually works
    const previous = steps.find(s => s.id === updated.id)
    setSteps(prev => prev.map(s => s.id === updated.id ? updated : s))
    setSelectedStep(updated)
    const ok = await saveStep(updated)
    if (!ok) {
      // Restore the actual previous value (the old code returned the already-mutated step — bug)
      if (previous) {
        setSteps(prev => prev.map(s => s.id === updated.id ? previous : s))
        setSelectedStep(previous)
      }
      toast.error('Save failed — changes reverted. Please try again.')
    }
  }, [saveStep, steps])

  // ── Delete step ───────────────────────────────────────────────────────────
  const deleteStep = useCallback(async (stepId: string) => {
    try {
      await deleteV2Step(stepId)
      setSteps(prev => prev.filter(s => s.id !== stepId).map((s, i) => ({ ...s, position: i })))
      if (selectedStep?.id === stepId) { setSelectedStep(null); setPanelOpen(false) }
    } catch {
      toast.error('Delete failed')
    }
  }, [selectedStep])

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
      await updateV2Project(project.id, {
        sop_raw_text: data.raw_text_preview,
        sop_filename: filename,
        sop_parsed_at: new Date().toISOString(),
        description: parsed.process_description || project.description,
        version: 'v2',
      })

      // FIX: rollback all inserted steps on any failure — prevents partial/corrupted state
      const insertedSteps: V2Step[] = []
      let insertFailed = false
      for (let i = 0; i < parsed.steps.length; i++) {
        const ps = parsed.steps[i]
        try {
          const stepData = await createV2Step({
            project_id: project.id,
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
          })
          insertedSteps.push(stepData as V2Step)
        } catch (e) {
          console.error('[sop] step insert failed:', e)
          insertFailed = true
          break
        }
      }

      if (insertFailed) {
        toast.loading('Upload failed — cleaning up partial data…')
        await Promise.all(insertedSteps.map(s => deleteV2Step(s.id).catch(() => {})))
        throw new Error('SOP upload failed — please try again. Partial data has been removed.')
      }

      setSteps(insertedSteps)
      if (parsed.governing_entities?.length > 0) {
        toast(`Governing entities detected: ${parsed.governing_entities.join(', ')}`)
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

  const TABS: { id: V2Tab; label: string; icon: string; premium?: boolean }[] = [
    { id: 'map',        label: 'Process Map',    icon: 'map' },
    { id: 'branches',   label: `Sub-Processes${branches.length > 0 ? ` (${branches.length})` : ''}`, icon: 'SUB' },
    { id: 'analyze',    label: 'Analysis',       icon: 'zap' },
    { id: 'journal',    label: `Journal${reports.length > 0 ? ` (${reports.length})` : ''}`, icon: 'JR' },
    { id: 'future',     label: 'Future State',   icon: '→',  premium: true },
    { id: 'roadmap',    label: 'Kaizen Plan',    icon: 'KP' },
    { id: 'pdca',       label: 'PDCA',           icon: 'PD' },
    { id: 'kaizen',     label: 'Kaizen Board',   icon: 'SP' },
    { id: 'kanban',     label: 'Kanban',         icon: 'KB' },
    { id: 'simulation', label: 'Simulation',     icon: 'SIM',  premium: true },
    { id: 'live',       label: 'Gemba Monitor',  icon: 'LF', premium: true },
    { id: 'report',     label: 'Report',         icon: 'AN' },
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

        {/* Smart tab navigation — scrollable on desktop, dropdown on mobile */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
          {/* Desktop: scrollable pill tabs */}
          <div className="v2-tab-bar" style={{
            display: 'flex', gap: 2, padding: '4px', borderRadius: 12,
            background: 'rgba(3,45,96,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(1,118,211,0.12)',
            boxShadow: '0 2px 12px rgba(1,118,211,0.08)',
            overflowX: 'auto', maxWidth: '100%', position: 'relative',
            scrollbarWidth: 'none',
          }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: tab === t.id ? 700 : 500,
                fontFamily: 'monospace', letterSpacing: 0.3, textTransform: 'uppercase',
                background: tab === t.id ? BRAND : 'transparent',
                color: tab === t.id ? 'white' : 'var(--text3)',
                boxShadow: tab === t.id ? `0 2px 8px rgba(1,118,211,0.35)` : 'none',
                transition: 'all .15s', whiteSpace: 'nowrap', flexShrink: 0,
                opacity: (t as any).premium && !isPaid ? 0.65 : 1,
              }}>
                <span style={{ fontSize: 12 }}>{t.icon}</span>
                <span>{t.label}</span>
                {(t as any).premium && !isPaid && (
                  <span style={{ fontSize: 9, marginLeft: 2, opacity: 0.8 }}>🔒</span>
                )}
              </button>
            ))}
          </div>
          {/* Mobile: dropdown selector */}
          <div className="v2-tab-dropdown" style={{ display: 'none', width: '100%', maxWidth: 260 }}>
            <select
              value={tab}
              onChange={e => setTab(e.target.value as V2Tab)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 9,
                border: `1px solid ${BRAND}44`, background: 'white',
                fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer',
                fontFamily: 'inherit', appearance: 'auto',
              }}
            >
              {TABS.map(t => (
                <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right controls */}
        <div className="v2-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
          {/* Process health score — hidden on small mobile */}
          {steps.length > 0 && (
            <div className="health-score-compact">
              <ProcessHealthScore steps={steps} compact />
            </div>
          )}
          {/* Settings button — always visible */}
          <button className="v2-topbar-essential" onClick={() => setShowProjectSettings(true)} title="Project Settings" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: 'var(--text3)', fontSize: 18, lineHeight: 1 }}>SET</button>
          {/* Map completeness */}
          {tab === 'map' && steps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: 'var(--sl-100)', border: '1px solid var(--border)' }}>
              <div style={{ width: 60, height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${completePct}%`, background: completePct === 100 ? '#2E844A' : BRAND, transition: 'width .3s' }}/>
              </div>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text3)' }}>{completePct}%</span>
            </div>
          )}

          {/* Add step — essential on map tab */}
          {tab === 'map' && (
            <button className="v2-topbar-essential" onClick={() => addStep(steps.length - 1)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
              borderRadius: 7, border: '1px solid var(--border)', background: 'white',
              fontSize: 12, fontWeight: 600, color: 'var(--text2)', cursor: 'pointer',
            }}>
              + Add Step
            </button>
          )}

          {/* PDF Export */}
          {steps.length > 0 && (
            isPaid
              ? <PDFExportButton
                  project={project}
                  steps={steps}
                  isGold={(profile as any).beta_tier === 'gold_standard' || (profile as any).lifetime_access}
                />
              : <a href="/pricing" style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', background:'rgba(1,118,211,0.06)', border:'1px solid rgba(1,118,211,0.2)', color:'var(--brand)', textDecoration:'none' }}>
                  PDF ↑ Pro
                </a>
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
            ) : 'Analyze'}
          </button>

          {/* Supe */}
          {isPaid && (
            <button onClick={() => setShowSupe(v => !v)} title="Supe AI" style={{
              width: 32, height: 32, borderRadius: 7, border: '1px solid var(--border)',
              background: showSupe ? 'rgba(1,118,211,.1)' : 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}><ZapIcon size={14}/></button>
          )}
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="v2-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* ── COLLAPSIBLE LEFT SIDEBAR ─────────────────────────────────── */}
        {tab === 'map' && (
          <div style={{
            width: sidebarCollapsed ? 40 : 220,
            flexShrink: 0,
            background: '#FFFFFF',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width .2s ease',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 5,
          }}>
            {/* Collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed(v => !v)}
              title={sidebarCollapsed ? 'Expand step list' : 'Collapse step list'}
              style={{
                width: '100%', height: 36, border: 'none', borderBottom: '1px solid var(--border)',
                background: 'var(--sl-50)', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-end',
                paddingRight: sidebarCollapsed ? 0 : 10, flexShrink: 0, color: 'var(--text3)',
                fontSize: 13, fontWeight: 700,
              }}>
              {sidebarCollapsed ? '›' : '‹'}
            </button>

            {/* Steps list */}
            {!sidebarCollapsed && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {steps.length === 0 ? (
                  <div style={{ padding: '16px 12px', fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
                    No steps yet.<br/>Add a step to begin.
                  </div>
                ) : steps.map((step, i) => {
                  const isSelected = step.id === selectedStep?.id
                  const vaColor = step.va_type === 'va' ? GREEN : step.va_type === 'nva' ? RED : step.va_type === 'nnva' ? AMBER : '#ccc'
                  const hasMissing = (step.missing_info_flags || []).length > 0
                  return (
                    <div
                      key={step.id}
                      onClick={() => { setSelectedStep(step); setPanelOpen(true) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 10px 7px 8px', cursor: 'pointer',
                        background: isSelected ? 'rgba(1,118,211,.07)' : 'transparent',
                        borderLeft: `3px solid ${isSelected ? BRAND : 'transparent'}`,
                        transition: 'background .1s',
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'var(--sl-50)' }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                    >
                      {/* VA dot */}
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: vaColor, flexShrink: 0 }}/>
                      {/* Step number */}
                      <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text3)', flexShrink: 0, width: 14 }}>{i + 1}</span>
                      {/* Name */}
                      <span style={{
                        fontSize: 12, color: isSelected ? BRAND : 'var(--text)',
                        fontWeight: isSelected ? 700 : 400, flex: 1, overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{step.name}</span>
                      {/* Missing badge */}
                      {hasMissing && (
                        <span style={{ fontSize: 9, background: AMBER, color: 'white', borderRadius: 3, padding: '1px 4px', flexShrink: 0, fontWeight: 700 }}>
                          {(step.missing_info_flags || []).length}
                        </span>
                      )}
                    </div>
                  )
                })}

                {/* Add step link */}
                <div
                  onClick={() => addStep(steps.length - 1)}
                  style={{ padding: '8px 10px', fontSize: 12, color: BRAND, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--border)', marginTop: 4 }}
                >
                  + Add Step
                </div>
              </div>
            )}

            {/* Collapsed icon strip */}
            {sidebarCollapsed && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, gap: 4, overflowY: 'auto' }}>
                {steps.map((step) => {
                  const vaColor = step.va_type === 'va' ? GREEN : step.va_type === 'nva' ? RED : step.va_type === 'nnva' ? AMBER : '#ccc'
                  const isSelected = step.id === selectedStep?.id
                  return (
                    <div
                      key={step.id}
                      onClick={() => { setSelectedStep(step); setPanelOpen(true) }}
                      title={step.name}
                      style={{
                        width: 8, height: 8, borderRadius: '50%', background: vaColor,
                        cursor: 'pointer', flexShrink: 0,
                        outline: isSelected ? `2px solid ${BRAND}` : 'none',
                        outlineOffset: 2,
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}

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
              onSaveStopwatch={async (stepId: string, avgSeconds: number, lapCount: number) => {
                const step = steps.find((s: any) => s.id === stepId)
                if (!step) return
                await upsertV2Step({
                  ...step,
                  cycle_time: avgSeconds,
                  cycle_time_unit: 'seconds',
                  cycle_time_type: 'measured',
                })
                setSteps((prev: any[]) => prev.map((s: any) =>
                  s.id === stepId ? { ...s, cycle_time: avgSeconds, cycle_time_unit: 'seconds', cycle_time_type: 'measured' } : s
                ))
                toast.success(`CT saved: ${avgSeconds}s avg (${lapCount} laps)`)
              }}
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
                onTool={(tool: string) => setActiveTool({ tool, stepId: selectedStep.id })}
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
                isPaid={isPaid}
              />
            )}
            {!analyzing && !currentReport && (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ marginBottom: 16, display:"flex", justifyContent:"center" }}><ZapIcon size={40} color="var(--brand)"/></div>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Ready to analyse</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                  Complete your {t.valueStream} map then click Analyze to generate your current state report.
                </p>
                <button onClick={() => setTab('map')} style={{
                  padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>&larr; Go to map</button>
              </div>
            )}
          </div>
        )}

        {/* BRANCHES TAB */}
        {tab === 'branches' && (
          <div style={{ flex:1, overflowY:'auto', padding:28 }}>
            <div style={{ maxWidth:760, margin:'0 auto' }}>
              <div style={{ marginBottom:24, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                <div>
                  <div style={{ fontSize:9, fontFamily:'monospace', letterSpacing:2, color:'#0176D3', marginBottom:6 }}>SUB-PROCESSES & BRANCHES</div>
                  <h2 style={{ fontFamily:'Palatino Linotype,serif', fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:6 }}>Alternate paths & sub-processes</h2>
                  <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.7 }}>
                    In TPS and lean VSM, branches represent alternate process paths — rework loops, exception flows, sub-assembly lines, and parallel processes that feed into the main value stream.
                  </p>
                </div>
                <button onClick={() => setShowAddBranch(v => !v)} style={{
                  padding:'8px 16px', borderRadius:0, border:'1px solid #0176D3',
                  background:'#0176D3', color:'white', fontSize:12, fontWeight:700,
                  cursor:'pointer', flexShrink:0, fontFamily:'monospace', letterSpacing:1,
                }}>+ ADD BRANCH</button>
              </div>
              {showAddBranch && (
                <div style={{ marginBottom:20, padding:18, background:'white', border:'1px solid var(--border)', borderRadius:0 }}>
                  <div style={{ fontSize:10, fontFamily:'monospace', letterSpacing:1.5, color:'var(--text3)', marginBottom:10 }}>NEW SUB-PROCESS</div>
                  <div style={{ display:'flex', gap:10 }}>
                    <input value={newBranchName} onChange={e => setNewBranchName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateBranch()}
                      placeholder="e.g. Rework Loop, Sub-assembly, Exception Path…"
                      style={{ flex:1, padding:'8px 12px', border:'1px solid var(--border)', borderRadius:0, fontSize:13, fontFamily:'inherit' }}/>
                    <button onClick={handleCreateBranch} style={{ padding:'8px 16px', background:'#0176D3', color:'white', border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>Create</button>
                    <button onClick={() => setShowAddBranch(false)} style={{ padding:'8px 12px', background:'var(--sl-100)', color:'var(--text2)', border:'1px solid var(--border)', fontSize:12, cursor:'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}
              {branches.length === 0 && !showAddBranch ? (
                <div style={{ textAlign:'center', padding:60, color:'var(--text3)' }}>
                  <div style={{ fontSize:16, fontWeight:800, marginBottom:12 }}>SUB</div>
                  <p style={{ fontSize:14, lineHeight:1.7 }}>No sub-processes yet.<br/>Add branches for rework loops, sub-assembly lines, or alternate paths.</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {branches.map((b: any) => (
                    <div key={b.id} style={{ background:'white', border:'1px solid var(--border)', borderRadius:0, padding:18 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                        <div style={{ width:4, height:32, background:'#0176D3', flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>{b.label || b.name}</div>
                          <div style={{ fontSize:11, color:'var(--text3)' }}>{b.description || 'Sub-process branch'}</div>
                        </div>
                        <div style={{ marginLeft:'auto', fontSize:9, fontFamily:'monospace', color:'var(--text3)', letterSpacing:1 }}>
                          {b.steps?.length || 0} STEPS
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:'var(--text3)', paddingLeft:14, lineHeight:1.7 }}>
                        This branch is mapped independently. Steps added here appear as a sub-process lane feeding into the main value stream.
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* JOURNAL TAB */}
        {tab === 'journal' && (
          <V2Journal reports={reports} project={project} t={t} indLabel={indLabel}
            onLoadReport={(r) => {
              // Merge v4_data into top-level for Section 8 report rendering
              const hydrated = r.v4_data
                ? { ...r, ...r.v4_data }
                : r
              setCurrentReport(hydrated)
              setTab('analyze')
            }}
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

        {/* KAIZEN ROADMAP TAB */}
        {tab === 'roadmap' && (
          <div className="v2-tab-content-scroll" style={{ padding: 24, flex: 1, overflow: 'auto' }}>
            <KaizenRoadmap
              steps={steps}
              project={project}
              takt={project.takt_time ? Number(project.takt_time) : 0}
              pce={(() => {
                // FIX: use canonical calcProcessMetrics — branch-filtered, unit-aware
                const { pce: p } = calcProcessMetrics(steps, project)
                return p ?? 0
              })()}
              onSaveRoadmap={async (roadmap) => {
                try {
                  await updateV2Project(project.id, { kaizen_roadmap: { phases: roadmap } })
                } catch (e) { console.error('Roadmap save failed', e) }
              }}
            />
          </div>
        )}

        {/* PDCA TAB */}
        {tab === 'pdca' && (
          <div style={{ padding: 24, flex: 1, overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>PDCA Projects</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                  One data model — export as PDCA, A3, 8D, DMAIC, or OODA
                </div>
              </div>
              <button onClick={() => { setPdcaData(null); setShowPDCA(true) }}
                style={{ padding: '8px 16px', background: BRAND, color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                + New PDCA Project
              </button>
            </div>
            {!pdcaData && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)', fontSize: 13 }}>
                No PDCA projects yet. Create one to track your improvement cycle.
              </div>
            )}
          </div>
        )}

        {/* KAIZEN BOARD TAB */}
        {tab === 'kaizen' && (
          <div className="v2-tab-content-scroll" style={{ padding: 24, flex: 1, overflow: 'auto' }}>
            <V2KaizenBoardView
              steps={steps}
              onStatusChange={async (stepId, updatedItems) => {
                // Persist updated kaizen items back to the step's tool data
                try {
                  await handleSaveToolData(stepId, 'kaizen', { items: updatedItems })
                } catch { toast.error('Could not update kaizen status') }
              }}
            />
          </div>
        )}

        {/* KANBAN TAB */}
        {tab === 'kanban' && (
          <div className="v2-tab-content-scroll" style={{ flex: 1, overflow: 'auto' }}>
            <KanbanBoard
              projectId={project.id}
              columns={kanbanColumns}
              steps={steps}
              onColumnsChange={setKanbanColumns}
              showToast={(msg: string, type: string) => type === 'error' ? toast.error(msg) : toast.success(msg)}
            />
          </div>
        )}

        {/* SIMULATION TAB */}
        {tab === 'simulation' && (
          <div className="v2-tab-content-scroll" style={{ flex: 1, overflow: 'auto', padding: 24 }}>
            {isPaid
              ? <ProcessSimulation steps={steps} projectId={project.id} isPaid={true} />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
                  <div style={{ fontSize:16, fontWeight:800 }}>SIM</div>
                  <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Process Simulation</div>
                  <div style={{ fontSize: 14, color: 'var(--text3)', textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>
                    Run stress scenarios on your value stream. Adjust cycle times, simulate demand spikes, labor shortages, and equipment failures — and see the pressure impact before it hits your floor.
                  </div>
                  <a href="/pricing" style={{ padding: '10px 24px', background: BRAND, color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Upgrade to Pro →</a>
                </div>
              )
            }
          </div>
        )}

        {/* GEMBA MONITOR TAB */}
        {tab === 'live' && (
          <div className="v2-tab-content-scroll" style={{ flex: 1, overflow: 'auto' }}>
            {isPaid
              ? <LiveFloorPanel steps={steps} projectId={project.id} />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
                  <div style={{ fontSize:16, fontWeight:800 }}>LIVE</div>
                  <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Gemba Monitor</div>
                  <div style={{ fontSize: 14, color: 'var(--text3)', textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>
                    Monitor your process in real time from the floor. Track live cycle times, flag deviations, and capture observations directly from your phone during a gemba walk.
                  </div>
                  <a href="/pricing" style={{ padding: '10px 24px', background: BRAND, color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Upgrade to Pro →</a>
                </div>
              )
            }
          </div>
        )}

        {/* REPORT TAB */}
        {tab === 'report' && (
          <div className="v2-tab-content-scroll" style={{ padding: 24, flex: 1, overflow: 'auto' }}>
            <V2ReportTab steps={steps} project={project} />
          </div>
        )}

        {/* Supe panel */}
        {showSupe && isPaid && (
          <div style={{ width: 380, flexShrink: 0, borderLeft: '1px solid var(--border)', background: 'white', overflow: 'hidden' }}>
            <SupePanel steps={steps} projectId={project.id} industry={(project as any).industry} projectName={project.name} />
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

      {/* ── PDCA modal ───────────────────────────────────────────────────── */}
      {showPDCA && (
        <PDCATool
          steps={steps}
          project={project}
          initialData={pdcaData || steps[0]?.toolData?.pdca_project || null}
          onSave={async (data) => {
            setPdcaData(data)
            const firstStep = steps[0]
            if (firstStep?.id) {
              // FIX: PDCA is project-level data, not step-level.
              // Saving to firstStep.id caused data loss when steps were reordered/deleted.
              try { await updateV2Project(project.id, { pdca_data: data }) } catch {}
            }
            setShowPDCA(false)
          }}
          onClose={() => setShowPDCA(false)}
        />
      )}

      {/* ── Project settings modal ───────────────────────────────────────── */}
      {showProjectSettings && (
        <V2ProjectSettingsModal
          project={project}
          onSave={async (updates) => {
            await updateV2Project(project.id, updates)
            setProject((p: any) => ({ ...p, ...updates }))
            setShowProjectSettings(false)
          }}
          onClose={() => setShowProjectSettings(false)}
          onDelete={async () => {
            if (!window.confirm('Delete this project and all its data? This cannot be undone.')) return
            try {
              const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
              if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                toast.error(err.error || 'Delete failed — please try again')
                return
              }
            } catch {
              toast.error('Delete failed — please try again')
              return
            }
            window.location.href = '/dashboard'
          }}
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

      {/* ── CI Tool modals ─────────────────────────────────────────────── */}
      {activeTool && (() => {
        const step = steps.find(s => s.id === activeTool.stepId)
        if (!step) return null
        return (
          <ToolModal
            tool={activeTool.tool}
            step={step}
            onSave={async (data) => {
              await handleSaveToolData(activeTool.stepId, activeTool.tool, data)
              setActiveTool(null)
            }}
            onClose={() => setActiveTool(null)}
          />
        )
      })()}

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
            <PDFIcon size={22} color="var(--text2)"/>
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
            <EditIcon size={22} color="var(--text2)"/>
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
            <FolderIcon size={22} color="var(--text2)"/>
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
              {m === 'file' ? 'Upload file' : 'Paste text'}
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
              <div style={{ marginBottom: 12, display:"flex", justifyContent:"center" }}><PDFIcon size={34} color="var(--text2)"/></div>
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

// ── V2KaizenBoardView — editable Kanban-style kaizen board ──────────────────
function V2KaizenBoardView({ steps, onStatusChange }: {
  steps: any[]
  onStatusChange?: (stepId: string, updatedItems: any[]) => void
}) {
  const statuses = ['open', 'in-progress', 'complete'] as const
  const sLabel = { open: 'Open', 'in-progress': 'In Progress', complete: 'Complete' }
  const sColor = { open: '#FF6B6B', 'in-progress': '#F4A623', complete: '#1DD1A1' }
  const sBg    = { open: 'rgba(255,107,107,0.06)', 'in-progress': 'rgba(244,166,35,0.06)', complete: 'rgba(29,209,161,0.06)' }
  const NEXT   = { open: 'in-progress' as const, 'in-progress': 'complete' as const, complete: 'open' as const }
  const NEXT_LABEL = { open: '→ Start', 'in-progress': '→ Complete', complete: '↺ Reopen' }

  const allItems = steps.flatMap(s =>
    (s.toolData?.kaizen?.items || []).map((i: any) => ({
      ...i,
      stepName: s.name,
      stepId:   s.id,
      stepItems: s.toolData?.kaizen?.items || [],
    }))
  )

  function advanceStatus(item: any) {
    if (!onStatusChange) return
    const next = NEXT[item.status as keyof typeof NEXT] || 'open'
    const updatedItems = item.stepItems.map((si: any) =>
      si.id === item.id ? { ...si, status: next } : si
    )
    onStatusChange(item.stepId, updatedItems)
  }

  if (allItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>SP</div>
        <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
          No kaizen events yet. Open the Kaizen tool on any step to add improvement items.
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
          Click any step on the Process Map → choose Kaizen tool → add an event
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
          Kaizen Board
        </h2>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>
          {allItems.length} event{allItems.length !== 1 ? 's' : ''} ·{' '}
          {allItems.filter(i => i.status === 'complete').length} complete
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
        {statuses.map(st => {
          const col = allItems.filter(i => i.status === st)
          return (
            <div key={st}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: sColor[st],
                marginBottom: 10, padding: '8px 10px', borderBottom: `2px solid ${sColor[st]}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: sBg[st], borderRadius: '6px 6px 0 0',
              }}>
                <span>{sLabel[st]}</span>
                <span style={{ background: `${sColor[st]}22`, padding: '2px 8px', borderRadius: 10, fontSize: 10 }}>
                  {col.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60 }}>
                {col.length === 0 && (
                  <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text3)', fontSize: 11, border: '1px dashed var(--border)', borderRadius: 8 }}>
                    No items
                  </div>
                )}
                {col.map((item: any, ki: number) => (
                  <div key={`${item.stepId}-${item.id || ki}`} style={{
                    background: 'var(--sl-0,#fff)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '11px 13px',
                    borderLeft: `3px solid ${sColor[st]}`,
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 3, lineHeight: 1.3 }}>
                      {item.title || 'Untitled event'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>
                      {item.stepName}
                      {item.priority && item.priority !== 'normal' && (
                        <span style={{
                          marginLeft: 8, fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                          color: item.priority === 'critical' ? '#FF6B6B' : item.priority === 'high' ? '#F4A623' : '#0176D3',
                          background: item.priority === 'critical' ? 'rgba(255,107,107,0.1)' : item.priority === 'high' ? 'rgba(244,166,35,0.1)' : 'rgba(1,118,211,0.1)',
                          padding: '1px 5px', borderRadius: 4,
                        }}>
                          {item.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {item.owner && (
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6 }}>
                        👤 {item.owner}
                      </div>
                    )}
                    {onStatusChange && (
                      <button
                        onClick={() => advanceStatus(item)}
                        style={{
                          fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                          border: `1px solid ${sColor[st]}55`, background: 'transparent',
                          color: sColor[NEXT[item.status as keyof typeof NEXT] || 'open'],
                          cursor: 'pointer', transition: 'all .15s',
                        }}
                        onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = sBg[st] }}
                        onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'transparent' }}
                        aria-label={`${NEXT_LABEL[item.status as keyof typeof NEXT_LABEL]} — ${item.title}`}
                      >
                        {NEXT_LABEL[item.status as keyof typeof NEXT_LABEL]}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── V2ReportTab ──────────────────────────────────────────────────────────────
function V2ReportTab({ steps, project }: { steps: any[]; project: any }) {
  const [showPDCA, setShowPDCA] = useState(false)
  // FIX: use canonical calcProcessMetrics — filters branch steps, unit-aware, consistent with map
  const { mainSteps, totalCT, totalWait: totalWT, leadTime, pce, takt, bottleneck } =
    calcProcessMetrics(steps, project)
  const pceNum   = pce
  const openKaizens = mainSteps.reduce((a: number, s: any) =>
    a + ((s.toolData?.kaizen?.items || []).filter((k: any) => k.status !== 'complete').length), 0)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
        CI Report — {project.name}
      </h2>
      {/* Takt not set warning — bottleneck detection is disabled without takt time */}
      {takt == null && (
        <div style={{ padding: '10px 14px', background: 'rgba(244,166,35,.07)', border: '1px solid rgba(244,166,35,.25)', borderRadius: 9, marginBottom: 16, fontSize: 12, color: '#7A5200', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>WARN</span>
          <span><strong>Takt time not set</strong> — bottleneck detection is disabled. Open Project Settings and add your takt time to enable accurate bottleneck identification.</span>
        </div>
      )}
      {/* PCE null warning — VA classification not done */}
      {pceNum == null && mainSteps.length > 0 && (
        <div style={{ padding: '10px 14px', background: 'rgba(1,118,211,.05)', border: '1px solid rgba(1,118,211,.2)', borderRadius: 9, marginBottom: 16, fontSize: 12, color: '#0a4d8f', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>INFO</span>
          <span><strong>PCE shows — (not calculable)</strong> because no steps have been classified as Value-Add. Open the step panel and set VA Type on each step to see your Process Cycle Efficiency.</span>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Steps Mapped', val: String(steps.length), color: 'var(--text)' },
          { label: 'Process Cycle Efficiency', val: fmtPCE(pceNum), color: pceColor(pceNum) },
          { label: 'Total Cycle Time', val: totalCT > 0 ? `${(totalCT/60).toFixed(1)} min` : '—', color: 'var(--text)' },
          { label: 'Total Wait Time', val: totalWT > 0 ? `${(totalWT/60).toFixed(1)}min` : '—', color: totalWT > totalCT ? '#FF6B6B' : 'var(--text)' },
          { label: 'Bottleneck', val: bottleneck?.name || '—', color: bottleneck ? '#FF6B6B' : '#1DD1A1' },
          { label: 'Open Kaizens', val: String(openKaizens), color: openKaizens > 0 ? '#0176D3' : '#1DD1A1' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>
      {steps.length > 0 && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
            Process Step Summary
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  {['Step', 'CT', 'Wait', 'VA Type', 'Wastes', 'Open Kaizens', 'Status'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--text3)', fontWeight: 600, fontSize: 10, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steps.map((s: any, i: number) => {
                  const ct = ctSeconds(s)  // unit-aware via ctSeconds
                  const wt = Number(s.wait_time) || 0
                  const wastes = (s.toolData?.waste?.selected || []).length
                  const openK = (s.toolData?.kaizen?.items || []).filter((k: any) => k.status !== 'complete').length
                  const isBN = takt != null && takt > 0 && ct > takt
                  return (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg3)', borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 600, color: isBN ? '#FF6B6B' : 'var(--text)' }}>
                        {isBN && <span style={{ fontSize: 9, background: 'rgba(255,107,107,0.12)', color: '#FF6B6B', padding: '1px 5px', borderRadius: 4, marginRight: 5 }}>BN</span>}
                        {s.name}
                      </td>
                      <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: isBN ? '#FF6B6B' : 'var(--text2)' }}>{ct > 0 ? `${ct < 60 ? ct.toFixed(0)+'s' : ct < 3600 ? (ct/60).toFixed(1)+'m' : (ct/3600).toFixed(2)+'h'}` : '—'}</td>
                      <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: 'var(--text2)' }}>{wt ? `${wt}s` : '—'}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4,
                          background: s.va_type === 'va' ? 'rgba(29,209,161,0.12)' : s.va_type === 'nva' ? 'rgba(255,107,107,0.12)' : 'rgba(1,118,211,0.12)',
                          color: s.va_type === 'va' ? '#1DD1A1' : s.va_type === 'nva' ? '#FF6B6B' : '#0176D3' }}>
                          {(s.va_type || 'VA').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '7px 10px', color: wastes > 0 ? '#0176D3' : 'var(--text3)' }}>{wastes > 0 ? `${wastes} waste${wastes > 1 ? 's' : ''}` : '—'}</td>
                      <td style={{ padding: '7px 10px', color: openK > 0 ? '#0176D3' : 'var(--text3)' }}>{openK > 0 ? `${openK} open` : '—'}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{ fontSize: 10, color: isBN ? '#FF6B6B' : ct === 0 ? 'var(--text3)' : '#1DD1A1' }}>
                          {isBN ? 'Over Takt' : ct === 0 ? 'No data' : 'OK'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button type="button" onClick={() => setShowPDCA(true)}
          style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          Open PDCA Report
        </button>
      </div>
      {showPDCA && (
        <PDCATool steps={steps} project={project} onClose={() => setShowPDCA(false)} />
      )}
    </div>
  )
}

// ── V2ProjectSettingsModal ────────────────────────────────────────────────────
function V2ProjectSettingsModal({ project, onSave, onClose, onDelete }: {
  project: any; onSave: (f: any) => Promise<void>; onClose: () => void; onDelete: () => Promise<void>
}) {
  const [form, setForm] = useState({ ...project })
  const fields = [
    { key: 'name',          label: 'Project Name',        type: 'text',   span: true  },
    { key: 'description',   label: 'Description',         type: 'text',   span: true  },
    { key: 'industry',      label: 'Industry',            type: 'text',   span: false },
    { key: 'product',       label: 'Product Family',      type: 'text',   span: false },
    { key: 'customer',      label: 'Customer',            type: 'text',   span: false },
    { key: 'supplier',      label: 'Supplier',            type: 'text',   span: false },
    { key: 'demand',        label: 'Demand (units/day)',  type: 'number', span: false },
    { key: 'working_hours', label: 'Working Hours/Day',   type: 'number', span: false },
    { key: 'takt_time',     label: 'Takt Time (sec)',     type: 'number', span: false },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: 'var(--bg2)', borderRadius: 14, padding: 28, width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Project Settings</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text3)' }}>×</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {fields.map(f => (
            <div key={f.key} style={f.span ? { gridColumn: '1/-1' } : {}}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input className="input" type={f.type} value={(form as any)[f.key] || ''}
                onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 8 }}>
          <button onClick={onDelete} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid #C0402A', background: 'transparent', color: '#C0402A', fontSize: 13, cursor: 'pointer' }}>
            Delete Project
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => onSave(form)} style={{ padding: '8px 20px', borderRadius: 7, background: '#0176D3', color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
