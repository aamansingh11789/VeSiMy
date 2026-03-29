// @ts-nocheck
'use client'
import React from 'react'
import { BRAND, RED, GREEN, AMBER } from './v2-constants'
// ── components/v2/V2MapCanvas.tsx ──────────────────────────────────────────────
// Interactive SVG VSM map canvas.
// All ISO 22468 / TPS / lean standard symbols.
// Symbols auto-appear based on data — user never places them manually.
// Click any step → panel opens. Amber badges on incomplete steps.

import { useState, useRef, useCallback, useEffect } from 'react'


// ── ISO/TPS/Lean standard symbol definitions ───────────────────────────────
const STEP_SYMBOLS: Record<string, { shape: string; fill: string; stroke: string; label: string }> = {
  process:    { shape: 'rect',     fill: '#EEF4FB', stroke: BRAND,  label: 'Process Operation'  },
  decision:   { shape: 'diamond',  fill: '#FEF9E7', stroke: AMBER,  label: 'Decision / Check'   },
  delay:      { shape: 'delay',    fill: '#FEF0ED', stroke: RED,    label: 'Delay / Wait'       },
  inspection: { shape: 'circle',   fill: '#E6F7F3', stroke: GREEN,  label: 'Inspection / QC'    },
  transport:  { shape: 'arrow',    fill: '#F8F6F0', stroke: '#666', label: 'Transport / Move'   },
  storage:    { shape: 'triangle', fill: '#F0EEF8', stroke: '#8C44CC', label: 'Storage'         },
  rework:     { shape: 'rect',     fill: '#FEE2E2', stroke: RED,    label: 'Rework'             },
  start_end:  { shape: 'oval',     fill: '#E8E5E0', stroke: '#333', label: 'Start / End'        },
}

// ── Layout constants — shared by StepBox, FlowArrow, and V2MapCanvas ──────────
const BOX_W = 110
const BOX_H = 48
const GAP = 80  // horizontal gap between steps

