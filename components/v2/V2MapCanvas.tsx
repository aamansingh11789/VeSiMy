// TypeScript enabled
'use client'
// ── components/v2/V2MapCanvas.tsx ──────────────────────────────────────────────
// Pro canvas redesign — REAL sticky note aesthetic per spec §5.2
// Physical paper feel: rotation, warm tones, multi-layer shadow, fold corner

import React, { useState, useRef, useEffect } from 'react'
import { VSMIcon } from '@/components/ui/Icons'
import { BRAND, RED, GREEN, AMBER } from './v2-constants'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds, fmtSeconds } from '@/lib/v2/cycle-time-utils'

// ── Natural sticky note palette per spec §5.2 ─────────────────────────────────
// "Color range limited to natural sticky note palette only. No bright digital
//  colors. Muted, natural tones." — each has paper bg, fold shade, text color
const STICKY: Record<string, { bg: string; fold: string; text: string; stripe: string }> = {
  process:    { bg: '#FEF3C7', fold: '#FDE68A', text: '#3B2F00', stripe: '#F59E0B' }, // warm yellow
  sub_process:{ bg: '#DBEAFE', fold: '#BFDBFE', text: '#1E3A5F', stripe: '#3B82F6' }, // soft blue
  decision:   { bg: '#FED7AA', fold: '#FDBA74', text: '#3D1700', stripe: '#F97316' }, // warm orange
  inspection: { bg: '#FCE7F3', fold: '#FBCFE8', text: '#4A1535', stripe: '#EC4899' }, // soft pink
  transport:  { bg: '#D1FAE5', fold: '#A7F3D0', text: '#064E3B', stripe: '#10B981' }, // soft green
  storage:    { bg: '#EDE9FE', fold: '#DDD6FE', text: '#2E1065', stripe: '#7C3AED' }, // soft lavender
  rework:     { bg: '#FEE2E2', fold: '#FECACA', text: '#450A0A', stripe: '#EF4444' }, // soft red
  delay:      { bg: '#F3F4F6', fold: '#E5E7EB', text: '#111827', stripe: '#9CA3AF' }, // neutral
  start_end:  { bg: '#ECEFF1', fold: '#CFD8DC', text: '#1A2832', stripe: '#607D8B' }, // grey-blue
}

// Slight rotation per step index — alternating pattern feels physical, not random
const NOTE_ROTATIONS = [1.2, -0.8, 1.5, -1.1, 0.7, -1.4, 1.0, -0.6, 1.8, -1.2]
function noteRotation(index: number): number {
  return NOTE_ROTATIONS[index % NOTE_ROTATIONS.length]
}

const BOX_W  = 160   // wider for content
const BOX_H  = 96    // taller for real sticky note feel
const BOX_H_EXP = 186 // expanded with activities + data strip
const STRIP_H = 52
const GAP    = 76

function fmtTime(s: number) {
  if (!s) return '—'
  if (s >= 3600) return `${(s / 3600).toFixed(1)}h`
  if (s >= 60)   return `${(s / 60).toFixed(1)}m`
  return `${Math.round(s)}s`
}

