// @ts-nocheck
'use client'
// ── components/tools/StopwatchTool.tsx ──────────────────────────────────────
// Time Study tool — ported from LeanStream v1 with cloud save

import { useState, useEffect, useRef, useCallback } from 'react'
import { saveToolData } from '@/lib/db'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

interface Lap { id: string; time: number; note: string; date: string; ts: number }
interface Props { stepId: string; stepName: string; data?: any; onSave: (data: Record<string, any>) => Promise<void>; onClose: () => void }

function uid() { return Math.random().toString(36).slice(2, 9) }
function fmtMs(ms: number) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2,'0')}.${String(Math.floor((ms%1000)/10)).padStart(2,'0')}`
}

export default function StopwatchTool({ stepId, stepName, data, onClose }: Props) {
  const { setStepToolData, showToast } = useStore()
  const [running,  setRunning]  = useState(false)
  const [elapsed,  setElapsed]  = useState(0)
  const [laps,     setLaps]     = useState<Lap[]>(data?.laps || [])
  const [note,     setNote]     = useState('')
  const [excluded, setExcluded] = useState<string[]>(data?.excluded || [])
  const [manualInput, setManualInput] = useState('')
  const [baseline, setBaseline] = useState<number | null>(data?.baseline ?? null)
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number | null>(null)
  const saving   = useRef(false)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed
      const tick = () => { setElapsed(Date.now() - startRef.current!); rafRef.current = requestAnimationFrame(tick) }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running])

  const lap = () => {
    if (!running) return
    const l: Lap = { id: uid(), time: elapsed, note, date: new Date().toLocaleDateString(), ts: Date.now() }
    setLaps(prev => [...prev, l])
    setNote('')
    setElapsed(0)
    startRef.current = Date.now()
  }

  const reset = () => { setRunning(false); setElapsed(0) }

  const addManual = () => {
    const ms = parseFloat(manualInput)
    if (isNaN(ms) || ms <= 0) return
    setLaps(prev => [...prev, { id: uid(), time: ms * 1000, note, date: new Date().toLocaleDateString(), ts: Date.now() }])
    setManualInput('')
    setNote('')
  }

  const valid = laps.filter(l => !excluded.includes(l.id))
  const times = valid.map(l => l.time)
  const mean  = times.length ? Math.round(times.reduce((a,b)=>a+b,0)/times.length) : 0
  const minT  = times.length ? Math.min(...times) : 0
  const maxT  = times.length ? Math.max(...times) : 0

  const handleSave = async () => {
    if (saving.current) return
    saving.current = true
    const payload = { laps, excluded, baseline, mean, min: minT, max: maxT, savedAt: Date.now() }
    setStepToolData(stepId, 'stopwatch', payload)
    try { await saveToolData(stepId, 'stopwatch', payload); showToast('Time study saved', 'success') }
    catch { showToast('Save failed', 'error') }
    finally { saving.current = false }
    onClose()
  }

  return (
    <Modal title={`⏱ Time Study — ${stepName}`} onClose={onClose} onSave={handleSave} saveLabel="Save Study" width={620}>
      {/* Display */}
      <div style={{ textAlign: 'center', padding: '20px 0 16px', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 52, fontWeight: 700, color: running ? '#D4A208' : 'var(--text)', letterSpacing: 2 }}>
          {fmtMs(elapsed)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" style={{ minWidth: 100 }} onClick={() => setRunning(r => !r)}>
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          {running && (
            <button className="btn btn-ghost" onClick={lap}>⏲ Lap</button>
          )}
          <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
        </div>
        {running && (
          <input className="input" placeholder="Note for this observation…" value={note}
            onChange={e => setNote(e.target.value)}
            style={{ marginTop: 12, maxWidth: 360 }} />
        )}
      </div>

      {/* Stats */}
      {valid.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[['Mean CT', fmtMs(mean)],['Min', fmtMs(minT)],['Max', fmtMs(maxT)]].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#D4A208' }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Manual entry */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input className="input" placeholder="Add manual obs. (seconds)" type="number" value={manualInput}
          onChange={e => setManualInput(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-ghost" onClick={addManual}>Add</button>
      </div>

      {/* Laps table */}
      {laps.length > 0 && (
        <div style={{ background: 'var(--bg3)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['#','Time','Note','Date','Excl.'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, letterSpacing: 1, color: 'var(--text3)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {laps.map((l, i) => {
                const isExcluded = excluded.includes(l.id)
                return (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)', opacity: isExcluded ? 0.4 : 1 }}>
                    <td style={{ padding: '7px 12px', color: 'var(--text3)' }}>#{i+1}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: '#D4A208', fontWeight: 600 }}>{fmtMs(l.time)}</td>
                    <td style={{ padding: '7px 12px', color: 'var(--text2)' }}>{l.note || '—'}</td>
                    <td style={{ padding: '7px 12px', color: 'var(--text3)', fontSize: 11 }}>{l.date}</td>
                    <td style={{ padding: '7px 12px' }}>
                      <input type="checkbox" checked={isExcluded}
                        onChange={() => setExcluded(prev => isExcluded ? prev.filter(x=>x!==l.id) : [...prev, l.id])} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  )
}