// ── Per-step VSM box ───────────────────────────────────────────────────────
function StepBox({ step, index, total, isSelected, onClick, t, expanded, onToggleExpand }: any) {
  const sym = STEP_SYMBOLS[step.step_type || 'process'] || STEP_SYMBOLS.process
  const hasMissing = (step.missing_info_flags || []).length > 0
  const hasWIP = (step.wip || 0) > 0
  const isSupermarket = step.flow_type === 'supermarket'
  const hasGoverning = !!step.governing_entity

  const X = 60 + index * (BOX_W + GAP)
  const Y = 200

  // Format cycle time for display
  const fmtCT = (ct: number, unit: string) => {
    if (!ct) return '?'
    const u = unit || 'seconds'
    if (u === 'seconds' && ct >= 60) return `${(ct/60).toFixed(1)}m`
    if (u === 'seconds' && ct >= 3600) return `${(ct/3600).toFixed(1)}h`
    return `${ct}${u === 'seconds' ? 's' : u === 'minutes' ? 'm' : u === 'hours' ? 'h' : u === 'days' ? 'd' : 'w'}`
  }

  return (
    <g key={step.id} style={{ cursor: 'pointer' }} onClick={onClick}>
      {/* Governing entity — process control box (ISO convention: dashed box above) */}
      {hasGoverning && (
        <>
          <rect x={X + BOX_W/2 - 42} y={Y - 52} width={84} height={22}
            fill="white" stroke="#888" strokeWidth="1" strokeDasharray="4 2" rx="3"/>
          <text x={X + BOX_W/2} y={Y - 38} textAnchor="middle" fontSize="8" fill="#555"
            fontFamily="monospace">{step.governing_entity.slice(0, 14)}</text>
          <line x1={X + BOX_W/2} y1={Y - 30} x2={X + BOX_W/2} y2={Y}
            stroke="#888" strokeWidth="1" strokeDasharray="3 2"/>
        </>
      )}

      {/* WIP and supermarket rendered at canvas level for correct z-order */}

      {/* Main step shape */}
      {sym.shape === 'rect' && (
        <rect x={X} y={Y} width={BOX_W} height={BOX_H}
          fill={sym.fill} stroke={isSelected ? BRAND : sym.stroke}
          strokeWidth={isSelected ? 2.5 : 1.5} rx="4"
          style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(1,118,211,.4))' : 'none' }}/>
      )}
      {sym.shape === 'diamond' && (
        <polygon
          points={`${X + BOX_W/2},${Y} ${X + BOX_W},${Y + BOX_H/2} ${X + BOX_W/2},${Y + BOX_H} ${X},${Y + BOX_H/2}`}
          fill={sym.fill} stroke={isSelected ? BRAND : sym.stroke} strokeWidth={isSelected ? 2.5 : 1.5}/>
      )}
      {sym.shape === 'circle' && (
        <ellipse cx={X + BOX_W/2} cy={Y + BOX_H/2} rx={BOX_W/2} ry={BOX_H/2}
          fill={sym.fill} stroke={isSelected ? BRAND : sym.stroke} strokeWidth={isSelected ? 2.5 : 1.5}/>
      )}
      {sym.shape === 'oval' && (
        <rect x={X} y={Y} width={BOX_W} height={BOX_H}
          fill={sym.fill} stroke={isSelected ? BRAND : sym.stroke} strokeWidth={isSelected ? 2.5 : 1.5} rx={BOX_H/2}/>
      )}
      {sym.shape === 'delay' && (
        <path d={`M${X},${Y} L${X + BOX_W - BOX_H/2},${Y} Q${X + BOX_W},${Y} ${X + BOX_W},${Y + BOX_H/2} Q${X + BOX_W},${Y + BOX_H} ${X + BOX_W - BOX_H/2},${Y + BOX_H} L${X},${Y + BOX_H} Z`}
          fill={sym.fill} stroke={isSelected ? BRAND : sym.stroke} strokeWidth={isSelected ? 2.5 : 1.5}/>
      )}
      {sym.shape === 'triangle' && (
        <polygon
          points={`${X},${Y + BOX_H} ${X + BOX_W},${Y + BOX_H} ${X + BOX_W/2},${Y}`}
          fill={sym.fill} stroke={isSelected ? BRAND : sym.stroke} strokeWidth={isSelected ? 2.5 : 1.5}/>
      )}
      {sym.shape === 'arrow' && (
        <path d={`M${X},${Y + BOX_H/2} L${X + BOX_W - 12},${Y + BOX_H/2} L${X + BOX_W - 12},${Y + 8} L${X + BOX_W},${Y + BOX_H/2} L${X + BOX_W - 12},${Y + BOX_H - 8} L${X + BOX_W - 12},${Y + BOX_H/2}`}
          fill={sym.fill} stroke={isSelected ? BRAND : sym.stroke} strokeWidth={isSelected ? 2.5 : 1.5}/>
      )}

      {/* Step name */}
      <text x={X + BOX_W/2} y={Y + BOX_H/2 - 5} textAnchor="middle"
        fontSize="9" fontWeight="700" fill={isSelected ? BRAND : '#222'}
        fontFamily="'DM Sans',sans-serif">
        {step.name.length > 14 ? step.name.slice(0, 13) + '…' : step.name}
      </text>

      {/* Operator count — ISO person symbol */}
      {(step.operators || 0) > 0 && (
        <text x={X + 8} y={Y + BOX_H - 6} fontSize="8" fill="#666">
          {'👤'.slice(0,1)}{step.operators}
        </text>
      )}

      {/* VA classification colour bar at bottom */}
      <rect x={X} y={Y + BOX_H - 4} width={BOX_W}
        height={4} rx="0 0 4 4"
        fill={step.is_value_added === 'va' ? GREEN : step.is_value_added === 'nva' ? RED : step.is_value_added === 'nnva' ? AMBER : '#ddd'}/>

      {/* DATA BOX below step (ISO standard — metrics box) */}
      <rect x={X} y={Y + BOX_H + 4} width={BOX_W} height={expanded ? 72 : 36}
        fill="white" stroke="#D8D5CE" strokeWidth="1" rx="0"/>
      <text x={X + 4} y={Y + BOX_H + 14} fontSize="7" fill="#555" fontFamily="monospace">
        {t?.cycleTime?.slice(0,2) || 'CT'}: {step.cycle_time ? fmtCT(step.cycle_time, step.cycle_time_unit) : '—'}
        {step.cycle_time_type === 'assumed' ? ' ~' : ''}
      </text>
      <text x={X + 4} y={Y + BOX_H + 24} fontSize="7" fill="#888" fontFamily="monospace">
        Wait: {step.wait_time ? fmtCT(step.wait_time, step.cycle_time_unit) : '0'}
      </text>
      <text x={X + 4} y={Y + BOX_H + 33} fontSize="7" fill={(step.defect_rate||0)>0 ? RED : '#aaa'} fontFamily="monospace">
        Defect: {step.defect_rate || 0}% | Ops: {step.operators || 1}
      </text>
      {/* Expand toggle — ▼ / ▲ */}
      <text x={X + BOX_W - 8} y={Y + BOX_H + 23} fontSize="9" fill={BRAND} fontFamily="monospace"
        style={{ cursor:'pointer' }} onClick={(e) => { e.stopPropagation(); onToggleExpand?.(step.id) }}>
        {expanded ? '▲' : '▼'}
      </text>
      {/* Expanded detail — tasks and governing entity */}
      {expanded && (
        <g>
          <line x1={X} y1={Y + BOX_H + 39} x2={X + BOX_W} y2={Y + BOX_H + 39} stroke="#E8E5E0" strokeWidth="0.8"/>
          {step.governing_entity && (
            <text x={X + 4} y={Y + BOX_H + 50} fontSize="6.5" fill="#0176D3" fontFamily="monospace">
              ⊕ {step.governing_entity.slice(0,16)}
            </text>
          )}
          {(step.tasks || []).slice(0,3).map((task: string, ti: number) => (
            <text key={ti} x={X + 4} y={Y + BOX_H + 60 + ti * 9} fontSize="6" fill="#333" fontFamily="sans-serif">
              {(ti+1)}. {task.slice(0, 17)}{task.length > 17 ? '…' : ''}
            </text>
          ))}
        </g>
      )}

      {/* Amber warning badge — missing info */}
      {hasMissing && (
        <>
          <circle cx={X + BOX_W - 2} cy={Y + 2} r="8" fill={AMBER}/>
          <text x={X + BOX_W - 2} y={Y + 6} textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
            {(step.missing_info_flags || []).length}
          </text>
        </>
      )}

      {/* Kaizen burst — if open kaizen events (ISO 22468) */}
      {(step.toolData?.kaizen?.items || []).some((k: any) => k.status === 'open' || k.status === 'in-progress') && (
        <g>
          <polygon
            points={Array.from({length: 10}, (_,i) => {
              const a = (i * 36 - 90) * Math.PI/180
              const r = i % 2 === 0 ? 10 : 6
              return `${X + BOX_W + r*Math.cos(a)},${Y - 2 + r*Math.sin(a)}`
            }).join(' ')}
            fill="none" stroke={BRAND} strokeWidth="1.2"/>
        </g>
      )}
    </g>
  )
}

