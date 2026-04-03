// @ts-nocheck
// ── components/v2/index.ts ────────────────────────────────────────────────────
// Barrel export — import V2 components from '@/components/v2' not individual files.

export { V2ProjectClient }  from './V2ProjectClient'
export { V2MapCanvas }      from './V2MapCanvas'
export { V2StepPanel }      from './V2StepPanel'
export { V2AnalysisReport } from './V2AnalysisReport'
export { V2FutureStatePanel } from './V2FutureStatePanel'
export { V2Journal }        from './V2Journal'

// Constants — re-exported so consumers don't need deep imports
export {
  BRAND, NAVY, RED, GREEN, AMBER, SERIF, MONO,
  CI_LABELS, CI_TOOLS, STEP_TYPES, VA_OPTIONS, CT_UNITS,
  MAP_BOX_W, MAP_BOX_H, MAP_GAP,
} from './v2-constants'
