// @ts-nocheck
'use client'
// ── components/export/PDFExport.tsx ──────────────────────────────────────────
// One-click branded PDF export for VSM maps and Kaizen boards

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import type { Project, Step } from '@/lib/store'
import { CheckIcon, DownloadIcon, RefreshIcon } from '@/components/ui/Icons'


interface Props {
  project: Project
  steps:   Step[]
  isGold?: boolean
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'
const GOLD  = '#D4A208'
const BG    = '#03030D'
const DARK  = '#0D0D22'
const TEXT  = '#EAE8F4'
const MUTED = '#7070A0'

// ── Build the PDF content as a hidden HTML div, then capture with html2canvas ─
function buildPrintHtml(project: Project, steps: Step[], isGold = false): string {
  const totalCT   = steps.reduce((a,s) => a+(s.cycle_time||0), 0)
  const totalWT   = steps.reduce((a,s) => a+(s.wait_time||0), 0)
  const totalLT   = totalCT + totalWT
  const efficiency = totalLT > 0 ? Math.round((totalCT/totalLT)*100) : 0
  const stepRows  = steps.map((s,i) => `
    <tr style="border-bottom:1px solid #1a1a3c">
      <td style="padding:10px 12px;color:#9090c0;font-size:11px;font-family:monospace">${(i+1).toString().padStart(2,'0')}</td>
      <td style="padding:10px 12px;color:#eae8f4;font-weight:600;font-size:13px">${s.name}</td>
      <td style="padding:10px 12px;color:#d4a208;font-size:13px;text-align:right">${s.cycle_time||0}s</td>
      <td style="padding:10px 12px;color:#6cb9fc;font-size:13px;text-align:right">${s.wait_time||0}s</td>
      <td style="padding:10px 12px;text-align:center">
        <span style="font-size:11px;padding:2px 8px;border-radius:100px;font-weight:700;${
          (s.cycle_time||0) > (totalCT/steps.length)*1.3
            ? 'background:rgba(255,107,107,0.15);color:#ff6b6b;border:1px solid rgba(255,107,107,0.3)'
            : 'background:rgba(29,209,161,0.12);color:#1dd1a1;border:1px solid rgba(29,209,161,0.25)'
        }">${(s.cycle_time||0)>(totalCT/steps.length)*1.3?'⚠ High':'✓ OK'}</span>
      </td>
    </tr>`).join('')

  const now = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})

  return `
  <div style="background:#03030D;color:#eae8f4;font-family:Inter,system-ui,sans-serif;padding:0;margin:0;width:794px">

    <!-- Header band -->
    <div style="background:linear-gradient(135deg,#0a0a1a,#120e20);padding:32px 40px 28px;border-bottom:2px solid ${GOLD}22;position:relative;overflow:hidden">
      <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(212,162,8,0.08),transparent 70%)"></div>

      <!-- V S M wordmark -->
      <div style="display:flex;align-items:baseline;gap:0;margin-bottom:20px">
        ${[['V','#D4A208'],['e','#1a1a3c'],['S','#8C44CC'],['i','#1a1a3c'],['M','#6CB9FC'],['y','#1a1a3c']].map(([c,col]) =>
          `<span style="font-family:${serif};font-weight:700;font-size:${['V','S','M'].includes(c)?'36px':'24px'};color:${col};line-height:1">${c}</span>`
        ).join('')}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24">
        <div>
          <div style="font-size:9px;color:#D4A208;letter-spacing:2px;font-family:monospace;margin-bottom:6px">VALUE STREAM MAP — PROCESS REPORT</div>
          <h1 style="font-family:${serif};font-size:22px;font-weight:700;color:#eae8f4;margin:0 0 4px">${project.name}</h1>
          <div style="font-size:12px;color:#7070a0">${project.industry||''} ${project.customer?'· '+project.customer:''}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:10px;color:#38385c;letter-spacing:1px;margin-bottom:4px">GENERATED</div>
          <div style="font-size:12px;color:#7070a0">${now}</div>
          <div style="font-size:10px;color:#28285c;margin-top:4px;font-family:monospace">vesimy.com</div>
          ${isGold ? `<div style="margin-top:10px;display:inline-flex;align-items:center;gap:5px;background:rgba(212,162,8,0.1);border:1px solid rgba(212,162,8,0.35);border-radius:100px;padding:3px 10px">
            <span style="font-size:10px">👑</span>
            <span style="font-size:9px;color:#D4A208;font-weight:700;letter-spacing:1.5px;font-family:monospace">GOLD STANDARD</span>
          </div>` : ''}
        </div>
      </div>
    </div>

    <!-- KPI strip -->
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0;border-bottom:1px solid #1a1a3c">
      ${[
        ['STEPS',         steps.length,      '#D4A208'],
        ['TOTAL CYCLE',   totalCT+'s',        '#8C44CC'],
        ['TOTAL WAIT',    totalWT+'s',        '#6CB9FC'],
        ['LEAD TIME',     totalLT+'s',        '#F4A623'],
        ['EFFICIENCY',    efficiency+'%',     '#1DD1A1'],
      ].map(([label,value,color]) => `
        <div style="padding:18px 16px;border-right:1px solid #1a1a3c;background:#080818">
          <div style="font-size:9px;color:#38385c;letter-spacing:1.5px;font-family:monospace;margin-bottom:6px">${label}</div>
          <div style="font-family:${serif};font-size:24px;font-weight:700;color:${color};line-height:1">${value}</div>
        </div>`
      ).join('')}
    </div>

    <!-- VSM flow diagram (simplified visual) -->
    <div style="padding:24px 40px;background:#060612;border-bottom:1px solid #1a1a3c">
      <div style="font-size:9px;color:#D4A208;letter-spacing:2px;font-family:monospace;margin-bottom:14px">VALUE STREAM FLOW</div>
      <div style="display:flex;align-items:center;gap:0;overflow:hidden;flex-wrap:nowrap">
        ${steps.slice(0,8).map((s,i) => {
          const isBottleneck = (s.cycle_time||0) > (totalCT/steps.length)*1.3
          return `
          <div style="display:flex;align-items:center;flex-shrink:0">
            <div style="background:${isBottleneck?'rgba(255,107,107,0.08)':'rgba(212,162,8,0.06)'};border:1px solid ${isBottleneck?'rgba(255,107,107,0.3)':'rgba(212,162,8,0.2)'};border-radius:8px;padding:8px 10px;text-align:center;min-width:70px;max-width:90px">
              <div style="font-size:9px;color:#9090c0;font-family:monospace;margin-bottom:3px">${(i+1).toString().padStart(2,'0')}</div>
              <div style="font-size:10px;color:#eae8f4;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:80px">${s.name.length>10?s.name.slice(0,9)+'…':s.name}</div>
              <div style="font-size:9px;color:${isBottleneck?'#ff6b6b':'#D4A208'};margin-top:2px">${s.cycle_time||0}s</div>
            </div>
            ${i < steps.slice(0,8).length-1 ? `
            <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;margin:0 2px">
              <div style="font-size:9px;color:#38385c;margin-bottom:1px">${s.wait_time||0}s</div>
              <div style="color:#28285c;font-size:16px">→</div>
            </div>` : ''}
          </div>`
        }).join('')}
        ${steps.length > 8 ? `<div style="font-size:11px;color:#38385c;margin-left:8px;white-space:nowrap">+${steps.length-8} more</div>` : ''}
      </div>
    </div>

    <!-- Steps table -->
    <div style="padding:24px 40px">
      <div style="font-size:9px;color:#D4A208;letter-spacing:2px;font-family:monospace;margin-bottom:14px">PROCESS STEP DETAIL</div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:2px solid #1a1a3c">
            <th style="padding:8px 12px;text-align:left;font-size:9px;color:#38385c;letter-spacing:1.5px;font-family:monospace;font-weight:600">#</th>
            <th style="padding:8px 12px;text-align:left;font-size:9px;color:#38385c;letter-spacing:1.5px;font-family:monospace;font-weight:600">STEP NAME</th>
            <th style="padding:8px 12px;text-align:right;font-size:9px;color:#38385c;letter-spacing:1.5px;font-family:monospace;font-weight:600">CYCLE TIME</th>
            <th style="padding:8px 12px;text-align:right;font-size:9px;color:#38385c;letter-spacing:1.5px;font-family:monospace;font-weight:600">WAIT TIME</th>
            <th style="padding:8px 12px;text-align:center;font-size:9px;color:#38385c;letter-spacing:1.5px;font-family:monospace;font-weight:600">STATUS</th>
          </tr>
        </thead>
        <tbody>${stepRows}</tbody>
      </table>
    </div>

    <!-- Insights bar -->
    <div style="padding:20px 40px 16px;background:#060612;border-top:1px solid #1a1a3c">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12">
        ${[
          { icon:'⚠', label:'Bottlenecks', value: steps.filter(s=>(s.cycle_time||0)>(totalCT/Math.max(steps.length,1))*1.3).length, color:'#FF6B6B' },
          { icon:'⏱', label:'Avg Cycle Time', value: steps.length>0?Math.round(totalCT/steps.length)+'s':'—', color:'#D4A208' },
          { icon:'📊', label:'Flow Efficiency', value: efficiency+'%', color:efficiency>=60?'#1DD1A1':efficiency>=40?'#F4A623':'#FF6B6B' },
        ].map(item => `
          <div style="background:#0a0a1a;border:1px solid #1a1a3c;border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:10">
            <span style="font-size:18px">${item.icon}</span>
            <div>
              <div style="font-size:9px;color:#38385c;letter-spacing:1px;font-family:monospace">${item.label}</div>
              <div style="font-family:${serif};font-size:18px;font-weight:700;color:${item.color}">${item.value}</div>
            </div>
          </div>`
        ).join('')}
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:14px 40px;border-top:1px solid #1a1a3c;display:flex;justify-content:space-between;align-items:center;background:#03030D">
      <div style="font-size:9px;color:#1a1a3c;letter-spacing:2px;font-family:monospace">© ${new Date().getFullYear()} VESIMY · VALUE · STREAM · MASTERY</div>
      <div style="font-size:9px;color:#1a1a3c;font-family:monospace">vesimy.com</div>
    </div>
  </div>`
}

