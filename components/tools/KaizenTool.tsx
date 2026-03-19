// @ts-nocheck
'use client'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { AIAssistButton, AIResultPanel } from '@/components/ui/AIAssistPanel'
import { useAIAssist } from '@/hooks/useAIAssist'
import { openISOReport } from '@/lib/isoReport'

const CATEGORIES = ['Safety', 'Quality', 'Delivery', 'Cost', 'Morale', 'Environment', 'Productivity', '5S']
const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
const STATUSES = ['open', 'in-progress', 'complete', 'verified'] as const

const STATUS_COLOR: Record<string, string> = {
  open: 'var(--text3)',
  'in-progress': '#D4A208',
  complete: '#1DD1A1',
  verified: '#6CB9FC',
}

const BLANK = {
  title: '',
  description: '',
  category: 'Quality',
  priority: 'medium',
  status: 'open',
  owner: '',
  dueDate: '',
  actions: [] as string[],
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

interface KaizenItem {
  id: string
  kzId: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  owner: string
  dueDate: string
  actions: string[]
  created: number
}

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function KaizenTool({ stepId, stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const { result: aiResult, source: aiSource, loading: aiLoading, error: aiError, assist: aiAssist, clear: aiClear } = useAIAssist()

  const [items, setItems] = useState<KaizenItem[]>(data?.items || [])
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...BLANK })
  const [newAct, setNewAct] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const sLabel = {
    open: 'Open',
    'in-progress': 'In Progress',
    complete: 'Complete',
    verified: 'Verified',
  }

  const exportKaizenISO = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const open = items.filter(i => i.status === 'open').length
    const inProgress = items.filter(i => i.status === 'in-progress').length
    const complete = items.filter(i => i.status === 'complete' || i.status === 'verified').length
    const critical = items.filter(i => i.priority === 'critical').length
    const high = items.filter(i => i.priority === 'high').length

    const body = `
      <h2>1. Executive Summary</h2>
      <p>This Kaizen Event Log documents continuous improvement activities for process step
      <strong>${stepName}</strong>. A total of <strong>${items.length}</strong> improvement items have been recorded,
      of which <strong>${complete}</strong> are complete or verified,
      <strong>${inProgress}</strong> are in progress, and <strong>${open}</strong> remain open.
      ${critical > 0 ? `<strong style="color:#c00;">${critical} critical priority item(s) require immediate attention.</strong>` : ''}
      This log is maintained in accordance with ISO 9001:2015 §10.3 (Continual Improvement) and
      ISO 45001:2018 §10.2 requirements.</p>

      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Total Items</div><div class="kpi-value">${items.length}</div></div>
        <div class="kpi-card"><div class="kpi-label">Open</div><div class="kpi-value" style="color:#666;">${open}</div></div>
        <div class="kpi-card"><div class="kpi-label">In Progress</div><div class="kpi-value" style="color:#a06000;">${inProgress}</div></div>
        <div class="kpi-card"><div class="kpi-label">Complete / Verified</div><div class="kpi-value" style="color:#0a5;">${complete}</div></div>
        <div class="kpi-card"><div class="kpi-label">Critical Priority</div><div class="kpi-value" style="color:#c00;">${critical}</div><div class="kpi-sub">Requires immediate action</div></div>
        <div class="kpi-card"><div class="kpi-label">High Priority</div><div class="kpi-value" style="color:#a06000;">${high}</div></div>
      </div>

      <h2>2. Kaizen Item Register</h2>
      <p>All improvement items are categorized by type, priority, and current status. Items are assigned
      unique Kaizen IDs for traceability per ISO 9001 §7.5.3 (Control of Documented Information).</p>
      <table class="data-table">
        <thead><tr>
          <th>KZ-ID</th><th>Title</th><th>Category</th><th>Priority</th>
          <th>Status</th><th>Owner</th><th>Due Date</th><th>Actions / Description</th>
        </tr></thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="font-family:monospace;font-size:8.5pt;">${item.kzId || item.id.slice(0,6).toUpperCase()}</td>
              <td style="font-weight:600;">${item.title}</td>
              <td>${item.category}</td>
              <td><span class="badge badge-${item.priority === 'critical' ? 'critical' : item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low'}">${item.priority.toUpperCase()}</span></td>
              <td><span class="badge badge-${item.status === 'complete' || item.status === 'verified' ? 'complete' : 'open'}">${item.status.replace('-', ' ').toUpperCase()}</span></td>
              <td>${item.owner || '—'}</td>
              <td>${item.dueDate || '—'}</td>
              <td style="font-size:9pt;">${item.description ? item.description + '<br>' : ''}${item.actions.length ? '<strong>Actions:</strong> ' + item.actions.join(' · ') : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>3. Category Distribution Analysis</h2>
      <table class="data-table">
        <thead><tr><th>Category</th><th>Count</th><th>% of Total</th><th>Open Items</th></tr></thead>
        <tbody>
          ${['Safety','Quality','Delivery','Cost','Morale','Environment','Productivity','5S'].map(cat => {
            const catItems = items.filter(i => i.category === cat)
            if (!catItems.length) return ''
            const catOpen = catItems.filter(i => i.status === 'open' || i.status === 'in-progress').length
            return `<tr>
              <td>${cat}</td>
              <td>${catItems.length}</td>
              <td>${((catItems.length / Math.max(items.length,1)) * 100).toFixed(0)}%</td>
              <td>${catOpen}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>

      <h2>4. Improvement Traceability</h2>
      <p>Per ISO 9001:2015 §10.2.2, evidence of improvement actions shall be retained as documented
      information. This register serves as the primary traceability record for all Kaizen activities
      at this process step. Actions marked "Verified" have been independently confirmed effective.</p>

      ${items.filter(i => i.priority === 'critical' || i.priority === 'high').length > 0 ? `
      <h2>5. Escalation Register — High Priority Items</h2>
      <div class="obs-box waste">
        <div class="obs-label">⚠ Items Requiring Management Attention</div>
        ${items.filter(i => i.priority === 'critical' || i.priority === 'high').map(item => `
          <p><strong>[${item.kzId || item.id.slice(0,6).toUpperCase()}] ${item.title}</strong>
          — Priority: ${item.priority.toUpperCase()} | Status: ${item.status.toUpperCase()} | Owner: ${item.owner || 'Unassigned'} | Due: ${item.dueDate || 'Not set'}
          ${item.description ? '<br>' + item.description : ''}</p>
        `).join('')}
      </div>` : ''}
    `

    openISOReport(body, {
      title: 'Kaizen Event Log — Continuous Improvement Register',
      toolType: 'KAIZEN',
      projectName: stepName,
      stepName: 'Process Step Analysis',
      revision: 'Rev. A',
      preparedBy: 'VeSiMy CI Platform',
    })
  }

  const counts = useMemo(
    () => ({
      open: items.filter(i => i.status === 'open').length,
      'in-progress': items.filter(i => i.status === 'in-progress').length,
      complete: items.filter(i => i.status === 'complete').length,
      verified: items.filter(i => i.status === 'verified').length,
    }),
    [items]
  )

  function openNew() {
    setForm({ ...BLANK })
    setNewAct('')
    setEditId('new')
  }

  function openEdit(item: KaizenItem) {
    setForm({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Quality',
      priority: item.priority || 'medium',
      status: item.status || 'open',
      owner: item.owner || '',
      dueDate: item.dueDate || '',
      actions: item.actions || [],
    })
    setNewAct('')
    setEditId(item.id)
  }

  function saveItem() {
    if (!form.title.trim()) return

    if (editId === 'new') {
      const num = String(items.length + 1).padStart(3, '0')
      setItems(prev => [
        ...prev,
        {
          ...form,
          id: uid(),
          kzId: `KZ-${num}`,
          created: Date.now(),
        } as KaizenItem,
      ])
    } else {
      setItems(prev =>
        prev.map(it =>
          it.id === editId
            ? { ...it, ...form }
            : it
        )
      )
    }

    setEditId(null)
    setForm({ ...BLANK })
    setNewAct('')
  }

  function deleteItem(id: string) {
    setItems(prev => prev.filter(it => it.id !== id))
    if (expanded === id) setExpanded(null)
    if (editId === id) {
      setEditId(null)
      setForm({ ...BLANK })
      setNewAct('')
    }
  }

  function addAction() {
    if (!newAct.trim()) return
    setForm(f => ({ ...f, actions: [...f.actions, newAct.trim()] }))
    setNewAct('')
  }

  async function handleSave() {
    setSaving(true)
    const payload = { items, savedAt: Date.now() }

    try {
      await onSave(payload)
      showToast(`Kaizen saved (${items.length} event${items.length !== 1 ? 's' : ''})`, 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={`⚡ Kaizen Tracker — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : `Save (${items.length} event${items.length !== 1 ? 's' : ''})`}
      disableSave={saving}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STATUSES.map(s => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  padding: '4px 9px',
                  borderRadius: 999,
                  background: `${STATUS_COLOR[s]}18`,
                  color: STATUS_COLOR[s],
                  border: `1px solid ${STATUS_COLOR[s]}33`,
                }}
              >
                {sLabel[s]} ({counts[s]})
              </span>
            ))}
          </div>

          <button onClick={openNew} className="btn btn-primary btn-sm">
            + New Event
          </button>
          {items.length > 0 && (
            <button
              onClick={exportKaizenISO}
              style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer' }}
            >
              📄 ISO Report
            </button>
          )}
        </div>

        {editId && (
          <div
            style={{
              background: 'rgba(212,162,8,0.04)',
              border: '1px solid rgba(212,162,8,0.2)',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 12, fontSize: 13 }}>
              {editId === 'new' ? '+ New Kaizen Event' : `Editing: ${items.find(i => i.id === editId)?.kzId}`}
            </div>

            <div className="vesimy-mobile-grid">
              <div style={{ gridColumn: '1/-1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label className="label" style={{ margin: 0 }}>Title *</label>
                  <AIAssistButton
                    label="AI Draft"
                    loading={aiLoading}
                    small
                    onClick={() => aiAssist('kaizen_draft', {
                      finding: form.title || form.description || 'process improvement',
                      stepName,
                      principle: form.category,
                    })}
                  />
                </div>
                {aiResult && typeof aiResult === 'object' && (
                  <AIResultPanel
                    result="AI draft ready — click Apply to fill the form."
                    source={aiSource} error={aiError} onClear={aiClear}
                    useLabel="Apply draft"
                    onUse={(r: any) => {
                      if (r && typeof r === 'object') {
                        setForm((f: any) => ({
                          ...f,
                          title: r.title || f.title,
                          description: r.description || f.description,
                          category: r.category || f.category,
                          priority: r.priority || f.priority,
                        }))
                      }
                      aiClear()
                    }}
                  />
                )}
                <input
                  className="input"
                  placeholder="Kaizen event title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label className="label">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="What needs to be improved?"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Priority</label>
                <select
                  className="input"
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                >
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>
                      {sLabel[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Owner</label>
                <input
                  className="input"
                  placeholder="Team member name"
                  value={form.owner}
                  onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Due Date</label>
                <input
                  className="input"
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label className="label">Actions</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    placeholder="Add action item"
                    value={newAct}
                    onChange={e => setNewAct(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addAction()}
                    style={{ flex: 1 }}
                  />
                  <button onClick={addAction} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                    +
                  </button>
                </div>

                {form.actions.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {form.actions.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 10px',
                          borderRadius: 8,
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          fontSize: 12,
                          color: 'var(--text2)',
                        }}
                      >
                        <span style={{ flex: 1 }}>• {a}</span>
                        <button
                          onClick={() =>
                            setForm(f => ({
                              ...f,
                              actions: f.actions.filter((_, j) => j !== i),
                            }))
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text3)',
                            cursor: 'pointer',
                            fontSize: 14,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <button onClick={saveItem} disabled={!form.title.trim()} className="btn btn-primary btn-sm">
                {editId === 'new' ? 'Add Event' : 'Update Event'}
              </button>
              <button
                onClick={() => {
                  setEditId(null)
                  setForm({ ...BLANK })
                  setNewAct('')
                }}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
            <p style={{ fontSize: 13 }}>
              No kaizen events yet. Add one to track improvement activities.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                  }}
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                >
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace', flexShrink: 0 }}>
                    {item.kzId}
                  </span>

                  <span style={{ flex: 1, minWidth: 140, fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                    {item.title}
                  </span>

                  <span
                    style={{
                      fontSize: 10,
                      padding: '3px 7px',
                      borderRadius: 999,
                      background: `${STATUS_COLOR[item.status]}18`,
                      color: STATUS_COLOR[item.status],
                      border: `1px solid ${STATUS_COLOR[item.status]}33`,
                      flexShrink: 0,
                    }}
                  >
                    {sLabel[item.status]}
                  </span>

                  <span
                    style={{
                      fontSize: 10,
                      padding: '3px 7px',
                      borderRadius: 999,
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text2)',
                      flexShrink: 0,
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.priority}
                  </span>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      openEdit(item)
                    }}
                    className="btn btn-ghost btn-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      deleteItem(item.id)
                    }}
                    className="btn btn-danger btn-xs"
                  >
                    Delete
                  </button>
                </div>

                {expanded === item.id && (
                  <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                    {item.description && (
                      <p style={{ fontSize: 12, color: 'var(--text2)', margin: '10px 0', lineHeight: 1.6 }}>
                        {item.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
                      {item.category && <span>📁 {item.category}</span>}
                      {item.owner && <span>👤 {item.owner}</span>}
                      {item.dueDate && <span>📅 {item.dueDate}</span>}
                    </div>

                    {item.actions.length > 0 && (
                      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {item.actions.map((a, i) => (
                          <div key={i} style={{ fontSize: 12, color: 'var(--text2)', padding: '2px 0' }}>
                            • {a}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}