// TypeScript enabled
// ── app/project/[id]/history/VersionHistoryClient.tsx ────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const BRAND = '#0176D3'
const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'
const mono  = '"JetBrains Mono","IBM Plex Mono",monospace'

interface Snapshot {
  id: string
  version_number: number
  label: string | null
  description: string | null
  step_count: number
  total_ct: number | null
  total_wait: number | null
  pce: number | null
  created_at: string
}

interface Props {
  project: { id: string; name: string; created_at: string }
  snapshots: Snapshot[]
  isPaid: boolean
}

function fmtTime(s: number | null) {
  if (!s) return '—'
  if (s >= 3600) return `${(s / 3600).toFixed(1)}h`
  if (s >= 60)   return `${(s / 60).toFixed(0)}m`
  return `${Math.round(s)}s`
}

function SaveSnapshotModal({ projectId, onSaved, onClose }: { projectId: string; onSaved: () => void; onClose: () => void }) {
  const [label, setLabel] = useState('')
  const [desc,  setDesc]  = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label || undefined, description: desc || undefined }),
      })
      if (res.ok) {
        toast.success('Snapshot saved')
        onSaved()
        onClose()
      } else {
        toast.error('Could not save snapshot')
      }
    } catch {
      toast.error('Connection error')
    } finally {
      setSaving(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 7,
    background: 'var(--bg)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
    boxSizing: 'border-box' as const, outline: 'none',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, width: '100%', maxWidth: 440 }}>
        <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Save Version Snapshot</div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontFamily: mono, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>SNAPSHOT LABEL</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Before SMED kaizen, Baseline v1" style={inp} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontFamily: mono, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>NOTES (optional)</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
            placeholder="What is the state of this version?" style={{ ...inp, resize: 'vertical' as const }} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: '9px 20px', borderRadius: 7, border: 'none', background: BRAND, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            {saving ? 'Saving…' : 'Save snapshot'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VersionHistoryClient({ project, snapshots: initialSnapshots, isPaid }: Props) {
  const [snapshots,   setSnapshots]   = useState(initialSnapshots)
  const [showSave,    setShowSave]    = useState(false)
  const [compareA,    setCompareA]    = useState<string | null>(null)
  const [compareB,    setCompareB]    = useState<string | null>(null)

  const snapshotA = snapshots.find(s => s.id === compareA)
  const snapshotB = snapshots.find(s => s.id === compareB)

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px)', maxWidth: 860, margin: '0 auto' }}>
      {showSave && (
        <SaveSnapshotModal projectId={project.id}
          onSaved={() => window.location.reload()}
          onClose={() => setShowSave(false)} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <Link href={`/project/${project.id}`} style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}>
            ← Back to {project.name}
          </Link>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Version History
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 14, margin: '6px 0 0' }}>
            {project.name} · Created {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
        {isPaid && (
          <button onClick={() => setShowSave(true)} style={{
            padding: '10px 20px', borderRadius: 9, border: 'none', background: BRAND,
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
          }}>
            + Save snapshot
          </button>
        )}
      </div>

      {!isPaid && (
        <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24 }}>🔒</span>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 4 }}>Version snapshots require a paid plan</div>
            <p style={{ color: 'var(--text3)', fontSize: 13, margin: 0 }}>Save and compare versions to document your improvement journey. Available on Pro and above.</p>
          </div>
          <Link href="/pricing" style={{ padding: '8px 18px', borderRadius: 8, background: BRAND, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>Upgrade</Link>
        </div>
      )}

      {/* Compare section */}
      {snapshots.length >= 2 && isPaid && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontFamily: mono, color: 'var(--text3)', marginBottom: 12 }}>COMPARE VERSIONS</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={compareA || ''} onChange={e => setCompareA(e.target.value || null)} style={{
              padding: '8px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', flex: 1,
            }}>
              <option value="">Select version A...</option>
              {snapshots.map(s => (
                <option key={s.id} value={s.id}>v{s.version_number} — {s.label || new Date(s.created_at).toLocaleDateString()}</option>
              ))}
            </select>
            <span style={{ color: 'var(--text3)', fontWeight: 700 }}>vs</span>
            <select value={compareB || ''} onChange={e => setCompareB(e.target.value || null)} style={{
              padding: '8px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', flex: 1,
            }}>
              <option value="">Select version B...</option>
              {snapshots.map(s => (
                <option key={s.id} value={s.id}>v{s.version_number} — {s.label || new Date(s.created_at).toLocaleDateString()}</option>
              ))}
            </select>
          </div>
          {snapshotA && snapshotB && compareA !== compareB && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 16 }}>
              {[
                { label: 'Steps', a: snapshotA.step_count, b: snapshotB.step_count, fmt: (v: number) => v.toString() },
                { label: 'Total CT', a: snapshotA.total_ct, b: snapshotB.total_ct, fmt: fmtTime },
                { label: 'PCE', a: snapshotA.pce, b: snapshotB.pce, fmt: (v: number | null) => v !== null ? `${v.toFixed(1)}%` : '—' },
              ].map(m => {
                const aVal = m.a as any
                const bVal = m.b as any
                const improved = bVal !== null && aVal !== null && bVal > aVal
                const worse    = bVal !== null && aVal !== null && bVal < aVal
                return (
                  <div key={m.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontFamily: mono, color: 'var(--text3)', marginBottom: 8 }}>{m.label.toUpperCase()}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text4)' }}>A</div>
                        <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{m.fmt(aVal)}</div>
                      </div>
                      <div style={{ color: improved ? '#2E844A' : worse ? '#C0402A' : 'var(--text3)', fontSize: 18, alignSelf: 'center' }}>
                        {improved ? '↑' : worse ? '↓' : '→'}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text4)' }}>B</div>
                        <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: improved ? '#2E844A' : worse ? '#C0402A' : 'var(--text)' }}>{m.fmt(bVal)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Snapshot list */}
      {snapshots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
          <h2 style={{ fontFamily: serif, fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>No snapshots yet</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
            Save a snapshot before making major changes. Compare versions to document your improvement journey. Each snapshot captures your full map state.
          </p>
          {isPaid && (
            <button onClick={() => setShowSave(true)} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 9, border: 'none', background: BRAND, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Save first snapshot
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {snapshots.map(snap => (
            <div key={snap.id} style={{ display: 'flex', gap: 16, padding: '16px 20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${BRAND}15`, border: `2px solid ${BRAND}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 12, fontWeight: 700, color: BRAND, flexShrink: 0 }}>
                v{snap.version_number}
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{snap.label || `Version ${snap.version_number}`}</div>
                {snap.description && <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 2 }}>{snap.description}</div>}
                <div style={{ color: 'var(--text4)', fontSize: 11, fontFamily: mono, marginTop: 4 }}>{new Date(snap.created_at).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                {[
                  { label: 'Steps',    value: snap.step_count.toString() },
                  { label: 'Lead time', value: fmtTime((snap.total_ct || 0) + (snap.total_wait || 0)) },
                  { label: 'PCE',      value: snap.pce !== null ? `${snap.pce.toFixed(1)}%` : '—' },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{m.value}</div>
                    <div style={{ fontSize: 10, fontFamily: mono, color: 'var(--text4)' }}>{m.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
