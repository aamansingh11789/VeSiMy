// @ts-nocheck
'use client'
// ── components/tools/KanbanBoard.tsx ────────────────────────────────────────
// Production Kanban Board
// - Columns map to VSM process steps (or stand-alone: Backlog / Done)
// - WIP limits enforced with visual warnings
// - Cards have priority, assignee, due date, blocked state, tags
// - Drag-drop cards between columns
// - Inline card creation per column
// - One-click "seed from VSM steps" to auto-create columns

import { useState } from 'react'
import type { KanbanColumn, KanbanCard, KanbanPriority, Step } from '@/lib/store'
import {
  createKanbanColumn, updateKanbanColumn, deleteKanbanColumn,
  createKanbanCard, updateKanbanCard, moveKanbanCard, deleteKanbanCard,
  seedDefaultKanbanColumns,
} from '@/lib/db'

// ── Colours & labels ──────────────────────────────────────────────────────────
const PRIORITY_COLOR: Record<KanbanPriority, string> = {
  critical: '#FF6B6B',
  high:     '#F4A623',
  normal:   '#1090D4',
  low:      '#7070A0',
}
const PRIORITY_DOT: Record<KanbanPriority, string> = {
  critical: '#FF6B6B',
  high:     '#F4A623',
  normal:   '#1090D4',
  low:      '#38385C',
}

const COL_COLORS = [
  '#28285C','#1090D4','#D4A208','#6426A0',
  '#1DD1A1','#F4A623','#E84393','#00BCD4','#FF6B6B',
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function isOverWIP(col: KanbanColumn): boolean {
  return !!(col.wip_limit && col.cards && col.cards.length > col.wip_limit)
}

function fmtDate(d: string): string {
  const dt   = new Date(d)
  const now  = new Date()
  const past = dt < now
  return `${past ? '⚠ ' : ''}${dt.toLocaleDateString('en-US', { month:'short', day:'numeric' })}`
}

// ── Card Form (inline) ────────────────────────────────────────────────────────
function CardForm({ onSave, onCancel, initialTitle }: {
  onSave:        (title: string, priority: KanbanPriority, assignee: string) => void
  onCancel:      () => void
  initialTitle?: string
}) {
  const [title,    setTitle]    = useState(initialTitle || '')
  const [priority, setPriority] = useState<KanbanPriority>('normal')
  const [assignee, setAssignee] = useState('')

  return (
    <div style={{
      background: '#03030D', border: '1px solid rgba(212,162,8,0.25)',
      borderRadius: 8, padding: 12, marginBottom: 8,
    }}>
      <textarea
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (title.trim()) onSave(title.trim(), priority, assignee) }
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Card title…"
        rows={2}
        style={{
          width: '100%', background: 'transparent', border: 'none', outline: 'none',
          color: '#EAE8F4', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
          resize: 'none', marginBottom: 8,
        }}
      />
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {(['critical','high','normal','low'] as KanbanPriority[]).map(p => (
          <button key={p} onClick={() => setPriority(p)} style={{
            padding: '3px 8px', border: 'none', borderRadius: 4, cursor: 'pointer',
            background: priority === p ? PRIORITY_COLOR[p] + '30' : 'transparent',
            color: PRIORITY_COLOR[p], fontSize: 10, fontWeight: 600,
            outline: priority === p ? `1px solid ${PRIORITY_COLOR[p]}` : 'none',
          }}>{p}</button>
        ))}
      </div>
      <input
        value={assignee}
        onChange={e => setAssignee(e.target.value)}
        placeholder="Assignee (optional)"
        style={{
          width: '100%', background: '#080818', border: '1px solid #1A1A40',
          borderRadius: 5, padding: '5px 8px', color: '#7070A0', fontSize: 12,
          fontFamily: 'DM Sans, sans-serif', outline: 'none', marginBottom: 8,
        }}
      />
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{
          background: 'none', border: '1px solid #1A1A40', borderRadius: 5,
          padding: '5px 12px', color: '#7070A0', fontSize: 12, cursor: 'pointer',
        }}>Cancel</button>
        <button
          disabled={!title.trim()}
          onClick={() => { if (title.trim()) onSave(title.trim(), priority, assignee) }}
          style={{
            background: 'linear-gradient(135deg,#C49510,#D4A208)', border: 'none',
            borderRadius: 5, padding: '5px 14px', color: '#03030D',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            opacity: title.trim() ? 1 : 0.4,
          }}>Add Card</button>
      </div>
    </div>
  )
}