// ── Main export button component ──────────────────────────────────────────────
export function PDFExportButton({ project, steps, isGold = false }: Props) {
  const [state, setState] = useState<'idle'|'generating'|'done'>('idle')

  async function handleExport() {
    if (state !== 'idle') return
    if (!steps.length) { toast.error('Add some steps before exporting'); return }

    setState('generating')
    try {
      // Dynamic import to avoid SSR issues
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      // Build hidden container
      const container = document.createElement('div')
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;z-index:-1'
      container.innerHTML = buildPrintHtml(project, steps, isGold)
      document.body.appendChild(container)

      // Capture
      const canvas = await html2canvas(container, {
        backgroundColor: '#03030D',
        scale: 2,
        useCORS: true,
        logging: false,
        width: 794,
      })
      document.body.removeChild(container)

      // Build PDF
      const pdf     = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })
      const pdfW    = pdf.internal.pageSize.getWidth()
      const pdfH    = (canvas.height * pdfW) / canvas.width
      const imgData = canvas.toDataURL('image/png', 0.95)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
      pdf.save(`VeSiMy — ${project.name.replace(/[/\\?%*:|"<>]/g,'_')}.pdf`)

      setState('done')
      setTimeout(() => setState('idle'), 3000)
      toast.success('PDF exported!')
    } catch (err) {
      console.error(err)
      toast.error('PDF export failed. Try again.')
      setState('idle')
    }
  }

  return (
    <button onClick={handleExport} disabled={state==='generating'}
      className="btn btn-secondary"
      style={{ gap:6, opacity: state==='generating'?0.7:1, transition:'all 0.2s' }}>
      {state === 'generating' && <RefreshIcon size={14} style={{ animation:'spin 1s linear infinite' }} />}
      {state === 'done'       && <CheckIcon size={14} color='#1DD1A1' />}
      {state === 'idle'       && <DownloadIcon size={14} />}
      {state === 'generating' ? 'Generating…' : state === 'done' ? 'Exported!' : 'Export PDF'}
    </button>
  )
}
