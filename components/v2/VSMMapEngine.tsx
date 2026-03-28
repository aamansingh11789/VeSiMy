// @ts-nocheck
// ── components/v2/VSMMapEngine.tsx ────────────────────────────────────────────
// Interactive ISO-standard VSM map. Auto-renders symbols from step data.
// User never places symbols — they click steps to edit via popup.
// Standard symbols: ISO 22468:2020, TPS, ASME Y14.3
'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────
const STEP_W = 120
const STEP_H = 80
const DATA_H = 60
const COL_GAP = 100   // horizontal gap between steps
const ROW_Y = 120     // y-position of step boxes
const DATA_Y = ROW_Y + STEP_H + 10   // data box y
const TIMELINE_Y = DATA_Y + DATA_H + 20
const CANVAS_H = TIMELINE_Y + 80
const BRAND = '#0176D3'
const RED = '#C0402A'
const GREEN = '#2E844A'
const AMBER = '#F4A623'
const INK = '#242220'
const PAPER = '#F8F6F0'
const RULE = '#D8D5CE'

// ── Colour by step type ───────────────────────────────────────────────────────
function stepColor(type: string, isBottleneck: boolean) {
  if (isBottleneck) return { fill: '#FEE2E2', stroke: RED, text: '#7F1D1D' }
  switch (type) {
    case 'decision':   return { fill: '#EEF4FB', stroke: BRAND, text: '#0a5eaa' }
    case 'delay':      return { fill: '#FEF3C7', stroke: AMBER, text: '#78350F' }
    case 'inspection': return { fill: '#F0FDF4', stroke: GREEN, text: '#14532D' }
    case 'transport':  return { fill: '#F5F3FF', stroke: '#6426A0', text: '#3b0764' }
    case 'storage':    return { fill: '#F0F9FF', stroke: '#0369A1', text: '#0c4a6e' }
    case 'start_end':  return { fill: '#1E293B', stroke: INK, text: '#F8FAFC' }
    default:           return { fill: '#fff', stroke: '#6B7280', text: INK }
  }
}

// ── Draw step symbol by type ──────────────────────────────────────────────────
function StepShape({ x, y, w, h, type, fill, stroke, isBottleneck }: any) {
  switch (type) {
    case 'decision':
      const mx = x + w/2, cy = y + h/2
      return <polygon points={`${mx},${y} ${x+w},${cy} ${mx},${y+h} ${x},${cy}`} fill={fill} stroke={stroke} strokeWidth={isBottleneck?2.5:1.5}/>
    case 'delay':
      return <path d={`M${x},${y} L${x+w-20},${y} Q${x+w},${cy} ${x+w-20},${y+h} L${x},${y+h} Z`} fill={fill} stroke={stroke} strokeWidth={isBottleneck?2.5:1.5}/>
    case 'inspection':
      return <ellipse cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} fill={fill} stroke={stroke} strokeWidth={isBottleneck?2.5:1.5}/>
    case 'start_end':
      return <rect x={x} y={y} width={w} height={h} rx={h/2} fill={fill} stroke={stroke} strokeWidth={1.5}/>
    default:
      return <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={isBottleneck?2.5:1.5}/>
  }
}

// ── Kaizen burst ─────────────────────────────────────────────────────────────
function KaizenBurst({ cx, cy }: { cx: number; cy: number }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 16
    const r = i % 2 === 0 ? 22 : 14
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
  return <polygon points={pts} fill="rgba(1,118,211,0.12)" stroke={BRAND} strokeWidth="1.5"/>
}

// ── WIP Triangle ─────────────────────────────────────────────────────────────
function WIPTriangle({ x, y, count }: { x: number; y: number; count: number }) {
  return (
    <g>
      <polygon points={`${x},${y} ${x+20},${y+28} ${x-20},${y+28}`}
        fill="white" stroke={INK} strokeWidth="1.5"/>
      <text x={x} y={y+22} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={INK} fontWeight="700">
        {count}
      </text>
    </g>
  )
}

