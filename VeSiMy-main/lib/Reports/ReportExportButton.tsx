// @ts-nocheck
'use client'

import { createRoot } from 'react-dom/client'
import IndustrialReport from './IndustrialReport'
import { buildIndustrialReportData } from '@/lib/reports/buildIndustrialReport'

export default function ReportExportButton({ project, steps, branches, vsmHtml = '' }: any) {
  const handleExport = () => {
    const w = window.open('', '_blank')
    if (!w) return

    const reportData = buildIndustrialReportData(project, steps, branches)

    w.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Process Analysis Report — ${project?.name || 'Vesimy'}</title>
          <meta charset="utf-8" />
          <style>
            body { margin: 0; background: #fff; }
          </style>
        </head>
        <body>
          <div id="report-root"></div>
        </body>
      </html>
    `)
    w.document.close()

    const mount = w.document.getElementById('report-root')
    if (!mount) return

    const root = createRoot(mount)
    root.render(
      <IndustrialReport
        project={project}
        metrics={reportData.metrics}
        rootCause={reportData.rootCause}
        waste={reportData.waste}
        improvements={reportData.improvements}
        vsmHtml={vsmHtml}
      />
    )

    setTimeout(() => w.print(), 700)
  }

  return (
    <button className="btn btn-primary" onClick={handleExport} type="button">
      Export Industrial Report
    </button>
  )
}