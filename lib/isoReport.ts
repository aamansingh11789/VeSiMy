// lib/isoReport.ts
// ─── ISO-Grade White Paper Report Generator ─────────────────────────────────
// All VeSiMy tools use this to produce print-ready, ISO-referenced reports
// with clean white backgrounds, document control blocks, and proper structure.

export interface ISODocMeta {
  title: string
  subtitle?: string
  toolType: 'VSM' | 'KAIZEN' | 'FIVEWHY' | 'FISHBONE' | 'KANBAN' | 'TIMESTUDY' | 'SMED' | 'GEMBA' | 'WASTE' | 'IMPROVEMENT'
  projectName: string
  stepName?: string
  industry?: string
  docId?: string
  revision?: string
  preparedBy?: string
  approvedBy?: string
  date?: string
}

export function getISOStandards(toolType: ISODocMeta['toolType']): string[] {
  const standards: Record<ISODocMeta['toolType'], string[]> = {
    VSM:         ['ISO 9001:2015 §4.4 (Process Management)', 'ISO 22468:2020 (Value Stream Management)', 'ISO 9000:2015 §3.4.5 (Process Flow)'],
    KAIZEN:      ['ISO 9001:2015 §10.3 (Continual Improvement)', 'ISO 9001:2015 §8.5.1 (Controlled Conditions)', 'ISO 45001:2018 §10.2 (Incident & Improvement)'],
    FIVEWHY:     ['ISO 9001:2015 §10.2.1 (Nonconformity & Corrective Action)', 'ISO 31000:2018 §6.4 (Risk Assessment)', 'ISO 9001:2015 §6.1 (Actions to Address Risks)'],
    FISHBONE:    ['ISO 9001:2015 §10.2.1 (Root Cause Analysis)', 'ISO/TR 14639-2 (Cause & Effect Analysis)', 'ISO 9004:2018 §9.1 (Performance Analysis)'],
    KANBAN:      ['ISO 9001:2015 §8.5.1 (Production Control)', 'ISO 22468:2020 §5.3 (Pull Systems)', 'ISO 9001:2015 §7.1.3 (Infrastructure)'],
    TIMESTUDY:   ['ISO 9001:2015 §8.5 (Production & Service Provision)', 'ISO 22468:2020 §5.2.4 (Cycle Time Analysis)', 'ILO Time Study Standards §3 (Work Measurement)'],
    SMED:        ['ISO 9001:2015 §8.5.1 (Changeover Management)', 'SMED Methodology (Shingo Prize Standards)', 'ISO 22468:2020 §5.2.5 (Setup Reduction)'],
    GEMBA:       ['ISO 9001:2015 §9.1 (Monitoring & Measurement)', 'ISO 45001:2018 §9.1.1 (Workplace Observation)', 'ISO 14001:2015 §9.1 (Environmental Monitoring)'],
    WASTE:       ['ISO 9001:2015 §10.1 (Improvement — Muda Elimination)', 'ISO 22468:2020 §5.4 (Waste Identification)', 'ISO 14001:2015 §6.1 (Waste Risk Planning)'],
    IMPROVEMENT: ['ISO 9001:2015 §10.3 (Continual Improvement)', 'ISO 9001:2015 §6.2 (Quality Objectives)', 'ISO 9004:2018 §9.3 (Improvement Actions)'],
  }
  return standards[toolType] || []
}

export function generateDocId(toolType: ISODocMeta['toolType'], seed?: string): string {
  const prefix: Record<ISODocMeta['toolType'], string> = {
    VSM: 'VSM', KAIZEN: 'KZN', FIVEWHY: '5WY', FISHBONE: 'FSH',
    KANBAN: 'KBN', TIMESTUDY: 'TST', SMED: 'SMD', GEMBA: 'GMB',
    WASTE: 'WST', IMPROVEMENT: 'IMP',
  }
  const ts = seed || Date.now().toString(36).toUpperCase().slice(-4)
  return `${prefix[toolType]}-${ts}-001`
}

