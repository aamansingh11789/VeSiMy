// @ts-nocheck
'use client'
import { XIcon, ExternalLinkIcon } from '@/components/ui/Icons'
// ── components/vsm/VSMMap.tsx ─────────────────────────────────────────────────
// ISO 22468:2020-compliant Value Stream Map
// Process boxes: plain rectangles with data box — no non-ISO decorations.
// Box shadow optional for 3-D depth but no rounding except per standard.
// WIP inventory triangles, supermarket shelves, and push arrows between all steps.

import { useState } from 'react'
import type { Step, Branch, Project } from '@/lib/store'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'

interface Props { steps: Step[]; branches: Branch[]; project: Project }

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60) return `${Math.round(s)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(2)}h`
}

// ── ISO 22468 process box — plain rectangle + data box ────────────────────
// No rounded corners on the box body (ISO specifies plain rect)
// Subtle drop shadow for depth (box-shadow equivalent in SVG = filter)
const ProcessBox = ({ x, y, step, takt, highlight = false }: any) => {
  const PW = 100, PH = 56, DH = 72
  const ct  = step.toolData?.stopwatch?.mean || Number(step.cycle_time) || 0
  const co  = Number(step.change_over_time) || 0
  const up  = step.uptime != null ? `${step.uptime}%` : '—'
  const dr  = step.defect_rate != null ? `${step.defect_rate}%` : '—'
  const ops = step.operators || 1
  const isBN = takt > 0 && ct > 0 && ct > takt * 1.05
  const BOX_STROKE = isBN ? '#DC2626' : '#374151'
  const CT_COLOR   = isBN ? '#DC2626' : '#059669'
  const vaLabel = step.va_type === 'nnva' ? 'NNVA' : step.va_type === 'nva' ? 'NVA' : ''

  return (
    <g filter={highlight ? 'url(#boxShadow)' : undefined}>
      {/* ISO process rectangle — plain, no radius */}
      <rect x={x} y={y} width={PW} height={PH} fill="#FFFFFF" stroke={BOX_STROKE} strokeWidth={isBN ? 2 : 1.5} />
      
      {/* Step name — centred, ISO standard font */}
      <text x={x+PW/2} y={y+20} textAnchor="middle" fill="#1F2937" fontSize={9} fontWeight={700} fontFamily="sans-serif">
        {step.name.length > 16 ? step.name.slice(0,15)+'…' : step.name}
      </text>
      {step.department && (
        <text x={x+PW/2} y={y+30} textAnchor="middle" fill="#6B7280" fontSize={7.5} fontFamily="sans-serif">{step.department}</text>
      )}

      {/* Operator icons (ISO lean: stick figures) */}
      {[...Array(Math.min(ops, 4))].map((_,o) => (
        <g key={o}>
          <circle cx={x + 8 + o*13} cy={y+PH-10} r={5.5} fill="#E5E7EB" stroke={BOX_STROKE} strokeWidth={0.8} />
          <circle cx={x + 8 + o*13} cy={y+PH-18} r={3} fill={BOX_STROKE} />
        </g>
      ))}
      {ops > 4 && <text x={x+10+4*13} y={y+PH-7} fill="#374151" fontSize={8} fontFamily="sans-serif">+{ops-4}</text>}

      {/* VA type tag */}
      {vaLabel && (
        <text x={x+PW-4} y={y+10} textAnchor="end" fill={isBN?'#DC2626':'#CA8A04'} fontSize={7} fontWeight={700} fontFamily="monospace">{vaLabel}</text>
      )}
      {/* Bottleneck over-takt marker */}
      {isBN && <text x={x+PW-4} y={y+20} textAnchor="end" fill="#DC2626" fontSize={7.5} fontWeight={700} fontFamily="sans-serif">▲TAKT</text>}

      {/* ISO data box — attached below process rectangle, same width */}
      <rect x={x} y={y+PH} width={PW} height={DH} fill="#FAFAFA" stroke={BOX_STROKE} strokeWidth={1} />
      {/* Horizontal dividers at 1/3 and 2/3 */}
      <line x1={x} y1={y+PH+DH*0.33} x2={x+PW} y2={y+PH+DH*0.33} stroke="#D1D5DB" strokeWidth={0.7} />
      <line x1={x} y1={y+PH+DH*0.66} x2={x+PW} y2={y+PH+DH*0.66} stroke="#D1D5DB" strokeWidth={0.7} />
      {/* C/T row */}
      <text x={x+4}  y={y+PH+14}          fill="#6B7280" fontSize={7.5} fontFamily="monospace">C/T =</text>
      <text x={x+32} y={y+PH+14}          fill={CT_COLOR} fontSize={9}   fontWeight={700} fontFamily="monospace">{ct ? fmtS(ct) : '—'}</text>
      {/* C/O row */}
      <text x={x+4}  y={y+PH+DH*0.33+14} fill="#6B7280" fontSize={7.5} fontFamily="monospace">C/O =</text>
      <text x={x+32} y={y+PH+DH*0.33+14} fill="#374151" fontSize={9}   fontFamily="monospace">{co ? fmtS(co) : '0s'}</text>
      {/* Uptime + defect row */}
      <text x={x+4}  y={y+PH+DH*0.66+14} fill="#6B7280" fontSize={7.5} fontFamily="monospace">Up/Dr</text>
      <text x={x+30} y={y+PH+DH*0.66+14} fill="#374151" fontSize={8}   fontFamily="monospace">{up}/{dr}</text>
    </g>
  )
}

