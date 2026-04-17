// @ts-nocheck
'use client'
// ── components/export/PDFExport.tsx ──────────────────────────────────────────
// ISO 9001:2015 / ISO 13053 compliant white-paper VSM analysis report

import { useState } from 'react'
import { calcProcessMetrics, fmtPCE } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'
import toast from 'react-hot-toast'
import type { Project, Step } from '@/lib/store'
import { CheckIcon, DownloadIcon, RefreshIcon } from '@/components/ui/Icons'

interface Props {
  project: Project
  steps:   Step[]
  isGold?: boolean
}

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60)   return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s / 60).toFixed(1)} min`
  return `${(s / 3600).toFixed(2)} hr`
}

const fmtDate = () =>
  new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

function docNum(projectId: string, reportId?: string): string {
  // FIX: deterministic — same project always produces same doc number prefix
  // Uses last 8 chars of project ID (stable, unique per project, no Math.random)
  const seed = ((projectId || '') + (reportId || '')).replace(/-/g, '').slice(-6).toUpperCase()
  return `VSM-${new Date().getFullYear()}-${seed || 'XXXXXX'}`
}

// ─────────────────────────────────────────────────────────────────────────────
function buildISOReport(project: Project, steps: Step[], isGold = false): string {
  // FIX: use calcProcessMetrics for consistent, unit-aware, branch-filtered calculations
  const { mainSteps, totalCT, totalWait: totalWT, leadTime: totalLT, pce: pceNum,
          takt: taktCalc, bottleneck: primaryBN, totalWIP } =
    calcProcessMetrics(steps as any[], project as any)
  const pce         = fmtPCE(pceNum)
  const takt        = taktCalc ?? 0
  const bottlenecks = takt > 0 ? mainSteps.filter(s => ctSeconds(s as any) > takt * 1.05).length : 0
  const avgCT       = mainSteps.length ? Math.round(totalCT / mainSteps.length) : 0
  const totalOps    = mainSteps.reduce((a, s: any) => a + (s.operators || 0), 0)
  const avgUptime   = mainSteps.length
    ? (mainSteps.reduce((a, s: any) => a + (s.uptime || 0), 0) / mainSteps.length).toFixed(1)
    : '—'
  const avgDefect   = mainSteps.length
    ? (mainSteps.reduce((a, s: any) => a + (s.defect_rate || 0), 0) / mainSteps.length).toFixed(2)
    : '—'
  const bottleneckStep = primaryBN

  // Waste from toolData.waste.selected (array of IDs) + label lookup
  const WASTE_LABELS: Record<string, string> = {
    transportation: 'Transportation', inventory: 'Inventory', motion: 'Motion',
    waiting: 'Waiting', overproduction: 'Overproduction', overprocessing: 'Overprocessing',
    defects: 'Defects', skills: 'Skills (Unused Talent)',
  }
  const WASTE_DESC: Record<string, string> = {
    Transportation:  'Unnecessary movement of materials, parts, or products between locations',
    Inventory:       'Excess raw material, WIP, or finished goods beyond immediate process need',
    Motion:          'Unnecessary movement of people or equipment during processing operations',
    Waiting:         'Idle time when goods, people, or equipment are waiting for the next step',
    Overproduction:  'Producing more than is demanded or producing before it is needed',
    Overprocessing:  'More processing steps or quality than required by customer specification',
    Defects:         'Effort required to inspect, rework, repair, or scrap nonconforming product',
    'Skills (Unused Talent)': 'Underutilizing knowledge, creativity, and skills of employees',
  }
  const wasteCounts: Record<string, number> = {}
  const wasteSteps:  Record<string, string[]> = {}
  steps.forEach(s => {
    const sel: string[] = s.toolData?.waste?.selected || []
    sel.forEach(id => {
      const lbl = WASTE_LABELS[id] || id
      wasteCounts[lbl] = (wasteCounts[lbl] || 0) + 1
      wasteSteps[lbl]  = [...(wasteSteps[lbl] || []), s.name]
    })
  })

  // Kaizen from toolData.kaizen.items
  interface KzItem { title: string; description: string; priority: string; status: string; owner: string; dueDate: string; stepName: string }
  const kaizenItems: KzItem[] = []
  steps.forEach(s => {
    const kz: any[] = s.toolData?.kaizen?.items || []
    kz.forEach(k => kaizenItems.push({ ...k, stepName: s.name }))
  })

  // 5 Why from toolData.fiveWhy
  const rootCauses: any[] = []
  steps.forEach(s => {
    const fw = s.toolData?.fivewhy
    if (fw?.problem) rootCauses.push({ step: s.name, problem: fw.problem, whys: fw.whys || [], rootCause: fw.rootCause || '', action: fw.action || '', owner: fw.owner || '' })
  })

  // Fishbone from toolData.ishikawa
  const fishbones: any[] = []
  steps.forEach(s => {
    const fish = s.toolData?.ishikawa
    if (fish?.problem) fishbones.push({ step: s.name, ...fish })
  })

  // Time study from toolData.stopwatch
  const timeStudies: any[] = []
  steps.forEach(s => {
    const ts = s.toolData?.stopwatch
    if (ts?.laps?.length || ts?.mean) timeStudies.push({ step: s.name, ...ts })
  })

  const now    = fmtDate()
  const docRef = docNum(project.id)
  const SERIF  = 'Georgia,"Times New Roman",serif'
  const MONO   = '"Courier New",Courier,monospace'

  // ── Step rows ──────────────────────────────────────────────────────────────
  const stepRows = steps.map((s, i) => {
    const ct      = s.cycle_time || 0
    const wt      = s.wait_time  || 0
    const isBN    = takt > 0 && ct > takt * 1.05
    const pctTakt = takt > 0 ? `${((ct / takt) * 100).toFixed(0)}%` : '—'
    const rowBg   = i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
    const wasteList = (s.toolData?.waste?.selected || [])
      .map((id: string) => WASTE_LABELS[id] || id).join(', ') || '—'
    return `
    <tr style="background:${rowBg}">
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;color:#64748B;font-family:${MONO};text-align:center;white-space:nowrap">${String(i + 1).padStart(2, '0')}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;font-weight:600;color:#0F172A">${s.name}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;color:#475569;text-align:center">${s.department || '—'}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:right;font-weight:700;color:${isBN ? '#DC2626' : '#059669'}">${fmtS(ct)}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:right;color:#64748B">${fmtS(wt)}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center">${s.operators ?? '—'}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center;color:${(s.uptime ?? 100) < 85 ? '#DC2626' : '#059669'}">${s.uptime != null ? s.uptime + '%' : '—'}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center;color:${(s.defect_rate || 0) > 1.5 ? '#DC2626' : '#374151'}">${s.defect_rate != null ? s.defect_rate + '%' : '—'}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center">${s.wip ?? '—'}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center;color:#374151">${(s.flow_type || 'PUSH').toUpperCase()}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center;color:#374151">${pctTakt}</td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center">
        <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:700;
          ${isBN ? 'background:#FEE2E2;color:#DC2626;border:1px solid #FCA5A5'
                 : 'background:#DCFCE7;color:#15803D;border:1px solid #86EFAC'}">
          ${isBN ? 'BOTTLENECK' : 'OK'}
        </span>
      </td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:9px;color:#64748B;max-width:120px">${wasteList}</td>
    </tr>`
  }).join('')

  // ── Waste rows ─────────────────────────────────────────────────────────────
  const wasteRows = Object.entries(wasteCounts).length
    ? Object.entries(wasteCounts).map(([w, count], i) => `
    <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}">
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;font-weight:700;color:#0F172A">${w}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;color:#374151">${WASTE_DESC[w] || 'Non-value-adding activity identified during VSM analysis'}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;text-align:center;font-weight:700;color:#DC2626">${count}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:10px;color:#374151">${(wasteSteps[w] || []).join(', ')}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:10px;color:#374151">Apply lean countermeasure. Prioritise elimination per ISO 13053-1 §5</td>
    </tr>`).join('')
    : `<tr><td colspan="5" style="padding:12px;border:1px solid #CBD5E1;font-size:11px;color:#94A3B8;text-align:center;font-style:italic">No waste data recorded. Use the Waste Identification tool in each process step.</td></tr>`

  // ── Kaizen rows ────────────────────────────────────────────────────────────
  const kzBg:    Record<string, string> = { open: '#FEF9C3', 'in-progress': '#DBEAFE', complete: '#DCFCE7' }
  const kzColor: Record<string, string> = { open: '#92400E', 'in-progress': '#1E40AF', complete: '#166534' }
  const kaizenRows = kaizenItems.length
    ? kaizenItems.map((k, i) => `
    <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}">
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;font-weight:600;color:#0F172A">${k.title || k.description || 'Improvement Event'}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;color:#374151">${k.stepName}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;color:#374151">${k.description || '—'}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;text-align:center">
        <span style="padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;background:${kzBg[k.status] || '#F1F5F9'};color:${kzColor[k.status] || '#374151'}">
          ${(k.status || 'OPEN').toUpperCase()}</span>
      </td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:10px;font-weight:700;text-align:center;color:${k.priority === 'critical' ? '#DC2626' : k.priority === 'high' ? '#D97706' : '#374151'}">${(k.priority || 'NORMAL').toUpperCase()}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;color:#374151">${k.owner || '—'}</td>
      <td style="padding:7px 10px;border:1px solid #CBD5E1;font-size:11px;color:#374151">${k.dueDate || 'TBD'}</td>
    </tr>`).join('')
    : `<tr><td colspan="7" style="padding:12px;border:1px solid #CBD5E1;font-size:11px;color:#94A3B8;text-align:center;font-style:italic">No kaizen events recorded. Use the Kaizen Events tool in each process step.</td></tr>`

  // ── 5 Why section ──────────────────────────────────────────────────────────
  const rootCauseSection = rootCauses.length
    ? rootCauses.map((rc, i) => `
    <div style="margin-bottom:16px;border:1px solid #CBD5E1;border-radius:4px;overflow:hidden;page-break-inside:avoid">
      <div style="background:#EFF6FF;padding:8px 14px;border-bottom:1px solid #CBD5E1">
        <span style="font-size:10px;font-weight:700;color:#1E3A5F;font-family:${MONO};letter-spacing:1px">
          RCA-${String(i + 1).padStart(2, '0')} · ${rc.step.toUpperCase()}
        </span>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <tr style="background:#FAFAFA">
          <td style="padding:8px 14px;border-bottom:1px solid #E2E8F0;font-size:11px;font-weight:700;color:#1E3A5F;width:90px">Problem:</td>
          <td style="padding:8px 14px;border-bottom:1px solid #E2E8F0;font-size:11px;color:#0F172A;font-weight:600">${rc.problem}</td>
        </tr>
        ${(rc.whys || []).map((w: string, wi: number) => `
        <tr style="background:${wi % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}">
          <td style="padding:7px 14px;border-bottom:1px solid #E2E8F0;font-size:11px;color:#64748B;font-weight:600;white-space:nowrap">Why ${wi + 1}:</td>
          <td style="padding:7px 14px;border-bottom:1px solid #E2E8F0;font-size:11px;color:#374151">${w || '<em style="color:#94A3B8">Not recorded</em>'}</td>
        </tr>`).join('')}
        ${rc.rootCause ? `
        <tr style="background:#FFF7ED">
          <td style="padding:8px 14px;font-size:11px;font-weight:700;color:#C2410C;border-bottom:1px solid #E2E8F0">Root Cause:</td>
          <td style="padding:8px 14px;font-size:11px;color:#7C2D12;font-weight:600;border-bottom:1px solid #E2E8F0">${rc.rootCause}</td>
        </tr>` : ''}
        ${rc.action ? `
        <tr style="background:#F0FDF4">
          <td style="padding:8px 14px;font-size:11px;font-weight:700;color:#166534">Countermeasure:</td>
          <td style="padding:8px 14px;font-size:11px;color:#14532D;font-weight:600">${rc.action}${rc.owner ? ` <span style="color:#64748B;font-weight:400">(Owner: ${rc.owner})</span>` : ''}</td>
        </tr>` : ''}
      </table>
    </div>`).join('')
    : `<p style="font-size:11px;color:#94A3B8;font-style:italic">No root cause analysis recorded. Use the 5 Why tool in each process step to add structured RCA data.</p>`

  // ── Time Study section ─────────────────────────────────────────────────────
  const timeStudySection = timeStudies.length
    ? timeStudies.map((ts, i) => {
        const readings: number[] = (ts.laps || []).map((l: any) => typeof l === 'object' ? l.t : l)
        const avg = readings.length ? (readings.reduce((a: number, b: number) => a + b, 0) / readings.length).toFixed(1) : '—'
        const min = readings.length ? Math.min(...readings).toFixed(1) : '—'
        const max = readings.length ? Math.max(...readings).toFixed(1) : '—'
        const variance = readings.length > 1
          ? Math.sqrt(readings.reduce((a: number, b: number) => a + Math.pow(b - +avg, 2), 0) / readings.length).toFixed(2)
          : '—'
        return `
        <div style="margin-bottom:14px;border:1px solid #CBD5E1;border-radius:4px;overflow:hidden">
          <div style="background:#F8FAFC;padding:7px 14px;border-bottom:1px solid #CBD5E1">
            <span style="font-size:10px;font-weight:700;color:#1E3A5F;font-family:${MONO}">TIME STUDY · ${ts.step.toUpperCase()}</span>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;font-size:10px;color:#64748B">Readings (n)</td>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;font-size:10px;color:#64748B">Average CT</td>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;font-size:10px;color:#64748B">Min</td>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;font-size:10px;color:#64748B">Max</td>
              <td style="padding:8px 14px;border-bottom:1px solid #E2E8F0;font-size:10px;color:#64748B">Std Dev</td>
            </tr>
            <tr>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;font-size:12px;font-weight:700;color:#0F172A">${readings.length}</td>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;font-size:12px;font-weight:700;color:#059669">${avg}s</td>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;font-size:12px;color:#374151">${min}s</td>
              <td style="padding:8px 14px;border-right:1px solid #E2E8F0;font-size:12px;color:#374151">${max}s</td>
              <td style="padding:8px 14px;font-size:12px;color:#374151">${variance}s</td>
            </tr>
          </table>
          ${readings.length ? `<div style="padding:8px 14px;border-top:1px solid #E2E8F0;font-size:10px;color:#64748B">
            Raw readings (s): ${readings.map((r: number) => r.toFixed(1)).join(' · ')}
          </div>` : ''}
        </div>`
      }).join('')
    : `<p style="font-size:11px;color:#94A3B8;font-style:italic">No time study data recorded. Use the Time Study (Stopwatch) tool in each process step.</p>`

  // ── Fishbone section ───────────────────────────────────────────────────────
  const fishboneSection = fishbones.length
    ? fishbones.map((fb, i) => {
        const cats: Record<string, string[]> = fb.causes || fb.categories || {}
        return `
        <div style="margin-bottom:14px;border:1px solid #CBD5E1;border-radius:4px;overflow:hidden">
          <div style="background:#FFF7ED;padding:7px 14px;border-bottom:1px solid #CBD5E1">
            <span style="font-size:10px;font-weight:700;color:#C2410C;font-family:${MONO}">FISHBONE (ISHIKAWA) · ${fb.step.toUpperCase()}</span>
            <span style="font-size:11px;color:#7C2D12;margin-left:12px;font-weight:600">Effect: ${fb.problem}</span>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              ${(Object.keys(cats).length ? Object.keys(cats) : ['Machine','Method','Material','Manpower','Measurement','Mother Nature']).map((cat, ci) => {
                const causes: string[] = cats[cat] || []
                return `
                <td style="padding:8px 10px;border:1px solid #E2E8F0;vertical-align:top;width:16.6%">
                  <div style="font-size:9px;font-weight:700;color:#C2410C;font-family:${MONO};margin-bottom:5px">${cat.toUpperCase()}</div>
                  ${causes.length
                    ? causes.map((c: string) => `<div style="font-size:10px;color:#374151;padding:2px 0;border-bottom:1px solid #F1F5F9">${c}</div>`).join('')
                    : `<div style="font-size:10px;color:#CBD5E1;font-style:italic">—</div>`}
                </td>`
              }).join('')}
            </tr>
          </table>
        </div>`
      }).join('')
    : `<p style="font-size:11px;color:#94A3B8;font-style:italic">No fishbone diagram data recorded. Use the Ishikawa (Fishbone) tool in each process step.</p>`

  // ── VSM Flow ───────────────────────────────────────────────────────────────
  const flowSteps = steps.slice(0, 9).map((s, i) => {
    const ct  = s.cycle_time || 0
    const isBN = takt > 0 && ct > takt * 1.05
    return `
    <div style="display:flex;align-items:center;flex-shrink:0">
      <div style="background:${isBN ? '#FEF2F2' : '#F0FDF4'};border:2px solid ${isBN ? '#EF4444' : '#16A34A'};
        border-radius:6px;padding:7px 9px;text-align:center;min-width:72px;max-width:85px">
        <div style="font-size:8px;color:#64748B;font-family:${MONO};margin-bottom:2px">${String(i + 1).padStart(2, '0')}</div>
        <div style="font-size:9px;color:#0F172A;font-weight:700;line-height:1.25;word-break:break-word">${s.name.length > 13 ? s.name.slice(0, 12) + '…' : s.name}</div>
        <div style="font-size:9px;color:${isBN ? '#DC2626' : '#059669'};margin-top:3px;font-weight:700">${fmtS(ct)}</div>
        ${s.operators != null ? `<div style="font-size:8px;color:#94A3B8;margin-top:1px">${s.operators} op</div>` : ''}
      </div>
      ${i < steps.slice(0, 9).length - 1 ? `
      <div style="display:flex;flex-direction:column;align-items:center;margin:0 3px;flex-shrink:0">
        <div style="font-size:8px;color:#94A3B8;white-space:nowrap">${fmtS(s.wait_time || 0)}</div>
        <div style="width:18px;height:2px;background:#94A3B8;position:relative">
          <div style="position:absolute;right:-4px;top:-3px;border-left:6px solid #94A3B8;border-top:4px solid transparent;border-bottom:4px solid transparent"></div>
        </div>
        <div style="font-size:8px;color:#94A3B8">WIP:${s.wip ?? 0}</div>
      </div>` : ''}
    </div>`
  }).join('')

  // ── Recommendations ────────────────────────────────────────────────────────
  const recommendations = [
    ['Implement single-piece flow to eliminate batch queue waste',     'Very High', 'High',   'ISO 9001:2015 §8.5.1', 'PCE ≥ 30%'],
    ['SMED methodology on all changeover operations > 15 min',        'High',      'Medium', 'ISO 13053-1 §5.4',    'Setup < 10 min'],
    ['Standardise work instructions at bottleneck operations',         'High',      'Low',    'ISO 9001:2015 §7.5',  'Defects < 0.5%'],
    ['Implement visual management and 5S in all process areas',        'Medium',    'Low',    'ISO 9001:2015 §7.1.4','Uptime > 90%'],
    ['Establish poka-yoke error-proofing at highest defect stations',  'High',      'Medium', 'ISO 9001:2015 §8.7',  'Defects < 1%'],
    ['Conduct Gemba Walk weekly to validate process adherence',        'Medium',    'Low',    'ISO 13053-2 §6',      'Lead time −20%'],
    ['Calculate and post takt time at each workstation',               'Medium',    'Low',    'ISO 13053-1 §4',      'On-time delivery'],
    ['Implement pull system (kanban) to replace push scheduling',      'High',      'High',   'ISO 9001:2015 §8.5',  'WIP reduction −50%'],
  ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Arial,Helvetica,sans-serif; background:#FFFFFF; color:#0F172A; -webkit-print-color-adjust:exact; print-color-adjust:exact; font-size:12px; line-height:1.4; }
  .page { width:794px; background:#FFFFFF; padding:28px 32px; }
  .section { margin-bottom:26px; page-break-inside:avoid; }
  .section-title { font-size:10px; font-weight:700; color:#1E3A5F; letter-spacing:1.5px; font-family:${MONO}; text-transform:uppercase; border-bottom:2px solid #1E3A5F; padding-bottom:5px; margin-bottom:12px; }
  table { border-collapse:collapse; width:100%; }
  th { background:#1B4F8A !important; color:#FFFFFF !important; font-size:10px; font-weight:700; padding:7px 8px; text-align:left; letter-spacing:0.4px; border:1px solid #1E3A5F; }
  .kpi-val { font-family:${SERIF}; font-size:22px; font-weight:700; line-height:1; }
  .mono { font-family:${MONO}; }
</style>
</head>
<body>
<div class="page">

  <!-- ══ ISO TITLE BLOCK ════════════════════════════════════════════════ -->
  <table style="border:2px solid #1E3A5F;margin-bottom:22px">
    <tr>
      <td style="padding:16px 20px;border-right:1px solid #CBD5E1;width:62%">
        <div style="font-size:8px;color:#64748B;letter-spacing:2px;font-family:${MONO};margin-bottom:7px">QUALITY MANAGEMENT SYSTEM — VALUE STREAM ANALYSIS</div>
        <div style="font-family:${SERIF};font-size:21px;font-weight:700;color:#0F172A;margin-bottom:5px">Value Stream Mapping Report</div>
        <div style="font-size:13px;font-weight:700;color:#1E3A5F;margin-bottom:3px">${project.name}</div>
        <div style="font-size:11px;color:#64748B">${[project.industry, project.customer ? 'Customer: ' + project.customer : '', project.product ? 'Product: ' + project.product : ''].filter(Boolean).join(' · ')}</div>
      </td>
      <td style="padding:12px 16px;vertical-align:top">
        <table style="font-size:11px;border:none">
          ${[['Document No.', docRef], ['Revision', 'A'], ['Issue Date', now], ['Generated by', 'VeSiMy Platform'], ['ISO Reference', 'ISO 9001:2015 / ISO 13053'], ['Classification', 'INTERNAL CONTROLLED']].map(([l, v]) => `
          <tr><td style="padding:2px 0;color:#64748B;width:110px;border:none">${l}:</td><td style="color:#0F172A;font-weight:600;font-family:${['Document No.', 'ISO Reference'].includes(l) ? MONO : 'inherit'};font-size:${l === 'ISO Reference' ? '10' : '11'}px;border:none">${v}</td></tr>`).join('')}
        </table>
      </td>
    </tr>
    <tr style="background:#F0F4FF;border-top:1px solid #CBD5E1">
      <td colspan="2" style="padding:8px 20px">
        <div style="display:flex;gap:48px">
          ${['Prepared by', 'Reviewed by', 'Quality Manager', 'Approved by'].map(r => `<div style="font-size:10px;color:#374151"><span style="color:#64748B">${r}:</span> _______________</div>`).join('')}
        </div>
      </td>
    </tr>
  </table>

  <!-- ══ 1. EXECUTIVE SUMMARY ═══════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">1. Executive Summary — Key Performance Indicators</div>
    <table style="border-collapse:collapse;margin-bottom:2px">
      <tr>
        ${[
          ['Total Process Steps',     steps.length,              '#1E3A5F'],
          ['Total Cycle Time',        fmtS(totalCT),             '#15803D'],
          ['Total Queue / Wait Time', fmtS(totalWT),             '#92400E'],
          ['End-to-End Lead Time',    fmtS(totalLT),             '#1E3A5F'],
          ['Process Cycle Efficiency',pce + '%',                 +pce >= 30 ? '#15803D' : +pce >= 15 ? '#92400E' : '#991B1B'],
        ].map(([l, v, c]) => `
        <td style="border:2px solid #E2E8F0;padding:12px 14px;text-align:center;background:#FAFAFA;width:20%">
          <div style="font-size:8px;color:#64748B;font-family:${MONO};letter-spacing:1px;margin-bottom:4px;text-transform:uppercase">${l}</div>
          <div class="kpi-val" style="color:${c}">${v}</div>
        </td>`).join('')}
      </tr>
      <tr>
        ${[
          ['Total WIP Units',       totalWIP,                    '#374151'],
          ['Total Operators',       totalOps,                    '#374151'],
          ['Avg Machine Uptime',    avgUptime + '%',             +avgUptime < 85 ? '#991B1B' : '#15803D'],
          ['Avg Defect Rate',       avgDefect + '%',             +avgDefect > 2  ? '#991B1B' : '#15803D'],
          ['Bottleneck Steps',      bottlenecks,                 bottlenecks > 0 ? '#991B1B' : '#15803D'],
        ].map(([l, v, c]) => `
        <td style="border:2px solid #E2E8F0;padding:12px 14px;text-align:center;background:#FFFFFF">
          <div style="font-size:8px;color:#64748B;font-family:${MONO};letter-spacing:1px;margin-bottom:4px;text-transform:uppercase">${l}</div>
          <div class="kpi-val" style="color:${c}">${v}</div>
        </td>`).join('')}
      </tr>
    </table>
    <div style="font-size:10px;color:#64748B;margin-top:5px;font-style:italic">
      PCE = Value-Added Time ÷ Total Lead Time × 100.  World-class: ≥30%.  Typical batch mfg: 5–15%.
      ${takt ? `  Takt time: ${fmtS(takt)} (Customer demand rate).` : ''}
    </div>
  </div>

  <!-- ══ 2. VSM FLOW DIAGRAM ════════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">2. Value Stream Flow — Current State (ISO 9001:2015 §8.5)</div>
    <div style="border:1px solid #CBD5E1;border-radius:4px;padding:14px 16px;background:#FAFAFA;overflow:hidden">
      <div style="display:flex;align-items:center;flex-wrap:nowrap;overflow:hidden">
        <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;margin-right:8px">
          <div style="background:#EEF2FF;border:2px solid #4338CA;border-radius:4px;padding:6px 10px;text-align:center;min-width:58px">
            <div style="font-size:8px;color:#4338CA;font-family:${MONO};font-weight:700">SUPPLIER</div>
            <div style="font-size:9px;color:#0F172A;font-weight:600;margin-top:2px">${project.supplier || 'Supplier'}</div>
          </div>
        </div>
        <div style="width:14px;height:2px;background:#94A3B8;margin-right:6px;flex-shrink:0"></div>
        ${flowSteps}
        ${steps.length > 9 ? `<div style="font-size:10px;color:#64748B;margin-left:8px;white-space:nowrap;font-style:italic">+${steps.length - 9} more</div>` : ''}
        <div style="width:14px;height:2px;background:#94A3B8;margin:0 6px;flex-shrink:0"></div>
        <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
          <div style="background:#F0FDF4;border:2px solid #16A34A;border-radius:4px;padding:6px 10px;text-align:center;min-width:58px">
            <div style="font-size:8px;color:#16A34A;font-family:${MONO};font-weight:700">CUSTOMER</div>
            <div style="font-size:9px;color:#0F172A;font-weight:600;margin-top:2px">${project.customer || 'Customer'}</div>
          </div>
          ${project.demand ? `<div style="font-size:8px;color:#94A3B8;margin-top:3px">${project.demand}/day</div>` : ''}
        </div>
      </div>
    </div>
    <div style="display:flex;gap:20px;margin-top:6px">
      <div style="display:flex;align-items:center;gap:5px;font-size:10px;color:#374151"><div style="width:11px;height:11px;background:#F0FDF4;border:2px solid #16A34A;border-radius:2px"></div> Within Takt</div>
      <div style="display:flex;align-items:center;gap:5px;font-size:10px;color:#374151"><div style="width:11px;height:11px;background:#FEF2F2;border:2px solid #EF4444;border-radius:2px"></div> Bottleneck (Exceeds Takt)</div>
      <div style="font-size:10px;color:#94A3B8;font-style:italic">Arrow = Queue Time · WIP = Units in process</div>
    </div>
  </div>

  <!-- ══ 3. PROCESS STEP DETAIL ═════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">3. Process Step Detail — ISO 13053-1 Data Collection Matrix</div>
    <table>
      <thead>
        <tr>
          <th style="width:28px">#</th>
          <th>Step Name</th>
          <th style="width:70px">Dept</th>
          <th style="width:60px;text-align:right">Cycle Time</th>
          <th style="width:60px;text-align:right">Wait Time</th>
          <th style="width:35px;text-align:center">Ops</th>
          <th style="width:50px;text-align:center">Uptime</th>
          <th style="width:52px;text-align:center">Defect%</th>
          <th style="width:34px;text-align:center">WIP</th>
          <th style="width:40px;text-align:center">Flow</th>
          <th style="width:46px;text-align:center">%Takt</th>
          <th style="width:70px;text-align:center">Takt Status</th>
          <th style="width:100px">Wastes</th>
        </tr>
      </thead>
      <tbody>${stepRows}</tbody>
      <tfoot>
        <tr style="background:#F1F5F9;font-weight:700">
          <td colspan="3" style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;color:#1E3A5F">TOTALS / AVERAGES</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:right;color:#0F172A">${fmtS(totalCT)}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:right;color:#0F172A">${fmtS(totalWT)}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:center">${totalOps}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:center">${avgUptime}%</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:center">${avgDefect}%</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:center">${totalWIP}</td>
          <td colspan="4" style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;text-align:center;color:#1E3A5F">PCE: ${pce}% · Lead Time: ${fmtS(totalLT)}</td>
        </tr>
      </tfoot>
    </table>
    <div style="margin-top:5px;font-size:9px;color:#94A3B8;font-style:italic">
      Red = bottleneck (CT > takt × 1.05). Uptime red = below 85%. Defect% red = above 1.5%. Avg CT = ${fmtS(avgCT)}.
    </div>
  </div>

  <!-- ══ 4. BOTTLENECK ANALYSIS ════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">4. Constraint and Bottleneck Analysis (Goldratt Theory of Constraints)</div>
    ${steps.filter(s => (s.cycle_time || 0) > 0).sort((a, b) => (b.cycle_time || 0) - (a.cycle_time || 0)).slice(0, 6).map((s, i) => {
      const ct    = ctSeconds(s as any)
      const over  = takt > 0 && ct > takt
      const pctOfAvg = avgCT > 0 ? ((ct / avgCT) * 100).toFixed(0) : '—'
      const rankColor = i === 0 ? '#DC2626' : i === 1 ? '#D97706' : i === 2 ? '#F59E0B' : '#059669'
      const rankLabel = i === 0 ? 'CRITICAL' : i === 1 ? 'HIGH' : i === 2 ? 'MEDIUM' : 'LOW'
      return `
      <div style="display:flex;align-items:center;gap:14px;padding:9px 14px;border:1px solid #E2E8F0;border-radius:4px;margin-bottom:6px;background:${i === 0 ? '#FEF2F2' : i === 1 ? '#FFFBEB' : '#FFFFFF'}">
        <div style="width:26px;height:26px;border-radius:50%;background:${rankColor};color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">${i + 1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:700;color:#0F172A">${s.name}</div>
          <div style="font-size:10px;color:#64748B;margin-top:2px">
            CT: ${fmtS(ct)} · ${pctOfAvg}% of avg · Queue: ${fmtS(s.wait_time || 0)} · WIP: ${s.wip ?? 0}
            ${s.uptime != null ? ` · Uptime: ${s.uptime}%` : ''}
            ${s.defect_rate ? ` · Defect: ${s.defect_rate}%` : ''}
            ${s.department ? ` · Dept: ${s.department}` : ''}
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:11px;font-weight:700;color:${rankColor}">${rankLabel}</div>
          ${over ? `<div style="font-size:10px;color:#DC2626;margin-top:2px">Exceeds takt by ${fmtS(ct - takt)}</div>` : ''}
        </div>
      </div>`
    }).join('') || '<p style="font-size:11px;color:#94A3B8;font-style:italic">Add cycle time data to steps to enable bottleneck analysis.</p>'}
  </div>

  <!-- ══ 5. WASTE ANALYSIS ══════════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">5. Waste Identification — 8 Wastes of Lean (TPS / ISO 13053-1 §5)</div>
    <table>
      <thead>
        <tr>
          <th style="width:140px">Waste Category</th>
          <th>Definition</th>
          <th style="width:50px;text-align:center">Count</th>
          <th style="width:160px">Affected Steps</th>
          <th style="width:180px">Recommended Countermeasure</th>
        </tr>
      </thead>
      <tbody>${wasteRows}</tbody>
    </table>
  </div>

  <!-- ══ 6. KAIZEN ACTION PLAN ══════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">6. Kaizen Continuous Improvement Register (ISO 9001:2015 §10.3)</div>
    <table>
      <thead>
        <tr>
          <th>Improvement Action</th>
          <th style="width:110px">Process Step</th>
          <th style="width:120px">Description</th>
          <th style="width:80px;text-align:center">Status</th>
          <th style="width:65px;text-align:center">Priority</th>
          <th style="width:90px">Owner</th>
          <th style="width:70px">Due Date</th>
        </tr>
      </thead>
      <tbody>${kaizenRows}</tbody>
    </table>
  </div>

  <!-- ══ 7. ROOT CAUSE ANALYSIS ════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">7. Root Cause Analysis — 5 Why Method (ISO 13053-2 §8)</div>
    ${rootCauseSection}
  </div>

  <!-- ══ 8. FISHBONE / ISHIKAWA ═════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">8. Cause-and-Effect Analysis — Ishikawa Diagrams (6M Framework)</div>
    ${fishboneSection}
  </div>

  <!-- ══ 9. TIME STUDY DATA ═════════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">9. Time Study — Cycle Time Measurement Data (MTM / MOST)</div>
    ${timeStudySection}
  </div>

  <!-- ══ 10. IMPROVEMENT RECOMMENDATIONS ══════════════════════════════ -->
  <div class="section">
    <div class="section-title">10. Improvement Recommendations — Impact / Effort Priority Matrix</div>
    <table>
      <thead>
        <tr>
          <th style="width:26px">#</th>
          <th>Recommendation</th>
          <th style="width:70px;text-align:center">Impact</th>
          <th style="width:60px;text-align:center">Effort</th>
          <th style="width:130px">ISO Reference</th>
          <th style="width:100px">Target KPI</th>
        </tr>
      </thead>
      <tbody>
        ${recommendations.map(([rec, impact, effort, ref, kpi], i) => `
        <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}">
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center;color:#64748B;font-family:${MONO}">${i + 1}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:11px;color:#0F172A">${rec}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center;font-weight:700;color:${impact === 'Very High' ? '#DC2626' : impact === 'High' ? '#D97706' : '#374151'}">${impact}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;text-align:center;color:#374151">${effort}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;color:#1E3A5F;font-family:${MONO}">${ref}</td>
          <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:10px;color:#374151">${kpi}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- ══ 11. PROJECT PARAMETERS ════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">11. Project Parameters and Process Context</div>
    <table style="border-collapse:collapse">
      <tr>
        <td style="width:50%;vertical-align:top;padding-right:10px">
          <table>
            ${[['Project Name', project.name], ['Industry Sector', project.industry || '—'], ['Customer', project.customer || '—'], ['Supplier', project.supplier || '—'], ['Product / Part Number', project.product || '—']].map(([l, v], i) => `
            <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}">
              <td style="padding:6px 10px;border:1px solid #CBD5E1;font-size:11px;color:#64748B;font-weight:600;width:150px">${l}</td>
              <td style="padding:6px 10px;border:1px solid #CBD5E1;font-size:11px;color:#0F172A">${v}</td>
            </tr>`).join('')}
          </table>
        </td>
        <td style="width:50%;vertical-align:top;padding-left:10px">
          <table>
            ${[['Daily Customer Demand', project.demand ? project.demand + ' units/day' : '—'], ['Working Hours / Shift', project.working_hours ? project.working_hours + ' hr' : '—'], ['Shifts per Day', project.shifts || '—'], ['Available Time / Day', project.available_time_sec ? fmtS(project.available_time_sec) : '—'], ['Takt Time', project.takt_time ? fmtS(project.takt_time) : '—'], ['Project State', project.state === 'future' ? 'Future State' : 'Current State']].map(([l, v], i) => `
            <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}">
              <td style="padding:6px 10px;border:1px solid #CBD5E1;font-size:11px;color:#64748B;font-weight:600;width:150px">${l}</td>
              <td style="padding:6px 10px;border:1px solid #CBD5E1;font-size:11px;color:#0F172A;font-weight:600">${v}</td>
            </tr>`).join('')}
          </table>
        </td>
      </tr>
    </table>
  </div>

  <!-- ══ 12. DOCUMENT SIGN-OFF ══════════════════════════════════════════ -->
  <div class="section">
    <div class="section-title">12. Document Control Sign-Off Block</div>
    <table>
      <thead>
        <tr>
          <th style="width:25%;text-align:center">Role</th>
          <th style="width:25%;text-align:center">Printed Name</th>
          <th style="width:25%;text-align:center">Signature</th>
          <th style="width:25%;text-align:center">Date</th>
        </tr>
      </thead>
      <tbody>
        ${['Prepared by (VSM Analyst)', 'Reviewed by (Process Engineer)', 'Quality Manager', 'Plant / Operations Manager', 'Approved by (Site Director)'].map((role, i) => `
        <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}">
          <td style="padding:16px 12px;border:1px solid #CBD5E1;font-size:11px;color:#374151;font-weight:600">${role}</td>
          <td style="padding:16px 12px;border:1px solid #CBD5E1"></td>
          <td style="padding:16px 12px;border:1px solid #CBD5E1"></td>
          <td style="padding:16px 12px;border:1px solid #CBD5E1"></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- ══ FOOTER ══════════════════════════════════════════════════════════ -->
  <div style="border-top:2px solid #1E3A5F;padding-top:10px;display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:9px;color:#94A3B8;font-family:${MONO}">VeSiMy AI Operations Intelligence Platform · vesimy.com</div>
    <div style="font-size:9px;color:#94A3B8;font-family:${MONO}">${docRef} · Rev A · ${now} · ISO 9001:2015 / ISO 13053</div>
    <div style="font-size:9px;color:#94A3B8;font-family:${MONO}">${isGold ? 'Gold Standard · ' : ''}CONFIDENTIAL — INTERNAL USE ONLY</div>
  </div>

</div>
</body>
</html>`
}

// ── Export button component ────────────────────────────────────────────────────
export function PDFExportButton({ project, steps, isGold = false }: Props) {
  const [state, setState] = useState<'idle' | 'generating' | 'done'>('idle')

  async function handleExport() {
    if (state !== 'idle') return
    if (!steps.length) { toast.error('Add some steps before exporting'); return }

    setState('generating')
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      const container = document.createElement('div')
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;z-index:-1;background:#FFFFFF'
      container.innerHTML = buildISOReport(project, steps, isGold)
      document.body.appendChild(container)

      const canvas = await html2canvas(container, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
        logging: false,
        width: 794,
      })
      document.body.removeChild(container)

      const pdf    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW   = pdf.internal.pageSize.getWidth()
      const pdfH_  = pdf.internal.pageSize.getHeight()
      const imgTot = (canvas.height * pdfW) / canvas.width
      const imgData = canvas.toDataURL('image/png', 0.97)

      let y = 0
      while (y < imgTot) {
        if (y > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, -y, pdfW, imgTot)
        y += pdfH_
      }

      pdf.save(`VeSiMy_ISO_Report_${project.name.replace(/[/\\?%*:|"<>]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`)
      setState('done')
      setTimeout(() => setState('idle'), 3000)
      toast.success('ISO Report exported — white paper, 12 sections')
    } catch (err) {
      console.error(err)
      toast.error('Export failed. Try again.')
      setState('idle')
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={state === 'generating'}
      className="btn btn-secondary"
      style={{ gap: 6, opacity: state === 'generating' ? 0.7 : 1, transition: 'all 0.2s' }}
    >
      {state === 'generating' && <RefreshIcon size={14} style={{ animation: 'spin 1s linear infinite' }} />}
      {state === 'done'       && <CheckIcon   size={14} color="#1DD1A1" />}
      {state === 'idle'       && <DownloadIcon size={14} />}
      {state === 'generating' ? 'Generating ISO Report…' : state === 'done' ? 'Exported!' : 'Export ISO Report'}
    </button>
  )
}