export const ISO_STYLES = `
  @page { size: A4 portrait; margin: 18mm 16mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    color: #111;
    background: #fff;
    line-height: 1.5;
  }
  .doc { max-width: 210mm; margin: 0 auto; padding: 12mm 14mm; background: #fff; }

  /* ── Header / Title Block ── */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-top: 3px solid #111;
    border-bottom: 2px solid #111;
    padding: 10pt 0 10pt;
    margin-bottom: 16pt;
    gap: 20pt;
  }
  .doc-title-block h1 {
    font-size: 16pt;
    font-weight: 700;
    letter-spacing: -0.3pt;
    margin-bottom: 3pt;
  }
  .doc-title-block .doc-subtitle {
    font-size: 10pt;
    color: #444;
  }
  .doc-control-table {
    border-collapse: collapse;
    font-size: 9pt;
    min-width: 200pt;
  }
  .doc-control-table td {
    border: 0.75pt solid #bbb;
    padding: 4pt 7pt;
    vertical-align: top;
  }
  .doc-control-table td:first-child {
    background: #f5f5f5;
    font-weight: 700;
    white-space: nowrap;
  }

  /* ── ISO Badge ── */
  .iso-standards-bar {
    background: #f9f9f9;
    border: 0.75pt solid #ddd;
    border-left: 3pt solid #8B6A00;
    padding: 7pt 10pt;
    font-size: 8.5pt;
    color: #333;
    margin-bottom: 14pt;
    line-height: 1.7;
  }
  .iso-standards-bar strong { font-weight: 700; display: block; margin-bottom: 2pt; }

  /* ── KPI Summary ── */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100pt, 1fr));
    gap: 8pt;
    margin-bottom: 16pt;
  }
  .kpi-card {
    border: 0.75pt solid #ccc;
    padding: 8pt 10pt;
    background: #fff;
  }
  .kpi-label {
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    color: #666;
    margin-bottom: 3pt;
    font-family: Arial, Helvetica, sans-serif;
  }
  .kpi-value {
    font-size: 17pt;
    font-weight: 700;
    color: #8B6A00;
    line-height: 1;
  }
  .kpi-sub { font-size: 8pt; color: #888; margin-top: 2pt; }

  /* ── Section Headers ── */
  h2 {
    font-size: 12pt;
    font-weight: 700;
    margin: 16pt 0 6pt;
    padding-bottom: 3pt;
    border-bottom: 1pt solid #ccc;
    font-family: Arial, Helvetica, sans-serif;
  }
  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    margin: 10pt 0 4pt;
    color: #333;
    font-family: Arial, Helvetica, sans-serif;
  }
  p { margin-bottom: 6pt; font-size: 10.5pt; }

  /* ── Tables ── */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
    margin-bottom: 12pt;
  }
  table.data-table th {
    background: #f0f0f0;
    border: 0.75pt solid #bbb;
    padding: 5pt 7pt;
    font-weight: 700;
    text-align: left;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.5pt;
  }
  table.data-table td {
    border: 0.75pt solid #ddd;
    padding: 5pt 7pt;
    vertical-align: top;
  }
  table.data-table tr:nth-child(even) td { background: #fafafa; }
  table.data-table .badge {
    display: inline-block;
    padding: 1pt 5pt;
    border-radius: 2pt;
    font-size: 8pt;
    font-weight: 700;
    font-family: Arial, sans-serif;
  }
  .badge-high { background: #ffe0e0; color: #c00; border: 0.5pt solid #f99; }
  .badge-medium { background: #fff4e0; color: #a06000; border: 0.5pt solid #ffc; }
  .badge-low { background: #e0ffe0; color: #080; border: 0.5pt solid #9c9; }
  .badge-open { background: #e8e8f0; color: #444; border: 0.5pt solid #bbb; }
  .badge-complete { background: #e0f5ef; color: #0a5; border: 0.5pt solid #9d9; }
  .badge-critical { background: #fce0e0; color: #900; border: 0.5pt solid #f88; font-size: 7.5pt; }

  /* ── Observation Boxes ── */
  .obs-box {
    border: 0.75pt solid #ddd;
    border-left: 3pt solid #ccc;
    padding: 8pt 10pt;
    margin-bottom: 8pt;
    font-size: 9.5pt;
    background: #fefefe;
  }
  .obs-box.finding { border-left-color: #D4A208; }
  .obs-box.waste   { border-left-color: #cc3300; }
  .obs-box.ok      { border-left-color: #0a5; }
  .obs-label { font-weight: 700; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5pt; margin-bottom: 3pt; color: #444; font-family: Arial, sans-serif; }

  /* ── Signature Block ── */
  .sign-block {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12pt;
    margin-top: 24pt;
  }
  .sign-row {
    border-top: 0.75pt solid #999;
    padding-top: 4pt;
    font-size: 8.5pt;
    color: #444;
    text-align: center;
  }

  /* ── Footer ── */
  .doc-footer {
    margin-top: 24pt;
    padding-top: 8pt;
    border-top: 1pt solid #ccc;
    font-size: 8pt;
    color: #777;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
  }

  /* ── Print Button ── */
  .print-btn {
    position: fixed;
    top: 14pt;
    right: 14pt;
    background: #111;
    color: #fff;
    border: none;
    padding: 8pt 14pt;
    font-size: 10pt;
    cursor: pointer;
    font-family: Arial, sans-serif;
    border-radius: 3pt;
    z-index: 9999;
  }
  .print-btn:hover { background: #333; }
`