// ── ISO WIP inventory triangle ─────────────────────────────────────────────
const WIPTriangle = ({ x, y, wip, label = '' }: any) => (
  <g>
    <polygon points={`${x},${y+22} ${x+16},${y} ${x+32},${y+22}`} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5} />
    <text x={x+16} y={y+17} textAnchor="middle" fill="#92400E" fontSize={9} fontWeight={700} fontFamily="sans-serif">{wip}</text>
    {label && <text x={x+16} y={y+33} textAnchor="middle" fill="#92400E" fontSize={7} fontFamily="sans-serif">{label}</text>}
  </g>
)

// ── ISO supermarket shelf symbol ───────────────────────────────────────────
const Supermarket = ({ x, y, w = 44, h = 32, qty = '' }: any) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#EDE9FE" stroke="#7C3AED" strokeWidth={1.5} />
    {[1,2,3].map(i => (
      <line key={i} x1={x} y1={y+i*(h/4)} x2={x+w} y2={y+i*(h/4)} stroke="#7C3AED" strokeWidth={0.5} opacity={0.6} />
    ))}
    <text x={x+w/2} y={y+h/2+4} textAnchor="middle" fill="#5B21B6" fontSize={8} fontWeight={700} fontFamily="sans-serif">
      {qty ? `S/M ${qty}` : 'S/M'}
    </text>
  </g>
)

// ── Kaizen burst (ISO standard improvement marker) ─────────────────────────
const KaizenBurst = ({ x, y, r = 15 }: any) => {
  const pts = Array.from({length:16}, (_,i) => {
    const a = (i/16)*Math.PI*2 - Math.PI/2
    return `${x+Math.cos(a)*(i%2===0?r:r*0.6)},${y+Math.sin(a)*(i%2===0?r:r*0.6)}`
  }).join(' ')
  return (
    <g>
      <polygon points={pts} fill="#FEF9C3" stroke="#EAB308" strokeWidth={1.2} />
      <text x={x} y={y+4} textAnchor="middle" fill="#92400E" fontSize={7} fontWeight={700} fontFamily="sans-serif">改善</text>
    </g>
  )
}

