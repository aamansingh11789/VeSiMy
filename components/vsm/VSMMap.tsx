'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Step, Branch, Project } from '@/lib/store'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'

interface CanvasPosition { x: number; y: number }
interface Props {
  steps: Step[]
  branches: Branch[]
  project: Project
  onStepUpdate?: (stepId: string, updates: Partial<Step>) => Promise<void> | void
  onStepToolData?: (stepId: string, tool: string, data: any) => Promise<void> | void
  onOpenTool?: (tool: string, stepId: string) => void
}

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60) return `${Math.round(s)}s`
  if (s < 3600) return `${(s / 60).toFixed(s % 60 === 0 ? 0 : 1)}m`
  return `${(s / 3600).toFixed(1)}h`
}

const stickyPalette = [
  { name: 'blue', bg: '#DDEEFF', edge: '#B9D7FF', pin: '#1D7BFF', ink: '#0A2540' },
  { name: 'yellow', bg: '#FFF0B8', edge: '#F8D96B', pin: '#E8A300', ink: '#3B2F00' },
  { name: 'pink', bg: '#FFE1E7', edge: '#FFC2CD', pin: '#E5484D', ink: '#441018' },
  { name: 'green', bg: '#DFF7D8', edge: '#BFEFB5', pin: '#2BA84A', ink: '#103B17' },
  { name: 'lavender', bg: '#E9E1FF', edge: '#D6C8FF', pin: '#7C3AED', ink: '#241044' },
  { name: 'aqua', bg: '#DDF8FF', edge: '#B4ECF7', pin: '#0284C7', ink: '#0B3340' },
]
const rotations = [-1.2, 0.9, -0.5, 1.1, -0.9, 0.7, -1.0, 1.2]

const guidedSteps = [
  'Knowledge Check',
  'Target Setting',
  'Current State',
  'Process Boundaries',
  'Map the Steps',
  'Bottleneck',
  'Improvement Plan',
  'Report & Next Action',
]

const workshopPhases = [
  ['Wall Session', 'Map as a team'],
  ['Floor Observation', 'Capture real data'],
  ['Analysis', 'Identify opportunities'],
  ['Future State', 'Design & plan'],
]

const toolButtons = [
  ['stopwatch', 'Time Study'],
  ['fivewhy', '5 Why'],
  ['ishikawa', 'Fishbone'],
  ['waste', 'Waste ID'],
  ['kaizen', 'Kaizen'],
  ['improvement', 'Action'],
]

function stepColor(step: Step, index: number) {
  const type = String((step as any).step_type || '').toLowerCase()
  const name = String(step.name || '').toLowerCase()
  if (type.includes('quality') || type.includes('inspect') || name.includes('inspect') || name.includes('quality')) return stickyPalette[2]
  if (type.includes('material') || type.includes('transport')) return stickyPalette[3]
  if (type.includes('info')) return stickyPalette[5]
  if (step.va_type === 'nva') return stickyPalette[2]
  if (step.is_main_flow === false) return stickyPalette[4]
  return stickyPalette[index % stickyPalette.length]
}

function getWait(step: Step) {
  return Number((step as any).wait_time || 0)
}

function getActivities(step: Step) {
  return Array.isArray(step.op_steps) ? step.op_steps : []
}

function getSavedPosition(step: Step): CanvasPosition | null {
  const pos = step.toolData?.vsmCanvas?.position || step.toolData?.vsmCanvasPosition
  if (pos && Number.isFinite(Number(pos.x)) && Number.isFinite(Number(pos.y))) {
    return { x: Number(pos.x), y: Number(pos.y) }
  }
  return null
}

function buildDefaultPositions(mainSteps: Step[], branchSteps: Step[]) {
  const positions: Record<string, CanvasPosition> = {}
  mainSteps.forEach((step, index) => {
    positions[step.id] = getSavedPosition(step) || { x: 150 + index * 245, y: 92 }
  })
  branchSteps.forEach((step, index) => {
    positions[step.id] = getSavedPosition(step) || { x: 150 + index * 245, y: 380 }
  })
  return positions
}

function getStepSize(zoom: number) {
  return { width: 166 * zoom, height: 210 * zoom }
}

