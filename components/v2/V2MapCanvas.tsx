'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { VSMIcon } from '@/components/ui/Icons'
import { BRAND, GREEN, AMBER, RED } from './v2-constants'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'

type V2MapCanvasProps = {
  steps: any[]
  project: any
  selectedStepId?: string
  onStepClick: (step: any) => void
  onAddStep: (afterPosition?: number) => void
  onDeleteStep?: (stepId: string) => void
  onStepUpdate?: (step: any) => void | Promise<void>
  onTool?: (tool: string, stepId: string) => void
  t?: any
  onSaveStopwatch?: (stepId: string, avgSeconds: number, lapCount: number) => void
}

const NOTE_W = 190
const NOTE_H = 150
const DEFAULT_Y = 150
const DEFAULT_X = 140
const GAP = 260

const noteThemes = [
  { bg: '#FFF3B8', edge: '#F7B731', pin: '#F59E0B', ink: '#2B2410' },
  { bg: '#DDF0FF', edge: '#5DADEC', pin: '#2563EB', ink: '#102A43' },
  { bg: '#FFE1E8', edge: '#FB7185', pin: '#DC2626', ink: '#3F1020' },
  { bg: '#DCFCE7', edge: '#34D399', pin: '#16A34A', ink: '#10351F' },
  { bg: '#EDE9FE', edge: '#A78BFA', pin: '#7C3AED', ink: '#24124D' },
  { bg: '#E0F2FE', edge: '#38BDF8', pin: '#0284C7', ink: '#0C3144' },
]

const rotations = [-1.2, 0.9, -0.4, 1.1, -0.8, 0.6, -1.0, 0.7]

function fmtTime(value: number) {
  if (!value || Number.isNaN(value)) return '—'
  if (value >= 3600) return `${(value / 3600).toFixed(1)}h`
  if (value >= 60) return `${Math.round(value / 60)}m`
  return `${Math.round(value)}s`
}

function toSecondsFromField(step: any, field: 'cycle_time' | 'wait_time') {
  const raw = Number(step?.[field]) || 0
  if (field === 'cycle_time') return ctSeconds(step)
  return raw
}

function normalizedActivities(step: any) {
  if (Array.isArray(step.tasks) && step.tasks.length) return step.tasks
  if (Array.isArray(step.op_steps) && step.op_steps.length) return step.op_steps
  if (Array.isArray(step.toolData?.activities)) return step.toolData.activities
  return []
}

function FieldInput({ label, value, onCommit, suffix = '' }: { label: string; value: any; onCommit: (v: string) => void; suffix?: string }) {
  const [draft, setDraft] = useState(value ?? '')
  useEffect(() => setDraft(value ?? ''), [value])
  return (
    <label className="v2-note-field" onPointerDown={e => e.stopPropagation()}>
      <span>{label}</span>
      <input
        value={draft}
        inputMode="decimal"
        onChange={e => setDraft(e.target.value)}
        onBlur={() => onCommit(String(draft))}
        onKeyDown={e => {
          if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur()
          if (e.key === 'Escape') { setDraft(value ?? ''); (e.currentTarget as HTMLInputElement).blur() }
        }}
      />
      {suffix && <em>{suffix}</em>}
    </label>
  )
}

