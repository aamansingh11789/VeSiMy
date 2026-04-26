'use client'

import { useMemo, useState } from 'react'
import type { Step, Branch, Project } from '@/lib/store'
import { calcProcessMetrics, fmtPCE, pceColor } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'

interface Props { steps: Step[]; branches: Branch[]; project: Project }

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60) return `${Math.round(s)}s`
  if (s < 3600) return `${(s / 60).toFixed(s % 60 === 0 ? 0 : 1)}m`
  return `${(s / 3600).toFixed(1)}h`
}

const stickyPalette = [
  { name: 'blue', bg: '#DDEEFF', edge: '#B9D7FF', pin: '#1D7BFF', ink: '#0A2540' },
  { name: 'yellow', bg: '#FFF0B8', edge: '#F8D96B', pin: '#E8A300', ink: '#3B2F00' },
  { name: 'pink', bg: '#FFE1E7', edge: '#FFC2CD', pin: '#E5484D', ink: '#441018' },
  { name: 'green', bg: '#DFF7D8', edge: '#BFEFB5', pin: '#2BA84A', ink: '#103B17' },
  { name: 'lavender', bg: '#E9E1FF', edge: '#D6C8FF', pin: '#7C3AED', ink: '#241044' },
  { name: 'aqua', bg: '#DDF8FF', edge: '#B4ECF7', pin: '#0284C7', ink: '#0B3340' },
]
const rotations = [-1.2, 0.9, -0.5, 1.1, -0.9, 0.7, -1.0, 1.2]

const guidedSteps = [
  'Knowledge Check',
  'Target Setting',
  'Current State',
  'Process Boundaries',
  'Map the Steps',
  'Bottleneck',
  'Improvement Plan',
  'Report & Next Action',
]

const workshopPhases = [
  ['Wall Session', 'Map as a team'],
  ['Floor Observation', 'Capture real data'],
  ['Analysis', 'Identify opportunities'],
  ['Future State', 'Design & plan'],
]

function stepColor(step: Step, index: number) {
  const type = String((step as any).step_type || '').toLowerCase()
  if (type.includes('quality') || type.includes('inspect')) return stickyPalette[2]
  if (type.includes('material') || type.includes('transport')) return stickyPalette[3]
  if (type.includes('info')) return stickyPalette[5]
  if (step.va_type === 'nva') return stickyPalette[2]
  if (step.is_main_flow === false) return stickyPalette[4]
  return stickyPalette[index % stickyPalette.length]
}

function getWait(step: Step) {
  return Number((step as any).wait_time || 0)
}

function StickyStep({ step, index, selected, onSelect, takt }: {
  step: Step
  index: number
  selected: boolean
  onSelect: (step: Step) => void
  takt: number
}) {
  const color = stepColor(step, index)
  const ct = ctSeconds(step)
  const wt = getWait(step)
  const wip = Number(step.wip || 0)
  const isBottleneck = Boolean((step as any).is_bottleneck) || (takt > 0 && ct > takt * 1.05)
  const va = ct
  const nva = wt
  const title = step.name || `Step ${index + 1}`

  return (
    <button
      type="button"
      onClick={() => onSelect(step)}
      aria-pressed={selected}
      className={`vsm-sticky-step ${selected ? 'is-selected' : ''} ${isBottleneck ? 'is-bottleneck' : ''}`}
      style={{
        ['--sticky-bg' as any]: color.bg,
        ['--sticky-edge' as any]: color.edge,
        ['--sticky-pin' as any]: color.pin,
        ['--sticky-ink' as any]: color.ink,
        ['--sticky-rot' as any]: `${rotations[index % rotations.length]}deg`,
      }}
    >
      <span className="vsm-sticky-pin" />
      <span className="vsm-sticky-fold" />
      {isBottleneck && <span className="vsm-sticky-alert">Constraint</span>}
      <span className="vsm-sticky-title">{index + 1}. {title.length > 18 ? `${title.slice(0, 17)}…` : title}</span>
      {step.department && <span className="vsm-sticky-dept">{step.department}</span>}
      <span className="vsm-sticky-mini-strip">
        <span><b>CT</b>{ct ? fmtS(ct) : '—'}</span>
        <span><b>WT</b>{wt ? fmtS(wt) : '—'}</span>
        <span><b>WIP</b>{wip || '—'}</span>
      </span>
      <span className="vsm-sticky-data-strip" aria-label="Step data strip">
        <span><b>VA</b>{va ? fmtS(va) : '—'}</span>
        <span className={nva > va ? 'hot' : ''}><b>NVA</b>{nva ? fmtS(nva) : '—'}</span>
        <span><b>Ops</b>{step.operators || 1}</span>
      </span>
    </button>
  )
}

