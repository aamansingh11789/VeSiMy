// TypeScript enabled
'use client'
import { VSMIcon } from '@/components/ui/Icons'
import React from 'react'
import { BRAND, RED, GREEN, AMBER } from './v2-constants'
// ── components/v2/V2MapCanvas.tsx ──────────────────────────────────────────────
// Interactive SVG VSM map canvas — pan, zoom, drag.
// ISO 22468 / TPS / lean standard symbols.

import { useState, useRef, useCallback, useEffect } from 'react'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds, fmtSeconds } from '@/lib/v2/cycle-time-utils'

const STEP_SYMBOLS: Record<string, { shape: string; fill: string; stroke: string }> = {
  process:    { shape: 'rect',     fill: '#EEF4FB', stroke: BRAND       },
  decision:   { shape: 'diamond',  fill: '#FEF9E7', stroke: AMBER       },
  delay:      { shape: 'delay',    fill: '#FEF0ED', stroke: RED         },
  inspection: { shape: 'circle',   fill: '#E6F7F3', stroke: GREEN       },
  transport:  { shape: 'arrow',    fill: '#F8F6F0', stroke: '#666'      },
  storage:    { shape: 'triangle', fill: '#F0EEF8', stroke: '#8C44CC'   },
  rework:     { shape: 'rect',     fill: '#FEE2E2', stroke: RED         },
  start_end:  { shape: 'oval',     fill: '#E8E5E0', stroke: '#333'      },
}

const BOX_W = 110
const BOX_H = 48
const GAP   = 80

function fmtTime(s: number, unit?: string) {
  // Note: when called with ctSeconds(step) output, unit param can be omitted
  if (!s) return '—'
  const u = unit || 'seconds'
  if (u !== 'seconds') return `${s}${u==='minutes'?'m':u==='hours'?'h':u==='days'?'d':'w'}`
  if (s >= 3600) return `${(s/3600).toFixed(1)}h`
  if (s >= 60)   return `${(s/60).toFixed(1)}m`
  return `${Math.round(s)}s`
}

