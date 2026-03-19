// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

interface JournalEntry {
  id: string
  type: 'note' | 'auto' | 'milestone'
  content: string
  created_at: string
  metadata?: Record<string, any>
}

interface ProcessJournalProps {
  projectId: string
  open: boolean
  onClose: () => void
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export function ProcessJournal({ projectId, open, onClose }: ProcessJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!open || !projectId) return
    loadEntries()
  }, [open, projectId])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries, open])

  async function loadEntries() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: dbError } = await supabase
        .from('process_journal')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (dbError) {
        // Table may not exist yet — show graceful empty state
        console.warn('[Journal] DB error:', dbError.message)
        setError('journal_unavailable')
      } else if (data) {
        setEntries(data)
      }
    } catch (e) {
      setError('journal_unavailable')
    }
    setLoading(false)
  }

  async function addNote() {
    if (!note.trim()) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setSaving(false); return }

      const newEntry = {
        id: Date.now().toString(),
        type: 'note' as const,
        content: note.trim(),
        created_at: new Date().toISOString(),
        project_id: projectId,
      }

      const { data, error: dbError } = await supabase
        .from('process_journal')
        .insert({ project_id: projectId, user_id: user.id, type: 'note', content: note.trim() })
        .select()
        .single()

      if (dbError) {
        // Fallback: save locally in state so user sees their note
        setEntries(prev => [...prev, newEntry])
        setNote('')
        setError('journal_local')
      } else if (data) {
        setEntries(prev => [...prev, data])
        setNote('')
      }
    } catch (e) {
      setNote('')
    }
    setSaving(false)
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function tagStyle(type: string) {
    if (type === 'auto') return { bg: 'rgba(108,185,252,0.12)', color: '#6CB9FC', label: 'AUTO' }
    if (type === 'milestone') return { bg: 'rgba(212,162,8,0.12)', color: '#D4A208', label: 'MILESTONE' }
    return { bg: 'rgba(139,136,179,0.12)', color: 'var(--text2)', label: 'NOTE' }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(1,1,6,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 10001,
        width: 'min(420px, 100vw)',
        background: 'linear-gradient(180deg, var(--sl-50), rgba(248,247,245,0.97))',
        border: '1px solid rgba(44,44,92,0.86)',
        borderRight: 'none',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px 14px',
          borderBottom: '1px solid rgba(44,44,92,0.6)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>📓</span>
              <span style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
                Process Journal
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>
              Everything that happens to this process, recorded.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 18, cursor: 'pointer', padding: '4px 6px' }}
          >
            ✕
          </button>
        </div>

        {/* Entries */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 12,
          WebkitOverflowScrolling: 'touch',
        }}>
          {loading && (
            <div style={{ textAlign: 'center', color: 'var(--sl-400)', fontSize: 13, padding: '40px 0' }}>
              Loading journal…
            </div>
          )}

          {error === 'journal_unavailable' && (
            <div style={{ textAlign: 'center', padding: '32px 24px', background: 'rgba(212,162,8,0.06)', borderRadius: 12, border: '1px solid rgba(212,162,8,0.2)' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>📓</div>
              <div style={{ fontWeight: 600, color: 'var(--text2)', fontSize: 14, marginBottom: 6 }}>Journal table needs to be set up</div>
              <p style={{ fontSize: 12, color: 'var(--sl-400)', lineHeight: 1.7 }}>
                Run migration <strong>007_process_journal.sql</strong> in your Supabase dashboard to activate the journal. Notes you add below will be saved locally until then.
              </p>
            </div>
          )}

          {!loading && error !== 'journal_unavailable' && entries.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: 'transparent', borderRadius: 12,
              border: '1px dashed rgba(44,44,92,0.6)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>📝</div>
              <div style={{ fontWeight: 600, color: 'var(--text2)', fontSize: 14, marginBottom: 6 }}>
                Nothing recorded yet
              </div>
              <p style={{ fontSize: 12, color: 'var(--sl-400)', lineHeight: 1.7 }}>
                Add your first note below. As you use your CI tools, VeSiMy will start
                auto-logging changes here automatically.
              </p>
            </div>
          )}

          {entries.map((entry) => {
            const tag = tagStyle(entry.type)
            return (
              <div
                key={entry.id}
                style={{
                  background: 'rgba(248,247,245,0.97)',
                  border: '1px solid rgba(44,44,92,0.5)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                    background: tag.bg, color: tag.color,
                    fontFamily: 'monospace', letterSpacing: 1.5,
                  }}>
                    {tag.label}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--sl-400)', fontFamily: 'monospace', flexShrink: 0 }}>
                    {formatDate(entry.created_at)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#B8B5D1', lineHeight: 1.65, margin: 0 }}>
                  {entry.content}
                </p>
                {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {Object.entries(entry.metadata).map(([k, v]) => (
                      <span key={k} style={{ fontSize: 10, color: 'var(--sl-400)', background: 'transparent', border: '1px solid rgba(44,44,92,0.4)', borderRadius: 6, padding: '2px 8px' }}>
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(44,44,92,0.6)',
          background: 'rgba(248,247,245,0.97)',
          flexShrink: 0,
          paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote() }}
              placeholder="Add a note, observation, or decision…"
              rows={2}
              style={{
                flex: 1, background: 'transparent',
                border: '1px solid rgba(44,44,92,0.6)', borderRadius: 10,
                color: 'var(--text)', fontSize: 13, padding: '10px 12px',
                fontFamily: 'Inter, sans-serif', resize: 'none', lineHeight: 1.5,
                outline: 'none',
              }}
            />
            <button
              onClick={addNote}
              disabled={saving || !note.trim()}
              style={{
                padding: '0 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: note.trim() ? 'linear-gradient(135deg,#C49510,#D4A208)' : 'transparent',
                color: note.trim() ? 'var(--bg)' : 'var(--sl-400)',
                fontWeight: 700, fontSize: 18, transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {saving ? '…' : '↑'}
            </button>
          </div>
          <p style={{ fontSize: 10, color: 'var(--sl-400)', marginTop: 6 }}>
            ⌘ + Enter to save · Auto-logging coming in next update
          </p>
        </div>
      </div>
    </>
  )
}

export default ProcessJournal