// ── Arrow between steps (push / pull) ─────────────────────────────────────
function FlowArrow({ fromX, fromY, toX, flowType }: any) {
  const midY = fromY + BOX_H / 2
  const x1 = fromX + BOX_W
  const x2 = toX

  if (flowType === 'supermarket') {
    // Pull arrow (ISO — backwards arrow above)
    return (
      <g>
        <path d={`M${x2 + 20},${midY - 18} L${x1 + 10},${midY - 18}`}
          stroke={BRAND} strokeWidth="1.2" fill="none" strokeDasharray="4 2"
          markerEnd={`url(#arrow-pull)`}/>
        <text x={(x1 + x2)/2} y={midY - 22} textAnchor="middle" fontSize="6" fill={BRAND} fontFamily="monospace">pull</text>
      </g>
    )
  }

  return (
    <path d={`M${x1},${midY} L${x2},${midY}`}
      stroke="#374151" strokeWidth="1.5" fill="none"
      markerEnd={`url(#arrow-push)`}/>
  )
}

// ── Main canvas ────────────────────────────────────────────────────────────
export function V2MapCanvas({ steps, project, t, selectedStepId, onStepClick, onAddStep, onDeleteStep, missingCount }: any) {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})
  const toggleExpand = (id: string) => setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }))
  const expandAll = () => {
    const all: Record<string, boolean> = {}
    steps.forEach((s: any) => { all[s.id] = true })
    setExpandedSteps(all)
  }
  const collapseAll = () => setExpandedSteps({})
  const CANVAS_W = Math.max(900, 60 + steps.length * (BOX_W + GAP) + 120)
  const CANVAS_H = 520

  // Timeline sawtooth data
  const totalCT = steps.reduce((a: number, s: any) => a + (s.cycle_time || 0), 0)
  const totalWait = steps.reduce((a: number, s: any) => a + (s.wait_time || 0), 0)
  const totalLT = totalCT + totalWait
  const vaSteps = steps.filter((s: any) => s.is_value_added === 'va')
  const vaCT = vaSteps.reduce((a: number, s: any) => a + (s.cycle_time || 0), 0)
  const pce = totalLT > 0 ? Math.round((vaCT / totalLT) * 100) : 0
  const taktTime = project.takt_time || 0

  const fmtTime = (s: number) => {
    if (!s) return '—'
    if (s < 120) return `${Math.round(s)}s`
    if (s < 7200) return `${(s/60).toFixed(1)}m`
    return `${(s/3600).toFixed(1)}h`
  }

  if (steps.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, color: 'var(--text3)' }}>
        <div style={{ fontSize: 48 }}>🗺</div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Your {t?.valueStream || 'value stream'} map will appear here</h3>
          <p style={{ fontSize: 14, maxWidth: 380, lineHeight: 1.7 }}>Upload an SOP to auto-generate the map, or click <strong>+ Add Step</strong> to build it manually.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', background: '#FAFAF8', position: 'relative' }}>
      {/* Expand/Collapse all controls */}
      <div style={{ position:'absolute', top:10, left:14, display:'flex', gap:6, zIndex:10 }}>
        <button onClick={expandAll} style={{ fontSize:9, fontFamily:'monospace', letterSpacing:1,
          padding:'3px 8px', border:'1px solid var(--border)', borderRadius:0, background:'white',
          cursor:'pointer', color:'var(--text2)' }}>EXPAND ALL</button>
        <button onClick={collapseAll} style={{ fontSize:9, fontFamily:'monospace', letterSpacing:1,
          padding:'3px 8px', border:'1px solid var(--border)', borderRadius:0, background:'white',
          cursor:'pointer', color:'var(--text2)' }}>COLLAPSE</button>
      </div>

      {/* ISO VSM legend */}
      <div style={{ position: 'absolute', top: 10, right: 14, display: 'flex', gap: 8, zIndex: 10, flexWrap: 'wrap', maxWidth: 320 }}>
        {[
          { color: GREEN, label: 'VA — Value-Add' },
          { color: AMBER, label: 'NNVA — Necessary Non-Value-Add' },
          { color: RED, label: 'NVA — Waste (Muda)' },
          { color: '#ddd', label: 'Unclassified' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text3)', background: 'white', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
            {label}
          </div>
        ))}
      </div>

      {/* KPI bar */}
      <div style={{ position: 'absolute', top: 10, left: 14, display: 'flex', gap: 10, zIndex: 10 }}>
        {[
          { label: 'Lead Time', value: fmtTime(totalLT) },
          { label: 'PCE', value: `${pce}%`, color: pce >= 80 ? GREEN : pce >= 50 ? AMBER : RED },
          { label: 'Steps', value: steps.length },
          ...(missingCount > 0 ? [{ label: 'Incomplete', value: missingCount, color: AMBER }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 7, fontFamily: 'monospace', color: 'var(--text3)', letterSpacing: 1 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: color || 'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>

      <svg width={CANVAS_W} height={CANVAS_H} style={{ minWidth: '100%', userSelect: 'none' }}>
        <defs>
          <marker id="arrow-push" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#374151"/>
          </marker>
          <marker id="arrow-pull" markerWidth="6" markerHeight="4" refX="1" refY="2" orient="auto">
            <polygon points="6 0, 0 2, 6 4" fill={BRAND}/>
          </marker>
        </defs>

        {/* Supplier entity (TPS standard — box left) */}
        <rect x="8" y="190" width="44" height="40" fill="#5B7FA6" stroke="#3A5A7C" strokeWidth="1.5" rx="2"/>
        <polygon points="8,200 30,190 52,200" fill="#4A6A8F"/>
        <text x="30" y="248" textAnchor="middle" fontSize="9" fontWeight="700" fill="#333" fontFamily="sans-serif">Supplier</text>

        {/* Push arrow from supplier */}
        {steps.length > 0 && (
          <path d={`M52,210 L${60},210`} stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow-push)"/>
        )}

        {/* Step boxes */}
        {steps.map((step: any, i: number) => (
          <StepBox
            key={step.id} step={step} index={i} total={steps.length}
            isSelected={step.id === selectedStepId} t={t}
            expanded={!!expandedSteps[step.id]}
            onToggleExpand={toggleExpand}
            onClick={() => onStepClick(step)}
          />
        ))}

        {/* Arrows between steps */}
        {steps.slice(0, -1).map((step: any, i: number) => {
          const fromX = 60 + i * (BOX_W + GAP)
          const toX = 60 + (i + 1) * (BOX_W + GAP)
          return <FlowArrow key={`arr-${i}`} fromX={fromX} fromY={200} toX={toX} flowType={steps[i+1]?.flow_type}/>
        })}

        {/* Customer entity (TPS standard — box right) */}
        {steps.length > 0 && (() => {
          const lastX = 60 + (steps.length - 1) * (BOX_W + GAP) + BOX_W
          return (
            <>
              <path d={`M${lastX},210 L${lastX + 14},210`} stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow-push)"/>
              <rect x={lastX + 14} y="190" width="44" height="40" fill="#5B7FA6" stroke="#3A5A7C" strokeWidth="1.5" rx="2"/>
              <text x={lastX + 36} y="248" textAnchor="middle" fontSize="9" fontWeight="700" fill="#333" fontFamily="sans-serif">
                {t?.customer?.slice(0,8) || 'Customer'}
              </text>
            </>
          )
        })()}

        {/* ── Sawtooth timeline (ISO 22468) ─────────────────────────────── */}
        {totalLT > 0 && (() => {
          const TL_Y = 310
          const TL_W = Math.max(2, CANVAS_W - 100)
          let pos = 50

          return (
            <g>
              {/* Axis line */}
              <line x1="50" y1={TL_Y + 20} x2={CANVAS_W - 40} y2={TL_Y + 20} stroke="#D8D5CE" strokeWidth="1"/>

              {steps.map((s: any, i: number) => {
                const ctW = totalLT > 0 ? ((s.cycle_time || 0) / totalLT) * TL_W : 0
                const waitW = totalLT > 0 ? ((s.wait_time || 0) / totalLT) * TL_W : 0
                const ctFill = s.is_value_added === 'va' ? BRAND : s.is_value_added === 'nva' ? RED : AMBER

                const ctEl = ctW > 0 ? (
                  <g key={`ct-${i}`}>
                    <line x1={pos} y1={TL_Y + 20} x2={pos} y2={TL_Y} stroke={ctFill} strokeWidth="1"/>
                    <line x1={pos} y1={TL_Y} x2={pos + ctW} y2={TL_Y} stroke={ctFill} strokeWidth="3"/>
                    <line x1={pos + ctW} y1={TL_Y} x2={pos + ctW} y2={TL_Y + 20} stroke={ctFill} strokeWidth="1"/>
                    {ctW > 20 && <text x={pos + ctW/2} y={TL_Y - 4} textAnchor="middle" fontSize="7" fill={ctFill} fontFamily="monospace">
                      {fmtTime(s.cycle_time || 0)}
                    </text>}
                  </g>
                ) : null
                pos += ctW

                const waitEl = waitW > 0 ? (
                  <g key={`wt-${i}`}>
                    <line x1={pos} y1={TL_Y + 20} x2={pos} y2={TL_Y + 30} stroke="#C8C5C0" strokeWidth="1"/>
                    <line x1={pos} y1={TL_Y + 30} x2={pos + waitW} y2={TL_Y + 30} stroke="#C8C5C0" strokeWidth="2"/>
                    <line x1={pos + waitW} y1={TL_Y + 30} x2={pos + waitW} y2={TL_Y + 20} stroke="#C8C5C0" strokeWidth="1"/>
                    {waitW > 20 && <text x={pos + waitW/2} y={TL_Y + 42} textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">
                      {fmtTime(s.wait_time || 0)}
                    </text>}
                  </g>
                ) : null
                pos += waitW

                return [ctEl, waitEl]
              })}

              {/* Lead time label */}
              <text x={CANVAS_W / 2} y={TL_Y + 58} textAnchor="middle" fontSize="9" fill="#888" fontFamily="monospace">
                {t?.cycleTime || 'Cycle Time'}: {fmtTime(totalCT)} · Wait: {fmtTime(totalWait)} · Lead Time: {fmtTime(totalLT)} · PCE: {pce}%
              </text>

              {/* Takt line */}
              {taktTime > 0 && (() => {
                const taktPx = 50 + (taktTime / totalLT) * TL_W
                return (
                  <g>
                    <line x1={taktPx} y1={TL_Y - 30} x2={taktPx} y2={TL_Y + 50}
                      stroke={RED} strokeWidth="1.2" strokeDasharray="5 3" opacity=".6"/>
                    <text x={taktPx + 4} y={TL_Y - 22} fontSize="8" fill={RED} fontFamily="monospace">
                      Takt={fmtTime(taktTime)}
                    </text>
                  </g>
                )
              })()}
            </g>
          )
        })()}

        {/* ── WIP triangles, supermarket, inventory — rendered OVER arrows (correct z-order) ── */}
        {steps.map((step: any, i: number) => {
          if (i === 0) return null
          const X = 60 + i * (BOX_W + GAP)
          const Y = 200
          const hasWIP = (step.wip || 0) > 0
          const isSM = step.flow_type === 'supermarket'
          const hasInventory = step.step_type === 'storage' || (step.sm_min > 0 || step.sm_max > 0)
          return (
            <g key={`overlay-${step.id}`}>
              {/* WIP inventory triangle (ISO 22468) — inverted triangle between steps */}
              {hasWIP && (
                <g>
                  <polygon
                    points={`${X - 30},${Y + 14} ${X - 10},${Y + 14} ${X - 20},${Y - 2}`}
                    fill="#FEF3C7" stroke={AMBER} strokeWidth="1.5"/>
                  <text x={X - 20} y={Y + 26} textAnchor="middle" fontSize="8" fill={AMBER}
                    fontFamily="monospace" fontWeight="700">{step.wip}</text>
                  <text x={X - 20} y={Y + 35} textAnchor="middle" fontSize="6" fill={AMBER}
                    fontFamily="monospace">WIP</text>
                </g>
              )}
              {/* Supermarket / pull symbol (ISO 22468) */}
              {isSM && (
                <g>
                  <rect x={X - 42} y={Y + 2} width={12} height={22} fill="none" stroke={BRAND} strokeWidth="1.5"/>
                  <rect x={X - 40} y={Y + 7} width={4} height={4} fill={BRAND} opacity=".5"/>
                  <rect x={X - 40} y={Y + 14} width={4} height={4} fill={BRAND} opacity=".5"/>
                  <text x={X - 36} y={Y + 33} fontSize="6" fill={BRAND} fontFamily="monospace" textAnchor="middle">SPMK</text>
                </g>
              )}
              {/* Inventory / storage triangle (ISO 22468) */}
              {hasInventory && !isSM && !hasWIP && (
                <g>
                  <polygon
                    points={`${X - 30},${Y + 14} ${X - 10},${Y + 14} ${X - 20},${Y - 2}`}
                    fill="#F0EEF8" stroke="#8C44CC" strokeWidth="1.2"/>
                  <text x={X - 20} y={Y + 26} textAnchor="middle" fontSize="6" fill="#8C44CC"
                    fontFamily="monospace">INV</text>
                </g>
              )}
            </g>
          )
        })}

        {/* Add step button at end */}
        {(() => {
          const x = 60 + steps.length * (BOX_W + GAP)
          return (
            <g style={{ cursor: 'pointer' }} onClick={() => onAddStep(steps.length - 1)}>
              <rect x={x} y={205} width={36} height={36} rx="8"
                fill="white" stroke={BRAND} strokeWidth="1.5" strokeDasharray="4 2"/>
              <text x={x + 18} y={227} textAnchor="middle" fontSize="20" fill={BRAND} fontWeight="300">+</text>
            </g>
          )
        })()}

      </svg>
    </div>
  )
}