export function V2MapCanvas({ steps, project, selectedStepId, onStepClick, onAddStep, onStepUpdate, onTool, t }: V2MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [drag, setDrag] = useState<null | { id: string; startX: number; startY: number; originX: number; originY: number }>(null)
  const [panning, setPanning] = useState<null | { startX: number; startY: number; originX: number; originY: number }>(null)

  const metrics = useMemo(() => calcProcessMetrics(steps, project), [steps, project])

  useEffect(() => {
    setPositions(prev => {
      const next = { ...prev }
      steps.forEach((step, i) => {
        const hasSaved = typeof step.map_x === 'number' && typeof step.map_y === 'number' && (step.map_x !== 0 || step.map_y !== 0)
        if (!next[step.id]) {
          next[step.id] = hasSaved
            ? { x: step.map_x, y: step.map_y }
            : { x: DEFAULT_X + i * GAP, y: DEFAULT_Y + (i % 2) * 20 }
        }
      })
      Object.keys(next).forEach(id => {
        if (!steps.some(s => s.id === id)) delete next[id]
      })
      return next
    })
  }, [steps])

  const canvasW = Math.max(1200, DEFAULT_X + steps.length * GAP + 260)
  const canvasH = 620

  function updateStepFields(step: any, updates: Record<string, any>) {
    const updated = { ...step, ...updates }
    onStepUpdate?.(updated)
  }

  function startNoteDrag(e: React.PointerEvent, step: any) {
    if ((e.target as HTMLElement).closest('input,button,textarea,select,a')) return
    e.stopPropagation()
    const pos = positions[step.id] || { x: DEFAULT_X, y: DEFAULT_Y }
    setDrag({ id: step.id, startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y })
    onStepClick(step)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (drag) {
      const dx = (e.clientX - drag.startX) / zoom
      const dy = (e.clientY - drag.startY) / zoom
      setPositions(prev => ({ ...prev, [drag.id]: { x: Math.max(24, drag.originX + dx), y: Math.max(86, drag.originY + dy) } }))
      return
    }
    if (panning) {
      setPan({ x: panning.originX + e.clientX - panning.startX, y: panning.originY + e.clientY - panning.startY })
    }
  }

  function onPointerUp() {
    if (drag) {
      const step = steps.find(s => s.id === drag.id)
      const pos = positions[drag.id]
      if (step && pos) onStepUpdate?.({ ...step, map_x: Math.round(pos.x), map_y: Math.round(pos.y) })
    }
    setDrag(null)
    setPanning(null)
  }

  if (!steps.length) {
    return (
      <div className="v2-empty-canvas">
        <VSMIcon size={52} />
        <h3>Your {t?.valueStream || 'value stream'} map will appear here</h3>
        <p>Upload an SOP or click <strong>+ Add Step</strong> to start building a real sticky-note map.</p>
        <button onClick={() => onAddStep()}>+ Add first sticky note</button>
      </div>
    )
  }

  return (
    <div className="v2-sticky-shell">
      <style>{`
        .v2-sticky-shell{flex:1;position:relative;overflow:hidden;background:linear-gradient(180deg,#fafafa,#f4f6fb);}
        .v2-empty-canvas{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#f7f8fb;color:#64748b;text-align:center;padding:40px;}
        .v2-empty-canvas h3{font-size:20px;color:#0f172a;margin:0;font-weight:800;}
        .v2-empty-canvas p{font-size:14px;line-height:1.7;margin:0;max-width:440px;}
        .v2-empty-canvas button{margin-top:10px;border:0;border-radius:12px;background:#1264f7;color:white;font-weight:800;padding:12px 18px;box-shadow:0 12px 30px rgba(18,100,247,.24);cursor:pointer;}
        .v2-canvas-toolbar{position:absolute;left:18px;top:14px;right:18px;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:12px;pointer-events:none;}
        .v2-hud{display:flex;gap:8px;flex-wrap:wrap;pointer-events:auto;}
        .v2-hud-card{background:rgba(255,255,255,.9);border:1px solid rgba(15,23,42,.08);border-radius:14px;padding:8px 12px;box-shadow:0 10px 24px rgba(15,23,42,.08);backdrop-filter:blur(10px);min-width:86px;}
        .v2-hud-card span{display:block;font:700 9px/1.2 JetBrains Mono,monospace;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;}
        .v2-hud-card strong{display:block;margin-top:3px;font:800 17px/1.1 Satoshi,system-ui;color:#0f172a;}
        .v2-zoom{display:flex;gap:6px;pointer-events:auto;}
        .v2-zoom button{height:34px;min-width:34px;border-radius:10px;border:1px solid rgba(15,23,42,.1);background:white;color:#0f172a;font-weight:900;box-shadow:0 10px 24px rgba(15,23,42,.08);cursor:pointer;}
        .v2-board{position:absolute;inset:0;overflow:hidden;cursor:grab;touch-action:none;}
        .v2-board:active{cursor:grabbing;}
        .v2-board-inner{position:relative;transform-origin:0 0;width:var(--cw);height:var(--ch);background-color:#fbfaf6;background-image:radial-gradient(circle,rgba(30,41,59,.14) 1px,transparent 1px);background-size:26px 26px;}
        .v2-supplier,.v2-customer{position:absolute;top:172px;width:84px;height:68px;border-radius:14px;border:1px solid rgba(15,23,42,.1);background:white;box-shadow:0 12px 24px rgba(15,23,42,.08);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;color:#475569;font-size:11px;font-weight:800;}
        .v2-supplier{left:34px}.v2-customer{left:calc(var(--cw) - 120px)}
        .v2-flow-svg{position:absolute;inset:0;pointer-events:none;overflow:visible;}
        .v2-note{position:absolute;width:${NOTE_W}px;min-height:${NOTE_H}px;border-radius:7px;background:var(--note-bg);box-shadow:0 2px 2px rgba(15,23,42,.08),0 12px 22px rgba(15,23,42,.13),0 24px 48px rgba(15,23,42,.09);border:1px solid rgba(0,0,0,.04);transform:rotate(var(--rot));padding:18px 14px 12px;user-select:none;cursor:grab;transition:box-shadow .18s, transform .18s;}
        .v2-note:hover{box-shadow:0 4px 4px rgba(15,23,42,.1),0 16px 30px rgba(15,23,42,.16),0 34px 60px rgba(15,23,42,.1);transform:rotate(var(--rot)) translateY(-2px);}
        .v2-note.selected{outline:3px solid #1264f7;outline-offset:4px;}
        .v2-note.bottleneck{box-shadow:0 0 0 2px rgba(239,68,68,.3),0 16px 30px rgba(239,68,68,.18),0 26px 50px rgba(15,23,42,.12);}
        .v2-note:before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--edge);border-radius:7px 0 0 7px;}
        .v2-note:after{content:"";position:absolute;right:0;bottom:0;width:28px;height:28px;background:linear-gradient(135deg,rgba(255,255,255,.05) 0%,rgba(255,255,255,.55) 52%,rgba(0,0,0,.08) 53%,rgba(0,0,0,.05) 100%);clip-path:polygon(100% 0,0 100%,100% 100%);border-bottom-right-radius:7px;}
        .v2-pin{position:absolute;left:50%;top:-12px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 25%,#fff 0 12%,var(--pin) 40%,#7c2d12 100%);box-shadow:0 7px 9px rgba(15,23,42,.22);transform:translateX(-50%);}
        .v2-note-title{font-family:"Comic Sans MS","Bradley Hand",cursive;font-size:22px;line-height:1.1;color:var(--ink);font-weight:700;margin:0 0 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .v2-note-meta{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;}
        .v2-note-field{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.58);border:1px solid rgba(15,23,42,.06);border-radius:8px;padding:5px 6px;min-width:0;}
        .v2-note-field span{font:800 9px/1 JetBrains Mono,monospace;color:#64748b;letter-spacing:.08em;}
        .v2-note-field input{width:100%;min-width:0;border:0;background:transparent;outline:0;font:800 12px/1 JetBrains Mono,monospace;color:#0f172a;text-align:right;}
        .v2-note-field em{font-style:normal;font-size:9px;color:#64748b;}
        .v2-activities{margin-top:10px;border-top:1px dashed rgba(15,23,42,.18);padding-top:7px;display:flex;flex-direction:column;gap:3px;}
        .v2-activities li{font-size:11px;color:rgba(15,23,42,.75);line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .v2-note-toolbar{position:absolute;left:10px;right:10px;bottom:-38px;display:flex;gap:5px;opacity:0;transform:translateY(-4px);transition:.18s;pointer-events:none;}
        .v2-note.selected .v2-note-toolbar,.v2-note:hover .v2-note-toolbar{opacity:1;transform:translateY(0);pointer-events:auto;}
        .v2-note-toolbar button{flex:1;border:1px solid rgba(18,100,247,.22);background:white;color:#1264f7;border-radius:8px;padding:5px 3px;font-size:9px;font-weight:800;cursor:pointer;box-shadow:0 8px 18px rgba(15,23,42,.1);}
        .v2-add-note{position:absolute;border:2px dashed rgba(18,100,247,.45);background:rgba(255,255,255,.8);border-radius:16px;color:#1264f7;font-size:34px;display:grid;place-items:center;width:76px;height:76px;cursor:pointer;box-shadow:0 12px 24px rgba(15,23,42,.08);}
        .v2-bottom-hint{position:absolute;left:18px;bottom:14px;z-index:20;background:rgba(255,255,255,.92);border:1px solid rgba(15,23,42,.08);border-radius:14px;padding:9px 12px;font-size:12px;color:#64748b;box-shadow:0 14px 30px rgba(15,23,42,.08);}
        @media(max-width:760px){.v2-hud-card{min-width:auto}.v2-note{width:170px}.v2-canvas-toolbar{align-items:flex-start}.v2-bottom-hint{display:none}}
      `}</style>

      <div className="v2-canvas-toolbar">
        <div className="v2-hud">
          {[
            ['Lead Time', fmtTime(metrics.leadTime)],
            ['PCE', fmtPCE(metrics.pce), pceColor(metrics.pce)],
            ['Steps', String(steps.length)],
            ['CT', fmtTime(metrics.totalCT)],
            ['Wait', fmtTime(metrics.totalWait)],
          ].map(([label, value, color]) => (
            <div className="v2-hud-card" key={label as string}>
              <span>{label}</span>
              <strong style={{ color: (color as string) || undefined }}>{value}</strong>
            </div>
          ))}
        </div>
        <div className="v2-zoom">
          <button onClick={() => setZoom(z => Math.min(2.2, z + .12))}>+</button>
          <button onClick={() => setZoom(z => Math.max(.45, z - .12))}>−</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}>Fit</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="v2-board"
        onPointerDown={e => setPanning({ startX: e.clientX, startY: e.clientY, originX: pan.x, originY: pan.y })}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="v2-board-inner" style={{ ['--cw' as any]: `${canvasW}px`, ['--ch' as any]: `${canvasH}px`, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          <div className="v2-supplier">Supplier</div>
          <div className="v2-customer">Customer</div>

          <svg className="v2-flow-svg" width={canvasW} height={canvasH} aria-hidden="true">
            <defs>
              <marker id="v2-arrow" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0,9 3.5,0 7" fill="#64748b" />
              </marker>
            </defs>
            {steps.slice(0, -1).map((step, i) => {
              const a = positions[step.id] || { x: DEFAULT_X + i * GAP, y: DEFAULT_Y }
              const b = positions[steps[i + 1].id] || { x: DEFAULT_X + (i + 1) * GAP, y: DEFAULT_Y }
              const ax = a.x + NOTE_W
              const ay = a.y + NOTE_H / 2
              const bx = b.x
              const by = b.y + NOTE_H / 2
              const midX = (ax + bx) / 2
              const midY = (ay + by) / 2
              return (
                <g key={step.id}>
                  <path d={`M ${ax} ${ay} C ${midX} ${ay}, ${midX} ${by}, ${bx} ${by}`} stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#v2-arrow)" />
                  <rect x={midX - 34} y={midY - 13} width="68" height="26" rx="13" fill="#fff" stroke="#e2e8f0" />
                  <text x={midX} y={midY - 2} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono,monospace" fill="#64748b">WIP</text>
                  <text x={midX} y={midY + 9} textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="JetBrains Mono,monospace" fill="#0f172a">{steps[i + 1].wip || 0}</text>
                </g>
              )
            })}
          </svg>

          {steps.map((step, index) => {
            const pos = positions[step.id] || { x: DEFAULT_X + index * GAP, y: DEFAULT_Y }
            const theme = noteThemes[index % noteThemes.length]
            const isSelected = step.id === selectedStepId
            const ct = toSecondsFromField(step, 'cycle_time')
            const wait = toSecondsFromField(step, 'wait_time')
            const isBottleneck = metrics.bottleneck?.id === step.id || (metrics.takt && ct > metrics.takt)
            const activities = normalizedActivities(step)
            return (
              <div
                key={step.id}
                className={`v2-note ${isSelected ? 'selected' : ''} ${isBottleneck ? 'bottleneck' : ''}`}
                style={{
                  left: pos.x,
                  top: pos.y,
                  ['--note-bg' as any]: theme.bg,
                  ['--edge' as any]: theme.edge,
                  ['--pin' as any]: theme.pin,
                  ['--ink' as any]: theme.ink,
                  ['--rot' as any]: `${rotations[index % rotations.length]}deg`,
                }}
                onPointerDown={e => startNoteDrag(e, step)}
                onClick={e => { e.stopPropagation(); onStepClick(step) }}
              >
                <div className="v2-pin" />
                <h3 className="v2-note-title">{index + 1}. {step.name || `Step ${index + 1}`}</h3>
                <div className="v2-note-meta">
                  <FieldInput label="CT" value={step.cycle_time ?? ''} suffix={step.cycle_time_unit === 'minutes' ? 'm' : 's'} onCommit={v => updateStepFields(step, { cycle_time: Number(v) || 0 })} />
                  <FieldInput label="WT" value={step.wait_time ?? ''} suffix="s" onCommit={v => updateStepFields(step, { wait_time: Number(v) || 0 })} />
                  <FieldInput label="WIP" value={step.wip ?? ''} onCommit={v => updateStepFields(step, { wip: Number(v) || 0 })} />
                  <FieldInput label="OPS" value={step.operators ?? 1} onCommit={v => updateStepFields(step, { operators: Number(v) || 1 })} />
                </div>
                <ul className="v2-activities">
                  {activities.length ? activities.slice(0, 3).map((a: string, ai: number) => <li key={ai}>• {a}</li>) : <li>• Add work elements in the side panel</li>}
                  {activities.length > 3 && <li>+ {activities.length - 3} more</li>}
                </ul>
                {isBottleneck && <div style={{ marginTop: 8, color: RED, fontSize: 11, fontWeight: 900 }}>Bottleneck candidate</div>}
                <div className="v2-note-toolbar" onPointerDown={e => e.stopPropagation()}>
                  <button onClick={() => onTool?.('stopwatch', step.id)}>Time</button>
                  <button onClick={() => onTool?.('fivewhy', step.id)}>5 Why</button>
                  <button onClick={() => onTool?.('fishbone', step.id)}>Fishbone</button>
                  <button onClick={() => onTool?.('kaizen', step.id)}>Kaizen</button>
                </div>
              </div>
            )
          })}

          <button className="v2-add-note" style={{ left: DEFAULT_X + steps.length * GAP, top: DEFAULT_Y + 36 }} onClick={() => onAddStep(steps.length - 1)}>+</button>
        </div>
      </div>
      <div className="v2-bottom-hint">Drag sticky notes to arrange the map. Click CT / WT / WIP fields to edit inline. Selected notes open the detail panel.</div>
    </div>
  )
}

export default V2MapCanvas