// ── Missing info badge ────────────────────────────────────────────────────────
function MissingBadge({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={AMBER} stroke="white" strokeWidth="1.5"/>
      <text x={x} y={y+4} textAnchor="middle" fontSize="10" fill="white" fontWeight="800">!</text>
    </g>
  )
}

// ── Process Control box (governing entity) ────────────────────────────────────
function ProcessControlBox({ x, y, label }: { x: number; y: number; label: string }) {
  const w = Math.max(90, label.length * 6 + 20)
  return (
    <g>
      <rect x={x - w/2} y={y} width={w} height={26} rx={2} fill="white" stroke={INK} strokeWidth="1" strokeDasharray="4,3"/>
      <text x={x} y={y+16} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={INK}>{label}</text>
      {/* Dashed line down to step box */}
      <line x1={x} y1={y+26} x2={x} y2={ROW_Y} stroke={INK} strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export interface MapStep {
  id: string
  position: number
  name: string
  step_type: string
  tasks: string[]
  governing_entity: string
  department: string
  cycle_time?: number
  cycle_time_unit: string
  cycle_time_type: string
  wait_time?: number
  wip?: number
  defect_rate?: number
  uptime?: number
  operators?: number
  flow_type: string
  missing_info_flags: string[]
  notes: string
  toolData?: Record<string, any>
}

interface Props {
  steps: MapStep[]
  taktTime?: number
  onStepClick: (step: MapStep) => void
  onAddStep: (afterPosition: number) => void
  onDeleteStep: (stepId: string) => void
  bottleneckIds?: string[]
  analysisMode?: boolean
}

export function VSMMapEngine({
  steps, taktTime, onStepClick, onAddStep, onDeleteStep,
  bottleneckIds = [], analysisMode = false
}: Props) {
  const sorted = [...steps].sort((a, b) => a.position - b.position)
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null)

  // Canvas width: steps + gaps + margins
  const totalW = Math.max(900, sorted.length * (STEP_W + COL_GAP) + 200)

  // X position for each step
  function stepX(idx: number) {
    return 80 + idx * (STEP_W + COL_GAP)
  }

  // Takt line Y calculation (if cycle times exist)
  const maxCT = Math.max(...sorted.map(s => s.cycle_time || 0), 1)
  const chartH = 60
  function barH(ct: number) { return (ct / maxCT) * chartH }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'visible', width: '100%', position: 'relative' }}>
      <svg
        width={totalW}
        height={CANVAS_H + 20}
        style={{ display: 'block', fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Background ────────────────────────────────────────────── */}
        <rect x={0} y={0} width={totalW} height={CANVAS_H + 20} fill={PAPER}/>

        {/* ── SUPPLIER (left) ──────────────────────────────────────── */}
        <rect x={10} y={ROW_Y} width={54} height={STEP_H} rx={2}
          fill="#5B7FA6" stroke="#3A5A7C" strokeWidth="1.5"/>
        <polygon points={`10,${ROW_Y+18} 37,${ROW_Y} 64,${ROW_Y+18}`} fill="#4A6A8F"/>
        <text x={37} y={ROW_Y+STEP_H+16} textAnchor="middle" fontSize="9"
          fontFamily="monospace" fill={INK} fontWeight="700">SUPPLIER</text>

        {/* ── CUSTOMER (right) ─────────────────────────────────────── */}
        {sorted.length > 0 && (() => {
          const cx = stepX(sorted.length) + 20
          return (
            <g>
              <rect x={cx} y={ROW_Y} width={54} height={STEP_H} rx={2}
                fill="#5B7FA6" stroke="#3A5A7C" strokeWidth="1.5"/>
              <polygon points={`${cx},${ROW_Y+18} ${cx+27},${ROW_Y} ${cx+54},${ROW_Y+18}`} fill="#4A6A8F"/>
              <text x={cx+27} y={ROW_Y+STEP_H+16} textAnchor="middle" fontSize="9"
                fontFamily="monospace" fill={INK} fontWeight="700">CUSTOMER</text>
            </g>
          )
        })()}

        {/* ── STEPS ───────────────────────────────────────────────── */}
        {sorted.map((step, idx) => {
          const x = stepX(idx)
          const cx = x + STEP_W / 2
          const isBottleneck = bottleneckIds.includes(step.id) ||
            (taktTime && step.cycle_time && step.cycle_time > taktTime)
          const colors = stepColor(step.step_type, !!isBottleneck)
          const hasMissing = step.missing_info_flags?.length > 0
          const isHovered = hoveredStep === step.id
          const hasKaizen = step.toolData?.kaizen?.items?.some((k: any) => k.status !== 'complete')

          return (
            <g key={step.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => { setHoveredStep(null); setShowDeleteId(null) }}
              onClick={() => onStepClick(step)}
            >
              {/* Process Control box (governing entity) */}
              {step.governing_entity && (
                <ProcessControlBox
                  x={cx} y={ROW_Y - 50}
                  label={step.governing_entity.slice(0, 18)}
                />
              )}

              {/* Push arrow from previous */}
              {idx === 0 && (
                <line x1={64} y1={ROW_Y + STEP_H/2} x2={x} y2={ROW_Y + STEP_H/2}
                  stroke={INK} strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
              )}
              {idx > 0 && (
                <>
                  <line
                    x1={stepX(idx-1) + STEP_W} y1={ROW_Y + STEP_H/2}
                    x2={x} y2={ROW_Y + STEP_H/2}
                    stroke={step.flow_type === 'supermarket' ? BRAND : INK}
                    strokeWidth="1.5" strokeDasharray={step.flow_type === 'supermarket' ? '6,4' : 'none'}
                    markerEnd="url(#arrowhead)"
                  />
                  {/* WIP triangle */}
                  {(step.wip || 0) > 0 && (
                    <WIPTriangle x={stepX(idx-1) + STEP_W + COL_GAP/2} y={ROW_Y - 10} count={step.wip || 0}/>
                  )}
                  {/* Supermarket symbol */}
                  {step.flow_type === 'supermarket' && (
                    <g transform={`translate(${stepX(idx-1) + STEP_W + COL_GAP/2 - 12}, ${ROW_Y + STEP_H/2 - 14})`}>
                      {[0,8,16].map(i => (
                        <g key={i}>
                          <line x1={i} y1={0} x2={i} y2={28} stroke={BRAND} strokeWidth="2"/>
                          <line x1={i} y1={14} x2={i+6} y2={14} stroke={BRAND} strokeWidth="1.5"/>
                        </g>
                      ))}
                    </g>
                  )}
                </>
              )}

              {/* Step box */}
              <g style={{ filter: isHovered ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' : 'none',
                         transition: 'filter 0.15s' }}>
                <StepShape x={x} y={ROW_Y} w={STEP_W} h={STEP_H}
                  type={step.step_type} fill={colors.fill} stroke={colors.stroke}
                  isBottleneck={isBottleneck}/>

                {/* Step name */}
                <text x={cx} y={ROW_Y + (step.step_type === 'decision' ? STEP_H/2 - 4 : 28)}
                  textAnchor="middle" fontSize="11" fontWeight="700" fill={colors.text}
                  style={{ userSelect: 'none' }}>
                  {step.name.length > 16 ? step.name.slice(0, 15) + '…' : step.name}
                </text>

                {/* Department */}
                {step.department && (
                  <text x={cx} y={ROW_Y + 46} textAnchor="middle" fontSize="9" fill={colors.text} opacity="0.7">
                    {step.department.slice(0, 18)}
                  </text>
                )}

                {/* Operators */}
                {(step.operators || 0) > 0 && (
                  <g transform={`translate(${x + 6}, ${ROW_Y + STEP_H - 18})`}>
                    {Array.from({ length: Math.min(step.operators || 1, 5) }).map((_, i) => (
                      <circle key={i} cx={i * 12} cy={8} r={4}
                        fill="white" stroke={colors.stroke} strokeWidth="1.2"/>
                    ))}
                    {(step.operators || 0) > 5 && (
                      <text x={62} y={12} fontSize="8" fill={colors.text}>+{(step.operators||0)-5}</text>
                    )}
                  </g>
                )}

                {/* TAKT exceeded label */}
                {isBottleneck && taktTime && (
                  <text x={x + STEP_W - 4} y={ROW_Y + 12} textAnchor="end"
                    fontSize="8" fill={RED} fontWeight="700" fontFamily="monospace">▲TAKT</text>
                )}
              </g>

              {/* Data box below step */}
              <rect x={x} y={DATA_Y} width={STEP_W} height={DATA_H} rx={3}
                fill="white" stroke={RULE} strokeWidth="1"/>
              {[
                step.cycle_time ? `CT: ${step.cycle_time}${step.cycle_time_unit?.charAt(0) || 's'}` : 'CT: —',
                step.wait_time ? `Wait: ${step.wait_time}${step.cycle_time_unit?.charAt(0) || 's'}` : 'Wait: —',
                step.defect_rate ? `Defect: ${step.defect_rate}%` : '',
              ].filter(Boolean).map((label, li) => (
                <text key={li} x={x + 6} y={DATA_Y + 16 + li * 15}
                  fontSize="9" fontFamily="monospace" fill={li === 0 && isBottleneck ? RED : INK}>
                  {label}
                </text>
              ))}

              {/* Kaizen burst */}
              {hasKaizen && <KaizenBurst cx={x + STEP_W} cy={ROW_Y}/>}

              {/* Missing info badge */}
              {hasMissing && <MissingBadge x={x + STEP_W - 4} y={ROW_Y - 4}/>}

              {/* Hover controls */}
              {isHovered && (
                <g>
                  {/* Delete button */}
                  <g onClick={e => { e.stopPropagation(); onDeleteStep(step.id) }}
                    style={{ cursor: 'pointer' }}>
                    <circle cx={x - 10} cy={ROW_Y - 10} r="10" fill={RED} opacity="0.85"/>
                    <text x={x - 10} y={ROW_Y - 6} textAnchor="middle" fontSize="12" fill="white" fontWeight="700">×</text>
                  </g>
                  {/* Add step after */}
                  <g onClick={e => { e.stopPropagation(); onAddStep(step.position) }}
                    style={{ cursor: 'pointer' }}>
                    <circle cx={x + STEP_W + 10} cy={ROW_Y - 10} r="10" fill={GREEN} opacity="0.85"/>
                    <text x={x + STEP_W + 10} y={ROW_Y - 6} textAnchor="middle" fontSize="14" fill="white">+</text>
                  </g>
                </g>
              )}
            </g>
          )
        })}

        {/* ── TIMELINE (sawtooth) ──────────────────────────────────── */}
        {sorted.length > 0 && (() => {
          let tlX = 80
          const pathParts: string[] = []
          const labels: any[] = []
          sorted.forEach((step, idx) => {
            const cx = stepX(idx)
            const ct = step.cycle_time || 0
            const wt = step.wait_time || 0
            const ctPx = Math.max(6, (ct / (maxCT || 1)) * 50)
            const wtPx = Math.max(6, (wt / (maxCT || 1)) * 50)

            // CT bar (up from baseline)
            pathParts.push(`M${cx},${TIMELINE_Y} L${cx},${TIMELINE_Y - ctPx}`)
            labels.push({ x: cx + STEP_W/2, y: TIMELINE_Y - ctPx - 4,
              text: ct ? `${ct}${step.cycle_time_unit?.charAt(0)||'s'}` : '—',
              color: bottleneckIds.includes(step.id) ? RED : BRAND })

            // Wait line (down below baseline)
            if (idx < sorted.length - 1) {
              const nx = stepX(idx + 1)
              pathParts.push(`M${cx + STEP_W},${TIMELINE_Y} L${nx},${TIMELINE_Y}`)
              pathParts.push(`M${(cx + STEP_W + nx)/2},${TIMELINE_Y} L${(cx + STEP_W + nx)/2},${TIMELINE_Y + Math.max(4, (wt/(maxCT||1))*30)}`)
            }
          })

          return (
            <g>
              {/* Baseline */}
              <line x1={64} y1={TIMELINE_Y} x2={stepX(sorted.length) + 20}
                y2={TIMELINE_Y} stroke={RULE} strokeWidth="1.5"/>
              {/* Takt line */}
              {taktTime && (() => {
                const taktPx = Math.max(4, (taktTime / (maxCT||1)) * 50)
                return (
                  <g>
                    <line x1={64} y1={TIMELINE_Y - taktPx}
                      x2={stepX(sorted.length) + 20} y2={TIMELINE_Y - taktPx}
                      stroke={RED} strokeWidth="1" strokeDasharray="6,4" opacity="0.6"/>
                    <text x={stepX(sorted.length) + 24} y={TIMELINE_Y - taktPx + 4}
                      fontSize="8" fontFamily="monospace" fill={RED}>TAKT</text>
                  </g>
                )
              })()}
              {/* Path lines */}
              {pathParts.map((d, i) => (
                <path key={i} d={d} stroke={BRAND} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              ))}
              {/* CT labels */}
              {labels.map((l, i) => (
                <text key={i} x={l.x} y={l.y} textAnchor="middle"
                  fontSize="9" fontFamily="monospace" fill={l.color} fontWeight="600">
                  {l.text}
                </text>
              ))}
            </g>
          )
        })()}

        {/* ── Add first step (if empty) ────────────────────────────── */}
        {sorted.length === 0 && (
          <g onClick={() => onAddStep(-1)} style={{ cursor: 'pointer' }}>
            <rect x={stepX(0)} y={ROW_Y} width={STEP_W} height={STEP_H}
              rx={4} fill="white" stroke={BRAND} strokeWidth="2" strokeDasharray="8,5"/>
            <text x={stepX(0) + STEP_W/2} y={ROW_Y + STEP_H/2 - 4}
              textAnchor="middle" fontSize="22" fill={BRAND}>+</text>
            <text x={stepX(0) + STEP_W/2} y={ROW_Y + STEP_H/2 + 16}
              textAnchor="middle" fontSize="10" fill={BRAND}>Add first step</text>
          </g>
        )}

        {/* ── Add step at end button ───────────────────────────────── */}
        {sorted.length > 0 && (
          <g onClick={() => onAddStep(sorted[sorted.length-1].position)}
            style={{ cursor: 'pointer' }}>
            <circle cx={stepX(sorted.length) + 16} cy={ROW_Y + STEP_H/2}
              r="16" fill={GREEN} opacity="0.85"/>
            <text x={stepX(sorted.length) + 16} y={ROW_Y + STEP_H/2 + 5}
              textAnchor="middle" fontSize="20" fill="white">+</text>
          </g>
        )}

        {/* ── Defs ─────────────────────────────────────────────────── */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={INK}/>
          </marker>
        </defs>
      </svg>

      {/* ── Map legend ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, padding: '8px 12px', flexWrap: 'wrap',
        borderTop: `1px solid ${RULE}`, background: 'white', fontSize: 10, color: '#6B6760' }}>
        {[
          { color: '#6B7280', label: 'Process' },
          { color: BRAND,     label: 'Decision' },
          { color: AMBER,     label: 'Delay' },
          { color: GREEN,     label: 'Inspection' },
          { color: '#6426A0', label: 'Transport' },
          { color: RED,       label: 'Bottleneck ▲ Takt' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, opacity: 0.8 }}/>
            <span style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{l.label}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', opacity: 0.5 }}>ISO 22468 · TPS · ASME Y14.3</span>
      </div>
    </div>
  )
}