// ── Factory icon ────────────────────────────────────────────────────────────
const FactoryIcon = ({ x, y, w = 60, h = 48, label = '' }: any) => (
  <g>
    <rect x={x} y={y+10} width={w} height={h-10} fill="#5B7FA6" stroke="#3A5A7C" strokeWidth={1.2} />
    <polygon points={`${x},${y+12} ${x+w/2},${y} ${x+w},${y+12}`} fill="#4A6A8F" stroke="#3A5A7C" strokeWidth={1.2} />
    <rect x={x+6}   y={y+18} width={9} height={9} fill="#C8DCF0" />
    <rect x={x+22}  y={y+18} width={9} height={9} fill="#C8DCF0" />
    <rect x={x+38}  y={y+18} width={9} height={9} fill="#C8DCF0" />
    <rect x={x+w/2-5} y={y+h-14} width={10} height={14} fill="#3A5A7C" />
    {label && <text x={x+w/2} y={y+h+13} textAnchor="middle" fill="#1F2937" fontSize={9} fontWeight={700} fontFamily="sans-serif">{label}</text>}
  </g>
)

// ── Production Control box (ISO lean: central scheduler) ──────────────────
const ProdCtrl = ({ x, y, w = 120, h = 40 }: any) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#D1FAE5" stroke="#059669" strokeWidth={1.5} />
    <text x={x+w/2} y={y+15} textAnchor="middle" fill="#065F46" fontSize={9}  fontWeight={700} fontFamily="sans-serif">Production</text>
    <text x={x+w/2} y={y+27} textAnchor="middle" fill="#065F46" fontSize={9}  fontWeight={700} fontFamily="sans-serif">Control</text>
  </g>
)