// ── Floating stopwatch ─────────────────────────────────────────────────────────
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
        STOPWATCH: {stepName.slice(0, 18)}
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
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={toggle} style={{ flex: 1, background: running ? '#DC2626' : '#3B7CFF', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 0', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          {running ? '⏹ Stop' : laps.length === 0 ? '▶ Start' : '▶ Lap'}
        </button>
        {laps.length >= 1 && !running && (
          <button onClick={() => onSave(avg, laps.length)} style={{ flex: 1, background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 0', fontWeight: 700, cursor: 'pointer', fontSize: 11 }}>
            Save {avg}s avg
          </button>
        )}
      </div>
      <button onClick={onClose} style={{ width: '100%', marginTop: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#4B5880', padding: '5px 0', cursor: 'pointer', fontSize: 11 }}>
        Close
      </button>
    </div>
  )
}

// ── REAL STICKY NOTE STEP BOX ─────────────────────────────────────────────────
// Spec §5.2: "Slightly textured surface. Subtle drop shadow. Feels like it is
// physically on a wall. Color-coded by process type. Natural sticky note palette."
function StickyStepBox({ step, index, isSelected, onClick, t, expanded, onToggleExpand, taktTime, onStopwatch }: any) {
  const sc    = STICKY[step.step_type || 'process'] || STICKY.process
  const ct    = ctSeconds(step)
  const isBot = step.is_bottleneck || (taktTime > 0 && ct > taktTime)
  const defect = step.defect_rate || 0
  const missing = (step.missing_info_flags || []).length
  const healthColor = isBot ? RED : defect > 5 ? RED : missing > 2 ? AMBER : step.va_type === 'va' ? GREEN : '#9CA3AF'
  const vaLabel = { va: 'VA', nnva: 'NNVA', nva: 'NVA' }[step.va_type as string] || '?'
  const vaColor = { va: GREEN, nnva: AMBER, nva: RED }[step.va_type as string] || '#9CA3AF'

  const H   = expanded ? BOX_H_EXP : BOX_H
  const X   = 80 + index * (BOX_W + GAP)
  const Y   = 90
  const cx  = X + BOX_W / 2   // rotation center x
  const cy  = Y + H / 2        // rotation center y
  const rot = noteRotation(index)

  // Activities (op_steps or fallback)
  const activities: string[] = step.op_steps || []
  const maxActivities = 4

  // Paper texture — subtle diagonal lines for warmth
  const textureId = `tex-${step.id}`
  const shadowId  = `shadow-${step.id}`

  return (
    <g
      transform={`rotate(${rot}, ${cx}, ${cy})`}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={`${step.name}${isBot ? ' [BOTTLENECK]' : ''}`}
      aria-pressed={isSelected}
      onClick={() => onClick(step)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(step) } }}
    >
      <defs>
        {/* Paper texture pattern */}
        <pattern id={textureId} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`rotate(35,${X},${Y})`}>
          <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(0,0,0,0.025)" strokeWidth="1"/>
        </pattern>
        {/* Multi-layer drop shadow filter : physical paper on wall */}
        <filter id={shadowId} x="-15%" y="-15%" width="140%" height="150%">
          {/* Layer 1: tight contact shadow */}
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.18)" />
          {/* Layer 2: soft ambient shadow */}
          <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.12)" />
          {/* Layer 3: wide diffuse shadow */}
          <feDropShadow dx="5" dy="10" stdDeviation="12" floodColor="rgba(0,0,0,0.07)" />
        </filter>
      </defs>

      {/* Selection / bottleneck glow : outside the note */}
      {(isSelected || isBot) && (
        <rect
          x={X - 4} y={Y - 4} width={BOX_W + 8} height={H + 8} rx={5}
          fill="none"
          stroke={isBot ? RED : BRAND}
          strokeWidth={isBot ? 2.5 : 2}
          opacity={0.7}
          style={{ filter: `drop-shadow(0 0 8px ${isBot ? RED : BRAND}80)`, animation: isBot ? 'stickyPulse 1.4s ease-in-out infinite' : 'none' }}
        />
      )}

      {/* ── NOTE BODY with physical shadow ── */}
      <rect
        x={X} y={Y} width={BOX_W} height={H} rx={3}
        fill={sc.bg}
        filter={`url(#${shadowId})`}
      />

      {/* Paper texture overlay */}
      <rect x={X} y={Y} width={BOX_W} height={H} rx={3} fill={`url(#${textureId})`} opacity={0.5} />

      {/* Subtle warm gradient overlay : gives depth to the paper */}
      <defs>
        <linearGradient id={`grad-${step.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.30)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.00)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.04)" />
        </linearGradient>
      </defs>
      <rect x={X} y={Y} width={BOX_W} height={H} rx={3} fill={`url(#grad-${step.id})`} />

      {/* Fold corner : top right */}
      <path
        d={`M${X + BOX_W - 18},${Y} L${X + BOX_W},${Y + 18} L${X + BOX_W - 18},${Y + 18} Z`}
        fill={sc.fold}
        opacity={0.6}
      />
      {/* Fold shadow line */}
      <line x1={X + BOX_W - 18} y1={Y} x2={X + BOX_W} y2={Y + 18} stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />

      {/* Color accent stripe : left edge, type indicator */}
      <rect x={X} y={Y} width={4} height={H} rx={3} fill={sc.stripe} opacity={0.75} />

      {/* ── STEP NAME ── */}
      <text
        x={X + 14} y={Y + 18}
        fontSize={10} fontWeight={700}
        fill={sc.text}
        fontFamily="'Satoshi','DM Sans',sans-serif"
        style={{ pointerEvents: 'none' }}
      >
        {step.name.length > 18 ? step.name.slice(0, 17) + '…' : step.name}
      </text>

      {/* ── CT + WIP LINE (always visible) ── */}
      <text x={X + 14} y={Y + 33} fontSize={8} fill={sc.text} fontFamily="'JetBrains Mono',monospace" opacity={0.85}>
        {ct ? `CT: ${fmtTime(ct)}` : 'CT: tap ⏱'}
        {step.wip ? `  WIP: ${step.wip}` : ''}
      </text>

      {/* ── OPERATOR ICON + COUNT ── */}
      <text x={X + 14} y={Y + 46} fontSize={8} fill={sc.text} fontFamily="'Satoshi',sans-serif" opacity={0.7}>
        {'👤'.repeat(0)}{step.operators ? `× ${step.operators} op` : ''}
        {step.wait_time ? `  ⏳ ${fmtTime(step.wait_time)}` : ''}
      </text>

      {/* ── VA BADGE ── */}
      <rect x={X + BOX_W - 36} y={Y + H - 18} width={30} height={13} rx={3}
        fill={vaColor} opacity={0.18} />
      <text x={X + BOX_W - 21} y={Y + H - 8} fontSize={7.5} fontWeight={700}
        fill={vaColor} textAnchor="middle" fontFamily="monospace">
        {vaLabel}
      </text>

      {/* ── HEALTH DOT ── */}
      <circle cx={X + BOX_W - 10} cy={Y + 10} r={5} fill={healthColor} opacity={0.9}
        style={{ filter: `drop-shadow(0 0 4px ${healthColor}90)` }} />

      {/* ── BOTTLENECK BADGE ── */}
      {isBot && (
        <g>
          <rect x={X + 14} y={Y + H - 18} width={44} height={13} rx={3} fill={RED} opacity={0.15} />
          <text x={X + 36} y={Y + H - 8} fontSize={6.5} fontWeight={700}
            fill={RED} textAnchor="middle" fontFamily="monospace">
            ▲ BOTTLENECK
          </text>
        </g>
      )}

      {/* ── STOPWATCH TAP TARGET ── */}
      <rect
        x={X + BOX_W - 32} y={Y + 38} width={26} height={18} rx={4}
        fill="rgba(255,255,255,0.5)"
        stroke={sc.stripe} strokeWidth={0.8} strokeOpacity={0.4}
        style={{ cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); onStopwatch(step) }}
      />
      <text x={X + BOX_W - 19} y={Y + 50} fontSize={11} textAnchor="middle" fill={sc.text}>⏱</text>

      {/* ── EXPANDED: Activity list + Data strip ── */}
      {expanded && (
        <g>
          {/* Separator line */}
          <line x1={X + 12} y1={Y + 58} x2={X + BOX_W - 12} y2={Y + 58}
            stroke={sc.fold} strokeWidth={1} opacity={0.6} />

          {/* Activity header */}
          <text x={X + 14} y={Y + 70} fontSize={7.5} fontWeight={700}
            fill={sc.text} fontFamily="monospace" opacity={0.6} letterSpacing={1}>
            ACTIVITIES
          </text>

          {/* Activity items : bullet list inside the note */}
          {activities.length === 0 ? (
            <text x={X + 14} y={Y + 84} fontSize={8} fill={sc.text} opacity={0.45}
              fontFamily="'Satoshi',sans-serif" fontStyle="italic">
              No activities added
            </text>
          ) : (
            activities.slice(0, maxActivities).map((act: string, ai: number) => (
              <g key={ai}>
                <circle cx={X + 18} cy={Y + 82 + ai * 14} r={2} fill={sc.stripe} opacity={0.7} />
                <text x={X + 26} y={Y + 86 + ai * 14} fontSize={8}
                  fill={sc.text} fontFamily="'Satoshi',sans-serif" opacity={0.8}>
                  {act.length > 20 ? act.slice(0, 19) + '…' : act}
                </text>
              </g>
            ))
          )}
          {activities.length > maxActivities && (
            <text x={X + 14} y={Y + 82 + maxActivities * 14} fontSize={7}
              fill={sc.stripe} fontFamily="monospace">
              +{activities.length - maxActivities} more…
            </text>
          )}

          {/* Data strip : below the note body, attached */}
          <g>
            <rect x={X} y={Y + BOX_H_EXP} width={BOX_W} height={STRIP_H}
              fill="rgba(255,255,255,0.92)"
              stroke={sc.fold} strokeWidth={1} rx={3}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
            />
            {[
              { label: 'CT',     val: ct ? fmtTime(ct) : '—',                           x: X + 6  },
              { label: 'WAIT',   val: step.wait_time ? fmtTime(step.wait_time) : '—',    x: X + 44 },
              { label: 'UPTIME', val: step.uptime ? `${step.uptime}%` : '—',             x: X + 86 },
              { label: 'DEFECT', val: step.defect_rate ? `${step.defect_rate}%` : '—',   x: X + 126 },
            ].map(({ label, val, x }) => (
              <g key={label}>
                <text x={x} y={Y + BOX_H_EXP + 14} fontSize={6} fill="#9CA3AF" fontFamily="monospace" letterSpacing={0.5}>{label}</text>
                <text x={x} y={Y + BOX_H_EXP + 28} fontSize={10} fontWeight={700} fill="#374151" fontFamily="'JetBrains Mono',monospace">{val}</text>
              </g>
            ))}
            <text x={X + 6} y={Y + BOX_H_EXP + 44} fontSize={7} fill="#9CA3AF" fontFamily="monospace">
              Ops: {step.operators || '—'}  Dept: {step.department ? step.department.slice(0, 12) : '—'}
            </text>
            {step.lap_count && (
              <text x={X + BOX_W - 6} y={Y + BOX_H_EXP + 44} fontSize={7} fill={BRAND}
                textAnchor="end" fontFamily="monospace">
                {step.lap_count} laps
              </text>
            )}
          </g>
        </g>
      )}

      {/* ── EXPAND TOGGLE (below the note) ── */}
      <text
        x={X + BOX_W / 2} y={Y + H + (expanded ? STRIP_H : 0) + 14}
        fontSize={8} textAnchor="middle" fill="#9CA3AF"
        style={{ cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); onToggleExpand(step.id) }}>
        {expanded ? '▲ collapse' : '▼ expand'}
      </text>
    </g>
  )
}

