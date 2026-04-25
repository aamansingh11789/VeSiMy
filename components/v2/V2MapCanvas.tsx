// TypeScript enabled
'use client'
// ── components/v2/V2MapCanvas.tsx ──────────────────────────────────────────────
// Pro canvas redesign — sticky note aesthetic, phase lane indicators,
// improved data strips, inline stopwatch, health glow.
// Spec: VeSiMy v4 Sections 5 + 6

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { VSMIcon } from '@/components/ui/Icons'
import { BRAND, RED, GREEN, AMBER } from './v2-constants'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds, fmtSeconds } from '@/lib/v2/cycle-time-utils'

// ── Sticky note color palette (natural muted tones per spec §5.2) ─────────────
const STICKY: Record<string, { bg: string; border: string; text: string }> = {
  process:    { bg: '#FFF9C4', border: '#E8D500', text: '#3D3200' }, // yellow — default
  decision:   { bg: '#FFF3E0', border: '#F4A623', text: '#3D2500' }, // orange
  delay:      { bg: '#FFEBEE', border: '#EF5350', text: '#3D0000' }, // red-pink
  inspection: { bg: '#E8F5E9', border: '#66BB6A', text: '#003D00' }, // green
  transport:  { bg: '#FFF8E1', border: '#FFC107', text: '#3D2C00' }, // amber
  storage:    { bg: '#F3E5F5', border: '#AB47BC', text: '#2A003D' }, // purple
  rework:     { bg: '#FFEBEE', border: '#F44336', text: '#3D0000' }, // red
  start_end:  { bg: '#ECEFF1', border: '#90A4AE', text: '#1A2832' }, // grey
}

const BOX_W  = 124
const BOX_H  = 52
const GAP    = 88
const STRIP_H = 58

function fmtTime(s: number) {
  if (!s) return '—'
  if (s >= 3600) return `${(s / 3600).toFixed(1)}h`
  if (s >= 60)   return `${(s / 60).toFixed(1)}m`
  return `${Math.round(s)}s`
}