export function buildDocHeader(meta: ISODocMeta): string {
  const today = meta.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const docId = meta.docId || generateDocId(meta.toolType)
  const standards = getISOStandards(meta.toolType)

  return `
  <button class="print-btn no-print" onclick="window.print()">🖨 Print / Save PDF</button>

  <div class="doc-header">
    <div class="doc-title-block">
      <div style="font-size:8pt;font-family:Arial,sans-serif;color:#888;margin-bottom:4pt;letter-spacing:1pt;text-transform:uppercase;">
        VeSiMy Process Intelligence Platform
      </div>
      <h1>${meta.title}</h1>
      <div class="doc-subtitle">
        ${meta.projectName}${meta.stepName ? ' · ' + meta.stepName : ''}
        ${meta.industry ? ' · ' + meta.industry : ''}
      </div>
    </div>
    <table class="doc-control-table">
      <tr><td>Document ID</td><td>${docId}</td></tr>
      <tr><td>Revision</td><td>${meta.revision || 'Rev. A'}</td></tr>
      <tr><td>Date</td><td>${today}</td></tr>
      <tr><td>Prepared By</td><td>${meta.preparedBy || 'VeSiMy'}</td></tr>
      <tr><td>Approved By</td><td>${meta.approvedBy || '_______________'}</td></tr>
      <tr><td>Classification</td><td>Internal — Controlled Document</td></tr>
    </table>
  </div>

  <div class="iso-standards-bar">
    <strong>Applicable Standards Reference</strong>
    ${standards.map(s => `<span style="margin-right:14pt;">▸ ${s}</span>`).join('')}
  </div>
  `
}

export function buildDocFooter(meta: ISODocMeta): string {
  const today = meta.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const docId = meta.docId || generateDocId(meta.toolType)
  return `
  <div class="sign-block">
    <div class="sign-row">Prepared By / Date</div>
    <div class="sign-row">Reviewed By / Date</div>
    <div class="sign-row">Approved By / Date</div>
  </div>
  <div class="doc-footer">
    <strong>Document Control Notice:</strong> This document was generated by the VeSiMy Process Intelligence Platform
    and is intended for internal use. It follows the structure and terminology of ISO 9001:2015 and related standards
    as applicable to the tool type. This document does not constitute or certify organizational conformance to any
    ISO standard. Document ID: ${docId} · Generated: ${today} · vesimy.com
  </div>
  `
}

export function openISOReport(htmlBody: string, meta: ISODocMeta): void {
  const w = window.open('', '_blank')
  if (!w) return
  const today = meta.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  w.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${meta.title} — ${meta.projectName} — ${today}</title>
  <style>${ISO_STYLES}</style>
</head>
<body>
  <div class="doc">
    ${buildDocHeader(meta)}
    ${htmlBody}
    ${buildDocFooter(meta)}
  </div>
</body>
</html>`)
  w.document.close()
}
