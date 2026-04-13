// @ts-nocheck
'use client'

import { useState, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'

interface Props {
  steps: any[]
  project: any
  takt: number
  pce: number
  onClose: () => void
}

interface GapItem {
  severity: 'critical' | 'warning' | 'info'
  category: string
  title: string
  detail: string
  action: string
}

const SEV_COLOR = { critical: '#FF6B6B', warning: '#0176D3', info: '#6CB9FC' }
const SEV_ICON  = { critical: '', warning: '', info: '' }

function analyzeGaps(steps: any[], takt: number, pce: number): GapItem[] {
  const gaps: GapItem[] = []
  const mainSteps = steps.filter(s => !s.branch_id)

  // 1. PCE gap
  if (pce < 95) {
    const severity = pce < 30 ? 'critical' : pce < 60 ? 'warning' : 'info'
    gaps.push({
      severity,
      category: 'Process Efficiency',
      title: `PCE is ${Math.round(pce)}% — target is 95%+`,
      detail: `Your process spends ${Math.round(100 - pce)}% of total lead time in non-value-adding wait. World-class VSMs run at 90–95%+ PCE. The gap represents lead time waste that is costing you responsiveness and working capital tied up in WIP.`,
      action: `Focus kaizen on the largest wait/queue times between steps. Each WIP triangle on your map is a queue — target the biggest one first. Consider one-piece flow: can any adjacent steps be combined to eliminate the queue between them?`,
    })
  }

  // 2. Takt vs CT violations
  if (takt > 0) {
    const bottlenecks = mainSteps.filter(s => {
      const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
      return ct > 0 && ct > takt * 1.05
    })
    bottlenecks.forEach(s => {
      const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
      const excess = Math.round(ct - takt)
      gaps.push({
        severity: 'critical',
        category: 'Bottleneck',
        title: `"${s.name}" is ${excess}s over takt time`,
        detail: `Cycle time is ${ct}s vs takt of ${takt}s. This step cannot keep pace with customer demand and will cause either starvation downstream or overproduction upstream. Everything feeding into this step will build queue.`,
        action: `Run a 5 Why or Kaizen on this step immediately. Decompose the task using Operator Steps — identify which elements are NVA and target them for elimination. If CT cannot be reduced, consider: splitting the step across 2 operators, adding a second station in parallel, or off-loading work elements to an adjacent under-loaded step.`,
      })
    })
  }

  // 3. High WIP warnings
  mainSteps.forEach(s => {
    const wip = Number(s.wip) || 0
    if (wip > 10) {
      gaps.push({
        severity: wip > 50 ? 'critical' : 'warning',
        category: 'Inventory / WIP',
        title: `"${s.name}" has ${wip} units WIP — consider one-piece flow`,
        detail: `WIP of ${wip} units represents batch processing or a queue building before this step. Each unit in this queue is lead time you are adding without adding value. High WIP often hides quality problems — defects can sit in queue for hours before being discovered.`,
        action: `Investigate why WIP is accumulating here. Is the upstream step running faster than this step can consume? If so, pace the upstream step to takt (drum-buffer-rope). If this is a necessary queue (e.g., drying time, inspection batch), model it as a Queue Step in your VSM to make the lead time impact visible.`,
      })
    }
  })

  // 4. One-piece flow opportunity
  const pushSteps = mainSteps.filter(s => s.flow_type === 'push' || !s.flow_type)
  if (pushSteps.length > 0 && mainSteps.length > 2) {
    gaps.push({
      severity: 'info',
      category: 'Flow Design',
      title: `${pushSteps.length} steps using PUSH flow — evaluate one-piece flow`,
      detail: `Push scheduling means each step produces regardless of downstream demand, creating WIP accumulation. One-piece flow (or FIFO lanes between steps) eliminates queue build-up, reduces lead time, and exposes quality problems immediately rather than after a batch has been processed.`,
      action: `Review each PUSH step. For adjacent steps with similar cycle times, consider FIFO lanes instead of push. For the step immediately before a bottleneck, consider a supermarket with a defined max inventory to buffer the bottleneck without creating unbounded WIP elsewhere.`,
    })
  }

  // 5. Operator imbalance
  if (takt > 0) {
    const cts = mainSteps.map(s => s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0).filter(ct => ct > 0)
    if (cts.length > 1) {
      const max = Math.max(...cts)
      const min = Math.min(...cts)
      const ratio = max / min
      if (ratio > 2.5) {
        gaps.push({
          severity: 'warning',
          category: 'Line Balance',
          title: `Cycle time imbalance: ratio ${ratio.toFixed(1)}:1 across steps`,
          detail: `The fastest step (${Math.round(min)}s) and slowest step (${Math.round(max)}s) differ by ${ratio.toFixed(1)}×. In a balanced line, all steps should run close to takt time. Imbalanced steps mean some operators are idle while others are overwhelmed — this creates NVA waiting waste and inconsistent output.`,
          action: `Use the Yamazumi chart to visualise operator work content. Re-balance work elements between operators to bring all step cycle times to within 10–15% of takt time. The ideal state is every step at takt time — no slack, no overload.`,
        })
      }
    }
  }

  // 6. Missing data
  const missingCT = mainSteps.filter(s => !s.cycle_time && !s.toolData?.stopwatch?.mean)
  if (missingCT.length > 0) {
    gaps.push({
      severity: 'warning',
      category: 'Data Completeness',
      title: `${missingCT.length} steps missing cycle time data`,
      detail: `Steps without cycle time data: ${missingCT.map(s => s.name).join(', ')}. Without CT data, PCE, takt comparison, and bottleneck analysis are incomplete. Your current state map is an estimate, not a measurement.`,
      action: `Use the Time Study Stopwatch tool on each missing step. Take a minimum of 10 observations per step. Remove outliers (machine faults, interruptions) before using the mean. Measured CT is the foundation of all VSM improvement work.`,
    })
  }

  // 7. PCE target guidance
  if (pce >= 95) {
    gaps.push({
      severity: 'info',
      category: 'Achievement',
      title: `PCE at ${Math.round(pce)}% — excellent! Focus shifts to flow reliability`,
      detail: `You have achieved near-world-class process efficiency. At this level, the primary opportunities are in reducing variation (CT standard deviation), improving uptime reliability, and building in quality at the source to eliminate inspection steps.`,
      action: `Run Statistical Process Control (SPC) on your cycle times to identify variation sources. Use the Fishbone tool to investigate the root causes of any remaining NVA or NNVA elements. Consider standard work documentation to lock in gains.`,
    })
  }

  return gaps
}

export default function VSMCoachingTool({ steps, project, takt, pce, onClose }: Props) {
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')

  const gaps = analyzeGaps(steps, takt, pce)
  const filtered = filter === 'all' ? gaps : gaps.filter(g => g.severity === filter)

  const critCount = gaps.filter(g => g.severity === 'critical').length
  const warnCount = gaps.filter(g => g.severity === 'warning').length

  const getAIInsight = useCallback(async () => {
    setAiLoading(true)
    try {
      const mainSteps = steps.filter(s => !s.branch_id)
      const prompt = `You are a lean manufacturing expert and VSM coach. Analyse this value stream and give 3-4 specific, actionable improvement recommendations.

Project: ${project?.name || 'Unknown'}
Takt Time: ${takt ? takt + 's' : 'Not set'}
Process Cycle Efficiency (PCE): ${Math.round(pce)}%
Target PCE: 95%+

Process Steps (in order):
${mainSteps.map((s, i) => {
  const ct = s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0
  const wip = Number(s.wip) || 0
  return `${i+1}. ${s.name} | CT: ${ct || 'unknown'}s | WIP: ${wip} | Flow: ${s.flow_type || 'push'} | Classification: ${s.va_type || 'not set'}`
}).join('\n')}

Known gaps:
${gaps.slice(0, 4).map(g => `- ${g.title}`).join('\n')}

Give 3-4 specific improvement recommendations focused on moving from ${Math.round(pce)}% PCE toward 95%+. Each recommendation should reference specific step names from the list above. Format as numbered list. Be direct and practical — this is for a practitioner on the shop floor.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      const text = data.content?.map((b: any) => b.text || '').join('') || 'No response'
      setAiInsight(text)
    } catch (e) {
      setAiInsight('AI coaching unavailable. Use the gap analysis below as your guide.')
    } finally {
      setAiLoading(false)
    }
  }, [steps, takt, pce, gaps, project])

  return (
    <Modal title="VSM Gap Analysis & AI Coaching" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Score header */}
        <div style={{ background: pce >= 95 ? 'rgba(29,209,161,0.08)' : pce >= 60 ? 'rgba(1,118,211,0.08)' : 'rgba(255,107,107,0.08)', border: `1px solid ${pce >= 95 ? 'rgba(29,209,161,0.3)' : pce >= 60 ? 'rgba(1,118,211,0.3)' : 'rgba(255,107,107,0.3)'}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>PROCESS CYCLE EFFICIENCY</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: pce >= 95 ? '#1DD1A1' : pce >= 60 ? '#0176D3' : '#FF6B6B' }}>
              {Math.round(pce)}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Target: 95–100%</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#FF6B6B' }}>{critCount}</div>
              <div style={{ fontSize: 9, color: 'var(--text3)' }}>CRITICAL</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0176D3' }}>{warnCount}</div>
              <div style={{ fontSize: 9, color: 'var(--text3)' }}>WARNINGS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#6CB9FC' }}>{gaps.filter(g => g.severity === 'info').length}</div>
              <div style={{ fontSize: 9, color: 'var(--text3)' }}>INSIGHTS</div>
            </div>
          </div>
        </div>

        {/* AI Coaching button */}
        <button
          onClick={getAIInsight}
          disabled={aiLoading}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', gap: 8 }}
        >
          {aiLoading ? 'Analysing your value stream…' : 'Get AI Coaching Recommendations'}
        </button>

        {/* AI insight */}
        {aiInsight && (
          <div style={{ background: '#EEF4FB', border: '1px solid #85AEDD', borderRadius: 10, padding: '14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6CB9FC', marginBottom: 8 }}>AI COACHING</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiInsight}</div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'critical', 'warning', 'info'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{ flex: 1, padding: '6px 4px', borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 700, border: `1px solid ${filter === f ? (f === 'all' ? '#0176D3' : SEV_COLOR[f] || '#0176D3') : 'var(--border)'}`, background: filter === f ? 'rgba(1,118,211,0.08)' : 'var(--bg)', color: filter === f ? (f === 'all' ? '#0176D3' : SEV_COLOR[f] || '#0176D3') : 'var(--text3)' }}
            >
              {f === 'all' ? `All (${gaps.length})` : f === 'critical' ? `${critCount} critical` : f === 'warning' ? `${warnCount} warnings` : `${gaps.filter(g=>g.severity==='info').length}`}
            </button>
          ))}
        </div>

        {/* Gap items */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: 13 }}>
            No {filter === 'all' ? '' : filter} issues found
          </div>
        ) : (
          filtered.map((gap, i) => (
            <div key={i} style={{ border: `1px solid ${SEV_COLOR[gap.severity]}44`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: `${SEV_COLOR[gap.severity]}12`, padding: '10px 14px', borderBottom: `1px solid ${SEV_COLOR[gap.severity]}22` }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{SEV_ICON[gap.severity]}</span>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: SEV_COLOR[gap.severity], letterSpacing: 1, fontFamily: 'monospace' }}>{gap.category.toUpperCase()}</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{gap.title}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{gap.detail}</div>
                <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.6 }}>
                  <span style={{ color: '#0176D3', fontWeight: 700 }}>&rarr; Action: </span>{gap.action}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}
