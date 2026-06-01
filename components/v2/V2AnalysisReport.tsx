// TypeScript enabled
'use client'
// ── components/v2/V2AnalysisReport.tsx ────────────────────────────────────────
// v4.0, Full 8-section AI Improvement Report
// Spec: VeSiMy v4 Section 8
// All charts are pure SVG/CSS, no external libraries required.

import React, { useState, useCallback, useRef } from 'react'
import { AlertIcon, ZapIcon } from '@/components/ui/Icons'
import { SERIF, BRAND, RED, GREEN, AMBER } from './v2-constants'
import Link from 'next/link'

// ── Design tokens ─────────────────────────────────────────────────────────────
const MONO = '"JetBrains Mono","IBM Plex Mono",monospace'
const TOOL_LABELS: Record<string, string> = {
  stopwatch: 'Time Study', fivewhy: '5 Whys', ishikawa: 'Fishbone / Ishikawa',
  waste: 'Waste ID', kaizen: 'Kaizen Event', smed: 'SMED',
  pdca: 'PDCA Cycle', ooda: 'OODA Loop', eightd: '8D Report', dmaic: 'DMAIC',
}
const WASTE_LABELS: Record<string, string> = {
  transportation: '🚛 Transportation', inventory: '📦 Inventory',
  motion: '🚶 Motion', waiting: '⏳ Waiting', overproduction: '⚡ Overproduction',
  overprocessing: '⚙️ Overprocessing', defects: '❌ Defects', skills: '🧠 Unused Skills',
}
const PRIORITY_COLORS: Record<string, string> = {
  immediate: RED, short_term: AMBER, medium_term: BRAND,
}
const VA_COLORS: Record<string, string> = {
  va: GREEN, nnva: AMBER, nva: RED, unknown: '#9CA3AF',
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ num, label, icon }: { num: string; label: string; icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color: BRAND, background: 'rgba(1,118,211,0.1)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 6, padding: '4px 8px', flexShrink: 0 }}>
        {num}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: SERIF }}>{icon} {label}</div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '36px 0' }} />
}

