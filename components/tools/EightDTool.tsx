// TypeScript enabled
'use client'
// ── components/tools/EightDTool.tsx ──────────────────────────────────────────
// 8D — Eight Disciplines
// Purpose: Quality escapes and customer complaints requiring structured team response.
// Visual identity: Eight numbered disciplines in a structured grid layout.
// Spec: VeSiMy v4 Section 7.3


import React from 'react'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'

interface TeamMember { id: string; name: string; role: string }
interface EightDData {
  title: string
  customer: string
  // D1
  d1_team: TeamMember[]
  d1_champion: string
  // D2
  d2_description: string
  d2_when: string
  d2_where: string
  d2_quantity: string
  d2_impact: string
  // D3
  d3_containment: string
  d3_verified: boolean
  d3_verified_date: string
  // D4
  d4_root_cause: string
  d4_method: string
  d4_verified: boolean
  // D5
  d5_pca: string
  d5_evidence: string
  d5_risk: string
  // D6
  d6_implemented: string
  d6_verified: boolean
  d6_verified_date: string
  // D7
  d7_systemic: string
  d7_other_processes: string
  // D8
  d8_recognition: string
  d8_lessons: string
  d8_closed: boolean
  d8_closed_date: string
}

const BLANK: EightDData = {
  title: '', customer: '',
  d1_team: [], d1_champion: '',
  d2_description: '', d2_when: '', d2_where: '', d2_quantity: '', d2_impact: '',
  d3_containment: '', d3_verified: false, d3_verified_date: '',
  d4_root_cause: '', d4_method: '', d4_verified: false,
  d5_pca: '', d5_evidence: '', d5_risk: '',
  d6_implemented: '', d6_verified: false, d6_verified_date: '',
  d7_systemic: '', d7_other_processes: '',
  d8_recognition: '', d8_lessons: '', d8_closed: false, d8_closed_date: '',
}

function uid() { return Math.random().toString(36).slice(2, 9) }

