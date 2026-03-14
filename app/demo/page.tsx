// @ts-nocheck
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

const GOLD = '#D4A208'
const TEAL = '#1DD1A1'
const BLUE = '#6CB9FC'
const RED  = '#FF6B6B'
const PURPLE = '#7C3AED'

const SOP_LINES = [
  { text: 'AUTOMOTIVE DOOR ASSEMBLY — STANDARD OPERATING PROCEDURE', type: 'h' },
  { text: 'Doc: SOP-DOOR-001 | Rev B | Effective: 2026-01-15', type: 'meta' },
  { text: '', type: 'gap' },
  { text: '1. STEEL BLANK RECEIVING', type: 'step' },
  { text: '   CT: 45s  |  Operators: 2  |  Uptime: 95%', type: 'data' },
  { text: '   Incoming inspection: visual + dimensional check', type: 'note' },
  { text: '', type: 'gap' },
  { text: '2. STAMPING / PRESS OPERATION', type: 'step' },
  { text: '   CT: 28s  |  Operators: 3  |  Uptime: 88%  |  Defect: 1.2%', type: 'data' },
  { text: '   Progressive die press at 160 SPM | Setup: 15min', type: 'note' },
  { text: '', type: 'gap' },
  { text: '3. WELD SUB-ASSEMBLY', type: 'step' },
  { text: '   CT: 92s  |  Operators: 4  |  Uptime: 91%  |  Defect: 2.1%', type: 'data' },
  { text: '   MIG weld 6 points per panel  |  WIP buffer: 30 units', type: 'note' },
  { text: '', type: 'gap' },
  { text: '4. HEM / CLINCH OPERATION', type: 'step' },
  { text: '   CT: 34s  |  Operators: 2  |  Uptime: 96%', type: 'data' },
  { text: '   Hem flanges around perimeter — 4 stations, FIFO flow', type: 'note' },
  { text: '', type: 'gap' },
  { text: '5. E-COAT / PAINT PREPARATION   ← CONSTRAINT', type: 'step' },
  { text: '   CT: 1800s  |  Operators: 2  |  Uptime: 82%  |  Defect: 3.5%', type: 'data' },
  { text: '   Electrophoretic coating  |  Batch size: 40 doors', type: 'note' },
  { text: '', type: 'gap' },
  { text: '6. FINAL ASSEMBLY AND QUALITY CHECK', type: 'step' },
  { text: '   CT: 145s  |  Operators: 5  |  Uptime: 97%', type: 'data' },
  { text: '   47-point inspection  |  Hardware + seals + glass install', type: 'note' },
  { text: '', type: 'gap' },
  { text: '7. PACK AND SHIP TO OEM', type: 'step' },
  { text: '   CT: 55s  |  Operators: 2  |  Uptime: 99%', type: 'data' },
  { text: '   Custom racks, 6 doors/rack  |  Daily milk-run delivery', type: 'note' },
]

const STEPS = [
  { name: 'Steel Blank\nReceiving',   ct: 45,   wt: 120, ops: 2, uptime: 95, defect: null, wip: 0  },
  { name: 'Stamping\nPress',          ct: 28,   wt: 180, ops: 3, uptime: 88, defect: 1.2,  wip: 30 },
  { name: 'Weld\nSub-Assy',           ct: 92,   wt: 240, ops: 4, uptime: 91, defect: 2.1,  wip: 15 },
  { name: 'Hem / Clinch\nOp.',        ct: 34,   wt: 60,  ops: 2, uptime: 96, defect: null, wip: 5  },
  { name: 'E-Coat /\nPaint Prep',     ct: 1800, wt: 600, ops: 2, uptime: 82, defect: 3.5,  wip: 40 },
  { name: 'Final Assy\n& QC',         ct: 145,  wt: 300, ops: 5, uptime: 97, defect: null, wip: 8  },
  { name: 'Pack &\nShip OEM',         ct: 55,   wt: 120, ops: 2, uptime: 99, defect: null, wip: 0  },
]

