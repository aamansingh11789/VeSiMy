// @ts-nocheck

export function buildIndustrialReportData(project: any, steps: any[], branches: any[]) {
  const mainSteps = (steps || []).filter((s) => s.is_main_flow !== false)
  const mainCT = mainSteps.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || Number(s.cycle_time) || 0), 0)
  const mainWait = mainSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
  const totalWIP = (steps || []).reduce((a, s) => a + (Number(s.wip) || 0), 0)

  const availSec = project?.available_time_sec
    ? Number(project.available_time_sec)
    : project?.working_hours
      ? Number(project.working_hours) * 3600
      : 0

  const takt = project?.takt_time
    ? Number(project.takt_time)
    : project?.demand && availSec
      ? availSec / Number(project.demand)
      : 0

  const leadTime = mainCT + mainWait
  const valueAdded = mainCT
  const pce = leadTime > 0 ? (valueAdded / leadTime) * 100 : 0

  const rootCause =
    mainSteps
      .map((s) => s.toolData?.fivewhy?.rootCause)
      .filter(Boolean)
      .join('; ') || ''

  const waste =
    mainSteps
      .map((s) => s.toolData?.waste?.selected?.join(', '))
      .filter(Boolean)
      .join('; ') || ''

  const improvements =
    mainSteps
      .flatMap((s) => s.toolData?.kaizen?.items || [])
      .map((i) => i.title || i.text || i.description)
      .filter(Boolean)
      .join('; ') || ''

  return {
    metrics: {
      leadTime,
      valueAdded,
      mainCT,
      takt,
      pce,
      totalWIP,
    },
    rootCause,
    waste,
    improvements,
  }
}