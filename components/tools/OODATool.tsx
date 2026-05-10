// TypeScript enabled
'use client'
// ── components/tools/OODATool.tsx ─────────────────────────────────────────────
// OODA Loop — Observe, Orient, Decide, Act
// Purpose: Fast-moving operational decisions where rapid iteration matters.
// Visual identity: Four-stage loop communicating speed and iteration.
// Spec: VeSiMy v4 Section 7.4


import React from 'react'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'

// ── Types ─────────────────────────────────────────────────────────────────────
interface OODAIteration {
  id: string
  timestamp: string
  observe: string
  orient: string
  decide: string
  act: string
  outcome: string
  loop_again: boolean
}

interface OODAData {
  title: string
  context: string
  iterations: OODAIteration[]
  status: 'active' | 'resolved' | 'paused'
  resolution: string
}

const BLANK: OODAData = {
  title: '', context: '', iterations: [], status: 'active', resolution: '',
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5) }

// ── Phase colours ─────────────────────────────────────────────────────────────
const PHASES = [
  { key: 'observe', label: 'Observe',  color: '#6CB9FC', icon: '👁', desc: 'What is actually happening right now? Raw observations without interpretation.' },
  { key: 'orient',  label: 'Orient',   color: '#0176D3', icon: '🧭', desc: "What does the observation tell you? What's the context? What patterns do you see?" },
  { key: 'decide',  label: 'Decide',   color: '#8C44CC', icon: '⚡', desc: 'What are your options? Which best addresses what you observed?' },
  { key: 'act',     label: 'Act',      color: '#2E844A', icon: '🎯', desc: 'What specific action are you taking? When? Who?' },
]

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 7,
  background: 'var(--bg)', border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
  boxSizing: 'border-box' as const, outline: 'none',
}

const area: React.CSSProperties = { ...inp, resize: 'vertical' as const }