function StepBox({ step, index, isSelected, onClick, t, expanded, onToggleExpand, taktTime = 0 }: any) {
  const sym = STEP_SYMBOLS[step.step_type || 'process'] || STEP_SYMBOLS.process
  const hasMissing = (step.missing_info_flags || []).length > 0
  const X = 80 + index * (BOX_W + GAP)
  const Y = 200

  // Health glow — driven by defect rate, missing flags, and bottleneck status
  const defect = step.defect_rate || 0
  const missingCount = (step.missing_info_flags || []).length
  const isBottleneck = step.is_bottleneck || (taktTime > 0 && ctSeconds(step) > taktTime)
  let glowColor = null
  let glowOpacity = 0
  if (isBottleneck) { glowColor = RED; glowOpacity = 0.55 }
  else if (defect > 8) { glowColor = RED; glowOpacity = 0.4 }
  else if (defect > 3 || missingCount > 2) { glowColor = AMBER; glowOpacity = 0.35 }
  else if (step.va_type === 'va' && defect === 0 && missingCount === 0) { glowColor = GREEN; glowOpacity = 0.2 }

  const sc = { stroke: isSelected ? BRAND : sym.stroke, strokeWidth: isSelected ? 2.5 : 1.5 }
  const shadow = isSelected
    ? 'drop-shadow(0 0 10px rgba(1,118,211,.5))'
    : glowColor
      ? `drop-shadow(0 0 8px ${glowColor}80)`
      : 'none'

  return (
    <g
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={`${step.name} — CT: ${ctSeconds(step) ? fmtTime(ctSeconds(step)) : 'not set'}${isBottleneck ? ' — BOTTLENECK' : ''}${hasMissing ? ' — missing data' : ''}`}
      aria-pressed={isSelected}
      onClick={() => onClick(step)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(step) } }}
    >
      {!!step.governing_entity && (
        <>
          <rect x={X+BOX_W/2-42} y={Y-52} width={84} height={22}
            fill="white" stroke="#888" strokeWidth="1" strokeDasharray="4 2" rx="3"/>
          <text x={X+BOX_W/2} y={Y-38} textAnchor="middle" fontSize="8" fill="#555" fontFamily="monospace">
            {step.governing_entity.slice(0,14)}
          </text>
          <line x1={X+BOX_W/2} y1={Y-30} x2={X+BOX_W/2} y2={Y} stroke="#888" strokeWidth="1" strokeDasharray="3 2"/>
        </>
      )}

      {/* Health glow halo — pulsing bloom behind step */}
      {glowColor && (
        <rect x={X-4} y={Y-4} width={BOX_W+8} height={BOX_H+8} rx="8"
          fill="none" stroke={glowColor} strokeWidth="2" opacity={glowOpacity}
          style={{ animation: isBottleneck ? 'healthPulse 1.4s ease-in-out infinite' : 'healthBreath 2.8s ease-in-out infinite' }}/>
      )}

      {sym.shape==='rect'     && <rect x={X} y={Y} width={BOX_W} height={BOX_H} fill={sym.fill} {...sc} rx="4" style={{filter:shadow}}/>}
      {sym.shape==='diamond'  && <polygon points={`${X+BOX_W/2},${Y} ${X+BOX_W},${Y+BOX_H/2} ${X+BOX_W/2},${Y+BOX_H} ${X},${Y+BOX_H/2}`} fill={sym.fill} {...sc}/>}
      {sym.shape==='circle'   && <ellipse cx={X+BOX_W/2} cy={Y+BOX_H/2} rx={BOX_W/2} ry={BOX_H/2} fill={sym.fill} {...sc}/>}
      {sym.shape==='oval'     && <rect x={X} y={Y} width={BOX_W} height={BOX_H} fill={sym.fill} {...sc} rx={BOX_H/2}/>}
      {sym.shape==='delay'    && <path d={`M${X},${Y} L${X+BOX_W-BOX_H/2},${Y} Q${X+BOX_W},${Y} ${X+BOX_W},${Y+BOX_H/2} Q${X+BOX_W},${Y+BOX_H} ${X+BOX_W-BOX_H/2},${Y+BOX_H} L${X},${Y+BOX_H} Z`} fill={sym.fill} {...sc}/>}
      {sym.shape==='triangle' && <polygon points={`${X},${Y+BOX_H} ${X+BOX_W},${Y+BOX_H} ${X+BOX_W/2},${Y}`} fill={sym.fill} {...sc}/>}
      {sym.shape==='arrow'    && <path d={`M${X},${Y+BOX_H/2} L${X+BOX_W-12},${Y+BOX_H/2} L${X+BOX_W-12},${Y+8} L${X+BOX_W},${Y+BOX_H/2} L${X+BOX_W-12},${Y+BOX_H-8} L${X+BOX_W-12},${Y+BOX_H/2}`} fill={sym.fill} {...sc}/>}

      <text x={X+BOX_W/2} y={Y+BOX_H/2-5} textAnchor="middle" fontSize="9" fontWeight="700"
        fill={isSelected?BRAND:'#222'} fontFamily="'DM Sans',sans-serif">
        {step.name.length>14 ? step.name.slice(0,13)+'…' : step.name}
      </text>

      {(step.operators||0)>0 && (
        <text x={X+8} y={Y+BOX_H-6} fontSize="8" fill="#666">×{step.operators}</text>
      )}

      <rect x={X} y={Y+BOX_H-4} width={BOX_W} height={4}
        fill={step.va_type==='va'?GREEN:step.va_type==='nva'?RED:step.va_type==='nnva'?AMBER:'#ddd'}/>

      <rect x={X} y={Y+BOX_H+4} width={BOX_W} height={expanded?72:36}
        fill="white" stroke="#D8D5CE" strokeWidth="1"/>
      <text x={X+4} y={Y+BOX_H+14} fontSize="7" fill="#555" fontFamily="monospace">
        {t?.cycleTime?.slice(0,2)||'CT'}: {step.cycle_time ? fmtTime(step.cycle_time, step.cycle_time_unit) : '—'}{step.cycle_time_type==='assumed'?' ~':''}
      </text>
      <text x={X+4} y={Y+BOX_H+24} fontSize="7" fill="#888" fontFamily="monospace">
        Wait: {step.wait_time ? fmtTime(step.wait_time, step.cycle_time_unit) : '0'}
      </text>
      <text x={X+4} y={Y+BOX_H+33} fontSize="7" fill={(step.defect_rate||0)>0?RED:'#aaa'} fontFamily="monospace">
        Dfct: {step.defect_rate||0}% | Ops: {step.operators||1}
      </text>
      <text x={X+BOX_W-8} y={Y+BOX_H+23} fontSize="9" fill={BRAND} fontFamily="monospace"
        style={{cursor:'pointer'}} onClick={(e)=>{e.stopPropagation();onToggleExpand?.(step.id)}}>
        {expanded?'▲':'▼'}
      </text>

      {expanded && (
        <g>
          <line x1={X} y1={Y+BOX_H+39} x2={X+BOX_W} y2={Y+BOX_H+39} stroke="#E8E5E0" strokeWidth="0.8"/>
          {step.governing_entity && <text x={X+4} y={Y+BOX_H+50} fontSize="6.5" fill={BRAND} fontFamily="monospace">⊕ {step.governing_entity.slice(0,16)}</text>}
          {(step.tasks||[]).slice(0,3).map((task: string, ti: number) => (
            <text key={ti} x={X+4} y={Y+BOX_H+60+ti*9} fontSize="6" fill="#333" fontFamily="sans-serif">
              {ti+1}. {task.slice(0,17)}{task.length>17?'…':''}
            </text>
          ))}
        </g>
      )}

      {hasMissing && (
        <>
          <circle cx={X+BOX_W-2} cy={Y+2} r="8" fill={AMBER}/>
          <text x={X+BOX_W-2} y={Y+6} textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
            {(step.missing_info_flags||[]).length}
          </text>
        </>
      )}

      {(step.toolData?.kaizen?.items||[]).some((k:any)=>k.status==='open'||k.status==='in-progress') && (
        <polygon
          points={Array.from({length:10},(_,i)=>{
            const a=(i*36-90)*Math.PI/180; const r=i%2===0?10:6
            return `${X+BOX_W+r*Math.cos(a)},${Y-2+r*Math.sin(a)}`
          }).join(' ')}
          fill="none" stroke={BRAND} strokeWidth="1.2"/>
      )}
    </g>
  )
}