const TAKT = 120
const totalCT = STEPS.reduce((a, s) => a + s.ct, 0)
const totalWT = STEPS.reduce((a, s) => a + s.wt, 0)
const leadTime = totalCT + totalWT
const pce = ((totalCT / leadTime) * 100).toFixed(1)

const fmtS = (s) => {
  if (s < 60) return s + 's'
  if (s < 3600) return (s / 60).toFixed(1) + 'm'
  return (s / 3600).toFixed(1) + 'h'
}

const PIPELINE = [
  { id: 'upload',  icon: '📄', label: 'SOP Upload',     color: BLUE,    detail: 'PDF, Word, or plain text — VeSiMy reads raw process language.' },
  { id: 'parse',   icon: '🤖', label: 'AI Parse',       color: PURPLE,  detail: 'Claude AI extracts cycle times, operators, defect rates, departments.' },
  { id: 'extract', icon: '⚙',  label: 'Step Extract',   color: GOLD,    detail: '7 steps identified. Sequence and flow dependencies mapped.' },
  { id: 'metrics', icon: '📊', label: 'Metrics Engine', color: TEAL,    detail: 'Lead Time · PCE · Takt · Bottleneck detection computed.' },
  { id: 'vsm',     icon: '🗺', label: 'VSM Generated',  color: '#F59E0B', detail: 'ISO 22468-compliant map with flow arrows and WIP inventory.' },
  { id: 'waste',   icon: '⚠',  label: 'Waste Analysis', color: RED,     detail: '4 waste categories detected. E-Coat 15× over takt.' },
  { id: 'report',  icon: '📋', label: 'ISO Report',     color: '#10B981', detail: 'White-paper report with ISO 9001 + ISO 22468 structure.' },
]

const WASTE_ITEMS = [
  { icon: '🔴', sev: 'CRITICAL', label: 'Bottleneck — E-Coat/Paint Prep',   detail: 'CT: 1800s vs Takt: 120s (15× over). Batch size 40 doors is the primary constraint.',     color: RED },
  { icon: '🟠', sev: 'HIGH',     label: 'Defect Rate — Weld Sub-Assembly',  detail: 'Defect rate 2.1% exceeds 2% threshold. Fixture variation identified. Initiate 5 Why.', color: '#F59E0B' },
  { icon: '🟠', sev: 'HIGH',     label: 'Low Uptime — E-Coat Equipment',    detail: 'Uptime 82% below 90% floor. Unplanned downtime amplifies batch constraint.',             color: '#F59E0B' },
  { icon: '🟡', sev: 'MEDIUM',   label: 'Excess WIP — Stamping Buffer',     detail: '30 units between Receiving and Stamping indicates push scheduling. Evaluate FIFO.',    color: GOLD },
]

const BOX_W = 102, BOX_H = 72, GAP = 50, MARGIN = 18
const SVG_W = MARGIN * 2 + STEPS.length * (BOX_W + GAP) - GAP + 40
const SVG_H = 270

