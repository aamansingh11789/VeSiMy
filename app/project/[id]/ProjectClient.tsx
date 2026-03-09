// @ts-nocheck
'use client'
// ── app/project/[id]/ProjectClient.tsx — CLEAN REWRITE ───────────────────────

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
import { StepModal }          from '@/components/tools/StepModal'
import { BranchModal }        from '@/components/tools/BranchModal'
import { ToolModal }          from '@/components/tools/ToolModal'
import { KanbanBoard }        from '@/components/tools/KanbanBoard'
import { VSMMap }             from '@/components/vsm/VSMMap'
import { SupePanel }          from '@/components/supe/SupePanel'
import { ProcessHealthScore } from '@/components/health/ProcessHealthScore'
import { ProcessSimulation }  from '@/components/simulation/ProcessSimulation'
import { LiveFloorPanel }     from '@/components/live/LiveFloorPanel'
import { SOPUpload }          from '@/components/tools/SOPUpload'
import { PDFExportButton }    from '@/components/export/PDFExport'
import {
  StopwatchIcon, FishboneIcon, FiveWhyIcon, WasteIcon, KaizenIcon, ImprovementIcon,
  PlusIcon, EditIcon, TrashIcon, SOPIcon, SettingsIcon, ZapIcon,
  DragHandleIcon, ReportIcon, BranchIcon, KanbanIcon, SimulationIcon,
  LiveFloorIcon, VSMIcon, CheckIcon,
} from '@/components/ui/Icons'

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS: { id: ProjectTab; label: string; Icon: any; premium?: boolean }[] = [
  { id: 'builder',    label: 'Builder',     Icon: PlusIcon,        premium: false },
  { id: 'vsm',        label: 'VSM Map',     Icon: VSMIcon,         premium: false },
  { id: 'kaizen',     label: 'Kaizen',      Icon: KaizenIcon,      premium: false },
  { id: 'kanban',     label: 'Kanban',      Icon: KanbanIcon,      premium: false },
  { id: 'simulation', label: 'Simulation',  Icon: SimulationIcon,  premium: true  },
  { id: 'live',       label: 'Live Floor',  Icon: LiveFloorIcon,   premium: true  },
  { id: 'report',     label: 'Report',      Icon: ReportIcon,      premium: false },
  { id: 'branches',   label: 'Branches',    Icon: BranchIcon,      premium: false },
]