// ── Floating stopwatch component ──────────────────────────────────────────────
function FloatingStopwatch({ stepName, onSave, onClose }: {
  stepName: string
  onSave: (avg: number, lapCount: number) => void
  onClose: () => void
}) {
  const [laps,    setLaps]    = useState<number[]>([])
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(0)
  const rafRef   = useRef(0)

  useEffect(() => {
    if (!running) { cancelAnimationFrame(rafRef.current); return }
    startRef.current = Date.now() - elapsed * 1000
    function tick() {
      setElapsed((Date.now() - startRef.current) / 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  function toggle() {
    if (!running) { setRunning(true) }
    else {
      setLaps(l => [...l, elapsed])
      setElapsed(0)
      setRunning(false)
    }
  }

  const avg = laps.length ? Math.round(laps.reduce((a, b) => a + b, 0) / laps.length) : 0

  return (
    <div style={{
      position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
      background: '#1A1A2E', border: '1px solid rgba(108,185,252,0.3)', borderRadius: 14,
      padding: 20, width: 240, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6CB9FC', letterSpacing: 2, marginBottom: 8 }}>
        STOPWATCH — {stepName.slice(0, 18)}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, color: running ? '#6CB9FC' : '#fff', textAlign: 'center', margin: '8px 0', letterSpacing: '-0.02em' }}>
        {elapsed.toFixed(1)}s
      </div>
      {laps.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {laps.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8B9CC8', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span>Lap {i + 1}</span><span style={{ fontFamily: 'monospace' }}>{l.toFixed(1)}s</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6CB9FC', marginTop: 4, fontWeight: 700 }}>
            <span>Avg ({laps.length} laps)</span>
            <span style={{ fontFamily: 'monospace' }}>{avg}s</span>
          </div>
          {laps.length < 3 && (
            <div style={{ fontSize: 10, color: '#4B5880', marginTop: 4, fontStyle: 'italic' }}>
              ISO 22468: minimum 3 laps recommended
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={toggle} style={{
          flex: 1, padding: '10px', borderRadius: 8, border: 'none',
          background: running ? '#C0402A' : '#0176D3',
          color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'monospace',
        }}>{running ? '⏹ Stop' : '▶ Start'}</button>
        {laps.length >= 1 && !running && (
          <button onClick={() => onSave(avg, laps.length)} style={{
            flex: 1, padding: '10px', borderRadius: 8, border: 'none',
            background: '#2E844A', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>Save {avg}s</button>
        )}
      </div>
      <button onClick={onClose} style={{
        width: '100%', marginTop: 8, padding: '6px', borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
        color: '#4B5880', fontSize: 12, cursor: 'pointer',
      }}>Close</button>
    </div>
  )
}

// ── Sticky note step box ──────────────────────────────────────────────────────
function StickyStepBox({ step, index, isSelected, onClick, t, expanded, onToggleExpand, taktTime, onStopwatch }: any) {
  const sc    = STICKY[step.step_type || 'process'] || STICKY.process
  const ct    = ctSeconds(step)
  const isBot = step.is_bottleneck || (taktTime > 0 && ct > taktTime)
  const defect = step.defect_rate || 0
  const missing = (step.missing_info_flags || []).length
  const glowColor = isBot ? RED : defect > 8 ? RED : defect > 3 || missing > 2 ? AMBER : step.va_type === 'va' ? GREEN : null

  const X = 80 + index * (BOX_W + GAP)
  const Y = 80

  // Health indicator badge
  const healthColor = isBot ? RED : defect > 5 ? RED : missing > 2 ? AMBER : step.va_type === 'va' ? GREEN : '#9CA3AF'

  const vaLabel = { va: 'VA', nnva: 'NNVA', nva: 'NVA' }[step.va_type as string] || '?'
  const vaColor = { va: GREEN, nnva: AMBER, nva: RED }[step.va_type as string] || '#9CA3AF'

  return (
    <g
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={`${step.name}${isBot ? ' — BOTTLENECK' : ''}`}
      aria-pressed={isSelected}
      onClick={() => onClick(step)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(step) } }}
    >
      {/* Glow halo */}
      {glowColor && (
        <rect x={X - 5} y={Y - 5} width={BOX_W + 10} height={BOX_H + 10} rx={10}
          fill="none" stroke={glowColor} strokeWidth={isBot ? 2.5 : 1.5}
          opacity={isBot ? 0.7 : 0.45}
          style={{ animation: isBot ? 'stickyPulse 1.4s ease-in-out infinite' : 'stickyBreath 2.8s ease-in-out infinite' }} />
      )}

      {/* Selection ring */}
      {isSelected && (
        <rect x={X - 4} y={Y - 4} width={BOX_W + 8} height={BOX_H + 8} rx={10}
          fill="none" stroke={BRAND} strokeWidth={2.5}
          style={{ filter: `drop-shadow(0 0 6px ${BRAND}80)` }} />
      )}

      {/* Sticky note body — subtle folded-corner look */}
      <rect x={X} y={Y} width={BOX_W} height={BOX_H} rx={4}
        fill={sc.bg} stroke={isSelected ? BRAND : sc.border}
        strokeWidth={isSelected ? 2 : 1.5}
        style={{ filter: `drop-shadow(2px 3px 4px rgba(0,0,0,0.2))` }} />

      {/* Fold corner top-right */}
      <path d={`M${X + BOX_W - 10},${Y} L${X + BOX_W},${Y + 10} L${X + BOX_W - 10},${Y + 10} Z`}
        fill={sc.border} opacity={0.35} />

      {/* Step type indicator top-left */}
      <rect x={X} y={Y} width={5} height={BOX_H} rx={4}
        fill={isBot ? RED : sc.border} opacity={0.7} />

      {/* Step name */}
      <text x={X + 14} y={Y + 17} fontSize={9} fontWeight={700}
        fill={sc.text} fontFamily="'DM Sans','Satoshi',sans-serif" style={{ pointerEvents: 'none' }}>
        {step.name.length > 16 ? step.name.slice(0, 16) + '…' : step.name}
      </text>

      {/* CT + operator mini data */}
      {expanded ? (
        <>
          <text x={X + 14} y={Y + 29} fontSize={8} fill={sc.text} fontFamily="monospace" opacity={0.8}>
            CT: {ct ? fmtTime(ct) : '—'}
          </text>
          <text x={X + 70} y={Y + 29} fontSize={8} fill={sc.text} fontFamily="monospace" opacity={0.8}>
            W: {step.wait_time ? fmtTime(step.wait_time) : '—'}
          </text>
          <text x={X + 14} y={Y + 40} fontSize={8} fill={sc.text} fontFamily="monospace" opacity={0.8}>
            WIP: {step.wip || '—'}  Ops: {step.operators || '—'}
          </text>
        </>
      ) : (
        <text x={X + 14} y={Y + 32} fontSize={8} fill={sc.text} fontFamily="monospace" opacity={0.8}>
          {ct ? fmtTime(ct) : 'No CT'}  {step.wip ? `WIP:${step.wip}` : ''}
        </text>
      )}

      {/* VA badge */}
      <rect x={X + BOX_W - 34} y={Y + BOX_H - 16} width={28} height={12} rx={3} fill={vaColor} opacity={0.2} />
      <text x={X + BOX_W - 20} y={Y + BOX_H - 7} fontSize={7} fontWeight={700}
        fill={vaColor} textAnchor="middle" fontFamily="monospace">
        {vaLabel}
      </text>

      {/* Bottleneck badge */}
      {isBot && (
        <>
          <rect x={X + 14} y={Y + BOX_H - 16} width={32} height={12} rx={3} fill={RED} opacity={0.15} />
          <text x={X + 30} y={Y + BOX_H - 7} fontSize={6} fontWeight={700}
            fill={RED} textAnchor="middle" fontFamily="monospace">
            BOTTLENECK
          </text>
        </>
      )}

      {/* Health dot */}
      <circle cx={X + BOX_W - 8} cy={Y + 8} r={4} fill={healthColor} opacity={0.9}
        style={{ filter: `drop-shadow(0 0 3px ${healthColor})` }} />

      {/* Stopwatch tap target */}
      <rect x={X + BOX_W - 24} y={Y + 20} width={18} height={14} rx={3}
        fill="rgba(255,255,255,0.4)" stroke={sc.border} strokeWidth={0.8}
        style={{ cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); onStopwatch(step) }} />
      <text x={X + BOX_W - 15} y={Y + 30} fontSize={9} textAnchor="middle" fill={sc.text}>⏱</text>

      {/* Expand toggle */}
      <text x={X + BOX_W / 2} y={Y + BOX_H + 10} fontSize={8} textAnchor="middle" fill="#9CA3AF"
        style={{ cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); onToggleExpand(step.id) }}>
        {expanded ? '▲' : '▼'}
      </text>

      {/* ISO data strip */}
      {expanded && (
        <g>
          <rect x={X} y={Y + BOX_H + 14} width={BOX_W} height={STRIP_H}
            fill="white" stroke={sc.border} strokeWidth={1} rx={3}
            style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))' }} />
          {[
            { label: 'CT',     val: ct ? fmtTime(ct) : '—',                  x: X + 4  },
            { label: 'WAIT',   val: step.wait_time ? fmtTime(step.wait_time) : '—', x: X + 34 },
            { label: 'UPTIME', val: step.uptime ? `${step.uptime}%` : '—',   x: X + 68 },
            { label: 'DEFECT', val: step.defect_rate ? `${step.defect_rate}%` : '—', x: X + 98 },
          ].map(({ label, val, x }) => (
            <g key={label}>
              <text x={x} y={Y + BOX_H + 26} fontSize={6} fill="#9CA3AF" fontFamily="monospace">{label}</text>
              <text x={x} y={Y + BOX_H + 38} fontSize={9} fontWeight={700} fill="#374151" fontFamily="monospace">{val}</text>
            </g>
          ))}
          {/* Operators row */}
          <text x={X + 4} y={Y + BOX_H + 52} fontSize={7} fill="#9CA3AF" fontFamily="monospace">
            Ops: {step.operators || '—'}  Dept: {step.department ? step.department.slice(0, 10) : '—'}
          </text>
          {/* Lap count indicator */}
          {step.lap_count && (
            <text x={X + BOX_W - 4} y={Y + BOX_H + 52} fontSize={7} fill={BRAND}
              textAnchor="end" fontFamily="monospace">
              {step.lap_count} laps
            </text>
          )}
        </g>
      )}
    </g>
  )
}

// ── Flow arrows (push/pull/supermarket) ──────────────────────────────────────
function FlowArrow({ fromX, toX, flowType, wip }: any) {
  const midX = (fromX + BOX_W + toX) / 2
  const Y    = 80 + BOX_H / 2
  const isPull = flowType === 'supermarket' || flowType === 'fifo'

  return (
    <g>
      <defs>
        <marker id={`arrowhead-${fromX}`} markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
          <polygon points="0 0,8 3,0 6" fill={isPull ? BRAND : '#6B7280'} />
        </marker>
      </defs>
      <line
        x1={fromX + BOX_W} y1={Y}
        x2={toX} y2={Y}
        stroke={isPull ? BRAND : '#9CA3AF'}
        strokeWidth={isPull ? 2 : 1.5}
        strokeDasharray={isPull ? undefined : undefined}
        markerEnd={`url(#arrowhead-${fromX})`}
      />
      {/* WIP on arrow */}
      {wip > 0 && (
        <>
          <circle cx={midX} cy={Y} r={9} fill="#FEF3C7" stroke={AMBER} strokeWidth={1.5} />
          <text x={midX} y={Y + 4} textAnchor="middle" fontSize={8} fontWeight={700}
            fill={AMBER} fontFamily="monospace">{wip}</text>
        </>
      )}
      {/* Supermarket symbol */}
      {flowType === 'supermarket' && (
        <rect x={midX - 8} y={Y - 12} width={16} height={10}
          fill="none" stroke={BRAND} strokeWidth={1.5} />
      )}
    </g>
  )
}

// ── Phase lane indicator ──────────────────────────────────────────────────────
function PhaseLane({ phase, startX, endX, canvasH }: { phase: number; startX: number; endX: number; canvasH: number }) {
  const PHASE_LABELS = ['Wall Session', 'Floor Observation', 'Analysis', 'Improvement']
  const PHASE_COLORS = ['rgba(1,118,211,0.04)', 'rgba(29,209,161,0.04)', 'rgba(244,166,35,0.04)', 'rgba(140,68,204,0.04)']
  const PHASE_TEXT   = [BRAND, '#1DD1A1', AMBER, '#8C44CC']

  if (phase < 1) return null

  return (
    <g>
      <rect x={startX} y={0} width={endX - startX} height={canvasH}
        fill={PHASE_COLORS[phase - 1] || 'transparent'} rx={0} />
      <text x={startX + 6} y={14} fontSize={8} fontWeight={700}
        fill={PHASE_TEXT[phase - 1] || '#aaa'} fontFamily="monospace" opacity={0.8}>
        PHASE {phase}: {PHASE_LABELS[phase - 1]?.toUpperCase()}
      </text>
    </g>
  )
}

// ── Main canvas ───────────────────────────────────────────────────────────────
export function V2MapCanvas({ steps, project, selectedStepId, onStepClick, onAddStep, t, onSaveStopwatch }: any) {
  const [pan,          setPan]          = useState({ x: 0, y: 0 })
  const [zoom,         setZoom]         = useState(1)
  const [isDragging,   setIsDragging]   = useState(false)
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})
  const [swStep,       setSwStep]       = useState<any>(null)  // floating stopwatch

  const containerRef = useRef<HTMLDivElement>(null)
  const dragging     = useRef(false)
  const didDrag      = useRef(false)
  const dragStart    = useRef({ x: 0, y: 0 })
  const lastPos      = useRef({ x: 0, y: 0 })

  const toggleExpand  = (id: string) => setExpandedSteps(e => ({ ...e, [id]: !e[id] }))
  const expandAll     = () => setExpandedSteps(Object.fromEntries(steps.map((s: any) => [s.id, true])))
  const collapseAll   = () => setExpandedSteps({})
  const zoomIn        = () => setZoom(z => Math.min(z + 0.15, 3))
  const zoomOut       = () => setZoom(z => Math.max(z - 0.15, 0.25))
  const resetView     = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const ZBTN: React.CSSProperties = {
    width: 30, height: 30, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
  }

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.min(Math.max(z + (e.deltaY > 0 ? -0.1 : 0.1), 0.25), 3))
  }, [])
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    dragging.current  = true; didDrag.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    lastPos.current   = { x: e.clientX, y: e.clientY }
    setIsDragging(true)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x; const dy = e.clientY - lastPos.current.y
    if (Math.abs(e.clientX - dragStart.current.x) > 4 || Math.abs(e.clientY - dragStart.current.y) > 4) didDrag.current = true
    setPan(p => ({ x: p.x + dx, y: p.y + dy }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  const onMouseUp = () => { dragging.current = false; setIsDragging(false) }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    dragging.current = true; didDrag.current = false
    dragStart.current = { x: t.clientX, y: t.clientY }
    lastPos.current   = { x: t.clientX, y: t.clientY }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || e.touches.length !== 1) return
    e.preventDefault()
    const t = e.touches[0]
    const dx = t.clientX - lastPos.current.x; const dy = t.clientY - lastPos.current.y
    if (Math.abs(t.clientX - dragStart.current.x) > 4 || Math.abs(t.clientY - dragStart.current.y) > 4) didDrag.current = true
    setPan(p => ({ x: p.x + dx, y: p.y + dy }))
    lastPos.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = () => { dragging.current = false }

  const { totalCT, totalWait, leadTime: totalLT, pce, takt: taktCalc, missingCTCount: missingCount } =
    calcProcessMetrics(steps, project)
  const taktTime = taktCalc ?? 0

  const hasExpanded  = Object.values(expandedSteps).some(Boolean)
  const CANVAS_W = Math.max(1000, 80 + steps.length * (BOX_W + GAP) + 200)
  const CANVAS_H = hasExpanded ? 580 : 380

  // Mobile auto-scale
  useEffect(() => {
    if (typeof window === 'undefined') return
    const vw = window.innerWidth
    if (vw < 768 && CANVAS_W > vw) {
      setZoom(Math.max(0.3, Math.min(0.85, (vw - 24) / CANVAS_W)))
      setPan({ x: 0, y: 0 })
    }
  }, [steps.length])

  if (steps.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: '#F8F7F4', color: 'var(--text3)' }}>
        <VSMIcon size={52} />
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Your {t?.valueStream || 'value stream'} map will appear here
          </h3>
          <p style={{ fontSize: 14, maxWidth: 380, lineHeight: 1.7, color: 'var(--text2)' }}>
            Upload an SOP to auto-generate the map, or click <strong>+ Add Step</strong> to start manually.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#F8F7F4' }}>
      <style>{`
        @keyframes stickyPulse { 0%,100%{opacity:0.7;stroke-width:2.5} 50%{opacity:1;stroke-width:3.5} }
        @keyframes stickyBreath { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
      `}</style>

      {/* Floating stopwatch */}
      {swStep && (
        <FloatingStopwatch
          stepName={swStep.name}
          onSave={(avg, lapCount) => {
            if (onSaveStopwatch) onSaveStopwatch(swStep.id, avg, lapCount)
            setSwStep(null)
          }}
          onClose={() => setSwStep(null)}
        />
      )}

      {/* KPI HUD */}
      <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 20, display: 'flex', gap: 6, flexWrap: 'wrap', pointerEvents: 'none' }}>
        {[
          { label: 'Lead Time',   value: fmtTime(totalLT)         },
          { label: 'PCE',         value: fmtPCE(pce),             color: pceColor(pce) },
          { label: 'Steps',       value: String(steps.length)     },
          ...(taktTime > 0 ? [{ label: 'Takt', value: fmtTime(taktTime) }] : []),
          ...(missingCount > 0 ? [{ label: 'Incomplete', value: String(missingCount), color: AMBER }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, padding: '4px 10px', textAlign: 'center', backdropFilter: 'blur(4px)', pointerEvents: 'all' }}>
            <div style={{ fontSize: 7, fontFamily: 'monospace', color: '#9CA3AF', letterSpacing: 1 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: color || '#1F2937' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Expand / collapse toggles */}
      <div style={{ position: 'absolute', top: 10, left: 12, marginTop: 44, zIndex: 20, display: 'flex', gap: 4 }}>
        {[
          { label: 'EXPAND ALL',  fn: expandAll  },
          { label: 'COLLAPSE',    fn: collapseAll },
        ].map(({ label, fn }) => (
          <button key={label} onClick={fn} style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 1, padding: '3px 8px', border: '1px solid rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', color: '#374151', borderRadius: 4 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Zoom controls */}
      <div style={{ position: 'absolute', top: 10, right: 14, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button onClick={zoomIn}    style={ZBTN}>+</button>
        <button onClick={zoomOut}   style={ZBTN}>−</button>
        <button onClick={resetView} style={{ ...ZBTN, fontSize: 9, padding: '5px 8px' }}>FIT</button>
      </div>

      {/* VA Legend */}
      <div style={{ position: 'absolute', bottom: 12, right: 14, zIndex: 20, display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 320 }}>
        {[{ color: GREEN, label: 'VA' }, { color: AMBER, label: 'NNVA' }, { color: RED, label: 'NVA / Waste' }].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#374151', background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, padding: '2px 7px' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Zoom % */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 20, fontSize: 10, fontFamily: 'monospace', color: '#9CA3AF', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 4, padding: '2px 8px' }}>
        {Math.round(zoom * 100)}%
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', overflow: 'hidden', touchAction: 'none' }}
      >
        <div style={{ transformOrigin: 'top left', transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, width: CANVAS_W, height: CANVAS_H, willChange: 'transform' }}>
          <svg width={CANVAS_W} height={CANVAS_H} style={{ display: 'block', userSelect: 'none' }} role="region" aria-label="Value stream map canvas" focusable="false">
            <defs>
              <pattern id="grid-v4" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#DBEAFE" opacity="0.6" />
              </pattern>
            </defs>

            {/* Blue dot grid background */}
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid-v4)" />

            {/* Phase lane (if project.phase set) */}
            {project?.phase && (
              <PhaseLane phase={project.phase} startX={0} endX={CANVAS_W} canvasH={CANVAS_H} />
            )}

            {/* Supplier */}
            <rect x={12} y={56} width={52} height={44} fill="#6B7280" stroke="#4B5563" strokeWidth={1.5} rx={3}
              style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))' }} />
            <text x={38} y={71} textAnchor="middle" fontSize={8} fontWeight={700} fill="white" fontFamily="monospace">
              {(project?.supplier || 'Supplier').slice(0, 8)}
            </text>
            <text x={38} y={83} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.7)" fontFamily="monospace">SUPPLIER</text>
            {steps.length > 0 && (
              <line x1={64} y1={80 + BOX_H / 2} x2={80} y2={80 + BOX_H / 2} stroke="#9CA3AF" strokeWidth={1.5}
                markerEnd="url(#arrow-push-v4)" />
            )}

            <defs>
              <marker id="arrow-push-v4" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
                <polygon points="0 0,6 2,0 4" fill="#6B7280" />
              </marker>
            </defs>

            {/* Step boxes */}
            {steps.map((step: any, i: number) => (
              <StickyStepBox
                key={step.id} step={step} index={i} isSelected={step.id === selectedStepId}
                t={t} taktTime={taktTime}
                expanded={!!expandedSteps[step.id]}
                onToggleExpand={toggleExpand}
                onClick={(s: any) => { if (!didDrag.current) onStepClick(s) }}
                onStopwatch={(s: any) => { setSwStep(s) }}
              />
            ))}

            {/* Flow arrows with WIP */}
            {steps.slice(0, -1).map((_: any, i: number) => (
              <FlowArrow
                key={`arr-${i}`}
                fromX={80 + i * (BOX_W + GAP)}
                toX={80 + (i + 1) * (BOX_W + GAP)}
                flowType={steps[i + 1]?.flow_type}
                wip={steps[i + 1]?.wip || 0}
              />
            ))}

            {/* Customer */}
            {steps.length > 0 && (() => {
              const lx = 80 + (steps.length - 1) * (BOX_W + GAP) + BOX_W + 16
              return (
                <g>
                  <rect x={lx} y={56} width={52} height={44} fill="#6B7280" stroke="#4B5563" strokeWidth={1.5} rx={3}
                    style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))' }} />
                  <text x={lx + 26} y={71} textAnchor="middle" fontSize={8} fontWeight={700} fill="white" fontFamily="monospace">
                    {(project?.customer || 'Customer').slice(0, 8)}
                  </text>
                  <text x={lx + 26} y={83} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.7)" fontFamily="monospace">CUSTOMER</text>
                </g>
              )
            })()}

            {/* Sawtooth timeline */}
            {totalLT > 0 && (() => {
              const TL_Y = hasExpanded ? 440 : 260
              const TL_W = Math.max(2, CANVAS_W - 160)
              let pos = 80
              return (
                <g>
                  <line x1={80} y1={TL_Y + 20} x2={CANVAS_W - 60} y2={TL_Y + 20} stroke="#D1D5DB" strokeWidth={1} />
                  {steps.flatMap((s: any, i: number) => {
                    const ctW   = totalLT > 0 ? (ctSeconds(s) / totalLT) * TL_W : 0
                    const waitW = totalLT > 0 ? ((s.wait_time || 0) / totalLT) * TL_W : 0
                    const cf    = s.va_type === 'va' ? BRAND : s.va_type === 'nva' ? RED : AMBER
                    const els: any[] = []
                    if (ctW > 0) {
                      els.push(
                        <g key={`ct-${i}`}>
                          <line x1={pos} y1={TL_Y + 20} x2={pos} y2={TL_Y} stroke={cf} strokeWidth={1} />
                          <line x1={pos} y1={TL_Y} x2={pos + ctW} y2={TL_Y} stroke={cf} strokeWidth={3} />
                          <line x1={pos + ctW} y1={TL_Y} x2={pos + ctW} y2={TL_Y + 20} stroke={cf} strokeWidth={1} />
                          {ctW > 20 && <text x={pos + ctW / 2} y={TL_Y - 4} textAnchor="middle" fontSize={7} fill={cf} fontFamily="monospace">{fmtTime(ctSeconds(s))}</text>}
                        </g>
                      )
                      pos += ctW
                    }
                    if (waitW > 0) {
                      els.push(
                        <g key={`wt-${i}`}>
                          <line x1={pos} y1={TL_Y + 20} x2={pos} y2={TL_Y + 32} stroke="#D1D5DB" strokeWidth={1} />
                          <line x1={pos} y1={TL_Y + 32} x2={pos + waitW} y2={TL_Y + 32} stroke="#D1D5DB" strokeWidth={2} />
                          <line x1={pos + waitW} y1={TL_Y + 32} x2={pos + waitW} y2={TL_Y + 20} stroke="#D1D5DB" strokeWidth={1} />
                          {waitW > 20 && <text x={pos + waitW / 2} y={TL_Y + 44} textAnchor="middle" fontSize={7} fill="#9CA3AF" fontFamily="monospace">{fmtTime(s.wait_time || 0)}</text>}
                        </g>
                      )
                      pos += waitW
                    }
                    return els
                  })}
                  <text x={CANVAS_W / 2} y={TL_Y + 58} textAnchor="middle" fontSize={9} fill="#6B7280" fontFamily="monospace">
                    {t?.cycleTime || 'CT'}: {fmtTime(totalCT)} · Wait: {fmtTime(totalWait)} · Lead Time: {fmtTime(totalLT)} · PCE: {fmtPCE(pce)}
                  </text>
                  {taktTime > 0 && (() => {
                    const tx = 80 + (taktTime / totalLT) * TL_W
                    return (
                      <g>
                        <line x1={tx} y1={TL_Y - 30} x2={tx} y2={TL_Y + 50} stroke={RED} strokeWidth={1.2} strokeDasharray="5 3" opacity={0.6} />
                        <text x={tx + 4} y={TL_Y - 20} fontSize={8} fill={RED} fontFamily="monospace">Takt={fmtTime(taktTime)}</text>
                      </g>
                    )
                  })()}
                </g>
              )
            })()}

            {/* Add step button */}
            {(() => {
              const x = 80 + steps.length * (BOX_W + GAP)
              return (
                <g style={{ cursor: 'pointer' }} onClick={() => onAddStep(steps.length - 1)}>
                  <rect x={x} y={80 + BOX_H / 2 - 19} width={42} height={38} rx={8}
                    fill="white" stroke={BRAND} strokeWidth={1.5} strokeDasharray="4 2"
                    style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.1))' }} />
                  <text x={x + 21} y={80 + BOX_H / 2 + 8} textAnchor="middle" fontSize={24} fill={BRAND} fontWeight={300}>+</text>
                </g>
              )
            })()}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default V2MapCanvas