// ── Main VSM component ─────────────────────────────────────────────────────
export function VSMMap({ steps, branches, project }: Props) {
  const [fullscreen, setFullscreen] = useState(false)

  const mainSteps = steps.filter(s => s.is_main_flow !== false).sort((a,b) => a.position - b.position)
  const branchSteps = steps.filter(s => s.is_main_flow === false)
  const branchGroups: Record<string, Step[]> = {}
  branchSteps.forEach(s => {
    if (!s.branch_id) return
    if (!branchGroups[s.branch_id]) branchGroups[s.branch_id] = []
    branchGroups[s.branch_id].push(s)
  })
  Object.values(branchGroups).forEach(g => g.sort((a,b)=>(a.branch_position||0)-(b.branch_position||0)))
  const branchIds = Object.keys(branchGroups)
  const BRANCH_COLORS = ['#7C3AED','#0EA5E9','#10B981','#F59E0B','#EC4899','#06B6D4']

  const takt = project.takt_time ? Number(project.takt_time)
    : project.demand && project.available_time_sec ? Number(project.available_time_sec)/Number(project.demand)
    : project.demand && project.working_hours ? (Number(project.working_hours)*3600)/Number(project.demand)
    : 0

  // FIX: use canonical calcProcessMetrics — consistent with all other tabs
  const { totalCT: mainCT, totalWait: mainWT, leadTime: lt, pce, totalWIP } =
    calcProcessMetrics(steps, project)

  if (!mainSteps.length) {
    return (
      <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text3)' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>∿</div>
        <div style={{ fontSize:16, color:'var(--text2)', marginBottom:6 }}>No value stream mapped</div>
        <div style={{ fontSize:13 }}>Add steps in Builder to generate the current-state map.</div>
      </div>
    )
  }

  // ── Layout ──
  const PW=100, PH=56, DH=72, GAP=64
  const ML=72, MR=72
  const FACT_W=60, FACT_H=48
  const PCTRL_W=120, PCTRL_H=40
  const TOP_PAD = 52
  const PCTRL_Y     = TOP_PAD + 4
  const SUPPLIER_Y  = TOP_PAD + 64
  const TRUCK_Y     = TOP_PAD + 136
  const PROC_Y      = TOP_PAD + 182
  const TL_START_Y  = PROC_Y + PH + DH + 24
  const TL_BASE     = TL_START_Y + 40
  const BRANCH_START_Y = TL_BASE + 60
  const BRANCH_LANE_H  = PH + DH + 44
  const BRANCH_GAP     = 36

  const n = mainSteps.length
  const totalFlowW = n * PW + (n-1) * GAP
  const TOTAL_W = Math.max(ML+FACT_W+20+totalFlowW+20+FACT_W+MR, 820)
  const flowX = (TOTAL_W - totalFlowW) / 2
  const sx = (i: number) => flowX + i*(PW+GAP)
  const supX = ML, custX = TOTAL_W-MR-FACT_W
  const pctX = (TOTAL_W-PCTRL_W)/2

  const TOTAL_H = branchIds.length > 0
    ? BRANCH_START_Y + branchIds.length*(BRANCH_LANE_H+BRANCH_GAP) + 56
    : TL_BASE + 56

  const svgContent = (bg = '#FFFFFF') => (<>
    <defs>
      <filter id="boxShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.10" />
      </filter>
      <marker id="matArr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0,7 2.5,0 5" fill="#374151" />
      </marker>
      <marker id="infoArr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0,7 2.5,0 5" fill="#0EA5E9" />
      </marker>
      {branchIds.map((bid,i) => (
        <marker key={bid} id={`bArr-${bid}`} markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill={branches.find(b=>b.branch_id===bid)?.color||BRANCH_COLORS[i%6]} />
        </marker>
      ))}
    </defs>

    <rect width={TOTAL_W} height={TOTAL_H} fill={bg} />

    {/* Title */}
    <text x={TOTAL_W/2} y={18} textAnchor="middle" fill="#1F2937" fontSize={13} fontWeight={700} fontFamily="sans-serif">
      Current-State Value Stream Map
    </text>
    <text x={TOTAL_W/2} y={32} textAnchor="middle" fill="#6B7280" fontSize={9} fontFamily="sans-serif">
      {project.name} · ISO 22468:2020
    </text>

    {/* Production Control */}
    <ProdCtrl x={pctX} y={PCTRL_Y} w={PCTRL_W} h={PCTRL_H} />

    {/* Info flow arrows (dashed) */}
    <polyline points={`${pctX},${PCTRL_Y+PCTRL_H/2} ${pctX-14},${PCTRL_Y+PCTRL_H/2+8} ${supX+FACT_W+4},${SUPPLIER_Y+FACT_H/2}`}
      stroke="#0EA5E9" strokeWidth={1.5} fill="none" strokeDasharray="5,3" markerEnd="url(#infoArr)" />
    <polyline points={`${pctX+PCTRL_W},${PCTRL_Y+PCTRL_H/2} ${pctX+PCTRL_W+14},${PCTRL_Y+PCTRL_H/2+8} ${custX-4},${SUPPLIER_Y+FACT_H/2}`}
      stroke="#0EA5E9" strokeWidth={1.5} fill="none" strokeDasharray="5,3" markerEnd="url(#infoArr)" />
    {mainSteps.map((_,i)=>{
      const px=sx(i)+PW/2, mx=pctX+PCTRL_W/2+(px-pctX-PCTRL_W/2)*0.4
      return <polyline key={i} points={`${pctX+PCTRL_W/2},${PCTRL_Y+PCTRL_H} ${mx},${PROC_Y-20} ${px},${PROC_Y}`}
        stroke="#0EA5E9" strokeWidth={1.2} fill="none" strokeDasharray="4,3" opacity={0.5} markerEnd="url(#infoArr)" />
    })}

    {/* Supplier + Customer */}
    <FactoryIcon x={supX} y={SUPPLIER_Y} w={FACT_W} h={FACT_H} label={project.supplier||'Supplier'} />
    <FactoryIcon x={custX} y={SUPPLIER_Y} w={FACT_W} h={FACT_H} label={project.customer||'Customer'} />
    {project.demand && (
      <text x={custX+FACT_W/2} y={SUPPLIER_Y+FACT_H+22} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="sans-serif">
        {project.demand}/day
      </text>
    )}

    {/* Push arrows supplier→step1 and lastStep→customer */}
    <line x1={supX+FACT_W+20} y1={SUPPLIER_Y+FACT_H/2+30} x2={sx(0)} y2={PROC_Y+PH/2}
      stroke="#374151" strokeWidth={2} markerEnd="url(#matArr)" />
    <line x1={sx(n-1)+PW+4} y1={PROC_Y+PH/2} x2={custX-4} y2={SUPPLIER_Y+FACT_H/2+30}
      stroke="#374151" strokeWidth={2} markerEnd="url(#matArr)" />

    {/* ── Main flow steps ── */}
    {mainSteps.map((step, i) => {
      const x = sx(i)
      const wip = Number(step.wip) || 0
      // Inventory type: supermarket if flow_type='supermarket' or wip>threshold
      const isSM = step.flow_type === 'supermarket' || step.flow_type === 'pull'
      const ct = step.toolData?.stopwatch?.mean || Number(step.cycle_time)||0
      const isBN = takt>0 && ct>0 && ct>takt*1.05

      return (
        <g key={step.id}>
          {/* Push arrow + WIP/inventory between steps */}
          {i > 0 && (
            <g>
              {/* Push arrow */}
              <line x1={sx(i-1)+PW+4} y1={PROC_Y+PH/2} x2={x-10} y2={PROC_Y+PH/2}
                stroke="#374151" strokeWidth={2} />
              <polygon points={`${x-10},${PROC_Y+PH/2-5} ${x},${PROC_Y+PH/2} ${x-10},${PROC_Y+PH/2+5}`}
                fill="#374151" />
              <text x={sx(i-1)+PW+GAP/2} y={PROC_Y+PH/2-8}
                textAnchor="middle" fill="#9CA3AF" fontSize={7.5} fontFamily="sans-serif">PUSH</text>

              {/* WIP inventory triangle — always shown when wip > 0 */}
              {wip > 0 && (
                <WIPTriangle
                  x={sx(i-1)+PW+GAP/2-16}
                  y={PROC_Y+PH/2+6}
                  wip={wip}
                />
              )}
              {/* Supermarket shelf — shown when flow is pull/supermarket */}
              {isSM && (
                <Supermarket
                  x={sx(i-1)+PW+GAP/2-22}
                  y={PROC_Y+PH/2+(wip>0?32:8)}
                  w={44} h={28}
                  qty={step.sm_min ? `${step.sm_min}–${step.sm_max||'∞'}` : ''}
                />
              )}
            </g>
          )}

          {/* Process box — ISO plain rectangle */}
          <ProcessBox x={x} y={PROC_Y} step={step} takt={takt} highlight />

          {/* Kaizen burst on bottleneck — ISO 22468 improvement marker */}
          {isBN && <KaizenBurst x={x+PW+1} y={PROC_Y-1} r={14} />}
        </g>
      )
    })}

    {/* ── Timeline ── */}
    <line x1={flowX-4} y1={TL_BASE} x2={sx(n-1)+PW+4} y2={TL_BASE} stroke="#374151" strokeWidth={1.5} />
    <text x={flowX-6} y={TL_BASE-8} textAnchor="end" fill="#059669" fontSize={8} fontFamily="monospace" fontWeight={700}>VA</text>
    <text x={flowX-6} y={TL_BASE+12} textAnchor="end" fill="#EF4444" fontSize={8} fontFamily="monospace" fontWeight={700}>NVA</text>

    {/* Takt time reference line */}
    {takt > 0 && (() => {
      const maxCT = Math.max(...mainSteps.map(s=>s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0),1)
      const taktH = Math.max(6, Math.min(34,(takt/maxCT)*34))
      return (
        <g>
          <line x1={flowX} y1={TL_BASE-taktH} x2={sx(n-1)+PW} y2={TL_BASE-taktH}
            stroke="#EF4444" strokeWidth={1.2} strokeDasharray="6,3" opacity={0.7} />
          <text x={flowX-6} y={TL_BASE-taktH+4} textAnchor="end" fill="#EF4444" fontSize={7.5} fontFamily="monospace" fontWeight={700}>TAKT</text>
        </g>
      )
    })()}

    {mainSteps.map((step,i)=>{
      const ct = step.toolData?.stopwatch?.mean||Number(step.cycle_time)||0
      const wt = Number(step.wait_time)||0
      const isBN = takt>0&&ct>takt*1.05
      const maxCT = Math.max(...mainSteps.map(s=>s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0),1)
      const ph = ct>0 ? Math.max(5,Math.min(34,(ct/maxCT)*34)) : 3
      const maxWT = Math.max(...mainSteps.map(s=>Number(s.wait_time)||0),1)
      const vh = wt>0 ? Math.max(3,Math.min(16,(wt/maxWT)*16)) : 0
      const bx = sx(i)
      return (
        <g key={`tl-${step.id}`}>
          {wt>0 && i>0 && (
            <g>
              <rect x={sx(i-1)+PW+4} y={TL_BASE} width={GAP-8} height={vh} fill="#FCA5A5" opacity={0.8} />
              <text x={sx(i-1)+PW+GAP/2} y={TL_BASE+vh+9} textAnchor="middle" fill="#9CA3AF" fontSize={7} fontFamily="monospace">{fmtS(wt)}</text>
            </g>
          )}
          <rect x={bx+4} y={TL_BASE-ph} width={PW-8} height={ph} fill={isBN?'#FCA5A5':'#6EE7B7'} opacity={0.9} />
          <text x={bx+PW/2} y={TL_BASE-ph-3} textAnchor="middle" fill={isBN?'#DC2626':'#059669'} fontSize={8} fontWeight={700} fontFamily="monospace">{ct?fmtS(ct):'—'}</text>
        </g>
      )
    })}

    {/* ── Branch lanes ── */}
    {branchIds.map((bid,bi)=>{
      const bd = branches.find(b=>b.branch_id===bid)
      const color = bd?.color || BRANCH_COLORS[bi%6]
      const label = bd?.label || `Branch ${bi+1}`
      const ls = branchGroups[bid]
      const laneY = BRANCH_START_Y + bi*(BRANCH_LANE_H+BRANCH_GAP)
      const pid = bd?.parent_step_id || ls[0]?.branch_parent_id
      const pi = mainSteps.findIndex(s=>s.id===pid)
      const bfX = pi>=0 ? sx(pi) : flowX

      return (
        <g key={bid}>
          <text x={bfX-8} y={laneY+PH/2+4} textAnchor="end" fill={color} fontSize={9} fontFamily="monospace" fontWeight={700}>
            {label.toUpperCase()}
          </text>
          {/* Lane background — dashed border per ISO sub-process convention */}
          <rect x={bfX-10} y={laneY-8} width={ls.length*(PW+GAP)-GAP+20} height={BRANCH_LANE_H-8}
            fill={`${color}07`} stroke={`${color}30`} strokeWidth={1.2} strokeDasharray="6,3" />
          {/* Connector from main flow down to branch */}
          {pi>=0 && (
            <line x1={sx(pi)+PW/2} y1={PROC_Y+PH+DH} x2={bfX+PW/2} y2={laneY}
              stroke={color} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.6} markerEnd={`url(#bArr-${bid})`} />
          )}
          {/* Branch steps */}
          {ls.map((step,si)=>{
            const bx2 = bfX+si*(PW+GAP)
            const wip = Number(step.wip)||0
            const ct = step.toolData?.stopwatch?.mean||Number(step.cycle_time)||0
            const isBN = takt>0&&ct>takt*1.05
            return (
              <g key={step.id}>
                {si>0 && (
                  <g>
                    <line x1={bfX+(si-1)*(PW+GAP)+PW+4} y1={laneY+PH/2} x2={bx2-10} y2={laneY+PH/2}
                      stroke={color} strokeWidth={1.8} />
                    <polygon points={`${bx2-10},${laneY+PH/2-5} ${bx2},${laneY+PH/2} ${bx2-10},${laneY+PH/2+5}`}
                      fill={color} />
                    {wip>0 && <WIPTriangle x={bfX+(si-1)*(PW+GAP)+PW+GAP/2-16} y={laneY+PH/2+6} wip={wip} />}
                  </g>
                )}
                <ProcessBox x={bx2} y={laneY} step={step} takt={takt} />
                {isBN && <KaizenBurst x={bx2+PW+1} y={laneY-1} r={14} />}
              </g>
            )
          })}
        </g>
      )
    })}

    {/* ── Footer KPIs ── */}
    <text x={flowX} y={TOTAL_H-10} fill="#6B7280" fontSize={9} fontFamily="monospace">
      {`Lead Time: ${fmtS(lt)}  ·  VA: ${fmtS(mainCT)}  ·  PCE: ${pce?pce.toFixed(1)+'%':'—'}  ·  Takt: ${takt?fmtS(takt):'—'}  ·  WIP: ${totalWIP||'—'}`}
    </text>
  </>)

  return (
    <div>
      {/* KPI strip */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14, alignItems:'stretch' }}>
        {[
          { l:'Lead Time',   v:fmtS(lt),                        c:'#0176D3' },
          { l:'Value Added', v:fmtS(mainCT),                    c:'#059669' },
          { l:'NVA / Wait',  v:fmtS(mainWT),                    c:'#6B7280' },
          { l:'Takt Time',   v:takt?fmtS(takt):'—',             c:'#0EA5E9' },
          { l:'PCE',         v:fmtPCE(pce),                     c:pceColor(pce) },
          { l:'Total WIP',   v:totalWIP||'—',                   c:totalWIP>0?'#D97706':'#6B7280' },
        ].map(m => (
          <div key={m.l} style={{ flex:'1 1 100px', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px' }}>
            <div style={{ fontSize:8, color:'var(--text3)', letterSpacing:1.2, fontFamily:'monospace', marginBottom:4 }}>{m.l}</div>
            <div style={{ fontSize:16, fontWeight:700, color:m.c }}>{m.v}</div>
          </div>
        ))}
        <button onClick={() => setFullscreen(true)}
          style={{ padding:'8px 14px', borderRadius:8, fontSize:14, cursor:'pointer', background:'transparent', border:'1px solid var(--border)', color:'var(--text2)', alignSelf:'stretch' }}
          title="Fullscreen"><ExternalLinkIcon size={14}/></button>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#FFFFFF', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', background:'#1E3A5F', color:'#FFF', flexShrink:0 }}>
            <span style={{ fontSize:14, fontWeight:700 }}>{project.name} — Value Stream Map · ISO 22468:2020</span>
            <div style={{ display:'flex', gap:10 }}>
              <span style={{ fontSize:11, opacity:0.5 }}>Esc to exit</span>
              <button onClick={()=>setFullscreen(false)} style={{ padding:'5px 14px', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)', color:'#FFF' }}><XIcon size={13} color='white'/></button>
            </div>
          </div>
          <div style={{ flex:1, overflow:'auto', padding:20 }}>
            <svg width={TOTAL_W} height={TOTAL_H} style={{ display:'block', minWidth:TOTAL_W }}>
              {svgContent('#FFFFFF')}
            </svg>
          </div>
        </div>
      )}

      {/* Normal view */}
      <div style={{ background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:8, overflowX:'auto', padding:16 }}>
        <svg width={TOTAL_W} height={TOTAL_H} style={{ display:'block', minWidth:TOTAL_W }}>
          {svgContent('#FFFFFF')}
        </svg>
      </div>

      {/* ISO Legend */}
      <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginTop:10, fontSize:11, color:'var(--text2)' }}>
        {[
          { c:'#FFFFFF', s:'#374151', l:'Process (VA)' },
          { c:'#FFFFFF', s:'#DC2626', l:'Bottleneck ▲TAKT' },
          { c:'#FEF3C7', s:'#D97706', l:'WIP Inventory ▲' },
          { c:'#EDE9FE', s:'#7C3AED', l:'Supermarket S/M' },
          { c:'#FEF9C3', s:'#EAB308', l:'Kaizen 改善' },
          { c:'#D1FAE5', s:'#059669', l:'Production Control' },
          { c:'#DBEAFE', s:'#0EA5E9', l:'Info Flow ----' },
        ].map(({c,s,l}) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:12, height:12, background:c, border:`1.5px solid ${s}`, flexShrink:0 }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VSMMap
