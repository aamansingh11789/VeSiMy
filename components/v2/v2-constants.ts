// TypeScript enabled
// ── components/v2/v2-constants.ts ─────────────────────────────────────────────
// v4.0, Added OODA, 8D, and DMAIC to CI tools

export const BRAND  = '#C9A66B'
export const NAVY   = '#2A1800'
export const RED    = '#C0402A'
export const GREEN  = '#2E844A'
export const AMBER  = '#F4A623'
export const SERIF  = 'Palatino Linotype,Book Antiqua,Palatino,serif'
export const MONO   = 'IBM Plex Mono,monospace'

export const CI_LABELS: Record<string, string> = {
  stopwatch:   'Time Study',
  ishikawa:    'Fishbone Diagram',
  fivewhy:     '5 Why Analysis',
  waste:       'Waste Identification',
  kaizen:      'Kaizen Event',
  improvement: 'Improvement Goal',
  smed:        'SMED (Changeover)',
  pdca:        'PDCA Cycle',
  yamazumi:    'Yamazumi Chart',
  // v4.0 new tools
  ooda:        'OODA Loop',
  eightd:      '8D Report',
  dmaic:       'DMAIC',
}

export const CI_TOOLS = [
  { id: 'stopwatch',   label: 'Time Study',           icon: '⏱',  desc: 'Measure actual cycle time with stopwatch' },
  { id: 'ishikawa',    label: 'Fishbone Diagram',      icon: '🐟', desc: 'Map causes across all categories' },
  { id: 'fivewhy',     label: '5 Why Analysis',        icon: '❓', desc: 'Drill to system root cause' },
  { id: 'waste',       label: 'Waste Identification',  icon: '♻️', desc: 'Identify the 8 wastes on this step' },
  { id: 'kaizen',      label: 'Kaizen Event',           icon: '⚡', desc: 'Log and track an improvement event' },
  { id: 'improvement', label: 'Improvement Goal',       icon: '🎯', desc: 'Set baseline and target for a metric' },
  { id: 'smed',        label: 'SMED (Changeover)',      icon: '🔄', desc: 'Reduce setup / changeover time' },
  // v4.0 new tools
  { id: 'ooda',        label: 'OODA Loop',              icon: '🔁', desc: 'Fast operational decisions, Observe Orient Decide Act' },
  { id: 'eightd',      label: '8D Report',              icon: '📋', desc: 'Team-based structured response to quality escapes' },
  { id: 'dmaic',       label: 'DMAIC',                  icon: '📊', desc: 'Six Sigma data-driven problem solving, 5 phases' },
]

export const STEP_TYPES = [
  { id: 'process',    label: 'Process Operation',    iso: 'ISO 22468 §5.2' },
  { id: 'decision',   label: 'Decision / Check',     iso: 'ISO 22468 §5.3' },
  { id: 'delay',      label: 'Delay / Wait',         iso: 'ASME Y14.3'    },
  { id: 'inspection', label: 'Inspection / QC',      iso: 'ISO 9001 §8.6' },
  { id: 'transport',  label: 'Transport / Move',     iso: 'ISO 22468 §5.4' },
  { id: 'storage',    label: 'Storage / Inventory',  iso: 'ISO 22468 §5.4' },
  { id: 'rework',     label: 'Rework / Correction',  iso: 'ISO 9001 §8.7' },
  { id: 'start_end',  label: 'Start / End',          iso: 'BPMN 2.0'      },
]

export const VA_OPTIONS = [
  { id: 'va',           label: 'Value-Add',               color: GREEN, desc: 'Customer pays for this, transforms the product/service' },
  { id: 'nnva',         label: 'Necessary Non-Value-Add',  color: AMBER, desc: 'Required but adds no customer value, minimise' },
  { id: 'nva',          label: 'Non-Value-Add (Waste)',    color: RED,   desc: 'Pure waste, target for elimination' },
  { id: 'unclassified', label: 'Not yet classified',       color: '#aaa', desc: '' },
]

export const CT_UNITS = ['seconds', 'minutes', 'hours', 'days', 'weeks']

export const MAP_BOX_W  = 110
export const MAP_BOX_H  = 48
export const MAP_GAP    = 80