function StickyStep({
  step,
  index,
  selected,
  position,
  zoom,
  onSelect,
  onDragCommit,
  onOpenTool,
}: {
  step: Step
  index: number
  selected: boolean
  position: CanvasPosition
  zoom: number
  onSelect: (step: Step) => void
  onDragCommit: (stepId: string, next: CanvasPosition) => void
  onOpenTool?: (tool: string, stepId: string) => void
}) {
  const color = stepColor(step, index)
  const ct = ctSeconds(step)
  const wt = getWait(step)
  const wip = Number(step.wip || 0)
  const activities = getActivities(step)
  const isBottleneck = Boolean((step as any).is_bottleneck)
  const va = ct
  const nva = wt
  const title = step.name || `Step ${index + 1}`
  const dragRef = useRef<{ startX: number; startY: number; origin: CanvasPosition; moved: boolean } | null>(null)

  const handlePointerDown = (event: any) => {
    const target = event.target as HTMLElement
    if (target.closest('button')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { startX: event.clientX, startY: event.clientY, origin: position, moved: false }
    onSelect(step)
  }

  const handlePointerMove = (event: any) => {
    if (!dragRef.current) return
    const dx = (event.clientX - dragRef.current.startX) / zoom
    const dy = (event.clientY - dragRef.current.startY) / zoom
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragRef.current.moved = true
    onDragCommit(step.id, {
      x: Math.max(40, dragRef.current.origin.x + dx),
      y: Math.max(40, dragRef.current.origin.y + dy),
    })
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  return (
    <div
      className={`vsm-sticky-step ${selected ? 'is-selected' : ''} ${isBottleneck ? 'is-bottleneck' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(step)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(step)
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        ['--sticky-bg' as any]: color.bg,
        ['--sticky-edge' as any]: color.edge,
        ['--sticky-pin' as any]: color.pin,
        ['--sticky-ink' as any]: color.ink,
        ['--sticky-rot' as any]: `${rotations[index % rotations.length]}deg`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scale(${zoom}) rotate(var(--sticky-rot))`,
        transformOrigin: 'top left',
      }}
    >
      <span className="vsm-sticky-pin" />
      <span className="vsm-sticky-fold" />
      {isBottleneck && <span className="vsm-sticky-alert">Constraint</span>}
      <span className="vsm-sticky-title">{index + 1}. {title.length > 18 ? `${title.slice(0, 17)}…` : title}</span>
      {step.department && <span className="vsm-sticky-dept">{step.department}</span>}
      <span className="vsm-sticky-activities">
        {activities.length > 0 ? activities.slice(0, 3).map((activity, i) => (
          <span key={activity.id || i}>• {activity.name}</span>
        )) : <span className="muted">Double-click details to add activities</span>}
        {activities.length > 3 && <span className="muted">+{activities.length - 3} more</span>}
      </span>
      <span className="vsm-sticky-mini-strip">
        <span><b>CT</b>{ct ? fmtS(ct) : '—'}</span>
        <span><b>WT</b>{wt ? fmtS(wt) : '—'}</span>
        <span><b>WIP</b>{wip || '—'}</span>
      </span>
      <span className="vsm-sticky-data-strip" aria-label="Step data strip">
        <span><b>VA</b>{va ? fmtS(va) : '—'}</span>
        <span className={nva > va ? 'hot' : ''}><b>NVA</b>{nva ? fmtS(nva) : '—'}</span>
        <span><b>Ops</b>{step.operators || 1}</span>
      </span>
      {selected && onOpenTool && (
        <span className="vsm-sticky-toolbar" aria-label="Sticky note quick tools">
          {toolButtons.slice(0, 4).map(([tool, label]) => (
            <button key={tool} type="button" onClick={() => onOpenTool(tool, step.id)}>{label}</button>
          ))}
        </span>
      )}
    </div>
  )
}

function CanvasArrows({ steps, positions, zoom }: { steps: Step[]; positions: Record<string, CanvasPosition>; zoom: number }) {
  const { width, height } = getStepSize(zoom)
  return (
    <svg className="vsm-canvas-arrows" aria-hidden="true">
      <defs>
        <marker id="vsm-arrow-head" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill="#64748B" />
        </marker>
      </defs>
      {steps.slice(0, -1).map((step, index) => {
        const next = steps[index + 1]
        const a = positions[step.id]
        const b = positions[next.id]
        if (!a || !b) return null
        const x1 = a.x * zoom + width - 8
        const y1 = a.y * zoom + height * 0.32
        const x2 = b.x * zoom + 8
        const y2 = b.y * zoom + height * 0.32
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2
        const wip = Number(next.wip || 0)
        const wait = getWait(next)
        return (
          <g key={`${step.id}-${next.id}`}>
            <path d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`} fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray={next.flow_type === 'fifo' ? '6 6' : '0'} markerEnd="url(#vsm-arrow-head)" />
            {(wip > 0 || wait > 0) && (
              <foreignObject x={midX - 48} y={midY + 18} width="96" height="58">
                <div className="vsm-arrow-metrics">
                  {wip > 0 && <span className="inventory-triangle">{wip}</span>}
                  {wait > 0 && <span className="wait-pill">WT {fmtS(wait)}</span>}
                </div>
              </foreignObject>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="vsm-metric-card">
      <span>{label}</span>
      <strong style={{ color: color || '#0F172A' }}>{value}</strong>
    </div>
  )
}

function EditableField({ label, value, onSave, type = 'text', suffix }: {
  label: string
  value: string | number
  type?: 'text' | 'number'
  suffix?: string
  onSave: (value: string) => void
}) {
  const [draft, setDraft] = useState(String(value ?? ''))
  useEffect(() => setDraft(String(value ?? '')), [value])
  return (
    <label className="vsm-edit-field">
      <span>{label}</span>
      <div>
        <input
          type={type}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => onSave(draft)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
          }}
        />
        {suffix && <small>{suffix}</small>}
      </div>
    </label>
  )
}

export function VSMMap({ steps, branches, project, onStepUpdate, onStepToolData, onOpenTool }: Props) {
  const mainSteps = useMemo(
    () => steps.filter(s => s.is_main_flow !== false).sort((a, b) => a.position - b.position),
    [steps]
  )
  const branchSteps = useMemo(
    () => steps.filter(s => s.is_main_flow === false).sort((a, b) => (a.branch_position || 0) - (b.branch_position || 0)),
    [steps]
  )
  const [selectedId, setSelectedId] = useState<string | null>(mainSteps[0]?.id || null)
  const [zoom, setZoom] = useState(1)
  const [positions, setPositions] = useState<Record<string, CanvasPosition>>(() => buildDefaultPositions(mainSteps, branchSteps))
  const saveTimer = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const [newActivity, setNewActivity] = useState('')

  useEffect(() => {
    setPositions(prev => ({ ...buildDefaultPositions(mainSteps, branchSteps), ...prev }))
    if (!selectedId && mainSteps[0]) setSelectedId(mainSteps[0].id)
  }, [mainSteps, branchSteps, selectedId])

  const selected = steps.find(s => s.id === selectedId) || mainSteps[0]
  const takt = project.takt_time ? Number(project.takt_time)
    : project.demand && project.available_time_sec ? Number(project.available_time_sec) / Number(project.demand)
    : project.demand && project.working_hours ? (Number(project.working_hours) * 3600) / Number(project.demand)
    : 0
  const { totalCT, totalWait, leadTime, pce, totalWIP } = calcProcessMetrics(steps, project)
  const bottleneck = mainSteps.reduce<Step | null>((current, step) => {
    if (!current) return step
    const score = (ctSeconds(step) || 0) + getWait(step) + (Number(step.wip || 0) * 60)
    const currentScore = (ctSeconds(current) || 0) + getWait(current) + (Number(current.wip || 0) * 60)
    return score > currentScore ? step : current
  }, null)

  const commitPosition = useCallback((stepId: string, next: CanvasPosition) => {
    setPositions(prev => ({ ...prev, [stepId]: next }))
    if (!onStepToolData) return
    clearTimeout(saveTimer.current[stepId])
    saveTimer.current[stepId] = setTimeout(() => {
      const step = steps.find(s => s.id === stepId)
      const existing = step?.toolData?.vsmCanvas || {}
      onStepToolData(stepId, 'vsmCanvas', { ...existing, position: next, updatedAt: new Date().toISOString() })
    }, 650)
  }, [onStepToolData, steps])

  const updateSelected = useCallback(async (updates: Partial<Step>) => {
    if (!selected || !onStepUpdate) return
    await onStepUpdate(selected.id, updates)
  }, [selected, onStepUpdate])

  const addActivity = async () => {
    if (!selected || !newActivity.trim() || !onStepUpdate) return
    const activities = getActivities(selected)
    await onStepUpdate(selected.id, {
      op_steps: [
        ...activities,
        { id: `act-${Date.now()}`, name: newActivity.trim(), time: 0, va_type: 'nva' as const },
      ],
    } as Partial<Step>)
    setNewActivity('')
  }

  if (!mainSteps.length) {
    return (
      <div className="vsm-empty-sticky-state">
        <div className="vsm-empty-card">Add your first step in Builder to generate a sticky-note current-state map.</div>
      </div>
    )
  }

  const boardWidth = Math.max(1120, (mainSteps.length + 1) * 245 + 300) * zoom
  const boardHeight = Math.max(560, branchSteps.length ? 720 : 560) * zoom

  return (
    <div className="vsm-workspace-shell">
      <style jsx>{`
        .vsm-workspace-shell {
          --vs-blue: #0B63F6;
          --vs-blue-soft: #EAF2FF;
          --vs-ink: #081633;
          --vs-muted: #60708F;
          --vs-line: #E5EAF3;
          --vs-panel: #FFFFFF;
          color: var(--vs-ink);
          font-family: Satoshi, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .vsm-guided-strip, .vsm-phase-strip, .vsm-board-card, .vsm-side-card, .vsm-insight-card, .vsm-metric-card {
          background: rgba(255,255,255,.94);
          border: 1px solid rgba(13, 34, 70, .08);
          box-shadow: 0 18px 45px rgba(20, 40, 80, .08), inset 0 1px 0 rgba(255,255,255,.9);
          border-radius: 20px;
        }
        .vsm-guided-strip { padding: 20px 22px; margin-bottom: 16px; }
        .vsm-strip-title { font-weight: 850; font-size: 14px; margin-bottom: 16px; letter-spacing: -.01em; }
        .vsm-guided-steps { display: grid; grid-template-columns: repeat(8, minmax(86px, 1fr)); gap: 8px; align-items: start; }
        .vsm-guided-step { position: relative; text-align: center; color: var(--vs-muted); font-size: 11px; }
        .vsm-guided-step:not(:last-child)::after { content: ''; position: absolute; left: calc(50% + 22px); top: 15px; width: calc(100% - 36px); height: 1px; background: #C9D2E2; }
        .vsm-guided-dot { display: inline-flex; width: 30px; height: 30px; align-items: center; justify-content: center; border-radius: 999px; background: #F4F7FB; border: 1px solid #DCE5F2; font-weight: 800; color: #53627D; margin-bottom: 8px; box-shadow: inset 0 1px 0 #fff; }
        .vsm-guided-step.is-active .vsm-guided-dot { background: linear-gradient(180deg, #1777FF, #0758DF); color: white; border-color: #0758DF; box-shadow: 0 8px 18px rgba(11,99,246,.25); }
        .vsm-guided-step.is-active { color: var(--vs-blue); font-weight: 800; }
        .vsm-phase-strip { padding: 14px; margin-bottom: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .vsm-phase { border: 1px solid var(--vs-line); border-radius: 15px; padding: 12px 14px; display: flex; gap: 12px; align-items: center; background: #fff; }
        .vsm-phase.is-active { border-color: rgba(11,99,246,.55); background: linear-gradient(180deg, #FFFFFF, #F2F7FF); box-shadow: 0 10px 22px rgba(11,99,246,.10); }
        .vsm-phase-num { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #F3F6FA; font-weight: 850; color: #4C5871; }
        .vsm-phase.is-active .vsm-phase-num { background: var(--vs-blue); color: white; }
        .vsm-phase strong { display: block; font-size: 13px; }
        .vsm-phase span:last-child { font-size: 11px; color: var(--vs-muted); }
        .vsm-layout { display: grid; grid-template-columns: minmax(0, 1fr) 290px; gap: 16px; align-items: start; }
        .vsm-board-card { overflow: hidden; }
        .vsm-board-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; border-bottom: 1px solid #EEF2F7; }
        .vsm-board-head h3 { margin: 0; font-size: 19px; letter-spacing: -.025em; }
        .vsm-board-head p { margin: 4px 0 0; font-size: 12px; color: var(--vs-muted); }
        .vsm-board-tools { display: flex; gap: 8px; flex-wrap: wrap; align-items:center; justify-content:flex-end; }
        .vsm-tool-button { border: 1px solid #DFE7F3; background: linear-gradient(180deg,#fff,#F7FAFF); border-radius: 11px; padding: 9px 12px; font-size: 12px; font-weight: 750; color: var(--vs-ink); box-shadow: 0 6px 15px rgba(20,40,80,.06); cursor:pointer; }
        .vsm-tool-button.primary { background: linear-gradient(180deg,#1678FF,#065BE6); color: white; border-color: #065BE6; }
        .vsm-tool-button:active { transform: translateY(1px); }
        .vsm-zoom-pill { display:flex; align-items:center; gap:6px; padding: 7px; border:1px solid #DFE7F3; border-radius:999px; background:#fff; }
        .vsm-zoom-pill button { border:0; background:#F3F7FF; color:#0B63F6; width:26px; height:26px; border-radius:50%; font-weight:900; cursor:pointer; }
        .vsm-zoom-pill span { font-size:11px; font-weight:850; color:#53627D; min-width:38px; text-align:center; }
        .vsm-canvas-board { position: relative; min-height: 560px; overflow: auto; background-color: #FBFAF5; background-image: radial-gradient(circle, rgba(12,30,60,.14) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,.8), rgba(255,255,255,.25)); background-size: 22px 22px, auto; }
        .vsm-canvas-content { position: relative; min-width: var(--board-width); min-height: var(--board-height); }
        .vsm-canvas-arrows { position:absolute; inset:0; width:100%; height:100%; overflow:visible; pointer-events:none; }
        .vsm-end-card { position:absolute; width:86px; height:106px; border: 1px solid #DCE5F2; border-radius: 16px; background: rgba(255,255,255,.86); display: grid; place-items: center; text-align: center; font-weight: 800; font-size: 12px; color: #43516B; box-shadow: 0 10px 24px rgba(20,40,80,.07); }
        .vsm-sticky-step { position: absolute; width: 166px; min-height: 230px; text-align: left; padding: 0; background: transparent; cursor: grab; transition: filter .18s ease; touch-action:none; }
        .vsm-sticky-step:active { cursor: grabbing; }
        .vsm-sticky-step:hover, .vsm-sticky-step.is-selected { filter: drop-shadow(0 15px 28px rgba(20,40,80,.18)); }
        .vsm-sticky-step::before { content: ''; position: absolute; inset: 0 0 76px; border-radius: 4px 4px 14px 4px; background: var(--sticky-bg); box-shadow: inset 0 1px 0 rgba(255,255,255,.85), inset 0 -1px 0 rgba(0,0,0,.06), 0 4px 0 var(--sticky-edge), 0 14px 28px rgba(42,48,68,.16); border: 1px solid rgba(0,0,0,.05); }
        .vsm-sticky-step::after { content: ''; position: absolute; inset: 0 0 76px; border-radius: 4px 4px 14px 4px; opacity: .45; pointer-events:none; background: linear-gradient(135deg, rgba(255,255,255,.65), rgba(255,255,255,0) 42%, rgba(0,0,0,.05)); }
        .vsm-sticky-step.is-selected::before { outline: 3px solid rgba(11,99,246,.33); }
        .vsm-sticky-step.is-bottleneck::before { outline: 2px solid rgba(225,29,72,.32); }
        .vsm-sticky-pin { position: absolute; top: -12px; left: 50%; width: 17px; height: 17px; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff 0 10%, var(--sticky-pin) 45%, #153E90 100%); box-shadow: 0 3px 0 rgba(0,0,0,.18), 0 8px 12px rgba(0,0,0,.18); z-index: 3; }
        .vsm-sticky-pin::after { content:''; position:absolute; left:50%; top:12px; width:2px; height:14px; transform:translateX(-50%); background: rgba(20,30,50,.24); border-radius:2px; }
        .vsm-sticky-fold { position: absolute; right: 0; bottom: 76px; width: 28px; height: 28px; background: linear-gradient(135deg, rgba(0,0,0,.10), rgba(255,255,255,.55)); clip-path: polygon(100% 0, 0 100%, 100% 100%); z-index:2; opacity:.55; }
        .vsm-sticky-title { position: relative; z-index: 2; display: block; padding: 34px 14px 4px; text-align: center; color: var(--sticky-ink); font-size: 19px; font-family: "Comic Sans MS", "Bradley Hand", "Segoe Print", Satoshi, cursive; font-weight: 650; line-height: 1.12; }
        .vsm-sticky-dept { position: relative; z-index:2; display:block; text-align:center; color: rgba(8,22,51,.58); font-size:10px; font-weight:700; }
        .vsm-sticky-alert { position: absolute; top: 12px; right: 8px; z-index: 4; color:#B42318; background: rgba(255,255,255,.75); border: 1px solid rgba(180,35,24,.18); font-size: 9px; font-weight: 850; border-radius: 999px; padding: 3px 7px; }
        .vsm-sticky-activities { position:relative; z-index:2; display:grid; gap:2px; margin: 8px 14px 0; min-height:44px; color:rgba(8,22,51,.72); font-size:10px; line-height:1.18; }
        .vsm-sticky-activities .muted { color:rgba(8,22,51,.42); font-style:italic; }
        .vsm-sticky-mini-strip { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; margin: 10px 9px 0; }
        .vsm-sticky-mini-strip span { background: rgba(255,255,255,.58); border: 1px solid rgba(0,0,0,.04); border-radius: 8px; padding: 5px 3px; font-size: 10px; color: rgba(8,22,51,.78); text-align:center; box-shadow: inset 0 1px 0 rgba(255,255,255,.75); }
        .vsm-sticky-mini-strip b, .vsm-sticky-data-strip b { display:block; color: rgba(8,22,51,.5); font-size: 8px; letter-spacing:.04em; }
        .vsm-sticky-data-strip { position: absolute; left: 5px; right: 5px; bottom: 0; min-height: 67px; display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; padding: 6px; background: rgba(255,255,255,.88); border: 1px solid #E3E8F1; border-radius: 12px; box-shadow: 0 10px 22px rgba(20,40,80,.10); z-index: 3; }
        .vsm-sticky-data-strip span { display:grid; place-items:center; font-size: 11px; color:#10213C; font-weight:800; border-right: 1px solid #E8EDF5; }
        .vsm-sticky-data-strip span:last-child { border-right:0; }
        .vsm-sticky-data-strip .hot { color: #D92D20; }
        .vsm-sticky-toolbar { position:absolute; left: 2px; right:2px; bottom:-42px; display:flex; gap:4px; justify-content:center; z-index:8; }
        .vsm-sticky-toolbar button { border:1px solid #CFE1FF; background:#fff; color:#0B63F6; border-radius:999px; padding:5px 7px; font-size:9px; font-weight:850; cursor:pointer; box-shadow:0 8px 18px rgba(20,40,80,.10); }
        .vsm-arrow-metrics { display:flex; flex-direction:column; align-items:center; gap:5px; }
        .inventory-triangle { width:34px; height:30px; clip-path: polygon(50% 0, 0 100%, 100% 100%); background:#FFE4A3; border:1px solid #D97706; position:relative; filter: drop-shadow(0 4px 6px rgba(0,0,0,.12)); color:#8A4B00; font-weight:900; font-size: 11px; display:flex; align-items:flex-end; justify-content:center; padding-bottom:3px; box-sizing:border-box; }
        .wait-pill { display:inline-flex; align-items:center; justify-content:center; padding:5px 8px; border-radius:999px; color:#B42318; font-weight:850; font-size:10px; background:#FFF1F0; border:1px solid #FFD0CC; box-shadow:0 5px 12px rgba(180,35,24,.08); }
        .vsm-kpi-row { display:grid; grid-template-columns: repeat(6, minmax(96px,1fr)); gap:10px; margin: 14px 0 16px; }
        .vsm-metric-card { padding: 12px 14px; border-radius: 15px; }
        .vsm-metric-card span { display:block; color: var(--vs-muted); font-size: 10px; font-weight:800; text-transform: uppercase; letter-spacing:.08em; }
        .vsm-metric-card strong { display:block; margin-top:4px; font-size: 20px; letter-spacing:-.03em; }
        .vsm-side { display:grid; gap:14px; }
        .vsm-side-card { padding: 17px; }
        .vsm-side-card h4 { margin:0 0 12px; font-size: 15px; letter-spacing:-.02em; }
        .vsm-side-list { display:grid; gap:10px; }
        .vsm-side-list div { border-bottom:1px solid #EEF2F7; padding-bottom:10px; }
        .vsm-side-list div:last-child { border-bottom:0; padding-bottom:0; }
        .vsm-side-list span { display:block; color:var(--vs-muted); font-size:11px; }
        .vsm-side-list strong { display:block; margin-top:2px; font-size:18px; }
        .vsm-selected-note { border-left: 4px solid var(--vs-blue); }
        .vsm-concept { font-size: 12px; color: #50627F; line-height: 1.55; }
        .vsm-edit-grid { display:grid; gap:9px; }
        .vsm-edit-field span { display:block; color:#60708F; font-size:10px; text-transform:uppercase; letter-spacing:.08em; font-weight:850; margin-bottom:4px; }
        .vsm-edit-field div { display:flex; align-items:center; gap:6px; }
        .vsm-edit-field input { width:100%; border:1px solid #DDE6F3; border-radius:10px; background:#F8FBFF; padding:8px 9px; color:#081633; font-weight:750; outline:none; }
        .vsm-edit-field input:focus { border-color:#0B63F6; box-shadow:0 0 0 3px rgba(11,99,246,.12); }
        .vsm-edit-field small { color:#60708F; font-size:11px; }
        .vsm-activity-input { display:flex; gap:7px; margin-top:10px; }
        .vsm-activity-input input { flex:1; border:1px solid #DDE6F3; border-radius:10px; padding:8px 9px; }
        .vsm-activity-input button { border:0; border-radius:10px; background:#0B63F6; color:white; padding:0 10px; font-weight:850; cursor:pointer; }
        .vsm-activity-list { margin: 10px 0 0; padding: 0; list-style:none; display:grid; gap:5px; }
        .vsm-activity-list li { font-size:12px; color:#40516D; background:#F8FBFF; border:1px solid #E5ECF6; border-radius:9px; padding:7px 8px; }
        .vsm-insights { display:grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 14px; }
        .vsm-insight-card { padding: 16px; }
        .vsm-insight-card strong { display:block; font-size:14px; margin-bottom:6px; }
        .vsm-insight-card p { margin:0; font-size:12px; line-height:1.45; color:var(--vs-muted); }
        .vsm-insight-card a { display:inline-block; margin-top:10px; color: var(--vs-blue); font-size:12px; font-weight:850; text-decoration:none; }
        .vsm-empty-sticky-state { padding: 50px; border-radius: 18px; background: #FBFAF5; border:1px dashed #CBD5E1; text-align:center; }
        .vsm-empty-card { display:inline-block; padding: 20px 26px; border-radius: 16px; background:white; box-shadow:0 16px 32px rgba(20,40,80,.08); color:#50627F; }
        @media (max-width: 980px) {
          .vsm-layout { grid-template-columns: 1fr; }
          .vsm-guided-steps { grid-template-columns: repeat(4, minmax(80px,1fr)); row-gap: 16px; }
          .vsm-phase-strip { grid-template-columns: 1fr 1fr; }
          .vsm-kpi-row { grid-template-columns: repeat(2,1fr); }
          .vsm-insights { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vsm-guided-strip">
        <div className="vsm-strip-title">VeSiMy Guided Experience</div>
        <div className="vsm-guided-steps">
          {guidedSteps.map((label, idx) => {
            const active = idx === 4
            return (
              <div className={`vsm-guided-step ${active ? 'is-active' : ''}`} key={label}>
                <span className="vsm-guided-dot">{idx + 1}</span>
                <div>{label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="vsm-phase-strip">
        {workshopPhases.map(([title, subtitle], idx) => (
          <div className={`vsm-phase ${idx === 2 ? 'is-active' : ''}`} key={title}>
            <span className="vsm-phase-num">{idx + 1}</span>
            <span><strong>{title}</strong><span>{subtitle}</span></span>
          </div>
        ))}
      </div>

      <div className="vsm-kpi-row">
        <MetricCard label="Lead Time" value={fmtS(leadTime)} color="#0B63F6" />
        <MetricCard label="Value Added" value={fmtS(totalCT)} color="#059669" />
        <MetricCard label="NVA / Wait" value={fmtS(totalWait)} color="#D92D20" />
        <MetricCard label="Takt Time" value={takt ? fmtS(takt) : '—'} color="#7C3AED" />
        <MetricCard label="PCE" value={fmtPCE(pce)} color={pceColor(pce)} />
        <MetricCard label="Total WIP" value={totalWIP || '—'} color="#B7791F" />
      </div>

      <div className="vsm-layout">
        <div>
          <div className="vsm-board-card">
            <div className="vsm-board-head">
              <div>
                <h3>Interactive Sticky-Note VSM Canvas</h3>
                <p>Drag notes, select a step, edit key data, add activities, or launch the CI tool connected to the note.</p>
              </div>
              <div className="vsm-board-tools">
                <div className="vsm-zoom-pill" aria-label="Canvas zoom controls">
                  <button type="button" onClick={() => setZoom(z => Math.max(.65, +(z - .1).toFixed(2)))}>−</button>
                  <span>{Math.round(zoom * 100)}%</span>
                  <button type="button" onClick={() => setZoom(z => Math.min(1.35, +(z + .1).toFixed(2)))}>+</button>
                </div>
                <button className="vsm-tool-button" type="button" onClick={() => setPositions(buildDefaultPositions(mainSteps, branchSteps))}>Reset layout</button>
                <button className="vsm-tool-button primary" type="button">Add Step</button>
              </div>
            </div>
            <div className="vsm-canvas-board">
              <div className="vsm-canvas-content" style={{ ['--board-width' as any]: `${boardWidth}px`, ['--board-height' as any]: `${boardHeight}px` }}>
                <CanvasArrows steps={mainSteps} positions={positions} zoom={zoom} />
                <div className="vsm-end-card" style={{ left: 34 * zoom, top: 108 * zoom, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>Supplier</div>
                {mainSteps.map((step, index) => (
                  <StickyStep
                    key={step.id}
                    step={step}
                    index={index}
                    zoom={zoom}
                    position={positions[step.id] || { x: 150 + index * 245, y: 92 }}
                    selected={selected?.id === step.id}
                    onSelect={(s) => setSelectedId(s.id)}
                    onDragCommit={commitPosition}
                    onOpenTool={onOpenTool}
                  />
                ))}
                <div className="vsm-end-card" style={{ left: (Math.max(...mainSteps.map(s => positions[s.id]?.x || 0)) + 250) * zoom, top: 108 * zoom, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>Customer</div>

                {branchSteps.map((step, index) => (
                  <StickyStep
                    key={step.id}
                    step={step}
                    index={index + 3}
                    zoom={zoom}
                    position={positions[step.id] || { x: 150 + index * 245, y: 380 }}
                    selected={selected?.id === step.id}
                    onSelect={(s) => setSelectedId(s.id)}
                    onDragCommit={commitPosition}
                    onOpenTool={onOpenTool}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="vsm-insights">
            <div className="vsm-insight-card" style={{ background: '#FFF5F4', borderColor: '#FFD7D3' }}>
              <strong>Bottleneck detected</strong>
              <p>{bottleneck?.name || 'The selected step'} has the strongest constraint signal based on cycle time, wait time, and WIP.</p>
              <a>Analyze bottleneck →</a>
            </div>
            <div className="vsm-insight-card" style={{ background: '#FFFAEB', borderColor: '#FDE7B0' }}>
              <strong>Wait-time opportunity</strong>
              <p>Focus on the highest wait-time connection before optimizing isolated steps.</p>
              <a>View opportunities →</a>
            </div>
            <div className="vsm-insight-card" style={{ background: '#F2F7FF', borderColor: '#CFE1FF' }}>
              <strong>Improvement potential</strong>
              <p>Use the target state to compare current lead time, WIP, and PCE against the goal.</p>
              <a>Explore plan →</a>
            </div>
          </div>
        </div>

        <aside className="vsm-side">
          <div className="vsm-side-card">
            <h4>Current State Summary</h4>
            <div className="vsm-side-list">
              <div><span>Total Lead Time</span><strong>{fmtS(leadTime)}</strong></div>
              <div><span>Total Value-Added Time</span><strong>{fmtS(totalCT)}</strong></div>
              <div><span>Total Steps</span><strong>{mainSteps.length}</strong></div>
              <div><span>Total WIP</span><strong>{totalWIP || '—'}</strong></div>
            </div>
          </div>

          <div className="vsm-side-card vsm-selected-note">
            <h4>Selected Sticky Note</h4>
            {selected ? (
              <div className="vsm-edit-grid">
                <EditableField label="Step name" value={selected.name || ''} onSave={(value) => updateSelected({ name: value })} />
                <EditableField label="Cycle Time" type="number" value={selected.cycle_time ?? ''} suffix="sec" onSave={(value) => updateSelected({ cycle_time: Number(value) || 0 })} />
                <EditableField label="Wait Time" type="number" value={selected.wait_time ?? ''} suffix="sec" onSave={(value) => updateSelected({ wait_time: Number(value) || 0 })} />
                <EditableField label="WIP" type="number" value={selected.wip ?? ''} onSave={(value) => updateSelected({ wip: Number(value) || 0 })} />
                <EditableField label="Operators" type="number" value={selected.operators ?? 1} onSave={(value) => updateSelected({ operators: Number(value) || 1 })} />
                <div>
                  <strong style={{ fontSize: 12 }}>Activities inside this step</strong>
                  <ul className="vsm-activity-list">
                    {getActivities(selected).map((activity, index) => <li key={activity.id || index}>{activity.name}</li>)}
                    {getActivities(selected).length === 0 && <li>No activities captured yet.</li>}
                  </ul>
                  <div className="vsm-activity-input">
                    <input value={newActivity} onChange={(e) => setNewActivity(e.target.value)} placeholder="Add activity..." />
                    <button type="button" onClick={addActivity}>Add</button>
                  </div>
                </div>
                {onOpenTool && (
                  <div>
                    <strong style={{ fontSize: 12 }}>Launch CI tool for this step</strong>
                    <div className="vsm-board-tools" style={{ marginTop: 8, justifyContent: 'flex-start' }}>
                      {toolButtons.map(([tool, label]) => (
                        <button key={tool} type="button" className="vsm-tool-button" onClick={() => onOpenTool(tool, selected.id)}>{label}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : <p className="vsm-concept">Select a sticky note to inspect details.</p>}
          </div>

          <div className="vsm-side-card">
            <h4>Concept Guide</h4>
            <p className="vsm-concept"><strong>Value-added time</strong> is work that directly transforms the product or service from the customer’s perspective.</p>
            <p className="vsm-concept"><strong>Wait time</strong> is time spent waiting between steps. In most processes, this is where the biggest improvement opportunity lives.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default VSMMap