// ── Waterfall chart, VA time vs wait time breakdown ─────────────────────────
function WaterfallChart({ totalCT, totalWait, vaCT, steps }: { totalCT: number; totalWait: number; vaCT: number; steps: any[] }) {
  const total = totalCT + totalWait
  if (!total) return <div style={{ color: 'var(--text3)', fontSize: 13, padding: '20px 0' }}>No time data available</div>

  const nvaCT  = totalCT - vaCT
  const barW   = 480
  const barH   = 32

  const segments = [
    { label: 'Value-Added work', value: vaCT,     color: GREEN,  pct: (vaCT / total) * 100 },
    { label: 'Non-VA work',      value: nvaCT,    color: AMBER,  pct: (nvaCT / total) * 100 },
    { label: 'Wait / queue',     value: totalWait, color: '#E5E7EB', pct: (totalWait / total) * 100 },
  ].filter(s => s.value > 0)

  let x = 0
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${barW} ${barH + 40}`} style={{ display: 'block', maxWidth: '100%' }}>
        {segments.map((s, i) => {
          const w = (s.pct / 100) * barW
          const el = (
            <g key={i}>
              <rect x={x} y={0} width={w} height={barH} fill={s.color} rx={i === 0 ? 4 : i === segments.length - 1 ? 4 : 0} />
              {w > 40 && (
                <text x={x + w / 2} y={barH / 2 + 5} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={s.color === '#E5E7EB' ? '#6B7280' : 'white'} fontFamily={MONO}>
                  {s.pct.toFixed(0)}%
                </text>
              )}
            </g>
          )
          x += w
          return el
        })}
        {/* Labels below */}
        {segments.map((s, i) => {
          const xx = segments.slice(0, i).reduce((a, seg) => a + (seg.pct / 100) * barW, 0) + ((s.pct / 100) * barW / 2)
          return (
            <text key={`lbl-${i}`} x={xx} y={barH + 16} textAnchor="middle" fontSize={9} fill="var(--text3)" fontFamily={MONO}>
              {s.label}
            </text>
          )
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>{s.label}: <strong style={{ color: 'var(--text)', fontFamily: MONO }}>{fmtSec(s.value)}</strong></span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Takt comparison chart ─────────────────────────────────────────────────────
function TaktChart({ steps, taktTime }: { steps: any[]; taktTime: number }) {
  if (!steps.length) return null
  const maxCT  = Math.max(...steps.map(s => s.ct || 0), taktTime * 1.2, 1)
  const barW   = 32
  const GAP    = 8
  const H      = 120
  const W      = steps.length * (barW + GAP) + 40

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={W} height={H + 36} style={{ display: 'block' }}>
        {/* Takt line */}
        {taktTime > 0 && (() => {
          const ty = H - (taktTime / maxCT) * H
          return (
            <>
              <line x1={0} y1={ty} x2={W} y2={ty} stroke={RED} strokeWidth={1.5} strokeDasharray="6 3" />
              <text x={W - 4} y={ty - 4} textAnchor="end" fontSize={8} fill={RED} fontFamily={MONO}>Takt</text>
            </>
          )
        })()}
        {steps.map((s, i) => {
          const ct    = s.ct || 0
          const barH  = ct > 0 ? (ct / maxCT) * H : 4
          const x     = 20 + i * (barW + GAP)
          const y     = H - barH
          const over  = taktTime > 0 && ct > taktTime
          const color = s.va === 'va' ? BRAND : s.va === 'nva' ? RED : AMBER
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH}
                fill={over ? RED : color} opacity={over ? 1 : 0.7} rx={3} />
              {ct > 0 && barH > 14 && (
                <text x={x + barW / 2} y={y + 10} textAnchor="middle" fontSize={7}
                  fill="white" fontFamily={MONO} fontWeight={700}>
                  {fmtSec(ct)}
                </text>
              )}
              <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize={8}
                fill="var(--text3)" fontFamily={MONO}>
                {s.name.length > 5 ? s.name.slice(0, 5) + '…' : s.name}
              </text>
              {over && (
                <text x={x + barW / 2} y={H + 26} textAnchor="middle" fontSize={7}
                  fill={RED} fontFamily={MONO}>▲</text>
              )}
            </g>
          )
        })}
      </svg>
      {taktTime > 0 && (
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
          <span style={{ color: RED }}>▲ Red bars</span> exceed takt time ({fmtSec(taktTime)}), these steps cannot meet demand rate.
        </div>
      )}
    </div>
  )
}

// ── WIP heatmap ───────────────────────────────────────────────────────────────
function WIPHeatmap({ steps }: { steps: any[] }) {
  if (!steps.length) return null
  const maxWIP = Math.max(...steps.map(s => s.wip || 0), 1)
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {steps.map((s, i) => {
        const wip       = s.wip || 0
        const intensity = wip / maxWIP
        const bg = intensity > 0.7 ? RED : intensity > 0.4 ? AMBER : intensity > 0.1 ? '#FCD34D' : '#E5E7EB'
        return (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 6, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, border: `1px solid ${bg === '#E5E7EB' ? '#D1D5DB' : bg}` }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: MONO, color: intensity > 0.4 ? 'white' : '#374151' }}>{wip}</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: MONO, maxWidth: 52, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.name.slice(0, 6)}
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginTop: 8 }}>
        {[{ label: 'Low', color: '#E5E7EB' }, { label: 'Medium', color: '#FCD34D' }, { label: 'High', color: AMBER }, { label: 'Critical', color: RED }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Defect rate bar chart ──────────────────────────────────────────────────────
function DefectChart({ steps }: { steps: any[] }) {
  const withDefects = steps.filter(s => s.rate > 0)
  if (!withDefects.length) return <div style={{ fontSize: 13, color: 'var(--text3)', padding: '12px 0' }}>No defect rate data entered</div>
  const maxRate = Math.max(...withDefects.map(s => s.rate), 5)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {withDefects.sort((a, b) => b.rate - a.rate).map((s, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>{s.name}</span>
            <span style={{ fontSize: 13, fontFamily: MONO, fontWeight: 700, color: s.rate > 5 ? RED : s.rate > 3 ? AMBER : GREEN }}>{s.rate}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(s.rate / maxRate) * 100}%`, background: s.rate > 5 ? RED : s.rate > 3 ? AMBER : GREEN, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Pareto chart for NVA waste ─────────────────────────────────────────────────
function ParetoChart({ wasteTypes }: { wasteTypes: any[] }) {
  if (!wasteTypes.length) return <div style={{ fontSize: 13, color: 'var(--text3)', padding: '12px 0' }}>No NVA classification data</div>
  const maxCount = Math.max(...wasteTypes.map(w => w.count), 1)
  const total    = Math.max(wasteTypes.reduce((a, w) => a + w.count, 0), 1)
  let cumPct     = 0
  return (
    <div>
      {wasteTypes.slice(0, 6).map((w, i) => {
        const barPct = (w.count / maxCount) * 100
        cumPct += (w.count / total) * 100
        return (
          <div key={w.type} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{WASTE_LABELS[w.type] || w.type}</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)' }}>{w.count} occurrences</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: cumPct <= 80 ? RED : 'var(--text3)' }}>cum {Math.round(cumPct)}%</span>
              </div>
            </div>
            <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${barPct}%`, background: i < 3 ? RED : AMBER, borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        )
      })}
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, fontStyle: 'italic' }}>
        Top {wasteTypes.slice(0, 2).map(w => WASTE_LABELS[w.type]?.split(' ')[1] || w.type).join(' + ')} account for the most NVA occurrences, address these first.
      </div>
    </div>
  )
}

// ── Priority matrix (2×2 interactive) ────────────────────────────────────────
function PriorityMatrix({ items: initialItems }: { items: any[] }) {
  const [items, setItems] = useState(initialItems)
  const [selected, setSelected] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const MATRIX_SIZE = 260
  const PAD = 24

  function handleSVGClick(e: React.MouseEvent<SVGSVGElement>) {
    if (selected === null) return
    const svg  = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const xRel = (e.clientX - rect.left - PAD) / (MATRIX_SIZE - PAD * 2)
    const yRel = 1 - (e.clientY - rect.top - PAD) / (MATRIX_SIZE - PAD * 2)
    const impact = Math.max(1, Math.min(10, Math.round(yRel * 10)))
    const effort = Math.max(1, Math.min(10, Math.round(xRel * 10)))
    setItems(prev => prev.map((item, idx) => idx === selected ? { ...item, impact, effort } : item))
    setSelected(null)
  }

  const quadrant = (impact: number, effort: number) => {
    if (impact >= 6 && effort <= 5) return 'quick-win'
    if (impact >= 6 && effort > 5)  return 'major'
    if (impact < 6  && effort <= 5) return 'easy'
    return 'hard'
  }

  const QColors: Record<string, string> = {
    'quick-win': GREEN, major: BRAND, easy: AMBER, hard: '#9CA3AF',
  }

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg ref={svgRef} width={MATRIX_SIZE} height={MATRIX_SIZE} onClick={handleSVGClick} style={{ display: 'block', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg2)', cursor: selected !== null ? 'crosshair' : 'default' }}>
          {/* Quadrant backgrounds */}
          <rect x={PAD} y={PAD} width={(MATRIX_SIZE - PAD * 2) / 2} height={(MATRIX_SIZE - PAD * 2) / 2} fill={`${GREEN}10`} />
          <rect x={MATRIX_SIZE / 2} y={PAD} width={(MATRIX_SIZE - PAD * 2) / 2} height={(MATRIX_SIZE - PAD * 2) / 2} fill={`${BRAND}08`} />
          <rect x={PAD} y={MATRIX_SIZE / 2} width={(MATRIX_SIZE - PAD * 2) / 2} height={(MATRIX_SIZE - PAD * 2) / 2} fill={`${AMBER}08`} />
          <rect x={MATRIX_SIZE / 2} y={MATRIX_SIZE / 2} width={(MATRIX_SIZE - PAD * 2) / 2} height={(MATRIX_SIZE - PAD * 2) / 2} fill="rgba(156,163,175,0.06)" />
          {/* Axes */}
          <line x1={MATRIX_SIZE / 2} y1={PAD} x2={MATRIX_SIZE / 2} y2={MATRIX_SIZE - PAD} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 2" />
          <line x1={PAD} y1={MATRIX_SIZE / 2} x2={MATRIX_SIZE - PAD} y2={MATRIX_SIZE / 2} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 2" />
          {/* Quadrant labels */}
          {[
            { label: 'Quick Wins', x: PAD + 6, y: PAD + 14, color: GREEN },
            { label: 'Major Projects', x: MATRIX_SIZE / 2 + 6, y: PAD + 14, color: BRAND },
            { label: 'Easy Fills', x: PAD + 6, y: MATRIX_SIZE / 2 + 14, color: AMBER },
            { label: 'Avoid', x: MATRIX_SIZE / 2 + 6, y: MATRIX_SIZE / 2 + 14, color: '#9CA3AF' },
          ].map(q => (
            <text key={q.label} x={q.x} y={q.y} fontSize={8} fill={q.color} fontFamily={MONO} fontWeight={700} opacity={0.7}>{q.label}</text>
          ))}
          {/* Axis labels */}
          <text x={MATRIX_SIZE / 2} y={MATRIX_SIZE - 4} textAnchor="middle" fontSize={8} fill="var(--text3)" fontFamily={MONO}>← LOW EFFORT, HIGH EFFORT →</text>
          <text x={8} y={MATRIX_SIZE / 2} textAnchor="middle" fontSize={8} fill="var(--text3)" fontFamily={MONO} transform={`rotate(-90, 8, ${MATRIX_SIZE / 2})`}>IMPACT ↑</text>
          {/* Data points */}
          {items.map((item, i) => {
            const cx = PAD + ((item.effort - 1) / 9) * (MATRIX_SIZE - PAD * 2)
            const cy = MATRIX_SIZE - PAD - ((item.impact - 1) / 9) * (MATRIX_SIZE - PAD * 2)
            const q  = quadrant(item.impact, item.effort)
            return (
              <g key={i} onClick={e => { e.stopPropagation(); setSelected(s => s === i ? null : i) }}>
                <circle cx={cx} cy={cy} r={selected === i ? 13 : 10} fill={QColors[q]} opacity={selected === i ? 1 : 0.85} stroke={selected === i ? "white" : "none"} strokeWidth={2}
                  onMouseEnter={() => setTooltip(i)} onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: 'pointer' }} />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="white">{i + 1}</text>
                {tooltip === i && (
                  <foreignObject x={cx + 12} y={cy - 20} width={110} height={50}>
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 10, color: 'var(--text)', lineHeight: 1.4 }}>
                      {item.action}<br /><span style={{ color: 'var(--text3)' }}>Impact: {item.impact} · Effort: {item.effort}</span>
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
        <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 4, textAlign: 'center' }}>{selected !== null ? "Now click anywhere on the matrix to move it" : "Click a dot to select it, then click to reposition"}</div>
      </div>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--text3)', marginBottom: 8 }}>LEGEND</div>
        {items.map((item, i) => {
          const q = quadrant(item.impact, item.effort)
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: QColors[q], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{item.action}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{item.step_name} · {TOOL_LABELS[item.tool] || item.tool}</div>
              </div>
            </div>
          )
        })}
        <div style={{ marginTop: 12, padding: '8px 10px', background: `${GREEN}10`, border: `1px solid ${GREEN}30`, borderRadius: 6 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: GREEN, fontWeight: 700, marginBottom: 2 }}>QUICK WINS FIRST</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>High impact, low effort items in the top-left quadrant. Address these before major projects.</div>
        </div>
      </div>
    </div>
  )
}

// ── Lead time projection chart ─────────────────────────────────────────────────
function ProjectionChart({ projection }: { projection: any }) {
  if (!projection) return null
  const { current, conservative, realistic, optimistic } = projection
  const maxLT  = Math.max(current.leadTime, 1)
  const scenarios = [
    { label: 'Current', lt: current.leadTime, pce: current.pce, color: '#9CA3AF' },
    { label: 'Conservative', lt: conservative.leadTime, pce: conservative.pce, color: AMBER },
    { label: 'Realistic', lt: realistic.leadTime, pce: realistic.pce, color: BRAND },
    { label: 'Optimistic', lt: optimistic.leadTime, pce: optimistic.pce, color: GREEN },
  ]

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {scenarios.map(s => (
          <div key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: s.label === 'Current' ? 400 : 600, color: s.label === 'Current' ? 'var(--text3)' : 'var(--text)' }}>{s.label}</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, fontFamily: MONO, color: 'var(--text3)' }}>{fmtSec(s.lt)} lead time</span>
                <span style={{ fontSize: 12, fontFamily: MONO, fontWeight: 700, color: s.color }}>{s.pce.toFixed(0)}% PCE</span>
              </div>
            </div>
            <div style={{ height: s.label === 'Current' ? 12 : 18, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(s.lt / maxLT) * 100}%`, background: s.color, borderRadius: 4, opacity: s.label === 'Current' ? 0.5 : 1, transition: 'width 0.8s ease' }} />
            </div>
            {s.label !== 'Current' && (
              <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 2 }}>
                {Math.round((1 - s.lt / Math.max(current.leadTime, 1)) * 100)}% lead time reduction
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(1,118,211,0.05)', border: '1px solid rgba(201,166,107,0.12)', borderRadius: 8 }}>
        <div style={{ fontSize: 10, fontFamily: MONO, color: 'var(--text3)', marginBottom: 4 }}>METHODOLOGY</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>{projection.methodology}. Projections are estimates based on PCE improvement targets, validate with direct observation before committing to timelines.</div>
      </div>
    </div>
  )
}

// ── Plan gate, trial teaser ──────────────────────────────────────────────────
function TrialTeaser({ section }: { section: string }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 10 }}>
      <div style={{ filter: 'blur(6px)', opacity: 0.35, pointerEvents: 'none', userSelect: 'none', padding: 16 }}>
        <div style={{ height: 80, background: 'linear-gradient(135deg, var(--bg3), var(--bg4))', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 40, background: 'var(--bg3)', borderRadius: 6, width: '70%' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,4,13,0.6)' }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
        <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 4 }}>{section}, Pro plan required</div>
        <Link href="/pricing" style={{ padding: '8px 18px', background: BRAND, color: '#fff', borderRadius: 7, textDecoration: 'none', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
          Upgrade to Pro →
        </Link>
      </div>
    </div>
  )
}