// ── Flow arrows ────────────────────────────────────────────────────────────────
function FlowArrow({ fromX, toX, flowType, wip, onWipChange, onFlowTypeChange }: any) {
  const [editing, setEditing] = React.useState(false)
  const [wipVal,  setWipVal]  = React.useState(wip)
  const midX = (fromX + BOX_W + toX) / 2
  const Y    = 90 + BOX_H / 2
  const isPull = flowType === 'supermarket' || flowType === 'fifo' || flowType === 'pull'
  const isSM   = flowType === 'supermarket'

  const FLOW_CYCLE = ['push', 'pull', 'supermarket', 'fifo']

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
        stroke={isPull ? BRAND : '#B0BEC5'}
        strokeWidth={isPull ? 2 : 1.5}
        markerEnd={`url(#arrowhead-${fromX})`}
      />
      {/* Supermarket symbol */}
      {isSM && (
        <g>
          <rect x={midX - 10} y={Y - 18} width={20} height={14} fill="none" stroke={BRAND} strokeWidth={1.5} rx={2} />
          <text x={midX} y={Y - 8} textAnchor="middle" fontSize={6} fill={BRAND} fontFamily="monospace" fontWeight={700}>SM</text>
        </g>
      )}
      {/* Flow type toggle */}
      <g style={{ cursor: 'pointer' }} onClick={() => onFlowTypeChange && onFlowTypeChange(
        FLOW_CYCLE[(FLOW_CYCLE.indexOf(flowType) + 1) % FLOW_CYCLE.length]
      )}>
        <rect x={midX - 14} y={Y + 14} width={28} height={12} rx={3}
          fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.10)" strokeWidth={0.5} />
        <text x={midX} y={Y + 23} textAnchor="middle" fontSize={6.5} fontFamily="monospace"
          fill={isPull ? BRAND : '#9CA3AF'} fontWeight={700}>{(flowType || 'PUSH').toUpperCase().slice(0,4)}</text>
      </g>
      {/* WIP bubble : click to edit */}
      {!editing ? (
        <g style={{ cursor: 'pointer' }} onClick={() => setEditing(true)}>
          <circle cx={midX} cy={Y} r={12} fill="#FEF3C7" stroke={AMBER} strokeWidth={1.5} />
          <text x={midX} y={Y + 4} textAnchor="middle" fontSize={wip > 0 ? 9 : 8} fontWeight={wip > 0 ? 700 : 400}
            fill={wip > 0 ? AMBER : '#C0B080'} fontFamily="monospace">{wip > 0 ? wip : '+'}</text>
        </g>
      ) : (
        <foreignObject x={midX - 16} y={Y - 14} width={32} height={28}>
          <input
            xmlns="http://www.w3.org/1999/xhtml"
            type="number"
            defaultValue={wipVal}
            autoFocus
            min={0} max={999}
            style={{
              width: '100%', height: '100%', textAlign: 'center', fontFamily: 'monospace',
              fontSize: 11, fontWeight: 700, color: '#3B2F00', background: '#FEF3C7',
              border: '1.5px solid #F59E0B', borderRadius: 12, outline: 'none', padding: 0,
            }}
            onChange={e => setWipVal(Number(e.target.value))}
            onBlur={e => {
              setEditing(false)
              if (onWipChange) onWipChange(Number(e.target.value))
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                setEditing(false)
                if (onWipChange) onWipChange(wipVal)
              }
            }}
          />
        </foreignObject>
      )}
    </g>
  )
}

