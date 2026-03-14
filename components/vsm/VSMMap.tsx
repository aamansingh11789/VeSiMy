// @ts-nocheck
'use client'
// ── components/vsm/VSMMap.tsx ─────────────────────────────────────────────────
// Lean-standard Value Stream Map  ·  ISO 22468:2020
// Proper symbols: factory, truck, push arrows, data boxes, WIP triangles, timeline

import { useState, useEffect } from 'react'
import type { Step, Branch, Project } from '@/lib/store'

interface Props {
  steps: Step[]
  branches: Branch[]
  project: Project
}

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60) return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(2)}h`
}

// ── SVG factory icon (building silhouette) ─────────────────────────────────
const FactoryIcon = ({ x, y, w = 64, h = 56, label = '' }: any) => (
  <g>
    <rect x={x} y={y + 12} width={w} height={h - 12} fill="#5B7FA6" stroke="#3A5A7C" strokeWidth={1.2} rx={2} />
    <polygon points={`${x},${y + 14} ${x + w/2},${y} ${x + w},${y + 14}`} fill="#4A6A8F" stroke="#3A5A7C" strokeWidth={1.2} />
    <rect x={x + 8}      y={y + 20} width={10} height={10} fill="#C8DCF0" rx={1} />
    <rect x={x + 24}     y={y + 20} width={10} height={10} fill="#C8DCF0" rx={1} />
    <rect x={x + 40}     y={y + 20} width={10} height={10} fill="#C8DCF0" rx={1} />
    <rect x={x + w/2 - 6} y={y + h - 16} width={12} height={16} fill="#3A5A7C" rx={1} />
    <rect x={x + w - 14}  y={y + 2}  width={7}  height={14} fill="#4A6A8F" />
    <path d={`M${x+w-10},${y+1} q3,-4 -2,-7`} stroke="#A0A8B8" strokeWidth={1} fill="none" opacity={0.6} />
    {label && (
      <text x={x + w/2} y={y + h + 14} textAnchor="middle" fill="#1F2937" fontSize={10} fontWeight={700} fontFamily="sans-serif">{label}</text>
    )}
  </g>
)

// ── Truck icon ─────────────────────────────────────────────────────────────
const TruckIcon = ({ x, y, w = 52, h = 28 }: any) => (
  <g>
    <rect x={x}              y={y}     width={w * 0.62} height={h}     fill="#F97316" stroke="#C05621" strokeWidth={1} rx={2} />
    <rect x={x + w * 0.62}   y={y + 4} width={w * 0.38} height={h - 4} fill="#FB923C" stroke="#C05621" strokeWidth={1} rx={2} />
    <rect x={x + w * 0.66}   y={y + 7} width={w * 0.22} height={h * 0.38} fill="#DBEAFE" rx={1} />
    <circle cx={x + w * 0.18} cy={y + h + 4} r={5} fill="#374151" />
    <circle cx={x + w * 0.42} cy={y + h + 4} r={5} fill="#374151" />
    <circle cx={x + w * 0.78} cy={y + h + 4} r={5} fill="#374151" />
    <circle cx={x + w * 0.18} cy={y + h + 4} r={2} fill="#6B7280" />
    <circle cx={x + w * 0.42} cy={y + h + 4} r={2} fill="#6B7280" />
    <circle cx={x + w * 0.78} cy={y + h + 4} r={2} fill="#6B7280" />
    <text x={x + w/2} y={y + h + 19} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="sans-serif">Shipment (Daily)</text>
  </g>
)

// ── Process box + data box ─────────────────────────────────────────────────
const VA_BOX_STYLES: Record<string, { fill: string; stroke: string; header: string }> = {
  va:   { fill: '#CCFBF1', stroke: '#0D9488', header: '#0D9488' },
  nnva: { fill: '#FEF9C3', stroke: '#CA8A04', header: '#CA8A04' },
  nva:  { fill: '#FEE2E2', stroke: '#DC2626', header: '#DC2626' },
}

const ProcessBox = ({ x, y, step, takt }: any) => {
  const PW = 96, PH = 64, DH = 64
  const ct  = step.toolData?.stopwatch?.mean || Number(step.cycle_time) || 0
  const co  = step.change_over_time || 0
  const up  = step.uptime != null ? `${step.uptime}%` : '—'
  const ops = step.operators || 1
  const isBN = takt > 0 && ct > 0 && ct > takt * 1.05

  // VA type overrides bottleneck coloring
  const vaStyle = VA_BOX_STYLES[step.va_type as string] || VA_BOX_STYLES.va
  const fill   = isBN ? '#FEE2E2' : vaStyle.fill
  const stroke = isBN ? '#DC2626' : vaStyle.stroke
  const header = isBN ? '#DC2626' : vaStyle.header
  const ctCol  = isBN ? '#DC2626' : vaStyle.stroke

  // Queue step styling
  const isQueue = step.flow_type === 'queue'

  return (
    <g>
      {/* Process rectangle */}
      <rect x={x} y={y} width={PW} height={PH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={3}
        strokeDasharray={isQueue ? '4,2' : undefined} />
      <rect x={x} y={y} width={PW} height={8}  fill={header} rx={3} />
      <rect x={x} y={y+5} width={PW} height={3} fill={header} />
      <text x={x + PW/2} y={y+22} textAnchor="middle" fill="#1F2937" fontSize={9} fontWeight={700} fontFamily="sans-serif">
        {isQueue ? '⏳ ' : ''}{step.name.length > 14 ? step.name.slice(0, 13) + '…' : step.name}
      </text>
      {step.department && (
        <text x={x + PW/2} y={y+33} textAnchor="middle" fill="#6B7280" fontSize={7.5} fontFamily="sans-serif">{step.department}</text>
      )}
      {/* VA type badge */}
      {step.va_type && step.va_type !== 'va' && (
        <text x={x+4} y={y+PH-4} fill={header} fontSize={7} fontWeight={700} fontFamily="monospace">
          {step.va_type === 'nnva' ? 'NNVA' : 'NVA'}
        </text>
      )}
      {/* Operator stick figures */}
      {[...Array(Math.min(ops, 4))].map((_,o) => (
        <g key={o}>
          <circle cx={x + 10 + o*14} cy={y + PH - 12} r={6}   fill="#FFFFFF" stroke={stroke} strokeWidth={1} />
          <circle cx={x + 10 + o*14} cy={y + PH - 18} r={3.5} fill={stroke} />
        </g>
      ))}
      {ops > 4 && <text x={x + 10 + 4*14} y={y + PH - 8} fill="#374151" fontSize={8} fontFamily="sans-serif">+{ops-4}</text>}
      {isBN && <text x={x + PW - 4} y={y+20} textAnchor="end" fill="#DC2626" fontSize={7.5} fontWeight={700} fontFamily="sans-serif">▲TAKT</text>}

      {/* Data box */}
      <rect x={x} y={y+PH} width={PW} height={DH} fill="#FFFFFF" stroke={stroke} strokeWidth={1} />
      <line x1={x} y1={y+PH+DH/3}     x2={x+PW} y2={y+PH+DH/3}     stroke="#E5E7EB" strokeWidth={0.8} />
      <line x1={x} y1={y+PH+DH*2/3}   x2={x+PW} y2={y+PH+DH*2/3}   stroke="#E5E7EB" strokeWidth={0.8} />
      <text x={x+6}  y={y+PH+14}          fill="#6B7280" fontSize={8}  fontFamily="monospace">C/T =</text>
      <text x={x+36} y={y+PH+14}          fill={ctCol}   fontSize={9}  fontWeight={700} fontFamily="monospace">{ct ? fmtS(ct) : '—'}</text>
      <text x={x+6}  y={y+PH+DH/3+14}    fill="#6B7280" fontSize={8}  fontFamily="monospace">C/O =</text>
      <text x={x+36} y={y+PH+DH/3+14}    fill="#374151" fontSize={9}  fontFamily="monospace">{co ? fmtS(co) : '0s'}</text>
      <text x={x+6}  y={y+PH+DH*2/3+14}  fill="#6B7280" fontSize={8}  fontFamily="monospace">Uptime</text>
      <text x={x+44} y={y+PH+DH*2/3+14}  fill="#374151" fontSize={9}  fontFamily="monospace">{up}</text>
    </g>
  )
}

// ── WIP inventory triangle ─────────────────────────────────────────────────
const WIPTriangle = ({ x, y, wip }: any) => (
  <g>
    <polygon points={`${x},${y+20} ${x+14},${y} ${x+28},${y+20}`} fill="#FEF3C7" stroke="#D97706" strokeWidth={1.5} />
    <text x={x+14} y={y+16} textAnchor="middle" fill="#92400E" fontSize={8} fontWeight={700} fontFamily="sans-serif">{wip}</text>
  </g>
)

// ── Build VSM SVG as an HTML string (for export embed) ────────────────────
function buildVSMString(steps: Step[], project: Project): string {
  const main = steps.filter(s => s.is_main_flow !== false).sort((a,b) => a.position - b.position)
  const PW=96, PH=64, DH=64, GAP=60
  const ML=60, MR=60
  const FACT_W=64, FACT_H=56
  const TRUCK_W=52, TRUCK_H=28
  const PCTRL_W=130, PCTRL_H=44
  const PCTRL_Y=24
  const SUPPLIER_Y=84
  const TRUCK_Y=162
  const PROC_Y=212
  const TIMELINE_Y = PROC_Y + PH + DH + 24
  const TL_BASE = TIMELINE_Y + 36
  const TOTAL_H = TL_BASE + 70

  const n = main.length
  const totalFlowW = n * PW + (n-1) * GAP
  const W = Math.max(ML + FACT_W + TRUCK_W + totalFlowW + TRUCK_W + FACT_W + MR + 40, 750)
  const flowX = (W - totalFlowW) / 2
  const sx = (i: number) => flowX + i * (PW + GAP)
  const supX = ML, custX = W - MR - FACT_W, pctX = (W - PCTRL_W) / 2

  const takt = project.takt_time ? Number(project.takt_time)
    : project.demand && project.available_time_sec ? Number(project.available_time_sec) / Number(project.demand)
    : project.demand && project.working_hours ? (Number(project.working_hours) * 3600) / Number(project.demand)
    : 0
  const mainCT = main.reduce((a,s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time)||0), 0)
  const mainWT = main.reduce((a,s) => a + (Number(s.wait_time)||0), 0)
  const lt = mainCT + mainWT
  const pce = lt > 0 ? (mainCT/lt)*100 : 0
  const totalWIP = steps.reduce((a,s) => a + (Number(s.wip)||0), 0)

  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${TOTAL_H}" viewBox="0 0 ${W} ${TOTAL_H}" style="background:#FFFFFF;font-family:sans-serif;">`
  s += `<defs>
    <marker id="ma" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#374151"/></marker>
    <marker id="ia" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#0EA5E9"/></marker>
  </defs>`

  // Title
  s += `<text x="${W/2}" y="16" text-anchor="middle" fill="#1F2937" font-size="13" font-weight="700">Current-State Value Stream Map — ${project.name}</text>`

  // Production Control
  s += `<rect x="${pctX}" y="${PCTRL_Y}" width="${PCTRL_W}" height="${PCTRL_H}" fill="#A7F3D0" stroke="#059669" stroke-width="1.5" rx="4"/>`
  s += `<text x="${pctX+PCTRL_W/2}" y="${PCTRL_Y+17}" text-anchor="middle" fill="#065F46" font-size="10" font-weight="700">Production</text>`
  s += `<text x="${pctX+PCTRL_W/2}" y="${PCTRL_Y+31}" text-anchor="middle" fill="#065F46" font-size="10" font-weight="700">Control</text>`

  // Info arrows
  s += `<polyline points="${pctX},${PCTRL_Y+PCTRL_H/2} ${pctX-14},${PCTRL_Y+PCTRL_H/2+10} ${supX+FACT_W+4},${SUPPLIER_Y+FACT_H/2}" stroke="#0EA5E9" stroke-width="1.5" fill="none" stroke-dasharray="5,3" opacity="0.8" marker-end="url(#ia)"/>`
  s += `<polyline points="${pctX+PCTRL_W},${PCTRL_Y+PCTRL_H/2} ${pctX+PCTRL_W+14},${PCTRL_Y+PCTRL_H/2+10} ${custX-4},${SUPPLIER_Y+FACT_H/2}" stroke="#0EA5E9" stroke-width="1.5" fill="none" stroke-dasharray="5,3" opacity="0.8" marker-end="url(#ia)"/>`
  s += `<text x="${pctX-60}" y="${SUPPLIER_Y-4}" fill="#0EA5E9" font-size="8" opacity="0.9">Weekly delivery</text>`
  s += `<text x="${custX-24}" y="${SUPPLIER_Y-4}" fill="#0EA5E9" font-size="8" opacity="0.9">Weekly delivery</text>`
  main.forEach((_, i) => {
    const px = sx(i) + PW/2
    const mx = pctX + PCTRL_W/2 + (px - pctX - PCTRL_W/2)*0.4
    s += `<polyline points="${pctX+PCTRL_W/2},${PCTRL_Y+PCTRL_H} ${mx},${PROC_Y-24} ${px},${PROC_Y}" stroke="#0EA5E9" stroke-width="1.2" fill="none" stroke-dasharray="4,3" opacity="0.55" marker-end="url(#ia)"/>`
  })

  // Supplier & Customer factories
  const esc = (t: string) => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const factory = (fx: number, fy: number, fw: number, fh: number, lbl: string) => {
    let f = `<rect x="${fx}" y="${fy+12}" width="${fw}" height="${fh-12}" fill="#5B7FA6" stroke="#3A5A7C" stroke-width="1.2" rx="2"/>`
    f += `<polygon points="${fx},${fy+14} ${fx+fw/2},${fy} ${fx+fw},${fy+14}" fill="#4A6A8F" stroke="#3A5A7C" stroke-width="1.2"/>`
    f += `<rect x="${fx+8}" y="${fy+20}" width="10" height="10" fill="#C8DCF0" rx="1"/>`
    f += `<rect x="${fx+24}" y="${fy+20}" width="10" height="10" fill="#C8DCF0" rx="1"/>`
    f += `<rect x="${fx+40}" y="${fy+20}" width="10" height="10" fill="#C8DCF0" rx="1"/>`
    f += `<rect x="${fx+fw/2-6}" y="${fy+fh-16}" width="12" height="16" fill="#3A5A7C" rx="1"/>`
    f += `<rect x="${fx+fw-14}" y="${fy+2}" width="7" height="14" fill="#4A6A8F"/>`
    f += `<text x="${fx+fw/2}" y="${fy+fh+14}" text-anchor="middle" fill="#1F2937" font-size="10" font-weight="700">${esc(lbl)}</text>`
    return f
  }
  s += factory(supX, SUPPLIER_Y, FACT_W, FACT_H, project.supplier || 'Supplier')
  s += factory(custX, SUPPLIER_Y, FACT_W, FACT_H, project.customer || 'Customer')
  if (project.demand) {
    s += `<text x="${custX+FACT_W/2}" y="${SUPPLIER_Y+FACT_H+28}" text-anchor="middle" fill="#6B7280" font-size="8">${project.demand}/day</text>`
  }

  // Trucks
  const truck = (tx: number, ty: number) => {
    let t = `<rect x="${tx}" y="${ty}" width="${TRUCK_W*0.62}" height="${TRUCK_H}" fill="#F97316" stroke="#C05621" stroke-width="1" rx="2"/>`
    t += `<rect x="${tx+TRUCK_W*0.62}" y="${ty+4}" width="${TRUCK_W*0.38}" height="${TRUCK_H-4}" fill="#FB923C" stroke="#C05621" stroke-width="1" rx="2"/>`
    t += `<rect x="${tx+TRUCK_W*0.66}" y="${ty+7}" width="${TRUCK_W*0.22}" height="${TRUCK_H*0.38}" fill="#DBEAFE" rx="1"/>`
    ;[0.18,0.42,0.78].forEach(r => {
      t += `<circle cx="${tx+TRUCK_W*r}" cy="${ty+TRUCK_H+4}" r="5" fill="#374151"/>`
      t += `<circle cx="${tx+TRUCK_W*r}" cy="${ty+TRUCK_H+4}" r="2" fill="#6B7280"/>`
    })
    t += `<text x="${tx+TRUCK_W/2}" y="${ty+TRUCK_H+19}" text-anchor="middle" fill="#374151" font-size="8">Shipment (Daily)</text>`
    return t
  }
  const t1x = supX + FACT_W + 10, t2x = custX - TRUCK_W - 10, ty = TRUCK_Y - TRUCK_H/2
  s += truck(t1x, ty)
  s += truck(t2x, ty)
  s += `<line x1="${t1x+TRUCK_W+4}" y1="${TRUCK_Y}" x2="${sx(0)}" y2="${PROC_Y+PH/2}" stroke="#374151" stroke-width="2" marker-end="url(#ma)"/>`
  s += `<line x1="${sx(n-1)+PW+4}" y1="${PROC_Y+PH/2}" x2="${t2x}" y2="${TRUCK_Y}" stroke="#374151" stroke-width="2" marker-end="url(#ma)"/>`

  // Process boxes
  main.forEach((step, i) => {
    const x = sx(i)
    const ct  = step.toolData?.stopwatch?.mean || Number(step.cycle_time)||0
    const co  = step.change_over_time || 0
    const up  = step.uptime != null ? `${step.uptime}%` : '—'
    const ops = step.operators || 1
    const wip = Number(step.wip) || 0
    const isBN = takt > 0 && ct > 0 && ct > takt * 1.05
    const fill   = isBN ? '#FEE2E2' : '#CCFBF1'
    const stroke = isBN ? '#DC2626' : '#0D9488'
    const ctCol  = isBN ? '#DC2626' : '#0D9488'

    if (i > 0) {
      const ax = sx(i-1)+PW+4, ay = PROC_Y+PH/2
      s += `<line x1="${ax}" y1="${ay}" x2="${x-10}" y2="${ay}" stroke="#374151" stroke-width="2"/>`
      s += `<polygon points="${x-10},${ay-5} ${x},${ay} ${x-10},${ay+5}" fill="#374151"/>`
      s += `<text x="${sx(i-1)+PW+GAP/2}" y="${ay-8}" text-anchor="middle" fill="#9CA3AF" font-size="7.5">PUSH</text>`
      if (wip > 0) {
        const tx2 = sx(i-1)+PW+GAP/2-14, ty2 = ay+6
        s += `<polygon points="${tx2},${ty2+18} ${tx2+14},${ty2} ${tx2+28},${ty2+18}" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/>`
        s += `<text x="${tx2+14}" y="${ty2+14}" text-anchor="middle" fill="#92400E" font-size="8" font-weight="700">${wip}</text>`
      }
    }

    // Process box
    s += `<rect x="${x}" y="${PROC_Y}" width="${PW}" height="${PH}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="3"/>`
    s += `<rect x="${x}" y="${PROC_Y}" width="${PW}" height="8" fill="${isBN?'#DC2626':'#0D9488'}" rx="3"/>`
    s += `<rect x="${x}" y="${PROC_Y+5}" width="${PW}" height="3" fill="${isBN?'#DC2626':'#0D9488'}"/>`
    const nm = step.name.length > 14 ? step.name.slice(0,13)+'…' : step.name
    s += `<text x="${x+PW/2}" y="${PROC_Y+22}" text-anchor="middle" fill="#1F2937" font-size="9" font-weight="700">${esc(nm)}</text>`
    if (step.department) {
      s += `<text x="${x+PW/2}" y="${PROC_Y+33}" text-anchor="middle" fill="#6B7280" font-size="7.5">${esc(step.department)}</text>`
    }
    for (let o = 0; o < Math.min(ops,4); o++) {
      s += `<circle cx="${x+10+o*14}" cy="${PROC_Y+PH-12}" r="6" fill="#FFFFFF" stroke="${stroke}" stroke-width="1"/>`
      s += `<circle cx="${x+10+o*14}" cy="${PROC_Y+PH-18}" r="3.5" fill="${stroke}"/>`
    }
    if (isBN) s += `<text x="${x+PW-4}" y="${PROC_Y+20}" text-anchor="end" fill="#DC2626" font-size="7.5" font-weight="700">▲TAKT</text>`

    // Data box
    s += `<rect x="${x}" y="${PROC_Y+PH}" width="${PW}" height="${DH}" fill="#FFFFFF" stroke="${stroke}" stroke-width="1"/>`
    s += `<line x1="${x}" y1="${PROC_Y+PH+DH/3}" x2="${x+PW}" y2="${PROC_Y+PH+DH/3}" stroke="#E5E7EB" stroke-width="0.8"/>`
    s += `<line x1="${x}" y1="${PROC_Y+PH+DH*2/3}" x2="${x+PW}" y2="${PROC_Y+PH+DH*2/3}" stroke="#E5E7EB" stroke-width="0.8"/>`
    s += `<text x="${x+6}"  y="${PROC_Y+PH+14}"        fill="#6B7280" font-size="8" font-family="monospace">C/T =</text>`
    s += `<text x="${x+36}" y="${PROC_Y+PH+14}"        fill="${ctCol}" font-size="9" font-weight="700" font-family="monospace">${ct?fmtS(ct):'—'}</text>`
    s += `<text x="${x+6}"  y="${PROC_Y+PH+DH/3+14}"  fill="#6B7280" font-size="8" font-family="monospace">C/O =</text>`
    s += `<text x="${x+36}" y="${PROC_Y+PH+DH/3+14}"  fill="#374151" font-size="9" font-family="monospace">${co?fmtS(co):'0s'}</text>`
    s += `<text x="${x+6}"  y="${PROC_Y+PH+DH*2/3+14}" fill="#6B7280" font-size="8" font-family="monospace">Uptime</text>`
    s += `<text x="${x+44}" y="${PROC_Y+PH+DH*2/3+14}" fill="#374151" font-size="9" font-family="monospace">${up}</text>`

    // Kaizen burst if bottleneck
    if (isBN) {
      const bpts = Array.from({length:16},(_,k)=>{const a=(k/16)*Math.PI*2-Math.PI/2;const r=k%2===0?14:8;return `${x+PW-2+Math.cos(a)*r},${PROC_Y-2+Math.sin(a)*r}`}).join(' ')
      s += `<polygon points="${bpts}" fill="#FEF9C3" stroke="#EAB308" stroke-width="1.2"/>`
    }
  })

  // Timeline
  s += `<line x1="${flowX}" y1="${TL_BASE}" x2="${sx(n-1)+PW}" y2="${TL_BASE}" stroke="#D1D5DB" stroke-width="1.5"/>`
  main.forEach((step, i) => {
    const ct = step.toolData?.stopwatch?.mean || Number(step.cycle_time)||0
    const wt = Number(step.wait_time)||0
    const isBN = takt > 0 && ct > takt * 1.05
    const ph = ct > 0 ? Math.max(6, Math.min(36, (ct/Math.max(mainCT||1,1))*36)) : 4
    const bx = sx(i)

    if (wt > 0 && i > 0) {
      const vh = Math.max(4, Math.min(18, (wt/Math.max(mainWT||1,1))*18))
      s += `<rect x="${sx(i-1)+PW+4}" y="${TL_BASE}" width="${GAP-8}" height="${vh}" fill="#FCA5A5" rx="2" opacity="0.7"/>`
      s += `<text x="${sx(i-1)+PW+GAP/2}" y="${TL_BASE+vh+10}" text-anchor="middle" fill="#9CA3AF" font-size="7.5" font-family="monospace">${fmtS(wt)}</text>`
    }
    s += `<rect x="${bx+4}" y="${TL_BASE-ph}" width="${PW-8}" height="${ph}" fill="${isBN?'#FCA5A5':'#6EE7B7'}" rx="2" opacity="0.9"/>`
    s += `<text x="${bx+PW/2}" y="${TL_BASE-ph-3}" text-anchor="middle" fill="${isBN?'#DC2626':'#059669'}" font-size="8" font-weight="700" font-family="monospace">${ct?fmtS(ct):'—'}</text>`
  })

  // Footer KPIs
  const ky = TL_BASE + 42
  s += `<text x="${flowX}" y="${ky}" fill="#6B7280" font-size="9" font-family="monospace">Lead Time: ${fmtS(lt)}   ·   VA: ${fmtS(mainCT)}   ·   NVA: ${fmtS(mainWT)}   ·   PCE: ${pce?pce.toFixed(1)+'%':'—'}   ·   Takt: ${takt?fmtS(takt):'—'}   ·   WIP: ${totalWIP||'—'}</text>`

  s += `</svg>`
  return s
}