// ── Format seconds helper ─────────────────────────────────────────────────────
function fmtSec(s: number): string {
  if (!s || s < 0) return ','
  if (s < 60)      return `${Math.round(s)}s`
  if (s < 3600)    return `${(s / 60).toFixed(1)}m`
  if (s < 86400)   return `${(s / 3600).toFixed(1)}h`
  return `${(s / 86400).toFixed(1)}d`
}

// ═════════════════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════════════════
export function V2AnalysisReport({ report, project, t, indLabel, onGoFuture, onGoMap, isPaid = true }: any) {
  const [openSection, setOpenSection] = useState<string | null>(null)

  if (!report) return null

  const generatedAt  = report.generated_at
  const ageHours     = generatedAt ? (Date.now() - new Date(generatedAt).getTime()) / 3600000 : 0
  const isStale      = ageHours > 24
  const cs           = report.current_state || {}
  const bottleneck   = report.bottleneck || {}
  const nvaAnalysis  = report.nva_analysis || {}
  const recs         = report.recommendations || []
  const matrix       = report.priority_matrix || []
  const projection   = report.projection
  const nextSteps    = report.next_steps || []

  // Tool link helper
  const toolLink = (stepName: string, tool: string) =>
    `#` // In production this could open the tool modal for the relevant step

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', paddingBottom: 60 }}>

      {/* Staleness warning */}
      {isStale && (
        <div style={{ padding: '10px 14px', background: 'rgba(1,118,211,0.05)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 9, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#0a4d8f' }}>
          <span>⏱</span>
          <span>Analysis run {Math.round(ageHours)}h ago. Re-run if you have changed steps since then.</span>
          {onGoMap && <button onClick={onGoMap} style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(1,118,211,0.4)', background: 'transparent', color: BRAND, cursor: 'pointer' }}>Re-analyse →</button>}
        </div>
      )}

      {/* AI availability note */}
      {report.ai_analysis_used === false && (
        <div style={{ padding: '9px 14px', background: 'rgba(112,110,107,0.06)', border: '1px solid rgba(112,110,107,0.2)', borderRadius: 9, marginBottom: 16, fontSize: 12, color: 'var(--text3)', display: 'flex', gap: 8 }}>
          <span>⚙</span>
          <span>AI analysis was unavailable, findings are rule-based. Results are directionally correct. Re-run when AI is available.</span>
        </div>
      )}

      {/* ── SECTION 1: Executive Summary ───────────────────────────────────── */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px', marginBottom: 28 }}>
        <SectionHeader num="01" label="Executive Summary" icon="📋" />
        <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.85, margin: '0 0 20px', fontFamily: SERIF }}>
          {report.executive_summary}
        </p>
        {/* Key metric strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 10, marginTop: 20 }}>
          {[
            { label: 'Steps Mapped',  value: cs.total_steps || report.total_steps || ',' },
            { label: 'Lead Time',     value: fmtSec(cs.lead_time || 0) },
            { label: 'PCE',           value: report.va_ratio || ',', color: parseInt(report.va_ratio) > 50 ? GREEN : parseInt(report.va_ratio) > 25 ? AMBER : RED },
            { label: 'Data Complete', value: `${cs.data_completeness || 0}%`, color: (cs.data_completeness || 0) > 75 ? GREEN : (cs.data_completeness || 0) > 50 ? AMBER : RED },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: 'var(--text3)', letterSpacing: 1, marginBottom: 6 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: SERIF, color: color || 'var(--text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: Current State Snapshot ──────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader num="02" label="Current State Snapshot" icon="📊" />

        {/* Lead time waterfall */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--text3)', letterSpacing: 1, marginBottom: 14 }}>LEAD TIME BREAKDOWN</div>
          <WaterfallChart
            totalCT={cs.total_ct || 0} totalWait={cs.total_wait || 0}
            vaCT={cs.va_ct || 0} steps={cs.ct_by_step || []} />
          {/* Industry benchmark */}
          {cs.industry_benchmark && (
            <div style={{ marginTop: 14, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 6, fontSize: 11, color: 'var(--text3)' }}>
              <strong style={{ color: 'var(--text2)' }}>Industry benchmark ({indLabel || 'this industry'}):</strong>{' '}
              Typical PCE {cs.industry_benchmark.typical}, world-class {cs.industry_benchmark.worldClass}. {cs.industry_benchmark.note}
            </div>
          )}
        </div>

        {/* Takt comparison */}
        {(cs.ct_by_step || []).length > 0 && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--text3)', letterSpacing: 1, marginBottom: 14 }}>TAKT TIME COMPARISON</div>
            <TaktChart steps={cs.ct_by_step || []} taktTime={cs.takt_time || 0} />
          </div>
        )}

        {/* WIP heatmap + Defect chart side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--text3)', letterSpacing: 1, marginBottom: 14 }}>WIP HEATMAP</div>
            <WIPHeatmap steps={cs.wip_by_step || []} />
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--text3)', letterSpacing: 1, marginBottom: 14 }}>DEFECT RATES BY STEP</div>
            <DefectChart steps={cs.defect_steps || []} />
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Bottleneck Analysis ─────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader num="03" label="Bottleneck Analysis" icon="🎯" />
        <div style={{ background: 'rgba(192,64,42,0.04)', border: '1px solid rgba(192,64,42,0.2)', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{bottleneck.step_name || ','}</div>
            <span style={{ fontFamily: MONO, fontSize: 9, padding: '3px 8px', borderRadius: 4, background: RED, color: 'white', letterSpacing: 1 }}>PRIMARY CONSTRAINT</span>
          </div>
          {/* Constraint data */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'WIP upstream',    value: bottleneck.wip_upstream ?? ',' },
              { label: 'CT vs Takt',      value: bottleneck.ct_vs_takt || ',' },
              { label: 'Constraint score', value: bottleneck.constraint_score ? `${bottleneck.constraint_score}/100` : ',', color: RED },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 9, fontFamily: MONO, color: 'var(--text3)', marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: SERIF, color: color || 'var(--text)' }}>{value}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, margin: '0 0 12px' }}>{bottleneck.plain_explanation}</p>
          {bottleneck.toc_note && (
            <div style={{ padding: '10px 14px', background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 7, fontSize: 13, color: 'var(--text3)', fontStyle: 'italic' }}>
              💡 {bottleneck.toc_note}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 4: NVA Analysis ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader num="04" label="NVA Analysis" icon="🔍" />
        {!isPaid ? <TrialTeaser section="Full NVA Analysis" /> : (
          <div>
            {/* Pareto */}
            {(nvaAnalysis.by_waste_type || []).length > 0 && (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--text3)', letterSpacing: 1, marginBottom: 14 }}>WASTE TYPE PARETO</div>
                <ParetoChart wasteTypes={nvaAnalysis.by_waste_type || []} />
              </div>
            )}
            {/* NVA activity list */}
            {(nvaAnalysis.activities || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(nvaAnalysis.activities || []).slice(0, 10).map((a: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: RED + '20', border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: RED, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{a.step_name}</span>
                        <span style={{ fontSize: 9, fontFamily: MONO, padding: '2px 7px', borderRadius: 4, background: 'rgba(192,64,42,0.1)', color: RED }}>{WASTE_LABELS[a.waste_type] || a.waste_type}</span>
                        <span style={{ fontSize: 9, fontFamily: MONO, color: 'var(--text4)' }}>Impact: {a.impact_score}/10</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>{a.activity}</div>
                      <div style={{ fontSize: 11, color: BRAND }}>→ {a.elimination_approach}</div>
                    </div>
                    {a.estimated_time_cost_seconds > 0 && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: RED }}>{fmtSec(a.estimated_time_cost_seconds)}</div>
                        <div style={{ fontSize: 9, color: 'var(--text4)' }}>lost/unit</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!(nvaAnalysis.activities || []).length && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
                No NVA activities classified yet. Add task descriptions to steps and re-run analysis.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SECTION 5: Recommended Improvement Actions ──────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader num="05" label="Recommended Improvement Actions" icon="⚡" />
        {!isPaid ? <TrialTeaser section="Improvement Recommendations" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recs.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13 }}>Run analysis with complete step data to generate recommendations.</div>}
            {recs.map((r: any, i: number) => (
              <div key={i} style={{ background: 'var(--bg2)', border: `1px solid ${PRIORITY_COLORS[r.priority] || 'var(--border)'}30`, borderLeft: `4px solid ${PRIORITY_COLORS[r.priority] || 'var(--border)'}`, borderRadius: 12, padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{r.step_name}</div>
                  <span style={{ fontSize: 9, fontFamily: MONO, padding: '2px 8px', borderRadius: 4, background: `${PRIORITY_COLORS[r.priority] || BRAND}15`, color: PRIORITY_COLORS[r.priority] || BRAND, textTransform: 'uppercase' }}>
                    {r.priority?.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                  <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7 }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: 'var(--text3)', marginBottom: 4 }}>WHAT</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{r.what}</div>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7 }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: 'var(--text3)', marginBottom: 4 }}>WHY</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{r.why}</div>
                  </div>
                  <div style={{ padding: '10px 12px', background: `${BRAND}06`, border: `1px solid ${BRAND}20`, borderRadius: 7 }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: BRAND, marginBottom: 4 }}>HOW, TOOL: {(TOOL_LABELS[r.tool] || r.tool || '').toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{r.how}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 6: Prioritisation Matrix ───────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader num="06" label="Prioritisation Matrix" icon="🗺️" />
        {!isPaid ? <TrialTeaser section="Priority Matrix" /> : (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
              Items are plotted by AI based on map data. Click any dot to reposition based on your knowledge of the operation.
            </div>
            {matrix.length > 0 ? <PriorityMatrix items={matrix} /> : (
              <div style={{ color: 'var(--text3)', fontSize: 13 }}>Run analysis with at least 3 steps to generate priority matrix.</div>
            )}
          </div>
        )}
      </div>

      {/* ── SECTION 7: Lead Time Projection ────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader num="07" label="Lead Time Improvement Projection" icon="📈" />
        {!isPaid ? <TrialTeaser section="Lead Time Projection" /> : (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
            <ProjectionChart projection={projection} />
          </div>
        )}
      </div>

      {/* ── SECTION 8: Next Steps ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeader num="08" label="Next Steps" icon="🎯" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {nextSteps.map((ns: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: BRAND, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{ns.sequence}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{ns.action}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{ns.step_name} · {ns.rationale}</div>
                {ns.expected_outcome && <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Expected: {ns.expected_outcome}</div>}
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontFamily: MONO, color: BRAND, fontWeight: 700, marginBottom: 4 }}>{TOOL_LABELS[ns.tool] || ns.tool}</div>
                {/* Editable fields */}
                <input placeholder="Owner" style={{ display: 'block', width: 110, fontSize: 11, padding: '3px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', marginBottom: 4 }} />
                <input type="date" style={{ display: 'block', width: 110, fontSize: 11, padding: '3px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>
            </div>
          ))}
          {!nextSteps.length && (
            <div style={{ color: 'var(--text3)', fontSize: 13, padding: '16px 0' }}>Next steps will appear after analysis runs on a complete map.</div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(244,166,35,0.06)', border: '1px solid rgba(244,166,35,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
        <AlertIcon size={14} color="#92400E" />
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#7A5200', marginBottom: 4, fontFamily: MONO, letterSpacing: 1 }}>DISCLAIMER</div>
          <p style={{ fontSize: 12, color: '#7A5200', lineHeight: 1.7, margin: 0 }}>{report.disclaimer}</p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--navy, #0F1830)', borderRadius: 16, padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: 9, fontFamily: MONO, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 12 }}>NEXT STEP</div>
        <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 10 }}>Define your target. Generate your future state.</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
          Tell Supe what you are trying to achieve. Supe will build a data-backed future state and action plan.
        </p>
        <button onClick={onGoFuture} style={{ padding: '12px 28px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, #A8854F, ${BRAND})`, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Set target → Generate future state
        </button>
      </div>
    </div>
  )
}

export default V2AnalysisReport
