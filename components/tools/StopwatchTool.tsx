// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { openISOReport } from '@/lib/isoReport'

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
  const [manualCT, setManualCT] = useState(
    data?.mean ? String(Math.round(data.mean / 10) / 100) : ''
  )
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
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const validTimes = laps.filter((_, i) => !excluded.has(i)).map((l) => l.t)
  const mean = validTimes.length
    ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length)
    : 0
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
    ['Mean', fmtMs(mean || effectiveMean)],
    ['Min', fmtMs(minT || effectiveMean)],
    ['Max', fmtMs(maxT || effectiveMean)],
  ]

  const exportTimeStudyISO = () => {
    const validLaps = laps.filter((_, i) => !excluded.has(i))
    const cv = mean > 0 ? ((Math.sqrt(validLaps.reduce((a, l) => a + Math.pow(l.t - mean, 2), 0) / Math.max(validLaps.length - 1, 1)) / mean) * 100).toFixed(1) : '—'
    const baselineMs = baseline ? parseFloat(baseline) * 1000 : null
    const improvement = baselineMs && mean ? (((baselineMs - mean) / baselineMs) * 100).toFixed(1) : null

    const body = `
      <h2>1. Study Overview</h2>
      <p>This time study report documents observed cycle times for process step <strong>${stepName}</strong>.
      Data was collected using direct observation and stopwatch measurement per ILO Work Measurement standards
      and ISO 9001:2015 §8.5 (Production and Service Provision). ${laps.length} observations were recorded;
      ${excluded.size} were excluded as outliers.</p>

      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Observations</div><div class="kpi-value">${laps.length}</div><div class="kpi-sub">${excluded.size} excluded</div></div>
        <div class="kpi-card"><div class="kpi-label">Mean Cycle Time</div><div class="kpi-value">${fmtMs(mean || effectiveMean)}</div><div class="kpi-sub">Validated average</div></div>
        <div class="kpi-card"><div class="kpi-label">Minimum CT</div><div class="kpi-value">${fmtMs(minT || effectiveMean)}</div><div class="kpi-sub">Best cycle observed</div></div>
        <div class="kpi-card"><div class="kpi-label">Maximum CT</div><div class="kpi-value">${fmtMs(maxT || effectiveMean)}</div><div class="kpi-sub">Worst cycle observed</div></div>
        <div class="kpi-card"><div class="kpi-label">Coeff. of Variation</div><div class="kpi-value">${cv}${cv !== '—' ? '%' : ''}</div><div class="kpi-sub">${cv !== '—' && parseFloat(cv) < 15 ? '✓ Stable process' : cv !== '—' ? '⚠ High variation' : '—'}</div></div>
        ${baselineMs ? `<div class="kpi-card"><div class="kpi-label">Baseline CT</div><div class="kpi-value">${fmtMs(baselineMs)}</div><div class="kpi-sub">${improvement ? (parseFloat(improvement) > 0 ? '▲ +' + improvement + '% improvement' : '▼ ' + improvement + '% regression') : '—'}</div></div>` : ''}
      </div>

      <h2>2. Observation Log</h2>
      <p>Each row represents one measured cycle. Excluded observations were identified as statistical
      outliers or interruptions and are noted accordingly per ILO measurement protocol.</p>
      <table class="data-table">
        <thead><tr>
          <th>#</th><th>Measured Time</th><th>vs. Mean</th><th>Status</th><th>Notes</th>
        </tr></thead>
        <tbody>
          ${laps.map((lap, i) => {
            const isExcluded = excluded.has(i)
            const diff = mean > 0 ? ((lap.t - mean) / mean * 100).toFixed(0) : '—'
            const isOutlier = mean > 0 && Math.abs(lap.t - mean) > mean * 0.3
            return `<tr style="${isExcluded ? 'opacity:0.5;text-decoration:line-through;' : ''}">
              <td style="text-align:center;">${i + 1}</td>
              <td style="font-family:monospace;font-weight:600;">${fmtMs(lap.t)}</td>
              <td style="${diff !== '—' ? (parseFloat(diff) > 15 ? 'color:#c00;' : parseFloat(diff) < -15 ? 'color:#0a5;' : '') : ''}">${diff !== '—' ? (parseFloat(diff) > 0 ? '+' : '') + diff + '%' : '—'}</td>
              <td>${isExcluded ? '<span class="badge badge-open">EXCLUDED</span>' : isOutlier ? '<span class="badge badge-medium">OUTLIER</span>' : '<span class="badge badge-complete">INCLUDED</span>'}</td>
              <td style="font-size:8.5pt;">${isExcluded ? 'Manually excluded' : isOutlier ? 'High variation — verify' : 'Valid observation'}</td>
            </tr>`
          }).join('')}
          <tr style="background:#f0f0f0;font-weight:700;">
            <td colspan="2">MEAN (validated)</td>
            <td colspan="3" style="font-family:monospace;">${fmtMs(mean || effectiveMean)}</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Statistical Analysis</h2>
      <table class="data-table">
        <thead><tr><th>Metric</th><th>Value</th><th>Interpretation</th><th>ISO Reference</th></tr></thead>
        <tbody>
          <tr><td>Sample Size</td><td>${validLaps.length} observations</td><td>${validLaps.length >= 10 ? '✓ Adequate for statistical confidence' : validLaps.length >= 5 ? '⚠ Minimum threshold — collect more' : '✗ Insufficient — collect 10+ observations'}</td><td>ILO §3</td></tr>
          <tr><td>Mean Cycle Time</td><td>${fmtMs(mean || effectiveMean)}</td><td>Average of all included observations</td><td>ISO 22468 §5.2.4</td></tr>
          <tr><td>Range (Max − Min)</td><td>${fmtMs(maxT - minT)}</td><td>${(maxT - minT) / mean < 0.3 ? '✓ Low range — consistent' : '⚠ High range — investigate causes'}</td><td>ILO §4.2</td></tr>
          <tr><td>Coefficient of Variation</td><td>${cv}${cv !== '—' ? '%' : ''}</td><td>${cv !== '—' ? (parseFloat(cv) < 10 ? '✓ Excellent process stability' : parseFloat(cv) < 20 ? '⚠ Acceptable — monitor' : '✗ High variation — requires investigation') : '—'}</td><td>ILO §4.3</td></tr>
          ${baselineMs ? `<tr><td>Baseline vs. Observed</td><td>${improvement ? (parseFloat(improvement) > 0 ? '+' + improvement + '%' : improvement + '%') : '—'}</td><td>${improvement ? (parseFloat(improvement) > 0 ? '✓ Improvement confirmed' : '⚠ Performance regression') : '—'}</td><td>ISO 9001 §9.1</td></tr>` : ''}
        </tbody>
      </table>

      <h2>4. Improvement Recommendations</h2>
      ${mean > 0 && maxT > mean * 1.3 ? `
        <div class="obs-box waste">
          <div class="obs-label">⚠ High Cycle Time Variation Detected</div>
          <p>Coefficient of Variation: ${cv}%. Maximum observed cycle (${fmtMs(maxT)}) is
          ${(((maxT - mean) / mean) * 100).toFixed(0)}% above mean. Investigate variability sources
          using Fishbone or 5 Why analysis. Consider standard work documentation to reduce variance.</p>
        </div>
      ` : `
        <div class="obs-box ok">
          <div class="obs-label">✓ Process Stability Confirmed</div>
          <p>Cycle time variation is within acceptable limits. Continue periodic measurement
          to detect drift. Document standard cycle time as ${fmtMs(mean || effectiveMean)}.</p>
        </div>
      `}
      <table class="data-table">
        <thead><tr><th>#</th><th>Recommendation</th><th>Priority</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Document ${fmtMs(mean || effectiveMean)} as the official standard cycle time for ${stepName}</td><td><span class="badge badge-high">HIGH</span></td></tr>
          <tr><td>2</td><td>Update VSM data with observed cycle time for lead time accuracy</td><td><span class="badge badge-high">HIGH</span></td></tr>
          ${parseFloat(cv) > 15 ? `<tr><td>3</td><td>Investigate sources of variation — initiate Fishbone or 5 Why analysis</td><td><span class="badge badge-high">HIGH</span></td></tr>` : ''}
          ${validLaps.length < 10 ? `<tr><td>${parseFloat(cv) > 15 ? 4 : 3}</td><td>Collect additional observations (target: 10–30) for statistical confidence</td><td><span class="badge badge-medium">MEDIUM</span></td></tr>` : ''}
          <tr><td>${validLaps.length < 10 || parseFloat(cv) > 15 ? 5 : 3}</td><td>Establish formal process standard with documented cycle time and work sequence</td><td><span class="badge badge-medium">MEDIUM</span></td></tr>
        </tbody>
      </table>
    `
    openISOReport(body, {
      title: 'Time Study Report — Cycle Time Analysis',
      toolType: 'TIMESTUDY',
      projectName: stepName,
      stepName: 'Direct Observation Measurement',
      revision: 'Rev. A',
      preparedBy: 'VeSiMy CI Platform',
    })
  }

  return (
    <Modal
      title={`⏱ Time Study — ${stepName}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={saving ? 'Saving…' : 'Save Study'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            textAlign: 'center',
            padding: '12px',
            background: 'var(--bg)',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(30px, 8vw, 42px)',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: running ? '#D4A208' : 'var(--text)',
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
              marginTop: 10,
            }}
          >
            <button
              onClick={() => setRunning((r) => !r)}
              className={`btn btn-sm ${running ? 'btn-danger' : 'btn-primary'}`}
              style={{ minWidth: 90 }}
              type="button"
            >
              {running ? '⏹ Stop' : '▶ Start'}
            </button>

            {running && (
              <button
                onClick={lap}
                className="btn btn-ghost btn-sm"
                style={{ minWidth: 80 }}
                type="button"
              >
                ⏱ Lap
              </button>
            )}

            {laps.length > 0 && !running && (
              <button
                onClick={reset}
                className="btn btn-ghost btn-sm"
                style={{ minWidth: 80 }}
                type="button"
              >
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
            }}
          >
            {statCards.map(([label, val]) => (
              <div
                key={label}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#D4A208' }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        )}

        {laps.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                Observations ({validTimes.length} valid / {laps.length} total)
              </div>
              {laps.length >= 1 && (
                <button
                  onClick={exportTimeStudyISO}
                  style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer' }}
                >
                  📄 ISO Report
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {laps.map((l, i) => (
                <button
                  key={i}
                  onClick={() => toggleExclude(i)}
                  type="button"
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: 'monospace',
                    background: excluded.has(i) ? 'rgba(192,64,42,0.06)' : 'var(--bg2)',
                    border: `1px solid ${
                      excluded.has(i) ? 'rgba(255,107,107,0.3)' : 'var(--border)'
                    }`,
                    color: excluded.has(i) ? '#FF6B6B' : 'var(--text2)',
                    textDecoration: excluded.has(i) ? 'line-through' : 'none',
                  }}
                >
                  #{i + 1} {fmtMs(l.t)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label className="label">Manual Cycle Time (sec)</label>
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
            <label className="label">Baseline CT (sec)</label>
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
      </div>
    </Modal>
  )
}