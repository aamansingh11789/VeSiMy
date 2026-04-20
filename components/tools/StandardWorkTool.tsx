// TypeScript enabled
'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'
import { openISOReport } from '@/lib/isoReport'

interface Props {
  steps: any[]
  takt: number
  projectName: string
  onClose: () => void
}

const VA_LABELS: Record<string, string> = { va: 'VA', nnva: 'NNVA', nva: 'NVA' }
const VA_COLORS: Record<string, string> = { va: '#1DD1A1', nnva: '#0176D3', nva: '#FF6B6B' }

export default function StandardWorkTool({ steps, takt, projectName, onClose }: Props) {
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()

  const [selectedStep, setSelectedStep] = useState<string>(steps[0]?.id || '')

  const stepsWithTasks = steps.filter(s => (s.op_steps || []).length > 0)
  const step = steps.find(s => s.id === selectedStep)
  const opSteps = step?.op_steps || []

  const totalTime = opSteps.reduce((a: number, s: any) => a + s.time, 0)
  const vaTime    = opSteps.filter((s: any) => s.va_type === 'va').reduce((a: number, s: any) => a + s.time, 0)
  const pct       = totalTime > 0 ? Math.round(vaTime / totalTime * 100) : 0

  const exportSWS = () => {
    if (!step) return
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const tableRows = opSteps.map((s: any, i: number) => `
      <tr>
        <td style="text-align:center;font-weight:600;">${i + 1}</td>
        <td>${s.name}</td>
        <td style="text-align:center;color:${VA_COLORS[s.va_type] || '#666'};font-weight:700;">${VA_LABELS[s.va_type] || s.va_type}</td>
        <td style="text-align:center;font-family:monospace;">${(s.step_type||'man').toUpperCase()}</td>
        <td style="text-align:center;font-family:monospace;font-weight:600;">${s.time}s</td>
        <td style="text-align:center;font-size:10pt;color:#888;">${s.time > 0 ? Math.round(s.time / totalTime * 100) : 0}%</td>
        <td></td>
      </tr>
    `).join('')

    const body = `
      <h2>Standard Work Sheet</h2>
      <p>Process Step: <strong>${step.name}</strong> &nbsp;|&nbsp; Project: <strong>${projectName}</strong></p>
      <table class="data-table" style="margin-bottom:24pt;">
        <thead>
          <tr>
            <th style="width:30pt;">No.</th>
            <th>Task / Work Element</th>
            <th style="width:50pt;">Classification</th>
            <th style="width:55pt;">Time (sec)</th>
            <th style="width:45pt;">% of CT</th>
            <th>Quality / Safety Point</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
        <tfoot>
          <tr style="background:#f5f5f5;font-weight:700;">
            <td colspan="3" style="text-align:right;">Total Cycle Time:</td>
            <td style="text-align:center;font-family:monospace;">${totalTime}s</td>
            <td></td><td></td>
          </tr>
        </tfoot>
      </table>

      <h2>2. Work Content Summary</h2>
      <table class="data-table" style="width:60%;">
        <thead><tr><th>Category</th><th>Time (sec)</th><th>% of Total</th><th>Target</th></tr></thead>
        <tbody>
          <tr><td style="color:#15803D;font-weight:700;">Value Add (VA)</td><td style="text-align:center;">${vaTime}s</td><td style="text-align:center;">${pct}%</td><td style="text-align:center;color:#15803D;">Maximise →100%</td></tr>
          <tr><td style="color:#B45309;font-weight:700;">Necessary NVA (NNVA)</td><td style="text-align:center;">${opSteps.filter((s:any)=>s.va_type==='nnva').reduce((a:number,s:any)=>a+s.time,0)}s</td><td style="text-align:center;">${totalTime > 0 ? Math.round(opSteps.filter((s:any)=>s.va_type==='nnva').reduce((a:number,s:any)=>a+s.time,0)/totalTime*100) : 0}%</td><td style="text-align:center;">Reduce over time</td></tr>
          <tr><td style="color:#DC2626;font-weight:700;">Non-Value Add (NVA)</td><td style="text-align:center;">${opSteps.filter((s:any)=>s.va_type==='nva').reduce((a:number,s:any)=>a+s.time,0)}s</td><td style="text-align:center;">${totalTime > 0 ? Math.round(opSteps.filter((s:any)=>s.va_type==='nva').reduce((a:number,s:any)=>a+s.time,0)/totalTime*100) : 0}%</td><td style="text-align:center;color:#DC2626;">Eliminate — Kaizen target</td></tr>
        </tbody>
      </table>

      <h2>3. Takt Time vs Cycle Time</h2>
      ${takt > 0 ? `
      <table class="data-table" style="width:50%;">
        <thead><tr><th>Metric</th><th>Value</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Takt Time</td><td style="font-family:monospace;">${takt}s</td><td>Customer requirement</td></tr>
          <tr><td>Cycle Time</td><td style="font-family:monospace;">${totalTime}s</td><td style="color:${totalTime > takt ? '#DC2626' : '#15803D'};font-weight:700;">${totalTime > takt ? 'EXCEEDS TAKT — bottleneck' : 'Within takt time'}</td></tr>
          <tr><td>Available Buffer</td><td style="font-family:monospace;">${takt - totalTime}s</td><td>${takt - totalTime >= 0 ? 'Capacity available' : 'Load-balancing required'}</td></tr>
        </tbody>
      </table>
      ` : '<p>Takt time not set for this project. Set demand and available time in project settings to calculate takt.</p>'}

      <h2>4. Standard Work Notes</h2>
      ${step.notes ? `<p>${step.notes}</p>` : '<p>(No notes recorded for this step)</p>'}
    `

    openISOReport(body, {
      title: `Standard Work Sheet — ${step.name}`,
      toolType: 'STANDARD_WORK',
      projectName,
      stepName: step.name,
      revision: 'Rev. A',
      preparedBy: 'VeSiMy CI Platform',
    })
  }

  return (
    <Modal
      title={`Standard Work Sheet — ${projectName}`}
      onClose={onClose}
    >
      {/* View-only notice */}
      <div style={{ padding: '6px 14px', background: 'rgba(244,166,35,0.08)', border: '1px solid rgba(244,166,35,0.2)', borderRadius: 8, fontSize: 12, color: '#F4A623', marginBottom: 12 }}>
        View only — this chart reads from your step data. Edit cycle times and op steps in each step to update it.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {opSteps.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <AIAssistButton
              label="AI Write work instruction"
              loading={aiLoading}
              onClick={() => aiAssist('standard_work_instruction', {
                opSteps, stepName: step?.name, takt,
              })}
            />
            {aiResult && (
              <AIResultPanel
                result={aiResult as string} source={aiSource} error={aiError} onClear={aiClear}
                title="WORK INSTRUCTION"
              />
            )}
          </div>
        )}

        {stepsWithTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text3)', fontSize: 13 }}>
            
            No operator steps defined yet.<br />
            Edit each process step and expand <strong>Operator Steps</strong> to add tasks with their times and VA classifications.
          </div>
        ) : (
          <>
            {/* Step selector */}
            <div>
              <label className="label">Select Process Step</label>
              <select
                className="input"
                value={selectedStep}
                onChange={e => setSelectedStep(e.target.value)}
              >
                {stepsWithTasks.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({(s.op_steps || []).length} tasks)</option>
                ))}
              </select>
            </div>

            {step && (
              <>
                {/* KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { label: 'Total CT',  val: `${totalTime}s`, color: 'var(--text)' },
                    { label: '% VA',      val: `${pct}%`,       color: '#1DD1A1' },
                    { label: 'Takt',      val: takt ? `${takt}s` : '—', color: takt && totalTime > takt ? '#FF6B6B' : '#0176D3' },
                    { label: 'Tasks',     val: String(opSteps.length), color: 'var(--text)' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 9, color: 'var(--text3)' }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* VA bar */}
                {totalTime > 0 && (
                  <div>
                    <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 1 }}>
                      <div style={{ width: `${vaTime/totalTime*100}%`, background: '#1DD1A1' }} />
                      <div style={{ width: `${opSteps.filter((s:any)=>s.va_type==='nnva').reduce((a:number,s:any)=>a+s.time,0)/totalTime*100}%`, background: '#0176D3' }} />
                      <div style={{ width: `${opSteps.filter((s:any)=>s.va_type==='nva').reduce((a:number,s:any)=>a+s.time,0)/totalTime*100}%`, background: '#FF6B6B' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                      <span style={{ color: '#1DD1A1' }}>VA: {vaTime}s</span>
                      <span style={{ color: '#0176D3' }}>NNVA: {opSteps.filter((s:any)=>s.va_type==='nnva').reduce((a:number,s:any)=>a+s.time,0)}s</span>
                      <span style={{ color: '#FF6B6B' }}>NVA: {opSteps.filter((s:any)=>s.va_type==='nva').reduce((a:number,s:any)=>a+s.time,0)}s</span>
                    </div>
                  </div>
                )}

                {/* Task table */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 52px 52px', background: 'transparent', padding: '6px 10px', fontSize: 10, color: 'var(--text3)', fontWeight: 700 }}>
                    <span>#</span><span>Task</span><span style={{ textAlign: 'center' }}>Type</span><span style={{ textAlign: 'right' }}>Time</span>
                  </div>
                  {opSteps.map((s: any, i: number) => (
                    <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 52px 52px', padding: '7px 10px', borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'transparent', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace' }}>{i + 1}</span>
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{s.name}</span>
                      <span style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, background: `${VA_COLORS[s.va_type]}22`, color: VA_COLORS[s.va_type], fontWeight: 700 }}>
                          {VA_LABELS[s.va_type] || s.va_type}
                        </span>
                      </span>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text2)', textAlign: 'right' }}>{s.time}s</span>
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 52px 52px', padding: '7px 10px', borderTop: '1px solid var(--border)', background: 'rgba(1,118,211,0.06)' }}>
                    <span />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0176D3' }}>Total</span>
                    <span />
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#0176D3', textAlign: 'right' }}>{totalTime}s</span>
                  </div>
                </div>

                {/* Takt warning */}
                {takt > 0 && totalTime > takt && (
                  <div style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#FF6B6B' }}>
                    <span style={{color:"#0176D3",fontWeight:700}}>OVER TAKT:</span> Cycle time <strong>{totalTime}s</strong> exceeds takt time <strong>{takt}s</strong> by {totalTime - takt}s. This step is a bottleneck — load-balance tasks to another operator or kaizen the NVA elements.
                  </div>
                )}

                {/* Export */}
                <button
                  onClick={exportSWS}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', gap: 8 }}
                >
                  Export ISO Standard Work Sheet
                </button>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