function FlowArrow({ fromX, toX, flowType }: any) {
  const mid = 200 + BOX_H/2
  const x1  = fromX + BOX_W
  const x2  = toX
  if (flowType==='supermarket') {
    return (
      <g>
        <path d={`M${x2+20},${mid-18} L${x1+10},${mid-18}`}
          stroke={BRAND} strokeWidth="1.2" fill="none" strokeDasharray="4 2" markerEnd="url(#arrow-pull)"/>
        <text x={(x1+x2)/2} y={mid-22} textAnchor="middle" fontSize="6" fill={BRAND} fontFamily="monospace">pull</text>
      </g>
    )
  }
  return <path d={`M${x1},${mid} L${x2},${mid}`} stroke="#374151" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-push)"/>
}

const ZBTN: React.CSSProperties = {
  width:32, height:32, borderRadius:6, border:'1px solid var(--border)',
  background:'rgba(255,255,255,.92)', cursor:'pointer',
  fontSize:16, fontWeight:700, color:'var(--text2)', display:'flex',
  alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)',
}

export function V2MapCanvas({ steps, project, t, selectedStepId, onStepClick, onAddStep, missingCount }: any) {
  const [expandedSteps, setExpandedSteps] = useState<Record<string,boolean>>({})
  const [zoom, setZoom] = useState(1)
  const [pan,  setPan]  = useState({ x:0, y:0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragging   = useRef(false)
  const lastPos    = useRef({ x:0, y:0 })
  const dragStart  = useRef({ x:0, y:0 })
  const didDrag    = useRef(false)   // true if pointer moved >4px — suppresses click
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleExpand = (id:string) => setExpandedSteps(p=>({...p,[id]:!p[id]}))
  const expandAll    = () => { const a:any={}; steps.forEach((s:any)=>{a[s.id]=true}); setExpandedSteps(a) }
  const collapseAll  = () => setExpandedSteps({})
  const zoomIn       = () => setZoom(z=>Math.min(z+0.15,3))
  const zoomOut      = () => setZoom(z=>Math.max(z-0.15,0.3))
  const resetView    = () => { setZoom(1); setPan({x:0,y:0}) }

  const onWheel = useCallback((e:WheelEvent) => {
    e.preventDefault()
    setZoom(z=>Math.min(Math.max(z+(e.deltaY>0?-0.1:0.1),0.3),3))
  },[])

  useEffect(()=>{
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, {passive:false})
    return ()=>el.removeEventListener('wheel',onWheel)
  },[onWheel])

  const onMouseDown = (e:React.MouseEvent) => {
    if (e.button !== 0) return
    dragging.current = true
    didDrag.current  = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    lastPos.current   = { x: e.clientX, y: e.clientY }
    setIsDragging(true)
  }
  const onMouseMove = (e:React.MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    // Mark as a real drag once pointer moves >4px from start
    const totalDx = e.clientX - dragStart.current.x
    const totalDy = e.clientY - dragStart.current.y
    if (Math.abs(totalDx) > 4 || Math.abs(totalDy) > 4) didDrag.current = true
    setPan(p => ({ x: p.x + dx, y: p.y + dy }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  const onMouseUp = () => {
    dragging.current = false
    setIsDragging(false)
    // didDrag.current stays true until next mouseDown — suppresses click event
  }

  // Touch support
  const onTouchStart = (e:React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    dragging.current  = true
    didDrag.current   = false
    dragStart.current = { x: t.clientX, y: t.clientY }
    lastPos.current   = { x: t.clientX, y: t.clientY }
  }
  const onTouchMove = (e:React.TouchEvent) => {
    if (!dragging.current || e.touches.length !== 1) return
    e.preventDefault()
    const t = e.touches[0]
    const dx = t.clientX - lastPos.current.x
    const dy = t.clientY - lastPos.current.y
    const totalDx = t.clientX - dragStart.current.x
    const totalDy = t.clientY - dragStart.current.y
    if (Math.abs(totalDx) > 4 || Math.abs(totalDy) > 4) didDrag.current = true
    setPan(p => ({ x: p.x + dx, y: p.y + dy }))
    lastPos.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = () => { dragging.current = false }

  // FIX: use canonical calcProcessMetrics — consistent with all other tabs
  const { mainSteps: _ms, totalCT, totalWait, leadTime: totalLT, vaCT, pce, takt: taktTimeCalc } =
    calcProcessMetrics(steps, project)
  const taktTime = taktTimeCalc ?? 0
  const CANVAS_W  = Math.max(1000, 80+steps.length*(BOX_W+GAP)+160)
  const CANVAS_H  = 520

  // FIX: fit canvas to viewport on mobile so users see the full map on first load
  useEffect(() => {
    if (typeof window === 'undefined') return
    const vw = window.innerWidth
    if (vw < 768 && CANVAS_W > vw) {
      const scale = Math.max(0.3, Math.min(0.9, (vw - 24) / CANVAS_W))
      setZoom(scale)
      setPan({ x: 0, y: 0 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length])

  if (steps.length===0) {
    return (
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20,background:'#FAFAF8',color:'var(--text3)'}}>
        <VSMIcon size={52}/>
        <div style={{textAlign:'center'}}>
          <h3 style={{fontSize:18,fontWeight:700,color:'var(--text)',marginBottom:8}}>Your {t?.valueStream||'value stream'} map will appear here</h3>
          <p style={{fontSize:14,maxWidth:380,lineHeight:1.7,color:'var(--text2)'}}>Upload an SOP to auto-generate the map, or click <strong>+ Add Step</strong> to start manually.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{flex:1,position:'relative',overflow:'hidden',background:'#FAFAF8'}}>
      <style>{`
        @keyframes healthPulse { 0%,100%{opacity:0.55;stroke-width:2} 50%{opacity:0.9;stroke-width:3} }
        @keyframes healthBreath { 0%,100%{opacity:0.2} 50%{opacity:0.5} }
      `}</style>

      {/* KPI + controls HUD */}
      <div style={{position:'absolute',top:10,left:12,zIndex:20,display:'flex',flexDirection:'column',gap:6,pointerEvents:'none'}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',pointerEvents:'all'}}>
          {[
            {label:'Lead Time',value:fmtTime(totalLT)},
            {label:'PCE',value:`${pce}%`,color:pce>=80?GREEN:pce>=50?AMBER:RED},
            {label:'Steps',value:steps.length},
            ...(missingCount>0?[{label:'Incomplete',value:missingCount,color:AMBER}]:[]),
          ].map(({label,value,color})=>(
            <div key={label} style={{background:'rgba(255,255,255,.92)',border:'1px solid var(--border)',borderRadius:6,padding:'4px 10px',textAlign:'center',backdropFilter:'blur(4px)'}}>
              <div style={{fontSize:7,fontFamily:'monospace',color:'var(--text3)',letterSpacing:1}}>{label}</div>
              <div style={{fontSize:13,fontWeight:700,color:color||'var(--text)'}}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:4,pointerEvents:'all'}}>
          <button onClick={expandAll}  style={{fontSize:9,fontFamily:'monospace',letterSpacing:1,padding:'3px 8px',border:'1px solid var(--border)',background:'rgba(255,255,255,.9)',cursor:'pointer',color:'var(--text2)'}}>EXPAND ALL</button>
          <button onClick={collapseAll} style={{fontSize:9,fontFamily:'monospace',letterSpacing:1,padding:'3px 8px',border:'1px solid var(--border)',background:'rgba(255,255,255,.9)',cursor:'pointer',color:'var(--text2)'}}>COLLAPSE</button>
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{position:'absolute',top:10,right:14,zIndex:20,display:'flex',flexDirection:'column',gap:4}}>
        <button onClick={zoomIn}    style={ZBTN}>+</button>
        <button onClick={zoomOut}   style={ZBTN}>−</button>
        <button onClick={resetView} style={{...ZBTN,fontSize:9,padding:'5px 8px'}}>FIT</button>
      </div>

      {/* VA legend */}
      <div style={{position:'absolute',bottom:12,right:14,zIndex:20,display:'flex',gap:6,flexWrap:'wrap',maxWidth:360}}>
        {[{color:GREEN,label:'VA'},{color:AMBER,label:'NNVA'},{color:RED,label:'NVA'},{color:'#ddd',label:'—'}].map(({color,label})=>(
          <div key={label} style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'var(--text3)',background:'rgba(255,255,255,.9)',border:'1px solid var(--border)',borderRadius:4,padding:'2px 7px'}}>
            <div style={{width:8,height:8,borderRadius:2,background:color}}/>{label}
          </div>
        ))}
      </div>

      {/* Zoom % */}
      <div style={{position:'absolute',bottom:12,left:12,zIndex:20,fontSize:10,fontFamily:'monospace',color:'var(--text3)',background:'rgba(255,255,255,.8)',border:'1px solid var(--border)',borderRadius:4,padding:'2px 8px'}}>
        {Math.round(zoom*100)}%
      </div>

      {/* Pan/zoom container */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{width:'100%',height:'100%',cursor:isDragging?'grabbing':'grab',userSelect:'none',overflow:'hidden',touchAction:'none'}}
      >
        <div style={{
          transformOrigin:'top left',
          transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
          width:CANVAS_W, height:CANVAS_H, willChange:'transform',
        }}>
          <svg width={CANVAS_W} height={CANVAS_H} style={{display:'block',userSelect:'none'}} role="region" aria-label="Value stream map canvas" focusable="false">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EBEBEA" strokeWidth="0.5"/>
              </pattern>
              <marker id="arrow-push" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0,6 2,0 4" fill="#374151"/>
              </marker>
              <marker id="arrow-pull" markerWidth="6" markerHeight="4" refX="1" refY="2" orient="auto">
                <polygon points="6 0,0 2,6 4" fill={BRAND}/>
              </marker>
            </defs>
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)"/>

            {/* Supplier */}
            <rect x="10" y="190" width="48" height="40" fill="#5B7FA6" stroke="#3A5A7C" strokeWidth="1.5" rx="2"/>
            <text x="34" y="250" textAnchor="middle" fontSize="9" fontWeight="700" fill="#333" fontFamily="sans-serif">Supplier</text>
            {steps.length>0 && <path d="M58,210 L80,210" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow-push)"/>}

            {steps.map((step:any,i:number)=>(
              <StepBox key={step.id} step={step} index={i} total={steps.length}
                isSelected={step.id===selectedStepId} t={t} taktTime={taktTime}
                expanded={!!expandedSteps[step.id]} onToggleExpand={toggleExpand}
                onClick={(step) => { if (!didDrag.current) onStepClick(step) }}/>
            ))}

            {steps.slice(0,-1).map((_:any,i:number)=>(
              <FlowArrow key={`arr-${i}`}
                fromX={80+i*(BOX_W+GAP)} toX={80+(i+1)*(BOX_W+GAP)}
                flowType={steps[i+1]?.flow_type}/>
            ))}

            {/* Customer */}
            {steps.length>0 && (()=>{
              const lx = 80+(steps.length-1)*(BOX_W+GAP)+BOX_W
              return (
                <>
                  <path d={`M${lx},210 L${lx+14},210`} stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrow-push)"/>
                  <rect x={lx+14} y="190" width="48" height="40" fill="#5B7FA6" stroke="#3A5A7C" strokeWidth="1.5" rx="2"/>
                  <text x={lx+38} y="250" textAnchor="middle" fontSize="9" fontWeight="700" fill="#333" fontFamily="sans-serif">
                    {(t?.customer||'Customer').slice(0,8)}
                  </text>
                </>
              )
            })()}

            {/* WIP/supermarket/inventory overlays */}
            {steps.map((step:any,i:number)=>{
              if (i===0) return null
              const X=80+i*(BOX_W+GAP), Y=200
              const hasWIP=( step.wip||0)>0
              const isSM  = step.flow_type==='supermarket'
              const hasInv=(step.sm_min>0||step.sm_max>0)&&!isSM&&!hasWIP
              return (
                <g key={`ov-${step.id}`}>
                  {hasWIP&&<><polygon points={`${X-30},${Y+14} ${X-10},${Y+14} ${X-20},${Y-2}`} fill="#FEF3C7" stroke={AMBER} strokeWidth="1.5"/><text x={X-20} y={Y+26} textAnchor="middle" fontSize="8" fill={AMBER} fontFamily="monospace" fontWeight="700">{step.wip}</text><text x={X-20} y={Y+35} textAnchor="middle" fontSize="6" fill={AMBER} fontFamily="monospace">WIP</text></>}
                  {isSM&&<><rect x={X-42} y={Y+2} width={12} height={22} fill="none" stroke={BRAND} strokeWidth="1.5"/><rect x={X-40} y={Y+7} width={4} height={4} fill={BRAND} opacity=".5"/><rect x={X-40} y={Y+14} width={4} height={4} fill={BRAND} opacity=".5"/><text x={X-36} y={Y+33} fontSize="6" fill={BRAND} fontFamily="monospace" textAnchor="middle">SPMK</text></>}
                  {hasInv&&<><polygon points={`${X-30},${Y+14} ${X-10},${Y+14} ${X-20},${Y-2}`} fill="#F0EEF8" stroke="#8C44CC" strokeWidth="1.2"/><text x={X-20} y={Y+26} textAnchor="middle" fontSize="6" fill="#8C44CC" fontFamily="monospace">INV</text></>}
                </g>
              )
            })}

            {/* Sawtooth timeline */}
            {totalLT>0&&(()=>{
              const TL_Y=330, TL_W=Math.max(2,CANVAS_W-120)
              let pos=60
              return (
                <g>
                  <line x1="60" y1={TL_Y+20} x2={CANVAS_W-40} y2={TL_Y+20} stroke="#D8D5CE" strokeWidth="1"/>
                  {steps.flatMap((s:any,i:number)=>{
                    const ctW=totalLT>0?((s.cycle_time||0)/totalLT)*TL_W:0
                    const waitW=totalLT>0?((s.wait_time||0)/totalLT)*TL_W:0
                    const cf=s.va_type==='va'?BRAND:s.va_type==='nva'?RED:AMBER
                    const els:any[]=[]
                    if(ctW>0){els.push(<g key={`ct-${i}`}><line x1={pos} y1={TL_Y+20} x2={pos} y2={TL_Y} stroke={cf} strokeWidth="1"/><line x1={pos} y1={TL_Y} x2={pos+ctW} y2={TL_Y} stroke={cf} strokeWidth="3"/><line x1={pos+ctW} y1={TL_Y} x2={pos+ctW} y2={TL_Y+20} stroke={cf} strokeWidth="1"/>{ctW>20&&<text x={pos+ctW/2} y={TL_Y-4} textAnchor="middle" fontSize="7" fill={cf} fontFamily="monospace">{fmtTime(s.cycle_time||0)}</text>}</g>);pos+=ctW}
                    if(waitW>0){els.push(<g key={`wt-${i}`}><line x1={pos} y1={TL_Y+20} x2={pos} y2={TL_Y+30} stroke="#C8C5C0" strokeWidth="1"/><line x1={pos} y1={TL_Y+30} x2={pos+waitW} y2={TL_Y+30} stroke="#C8C5C0" strokeWidth="2"/><line x1={pos+waitW} y1={TL_Y+30} x2={pos+waitW} y2={TL_Y+20} stroke="#C8C5C0" strokeWidth="1"/>{waitW>20&&<text x={pos+waitW/2} y={TL_Y+42} textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">{fmtTime(s.wait_time||0)}</text>}</g>);pos+=waitW}
                    return els
                  })}
                  <text x={CANVAS_W/2} y={TL_Y+58} textAnchor="middle" fontSize="9" fill="#888" fontFamily="monospace">
                    {t?.cycleTime||'CT'}: {fmtTime(totalCT)} · Wait: {fmtTime(totalWait)} · Lead Time: {fmtTime(totalLT)} · PCE: {fmtPCE(pce)}
                  </text>
                  {taktTime>0&&(()=>{
                    const tx=60+(taktTime/totalLT)*TL_W
                    return <g><line x1={tx} y1={TL_Y-30} x2={tx} y2={TL_Y+50} stroke={RED} strokeWidth="1.2" strokeDasharray="5 3" opacity=".6"/><text x={tx+4} y={TL_Y-22} fontSize="8" fill={RED} fontFamily="monospace">Takt={fmtTime(taktTime)}</text></g>
                  })()}
                </g>
              )
            })()}

            {/* Add step button */}
            {(()=>{
              const x=80+steps.length*(BOX_W+GAP)
              return (
                <g style={{cursor:'pointer'}} onClick={()=>onAddStep(steps.length-1)}>
                  <rect x={x} y={205} width={38} height={38} rx="9" fill="white" stroke={BRAND} strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x={x+19} y={229} textAnchor="middle" fontSize="22" fill={BRAND} fontWeight="300">+</text>
                </g>
              )
            })()}
          </svg>
        </div>
      </div>
    </div>
  )
}
