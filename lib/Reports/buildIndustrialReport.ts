// @ts-nocheck
import { calcProcessMetrics } from '@/lib/v2/process-metrics'
import { fmtSeconds } from '@/lib/v2/cycle-time-utils'

export function buildIndustrialReportData(project: any, steps: any[], branches: any[]) {
  const { mainSteps, totalCT, totalWait, leadTime, vaCT, pce, takt, bottleneck, totalWIP } =
    calcProcessMetrics(steps, project)

  const rootCause =
    mainSteps
      .map(s => s.toolData?.fivewhy?.rootCause)
      .filter(Boolean)
      .join('; ') || ''

  const waste =
    mainSteps
      .map(s => s.toolData?.waste?.selected?.join(', '))
      .filter(Boolean)
      .join('; ') || ''

  const improvements =
    mainSteps
      .flatMap(s => s.toolData?.kaizen?.items || [])
      .map(i => i.title || i.text || i.description)
      .filter(Boolean)
      .join('; ') || ''

  return {
    metrics: { leadTime, valueAdded: vaCT, mainCT: totalCT, takt: takt ?? 0, pce: pce ?? 0, totalWIP },
    rootCause,
    waste,
    improvements,
  }
}