function FlowArrow({ wait, wip }: { wait: number; wip: number }) {
  return (
    <div className="vsm-flow-arrow" aria-label="Flow connection">
      <div className="vsm-flow-line"><span /></div>
      {(wip > 0 || wait > 0) && (
        <div className="vsm-flow-data">
          {wip > 0 && <span className="inventory-triangle">{wip}</span>}
          {wait > 0 && <span className="wait-pill">WT {fmtS(wait)}</span>}
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="vsm-metric-card">
      <span>{label}</span>
      <strong style={{ color: color || '#0F172A' }}>{value}</strong>
    </div>
  )
}

export function VSMMap({ steps, branches, project }: Props) {
  const mainSteps = useMemo(
    () => steps.filter(s => s.is_main_flow !== false).sort((a, b) => a.position - b.position),
    [steps]
  )
  const branchSteps = useMemo(
    () => steps.filter(s => s.is_main_flow === false).sort((a, b) => (a.branch_position || 0) - (b.branch_position || 0)),
    [steps]
  )
  const [selectedId, setSelectedId] = useState<string | null>(mainSteps[0]?.id || null)

  const selected = steps.find(s => s.id === selectedId) || mainSteps[0]
  const takt = project.takt_time ? Number(project.takt_time)
    : project.demand && project.available_time_sec ? Number(project.available_time_sec) / Number(project.demand)
    : project.demand && project.working_hours ? (Number(project.working_hours) * 3600) / Number(project.demand)
    : 0
  const { totalCT, totalWait, leadTime, pce, totalWIP } = calcProcessMetrics(steps, project)
  const bottleneck = mainSteps.reduce<Step | null>((current, step) => {
    if (!current) return step
    const score = (ctSeconds(step) || 0) + getWait(step) + (Number(step.wip || 0) * 60)
    const currentScore = (ctSeconds(current) || 0) + getWait(current) + (Number(current.wip || 0) * 60)
    return score > currentScore ? step : current
  }, null)

  if (!mainSteps.length) {
    return (
      <div className="vsm-empty-sticky-state">
        <div className="vsm-empty-card">Add your first step in Builder to generate a sticky-note current-state map.</div>
      </div>
    )
  }

  return (
    <div className="vsm-workspace-shell">
      <style jsx>{`
        .vsm-workspace-shell {
          --vs-blue: #0B63F6;
          --vs-blue-soft: #EAF2FF;
          --vs-ink: #081633;
          --vs-muted: #60708F;
          --vs-line: #E5EAF3;
          --vs-panel: #FFFFFF;
          color: var(--vs-ink);
          font-family: Satoshi, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .vsm-guided-strip, .vsm-phase-strip, .vsm-board-card, .vsm-side-card, .vsm-insight-card, .vsm-metric-card {
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(13, 34, 70, .08);
          box-shadow: 0 18px 45px rgba(20, 40, 80, .08), inset 0 1px 0 rgba(255,255,255,.9);
          border-radius: 20px;
        }
        .vsm-guided-strip { padding: 20px 22px; margin-bottom: 16px; }
        .vsm-strip-title { font-weight: 850; font-size: 14px; margin-bottom: 16px; letter-spacing: -.01em; }
        .vsm-guided-steps { display: grid; grid-template-columns: repeat(8, minmax(86px, 1fr)); gap: 8px; align-items: start; }
        .vsm-guided-step { position: relative; text-align: center; color: var(--vs-muted); font-size: 11px; }
        .vsm-guided-step:not(:last-child)::after { content: ''; position: absolute; left: calc(50% + 22px); top: 15px; width: calc(100% - 36px); height: 1px; background: #C9D2E2; }
        .vsm-guided-dot { display: inline-flex; width: 30px; height: 30px; align-items: center; justify-content: center; border-radius: 999px; background: #F4F7FB; border: 1px solid #DCE5F2; font-weight: 800; color: #53627D; margin-bottom: 8px; box-shadow: inset 0 1px 0 #fff; }
        .vsm-guided-step.is-active .vsm-guided-dot { background: linear-gradient(180deg, #1777FF, #0758DF); color: white; border-color: #0758DF; box-shadow: 0 8px 18px rgba(11,99,246,.25); }
        .vsm-guided-step.is-active { color: var(--vs-blue); font-weight: 800; }
        .vsm-phase-strip { padding: 14px; margin-bottom: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .vsm-phase { border: 1px solid var(--vs-line); border-radius: 15px; padding: 12px 14px; display: flex; gap: 12px; align-items: center; background: #fff; }
        .vsm-phase.is-active { border-color: rgba(11,99,246,.55); background: linear-gradient(180deg, #FFFFFF, #F2F7FF); box-shadow: 0 10px 22px rgba(11,99,246,.10); }
        .vsm-phase-num { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #F3F6FA; font-weight: 850; color: #4C5871; }
        .vsm-phase.is-active .vsm-phase-num { background: var(--vs-blue); color: white; }
        .vsm-phase strong { display: block; font-size: 13px; }
        .vsm-phase span:last-child { font-size: 11px; color: var(--vs-muted); }
        .vsm-layout { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 16px; align-items: start; }
        .vsm-board-card { overflow: hidden; }
        .vsm-board-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #EEF2F7; }
        .vsm-board-head h3 { margin: 0; font-size: 19px; letter-spacing: -.025em; }
        .vsm-board-head p { margin: 4px 0 0; font-size: 12px; color: var(--vs-muted); }
        .vsm-board-tools { display: flex; gap: 8px; flex-wrap: wrap; }
        .vsm-tool-button { border: 1px solid #DFE7F3; background: linear-gradient(180deg,#fff,#F7FAFF); border-radius: 11px; padding: 9px 12px; font-size: 12px; font-weight: 750; color: var(--vs-ink); box-shadow: 0 6px 15px rgba(20,40,80,.06); }
        .vsm-tool-button.primary { background: linear-gradient(180deg,#1678FF,#065BE6); color: white; border-color: #065BE6; }
        .vsm-canvas-board { position: relative; min-height: 440px; padding: 54px 34px 78px; overflow-x: auto; background-color: #FBFAF5; background-image: radial-gradient(circle, rgba(12,30,60,.14) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,.8), rgba(255,255,255,.25)); background-size: 22px 22px, auto; }
        .vsm-flow-row { min-width: max-content; display: flex; align-items: flex-start; gap: 0; }
        .vsm-end-card { flex: 0 0 86px; height: 106px; border: 1px solid #DCE5F2; border-radius: 16px; background: rgba(255,255,255,.86); display: grid; place-items: center; text-align: center; font-weight: 800; font-size: 12px; color: #43516B; box-shadow: 0 10px 24px rgba(20,40,80,.07); }
        .vsm-sticky-step { position: relative; width: 154px; min-height: 190px; flex: 0 0 154px; border: 0; text-align: left; padding: 0; background: transparent; cursor: pointer; transform: rotate(var(--sticky-rot)); transition: transform .18s ease, filter .18s ease; }
        .vsm-sticky-step:hover, .vsm-sticky-step.is-selected { transform: rotate(var(--sticky-rot)) translateY(-6px) scale(1.02); filter: drop-shadow(0 15px 28px rgba(20,40,80,.18)); }
        .vsm-sticky-step::before { content: ''; position: absolute; inset: 0 0 76px; border-radius: 4px 4px 14px 4px; background: var(--sticky-bg); box-shadow: inset 0 1px 0 rgba(255,255,255,.85), inset 0 -1px 0 rgba(0,0,0,.06), 0 4px 0 var(--sticky-edge), 0 14px 28px rgba(42,48,68,.16); border: 1px solid rgba(0,0,0,.05); }
        .vsm-sticky-step::after { content: ''; position: absolute; inset: 0 0 76px; border-radius: 4px 4px 14px 4px; opacity: .45; pointer-events:none; background: linear-gradient(135deg, rgba(255,255,255,.65), rgba(255,255,255,0) 42%, rgba(0,0,0,.05)); }
        .vsm-sticky-step.is-selected::before { outline: 3px solid rgba(11,99,246,.33); }
        .vsm-sticky-step.is-bottleneck::before { outline: 2px solid rgba(225,29,72,.32); }
        .vsm-sticky-pin { position: absolute; top: -12px; left: 50%; width: 17px; height: 17px; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff 0 10%, var(--sticky-pin) 45%, #153E90 100%); box-shadow: 0 3px 0 rgba(0,0,0,.18), 0 8px 12px rgba(0,0,0,.18); z-index: 3; }
        .vsm-sticky-pin::after { content:''; position:absolute; left:50%; top:12px; width:2px; height:14px; transform:translateX(-50%); background: rgba(20,30,50,.24); border-radius:2px; }
        .vsm-sticky-fold { position: absolute; right: 0; bottom: 76px; width: 28px; height: 28px; background: linear-gradient(135deg, rgba(0,0,0,.10), rgba(255,255,255,.55)); clip-path: polygon(100% 0, 0 100%, 100% 100%); z-index:2; opacity:.55; }
        .vsm-sticky-title { position: relative; z-index: 2; display: block; padding: 36px 14px 6px; text-align: center; color: var(--sticky-ink); font-size: 19px; font-family: "Comic Sans MS", "Bradley Hand", "Segoe Print", Satoshi, cursive; font-weight: 650; line-height: 1.12; }
        .vsm-sticky-dept { position: relative; z-index:2; display:block; text-align:center; color: rgba(8,22,51,.58); font-size:10px; font-weight:700; }
        .vsm-sticky-alert { position: absolute; top: 12px; right: 8px; z-index: 4; color:#B42318; background: rgba(255,255,255,.75); border: 1px solid rgba(180,35,24,.18); font-size: 9px; font-weight: 850; border-radius: 999px; padding: 3px 7px; }
        .vsm-sticky-mini-strip { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; margin: 12px 9px 0; }
        .vsm-sticky-mini-strip span { background: rgba(255,255,255,.58); border: 1px solid rgba(0,0,0,.04); border-radius: 8px; padding: 5px 3px; font-size: 10px; color: rgba(8,22,51,.78); text-align:center; box-shadow: inset 0 1px 0 rgba(255,255,255,.75); }
        .vsm-sticky-mini-strip b, .vsm-sticky-data-strip b { display:block; color: rgba(8,22,51,.5); font-size: 8px; letter-spacing:.04em; }
        .vsm-sticky-data-strip { position: absolute; left: 5px; right: 5px; bottom: 0; min-height: 67px; display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; padding: 6px; background: rgba(255,255,255,.88); border: 1px solid #E3E8F1; border-radius: 12px; box-shadow: 0 10px 22px rgba(20,40,80,.10); z-index: 3; }
        .vsm-sticky-data-strip span { display:grid; place-items:center; font-size: 11px; color:#10213C; font-weight:800; border-right: 1px solid #E8EDF5; }
        .vsm-sticky-data-strip span:last-child { border-right:0; }
        .vsm-sticky-data-strip .hot { color: #D92D20; }
        .vsm-flow-arrow { flex: 0 0 82px; height: 190px; position: relative; display:flex; align-items:center; justify-content:center; }
        .vsm-flow-line { position: absolute; top: 56px; left: 4px; right: 4px; height:2px; background:#7B879A; }
        .vsm-flow-line span { position:absolute; right:-1px; top:-5px; width:0; height:0; border-left: 10px solid #7B879A; border-top:6px solid transparent; border-bottom:6px solid transparent; }
        .vsm-flow-data { position:absolute; top: 84px; left:0; right:0; display:grid; justify-items:center; gap:6px; }
        .inventory-triangle { width:34px; height:30px; clip-path: polygon(50% 0, 0 100%, 100% 100%); background:#FFE4A3; border:1px solid #D97706; position:relative; filter: drop-shadow(0 4px 6px rgba(0,0,0,.12)); color:#8A4B00; font-weight:900; font-size: 11px; display:flex; align-items:flex-end; justify-content:center; padding-bottom:3px; box-sizing:border-box; }
        .wait-pill { display:inline-flex; align-items:center; justify-content:center; padding:5px 8px; border-radius:999px; color:#B42318; font-weight:850; font-size:10px; background:#FFF1F0; border:1px solid #FFD0CC; box-shadow:0 5px 12px rgba(180,35,24,.08); }
        .vsm-leadtime-line { min-width: max-content; margin: 34px 96px 0; border-top: 2px solid #9AA6BA; position: relative; height: 34px; text-align:center; color:#2A3954; font-weight:850; font-size:12px; }
        .vsm-leadtime-line span { background:#FBFAF5; padding:0 12px; position: relative; top:-9px; }
        .vsm-branch-lane { margin-top: 28px; padding: 18px; min-width:max-content; border: 1px dashed rgba(124,58,237,.28); border-radius: 18px; background: rgba(124,58,237,.035); }
        .vsm-branch-title { font-size: 11px; color: #6D28D9; font-weight:850; text-transform:uppercase; letter-spacing:.08em; margin-bottom: 18px; }
        .vsm-kpi-row { display:grid; grid-template-columns: repeat(6, minmax(96px,1fr)); gap:10px; margin: 14px 0 16px; }
        .vsm-metric-card { padding: 12px 14px; border-radius: 15px; }
        .vsm-metric-card span { display:block; color: var(--vs-muted); font-size: 10px; font-weight:800; text-transform: uppercase; letter-spacing:.08em; }
        .vsm-metric-card strong { display:block; margin-top:4px; font-size: 20px; letter-spacing:-.03em; }
        .vsm-side { display:grid; gap:14px; }
        .vsm-side-card { padding: 17px; }
        .vsm-side-card h4 { margin:0 0 12px; font-size: 15px; letter-spacing:-.02em; }
        .vsm-side-list { display:grid; gap:10px; }
        .vsm-side-list div { border-bottom:1px solid #EEF2F7; padding-bottom:10px; }
        .vsm-side-list div:last-child { border-bottom:0; padding-bottom:0; }
        .vsm-side-list span { display:block; color:var(--vs-muted); font-size:11px; }
        .vsm-side-list strong { display:block; margin-top:2px; font-size:18px; }
        .vsm-selected-note { border-left: 4px solid var(--vs-blue); }
        .vsm-concept { font-size: 12px; color: #50627F; line-height: 1.55; }
        .vsm-insights { display:grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 14px; }
        .vsm-insight-card { padding: 16px; }
        .vsm-insight-card strong { display:block; font-size:14px; margin-bottom:6px; }
        .vsm-insight-card p { margin:0; font-size:12px; line-height:1.45; color:var(--vs-muted); }
        .vsm-insight-card a { display:inline-block; margin-top:10px; color: var(--vs-blue); font-size:12px; font-weight:850; text-decoration:none; }
        .vsm-empty-sticky-state { padding: 50px; border-radius: 18px; background: #FBFAF5; border:1px dashed #CBD5E1; text-align:center; }
        .vsm-empty-card { display:inline-block; padding: 20px 26px; border-radius: 16px; background:white; box-shadow:0 16px 32px rgba(20,40,80,.08); color:#50627F; }
        @media (max-width: 980px) {
          .vsm-layout { grid-template-columns: 1fr; }
          .vsm-guided-steps { grid-template-columns: repeat(4, minmax(80px,1fr)); row-gap: 16px; }
          .vsm-phase-strip { grid-template-columns: 1fr 1fr; }
          .vsm-kpi-row { grid-template-columns: repeat(2,1fr); }
          .vsm-insights { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vsm-guided-strip">
        <div className="vsm-strip-title">VeSiMy Guided Experience</div>
        <div className="vsm-guided-steps">
          {guidedSteps.map((label, idx) => {
            const active = idx === 2
            return (
              <div className={`vsm-guided-step ${active ? 'is-active' : ''}`} key={label}>
                <span className="vsm-guided-dot">{idx + 1}</span>
                <div>{label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="vsm-phase-strip">
        {workshopPhases.map(([title, subtitle], idx) => (
          <div className={`vsm-phase ${idx === 2 ? 'is-active' : ''}`} key={title}>
            <span className="vsm-phase-num">{idx + 1}</span>
            <span><strong>{title}</strong><span>{subtitle}</span></span>
          </div>
        ))}
      </div>

      <div className="vsm-kpi-row">
        <MetricCard label="Lead Time" value={fmtS(leadTime)} color="#0B63F6" />
        <MetricCard label="Value Added" value={fmtS(totalCT)} color="#059669" />
        <MetricCard label="NVA / Wait" value={fmtS(totalWait)} color="#D92D20" />
        <MetricCard label="Takt Time" value={takt ? fmtS(takt) : '—'} color="#7C3AED" />
        <MetricCard label="PCE" value={fmtPCE(pce)} color={pceColor(pce)} />
        <MetricCard label="Total WIP" value={totalWIP || '—'} color="#B7791F" />
      </div>

      <div className="vsm-layout">
        <div>
          <div className="vsm-board-card">
            <div className="vsm-board-head">
              <div>
                <h3>Interactive Current-State Sticky Map</h3>
                <p>Click a sticky note to inspect the real process data captured for that step.</p>
              </div>
              <div className="vsm-board-tools">
                <button className="vsm-tool-button">Show Flows</button>
                <button className="vsm-tool-button primary">Add Step</button>
              </div>
            </div>
            <div className="vsm-canvas-board">
              <div className="vsm-flow-row">
                <div className="vsm-end-card">Supplier</div>
                <FlowArrow wait={0} wip={0} />
                {mainSteps.map((step, index) => (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <StickyStep
                      step={step}
                      index={index}
                      takt={takt}
                      selected={selected?.id === step.id}
                      onSelect={(s) => setSelectedId(s.id)}
                    />
                    {index < mainSteps.length - 1 && (
                      <FlowArrow wait={getWait(mainSteps[index + 1])} wip={Number(mainSteps[index + 1].wip || 0)} />
                    )}
                  </div>
                ))}
                <FlowArrow wait={0} wip={0} />
                <div className="vsm-end-card">Customer</div>
              </div>

              {branchSteps.length > 0 && (
                <div className="vsm-branch-lane">
                  <div className="vsm-branch-title">Sub-process / branch lane</div>
                  <div className="vsm-flow-row">
                    {branchSteps.map((step, index) => (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <StickyStep step={step} index={index + 3} takt={takt} selected={selected?.id === step.id} onSelect={(s) => setSelectedId(s.id)} />
                        {index < branchSteps.length - 1 && <FlowArrow wait={getWait(branchSteps[index + 1])} wip={Number(branchSteps[index + 1].wip || 0)} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="vsm-leadtime-line"><span>Total Lead Time · {fmtS(leadTime)}</span></div>
            </div>
          </div>

          <div className="vsm-insights">
            <div className="vsm-insight-card" style={{ background: '#FFF5F4', borderColor: '#FFD7D3' }}>
              <strong>Bottleneck detected</strong>
              <p>{bottleneck?.name || 'The selected step'} has the strongest constraint signal based on cycle time, wait time, and WIP.</p>
              <a>Analyze bottleneck →</a>
            </div>
            <div className="vsm-insight-card" style={{ background: '#FFFAEB', borderColor: '#FDE7B0' }}>
              <strong>Wait-time opportunity</strong>
              <p>Focus on the highest wait-time connection before optimizing isolated steps.</p>
              <a>View opportunities →</a>
            </div>
            <div className="vsm-insight-card" style={{ background: '#F2F7FF', borderColor: '#CFE1FF' }}>
              <strong>Improvement potential</strong>
              <p>Use the target state to compare current lead time, WIP, and PCE against the goal.</p>
              <a>Explore plan →</a>
            </div>
          </div>
        </div>

        <aside className="vsm-side">
          <div className="vsm-side-card">
            <h4>Current State Summary</h4>
            <div className="vsm-side-list">
              <div><span>Total Lead Time</span><strong>{fmtS(leadTime)}</strong></div>
              <div><span>Total Value-Added Time</span><strong>{fmtS(totalCT)}</strong></div>
              <div><span>Total Steps</span><strong>{mainSteps.length}</strong></div>
              <div><span>Total WIP</span><strong>{totalWIP || '—'}</strong></div>
            </div>
          </div>

          <div className="vsm-side-card vsm-selected-note">
            <h4>Selected Sticky Note</h4>
            {selected ? (
              <div className="vsm-side-list">
                <div><span>Step</span><strong>{selected.name}</strong></div>
                <div><span>Cycle Time</span><strong>{fmtS(ctSeconds(selected))}</strong></div>
                <div><span>Wait Time</span><strong>{fmtS(getWait(selected))}</strong></div>
                <div><span>WIP</span><strong>{selected.wip || '—'}</strong></div>
              </div>
            ) : <p className="vsm-concept">Select a sticky note to inspect details.</p>}
          </div>

          <div className="vsm-side-card">
            <h4>Concept Guide</h4>
            <p className="vsm-concept"><strong>Value-added time</strong> is work that directly transforms the product or service from the customer’s perspective.</p>
            <p className="vsm-concept"><strong>Wait time</strong> is time spent waiting between steps. In most processes, this is where the biggest improvement opportunity lives.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default VSMMap