const DISCIPLINES = [
  { d: 'D1', label: 'Team Formation',        color: '#6CB9FC', icon: '👥' },
  { d: 'D2', label: 'Problem Description',   color: '#D4A843', icon: '📋' },
  { d: 'D3', label: 'Interim Containment',   color: '#F4A623', icon: '🚧' },
  { d: 'D4', label: 'Root Cause Analysis',   color: '#C0402A', icon: '🔍' },
  { d: 'D5', label: 'Permanent Corrective Action', color: '#8C44CC', icon: '🔧' },
  { d: 'D6', label: 'Verify & Implement',    color: '#2E844A', icon: '✅' },
  { d: 'D7', label: 'Prevent Recurrence',    color: '#1DD1A1', icon: '🛡' },
  { d: 'D8', label: 'Team Recognition',      color: '#F4A623', icon: '🏆' },
]

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 7,
  background: 'var(--bg)', border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
  boxSizing: 'border-box' as const, outline: 'none',
}
const area: React.CSSProperties = { ...inp, resize: 'vertical' as const }
const label = (text: string): React.CSSProperties => ({ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text3)', display: 'block', marginBottom: 5 })

interface Props {
  stepId: string; stepName: string; data: Partial<EightDData>
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export default function EightDTool({ stepName, data, onSave, onClose }: Props) {
  const [form,    setForm]    = useState<EightDData>({ ...BLANK, ...data })
  const [saving,  setSaving]  = useState(false)
  const [activeD, setActiveD] = useState(0)

  const set = (field: keyof EightDData, value: any) => setForm(f => ({ ...f, [field]: value }))

  function addMember() {
    set('d1_team', [...form.d1_team, { id: uid(), name: '', role: '' }])
  }
  function updateMember(id: string, field: string, value: string) {
    set('d1_team', form.d1_team.map(m => m.id === id ? { ...m, [field]: value } : m))
  }
  function removeMember(id: string) {
    set('d1_team', form.d1_team.filter(m => m.id !== id))
  }

  async function handleSave() {
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const disc = DISCIPLINES[activeD]
  const completedCount = [
    form.d1_champion !== '',
    form.d2_description !== '',
    form.d3_verified,
    form.d4_verified,
    form.d5_pca !== '',
    form.d6_verified,
    form.d7_systemic !== '',
    form.d8_closed,
  ].filter(Boolean).length

  return (
    <Modal title={`8D Report — ${stepName}`} onClose={onClose} onSave={handleSave} saveLabel={saving ? 'Saving…' : 'Save 8D'}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Problem title" style={inp} />
        </div>
        <div style={{ flex: 1 }}>
          <input value={form.customer} onChange={e => set('customer', e.target.value)} placeholder="Customer / source" style={inp} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text3)' }}>COMPLETION</span>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#D4A843' }}>{completedCount}/8 disciplines</span>
        </div>
        <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(completedCount / 8) * 100}%`, background: 'linear-gradient(90deg,#D4A843,#1DD1A1)', borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Discipline selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 16 }}>
        {DISCIPLINES.map((d, i) => (
          <button key={d.d} onClick={() => setActiveD(i)} style={{
            padding: '8px 6px', borderRadius: 8, border: `1px solid ${activeD === i ? d.color : 'var(--border)'}`,
            background: activeD === i ? `${d.color}15` : 'transparent', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <div style={{ fontSize: 14, marginBottom: 2 }}>{d.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: d.color, fontFamily: 'monospace' }}>{d.d}</div>
          </button>
        ))}
      </div>

      {/* Active discipline content */}
      <div style={{ background: `${disc.color}08`, border: `1px solid ${disc.color}25`, borderRadius: 10, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 20 }}>{disc.icon}</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: disc.color, fontFamily: 'monospace', letterSpacing: 1 }}>{disc.d}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{disc.label}</div>
          </div>
        </div>

        {/* D1 */}
        {activeD === 0 && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={label('TEAM CHAMPION / LEADER')}>TEAM CHAMPION / LEADER</label>
              <input value={form.d1_champion} onChange={e => set('d1_champion', e.target.value)} placeholder="Name and title" style={inp} />
            </div>
            <label style={label('TEAM MEMBERS')}>TEAM MEMBERS</label>
            {form.d1_team.map(m => (
              <div key={m.id} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input value={m.name} onChange={e => updateMember(m.id, 'name', e.target.value)} placeholder="Name" style={{ ...inp, flex: 1 }} />
                <input value={m.role} onChange={e => updateMember(m.id, 'role', e.target.value)} placeholder="Role" style={{ ...inp, flex: 1 }} />
                <button onClick={() => removeMember(m.id)} style={{ padding: '0 10px', borderRadius: 6, border: '1px solid rgba(192,64,42,0.3)', background: 'transparent', color: '#C0402A', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
            <button onClick={addMember} style={{ padding: '7px 14px', borderRadius: 7, border: '1px dashed var(--border2)', background: 'transparent', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add team member</button>
          </div>
        )}

        {/* D2 */}
        {activeD === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={label('PROBLEM DESCRIPTION')}>PROBLEM DESCRIPTION</label>
              <textarea rows={3} value={form.d2_description} onChange={e => set('d2_description', e.target.value)} placeholder="Specific description of the defect or complaint. Use IS / IS NOT format if possible." style={area} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={label('WHEN')}>WHEN</label>
                <input value={form.d2_when} onChange={e => set('d2_when', e.target.value)} placeholder="When was it first detected?" style={inp} />
              </div>
              <div>
                <label style={label('WHERE')}>WHERE</label>
                <input value={form.d2_where} onChange={e => set('d2_where', e.target.value)} placeholder="Where in the process?" style={inp} />
              </div>
              <div>
                <label style={label('QUANTITY')}>QUANTITY</label>
                <input value={form.d2_quantity} onChange={e => set('d2_quantity', e.target.value)} placeholder="How many units / occurrences?" style={inp} />
              </div>
              <div>
                <label style={label('CUSTOMER IMPACT')}>CUSTOMER IMPACT</label>
                <input value={form.d2_impact} onChange={e => set('d2_impact', e.target.value)} placeholder="What impact on the customer?" style={inp} />
              </div>
            </div>
          </div>
        )}

        {/* D3 */}
        {activeD === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={label('INTERIM CONTAINMENT ACTION')}>INTERIM CONTAINMENT ACTION</label>
              <textarea rows={3} value={form.d3_containment} onChange={e => set('d3_containment', e.target.value)}
                placeholder="What immediate action was taken to protect the customer from further impact?" style={area} />
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.d3_verified} onChange={e => set('d3_verified', e.target.checked)} />
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>Containment verified effective</span>
              </label>
              {form.d3_verified && <input type="date" value={form.d3_verified_date} onChange={e => set('d3_verified_date', e.target.value)} style={{ ...inp, width: 150 }} />}
            </div>
          </div>
        )}

        {/* D4 */}
        {activeD === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={label('VERIFIED ROOT CAUSE')}>VERIFIED ROOT CAUSE</label>
              <textarea rows={3} value={form.d4_root_cause} onChange={e => set('d4_root_cause', e.target.value)}
                placeholder="State the root cause. This must be verified — not the first plausible cause." style={area} />
            </div>
            <div>
              <label style={label('METHOD USED TO IDENTIFY')}>METHOD USED TO IDENTIFY</label>
              <input value={form.d4_method} onChange={e => set('d4_method', e.target.value)} placeholder="e.g. 5 Whys, Fishbone, fault tree analysis" style={inp} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.d4_verified} onChange={e => set('d4_verified', e.target.checked)} />
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>Root cause verified (confirmed that eliminating it prevents recurrence)</span>
            </label>
          </div>
        )}

        {/* D5 */}
        {activeD === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={label('PERMANENT CORRECTIVE ACTION')}>PERMANENT CORRECTIVE ACTION</label>
              <textarea rows={3} value={form.d5_pca} onChange={e => set('d5_pca', e.target.value)}
                placeholder="What permanent change eliminates the root cause?" style={area} />
            </div>
            <div>
              <label style={label('EVIDENCE IT WILL WORK')}>EVIDENCE IT WILL WORK</label>
              <textarea rows={2} value={form.d5_evidence} onChange={e => set('d5_evidence', e.target.value)}
                placeholder="Pilot results, data, or logical proof that this PCA addresses the root cause" style={area} />
            </div>
            <div>
              <label style={label('RISKS / SIDE EFFECTS')}>RISKS / SIDE EFFECTS</label>
              <input value={form.d5_risk} onChange={e => set('d5_risk', e.target.value)} placeholder="Any risks introduced by this change?" style={inp} />
            </div>
          </div>
        )}

        {/* D6 */}
        {activeD === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={label('IMPLEMENTATION DETAILS')}>IMPLEMENTATION DETAILS</label>
              <textarea rows={3} value={form.d6_implemented} onChange={e => set('d6_implemented', e.target.value)}
                placeholder="How was the PCA implemented? Who did what by when?" style={area} />
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.d6_verified} onChange={e => set('d6_verified', e.target.checked)} />
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>Effectiveness verified with data</span>
              </label>
              {form.d6_verified && <input type="date" value={form.d6_verified_date} onChange={e => set('d6_verified_date', e.target.value)} style={{ ...inp, width: 150 }} />}
            </div>
          </div>
        )}

        {/* D7 */}
        {activeD === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={label('SYSTEMIC PREVENTION')}>SYSTEMIC PREVENTION</label>
              <textarea rows={3} value={form.d7_systemic} onChange={e => set('d7_systemic', e.target.value)}
                placeholder="What systemic changes prevent this type of problem from recurring anywhere in the organisation?" style={area} />
            </div>
            <div>
              <label style={label('OTHER PROCESSES AFFECTED')}>OTHER PROCESSES AFFECTED</label>
              <textarea rows={2} value={form.d7_other_processes} onChange={e => set('d7_other_processes', e.target.value)}
                placeholder="List other processes where similar conditions exist and what was done to address them" style={area} />
            </div>
          </div>
        )}

        {/* D8 */}
        {activeD === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={label('TEAM RECOGNITION')}>TEAM RECOGNITION</label>
              <textarea rows={2} value={form.d8_recognition} onChange={e => set('d8_recognition', e.target.value)}
                placeholder="Acknowledge the team's contribution to resolving this problem" style={area} />
            </div>
            <div>
              <label style={label('LESSONS LEARNED')}>LESSONS LEARNED</label>
              <textarea rows={3} value={form.d8_lessons} onChange={e => set('d8_lessons', e.target.value)}
                placeholder="What did the team learn from this problem that can improve future processes?" style={area} />
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.d8_closed} onChange={e => set('d8_closed', e.target.checked)} />
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>8D report closed</span>
              </label>
              {form.d8_closed && <input type="date" value={form.d8_closed_date} onChange={e => set('d8_closed_date', e.target.value)} style={{ ...inp, width: 150 }} />}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        <button onClick={() => setActiveD(d => Math.max(0, d - 1))} disabled={activeD === 0}
          style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: activeD === 0 ? 'var(--text4)' : 'var(--text2)', cursor: activeD === 0 ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
          ← Previous
        </button>
        <span style={{ fontSize: 12, color: 'var(--text3)', alignSelf: 'center', fontFamily: 'monospace' }}>{activeD + 1} / 8</span>
        <button onClick={() => setActiveD(d => Math.min(7, d + 1))} disabled={activeD === 7}
          style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: activeD === 7 ? 'var(--text4)' : 'var(--text2)', cursor: activeD === 7 ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
          Next →
        </button>
      </div>
    </Modal>
  )
}