// ── CI Tool definitions ───────────────────────────────────────────────────────
const CI_TOOLS = [
  { id: 'stopwatch',   Icon: StopwatchIcon,   label: 'Time Study' },
  { id: 'ishikawa',    Icon: FishboneIcon,    label: 'Fishbone'   },
  { id: 'fivewhy',     Icon: FiveWhyIcon,     label: '5 Why'      },
  { id: 'waste',       Icon: WasteIcon,       label: 'Waste ID'   },
  { id: 'kaizen',      Icon: KaizenIcon,      label: 'Kaizen'     },
  { id: 'improvement', Icon: ImprovementIcon, label: 'Improve'    },
]

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60)   return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(2)}h`
}

interface Props {
  initialProject: Project & { steps: Step[] }
  profile: Profile
}

export function ProjectClient({ initialProject, profile }: Props) {
  const router = useRouter()
  const {
    showToast, setActiveTool, activeTool,
    setShowStepModal, showStepModal,
    setEditingStep, editingStep,
  } = useStore()

  const [project,         setProject]         = useState(initialProject)
  const [steps,           setSteps]           = useState<Step[]>(initialProject.steps || [])
  const [branches,        setBranches]        = useState<Branch[]>([])
  const [kanbanColumns,   setKanbanColumns]   = useState<KanbanColumn[]>([])
  const [kanbanLoaded,    setKanbanLoaded]    = useState(false)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [editingBranch,   setEditingBranch]   = useState<Branch | null>(null)
  const [activeBranchId,  setActiveBranchId]  = useState<string | null>(null)
  const [tab,             setTab]             = useState<ProjectTab>('builder')
  const [saving,          setSaving]          = useState(false)
  const [showSOPUpload,   setShowSOPUpload]   = useState(false)
  const [dragIdx,         setDragIdx]         = useState<number | null>(null)
  const [showProjectEdit, setShowProjectEdit] = useState(false)
  const [showSupe,        setShowSupe]        = useState(false)
  const [supeOpen,        setSupeOpen]        = useState(true)  // desktop collapse

  // ── Plan / paywall ────────────────────────────────────────────────────────
  const isPaid = (profile as any).plan_tier === 'pro'
    || (profile as any).plan_tier === 'enterprise'
    || (profile as any).lifetime_access
    || (profile as any).is_beta

  // ── Lazy-load side data ───────────────────────────────────────────────────
  useEffect(() => {
    fetchBranches(project.id).then(setBranches).catch(() => {})
  }, [project.id])

  useEffect(() => {
    if (tab === 'kanban' && !kanbanLoaded) {
      fetchKanbanBoard(project.id)
        .then(cols => { setKanbanColumns(cols); setKanbanLoaded(true) })
        .catch(() => setKanbanLoaded(true))
    }
  }, [tab, project.id, kanbanLoaded])

  // ── Project save ──────────────────────────────────────────────────────────
  const saveProject = useCallback(async (updates: Partial<Project>) => {
    setSaving(true)
    try {
      await updateProject(project.id, updates)
      setProject(p => ({ ...p, ...updates }))
    } catch { showToast('Save failed', 'error') }
    finally  { setSaving(false) }
  }, [project.id, showToast])

  // ── Step CRUD — throws on error so StepModal can catch and stay open ──────
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
    } catch { showToast('Failed to delete step', 'error') }
  }

  const handleSaveToolData = async (stepId: string, tool: string, data: Record<string, any>) => {
    try {
      await saveToolData(stepId, tool, data)
      setSteps(ss => ss.map(s =>
        s.id === stepId ? { ...s, toolData: { ...(s.toolData || {}), [tool]: data } } : s
      ))
    } catch { showToast('Failed to save tool data', 'error') }
  }

  // ── Branch CRUD ───────────────────────────────────────────────────────────
  const handleCreateBranch = async (form: Partial<Branch>) => {
    try {
      const nb = await createBranch(project.id, form as any)
      setBranches(bs => [...bs, nb])
      showToast('Branch created!', 'success')
      setShowBranchModal(false)
    } catch { showToast('Failed to create branch', 'error') }
  }

  const handleUpdateBranch = async (id: string, form: Partial<Branch>) => {
    try {
      await updateBranch(id, form)
      setBranches(bs => bs.map(b => b.id === id ? { ...b, ...form } : b))
      showToast('Branch saved', 'success')
      setShowBranchModal(false); setEditingBranch(null)
    } catch { showToast('Failed to save branch', 'error') }
  }

  const handleDeleteBranch = async (branch: Branch) => {
    if (!confirm(`Delete branch "${branch.label}" and all steps?`)) return
    try {
      await deleteBranch(branch.id, branch.branch_id)
      setBranches(bs => bs.filter(b => b.id !== branch.id))
      setSteps(ss => ss.filter(s => s.branch_id !== branch.branch_id))
      showToast('Branch deleted', 'info')
    } catch { showToast('Failed to delete branch', 'error') }
  }

  const handleAddBranchStep = async (branchId: string, form: Partial<Step>) => {
    const branch = branches.find(b => b.branch_id === branchId)
    if (!branch) return
    try {
      const ns = await createBranchStep(project.id, branchId, branch.label, branch.parent_step_id || '', form)
      setSteps(ss => [...ss, ns as Step])
      showToast('Step added!', 'success')
    } catch { showToast('Failed to add branch step', 'error') }
  }

  // ── Drag reorder ──────────────────────────────────────────────────────────
  const handleDrop = async (toIdx: number) => {
    if (dragIdx === null || dragIdx === toIdx) return
    const reordered = [...steps.filter(s => s.is_main_flow !== false)]
    const [moved]   = reordered.splice(dragIdx, 1)
    reordered.splice(toIdx, 0, moved)
    const branchSteps = steps.filter(s => s.is_main_flow === false)
    setSteps([...reordered, ...branchSteps])
    setDragIdx(null)
    try { await reorderSteps(project.id, reordered.map(s => s.id)) }
    catch { showToast('Reorder failed', 'error') }
  }

  // ── SOP import ────────────────────────────────────────────────────────────
  const handleSOPSteps = async (sopSteps: any[]) => {
    let added = 0
    let firstError = ''
    for (const s of sopSteps) {
      try {
        const created = await createStep(project.id, {
          name:                s.name,
          department:          s.department,
          operators:           s.operators,
          cycle_time:          s.cycle_time,
          wait_time:           s.wait_time,
          setup_time:          s.setup_time,
          defect_rate:         s.defect_rate,
          uptime:              s.uptime,
          completion_accuracy: s.completion_accuracy,
          wip:                 s.wip,
          notes:               s.notes,
          is_main_flow:        true,
        } as any)
        if (created) {
          setSteps(ss => [...ss, created])
          added++
        }
      } catch (err: any) {
        const msg = err?.message || String(err)
        console.error('[SOP import]', s.name, msg)
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

  // ── Summary metrics ───────────────────────────────────────────────────────
  const mainSteps = steps.filter(s => s.is_main_flow !== false)
  const totalCT   = mainSteps.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0)
  const totalWait = mainSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const totalWIP  = steps.reduce((a, s) => a + (Number(s.wip) || 0), 0)
  const openKZ    = steps.reduce((a, s) =>
    a + (s.toolData?.kaizen?.items?.filter((i: any) => i.status !== 'complete').length || 0), 0)
  const availSec  = project.available_time_sec
    ? Number(project.available_time_sec)
    : project.working_hours ? Number(project.working_hours) * 3600 : 0
  const takt      = project.takt_time
    ? Number(project.takt_time)
    : (project.demand && availSec ? availSec / Number(project.demand) : 0)
  const pce       = totalCT + totalWait > 0
    ? `${Math.min(100, (totalCT / (totalCT + totalWait)) * 100).toFixed(0)}%` : '—'

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)' }}>

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div style={{
        padding:'10px 20px',
        background:'var(--bg2)',
        borderBottom:'1px solid rgba(212,162,8,0.12)',
        display:'flex', alignItems:'center', gap:10, flexShrink:0, flexWrap:'wrap',
      }}>
        <button onClick={() => router.push('/dashboard')}
          style={{ color:'var(--text2)', fontSize:12, cursor:'pointer', background:'none', border:'none', padding:'4px 8px', display:'flex', alignItems:'center', gap:4 }}>
          ← Dashboard
        </button>
        <span style={{ color:'var(--border2)' }}>|</span>

        {/* Project name */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Palatino Linotype,Georgia,serif', fontSize:17, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {project.name}
          </div>
          {project.product && <div style={{ fontSize:10, color:'var(--text2)', fontFamily:'monospace', letterSpacing:1 }}>{project.product}</div>}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0, flexWrap:'wrap' }}>
          {saving && <span style={{ fontSize:11, color:'var(--text2)' }}>saving…</span>}
          <ProcessHealthScore steps={steps} compact />

          {/* SOP Import — prominent gold button */}
          <button
            onClick={() => setShowSOPUpload(true)}
            style={{
              display:'flex', alignItems:'center', gap:5,
              padding:'6px 12px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer',
              background:'rgba(212,162,8,0.08)', border:'1px solid rgba(212,162,8,0.25)', color:'#D4A208',
              transition:'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(212,162,8,0.16)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(212,162,8,0.08)' }}
          >
            <SOPIcon size={13} color="#D4A208" /> <span className="action-btn-label">Import SOP</span>
          </button>

          <PDFExportButton project={project} steps={steps} isGold={(profile as any).beta_tier === 'gold_standard' || (profile as any).lifetime_access} />

          <button onClick={() => setShowProjectEdit(true)}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', borderRadius:7, fontSize:12, cursor:'pointer', background:'none', border:'1px solid var(--border2)', color:'var(--text2)' }}>
            <SettingsIcon size={13} color="currentColor" />
          </button>

          {/* Add Step — always visible primary CTA */}
          <button
            onClick={() => { setEditingStep(null); setShowStepModal(true) }}
            style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer',
              background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', border:'none',
              boxShadow:'0 2px 12px rgba(212,162,8,0.25)',
            }}>
            <PlusIcon size={14} color="#03030D" /> <span className="action-btn-label">Add Step</span>
          </button>
        </div>
      </div>

      {/* ── Metric Bar ───────────────────────────────────────────────────── */}
      <div style={{ display:'flex', background:'var(--bg)', borderBottom:'1px solid var(--border)', flexShrink:0, overflowX:'auto' }}>
        {([
          { label:'STEPS',    value: mainSteps.length        },
          { label:'BRANCHES', value: branches.length          },
          { label:'TOTAL CT', value: fmtS(totalCT)           },
          { label:'WAIT',     value: fmtS(totalWait)         },
          { label:'TAKT',     value: takt ? fmtS(takt) : '—'},
          { label:'PCE',      value: pce                      },
          { label:'WIP',      value: totalWIP || '—'         },
          { label:'OPEN KZ',  value: openKZ  || '—'         },
        ] as { label:string; value:string|number }[]).map(m => (
          <div key={m.label} style={{ padding:'8px 14px', borderRight:'1px solid #1A1A40', minWidth:68, textAlign:'center', flexShrink:0 }}>
            <div style={{ fontSize:8, color:'#38385C', letterSpacing:1.5, fontFamily:'monospace' }}>{m.label}</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#D4A208', marginTop:2 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div style={{ display:'flex', padding:'0 20px', background:'var(--bg2)', borderBottom:'1px solid var(--border)', flexShrink:0, overflowX:'auto' }}>
        {TABS.map(t => {
          const active  = tab === t.id
          const locked  = t.premium && !isPaid
          const TIcon   = t.Icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display:'flex', alignItems:'center', gap:5,
              padding:'9px 14px', fontSize:11, fontWeight:active ? 600 : 400,
              background:'none', border:'none', cursor:'pointer', whiteSpace:'nowrap',
              color:        active ? '#D4A208' : locked ? '#4A4A6A' : '#7070A0',
              borderBottom: `2px solid ${active ? '#D4A208' : 'transparent'}`,
              marginBottom:-1, transition:'all 0.15s',
            }}>
              <TIcon size={11} color="currentColor" />
              {t.label}
              {locked && <span style={{ fontSize:9, marginLeft:2 }}>🔒</span>}
            </button>
          )
        })}
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', minHeight:0 }}>

        {/* Content area */}
        <div style={{ flex:1, overflow:'auto', minWidth:0 }}>

        {/* BUILDER TAB — step list */}
        {tab === 'builder' && (
          <div style={{ padding:20 }}>
            <BuilderTab
              steps={steps}
              dragIdx={dragIdx}
              onAddStep={() => { setEditingStep(null); setShowStepModal(true) }}
              onEdit={s => { setEditingStep(s); setShowStepModal(true) }}
              onDelete={handleDeleteStep}
              onTool={(tool, stepId) => setActiveTool({ tool, stepId })}
              onDragStart={setDragIdx}
              onDrop={handleDrop}
              onImportSOP={() => setShowSOPUpload(true)}
            />
          </div>
        )}

        {tab === 'vsm'      && <div style={{ padding:24 }}><VSMMap steps={steps} branches={branches} project={project} /></div>}
        {tab === 'kaizen'   && <div style={{ padding:24 }}><KaizenBoardView steps={steps} /></div>}
        {tab === 'kanban'   && (
          <KanbanBoard
            projectId={project.id}
            steps={steps}
            columns={kanbanColumns}
            onColumnsChange={setKanbanColumns}
            showToast={showToast}
          />
        )}
        {tab === 'report'   && <div style={{ padding:24 }}><ReportTab steps={steps} branches={branches} project={project} /></div>}
        {tab === 'branches' && (
          <div style={{ padding:24 }}>
            <BranchesTab
              steps={steps}
              branches={branches}
              onNewBranch={() => { setEditingBranch(null); setShowBranchModal(true) }}
              onEditBranch={b => { setEditingBranch(b); setShowBranchModal(true) }}
              onDeleteBranch={handleDeleteBranch}
              onAddStep={branchId => setActiveBranchId(branchId)}
              onEditStep={s => { setEditingStep(s); setShowStepModal(true) }}
              onDeleteStep={handleDeleteStep}
              onTool={(stepId, tool) => setActiveTool({ tool, stepId })}
            />
          </div>
        )}

        {/* ── Premium tabs ── */}
        {tab === 'simulation' && (
          isPaid
            ? <div style={{ padding:24 }}><ProcessSimulation steps={steps} projectId={project.id} /></div>
            : <PaywallGate feature="Process Simulation" />
        )}
        {tab === 'live' && (
          isPaid
            ? <div style={{ padding:24 }}><LiveFloorPanel steps={steps} projectId={project.id} /></div>
            : <PaywallGate feature="Live Floor Monitor" />
        )}

        </div>{/* end content area */}

        {/* ── Supe AI — desktop: collapsible right panel ─────────────────── */}
        <div className="supe-desktop-panel" style={{
          width: supeOpen ? 290 : 40, flexShrink: 0,
          borderLeft: '1px solid rgba(100,38,160,0.2)',
          overflowY: supeOpen ? 'auto' : 'hidden',
          background: 'rgba(8,4,20,0.95)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.25s ease',
          position: 'relative',
        }}>
          {/* Collapse toggle */}
          <button
            onClick={() => setSupeOpen(o => !o)}
            title={supeOpen ? 'Collapse Supe' : 'Open Supe AI'}
            style={{
              position: 'absolute', top: 12, left: supeOpen ? 8 : 4, zIndex: 10,
              width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(100,38,160,0.35)',
              background: 'rgba(100,38,160,0.12)', color: '#9B5FE0', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              flexShrink: 0,
            }}>
            {supeOpen ? '›' : '‹'}
          </button>

          {supeOpen && (<>
          <div style={{
            padding: '14px 16px 10px 42px',
            borderBottom: '1px solid rgba(100,38,160,0.15)',
            background: 'linear-gradient(180deg,rgba(100,38,160,0.06),transparent)',
            flexShrink: 0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,rgba(100,38,160,0.3),rgba(60,22,120,0.5))', border:'1px solid rgba(100,38,160,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <ZapIcon size={14} color="#9B5FE0" />
              </div>
              <div>
                <div style={{ fontWeight:700, color:'var(--text)', fontSize:13, fontFamily:'Palatino Linotype,serif', lineHeight:1 }}>Supe</div>
                <div style={{ fontSize:9, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1.5, marginTop:2 }}>AI MENTOR {!isPaid && '🔒'}</div>
              </div>
            </div>
            {isPaid && <p style={{ fontSize:11, color:'var(--text3)', margin:'8px 0 0', lineHeight:1.5 }}>
              Real-time lean CI analysis. Ask for AI insights after adding steps.
            </p>}
          </div>
          <div style={{ flex:1, overflow:'auto' }}>
            {isPaid
              ? <SupePanel steps={steps} projectId={project.id} />
              : (
                <div style={{ padding:20, textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>🔒</div>
                  <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:14 }}>
                    Supe AI is a <strong style={{ color:'#D4A208' }}>Pro feature</strong>.
                  </p>
                  <a href="/pricing" style={{ display:'inline-block', padding:'8px 16px', borderRadius:8, background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', fontWeight:700, fontSize:12, textDecoration:'none' }}>
                    Upgrade →
                  </a>
                </div>
              )
            }
          </div>
          </>)}
        </div>

      </div>{/* end flex content+supe row */}

      {/* ── Supe AI — mobile: slide-up overlay sheet ─────────────────────── */}
      {showSupe && (
        <div
          className="supe-mobile-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowSupe(false) }}
          style={{
            position:'fixed', inset:0, zIndex:500,
            background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)',
          }}
        >
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            height:'78vh',
            background:'#0A0518',
            borderRadius:'18px 18px 0 0',
            border:'1px solid rgba(100,38,160,0.3)',
            display:'flex', flexDirection:'column',
            boxShadow:'0 -8px 40px rgba(100,38,160,0.2)',
          }}>
            {/* Sheet handle + header */}
            <div style={{ padding:'10px 16px 8px', borderBottom:'1px solid rgba(100,38,160,0.15)', flexShrink:0 }}>
              <div style={{ width:36, height:4, borderRadius:2, background:'rgba(100,38,160,0.3)', margin:'0 auto 10px' }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:'linear-gradient(135deg,rgba(100,38,160,0.3),rgba(60,22,120,0.5))', border:'1px solid rgba(100,38,160,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <ZapIcon size={13} color="#9B5FE0" />
                  </div>
                  <div>
                    <span style={{ fontWeight:700, color:'var(--text)', fontSize:14, fontFamily:'Palatino Linotype,serif' }}>Supe</span>
                    <span style={{ fontSize:9, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1.5, marginLeft:6 }}>AI MENTOR</span>
                  </div>
                </div>
                <button onClick={() => setShowSupe(false)} style={{ background:'none', border:'none', color:'var(--text2)', fontSize:20, cursor:'pointer', padding:'4px 8px', lineHeight:1 }}>×</button>
              </div>
            </div>
            {/* Supe panel content */}
            <div style={{ flex:1, overflow:'auto' }}>
              {isPaid
                ? <SupePanel steps={steps} projectId={project.id} />
                : (
                  <div style={{ padding:32, textAlign:'center' }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
                    <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.7, marginBottom:20 }}>
                      Supe AI is a <strong style={{ color:'#D4A208' }}>Pro feature</strong>.<br/>Upgrade to unlock AI-powered lean coaching.
                    </p>
                    <a href="/pricing" style={{ display:'inline-block', padding:'10px 20px', borderRadius:10, background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', fontWeight:700, fontSize:14, textDecoration:'none' }}>
                      👑 Upgrade to Pro
                    </a>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile FABs — floating action buttons ────────────────────────── */}
      <div className="mobile-fabs" style={{ display:'none', position:'fixed', bottom:'80px', right:'16px', zIndex:300, flexDirection:'column', gap:10, alignItems:'flex-end' }}>
        {/* Add Step FAB */}
        <button
          onClick={() => { setEditingStep(null); setShowStepModal(true) }}
          style={{
            width:52, height:52, borderRadius:'50%', border:'none', cursor:'pointer',
            background:'linear-gradient(135deg,#C49510,#D4A208)',
            boxShadow:'0 4px 20px rgba(212,162,8,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
          title="Add Step"
        >
          <PlusIcon size={22} color="#03030D" />
        </button>
        {/* Supe FAB */}
        <button
          onClick={() => setShowSupe(s => !s)}
          style={{
            width:52, height:52, borderRadius:'50%', border:'none', cursor:'pointer',
            background: showSupe ? 'rgba(100,38,160,0.9)' : 'rgba(100,38,160,0.15)',
            border: '1px solid rgba(100,38,160,0.5)',
            boxShadow:'0 4px 20px rgba(100,38,160,0.3)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:20,
          }}
          title="Open Supe AI"
        >
          ⚡
        </button>
      </div>

      {/* ── MODALS ───────────────────────────────────────────────────────── */}

      {/* Step Add/Edit Modal */}
      {showStepModal && (
        <StepModal
          step={editingStep}
          onSave={async form => {
            if (editingStep) {
              await handleUpdateStep(editingStep.id, form)
            } else {
              await handleAddStep(form)
            }
            // Only reaches here if no error thrown — close modal
            setShowStepModal(false)
            setEditingStep(null)
          }}
          onClose={() => { setShowStepModal(false); setEditingStep(null) }}
        />
      )}

      {/* SOP Import Modal */}
      {showSOPUpload && (
        <SOPUpload
          projectId={project.id}
          onStepsGenerated={handleSOPSteps}
          onClose={() => setShowSOPUpload(false)}
        />
      )}

      {/* CI Tool Modals */}
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

      {/* Branch Modal */}
      {showBranchModal && (
        <BranchModal
          mainSteps={steps.filter(s => s.is_main_flow !== false)}
          branch={editingBranch}
          onSave={async form => {
            if (editingBranch) await handleUpdateBranch(editingBranch.id, form)
            else               await handleCreateBranch(form)
          }}
          onClose={() => { setShowBranchModal(false); setEditingBranch(null) }}
        />
      )}

      {/* Branch Step Modal */}
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

      {/* Project Settings Modal */}
      {showProjectEdit && (
        <ProjectSettingsModal
          project={project}
          onSave={async form => { await saveProject(form); setShowProjectEdit(false) }}
          onClose={() => setShowProjectEdit(false)}
          onDelete={async () => {
            if (!confirm('Delete this project and all data? Cannot be undone.')) return
            await fetch(`/api/projects/${project.id}`, { method:'DELETE' })
            router.push('/dashboard')
          }}
        />
      )}
    </div>
  )
}

// ── Builder Tab Component ─────────────────────────────────────────────────────
interface BuilderTabProps {
  steps:       Step[]
  dragIdx:     number | null
  onAddStep:   () => void
  onEdit:      (s: Step) => void
  onDelete:    (id: string) => void
  onTool:      (tool: string, stepId: string) => void
  onDragStart: (idx: number) => void
  onDrop:      (idx: number) => void
  onImportSOP: () => void
}

// ── Paywall Gate ──────────────────────────────────────────────────────────────
function PaywallGate({ feature }: { feature: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 24px', textAlign:'center' }}>
      <div style={{ fontSize:52, marginBottom:16 }}>🔒</div>
      <h2 style={{ fontFamily:'Palatino Linotype,serif', fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:8 }}>
        {feature}
      </h2>
      <p style={{ fontSize:14, color:'var(--text2)', maxWidth:360, lineHeight:1.7, marginBottom:28 }}>
        This is a <strong style={{ color:'#D4A208' }}>Pro feature</strong>. Upgrade to unlock {feature}, Supe AI, and all advanced CI tools.
      </p>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <a href="/pricing" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:10, background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', fontWeight:700, fontSize:14, textDecoration:'none' }}>
          👑 Upgrade to Pro — $29/mo
        </a>
        <a href="/pricing" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:10, border:'1px solid rgba(212,162,8,0.3)', color:'#D4A208', fontSize:14, textDecoration:'none' }}>
          View all plans
        </a>
      </div>
      <div style={{ marginTop:32, padding:'16px 24px', borderRadius:10, background:'var(--bg2)', border:'1px solid var(--border)', maxWidth:400 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', marginBottom:10 }}>What's included in Pro:</div>
        {['Unlimited projects','Supe AI lean mentor','Process Simulation','Live Floor Monitor','PDF export','Priority support'].map(f => (
          <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text2)', marginBottom:6 }}>
            <span style={{ color:'#1DD1A1', fontSize:14 }}>✓</span> {f}
          </div>
        ))}
      </div>
    </div>
  )
}

function BuilderTab({ steps, dragIdx, onAddStep, onEdit, onDelete, onTool, onDragStart, onDrop, onImportSOP }: BuilderTabProps) {
  const mainSteps = steps.filter(s => s.is_main_flow !== false).sort((a, b) => a.position - b.position)

  if (mainSteps.length === 0) return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'#38385C' }}>
      <div style={{ marginBottom:20, opacity:0.3 }}>
        <VSMIcon size={64} color="#D4A208" />
      </div>
      <div style={{ fontSize:18, color:'#7070A0', marginBottom:8, fontFamily:'Palatino Linotype,serif', fontWeight:700 }}>
        No process steps yet
      </div>
      <div style={{ fontSize:13, color:'#38385C', marginBottom:28, lineHeight:1.6 }}>
        Add steps manually or import from a Standard Operating Procedure
      </div>
      <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
        <button onClick={onAddStep} style={{
          display:'flex', alignItems:'center', gap:8, padding:'10px 24px', borderRadius:9,
          background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D',
          border:'none', cursor:'pointer', fontSize:13, fontWeight:700,
        }}>
          <PlusIcon size={14} color="#03030D" /> Add First Step
        </button>
        <button onClick={onImportSOP} style={{
          display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:9,
          background:'rgba(212,162,8,0.08)', border:'1px solid rgba(212,162,8,0.3)', color:'#D4A208',
          cursor:'pointer', fontSize:13, fontWeight:600,
        }}>
          <SOPIcon size={14} color="#D4A208" /> Import from SOP
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
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
      {/* Bottom add button */}
      <button onClick={onAddStep} style={{
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        padding:'12px', borderRadius:9, marginTop:4,
        border:'1px dashed rgba(40,40,92,0.6)', background:'transparent', color:'#38385C',
        cursor:'pointer', fontSize:13, transition:'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,162,8,0.3)'; e.currentTarget.style.color='#D4A208' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(40,40,92,0.6)'; e.currentTarget.style.color='#38385C' }}
      >
        <PlusIcon size={13} color="currentColor" /> Add Another Step
      </button>
    </div>
  )
}

// ── Step Card ─────────────────────────────────────────────────────────────────
interface StepCardProps {
  step:        Step
  index:       number
  onEdit:      () => void
  onDelete:    () => void
  onTool:      (t: string) => void
  onDragStart: () => void
  onDrop:      () => void
}

function StepCard({ step, index, onEdit, onDelete, onTool, onDragStart, onDrop }: StepCardProps) {
  const [over, setOver] = useState(false)
  const sw     = step.toolData?.stopwatch
  const wastes = step.toolData?.waste?.selected?.length || 0
  const kzOpen = (step.toolData?.kaizen?.items || []).filter((i: any) => i.status !== 'complete').length
  const isSM   = step.flow_type === 'supermarket'

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={() => { setOver(false); onDrop() }}
      style={{
        background: over ? 'rgba(212,162,8,0.03)' : 'var(--bg2)',
        border: `1px solid ${over ? 'rgba(212,162,8,0.4)' : 'var(--border)'}`,
        borderRadius: 10, overflow:'hidden', transition:'all 0.15s',
      }}
    >
      {/* Header row */}
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'11px 14px', background:'var(--bg3)', borderBottom:'1px solid #1A1A40',
      }}>
        <span style={{ cursor:'grab', flexShrink:0, color:'#28285C' }}>
          <DragHandleIcon size={14} color="currentColor" />
        </span>
        <span style={{ color:'#38385C', fontSize:10, fontFamily:'monospace', minWidth:22, flexShrink:0 }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:600, color:'var(--text)', fontSize:13, display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
            {step.name}
            {isSM && (
              <span style={{ fontSize:8, padding:'2px 5px', borderRadius:3, background:'rgba(100,38,160,0.15)', color:'#8C44CC', border:'1px solid rgba(100,38,160,0.3)', fontWeight:700, letterSpacing:1 }}>SM</span>
            )}
          </div>
          {step.department && <div style={{ fontSize:10, color:'#7070A0', marginTop:1 }}>{step.department}</div>}
        </div>
        {/* Metrics inline */}
        <div style={{ display:'flex', gap:8, fontSize:10, color:'#7070A0', flexWrap:'wrap', flexShrink:0 }}>
          {sw?.mean && <span style={{ color:'#D4A208' }}>CT:{fmtS(sw.mean)}</span>}
          {step.uptime && <span>↑{step.uptime}%</span>}
          {wastes > 0 && <span style={{ color:'#FF6B6B' }}>{wastes}W</span>}
          {kzOpen > 0 && <span style={{ color:'#F4A623' }}>⚡{kzOpen}</span>}
        </div>
        <button onClick={onEdit}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#7070A0', padding:'3px 5px', borderRadius:4, display:'flex' }}
          onMouseEnter={e => e.currentTarget.style.color='#D4A208'}
          onMouseLeave={e => e.currentTarget.style.color='#7070A0'}>
          <EditIcon size={13} color="currentColor" />
        </button>
        <button onClick={onDelete}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#7070A0', padding:'3px 5px', borderRadius:4, display:'flex' }}
          onMouseEnter={e => e.currentTarget.style.color='#FF6B6B'}
          onMouseLeave={e => e.currentTarget.style.color='#7070A0'}>
          <TrashIcon size={13} color="currentColor" />
        </button>
      </div>

      {/* Tool buttons */}
      <div style={{ display:'flex', gap:5, padding:'9px 14px', flexWrap:'wrap' }}>
        {CI_TOOLS.map(t => {
          const has  = !!step.toolData?.[t.id] && Object.keys(step.toolData[t.id]).length > 0
          const TIcon = t.Icon
          return (
            <button key={t.id} onClick={() => onTool(t.id)} style={{
              display:'flex', alignItems:'center', gap:4,
              padding:'4px 10px', fontSize:11, borderRadius:5, cursor:'pointer',
              background: has ? 'rgba(212,162,8,0.10)' : 'transparent',
              border: `1px solid ${has ? 'rgba(212,162,8,0.25)' : 'var(--border)'}`,
              color: has ? '#D4A208' : '#38385C',
              transition:'all 0.15s',
            }}
              onMouseEnter={e => { if (!has) { e.currentTarget.style.borderColor='rgba(212,162,8,0.2)'; e.currentTarget.style.color='#7070A0' }}}
              onMouseLeave={e => { if (!has) { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='#38385C' }}}
            >
              <TIcon size={11} color="currentColor" />
              {t.label}
              {has && <span style={{ width:5, height:5, borderRadius:'50%', background:'#D4A208', display:'inline-block', marginLeft:1 }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Kaizen Board View ─────────────────────────────────────────────────────────
function KaizenBoardView({ steps }: { steps: Step[] }) {
  const allItems = steps.flatMap(s =>
    (s.toolData?.kaizen?.items || []).map((i: any) => ({ ...i, stepName: s.name }))
  )
  const statuses = ['open', 'in-progress', 'complete'] as const
  const sLabel   = { open:'Open', 'in-progress':'In Progress', complete:'Complete' }
  const sColor   = { open:'#FF6B6B', 'in-progress':'#F4A623', complete:'#1DD1A1' }

  return (
    <div>
      <h2 style={{ fontFamily:'Palatino Linotype,serif', fontSize:20, fontWeight:700, marginBottom:20, color:'var(--text)' }}>Kaizen Board</h2>
      {allItems.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--text3)' }}>
          <KaizenIcon size={40} color="var(--text3)" style={{ margin:'0 auto 12px', display:'block' }} />
          <div style={{ color:'var(--text2)' }}>No kaizen events yet — open the Kaizen tool on any step.</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
          {statuses.map(st => (
            <div key={st}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:sColor[st], marginBottom:10, padding:'6px 0', borderBottom:`2px solid ${sColor[st]}33` }}>
                {sLabel[st]} ({allItems.filter(i => i.status === st).length})
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {allItems.filter(i => i.status === st).map((item: any, ki: number) => (
                  <div key={ki} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px' }}>
                    <div style={{ fontWeight:600, fontSize:13, color:'var(--text)', marginBottom:4 }}>{item.title}</div>
                    <div style={{ fontSize:11, color:'var(--text2)' }}>📍 {item.stepName}</div>
                    {item.owner && <div style={{ fontSize:11, color:'var(--text2)', marginTop:3 }}>👤 {item.owner}</div>}
                    {item.dueDate && <div style={{ fontSize:10, color:'var(--text3)', marginTop:3 }}>📅 {item.dueDate}</div>}
                    {item.priority && (
                      <span style={{ display:'inline-block', marginTop:6, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100,
                        background: item.priority==='critical'?'rgba(255,107,107,0.1)':item.priority==='high'?'rgba(244,166,35,0.1)':'rgba(16,144,212,0.1)',
                        color: item.priority==='critical'?'#FF6B6B':item.priority==='high'?'#F4A623':'#1090D4',
                      }}>{item.priority}</span>
                    )}
                  </div>
                ))}
                {allItems.filter(i => i.status === st).length === 0 && (
                  <div style={{ color:'var(--text3)', fontSize:12, padding:'12px 0', textAlign:'center' }}>None</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Report Tab ────────────────────────────────────────────────────────────────
function ReportTab({ steps, branches, project }: { steps:Step[]; branches:Branch[]; project:Project }) {
  const main       = steps.filter(s => s.is_main_flow !== false).sort((a,b) => a.position - b.position)
  const totalCT    = main.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0)
  const totalWait  = main.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const totalLT    = totalCT + totalWait
  const totalWIP   = steps.reduce((a, s) => a + (Number(s.wip) || 0), 0)
  const allKaizen  = steps.flatMap(s => (s.toolData?.kaizen?.items || []).map((i: any) => ({ ...i, stepName:s.name })))
  const allWastes  = steps.flatMap(s => (s.toolData?.waste?.selected || []).map((w: string) => ({ waste:w, stepName:s.name })))
  const allWhys    = steps.filter(s => s.toolData?.fivewhy?.rootCause)
  const allFish    = steps.filter(s => s.toolData?.ishikawa?.problem)
  const pce        = totalCT + totalWait > 0 ? ((totalCT / (totalCT + totalWait)) * 100).toFixed(1) : '—'
  const avgCT      = main.length ? (totalCT / main.length).toFixed(0) : '—'
  const taktTime   = project.takt_time ? Number(project.takt_time) : null
  const today      = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })

  const printReport = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><title>VSM Report — ${project.name}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; background: #fff; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; color: #000; }
  .subtitle { font-size: 13px; color: #666; margin-bottom: 32px; font-family: Arial, sans-serif; }
  h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #444; border-bottom: 2px solid #000; padding-bottom: 4px; margin: 28px 0 14px; font-family: Arial, sans-serif; }
  .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 8px; }
  .metric { border: 1px solid #ddd; border-radius: 6px; padding: 12px 14px; }
  .metric-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-family: Arial, sans-serif; margin-bottom: 3px; }
  .metric-value { font-size: 22px; font-weight: 700; color: #000; }
  .metric-value.gold { color: #B8860B; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif; }
  th { background: #f5f5f5; text-align: left; padding: 8px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #555; border-bottom: 2px solid #ddd; }
  td { padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-red { background: #FEE2E2; color: #B91C1C; }
  .badge-amber { background: #FEF3C7; color: #92400E; }
  .badge-green { background: #D1FAE5; color: #065F46; }
  .waste-tag { display: inline-block; background: #FEE2E2; color: #B91C1C; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin: 2px; font-family: Arial; }
  .rca-box { border: 1px solid #ddd; border-radius: 6px; padding: 12px 14px; margin-bottom: 10px; }
  .rca-title { font-weight: 700; color: #000; margin-bottom: 6px; font-size: 13px; }
  .rca-cause { background: #f9f9f9; padding: 8px 10px; border-radius: 4px; font-size: 12px; font-family: Arial; margin-bottom: 4px; }
  .rca-action { color: #065F46; font-size: 12px; font-family: Arial; margin-top: 4px; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 11px; color: #999; font-family: Arial; }
  @media print { body { padding: 20px; } }
</style></head><body>
<h1>${project.name}</h1>
<div class="subtitle">VSM Continuous Improvement Report &nbsp;·&nbsp; ${project.product || project.industry || ''} &nbsp;·&nbsp; Generated ${today} &nbsp;·&nbsp; vesimy.com</div>

<h2>Process KPIs</h2>
<div class="metric-grid">
  <div class="metric"><div class="metric-label">Process Steps</div><div class="metric-value gold">${main.length}</div></div>
  <div class="metric"><div class="metric-label">Total Cycle Time</div><div class="metric-value gold">${totalCT ? fmtS(totalCT) : '—'}</div></div>
  <div class="metric"><div class="metric-label">Total Wait Time</div><div class="metric-value">${totalWait ? fmtS(totalWait) : '—'}</div></div>
  <div class="metric"><div class="metric-label">Lead Time</div><div class="metric-value">${totalLT ? fmtS(totalLT) : '—'}</div></div>
  <div class="metric"><div class="metric-label">PCE (Flow %)</div><div class="metric-value gold">${pce}${pce !== '—' ? '%' : ''}</div></div>
  <div class="metric"><div class="metric-label">Avg Cycle Time</div><div class="metric-value">${avgCT !== '—' ? fmtS(Number(avgCT)) : '—'}</div></div>
  <div class="metric"><div class="metric-label">Total WIP</div><div class="metric-value">${totalWIP || '—'}</div></div>
  <div class="metric"><div class="metric-label">Takt Time</div><div class="metric-value">${taktTime ? fmtS(taktTime) : '—'}</div></div>
</div>
${taktTime ? `<p style="font-size:12px;font-family:Arial;color:#666;margin-top:8px">Takt Time = ${fmtS(taktTime)} &nbsp;·&nbsp; Steps above takt: ${main.filter(s=>(s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0)>taktTime).map(s=>s.name).join(', ')||'None ✓'}</p>` : ''}

<h2>Process Steps (${main.length})</h2>
<table>
  <tr><th>#</th><th>Step Name</th><th>Department</th><th>Cycle Time</th><th>Wait Time</th><th>Operators</th><th>Defect %</th><th>Uptime %</th><th>C&A %</th><th>Wastes</th></tr>
  ${main.map((s, i) => `
  <tr>
    <td>${i+1}</td>
    <td><strong>${s.name}</strong>${s.description ? `<br><span style="color:#888;font-size:11px">${s.description}</span>` : ''}</td>
    <td>${s.department || '—'}</td>
    <td>${s.toolData?.stopwatch?.mean ? fmtS(s.toolData.stopwatch.mean) : s.cycle_time ? fmtS(Number(s.cycle_time)) : '—'}</td>
    <td>${s.wait_time ? fmtS(Number(s.wait_time)) : '—'}</td>
    <td>${s.operators || 1}</td>
    <td>${s.defect_rate || '—'}</td>
    <td>${s.uptime || '100'}</td>
    <td>${s.completion_accuracy || '—'}</td>
    <td>${(s.toolData?.waste?.selected||[]).join(', ') || '—'}</td>
  </tr>`).join('')}
</table>

${allWastes.length > 0 ? `
<h2>Waste Identification (${allWastes.length} items)</h2>
<table>
  <tr><th>Waste Type</th><th>Step</th></tr>
  ${allWastes.map(w => `<tr><td><span class="waste-tag">${w.waste}</span></td><td>${w.stepName}</td></tr>`).join('')}
