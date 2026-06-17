// TypeScript enabled
'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { Project, Step, Branch, Profile, KanbanColumn, ProjectTab } from '@/lib/store'
import {
  updateProject, createStep, updateStep, deleteStep,
  saveToolData, reorderSteps,
  fetchBranches, createBranch, updateBranch, deleteBranch, createBranchStep,
  fetchKanbanBoard,
} from '@/lib/db'
import { isPaidProfile } from '@/lib/require-plan'
import { StepModal } from '@/components/tools/StepModal'
import { BranchModal } from '@/components/tools/BranchModal'
import { ToolModal } from '@/components/tools/ToolModal'
import { useAnalytics } from '@/hooks/useAnalytics'
import { calcProcessMetrics, fmtPCE, pceColor as calcPceColor } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import { KanbanBoard } from '@/components/tools/KanbanBoard'
import YamazumiTool from '@/components/tools/YamazumiTool'
import StandardWorkTool from '@/components/tools/StandardWorkTool'
import VSMCoachingTool from '@/components/tools/VSMCoachingTool'
import PDCATool from '@/components/tools/PDCATool'
import KaizenRoadmap from '@/components/tools/KaizenRoadmap'
import { VSMMap } from '@/components/vsm/VSMMap'
import { SupePanel } from '@/components/supe/SupePanel'
import { ProcessHealthScore } from '@/components/health/ProcessHealthScore'
import { ProcessSimulation } from '@/components/simulation/ProcessSimulation'
import { LiveFloorPanel } from '@/components/live/LiveFloorPanel'
import { SOPUpload } from '@/components/tools/SOPUpload'
import { FutureStatePanel } from '@/components/tools/FutureStatePanel'
import { PDFExportButton } from '@/components/export/PDFExport'
import { ProcessJournal } from '@/components/journal/ProcessJournal'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'
import {
  StopwatchIcon, FishboneIcon, FiveWhyIcon, WasteIcon, KaizenIcon, ImprovementIcon, SmedIcon,
  PlusIcon, EditIcon, TrashIcon, SOPIcon, SettingsIcon, ZapIcon,
  DragHandleIcon, ReportIcon, BranchIcon, KanbanIcon, SimulationIcon,
  LiveFloorIcon, VSMIcon, PDCAIcon, RoadmapIcon,
} from '@/components/ui/Icons'

const TABS: { id: ProjectTab; label: string; Icon: any; premium?: boolean }[] = [
  { id: 'builder',    label: 'Process Steps', Icon: PlusIcon,        premium: false },
  { id: 'vsm',        label: 'Value Stream',  Icon: VSMIcon,         premium: false },
  { id: 'branches',   label: 'Sub-Processes', Icon: BranchIcon,      premium: false },
  { id: 'roadmap',    label: 'Kaizen Plan',   Icon: RoadmapIcon,     premium: false },
  { id: 'pdca',       label: 'PDCA',          Icon: PDCAIcon,        premium: false },
  { id: 'kaizen',     label: 'Kaizen',        Icon: KaizenIcon,      premium: false },
  { id: 'kanban',     label: 'Kanban',        Icon: KanbanIcon,      premium: false },
  { id: 'simulation', label: 'Simulation',    Icon: SimulationIcon,  premium: false },
  { id: 'live',       label: 'Gemba Monitor', Icon: LiveFloorIcon,   premium: true  },
  { id: 'report',     label: 'Report',        Icon: ReportIcon,      premium: false },
]

const CI_TOOLS = [
  { id: 'stopwatch', Icon: StopwatchIcon, label: 'Time Study' },
  { id: 'ishikawa', Icon: FishboneIcon, label: 'Fishbone' },
  { id: 'fivewhy', Icon: FiveWhyIcon, label: '5 Why' },
  { id: 'waste', Icon: WasteIcon, label: 'Waste ID' },
  { id: 'kaizen', Icon: KaizenIcon, label: 'Kaizen' },
  { id: 'improvement', Icon: ImprovementIcon, label: 'Improve' },
  { id: 'smed', Icon: SmedIcon, label: 'SMED' },
]