// ── Phase lane ─────────────────────────────────────────────────────────────────
function PhaseLane({ phase, startX, endX, canvasH }: { phase: number; startX: number; endX: number; canvasH: number }) {
  const LABELS = ['Wall Session', 'Floor Observation', 'Analysis', 'Improvement']
  const COLORS = ['rgba(1,118,211,0.04)', 'rgba(29,209,161,0.04)', 'rgba(244,166,35,0.04)', 'rgba(140,68,204,0.04)']
  const TEXT   = [BRAND, '#1DD1A1', AMBER, '#8C44CC']
  if (phase < 1) return null
  return (
    <g>
      <rect x={startX} y={0} width={endX - startX} height={canvasH}
        fill={COLORS[phase - 1] || 'transparent'} />
      <text x={startX + 6} y={14} fontSize={8} fontWeight={700}
        fill={TEXT[phase - 1] || '#aaa'} fontFamily="monospace" opacity={0.8}>
        PHASE {phase}: {LABELS[phase - 1]?.toUpperCase()}
      </text>
    </g>
  )
}

// ── Main canvas ────────────────────────────────────────────────────────────────
export function V2MapCanvas({ steps, project, selectedStepId, onStepClick, onAddStep, t, onSaveStopwatch }: any) {
  const [pan,           setPan]           = useState({ x: 0, y: 0 })
  const [zoom,          setZoom]          = useState(1)
  const [isDragging,    setIsDragging]    = useState(false)
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})
  const [swStep,        setSwStep]        = useState<any>(null)

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

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      setZoom(z => Math.min(Math.max(z + (e.deltaY > 0 ? -0.1 : 0.1), 0.25), 3))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    dragging.current = true; didDrag.current = false
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
    const tt = e.touches[0]
    dragging.current = true; didDrag.current = false
    dragStart.current = { x: tt.clientX, y: tt.clientY }
    lastPos.current   = { x: tt.clientX, y: tt.clientY }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || e.touches.length !== 1) return
    e.preventDefault()
    const tt = e.touches[0]
    const dx = tt.clientX - lastPos.current.x; const dy = tt.clientY - lastPos.current.y
    if (Math.abs(tt.clientX - dragStart.current.x) > 4 || Math.abs(tt.clientY - dragStart.current.y) > 4) didDrag.current = true
    setPan(p => ({ x: p.x + dx, y: p.y + dy }))
    lastPos.current = { x: tt.clientX, y: tt.clientY }
  }
  const onTouchEnd = () => { dragging.current = false }

  const { totalCT, totalWait, leadTime: totalLT, pce, takt: taktCalc, missingCTCount: missingCount } =
    calcProcessMetrics(steps, project)
  const taktTime = taktCalc ?? 0

  const hasExpanded  = Object.values(expandedSteps).some(Boolean)
  const CANVAS_W = Math.max(1100, 80 + steps.length * (BOX_W + GAP) + 240)
  const CANVAS_H = hasExpanded ? 640 : 420

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: '#F5F4F1', color: 'var(--text3)' }}>
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
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#F5F4F1' }}>
      <style>{`
        @keyframes stickyPulse { 0%,100%{opacity:0.6;stroke-width:2} 50%{opacity:1;stroke-width:3} }
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
          <div key={label} style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, padding: '4px 10px', textAlign: 'center', backdropFilter: 'blur(4px)', pointerEvents: 'all', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 7, fontFamily: 'monospace', color: '#9CA3AF', letterSpacing: 1 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: color || '#1F2937' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Expand/collapse */}
      <div style={{ position: 'absolute', top: 54, left: 12, zIndex: 20, display: 'flex', gap: 4 }}>
        {[
          { label: 'EXPAND ALL',  fn: expandAll  },
          { label: 'COLLAPSE',    fn: collapseAll },
        ].map(({ label, fn }) => (
          <button key={label} onClick={fn} style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 1, padding: '3px 8px', border: '1px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.92)', cursor: 'pointer', color: '#374151', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
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

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 12, right: 14, zIndex: 20, display: 'flex', gap: 6 }}>
        {[{ color: GREEN, label: 'VA' }, { color: AMBER, label: 'NNVA' }, { color: RED, label: 'NVA' }].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#374151', background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 4, padding: '2px 7px' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Zoom % */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 20, fontSize: 9, fontFamily: 'monospace', color: '#9CA3AF' }}>
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
              {/* Subtle cork/linen background texture */}
              <pattern id="board-dot" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="#C8B89A" opacity="0.35" />
              </pattern>
            </defs>

            {/* Board background : warm off-white, like a physical whiteboard */}
            <rect width={CANVAS_W} height={CANVAS_H} fill="#F5F4F1" />
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#board-dot)" />

            {/* Phase lane */}
            {project?.phase && (
              <PhaseLane phase={project.phase} startX={0} endX={CANVAS_W} canvasH={CANVAS_H} />
            )}

            {/* Supplier block */}
            <rect x={12} y={68} width={56} height={48} fill="#607D8B" stroke="#455A64" strokeWidth={1.5} rx={4}
              style={{ filter: 'drop-shadow(1px 3px 5px rgba(0,0,0,0.2))' }} />
            <text x={40} y={85} textAnchor="middle" fontSize={8} fontWeight={700} fill="white" fontFamily="monospace">
              {(project?.supplier || 'Supplier').slice(0, 8)}
            </text>
            <text x={40} y={98} textAnchor="middle" fontSize={6.5} fill="rgba(255,255,255,0.7)" fontFamily="monospace">SUPPLIER</text>
            {steps.length > 0 && (
              <>
                <defs>
                  <marker id="arr-supp" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
                    <polygon points="0 0,6 2,0 4" fill="#607D8B" />
                  </marker>
                </defs>
                <line x1={68} y1={90 + BOX_H / 2} x2={82} y2={90 + BOX_H / 2}
                  stroke="#B0BEC5" strokeWidth={1.5} markerEnd="url(#arr-supp)" />
              </>
            )}

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

            {/* Flow arrows */}
            {steps.slice(0, -1).map((_: any, i: number) => (
              <FlowArrow
                key={`arr-${i}`}
                fromX={80 + i * (BOX_W + GAP)}
                toX={80 + (i + 1) * (BOX_W + GAP)}
                flowType={steps[i + 1]?.flow_type || 'push'}
                wip={steps[i + 1]?.wip || 0}
                onWipChange={(val: number) => {
                  const step = steps[i + 1]
                  if (step && onStepClick) {
                    const updated = { ...step, wip: val }
                    // Optimistic local update via parent
                    onStepClick({ ...updated, _wipUpdate: true })
                  }
                }}
                onFlowTypeChange={(ft: string) => {
                  const step = steps[i + 1]
                  if (step && onStepClick) {
                    onStepClick({ ...step, flow_type: ft, _flowUpdate: true })
                  }
                }}
              />
            ))}

            {/* Customer block */}
            {steps.length > 0 && (() => {
              const lx = 80 + (steps.length - 1) * (BOX_W + GAP) + BOX_W + 18
              return (
                <g>
                  <rect x={lx} y={68} width={56} height={48} fill="#607D8B" stroke="#455A64" strokeWidth={1.5} rx={4}
                    style={{ filter: 'drop-shadow(1px 3px 5px rgba(0,0,0,0.2))' }} />
                  <text x={lx + 28} y={85} textAnchor="middle" fontSize={8} fontWeight={700} fill="white" fontFamily="monospace">
                    {(project?.customer || 'Customer').slice(0, 8)}
                  </text>
                  <text x={lx + 28} y={98} textAnchor="middle" fontSize={6.5} fill="rgba(255,255,255,0.7)" fontFamily="monospace">CUSTOMER</text>
                </g>
              )
            })()}

            {/* Sawtooth timeline */}
            {totalLT > 0 && (() => {
              const TL_Y = hasExpanded ? 500 : 310
              const TL_W = Math.max(2, CANVAS_W - 180)
              let pos = 80
              return (
                <g>
                  <line x1={80} y1={TL_Y + 20} x2={CANVAS_W - 80} y2={TL_Y + 20} stroke="#D4C9B8" strokeWidth={1.5} />
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
                          <line x1={pos} y1={TL_Y + 20} x2={pos} y2={TL_Y + 32} stroke="#D4C9B8" strokeWidth={1} />
                          <line x1={pos} y1={TL_Y + 32} x2={pos + waitW} y2={TL_Y + 32} stroke="#D4C9B8" strokeWidth={2} />
                          <line x1={pos + waitW} y1={TL_Y + 32} x2={pos + waitW} y2={TL_Y + 20} stroke="#D4C9B8" strokeWidth={1} />
                          {waitW > 20 && <text x={pos + waitW / 2} y={TL_Y + 44} textAnchor="middle" fontSize={7} fill="#9CA3AF" fontFamily="monospace">{fmtTime(s.wait_time || 0)}</text>}
                        </g>
                      )
                      pos += waitW
                    }
                    return els
                  })}
                  <text x={CANVAS_W / 2} y={TL_Y + 60} textAnchor="middle" fontSize={9} fill="#9CA3AF" fontFamily="monospace">
                    CT: {fmtTime(totalCT)} · Wait: {fmtTime(totalWait)} · Lead Time: {fmtTime(totalLT)} · PCE: {fmtPCE(pce)}
                  </text>
                  {taktTime > 0 && (() => {
                    const tx = 80 + (taktTime / totalLT) * TL_W
                    return (
                      <g>
                        <line x1={tx} y1={TL_Y - 30} x2={tx} y2={TL_Y + 50} stroke={RED} strokeWidth={1.2} strokeDasharray="5 3" opacity={0.5} />
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
                  <rect x={x} y={90 + BOX_H / 2 - 22} width={48} height={44} rx={8}
                    fill="rgba(255,255,255,0.9)" stroke={BRAND} strokeWidth={1.5} strokeDasharray="5 3"
                    style={{ filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.10))' }} />
                  <text x={x + 24} y={90 + BOX_H / 2 + 10} textAnchor="middle" fontSize={26} fill={BRAND} fontWeight={300}>+</text>
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