// ── Column Form (modal-lite) ──────────────────────────────────────────────────
function ColumnForm({ initial, onSave, onCancel }: {
  initial?:  Partial<KanbanColumn>
  onSave:    (data: { title: string; color: string; wip_limit: number | null }) => void
  onCancel:  () => void
}) {
  const [title,    setTitle]    = useState(initial?.title    || '')
  const [color,    setColor]    = useState(initial?.color    || '#28285C')
  const [wipLimit, setWipLimit] = useState<string>(initial?.wip_limit?.toString() || '')

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(3,3,13,0.88)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onCancel}>
      <div style={{
        background: '#080818', border: '1px solid #28285C', borderRadius: 12,
        padding: 24, width: 380, maxWidth: 'calc(100vw - 48px)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#EAE8F4', marginBottom: 16 }}>
          {initial?.id ? 'Edit Column' : 'New Column'}
        </div>

        <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Column Title</label>
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '100%', background: '#03030D', border: '1px solid #1A1A40',
            borderRadius: 7, padding: '8px 10px', color: '#EAE8F4', fontSize: 13,
            fontFamily: 'DM Sans, sans-serif', outline: 'none', marginBottom: 14,
          }}
        />

        <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 6 }}>Colour</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {COL_COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{
              width: 24, height: 24, borderRadius: 6, background: c, cursor: 'pointer',
              outline: color === c ? `2px solid #EAE8F4` : 'none',
              outlineOffset: 2,
            }} />
          ))}
        </div>

        <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>
          WIP Limit <span style={{ color: '#38385C' }}>(leave blank = unlimited)</span>
        </label>
        <input
          type="number"
          min={1}
          value={wipLimit}
          onChange={e => setWipLimit(e.target.value)}
          placeholder="e.g. 5"
          style={{
            width: '100%', background: '#03030D', border: '1px solid #1A1A40',
            borderRadius: 7, padding: '8px 10px', color: '#EAE8F4', fontSize: 13,
            fontFamily: 'DM Sans, sans-serif', outline: 'none', marginBottom: 20,
          }}
        />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            background: 'none', border: '1px solid #1A1A40', borderRadius: 7,
            padding: '8px 16px', color: '#7070A0', fontSize: 13, cursor: 'pointer',
          }}>Cancel</button>
          <button
            disabled={!title.trim()}
            onClick={() => onSave({ title: title.trim(), color, wip_limit: wipLimit ? parseInt(wipLimit) : null })}
            style={{
              background: 'linear-gradient(135deg,#C49510,#D4A208)',
              border: 'none', borderRadius: 7, padding: '8px 18px',
              color: '#03030D', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              opacity: title.trim() ? 1 : 0.4,
            }}>
            {initial?.id ? 'Save' : 'Create Column'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Card Detail Modal ────────────────────────────────────────────────────────
function CardDetail({ card, columns, onUpdate, onMove, onDelete, onClose }: {
  card:      KanbanCard
  columns:   KanbanColumn[]
  onUpdate:  (id: string, updates: Partial<KanbanCard>) => void
  onMove:    (cardId: string, toColumnId: string) => void
  onDelete:  (id: string) => void
  onClose:   () => void
}) {
  const [form, setForm] = useState({ ...card })
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    const t = tagInput.trim()
    if (!t || form.tags?.includes(t)) return
    setForm(f => ({ ...f, tags: [...(f.tags || []), t] }))
    setTagInput('')
  }
  const removeTag = (t: string) => setForm(f => ({ ...f, tags: f.tags?.filter(x => x !== t) }))

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(3,3,13,0.9)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#0D0D22', border: '1px solid #28285C', borderRadius: 12,
        padding: 24, width: 540, maxWidth: '100%', maxHeight: '90vh',
        overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#38385C' }}>
            {card.id.slice(0, 8).toUpperCase()}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#7070A0', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>

        {/* Title */}
        <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Title</label>
        <textarea
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          rows={2}
          style={{
            width: '100%', background: '#080818', border: '1px solid #1A1A40',
            borderRadius: 7, padding: '8px 10px', color: '#EAE8F4', fontSize: 14,
            fontFamily: 'DM Sans, sans-serif', resize: 'none', outline: 'none', marginBottom: 14,
          }}
        />

        {/* Description */}
        <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Description</label>
        <textarea
          value={form.description || ''}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          placeholder="Add details, context, or acceptance criteria…"
          style={{
            width: '100%', background: '#080818', border: '1px solid #1A1A40',
            borderRadius: 7, padding: '8px 10px', color: '#EAE8F4', fontSize: 13,
            fontFamily: 'DM Sans, sans-serif', resize: 'none', outline: 'none', marginBottom: 14,
          }}
        />

        {/* Priority + Assignee + Due */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Priority</label>
            <select
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value as KanbanPriority }))}
              style={{
                width: '100%', background: '#080818', border: '1px solid #1A1A40',
                borderRadius: 6, padding: '7px 8px', color: PRIORITY_COLOR[form.priority],
                fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none',
              }}>
              {(['critical','high','normal','low'] as KanbanPriority[]).map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Assignee</label>
            <input
              value={form.assignee || ''}
              onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
              style={{
                width: '100%', background: '#080818', border: '1px solid #1A1A40',
                borderRadius: 6, padding: '7px 8px', color: '#EAE8F4',
                fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Due Date</label>
            <input
              type="date"
              value={form.due_date || ''}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              style={{
                width: '100%', background: '#080818', border: '1px solid #1A1A40',
                borderRadius: 6, padding: '7px 8px', color: '#EAE8F4',
                fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Move to column */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Move to Column</label>
          <select
            value={form.column_id}
            onChange={e => {
              const newCol = e.target.value
              setForm(f => ({ ...f, column_id: newCol }))
              onMove(card.id, newCol)
            }}
            style={{
              width: '100%', background: '#080818', border: '1px solid #1A1A40',
              borderRadius: 6, padding: '7px 8px', color: '#EAE8F4',
              fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none',
            }}>
            {columns.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Blocked reason */}
        <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>
          Blocked Reason <span style={{ color: '#38385C' }}>(leave blank if not blocked)</span>
        </label>
        <input
          value={form.blocked_reason || ''}
          onChange={e => setForm(f => ({ ...f, blocked_reason: e.target.value }))}
          placeholder="What is blocking this card?"
          style={{
            width: '100%', background: '#080818', border: '1px solid #1A1A40',
            borderRadius: 6, padding: '7px 8px', color: '#EAE8F4',
            fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none', marginBottom: 14,
          }}
        />

        {/* Tags */}
        <label style={{ fontSize: 11, color: '#7070A0', display: 'block', marginBottom: 4 }}>Tags</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          {(form.tags || []).map(t => (
            <span key={t} style={{
              background: 'rgba(100,38,160,0.15)', border: '1px solid rgba(100,38,160,0.3)',
              borderRadius: 100, padding: '2px 8px', fontSize: 11, color: '#8C44CC',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {t}
              <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#38385C', fontSize: 12 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="Add tag…"
            style={{
              flex: 1, background: '#080818', border: '1px solid #1A1A40',
              borderRadius: 6, padding: '6px 8px', color: '#EAE8F4',
              fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none',
            }}
          />
          <button onClick={addTag} style={{
            background: 'rgba(100,38,160,0.1)', border: '1px solid rgba(100,38,160,0.3)',
            borderRadius: 6, padding: '6px 12px', color: '#8C44CC',
            fontSize: 12, cursor: 'pointer',
          }}>＋</button>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => { if (confirm('Delete this card?')) onDelete(card.id) }} style={{
            background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)',
            borderRadius: 7, padding: '8px 14px', color: '#FF6B6B', fontSize: 13, cursor: 'pointer',
          }}>🗑 Delete</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{
              background: 'none', border: '1px solid #1A1A40', borderRadius: 7,
              padding: '8px 16px', color: '#7070A0', fontSize: 13, cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={() => { onUpdate(card.id, form); onClose() }} style={{
              background: 'linear-gradient(135deg,#C49510,#D4A208)',
              border: 'none', borderRadius: 7, padding: '8px 18px',
              color: '#03030D', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN KANBAN BOARD COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
interface KanbanBoardProps {
  projectId:  string
  steps:      Step[]
  columns:    KanbanColumn[]
  onColumnsChange: (cols: KanbanColumn[]) => void
  showToast:  (msg: string, type?: 'success' | 'error' | 'info') => void
}

export function KanbanBoard({
  projectId, steps, columns, onColumnsChange, showToast,
}: KanbanBoardProps) {
  const [colForm,    setColForm]    = useState<{ open: boolean; editing?: KanbanColumn }>({ open: false })
  const [addingCard, setAddingCard] = useState<string | null>(null)     // column id
  const [detail,     setDetail]     = useState<KanbanCard | null>(null)
  const [dragCard,   setDragCard]   = useState<{ card: KanbanCard; fromCol: string } | null>(null)
  const [dragOver,   setDragOver]   = useState<string | null>(null)     // column id
  const [seeding,    setSeeding]    = useState(false)

  // Total cards across all columns
  const totalCards  = columns.reduce((a, c) => a + (c.cards?.length || 0), 0)
  const blockedCards = columns.reduce((a, c) => a + (c.cards?.filter(cd => cd.blocked_reason).length || 0), 0)
  const overWIP     = columns.filter(isOverWIP).length

  // ── Column CRUD ─────────────────────────────────────────────────────────────
  const handleCreateCol = async (data: { title: string; color: string; wip_limit: number | null }) => {
    try {
      const col = await createKanbanColumn(projectId, { ...data })
      onColumnsChange([...columns, col])
      setColForm({ open: false })
      showToast('Column created', 'success')
    } catch { showToast('Failed to create column', 'error') }
  }

  const handleUpdateCol = async (data: { title: string; color: string; wip_limit: number | null }) => {
    if (!colForm.editing) return
    try {
      await updateKanbanColumn(colForm.editing.id, data)
      onColumnsChange(columns.map(c => c.id === colForm.editing!.id ? { ...c, ...data } : c))
      setColForm({ open: false })
      showToast('Column saved', 'success')
    } catch { showToast('Failed to save column', 'error') }
  }

  const handleDeleteCol = async (col: KanbanColumn) => {
    if (!confirm(`Delete column "${col.title}" and all its cards?`)) return
    try {
      await deleteKanbanColumn(col.id)
      onColumnsChange(columns.filter(c => c.id !== col.id))
      showToast('Column deleted', 'info')
    } catch { showToast('Failed to delete column', 'error') }
  }

  // ── Card CRUD ────────────────────────────────────────────────────────────────
  const handleCreateCard = async (colId: string, title: string, priority: KanbanPriority, assignee: string) => {
    try {
      const card = await createKanbanCard(projectId, colId, { title, priority, assignee: assignee || undefined })
      onColumnsChange(columns.map(c =>
        c.id === colId ? { ...c, cards: [...(c.cards || []), card] } : c
      ))
      setAddingCard(null)
      showToast('Card added', 'success')
    } catch { showToast('Failed to add card', 'error') }
  }

  const handleUpdateCard = async (cardId: string, updates: Partial<KanbanCard>) => {
    try {
      await updateKanbanCard(cardId, updates)
      onColumnsChange(columns.map(c => ({
        ...c,
        cards: (c.cards || []).map(cd => cd.id === cardId ? { ...cd, ...updates } : cd),
      })))
      showToast('Card saved', 'success')
    } catch { showToast('Failed to save card', 'error') }
  }

  const handleMoveCard = async (cardId: string, toColumnId: string) => {
    const toCol    = columns.find(c => c.id === toColumnId)
    const toPos    = toCol?.cards?.length || 0
    try {
      await moveKanbanCard(cardId, toColumnId, toPos)
      let movedCard: KanbanCard | undefined
      const newCols = columns.map(c => {
        const filtered = (c.cards || []).filter(cd => {
          if (cd.id === cardId) { movedCard = cd; return false }
          return true
        })
        return { ...c, cards: filtered }
      })
      if (movedCard) {
        const updated = { ...movedCard, column_id: toColumnId }
        onColumnsChange(newCols.map(c =>
          c.id === toColumnId ? { ...c, cards: [...(c.cards || []), updated] } : c
        ))
      }
    } catch { showToast('Move failed', 'error') }
  }

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteKanbanCard(cardId)
      onColumnsChange(columns.map(c => ({
        ...c, cards: (c.cards || []).filter(cd => cd.id !== cardId),
      })))
      setDetail(null)
      showToast('Card deleted', 'info')
    } catch { showToast('Failed to delete card', 'error') }
  }

  // ── Drag-drop ────────────────────────────────────────────────────────────────
  const handleDrop = async (toColId: string) => {
    if (!dragCard || dragCard.fromCol === toColId) { setDragCard(null); setDragOver(null); return }
    await handleMoveCard(dragCard.card.id, toColId)
    setDragCard(null)
    setDragOver(null)
  }

  // ── Seed from VSM steps ───────────────────────────────────────────────────────
  const handleSeed = async () => {
    if (!confirm('This will create one column per VSM step, plus a Backlog and Done column. Continue?')) return
    setSeeding(true)
    try {
      const cols = await seedDefaultKanbanColumns(projectId, steps.map(s => ({ id: s.id, name: s.name })))
      onColumnsChange(cols)
      showToast('Kanban board seeded from VSM steps!', 'success')
    } catch { showToast('Failed to seed board', 'error') }
    setSeeding(false)
  }

  // ── Empty state ───────────────────────────────────────────────────────────────
  if (columns.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>▦</div>
        <div style={{ fontFamily: 'Palatino Linotype,Georgia,serif', fontSize: 22, fontWeight: 700, color: '#EAE8F4', marginBottom: 8 }}>
          Your Kanban board is empty
        </div>
        <div style={{ fontSize: 14, color: '#7070A0', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Kanban tracks live work orders flowing through your process steps — with WIP limits,
          blocked-card alerts, and real-time bottleneck visibility.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {steps.length > 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              style={{
                background: 'linear-gradient(135deg,#C49510,#D4A208)',
                border: 'none', borderRadius: 10, padding: '12px 24px',
                color: '#03030D', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
              {seeding ? '⏳ Setting up…' : '⊞ Auto-create from VSM Steps'}
            </button>
          )}
          <button
            onClick={() => setColForm({ open: true })}
            style={{
              background: 'rgba(8,8,24,0.9)', border: '1px solid #28285C',
              borderRadius: 10, padding: '12px 24px', color: '#EAE8F4',
              fontSize: 14, cursor: 'pointer',
            }}>
            ＋ Create Column Manually
          </button>
        </div>
      </div>
    )
  }

  // ── Board ────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Board header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'Palatino Linotype,Georgia,serif', fontSize: 20, fontWeight: 700, color: '#EAE8F4', marginBottom: 4 }}>
            Production Kanban Board
          </div>
          <div style={{ fontSize: 11, color: '#7070A0', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span>{totalCards} cards · {columns.length} columns</span>
            {blockedCards > 0 && <span style={{ color: '#FF6B6B' }}>⚠ {blockedCards} blocked</span>}
            {overWIP > 0     && <span style={{ color: '#F4A623' }}>⚠ {overWIP} over WIP limit</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {steps.length > 0 && columns.length === 0 && (
            <button onClick={handleSeed} disabled={seeding} style={{
              background: 'rgba(212,162,8,0.1)', border: '1px solid rgba(212,162,8,0.3)',
              borderRadius: 7, padding: '7px 14px', color: '#D4A208',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>⊞ Seed from VSM</button>
          )}
          <button onClick={() => setColForm({ open: true })} style={{
            background: 'linear-gradient(135deg,#C49510,#D4A208)',
            border: 'none', borderRadius: 7, padding: '7px 14px',
            color: '#03030D', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>＋ Add Column</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16,
        padding: '8px 12px', background: 'rgba(8,8,24,0.7)',
        border: '1px solid #1A1A40', borderRadius: 8, fontSize: 11,
      }}>
        {(['critical','high','normal','low'] as KanbanPriority[]).map(p => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5, color: PRIORITY_COLOR[p] }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_DOT[p] }} />
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', color: '#38385C' }}>Drag cards between columns · Click to edit</div>
      </div>

      {/* Scrollable columns */}
      <div style={{
        display: 'flex', gap: 14, overflowX: 'auto',
        paddingBottom: 16, alignItems: 'flex-start',
      }}>
        {columns.map(col => {
          const over   = isOverWIP(col)
          const isDrop = dragOver === col.id
          const cards  = col.cards || []

          return (
            <div
              key={col.id}
              style={{ minWidth: 220, maxWidth: 260, flexShrink: 0 }}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(col.id)}>

              {/* Column header */}
              <div style={{
                background: isDrop ? `${col.color}18` : '#0D0D22',
                border: `1px solid ${isDrop ? col.color : over ? '#F4A623' : '#1A1A40'}`,
                borderRadius: '10px 10px 0 0',
                padding: '10px 12px',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: col.color }} />
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#EAE8F4' }}>{col.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <button onClick={() => setColForm({ open: true, editing: col })}
                      style={{ background: 'none', border: 'none', color: '#38385C', cursor: 'pointer', fontSize: 12 }}>✎</button>
                    <button onClick={() => handleDeleteCol(col)}
                      style={{ background: 'none', border: 'none', color: '#38385C', cursor: 'pointer', fontSize: 12 }}>✕</button>
                  </div>
                </div>

                {/* WIP indicator */}
                <div style={{ fontSize: 10, fontFamily: 'monospace', display: 'flex', gap: 8 }}>
                  <span style={{ color: over ? '#F4A623' : '#38385C' }}>
                    {cards.length}{col.wip_limit ? `/${col.wip_limit}` : ''} {over ? '⚠ OVER' : ''}
                  </span>
                  {col.step_id && <span style={{ color: '#38385C' }}>· Linked</span>}
                </div>

                {/* WIP bar */}
                {col.wip_limit && (
                  <div style={{ height: 3, background: '#1A1A40', borderRadius: 2, marginTop: 6 }}>
                    <div style={{
                      height: 3, borderRadius: 2,
                      width: `${Math.min(100, (cards.length / col.wip_limit) * 100)}%`,
                      background: over ? '#F4A623' : col.color,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                )}
              </div>

              {/* Cards */}
              <div style={{
                background: '#080818',
                border: `1px solid ${isDrop ? col.color : '#1A1A40'}`,
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding: 8,
                minHeight: 80,
                transition: 'border-color 0.15s',
              }}>
                {cards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDragCard({ card, fromCol: col.id })}
                    onDragEnd={() => { setDragCard(null); setDragOver(null) }}
                    onClick={() => setDetail(card)}
                    style={{
                      background: card.blocked_reason ? 'rgba(255,107,107,0.05)' : '#03030D',
                      border: `1px solid ${card.blocked_reason ? 'rgba(255,107,107,0.35)' : '#1A1A40'}`,
                      borderRadius: 7, padding: '9px 10px', marginBottom: 6,
                      cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = card.blocked_reason ? '#FF6B6B' : col.color)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = card.blocked_reason ? 'rgba(255,107,107,0.35)' : '#1A1A40')}>

                    {/* Priority dot */}
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 7, height: 7, borderRadius: '50%',
                      background: PRIORITY_DOT[card.priority],
                    }} />

                    <div style={{ fontSize: 12, fontWeight: 600, color: '#EAE8F4', marginBottom: 5, paddingRight: 14, lineHeight: 1.4 }}>
                      {card.title}
                    </div>

                    {/* Tags */}
                    {card.tags && card.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                        {card.tags.map(t => (
                          <span key={t} style={{
                            background: 'rgba(100,38,160,0.15)', color: '#8C44CC',
                            fontSize: 9, padding: '1px 5px', borderRadius: 3,
                          }}>{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Meta row */}
                    <div style={{ display: 'flex', gap: 8, fontSize: 10, color: '#38385C', flexWrap: 'wrap' }}>
                      {card.assignee && <span>👤 {card.assignee}</span>}
                      {card.due_date  && <span style={{ color: new Date(card.due_date) < new Date() ? '#FF6B6B' : '#38385C' }}>📅 {fmtDate(card.due_date)}</span>}
                      {card.blocked_reason && <span style={{ color: '#FF6B6B' }}>🔒 Blocked</span>}
                    </div>
                  </div>
                ))}

                {/* Add card */}
                {addingCard === col.id ? (
                  <CardForm
                    onSave={(title, priority, assignee) => handleCreateCard(col.id, title, priority, assignee)}
                    onCancel={() => setAddingCard(null)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingCard(col.id)}
                    style={{
                      width: '100%', background: 'none', border: '1px dashed #1A1A40',
                      borderRadius: 6, padding: '7px 0', color: '#38385C',
                      fontSize: 12, cursor: 'pointer', marginTop: 2, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = col.color; e.currentTarget.style.color = col.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A1A40'; e.currentTarget.style.color = '#38385C' }}>
                    ＋ Add card
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* Add column button */}
        <button
          onClick={() => setColForm({ open: true })}
          style={{
            minWidth: 180, height: 48, background: 'rgba(8,8,24,0.5)',
            border: '1px dashed #1A1A40', borderRadius: 10, color: '#38385C',
            fontSize: 13, cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4A208'; e.currentTarget.style.color = '#D4A208' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A1A40'; e.currentTarget.style.color = '#38385C' }}>
          ＋ Add Column
        </button>
      </div>

      {/* Modals */}
      {colForm.open && (
        <ColumnForm
          initial={colForm.editing}
          onSave={colForm.editing ? handleUpdateCol : handleCreateCol}
          onCancel={() => setColForm({ open: false })}
        />
      )}

      {detail && (
        <CardDetail
          card={detail}
          columns={columns}
          onUpdate={handleUpdateCard}
          onMove={handleMoveCard}
          onDelete={handleDeleteCard}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  )
}
