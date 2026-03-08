// @ts-nocheck
'use client'
// ── components/vsm/VSMMap.tsx ─────────────────────────────────────────────────
// Value Stream Map with full branching / parallel process lane support

import type { Step, Branch, Project } from '@/lib/store'

interface Props {
  steps:    Step[]
  branches: Branch[]
  project:  Project
}

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60)   return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)}m`
  return `${(s / 3600).toFixed(2)}h`
}

const BRANCH_COLORS = ['#6426A0','#1090D4','#1DD1A1','#F4A623','#E84393','#00BCD4']

export function VSMMap({ steps, branches, project }: Props) {
  if (steps.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#38385C' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>〜</div>
        <div style={{ color: '#7070A0', fontSize: 16, marginBottom: 8 }}>No steps to map yet</div>
        <div style={{ fontSize: 13 }}>Add process steps in the Builder tab to see your VSM</div>
      </div>
    )
  }

  // ── Separate main vs branch steps ───────────────────────────────────────
  const mainSteps   = steps.filter(s => s.is_main_flow !== false).sort((a, b) => a.position - b.position)
  const branchSteps = steps.filter(s => s.is_main_flow === false)

  const branchGroups: Record<string, Step[]> = {}
  branchSteps.forEach(s => {
    if (!s.branch_id) return
    if (!branchGroups[s.branch_id]) branchGroups[s.branch_id] = []
    branchGroups[s.branch_id].push(s)
  })
  Object.values(branchGroups).forEach(g => g.sort((a, b) => (a.branch_position || 0) - (b.branch_position || 0)))
  const branchIds   = Object.keys(branchGroups)
  const hasBranches = branchIds.length > 0

  // ── Layout ───────────────────────────────────────────────────────────────
  const BOX_W   = 130
  const BOX_H   = 90
  const GAP     = 64
  const MARGIN  = 50
  const TOP_Y   = 130
  const LANE_H  = BOX_H + 80   // box + timeline area
  const LANE_GAP = 50

  const maxCols = Math.max(mainSteps.length, ...branchIds.map(bid => branchGroups[bid].length))
  const TOTAL_W = MARGIN * 2 + maxCols * (BOX_W + GAP) - GAP + 80
  const SVG_H   = TOP_Y + LANE_H + branchIds.length * (LANE_H + LANE_GAP) + 80

  const boxX  = (i: number) => MARGIN + i * (BOX_W + GAP)
  const laneY = (li: number) => TOP_Y + LANE_H + LANE_GAP + li * (LANE_H + LANE_GAP)

  // ── Metrics ─────────────────────────────────────────────────────────────
  const mainCT   = mainSteps.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || 0), 0)
  const mainWait = mainSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const totalWIP = steps.reduce((a, s) => a + (Number(s.wip) || 0), 0)
  const openKZ   = steps.reduce((a, s) => a + (s.toolData?.kaizen?.items?.filter((i: any) => i.status !== 'complete').length || 0), 0)
  const branchCTs = branchIds.map(bid => branchGroups[bid].reduce((a, s) => a + (s.toolData?.stopwatch?.mean || 0), 0))
  const criticalCT = branchCTs.length ? Math.max(mainCT, ...branchCTs) : mainCT
  const availSec = project.available_time_sec ? Number(project.available_time_sec) : project.working_hours ? Number(project.working_hours) * 3600 : 0
  const takt = project.takt_time ? Number(project.takt_time) : (project.demand && availSec ? availSec / Number(project.demand) : 0)
  const pce  = criticalCT + mainWait > 0 ? (criticalCT / (criticalCT + mainWait)) * 100 : 0

  // ── Helpers ──────────────────────────────────────────────────────────────
  const renderBox = (step: Step, x: number, y: number, color = '#D4A208') => {
    const ct     = step.toolData?.stopwatch?.mean
    const wastes = step.toolData?.waste?.selected?.length || 0
    const kz     = step.toolData?.kaizen?.items?.length || 0
    return (
      <g key={step.id}>
        <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={8}
          fill="url(#vb)" stroke={wastes > 0 ? 'rgba(255,107,107,0.45)' : `${color}33`} strokeWidth={1.5} />
        <rect x={x} y={y} width={BOX_W} height={4} rx={2} fill={color} opacity={0.7} />
        <text x={x+BOX_W/2} y={y+20} textAnchor="middle" fill="#EAE8F4" fontSize={11} fontWeight={600}>
          {step.name.length > 14 ? step.name.slice(0,13)+'…' : step.name}
        </text>
        {step.department && <text x={x+BOX_W/2} y={y+32} textAnchor="middle" fill="#7070A0" fontSize={9}>{step.department}</text>}
        <text x={x+10} y={y+48} fill="#7070A0" fontSize={9}>👤 {step.operators||1}</text>
        {step.completion_accuracy != null && <text x={x+BOX_W-8} y={y+48} textAnchor="end" fill="#1DD1A1" fontSize={9}>{step.completion_accuracy}%</text>}
        {ct != null ? (
          <>
            <text x={x+BOX_W/2} y={y+63} textAnchor="middle" fill={color} fontSize={13} fontWeight={700}>{fmtS(ct)}</text>
            <text x={x+BOX_W/2} y={y+73} textAnchor="middle" fill="#38385C" fontSize={8} fontFamily="monospace">CT</text>
          </>
        ) : (
          <text x={x+BOX_W/2} y={y+68} textAnchor="middle" fill="#38385C" fontSize={9}>no time study</text>
        )}
        {wastes > 0 && <g transform={`translate(${x+6},${y+BOX_H-14})`}><rect width={28} height={12} rx={3} fill="rgba(255,107,107,0.15)"/><text x={14} y={9} textAnchor="middle" fill="#FF6B6B" fontSize={8}>{wastes}W</text></g>}
        {kz > 0 && <g transform={`translate(${x+BOX_W-34},${y+BOX_H-14})`}><rect width={28} height={12} rx={3} fill="rgba(244,166,35,0.15)"/><text x={14} y={9} textAnchor="middle" fill="#F4A623" fontSize={8}>⚡{kz}</text></g>}
        {takt > 0 && ct != null && ct > 0 && (
          <line x1={x+Math.min(BOX_W-2,(takt/ct)*BOX_W*0.8)} y1={y+6}
            x2={x+Math.min(BOX_W-2,(takt/ct)*BOX_W*0.8)} y2={y+BOX_H-4}
            stroke="#6CB9FC" strokeWidth={1} strokeDasharray="3,2" opacity={0.5} />
        )}
      </g>
    )
  }

  const renderTimeline = (step: Step, x: number, baseY: number, color = '#D4A208') => {
    const ct  = step.toolData?.stopwatch?.mean
    const wt  = Number(step.wait_time) || 0
    const bw  = ct ? Math.max(4, Math.min(BOX_W*0.8, (ct / Math.max(mainCT||1,1)) * BOX_W * mainSteps.length * 0.35)) : 0
    return (
      <g key={`tl-${step.id}`}>
        {bw > 0 && <rect x={x} y={baseY+2} width={bw} height={8} fill={color} opacity={0.45} rx={2}/>}
        {wt > 0 && <path d={`M${x},${baseY+22} l4,-6 l4,6 l4,-6 l4,6 l4,-6 l4,6`} stroke="#7070A0" strokeWidth={1.5} fill="none" opacity={0.4}/>}
        {ct != null && <text x={x+2} y={baseY+50} fill={color} fontSize={9} fontFamily="monospace">{fmtS(ct)}</text>}
        {wt > 0 && <text x={x+2} y={baseY+36} fill="#7070A0" fontSize={8} fontFamily="monospace">{fmtS(wt)}</text>}
      </g>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>

      {/* KPI bar */}
      <div style={{ display:'flex', marginBottom:20, background:'#080818', borderRadius:10, overflow:'hidden', border:'1px solid #1A1A40' }}>
        {[
          { l:'PCE',          v: pce ? `${pce.toFixed(0)}%` : '—',   c: pce>25?'#1DD1A1':'#FF6B6B' },
          { l:'CRITICAL PATH',v: fmtS(criticalCT),                    c:'#D4A208' },
          { l:'MAIN FLOW CT', v: fmtS(mainCT),                        c:'#D4A208' },
          { l:'TAKT TIME',    v: takt ? fmtS(takt) : '—',            c:'#6CB9FC' },
          { l:'TOTAL WIP',    v: totalWIP || '—',                     c:'#8C44CC' },
          { l:'BRANCHES',     v: branchIds.length || '—',             c:'#6426A0' },
          { l:'OPEN KAIZEN',  v: openKZ || '—',                       c:'#F4A623' },
        ].map((m,i) => (
          <div key={m.l} style={{ flex:1, padding:'12px 8px', textAlign:'center', borderRight: i<6 ? '1px solid #1A1A40' : 'none', minWidth:80 }}>
            <div style={{ fontSize:8, color:'#38385C', letterSpacing:1.5, fontFamily:'monospace', marginBottom:4 }}>{m.l}</div>
            <div style={{ fontSize:17, fontWeight:700, color:m.c }}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* Branch legend */}
      {hasBranches && (
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:14, padding:'10px 16px', background:'#080818', border:'1px solid #1A1A40', borderRadius:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:'#D4A208' }}/>
            <span style={{ color:'#7070A0' }}>Main Flow</span>
          </div>
          {branchIds.map((bid,i) => {
            const bd    = branches.find(b => b.branch_id === bid)
            const color = bd?.color || BRANCH_COLORS[i % BRANCH_COLORS.length]
            const label = bd?.label || branchGroups[bid][0]?.branch_label || `Branch ${i+1}`
            const bct   = branchGroups[bid].reduce((a,s) => a+(s.toolData?.stopwatch?.mean||0),0)
            return (
              <div key={bid} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:color }}/>
                <span style={{ color:'#7070A0' }}>{label}</span>
                <span style={{ color:'#38385C', fontSize:10 }}>({branchGroups[bid].length} steps · {fmtS(bct)})</span>
              </div>
            )
          })}
        </div>
      )}

      {/* SVG */}
      <div style={{ background:'#03030D', border:'1px solid #1A1A40', borderRadius:10, overflow:'auto', padding:20 }}>
        <svg width={Math.max(TOTAL_W,700)} height={SVG_H} style={{ display:'block', minWidth:TOTAL_W }}>
          <defs>
            <linearGradient id="vb" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1A1A40"/><stop offset="100%" stopColor="#0D0D22"/>
            </linearGradient>
            <marker id="ag" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#D4A208" opacity="0.6"/>
            </marker>
            {branchIds.map((bid,i) => {
              const color = branches.find(b=>b.branch_id===bid)?.color || BRANCH_COLORS[i%BRANCH_COLORS.length]
              return <marker key={bid} id={`ab-${bid}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill={color} opacity="0.7"/>
              </marker>
            })}
          </defs>

          {/* Supplier */}
          <g transform={`translate(${MARGIN-10},20)`}>
            <rect width={60} height={40} rx={6} fill="#1A1A40" stroke="#28285C"/>
            <text x={30} y={14} textAnchor="middle" fill="#D4A208" fontSize={8} fontFamily="monospace" letterSpacing={1}>SUPPLIER</text>
            <text x={30} y={29} textAnchor="middle" fill="#EAE8F4" fontSize={10} fontWeight={600}>{(project.supplier||'Supplier').slice(0,10)}</text>
          </g>

          {/* Customer */}
          <g transform={`translate(${TOTAL_W-MARGIN-50},20)`}>
            <rect width={60} height={40} rx={6} fill="#1A1A40" stroke="#28285C"/>
            <text x={30} y={14} textAnchor="middle" fill="#6CB9FC" fontSize={8} fontFamily="monospace" letterSpacing={1}>CUSTOMER</text>
            <text x={30} y={29} textAnchor="middle" fill="#EAE8F4" fontSize={10} fontWeight={600}>{(project.customer||'Customer').slice(0,10)}</text>
            {project.demand && <text x={30} y={50} textAnchor="middle" fill="#6CB9FC" fontSize={9}>{project.demand}/day</text>}
          </g>

          {/* Main flow label */}
          <text x={MARGIN-12} y={TOP_Y+BOX_H/2+4} fill="#D4A208" fontSize={9} fontFamily="monospace" textAnchor="end">MAIN</text>

          {/* Main flow steps */}
          {mainSteps.map((step, i) => {
            const x = boxX(i)
            return (
              <g key={step.id}>
                {i > 0 && (
                  <>
                    <line x1={boxX(i-1)+BOX_W} y1={TOP_Y+BOX_H/2} x2={x} y2={TOP_Y+BOX_H/2}
                      stroke="#D4A208" strokeWidth={1.5} opacity={0.5} markerEnd="url(#ag)"/>
                    {Number(step.wip)>0 && (
                      <g transform={`translate(${boxX(i-1)+BOX_W+GAP/2-12},${TOP_Y+BOX_H/2-18})`}>
                        <polygon points="12,0 24,22 0,22" fill="none" stroke="#8C44CC" strokeWidth={1.5} opacity={0.7}/>
                        <text x={12} y={17} textAnchor="middle" fill="#8C44CC" fontSize={9}>{step.wip}</text>
                      </g>
                    )}
                  </>
                )}

                {/* Supermarket */}
                {step.flow_type==='supermarket' && (
                  <g transform={`translate(${x+BOX_W/2-14},${TOP_Y-26})`}>
                    <rect width={28} height={16} rx={3} fill="rgba(100,38,160,0.18)" stroke="#6426A0" strokeWidth={1}/>
                    <text x={14} y={11} textAnchor="middle" fill="#8C44CC" fontSize={9}>SM</text>
                  </g>
                )}

                {/* Branch origin connectors */}
                {branchIds.map((bid,bi) => {
                  const bd  = branches.find(b=>b.branch_id===bid)
                  const pid = bd?.parent_step_id || branchGroups[bid][0]?.branch_parent_id
                  if (pid !== step.id) return null
                  const color  = bd?.color || BRANCH_COLORS[bi%BRANCH_COLORS.length]
                  const tY     = laneY(bi)
                  const cx     = x + BOX_W/2
                  const label  = bd?.label || branchGroups[bid][0]?.branch_label || `Branch ${bi+1}`
                  return (
                    <g key={`c-${bid}`}>
                      <circle cx={cx} cy={TOP_Y+BOX_H} r={5} fill={color} opacity={0.85}/>
                      <line x1={cx} y1={TOP_Y+BOX_H+5} x2={cx} y2={tY-12}
                        stroke={color} strokeWidth={2} strokeDasharray="6,3" opacity={0.55}
                        markerEnd={`url(#ab-${bid})`}/>
                      <text x={cx+9} y={TOP_Y+BOX_H+18} fill={color} fontSize={9} fontFamily="monospace" opacity={0.8}>{label}</text>
                    </g>
                  )
                })}

                {renderBox(step, x, TOP_Y)}
                {renderTimeline(step, x, TOP_Y+BOX_H+8)}
              </g>
            )
          })}

          {/* Main flow timeline baseline */}
          <line x1={MARGIN} y1={TOP_Y+BOX_H+8}
            x2={MARGIN+mainSteps.length*(BOX_W+GAP)-GAP} y2={TOP_Y+BOX_H+8}
            stroke="#1A1A40" strokeWidth={1.5}/>

          {/* Branch lanes */}
          {branchIds.map((bid,bi) => {
            const bd    = branches.find(b=>b.branch_id===bid)
            const color = bd?.color || BRANCH_COLORS[bi%BRANCH_COLORS.length]
            const label = bd?.label || branchGroups[bid][0]?.branch_label || `Branch ${bi+1}`
            const ly    = laneY(bi)
            const ls    = branchGroups[bid]
            const pid   = bd?.parent_step_id || ls[0]?.branch_parent_id
            const pi    = mainSteps.findIndex(s=>s.id===pid)
            const sx    = pi>=0 ? boxX(pi) : MARGIN
            const mid   = bd?.merge_step_id
            const mi    = mid ? mainSteps.findIndex(s=>s.id===mid) : -1

            return (
              <g key={bid}>
                {/* Lane label */}
                <text x={MARGIN-12} y={ly+BOX_H/2+4} fill={color} fontSize={9} fontFamily="monospace" textAnchor="end">
                  {label.slice(0,6).toUpperCase()}
                </text>

                {/* Lane bg */}
                <rect x={sx-10} y={ly-8}
                  width={ls.length*(BOX_W+GAP)-GAP+20} height={BOX_H+16}
                  rx={8} fill={`${color}08`} stroke={`${color}22`} strokeWidth={1}/>

                {/* Branch steps */}
                {ls.map((step,si) => {
                  const x = sx + si*(BOX_W+GAP)
                  return (
                    <g key={step.id}>
                      {si>0 && (
                        <>
                          <line x1={sx+(si-1)*(BOX_W+GAP)+BOX_W} y1={ly+BOX_H/2}
                            x2={x} y2={ly+BOX_H/2}
                            stroke={color} strokeWidth={1.5} opacity={0.6}
                            markerEnd={`url(#ab-${bid})`}/>
                          {Number(step.wip)>0 && (
                            <g transform={`translate(${sx+(si-1)*(BOX_W+GAP)+BOX_W+GAP/2-10},${ly+BOX_H/2-15})`}>
                              <polygon points="10,0 20,18 0,18" fill="none" stroke={color} strokeWidth={1} opacity={0.5}/>
                              <text x={10} y={14} textAnchor="middle" fill={color} fontSize={8}>{step.wip}</text>
                            </g>
                          )}
                        </>
                      )}
                      {renderBox(step, x, ly, color)}
                      {renderTimeline(step, x, ly+BOX_H+8, color)}
                    </g>
                  )
                })}

                {/* Branch baseline */}
                <line x1={sx} y1={ly+BOX_H+8}
                  x2={sx+ls.length*(BOX_W+GAP)-GAP} y2={ly+BOX_H+8}
                  stroke={`${color}40`} strokeWidth={1.5}/>

                {/* Branch CT total */}
                <text x={sx+ls.length*(BOX_W+GAP)-GAP+8} y={ly+BOX_H/2+4}
                  fill={color} fontSize={10} fontWeight={700}>
                  {fmtS(ls.reduce((a,s)=>a+(s.toolData?.stopwatch?.mean||0),0))}
                </text>

                {/* Merge line back to main */}
                {mi>=0 && (
                  <g>
                    <path d={`M${sx+ls.length*(BOX_W+GAP)-GAP+BOX_W/2},${ly} L${boxX(mi)+BOX_W/2},${TOP_Y+BOX_H}`}
                      stroke={color} strokeWidth={1.5} fill="none"
                      strokeDasharray="5,3" opacity={0.5}
                      markerEnd={`url(#ab-${bid})`}/>
                    <circle cx={boxX(mi)+BOX_W/2} cy={TOP_Y+BOX_H} r={4} fill={color} opacity={0.7}/>
                    <text x={boxX(mi)+BOX_W/2+8} y={TOP_Y+BOX_H-6}
                      fill={color} fontSize={9} fontFamily="monospace" opacity={0.7}>↑ merge</text>
                  </g>
                )}
              </g>
            )
          })}

          {/* PCE footer */}
          <text x={MARGIN} y={SVG_H-10} fill="#38385C" fontSize={10} fontFamily="monospace">
            {`PCE: ${pce ? pce.toFixed(0)+'%' : '—'} · Critical Path: ${fmtS(criticalCT)} · Main: ${fmtS(mainCT)} · Wait: ${fmtS(mainWait)}${hasBranches ? ` · ${branchIds.length} branch${branchIds.length>1?'es':''}` : ''}`}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginTop:14, fontSize:11, color:'#7070A0' }}>
        {[
          { c:'#D4A208', l:'Cycle Time' },
          { c:'#7070A0', l:'Wait / Queue' },
          { c:'#8C44CC', l:'WIP' },
          { c:'#FF6B6B', l:'Wastes' },
          { c:'#6CB9FC', l:'Takt Line' },
          { c:'#F4A623', l:'Kaizen' },
          ...(hasBranches ? [{ c:'#6426A0', l:'Branch' }] : []),
        ].map(({c,l}) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c, opacity:0.8 }}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
