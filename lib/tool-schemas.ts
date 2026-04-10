// @ts-nocheck
// ── lib/tool-schemas.ts ───────────────────────────────────────────────────────
// Single source of truth for every tool's data shape.
// Import these types in BOTH the tool component AND any reader (PDF, Supe, report).
// Compiler enforces key consistency — no silent mismatches.

export interface StopwatchData {
  laps:     { t: number }[]   // millisecond readings
  excluded: number[]           // indices of excluded laps
  baseline: number | null      // baseline in ms
  mean:     number             // effective mean in ms
  min:      number
  max:      number
  notes?:   string
  savedAt:  number
}

export interface IshikawaData {
  problem:   string
  framework: string
  causes:    Record<string, string[]>   // category -> causes array
  savedAt:   number
}

export interface FiveWhyData {
  problem:   string
  whys:      string[]          // array of 5 answers
  rootCause: string
  action:    string
  owner:     string
  dueDate:   string
  savedAt:   number
}

export interface WasteData {
  selected: string[]           // IDs: transportation, inventory, motion…
  notes:    string
  savedAt:  number
}

export interface KaizenData {
  items: KaizenItem[]
  savedAt: number
}

export interface KaizenItem {
  id:          string
  kzId:        string
  title:       string
  description: string
  category:    string
  priority:    'low' | 'medium' | 'high' | 'critical'
  status:      'open' | 'in-progress' | 'complete' | 'verified'
  owner:       string
  dueDate:     string
  actions:     string[]
  created:     number
}

export interface ImprovementData {
  goals:   ImprovementGoal[]
  savedAt: number
}

export interface ImprovementGoal {
  id:       string
  metric:   string
  baseline: number | string
  target:   number | string
  unit:     string
  by:       string
  notes:    string
}

export interface SMEDData {
  machine:          string
  product:          string
  currentTime:      number    // minutes
  targetTime:       number    // minutes
  hoursPerDay:      number
  changesPerDay:    number
  workingDays:      number
  laborCost:        number
  steps:            SMEDStep[]
  totalTime:        number
  internalTime:     number
  externalTime:     number
  wasteTime:        number
  smedPotential:    number
  annualDollarSaving: number
  savedAt:          number
}

export interface SMEDStep {
  id:          string
  description: string
  time:        number
  type:        'internal' | 'external' | 'waste'
}

// Tool data map — use this to type toolData[tool]
export interface ToolDataMap {
  stopwatch:   StopwatchData
  ishikawa:    IshikawaData
  fivewhy:     FiveWhyData
  waste:       WasteData
  kaizen:      KaizenData
  improvement: ImprovementData
  smed:        SMEDData
}

export type ToolId = keyof ToolDataMap
