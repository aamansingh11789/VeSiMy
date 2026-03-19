// @ts-nocheck
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { Project, Step, Branch, Profile, KanbanColumn, ProjectTab } from '@/lib/store'
import {
  updateProject, createStep, updateStep, deleteStep,
  saveToolData, reorderSteps,
  fetchBranches, createBranch, updateBranch, deleteBranch, createBranchStep,
  fetchKanbanBoard,
} from '@/lib/db'
import { StepModal } from '@/components/tools/StepModal'
import { BranchModal } from '@/components/tools/BranchModal'
import { ToolModal } from '@/components/tools/ToolModal'
import { useAnalytics } from '@/hooks/useAnalytics'
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
  { id: 'builder',  label: 'Builder',    Icon: PlusIcon,        premium: false },
  { id: 'vsm',      label: 'VSM Map',    Icon: VSMIcon,         premium: false },
  { id: 'roadmap',  label: 'Roadmap',    Icon: RoadmapIcon,     premium: false },
  { id: 'pdca',     label: 'PDCA',       Icon: PDCAIcon,        premium: false },
  { id: 'kaizen',   label: 'Kaizen',     Icon: KaizenIcon,      premium: false },
  { id: 'kanban',   label: 'Kanban',     Icon: KanbanIcon,      premium: false },
  { id: 'simulation',label: 'Simulation',Icon: SimulationIcon,  premium: true  },
  { id: 'live',     label: 'Live Floor', Icon: LiveFloorIcon,   premium: true  },
  { id: 'report',   label: 'Report',     Icon: ReportIcon,      premium: false },
  { id: 'branches', label: 'Branches',   Icon: BranchIcon,      premium: false },
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
  if (!s && s !== 0) return '—'
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
  const [showPDCA,         setShowPDCA]         = useState(false)
  const [pdcaData,         setPdcaData]         = useState<any>(null)
  const {
    showToast, setActiveTool, activeTool,
    setShowStepModal, showStepModal,
    setEditingStep, editingStep,
  } = useStore()

  const [project, setProject] = useState(initialProject)
  const [steps, setSteps] = useState<Step[]>(initialProject.steps || [])
  const [branches, setBranches] = useState<Branch[]>([])
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([])
  const [kanbanLoaded, setKanbanLoaded] = useState(false)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null)
  const [tab, setTab] = useState<ProjectTab>('builder')
  const [saving, setSaving] = useState(false)
  const [showSOPUpload, setShowSOPUpload] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [showProjectEdit, setShowProjectEdit] = useState(false)
  const [showSupe, setShowSupe] = useState(false)
  const [supeOpen, setSupeOpen] = useState(true)

  const isPaid =
    (profile as any).plan_tier === 'pro' ||
    (profile as any).plan_tier === 'enterprise' ||
    (profile as any).lifetime_access ||
    (profile as any).is_beta

  useEffect(() => {
    fetchBranches(project.id).then(setBranches).catch(() => {})
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
    const s = await createStep(project.id, form)
    setSteps(ss => [...ss, s])
    showToast('Step added!', 'success')
  }

  const handleUpdateStep = async (stepId: string, form: Partial<Step>) => {
    await updateStep(stepId, form)
    setSteps(ss => ss.map(s => s.id === stepId ? { ...s, ...form } : s))
    showToast('Step saved', 'success')
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
    await saveToolData(stepId, tool, data)
    setSteps(ss => ss.map(s =>
      s.id === stepId ? { ...s, toolData: { ...(s.toolData || {}), [tool]: data } } : s
    ))
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
    const branchSteps = steps.filter(s => s.is_main_flow === false)
    setSteps([...reordered, ...branchSteps])
    setDragIdx(null)
    try {
      await reorderSteps(project.id, reordered.map(s => s.id))
    } catch {
      showToast('Reorder failed', 'error')
    }
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
      showToast(firstError ? `Import failed: ${firstError}` : 'Import failed — no steps were saved', 'error')
    }
  }

  const mainSteps = steps.filter(s => s.is_main_flow !== false)
  const totalCT = mainSteps.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0)
  const totalWait = mainSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const totalWIP = steps.reduce((a, s) => a + (Number(s.wip) || 0), 0)
  const openKZ = steps.reduce((a, s) =>
    a + (s.toolData?.kaizen?.items?.filter((i: any) => i.status !== 'complete').length || 0), 0)
  const availSec = project.available_time_sec
    ? Number(project.available_time_sec)
    : project.working_hours ? Number(project.working_hours) * 3600 : 0
  const takt = project.takt_time
    ? Number(project.takt_time)
    : (project.demand && availSec ? availSec / Number(project.demand) : 0)
  const pceNum = totalCT + totalWait > 0
    ? Math.min(100, (totalCT / (totalCT + totalWait)) * 100)
    : null
  const pce = pceNum !== null ? `${pceNum.toFixed(0)}%` : '—'
  const pceColor = pceNum === null ? '#D4A208'
    : pceNum >= 90 ? '#1DD1A1'
    : pceNum >= 60 ? '#D4A208'
    : '#FF6B6B'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        background: 'var(--bg2)',
      }}
    >
      <div
        style={{
          padding: '10px 20px',
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
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

        <span style={{ color: 'var(--border2)' }}>|</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'Palatino Linotype,Georgia,serif',
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.name}
          </div>
          {project.product && (
            <div style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'monospace', letterSpacing: 1 }}>
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
              background: 'rgba(212,162,8,0.08)',
              border: '1px solid rgba(212,162,8,0.25)',
              color: 'var(--gold)',
            }}
          >
            <SOPIcon size={13} color="#D4A208" />
            <span className="action-btn-label">Import SOP</span>
          </button>

          <PDFExportButton
            project={project}
            steps={steps}
            isGold={(profile as any).beta_tier === 'gold_standard' || (profile as any).lifetime_access}
          />

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
              background: 'rgba(212,162,8,0.06)',
              border: '1px solid rgba(212,162,8,0.2)',
              color: 'var(--gold)',
            }}
          >
            📓
            <span className="action-btn-label">Journal</span>
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
              border: '1px solid var(--border2)',
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
              background: 'linear-gradient(135deg,#C49510,#D4A208)',
              color: 'var(--bg)',
              border: 'none',
              boxShadow: '0 2px 12px rgba(212,162,8,0.25)',
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
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
        }}
      >
        {([
          { label: 'STEPS',    value: mainSteps.length,            color: 'var(--gold)' },
          { label: 'BRANCHES', value: branches.length,             color: 'var(--gold)' },
          { label: 'TOTAL CT', value: fmtS(totalCT),               color: 'var(--gold)' },
          { label: 'WAIT',     value: fmtS(totalWait),             color: totalWait > totalCT ? '#FF6B6B' : '#D4A208' },
          { label: 'TAKT',     value: takt ? fmtS(takt) : '—',    color: 'var(--gold)' },
          { label: 'PCE',      value: pce,                          color: pceColor },
          { label: 'WIP',      value: totalWIP || '—',             color: totalWIP > 50 ? '#FF6B6B' : totalWIP > 20 ? '#D4A208' : '#1DD1A1' },
          { label: 'OPEN KZ',  value: openKZ || '—',               color: openKZ > 5 ? '#FF6B6B' : openKZ > 0 ? '#D4A208' : '#1DD1A1' },
        ] as { label: string; value: any; color: string }[]).map(m => (
          <div
            key={m.label}
            style={{
              padding: '8px 14px',
              borderRight: '1px solid var(--border)',
              minWidth: 68,
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 8, color: 'var(--sl-400)', letterSpacing: 1.5, fontFamily: 'monospace' }}>
              {m.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: m.color, marginTop: 2 }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          padding: '0 20px',
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
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
                padding: '9px 14px',
                fontSize: 11,
                fontWeight: active ? 600 : 400,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: active ? 'var(--gold)' : locked ? 'var(--sl-300)' : 'var(--sl-500)',
                borderBottom: `2px solid ${active ? '#D4A208' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              <TIcon size={11} color="currentColor" />
              {t.label}
              {locked && <span style={{ fontSize: 9, marginLeft: 2 }}>🔒</span>}
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
              {/* VSM Analysis Toolbar */}
              <div style={{ display: 'flex', gap: 8, padding: '12px 24px 0', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--sl-400)', fontFamily: 'monospace', marginRight: 4, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>VSM Tools</span>
                <button
                  onClick={() => setShowVSMCoaching(true)}
                  className="vsm-tool-btn vsm-tool-btn--red"
                >
                  🎯 Gap Analysis & AI Coaching
                </button>
                <button
                  onClick={() => setShowYamazumi(true)}
                  className="vsm-tool-btn vsm-tool-btn--teal"
                >
                  📊 Yamazumi Chart
                </button>
                <button
                  onClick={() => setShowStandardWork(true)}
                  className="vsm-tool-btn vsm-tool-btn--blue"
                >
                  📋 Standard Work Sheet
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
              />
            </div>
          )}

          {tab === 'pdca' && (
            <div style={{ padding: 24 }}>
              {/* PDCA project list / launcher */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>🔄 PDCA Projects</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>One data model — export as PDCA, A3, 8D, DMAIC, or OODA</div>
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
                    const colors = ['#D4A208', '#1DD1A1', '#FF6B6B', '#6CB9FC', '#8C44CC']
                    const descs = [
                      'Plan-Do-Check-Act — standard lean cycle',
                      'Toyota one-page problem-solving report',
                      'Ford 8-Disciplines customer-facing report',
                      'Six Sigma structured project methodology',
                      'Observe-Orient-Decide-Act rapid decision cycle',
                    ]
                    return (
                      <div key={fmt} style={{ background: 'var(--bg2)', border: `1px solid ${colors[i]}44`, borderRadius: 12, padding: '16px 18px' }}>
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
              ? <div style={{ padding: 24 }}><ProcessSimulation steps={steps} projectId={project.id} /></div>
              : <PaywallGate feature="Process Simulation" />
          )}

          {tab === 'live' && (
            isPaid
              ? <div style={{ padding: 24 }}><LiveFloorPanel steps={steps} projectId={project.id} /></div>
              : <PaywallGate feature="Live Floor Monitor" />
          )}
        </div>

        <div
          className="supe-desktop-panel"
          style={{
            width: supeOpen ? 290 : 40,
            flexShrink: 0,
            borderLeft: '1px solid rgba(100,38,160,0.2)',
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
                  borderBottom: '1px solid rgba(100,38,160,0.15)',
                  background: 'linear-gradient(180deg,rgba(100,38,160,0.06),transparent)',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg,rgba(100,38,160,0.3),rgba(60,22,120,0.5))',
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
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13, fontFamily: 'Palatino Linotype,serif', lineHeight: 1 }}>
                      Supe
                    </div>
                    <div style={{ fontSize: 9, color: '#8C44CC', fontFamily: 'monospace', letterSpacing: 1.5, marginTop: 2 }}>
                      AI MENTOR {!isPaid && '🔒'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, overflow: 'auto' }}>
                {isPaid ? (
                  <SupePanel steps={steps} projectId={project.id} />
                ) : (
                  <div style={{ padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
                    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>
                      Supe AI is a <strong style={{ color: 'var(--gold)' }}>Pro feature</strong>.
                    </p>
                    <a
                      href="/pricing"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg,#C49510,#D4A208)',
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
              border: '1px solid rgba(100,38,160,0.3)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 40px rgba(100,38,160,0.2)',
            }}
          >
            <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid rgba(100,38,160,0.15)', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(100,38,160,0.3)', margin: '0 auto 10px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: 'linear-gradient(135deg,rgba(100,38,160,0.3),rgba(60,22,120,0.5))',
                      border: '1px solid rgba(100,38,160,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ZapIcon size={13} color="#9B5FE0" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, fontFamily: 'Palatino Linotype,serif' }}>Supe</span>
                    <span style={{ fontSize: 9, color: '#8C44CC', fontFamily: 'monospace', letterSpacing: 1.5, marginLeft: 6 }}>AI MENTOR</span>
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
                <SupePanel steps={steps} projectId={project.id} />
              ) : (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>
                    Supe AI is a <strong style={{ color: 'var(--gold)' }}>Pro feature</strong>.<br />
                    Upgrade to unlock AI-powered lean coaching.
                  </p>
                  <a
                    href="/pricing"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg,#C49510,#D4A208)',
                      color: 'var(--bg)',
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    👑 Upgrade to Pro
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
          display: 'none',
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
            background: 'linear-gradient(135deg,#C49510,#D4A208)',
            boxShadow: '0 4px 20px rgba(212,162,8,0.4)',
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
            background: showSupe ? 'rgba(100,38,160,0.9)' : 'rgba(100,38,160,0.15)',
            borderColor: 'rgba(100,38,160,0.5)',
            boxShadow: '0 4px 20px rgba(100,38,160,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
          title="Open Supe AI"
        >
          ⚡
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
          initialData={pdcaData}
          onSave={(data) => { setPdcaData(data); setShowPDCA(false) }}
          onClose={() => setShowPDCA(false)}
        />
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
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        {feature}
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 360, lineHeight: 1.7, marginBottom: 28 }}>
        This is a <strong style={{ color: 'var(--gold)' }}>Pro feature</strong>. Upgrade to unlock {feature}, Supe AI, and all advanced CI tools.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#C49510,#D4A208)', color: 'var(--bg)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          👑 Upgrade to Pro — $29/mo
        </a>
        <a href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 10, border: '1px solid rgba(212,162,8,0.3)', color: 'var(--gold)', fontSize: 14, textDecoration: 'none' }}>
          View all plans
        </a>
      </div>
    </div>
  )
}

function BuilderTab({ steps, dragIdx, onAddStep, onEdit, onDelete, onTool, onDragStart, onDrop, onImportSOP }: BuilderTabProps) {
  const mainSteps = steps.filter(s => s.is_main_flow !== false).sort((a, b) => a.position - b.position)

  if (mainSteps.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--sl-400)' }}>
        <div style={{ marginBottom: 20, opacity: 0.3 }}>
          <VSMIcon size={64} color="#D4A208" />
        </div>
        <div style={{ fontSize: 18, color: 'var(--text3)', marginBottom: 8, fontFamily: 'Palatino Linotype,serif', fontWeight: 700 }}>
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
              background: 'linear-gradient(135deg,#C49510,#D4A208)',
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
              background: 'rgba(212,162,8,0.08)',
              border: '1px solid rgba(212,162,8,0.3)',
              color: 'var(--gold)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <SOPIcon size={14} color="#D4A208" /> Import from SOP
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {mainSteps.map((step, idx) => (
        <StepCard
          key={step.id}
          step={step}
          index={idx}
          onEdit={() => onEdit(step)}
          onDelete={() => onDelete(step.id)}
          onTool={tool => onTool(tool, step.id)}
          onDragStart={() => onDragStart(idx)}
          onDrop={() => onDrop(idx)}
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
  onEdit: () => void
  onDelete: () => void
  onTool: (t: string) => void
  onDragStart: () => void
  onDrop: () => void
}

function StepCard({ step, index, onEdit, onDelete, onTool, onDragStart, onDrop }: StepCardProps) {
  const [over, setOver] = useState(false)
  const sw = step.toolData?.stopwatch
  const wastes = step.toolData?.waste?.selected?.length || 0
  const kzOpen = (step.toolData?.kaizen?.items || []).filter((i: any) => i.status !== 'complete').length
  const isSM = step.flow_type === 'supermarket'

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={e => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={() => {
        setOver(false)
        onDrop()
      }}
      style={{
        background: over ? 'rgba(212,162,8,0.03)' : 'var(--bg2)',
        border: `1px solid ${over ? 'rgba(212,162,8,0.4)' : 'var(--border)'}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '11px 14px',
          background: 'var(--bg3)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span style={{ cursor: 'grab', flexShrink: 0, color: 'var(--border2)' }}>
          <DragHandleIcon size={14} color="currentColor" />
        </span>

        <span style={{ color: 'var(--sl-400)', fontSize: 10, fontFamily: 'monospace', minWidth: 22, flexShrink: 0 }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            {step.name}
            {isSM && (
              <span style={{ fontSize: 8, padding: '2px 5px', borderRadius: 3, background: 'rgba(100,38,160,0.15)', color: '#8C44CC', border: '1px solid rgba(100,38,160,0.3)', fontWeight: 700, letterSpacing: 1 }}>
                SM
              </span>
            )}
          </div>
          {step.department && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{step.department}</div>}
        </div>

        <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text3)', flexWrap: 'wrap', flexShrink: 0 }}>
          {sw?.mean && <span style={{ color: 'var(--gold)' }}>CT:{fmtS(sw.mean)}</span>}
          {step.uptime && <span>↑{step.uptime}%</span>}
          {wastes > 0 && <span style={{ color: '#FF6B6B' }}>{wastes}W</span>}
          {kzOpen > 0 && <span style={{ color: '#F4A623' }}>⚡{kzOpen}</span>}
        </div>

        <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '3px 5px', borderRadius: 4, display: 'flex' }}>
          <EditIcon size={13} color="currentColor" />
        </button>

        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '3px 5px', borderRadius: 4, display: 'flex' }}>
          <TrashIcon size={13} color="currentColor" />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 5, padding: '9px 14px', flexWrap: 'wrap' }}>
        {CI_TOOLS.map(t => {
          const has = !!step.toolData?.[t.id] && Object.keys(step.toolData[t.id]).length > 0
          const TIcon = t.Icon
          return (
            <button
              key={t.id}
              onClick={() => onTool(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                fontSize: 11,
                borderRadius: 6,
                cursor: 'pointer',
                background: has ? 'rgba(212,162,8,0.10)' : 'transparent',
                border: `1px solid ${has ? 'var(--gold)' : 'var(--border)'}`,
                background: has ? 'rgba(196,155,46,0.08)' : 'var(--bg2)',
                color: has ? '#D4A208' : 'var(--sl-400)',
              }}
            >
              <TIcon size={11} color="currentColor" />
              {t.label}
              {has && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4A208', display: 'inline-block', marginLeft: 1 }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function KaizenBoardView({ steps }: { steps: Step[] }) {
  const allItems = steps.flatMap(s =>
    (s.toolData?.kaizen?.items || []).map((i: any) => ({ ...i, stepName: s.name }))
  )

  const statuses = ['open', 'in-progress', 'complete'] as const
  const sLabel = { open: 'Open', 'in-progress': 'In Progress', complete: 'Complete' }
  const sColor = { open: '#FF6B6B', 'in-progress': '#F4A623', complete: '#1DD1A1' }

  return (
    <div>
      <h2 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
        Kaizen Board
      </h2>

      {allItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
          <KaizenIcon size={40} color="var(--text3)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <div style={{ color: 'var(--text2)' }}>No kaizen events yet — open the Kaizen tool on any step.</div>
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
                  <div key={ki} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>📍 {item.stepName}</div>
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

  const takt = project.takt_time ? Number(project.takt_time) : 0
  const totalCT = steps.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0)
  const totalWT = steps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const pceNum = totalCT + totalWT > 0 ? Math.round(totalCT / (totalCT + totalWT) * 100) : 0
  const bottleneck = takt > 0
    ? steps.filter(s => (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0) > takt)
        .sort((a, b) => (b.toolData?.stopwatch?.mean || Number(b.cycle_time) || 0) - (a.toolData?.stopwatch?.mean || Number(a.cycle_time) || 0))[0]
    : null
  const openKaizens = steps.reduce((a, s) =>
    a + ((s.toolData?.kaizen?.items || []).filter((k: any) => k.status !== 'complete' && k.status !== 'verified').length), 0)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          CI Report — {project.name}
        </h2>
        <AIAssistButton
          label="⚡ AI Executive Summary"
          loading={aiLoading}
          onClick={() => aiAssist('report_summary', {
            projectName: project.name,
            steps, pce: pceNum, takt,
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
          { label: 'Steps Mapped', val: String(steps.length), color: 'var(--text)' },
          { label: 'Process Cycle Efficiency', val: `${pceNum}%`, color: pceNum >= 60 ? '#1DD1A1' : '#FF6B6B' },
          { label: 'Total Cycle Time', val: totalCT > 0 ? `${(totalCT/60).toFixed(1)}min` : '—', color: 'var(--text)' },
          { label: 'Total Wait Time', val: totalWT > 0 ? `${(totalWT/60).toFixed(1)}min` : '—', color: totalWT > totalCT ? '#FF6B6B' : 'var(--text)' },
          { label: 'Bottleneck', val: bottleneck?.name || '—', color: bottleneck ? '#FF6B6B' : '#1DD1A1' },
          { label: 'Open Kaizens', val: String(openKaizens), color: openKaizens > 0 ? '#D4A208' : '#1DD1A1' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Step breakdown table */}
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
                {steps.map((s, i) => {
                  const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
                  const wt = Number(s.wait_time) || 0
                  const wastes = (s.toolData?.waste?.selected || []).length
                  const openK = (s.toolData?.kaizen?.items || []).filter((k: any) => k.status !== 'complete' && k.status !== 'verified').length
                  const isBN = takt > 0 && ct > takt
                  return (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg3)', borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 600, color: isBN ? '#FF6B6B' : 'var(--text)' }}>
                        {isBN && <span style={{ fontSize: 9, background: 'rgba(255,107,107,0.12)', color: '#FF6B6B', padding: '1px 5px', borderRadius: 4, marginRight: 5 }}>BN</span>}
                        {s.name}
                      </td>
                      <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: isBN ? '#FF6B6B' : 'var(--text2)' }}>{ct ? `${ct}s` : '—'}</td>
                      <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: 'var(--text2)' }}>{wt ? `${wt}s` : '—'}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: s.va_type === 'va' ? 'rgba(29,209,161,0.12)' : s.va_type === 'nva' ? 'rgba(255,107,107,0.12)' : 'rgba(212,162,8,0.12)', color: s.va_type === 'va' ? '#1DD1A1' : s.va_type === 'nva' ? '#FF6B6B' : '#D4A208' }}>
                          {(s.va_type || 'VA').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '7px 10px', color: wastes > 0 ? '#D4A208' : 'var(--text3)' }}>{wastes > 0 ? `${wastes} waste${wastes > 1 ? 's' : ''}` : '—'}</td>
                      <td style={{ padding: '7px 10px', color: openK > 0 ? '#D4A208' : 'var(--text3)' }}>{openK > 0 ? `${openK} open` : '—'}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{ fontSize: 10, color: isBN ? '#FF6B6B' : ct === 0 ? 'var(--text3)' : '#1DD1A1' }}>
                          {isBN ? '⚠ Over Takt' : ct === 0 ? 'No data' : '✓ OK'}
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

      {/* PDCA Tool — opens as proper modal with real close handler */}
      <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          onClick={() => setShowPDCA(true)}
          style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}
        >
          🔄 Open PDCA / A3 Report Tool
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
            🗑 Delete Project
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
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            Process Branches
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>Parallel lanes — sub-assemblies, prep flows, quality loops</p>
        </div>

        <button
          onClick={onNewBranch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'linear-gradient(135deg,#C49510,#D4A208)',
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
              <div key={branch.id} style={{ background: 'var(--bg2)', border: `1px solid ${branch.color}33`, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'var(--bg3)', borderBottom: `1px solid ${branch.color}22`, flexWrap: 'wrap' }}>
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
                    <div key={s.id} style={{ background: 'var(--bg2)', border: `1px solid ${branch.color}22`, borderRadius: 6, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--sl-400)', fontFamily: 'monospace', fontSize: 10, minWidth: 16 }}>{si + 1}.</span>
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