</table>` : ''}

${allKaizen.length > 0 ? `
<h2>Kaizen Events (${allKaizen.length})</h2>
<table>
  <tr><th>Title</th><th>Step</th><th>Type</th><th>Priority</th><th>Status</th><th>Owner</th><th>Due Date</th></tr>
  ${allKaizen.map((k: any) => `<tr>
    <td>${k.title || '—'}</td>
    <td>${k.stepName}</td>
    <td>${k.type || '—'}</td>
    <td><span class="badge ${k.priority==='high'?'badge-red':k.priority==='medium'?'badge-amber':'badge-green'}">${k.priority||'—'}</span></td>
    <td><span class="badge ${k.status==='complete'?'badge-green':'badge-amber'}">${k.status||'open'}</span></td>
    <td>${k.owner || '—'}</td>
    <td>${k.dueDate || '—'}</td>
  </tr>`).join('')}
</table>` : ''}

${allWhys.length > 0 ? `
<h2>Root Cause Analysis — 5 Whys (${allWhys.length})</h2>
${allWhys.map(s => `
<div class="rca-box">
  <div class="rca-title">${s.name}</div>
  ${(s.toolData.fivewhy.whys || []).map((w: string, i: number) => w ? `<div class="rca-cause"><strong>Why ${i+1}:</strong> ${w}</div>` : '').join('')}
  <div class="rca-cause"><strong>Root Cause:</strong> ${s.toolData.fivewhy.rootCause}</div>
  ${s.toolData.fivewhy.action ? `<div class="rca-action">→ <strong>Countermeasure:</strong> ${s.toolData.fivewhy.action}</div>` : ''}
</div>`).join('')}` : ''}

${allFish.length > 0 ? `
<h2>Fishbone (Ishikawa) Analysis (${allFish.length})</h2>
${allFish.map(s => `
<div class="rca-box">
  <div class="rca-title">Problem: ${s.toolData.ishikawa.problem}</div>
  <div style="font-size:11px;font-family:Arial;color:#555;margin-bottom:6px">Step: ${s.name} &nbsp;·&nbsp; Framework: ${s.toolData.ishikawa.framework || '6M'}</div>
  ${Object.entries(s.toolData.ishikawa.causes || {}).map(([cat, causes]: [string, any]) =>
    causes?.length ? `<div style="margin-bottom:4px"><strong style="font-size:11px">${cat}:</strong> <span style="font-size:11px;font-family:Arial">${causes.join(', ')}</span></div>` : ''
  ).join('')}
</div>`).join('')}` : ''}

${branches.length > 0 ? `
<h2>Process Branches (${branches.length})</h2>
<table>
  <tr><th>Branch Name</th><th>Color</th><th>Steps</th></tr>
  ${branches.map(b => {
    const bSteps = steps.filter(s => s.branch_id === b.id)
    return `<tr><td>${b.name}</td><td>${b.color || '—'}</td><td>${bSteps.map(s=>s.name).join(', ')||'—'}</td></tr>`
  }).join('')}