export default function DemoPage() {
  const [stage, setStage] = useState(-1)
  const [running, setRunning] = useState(false)
  const [sopLine, setSopLine] = useState(0)
  const [stepsRevealed, setStepsRevealed] = useState(0)
  const [activeStep, setActiveStep] = useState(null)
  const [hoveredPipeline, setHoveredPipeline] = useState(null)
  const timers = useRef([])

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const sched = (fn, delay, base) => {
    const t = setTimeout(fn, base + delay)
    timers.current.push(t)
    return t
  }

  const runPipeline = useCallback(() => {
    if (running) return
    clearAll()
    setRunning(true)
    setStage(0)
    setSopLine(0)
    setStepsRevealed(0)

    let t = 0

    // Stage 0 — type SOP
    SOP_LINES.forEach((_, i) => { sched(() => setSopLine(i + 1), t += 75, 0) })

    // Stage 1 — AI Parse
    sched(() => setStage(1), t += 300, 0)

    // Stage 2 — Extract steps
    sched(() => setStage(2), t += 500, 0)
    STEPS.forEach((_, i) => { sched(() => setStepsRevealed(i + 1), t += 200, 0) })

    // Stage 3 — Metrics
    sched(() => setStage(3), t += 400, 0)

    // Stage 4 — VSM
    sched(() => setStage(4), t += 600, 0)

    // Stage 5 — Waste
    sched(() => setStage(5), t += 700, 0)

    // Stage 6 — Report done
    sched(() => { setStage(6); setRunning(false) }, t += 600, 0)
  }, [running])

  const reset = () => { clearAll(); setStage(-1); setRunning(false); setSopLine(0); setStepsRevealed(0) }

  const boxX = (i) => MARGIN + i * (BOX_W + GAP)

  return (
    <div style={{ minHeight: '100vh', background: '#04060F', color: '#E8ECF4', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: GOLD, fontFamily: 'monospace', marginBottom: 7, textTransform: 'uppercase' }}>VeSiMy · Live Demo</div>
            <h1 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, margin: 0, letterSpacing: -1, lineHeight: 1.1 }}>
              From SOP to VSM<br /><span style={{ color: GOLD }}>in 30 seconds</span>
            </h1>
            <p style={{ color: '#7A84A0', fontSize: 13, marginTop: 10, maxWidth: 440 }}>
              Drop a Standard Operating Procedure. Watch AI extract your value stream, map every process step, flag waste, and generate an ISO-compliant report — automatically.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={runPipeline} disabled={running}
              style={{ padding: '11px 22px', borderRadius: 12, border: 'none', background: running ? 'rgba(212,162,8,0.15)' : `linear-gradient(135deg,${GOLD},#B8860B)`, color: running ? GOLD : '#000', fontWeight: 700, fontSize: 14, cursor: running ? 'default' : 'pointer', boxShadow: running ? 'none' : `0 0 24px ${GOLD}44`, animation: !running && stage === -1 ? 'pulse 2s ease-in-out infinite' : 'none', transition: 'all 0.3s' }}>
              {running ? '⟳ Running…' : stage === -1 ? '▶  Run Demo' : '▶  Run Again'}
            </button>
            {stage >= 0 && (
              <button onClick={reset} style={{ padding: '11px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#7A84A0', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>↺ Reset</button>
            )}
            <Link href="/auth/login" style={{ padding: '11px 18px', borderRadius: 12, border: `1px solid ${TEAL}44`, background: `${TEAL}0A`, color: TEAL, fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Try Free →
            </Link>
          </div>
        </div>

        {/* ═════════════ PIPELINE FLOWCHART ═════════════ */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid transparent', borderRadius: 18, padding: '20px 16px 16px', marginBottom: 22, overflowX: 'auto' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: '#3A4060', marginBottom: 14, fontFamily: 'monospace', textTransform: 'uppercase' }}>SOP → VSM Pipeline · 7 stages</div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, minWidth: 700 }}>
            {PIPELINE.map((p, i) => {
              const isActive = stage === i, isDone = stage > i
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <div
                    onMouseEnter={() => setHoveredPipeline(i)}
                    onMouseLeave={() => setHoveredPipeline(null)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 6px',
                      borderRadius: 12, border: `1.5px solid ${isActive ? p.color : isDone ? p.color + '55' : 'transparent'}`,
                      background: isActive ? `radial-gradient(circle at 50% 0%,${p.color}18,transparent 70%)` : isDone ? `${p.color}07` : 'transparent',
                      transition: 'all 0.4s', cursor: isDone ? 'pointer' : 'default', position: 'relative', overflow: 'hidden',
                      boxShadow: isActive ? `0 0 18px ${p.color}30` : 'none',
                    }}
                  >
                    {isActive && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,transparent,${p.color}12,transparent)`, animation: 'shimmer 1.4s ease-in-out infinite', borderRadius: 12 }} />}
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 7, background: isDone ? `${p.color}20` : isActive ? `${p.color}28` : 'transparent', border: `1.5px solid ${isDone || isActive ? p.color + '55' : 'transparent'}`, animation: isActive ? 'iconPulse 1s ease-in-out infinite' : 'none', transition: 'all 0.3s' }}>
                      {isDone ? '✓' : p.icon}
                    </div>
                    <div style={{ fontSize: 8.5, letterSpacing: 1.5, color: isDone ? p.color : isActive ? p.color : '#3A4060', fontFamily: 'monospace', marginBottom: 3 }}>S{i + 1}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: isDone ? '#C8CFDD' : isActive ? '#F5F7FB' : '#4A5470', textAlign: 'center', lineHeight: 1.3, marginBottom: 5 }}>{p.label}</div>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: isDone ? '#10B981' : isActive ? p.color : '#1A1F36', boxShadow: isActive ? `0 0 7px ${p.color}` : 'none', animation: isActive ? 'dotPulse 0.7s ease-in-out infinite alternate' : 'none' }} />
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div style={{ padding: '0 3px', display: 'flex', alignItems: 'center' }}>
                      <svg width={18} height={14} style={{ overflow: 'visible' }}>
                        <line x1="2" y1="7" x2="12" y2="7" stroke={stage > i ? PIPELINE[i].color : '#2A2F4A'} strokeWidth="1.5" strokeDasharray={stage <= i ? '3,2' : 'none'} />
                        <polygon points="12,4 18,7 12,10" fill={stage > i ? PIPELINE[i].color : '#2A2F4A'} opacity={stage > i ? 0.85 : 0.25} />
                        {stage === i && (
                          <circle r="2.5" fill={PIPELINE[i].color} opacity="0.9">
                            <animateMotion dur="0.55s" repeatCount="indefinite" path="M2,7 L16,7" />
                          </circle>
                        )}
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {hoveredPipeline !== null && stage > hoveredPipeline && (
            <div style={{ marginTop: 10, padding: '9px 12px', borderRadius: 9, background: 'transparent', border: `1px solid ${PIPELINE[hoveredPipeline].color}33`, fontSize: 11, color: '#C8CFDD', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: PIPELINE[hoveredPipeline].color, fontWeight: 700 }}>{PIPELINE[hoveredPipeline].icon} {PIPELINE[hoveredPipeline].label}</span>
              <span style={{ color: '#5A6480' }}>·</span>
              <span>{PIPELINE[hoveredPipeline].detail}</span>
              <span style={{ marginLeft: 'auto', color: '#10B981', fontSize: 9, letterSpacing: 1 }}>COMPLETE ✓</span>
            </div>
          )}
        </div>

        {/* ═════════════ 2-COLUMN LAYOUT ═════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,280px) 1fr', gap: 16, alignItems: 'start' }}>

          {/* ── SOP Panel ── */}
          <div style={{ background: 'rgba(255,255,255,0.015)', border: `1px solid ${stage >= 0 ? BLUE + '44' : 'transparent'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.5s' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: stage >= 0 ? `${BLUE}10` : 'transparent', transition: 'background 0.5s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 13 }}>📄</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: stage >= 0 ? BLUE : '#5A6480' }}>SOP-DOOR-001.pdf</span>
              </div>
              {stage === 0 && <div style={{ display: 'flex', gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: BLUE, animation: `dotBounce 0.7s ease-in-out ${i*0.15}s infinite alternate` }} />)}</div>}
              {stage > 0 && <span style={{ fontSize: 9, color: '#10B981' }}>✓ Read</span>}
            </div>
            <div style={{ padding: 10, fontFamily: 'monospace', fontSize: 9, lineHeight: 1.75, maxHeight: 480, overflowY: 'auto' }}>
              {stage === -1 && (
                <div style={{ height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#3A4060', border: '2px dashed transparent', borderRadius: 10, cursor: 'pointer' }} onClick={runPipeline}>
                  <span style={{ fontSize: 24, opacity: 0.3 }}>📄</span>
                  <div style={{ fontSize: 10, color: '#5A6480' }}>Drop SOP here</div>
                  <div style={{ fontSize: 9, color: '#3A4060' }}>or click ▶ Run Demo</div>
                </div>
              )}
              {SOP_LINES.slice(0, sopLine).map((line, i) => (
                <div key={i} style={{ color: line.type === 'h' ? GOLD : line.type === 'step' ? BLUE : line.type === 'data' ? TEAL : line.type === 'meta' ? '#4A5470' : '#8F98AD', fontWeight: line.type === 'h' || line.type === 'step' ? 700 : 400, animation: 'fadeInLine 0.15s ease-out', whiteSpace: 'pre-wrap' }}>
                  {line.text || '\u00A0'}
                </div>
              ))}
              {stage === 0 && sopLine < SOP_LINES.length && <div style={{ display: 'inline-block', width: 6, height: 11, background: BLUE, animation: 'blink 0.7s step-end infinite', verticalAlign: 'middle' }} />}
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div style={{ display: 'grid', gap: 16 }}>

            {/* Step Cards */}
            <div style={{ background: 'rgba(255,255,255,0.015)', border: `1px solid ${stage >= 2 ? GOLD + '44' : 'transparent'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.5s' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: stage >= 2 ? `${GOLD}08` : 'transparent' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: stage >= 2 ? GOLD : '#3A4060' }}>⚙ Extracted Process Steps</div>
                <div style={{ fontSize: 10, color: '#5A6480' }}>{stepsRevealed}/{STEPS.length} steps</div>
              </div>
              <div style={{ padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STEPS.map((step, i) => {
                  const revealed = i < stepsRevealed
                  const isOver = step.ct > TAKT
                  return (
                    <div key={i}
                      onMouseEnter={() => setActiveStep(i)}
                      onMouseLeave={() => setActiveStep(null)}
                      style={{ width: 116, borderRadius: 10, border: `1px solid ${!revealed ? 'transparent' : isOver ? RED + '55' : GOLD + '33'}`, background: !revealed ? 'transparent' : isOver ? `${RED}09` : `${GOLD}07`, padding: '9px 9px 7px', opacity: revealed ? 1 : 0.2, transition: 'all 0.35s ease', transform: revealed ? 'translateY(0)' : 'translateY(8px)', cursor: revealed ? 'pointer' : 'default', position: 'relative', overflow: 'hidden' }}>
                      {revealed && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: isOver ? RED : GOLD, animation: i === stepsRevealed - 1 ? 'slideIn 0.3s ease-out' : 'none' }} />}
                      <div style={{ fontSize: 8.5, fontWeight: 700, color: isOver ? RED : GOLD, marginBottom: 4, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{i+1}. {step.name}</div>
                      <div style={{ fontSize: 8, fontFamily: 'monospace', color: TEAL }}>CT: {fmtS(step.ct)}</div>
                      {step.defect && <div style={{ fontSize: 7.5, color: RED, marginTop: 1 }}>DF: {step.defect}%</div>}
                      {step.wip > 0 && <div style={{ fontSize: 7.5, color: PURPLE, marginTop: 1 }}>WIP: {step.wip}</div>}
                      <div style={{ fontSize: 7.5, color: '#5A6480', marginTop: 2 }}>{step.ops} ops · {step.uptime}% up</div>
                      {isOver && revealed && <div style={{ fontSize: 7, color: RED, fontWeight: 700, marginTop: 3 }}>⚠ OVER TAKT</div>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* KPI Row */}
            {stage >= 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, animation: 'fadeUp 0.5s ease-out' }}>
                {[
                  { l: 'Lead Time',  v: fmtS(leadTime), c: GOLD,      sub: 'Total span' },
                  { l: 'Value Added', v: fmtS(totalCT), c: TEAL,      sub: 'Process time' },
                  { l: 'PCE',        v: pce + '%',      c: '#F59E0B', sub: 'Efficiency' },
                  { l: 'Takt Time',  v: fmtS(TAKT),    c: BLUE,      sub: '120/day demand' },
                  { l: 'Bottleneck', v: '1 step',       c: RED,       sub: 'E-Coat 15×' },
                ].map((m, i) => (
                  <div key={m.l} style={{ background: 'transparent', border: `1px solid ${m.c}33`, borderRadius: 12, padding: '10px 12px', animation: `fadeUp 0.4s ease-out ${i * 0.07}s both` }}>
                    <div style={{ fontSize: 8.5, color: '#5A6480', letterSpacing: 1.2, fontFamily: 'monospace', marginBottom: 4 }}>{m.l}</div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: m.c, lineHeight: 1 }}>{m.v}</div>
                    <div style={{ fontSize: 8.5, color: '#3A4060', marginTop: 3 }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═════════════ VSM MAP ═════════════ */}
        {stage >= 4 && (
          <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.015)', border: `1px solid ${GOLD}33`, borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.6s ease-out' }}>
            <div style={{ padding: '11px 16px', borderBottom: '1px solid transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${GOLD}08` }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>🗺 Current-State Value Stream Map</span>
                <span style={{ fontSize: 10, color: '#5A6480', marginLeft: 12 }}>ISO 22468:2020 · Door Assembly · 7 steps</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 9.5 }}>
                {[{ c: GOLD, l: 'Material Flow' }, { c: BLUE, l: 'Information' }, { c: PURPLE, l: 'WIP' }, { c: RED, l: 'Bottleneck' }].map(({ c, l }) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7A84A0' }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />{l}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, overflowX: 'auto', background: '#030510' }}>
              <svg width={SVG_W} height={SVG_H} style={{ display: 'block', minWidth: SVG_W }}>
                <defs>
                  <linearGradient id="boxG" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#13182A" />
                    <stop offset="100%" stopColor="#090C18" />
                  </linearGradient>
                  <marker id="mArr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                    <polygon points="0 0,7 2.5,0 5" fill={GOLD} opacity="0.75" />
                  </marker>
                  <marker id="iArr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                    <polygon points="0 0,7 2.5,0 5" fill={BLUE} opacity="0.6" />
                  </marker>
                  <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="cb" /><feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>

                {/* Supplier / Customer + info flow */}
                <text x={MARGIN} y={24} fill="#C8CFDD" fontSize={10} fontWeight={700}>Stamping Plant</text>
                <line x1={MARGIN + 85} y1={20} x2={SVG_W - MARGIN - 65} y2={20} stroke={BLUE} strokeDasharray="5,3" opacity={0.35} markerEnd="url(#iArr)" />
                <text x={SVG_W - MARGIN - 65} y={24} fill="#C8CFDD" fontSize={10} fontWeight={700}>OEM Customer</text>
                <text x={SVG_W / 2 - 35} y={14} fill="#3A4060" fontSize={7.5} fontFamily="monospace">INFORMATION FLOW</text>

                {STEPS.map((step, i) => {
                  const x = boxX(i), y = 44
                  const isOver = step.ct > TAKT
                  const col = isOver ? RED : GOLD
                  const rev = i < stepsRevealed
                  return (
                    <g key={i} opacity={rev ? 1 : 0} style={{ transition: 'opacity 0.3s' }}>
                      {i > 0 && (
                        <g>
                          <line x1={boxX(i-1)+BOX_W} y1={y+BOX_H/2} x2={x} y2={y+BOX_H/2} stroke={GOLD} strokeWidth={1.5} opacity={0.55} markerEnd="url(#mArr)" />
                          {stage >= 4 && rev && (
                            <circle r="2.5" fill={GOLD} opacity="0.85" filter="url(#glow)">
                              <animateMotion dur={`${0.7+i*0.09}s`} repeatCount="indefinite" path={`M${boxX(i-1)+BOX_W},${y+BOX_H/2} L${x},${y+BOX_H/2}`} />
                            </circle>
                          )}
                          {step.wip > 0 && (
                            <g transform={`translate(${boxX(i-1)+BOX_W+GAP/2-9},${y+BOX_H/2-15})`}>
                              <polygon points="9,0 18,16 0,16" fill="none" stroke={PURPLE} strokeWidth={1.2} opacity={0.7} />
                              <text x="9" y="12" textAnchor="middle" fill={PURPLE} fontSize={7.5}>{step.wip}</text>
                            </g>
                          )}
                        </g>
                      )}
                      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={7} fill="url(#boxG)" stroke={isOver ? `${RED}55` : `${GOLD}30`} strokeWidth={activeStep === i ? 2 : 1.5} filter={activeStep === i ? 'url(#glow)' : 'none'} />
                      <rect x={x} y={y} width={BOX_W} height={3.5} rx={3} fill={col} opacity={0.75} />
                      <text x={x+BOX_W/2} y={y+15} textAnchor="middle" fill="#F5F7FB" fontSize={8} fontWeight={700}>{step.name.split('\n')[0]}</text>
                      {step.name.split('\n')[1] && <text x={x+BOX_W/2} y={y+24} textAnchor="middle" fill="#F5F7FB" fontSize={8} fontWeight={700}>{step.name.split('\n')[1]}</text>}
                      <line x1={x+5} y1={y+30} x2={x+BOX_W-5} y2={y+30} stroke="transparent" />
                      <text x={x+6} y={y+41} fill="#7A84A0" fontSize={7}>CT</text>
                      <text x={x+22} y={y+41} fill={isOver ? RED : GOLD} fontSize={8.5} fontWeight={700}>{fmtS(step.ct)}</text>
                      <text x={x+56} y={y+41} fill="#7A84A0" fontSize={7}>OPS</text>
                      <text x={x+76} y={y+41} fill="#C8CFDD" fontSize={8}>{step.ops}</text>
                      <text x={x+6} y={y+53} fill="#7A84A0" fontSize={7}>UP</text>
                      <text x={x+22} y={y+53} fill={step.uptime < 90 ? RED : '#10B981'} fontSize={8}>{step.uptime}%</text>
                      {step.defect && <>
                        <text x={x+56} y={y+53} fill="#7A84A0" fontSize={7}>DF</text>
                        <text x={x+74} y={y+53} fill={step.defect > 2 ? RED : '#F59E0B'} fontSize={8}>{step.defect}%</text>
                      </>}
                      {isOver && rev && <text x={x+BOX_W-4} y={y+14} textAnchor="end" fill={RED} fontSize={7} fontWeight={700}>⚠ OVER</text>}
                    </g>
                  )
                })}

                {/* Timeline */}
                <text x={MARGIN} y={SVG_H - 52} fill="#3A4060" fontSize={7.5} fontFamily="monospace">VALUE-ADDED TIMELINE</text>
                {STEPS.map((step, i) => {
                  const x = boxX(i)
                  const barW = Math.max(6, (step.ct / totalCT) * (BOX_W * 0.9))
                  return (
                    <g key={`tl-${i}`}>
                      <rect x={x} y={SVG_H - 44} width={barW} height={7} rx={2} fill={step.ct > TAKT ? RED : GOLD} opacity={0.4} />
                      <text x={x+2} y={SVG_H - 26} fill={step.ct > TAKT ? RED : GOLD} fontSize={7} fontFamily="monospace">{fmtS(step.ct)}</text>
                    </g>
                  )
                })}
                <text x={MARGIN} y={SVG_H - 9} fill="#3A4060" fontSize={8.5} fontFamily="monospace">
                  {`LT: ${fmtS(leadTime)}  ·  VA: ${fmtS(totalCT)}  ·  PCE: ${pce}%  ·  Takt: ${fmtS(TAKT)}  ·  Bottleneck: E-Coat (${fmtS(1800)} vs ${fmtS(TAKT)})`}
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* ═════════════ WASTE + REPORT ═════════════ */}
        {stage >= 5 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginTop: 16, animation: 'fadeUp 0.5s ease-out' }}>
            {/* Waste */}
            <div style={{ background: 'rgba(255,255,255,0.015)', border: `1px solid ${RED}30`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '11px 14px', borderBottom: '1px solid transparent', background: `${RED}08`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: RED }}>⚠ Waste & Constraint Analysis</span>
                <span style={{ fontSize: 9.5, color: '#5A6480' }}>ISO 22468 §5.4 · 4 findings</span>
              </div>
              <div style={{ padding: 12, display: 'grid', gap: 9 }}>
                {WASTE_ITEMS.map((w, i) => (
                  <div key={i} style={{ padding: '9px 11px', borderRadius: 9, border: `1px solid ${w.color}22`, background: `${w.color}05`, display: 'flex', gap: 9, alignItems: 'flex-start', animation: `fadeUp 0.3s ease-out ${i*0.09}s both` }}>
                    <span style={{ fontSize: 13, marginTop: 1 }}>{w.icon}</span>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: w.color, marginBottom: 3, display: 'flex', gap: 7, alignItems: 'center' }}>
                        {w.label}
                        <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: `${w.color}22` }}>{w.sev}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: '#8F98AD', lineHeight: 1.55 }}>{w.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report */}
            {stage >= 6 && (
              <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, overflow: 'hidden', animation: 'fadeUp 0.5s ease-out' }}>
                <div style={{ padding: '11px 14px', borderBottom: '1px solid transparent', background: 'rgba(16,185,129,0.06)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>📋 ISO Report Ready</div>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'grid', gap: 7, marginBottom: 14 }}>
                    {['Document Control Block', 'ISO 22468 + ISO 9001 Reference', 'Executive Summary + KPIs', 'Process Matrix — all 7 steps', 'Waste Finding Register', 'Corrective Action Plan', 'PCE Benchmark Analysis', 'Approval & Signature Block'].map((item, i) => (
                      <div key={i} style={{ fontSize: 10.5, color: '#C8CFDD', display: 'flex', gap: 7, animation: `fadeUp 0.3s ease-out ${i*0.055}s both` }}>
                        <span style={{ color: '#10B981' }}>✓</span><span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.025)', border: '1px solid transparent', marginBottom: 13 }}>
                    <div style={{ fontSize: 8.5, color: '#5A6480', marginBottom: 3, fontFamily: 'monospace', letterSpacing: 0.5 }}>WHITE PAPER · A4 · PRINT READY</div>
                    <div style={{ fontSize: 10, color: '#8F98AD', lineHeight: 1.5 }}>No background color. ISO-structured sections. Clean for physical filing.</div>
                  </div>
                  <Link href="/auth/login" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg,#10B981,#0EA5E9)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 18px rgba(16,185,129,0.28)' }}>
                    Build Your VSM Free →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Bottom CTA (idle) ── */}
        {stage === -1 && (
          <div style={{ marginTop: 40, textAlign: 'center', padding: '48px 20px', borderRadius: 20, border: '1px solid rgba(212,162,8,0.14)', background: 'radial-gradient(ellipse at 50% 100%, rgba(212,162,8,0.05), transparent)' }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: GOLD, fontFamily: 'monospace', marginBottom: 14 }}>VESIMY · PROCESS INTELLIGENCE</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', letterSpacing: -0.5 }}>See your manufacturing process in 30 seconds</h2>
            <p style={{ color: '#7A84A0', fontSize: 14, maxWidth: 440, margin: '0 auto 24px' }}>Upload a SOP. Get a VSM, waste analysis, and ISO report — free.</p>
            <button onClick={runPipeline} style={{ padding: '13px 30px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${GOLD},#B8860B)`, color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: `0 0 28px ${GOLD}44`, animation: 'pulse 2s ease-in-out infinite' }}>▶ Run the Demo</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes iconPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        @keyframes dotPulse { 0%{opacity:.4} 100%{opacity:1} }
        @keyframes dotBounce { 0%{transform:translateY(0);opacity:.4} 100%{transform:translateY(-4px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeInLine { from{opacity:0;transform:translateX(-3px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 18px rgba(212,162,8,.3)} 50%{box-shadow:0 0 38px rgba(212,162,8,.6)} }
      `}</style>
    </div>
  )
}
