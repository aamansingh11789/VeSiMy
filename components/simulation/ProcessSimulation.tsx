// @ts-nocheck
'use client'
// ── components/simulation/ProcessSimulation.tsx ──────────────────────────────
// Upgraded simulation with:
//  1. Stress Scenarios (Leanstorming-inspired) — demand spike, labor shock, etc.
//  2. Dynamic pressure states per step — STABLE / STRESSED / BOTTLENECK
//  3. Queue depth cards with utilization bars
//  4. Recovery time estimation
//  5. Mitigation priority matrix (benefit vs effort)
//  6. Highest-leverage AI response list
//  7. Original manual adjust / compare views preserved

import { useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import type { Step } from '@/lib/store'
import { AlertIcon, ZapIcon, ActivityIcon, BarChartIcon, RefreshIcon } from '@/components/ui/Icons'

interface Props { steps: Step[]; projectId: string; isPaid?: boolean }

const fmt = (s: number) => !s ? '0s' : s < 60 ? `${Math.round(s)}s` : `${(s/60).toFixed(1)}m`
const fmtPct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`

// ── Pressure state logic ─────────────────────────────────────────────────────
function getPressureState(util: number): 'stable' | 'stressed' | 'bottleneck' {
  if (util >= 95) return 'bottleneck'
  if (util >= 75) return 'stressed'
  return 'stable'
}

const PRESSURE_COLOR = { stable: '#2E844A', stressed: '#C49B2E', bottleneck: '#C0402A' }
const PRESSURE_BG    = { stable: 'rgba(46,132,74,0.08)', stressed: 'rgba(196,155,46,0.08)', bottleneck: 'rgba(192,64,42,0.08)' }
const PRESSURE_LABEL = { stable: 'STABLE', stressed: 'STRESSED', bottleneck: 'BOTTLENECK' }

// ── Scenario presets ──────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 'demand_spike',
    label: 'Demand Spike',
    icon: '↑',
    desc: 'Order volume +25%, same capacity',
    demandMult: 1.25,
    laborMult: 1.0,
    ctMult: 1.18,
    waitMult: 1.35,
    failureDynamic: 'Queue climbs rapidly at the bottleneck. Downstream steps starve as upstream steps seize.',
    mitigation: 'Cap release volume into the bottleneck window. Redeploy labor to the active constraint.',
  },
  {
    id: 'labor_shortage',
    label: 'Labor Shortage',
    icon: '↓',
    desc: 'Labor capacity -20%, same demand',
    demandMult: 1.0,
    laborMult: 0.80,
    ctMult: 1.28,
    waitMult: 1.45,
    failureDynamic: 'Cycle times inflate across all steps. Recovery time collapses as buffer is consumed.',
    mitigation: 'Redeploy to highest-utilization steps. Delay low-value changeovers for 2 cycles.',
  },
  {
    id: 'supplier_delay',
    label: 'Supplier Delay',
    icon: '⏳',
    desc: 'Critical lead time slips +2 weeks',
    demandMult: 1.0,
    laborMult: 1.0,
    ctMult: 1.0,
    waitMult: 2.1,
    failureDynamic: 'Wait times cascade. WIP builds at receiving steps. Downstream queues grow unchecked.',
    mitigation: 'Activate buffer stock policy. Prioritize staged release logic to protect throughput.',
  },
  {
    id: 'quality_failure',
    label: 'Quality Failure',
    icon: '✗',
    desc: 'Defect rate spikes to 8%+ at key steps',
    demandMult: 1.0,
    laborMult: 1.0,
    ctMult: 1.35,
    waitMult: 1.2,
    failureDynamic: 'Rework loops amplify CT at affected steps. Inspection becomes the new bottleneck.',
    mitigation: 'Implement poka-yoke at defect source. Run emergency 5 Why. Quarantine suspect batches.',
  },
  {
    id: 'equipment_down',
    label: 'Equipment Down',
    icon: '⚠',
    desc: 'Key station uptime drops to 60%',
    demandMult: 1.0,
    laborMult: 1.0,
    ctMult: 1.65,
    waitMult: 1.5,
    failureDynamic: 'Affected step becomes hard bottleneck. Queue builds 3x faster than normal recovery rate.',
    mitigation: 'Activate contingency routing. Emergency TPM. Redeploy operators to manual backup procedure.',
  },
  {
    id: 'shift_friction',
    label: 'Shift Handoff',
    icon: '↔',
    desc: 'Handoff cycle-time volatility increases 40%',
    demandMult: 1.0,
    laborMult: 1.0,
    ctMult: 1.12,
    waitMult: 1.4,
    failureDynamic: 'Cycle-time volatility at handoff points triggers rework loops at next shift boundary.',
    mitigation: 'Prioritize handoff standards and control-point ownership. Low effort, high resilience gain.',
  },
]

// ── Queue risk formula (Little's Law derived) ─────────────────────────────────
function calcQueueRisk(ct: number, waitTime: number, takt: number): number {
  if (!ct || !takt) return 0
  const utilization = ct / takt
  const variability = waitTime > 0 ? Math.min(waitTime / ct, 1) : 0
  return Math.min(Math.round((utilization * 0.7 + variability * 0.3) * 100) / 100, 1.0)
}

// ── Recovery time estimate ────────────────────────────────────────────────────
function calcRecoveryMin(queueRisk: number, totalWIP: number, avgCT: number): number {
  if (!avgCT) return 0
  const backlogUnits = Math.round(totalWIP * queueRisk)
  return Math.round((backlogUnits * avgCT) / 60)
}

export function ProcessSimulation({ steps, projectId, isPaid = false }: Props) {
  const main = steps.filter(s => s.is_main_flow !== false)

  // Tabs
  const [activeTab, setActiveTab] = useState<'stress' | 'adjust' | 'compare'>('stress')

  // Stress scenario state
  const [activeScenario, setActiveScenario] = useState<string | null>(null)

  // Manual adjust state
  const [adj, setAdj] = useState<Record<string, { fCT: number; fWait: number }>>({})
  const [saving, setSaving] = useState(false)

  function getA(s: Step) {
    return adj[s.id] || {
      fCT: s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0,
      fWait: Number(s.wait_time) || 0,
    }
  }
  function setA(s: Step, k: 'fCT' | 'fWait', v: number) {
    setAdj(p => ({ ...p, [s.id]: { ...getA(s), [k]: v } }))
  }

  // Base metrics
  const takt = useMemo(() => {
    const totalCT = main.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0)
    return totalCT > 0 ? totalCT / main.length : 60
  }, [main])

  const curLT  = useMemo(() => main.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0) + (Number(s.wait_time) || 0), 0), [main])
  const curPCE = useMemo(() => curLT > 0 ? (main.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0) / curLT * 100) : 0, [main, curLT])

  // Scenario computed metrics
  const scenario = useMemo(() => SCENARIOS.find(s => s.id === activeScenario), [activeScenario])

  const scenarioSteps = useMemo(() => {
    if (!scenario) return main
    return main.map(s => {
      const ct   = (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0) * scenario.ctMult
      const wait = (Number(s.wait_time) || 0) * scenario.waitMult
      return { ...s, _scenCT: ct, _scenWait: wait }
    })
  }, [main, scenario])

  const scenLT       = useMemo(() => scenarioSteps.reduce((a, s) => a + (s._scenCT || 0) + (s._scenWait || 0), 0), [scenarioSteps])
  const scenPCE      = useMemo(() => scenLT > 0 ? (scenarioSteps.reduce((a, s) => a + (s._scenCT || 0), 0) / scenLT * 100) : 0, [scenarioSteps, scenLT])
  const throughputImpact = useMemo(() => curLT > 0 ? ((scenLT - curLT) / curLT * 100) : 0, [curLT, scenLT])

  const totalWIP     = useMemo(() => main.reduce((a, s) => a + (Number(s.wip) || 0), 0), [main])
  const avgCT        = useMemo(() => main.length > 0 ? main.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0) / main.length : 0, [main])

  const worstQueueRisk = useMemo(() => {
    if (!scenario) return 0
    return Math.max(...scenarioSteps.map(s => calcQueueRisk(s._scenCT || 0, s._scenWait || 0, takt)))
  }, [scenarioSteps, takt, scenario])

  const recoveryMin = useMemo(() => calcRecoveryMin(worstQueueRisk, totalWIP || 10, avgCT * (scenario?.ctMult || 1)), [worstQueueRisk, totalWIP, avgCT, scenario])

  // Manual sim metrics
  const futLT  = useMemo(() => main.reduce((a, s) => { const a_ = getA(s); return a + a_.fCT + a_.fWait }, 0), [main, adj])
  const futPCE = useMemo(() => futLT > 0 ? (main.reduce((a, s) => a + getA(s).fCT, 0) / futLT * 100) : 0, [main, adj, futLT])
  const saved  = curLT - futLT

  async function save() {
    setSaving(true)
    const { error } = await createClient().from('process_simulations').insert({
      project_id: projectId, name: activeScenario ? `Stress: ${scenario?.label}` : 'Future State',
      simulation_steps: Object.entries(adj).map(([id, a]) => ({ step_id: id, ct: a.fCT, wait: a.fWait })),
      current_lead_time: curLT, future_lead_time: futLT, lead_time_savings: saved,
    })
    if (error) toast.error('Save failed')
    else toast.success('Simulation saved!')
    setSaving(false)
  }

  const tabs = [
    { id: 'stress',  label: 'Stress Scenarios' },
    { id: 'adjust',  label: 'Manual Adjust' },
    { id: 'compare', label: 'Compare' },
  ] as const

  return (
    <div>
      {/* ── Summary metrics ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginBottom: 16 }}>
        {[
          ['Current LT',  fmt(curLT),                        'var(--text2)'],
          ['Current PCE', `${curPCE.toFixed(1)}%`,           'var(--brand)'],
          ['Steps',       String(main.length),                'var(--text2)'],
          ['Avg Takt',    fmt(takt),                          'var(--text3)'],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1.5, fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid',
            background: activeTab === t.id ? 'var(--brand-dim)' : 'transparent',
            borderColor: activeTab === t.id ? 'var(--brand-glow)' : 'var(--border2)',
            color: activeTab === t.id ? 'var(--brand)' : 'var(--text2)',
            fontSize: 12, fontWeight: activeTab === t.id ? 700 : 400, cursor: 'pointer',
          }}>{t.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={save} disabled={saving} className="btn-primary" style={{ fontSize: 11 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* STRESS SCENARIOS TAB                                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'stress' && (
        <div>
          {/* Scenario buttons */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10, fontWeight: 600 }}>
              SELECT DISRUPTION SCENARIO
            </div>
            <div className="sim-scenario-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {SCENARIOS.map(sc => (
                <button key={sc.id} onClick={() => setActiveScenario(activeScenario === sc.id ? null : sc.id)} style={{
                  padding: '10px 12px', borderRadius: 8,
                  border: `2px solid ${activeScenario === sc.id ? 'var(--brand)' : 'var(--border)'}`,
                  background: activeScenario === sc.id ? 'var(--brand-dim)' : 'var(--bg3)',
                  color: activeScenario === sc.id ? 'var(--brand)' : 'var(--text2)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{sc.label}</div>
                  <div style={{ fontSize: 10, color: activeScenario === sc.id ? 'var(--brand)' : 'var(--text3)', lineHeight: 1.3 }}>{sc.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* No scenario selected */}
          {!activeScenario && (
            <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <ActivityIcon size={28} color="var(--text3)" />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginTop: 10, marginBottom: 4 }}>Select a scenario above</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Stress-test your process before the disruption hits. See where queues build and which steps fail first.</div>
            </div>
          )}

          {/* Scenario active — results */}
          {activeScenario && scenario && (
            <div>
              {/* Scenario output metrics */}
              <div className="sim-output-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  ['Throughput Impact', `${fmtPct(throughputImpact)}`, throughputImpact > 0 ? '#C0402A' : '#2E844A'],
                  ['Queue Risk',        `${worstQueueRisk.toFixed(2)}`, worstQueueRisk > 0.75 ? '#C0402A' : worstQueueRisk > 0.5 ? '#C49B2E' : '#2E844A'],
                  ['Recovery Time',     `${recoveryMin} min`,          recoveryMin > 30 ? '#C0402A' : '#C49B2E'],
                  ['PCE Impact',        `${curPCE.toFixed(1)}% → ${scenPCE.toFixed(1)}%`, '#C0402A'],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ background: 'var(--bg3)', border: `1px solid ${c}33`, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1.2, fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Step pressure map */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1.5, fontFamily: 'var(--font-mono)', marginBottom: 10, fontWeight: 700 }}>
                  PRESSURE MAP — {scenario.label.toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {scenarioSteps.map((s: any) => {
                    const ct   = s._scenCT || 0
                    const wait = s._scenWait || 0
                    const util = takt > 0 ? Math.min((ct / takt) * 100, 100) : 0
                    const queueDepth = Math.round((wait / (ct || 1)) * (Number(s.wip) || 3))
                    const state = getPressureState(util)
                    const color = PRESSURE_COLOR[state]
                    const bg    = PRESSURE_BG[state]
                    return (
                      <div key={s.id} style={{ background: bg, border: `2px solid ${color}44`, borderRadius: 9, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{s.name}</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <span style={{ fontSize: 9, color: 'var(--text3)' }}>CT: {fmt(ct)}</span>
                              <span style={{ fontSize: 9, color: 'var(--text3)' }}>WT: {fmt(wait)}</span>
                              <span style={{ fontSize: 9, color: 'var(--text3)' }}>Queue: ~{queueDepth}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: 1, padding: '2px 8px', borderRadius: 4, background: `${color}15`, border: `1px solid ${color}33` }}>
                              {PRESSURE_LABEL[state]}
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 800, color, marginTop: 4 }}>{util.toFixed(0)}%</div>
                          </div>
                        </div>
                        <div style={{ height: 5, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${util}%`, background: color, borderRadius: 3, transition: 'width 0.3s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Failure dynamics + mitigation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'rgba(192,64,42,0.06)', border: '1px solid rgba(192,64,42,0.2)', borderRadius: 9, padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#C0402A', letterSpacing: 1, marginBottom: 6 }}>FAILURE DYNAMICS</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{scenario.failureDynamic}</div>
                </div>
                <div style={{ background: 'rgba(46,132,74,0.06)', border: '1px solid rgba(46,132,74,0.2)', borderRadius: 9, padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#2E844A', letterSpacing: 1, marginBottom: 6 }}>MITIGATION PRIORITY</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{scenario.mitigation}</div>
                </div>
              </div>

              {/* Mitigation priority matrix */}
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: 1.5, fontFamily: 'var(--font-mono)', marginBottom: 12 }}>BENEFIT VS EFFORT — PRIORITY MATRIX</div>
                <div className="sim-matrix-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, height: 160 }}>
                  {[
                    { label: 'DO NOW', sub: 'High benefit · Low effort', color: '#2E844A', items: ['Address bottleneck CT', 'Redeploy labor'] },
                    { label: 'PLAN NEXT', sub: 'High benefit · High effort', color: '#0176D3', items: ['Buffer policy reset', 'Release sequencing'] },
                    { label: 'WATCH', sub: 'Low benefit · Low effort', color: '#C49B2E', items: ['Monitor signals', 'Log cycle variance'] },
                    { label: 'DEFER', sub: 'Low benefit · High effort', color: '#706E6B', items: ['Automation capex', 'Layout redesign'] },
                  ].map(q => (
                    <div key={q.label} style={{ background: `${q.color}08`, border: `1px solid ${q.color}22`, borderRadius: 7, padding: '8px 10px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: q.color, letterSpacing: 1, marginBottom: 2 }}>{q.label}</div>
                      <div style={{ fontSize: 8, color: 'var(--text3)', marginBottom: 5 }}>{q.sub}</div>
                      {q.items.map(i => (
                        <div key={i} style={{ fontSize: 9, color: 'var(--text2)', display: 'flex', gap: 4, marginBottom: 2 }}>
                          <span style={{ color: q.color }}>·</span>{i}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highest-leverage responses */}
              <div style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-glow)', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <ZapIcon size={12} color="var(--brand)" />
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', letterSpacing: 1 }}>HIGHEST-LEVERAGE RESPONSES</div>
                </div>
                {[
                  `Cap release volume into the bottleneck window during ${scenario.label.toLowerCase()} event`,
                  'Redeploy labor to the active constraint — priority over scheduled tasks',
                  'Delay low-value changeovers for 2+ cycles until queue clears',
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', width: 16, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.4 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MANUAL ADJUST TAB                                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'adjust' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginBottom: 16 }}>
            {[
              ['Future LT',   fmt(futLT),                  '#2E844A'],
              ['Time Saved',  saved > 0 ? fmt(saved) : '—','var(--brand)'],
              ['PCE',         `${curPCE.toFixed(1)}% → ${futPCE.toFixed(1)}%`, 'var(--brand)'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1.5, fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '6px 14px', background: 'rgba(244,166,35,0.08)', border: '1px solid rgba(244,166,35,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 12, color: '#F4A623' }}>
            <AlertIcon size={13} color="#F4A623" /> Adjust individual step times to model future state improvements manually.
          </div>
          <button onClick={() => setAdj({})} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border2)', background: 'transparent', cursor: 'pointer', color: 'var(--text3)', fontSize: 11, marginBottom: 12 }}>
            <RefreshIcon size={10} /> Reset all
          </button>
          {main.map(s => {
            const a = getA(s)
            const origCT = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
            const origW  = Number(s.wait_time) || 0
            const util   = takt > 0 ? Math.min((origCT / takt) * 100, 100) : 0
            const state  = getPressureState(util)
            return (
              <div key={s.id} style={{ background: PRESSURE_BG[state], border: `1px solid ${PRESSURE_COLOR[state]}33`, borderRadius: 9, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{s.name}</div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: PRESSURE_COLOR[state], padding: '2px 7px', borderRadius: 4, background: `${PRESSURE_COLOR[state]}12`, border: `1px solid ${PRESSURE_COLOR[state]}33` }}>
                    {PRESSURE_LABEL[state]}
                  </span>
                </div>
                {([['Cycle Time (s)', 'fCT' as const, origCT], ['Wait Time (s)', 'fWait' as const, origW]] as any[]).map(([label, key, orig]) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: 'var(--text3)' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: a[key] < orig ? '#2E844A' : a[key] > orig ? '#C0402A' : 'var(--text2)' }}>
                        {a[key]}s {orig > 0 && a[key] !== orig && `(was ${orig}s)`}
                      </span>
                    </div>
                    <input type="range" min={0} max={Math.max(orig * 2, 300)} value={a[key]}
                      onChange={e => setA(s, key, Number(e.target.value))}
                      style={{ width: '100%', accentColor: a[key] < orig ? '#2E844A' : 'var(--brand)' }} />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* COMPARE TAB                                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'compare' && (
        <div className="sim-compare-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Step', 'State', 'Cur CT', 'Fut CT', 'Cur Wait', 'Fut Wait', 'Utilization', 'Δ LT'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1, borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {main.map(s => {
                const a    = getA(s)
                const oCT  = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
                const oW   = Number(s.wait_time) || 0
                const dLT  = (a.fCT + a.fWait) - (oCT + oW)
                const util = takt > 0 ? Math.min((oCT / takt) * 100, 100) : 0
                const state = getPressureState(util)
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 10px', color: 'var(--text)', fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: PRESSURE_COLOR[state], padding: '1px 6px', borderRadius: 3, background: `${PRESSURE_COLOR[state]}12` }}>
                        {PRESSURE_LABEL[state]}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--text2)' }}>{oCT ? fmt(oCT) : '—'}</td>
                    <td style={{ padding: '8px 10px', color: a.fCT < oCT ? '#2E844A' : 'var(--text2)' }}>{fmt(a.fCT)}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--text2)' }}>{oW ? fmt(oW) : '—'}</td>
                    <td style={{ padding: '8px 10px', color: a.fWait < oW ? '#2E844A' : 'var(--text2)' }}>{fmt(a.fWait)}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ width: 60, height: 4, background: 'var(--bg4)', borderRadius: 2 }}>
                        <div style={{ width: `${util}%`, height: '100%', background: PRESSURE_COLOR[state], borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 9, color: PRESSURE_COLOR[state], marginTop: 2 }}>{util.toFixed(0)}%</div>
                    </td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: dLT < 0 ? '#2E844A' : dLT > 0 ? '#C0402A' : 'var(--text3)' }}>
                      {dLT !== 0 ? `${dLT < 0 ? '' : '+'}${fmt(Math.abs(dLT))}` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