</table>` : ''}

<div class="footer">Generated by VeSiMy · vesimy.com · ${today} · Confidential</div>
</body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 400)
  }

  const exportVSM = () => {
    const w = window.open('', '_blank')
    if (!w) return
    // Generate simple text-based VSM
    const rows = main.map(s => {
      const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
      const wt = Number(s.wait_time) || 0
      return { name: s.name, ct, wt, ops: s.operators || 1, defect: s.defect_rate || 0, uptime: s.uptime || 100 }
    })
    w.document.write(`<!DOCTYPE html><html><head><title>VSM — ${project.name}</title>
<style>
  body { font-family: Arial, sans-serif; background:#fff; padding:32px; color:#111; }
  h1 { font-size:20px; margin-bottom:4px; } .sub { font-size:12px; color:#888; margin-bottom:32px; }
  .vsm-row { display:flex; align-items:center; gap:0; margin-bottom:32px; overflow-x:auto; }
  .vsm-box { border:2px solid #333; border-radius:6px; padding:10px 12px; min-width:120px; text-align:center; background:#fff; }
  .vsm-box .name { font-weight:700; font-size:13px; }
  .vsm-box .ct { font-size:11px; margin-top:4px; color:#B8860B; }
  .vsm-box .ops { font-size:10px; color:#666; }
  .vsm-arrow { font-size:22px; color:#999; padding:0 4px; flex-shrink:0; }
  .vsm-wait { text-align:center; font-size:10px; color:#CC3300; min-width:40px; flex-shrink:0; }
  .timeline { display:flex; gap:0; margin-top:8px; border-top:2px solid #333; }
  .tl-ct { background:#FEF3C7; text-align:center; padding:4px; font-size:10px; font-weight:700; }
  .tl-wt { background:#FEE2E2; text-align:center; padding:4px; font-size:10px; }
  table { border-collapse:collapse; width:100%; font-size:12px; margin-top:24px; }
  th,td { border:1px solid #ddd; padding:6px 10px; text-align:left; }
  th { background:#f5f5f5; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; }
</style></head><body>
<h1>Value Stream Map — ${project.name}</h1>
<div class="sub">${project.product || ''} · Generated ${today} · vesimy.com</div>
<div class="vsm-row">
  <div class="vsm-box" style="background:#E0F2FE;"><div class="name">📦 Supplier</div></div>
  ${rows.map((s, i) => `
  <div class="vsm-arrow">→</div>
  ${s.wt ? `<div class="vsm-wait">▽<br>${fmtS(s.wt)}<br>wait</div><div class="vsm-arrow">→</div>` : ''}
  <div class="vsm-box">
    <div class="name">${s.name}</div>
    <div class="ct">CT: ${fmtS(s.ct)}</div>
    <div class="ops">${s.ops} ops · ${s.uptime}% uptime</div>
    ${s.defect ? `<div style="font-size:10px;color:#CC3300">${s.defect}% defects</div>` : ''}
  </div>`).join('')}
  <div class="vsm-arrow">→</div>
  <div class="vsm-box" style="background:#DCFCE7;"><div class="name">🏭 Customer</div></div>
</div>
${taktTime ? `<p style="font-size:12px;color:#666">Takt Time: ${fmtS(taktTime)} &nbsp;·&nbsp; Customer Demand: ${project.demand || '—'} units/day &nbsp;·&nbsp; Working Hours: ${project.working_hours || '—'} hrs/day</p>` : ''}
<table>
  <tr><th>#</th><th>Step</th><th>Cycle Time</th><th>Wait Time</th><th>Operators</th><th>Uptime %</th><th>Defect %</th><th>vs Takt</th></tr>
  ${rows.map((s,i) => `<tr>
    <td>${i+1}</td><td><strong>${s.name}</strong></td>
    <td>${fmtS(s.ct)}</td><td>${s.wt ? fmtS(s.wt) : '—'}</td>
    <td>${s.ops}</td><td>${s.uptime}%</td><td>${s.defect || '—'}</td>
    <td>${taktTime ? (s.ct > taktTime ? `⚠️ +${fmtS(s.ct - taktTime)}` : `✓ -${fmtS(taktTime - s.ct)}`) : '—'}</td>
  </tr>`).join('')}
  <tr style="background:#f5f5f5;font-weight:700"><td colspan="2">TOTAL</td><td>${fmtS(totalCT)}</td><td>${fmtS(totalWait)}</td><td colspan="4">PCE: ${pce}%</td></tr>
</table>
</body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 400)
  }

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'0 4px' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:'Palatino Linotype,serif', fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
            CI Report — {project.name}
          </h2>
          <p style={{ fontSize:12, color:'var(--text2)' }}>{project.product || project.industry || ''} · {today}</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={exportVSM} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, border:'1px solid rgba(100,160,255,0.4)', background:'rgba(100,160,255,0.08)', color:'#6CA0FF', cursor:'pointer', fontSize:12, fontWeight:600 }}>
            📊 Export VSM
          </button>
          <button onClick={printReport} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, border:'1px solid rgba(212,162,8,0.3)', background:'rgba(212,162,8,0.08)', color:'#D4A208', cursor:'pointer', fontSize:12, fontWeight:600 }}>
            🖨 Full Report
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <ReportSec title="Process KPIs">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))', gap:10 }}>
          {([
            ['Steps',      main.length,              false],
            ['Total CT',   totalCT ? fmtS(totalCT) : '—', true],
            ['Wait Time',  totalWait ? fmtS(totalWait) : '—', false],
            ['Lead Time',  totalLT ? fmtS(totalLT) : '—',  false],
            ['PCE',        pce !== '—' ? pce+'%' : '—',    true],
            ['Avg CT',     avgCT !== '—' ? fmtS(Number(avgCT)) : '—', false],
            ['Total WIP',  totalWIP || '—',           false],
            ['Takt',       taktTime ? fmtS(taktTime) : '—', false],
          ] as [string, any, boolean][]).map(([l, v, gold]) => (
            <div key={l} style={{ background:'var(--bg2)', borderRadius:8, padding:'10px 12px', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:1.2, fontFamily:'monospace', marginBottom:3, textTransform:'uppercase' }}>{l}</div>
              <div style={{ fontSize:20, fontWeight:700, color: gold ? '#D4A208' : 'var(--text)' }}>{v}</div>
            </div>
          ))}
        </div>
        {taktTime && main.some(s => (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0) > taktTime) && (
          <div style={{ marginTop:10, padding:'8px 12px', borderRadius:7, background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.25)', fontSize:12, color:'#FF6B6B' }}>
            ⚠️ Steps exceeding takt time ({fmtS(taktTime)}): {main.filter(s => (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0) > taktTime).map(s => s.name).join(', ')}
          </div>
        )}
      </ReportSec>

      {/* Step Detail */}
      <ReportSec title={`Process Steps (${main.length})`}>
        {main.length === 0 ? (
          <p style={{ color:'var(--text3)', fontSize:13 }}>No steps added yet.</p>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ borderBottom:'2px solid var(--border)' }}>
                  {['#','Step','Dept','Cycle Time','Wait','Ops','Defect%','Uptime%','C&A%','Wastes'].map(h => (
                    <th key={h} style={{ padding:'6px 10px', textAlign:'left', fontSize:10, color:'var(--text3)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:1, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {main.map((s, i) => {
                  const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
                  const overTakt = taktTime && ct > taktTime
                  return (
                    <tr key={s.id} style={{ borderBottom:'1px solid var(--border)', background: overTakt ? 'rgba(255,107,107,0.04)' : 'transparent' }}>
                      <td style={{ padding:'8px 10px', color:'var(--text3)', fontFamily:'monospace', fontSize:11 }}>{i+1}</td>
                      <td style={{ padding:'8px 10px' }}>
                        <div style={{ fontWeight:600, color:'var(--text)', fontSize:13 }}>{s.name}</div>
                        {s.description && <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{s.description}</div>}
                      </td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)', fontSize:12 }}>{s.department || '—'}</td>
                      <td style={{ padding:'8px 10px', color: overTakt ? '#FF6B6B' : '#D4A208', fontWeight:600, fontFamily:'monospace' }}>{ct ? fmtS(ct) : '—'}{overTakt ? ' ⚠️' : ''}</td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)', fontFamily:'monospace' }}>{s.wait_time ? fmtS(Number(s.wait_time)) : '—'}</td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{s.operators || 1}</td>
                      <td style={{ padding:'8px 10px', color: Number(s.defect_rate) > 5 ? '#FF6B6B' : 'var(--text2)' }}>{s.defect_rate || '—'}</td>
                      <td style={{ padding:'8px 10px', color: Number(s.uptime) < 90 ? '#F4A623' : 'var(--text2)' }}>{s.uptime || '100'}</td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{s.completion_accuracy || '—'}</td>
                      <td style={{ padding:'8px 10px' }}>
                        {(s.toolData?.waste?.selected || []).map((w: string) => (
                          <span key={w} style={{ fontSize:9, background:'rgba(255,107,107,0.12)', color:'#FF6B6B', padding:'1px 5px', borderRadius:3, marginRight:3, display:'inline-block', marginBottom:2 }}>{w}</span>
                        ))}
                        {!(s.toolData?.waste?.selected?.length) && <span style={{ color:'var(--text3)' }}>—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </ReportSec>

      {/* Kaizen Events */}
      {allKaizen.length > 0 && (
        <ReportSec title={`Kaizen Events (${allKaizen.length})`}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ borderBottom:'2px solid var(--border)' }}>
                  {['Title','Step','Type','Priority','Status','Owner','Due'].map(h => (
                    <th key={h} style={{ padding:'6px 10px', textAlign:'left', fontSize:10, color:'var(--text3)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allKaizen.map((k: any, i: number) => (
                  <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'8px 10px', fontWeight:600, color:'var(--text)' }}>{k.title || '—'}</td>
                    <td style={{ padding:'8px 10px', color:'var(--text2)', fontSize:11 }}>{k.stepName}</td>
                    <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{k.type || '—'}</td>
                    <td style={{ padding:'8px 10px' }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100,
                        background: k.priority==='high'?'rgba(255,107,107,0.15)':k.priority==='medium'?'rgba(244,166,35,0.15)':'rgba(29,209,161,0.15)',
                        color: k.priority==='high'?'#FF6B6B':k.priority==='medium'?'#F4A623':'#1DD1A1' }}>
                        {(k.priority||'—').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding:'8px 10px' }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100,
                        background: k.status==='complete'?'rgba(29,209,161,0.15)':'rgba(244,166,35,0.15)',
                        color: k.status==='complete'?'#1DD1A1':'#F4A623' }}>
                        {(k.status||'OPEN').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{k.owner || '—'}</td>
                    <td style={{ padding:'8px 10px', color:'var(--text2)', fontFamily:'monospace', fontSize:11 }}>{k.dueDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSec>
      )}

      {/* Root Cause Analysis */}
      {allWhys.length > 0 && (
        <ReportSec title={`5 Whys — Root Cause Analysis (${allWhys.length})`}>
          {allWhys.map(s => (
            <div key={s.id} style={{ border:'1px solid var(--border)', borderRadius:8, padding:'14px 16px', marginBottom:12 }}>
              <div style={{ fontWeight:700, color:'var(--text)', marginBottom:10, fontSize:14 }}>{s.name}</div>
              {(s.toolData.fivewhy.whys || []).map((w: string, i: number) => w ? (
                <div key={i} style={{ display:'flex', gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'var(--text3)', fontFamily:'monospace', minWidth:52 }}>Why {i+1}</span>
                  <span style={{ fontSize:12, color:'var(--text2)' }}>{w}</span>
                </div>
              ) : null)}
              <div style={{ marginTop:10, padding:'8px 12px', borderRadius:6, background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)' }}>
                <span style={{ fontSize:11, fontWeight:700, color:'#FF6B6B' }}>ROOT CAUSE: </span>
                <span style={{ fontSize:12, color:'var(--text)' }}>{s.toolData.fivewhy.rootCause}</span>
              </div>
              {s.toolData.fivewhy.action && (
                <div style={{ marginTop:6, padding:'8px 12px', borderRadius:6, background:'rgba(29,209,161,0.08)', border:'1px solid rgba(29,209,161,0.2)' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#1DD1A1' }}>COUNTERMEASURE: </span>
                  <span style={{ fontSize:12, color:'var(--text)' }}>{s.toolData.fivewhy.action}</span>
                </div>
              )}
            </div>
          ))}
        </ReportSec>
      )}

      {/* Fishbone */}
      {allFish.length > 0 && (
        <ReportSec title={`Fishbone Analysis (${allFish.length})`}>
          {allFish.map(s => (
            <div key={s.id} style={{ border:'1px solid var(--border)', borderRadius:8, padding:'14px 16px', marginBottom:12 }}>
              <div style={{ fontWeight:700, color:'var(--text)', marginBottom:4 }}>{s.name}</div>
              <div style={{ fontSize:12, color:'#FF6B6B', marginBottom:10 }}>Problem: {s.toolData.ishikawa.problem}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:8 }}>
                {Object.entries(s.toolData.ishikawa.causes || {}).map(([cat, causes]: [string, any]) =>
                  causes?.length ? (
                    <div key={cat} style={{ background:'var(--bg2)', borderRadius:6, padding:'8px 10px', border:'1px solid var(--border)' }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'var(--text2)', marginBottom:5, textTransform:'uppercase', letterSpacing:1, fontFamily:'monospace' }}>{cat}</div>
                      {causes.map((c: string, i: number) => (
                        <div key={i} style={{ fontSize:12, color:'var(--text)', marginBottom:3 }}>• {c}</div>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </ReportSec>
      )}

      {/* Waste Summary */}
      {allWastes.length > 0 && (
        <ReportSec title={`Waste Register (${allWastes.length})`}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {Array.from(new Set(allWastes.map(w => w.waste))).map(waste => {
              const count = allWastes.filter(w => w.waste === waste).length
              return (
                <div key={waste} style={{ background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:8, padding:'8px 14px' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#FF6B6B' }}>{waste}</div>
                  <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{count} step{count>1?'s':''}</div>
                </div>
              )
            })}
          </div>
        </ReportSec>
      )}
    </div>
  )
}

function ReportSec({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:28 }}>
      <h3 style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:2, borderBottom:'1px solid var(--border)', paddingBottom:6, marginBottom:14, fontFamily:'monospace' }}>{title}</h3>
      {children}
    </div>
  )
}

// ── Project Settings Modal ────────────────────────────────────────────────────
function ProjectSettingsModal({ project, onSave, onClose, onDelete }: {
  project:  Project
  onSave:   (f:Partial<Project>) => Promise<void>
  onClose:  () => void
  onDelete: () => Promise<void>
}) {
  const [form, setForm] = useState<Partial<Project>>({ ...project })
  const fields = [
    { key:'name',         label:'Project Name',        type:'text',   span:true  },
    { key:'description',  label:'Description',         type:'text',   span:true  },
    { key:'industry',     label:'Industry',            type:'text',   span:false },
    { key:'product',      label:'Product Family',      type:'text',   span:false },
    { key:'customer',     label:'Customer',            type:'text',   span:false },
    { key:'supplier',     label:'Supplier',            type:'text',   span:false },
    { key:'demand',       label:'Demand (units/day)',  type:'number', span:false },
    { key:'working_hours',label:'Working Hours/Day',   type:'number', span:false },
    { key:'takt_time',    label:'Takt Time (sec)',      type:'number', span:false },
  ]
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth:520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Project Settings</span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#7070A0', fontSize:18 }}>✕</button>
        </div>
        <div className="modal-body" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {fields.map(f => (
            <div key={f.key} style={f.span ? { gridColumn:'1/-1' } : {}}>
              <label className="label">{f.label}</label>
              <input className="input" type={f.type} value={(form as any)[f.key]||''} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} />
            </div>
          ))}
        </div>
        <div className="modal-footer" style={{ justifyContent:'space-between' }}>
          <button onClick={onDelete} className="btn btn-danger btn-sm">🗑 Delete Project</button>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={() => onSave(form)} className="btn btn-primary btn-sm">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Branches Tab ──────────────────────────────────────────────────────────────
function BranchesTab({ steps, branches, onNewBranch, onEditBranch, onDeleteBranch, onAddStep, onEditStep, onDeleteStep, onTool }: {
  steps:Step[]; branches:Branch[]
  onNewBranch:()=>void; onEditBranch:(b:Branch)=>void; onDeleteBranch:(b:Branch)=>void
  onAddStep:(id:string)=>void; onEditStep:(s:Step)=>void; onDeleteStep:(id:string)=>void
  onTool:(stepId:string,tool:string)=>void
}) {
  const mainSteps = steps.filter(s => s.is_main_flow !== false)
  const mainCT    = mainSteps.reduce((a,s) => a+(s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0), 0)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:'Palatino Linotype,serif', fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Process Branches</h2>
          <p style={{ fontSize:13, color:'#7070A0' }}>Parallel lanes — sub-assemblies, prep flows, quality loops</p>
        </div>
        <button onClick={onNewBranch} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, background:'linear-gradient(135deg,#C49510,#D4A208)', border:'none', color:'#03030D', cursor:'pointer', fontSize:12, fontWeight:700 }}>
          <PlusIcon size={13} color="#03030D" /> New Branch
        </button>
      </div>

      {branches.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#38385C' }}>
          <BranchIcon size={48} color="#38385C" style={{ margin:'0 auto 16px', display:'block' }} />
          <div style={{ color:'#7070A0', fontSize:15, marginBottom:24 }}>No branches yet</div>
          <button onClick={onNewBranch} style={{ padding:'10px 24px', borderRadius:9, background:'linear-gradient(135deg,#C49510,#D4A208)', border:'none', color:'#03030D', cursor:'pointer', fontSize:13, fontWeight:700 }}>
            Create First Branch
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {branches.map(branch => {
            const bSteps = steps.filter(s => s.branch_id===branch.branch_id).sort((a,b)=>(a.branch_position||0)-(b.branch_position||0))
            const bCT    = bSteps.reduce((a,s)=>a+(s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0),0)
            const isCrit = bCT>0 && mainCT>0 && bCT>mainCT
            const parent = mainSteps.find(s=>s.id===branch.parent_step_id)
            const merge  = mainSteps.find(s=>s.id===branch.merge_step_id)
            return (
              <div key={branch.id} style={{ background:'var(--bg2)', border:`1px solid ${branch.color}33`, borderRadius:10, overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:'var(--bg3)', borderBottom:`1px solid ${branch.color}22` }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:branch.color, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'var(--text)', fontSize:14, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                      {branch.label}
                      {isCrit && <span style={{ fontSize:9, color:'#FF6B6B', padding:'2px 6px', borderRadius:3, background:'rgba(255,107,107,0.1)', fontWeight:700 }}>⚠ CRITICAL PATH</span>}
                    </div>
                    <div style={{ fontSize:11, color:'#7070A0', marginTop:2, display:'flex', gap:10, flexWrap:'wrap' }}>
                      {parent && <span>From: <span style={{color:branch.color}}>{parent.name}</span></span>}
                      {merge  && <span>Into: <span style={{color:branch.color}}>{merge.name}</span></span>}
                      {bCT>0  && <span>CT: <span style={{color:branch.color}}>{fmtS(bCT)}</span></span>}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={()=>onAddStep(branch.branch_id)} style={{ padding:'4px 10px', fontSize:11, borderRadius:5, cursor:'pointer', background:`${branch.color}18`, border:`1px solid ${branch.color}44`, color:branch.color }}>+ Step</button>
                    <button onClick={()=>onEditBranch(branch)} style={SM_BTN}><EditIcon  size={12} color="currentColor" /></button>
                    <button onClick={()=>onDeleteBranch(branch)} style={{...SM_BTN,color:'#FF6B6B'}}><TrashIcon size={12} color="currentColor" /></button>
                  </div>
                </div>
                <div style={{ padding:10, display:'flex', flexDirection:'column', gap:6 }}>
                  {bSteps.length===0 ? (
                    <div style={{ textAlign:'center', padding:'12px 0', color:'#38385C', fontSize:12 }}>
                      No steps — <button onClick={()=>onAddStep(branch.branch_id)} style={{ background:'none', border:'none', color:branch.color, cursor:'pointer', fontSize:12 }}>add the first</button>
                    </div>
                  ) : bSteps.map((s, si) => {
                    const ct     = s.toolData?.stopwatch?.mean || (s.cycle_time ? Number(s.cycle_time) : null)
                    const wastes = s.toolData?.waste?.selected?.length || 0
                    const kzOpen = (s.toolData?.kaizen?.items || []).filter((i: any) => i.status!=='complete').length
                    return (
                      <div key={s.id} style={{ background:'#03030D', border:`1px solid ${branch.color}22`, borderRadius:6, padding:'8px 10px', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ color:'#38385C', fontFamily:'monospace', fontSize:10, minWidth:16 }}>{si+1}.</span>
                        <div style={{ flex:1, minWidth:80 }}>
                          <div style={{ fontWeight:600, color:'var(--text)', fontSize:12 }}>{s.name}</div>
                          {s.department && <div style={{ fontSize:10, color:'#7070A0' }}>{s.department}</div>}
                        </div>
                        <div style={{ display:'flex', gap:6, fontSize:10 }}>
                          {ct       && <span style={{color:branch.color}}>CT:{fmtS(ct)}</span>}
                          {wastes>0 && <span style={{color:'#FF6B6B'}}>{wastes}W</span>}
                          {kzOpen>0 && <span style={{color:'#F4A623'}}>⚡{kzOpen}</span>}
                        </div>
                        {(['stopwatch','waste','kaizen','fivewhy'] as const).map(t => {
                          const TMap = { stopwatch:StopwatchIcon, waste:WasteIcon, kaizen:KaizenIcon, fivewhy:FiveWhyIcon }
                          const TIcon = TMap[t]
                          return (
                            <button key={t} onClick={()=>onTool(s.id,t)} style={{ padding:'3px 6px', fontSize:10, borderRadius:4, cursor:'pointer', background:s.toolData?.[t]?`${branch.color}18`:'transparent', border:`1px solid ${s.toolData?.[t]?`${branch.color}44`:'var(--border)'}`, color:s.toolData?.[t]?branch.color:'#38385C', display:'flex', alignItems:'center' }}>
                              <TIcon size={10} color="currentColor" />
                            </button>
                          )
                        })}
                        <button onClick={()=>onEditStep(s)} style={SM_BTN}><EditIcon  size={11} color="currentColor" /></button>
                        <button onClick={()=>onDeleteStep(s.id)} style={{...SM_BTN,color:'#FF6B6B'}}><TrashIcon size={11} color="currentColor" /></button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const SM_BTN: React.CSSProperties = {
  background:'none', border:'1px solid #1A1A40', cursor:'pointer', fontSize:11,
  padding:'3px 6px', borderRadius:5, color:'#7070A0', display:'flex', alignItems:'center',
}
