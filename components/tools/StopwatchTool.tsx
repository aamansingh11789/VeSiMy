// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui'

interface Lap {
  t: number
  excluded?: boolean
}

interface Props {
  stepId: string
  stepName: string
  data?: any
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

const fmtMs = (ms: number) => {
  if (!ms) return '0s'
  const s = ms / 1000
  if (s < 60) return `${s.toFixed(1)}s`
  return `${Math.floor(s / 60)}m ${(s % 60).toFixed(0)}s`
}

export default function StopwatchTool({ stepName, data, onSave, onClose }: Props) {
  const { showToast } = useStore()
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<Lap[]>(data?.laps || [])
  const [excluded, setExcluded] = useState<Set<number>>(new Set(data?.excluded || []))
  const [baseline, setBaseline] = useState(data?.baseline ?? '')
  const [manualCT, setManualCT] = useState(data?.mean ? String(Math.round(data.mean / 10) / 100) : '')
  const [saving, setSaving] = useState(false)

  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed
      const tick = () => {
        setElapsed(Date.now() - startRef.current)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }

    return () => cancelAnimationFrame(rafRef.current)
  }, [running, elapsed])

  const lap = () => {
    if (!running) return
    setLaps((prev) => [...prev, { t: elapsed }])
    startRef.current = Date.now()
    setElapsed(0)
  }

  const reset = () => {
    setRunning(false)
    setElapsed(0)
    setLaps([])
    setExcluded(new Set())
  }

  const toggleExclude = (i: number) => {
    setExcluded((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const validTimes = laps.filter((_, i) => !excluded.has(i)).map((l) => l.t)
  const mean = validTimes.length ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : 0
  const minT = validTimes.length ? Math.min(...validTimes) : 0
  const maxT = validTimes.length ? Math.max(...validTimes) : 0
  const effectiveMean = mean || (manualCT ? Math.round(parseFloat(manualCT) * 1000) : 0)

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      laps,
      excluded: [...excluded],
      baseline: baseline ? Number(baseline) * 1000 : null,
      mean: effectiveMean,
      min: minT,
      max: maxT,
      savedAt: Date.now(),
    }

    try {
      await onSave(payload)
      showToast('Time study saved', 'success')
      onClose()
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const statCards = [
    ['Mean CT', fmtMs(mean || effectiveMean)],
    ['Min', fmtMs(minT || effectiveMean)],
    ['Max', fmtMs(maxT || effectiveMean)],
  ]

  return (
    <Modal
      title={`⏱ Time Study — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Study'}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '14px 12px',
          background: 'var(--bg)',
          borderRadius: 12,
          marginBottom: 12,
          border: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(34px, 8vw, 46px)',
            fontFamily: 'monospace',
            fontWeight: 700,
            color: running ? '#D4A208' : 'var(--text)',
            letterSpacing: 1,
            lineHeight: 1.1,
          }}
        >
          {fmtMs(elapsed)}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 12,
          }}
        >
          <button
            onClick={() => setRunning((r) => !r)}
            className={`btn btn-sm ${running ? 'btn-danger' : 'btn-primary'}`}
            style={{ minWidth: 92 }}
          >
            {running ? '⏹ Stop' : '▶ Start'}
          </button>

          {running && (
            <button onClick={lap} className="btn btn-ghost btn-sm" style={{ minWidth: 82 }}>
              ⏱ Lap
            </button>
          )}

          {laps.length > 0 && !running && (
            <button onClick={reset} className="btn btn-ghost btn-sm" style={{ minWidth: 82 }}>
              ↺ Reset
            </button>
          )}
        </div>
      </div>

      {effectiveMean > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 8,
            marginBottom: 12,
          }}
        >
          {statCards.map(([label, val]) => (
            <div
              key={label}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: 'var(--text3)',
                  letterSpacing: 1.1,
                  fontFamily: 'monospace',
                  marginBottom: 4,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#D4A208' }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {laps.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text3)',
              fontFamily: 'monospace',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            OBSERVATIONS ({validTimes.length} valid / {laps.length} total)
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {laps.map((l, i) => (
              <button
                key={i}
                onClick={() => toggleExclude(i)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  minHeight: 38,
                  background: excluded.has(i) ? 'rgba(255,107,107,0.08)' : 'var(--bg)',
                  border: `1px solid ${excluded.has(i) ? 'rgba(255,107,107,0.3)' : 'var(--border)'}`,
                  color: excluded.has(i) ? '#FF6B6B' : 'var(--text2)',
                  textDecoration: excluded.has(i) ? 'line-through' : 'none',
                }}
              >
                #{i + 1} {fmtMs(l.t)}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
            Tap any lap to exclude it from the average.
          </p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 10,
          marginBottom: 4,
        }}
      >
        <div>
          <label className="label">
            Manual Cycle Time (sec) <span style={{ color: 'var(--text3)', fontSize: 10 }}>if no stopwatch</span>
          </label>
          <input
            className="input"
            type="number"
            min={0}
            placeholder="e.g. 120"
            value={manualCT}
            onChange={(e) => setManualCT(e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            Baseline CT (sec) <span style={{ color: 'var(--text3)', fontSize: 10 }}>current state</span>
          </label>
          <input
            className="input"
            type="number"
            min={0}
            placeholder="e.g. 180"
            value={baseline}
            onChange={(e) => setBaseline(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}