// ── Iteration card ────────────────────────────────────────────────────────────
function IterationCard({ iter, index, isLast, onUpdate, onDelete }: { key?: any;
  iter: OODAIteration; index: number; isLast: boolean
  onUpdate: (field: string, value: string | boolean) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(isLast)

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
      <div onClick={() => setExpanded(e => !e)} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        background: 'var(--bg2)', cursor: 'pointer', userSelect: 'none' as const,
      }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, fontSize: 12, color: 'var(--text2)', fontFamily: 'monospace' }}>
          Loop {index + 1} — {iter.timestamp}
        </div>
        {iter.act && <div style={{ fontSize: 11, color: '#2E844A', fontWeight: 700 }}>✓ Act defined</div>}
        <div style={{ color: 'var(--text3)', fontSize: 14 }}>{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div style={{ padding: 14, background: 'var(--bg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {PHASES.map(phase => (
              <div key={phase.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{phase.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: phase.color, fontFamily: 'monospace', letterSpacing: 1 }}>
                    {phase.label.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, lineHeight: 1.4 }}>{phase.desc}</div>
                <textarea
                  rows={3}
                  value={(iter as any)[phase.key]}
                  onChange={e => onUpdate(phase.key, e.target.value)}
                  placeholder={phase.desc}
                  style={area}
                />
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
                OUTCOME (fill in after acting)
              </label>
              <textarea rows={2} value={iter.outcome} onChange={e => onUpdate('outcome', e.target.value)}
                placeholder="What happened after you acted? Did it work?" style={area} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
                LOOP AGAIN?
              </label>
              <button onClick={() => onUpdate('loop_again', !iter.loop_again)} style={{
                padding: '8px 16px', borderRadius: 7, border: `1px solid ${iter.loop_again ? '#0176D3' : 'var(--border)'}`,
                background: iter.loop_again ? 'rgba(1,118,211,0.1)' : 'transparent',
                color: iter.loop_again ? '#0176D3' : 'var(--text3)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                {iter.loop_again ? '↻ Yes, loop' : '→ Done'}
              </button>
            </div>
          </div>

          <button onClick={onDelete} style={{
            marginTop: 10, padding: '5px 10px', borderRadius: 5, border: '1px solid rgba(192,64,42,0.3)',
            background: 'transparent', color: '#C0402A', fontSize: 11, cursor: 'pointer',
          }}>Remove loop</button>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  stepId: string; stepName: string; data: Partial<OODAData>
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function OODATool({ stepId, stepName, data, onSave, onClose }: Props) {
  const [form, setForm] = useState<OODAData>({ ...BLANK, ...data })
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'loop' | 'log' | 'guide'>('loop')

  function addIteration() {
    const newIter: OODAIteration = {
      id: uid(), timestamp: new Date().toLocaleString(),
      observe: '', orient: '', decide: '', act: '', outcome: '', loop_again: false,
    }
    setForm(f => ({ ...f, iterations: [...f.iterations, newIter] }))
  }

  function updateIteration(id: string, field: string, value: string | boolean) {
    setForm(f => ({
      ...f,
      iterations: f.iterations.map(it => it.id === id ? { ...it, [field]: value } : it),
    }))
  }

  function deleteIteration(id: string) {
    setForm(f => ({ ...f, iterations: f.iterations.filter(it => it.id !== id) }))
  }

  async function handleSave() {
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <Modal title={`OODA Loop — ${stepName}`} onClose={onClose} onSave={handleSave} saveLabel={saving ? 'Saving…' : 'Save OODA'}>
      {/* Header info */}
      <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 9, padding: '10px 14px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#0176D3', letterSpacing: 1, marginBottom: 4 }}>OODA LOOP</div>
        <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0, lineHeight: 1.6 }}>
          Observe → Orient → Decide → Act. For fast-moving operational decisions where speed of iteration matters more than exhaustive analysis. Complete the loop, assess the outcome, then loop again if needed.
        </p>
      </div>

      {/* Visual OODA cycle indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: '10px 0', overflowX: 'auto' }}>
        {PHASES.map((phase, i) => (
          <div key={phase.key} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${phase.color}15`, border: `2px solid ${phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, margin: '0 auto 4px' }}>
                {phase.icon}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: phase.color, fontFamily: 'monospace', letterSpacing: 1 }}>{phase.label.toUpperCase()}</div>
            </div>
            {i < PHASES.length - 1 && <div style={{ width: 24, height: 2, background: 'var(--border)', flexShrink: 0 }} />}
            {i === PHASES.length - 1 && <div style={{ fontSize: 16, color: '#0176D3', flexShrink: 0 }}>↩</div>}
          </div>
        ))}
      </div>

      {/* Context */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>
          SITUATION / CONTEXT
        </label>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Brief title for this OODA session" style={{ ...inp, marginBottom: 8 }} />
        <textarea value={form.context} onChange={e => setForm(f => ({ ...f, context: e.target.value }))} rows={2}
          placeholder="What is the situation that requires rapid decision-making?" style={area} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        {[
          { id: 'loop', label: `Loops (${form.iterations.length})` },
          { id: 'log', label: 'Decision Log' },
          { id: 'guide', label: 'When to use OODA' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            padding: '8px 14px', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? '#0176D3' : 'transparent'}`,
            background: 'none', color: activeTab === tab.id ? '#0176D3' : 'var(--text3)',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Loop tab */}
      {activeTab === 'loop' && (
        <div>
          {form.iterations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text3)', fontSize: 13 }}>
              No OODA loops yet. Start the first one.
            </div>
          )}
          {form.iterations.map((iter, i) => (
            <IterationCard key={iter.id} iter={iter as OODAIteration} index={i as number} isLast={i === form.iterations.length - 1}
              onUpdate={(field, value) => updateIteration(iter.id, field, value)}
              onDelete={() => deleteIteration(iter.id)} />
          ))}
          <button onClick={addIteration} style={{
            width: '100%', padding: '10px', borderRadius: 8, border: '1px dashed var(--border2)',
            background: 'transparent', color: 'var(--text3)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>+ Start {form.iterations.length === 0 ? 'first' : 'new'} OODA loop</button>
        </div>
      )}

      {/* Decision log tab */}
      {activeTab === 'log' && (
        <div>
          {form.iterations.length === 0 ? (
            <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No loops completed yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.iterations.map((iter, i) => (
                <div key={iter.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text3)', marginBottom: 6 }}>LOOP {i + 1} — {iter.timestamp}</div>
                  {iter.observe && <p style={{ fontSize: 12, color: 'var(--text2)', margin: '0 0 4px' }}><strong style={{ color: '#6CB9FC' }}>Observed:</strong> {iter.observe}</p>}
                  {iter.decide && <p style={{ fontSize: 12, color: 'var(--text2)', margin: '0 0 4px' }}><strong style={{ color: '#8C44CC' }}>Decided:</strong> {iter.decide}</p>}
                  {iter.act    && <p style={{ fontSize: 12, color: 'var(--text2)', margin: '0 0 4px' }}><strong style={{ color: '#2E844A' }}>Action:</strong> {iter.act}</p>}
                  {iter.outcome && <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}><strong style={{ color: '#F4A623' }}>Outcome:</strong> {iter.outcome}</p>}
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text3)', display: 'block', marginBottom: 6 }}>RESOLUTION</label>
            <textarea value={form.resolution} onChange={e => setForm(f => ({ ...f, resolution: e.target.value }))} rows={2}
              placeholder="When you are done looping — what was the final outcome?" style={area} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {(['active', 'resolved', 'paused'] as const).map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))} style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${form.status === s ? '#0176D3' : 'var(--border)'}`,
                  background: form.status === s ? 'rgba(1,118,211,0.1)' : 'transparent',
                  color: form.status === s ? '#0176D3' : 'var(--text3)',
                  textTransform: 'capitalize' as const,
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guide tab */}
      {activeTab === 'guide' && (
        <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75 }}>
          <p><strong style={{ color: 'var(--text)' }}>Use OODA when:</strong></p>
          <ul style={{ paddingLeft: 18, marginTop: 6 }}>
            <li>The situation is changing faster than a full PDCA cycle allows</li>
            <li>You need to make a decision with incomplete information</li>
            <li>You are responding to a live operational problem right now</li>
            <li>Speed of iteration matters more than exhaustive analysis</li>
            <li>You need to adapt in real time during a gemba walk or kaizen event</li>
          </ul>
          <p style={{ marginTop: 12 }}><strong style={{ color: 'var(--text)' }}>Use PDCA when:</strong></p>
          <ul style={{ paddingLeft: 18, marginTop: 6 }}>
            <li>You have time to define the problem carefully before testing</li>
            <li>You need a documented improvement cycle for compliance or audit</li>
            <li>The problem is recurring and you need a permanent fix</li>
          </ul>
          <p style={{ marginTop: 12 }}><strong style={{ color: 'var(--text)' }}>Use 8D when:</strong></p>
          <ul style={{ paddingLeft: 18, marginTop: 6 }}>
            <li>The problem has reached a customer or crossed a containment boundary</li>
            <li>You need a customer-facing response document</li>
          </ul>
          <p style={{ marginTop: 12, padding: 12, background: 'rgba(1,118,211,0.06)', borderRadius: 8, fontSize: 12, color: 'var(--text3)' }}>
            OODA was developed by US Air Force Colonel John Boyd for aerial combat decisions. It has since been applied to business strategy, crisis management, and lean operations. The key insight is that the side with the faster OODA loop wins — not necessarily the one with the best single decision.
          </p>
        </div>
      )}
    </Modal>
  )
}