const fmtS = (s: number) => {
  if (!s && s !== 0) return ','
  if (s < 60) return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(2)}h`
}

interface Props {
  initialProject: Project & { steps: Step[] }
  profile: Profile
}

export function ProjectClient({ initialProject, profile }: Props) {
  const router = useRouter()
  const [showJournal, setShowJournal] = useState(false)
  const [showYamazumi,    setShowYamazumi]    = useState(false)
  const [showStandardWork, setShowStandardWork] = useState(false)
  const [showVSMCoaching,  setShowVSMCoaching]  = useState(false)
  const [showFutureState,  setShowFutureState]  = useState(false)
  const [showPDCA,         setShowPDCA]         = useState(false)
  const [pdcaData,         setPdcaData]         = useState<any>(null)
  const {showToast, setActiveTool, activeTool} = useStore()

  // Project state holds metadata only, steps live in their own state below
  const { steps: _initialSteps, ...projectMeta } = initialProject
  const [project, setProject] = useState(projectMeta)
  const [steps, setSteps] = useState<Step[]>(_initialSteps || [])
  const [branches, setBranches] = useState<Branch[]>([])
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([])
  const [kanbanLoaded, setKanbanLoaded] = useState(false)
  const [showStepModal, setShowStepModal] = useState(false)
  const [editingStep, setEditingStep] = useState<Step | null>(null)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null)
  const [tab, setTab] = useState<ProjectTab>('builder')
  const [saving, setSaving] = useState(false)
  const [showSOPUpload, setShowSOPUpload] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const reorderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showProjectEdit, setShowProjectEdit] = useState(false)
  const [showSupe, setShowSupe] = useState(false)
  const [supeOpen, setSupeOpen] = useState(true)

  const isPaid = isPaidProfile(profile)
  const { track } = useAnalytics()

  useEffect(() => {
    fetchBranches(project.id)
      .then(setBranches)
      .catch((err) => {
        console.error('[ProjectClient] fetchBranches failed:', err)
        // Non-critical, branches still usable, just empty
      })
  }, [project.id])

  useEffect(() => {
    if (tab === 'kanban' && !kanbanLoaded) {
      fetchKanbanBoard(project.id)
        .then(cols => {
          setKanbanColumns(cols)
          setKanbanLoaded(true)
        })
        .catch(() => setKanbanLoaded(true))
    }
  }, [tab, project.id, kanbanLoaded])

  const saveProject = useCallback(async (updates: Partial<Project>) => {
    setSaving(true)
    try {
      await updateProject(project.id, updates)
      setProject(p => ({ ...p, ...updates }))
    } catch {
      showToast('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }, [project.id, showToast])

  const handleAddStep = async (form: Partial<Step>) => {
    try {
      const s = await createStep(project.id, form)
      if (!s) throw new Error('No step returned')
      setSteps(ss => [...ss, s])
      showToast('Step added', 'success')
    } catch (err) {
      console.warn('[AddStep] failed:', err)
      showToast('Could not add step. Please try again.', 'error')
    }
  }

  const handleUpdateStep = async (stepId: string, form: Partial<Step>) => {
    const previousSteps = steps
    // Optimistic update
    setSteps(ss => ss.map(s => s.id === stepId ? { ...s, ...form } : s))
    try {
      await updateStep(stepId, form)
      showToast('Step saved', 'success')
    } catch (err) {
      console.warn('[UpdateStep] failed, rolling back:', err)
      setSteps(previousSteps)  // rollback
      showToast('Could not save step. Your change was reverted.', 'error')
    }
  }

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm('Delete this step and all its tool data?')) return
    try {
      await deleteStep(stepId)
      setSteps(ss => ss.filter(s => s.id !== stepId))
      showToast('Step deleted', 'info')
    } catch {
      showToast('Failed to delete step', 'error')
    }
  }

  const handleSaveToolData = async (stepId: string, tool: string, data: Record<string, any>) => {
    // Capture previous state for rollback
    const previousSteps = steps
    // Optimistic update
    setSteps(ss => ss.map(s =>
      s.id === stepId ? { ...s, toolData: { ...(s.toolData || {}), [tool]: data } } : s
    ))
    try {
      await saveToolData(stepId, tool, data)
      showToast('Saved', 'success')
    } catch (err: any) {
      // Rollback on failure, user sees their previous data
      setSteps(previousSteps)
      showToast('Save failed. Check your connection and try again.', 'error')
      throw err  // re-throw so tool modal stays open
    }
  }

  const handleCreateBranch = async (form: Partial<Branch>) => {
    try {
      const nb = await createBranch(project.id, form as any)
      setBranches(bs => [...bs, nb])
      showToast('Branch created!', 'success')
      setShowBranchModal(false)
    } catch {
      showToast('Failed to create branch', 'error')
    }
  }

  const handleUpdateBranch = async (id: string, form: Partial<Branch>) => {
    try {
      await updateBranch(id, form)
      setBranches(bs => bs.map(b => b.id === id ? { ...b, ...form } : b))
      showToast('Branch saved', 'success')
      setShowBranchModal(false)
      setEditingBranch(null)
    } catch {
      showToast('Failed to save branch', 'error')
    }
  }

  const handleDeleteBranch = async (branch: Branch) => {
    if (!confirm(`Delete branch "${branch.label}" and all steps?`)) return
    try {
      await deleteBranch(branch.id, branch.branch_id)
      setBranches(bs => bs.filter(b => b.id !== branch.id))
      setSteps(ss => ss.filter(s => s.branch_id !== branch.branch_id))
      showToast('Branch deleted', 'info')
    } catch {
      showToast('Failed to delete branch', 'error')
    }
  }

  const handleAddBranchStep = async (branchId: string, form: Partial<Step>) => {
    const branch = branches.find(b => b.branch_id === branchId)
    if (!branch) return
    try {
      const ns = await createBranchStep(project.id, branchId, branch.label, branch.parent_step_id || '', form)
      setSteps(ss => [...ss, ns as Step])
      showToast('Step added!', 'success')
    } catch {
      showToast('Failed to add branch step', 'error')
    }
  }

  const handleDrop = async (toIdx: number) => {
    if (dragIdx === null || dragIdx === toIdx) return
    const reordered = [...steps.filter(s => s.is_main_flow !== false)]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(toIdx, 0, moved)
    const branchSteps = steps.filter(s =>
      s.is_main_flow === false ||
      (s.branch_id !== null && s.branch_id !== undefined && s.is_main_flow !== true)
    )
    setSteps([...reordered, ...branchSteps])
    setDragIdx(null)
    // Debounce reorder, wait 300ms in case user is still dragging
    if (reorderTimeoutRef.current) clearTimeout(reorderTimeoutRef.current)
    reorderTimeoutRef.current = setTimeout(async () => {
      try {
        await reorderSteps(project.id, reordered.map(s => s.id))
      } catch {
        showToast('Reorder failed', 'error')
      }
    }, 300)
  }

  const handleSOPSteps = async (sopSteps: any[]) => {
    let added = 0
    let firstError = ''

    for (const s of sopSteps) {
      try {
        const created = await createStep(project.id, {
          name: s.name,
          department: s.department,
          operators: s.operators,
          cycle_time: s.cycle_time,
          wait_time: s.wait_time,
          setup_time: s.setup_time,
          defect_rate: s.defect_rate,
          uptime: s.uptime,
          completion_accuracy: s.completion_accuracy,
          wip: s.wip,
          notes: s.notes,
          is_main_flow: true,
        } as any)

        if (created) {
          setSteps(ss => [...ss, created])
          added++
        }
      } catch (err: any) {
        const msg = err?.message || String(err)
        if (!firstError) firstError = msg
      }
    }

    setShowSOPUpload(false)
    setTab('builder')

    if (added > 0) {
      showToast(`${added} steps added to your map!`, 'success')
    } else {
      showToast(firstError ? `Import failed: ${firstError}` : 'Import failed, no steps were saved', 'error')
    }
  }

  // ── Canonical metrics, single source of truth ───────────────────────────
  // All header bar stats, VSM, report, and coaching tools draw from here.
  // calcProcessMetrics uses VA-only steps for PCE, canonical ctSeconds() for CT,
  // and correctly prioritises available_time_sec over working_hours for takt.
  const {
    mainSteps,
    totalCT,
    totalWait,
    totalWIP,
    pce: pceNum,
    takt: taktCalc,
  } = calcProcessMetrics(steps as any[], project as any)

  const takt = taktCalc ?? 0

  // Open kaizens: exclude both 'complete' AND 'verified'
  const openKZ = steps.reduce((a, s) =>
    a + (s.toolData?.kaizen?.items?.filter(
      (i: any) => i.status !== 'complete' && i.status !== 'verified'
    ).length || 0), 0)

  // Display strings
  const pce = fmtPCE(pceNum)
  const pceColor = calcPceColor(pceNum)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        background: 'var(--vs-white, #FFFFFF)',
      }}
    >
      <div
        style={{
          padding: '10px 20px',
          background: 'var(--vs-white, #FFFFFF)',
          borderBottom: '1px solid var(--vs-slate-200, #DDE3EA)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            color: 'var(--text2)',
            fontSize: 12,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ← Dashboard
        </button>

        <span style={{ color: 'var(--vs-slate-200, #DDE3EA)' }}>|</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontSize: 18,
              fontWeight: 650,
              color: 'var(--vs-navy-900)',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.name}
          </div>
          {project.product && (
            <div style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
              {project.product}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
          {saving && <span style={{ fontSize: 11, color: 'var(--text2)' }}>saving…</span>}
          <ProcessHealthScore steps={steps} compact />

          <button
            onClick={() => setShowSOPUpload(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: 'var(--brand-dim)',
              border: '1px solid rgba(201,166,107,0.25)',
              color: 'var(--brand)',
            }}
          >
            <SOPIcon size={13} color="var(--brand)" />
            <span className="action-btn-label">Import SOP</span>
          </button>

          {isPaid
            ? <PDFExportButton
                project={project}
                steps={steps}
                isGold={(profile as any).beta_tier === 'gold_standard' || (profile as any).lifetime_access}
              />
            : <button onClick={() => router.push('/pricing')} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', background:'var(--brand-dim)', border:'1px solid rgba(11,29,51,0.2)', color:'var(--brand)' }}>
                PDF ↑ Pro
              </button>
          }

          <button
            onClick={() => setShowJournal(true)}
            title="Process Journal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 10px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: 'var(--brand-dim)',
              border: '1px solid rgba(11,29,51,0.2)',
              color: 'var(--brand)',
            }}
          >
            Journal
          </button>

          <button
            onClick={() => setShowProjectEdit(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 10px',
              borderRadius: 7,
              fontSize: 12,
              cursor: 'pointer',
              background: 'none',
              border: '1px solid var(--vs-slate-200, #DDE3EA)',
              color: 'var(--text2)',
            }}
          >
            <SettingsIcon size={13} color="currentColor" />
          </button>

          <button
            onClick={() => {
              setEditingStep(null)
              setShowStepModal(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: 'linear-gradient(135deg,var(--brand2),var(--brand))',
              color: 'var(--bg)',
              border: 'none',
              boxShadow: '0 2px 12px rgba(201,166,107,0.25)',
            }}
          >
            <PlusIcon size={14} color="var(--bg)" />
            <span className="action-btn-label">Add Step</span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          background: 'var(--vs-white, #FFFFFF)',
          borderBottom: '1px solid var(--vs-slate-200, #DDE3EA)',
          overflowX: 'auto',
        }}
      >
        {([
          { label: 'STEPS',    value: mainSteps.length,            color: 'var(--brand)' },
          { label: 'BRANCHES', value: branches.length,             color: 'var(--brand)' },
          { label: 'TOTAL CT', value: fmtS(totalCT),               color: 'var(--brand)' },
          { label: 'WAIT',     value: fmtS(totalWait),             color: totalWait > totalCT ? '#C94F4F' : 'var(--brand)' },
          { label: 'TAKT',     value: takt ? fmtS(takt) : ',',    color: 'var(--brand)' },
          { label: 'PCE',      value: pce,                          color: pceColor },
          { label: 'WIP',      value: totalWIP || ',',             color: totalWIP > 50 ? '#C94F4F' : totalWIP > 20 ? 'var(--brand)' : '#1DD1A1' },
          { label: 'OPEN KZ',  value: openKZ || ',',               color: openKZ > 5 ? '#C94F4F' : openKZ > 0 ? 'var(--brand)' : '#1DD1A1' },
        ] as { label: string; value: any; color: string }[]).map(m => (
          <div
            key={m.label}
            style={{
              padding: '8px 14px',
              borderRight: '1px solid var(--vs-slate-200, #DDE3EA)',
              minWidth: 68,
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 8, color: 'var(--sl-400)', letterSpacing: 1.5, fontFamily: 'var(--font-mono)' }}>
              {m.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: m.color, marginTop: 2 }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div
        className="tab-bar"
        style={{
          display: 'flex',
          padding: '0 20px',
          background: 'var(--vs-white, #FFFFFF)',
          borderBottom: '1px solid var(--vs-slate-200, #DDE3EA)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {TABS.map(t => {
          const active = tab === t.id
          const locked = t.premium && !isPaid
          const TIcon = t.Icon

          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '7px 14px',
                fontSize: 11,
                fontWeight: active ? 700 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: active ? '#1E3A5F' : locked ? 'var(--sl-300)' : 'var(--sl-500)',
                background: active ? '#FFFFFF' : 'transparent',
                border: active ? '1px solid #CBD5E1' : '1px solid transparent',
                borderBottom: active ? '1px solid #FFFFFF' : '1px solid transparent',
                borderRadius: '4px 4px 0 0',
                marginBottom: active ? -1 : 0,
                boxShadow: active ? '0 -1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <TIcon size={11} color="currentColor" />
              {t.label}
              {locked && <span style={{ fontSize: 8, marginLeft: 3, fontWeight:800, letterSpacing:.5, color:"var(--text3)" }}>PRO</span>}
            </button>
          )
        })}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingBottom: '120px',
          }}
        >
          {tab === 'builder' && (
            <div style={{ padding: 20 }}>
              <BuilderTab
                steps={steps}
                takt={takt}
                dragIdx={dragIdx}
                onAddStep={() => {
                  setEditingStep(null)
                  setShowStepModal(true)
                }}
                onEdit={s => {
                  setEditingStep(s)
                  setShowStepModal(true)
                }}
                onDelete={handleDeleteStep}
                onTool={(tool, stepId) => { setActiveTool({ tool, stepId }); track('tool_opened', { tool, projectId: project.id }) }}
                onDragStart={setDragIdx}
                onDrop={handleDrop}
                onImportSOP={() => setShowSOPUpload(true)}
              />
            </div>
          )}

          {tab === 'vsm' && (
            <div>
              {/* Takt Time not-set banner, REVIEW FIX #13 */}
              {!project.takt_time && !project.demand && steps.filter(s => s.is_main_flow !== false).length > 0 && (
                <div style={{ margin: '12px 24px 0', padding: '10px 14px', borderRadius: 8, background: 'rgba(232,148,26,0.07)', border: '1px solid rgba(232,148,26,0.25)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16 }}>⏱</span>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)' }}>Takt Time not set</span>
                    <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 8 }}>Bottleneck analysis is disabled. Set customer demand to unlock the full VSM analysis.</span>
                  </div>
                  <button
                    onClick={() => setShowProjectEdit(true)}
                    style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: 'var(--amber)', color: '#FFFFFF', border: 'none', whiteSpace: 'nowrap' }}
                  >
                    Set Takt Time →
                  </button>
                </div>
              )}

              {/* VSM Analysis Toolbar */}
              <div style={{ display: 'flex', gap: 8, padding: '12px 24px 0', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--sl-400)', fontFamily: 'var(--font-mono)', marginRight: 4, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>VSM Tools</span>
                <button
                  onClick={() => setShowVSMCoaching(true)}
                  className="vsm-tool-btn vsm-tool-btn--red"
                >
                  Gap Analysis
                </button>
                <button
                  onClick={() => setShowYamazumi(true)}
                  className="vsm-tool-btn vsm-tool-btn--teal"
                >
                  Yamazumi Chart
                </button>
                <button
                  onClick={() => setShowStandardWork(true)}
                  className="vsm-tool-btn vsm-tool-btn--blue"
                >
                  Standard Work Sheet
                </button>
                <button
                  onClick={() => setShowFutureState(true)}
                  className="vsm-tool-btn vsm-tool-btn--amber"
                  style={{ marginLeft: 'auto' }}
                >
                  ✦ Target State →
                </button>
              </div>
              <div style={{ padding: 24 }}>
                <VSMMap steps={steps} branches={branches} project={project} />
              </div>
            </div>
          )}
          {tab === 'roadmap' && (
            <div style={{ padding: 24 }}>
              <KaizenRoadmap
                steps={steps}
                project={project}
                takt={takt}
                pce={pceNum}
                onSaveRoadmap={async (phases) => {
                  try {
                    const { createClient } = await import('@/lib/supabase')
                    const db = createClient()
                    const { error } = await db.from('projects')
                      .update({ kaizen_roadmap: { phases }, updated_at: new Date().toISOString() })
                      .eq('id', project.id)
                    if (error) throw error
                    showToast('Kaizen plan saved', 'success')
                  } catch {
                    showToast('Failed to save Kaizen plan, please try again', 'error')
                  }
                }}
              />
            </div>
          )}

          {tab === 'pdca' && (
            <div style={{ padding: 24 }}>
              {/* PDCA project list / launcher */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>PDCA Projects</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>One data model, export as PDCA, A3, 8D, DMAIC, or OODA</div>
                  </div>
                  <button
                    onClick={() => { setPdcaData(null); setShowPDCA(true) }}
                    className="btn btn-primary"
                    style={{ gap: 6, display: 'flex', alignItems: 'center' }}
                  >
                    + New PDCA Project
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                  {['PDCA', 'A3', '8D', 'DMAIC', 'OODA'].map((fmt, i) => {
                    const colors = ['var(--brand)', '#1DD1A1', '#C94F4F', '#6CB9FC', '#A8854F']
                    const descs = [
                      'Plan-Do-Check-Act, standard lean cycle',
                      'Toyota one-page problem-solving report',
                      'Ford 8-Disciplines customer-facing report',
                      'Six Sigma structured project methodology',
                      'Observe-Orient-Decide-Act rapid decision cycle',
                    ]
                    return (
                      <div key={fmt} style={{ background: 'var(--vs-white, #FFFFFF)', border: `1px solid ${colors[i]}44`, borderRadius: 12, padding: '16px 18px' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: colors[i], marginBottom: 6 }}>{fmt}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 12 }}>{descs[i]}</div>
                        <button
                          onClick={() => { setPdcaData(null); setShowPDCA(true) }}
                          style={{ fontSize: 11, padding: '6px 12px', borderRadius: 7, background: `${colors[i]}15`, border: `1px solid ${colors[i]}44`, color: colors[i], cursor: 'pointer', fontWeight: 700 }}
                        >
                          Start project → export as {fmt}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'kaizen' && <div style={{ padding: 24 }}><KaizenBoardView steps={steps} /></div>}
          {tab === 'kanban' && (
            <KanbanBoard
              projectId={project.id}
              steps={steps}
              columns={kanbanColumns}
              onColumnsChange={setKanbanColumns}
              showToast={showToast}
            />
          )}
          {tab === 'report' && <div style={{ padding: 24 }}><ReportTab steps={steps} branches={branches} project={project} /></div>}
          {tab === 'branches' && (
            <div style={{ padding: 24 }}>
              <BranchesTab
                steps={steps}
                branches={branches}
                onNewBranch={() => {
                  setEditingBranch(null)
                  setShowBranchModal(true)
                }}
                onEditBranch={b => {
                  setEditingBranch(b)
                  setShowBranchModal(true)
                }}
                onDeleteBranch={handleDeleteBranch}
                onAddStep={branchId => setActiveBranchId(branchId)}
                onEditStep={s => {
                  setEditingStep(s)
                  setShowStepModal(true)
                }}
                onDeleteStep={handleDeleteStep}
                onTool={(stepId, tool) => { setActiveTool({ tool, stepId }); track('tool_opened', { tool, projectId: project.id }) }}
              />
            </div>
          )}

          {tab === 'simulation' && (
            isPaid
              ? <div style={{ padding: 24 }}><ProcessSimulation steps={steps} projectId={project.id} project={project as any} /></div>
              : <PaywallGate feature="Process Simulation" />
          )}

          {tab === 'live' && (
            isPaid
              ? <div style={{ padding: 24 }}><LiveFloorPanel steps={steps} projectId={project.id} /></div>
              : <PaywallGate feature="Gemba Monitor" />
          )}
        </div>

        <div
          className="supe-desktop-panel"
          style={{
            width: supeOpen ? 290 : 40,
            flexShrink: 0,
            borderLeft: '1px solid rgba(201,166,107,0.20)',
            overflowY: supeOpen ? 'auto' : 'hidden',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s ease',
            position: 'relative',
          }}
        >
          <button
            onClick={() => setSupeOpen(o => !o)}
            title={supeOpen ? 'Collapse Supe' : 'Open Supe AI'}
            style={{
              position: 'absolute',
              top: 12,
              left: supeOpen ? 8 : 4,
              zIndex: 10,
              width: 28,
              height: 28,
              borderRadius: 7,
              border: '1px solid rgba(100,38,160,0.35)',
              background: 'rgba(100,38,160,0.12)',
              color: '#9B5FE0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            {supeOpen ? '›' : '‹'}
          </button>

          {supeOpen && (
            <>
              <div
                style={{
                  padding: '14px 16px 10px 42px',
                  borderBottom: '1px solid rgba(201,166,107,0.15)',
                  background: 'linear-gradient(180deg,rgba(201,166,107,0.06),transparent)',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg,rgba(201,166,107,0.32),rgba(60,22,120,0.5))',
                      border: '1px solid rgba(100,38,160,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ZapIcon size={14} color="#9B5FE0" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13, fontFamily: "'Sora','Inter',sans-serif", lineHeight: 1 }}>
                      Supe
                    </div>
                    <div style={{ fontSize: 9, color: '#A8854F', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, marginTop: 2 }}>
                      AI MENTOR {!isPaid && 'PRO'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, overflow: 'auto' }}>
                {isPaid ? (
                  <SupePanel steps={steps} projectId={project.id} industry={(project as any).industry} projectName={project.name} />
                ) : (
                  <div style={{ padding: 20, textAlign: 'center' }}>
                    
                    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>
                      Supe AI is a <strong style={{ color: 'var(--brand)' }}>Pro feature</strong>.
                    </p>
                    <a
                      href="/pricing"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg,var(--brand2),var(--brand))',
                        color: 'var(--bg)',
                        fontWeight: 700,
                        fontSize: 12,
                        textDecoration: 'none',
                      }}
                    >
                      Upgrade →
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>



      {showSupe && (
        <div
          className="supe-mobile-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) setShowSupe(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 500,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '78vh',
              background: '#0A0518',
              borderRadius: '18px 18px 0 0',
              border: '1px solid rgba(201,166,107,0.32)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 40px rgba(201,166,107,0.20)',
            }}
          >
            <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid rgba(201,166,107,0.15)', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(201,166,107,0.32)', margin: '0 auto 10px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: 'linear-gradient(135deg,rgba(201,166,107,0.32),rgba(60,22,120,0.5))',
                      border: '1px solid rgba(100,38,160,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ZapIcon size={13} color="#9B5FE0" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, fontFamily: "'Sora','Inter',sans-serif" }}>Supe</span>
                    <span style={{ fontSize: 9, color: '#A8854F', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, marginLeft: 6 }}>AI MENTOR</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowSupe(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 20, cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
              {isPaid ? (
                <SupePanel steps={steps} projectId={project.id} industry={(project as any).industry} projectName={project.name} />
              ) : (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>
                    Supe AI is a <strong style={{ color: 'var(--brand)' }}>Pro feature</strong>.<br />
                    Upgrade to unlock AI-powered lean coaching.
                  </p>
                  <a
                    href="/pricing"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg,var(--brand2),var(--brand))',
                      color: 'var(--bg)',
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    Upgrade to Pro
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="mobile-fabs"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          zIndex: 300,
          flexDirection: 'column',
          gap: 10,
          alignItems: 'flex-end',
        }}
      >
        <button
          onClick={() => {
            setEditingStep(null)
            setShowStepModal(true)
          }}
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg,var(--brand2),var(--brand))',
            boxShadow: '0 4px 20px rgba(11,29,51,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Add Step"
        >
          <PlusIcon size={22} color="var(--bg)" />
        </button>

        <button
          onClick={() => setShowSupe(s => !s)}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: showSupe ? 'rgba(100,38,160,0.9)' : 'rgba(201,166,107,0.15)',
            borderColor: 'rgba(100,38,160,0.5)',
            boxShadow: '0 4px 20px rgba(201,166,107,0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
          title="Open Supe AI"
        >
          
        </button>
      </div>

      {showStepModal && (
        <StepModal
          step={editingStep}
          onSave={async form => {
            if (editingStep) {
              await handleUpdateStep(editingStep.id, form)
            } else {
              await handleAddStep(form)
            }
            setShowStepModal(false)
            setEditingStep(null)
          }}
          onClose={() => {
            setShowStepModal(false)
            setEditingStep(null)
          }}
        />
      )}

      {showSOPUpload && (
        <SOPUpload
          projectId={project.id}
          onStepsGenerated={handleSOPSteps}
          onClose={() => setShowSOPUpload(false)}
        />
      )}

      {activeTool && (() => {
        const step = steps.find(s => s.id === activeTool.stepId)
        if (!step) return null
        return (
          <ToolModal
            tool={activeTool.tool}
            step={step}
            onSave={async data => {
              await handleSaveToolData(activeTool.stepId, activeTool.tool, data)
              setActiveTool(null)
            }}
            onClose={() => setActiveTool(null)}
          />
        )
      })()}

      <ProcessJournal
        projectId={project.id}
        open={showJournal}
        onClose={() => setShowJournal(false)}
      />

      {showBranchModal && (
        <BranchModal
          mainSteps={steps.filter(s => s.is_main_flow !== false)}
          branch={editingBranch}
          onSave={async form => {
            if (editingBranch) await handleUpdateBranch(editingBranch.id, form)
            else await handleCreateBranch(form)
          }}
          onClose={() => {
            setShowBranchModal(false)
            setEditingBranch(null)
          }}
        />
      )}

      {activeBranchId && (
        <StepModal
          step={null}
          onSave={async form => {
            await handleAddBranchStep(activeBranchId, form)
            setActiveBranchId(null)
          }}
          onClose={() => setActiveBranchId(null)}
        />
      )}

      {showPDCA && (
        <PDCATool
          steps={steps}
          project={project}
          initialData={pdcaData || mainSteps[0]?.toolData?.pdca_project || steps[0]?.toolData?.pdca_project || null}
          onSave={async (data) => {
            setPdcaData(data)
            // Save against first main-flow step, fallback to any step
            const pdcaStep = mainSteps[0] || steps[0]
            if (pdcaStep?.id) {
              try { await saveToolData(pdcaStep.id, 'pdca_project', data) }
              catch (e) {
                console.error('PDCA save error:', e)
                showToast('PDCA save failed, please add at least one step and try again', 'error')
                return // don't close modal on save failure
              }
            } else {
              // No steps exist, PDCA data held in local state only, warn the user
              showToast('Add a process step first to persist PDCA data across sessions', 'info')
            }
            setShowPDCA(false)
          }}
          onClose={() => setShowPDCA(false)}
        />
      )}

      {/* ── Target / Future State Panel ─────────────────────────────────── */}
      {showFutureState && (
        <div className="vesimy-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowFutureState(false) }}>
          <div className="vesimy-modal" style={{ maxWidth: 780 }}>
            <div className="vesimy-modal-header">
              <div>
                <div className="vesimy-modal-title">✦ Target State Analysis</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                  AI-powered Future State VSM, uses your real process data
                </div>
              </div>
              <button className="vesimy-modal-close" onClick={() => setShowFutureState(false)}>×</button>
            </div>
            <FutureStatePanel
              project={project}
              steps={steps}
              onClose={() => setShowFutureState(false)}
              isPaid={isPaidProfile(profile)}
            />
          </div>
        </div>
      )}

      {showYamazumi && (
        <YamazumiTool
          steps={steps}
          takt={takt}
          onClose={() => setShowYamazumi(false)}
        />
      )}

      {showStandardWork && (
        <StandardWorkTool
          steps={steps}
          takt={takt}
          projectName={project.name}
          onClose={() => setShowStandardWork(false)}
        />
      )}

      {showVSMCoaching && (
        <VSMCoachingTool
          steps={steps}
          project={project}
          takt={takt}
          pce={pceNum ?? 0}
          onClose={() => setShowVSMCoaching(false)}
        />
      )}

      {showProjectEdit && (
        <ProjectSettingsModal
          project={project}
          onSave={async form => {
            await saveProject(form)
            setShowProjectEdit(false)
          }}
          onClose={() => setShowProjectEdit(false)}
          onDelete={async () => {
            if (!confirm('Delete this project and all data? Cannot be undone.')) return
            await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
            router.push('/dashboard')
          }}
        />
      )}
    </div>
  )
}

interface BuilderTabProps {
  steps: Step[]
  takt: number
  dragIdx: number | null
  onAddStep: () => void
  onEdit: (s: Step) => void
  onDelete: (id: string) => void
  onTool: (tool: string, stepId: string) => void
  onDragStart: (idx: number) => void
  onDrop: (idx: number) => void
  onImportSOP: () => void
}

function PaywallGate({ feature }: { feature: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      
      <h2 style={{ fontFamily: "'Sora','Inter',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        {feature}
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 360, lineHeight: 1.7, marginBottom: 28 }}>
        This is a <strong style={{ color: 'var(--brand)' }}>Pro feature</strong>. Upgrade to unlock {feature}, Supe AI, and all advanced CI tools.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg,var(--brand2),var(--brand))', color: 'var(--bg)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Upgrade to Pro to track all your improvement targets, $29/mo
        </a>
        <a href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 10, border: '1px solid rgba(212,168,67,0.3)', color: 'var(--brand)', fontSize: 14, textDecoration: 'none' }}>
          View all plans
        </a>
      </div>
    </div>
  )
}

function BuilderTab({ steps, takt, dragIdx, onAddStep, onEdit, onDelete, onTool, onDragStart, onDrop, onImportSOP }: BuilderTabProps) {
  const mainSteps = useMemo(() => steps.filter(s => s.is_main_flow !== false).sort((a, b) => a.position - b.position), [steps])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const allExpanded = mainSteps.length > 0 && expandedIds.size === mainSteps.length
  function toggleStep(id: string) {
    setExpandedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }
  function toggleAll() {
    if (allExpanded) setExpandedIds(new Set())
    else setExpandedIds(new Set(mainSteps.map(s => s.id)))
  }

  if (mainSteps.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--sl-400)' }}>
        <div style={{ marginBottom: 20, opacity: 0.3 }}>
          <VSMIcon size={64} color="var(--brand)" />
        </div>
        <div style={{ fontSize: 18, color: 'var(--text3)', marginBottom: 8, fontFamily: "'Sora','Inter',sans-serif", fontWeight: 700 }}>
          No process steps yet
        </div>
        <div style={{ fontSize: 13, color: 'var(--sl-400)', marginBottom: 28, lineHeight: 1.6 }}>
          Add steps manually or import from a Standard Operating Procedure
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onAddStep}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 9,
              background: 'linear-gradient(135deg,var(--brand2),var(--brand))',
              color: 'var(--bg)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <PlusIcon size={14} color="var(--bg)" /> Add First Step
          </button>
          <button
            onClick={onImportSOP}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 9,
              background: 'var(--brand-dim)',
              border: '1px solid rgba(212,168,67,0.3)',
              color: 'var(--brand)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <SOPIcon size={14} color="var(--brand)" /> Import from SOP
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {mainSteps.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{mainSteps.length} STEPS</span>
          <button onClick={toggleAll} style={{ fontSize: 11, color: 'var(--brand)', background: 'none', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>
            {allExpanded ? '▲ Collapse All' : '▼ Expand All'}
          </button>
        </div>
      )}
      {mainSteps.map((step, idx) => (
        <StepCard
          key={step.id}
          step={step as any}
          index={idx}
          takt={takt}
          onEdit={() => onEdit(step)}
          onDelete={() => onDelete(step.id)}
          onTool={tool => onTool(tool, step.id)}
          onDragStart={() => onDragStart(idx)}
          onDrop={() => onDrop(idx)}
          expanded={expandedIds.has(step.id)}
          onToggle={() => toggleStep(step.id)}
        />
      ))}

      <button
        onClick={onAddStep}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px',
          borderRadius: 9,
          marginTop: 4,
          border: '1px dashed rgba(184,180,172,0.6)',
          background: 'transparent',
          color: 'var(--sl-400)',
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        <PlusIcon size={13} color="currentColor" /> Add Another Step
      </button>
    </div>
  )
}

interface StepCardProps {
  step: Step
  index: number
  takt: number
  onEdit: () => void
  onDelete: () => void
  onTool: (t: string) => void
  onDragStart: () => void
  onDrop: () => void
  expanded?: any
  onToggle?: () => void
  key?: any
}

function StepCard({ step, index, takt, onEdit, onDelete, onTool, onDragStart, onDrop, expanded, onToggle }: StepCardProps & { expanded: boolean; onToggle: () => void }) {
  const [over, setOver] = useState(false)
  const sw = step.toolData?.stopwatch
  const wastes = step.toolData?.waste?.selected?.length || 0
  const kzOpen = (step.toolData?.kaizen?.items || []).filter((i: any) => i.status !== 'complete' && i.status !== 'verified').length
  const isSM = step.flow_type === 'supermarket'
  const ct = sw?.mean || Number(step.cycle_time) || 0
  // Show bottleneck badge when CT exceeds takt (if takt is known)
  const isBN = takt > 0 && ct > takt

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={() => { setOver(false); onDrop() }}
      style={{
        background: over ? 'rgba(11,29,51,0.03)' : 'var(--vs-white, #FFFFFF)',
        border: `1px solid ${over ? 'rgba(11,29,51,0.4)' : 'var(--vs-slate-200, #DDE3EA)'}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* ── Header row ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 14px',
          background: 'var(--vs-paper, #F7F8FA)',
          borderBottom: expanded ? '1px solid var(--vs-slate-200, #DDE3EA)' : 'none',
        }}
      >
        <span style={{ cursor: 'grab', flexShrink: 0, color: 'var(--vs-slate-200, #DDE3EA)' }}>
          <DragHandleIcon size={14} color="currentColor" />
        </span>
        <span style={{ color: 'var(--sl-400)', fontSize: 10, fontFamily: 'var(--font-mono)', minWidth: 22, flexShrink: 0 }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            {step.name}
            {isSM && (
              <span style={{ fontSize: 8, padding: '2px 5px', borderRadius: 3, background: 'rgba(201,166,107,0.15)', color: '#A8854F', border: '1px solid rgba(201,166,107,0.32)', fontWeight: 700, letterSpacing: 1 }}>SM</span>
            )}
          </div>
          {step.department && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{step.department}</div>}
        </div>
        {/* Quick KPIs */}
        <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text3)', flexWrap: 'wrap', flexShrink: 0 }}>
          {ct > 0 && <span style={{ color: 'var(--brand)' }}>CT:{fmtS(ct)}</span>}
          {step.wip > 0 && <span style={{ color: '#A8854F' }}>WIP:{step.wip}</span>}
          {step.uptime && <span>↑{step.uptime}%</span>}
          {wastes > 0 && <span style={{ color: '#C94F4F' }}>{wastes}W</span>}
          {kzOpen > 0 && <span style={{ color: '#C9A66B', fontWeight: 700 }}>{kzOpen}KZ</span>}
        </div>
        {/* Expand toggle */}
        <button onClick={onToggle} title={expanded ? 'Collapse' : 'Expand details'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '3px 5px', borderRadius: 4, display: 'flex', fontSize: 12 }}>
          {expanded ? '▲' : '▼'}
        </button>
        <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '3px 5px', borderRadius: 4, display: 'flex' }}>
          <EditIcon size={13} color="currentColor" />
        </button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '3px 5px', borderRadius: 4, display: 'flex' }}>
          <TrashIcon size={13} color="currentColor" />
        </button>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div style={{ padding: '12px 14px', background: 'var(--bg)', borderBottom: '1px solid var(--vs-slate-200, #DDE3EA)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Cycle Time', value: ct ? fmtS(ct) : ',', color: 'var(--brand)' },
              { label: 'Wait Time',  value: step.wait_time ? fmtS(Number(step.wait_time)) : ',' },
              { label: 'WIP',        value: step.wip ?? ',', color: step.wip > 0 ? '#A8854F' : undefined },
              { label: 'Operators',  value: step.operators ?? ',' },
              { label: 'Uptime',     value: step.uptime != null ? `${step.uptime}%` : ',' },
              { label: 'Defect Rate',value: step.defect_rate != null ? `${step.defect_rate}%` : ',' },
              { label: 'Flow Type',  value: step.flow_type || 'push' },
              { label: 'VA Type',    value: step.va_type || 'VA' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--vs-white, #FFFFFF)', border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 7, padding: '7px 10px' }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: color || 'var(--text)' }}>{String(value)}</div>
              </div>
            ))}
          </div>
          {step.notes && (
            <div style={{ fontSize: 12, color: 'var(--text2)', background: 'rgba(11,29,51,0.04)', border: '1px solid rgba(201,166,107,0.12)', borderRadius: 7, padding: '8px 10px', marginBottom: 10, lineHeight: 1.6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 3 }}>NOTES</span>
              {step.notes}
            </div>
          )}
          {/* CI Tool buttons */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {CI_TOOLS.map(t => {
              const has = !!step.toolData?.[t.id] && Object.keys(step.toolData[t.id]).length > 0
              const TIcon = t.Icon
              return (
                <button
                  key={t.id}
                  onClick={() => onTool(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
                    background: has ? 'var(--brand-dim)' : 'var(--vs-white, #FFFFFF)',
                    border: `1px solid ${has ? 'var(--brand)' : 'var(--vs-slate-200, #DDE3EA)'}`,
                    color: has ? 'var(--brand)' : 'var(--sl-400)',
                  }}
                >
                  <TIcon size={11} color="currentColor" />
                  {t.label}
                  {has && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block', marginLeft: 1 }} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function KaizenBoardView({ steps }: { steps: Step[] }) {
  const allItems = steps.flatMap(s =>
    (s.toolData?.kaizen?.items || []).map((i: any) => ({ ...i, stepName: s.name }))
  )

  const statuses = ['open', 'in-progress', 'complete'] as const
  const sLabel = { open: 'Open', 'in-progress': 'In Progress', complete: 'Complete' }
  const sColor = { open: '#C94F4F', 'in-progress': '#C9A66B', complete: '#1DD1A1' }

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora','Inter',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
        Kaizen Board
      </h2>

      {allItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
          <KaizenIcon size={40} color="var(--text3)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <div style={{ color: 'var(--text2)' }}>No kaizen events yet, open the Kaizen tool on any step.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {statuses.map(st => (
            <div key={st}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: sColor[st], marginBottom: 10, padding: '6px 0', borderBottom: `2px solid ${sColor[st]}33` }}>
                {sLabel[st]} ({allItems.filter(i => i.status === st).length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allItems.filter(i => i.status === st).map((item: any, ki: number) => (
                  <div key={ki} style={{ background: 'var(--vs-white, #FFFFFF)', border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{item.stepName}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReportTab({ steps, branches, project }: { steps: Step[]; branches: Branch[]; project: Project }) {
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()
  const [showPDCA, setShowPDCA] = useState(false)

  // Canonical metrics, main-flow only, VA-aware PCE, correct takt resolution
  const {
    mainSteps: reportSteps,
    totalCT,
    totalWait: totalWT,
    pce: pceNum,
    takt: taktCalc,
    bottleneck,
  } = calcProcessMetrics(steps as any[], project as any)

  const takt = taktCalc ?? 0
  // pceNum is null when no VA-classified steps exist; display as ',' in that case
  const pceDisplay = pceNum !== null ? Math.round(pceNum) : 0

  // Open kaizens across ALL steps (branches included), board-level count
  const openKaizens = steps.reduce((a, s) =>
    a + ((s.toolData?.kaizen?.items || []).filter((k: any) => k.status !== 'complete' && k.status !== 'verified').length), 0)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontFamily: "'Sora','Inter',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          CI Report, {project.name}
        </h2>
        <AIAssistButton
          label="AI Executive Summary"
          loading={aiLoading}
          onClick={() => aiAssist('report_summary', {
            projectName: project.name,
            steps: reportSteps, pce: pceDisplay, takt,
            bottleneck: bottleneck?.name,
            totalCT, totalWT, openKaizens,
          })}
        />
      </div>

      {aiResult && (
        <div style={{ marginBottom: 20 }}>
          <AIResultPanel
            result={aiResult as string}
            source={aiSource} error={aiError} onClear={aiClear}
            title="AI EXECUTIVE SUMMARY"
          />
        </div>
      )}

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Steps Mapped',             val: String(reportSteps.length),                                                                  color: 'var(--text)' },
          { label: 'Process Cycle Efficiency', val: pceNum !== null ? `${pceDisplay}%` : ',',                                                   color: pceNum !== null ? (pceDisplay >= 60 ? '#1DD1A1' : '#C94F4F') : 'var(--text3)' },
          { label: 'Total Cycle Time',         val: totalCT > 0 ? fmtS(totalCT) : ',',                                                          color: 'var(--text)' },
          { label: 'Total Wait Time',          val: totalWT > 0 ? fmtS(totalWT) : ',',                                                          color: totalWT > totalCT ? '#C94F4F' : 'var(--text)' },
          { label: 'Bottleneck',               val: bottleneck?.name || ',',                                                                     color: bottleneck ? '#C94F4F' : '#1DD1A1' },
          { label: 'Open Kaizens',             val: String(openKaizens),                                                                         color: openKaizens > 0 ? 'var(--brand)' : '#1DD1A1' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Step breakdown table, main-flow steps only (branches excluded from process report) */}
      {reportSteps.length > 0 && (
        <div style={{ border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--vs-slate-200, #DDE3EA)', background: 'var(--vs-paper, #F7F8FA)', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
            Process Step Summary
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--vs-paper, #F7F8FA)' }}>
                  {['Step', 'CT', 'Wait', 'VA Type', 'Wastes', 'Open Kaizens', 'Status'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--text3)', fontWeight: 600, fontSize: 10, borderBottom: '1px solid var(--vs-slate-200, #DDE3EA)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportSteps.map((s: any, i: number) => {
                  const ct = ctSeconds(s)   // handles stopwatch ms→s + cycle_time_unit
                  const wt = Number(s.wait_time) || 0
                  const wastes = (s.toolData?.waste?.selected || []).length
                  const openK = (s.toolData?.kaizen?.items || []).filter((k: any) => k.status !== 'complete' && k.status !== 'verified').length
                  // Bottleneck: use takt if set; else flag if CT > 1.5× avg
                  const avgCT = totalCT / Math.max(reportSteps.length, 1)
                  const isBN = takt > 0 ? ct > takt : (avgCT > 0 && ct > avgCT * 1.5)
                  return (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--vs-paper, #F7F8FA)', borderTop: '1px solid var(--vs-slate-200, #DDE3EA)' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 600, color: isBN ? '#C94F4F' : 'var(--text)' }}>
                        {isBN && <span style={{ fontSize: 9, background: 'rgba(201,79,79,0.12)', color: '#C94F4F', padding: '1px 5px', borderRadius: 4, marginRight: 5 }}>BN</span>}
                        {s.name}
                      </td>
                      <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: isBN ? '#C94F4F' : 'var(--text2)' }}>{ct ? fmtS(ct) : ','}</td>
                      <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>{wt ? fmtS(wt) : ','}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: s.va_type === 'va' ? 'rgba(29,209,161,0.12)' : s.va_type === 'nva' ? 'rgba(201,79,79,0.12)' : 'rgba(201,166,107,0.12)', color: s.va_type === 'va' ? '#1DD1A1' : s.va_type === 'nva' ? '#C94F4F' : 'var(--brand)' }}>
                          {(s.va_type || 'VA').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '7px 10px', color: wastes > 0 ? 'var(--brand)' : 'var(--text3)' }}>{wastes > 0 ? `${wastes} waste${wastes > 1 ? 's' : ''}` : ','}</td>
                      <td style={{ padding: '7px 10px', color: openK > 0 ? 'var(--brand)' : 'var(--text3)' }}>{openK > 0 ? `${openK} open` : ','}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{ fontSize: 10, color: isBN ? '#C94F4F' : ct === 0 ? 'var(--text3)' : '#1DD1A1' }}>
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

      {/* PDCA Tool, opens as proper modal with real close handler */}
      <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--vs-slate-200, #DDE3EA)' }}>
        <button
          type="button"
          onClick={() => setShowPDCA(true)}
          style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--vs-slate-200, #DDE3EA)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}
        >
          Open PDCA Report
        </button>
      </div>
      {showPDCA && (
        <PDCATool
          steps={steps}
          project={project}
          onClose={() => setShowPDCA(false)}
        />
      )}
    </div>
  )
}

function ProjectSettingsModal({ project, onSave, onClose, onDelete }: {
  project: Project
  onSave: (f: Partial<Project>) => Promise<void>
  onClose: () => void
  onDelete: () => Promise<void>
}) {
  const [form, setForm] = useState<Partial<Project>>({ ...project })

  const fields = [
    { key: 'name', label: 'Project Name', type: 'text', span: true },
    { key: 'description', label: 'Description', type: 'text', span: true },
    { key: 'industry', label: 'Industry', type: 'text', span: false },
    { key: 'product', label: 'Product Family', type: 'text', span: false },
    { key: 'customer', label: 'Customer', type: 'text', span: false },
    { key: 'supplier', label: 'Supplier', type: 'text', span: false },
    { key: 'demand', label: 'Demand (units/day)', type: 'number', span: false },
    { key: 'working_hours', label: 'Working Hours/Day', type: 'number', span: false },
    { key: 'takt_time', label: 'Takt Time (sec)', type: 'number', span: false },
  ]

  return (
    <Modal
      title="Project Settings"
      onClose={onClose}
      onSave={() => onSave(form)}
      saveLabel="Save"
    >
      <div className="vesimy-mobile-grid">
        {fields.map(f => (
          <div key={f.key} style={f.span ? { gridColumn: '1/-1' } : {}}>
            <label className="label">{f.label}</label>
            <input
              className="input"
              type={f.type}
              value={(form as any)[f.key] || ''}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            />
          </div>
        ))}

        <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
          <button onClick={onDelete} className="btn btn-danger">
            Delete Project
          </button>
        </div>
      </div>
    </Modal>
  )
}

function BranchesTab({ steps, branches, onNewBranch, onEditBranch, onDeleteBranch, onAddStep, onEditStep, onDeleteStep, onTool }: {
  steps: Step[]
  branches: Branch[]
  onNewBranch: () => void
  onEditBranch: (b: Branch) => void
  onDeleteBranch: (b: Branch) => void
  onAddStep: (id: string) => void
  onEditStep: (s: Step) => void
  onDeleteStep: (id: string) => void
  onTool: (stepId: string, tool: string) => void
}) {

  // Body-scroll locking is handled at the root ProjectClient level via Modal
  // component. The prior implementation here referenced 13 undefined state
  // variables from a deleted parent scope, removed to prevent crash on mount.

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: "'Sora','Inter',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            Process Branches
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>Parallel lanes, sub-assemblies, prep flows, quality loops</p>
        </div>

        <button
          onClick={onNewBranch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'linear-gradient(135deg,var(--brand2),var(--brand))',
            border: 'none',
            color: 'var(--bg)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <PlusIcon size={13} color="var(--bg)" /> New Branch
        </button>
      </div>

      {branches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--sl-400)' }}>
          <BranchIcon size={48} color="var(--sl-400)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <div style={{ color: 'var(--text3)', fontSize: 15, marginBottom: 24 }}>No branches yet</div>
          <button onClick={onNewBranch} className="btn btn-primary">Create First Branch</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {branches.map(branch => {
            const bSteps = steps.filter(s => s.branch_id === branch.branch_id)
            return (
              <div key={branch.id} style={{ background: 'var(--vs-white, #FFFFFF)', border: `1px solid ${branch.color}33`, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'var(--vs-paper, #F7F8FA)', borderBottom: `1px solid ${branch.color}22`, flexWrap: 'wrap' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: branch.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{branch.label}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => onAddStep(branch.branch_id)} className="btn btn-secondary btn-xs">+ Step</button>
                    <button onClick={() => onEditBranch(branch)} className="btn btn-ghost btn-xs">Edit</button>
                    <button onClick={() => onDeleteBranch(branch)} className="btn btn-danger btn-xs">Delete</button>
                  </div>
                </div>

                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bSteps.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--sl-400)', fontSize: 12 }}>
                      No steps in this branch yet.
                    </div>
                  ) : bSteps.map((s, si) => (
                    <div key={s.id} style={{ background: 'var(--vs-white, #FFFFFF)', border: `1px solid ${branch.color}22`, borderRadius: 6, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--sl-400)', fontFamily: 'var(--font-mono)', fontSize: 10, minWidth: 16 }}>{si + 1}.</span>
                      <div style={{ flex: 1, minWidth: 80 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 12 }}>{s.name}</div>
                      </div>
                      <button onClick={() => onEditStep(s)} className="btn btn-ghost btn-xs">Edit</button>
                      <button onClick={() => onDeleteStep(s.id)} className="btn btn-danger btn-xs">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}