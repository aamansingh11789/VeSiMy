// @ts-nocheck
'use client'
// ── components/vsm/VSMMap.tsx ────────────────────────────────────────────────
// Industrial-grade Value Stream Map with branch lane support

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

const BRANCH_COLORS = ['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#06B6D4']

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

  const mainSteps = steps.filter((s) => s.is_main_flow !== false).sort((a, b) => a.position - b.position)
  const branchSteps = steps.filter((s) => s.is_main_flow === false)

  const branchGroups: Record<string, Step[]> = {}
  branchSteps.forEach((s) => {
    if (!s.branch_id) return
    if (!branchGroups[s.branch_id]) branchGroups[s.branch_id] = []
    branchGroups[s.branch_id].push(s)
  })
  Object.values(branchGroups).forEach((g) =>
    g.sort((a, b) => (a.branch_position || 0) - (b.branch_position || 0))
  )

  const branchIds = Object.keys(branchGroups)
  const hasBranches = branchIds.length > 0

  const BOX_W = 156
  const BOX_H = 104
  const GAP = 74
  const MARGIN = 64
  const TOP_Y = 164
  const DATA_STRIP_Y = TOP_Y + BOX_H + 12
  const LANE_H = BOX_H + 92
  const LANE_GAP = 56

  const maxCols = Math.max(mainSteps.length, ...branchIds.map((bid) => branchGroups[bid].length))
  const TOTAL_W = MARGIN * 2 + maxCols * (BOX_W + GAP) - GAP + 90
  const SVG_H = TOP_Y + LANE_H + branchIds.length * (LANE_H + LANE_GAP) + 120

  const boxX = (i: number) => MARGIN + i * (BOX_W + GAP)
  const laneY = (li: number) => TOP_Y + LANE_H + LANE_GAP + li * (LANE_H + LANE_GAP)

  const mainCT = mainSteps.reduce(
    (a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0),
    0
  )
  const mainWait = mainSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const totalWIP = steps.reduce((a, s) => a + (Number(s.wip) || 0), 0)

  const branchCTs = branchIds.map((bid) =>
    branchGroups[bid].reduce(
      (a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0),
      0
    )
  )

  const criticalCT = branchCTs.length ? Math.max(mainCT, ...branchCTs) : mainCT
  const availSec = project.available_time_sec
    ? Number(project.available_time_sec)
    : project.working_hours
      ? Number(project.working_hours) * 3600
      : 0

  const takt = project.takt_time
    ? Number(project.takt_time)
    : project.demand && availSec
      ? availSec / Number(project.demand)
      : 0

  const leadTime = criticalCT + mainWait
  const pce = leadTime > 0 ? (criticalCT / leadTime) * 100 : 0

  const renderDataBox = (step: Step, x: number, y: number, color = '#D4A208') => {
    const ct = step.toolData?.stopwatch?.mean || (step.cycle_time ? Number(step.cycle_time) : null)
    const wt = Number(step.wait_time) || 0
    const operators = step.operators || 1
    const wip = Number(step.wip) || 0
    const defects = step.defect_rate != null ? `${step.defect_rate}%` : '—'
    const uptime = step.uptime != null ? `${step.uptime}%` : '—'
    const overTakt = takt > 0 && ct != null && ct > takt

    return (
      <g key={step.id}>
        <rect
          x={x}
          y={y}
          width={BOX_W}
          height={BOX_H}
          rx={8}
          fill="url(#vsmBox)"
          stroke={overTakt ? 'rgba(255,107,107,0.55)' : `${color}40`}
          strokeWidth={1.5}
        />
        <rect x={x} y={y} width={BOX_W} height={5} rx={3} fill={color} opacity={0.8} />

        <text
          x={x + BOX_W / 2}
          y={y + 18}
          textAnchor="middle"
          fill="#F5F7FB"
          fontSize={11}
          fontWeight={700}
        >
          {step.name.length > 18 ? `${step.name.slice(0, 17)}…` : step.name}
        </text>

        {step.department && (
          <text
            x={x + BOX_W / 2}
            y={y + 31}
            textAnchor="middle"
            fill="#8F98AD"
            fontSize={8.5}
          >
            {step.department}
          </text>
        )}

        <line x1={x + 8} y1={y + 38} x2={x + BOX_W - 8} y2={y + 38} stroke="rgba(255,255,255,0.07)" />

        <text x={x + 10} y={y + 52} fill="#8F98AD" fontSize={8}>CT</text>
        <text x={x + 44} y={y + 52} fill={overTakt ? '#FF6B6B' : '#D4A208'} fontSize={10} fontWeight={700}>
          {ct != null ? fmtS(ct) : '—'}
        </text>

        <text x={x + 10} y={y + 66} fill="#8F98AD" fontSize={8}>WT</text>
        <text x={x + 44} y={y + 66} fill="#C8CFDD" fontSize={9}>{fmtS(wt)}</text>

        <text x={x + 86} y={y + 52} fill="#8F98AD" fontSize={8}>OPS</text>
        <text x={x + 118} y={y + 52} fill="#C8CFDD" fontSize={9}>{operators}</text>

        <text x={x + 86} y={y + 66} fill="#8F98AD" fontSize={8}>WIP</text>
        <text x={x + 118} y={y + 66} fill="#C8CFDD" fontSize={9}>{wip || '—'}</text>

        <text x={x + 10} y={y + 82} fill="#8F98AD" fontSize={8}>UP</text>
        <text x={x + 44} y={y + 82} fill="#10B981" fontSize={9}>{uptime}</text>

        <text x={x + 86} y={y + 82} fill="#8F98AD" fontSize={8}>DF</text>
        <text x={x + 118} y={y + 82} fill="#F59E0B" fontSize={9}>{defects}</text>

        {overTakt && (
          <text x={x + BOX_W - 8} y={y + 16} textAnchor="end" fill="#FF6B6B" fontSize={8.5} fontWeight={700}>
            OVER TAKT
          </text>
        )}
      </g>
    )
  }

  const renderTimeline = (step: Step, x: number, y: number, color = '#D4A208') => {
    const ct = step.toolData?.stopwatch?.mean || (step.cycle_time ? Number(step.cycle_time) : null)
    const wt = Number(step.wait_time) || 0
    const barW = ct
      ? Math.max(8, Math.min(BOX_W * 0.82, (ct / Math.max(criticalCT || 1, 1)) * BOX_W * 1.8))
      : 0

    return (
      <g key={`tl-${step.id}`}>
        {wt > 0 && (
          <>
            <line x1={x} y1={y + 10} x2={x + BOX_W * 0.7} y2={y + 10} stroke="#7C859C" strokeDasharray="4,2" opacity={0.55} />
            <text x={x + 2} y={y + 8} fill="#8F98AD" fontSize={8} fontFamily="monospace">
              WAIT {fmtS(wt)}
            </text>
          </>
        )}

        {barW > 0 && (
          <>
            <rect x={x} y={y + 20} width={barW} height={9} rx={3} fill={color} opacity={0.5} />
            <text x={x + 2} y={y + 42} fill={color} fontSize={8.5} fontFamily="monospace">
              VA {fmtS(ct)}
            </text>
          </>
        )}
      </g>
    )
  }

  const exportIndustrialVSM = () => {
    const w = window.open('', '_blank')
    if (!w) return

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const fmtSec = (s: number) => {
      if (!s && s !== 0) return '—'
      if (s < 60) return `${s.toFixed(0)}s`
      if (s < 3600) return `${(s / 60).toFixed(1)}m`
      return `${(s / 3600).toFixed(2)}h`
    }

    const rows = mainSteps.map((s, i) => {
      const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
      const wt = Number(s.wait_time) || 0
      return `
        <tr>
          <td>${i + 1}</td>
          <td>${s.name}</td>
          <td>${s.department || '—'}</td>
          <td>${fmtSec(ct)}</td>
          <td>${fmtSec(wt)}</td>
          <td>${s.operators || 1}</td>
          <td>${s.wip || '—'}</td>
          <td>${s.uptime != null ? `${s.uptime}%` : '—'}</td>
          <td>${s.defect_rate != null ? `${s.defect_rate}%` : '—'}</td>
        </tr>
      `
    }).join('')

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Value Stream Report — ${project.name}</title>
  <style>
    @page { size: A4 landscape; margin: 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .doc {
      width: 100%;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #222;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .sub {
      font-size: 12px;
      color: #666;
    }
    .doc-control {
      width: 320px;
      border: 1px solid #ccc;
      border-collapse: collapse;
      font-size: 11px;
    }
    .doc-control td {
      border: 1px solid #ccc;
      padding: 6px 8px;
    }
    .kpis {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }
    .kpi {
      border: 1px solid #ddd;
      padding: 10px;
      background: #fafafa;
    }
    .kpi-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 4px;
    }
    .kpi-value {
      font-size: 18px;
      font-weight: 700;
      color: #8B6A00;
    }
    h2 {
      font-size: 14px;
      margin: 18px 0 8px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 14px;
    }
    th, td {
      border: 1px solid #d9d9d9;
      padding: 7px 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f2f2f2;
      font-weight: 700;
    }
    .notice {
      margin-top: 18px;
      font-size: 11px;
      color: #555;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="doc">
    <div class="header">
      <div>
        <div class="title">Process Analysis Report — Value Stream Map</div>
        <div class="sub">${project.name} · ${project.industry || 'Industrial Process'} · ${today}</div>
      </div>

      <table class="doc-control">
        <tr><td><strong>Document ID</strong></td><td>VSM-${project.id || '001'}</td></tr>
        <tr><td><strong>Revision</strong></td><td>1.0</td></tr>
        <tr><td><strong>Prepared By</strong></td><td>Vesimy</td></tr>
        <tr><td><strong>Date</strong></td><td>${today}</td></tr>
      </table>
    </div>

    <div class="kpis">
      <div class="kpi"><div class="kpi-label">Lead Time</div><div class="kpi-value">${fmtSec(leadTime)}</div></div>
      <div class="kpi"><div class="kpi-label">Value Added Time</div><div class="kpi-value">${fmtSec(criticalCT)}</div></div>
      <div class="kpi"><div class="kpi-label">Main Flow CT</div><div class="kpi-value">${fmtSec(mainCT)}</div></div>
      <div class="kpi"><div class="kpi-label">Takt Time</div><div class="kpi-value">${takt ? fmtSec(takt) : '—'}</div></div>
      <div class="kpi"><div class="kpi-label">PCE</div><div class="kpi-value">${pce ? `${pce.toFixed(1)}%` : '—'}</div></div>
    </div>

    <h2>1. Current-State Process Overview</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Process Step</th>
          <th>Department</th>
          <th>Cycle Time</th>
          <th>Wait Time</th>
          <th>Operators</th>
          <th>WIP</th>
          <th>Uptime</th>
          <th>Defect Rate</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <h2>2. Standards Notice</h2>
    <div class="notice">
      This document was generated using the Vesimy Process Intelligence Platform.
      The document structure is designed to align with widely recognized industrial process analysis practices
      and relevant standards guidance, including ISO 9001 process-documentation principles and ISO 22468
      value stream management concepts, where applicable.
      <br /><br />
      This document is intended to support operational analysis, continuous improvement, and internal decision-making.
      It does not by itself certify organizational compliance with any ISO standard.
    </div>
  </div>
</body>
</html>
    `

    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 500)
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))',
            gap: 8,
            flex: 1,
            minWidth: 620,
          }}
        >
          {[
            { l: 'Lead Time', v: fmtS(leadTime), c: '#D4A208' },
            { l: 'Value Added', v: fmtS(criticalCT), c: '#10B981' },
            { l: 'Main Flow CT', v: fmtS(mainCT), c: '#C8CFDD' },
            { l: 'Takt Time', v: takt ? fmtS(takt) : '—', c: '#0EA5E9' },
            { l: 'PCE', v: pce ? `${pce.toFixed(1)}%` : '—', c: pce > 25 ? '#10B981' : '#F59E0B' },
          ].map((m) => (
            <div
              key={m.l}
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1.2, fontFamily: 'monospace', marginBottom: 5 }}>
                {m.l}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.c }}>{m.v}</div>
            </div>
          ))}
        </div>

        <button
          onClick={exportIndustrialVSM}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            minWidth: 190,
            justifyContent: 'center',
          }}
        >
          📄 Export Industrial VSM
        </button>
      </div>

      {hasBranches && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 14,
            padding: '10px 14px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#D4A208' }} />
            <span style={{ color: 'var(--text2)' }}>Main Flow</span>
          </div>
          {branchIds.map((bid, i) => {
            const bd = branches.find((b) => b.branch_id === bid)
            const color = bd?.color || BRANCH_COLORS[i % BRANCH_COLORS.length]
            const label = bd?.label || branchGroups[bid][0]?.branch_label || `Branch ${i + 1}`

            return (
              <div key={bid} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ color: 'var(--text2)' }}>{label}</span>
              </div>
            )
          })}
        </div>
      )}

      <div
        style={{
          background: '#050712',
          border: '1px solid #1A1D31',
          borderRadius: 12,
          overflow: 'auto',
          padding: 20,
        }}
      >
        <svg width={Math.max(TOTAL_W, 800)} height={SVG_H} style={{ display: 'block', minWidth: TOTAL_W }}>
          <defs>
            <linearGradient id="vsmBox" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14192B" />
              <stop offset="100%" stopColor="#0D1020" />
            </linearGradient>

            <marker id="mainArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#D4A208" opacity="0.7" />
            </marker>

            {branchIds.map((bid, i) => {
              const color = branches.find((b) => b.branch_id === bid)?.color || BRANCH_COLORS[i % BRANCH_COLORS.length]
              return (
                <marker key={bid} id={`branchArrow-${bid}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0,8 3,0 6" fill={color} opacity="0.8" />
                </marker>
              )
            })}
          </defs>

          <text x={MARGIN} y={38} fill="#F5F7FB" fontSize={18} fontWeight={700}>
            Current-State Value Stream Map
          </text>
          <text x={MARGIN} y={56} fill="#8F98AD" fontSize={11}>
            {project.name} · {project.industry || 'Operational Process'} · Material Flow and Information Flow Overview
          </text>

          <g transform={`translate(${MARGIN},84)`}>
            <rect width={120} height={40} rx={8} fill="#12162A" stroke="#2A2F4A" />
            <text x={12} y={16} fill="#8F98AD" fontSize={8} fontFamily="monospace">SUPPLIER</text>
            <text x={12} y={30} fill="#F5F7FB" fontSize={11} fontWeight={700}>{project.supplier || 'Supplier'}</text>
          </g>

          <g transform={`translate(${TOTAL_W - MARGIN - 140},84)`}>
            <rect width={140} height={40} rx={8} fill="#12162A" stroke="#2A2F4A" />
            <text x={12} y={16} fill="#8F98AD" fontSize={8} fontFamily="monospace">CUSTOMER / DEMAND</text>
            <text x={12} y={30} fill="#F5F7FB" fontSize={11} fontWeight={700}>
              {project.customer || 'Customer'}{project.demand ? ` · ${project.demand}/day` : ''}
            </text>
          </g>

          <text x={MARGIN - 10} y={TOP_Y - 24} fill="#8F98AD" fontSize={9} fontFamily="monospace">
            INFORMATION FLOW
          </text>
          <line
            x1={MARGIN + 60}
            y1={TOP_Y - 28}
            x2={TOTAL_W - MARGIN - 70}
            y2={TOP_Y - 28}
            stroke="#6CB9FC"
            strokeDasharray="6,4"
            opacity={0.45}
          />

          <text x={MARGIN - 10} y={TOP_Y + BOX_H / 2 + 4} fill="#D4A208" fontSize={9} fontFamily="monospace" textAnchor="end">
            MAIN
          </text>

          {mainSteps.map((step, i) => {
            const x = boxX(i)

            return (
              <g key={step.id}>
                {i > 0 && (
                  <line
                    x1={boxX(i - 1) + BOX_W}
                    y1={TOP_Y + BOX_H / 2}
                    x2={x}
                    y2={TOP_Y + BOX_H / 2}
                    stroke="#D4A208"
                    strokeWidth={1.6}
                    opacity={0.65}
                    markerEnd="url(#mainArrow)"
                  />
                )}

                {Number(step.wip) > 0 && i > 0 && (
                  <g transform={`translate(${boxX(i - 1) + BOX_W + GAP / 2 - 12},${TOP_Y + BOX_H / 2 - 18})`}>
                    <polygon points="12,0 24,22 0,22" fill="none" stroke="#8C44CC" strokeWidth={1.4} opacity={0.75} />
                    <text x={12} y={17} textAnchor="middle" fill="#8C44CC" fontSize={9}>{step.wip}</text>
                  </g>
                )}

                {renderDataBox(step, x, TOP_Y)}
                {renderTimeline(step, x, DATA_STRIP_Y)}
              </g>
            )
          })}

          <line
            x1={MARGIN}
            y1={DATA_STRIP_Y + 20}
            x2={MARGIN + mainSteps.length * (BOX_W + GAP) - GAP}
            y2={DATA_STRIP_Y + 20}
            stroke="#232842"
            strokeWidth={1.5}
          />

          {branchIds.map((bid, bi) => {
            const bd = branches.find((b) => b.branch_id === bid)
            const color = bd?.color || BRANCH_COLORS[bi % BRANCH_COLORS.length]
            const label = bd?.label || branchGroups[bid][0]?.branch_label || `Branch ${bi + 1}`
            const ly = laneY(bi)
            const ls = branchGroups[bid]
            const pid = bd?.parent_step_id || ls[0]?.branch_parent_id
            const pi = mainSteps.findIndex((s) => s.id === pid)
            const sx = pi >= 0 ? boxX(pi) : MARGIN
            const mid = bd?.merge_step_id
            const mi = mid ? mainSteps.findIndex((s) => s.id === mid) : -1

            return (
              <g key={bid}>
                <text x={MARGIN - 10} y={ly + BOX_H / 2 + 4} fill={color} fontSize={9} fontFamily="monospace" textAnchor="end">
                  {label.toUpperCase()}
                </text>

                <rect
                  x={sx - 10}
                  y={ly - 8}
                  width={ls.length * (BOX_W + GAP) - GAP + 20}
                  height={BOX_H + 52}
                  rx={10}
                  fill={`${color}08`}
                  stroke={`${color}25`}
                />

                {ls.map((step, si) => {
                  const x = sx + si * (BOX_W + GAP)
                  return (
                    <g key={step.id}>
                      {si > 0 && (
                        <line
                          x1={sx + (si - 1) * (BOX_W + GAP) + BOX_W}
                          y1={ly + BOX_H / 2}
                          x2={x}
                          y2={ly + BOX_H / 2}
                          stroke={color}
                          strokeWidth={1.5}
                          opacity={0.65}
                          markerEnd={`url(#branchArrow-${bid})`}
                        />
                      )}

                      {renderDataBox(step, x, ly, color)}
                      {renderTimeline(step, x, ly + BOX_H + 10, color)}
                    </g>
                  )
                })}

                {mi >= 0 && (
                  <path
                    d={`M${sx + ls.length * (BOX_W + GAP) - GAP + BOX_W / 2},${ly} L${boxX(mi) + BOX_W / 2},${TOP_Y + BOX_H}`}
                    stroke={color}
                    strokeWidth={1.5}
                    fill="none"
                    strokeDasharray="5,3"
                    opacity={0.55}
                    markerEnd={`url(#branchArrow-${bid})`}
                  />
                )}
              </g>
            )
          })}

          <text x={MARGIN} y={SVG_H - 18} fill="#8F98AD" fontSize={10} fontFamily="monospace">
            {`Lead Time: ${fmtS(leadTime)} · Value Added: ${fmtS(criticalCT)} · PCE: ${pce ? `${pce.toFixed(1)}%` : '—'} · Takt: ${takt ? fmtS(takt) : '—'} · WIP: ${totalWIP || '—'}`}
          </text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 14, fontSize: 11, color: 'var(--text2)' }}>
        {[
          { c: '#D4A208', l: 'Material Flow / Value Added' },
          { c: '#6CB9FC', l: 'Information Flow' },
          { c: '#8C44CC', l: 'WIP / Inventory' },
          { c: '#10B981', l: 'Uptime / Availability' },
          { c: '#F59E0B', l: 'Quality / Defect Signal' },
          ...(hasBranches ? [{ c: '#7C3AED', l: 'Branch Flow' }] : []),
        ].map(({ c, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c, opacity: 0.85 }} />
            {l}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.02)',
          color: 'var(--text2)',
          fontSize: 11,
          lineHeight: 1.55,
        }}
      >
        This map is structured to support recognized industrial process-analysis practices and references concepts used in
        value stream management and quality process documentation. It is intended to support operational analysis and
        continuous improvement activity.
      </div>
    </div>
  )
}