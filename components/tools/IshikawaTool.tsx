// @ts-nocheck
'use client'
// ── components/tools/IshikawaTool.tsx ───────────────────────────────────────

import { useState } from 'react'
import { saveToolData } from '@/lib/db'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

const FRAMEWORKS: Record<string, string[]> = {
  '6M Manufacturing': ['Machine','Method','Material','Manpower','Measurement','Mother Nature'],
  '8P Service':       ['Product/Service','Price','Place','Promotion','People','Process','Physical Evidence','Productivity'],
  '4S Service':       ['Surroundings','Suppliers','Systems','Skills'],
  'Custom':           ['Category 1','Category 2','Category 3','Category 4','Category 5','Category 6'],
}

interface Props { stepId: string; stepName: string; data?: any; onSave: (data: Record<string, any>) => Promise<void>; onClose: () => void }

export default function IshikawaTool({ stepId, stepName, data, onClose }: Props) {
  const { setStepToolData, showToast } = useStore()
  const [problem,   setProblem]   = useState(data?.problem || '')
  const [framework, setFramework] = useState(data?.framework || '6M Manufacturing')
  const [causes,    setCauses]    = useState<Record<string,string[]>>(data?.causes || {})
  const [inputs,    setInputs]    = useState<Record<string,string>>({})
  const [active,    setActive]    = useState<string | null>(null)

  const categories = FRAMEWORKS[framework] || FRAMEWORKS['6M Manufacturing']

  const addCause = (cat: string) => {
    const val = (inputs[cat] || '').trim()
    if (!val) return
    setCauses(prev => ({ ...prev, [cat]: [...(prev[cat]||[]), val] }))
    setInputs(prev => ({ ...prev, [cat]: '' }))
  }

  const removeCause = (cat: string, i: number) => {
    setCauses(prev => ({ ...prev, [cat]: prev[cat].filter((_,j) => j!==i) }))
  }

  const handleSave = async () => {
    const payload = { problem, framework, causes, savedAt: Date.now() }
    setStepToolData(stepId, 'ishikawa', payload)
    try { await saveToolData(stepId, 'ishikawa', payload); showToast('Fishbone saved', 'success') }
    catch { showToast('Save failed', 'error') }
    onClose()
  }

  const totalCauses = Object.values(causes).flat().length

  return (
    <Modal title={`🐟 Fishbone Diagram — ${stepName}`} onClose={onClose} onSave={handleSave} width={680}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Problem + Framework */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12 }}>
          <div>
            <label className="label">Effect (Problem)</label>
            <input className="input" placeholder="What is the effect being analysed?" value={problem} onChange={e => setProblem(e.target.value)} />
          </div>
          <div>
            <label className="label">Framework</label>
            <select className="input" value={framework} onChange={e => setFramework(e.target.value)}>
              {Object.keys(FRAMEWORKS).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Summary */}
        {totalCauses > 0 && (
          <div style={{ background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.15)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#D4A208' }}>
            ◈ {totalCauses} cause{totalCauses!==1?'s':''} identified across {Object.values(causes).filter(v=>v.length>0).length} categor{Object.values(causes).filter(v=>v.length>0).length!==1?'ies':'y'}
          </div>
        )}

        {/* Category grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
          {categories.map(cat => (
            <div key={cat} style={{
              background: 'var(--bg3)', border: `1px solid ${active===cat ? 'rgba(212,162,8,0.30)' : 'var(--border)'}`,
              borderRadius: 10, padding: 14,
              transition: 'border-color 0.15s',
            }} onClick={() => setActive(cat)}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#D4A208', letterSpacing: 0.5, marginBottom: 8 }}>{cat}</div>
              {(causes[cat]||[]).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--text)', background: 'var(--bg4)', padding: '4px 8px', borderRadius: 5 }}>{c}</div>
                  <button onClick={e => { e.stopPropagation(); removeCause(cat, i) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, lineHeight: 1, padding: '2px 4px' }}>×</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <input className="input" style={{ flex: 1, fontSize: 12, padding: '5px 8px' }}
                  placeholder="Add cause…" value={inputs[cat]||''}
                  onChange={e => setInputs(prev => ({ ...prev, [cat]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addCause(cat)}
                  onClick={e => e.stopPropagation()} />
                <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}
                  onClick={e => { e.stopPropagation(); addCause(cat) }}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
