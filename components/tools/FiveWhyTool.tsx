// TypeScript enabled
'use client'
import { FieldTip, TipLabel } from '@/components/ui/FieldTip'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'
import { openISOReport } from '@/lib/isoReport'

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function FiveWhyTool({ stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()
  const { result: aiCM, source: aiCMSource, loading: aiCMLoading, error: aiCMError, assist: aiCMAssist, clear: aiCMClear } = useAIAssist()
  const [problem, setProblem] = useState(data?.problem || '')
  const [whys, setWhys] = useState<string[]>(data?.whys || ['', '', '', '', ''])
  const [rootCause, setRootCause] = useState(data?.rootCause || '')
  const [action, setAction] = useState(data?.action || '')
  const [owner, setOwner] = useState(data?.owner || '')
  const [dueDate, setDueDate] = useState(data?.dueDate || '')
  const [saving, setSaving] = useState(false)

  const setWhy = (i: number, v: string) =>
    setWhys((current) => {
      const next = [...current]
      next[i] = v
      return next
    })

  const handleSave = async () => {
    setSaving(true)
    const payload = { problem, whys, rootCause, action, owner, dueDate, savedAt: Date.now() }
    try {
      await onSave(payload)
      showToast('5 Why analysis saved', 'success')
      onClose()
    } catch {
      showToast('Save failed, please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const exportFiveWhyISO = () => {
    const filledWhys = whys.filter(w => w.trim())
    const body = `
      <h2>1. Problem Statement</h2>
      <div class="obs-box finding">
        <div class="obs-label">Documented Problem, ISO 9001:2015 §10.2.1(a)</div>
        <p style="font-size:12pt;font-weight:600;">${problem || '(Not documented)'}</p>
        <p style="font-size:9pt;color:#666;margin-top:4pt;">Process Step: <strong>${stepName}</strong> · Documented: ${new Date().toLocaleDateString()}</p>
      </div>

      <h2>2. Five Why Interrogation Chain</h2>
      <p>The 5 Why method is a structured root cause analysis technique aligned with ISO 9001:2015 §10.2.1
      and ISO 31000:2018 §6.4. Each iterative question drills deeper into the causal chain until the root
      system cause is identified, not a symptom.</p>
      <table class="data-table">
        <thead><tr><th style="width:30pt;">Level</th><th>Interrogation Question</th><th>Response / Cause Statement</th><th>Evidence / Data</th></tr></thead>
        <tbody>
          <tr style="background:#fff8e1;">
            <td style="font-size:10pt;font-weight:700;text-align:center;">P</td>
            <td style="font-weight:600;">Problem Statement</td>
            <td>${problem || ','}</td>
            <td>Observed / Reported</td>
          </tr>
          ${whys.map((w, i) => `
            <tr style="${i === filledWhys.length - 1 && rootCause ? 'background:#e8f5e9;' : ''}">
              <td style="font-size:11pt;font-weight:700;text-align:center;color:#A8854F;">W${i+1}</td>
              <td style="font-style:italic;">Why does this occur?</td>
              <td style="${!w ? 'color:#aaa;font-style:italic;' : ''}">${w || '(Not documented)'}</td>
              <td>${w ? 'Documented' : ','}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>3. Root Cause Determination</h2>
      <div class="obs-box ${rootCause ? 'finding' : ''}">
        <div class="obs-label">Verified Root Cause, ISO 9001:2015 §10.2.1(b)</div>
        <p style="font-size:12pt;font-weight:600;">${rootCause || '(Root cause not yet determined, complete the 5 Why chain above)'}</p>
      </div>
      <p>The root cause represents the deepest systemic cause that, if addressed, will prevent recurrence.
      A root cause is distinguished from a contributing cause by the fact that removing it eliminates the problem.</p>

      <h2>4. Corrective Action Plan</h2>
      <p>Per ISO 9001:2015 §10.2.1(e), corrective actions shall be appropriate to the effects of the
      nonconformities encountered. The action below is linked to the root cause above.</p>
      <table class="data-table">
        <thead><tr><th>Countermeasure / Corrective Action</th><th>Responsible Owner</th><th>Target Date</th><th>Verification Method</th></tr></thead>
        <tbody>
          <tr>
            <td style="font-weight:600;">${action || '(Action not yet defined)'}</td>
            <td>${owner || ','}</td>
            <td>${dueDate || ','}</td>
            <td>Post-implementation review; monitor KPI for 30 days</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Effectiveness Criteria</h2>
      <table class="data-table">
        <thead><tr><th>Criterion</th><th>Status</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Problem clearly stated</td><td>${problem ? 'Complete' : 'Incomplete'}</td><td>${problem ? 'Documented above' : 'Document the observable problem with data'}</td></tr>
          <tr><td>5 Why chain completed</td><td>${filledWhys.length >= 5 ? 'Complete' : filledWhys.length + '/5 Complete'}</td><td>${filledWhys.length >= 3 ? 'Sufficient depth achieved' : 'Continue interrogation to reach systemic root cause'}</td></tr>
          <tr><td>Root cause identified</td><td>${rootCause ? 'Complete' : 'Incomplete'}</td><td>${rootCause ? 'Root cause documented' : 'Required for corrective action'}</td></tr>
          <tr><td>Corrective action defined</td><td>${action ? 'Complete' : 'Incomplete'}</td><td>${action ? 'Action defined' : 'Must address root cause, not symptom'}</td></tr>
          <tr><td>Owner assigned</td><td>${owner ? '✓ ' + owner : '✗ Not assigned'}</td><td>ISO 9001 §5.3 requires clear responsibility</td></tr>
          <tr><td>Target date set</td><td>${dueDate ? '✓ ' + dueDate : '✗ Not set'}</td><td>Required for follow-up per §10.2.2</td></tr>
        </tbody>
      </table>
    `
    openISOReport(body, {
      title: '5 Why Root Cause Analysis Report',
      toolType: 'FIVEWHY',
      projectName: stepName,
      stepName: 'Root Cause Analysis',
      revision: 'Rev. A',
      preparedBy: 'VeSiMy CI Platform',
    })
  }

  return (
    <Modal
      title={`5 Why Analysis, ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Analysis'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TipLabel termKey="problem_statement" style={{ margin: 0 }}>Problem Statement *</TipLabel>
          {(problem || whys.some(w => w)) && (
            <button
              onClick={exportFiveWhyISO}
              style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer' }}
            >
              ISO Report
            </button>
          )}
        </div>
        <textarea
          className="input"
          rows={2}
          placeholder="Describe the problem clearly."
          style={{ minHeight: 64 }}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        {/* Causal chain, each Why connects to the previous answer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {whys.map((w, i) => {
            const prevAnswer = i === 0 ? problem : whys[i - 1]
            const hasMinLength = w.trim().length >= 15
            const isFilled = w.trim().length > 0
            const isShallow = isFilled && w.trim().length < 15
            return (
              <div key={i} style={{ position: 'relative' }}>
                {/* Causal connector arrow between entries */}
                {i > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 4px 14px', color: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                    <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0, marginLeft: 13 }} />
                    <span style={{ fontSize: 9, letterSpacing: 0.5, color: 'var(--text4)' }}>BECAUSE ↓</span>
                  </div>
                )}
                <div style={{
                  border: `1.5px solid ${isFilled && hasMinLength ? 'rgba(201,166,107,0.30)' : isShallow ? 'rgba(217,119,6,0.35)' : 'var(--border)'}`,
                  borderRadius: 10,
                  padding: '10px 12px 10px 10px',
                  background: isFilled && hasMinLength ? 'rgba(22,112,212,0.03)' : '#FFFFFF',
                  transition: 'border-color 0.15s, background 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {/* Step number badge */}
                    <div style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: isFilled && hasMinLength ? 'rgba(201,166,107,0.12)' : 'var(--bg3)',
                      border: `1px solid ${isFilled && hasMinLength ? 'rgba(201,166,107,0.25)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                      color: isFilled && hasMinLength ? 'var(--brand)' : 'var(--text3)',
                      marginTop: 1,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      {/* Show previous answer as context prompt */}
                      {prevAnswer && (
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontStyle: 'italic', marginBottom: 4, lineHeight: 1.4, paddingLeft: 1 }}>
                          Why does <em style={{ color: 'var(--text2)' }}>"{prevAnswer.slice(0, 80)}{prevAnswer.length > 80 ? '…' : ''}"</em> happen?
                        </div>
                      )}
                      <textarea
                        className="input"
                        rows={2}
                        placeholder={i === 0 ? 'Why does this problem occur?' : 'Why does that happen? Go deeper…'}
                        style={{ minHeight: 52, fontSize: 13 }}
                        value={w}
                        onChange={(e) => setWhy(i, e.target.value)}
                      />
                      {/* Validation hint */}
                      {isShallow && (
                        <div style={{ fontSize: 10, color: 'var(--warning)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span>⚠</span> Too brief, describe the mechanism, not just the symptom
                        </div>
                      )}
                      {isFilled && hasMinLength && i < 4 && (
                        <div style={{ fontSize: 10, color: 'var(--brand)', marginTop: 4 }}>
                          ✓ Good, ask why this happens in Why {i + 2}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Depth indicator */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
          {whys.map((w, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: w.trim().length >= 15 ? 'var(--brand)' : w.trim().length > 0 ? 'var(--amber)' : 'var(--sl-200)',
              transition: 'background 0.2s',
            }} />
          ))}
          <span style={{ fontSize: 10, color: 'var(--text3)', whiteSpace: 'nowrap', marginLeft: 4 }}>
            {whys.filter(w => w.trim().length >= 15).length}/5 complete
          </span>
        </div>

        <div
          style={{
            background: 'rgba(29,209,161,0.04)',
            border: '1px solid rgba(29,209,161,0.2)',
            borderRadius: 10,
            padding: 10,
          }}
        >
          <TipLabel termKey="root_cause" style={{ color: '#1DD1A1' }}>Root Cause</TipLabel>
          <textarea
            className="input"
            rows={2}
            style={{ minHeight: 64 }}
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <TipLabel termKey="countermeasure" style={{ margin: 0 }}>Countermeasure / Action</TipLabel>
            {rootCause && (
              <AIAssistButton
                label="Draft countermeasure"
                loading={aiCMLoading}
                small
                onClick={() => aiCMAssist('fivewhy_countermeasure', { rootCause, problem, stepName })}
              />
            )}
          </div>
          <AIResultPanel
            result={aiCM as string} source={aiCMSource} error={aiCMError} onClear={aiCMClear}
            useLabel="Use this"
            onUse={(r: any) => { setAction(r as string); aiCMClear() }}
          />
          <textarea
            className="input"
            rows={2}
            style={{ minHeight: 64 }}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <TipLabel termKey="kaizen_owner">Owner</TipLabel>
            <input className="input" value={owner} onChange={(e) => setOwner(e.target.value)} />
          </div>
          <div>
            <TipLabel termKey="kaizen_due">Due Date</TipLabel>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