// ── Export to HTML with embedded SVM diagram ──────────────────────────────
function exportVSMReport(steps: Step[], project: Project, branches: Branch[]) {
  const main = steps.filter(s => s.is_main_flow !== false).sort((a,b) => a.position - b.position)
  const takt = project.takt_time ? Number(project.takt_time)
    : project.demand && project.available_time_sec ? Number(project.available_time_sec) / Number(project.demand)
    : project.demand && project.working_hours ? (Number(project.working_hours) * 3600) / Number(project.demand)
    : 0
  const mainCT = main.reduce((a,s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time)||0), 0)
  const mainWT = main.reduce((a,s) => a + (Number(s.wait_time)||0), 0)
  const totalWIP = steps.reduce((a,s) => a + (Number(s.wip)||0), 0)
  const lt = mainCT + mainWT
  const pce = lt > 0 ? (mainCT/lt)*100 : 0
  const bottlenecks = main.filter(s => { const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time)||0; return takt>0&&ct>takt*1.05 })

  const svgStr = buildVSMString(steps, project)
  const b64 = typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(svgStr))) : Buffer.from(svgStr).toString('base64')

  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const docNum = `VSM-${(project.name||'MAP').replace(/\s+/g,'-').toUpperCase().slice(0,8)}-${Date.now().toString(36).toUpperCase().slice(-4)}`

  const stepRows = main.map((s, i) => {
    const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time)||0
    const wt = Number(s.wait_time)||0
    const isBN = takt > 0 && ct > takt*1.05
    return `<tr>
      <td style="text-align:center;font-weight:700">${i+1}</td>
      <td style="font-weight:600">${s.name}</td>
      <td>${s.department||'—'}</td>
      <td style="${isBN?'color:#DC2626;font-weight:700':''}">${ct?fmtS(ct):'—'}${isBN?' ▲':''}</td>
      <td>${wt?fmtS(wt):'—'}</td>
      <td style="text-align:center">${s.operators||1}</td>
      <td style="text-align:center">${s.wip||'—'}</td>
      <td style="text-align:center">${s.uptime!=null?s.uptime+'%':'—'}</td>
      <td style="text-align:center">${s.defect_rate!=null?s.defect_rate+'%':'—'}</td>
    </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<title>VSM Report — ${project.name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,"Times New Roman",serif;font-size:11pt;color:#1F2937;background:#FFF;padding:28px 40px;max-width:1100px;margin:0 auto}
@media print{body{padding:12px 18px}.no-print{display:none!important}@page{size:A3 landscape;margin:12mm}}
.hdr{border:2px solid #1E3A5F;border-radius:4px;overflow:hidden;margin-bottom:24px}
.hdr-top{background:#1E3A5F;color:#FFF;padding:12px 18px;display:flex;justify-content:space-between;align-items:center}
.hdr-top h1{font-size:14pt;font-weight:700}
.meta{font-size:9pt;opacity:.85;text-align:right;line-height:1.6}
.hdr-sub{background:#F8FAFC;padding:10px 18px;display:flex;gap:28px;font-size:9.5pt;color:#475569}
.hdr-sub strong{color:#1F2937}
h2{font-size:11pt;font-weight:700;color:#1E3A5F;margin:22px 0 10px;padding-bottom:5px;border-bottom:1.5px solid #CBD5E1;text-transform:uppercase;letter-spacing:.5px}
.vsm{width:100%;overflow:auto;border:1px solid #E5E7EB;border-radius:6px;padding:12px;background:#FAFAFA;margin-bottom:16px}
.vsm img{max-width:100%;display:block}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0 18px}
.kpi{border:1px solid #CBD5E1;border-radius:6px;padding:10px 14px;background:#F8FAFC}
.kpi-l{font-size:8.5pt;color:#64748B;text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.kpi-v{font-size:18pt;font-weight:700;color:#1E3A5F;font-family:"Courier New",monospace}
.kpi-s{font-size:8pt;color:#94A3B8;margin-top:3px}
table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:10pt}
th{background:#1E3A5F;color:#FFF;padding:7px 10px;text-align:left;font-size:9pt}
td{padding:7px 10px;border:1px solid #CBD5E1;vertical-align:top}
tr:nth-child(even) td{background:#F8FAFC}
.bn{border-left:4px solid #DC2626;padding:10px 14px;background:#FFF5F5;margin:8px 0;border-radius:0 4px 4px 0}
.bn-l{font-size:8.5pt;font-weight:700;color:#DC2626;text-transform:uppercase;margin-bottom:5px}
.ok{border-left:4px solid #059669;padding:10px 14px;background:#F0FDF4;margin:8px 0;border-radius:0 4px 4px 0}
.legend{display:flex;gap:16px;flex-wrap:wrap;margin:10px 0;font-size:9pt}
.leg{display:flex;align-items:center;gap:6px}
.dot{width:12px;height:12px;border-radius:2px}
.footer{margin-top:32px;border-top:1px solid #CBD5E1;padding-top:10px;font-size:8.5pt;color:#94A3B8;display:flex;justify-content:space-between}
.no-print{position:fixed;top:16px;right:16px;display:flex;gap:8px}
.bp{padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:11pt;font-weight:600;background:#1E3A5F;color:#FFF}
.bc{padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:11pt;background:#F1F5F9;color:#475569}
</style>
</head><body>
<div class="no-print">
  <button class="bp" onclick="window.print()">🖨 Print / Save PDF</button>
  <button class="bc" onclick="window.close()">✕ Close</button>
</div>
<div class="hdr">
  <div class="hdr-top"><h1>Current-State Value Stream Map</h1><div class="meta">Doc: ${docNum}<br>Rev. A · ${date}<br>ISO 22468:2020</div></div>
  <div class="hdr-sub">
    <span><strong>Project:</strong> ${project.name}</span>
    <span><strong>Industry:</strong> ${project.industry||'—'}</span>
    <span><strong>Supplier:</strong> ${project.supplier||'—'}</span>
    <span><strong>Customer:</strong> ${project.customer||'—'}</span>
  </div>
</div>

<h2>1. Value Stream Map Diagram</h2>
<div class="vsm"><img src="data:image/svg+xml;base64,${b64}" alt="VSM Diagram" style="width:100%;min-width:600px"/></div>
<div class="legend">
  <div class="leg"><div class="dot" style="background:#CCFBF1;border:1px solid #0D9488"></div>Process Step</div>
  <div class="leg"><div class="dot" style="background:#FEE2E2;border:1px solid #DC2626"></div>Bottleneck</div>
  <div class="leg"><div class="dot" style="background:#F97316;border:1px solid #C05621"></div>Truck / Shipment</div>
  <div class="leg"><div class="dot" style="background:#FEF3C7;border:1px solid #D97706"></div>WIP Triangle</div>
  <div class="leg"><div class="dot" style="background:#A7F3D0;border:1px solid #059669"></div>Production Control</div>
  <div class="leg"><div class="dot" style="background:#DBEAFE;border:1px solid #0EA5E9"></div>Information Flow (dashed)</div>
  <div class="leg"><div class="dot" style="background:#FEF9C3;border:1px solid #EAB308"></div>Kaizen Opportunity</div>
</div>

<h2>2. Key Performance Indicators</h2>
<div class="kpi-grid">
  <div class="kpi"><div class="kpi-l">Lead Time</div><div class="kpi-v">${fmtS(lt)}</div><div class="kpi-s">Total span</div></div>
  <div class="kpi"><div class="kpi-l">Value-Added CT</div><div class="kpi-v">${fmtS(mainCT)}</div><div class="kpi-s">Process time</div></div>
  <div class="kpi"><div class="kpi-l">NVA / Wait</div><div class="kpi-v">${fmtS(mainWT)}</div><div class="kpi-s">${lt>0?((mainWT/lt)*100).toFixed(0):0}% of lead time</div></div>
  <div class="kpi"><div class="kpi-l">PCE</div><div class="kpi-v" style="color:${pce>25?'#059669':pce>10?'#D97706':'#DC2626'}">${pce?pce.toFixed(1)+'%':'—'}</div><div class="kpi-s">Process Cycle Efficiency</div></div>
  <div class="kpi"><div class="kpi-l">Takt Time</div><div class="kpi-v">${takt?fmtS(takt):'—'}</div><div class="kpi-s">Customer demand rate</div></div>
  <div class="kpi"><div class="kpi-l">Total WIP</div><div class="kpi-v">${totalWIP||'—'}</div><div class="kpi-s">In-process units</div></div>
  <div class="kpi"><div class="kpi-l">Steps</div><div class="kpi-v">${main.length}</div><div class="kpi-s">Main flow</div></div>
  <div class="kpi"><div class="kpi-l">Bottlenecks</div><div class="kpi-v" style="color:${bottlenecks.length>0?'#DC2626':'#059669'}">${bottlenecks.length}</div><div class="kpi-s">Over takt</div></div>
</div>

<h2>3. Process Step Data</h2>
<table>
  <thead><tr><th>#</th><th>Process Step</th><th>Department</th><th>Cycle Time</th><th>Wait Time</th><th>Operators</th><th>WIP</th><th>Uptime</th><th>Defect %</th></tr></thead>
  <tbody>${stepRows}
    <tr style="background:#F0F0F0;font-weight:700">
      <td colspan="3">TOTALS</td>
      <td>${fmtS(mainCT)}</td><td>${fmtS(mainWT)}</td>
      <td>${main.reduce((a,s)=>a+(s.operators||1),0)}</td>
      <td>${totalWIP||'—'}</td>
      <td colspan="2">Lead Time: ${fmtS(lt)}</td>
    </tr>
  </tbody>
</table>

<h2>4. Bottleneck & Waste Analysis</h2>
${bottlenecks.length>0 ? bottlenecks.map(s=>{
  const ct=s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0
  return `<div class="bn"><div class="bn-l">⚠ Bottleneck — ${s.name}</div><p>CT = <strong>${fmtS(ct)}</strong> exceeds Takt = <strong>${fmtS(takt)}</strong> by <strong>${fmtS(ct-takt)}</strong> (+${(((ct-takt)/takt)*100).toFixed(0)}%). Apply capacity balancing per ISO 22468 §5.2.4.</p></div>`
}).join('') : '<div class="ok"><strong>✓ No bottlenecks detected.</strong> All steps within takt time.</div>'}

<h2>5. Improvement Actions</h2>
<table>
  <thead><tr><th>#</th><th>Action</th><th>ISO Reference</th><th>Priority</th><th>Benefit</th></tr></thead>
  <tbody>
    ${bottlenecks.map((s,i)=>`<tr><td>${i+1}</td><td>Capacity balance <strong>${s.name}</strong></td><td>ISO 22468 §5.2.4</td><td style="color:#DC2626;font-weight:700">CRITICAL</td><td>Restore takt compliance</td></tr>`).join('')}
    ${mainWT>0?`<tr><td>${bottlenecks.length+1}</td><td>Reduce queue time (${fmtS(mainWT)}) via pull scheduling</td><td>ISO 22468 §5.3</td><td style="color:#D97706;font-weight:700">HIGH</td><td>PCE: ${pce.toFixed(1)}% → ${Math.min(100,pce*1.5).toFixed(0)}%</td></tr>`:''}
    <tr><td>${bottlenecks.length+2}</td><td>Document future-state VSM with kaizen opportunities</td><td>ISO 22468 §6</td><td style="color:#0D9488;font-weight:700">MEDIUM</td><td>Future-state target map</td></tr>
  </tbody>
</table>

<div class="footer"><span>${docNum} · Rev. A · Generated ${date}</span><span>VeSiMy CI Platform — vesimy.com</span></div>
</body></html>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
}

// ── ISO lean symbols (React SVG components) ────────────────────────────────

/** Supermarket — ISO lean: striped shelf rectangle */
const Supermarket = ({ x, y, w = 40, h = 30, label = 'S/M' }: any) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#EDE9FE" stroke="#7C3AED" strokeWidth={1.5} rx={2} />
    {/* Shelf stripes */}
    {[1,2,3].map(i => (
      <line key={i} x1={x} y1={y + i*(h/4)} x2={x+w} y2={y + i*(h/4)} stroke="#7C3AED" strokeWidth={0.6} opacity={0.5} />
    ))}
    <text x={x+w/2} y={y+h/2+4} textAnchor="middle" fill="#5B21B6" fontSize={8} fontWeight={700} fontFamily="sans-serif">{label}</text>
  </g>
)

/** Pull arrow — ISO lean: curved arrow with hollow head */
const PullArrow = ({ x, y, dir = 'right' }: any) => {
  const W = 50
  return (
    <g>
      <path d={`M${x},${y} C${x+W*0.4},${y-14} ${x+W*0.6},${y-14} ${x+W},${y}`}
        stroke="#7C3AED" strokeWidth={2} fill="none" />
      <polygon points={`${x+W},${y-5} ${x+W+10},${y} ${x+W},${y+5}`}
        fill="none" stroke="#7C3AED" strokeWidth={1.5} />
      <text x={x+W/2} y={y-8} textAnchor="middle" fill="#7C3AED" fontSize={7} fontFamily="sans-serif">PULL</text>
    </g>
  )
}

/** Kanban card — small rectangle with K */
const KanbanCard = ({ x, y }: any) => (
  <g>
    <rect x={x} y={y} width={20} height={14} fill="#FEF3C7" stroke="#D97706" strokeWidth={1} rx={2} />
    <text x={x+10} y={y+10} textAnchor="middle" fill="#92400E" fontSize={8} fontWeight={700} fontFamily="sans-serif">K</text>
  </g>
)

/** Kaizen burst on React SVG */
const KaizenBurstR = ({ x, y, r = 16 }: any) => {
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

// ── React component ────────────────────────────────────────────────────────
export function VSMMap({ steps, branches, project }: Props) {
  if (!steps.length) {
    return (
      <div style={{ textAlign: 'center', padding: '90px 0', color: 'var(--text3)' }}>
        <div style={{ fontSize: 42, marginBottom: 14 }}>∿</div>
        <div style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 8 }}>No value stream mapped yet</div>
        <div style={{ fontSize: 13 }}>Add process steps in Builder to generate the current-state map.</div>
      </div>
    )
  }

  const mainSteps = steps.filter(s => s.is_main_flow !== false).sort((a,b) => a.position - b.position)

  // Branch groups
  const branchSteps = steps.filter(s => s.is_main_flow === false)
  const branchGroups: Record<string, Step[]> = {}
  branchSteps.forEach(s => {
    if (!s.branch_id) return
    if (!branchGroups[s.branch_id]) branchGroups[s.branch_id] = []
    branchGroups[s.branch_id].push(s)
  })
  Object.values(branchGroups).forEach(g => g.sort((a,b) => (a.branch_position||0)-(b.branch_position||0)))
  const branchIds = Object.keys(branchGroups)
  const BRANCH_COLORS = ['#7C3AED','#0EA5E9','#10B981','#F59E0B','#EC4899','#06B6D4']

  const takt = project.takt_time ? Number(project.takt_time)
    : project.demand && project.available_time_sec ? Number(project.available_time_sec) / Number(project.demand)
    : project.demand && project.working_hours ? (Number(project.working_hours)*3600) / Number(project.demand)
    : 0

  const mainCT = mainSteps.reduce((a,s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time)||0), 0)
  const mainWT = mainSteps.reduce((a,s) => a + (Number(s.wait_time)||0), 0)
  const lt = mainCT + mainWT
  const pce = lt > 0 ? (mainCT/lt)*100 : 0

  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    document.addEventListener('keydown', onKey)
    const nav     = document.querySelector('.bottom-nav') as HTMLElement | null
    const sidebar = document.querySelector('aside') as HTMLElement | null
    if (nav)     nav.style.setProperty('display', 'none', 'important')
    if (sidebar) sidebar.style.setProperty('display', 'none', 'important')
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      if (nav)     nav.style.removeProperty('display')
      if (sidebar) sidebar.style.removeProperty('display')
      document.body.style.overflow = ''
    }
  }, [fullscreen])

  // ── Layout constants ──
  const PW=96, PH=64, DH=64, GAP=60
  const ML=70, MR=70
  const FACT_W=64, FACT_H=56
  const TRUCK_W=52, TRUCK_H=28
  const PCTRL_W=130, PCTRL_H=44
  const TOP_PAD = 48          // extra top space so title never clips
  const PCTRL_Y = TOP_PAD + 8
  const SUPPLIER_Y = TOP_PAD + 68
  const TRUCK_Y    = TOP_PAD + 148
  const PROC_Y     = TOP_PAD + 196
  const TIMELINE_Y = PROC_Y + PH + DH + 24
  const TL_BASE    = TIMELINE_Y + 36
  const BRANCH_LANE_H = PH + DH + 48
  const BRANCH_GAP    = 40
  const BRANCH_START_Y = TL_BASE + 56
  const TOTAL_H = BRANCH_START_Y + branchIds.length * (BRANCH_LANE_H + BRANCH_GAP) + 60

  const n = mainSteps.length
  const maxBranchCols = branchIds.length ? Math.max(...branchIds.map(bid => branchGroups[bid].length)) : 0
  const totalFlowW = Math.max(n, maxBranchCols) * PW + (Math.max(n, maxBranchCols)-1) * GAP
  const TOTAL_W = Math.max(ML + FACT_W + TRUCK_W + totalFlowW + TRUCK_W + FACT_W + MR + 40, 800)
  const flowX = (TOTAL_W - totalFlowW) / 2
  const sx  = (i: number) => flowX + i * (PW + GAP)
  const supX = ML, custX = TOTAL_W - MR - FACT_W, pctX = (TOTAL_W - PCTRL_W) / 2
  const t1x = supX + FACT_W + 10, t2x = custX - TRUCK_W - 10, tyTruck = TRUCK_Y - TRUCK_H/2

  const renderSVGContent = (bgFill = '#F9FAFB') => (<>
    <defs>
      <marker id="infoArrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0,7 2.5,0 5" fill="#0EA5E9" />
      </marker>
      <marker id="matArrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0,7 2.5,0 5" fill="#374151" />
      </marker>
      {branchIds.map((bid,i) => (
        <marker key={bid} id={`bArr-${bid}`} markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill={branches.find(b=>b.branch_id===bid)?.color||BRANCH_COLORS[i%BRANCH_COLORS.length]} />
        </marker>
      ))}
    </defs>

    <rect width={TOTAL_W} height={TOTAL_H} fill={bgFill} />

    {/* Title bar — opaque background so it never gets hidden */}
    <rect x={0} y={0} width={TOTAL_W} height={TOP_PAD} fill={bgFill} />
    <text x={TOTAL_W/2} y={18} textAnchor="middle" fill="#1F2937" fontSize={13} fontWeight={700} fontFamily="sans-serif">
      Current-State Value Stream Map
    </text>
    <text x={TOTAL_W/2} y={34} textAnchor="middle" fill="#6B7280" fontSize={9} fontFamily="sans-serif">
      {project.name} · {project.industry || 'Manufacturing / Operations'} · ISO 22468:2020
    </text>

    {/* Production Control */}
    <ProdCtrl x={pctX} y={PCTRL_Y} w={PCTRL_W} h={PCTRL_H} />

    {/* Info flow: prod ctrl → supplier */}
    <polyline
      points={`${pctX},${PCTRL_Y+PCTRL_H/2} ${pctX-16},${PCTRL_Y+PCTRL_H/2+10} ${supX+FACT_W+4},${SUPPLIER_Y+FACT_H/2}`}
      stroke="#0EA5E9" strokeWidth={1.5} fill="none" strokeDasharray="5,3" opacity={0.85} markerEnd="url(#infoArrow)"
    />
    {/* Info flow: prod ctrl → customer */}
    <polyline
      points={`${pctX+PCTRL_W},${PCTRL_Y+PCTRL_H/2} ${pctX+PCTRL_W+16},${PCTRL_Y+PCTRL_H/2+10} ${custX-4},${SUPPLIER_Y+FACT_H/2}`}
      stroke="#0EA5E9" strokeWidth={1.5} fill="none" strokeDasharray="5,3" opacity={0.85} markerEnd="url(#infoArrow)"
    />
    <text x={pctX-60} y={SUPPLIER_Y-4} fill="#0EA5E9" fontSize={8} fontFamily="sans-serif" opacity={0.9}>Weekly delivery</text>
    <text x={custX-22} y={SUPPLIER_Y-4} fill="#0EA5E9" fontSize={8} fontFamily="sans-serif" opacity={0.9}>Weekly delivery</text>

    {/* Info arrows: prod ctrl → each step */}
    {mainSteps.map((_,i) => {
      const px = sx(i) + PW/2
      const mx = pctX + PCTRL_W/2 + (px - pctX - PCTRL_W/2)*0.4
      return (
        <polyline key={i}
          points={`${pctX+PCTRL_W/2},${PCTRL_Y+PCTRL_H} ${mx},${PROC_Y-24} ${px},${PROC_Y}`}
          stroke="#0EA5E9" strokeWidth={1.2} fill="none" strokeDasharray="4,3" opacity={0.5} markerEnd="url(#infoArrow)"
        />
      )
    })}

    {/* Supplier & Customer factories */}
    <FactoryIcon x={supX} y={SUPPLIER_Y} w={FACT_W} h={FACT_H} label={project.supplier || 'Supplier'} />
    <FactoryIcon x={custX} y={SUPPLIER_Y} w={FACT_W} h={FACT_H} label={project.customer || 'Customer'} />
    {project.demand && (
      <text x={custX+FACT_W/2} y={SUPPLIER_Y+FACT_H+28} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="sans-serif">
        {project.demand}/day
      </text>
    )}

    {/* Trucks */}
    <TruckIcon x={t1x} y={tyTruck} w={TRUCK_W} h={TRUCK_H} />
    <TruckIcon x={t2x} y={tyTruck} w={TRUCK_W} h={TRUCK_H} />

    {/* Material flow arrows */}
    <line x1={t1x+TRUCK_W+4} y1={TRUCK_Y} x2={sx(0)} y2={PROC_Y+PH/2} stroke="#374151" strokeWidth={2} markerEnd="url(#matArrow)" />
    <line x1={sx(n-1)+PW+4} y1={PROC_Y+PH/2} x2={t2x} y2={TRUCK_Y} stroke="#374151" strokeWidth={2} markerEnd="url(#matArrow)" />

    {/* Main process steps */}
    {mainSteps.map((step, i) => {
      const x = sx(i)
      const wip = Number(step.wip) || 0
      const ct = step.toolData?.stopwatch?.mean || Number(step.cycle_time)||0
      const isBN = takt > 0 && ct > takt*1.05

      return (
        <g key={step.id}>
          {i > 0 && (
            <g>
              {/* Push arrow */}
              <line x1={sx(i-1)+PW+4} y1={PROC_Y+PH/2} x2={x-10} y2={PROC_Y+PH/2} stroke="#374151" strokeWidth={2} />
              <polygon points={`${x-10},${PROC_Y+PH/2-5} ${x},${PROC_Y+PH/2} ${x-10},${PROC_Y+PH/2+5}`} fill="#374151" />
              <text x={sx(i-1)+PW+GAP/2} y={PROC_Y+PH/2-8} textAnchor="middle" fill="#9CA3AF" fontSize={7.5} fontFamily="sans-serif">PUSH</text>
              {/* WIP inventory triangle */}
              {wip > 0 && (
                <g>
                  <WIPTriangle x={sx(i-1)+PW+GAP/2-14} y={PROC_Y+PH/2+6} wip={wip} />
                  {/* Supermarket if >20 WIP */}
                  {wip > 20 && <Supermarket x={sx(i-1)+PW+GAP/2-20} y={PROC_Y+PH/2+34} w={40} h={22} label={`${wip}`} />}
                </g>
              )}
              {/* Kanban card if step has kanban data */}
              {step.kanban_qty > 0 && <KanbanCard x={sx(i-1)+PW+GAP/2+8} y={PROC_Y+PH/2-30} />}
            </g>
          )}
          <ProcessBox x={x} y={PROC_Y} step={step} takt={takt} />
          {/* Kaizen burst on bottleneck */}
          {isBN && <KaizenBurstR x={x+PW-2} y={PROC_Y-2} r={14} />}
        </g>
      )
    })}

    {/* ── Timeline ── */}
    <line x1={flowX} y1={TL_BASE} x2={sx(n-1)+PW} y2={TL_BASE} stroke="#D1D5DB" strokeWidth={1.5} />
    <text x={flowX-4} y={TL_BASE-10} textAnchor="end" fill="#6B7280" fontSize={8} fontFamily="monospace">VA</text>
    <text x={flowX-4} y={TL_BASE+12} textAnchor="end" fill="#9CA3AF" fontSize={8} fontFamily="monospace">NVA</text>

    {/* Takt line on timeline */}
    {takt > 0 && (() => {
      const maxCT = Math.max(...mainSteps.map(s => s.toolData?.stopwatch?.mean || Number(s.cycle_time)||0), 1)
      const taktH = Math.max(6, Math.min(36, (takt/maxCT)*36))
      return (
        <g>
          <line
            x1={flowX} y1={TL_BASE - taktH}
            x2={sx(n-1)+PW} y2={TL_BASE - taktH}
            stroke="#EF4444" strokeWidth={1.5} strokeDasharray="6,3" opacity={0.8}
          />
          <text x={flowX-4} y={TL_BASE - taktH + 3} textAnchor="end" fill="#EF4444" fontSize={7.5} fontFamily="monospace" fontWeight={700}>TAKT</text>
        </g>
      )
    })()}

    {mainSteps.map((step, i) => {
      const ct = step.toolData?.stopwatch?.mean || Number(step.cycle_time)||0
      const wt = Number(step.wait_time)||0
      const isBN2 = takt > 0 && ct > takt*1.05
      const ph = ct > 0 ? Math.max(6, Math.min(36, (ct/Math.max(mainCT||1,1))*36)) : 4
      const vh = wt > 0 ? Math.max(4, Math.min(18, (wt/Math.max(mainWT||1,1))*18)) : 0
      const bx = sx(i)
      return (
        <g key={`tl-${step.id}`}>
          {wt > 0 && i > 0 && (
            <g>
              <rect x={sx(i-1)+PW+4} y={TL_BASE} width={GAP-8} height={vh} fill="#FCA5A5" rx={2} opacity={0.7} />
              <text x={sx(i-1)+PW+GAP/2} y={TL_BASE+vh+10} textAnchor="middle" fill="#9CA3AF" fontSize={7.5} fontFamily="monospace">{fmtS(wt)}</text>
            </g>
          )}
          <rect x={bx+4} y={TL_BASE-ph} width={PW-8} height={ph} fill={isBN2?'#FCA5A5':'#6EE7B7'} rx={2} opacity={0.9} />
          <text x={bx+PW/2} y={TL_BASE-ph-3} textAnchor="middle" fill={isBN2?'#DC2626':'#059669'} fontSize={8} fontWeight={700} fontFamily="monospace">{ct?fmtS(ct):'—'}</text>
        </g>
      )
    })}

    {/* ── Branch lanes ── */}
    {branchIds.map((bid, bi) => {
      const bd = branches.find(b => b.branch_id === bid)
      const color = bd?.color || BRANCH_COLORS[bi % BRANCH_COLORS.length]
      const label = bd?.label || branchGroups[bid][0]?.branch_label || `Branch ${bi+1}`
      const ls = branchGroups[bid]
      const laneY = BRANCH_START_Y + bi * (BRANCH_LANE_H + BRANCH_GAP)
      const brCT = ls.reduce((a,s) => a+(s.toolData?.stopwatch?.mean||Number(s.cycle_time)||0), 0)

      // Connect from parent step on main flow
      const pid = bd?.parent_step_id || ls[0]?.branch_parent_id
      const pi = mainSteps.findIndex(s => s.id === pid)
      const branchFlowX = pi >= 0 ? sx(pi) : flowX

      return (
        <g key={bid}>
          {/* Lane label */}
          <text x={branchFlowX - 10} y={laneY + PH/2 + 4} textAnchor="end" fill={color} fontSize={9} fontFamily="monospace" fontWeight={700}>
            {label.toUpperCase()}
          </text>

          {/* Lane background */}
          <rect
            x={branchFlowX - 12}
            y={laneY - 10}
            width={ls.length * (PW + GAP) - GAP + 24}
            height={BRANCH_LANE_H - 12}
            rx={8}
            fill={`${color}08`}
            stroke={`${color}30`}
            strokeWidth={1.2}
            strokeDasharray="6,3"
          />

          {/* Vertical connector from main flow to branch lane */}
          {pi >= 0 && (
            <g>
              <line
                x1={sx(pi)+PW/2} y1={PROC_Y+PH+DH}
                x2={branchFlowX+PW/2} y2={laneY}
                stroke={color} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.6}
                markerEnd={`url(#bArr-${bid})`}
              />
              {/* Supermarket at branch entry if present */}
              {bd?.has_supermarket && (
                <Supermarket x={branchFlowX+PW/2-20} y={laneY-38} w={40} h={24} label="S/M" />
              )}
            </g>
          )}

          {/* Branch steps */}
          {ls.map((step, si) => {
            const bx = branchFlowX + si * (PW + GAP)
            const ct = step.toolData?.stopwatch?.mean || Number(step.cycle_time)||0
            const wip = Number(step.wip)||0
            const isBN = takt > 0 && ct > takt*1.05

            return (
              <g key={step.id}>
                {si > 0 && (
                  <g>
                    <line x1={branchFlowX+(si-1)*(PW+GAP)+PW+4} y1={laneY+PH/2} x2={bx-10} y2={laneY+PH/2} stroke={color} strokeWidth={1.8} />
                    <polygon
                      points={`${bx-10},${laneY+PH/2-5} ${bx},${laneY+PH/2} ${bx-10},${laneY+PH/2+5}`}
                      fill={color}
                    />
                    <text x={branchFlowX+(si-1)*(PW+GAP)+PW+GAP/2} y={laneY+PH/2-8} textAnchor="middle" fill={color} fontSize={7} opacity={0.8} fontFamily="sans-serif">PUSH</text>
                    {wip > 0 && <WIPTriangle x={branchFlowX+(si-1)*(PW+GAP)+PW+GAP/2-14} y={laneY+PH/2+4} wip={wip} />}
                  </g>
                )}
                <ProcessBox x={bx} y={laneY} step={step} takt={takt} />
                {isBN && <KaizenBurstR x={bx+PW-2} y={laneY-2} r={14} />}
              </g>
            )
          })}

          {/* Branch CT summary */}
          <text x={branchFlowX} y={laneY+BRANCH_LANE_H-18} fill={color} fontSize={8} fontFamily="monospace" opacity={0.8}>
            Branch CT: {fmtS(brCT)}
          </text>

          {/* Pull arrow back to main if merge step exists */}
          {bd?.merge_step_id && (() => {
            const mi = mainSteps.findIndex(s => s.id === bd.merge_step_id)
            if (mi < 0) return null
            return (
              <path
                d={`M${branchFlowX + ls.length*(PW+GAP) - GAP + PW/2},${laneY} L${sx(mi)+PW/2},${PROC_Y+PH+DH}`}
                stroke={color} strokeWidth={1.5} fill="none" strokeDasharray="5,3" opacity={0.55}
                markerEnd={`url(#bArr-${bid})`}
              />
            )
          })()}
        </g>
      )
    })}

    {/* ── Footer KPI row ── */}
    <text x={flowX} y={TOTAL_H - 12} fill="#6B7280" fontSize={9} fontFamily="monospace">
      {`Lead Time: ${fmtS(lt)}  ·  VA: ${fmtS(mainCT)}  ·  PCE: ${pce?pce.toFixed(1)+'%':'—'}  ·  Takt: ${takt?fmtS(takt):'—'}`}
    </text>
  </>)

  return (
    <div>
      {/* KPI strip */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'stretch' }}>
        {[
          { l: 'Lead Time',  v: fmtS(lt),                           c: '#D4A208' },
          { l: 'Value Added', v: fmtS(mainCT),                       c: '#10B981' },
          { l: 'NVA / Wait',  v: fmtS(mainWT),                       c: '#6B7280' },
          { l: 'Takt Time',   v: takt ? fmtS(takt) : '—',            c: '#0EA5E9' },
          { l: 'PCE',         v: pce ? `${pce.toFixed(1)}%` : '—',   c: pce > 25 ? '#10B981' : '#F59E0B' },
        ].map(m => (
          <div key={m.l} style={{ flex: '1 1 110px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }}>
            <div style={{ fontSize: 8, color: 'var(--text3)', letterSpacing: 1.2, fontFamily: 'monospace', marginBottom: 4 }}>{m.l}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: m.c }}>{m.v}</div>
          </div>
        ))}
        <button
          onClick={() => exportVSMReport(steps, project, branches)}
          style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(212,162,8,0.12)', border: '1px solid rgba(212,162,8,0.35)', color: '#D4A208', alignSelf: 'stretch', minWidth: 160 }}
        >
          📄 Export VSM Report
        </button>
        <button
          onClick={() => setFullscreen(true)}
          style={{ padding: '8px 14px', borderRadius: 10, fontSize: 16, cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', alignSelf: 'stretch' }}
          title="Fullscreen (Esc to exit)"
        >
          ⛶
        </button>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, background: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#1E3A5F', color: '#FFF', flexShrink: 0, height: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{project.name}</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>Current-State VSM · ISO 22468:2020</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, opacity: 0.55 }}>Esc to exit</span>
              <button onClick={() => exportVSMReport(steps, project, branches)} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: 'rgba(212,162,8,0.2)', border: '1px solid rgba(212,162,8,0.5)', color: '#D4A208' }}>
                📄 Export
              </button>
              <button onClick={() => setFullscreen(false)} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFF' }}>
                ✕
              </button>
            </div>
          </div>
          {/* Scrollable diagram */}
          <div style={{ flex: 1, overflow: 'auto', padding: 20, background: '#F9FAFB' }}>
            <svg width={TOTAL_W} height={TOTAL_H} style={{ display: 'block', minWidth: TOTAL_W }}>
              {renderSVGContent('#F9FAFB')}
            </svg>
          </div>
        </div>
      )}

      {/* Normal view */}
      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, overflowX: 'auto', padding: 16 }}>
        <svg width={TOTAL_W} height={TOTAL_H} style={{ display: 'block', minWidth: TOTAL_W }}>
          {renderSVGContent('#F9FAFB')}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12, fontSize: 11, color: 'var(--text2)' }}>
        {[
          { c: '#CCFBF1', s: '#0D9488', l: 'Process Step' },
          { c: '#FEE2E2', s: '#DC2626', l: 'Bottleneck' },
          { c: '#F97316', s: '#C05621', l: 'Shipment' },
          { c: '#FEF3C7', s: '#D97706', l: 'WIP ▲' },
          { c: '#EDE9FE', s: '#7C3AED', l: 'Supermarket ▦' },
          { c: '#FEF9C3', s: '#EAB308', l: 'Kaizen 改善' },
          { c: '#A7F3D0', s: '#059669', l: 'Prod. Control' },
          { c: '#DBEAFE', s: '#0EA5E9', l: 'Info Flow' },
        ].map(({ c, s, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: c, border: `1.5px solid ${s}`, flexShrink: 0 }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Production Control box ─────────────────────────────────────────────────
const ProdCtrl = ({ x, y, w, h }: any) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#A7F3D0" stroke="#059669" strokeWidth={1.5} rx={4} />
    <text x={x+w/2} y={y+17} textAnchor="middle" fill="#065F46" fontSize={10} fontWeight={700} fontFamily="sans-serif">Production</text>
    <text x={x+w/2} y={y+31} textAnchor="middle" fill="#065F46" fontSize={10} fontWeight={700} fontFamily="sans-serif">Control</text>
  </g>
)

export default VSMMap
