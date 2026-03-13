// @ts-nocheck
'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'
import { openISOReport } from '@/lib/isoReport'

const FRAMEWORKS: Record<string, string[]> = {
  '6M Manufacturing': ['Machine', 'Method', 'Material', 'Manpower', 'Measurement', 'Mother Nature'],
  '8P Service': ['People', 'Process', 'Policies', 'Procedures', 'Place', 'Product', 'Price', 'Promotion'],
  '4S Service': ['Surroundings', 'Suppliers', 'Systems', 'Skills'],
  Custom: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
}

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function IshikawaTool({ stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [problem, setProblem] = useState(data?.problem || '')
  const [framework, setFramework] = useState(data?.framework || '6M Manufacturing')
  const [causes, setCauses] = useState<Record<string, string[]>>(data?.causes || {})
  const [newCause, setNewCause] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const categories = FRAMEWORKS[framework] || FRAMEWORKS['6M Manufacturing']

  const addCause = (cat: string) => {
    const value = (newCause[cat] || '').trim()
    if (!value) return
    setCauses((prev) => ({ ...prev, [cat]: [...(prev[cat] || []), value] }))
    setNewCause((prev) => ({ ...prev, [cat]: '' }))
  }

  const removeCause = (cat: string, index: number) => {
    setCauses((prev) => ({ ...prev, [cat]: (prev[cat] || []).filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { problem, framework, causes, savedAt: Date.now() }
    try {
      await onSave(payload)
      showToast('Fishbone diagram saved', 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const exportFishboneISO = () => {
    const totalCauses = Object.values(causes).flat().length
    const populatedCats = categories.filter(c => (causes[c] || []).length > 0)
    const emptyCats = categories.filter(c => !(causes[c] || []).length)

    const body = `
      <h2>1. Effect Statement</h2>
      <div class="obs-box finding">
        <div class="obs-label">Problem / Effect — Cause & Effect Analysis Head</div>
        <p style="font-size:12pt;font-weight:600;">${problem || '(Not documented)'}</p>
        <p style="font-size:9pt;color:#666;margin-top:4pt;">Process Step: <strong>${stepName}</strong> · Framework: <strong>${framework}</strong> · Total Causes Identified: <strong>${totalCauses}</strong></p>
      </div>

      <h2>2. Cause & Effect Diagram — Category Analysis</h2>
      <p>The Ishikawa (Fishbone) diagram organizes potential causes into structured categories.
      This analysis uses the <strong>${framework}</strong> framework and is conducted per
      ISO 9001:2015 §10.2.1 and ISO/TR 14639-2 cause & effect analysis guidelines.</p>

      <table class="data-table">
        <thead><tr>
          <th>Category</th><th>Cause / Contributing Factor</th><th>Severity Assessment</th><th>Investigation Status</th>
        </tr></thead>
        <tbody>
          ${categories.map(cat => {
            const catCauses = causes[cat] || []
            if (!catCauses.length) return `
              <tr>
                <td style="font-weight:700;color:#888;">${cat}</td>
                <td colspan="3" style="color:#aaa;font-style:italic;">No causes documented for this category</td>
              </tr>
            `
            return catCauses.map((cause, i) => `
              <tr>
                ${i === 0 ? `<td rowspan="${catCauses.length}" style="font-weight:700;color:#8B6A00;vertical-align:middle;">${cat}</td>` : ''}
                <td>${cause}</td>
                <td>To be assessed</td>
                <td><span class="badge badge-open">OPEN</span></td>
              </tr>
            `).join('')
          }).join('')}
        </tbody>
      </table>

      <h2>3. Category Summary</h2>
      <table class="data-table">
        <thead><tr><th>Category</th><th>Causes Found</th><th>% of Total</th><th>Investigation Priority</th></tr></thead>
        <tbody>
          ${categories.map(cat => {
            const n = (causes[cat] || []).length
            return `<tr>
              <td>${cat}</td>
              <td>${n}</td>
              <td>${totalCauses > 0 ? ((n / totalCauses) * 100).toFixed(0) + '%' : '—'}</td>
              <td>${n >= 3 ? '<span class="badge badge-high">HIGH</span>' : n >= 1 ? '<span class="badge badge-medium">MEDIUM</span>' : '<span style="color:#aaa;">—</span>'}</td>
            </tr>`
          }).join('')}
          <tr style="font-weight:700;background:#f0f0f0;"><td>TOTAL</td><td>${totalCauses}</td><td>100%</td><td></td></tr>
        </tbody>
      </table>

      ${emptyCats.length > 0 ? `
      <h2>4. Coverage Gaps</h2>
      <div class="obs-box">
        <div class="obs-label">Categories With No Causes Documented</div>
        <p>The following categories have not been analyzed. Consider whether causes in these areas
        could be contributing factors before closing the analysis:</p>
        <p>${emptyCats.join(' · ')}</p>
      </div>` : ''}

      <h2>${emptyCats.length > 0 ? '5' : '4'}. Recommended Next Steps</h2>
      <table class="data-table">
        <thead><tr><th>#</th><th>Action</th><th>ISO Reference</th><th>Priority</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Validate each identified cause with process data and observation</td><td>ISO 9001 §10.2.1(c)</td><td><span class="badge badge-high">HIGH</span></td></tr>
          <tr><td>2</td><td>Rank causes by likelihood and impact using a Pareto or vote</td><td>ISO 9004 §9.1</td><td><span class="badge badge-high">HIGH</span></td></tr>
          <tr><td>3</td><td>Link top causes to corrective actions in the CAPA register</td><td>ISO 9001 §10.2.1(f)</td><td><span class="badge badge-medium">MEDIUM</span></td></tr>
          <tr><td>4</td><td>Perform follow-up 5 Why on each major cause branch</td><td>ISO 9001 §10.2.1(b)</td><td><span class="badge badge-medium">MEDIUM</span></td></tr>
          <tr><td>5</td><td>Review and update diagram after corrective action implementation</td><td>ISO 9001 §10.3</td><td><span class="badge badge-low">LOW</span></td></tr>
        </tbody>
      </table>
    `
    openISOReport(body, {
      title: 'Cause & Effect (Ishikawa) Analysis Report',
      toolType: 'FISHBONE',
      projectName: stepName,
      stepName: 'Fishbone Diagram — ' + framework,
      revision: 'Rev. A',
      preparedBy: 'VeSiMy CI Platform',
    })
  }

  const totalCauses = Object.values(causes).flat().length

  return (
    <Modal
      title={`🐟 Fishbone Diagram — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Diagram'}
    >
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <label className="label" style={{ margin: 0 }}>Problem / Effect Statement *</label>
          {totalCauses > 0 && (
            <button
              onClick={exportFishboneISO}
              style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              📄 ISO Report
            </button>
          )}
        </div>
        <input
          className="input"
          placeholder="What is the problem being analyzed?"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <div>
          <label className="label">Framework</label>
          <select className="input" value={framework} onChange={(e) => setFramework(e.target.value)}>
            {Object.keys(FRAMEWORKS).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {problem && (
          <div
            style={{
              background: 'rgba(212,162,8,0.04)',
              border: '1px solid rgba(212,162,8,0.2)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 12,
              color: 'var(--text2)',
            }}
          >
            🎯 Effect: <strong style={{ color: 'var(--text)' }}>{problem}</strong>
          </div>
        )}

        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          {totalCauses} cause{totalCauses !== 1 ? 's' : ''} added
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {categories.map((cat) => (
            <details key={cat} open style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 10 }}>
              <summary style={{ cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#D4A208', marginBottom: 8 }}>
                {cat}
              </summary>
              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {(causes[cat] || []).map((cause, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 30px', gap: 8, alignItems: 'start', padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)', overflowWrap: 'anywhere', lineHeight: 1.4 }}>{cause}</span>
                    <button onClick={() => removeCause(cat, index)} type="button" style={{ background: 'none', border: 'none', color: '#7070A0', cursor: 'pointer', fontSize: 16, minWidth: 30, minHeight: 30, lineHeight: 1 }}>×</button>
                  </div>
                ))}
                {(causes[cat] || []).length === 0 && (
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>No causes added</span>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px', gap: 8, marginBottom: 4 }}>
                  <input className="input" style={{ fontSize: 12, minWidth: 0 }} placeholder="Add cause…" value={newCause[cat] || ''} onChange={(e) => setNewCause((prev) => ({ ...prev, [cat]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addCause(cat)} />
                  <button onClick={() => addCause(cat)} type="button" style={{ background: 'rgba(212,162,8,0.15)', border: '1px solid rgba(212,162,8,0.3)', color: '#D4A208', borderRadius: 8, cursor: 'pointer', fontSize: 18, minWidth: 40, minHeight: 40 }}>+</button>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Modal>
  )
}
